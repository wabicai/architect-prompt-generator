import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_ID } from '../constants';
import { AnalysisScope } from '../types';

export const analyzeImage = async (
  apiKey: string,
  base64Image: string | null,
  url: string,
  systemPrompt: string,
  scope: AnalysisScope
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct the prompt based on available inputs and scope
  let finalPrompt = `Analysis Scope: ${scope === 'site' ? 'ENTIRE WEBSITE DESIGN SYSTEM' : 'SINGLE PAGE LAYOUT'}\n`;
  
  if (url) {
    finalPrompt += `Context URL: ${url}\n`;
  }
  
  finalPrompt += `\n${systemPrompt}`;
  
  if (!base64Image) {
    finalPrompt += "\n\nNote: No screenshot was provided. Please perform a best-effort analysis based on the URL context (if known) or general design principles for this type of application.";
  }

  const parts: any[] = [{ text: finalPrompt }];

  if (base64Image) {
    // Remove data URL prefix if present
    const cleanBase64 = base64Image.split(',')[1] || base64Image;
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: cleanBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_ID,
      contents: {
        parts: parts
      },
      config: {
        temperature: 0.4,
      }
    });

    if (!response.text) {
      throw new Error("No response generated from the model.");
    }

    return response.text;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to analyze.");
  }
};