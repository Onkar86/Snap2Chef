import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ResultsDashboard from './components/ResultsDashboard';
import CookingMode from './components/CookingMode';
import Loading from './components/Loading';
import BadgeToast from './components/BadgeToast';
import SavedRecipes from './components/SavedRecipes';
import PantryManager from './components/PantryManager';
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
      };
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the image. Please try another one.');
      setView('home');
    } finally {
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
  }
  
  const handleReset = () => {
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
        return <Hero onImageUpload={handleImageUpload} error={error} savedRecipesCount={savedRecipes.length} onShowSaved={() => setView('saved')} />;
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
            onBack={handleBackToHome}
          />
        );
       case 'pantry':
        return (
          <PantryManager
            pantryItems={pantryItems}
            onAddItem={addItemToPantry}
            onRemoveItem={removeItemFromPantry}
            onBack={handleBackToHome}
          />
        );
      default:
        return <Hero onImageUpload={handleImageUpload} error={error} savedRecipesCount={savedRecipes.length} onShowSaved={() => setView('saved')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        progress={progress} 
        onLogoClick={handleReset}
        onNavigate={navigateTo}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      {newBadge && (
        <BadgeToast badge={newBadge} onDismiss={clearNewBadge} />
      )}
    </div>
  );
};

export default App;