import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Refrigerator, Trash2 } from 'lucide-react';

interface PantryManagerProps {
  pantryItems: string[];
  onAddItem: (item: string) => void;
  onRemoveItem: (item: string) => void;
}

const PantryManager: React.FC<PantryManagerProps> = ({ pantryItems, onAddItem, onRemoveItem }) => {
  const [newItem, setNewItem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAddItem(newItem);
      setNewItem('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div 
        className="max-w-2xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
    >
      <div className="flex items-center gap-3 mb-8">
        <Refrigerator className="w-8 h-8 text-emerald-500" />
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">My Pantry</h1>
      </div>

      <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="e.g., Flour, Eggs, Milk"
            className="flex-grow bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
          <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-transform hover:scale-105 transform-gpu font-semibold">
            Add
          </button>
        </form>

        {pantryItems.length === 0 ? (
          <div className="text-center py-12">
            <Refrigerator className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
            <h2 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">Your Pantry is Empty</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Add ingredients you have on hand to get smarter recipe suggestions!</p>
          </div>
        ) : (
          <motion.ul className="space-y-3" variants={containerVariants}>
            {pantryItems.map((item) => (
              <motion.li
                key={item}
                className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg flex justify-between items-center transition-colors"
                variants={itemVariants}
                whileHover={{ backgroundColor: 'rgba(236, 253, 245, 1)' }}
              >
                <span className="text-slate-800 dark:text-slate-200 font-medium">{item}</span>
                <button
                  onClick={() => onRemoveItem(item)}
                  className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title={`Remove ${item}`}
                >
                  <Trash2 size={16} />
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
};

export default PantryManager;
