import { GoogleGenAI } from "@google/genai";
import { ScrapingService } from "../scrapingService";
import { PersonaRepository } from "../../repository/personaRepository";
import { PersonaRequest } from "../../types/personas";
import { Exception } from "../../utils/exception";
import { gemini } from "../../config/gemini";


export class PersonaGeneratorService {
  private scrapingService = new ScrapingService();
  private personasRepository = new PersonaRepository();
  public async savePersonas(personas: PersonaRequest[]) {
    return await this.personasRepository.addMany(personas);
  }

  public async generatePersonas() {
    const scrapedData = await this.scrapingService.scrapeMultiplePages();
    const count = await this.personasRepository.countPersonas();
    if (count >= 3) {
      throw new Exception("Limite de personas atingido", 409);
    }

    const toGenerate = 3 - count;
    const prompt = `
        Você é um estraregista de markering digital.
        Com base no conteúdo extraído de um site de turismo chamado BaixioTurismo, gere **${toGenerate} personas ideias** para campanhas de marketing.

        Para cada persona, inclua: 
        - Nome
        - Idade aproximada
        - Profissão ou ocupação
        - Interesses e hobbies
        - Objetivo pessoais ou de viagem
        - Desafios/dificuldades enfrentados
        - Como o serviço pode ajudá-la
        - Comportamento digital (ex: redes sociais que usa)

        Conteúdo coletado: 
        ${JSON.stringify(scrapedData)}

        Retorne a resposta em formato JSON no padrão (nao mande nenhum texo adicional, somente o JSON):
        {
        "personas": [
            {
                "title": "...",
                "short_description": "...",
                "nome": "...",
                "idade": "...",
                "profissao": "...",
                "interesses": "...",
                "objetivos": "...",
                "desafios": "...",
                "como_ajuda": "...",
                "comportamento_digital": "...",
                "poder_aquisitivo": "...",
                "localizacao": "...",
                "nivel_educacional": "...",
                "estado_civil": "...",
                "numero_de_filhos": "...",
                "preferencias_de_marca": "...",
                "frequencia_de_viagem": "..."

            },
        ]
        }
        `;
    const result = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });

    const jsonRaw = result.text?.replace(/```json\n?/, "").replace(/\n?```/, "");
    const parsed = JSON.parse(jsonRaw!);

    try {
      await this.savePersonas(parsed.personas);
      const personas = await this.getPersonas();
      return personas;
    } catch (err: unknown) {
      console.error("Erro ao salvar personas:", err);
      throw err;
    }
  }

  public async getPersonas() {
    return await this.personasRepository.findAll();
  }

  public async deletePersonaById(id: string) {
    if (!id || id === ":id" || id === null) {
      throw new Exception("id is required", 400);
    }
    if ((await this.personasRepository.findById(id)) === null) {
      throw new Exception("id not found", 404);
    }

    return this.personasRepository.delete(id);
  }
  public async getPersonaById(id: string) {
    if (!id || id === ":id" || id === null) {
      throw new Exception("id is required", 400);
    }
    if ((await this.personasRepository.findById(id)) === null) {
      throw new Exception("id not found", 404);
    }
    return this.personasRepository.findById(id);
  }
}
