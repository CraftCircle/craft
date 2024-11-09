import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UserModule } from './users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LocalStrategy } from './auth/strategy/local.strategy';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { AuthResolver } from './auth/auth.resolver';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { UploadModule } from './upload/upload.module';
import { PostModule } from './posts/posts.module';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsResolver } from './payments/payments.resolver';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
@Module({
  imports: [
    PrismaModule,
    PassportModule.register({
      session: false,
      defaultStrategy: 'jwt',
    }),
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
      playground: false,
      sortSchema: true,
      csrfPrevention: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    UploadModule,
    PostModule,
    EventsModule,
    TicketsModule,
    PaymentsModule,
    NotificationsModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController, PaymentsController],
  providers: [
    {
      provide: 'Upload',
      useValue: GraphQLUpload,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthResolver,
    PaymentsResolver,
    AppService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        graphqlUploadExpress({ maxFileSize: 1024 * 1024 * 50, maxFiles: 10 }),
      )
      .forRoutes('graphql');
  }
}
