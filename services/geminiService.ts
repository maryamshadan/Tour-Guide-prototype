
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

const getAIClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API Key missing");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// AI Landmark Recognition (Vision-to-Text)
export const identifyLandmark = async (base64Image: string, lang: Language = 'en') => {
  try {
    const ai = getAIClient();
    
    const langMap = {
        en: "English",
        hi: "Hindi",
        te: "Telugu"
    };

    const prompt = `Analyze this image of a site in Telangana, India. Identify the landmark and provide its name, a 2-sentence description, and a specific safety tip for a tourist visiting this exact spot. 
    IMPORTANT: Provide the entire response in ${langMap[lang]}. 
    If the image is not a landmark, name it 'Unknown' and suggest a general safety tip.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                name: { 
                  type: Type.STRING,
                  description: "The name of the landmark identified."
                },
                description: { 
                  type: Type.STRING,
                  description: "A brief 2-sentence historical or cultural description."
                },
                safetyTip: { 
                  type: Type.STRING,
                  description: "A helpful safety or logistical tip for visitors."
                }
            },
            propertyOrdering: ["name", "description", "safetyTip"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No identification data returned from AI.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Landmark ID Error:", error);
    throw error;
  }
};

// AI Chat Guide
export const getChatResponse = async (history: {role: string, text: string}[], message: string, lang: Language = 'en') => {
    try {
        const ai = getAIClient();
        const langMap = { en: "English", hi: "Hindi", te: "Telugu" };
        
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `You are 'TourGuide', a specialized AI assistant for tourists in Telangana, India. You are knowledgeable about history, culture, and local safety protocols. 
                VERY IMPORTANT: You MUST respond in ${langMap[lang]} language. 
                Keep responses helpful, safe, and under 50 words.`,
            },
            history: history.map(h => ({
                role: h.role === 'model' ? 'model' : 'user',
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage({ message });
        return result.text || "I'm sorry, I'm having trouble processing that right now.";
    } catch (error) {
        console.error("Chat Error:", error);
        return "I'm having trouble connecting to the heritage network. Please try again later.";
    }
};
