import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // Start the HTTP server for GraphQL
  const app = await NestFactory.create(AppModule);
  
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
