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
  public routerPublic: Router;
  public aiService = new GeminiService();
  constructor() {
    this.routerPublic = Router();
    this.routesPublic();
  }
  private routesPublic() {
  }


}
