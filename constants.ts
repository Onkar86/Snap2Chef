import type { Language, Badge } from './types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
];

export const BADGE_KEYS = {
  FIRST_SNAP: 'FirstSnap',
  APPRENTICE_CHEF: 'ApprenticeChef',
  SOUS_CHEF: 'SousChef',
  MASTER_CHEF: 'MasterChef'
} as const;


export const BADGES: { [key: string]: Badge } = {
  [BADGE_KEYS.FIRST_SNAP]: {
    name: 'First Snap!',
    description: 'You analyzed your first image.',
    icon: '📸',
  },
  [BADGE_KEYS.APPRENTICE_CHEF]: {
    name: 'Apprentice Chef',
    description: 'Generated 5 recipes.',
    icon: '🧑‍🍳',
  },
  [BADGE_KEYS.SOUS_CHEF]: {
    name: 'Sous Chef',
    description: 'Generated 15 recipes.',
    icon: '👩‍🍳',
  },
  [BADGE_KEYS.MASTER_CHEF]: {
    name: 'Master Chef',
    description: 'Generated 30 recipes.',
    icon: '🏆',
  },
};

export const GAMIFICATION_MILESTONES = {
  recipesGenerated: [
    { count: 1, badgeKey: BADGE_KEYS.FIRST_SNAP },
    { count: 5, badgeKey: BADGE_KEYS.APPRENTICE_CHEF },
    { count: 15, badgeKey: BADGE_KEYS.SOUS_CHEF },
    { count: 30, badgeKey: BADGE_KEYS.MASTER_CHEF },
  ],
};