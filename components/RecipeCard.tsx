import React from 'react';
import { motion } from 'framer-motion';
import type { Recipe } from '../types';
import { Bookmark, ChefHat, Clock, BarChart, Flame, Share2 } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onStartCooking: (r: Recipe) => void;
  onSaveToggle: (r: Recipe) => void;
  isSaved: boolean;
  delay?: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onStartCooking, onSaveToggle, isSaved, delay = 0 }) => {
  const totalIngredients = recipe.ingredients.length;
  const matchPercentage = totalIngredients > 0 ? Math.round((recipe.pantryMatchCount / totalIngredients) * 100) : 0;

  const difficultyColors = {
      Easy: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      Hard: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  }

  return (
    <motion.div 
        className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
    >
      <div className="h-40 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
        {/* Placeholder for food image. Using a simple gradient and icon. */}
        <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 dark:from-emerald-800 dark:to-teal-900 flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-white/50" />
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{recipe.recipeName}</h3>
             <button onClick={() => onSaveToggle(recipe)} title="Save for Later" className="text-slate-400 hover:text-emerald-500">
                <Bookmark size={20} className={`transition-colors ${isSaved ? 'fill-emerald-500 text-emerald-500' : ''}`} />
            </button>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm flex-grow">{recipe.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {recipe.cookingTime}</span>
            <span className={`flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-full ${difficultyColors[recipe.difficulty]}`}><BarChart size={14} /> {recipe.difficulty}</span>
        </div>

        {totalIngredients > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Pantry Match</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{matchPercentage}%</p>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${matchPercentage}%` }}></div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
            <button
            onClick={() => onStartCooking(recipe)}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-transform hover:scale-105 transform-gpu text-sm font-semibold shadow-sm"
            >
            Cook Now
            </button>
            <div className="flex items-center gap-2">
                {recipe.dietaryTags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{tag}</span>
                ))}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
