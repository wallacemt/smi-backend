import { GoogleGenAI } from "@google/genai";
import { env } from "../env";
import { GeminiImageResponse } from "../types/aiTypes";
import fs from "fs";
import path from "path";
import { Exception } from "../utils/exception";

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});
const model = "gemini-2.5-flash";

const generateImageBaseUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${env.APP_ID}/locations/us-central1/publishers/google/models/imagen-3.0-generate-002:predict`;

export class GeminiService {
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

  private saveBase64Image(base64String: string, filename: string): string {
    const filePath = path.join(__dirname, "..", "uploads", filename);
    const buffer = Buffer.from(base64String, "base64");
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    return filePath;
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
      if (!response.ok) {
        throw new Exception("Erro ao gerar imagem.", 500);
      }

      const responseJson = await response.json();
      const predictions = responseJson.predictions;

      if (!predictions || predictions.length === 0) {
        throw new Exception("Nenhuma imagem gerada.", 500);
      }

      const base64Image = predictions[0].bytesBase64Encoded;

      const filename = `generated-image-${Date.now().toString()}.png`;
      const imagePath = this.saveBase64Image(base64Image, filename);

      return {
        mimeType: "image/png",
        imagePath,
        prompt,
      };
    } catch (error) {
      throw new Exception("Erro ao gerar imagem.", 500);
    }
  }
}
