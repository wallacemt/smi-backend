export interface PostByPersonaRequest {
  title: string;
  descricao: string;
  imagem: string;
  personaId: string;
  hashtags: string[];
}

export interface ScheduledPostRequest {
  date: Date;
  time: string;
  postId: string;
  status?: "scheduled" | "posted" | "error";
}
