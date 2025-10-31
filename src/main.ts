import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: '*', // Permite cualquier origen
    methods: '*', // Permite cualquier método (GET, POST, PUT, DELETE, etc.)
    allowedHeaders: '*', // Permite cualquier header
    credentials: true, // Permite el envío de cookies y credenciales
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
