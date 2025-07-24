import { SchedulePostRepository } from "../repository/shedulePostRepository";
import { ScheduledPostRequest } from "../types/posts";
import { Exception } from "../utils/exception";

export class SchedulePostService {
  private shedulePostRepository = new SchedulePostRepository();

  public async getAllScheduledPosts() {
    return await this.shedulePostRepository.getAllScheduledPosts();
  }

  public async createScheduledPost(data: ScheduledPostRequest) {
    if (await this.shedulePostRepository.getScheduledPostByPostId(data.postId)) {
      throw new Exception("Este Post já está agendado.", 403);
    }
    if (new Date(data.date) < new Date()) {
      throw new Exception("A data agendada não pode ser no passado.", 400);
    }
    if (!data.time || !data.date) {
      throw new Exception("Data e hora são obrigatórios.", 400);
    }
    if (!data.postId) {
      throw new Exception("Post ID é obrigatório.", 400);
    }
    return await this.shedulePostRepository.createScheduledPost(data);
  }
  public async getScheduledPostById(id: string) {
    if (!id || id === ":id" || id === null) {
      throw new Exception("id is required", 400);
    }
    const data = await this.shedulePostRepository.getScheduledPostById(id);
    if (!data) throw new Exception("Agendamento não encontrado", 404);
    return data;
  }
  public async deleteScheduledPostById(id: string) {
    if (!id || id === ":id" || id === null) {
      throw new Exception("id is required", 400);
    }
    if (!(await this.shedulePostRepository.getScheduledPostById(id)))
      throw new Exception("Agendamento nao encontrado", 404);


    return await this.shedulePostRepository.deleteScheduledPostById(id);
  }
}
