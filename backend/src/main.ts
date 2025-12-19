import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurable API base path
  const config = app.get(ConfigService);
  const apiPrefix = config.get<string>('API_PREFIX') || 'api';
  app.setGlobalPrefix(apiPrefix);
  
  // Enable CORS - Allow all origins in development
  app.enableCors({
    origin: true, // Allows all origins (use specific origins in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(Number(port));
}

bootstrap().catch(err => {
  console.error('Failed to start application', err);
});