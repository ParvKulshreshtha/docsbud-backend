import {
  Body,
  Controller,
  MessageEvent,
  RequestMethod,
  Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatService, ChatHistoryItem } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Sse('ask', { method: RequestMethod.POST })
  ask(
    @Body()
    body: {
      question: string;
      userId: string;
      documentId: string;
      history?: ChatHistoryItem[];
    },
  ): Observable<MessageEvent> {
    return this.chatService.streamQuestionEvents(
      body.question,
      body.userId,
      body.documentId,
      body.history,
    );
  }
}
