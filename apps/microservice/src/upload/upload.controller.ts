import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    // @Body('mediaType') mediaType: 'image' | 'video',
  ) {
    return this.uploadService.handleUpload(file, 3);
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('file[]', 5))
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    // @Body('mediaType') mediaType: 'image' | 'video',
  ) {
    return Promise.all(
      files.map((file) => this.uploadService.handleUpload(file, 3)),
    );
  }
}
