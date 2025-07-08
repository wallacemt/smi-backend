import cors from "cors";
import dotenv from "dotenv";
import { requestLogger } from "./middleware/requestLogger";
import express, { Application } from "express";
import { swaggerSpec } from "./docs/swaggerConfiguration";
import swaggerUi from "swagger-ui-express";
import { StatusController } from "./controllers/statusController";

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
    this.app.use("/status", new StatusController().router);
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
    this.app.use(requestLogger);
    this.app.use(express.json());
  }
  listen(port: number | string) {
    this.app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
  }
}

export default new App().app;
