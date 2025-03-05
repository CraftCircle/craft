import { Module, forwardRef } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsResolver } from './tickets.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UploadModule } from '../upload/upload.module';
import { PesapalModule } from '../pesapal/pesapal.module';

@Module({
  imports: [
    PrismaModule,
    PaymentsModule,
    NotificationsModule,
    UploadModule,
    forwardRef(() => PesapalModule),
  ],
  providers: [TicketsResolver, TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
