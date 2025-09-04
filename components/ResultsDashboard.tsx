import React, { useState, useMemo } from 'react';
import type { AnalysisResult, Recipe } from '../types';
import { RecipeBookIcon, NutritionIcon, AlternativesIcon, GroceryListIcon, InfoIcon, BookmarkIcon, BookmarkFilledIcon, ClipboardIcon, FilterIcon } from '../assets/icons';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onStartCooking: (recipe: Recipe) => void;
  savedRecipeIds: string[];
  onSaveToggle: (recipe: Recipe) => void;
}

type Tab = 'recognition' | 'recipes' | 'nutrition' | 'alternatives' | 'grocery';

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onStartCooking, savedRecipeIds, onSaveToggle }) => {
  const [activeTab, setActiveTab] = useState<Tab>('recipes');
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [filters, setFilters] = useState({
    time: 'all',
    difficulty: 'all',
    diet: 'all',
  });
  
  const allDietaryTags = useMemo(() => {
    const tags = new Set<string>();
    result.recipes.forEach(recipe => {
      recipe.dietaryTags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [result.recipes]);

  const filteredRecipes = useMemo(() => {
    return result.recipes.filter(recipe => {
      const timeFilter = filters.time === 'all' || (recipe.cookingTime && parseInt(recipe.cookingTime) <= parseInt(filters.time));
      const difficultyFilter = filters.difficulty === 'all' || recipe.difficulty === filters.difficulty;
      const dietFilter = filters.diet === 'all' || recipe.dietaryTags.includes(filters.diet);
      return timeFilter && difficultyFilter && dietFilter;
    });
  }, [result.recipes, filters]);

  const handleCopy = () => {
    const groceryText = result.groceryList.join('\n');
    navigator.clipboard.writeText(groceryText).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy'), 2000);
    });
  };

  const TabButton: React.FC<{ tabName: Tab; label: string; icon: React.ReactNode }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabName ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
  
  const FilterDropdown: React.FC<{ name: keyof typeof filters, options: {value: string, label: string}[], label: string }> = ({ name, options, label }) => (
    <div>
        <label htmlFor={name} className="sr-only">{label}</label>
        <select
            id={name}
            name={name}
            value={filters[name]}
            onChange={(e) => setFilters(prev => ({ ...prev, [name]: e.target.value }))}
            className="block w-full pl-3 pr-8 py-2 text-sm border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
        <TabButton tabName="recognition" label="Recognition" icon={<InfoIcon className="w-5 h-5"/>} />
        <TabButton tabName="recipes" label={`Recipes (${result.recipes.length})`} icon={<RecipeBookIcon className="w-5 h-5"/>} />
        <TabButton tabName="nutrition" label="Nutrition" icon={<NutritionIcon className="w-5 h-5"/>} />
        <TabButton tabName="alternatives" label="Alternatives" icon={<AlternativesIcon className="w-5 h-5"/>} />
        <TabButton tabName="grocery" label="Grocery List" icon={<GroceryListIcon className="w-5 h-5"/>} />
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md min-h-[400px]">
        {activeTab === 'recognition' && (
          <div>
            <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{result.dishName}</h2>
            <p className="text-slate-600 dark:text-slate-300">{result.description}</p>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Recipe Suggestions</h2>
                <div className="flex items-center gap-3">
                    <FilterIcon className="w-5 h-5 text-slate-500" />
                    <FilterDropdown name="time" label="Cooking Time" options={[
                        {value: 'all', label: 'Any Time'},
                        {value: '15', label: '< 15 min'},
                        {value: '30', label: '< 30 min'},
                        {value: '60', label: '< 60 min'},
                    ]} />
                     <FilterDropdown name="difficulty" label="Difficulty" options={[
                        {value: 'all', label: 'Any Difficulty'},
                        {value: 'Easy', label: 'Easy'},
                        {value: 'Medium', label: 'Medium'},
                        {value: 'Hard', label: 'Hard'},
                    ]} />
                     <FilterDropdown name="diet" label="Dietary" options={[
                        {value: 'all', label: 'Any Diet'},
                        ...allDietaryTags.map(tag => ({ value: tag, label: tag }))
                    ]} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">{recipe.recipeName}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>{recipe.difficulty}</span>
                    </div>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{recipe.cookingTime}</p>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">{recipe.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => onStartCooking(recipe)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      Start Cooking
                    </button>
                    <button onClick={() => onSaveToggle(recipe)} title="Save for Later" className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300">
                      {savedRecipeIds.includes(recipe.id) ? 
                        <BookmarkFilledIcon className="w-6 h-6" /> : 
                        <BookmarkIcon className="w-6 h-6" />
                      }
                    </button>
                  </div>
                </div>
              ))}
               {filteredRecipes.length === 0 && (
                <div className="col-span-full text-center py-10">
                    <p className="text-slate-500 dark:text-slate-400">No recipes match your filters.</p>
                </div>
               )}
            </div>
          </div>
        )}
        
        {activeTab === 'nutrition' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Nutritional Information</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Estimated values per {result.nutritionalInfo.servingSize}.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(result.nutritionalInfo).filter(([key]) => key !== 'servingSize').map(([key, value]) => (
                <div key={key} className="bg-emerald-50 dark:bg-emerald-900/40 p-4 rounded-lg text-center">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 capitalize">{key}</p>
                  <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alternatives' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Dietary Alternatives</h2>
            <div className="space-y-4">
              {result.dietaryAlternatives.map((alt, index) => (
                <div key={index} className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{alt.name}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{alt.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'grocery' && (
           <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Smart Grocery List</h2>
                <button onClick={handleCopy} className="flex items-center gap-2 text-sm bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    <ClipboardIcon className="w-4 h-4" />
                    {copyStatus}
                </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">A checklist for the first recipe: {result.recipes[0]?.recipeName}.</p>
            <ul className="space-y-2">
              {result.groceryList.map((item, index) => (
                <li key={index} className="flex items-center">
                  <input type="checkbox" id={`item-${index}`} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-transparent" />
                  <label htmlFor={`item-${index}`} className="ml-3 text-slate-700 dark:text-slate-300">{item}</label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;