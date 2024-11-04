import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import streamifier from 'streamifier';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { FileUpload } from 'graphql-upload-minimal';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  async handleUpload(
    file: FileUpload | Express.Multer.File,
    retryCount = 3,
  ): Promise<string> {
    this.logger.log('Starting file upload process');

    if (!file) {
      this.logger.error('No file provided for upload');
      throw new BadRequestException('File must be provided');
    }

    // Convert FileUpload to Express.Multer.File if necessary
    const multerFile =
      'createReadStream' in file ? await this.convertToMulterFile(file) : file;

    // Log multerFile properties to check buffer integrity
    this.logger.log(
      `multerFile properties: ${JSON.stringify(
        {
          originalname: multerFile.originalname,
          mimetype: multerFile.mimetype,
          size: multerFile.size,
          bufferLength: multerFile.buffer
            ? multerFile.buffer.length
            : 'No buffer',
        },
        null,
        2,
      )}`,
    );

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      this.logger.log(`Upload attempt ${attempt} of ${retryCount}`);

      try {
        const result = await this.uploadToCloudinary(multerFile);
        this.logger.log(`File uploaded successfully on attempt ${attempt}`);
        return result.secure_url;
      } catch (error) {
        if (error.code === 'ETIMEDOUT' && attempt < retryCount) {
          const delay = Math.pow(2, attempt) * 10000;
          this.logger.log(`Retrying upload in ${delay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          this.logger.error(
            'Cloudinary upload error after maximum retries:',
            error.message,
          );
          throw new BadRequestException(
            'File upload failed after multiple attempts',
          );
        }
      }
    }
    throw new BadRequestException('File upload failed unexpectedly');
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', timeout: 600000, upload_preset: 'aaqqgb0o' },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary upload error:', {
              code: error.code,
              message: error.message || 'No message provided',
              attempt: 'attempt details here',
            });

            this.logger.error(
              'Full Error Details:',
              JSON.stringify(error, null, 2),
            );
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        },
      );

      try {
        if (!file.buffer || file.buffer.length === 0) {
          this.logger.error('File buffer is empty or missing.');
          throw new BadRequestException('File buffer is empty or missing.');
        }

        // Pipe the buffer to Cloudinary upload stream
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } catch (error) {
        this.logger.error(
          'Error creating read stream from file buffer',
          error.message,
        );
        reject(error);
      }
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Convert GraphQL FileUpload to Express.Multer.File format
  async convertToMulterFile(
    fileUpload: FileUpload,
  ): Promise<Express.Multer.File> {
    const stream = fileUpload.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return {
      buffer,
      originalname: fileUpload.filename,
      mimetype: fileUpload.mimetype,
      size: buffer.length,
    } as Express.Multer.File;
  }
}
