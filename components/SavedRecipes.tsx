import React from 'react';
import { motion } from 'framer-motion';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import { Bookmark, ChefHat } from 'lucide-react';

interface SavedRecipesProps {
  recipes: Recipe[];
  onStartCooking: (recipe: Recipe) => void;
  onRemove: (recipeId: string) => void;
}

const SavedRecipes: React.FC<SavedRecipesProps> = ({ recipes, onStartCooking, onRemove }) => {
  return (
    <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-8">
          <Bookmark className="w-8 h-8 text-emerald-500" />
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">My Saved Recipes</h1>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <ChefHat className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
            <h2 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">No Saved Recipes Yet</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Your saved recipes will appear here. Start by analyzing an image!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
             <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onStartCooking={onStartCooking}
                onSaveToggle={() => onRemove(recipe.id)} // This will now act as a remove button
                isSaved={true} // All recipes here are saved
                delay={index * 0.1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SavedRecipes;
