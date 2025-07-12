import { Router, Request, Response } from "express";
import AuthPolice from "../middleware/authPolice";
import errorFilter from "../utils/isCustomError";
import { GeminiService } from "../services/geminiService";

/**
 * @swagger
 * tags:
 *   name: AI Api
 *   description: Rotas da AI da sistema
 */
export class GeminiController {
  public router: Router;
  public aiService = new GeminiService();

  constructor() {
    this.router = Router();
    this.aiRoutes();
  }
  private aiRoutes() {
    this.router.use(AuthPolice);
    this.router.post("/generate-image", this.generateImage.bind(this));
  }

  public async generateImage(req: Request, res: Response): Promise<void> {
    const { prompt } = req.body;
    try {
      const imageResponse = await this.aiService.generateImage(prompt);
      res.status(201).send(imageResponse);
    } catch (err: unknown) {
      console.error("Erro ao gerar imagem:", err);
      errorFilter(err, res);
    }
  }
}
