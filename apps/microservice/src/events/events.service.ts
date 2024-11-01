import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';

import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class EventsService {
  constructor(
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(createEventInput: CreateEventInput, creatorId: string) {
    let imageUrl: string | undefined;

    if (createEventInput.image) {
      const multerFile = await this.uploadService.convertToMulterFile(
        createEventInput.image,
      );
      imageUrl = await this.uploadService.handleUpload(multerFile);
    }

    return this.prismaService.event.create({
      data: {
        ...createEventInput,
        image: imageUrl,
        creatorId,
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
        ticketTypes: true
      }
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
}
