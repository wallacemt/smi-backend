import { prisma } from "../prisma/prismaClient";
import { PersonaRequest } from "../types/personas";

export class PersonaRepository {
  async findAll() {
    return await prisma.personas.findMany();
  }

  async addMany(persona: PersonaRequest[]) {
    return await prisma.personas.createMany({ data: persona });
  }

  async findById(id: string) {
    return await prisma.personas.findUnique({ where: { id } });
  }
  async delete(id: string) {
    return await prisma.$transaction([
      prisma.postsByPersonas.deleteMany({ where: { personaId: id } }),
      prisma.personas.delete({ where: { id } }),
    ]);
  }
  async countPersonas() {
    return await prisma.personas.count();
  }
}
