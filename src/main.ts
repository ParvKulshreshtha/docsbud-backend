import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'], // or specify allowed origins like 'http://localhost:3000'
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 8001);
}
bootstrap();
