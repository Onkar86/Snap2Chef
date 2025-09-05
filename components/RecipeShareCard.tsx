import React from 'react';
import type { Recipe } from '../types';
import { ChefHat, Share2 } from 'lucide-react';

interface RecipeShareCardProps {
  recipe: Recipe;
}

const RecipeShareCard: React.FC<RecipeShareCardProps> = ({ recipe }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-6 rounded-2xl shadow-2xl border border-slate-200 text-slate-800 font-sans">
      <div className="flex justify-between items-center pb-4 border-b-2 border-emerald-200">
        <h2 className="text-2xl font-bold text-emerald-800">{recipe.recipeName}</h2>
        <div className="flex items-center gap-2 text-emerald-600">
            <span className="font-bold text-sm">Snap2Chef</span>
            <ChefHat size={24} />
        </div>
      </div>
      
      <p className="text-slate-600 my-4 text-center italic">
        "{recipe.description}"
      </p>

      <div className="bg-emerald-100/50 p-4 rounded-lg">
        <h3 className="font-semibold text-emerald-700 mb-2 text-center">Key Ingredients</h3>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-slate-700">
          {recipe.ingredients.slice(0, 6).map((ing, index) => (
            <li key={index} className="truncate flex items-center gap-2">
              <span className="text-emerald-600 font-medium">&#10003;</span> {ing.name}
            </li>
          ))}
        </ul>
        {recipe.ingredients.length > 6 && <p className="text-center text-xs text-slate-500 mt-2">+ {recipe.ingredients.length - 6} more</p>}
      </div>

      <div className="mt-4 text-center">
        <button onClick={() => navigator.clipboard.writeText(`Check out this recipe for ${recipe.recipeName} from Snap2Chef!`)} className="w-full flex items-center justify-center gap-2 text-md bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-lg">
            <Share2 size={18} />
            Share Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeShareCard;
