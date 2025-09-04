import React from 'react';
import type { Recipe } from '../types';
import { Snap2ChefLogo } from '../assets/icons';

interface RecipeShareCardProps {
  recipe: Recipe;
}

const RecipeShareCard: React.FC<RecipeShareCardProps> = ({ recipe }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-6 rounded-2xl shadow-2xl border border-slate-200 text-slate-800 font-sans">
      <div className="flex justify-between items-center pb-4 border-b-2 border-emerald-200">
        <h2 className="text-2xl font-bold text-emerald-800">{recipe.recipeName}</h2>
        <Snap2ChefLogo className="w-10 h-10" />
      </div>
      
      <p className="text-slate-600 my-4 text-center italic">
        "{recipe.description}"
      </p>

      <div className="bg-emerald-50/50 p-4 rounded-lg">
        <h3 className="font-semibold text-emerald-700 mb-2 text-center">Key Ingredients</h3>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700">
          {recipe.ingredients.slice(0, 6).map((ing, index) => (
            <li key={index} className="truncate">
              <span className="text-emerald-600 font-medium">&#10003;</span> {ing.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400 font-medium">
          Shared via <span className="font-bold text-emerald-600">Snap2Chef</span>
        </p>
      </div>
    </div>
  );
};

export default RecipeShareCard;
