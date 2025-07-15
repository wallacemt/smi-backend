import { Router, Request, Response } from "express";
import AuthPolice from "../middleware/authPolice";
import errorFilter from "../utils/isCustomError";
import { GeminiService } from "../services/geminiService";
import { PersonaGeneratorService } from "../services/personasServices";

/**
 * @swagger
 * tags:
 *   name: AI Api
 *   description: Rotas da AI da sistema
 */
export class GeminiController {
  public router: Router;
  public aiService = new GeminiService();
  public personaService = new PersonaGeneratorService();

  constructor() {
    this.router = Router();
    this.aiRoutes();
  }
  private aiRoutes() {
    this.router.use(AuthPolice);
    this.router.post("/generate-image", this.generateImage.bind(this));
    this.router.post("/generate-personas", this.generatePersonas.bind(this));
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
  public async generatePersonas(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.personaService.generatePersonas();
      res.status(201).send(response);
    } catch (err: unknown) {
      console.error("Erro ao gerar personas:", err);
      errorFilter(err, res);
    }
  }
}
