import { prisma } from "../prisma/prismaClient";
import { PostByPersonaRequest } from "../types/posts";

export class PostByPersonaRepository {
  async findAll() {
    return await prisma.postsByPersonas.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async add(post: PostByPersonaRequest) {
    return await prisma.postsByPersonas.create({ data: { ...post } });
  }

  async findById(id: string) {
    return await prisma.postsByPersonas.findUnique({ where: { id } });
  }

  async findByPersonaId(id: string) {
    return await prisma.postsByPersonas.findMany({ where: { personaId: id } });
  }
  async delete(id: string) {
    return await prisma.postsByPersonas.delete({ where: { id } });
  }
}
