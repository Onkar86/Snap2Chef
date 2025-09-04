import React, { useState } from 'react';
import type { Recipe } from '../types';
import AROverlay from './AROverlay';
import RecipeShareCard from './RecipeShareCard';
import { useVoiceNavigation } from '../hooks/useVoiceNavigation';
import { ShareIcon, ArIcon, VoiceIcon, VoiceOffIcon } from '../assets/icons';

interface CookingModeProps {
  recipe: Recipe;
  onBack: () => void;
}

const CookingMode: React.FC<CookingModeProps> = ({ recipe, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isArMode, setIsArMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const totalSteps = recipe.instructions.length;

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  const repeatInstruction = () => {
      const utterance = new SpeechSynthesisUtterance(recipe.instructions[currentStep]);
      window.speechSynthesis.speak(utterance);
  };

  const { isListening, toggleListening } = useVoiceNavigation({
      onNext: nextStep,
      onPrevious: prevStep,
      onRepeat: repeatInstruction
  });

  const handleShare = async () => {
    const shareText = `Check out this recipe from Snap2Chef!\n\n*${recipe.recipeName}*\n\n${recipe.description}\n\nShared via Snap2Chef!`;
    try {
        await navigator.clipboard.writeText(shareText);
        setShareStatus('Recipe copied to clipboard!');
    } catch (err) {
        setShareStatus('Could not copy recipe.');
    }
    setTimeout(() => setShareStatus(''), 3000);
  };

  if (isArMode) {
    return (
      <AROverlay
        recipeName={recipe.recipeName}
        instruction={recipe.instructions[currentStep]}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={nextStep}
        onPrev={prevStep}
        onExit={() => setIsArMode(false)}
      />
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium">
            &larr; Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
             <button onClick={toggleListening} title={isListening ? "Disable Voice Control" : "Enable Voice Control"} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isListening ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {isListening ? <VoiceIcon className="w-5 h-5"/> : <VoiceOffIcon className="w-5 h-5" />}
             </button>
             <button onClick={() => setShowShareModal(true)} title="Share Recipe" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-2 rounded-lg">
                <ShareIcon className="w-5 h-5" />
             </button>
            <button onClick={() => setIsArMode(true)} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors">
              <ArIcon className="w-5 h-5" />
              <span>AR Mode</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">{recipe.recipeName}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{recipe.description}</p>
          
          <div className="mb-8">
              <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-100">Ingredients</h3>
              <ul className="list-disc list-inside columns-1 md:columns-2 text-slate-700 dark:text-slate-300 space-y-1">
                  {recipe.ingredients.map((ing, index) => (
                      <li key={index}><span className="font-medium">{ing.quantity}</span> {ing.name}</li>
                  ))}
              </ul>
          </div>
          
          <div className="relative bg-emerald-50 dark:bg-emerald-900/30 p-8 rounded-lg min-h-[200px] flex items-center justify-center border-t-4 border-emerald-300 dark:border-emerald-700">
            <p className="text-xl md:text-2xl text-center text-emerald-900 dark:text-emerald-100 leading-relaxed">
              {recipe.instructions[currentStep]}
            </p>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Previous
            </button>
            
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Step {currentStep + 1} of {totalSteps}
            </div>
            
            <button
              onClick={nextStep}
              disabled={currentStep === totalSteps - 1}
              className="px-6 py-2 bg-emerald-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowShareModal(false)}>
           <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <RecipeShareCard recipe={recipe} />
                <div className="mt-4 flex flex-col items-center">
                    <button onClick={handleShare} className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg">
                        {shareStatus || 'Copy & Share Recipe Text'}
                    </button>
                    <button onClick={() => setShowShareModal(false)} className="mt-2 text-white/80 text-sm hover:text-white">
                        Close
                    </button>
                </div>
           </div>
        </div>
      )}
    </>
  );
};

export default CookingMode;