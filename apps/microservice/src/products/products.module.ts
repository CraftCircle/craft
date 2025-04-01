import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { UploadModule } from '../upload/upload.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [UploadModule, PrismaModule, NotificationsModule],

  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
