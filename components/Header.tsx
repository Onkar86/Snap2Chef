import React, { useState } from 'react';
import type { Language, GamificationProgress } from '../types';
import { LANGUAGES, BADGES } from '../constants';
import { Snap2ChefLogo, SunIcon, MoonIcon, PantryIcon } from '../assets/icons';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  progress: GamificationProgress;
  onLogoClick: () => void;
  onNavigate: (view: 'pantry') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, progress, onLogoClick, onNavigate, theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const lastBadgeKey = progress.badges.length > 0 ? progress.badges[progress.badges.length - 1] : undefined;
  const lastBadge = lastBadgeKey ? BADGES[lastBadgeKey] : undefined;
  
  const chefLevel = lastBadge?.name || "Newcomer";
  const chefIcon = lastBadge?.icon || '🌱';

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={onLogoClick}
        >
          <Snap2ChefLogo className="h-9 w-9" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Snap<span className="text-emerald-500">2</span>Chef</h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-full text-sm font-medium">
            <span title={lastBadge?.description}>{chefLevel}</span>
            <span title={`${progress.recipesGenerated} recipes generated`}>{chefIcon}</span>
          </div>

          <button onClick={() => onNavigate('pantry')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="My Pantry">
            <PantryIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>
          
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Toggle Theme">
            {theme === 'light' ? <MoonIcon className="h-5 w-5 text-slate-600"/> : <SunIcon className="h-5 w-5 text-yellow-400"/>}
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-sm">{language.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
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
    </header>
  );
};

export default Header;