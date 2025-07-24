import axios from "axios";
import { gemini } from "../../config/gemini";
import { GeminiVideoResponse } from "../../types/aiTypes";
import { Exception } from "../../utils/exception";
import { CloudinaryService } from "../cloudinaryService";
import * as fs from "fs";
export class VideoGenerateService {
  private cloudinaryService = new CloudinaryService();
  public async generateVideo(prompt: string): Promise<GeminiVideoResponse> {
    if (!prompt) throw new Exception("Prompt is required");
    const fullPrompt = `Você é um especialista em marketing e em videos profissionais e um colaborador da empresa BaixioTurismo. Siga as instruções abaixo: ${prompt}`;
    try {
      const image = fs.readFileSync("./public/bxio.jpg", "base64");

      let operation = await gemini.models.generateVideos({
        model: "veo-3.0-generate-preview",
        prompt: fullPrompt,
        config: { numberOfVideos: 1, aspectRatio: "16:9" },
        image: {
          imageBytes: image,
          mimeType: "image/png",
        },
      });
      while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        operation = await gemini.operations.getVideosOperation({ operation: operation });
      }

      const videoPath = await this.cloudinaryService.uploadVideo(operation, `video-${Date.now()}`);
      return {
        mimeType: "video/mp4",
        videoPath,
        prompt,
      };
    } catch (error) {
      console.error("Error generating video:", error);
      throw new Error("Failed to generate video");
    }
  }
}
