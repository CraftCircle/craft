import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],

  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
