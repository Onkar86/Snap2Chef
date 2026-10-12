import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult, Recipe } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Response schema for structured Gemini recipe analysis
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    dishName: {
      type: Type.STRING,
      description: 'A creative and appetizing name for the dish or a summary of the ingredients shown.',
    },
    description: {
      type: Type.STRING,
      description: 'A brief, appetizing description of the dish.',
    },
    recipes: {
      type: Type.ARRAY,
      description: 'An array of three distinct recipe objects.',
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
                hasInPantry: {
                  type: Type.BOOLEAN,
                  description: 'True if the user has this ingredient in their pantry.',
                },
              },
              required: ['name', 'quantity', 'hasInPantry'],
            },
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          cookingTime: {
            type: Type.STRING,
            description: "Estimated total cooking time, e.g. '20-25 minutes'.",
          },
          difficulty: {
            type: Type.STRING,
            enum: ['Easy', 'Medium', 'Hard'],
          },
          dietaryTags: {
            type: Type.ARRAY,
            description: "Relevant dietary tags, e.g. ['Vegetarian', 'Gluten-Free']",
            items: { type: Type.STRING },
          },
          pantryMatchCount: {
            type: Type.NUMBER,
            description: "Number of ingredients present in user's pantry.",
          },
          missingIngredients: {
            type: Type.ARRAY,
            description: "Ingredients required for the recipe but not in user's pantry.",
            items: { type: Type.STRING },
          },
        },
        required: [
          'recipeName',
          'description',
          'ingredients',
          'instructions',
          'cookingTime',
          'difficulty',
          'dietaryTags',
          'pantryMatchCount',
          'missingIngredients',
        ],
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
      required: ['servingSize', 'calories', 'protein', 'carbohydrates', 'fat'],
    },
    dietaryAlternatives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'e.g., Vegan, Gluten-Free' },
          description: { type: Type.STRING, description: 'Brief explanation of the alternative.' },
        },
        required: ['name', 'description'],
      },
    },
    groceryList: {
      type: Type.ARRAY,
      description: 'List of ingredients needed for the primary recipe.',
      items: { type: Type.STRING },
    },
  },
  required: ['dishName', 'description', 'recipes', 'nutritionalInfo', 'dietaryAlternatives', 'groceryList'],
};

