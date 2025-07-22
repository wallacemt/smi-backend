import { gemini } from "../../config/gemini";
import { Exception } from "../../utils/exception";

export class TextGenerateService {
  public async generateText(prompt: string): Promise<string> {
    if (!prompt) throw new Exception("Prompt is required", 400);

    const fullPrompt = `Você é um especialista em marketing e um colaborador da empresa BaixioTurismo. Siga as instruções abaixo: ${prompt}`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: fullPrompt }],
    });

    const generatedText = response.text?.replace(/```json\n/, "").replace(/\n```/, "");
    return generatedText!;
  }
  public async generateImagePromptByText(text: string) {
    if (!text) throw new Exception("Text is required");
    const prompt = `
        Você e um especialista em design e imagem e um colaborador da empresa BaixioTurismo, e deverá gerar um prompt para geração de uma imagem baseado no seguinte texto: ${text}.
        Siga as instruções e dicas abaixo:
      - tip: O prompt deve ser claro e direto, sem palavras de preposição ou conjunções.
          use algumas das boas pratica quando gerar o prompt ex (gere prompt em inglês):
      - OBS: o comprimento máximo do comando é de 480 tokens.
      - exemple: um homem vestindo roupas brancas sentado na praia, de perto, com iluminação de golden hour 
      - tip: Um bom comando é descritivo e claro, e usa modificadores e palavras-chave significativas. Comece pensando no assunto, contexto e estilo.
      - example: foto de uma mulher de 20 anos, fotografia de rua, imagem estática de um filme, tons quentes de laranja suave
      - example: uma foto de um edifício moderno com água em segundo plano
      
      O retorno deve ser um texto de prompt para geração de imagens.`;
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });
    return response.text;
  }
   public async checkConnection() {
    const prompt = `return json with keys "status":string("healthy" or "unhealthy"), "model" = gemini-2.0-flash, "version":number(ex: 1.2), "latency":number(ms) and respective values`;
    const resp = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });

    const jsonResp = resp.text?.replace(/```json\n/, "").replace(/\n```/, "");
    return JSON.parse(jsonResp!);
  }
}
