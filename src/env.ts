import { z } from "zod";

const envSchema = z.object({
  FRONTEND_URL: z.string(),
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  GEMINI_API_KEY: z.string(),
  APP_ID: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
