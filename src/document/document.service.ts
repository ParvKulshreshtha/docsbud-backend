import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class DocumentService {
  constructor(private aiService: AiService) {}

  async processPdf(fileBuffer: Buffer) {
    const text = await this.extractText(fileBuffer);
    const cleanedText = this.cleanText(text);
    const chunks = this.chunkText(cleanedText);
    const embeddings = await this.aiService.createEmbedding(chunks);
    console.log(embeddings)
    return chunks;
  }

  private async extractText(fileBuffer: Buffer) {
    const parser = new PDFParse({data:fileBuffer});
    const data = await parser.getText()
    await parser.destroy();
    return data.text;
  }

  private cleanText(text: string) {
    return text
      .replace(/\n+/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private chunkText(text: string, chunkSize = 800, overlap = 100) {
    const chunks:string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = start + chunkSize;
      const chunk = text.slice(start, end);

      chunks.push(chunk);
      start += chunkSize - overlap;
    }

    return chunks;
  }
}
