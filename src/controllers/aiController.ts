import { Router, Request, Response } from "express";
import AuthPolice from "../middleware/authPolice";
import errorFilter from "../utils/isCustomError";
import { PostGeneratorService } from "../services/ai/postGeneratorService";
import { PersonaGeneratorService } from "../services/ai/personasServices";
import { VideoGenerateService } from "../services/ai/videoGenerateService";

/**
 * @swagger
 * tags:
 *   name: AI Api
 *   description: Rotas da AI da sistema
 */
export class GeminiController {
  public router: Router;
  private personaService = new PersonaGeneratorService();
  private postGenService = new PostGeneratorService();
  private videoGen = new VideoGenerateService();
  constructor() {
    this.router = Router();
    this.aiRoutes();
  }
  private aiRoutes() {
    this.router.use(AuthPolice);
    this.router.post("/generate-personas", this.generatePersonas.bind(this));
    this.router.get("/personas", this.getPersonas.bind(this));
    this.router.get("/personas/:id", this.getPersonaById.bind(this));
    this.router.delete("/personas/:id", this.deletePersonaById.bind(this));

    this.router.post("/persona/:id/generate-post", this.generatePostByPersona.bind(this));
    this.router.get("/posts", this.getGeneratedPosts.bind(this));
    this.router.get("/posts/:id", this.getPostById.bind(this));
    this.router.get("/posts/persona/:id", this.getPostsByPersona.bind(this));
    this.router.delete("/posts/:id", this.deletePostById.bind(this));

    this.router.post("/generate-video", this.generateVideo.bind(this));
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
  public async getPostById(req: Request, res: Response) {
    try {
      const post = await this.postGenService.getPostById(req.params.id);
      res.status(200).json(post);
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
  public async generateVideo(req: Request, res: Response) {
    try {
      const { prompt } = req.body;
      const data = await this.videoGen.generateVideo(prompt);
      res.status(201).json(data);
    } catch (err) {
      errorFilter(err, res);
    }
  }
}
