import { useState, useEffect, useCallback } from 'react';
import type { GamificationProgress, Badge } from '../types';
import { GAMIFICATION_MILESTONES, BADGES } from '../constants';

const getInitialProgress = (): GamificationProgress => {
  try {
    const item = window.localStorage.getItem('snap2chef_progress');
    return item ? JSON.parse(item) : { recipesGenerated: 0, badges: [] };
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return { recipesGenerated: 0, badges: [] };
  }
};

export const useGamification = () => {
  const [progress, setProgress] = useState<GamificationProgress>(getInitialProgress);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('snap2chef_progress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [progress]);

  const addProgress = useCallback((type: 'recipeGenerated') => {
    setProgress(currentProgress => {
      const newCount = currentProgress.recipesGenerated + 1;
      const updatedProgress = { ...currentProgress, recipesGenerated: newCount };

      const milestone = GAMIFICATION_MILESTONES.recipesGenerated.find(
        m => m.count === newCount && !currentProgress.badges.includes(m.badgeKey)
      );

      if (milestone) {
        updatedProgress.badges = [...currentProgress.badges, milestone.badgeKey];
        setNewBadge(BADGES[milestone.badgeKey]);
      }
      
      return updatedProgress;
    });
  }, []);

  const clearNewBadge = useCallback(() => {
    setNewBadge(null);
  }, []);

  return { progress, addProgress, newBadge, clearNewBadge };
};