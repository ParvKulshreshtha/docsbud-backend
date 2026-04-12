import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentModule } from './document/document.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [DocumentModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
