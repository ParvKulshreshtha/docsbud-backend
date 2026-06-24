import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
  app.enableCors({
    origin: [corsOrigins],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 8001);
}
bootstrap();
