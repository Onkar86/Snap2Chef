import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'snap2chef_pantry_items';

const getInitialPantry = (): string[] => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error reading pantry from localStorage', error);
    return [];
  }
};

export const usePantry = () => {
  const [pantryItems, setPantryItems] = useState<string[]>(getInitialPantry);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pantryItems));
    } catch (error) {
      console.error('Error writing pantry to localStorage', error);
    }
  }, [pantryItems]);

  const addItem = useCallback((item: string) => {
    const newItem = item.trim();
    if (newItem && !pantryItems.find(i => i.toLowerCase() === newItem.toLowerCase())) {
        setPantryItems(currentItems => [...currentItems, newItem].sort());
    }
  }, [pantryItems]);

  const removeItem = useCallback((itemToRemove: string) => {
    setPantryItems(currentItems => currentItems.filter(item => item !== itemToRemove));
  }, []);

  return { pantryItems, addItem, removeItem };
};
