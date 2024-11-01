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
    file: Express.Multer.File,
    retryCount = 3,
    // mediaType: 'image' | 'video',
  ): Promise<string> {
    this.logger.log('Starting file upload process');

    if (!file) {
      this.logger.error('No file provided for upload');
      throw new BadRequestException('File must be provided');
    }

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      this.logger.log(`Upload attempt ${attempt} of ${retryCount}`);

      try {
        const result = await this.uploadToCloudinary(file);
        this.logger.log(`File uploaded successfully on attempt ${attempt}`);
        return result.secure_url;
      } catch (error) {
        if (error instanceof AggregateError) {
          this.logger.error(
            'AggregateError encountered during upload. Details:',
          );
          error.errors.forEach((subError, index) => {
            this.logger.error(`Sub-error ${index + 1}: ${subError.message}`);
            if (subError.stack) {
              this.logger.error(
                `Stack trace for sub-error ${index + 1}: ${subError.stack}`,
              );
            }
          });
        } else {
          this.logger.error(`Upload attempt ${attempt} failed`, error.message);
        }

        if (attempt < retryCount) {
          await this.delay(1000 * attempt);
          this.logger.log(
            `Retrying upload in ${(1000 * attempt) / 1000} seconds...`,
          );
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
    // mediaType: 'image' | 'video',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', timeout: 120000, upload_preset: 'aaqqgb0o' },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary upload error:', error.message);
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        },
      );

      try {
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

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.handleUpload(file, 3)));
  }

  async uploadFileFromUrl(
    url: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    this.logger.log(`Uploading file from URL: ${url}`);
    return cloudinary.uploader.upload(url);
  }

  async uploadFilesFromUrl(urls: string[]): Promise<string[]> {
    return Promise.all(
      urls.map(async (url) => {
        const { secure_url } = await this.uploadFileFromUrl(url);
        return secure_url;
      }),
    );
  }
}
