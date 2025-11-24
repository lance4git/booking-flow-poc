import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize the client.
// Note: In a production app, you should handle the case where the key is missing more gracefully.
const ai = new GoogleGenAI({ apiKey });

export const sendMessageToGemini = async (
  message: string, 
  history: { role: string, parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    
    // Construct the chat session
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `You are "Nordic AI", an expert logistics and supply chain assistant for Nordic Logistics (similar to Maersk). 
        Your tone is professional, helpful, and concise.
        You can help with:
        1. Explaining Incoterms (EXW, FOB, CIF, etc.).
        2. Providing general transit time estimates between major global ports.
        3. Suggesting container types for specific goods.
        4. Explaining customs procedures generally.
        
        Do not provide real-time tracking data as you don't have access to the live database, but explain *how* to track using the tracking ID.
        If the user asks about specific illegal items, politely decline.
        Keep answers under 150 words unless requested otherwise.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I apologize, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently experiencing high traffic. Please try again later.";
  }
};