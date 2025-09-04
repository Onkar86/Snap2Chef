import React from 'react';
import type { Recipe } from '../types';
import { RecipeBookIcon } from '../assets/icons';

interface SavedRecipesProps {
  recipes: Recipe[];
  onStartCooking: (recipe: Recipe) => void;
  onRemove: (recipeId: string) => void;
  onBack: () => void;
}

const SavedRecipes: React.FC<SavedRecipesProps> = ({ recipes, onStartCooking, onRemove, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">My Saved Recipes</h1>
        <button onClick={onBack} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium">
          &larr; Back to Home
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <RecipeBookIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
            <h2 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">No Saved Recipes Yet</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Your saved recipes will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">{recipe.recipeName}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{recipe.description}</p>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <button
                  onClick={() => onStartCooking(recipe)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  Start Cooking
                </button>
                <button
                  onClick={() => onRemove(recipe.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
