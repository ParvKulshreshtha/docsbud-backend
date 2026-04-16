import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}
    @Post('ask')
    async ask(@Body() body: any) {
        console.log(body)
    return this.chatService.askQuestion(
        body.question,
        body.userId,
        body.documentId,
    );
    }
}
