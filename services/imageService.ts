import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLogoImage = async (prompt: string): Promise<string> => {
  try {
    // Ensure prompt enforces clean background and style
    const enhancedPrompt = `${prompt}. White background, flat vector style, professional logo design, high contrast, minimalist.`;
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: enhancedPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
        outputMimeType: 'image/jpeg',
      },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    
    if (!base64ImageBytes) {
      throw new Error("No image generated");
    }

    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a placeholder if generation fails to avoid crashing the UI
    return "https://picsum.photos/500/500?blur=2";
  }
};
