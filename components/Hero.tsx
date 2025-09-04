import React from 'react';
import ImageUploader from './ImageUploader';
import { CameraIcon, RecipeBookIcon, NutritionIcon } from '../assets/icons';

interface HeroProps {
  onImageUpload: (file: File) => void;
  error: string | null;
  savedRecipesCount: number;
  onShowSaved: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl shadow-sm">
    <div className="mb-4 text-emerald-500">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
  </div>
);


const Hero: React.FC<HeroProps> = ({ onImageUpload, error, savedRecipesCount, onShowSaved }) => {
  return (
    <div className="text-center py-12 md:py-20">
      <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
        Powered by Google Gemini
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-slate-900 dark:text-slate-50 leading-tight">
        Snap a Dish, <span className="text-emerald-500">Get a Recipe</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
        Turn your food photos into delicious meals. Instantly get recipes, nutritional info, and more with the power of AI.
      </p>
      
      <div className="max-w-2xl mx-auto mb-8">
        <ImageUploader onImageUpload={onImageUpload} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {savedRecipesCount > 0 && (
          <div className="mb-12">
            <button 
              onClick={onShowSaved}
              className="bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-transform hover:scale-105 shadow-lg"
            >
              View My Saved Recipes ({savedRecipesCount})
            </button>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <FeatureCard 
          icon={<CameraIcon className="w-10 h-10" />}
          title="Instant Recognition"
          description="Our AI identifies ingredients or entire dishes from just a single photo."
        />
        <FeatureCard 
          icon={<RecipeBookIcon className="w-10 h-10" />}
          title="Creative Recipes"
          description="Get multiple, easy-to-follow recipe suggestions for any ingredient."
        />
        <FeatureCard 
          icon={<NutritionIcon className="w-10 h-10" />}
          title="Health Insights"
          description="Understand your food with detailed nutritional breakdowns and dietary alternatives."
        />
      </div>

       <p className="text-xs text-slate-400 dark:text-slate-500 mt-12 max-w-md mx-auto">
        Privacy Note: Your images are sent to the Google Gemini API for analysis and are not stored by Snap2Chef.
      </p>
    </div>
  );
};

export default Hero;