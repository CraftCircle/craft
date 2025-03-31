import { Logger } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-minimal';
import { UploadService } from '../upload.service';
import { streamToBuffer } from '../upload.resolver';

export class UploadHelper {
  private readonly logger = new Logger(UploadHelper.name);

  constructor(private readonly uploadService: UploadService) {}

  /**
   * Uploads a single file and returns the URL. Logs and skips on failure.
   */
  async tryUploadFile(
    file: FileUpload | undefined,
    field: string,
  ): Promise<string | undefined> {
    if (!file) return;

    try {
      const { createReadStream, filename } = file;
      const buffer = await streamToBuffer(createReadStream());

      const url = await this.uploadService.handleUpload({
        buffer,
        originalname: filename,
      } as Express.Multer.File);

      this.logger.log(`Successfully uploaded ${field}: ${url}`);
      return url;
    } catch (error) {
      this.logger.warn(`Failed to upload ${field}: ${error.message}`);
      return undefined;
    }
  }

  /**
   * Batch upload for multiple optional file fields.
   * Returns a map of field names to URLs.
   */
  async uploadFields(files: { [field: string]: FileUpload | undefined }) {
    const result: Record<string, string | undefined> = {};

    for (const [field, file] of Object.entries(files)) {
      result[field] = await this.tryUploadFile(file, field);
    }

    return result;
  }
}
