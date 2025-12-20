import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Student Retention API')
    .setDescription('API for student retention and status analysis')
    .setVersion('1.0')
    .addTag('retencion')
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(Number(port));
}

bootstrap().catch(err => {
  console.error('Failed to start application', err);
});