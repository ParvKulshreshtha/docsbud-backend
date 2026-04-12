import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { AiService } from 'src/ai/ai.service';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports:[AiModule],
  controllers: [DocumentController],
  providers: [DocumentService, AiService]
})
export class DocumentModule {}
