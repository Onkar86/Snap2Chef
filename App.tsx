
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResultsDashboard from './components/ResultsDashboard';
import CookingMode from './components/CookingMode';
import Loading from './components/Loading';
import BadgeToast from './components/BadgeToast';
import SavedRecipes from './components/SavedRecipes';
import PantryManager from './components/PantryManager';
import Footer from './components/Footer';
import ChatbotSidebar from './components/ChatbotSidebar';
import { generateAnalysis } from './services/geminiService';
import type { AnalysisResult, Recipe, Language } from './types';
import { useGamification } from './hooks/useGamification';
import { useSavedRecipes } from './hooks/useSavedRecipes';
import { useTheme } from './hooks/useTheme';
import { usePantry } from './hooks/usePantry';
import { LANGUAGES } from './constants';

type View = 'home' | 'dashboard' | 'cooking' | 'saved' | 'pantry';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [language, setLanguage] = useState<Language>(LANGUAGES[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const { theme, toggleTheme } = useTheme();
  const { progress, addProgress, newBadge, clearNewBadge } = useGamification();
  const { savedRecipes, savedRecipeIds, addSavedRecipe, removeSavedRecipe } = useSavedRecipes();
  const { pantryItems, addItem: addItemToPantry, removeItem: removeItemFromPantry } = usePantry();

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setView('dashboard');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        if (!base64String) {
          throw new Error("Failed to read image file.");
        }
        
        const result = await generateAnalysis(base64String, file.type, language.code, pantryItems);
        setAnalysisResult(result);
        addProgress('recipeGenerated');
        setIsLoading(false);
      };
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.startsWith('API_KEY_MISSING')) {
        setError('Configuration Error: The application is not connected to the AI service. The API key is missing.');
      } else {
        setError('Failed to analyze the image. Please try another one.');
      }
      setView('home');
      setIsLoading(false);
    }
  }, [language, addProgress, pantryItems]);

  const handleStartCooking = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('cooking');
  };

  const handleBackToDashboard = () => {
    setSelectedRecipe(null);
    setView('dashboard');
  };

  const handleBackToHome = () => {
    setView('home');
    setAnalysisResult(null);
    setError(null);
  }
  
  const handleSaveToggle = (recipe: Recipe) => {
    if (savedRecipeIds.includes(recipe.id)) {
      removeSavedRecipe(recipe.id);
    } else {
      addSavedRecipe(recipe);
    }
  };
  
  const navigateTo = (targetView: View) => {
    setView(targetView);
  }

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }
    
    switch (view) {
      case 'home':
        return <Hero onImageUpload={handleImageUpload} error={error} />;
      case 'dashboard':
        return analysisResult ? (
          <ResultsDashboard 
            result={analysisResult} 
            onStartCooking={handleStartCooking}
            savedRecipeIds={savedRecipeIds}
            onSaveToggle={handleSaveToggle}
          />
        ) : (
          <Loading />
        );
      case 'cooking':
        return selectedRecipe ? (
          <CookingMode recipe={selectedRecipe} onBack={handleBackToDashboard} />
        ) : null;
      case 'saved':
        return (
          <SavedRecipes
            recipes={savedRecipes}
            onStartCooking={handleStartCooking}
            onRemove={removeSavedRecipe}
          />
        );
       case 'pantry':
        return (
          <PantryManager
            pantryItems={pantryItems}
            onAddItem={addItemToPantry}
            onRemoveItem={removeItemFromPantry}
          />
        );
      default:
        return <Hero onImageUpload={handleImageUpload} error={error} />;
    }
  };

  return (
    <div className="min-h-screen animated-gradient animate-gradient text-slate-800 dark:text-slate-200">
      <Navbar
        onNavigate={navigateTo}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        setLanguage={setLanguage}
      />
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-140px)]">
         <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
      </main>
      <Footer />
      <ChatbotSidebar />
      {newBadge && (
        <BadgeToast badge={newBadge} onDismiss={clearNewBadge} />
      )}
    </div>
  );
};

export default App;
