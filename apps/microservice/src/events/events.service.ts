import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEventInput } from './dto/update-event.input';
import { EventEntity } from './entities/event.entity';
import { UserEntity } from '../users/entities/user.entity';
import { NotificationService } from '../notifications/notifications.service';
import { NotificationCategory, NotificationType } from '@prisma/client';
import { eventCreationTemplate } from '../notifications/templates/event';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Creates a new event.
   *
   * @param createEventInput - The event details provided by the admin.
   * @param creatorId - The ID of the admin creating the event.
   * @returns The created event entity.
   */
  async createEvent(
    {
      name,
      description,
      image,
      location,
      startTime,
      endTime,
      date,
    }: CreateEventInput,
    user: UserEntity,
  ) {
    this.logger.log('Creating An Event...');
    const event = await this.prismaService.event.create({
      data: {
        name,
        description,
        image,
        location,
        startTime,
        endTime,
        date,
        creatorId: user.id,
      },
    });

    // ✅ Send notification after event is created
    await this.notificationService.send({
      recipientId: user.id,
      title: '🎉 Your event is live!',
      message: `Hey ${user.name}, your event "${event.name}" has been successfully created.`,
      category: NotificationCategory.Event,
      types: [NotificationType.Email, NotificationType.InApp],
      additionalData: {
        template: eventCreationTemplate(
          user.name,
          event.name,
          `https://craftcirclehq.com/events/${event.id}`,
        ),
      },
    });

    return event;
  }

  /**
   * Updates an existing event.
   *
   * @param id - The ID of the event to update.
   * @param updateEventInput - The updated event details.
   * @returns The updated event entity.
   */
  async update(id: string, updateEventInput: UpdateEventInput) {
    return this.prismaService.event.update({
      where: { id },
      data: {
        ...updateEventInput,
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
