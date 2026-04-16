import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { VectorDbService } from 'src/vector-db/vector-db.service';

@Injectable()
export class ChatService {
    constructor(private aiService:AiService, 
        private vectorDbService:VectorDbService
    ){}
    async askQuestion(userQuestion: string, userId: string, documentId: string) {
  // 1. Convert question → embedding
  const embedding = await this.aiService.createEmbedding([userQuestion]);

  // 2. Retrieve relevant chunks
  const chunks = await this.vectorDbService.querySimilar(
    embedding[0],
    userId,
    documentId,
  );

  // 3. Build prompt
  const prompt = this.aiService.buildPrompt(chunks.filter(item=>item!==null), userQuestion);

  // 4. Get AI response
  const answer = await this.aiService.askLLM(prompt);

  return {
    answer,
    sources: chunks,
  };
}
}
