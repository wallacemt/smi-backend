import { Request, Response, Router } from "express";
import errorFilter from "../utils/isCustomError";
import { AuthService } from "../services/authService";
import { AdminDataRequest, AdminDataResponse } from "../types/companyAdminTypes";
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operações de Autenticação
 */

export class AuthController {
  public router: Router;
  private authService: AuthService = new AuthService();
  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post("/register", this.registercompanyAdmin.bind(this));
    this.router.post("/login", this.login.bind(this));
    this.router.get("/", (_req, res) => {
      res.json({ message: "Bem vindo(a)!" });
    });
  }

  private async registercompanyAdmin(req: Request, res: Response) {
    try {
      const companyAdmin: AdminDataRequest = req.body;
      const data: AdminDataResponse = await this.authService.registercompanyAdmin(companyAdmin);
      res.status(201).json({ message: "Colaborador cadastrado com sucesso!", data });
    } catch (error: unknown) {
      errorFilter(error, res);
    }
  }

  private async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const companyAdmin = await this.authService.login(email, password);
      res.status(200).json({ message: `Bem vindo(a) ${companyAdmin.name.split(" ")[0]}!`, token: companyAdmin.token });
    } catch (error: unknown) {
      errorFilter(error, res);
    }
  }
}
