import { Router, Request, Response } from "express";
import { CompanyService } from "../services/companyService";
import AuthPolice from "../middleware/authPolice";
import errorFilter from "../utils/isCustomError";

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
    this.router.get("/:id/scraping", this.screapingResult.bind(this));
  }

  public getCompanyData(req: Request, res: Response) {
    this.companyService
      .getCompanyData()
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json({ error: "Erro ao obter empresas", details: err }));
  }

  private async getCompanyDataById(req: Request, res: Response) {
    try {
      const data = await this.companyService.getCompanyDataById(req.params.id);
      res.status(200).json(data);
    } catch (err: unknown) {
      errorFilter(err, res);
    }
  }

  public async addCompanyData(req: Request, res: Response) {
    try {
      const data = await this.companyService.addCompanyData(req.body);
      res.status(201).json(data);
    } catch (err: unknown) {
      errorFilter(err, res);
    }
  }

  public async updateCompanyData(req: Request, res: Response) {
    try {
      const data = await this.companyService.updateCompanyData(req.body, req.params.id);
      res.status(200).json(data);
    } catch (err: unknown) {
      errorFilter(err, res);
    }
  }

  public async deleteCompanyData(req: Request, res: Response) {
    try {
      const data = await this.companyService.deleteCompanyData(req.params.id);
      if (data) res.status(200).json({ message: "data is removed" });
    } catch (err: unknown) {
      errorFilter(err, res);
    }
  }
  public async screapingResult(req: Request, res: Response) {
    try {
      const data = await this.companyService.scrapingResult();
      res.status(200).json(data);
    } catch (err: unknown) {
      errorFilter(err, res);
    }
  }
}
