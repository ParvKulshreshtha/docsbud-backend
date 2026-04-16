import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentModule } from './document/document.module';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { VectorDbModule } from './vector-db/vector-db.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [DocumentModule, AiModule, ConfigModule.forRoot({
      isGlobal: true,
    }), VectorDbModule, ChatModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
