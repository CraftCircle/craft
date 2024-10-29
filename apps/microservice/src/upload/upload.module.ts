import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadResolver } from './upload.resolver';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadController } from './upload.controller';
import { CloudinaryProvider } from './cloudinary.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadResolver, UploadService, CloudinaryProvider],
  exports: [UploadResolver, UploadService, CloudinaryProvider],
})
export class UploadModule {}
