import axios from "axios";
import * as cheerio from "cheerio";
const urls = [
  "https://baixioturismo.com.br/pt/",
  "https://baixioturismo.com.br/pt/sobre-baixio/",
  "https://baixioturismo.com.br/pt/pacotes/viva-baixio-com-o-charme-da-aldeola/",
  "https://baixioturismo.com.br/pt/pacotes/viva-baixio-com-sofisticacao/",
  "https://baixioturismo.com.br/pt/pacotes/pacote-curta-baixio-em-ponta-de-inhambupe/",
  "https://baixioturismo.com.br/pt/pacotes/pacote-curta-baixio/",
  "https://baixioturismo.com.br/pt/agenda-baixio/",
  "https://baixioturismo.com.br/pt/experiencias-e-passeios/",
];
export class ScrapingService {
  public async scrapePage(url: string): Promise<Record<string, unknown>> {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $("title").text();
    const headings = $("h1, h2, h3")
      .map((_, el) => $(el).text())
      .get()
      .join(" | ");
    const paragraphs = $("p")
      .map((_, el) => $(el).text())
      .get()
      .join(" ");

    return {
      [url]: {
        title,
        headings,
        paragraphs: paragraphs.slice(0, 2000),
      },
    };
  }
  public async scrapeMultiplePages(): Promise<Record<string, { title: string; headings: string; paragraphs: string }>> {
    const chunks = await Promise.all(urls.map((url) => this.scrapePage(url)));
    return Object.assign({}, ...chunks);
  }
}
