import { Router, Request, Response } from "express";
import { CompanyService } from "../services/companyService";
import AuthPolice from "../middleware/authPolice";

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Rotas de Crud do banco de dados de empresas Baixio
 */
export class CompanyController {
  public router: Router;
  private companyService: CompanyService;
  constructor() {
    this.router = Router();
    this.companyService = new CompanyService();
    this.routes();
  }

  private routes() {
    this.router.use(AuthPolice);
    this.router.get("/", this.getCompanyData.bind(this));
    this.router.get("/:id", this.getCompanyDataById.bind(this));
    this.router.post("/", this.addCompanyData.bind(this));
    this.router.put("/:id", this.updateCompanyData.bind(this));
    this.router.delete("/:id", this.deleteCompanyData.bind(this));
  }

  public getCompanyData(req: Request, res: Response) {
    this.companyService
      .getCompanyData()
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json({ error: "Erro ao obter empresas", details: err }));
  }

  public getCompanyDataById(req: Request, res: Response) {
    this.companyService
      .getCompanyDataById(req.params.id)
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json({ error: "Erro ao obter empresa", details: err }));
  }

  public addCompanyData(req: Request, res: Response) {
    this.companyService
      .addCompanyData(req.body)
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json({ error: "Erro ao adicionar empresa", details: err }));
  }

  public updateCompanyData(req: Request, res: Response) {
    this.companyService
      .updateCompanyData(req.body, req.params.id)
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json({ error: "Erro ao atualizar empresa", details: err }));
  }

  public deleteCompanyData(req: Request, res: Response) {
    this.companyService
      .deleteCompanyData(req.params.id)
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json({ error: "Erro ao deletar empresa", details: err }));
  }
}
