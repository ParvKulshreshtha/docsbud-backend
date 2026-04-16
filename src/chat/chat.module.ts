import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AiModule } from 'src/ai/ai.module';
import { VectorDbModule } from 'src/vector-db/vector-db.module';
import { AiService } from 'src/ai/ai.service';
import { VectorDbService } from 'src/vector-db/vector-db.service';

@Module({
  imports: [AiModule, VectorDbModule],
  providers: [ChatService, AiService, VectorDbService],
  controllers: [ChatController]
})
export class ChatModule {}
