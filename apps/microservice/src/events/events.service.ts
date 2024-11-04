import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';

import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { FileUpload } from 'graphql-upload-minimal';
import { UpdateEventInput } from './dto/update-event.input';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(UploadService.name);
  constructor(
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(
    createEventInput: CreateEventInput,
    creatorId: string,
    image: FileUpload,
  ) {
    if (!image) {
      throw new BadRequestException('Image is required for event creation');
    }

    this.logger.log('Uploading image...');
    let imageUrl: string;
    try {
      imageUrl = await this.uploadService.handleUpload(image);
      this.logger.log(`Image uploaded successfully: ${imageUrl}`);
    } catch (error) {
      this.logger.error('Error during image upload', error);
      throw new BadRequestException('Image upload failed');
    }

    return this.prismaService.event.create({
      data: {
        ...createEventInput,
        image: imageUrl,
        creatorId,
      },
    });
  }

  async update(
    id: string,
    updateEventInput: UpdateEventInput,
    image?: FileUpload,
  ) {
    let imageUrl: string | undefined;
    if (image) {
      this.logger.log('Uploading new image...');
      try {
        imageUrl = await this.uploadService.handleUpload(image);
        this.logger.log(`Image uploaded successfully: ${imageUrl}`);
      } catch (error) {
        this.logger.error('Error during image upload', error);
        throw new BadRequestException('Image upload failed');
      }
    }

    return this.prismaService.event.update({
      where: { id },
      data: {
        ...updateEventInput,
        ...(imageUrl && { image: imageUrl }),
      },
    });
  }

  async getAllEvents() {
    return this.prismaService.event.findMany({
      include: {
        tickets: true,
        ticketTypes: true,
      },
    });
  }

  async getEventById(eventId: string) {
    return this.prismaService.event.findUnique({
      where: { id: eventId },
      include: {
        tickets: true,
        ticketTypes: true,
      },
    });
  }

  async getEventDetails(eventId: string) {
    return this.prismaService.event.findUnique({
      where: { id: eventId },
      include: {
        tickets: true,
        ticketTypes: true,
        // User: true, // Optional, include if you want to show creator details
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prismaService.event.delete({ where: { id } });
      return true;
    } catch (error) {
      this.logger.error('Error deleting event', error);
      throw new BadRequestException('Failed to delete event');
    }
  }
}
