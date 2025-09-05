import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Recipe } from '../types';
import AROverlay from './AROverlay';
import RecipeShareCard from './RecipeShareCard';
import { useVoiceNavigation } from '../hooks/useVoiceNavigation';
import { Share2, Mic, MicOff, Timer, ArrowLeft, X, CookingPot } from 'lucide-react';

interface CookingModeProps {
  recipe: Recipe;
  onBack: () => void;
}

const TimerDisplay: React.FC<{ durationInSeconds: number; onDismiss: () => void }> = ({ durationInSeconds, onDismiss }) => {
    const [timeLeft, setTimeLeft] = useState(durationInSeconds);

    useEffect(() => {
        if (timeLeft <= 0) {
            onDismiss();
            return;
        }
        const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timerId);
    }, [timeLeft, onDismiss]);
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onDismiss}>
            <motion.div 
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 border-2 border-emerald-500" 
                onClick={e => e.stopPropagation()}
            >
                <Timer className="w-12 h-12 text-emerald-500" />
                <p className="text-6xl font-bold tracking-wider text-slate-800 dark:text-slate-100 font-mono">{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</p>
                <button onClick={onDismiss} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Dismiss</button>
            </motion.div>
        </div>
    );
};

const CookingMode: React.FC<CookingModeProps> = ({ recipe, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isArMode, setIsArMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);

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
  
  const parseAndRenderInstruction = (instruction: string) => {
    const timeRegex = /(\d+)\s*(minute|second)s?/gi;
    const parts = instruction.split(timeRegex);
    
    return parts.map((part, index) => {
        if (index % 3 === 1) { // It's the number part
            const timeValue = parseInt(part, 10);
            const timeUnit = parts[index + 1].toLowerCase();
            const durationInSeconds = timeUnit.startsWith('minute') ? timeValue * 60 : timeValue;
            return (
                <button 
                    key={`timer-${index}`}
                    onClick={() => setActiveTimer(durationInSeconds)}
                    className="bg-emerald-200 dark:bg-emerald-800/80 text-emerald-800 dark:text-emerald-200 font-bold p-1.5 rounded-md mx-1 hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
                >
                    <Timer className="w-4 h-4 inline-block" />
                    {timeValue} {parts[index + 1]}
                </button>
            );
        }
        if (index % 3 === 2) return null; // It's the unit part, already handled
        return <span key={`text-${index}`}>{part}</span>;
    }).filter(Boolean);
  }

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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
            <ArrowLeft size={18} /> Back to Recipes
          </button>
          <div className="flex items-center gap-2">
             <button onClick={toggleListening} title={isListening ? "Disable Voice Control" : "Enable Voice Control"} className={`p-2.5 rounded-full transition-colors ${isListening ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {isListening ? <Mic size={20}/> : <MicOff size={20} />}
             </button>
             <button onClick={() => setShowShareModal(true)} title="Share Recipe" className="p-2.5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                <Share2 size={20} />
             </button>
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-10 border border-slate-200 dark:border-slate-700">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">{recipe.recipeName}</h1>
            
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-2"><CookingPot size={20} /> Ingredients</h3>
              <ul className="list-disc list-inside columns-1 md:columns-2 text-slate-700 dark:text-slate-300 space-y-1">
                  {recipe.ingredients.map((ing, index) => (
                      <li key={index} className={ing.hasInPantry ? 'text-emerald-700 dark:text-emerald-400 font-medium' : ''}>
                        {ing.hasInPantry && '✓ '}{ing.quantity} {ing.name}
                      </li>
                  ))}
              </ul>
            </div>
          
            <div className="relative bg-emerald-50 dark:bg-emerald-900/40 p-8 rounded-xl min-h-[200px] flex items-center justify-center border-t-4 border-emerald-400 dark:border-emerald-600">
              <p className="text-xl md:text-2xl text-center text-emerald-900 dark:text-emerald-100 leading-relaxed">
                {parseAndRenderInstruction(recipe.instructions[currentStep])}
              </p>
            </div>
          </motion.div>
          
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-semibold"
            >
              Previous
            </button>
            
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Step {currentStep + 1} / {totalSteps}
            </div>
            
            <button
              onClick={nextStep}
              disabled={currentStep === totalSteps - 1}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {activeTimer && <TimerDisplay durationInSeconds={activeTimer} onDismiss={() => setActiveTimer(null)} />}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
           <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <RecipeShareCard recipe={recipe} />
                <div className="mt-4 flex justify-center">
                    <button onClick={() => setShowShareModal(false)} className="mt-2 text-white/80 bg-black/30 p-2 rounded-full hover:text-white">
                        <X size={20} />
                    </button>
                </div>
           </motion.div>
        </div>
      )}
    </>
  );
};

// FIX: Corrected typo from `exportexport` to `export`
export default CookingMode;