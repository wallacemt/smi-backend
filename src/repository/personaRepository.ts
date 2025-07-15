import { prisma } from "../prisma/prismaClient";
import { PersonaRequest } from "../types/personas";

export class PersonaRepository {
  async findAll() {
    return await prisma.personas.findMany();
  }

  async addMany(persona: PersonaRequest[]) {
    return await prisma.personas.createMany({ data: persona });
  }

  async delete(id: string) {
    return await prisma.personas.delete({ where: { id } });
  }
}
