import React from 'react';
import { ChefHat, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <ChefHat className="h-6 w-6 text-emerald-500" />
                        <span className="font-bold text-lg text-slate-700 dark:text-slate-200">Snap2Chef</span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Snap2Chef. All rights reserved. Powered by Google Gemini.
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-slate-500 hover:text-emerald-500 transition-colors">
                            <Github size={20} />
                        </a>
                        <a href="#" className="text-slate-500 hover:text-emerald-500 transition-colors">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="text-slate-500 hover:text-emerald-500 transition-colors">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
