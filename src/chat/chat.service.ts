import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AiService } from 'src/ai/ai.service';
import { VectorDbService } from 'src/vector-db/vector-db.service';

export type ChatHistoryItem = {
  question: string;
  answer: string;
};

@Injectable()
export class ChatService {
    constructor(private aiService:AiService, 
        private vectorDbService:VectorDbService
    ){}
    async streamQuestion(
    userQuestion: string,
    userId: string,
    documentId: string,
    history: ChatHistoryItem[] = [],
  ) {
  const recentHistory = history.slice(-2);
  const totalChunks = await this.vectorDbService.getChunkCount(documentId);
  const { chunkCount, tag } = this.aiService.decideChunkCount(
    userQuestion,
    totalChunks,
  );

  const embedding = await this.aiService.createEmbedding([userQuestion]);

  const chunks = await this.vectorDbService.querySimilar(
    embedding[0],
    userId,
    documentId,
    chunkCount,
  );

  const contextChunks = chunks.filter((item) => item !== null) as string[];
  const prompt = this.aiService.buildPrompt(
    contextChunks,
    userQuestion,
    recentHistory,
  );

  return {
    chunkCount,
    totalChunks,
    tag,
    stream: this.aiService.askLLMStream(prompt),
  };
}

  streamQuestionEvents(
    userQuestion: string,
    userId: string,
    documentId: string,
    history: ChatHistoryItem[] = [],
  ): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      void (async () => {
        try {
          const result = await this.streamQuestion(
            userQuestion,
            userId,
            documentId,
            history,
          );

          subscriber.next({
            type: 'metadata',
            data: {
              chunkCount: result.chunkCount,
              totalChunks: result.totalChunks,
              tag: result.tag,
            },
          });

          let answer = '';
          for await (const token of result.stream) {
            answer += token;
            subscriber.next({
              type: 'token',
              data: { content: token },
            });
          }

          subscriber.next({
            type: 'done',
            data: { answer },
          });
          subscriber.complete();
        } catch (err) {
          subscriber.next({
            type: 'error',
            data: {
              message:
                err instanceof Error ? err.message : 'Request failed',
            },
          });
          subscriber.complete();
        }
      })();
    });
  }
}