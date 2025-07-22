import { PersonaRepository } from "../../repository/personaRepository";
import { PostByPersonaRepository } from "../../repository/postByPersonaRepository";
import { PostByPersonaRequest } from "../../types/posts";
import { Exception } from "../../utils/exception";
import { ImageGenerateService } from "./imageGenerateService";
import { TextGenerateService } from "./textGenerateService";

export class PostGeneratorService {
  private personaRepository = new PersonaRepository();
  private postRepository = new PostByPersonaRepository();
  private textGenerateService = new TextGenerateService();
  private imageGenerateService = new ImageGenerateService();


  public async generatePostForPersona(personaId: string, promptUser?: string) {
    const persona = await this.personaRepository.findById(personaId);
    if (!persona) {
      throw new Exception("Persona not found", 404);
    }

    const textPrompt = `
    Crie uma publicação de marketing digital para a seguinte persona:
      title:               ${persona.title}
      short_description:   ${persona.short_description}
      nome:                ${persona.nome}
      idade:               ${persona.idade}
      profissao:           ${persona.profissao}
      interesses:          ${persona.interesses}
      objetivos:           ${persona.objetivos}
      desafios:            ${persona.desafios}
      como_ajuda:          ${persona.como_ajuda}
      comportamento_digital: ${persona.comportamento_digital}
      poder_aquisitivo:    ${persona.poder_aquisitivo}
      localizacao:         ${persona.localizacao}
      nivel_educacional:   ${persona.nivel_educacional}
      estado_civil:        ${persona.estado_civil}
      numero_de_filhos:    ${persona.numero_de_filhos}
      preferencias_de_marca: ${persona.preferencias_de_marca}
      frequencia_de_viagem:  ${persona.frequencia_de_viagem}

      ${promptUser && `O usuario passou esse prompt: ${promptUser}, use-o para ajudar a criar a publicação.`}

      A publicação deve ser empática, inspiradora, curta e conter **hashtags estratégicas** para Instagram. Retorne em formato JSON(Não mande nenhum texo adicional, somente o JSON):
        {
        "title": "...",
        "descricao": "...",
        "hashtags": ["...", "...", "..."]
        }
    `.trim();
    const result = await this.textGenerateService.generateText(textPrompt);
    const parsed = JSON.parse(result);

    const imagePrompt = await this.textGenerateService.generateImagePromptByText(parsed.descricao);

    const image = await this.imageGenerateService.generateImage(imagePrompt!);

    const post: PostByPersonaRequest = {
      title: parsed.title,
      descricao: parsed.descricao,
      hashtags: parsed.hashtags,
      imagem: image.imagePath,
      personaId,
    };
    const response = await this.postRepository.add(post);
    return response;
  }

  public async getGeneratedPosts() {
    return await this.postRepository.findAll();
  }

  public async deletePostById(id: string) {
    if (!id || id === ":id" || id === null) {
      throw new Exception("id is required", 400);
    }
    if ((await this.postRepository.findById(id)) === null) {
      throw new Exception("id not found", 404);
    }
    return this.postRepository.delete(id);
  }

  public async getPostsByPersona(id: string) {
    if (!id || id === ":id" || id === null) {
      throw new Exception("id is required", 400);
    }
    if ((await this.personaRepository.findById(id)) === null) {
      throw new Exception("id not found", 404);
    }
    return this.postRepository.findByPersonaId(id);
  }
}
