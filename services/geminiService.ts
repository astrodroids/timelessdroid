import { GoogleGenAI } from "@google/genai";
import { SearchResult } from '../types';

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not set");
    }
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

// This function is called by the Live API via tool calling
export const performSearch = async (query: string): Promise<SearchResult> => {
  const ai = getGenAI();
  
  console.log(`[Gemini 3 Flash] Searching for: ${query}`);
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please search for: ${query}. Summarize the results concisely for a voice response.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "I couldn't find anything on that.";
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return {
    text,
    groundingChunks: groundingChunks as any[],
  };
};

export const createLiveSession = () => {
  const ai = getGenAI();
  return ai;
};
