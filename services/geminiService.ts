import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, Recipe } from '../types';

const getApiKey = () => {
    const API_KEY = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;
    if (!API_KEY) {
        console.error("API_KEY_MISSING: The Google Gemini API key is not configured.");
        throw new Error("API_KEY_MISSING: The Google Gemini API key is not configured. Please set the API_KEY environment variable in your deployment environment.");
    }
    return API_KEY;
};

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
                                hasInPantry: { type: Type.BOOLEAN, description: "True if the user has this ingredient in their pantry." }
                            },
                            required: ["name", "quantity", "hasInPantry"]
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
                    pantryMatchCount: { type: Type.NUMBER, description: "The count of ingredients for this recipe that are present in the user's pantry." },
                    missingIngredients: { type: Type.ARRAY, description: "A list of ingredient names that are required for the recipe but not in the user's pantry.", items: { type: Type.STRING } }
                },
                 required: ["recipeName", "description", "ingredients", "instructions", "cookingTime", "difficulty", "dietaryTags", "pantryMatchCount", "missingIngredients"]
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
            description: "A simple list of strings for all ingredients of the first recipe.",
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
  const API_KEY = getApiKey();
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  let prompt = `You are a culinary expert assistant named Snap2Chef. Analyze the food item(s) in this image. Provide a comprehensive analysis in the language with code: ${language}. Respond ONLY with a valid JSON object that adheres to the provided schema. Do not include any text, markdown, or code block syntax outside the JSON object.
  The user has the following ingredients in their pantry: ${pantryItems.join(', ')}.

  The analysis should include:
  1. A plausible name for the dish or a list of identified ingredients.
  2. A brief, appetizing description.
  3. Three creative recipe ideas. For each recipe:
     - Provide detailed ingredients, step-by-step instructions, cooking time, difficulty, and dietary tags.
     - Critically, compare the recipe's ingredients against the user's pantry list. For each ingredient, set the 'hasInPantry' boolean field.
     - Calculate the 'pantryMatchCount' (how many ingredients the user has).
     - List all needed ingredients that are NOT in the pantry in 'missingIngredients'.
  4. An estimated nutritional breakdown for the most likely dish.
  5. Suggestions for dietary alternatives (e.g., vegan, gluten-free).
  6. A consolidated grocery list for all ingredients in the first recipe.`;
  
  if (pantryItems.length === 0) {
      prompt = prompt.replace("The user has the following ingredients in their pantry: .", "The user's pantry is empty. Assume they have nothing. For all ingredients, 'hasInPantry' must be false, 'pantryMatchCount' must be 0, and 'missingIngredients' must include all ingredients.");
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


export const generateChatResponse = async (history: { role: string, parts: { text: string }[] }[], newMessage: string): Promise<string> => {
    const API_KEY = getApiKey();
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are Snap2Chef's friendly AI assistant. Answer cooking-related questions concisely and helpfully. Keep your answers brief and to the point. Use markdown for formatting if needed.",
        },
        history,
    });

    try {
        const response = await chat.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Error in chat response:", error);
        return "I'm sorry, I encountered an error. Please try again.";
    }
};
