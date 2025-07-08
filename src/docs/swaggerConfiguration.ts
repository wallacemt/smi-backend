import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Baixio Turismo API",
      version: "1.0.0",
      description: "Documentação da API Do Sistema Inteligente de Marketing.",
    },
    servers: [
      {
        url: "http://localhost:8081",
        description: "Servidor de Desenvolvimento",
      },
      {
        url: "https://vercel-api.com",
        description: "Servidor de Produção",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/controllers/**/*.ts", "./src/docs/schemas/*.yaml", "./src/docs/paths/*.yaml"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
