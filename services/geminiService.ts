import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { PRODUCTS, GEMINI_MODEL } from '../constants';

let chatSession: Chat | null = null;

const initializeChat = () => {
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  // Create system instruction with product context
  const productCatalog = PRODUCTS.map(p => 
    `${p.name} (ID: ${p.id}, Category: ${p.category}, Price: $${p.price}): ${p.description}`
  ).join('\n');

  const systemInstruction = `
    You are 'SAR', the advanced AI assistant for SAR Legacy.
    Your goal is to help customers find premium products, explain technical features, and suggest items based on their sophisticated needs.
    
    Here is our current Product Catalog:
    ${productCatalog}

    Rules:
    1. Only recommend products from this catalog.
    2. If a user asks for something we don't have, politely suggest a similar item from the catalog or say we don't stock it currently.
    3. Be concise, professional, and maintain a somewhat futuristic, high-end tone.
    4. Format prices clearly (e.g., $199.99).
    5. Do not invent products.
    6. Refer to the store as "SAR Legacy".
  `;

  try {
    chatSession = ai.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat session:", error);
    return null;
  }

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  const chat = initializeChat();
  if (!chat) {
    return "I'm currently offline. Please check your API key configuration.";
  }

  try {
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I didn't catch that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection interrupted. Please try again later.";
  }
};