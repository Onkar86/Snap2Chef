import React from 'react';
import { motion } from 'framer-motion';
import UploadBox from './UploadBox';
import { Leaf, Zap, BrainCircuit } from 'lucide-react';

interface HeroProps {
  onImageUpload: (file: File) => void;
  error: string | null;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex items-start text-left p-4">
    <div className="mr-4 text-emerald-500 bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-lg">{icon}</div>
    <div>
      <h3 className="text-md font-semibold mb-1 text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
    </div>
  </div>
);

const TrendingPill: React.FC<{ name: string; emoji: string; delay: number }> = ({ name, emoji, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full shadow-sm"
    >
        <span className="text-xl">{emoji}</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{name}</span>
    </motion.div>
);

const Hero: React.FC<HeroProps> = ({ onImageUpload, error }) => {
  return (
    <div className="text-center py-12 md:py-16">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-4"
      >
        Powered by Google Gemini
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-6xl font-bold mb-4 text-slate-900 dark:text-slate-50 leading-tight"
      >
        From <span className="text-emerald-500">Snap</span> to Supper
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8"
      >
        Your AI culinary assistant. Turn photos of ingredients into delicious recipes, instantly.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <UploadBox onImageUpload={onImageUpload} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <p className="font-semibold text-slate-600 dark:text-slate-400 mb-4">Trending Ingredients</p>
        <div className="flex justify-center items-center flex-wrap gap-4">
            <TrendingPill name="Avocado" emoji="🥑" delay={0.4} />
            <TrendingPill name="Sourdough" emoji="🍞" delay={0.5} />
            <TrendingPill name="Salmon" emoji="🐟" delay={0.6} />
            <TrendingPill name="Quinoa" emoji="🌾" delay={0.7} />
            <TrendingPill name="Kale" emoji="🥬" delay={0.8} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
