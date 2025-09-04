import React, { useEffect, useState } from 'react';
import type { Badge } from '../types';

interface BadgeToastProps {
  badge: Badge;
  onDismiss: () => void;
}

const BadgeToast: React.FC<BadgeToastProps> = ({ badge, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade-out transition
    }, 5000);

    return () => clearTimeout(timer);
  }, [badge, onDismiss]);

  return (
    <div
      className={`fixed bottom-5 right-5 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl p-4 flex items-start gap-4 transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="text-4xl">{badge.icon}</div>
      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Badge Unlocked!</h3>
        <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{badge.name}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{badge.description}</p>
      </div>
      <button onClick={() => setVisible(false)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        &times;
      </button>
    </div>
  );
};

export default BadgeToast;