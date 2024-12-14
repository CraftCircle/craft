import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { FileUpload } from 'graphql-upload-minimal';
import { UpdateEventInput } from './dto/update-event.input';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  /**
   * Creates a new event.
   *
   * @param createEventInput - The event details provided by the admin.
   * @param creatorId - The ID of the admin creating the event.
   * @param image - The image file for the event.
   * @returns The created event entity.
   */
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

  /**
   * Updates an existing event.
   *
   * @param id - The ID of the event to update.
   * @param updateEventInput - The updated event details.
   * @param image - Optional new image file for the event.
   * @returns The updated event entity.
   */
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

  /**
   * Retrieves all events.
   *
   * @returns An array of all event entities.
   */
  async getAllEvents() {
    return this.prismaService.event.findMany({
      include: {
        tickets: true,
        ticketTypes: true,
      },
    });
  }

  /**
   * Retrieves all events created by a specific admin.
   *
   * @param creatorId - The ID of the admin.
   * @returns An array of event entities created by the admin.
   */
  async getAllEventsByCreator(creatorId: string): Promise<EventEntity[]> {
    return this.prismaService.event.findMany({
      where: { creatorId },
      include: { tickets: true },
    });
  }

  /**
   * Retrieves a specific event by its ID.
   *
   * @param eventId - The ID of the event.
   * @returns The event entity matching the ID.
   */
  async getEventById(eventId: string) {
    return this.prismaService.event.findUnique({
      where: { id: eventId },
      include: {
        tickets: true,
        ticketTypes: true,
      },
    });
  }

  /**
   * Retrieves detailed information about a specific event.
   *
   * @param eventId - The ID of the event.
   * @returns The event entity with additional details.
   */
  async getEventDetails(eventId: string) {
    return this.prismaService.event.findUnique({
      where: { id: eventId },
      include: {
        tickets: true,
        ticketTypes: true,
        // Uncomment if creator details are needed:
        // User: true,
      },
    });
  }

  /**
   * Deletes an event by its ID.
   *
   * @param id - The ID of the event to delete.
   * @returns `true` if the event was successfully deleted.
   */
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
