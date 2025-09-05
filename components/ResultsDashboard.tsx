import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { AnalysisResult, Recipe } from '../types';
import RecipeCard from './RecipeCard';
import { Utensils, Beaker, Apple, ShoppingBasket, Clipboard, Check } from 'lucide-react';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onStartCooking: (recipe: Recipe) => void;
  savedRecipeIds: string[];
  onSaveToggle: (recipe: Recipe) => void;
}

const InfoCard: React.FC<{icon: React.ReactNode, title: string, children: React.ReactNode, className?: string}> = ({ icon, title, children, className }) => (
    <motion.div 
        className={`bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg text-emerald-500">
                {icon}
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        </div>
        {children}
    </motion.div>
  );

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onStartCooking, savedRecipeIds, onSaveToggle }) => {
  const [copyStatus, setCopyStatus] = useState(false);
  const firstRecipe = result.recipes[0];

  const handleCopy = () => {
    if (!firstRecipe) return;
    const groceryText = firstRecipe.missingIngredients.join('\n');
    navigator.clipboard.writeText(groceryText).then(() => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 2000);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div 
        className="space-y-8 md:space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{result.dishName}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">{result.description}</p>
      </motion.div>

      <div>
        <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Utensils className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Recipe Suggestions</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.recipes.map((recipe, i) => (
            <RecipeCard 
                key={recipe.id} 
                recipe={recipe}
                onStartCooking={onStartCooking}
                onSaveToggle={onSaveToggle}
                isSaved={savedRecipeIds.includes(recipe.id)}
                delay={0.2 + i * 0.1}
            />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <InfoCard icon={<Beaker size={24}/>} title="Nutrition" className="lg:col-span-2">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Estimated values per {result.nutritionalInfo.servingSize}.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(result.nutritionalInfo).filter(([key]) => key !== 'servingSize').map(([key, value]) => (
                <div key={key} className="bg-emerald-50 dark:bg-emerald-900/40 p-4 rounded-xl text-center">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 capitalize">{key}</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{value}</p>
                </div>
              ))}
            </div>
        </InfoCard>

        <InfoCard icon={<ShoppingBasket size={24}/>} title="Smart Grocery List">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Missing ingredients for: <strong>{firstRecipe?.recipeName}</strong></p>
            {firstRecipe && firstRecipe.missingIngredients.length > 0 ? (
                <>
                    <ul className="space-y-2 mb-4">
                    {firstRecipe.missingIngredients.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                           <span className="text-emerald-500">&bull;</span> {item}
                        </li>
                    ))}
                    </ul>
                     <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 text-sm bg-slate-200 dark:bg-slate-700 px-3 py-2.5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium">
                        {copyStatus ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
                        {copyStatus ? 'Copied!' : 'Copy List'}
                    </button>
                </>
            ) : (
                <div className="text-center py-4">
                    <Check className="w-10 h-10 text-green-500 mx-auto" />
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">You have all the ingredients!</p>
                </div>
            )}
        </InfoCard>
      </div>

       <InfoCard icon={<Apple size={24}/>} title="Dietary Alternatives" className="lg:col-span-3">
            <div className="space-y-4">
              {result.dietaryAlternatives.map((alt, index) => (
                <div key={index} className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{alt.name}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{alt.description}</p>
                </div>
              ))}
            </div>
        </InfoCard>

    </motion.div>
  );
};

export default ResultsDashboard;
