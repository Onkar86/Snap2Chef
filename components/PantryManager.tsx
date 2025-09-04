import React, { useState } from 'react';
import { PantryIcon } from '../assets/icons';

interface PantryManagerProps {
  pantryItems: string[];
  onAddItem: (item: string) => void;
  onRemoveItem: (item: string) => void;
  onBack: () => void;
}

const PantryManager: React.FC<PantryManagerProps> = ({ pantryItems, onAddItem, onRemoveItem, onBack }) => {
  const [newItem, setNewItem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAddItem(newItem);
      setNewItem('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">My Pantry</h1>
        <button onClick={onBack} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium">
          &larr; Back to Home
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="e.g., Flour, Eggs, Milk"
            className="flex-grow bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium">
            Add
          </button>
        </form>

        {pantryItems.length === 0 ? (
          <div className="text-center py-12">
            <PantryIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
            <h2 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">Your Pantry is Empty</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Add ingredients you have on hand to get smarter recipe suggestions!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {pantryItems.map((item) => (
              <li
                key={item}
                className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-md flex justify-between items-center transition-colors"
              >
                <span className="text-slate-800 dark:text-slate-200">{item}</span>
                <button
                  onClick={() => onRemoveItem(item)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PantryManager;
