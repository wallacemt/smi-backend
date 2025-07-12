import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swaggerConfiguration";
import { StatusController } from "./controllers/statusController";
import { AuthController } from "./controllers/authController";
import { CompanyController } from "./controllers/companyController";
import { GeminiController } from "./controllers/aiController";
import { requestLogger } from "./middleware/requestLogger";

dotenv.config();
class App {
  public app: Application;
  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.listen(process.env.PORT || 3000);
  }
  routes() {
    this.app.get("/", (_req, res) => res.redirect("/docs"));
    this.app.use("/uploads", express.static("uploads"));
    this.app.use("/status", new StatusController().router);
    this.app.use("/auth", new AuthController().router);
    this.app.use("/company", new CompanyController().router);
    this.app.use("/ai", new GeminiController().router);
    this.app.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
          validatorUrl: null,
          tryItOutEnabled: true,
          displayRequestDuration: true,
        },
      })
    );
  }
  config() {
    this.app.use(cors({ origin: process.env.FRONTEND_URL }));
    if (process.env.NODE_ENV !== "production") this.app.use(requestLogger);
    this.app.use(express.json());
  }
  listen(port: number | string) {
    this.app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
  }
}

export default new App().app;
