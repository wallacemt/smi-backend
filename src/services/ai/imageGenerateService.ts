import { gemini } from "../../config/gemini";
import { GeminiImageResponse } from "../../types/aiTypes";
import { Exception } from "../../utils/exception";
import { CloudinaryService } from "../cloudinaryService";

export class ImageGenerateService {
    private cloudinaryService = new CloudinaryService();
  public async generateImage(prompt: string): Promise<GeminiImageResponse> {
    if (!prompt) throw new Exception("Prompt is required");

    const fullPrompt = `Você é um especialista em marketing e um colaborador da empresa BaixioTurismo. Siga as instruções abaixo: ${prompt}`;

    try {
      const response = await gemini.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
        },
      });

      const parts = response.generatedImages;
      if (!parts || parts.length === 0) {
        throw new Exception("Nenhuma imagem ou resposta gerada.", 500);
      }

      const imagePart = parts[0];
      if (!imagePart.image?.imageBytes) {
        throw new Exception("Imagem base64 não encontrada na resposta.", 500);
      }

      const base64Image = imagePart.image.imageBytes;

      const imagePath = await this.cloudinaryService.uploadBase64(base64Image);
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
