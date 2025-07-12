import { z } from "zod";

const envSchema = z.object({
  FRONTEND_URL: z.string(),
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  GEMINI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
