import { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '../types';

const STORAGE_KEY = 'snap2chef_saved_recipes';

const getInitialSavedRecipes = (): Recipe[] => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error reading saved recipes from localStorage', error);
    return [];
  }
};

export const useSavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(getInitialSavedRecipes);
  
  const savedRecipeIds = savedRecipes.map(r => r.id);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecipes));
    } catch (error) {
      console.error('Error writing saved recipes to localStorage', error);
    }
  }, [savedRecipes]);

  const addSavedRecipe = useCallback((recipe: Recipe) => {
    setSavedRecipes(currentRecipes => {
      if (currentRecipes.some(r => r.id === recipe.id)) {
        return currentRecipes; // Already saved
      }
      return [...currentRecipes, recipe];
    });
  }, []);

  const removeSavedRecipe = useCallback((recipeId: string) => {
    setSavedRecipes(currentRecipes => currentRecipes.filter(r => r.id !== recipeId));
  }, []);

  return { savedRecipes, savedRecipeIds, addSavedRecipe, removeSavedRecipe };
};