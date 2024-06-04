import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://scrape-sense-dashboard-react.vercel.app',
      'https://scrape-sense.whitecatdev.com',
    ], // Specify the requesting origin
    credentials: true, // Allow credentials (cookies, HTTP authentication)
  });

  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ extended: true, limit: '100mb' }));

  await app.listen(3000);
}
bootstrap();
