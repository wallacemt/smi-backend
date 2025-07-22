import * as path from "path";
import * as fs from "fs";
import { cloudinary } from "../config/cloudinary";
import { v4 as uuidv4 } from "uuid";
import { gemini } from "../config/gemini";
import { GenerateVideosOperation } from "@google/genai";
import { Exception } from "../utils/exception";

export class CloudinaryService {
  public async uploadBase64(base64: string, filename?: string, typeData: string = "image/png"): Promise<string> {
    const dataUri = `data:${typeData};base64,${base64}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "Baixio",
      public_id: filename,
    });
    return result.secure_url;
  }

  public async uploadVideo(operation: GenerateVideosOperation, fileName: string): Promise<string> {
    if (
      !operation.response?.generatedVideos ||
      operation.response.generatedVideos.length === 0 ||
      !operation.response.generatedVideos[0].video
    ) {
      throw new Exception("Nenhum vídeo ou resposta gerada.", 404);
    }

    const tempFilePath = path.join(__dirname, `../tmp/${uuidv4()}.mp4`);

    try {
      
      await gemini.files.download({
        file: operation.response.generatedVideos[0].video,
        downloadPath: tempFilePath,
      });

      const videoBuffer = fs.readFileSync(tempFilePath);

      if (!videoBuffer || videoBuffer.length === 0) {
        throw new Exception("Erro ao baixar o vídeo ou vídeo vazio.", 404);
      }
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: "Baixio",
        resource_type: "video",
        public_id: fileName,
      });
      fs.unlinkSync(tempFilePath);

      return result.secure_url;
    } catch (error) {
      fs.unlinkSync(tempFilePath); 
      throw new Exception("Erro ao fazer o upload do vídeo.", 500);
    }
  }
}
