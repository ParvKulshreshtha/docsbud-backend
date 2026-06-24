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
      model: 'gpt-5-nano',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content;
  }

  async *askLLMStream(prompt: string): AsyncGenerator<string> {
    const stream = await this.openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  private readonly questionTags = [
    {
      tag: 'full_document',
      multiplier: 0.85,
      patterns: [
        'summarize',
        'summary',
        'overview',
        'key points',
        'abstract',
        'explain this document',
        'analyze this document',
        'review this document',
      ],
    },
    {
      tag: 'specific',
      multiplier: 0.1,
      patterns: [],
    },
  ];

  decideChunkCount(
    question: string,
    totalChunks: number,
  ): { chunkCount: number; tag: string } {
    const normalized = question.toLowerCase();

    for (const { tag, multiplier, patterns } of this.questionTags) {
      if (patterns.length === 0) continue;
      if (patterns.some((pattern) => normalized.includes(pattern))) {
        return {
          chunkCount: this.computeChunkCount(multiplier, totalChunks),
          tag,
        };
      }
    }

    const defaultTag = this.questionTags.find((t) => t.patterns.length === 0)!;
    return {
      chunkCount: this.computeChunkCount(defaultTag.multiplier, totalChunks),
      tag: defaultTag.tag,
    };
  }

  private computeChunkCount(multiplier: number, totalChunks: number): number {
    const count = Math.ceil(multiplier * totalChunks);
    return Math.min(Math.max(count, 3), totalChunks || 1);
  }

  buildPrompt(
    context: string[],
    question: string,
    history: { question: string; answer: string }[] = [],
  ) {
    const historySection =
      history.length > 0
        ? `Previous conversation (for follow-up context only — still answer from document context):\n${history
            .map(
              (item, index) =>
                `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`,
            )
            .join('\n\n')}\n\n`
        : '';

    return `
    You are a helpful AI assistant.

    Use ONLY the context below to answer.

    ${historySection}Context:
    ${context.join('\n\n')}

    Question:
    ${question}

    if question asks for specific details, share that particular details only
    `;
  }
}