import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async createEmbedding(texts: string[]) {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });

    return response.data.map(e => e.embedding);
  }

  async askLLM(prompt: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content;
  }
}