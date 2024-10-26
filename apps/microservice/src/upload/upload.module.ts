import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadResolver } from './upload.resolver';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadController } from './upload.controller';
import { CloudinaryProvider } from './cloudinary.config'; 
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadResolver, UploadService, CloudinaryProvider],
  exports:[UploadResolver, UploadService, CloudinaryProvider]
})
export class UploadModule {}