const getDemoFallbackAnalysis = (pantryItems: string[] = []): AnalysisResult => {
  const normalize = (str: string) => str.toLowerCase().trim();
  const userPantry = (pantryItems || []).map(normalize);

  const checkInPantry = (ingredientName: string) => {
    const nameLower = normalize(ingredientName);
    return userPantry.some((item) => nameLower.includes(item) || item.includes(nameLower));
  };

  const rawRecipes = [
    {
      recipeName: 'Avocado & Poached Egg Grain Bowl',
      description: 'A nutritious, vibrant bowl packed with ripe avocado, fluffy quinoa, cherry tomatoes, and a perfectly poached egg.',
      rawIngredients: [
        { name: 'Avocado', quantity: '1 ripe' },
        { name: 'Eggs', quantity: '2 large' },
        { name: 'Quinoa', quantity: '1 cup cooked' },
        { name: 'Cherry Tomatoes', quantity: '1/2 cup halved' },
        { name: 'Olive Oil', quantity: '1 tbsp' },
        { name: 'Salt & Black Pepper', quantity: 'To taste' },
      ],
      instructions: [
        'Boil water with a splash of vinegar and gently poach eggs for 3-4 minutes until whites are firm and yolk is soft.',
        'Warm cooked quinoa in a bowl as your nutritious base.',
        'Slice ripe avocado and arrange with fresh cherry tomatoes.',
        'Top with poached eggs, drizzle with extra virgin olive oil, and season with sea salt and black pepper.',
      ],
      cookingTime: '15-20 minutes',
      difficulty: 'Easy' as const,
      dietaryTags: ['Vegetarian', 'High-Protein', 'Gluten-Free'],
    },
    {
      recipeName: 'Crispy Avocado Toast with Blistered Tomatoes',
      description: 'Crusty toasted sourdough layered with spiced mashed avocado, warm cherry tomatoes, and microgreens.',
      rawIngredients: [
        { name: 'Avocado', quantity: '1 ripe' },
        { name: 'Sourdough Bread', quantity: '2 thick slices' },
        { name: 'Cherry Tomatoes', quantity: '1/2 cup' },
        { name: 'Garlic', quantity: '1 clove, crushed' },
        { name: 'Lemon Juice', quantity: '1 tsp' },
        { name: 'Chili Flakes', quantity: 'Pinch' },
      ],
      instructions: [
        'Toast sourdough bread until golden brown; lightly rub with a cut clove of garlic.',
        'Mash avocado in a small bowl with lemon juice, sea salt, and freshly ground pepper.',
        'Blister cherry tomatoes in a skillet over medium-high heat for 3 minutes.',
        'Spread avocado generously on toast, arrange warm blistered tomatoes, and finish with chili flakes.',
      ],
      cookingTime: '10-12 minutes',
      difficulty: 'Easy' as const,
      dietaryTags: ['Vegan', 'Dairy-Free', 'Quick Prep'],
    },
    {
      recipeName: 'Mediterranean Salmon & Quinoa Salad',
      description: 'Pan-seared salmon fillet served over a chilled quinoa salad with diced avocado, cucumber, and lemon herb dressing.',
      rawIngredients: [
        { name: 'Salmon Fillet', quantity: '2 (150g each)' },
        { name: 'Quinoa', quantity: '1 cup cooked' },
        { name: 'Avocado', quantity: '1 diced' },
        { name: 'Cucumber', quantity: '1/2 diced' },
        { name: 'Olive Oil', quantity: '2 tbsp' },
        { name: 'Lemon Juice', quantity: '2 tbsp' },
      ],
      instructions: [
        'Season salmon fillets with sea salt, cracked black pepper, and lemon juice.',
        'Sear in a hot skillet with olive oil for 3-4 minutes per side until the skin is crisp and fish is flaky.',
        'Toss cooked quinoa with diced avocado, crisp cucumber, olive oil, and fresh lemon juice.',
        'Serve hot salmon over the chilled quinoa salad with lemon wedges.',
      ],
      cookingTime: '20-25 minutes',
      difficulty: 'Medium' as const,
      dietaryTags: ['Pescatarian', 'Keto-Friendly', 'Heart-Healthy'],
    },
  ];

  const recipes: Recipe[] = rawRecipes.map((r, index) => {
    const ingredients = r.rawIngredients.map((ing) => ({
      name: ing.name,
      quantity: ing.quantity,
      hasInPantry: checkInPantry(ing.name),
    }));
    const matchCount = ingredients.filter((i) => i.hasInPantry).length;
    const missing = ingredients.filter((i) => !i.hasInPantry).map((i) => i.name);

    return {
      id: `${r.recipeName.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      recipeName: r.recipeName,
      description: r.description,
      ingredients,
      instructions: r.instructions,
      cookingTime: r.cookingTime,
      difficulty: r.difficulty,
      dietaryTags: r.dietaryTags,
      pantryMatchCount: matchCount,
      missingIngredients: missing,
    };
  });

  return {
    dishName: 'Fresh Avocado, Eggs & Healthy Grain Spread',
    description: 'A wholesome spread of fresh avocado, farm eggs, nutritious grains, and garden vegetables ready for quick, balanced meals.',
    recipes,
    nutritionalInfo: {
      servingSize: '1 serving / bowl',
      calories: '420 kcal',
      protein: '18 g',
      carbohydrates: '38 g',
      fat: '24 g',
    },
    dietaryAlternatives: [
      { name: 'Vegan Alternative', description: 'Replace eggs with seasoned pan-seared tofu or roasted chickpeas.' },
      { name: 'Low-Carb / Keto', description: 'Swap quinoa for cauliflower rice or baby arugula.' },
      { name: 'Gluten-Free', description: 'Use gluten-free artisan bread or corn tortillas.' },
    ],
    groceryList: recipes[0].ingredients.map((i) => `${i.quantity} ${i.name}`),
  };
};

// API: Analyze food image
app.post('/api/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { base64Image, mimeType = 'image/jpeg', language = 'en', pantryItems = [] } = req.body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!apiKey || !base64Image) {
      console.info('No API key provided or empty image. Returning intelligent fallback.');
      res.json(getDemoFallbackAnalysis(pantryItems));
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let prompt = `You are a culinary expert assistant named Snap2Chef. Analyze the food item(s) in this image. Provide a comprehensive analysis in the language with code: ${language}. Respond ONLY with a valid JSON object adhering to the schema.
The user has the following ingredients in their pantry: ${pantryItems.join(', ')}.

The analysis should include:
1. A plausible appetizing name for the dish or identified ingredients.
2. An appetizing description.
3. Three creative recipe ideas with ingredients, instructions, cooking time, difficulty, dietary tags, pantryMatchCount, and missingIngredients.
4. Nutritional breakdown.
5. Dietary alternatives (e.g. vegan, low-carb, gluten-free).
6. A grocery list for ingredients in the first recipe.`;

    if (!pantryItems.length) {
      prompt += `\nThe user's pantry is currently empty. Set hasInPantry to false for all items.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const parsed = JSON.parse(response.text || '{}') as Omit<AnalysisResult, 'recipes'> & { recipes: Omit<Recipe, 'id'>[] };

    const recipesWithIds: Recipe[] = (parsed.recipes || []).map((recipe, index) => ({
      ...recipe,
      id: `${(recipe.recipeName || 'recipe').toLowerCase().replace(/\s+/g, '-')}-${index}`,
    }));

    res.json({ ...parsed, recipes: recipesWithIds });
  } catch (error: any) {
    console.warn('Gemini analysis error, falling back to demo analysis:', error?.message || error);
    res.json(getDemoFallbackAnalysis(req.body.pantryItems || []));
  }
});

// API: Culinary AI Chat
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { history = [], newMessage = '' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!apiKey) {
      const query = newMessage.toLowerCase();
      if (query.includes('substitute') || query.includes('replace') || query.includes('instead of')) {
        res.json({
          reply: '💡 **Culinary Tip:** You can substitute eggs with flaxseed meal (1 tbsp flax + 3 tbsp water = 1 egg), unsweetened applesauce, or silken tofu depending on whether you are baking or savory pan cooking!',
        });
        return;
      }
      if (query.includes('store') || query.includes('fresh') || query.includes('keep')) {
        res.json({
          reply: '🌿 **Kitchen Guide:** Store whole avocados at room temperature until ripe, then refrigerate. For cut avocado halves, brush with lemon juice or olive oil and store tightly sealed to prevent oxidation.',
        });
        return;
      }
      res.json({
        reply: `👨‍🍳 **Snap2Chef AI Assistant:** Fresh herbs like cilantro, basil, or dill are best added near the end of cooking to maintain vibrant aromas. Feel free to ask about any ingredient, timing, or cooking technique!`,
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const chat = ai.chats.create({
      model: 'gemini-flash-latest',
      config: {
        systemInstruction:
          "You are Snap2Chef's warm and expert AI culinary assistant. Answer cooking-related questions concisely, accurately, and encourage home cooks. Use markdown bullet points and bolding for clarity.",
      },
      history,
    });

    const response = await chat.sendMessage({ message: newMessage });
    res.json({ reply: response.text || 'Happy cooking!' });
  } catch (error: any) {
    console.warn('Chat error:', error?.message || error);
    res.json({
      reply: '👨‍🍳 You can substitute ingredients easily based on what is in your pantry! What would you like to cook today?',
    });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', app: 'Snap2Chef' });
});

// Dev / Prod static serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, () => {
  console.log(`Snap2Chef running on http://localhost:${PORT}`);
});
