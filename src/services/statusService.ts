import { prisma } from "../prisma/prismaClient";
import { GeminiService } from "./geminiService";

export class StatusService {
  private aiService = new GeminiService();
  async getStatus() {
    const database: any = {};
    const server: any = {};
    const ai_service: any = {};
    try {
      const start = Date.now();
      await prisma.$queryRawUnsafe(`SELECT 1`);
      const latency = Date.now() - start;

      database.status = "healthy";
      database.latência = `${latency}ms`;
      database.versão = await prisma.$queryRaw`SHOW server_version`;
    } catch (err: unknown) {
      database.status = "unhealthy";
      database.erro = err;
    }

    try {
      const status = await this.aiService.checkConnection();
      ai_service.ai = status ;
    } catch (error) {
      ai_service.status = "unhealthy";
      ai_service.erro = error;
    }

    server.versão = process.version;
    server.status = "healthy";
    server.ambiente = process.env.NODE_ENV || "development";
    server.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    server.versão_node = process.version;
    server.plataforma = process.platform;
    server.região = process.env.RENDER_REGION || "desconhecida";

    return {
      updatedAt: new Date().toISOString(),
      database,
      ai_service,
      server,
    };
  }
}
