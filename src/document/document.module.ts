import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { AiService } from 'src/ai/ai.service';
import { AiModule } from 'src/ai/ai.module';
import { VectorDbModule } from 'src/vector-db/vector-db.module';
import { VectorDbService } from 'src/vector-db/vector-db.service';

@Module({
  imports:[AiModule, VectorDbModule],
  controllers: [DocumentController],
  providers: [DocumentService, AiService, VectorDbService]
})
export class DocumentModule {}
