
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getStudyAssistance = async (history: Message[], prompt: string, context?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [{ text: `System Context: You are a helpful AI Study Assistant. ${context ? `The user is currently studying a document with the following title: ${context}` : ''} Keep your answers concise, encouraging, and educational.` }]
        },
        ...history.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        })),
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to the study assistant. Please check your connection.";
  }
};
