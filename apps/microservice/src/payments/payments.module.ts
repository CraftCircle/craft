import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [PaymentsController],
  providers: [PaymentsResolver, PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
