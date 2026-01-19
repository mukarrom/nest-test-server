import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /// enable CORS
  // app.enableCors();

  /// Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  /// Start the application
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  });
}
bootstrap();
