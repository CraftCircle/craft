import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  async handleUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    try {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
      });
      return { message: 'File uploaded successfully', url: result.secure_url };
    } catch (error) {
      throw new BadRequestException('Error uploading file to Cloudinary');
    }
  }
}
