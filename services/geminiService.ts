import { GoogleGenAI, Type, Chat } from "@google/genai";
import { BrandIdentity, ChatMessage } from "../types";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for the structured output of the brand strategy
const brandSchema = {
  type: Type.OBJECT,
  properties: {
    companyName: { type: Type.STRING, description: "A creative company name based on the mission if not provided, or the provided name." },
    vibe: { type: Type.STRING, description: "A 3-word description of the brand aesthetic (e.g., 'Minimalist, Eco-friendly, Bold')." },
    colors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          hex: { type: Type.STRING, description: "Hex color code e.g. #FF0000" },
          name: { type: Type.STRING, description: "Creative name for the color" },
          usage: { type: Type.STRING, description: "How to use this color (e.g., Primary, Accent, Background)" }
        }
      }
    },
    typography: {
      type: Type.OBJECT,
      properties: {
        headerFont: { type: Type.STRING, description: "Name of a Google Font for headers" },
        bodyFont: { type: Type.STRING, description: "Name of a Google Font for body text" },
        reasoning: { type: Type.STRING, description: "Why these fonts were chosen" }
      }
    },
    logoPrompts: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING, description: "A detailed visual prompt for an AI image generator to create a professional, vector-style primary logo. Focus on shapes, symbols, and minimalism." },
        secondary1: { type: Type.STRING, description: "Prompt for a secondary mark or icon badge." },
        secondary2: { type: Type.STRING, description: "Prompt for a monochrome or alternative layout logo version." }
      }
    }
  },
  required: ["companyName", "vibe", "colors", "typography", "logoPrompts"]
};

export const generateBrandStrategy = async (mission: string): Promise<BrandIdentity> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Using high-reasoning model for strategy
      contents: `Create a comprehensive brand identity strategy for a company with the following mission/description: "${mission}". 
      Ensure the color palette has 5 distinct colors. 
      Select popular, accessible Google Fonts.
      Create detailed image generation prompts for the logos that specify 'white background', 'vector style', 'minimalist', 'high quality'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: brandSchema,
        thinkingConfig: { thinkingBudget: 1024 } // Allow some thinking for better creative output
      },
    });

    if (!response.text) {
      throw new Error("No response text received");
    }

    const data = JSON.parse(response.text);
    // Inject the original mission back into the object for context
    return { ...data, mission };
  } catch (error) {
    console.error("Error generating brand strategy:", error);
    throw error;
  }
};

// Chat instance holder to maintain session
let chatSession: Chat | null = null;

export const initChatSession = (brandContext: BrandIdentity) => {
  const systemInstruction = `You are the Chief Brand Officer for "${brandContext.companyName}". 
  
  Brand Context:
  - Mission: ${brandContext.mission}
  - Vibe: ${brandContext.vibe}
  - Primary Colors: ${brandContext.colors.map(c => c.name).join(', ')}
  - Fonts: ${brandContext.typography.headerFont} (Headers), ${brandContext.typography.bodyFont} (Body)

  Your goal is to help the user refine their brand, suggest marketing strategies, write copy, or explain design choices based on the generated brand identity. 
  Keep answers concise, professional, and encouraging.`;

  chatSession = ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction,
    },
  });
};

export const sendMessageToBrandBot = async (message: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized. Generate a brand first.");
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I'm having trouble thinking of a response right now.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};
