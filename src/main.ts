import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Enable config from .env file
  const confService = app.get(ConfigService);
  await app.listen((confService.get('PORT') || process.env.PORT) ?? 3000);
}
bootstrap();
