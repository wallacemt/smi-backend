import { prisma } from "../prisma/prismaClient";
import { ScheduledPostRequest } from "../types/posts";

export class SchedulePostRepository {
  async getAllScheduledPosts() {
    return await prisma.shedulePost.findMany({
      orderBy: { date: "asc" },
      select: {
        id: true,
        time: true,
        date: true,
        post: {
          select: {
            id: true,
            title: true,
            descricao: true,
            imagem: true,
          },
        },
      },
    });
  }
  async createScheduledPost(data: ScheduledPostRequest) {
    return await prisma.shedulePost.create({
      data,
    });
  }
  async getScheduledPostById(id: string) {
    return await prisma.shedulePost.findUnique({
      where: { id },
    });
  }
  async getScheduledPostByPostId(postId: string) {
    return await prisma.shedulePost.findUnique({
      where: { postId },
    });
  }
  async deleteScheduledPostById(id: string) {
    return await prisma.shedulePost.delete({
      where: { id },
    });
  }
}
