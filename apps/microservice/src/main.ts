// main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], 
  });

  // Set up global validation pipe for input validation and logging
  app.useGlobalPipes(new ValidationPipe());

  const logger = new Logger('Bootstrap'); 

  logger.log('Starting CraftCircle Backend...');

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.enableCors();

  // Log each incoming request for debugging
  app.use((req: Request, res: any, next: any) => {
    logger.debug(`Incoming Request: ${req.method} ${req.url}`);
    res.on('finish', () => {
      logger.verbose(
        `Request Status: ${req.method} ${req.url} - ${res.statusCode}`,
      );
    });
    next();
  });

  // Start the TCP microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });

  await app.startAllMicroservices();
  logger.log('Microservice successfully started on TCP port 3001');

  await app.listen(3000);
  logger.log('CraftCircle Backend HTTP server listening on port 3000');
}

bootstrap();
