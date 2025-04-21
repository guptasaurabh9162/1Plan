// src/utils/geminiApi.jsx
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateContent = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    return result.response.text(); // Ensures the function returns text response
  } catch (error) {
    console.error("📌 Gemini API Error:", error);
    throw error;
  }
};
