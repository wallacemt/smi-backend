import { GoogleGenAI } from "@google/genai";
import { env } from "../env";
const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});
const model = "gemini-2.5-flash";
export class GeminiService {
  public async checkConnection() {
    const prompt = `return json with keys "status":string("healthy" or "unhealthy"), "model" = gemini-2.0-flash, "version":number(ex: 1.2), "latency":number(ms) and respective values`;
    const resp = await gemini.models.generateContent({
      model,
      contents: [{ text: prompt }],
    });

    const jsonResp = resp.text?.replace(/```json\n/, "").replace(/\n```/, "");
    const parsed = JSON.parse(jsonResp!);
    return parsed;
  }
}
