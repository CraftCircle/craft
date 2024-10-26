import { NestFactory, Reflector } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Start the HTTP server for GraphQL
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const logger = new Logger();

  logger.log('CraftCircle Backend Up and Running');
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));


  app.enableCors();

  // Start the microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
