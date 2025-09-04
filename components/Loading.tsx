import React from 'react';
import { ChefHatIcon } from '../assets/icons';

const messages = [
  "Prepping the ingredients...",
  "Consulting with our AI chef...",
  "Simmering the details...",
  "Plating your results...",
  "Adding a pinch of magic...",
  "Almost ready to serve!"
];

const Loading: React.FC = () => {
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ChefHatIcon className="w-20 h-20 text-emerald-500 animate-bounce" />
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mt-6">Cooking up your results...</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 transition-opacity duration-500">{message}</p>
        </div>
    );
}

export default Loading;