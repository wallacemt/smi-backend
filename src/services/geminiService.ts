import { GoogleGenAI } from "@google/genai";
import { env } from "../env";
import { GeminiImageResponse, GeminiImageResponseJson } from "../types/aiTypes";
import fs from "fs";
import path from "path";
import { Exception } from "../utils/exception";
import { CloudinaryService } from "./cloudinaryService";

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});
const model = "gemini-2.5-flash";

const generateImageBaseUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${env.APP_ID}/locations/us-central1/publishers/google/models/imagen-3.0-generate-002:predict`;

export class GeminiService {
  cloudinaryService = new CloudinaryService();
  public async checkConnection() {
    const prompt = `return json with keys "status":string("healthy" or "unhealthy"), "model" = gemini-2.0-flash, "version":number(ex: 1.2), "latency":number(ms) and respective values`;
    const resp = await gemini.models.generateContent({
      model: model,
      contents: [{ text: prompt }],
    });

    const jsonResp = resp.text?.replace(/```json\n/, "").replace(/\n```/, "");
    const parsed = JSON.parse(jsonResp!);
    return parsed;
  }

  public async generateImage(prompt: string): Promise<GeminiImageResponse> {
    if (!prompt) throw new Error("Prompt is required");
    const generateBody = {
      instances: [
        {
          prompt,
        },
      ],
      parameters: {
        sampleCount: 1,
      },
    };
    try {
      const response = await fetch(generateImageBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.GCLOUD_TOKEN}`,
        },
        body: JSON.stringify(generateBody),
      });
      console.log(response);
      const responseJson = (await response.json()) as GeminiImageResponseJson;
      const predictions = responseJson.predictions;

      if (!predictions || predictions.length === 0) {
        throw new Exception("Nenhuma imagem gerada.", 500);
      }

      const base64Image = predictions[0].bytesBase64Encoded;

      const imagePath = await this.cloudinaryService.uploadBase64Image(base64Image);
      return {
        mimeType: "image/png",
        imagePath,
        prompt,
      };
    } catch (error) {
      throw error;
    }
  }
}
