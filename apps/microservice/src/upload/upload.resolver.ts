import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UploadService } from './upload.service';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { FileUpload } from 'graphql-upload-minimal';

import { Logger } from '@nestjs/common';

@Resolver()
export class UploadResolver {
  private readonly logger = new Logger(UploadResolver.name);

  constructor(private readonly uploadService: UploadService) {}

  @Mutation(() => String)
  async singleUpload(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    this.logger.log('Starting single file upload');
    const { createReadStream, filename } = file;
    this.logger.log(`Received file ${filename}`);

    try {
      // Convert the file stream to buffer for upload
      const fileBuffer = await streamToBuffer(createReadStream());
      this.logger.log(`Converted file ${filename} to buffer for upload`);

      // Attempt to upload the file using the UploadService
      const result = await this.uploadService.handleUpload({
        buffer: fileBuffer,
        originalname: filename,
      } as Express.Multer.File);

      this.logger.log(`File uploaded successfully with URL: ${result}`);
      return result;
    } catch (error) {
      if (error instanceof AggregateError) {
        this.logger.error(
          'AggregateError encountered in singleUpload. Details:',
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
        this.logger.error('File upload failed in singleUpload:', error.message);
      }
      throw new Error('File upload failed');
    }
  }
}

export async function streamToBuffer(
  stream: NodeJS.ReadableStream,
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
