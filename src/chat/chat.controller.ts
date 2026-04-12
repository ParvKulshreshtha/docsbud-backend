import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  getChatResponse(@Body() body: { message?: string }) {
    return this.chatService.getChatResponse(body?.message);
  }
}
