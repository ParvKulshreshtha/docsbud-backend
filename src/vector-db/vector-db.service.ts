import { Injectable, OnModuleInit } from '@nestjs/common';
import { CloudClient, Collection } from 'chromadb';

@Injectable()
export class VectorDbService implements OnModuleInit {
  private client!: CloudClient;
  private collection!: Collection;

  async onModuleInit() {
    this.client = new CloudClient({
      apiKey: process.env.CHROMA_APIKEY,
      tenant: process.env.CHROMA_TENANTID,
      database: process.env.CHROMA_DB_NAME,
    });

    // 🔥 THIS WAS MISSING
    this.collection = await this.client.getOrCreateCollection({
      name: 'documents',
    });
}

    async storeEmbeddings(
    chunks: string[],
    embeddings: number[][],
    userId: string,
    documentId: string,
  ) {
    if (!this.collection) {
      throw new Error('❌ Collection not initialized');
    }

    return this.collection.add({
      ids: chunks.map((_, i) => `${documentId}-chunk-${i}`),
      documents: chunks,
      embeddings: embeddings,
      metadatas: chunks.map(() => ({
        userId,
        documentId,
      })),
    });
  }

  async querySimilar(embedding: number[], userId: string, documentId: string) {
  if (!this.collection) {
    throw new Error('Collection not initialized');
  }

  const result = await this.collection.query({
    queryEmbeddings: [embedding],
    nResults: 5,
    where: {
      documentId,
    },
  });

  return result.documents[0]; // top chunks
}
}