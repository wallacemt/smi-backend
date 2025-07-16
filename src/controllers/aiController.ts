import { Router, Request, Response } from "express";
import AuthPolice from "../middleware/authPolice";
import errorFilter from "../utils/isCustomError";
import { GeminiService } from "../services/geminiService";
import { PersonaGeneratorService } from "../services/personasServices";
import { PostGeneratorService } from "../services/postGeneratorService";

/**
 * @swagger
 * tags:
 *   name: AI Api
 *   description: Rotas da AI da sistema
 */
export class GeminiController {
  public router: Router;
  private aiService = new GeminiService();
  private personaService = new PersonaGeneratorService();
  private postGenService = new PostGeneratorService();

  constructor() {
    this.router = Router();
    this.aiRoutes();
  }
  private aiRoutes() {
    this.router.use(AuthPolice);
    this.router.post("/generate-image", this.generateImage.bind(this));
    this.router.post("/generate-personas", this.generatePersonas.bind(this));
    this.router.get("/personas", this.getPersonas.bind(this));
    this.router.get("/personas/:id", this.getPersonaById.bind(this));
    this.router.delete("/personas/:id", this.deletePersonaById.bind(this));

    this.router.post("/persona/:id/generate-post", this.generatePostByPersona.bind(this));
    this.router.get("/posts", this.getGeneratedPosts.bind(this));
    this.router.get("/posts/persona/:id", this.getPostsByPersona.bind(this));
    this.router.delete("/posts/:id", this.deletePostById.bind(this));
  }

  public async generateImage(req: Request, res: Response): Promise<void> {
    const { prompt } = req.body;
    try {
      const imageResponse = await this.aiService.generateImage(prompt);
      res.status(201).send(imageResponse);
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
      errorFilter(err, res);
    }
  }
  public async generatePersonas(_req: Request, res: Response): Promise<void> {
    try {
      const response = await this.personaService.generatePersonas();
      res.status(201).send(response);
    } catch (err) {
      console.error("Erro ao gerar personas:", err);
      errorFilter(err, res);
    }
  }
  public async generatePostByPersona(req: Request, res: Response) {
    const { id } = req.params;
    const { prompt } = req.body;
    try {
      const post = await this.postGenService.generatePostForPersona(id, prompt);
      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      errorFilter(err, res);
    }
  }
  public async getPersonas(_req: Request, res: Response) {
    try {
      const personas = await this.personaService.getPersonas();
      res.status(200).json(personas);
    } catch (err) {
      console.error(err);
      errorFilter(err, res);
    }
  }
  public async getGeneratedPosts(_req: Request, res: Response) {
    try {
      const posts = await this.postGenService.getGeneratedPosts();
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      errorFilter(err, res);
    }
  }
  public async deletePersonaById(req: Request, res: Response) {
    try {
      const data = await this.personaService.deletePersonaById(req.params.id);
      if (data) res.status(200).json({ message: "data is removed" });
    } catch (err: unknown) {
      errorFilter(err, res);
    }
  }
  public async deletePostById(req: Request, res: Response) {
    try {
      const data = await this.postGenService.deletePostById(req.params.id);
      if (data) res.status(200).json({ message: "data is removed" });
    } catch (err: unknown) {
      errorFilter(err, res);
    }
  }
  public async getPostsByPersona(req: Request, res: Response) {
    try {
      const posts = await this.postGenService.getPostsByPersona(req.params.id);
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      errorFilter(err, res);
    }
  }
  public async getPersonaById(req: Request, res: Response) {
    try {
      const persona = await this.personaService.getPersonaById(req.params.id);
      res.status(200).json(persona);
    } catch (err) {
      console.error(err);
      errorFilter(err, res);
    }
  }
}
