export interface Language {
  code: 'en' | 'hi' | 'mr';
  name: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  recipeName: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  cookingTime: string; // e.g., "25-30 minutes"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dietaryTags: string[]; // e.g., ["Vegan", "Gluten-Free"]
}

export interface NutritionInfo {
  calories: string;
  protein: string;
  carbohydrates: string;
  fat: string;
  servingSize: string;
}

export interface DietaryAlternative {
  name: string;
  description: string;
}

export interface AnalysisResult {
  dishName: string;
  description: string;
  recipes: Recipe[];
  nutritionalInfo: NutritionInfo;
  dietaryAlternatives: DietaryAlternative[];
  groceryList: string[];
}

export interface Badge {
  name: string;
  description: string;
  icon: string;
}

export interface GamificationProgress {
  recipesGenerated: number;
  badges: string[]; // Stores badge keys
}