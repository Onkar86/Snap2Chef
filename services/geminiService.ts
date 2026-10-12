import type { AnalysisResult } from '../types';

export const generateAnalysis = async (
  base64Image: string,
  mimeType: string,
  language: string,
  pantryItems: string[]
): Promise<AnalysisResult> => {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image,
        mimeType,
        language,
        pantryItems,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data: AnalysisResult = await res.json();
    return data;
  } catch (error) {
    console.error('Error requesting /api/analyze:', error);
    throw error;
  }
};

export const generateChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
): Promise<string> => {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history,
        newMessage,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.reply || 'Happy cooking!';
  } catch (error) {
    console.error('Error in chat request:', error);
    return '👨‍🍳 I am here to help you cook! Try asking about ingredient substitutes or storage tips.';
  }
};
