import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  getChatResponse(message?: string): { answer: string } {
    return { answer: 'Hello from AI' };
  }
}
