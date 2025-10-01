
import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from '../types';

export async function generateInventoryInsights(data: InventoryItem[]): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const simplifiedData = data
    .map(item => `${item.category}; ${item.name}; ${item.price}; ${item.quantity}; ${item.totalValue}`)
    .join('\n');

  const prompt = `
    You are an expert inventory analyst for Norina Fashions, a fashion boutique.
    Analyze the following inventory data and provide actionable business insights.

    The data is in a simplified format: "Category; Name; Price; Quantity; Total Value".

    Here is the data:
    ${simplifiedData}

    Based on this data, please provide:
    1.  **Top 3 Highest Value Categories:** Which categories contribute most to the total inventory value?
    2.  **Urgent Re-stock List:** Identify the top 5-7 items with "Low Stock" status, especially those with higher prices, that should be re-ordered immediately.
    3.  **Potential Overstock Items:** Are there any items with very high quantity that might be considered overstocked?
    4.  **Sales & Promotion Suggestions:** Based on the stock levels, suggest 1-2 items or categories that would be good candidates for a sales promotion to clear stock.
    5.  **Overall Summary:** A brief, 2-3 sentence summary of the inventory's current health.

    Present your response in clean, easy-to-read markdown format. Use headings, bullet points, and bold text to highlight key information.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Failed to generate insights. Please check the console for more details.";
  }
}
