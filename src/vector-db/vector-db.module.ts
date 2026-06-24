import { Module } from '@nestjs/common';
import { VectorDbService } from './vector-db.service';

@Module({
  providers: [VectorDbService]
})
export class VectorDbModule {}
