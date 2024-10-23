import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LocalStrategy } from './auth/strategy/local.strategy';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import {  JwtAuthGuard } from './auth/guards/jwt.guard';
import { AuthResolver } from './auth/auth.resolver';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
@Module({
  imports: [
    PrismaModule,
    PassportModule.register({
      session: false,
      defaultStrategy: 'jwt'
    }),
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'api',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
      {
        name: 'api-gateway',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({
        req,
        user: req.headers.authorization
          ? req.headers.authorization.split(' ')[1]
          : null,
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AuthResolver,
    AppService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
