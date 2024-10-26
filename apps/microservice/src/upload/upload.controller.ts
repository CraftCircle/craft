import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { UploadService } from './upload.service';

  @Controller('upload')
  export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.handleUpload(file)
    }

  }