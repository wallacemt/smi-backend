import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
async function checkConnection() {
  try {
    await prisma.$connect();
    console.log("Conectado ao Postgress com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao Postgress:", error);
  }
}

checkConnection();
