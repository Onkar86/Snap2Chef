import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, Recipe } from '../types';

// Safely access the API key to prevent crashes in environments without `process`
const API_KEY = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        dishName: { type: Type.STRING, description: "A creative and fitting name for the dish in the image, or a summary of the ingredients shown." },
        description: { type: Type.STRING, description: "A brief, appetizing description of the dish." },
        recipes: {
            type: Type.ARRAY,
            description: "An array of three distinct recipe objects.",
            items: {
                type: Type.OBJECT,
                properties: {
                    recipeName: { type: Type.STRING },
                    description: { type: Type.STRING },
                    ingredients: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                quantity: { type: Type.STRING },
                            },
                            required: ["name", "quantity"]
                        },
                    },
                    instructions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                    },
                    cookingTime: { type: Type.STRING, description: "Estimated total cooking time, e.g., '25-30 minutes'." },
                    difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                    dietaryTags: {
                        type: Type.ARRAY,
                        description: "Relevant dietary tags, e.g., ['Vegan', 'Gluten-Free']",
                        items: { type: Type.STRING }
                    },
                },
                 required: ["recipeName", "description", "ingredients", "instructions", "cookingTime", "difficulty", "dietaryTags"]
            },
        },
        nutritionalInfo: {
            type: Type.OBJECT,
            properties: {
                servingSize: { type: Type.STRING },
                calories: { type: Type.STRING },
                protein: { type: Type.STRING },
                carbohydrates: { type: Type.STRING },
                fat: { type: Type.STRING },
            },
             required: ["servingSize", "calories", "protein", "carbohydrates", "fat"]
        },
        dietaryAlternatives: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "e.g., Vegan, Gluten-Free" },
                    description: { type: Type.STRING, description: "A brief explanation of the alternative." },
                },
                required: ["name", "description"]
            },
        },
        groceryList: {
            type: Type.ARRAY,
            description: "A simple list of strings for the ingredients of the first recipe.",
            items: { type: Type.STRING },
        },
    },
    required: ["dishName", "description", "recipes", "nutritionalInfo", "dietaryAlternatives", "groceryList"]
};

export const generateAnalysis = async (
  base64Image: string,
  mimeType: string,
  language: string,
  pantryItems: string[]
): Promise<AnalysisResult> => {
  if (!API_KEY) {
    throw new Error("API_KEY_MISSING: The Google Gemini API key is not configured. Please set the API_KEY environment variable in your deployment environment.");
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  let prompt = `You are a culinary expert assistant named Snap2Chef. Analyze the food item(s) in this image. Provide a comprehensive analysis in the language with code: ${language}. Respond ONLY with a valid JSON object that adheres to the provided schema. Do not include any text, markdown, or code block syntax outside the JSON object.

  The analysis should include:
  1. A plausible name for the dish or a list of identified ingredients.
  2. A brief, appetizing description.
  3. Three creative recipe ideas based on the image, with detailed ingredients, step-by-step instructions, estimated cooking time, difficulty level, and relevant dietary tags.
  4. An estimated nutritional breakdown per serving for the most likely dish.
  5. Suggestions for dietary alternatives (e.g., vegan, gluten-free).
  6. A consolidated grocery list for the first recipe.`;
  
  if (pantryItems.length > 0) {
      prompt += `\n\nThe user has the following ingredients in their pantry: ${pantryItems.join(', ')}. Please prioritize or suggest recipes that make use of these ingredients if possible.`
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { 
            parts: [
                { inlineData: { data: base64Image, mimeType: mimeType } },
                { text: prompt }
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        }
    });
    
    const result = JSON.parse(response.text) as Omit<AnalysisResult, 'recipes'> & { recipes: Omit<Recipe, 'id'>[] };

    const recipesWithIds: Recipe[] = result.recipes.map((recipe, index) => ({
      ...recipe,
      id: `${recipe.recipeName.toLowerCase().replace(/\s+/g, '-')}-${index}`
    }));

    return { ...result, recipes: recipesWithIds };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI. The image might be unclear or unsupported.");
  }
};