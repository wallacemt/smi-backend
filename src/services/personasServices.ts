import { GoogleGenAI } from "@google/genai";
import { env } from "../env";
import { ScrapingService } from "./scrapingService";
import { PersonaRequest } from "../types/personas";
import { PersonaRepository } from "../repository/personaRepository";

const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
const model = "gemini-2.5-flash";
export class PersonaGeneratorService {
  private scrapingService = new ScrapingService();
  private personasRepository = new PersonaRepository();
  public async savePersonas(personas: PersonaRequest[]) {
    return await this.personasRepository.addMany(personas);
  }

  public async generatePersonas() {
    const scrapedData = await this.scrapingService.scrapeMultiplePages();

    const prompt = `
        Você é um estraregista de markering digital.
        Com base no conteúdo extraído de um site de turismo chamado BaixioTurismo, gere **3 personas ideias** para campanhas de marketing.

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
      model,
      contents: [{ text: prompt }],
    });

    const jsonRaw = result.text?.replace(/```json\n?/, "").replace(/\n?```/, "");
    const parsed = JSON.parse(jsonRaw!);

    try {
      const personas = await this.savePersonas(parsed.personas);
      return personas;
    } catch (err: unknown) {
      console.error("Erro ao salvar personas:", err);
      throw err;
    }
  }
}
