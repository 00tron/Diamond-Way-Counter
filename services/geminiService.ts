
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMantraInsight = async (mantraName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a short, spiritually uplifting insight about the mantra: "${mantraName}". Focus on its traditional meaning and how repeating it 11,111 times can impact one's mindfulness. Keep it under 100 words.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The path to mindfulness is built one breath, one mantra at a time.";
  }
};

export const suggestMantra = async (intent: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user is looking for a mantra for: "${intent}". Suggest 3 traditional Sanskrit or Buddhist mantras with their translations and benefits. Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              translation: { type: Type.STRING },
              benefit: { type: Type.STRING }
            },
            required: ["name", "translation", "benefit"]
          }
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { name: "Om Mani Padme Hum", translation: "The jewel is in the lotus", benefit: "Compassion and wisdom" },
      { name: "Om Namah Shivaya", translation: "I bow to the inner self", benefit: "Peace and self-realization" },
      { name: "So Hum", translation: "I am that", benefit: "Connection to the universe" }
    ];
  }
};
