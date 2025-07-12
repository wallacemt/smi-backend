import { v2 as cloudinary } from "cloudinary";
import { env } from "../env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  public async uploadBase64Image(base64: string, filename?: string): Promise<string> {
    const dataUri = `data:image/png;base64,${base64}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "Baixio",
      public_id: filename,
    });
    return result.secure_url;
  }
}
