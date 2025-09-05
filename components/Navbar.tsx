import React, { useState } from 'react';
// FIX: Import AnimatePresence from framer-motion
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Sun, Moon, Search, Refrigerator, Bookmark } from 'lucide-react';
import type { Language } from '../types';
import { LANGUAGES } from '../constants';

interface NavbarProps {
  onNavigate: (view: 'home' | 'pantry' | 'saved') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, theme, toggleTheme, language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header 
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <motion.div
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <ChefHat className="h-8 w-8 text-emerald-500" />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 hidden md:block">Snap<span className="text-emerald-500">2</span>Chef</h1>
        </div>
        
        <div className="hidden md:flex flex-grow max-w-sm items-center relative">
            <Search className="absolute left-3 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search saved recipes..." className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => onNavigate('pantry')} className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="My Pantry">
            <Refrigerator className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>
           <button onClick={() => onNavigate('saved')} className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Saved Recipes">
            <Bookmark className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>
          
          <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Toggle Theme">
            <AnimatePresence mode="wait">
                <motion.div
                    key={theme}
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                >
                {theme === 'light' ? <Moon className="h-5 w-5 text-slate-600"/> : <Sun className="h-5 w-5 text-yellow-400"/>}
                </motion.div>
            </AnimatePresence>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-sm font-medium">{language.code.toUpperCase()}</span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-10 border border-slate-200 dark:border-slate-700">
                {LANGUAGES.map((lang) => (
                  <a
                    key={lang.code}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setLanguage(lang);
                      setIsMenuOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                  >
                    {lang.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;