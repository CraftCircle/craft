import { Module } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { NotificationResolver } from './notifications.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [NotificationResolver, NotificationService, PrismaService],
  exports: [NotificationService],
})
export class NotificationsModule {}
