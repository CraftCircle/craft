import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateTicketTypeDTO } from './dto/create-ticket-type.dto';
import { CreateTicketPurchaseDTO } from './dto/create-ticket-purchase.dto';
import { UserEntity } from '../users/entities/user.entity';
import { TicketType as PrismaTicketType, TicketType } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-minimal';
import { UploadService } from '../upload/upload.service';
import { TicketCreatedEntity } from './entities/ticket-created.entity';
import { TicketPurchasedEntity } from './entities/ticket-purchased.entity';
import { TicketEntity } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentsService,
    private notificationService: NotificationsService,
    private uploadService: UploadService,
  ) {}

  /**
   * Creates a new ticket type for an event.
   *
   * @param createTicketTypeDto - Details of the ticket type to create.
   * @param admin - The authenticated admin creating the ticket type.
   * @param image - The image file for the ticket type.
   * @returns The created ticket type entity.
   */
  async createTicketType(
    createTicketTypeDto: CreateTicketTypeDTO,
    admin: UserEntity,
    image: FileUpload,
  ): Promise<TicketCreatedEntity> {
    const { ticketType, price, quantity, eventId } = createTicketTypeDto;

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

    try {
      // Validate that the event exists and is owned by the admin.
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
      });
      if (!event) {
        throw new BadRequestException('Event not found');
      }
      if (event.creatorId !== admin.id) {
        throw new ForbiddenException(
          'You are not authorized to create ticket types for this event',
        );
      }

      // Create the ticket type.
      return await this.prisma.ticketType.create({
        data: {
          ticketType,
          price,
          quantity,
          image: imageUrl,
          event: { connect: { id: eventId } },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create ticket type');
    }
  }

  /**
   * Processes the purchase of a ticket by a user.
   *
   * @param createTicketPurchaseDto - Details of the ticket purchase.
   * @param user - The authenticated user making the purchase.
   * @returns The purchased ticket entity.
   */
  async purchaseTicket(
    createTicketPurchaseDto: CreateTicketPurchaseDTO,
    user: UserEntity,
  ): Promise<TicketPurchasedEntity> {
    const { ticketTypeId, quantity, transactionId, eventId, name } =
      createTicketPurchaseDto;

    // Optionally verify payment.
    const skipPaymentVerification = true;
    if (!skipPaymentVerification) {
      try {
        const paymentVerified =
          await this.paymentService.verifyPayment(transactionId);
        if (!paymentVerified) {
          throw new BadRequestException('Payment could not be verified');
        }
      } catch (error) {
        this.logger.error('Payment verification failed', error.message);
        throw new InternalServerErrorException('Payment verification failed');
      }
    }

    let ticketType: TicketType;
    try {
      // Ensure the ticket type exists and has sufficient quantity.
      ticketType = await this.prisma.ticketType.findUnique({
        where: { id: ticketTypeId },
      });
      if (!ticketType) {
        throw new BadRequestException('Ticket type not found');
      }
      if (ticketType.quantity < quantity) {
        throw new BadRequestException('Not enough tickets available');
      }

      // Update the ticket type's quantity.
      await this.prisma.ticketType.update({
        where: { id: ticketTypeId },
        data: { quantity: { decrement: quantity } },
      });
    } catch (error) {
      this.logger.error(
        'Error during ticket availability check',
        error.message,
      );
      throw new InternalServerErrorException(
        'Ticket availability check failed',
      );
    }

    try {
      // Create and save the ticket.
      const ticket = await this.prisma.ticket.create({
        data: {
          price: ticketType.price,
          ticketType: ticketType.ticketType,
          transactionId,
          quantity,
          event: { connect: { id: eventId } },
          user: { connect: { id: user.id } },
          scanned: false,
        },
      });

      // Send a notification to the user about the ticket purchase.
      const notificationData = {
        ...ticket,
        eventName: (
          await this.prisma.event.findUnique({ where: { id: eventId } })
        )?.name,
      };
      await this.notificationService.sendTicketNotification(notificationData);

      this.logger.log(`Ticket purchase successful for user: ${user.email}`);
      return ticket;
    } catch (error) {
      this.logger.error('Failed to complete ticket purchase', error.message);
      throw new InternalServerErrorException(
        'Failed to complete ticket purchase',
      );
    }
  }

  /**
   * Retrieves tickets for a specific event for the authenticated user.
   *
   * @param userId - The ID of the user.
   * @param eventId - The ID of the event.
   * @returns An array of purchased ticket entities.
   */
  async getUserTicketsForEvent(
    userId: string,
    eventId: string,
  ): Promise<TicketPurchasedEntity[]> {
    return this.prisma.ticket.findMany({
      where: { eventId, userId },
      include: { event: true, user: true },
    });
  }

  /**
   * Retrieves a specific ticket by its ID for the authenticated user.
   *
   * @param ticketId - The ID of the ticket.
   * @param userId - The ID of the user.
   * @returns The ticket entity.
   */
  async getTicketById(ticketId: string, userId: string): Promise<TicketEntity> {
    return this.prisma.ticket.findUnique({
      where: { id: ticketId, userId },
      include: { event: true, user: true },
    });
  }

  /**
   * Retrieves all tickets purchased by the authenticated user.
   *
   * @param userId - The ID of the user.
   * @returns An array of purchased ticket entities.
   */
  async getAllTicketsForUser(userId: string): Promise<TicketPurchasedEntity[]> {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: { event: true },
    });
  }

  /**
   * Retrieves all tickets for events created by the authenticated admin.
   *
   * @param admin - The authenticated admin.
   * @returns An array of ticket type entities.
   */
  async getAllTickets(admin: UserEntity): Promise<TicketCreatedEntity[]> {
    return this.prisma.ticketType.findMany({
      where: { event: { creatorId: admin.id } },
      include: { event: true },
    });
  }

  /**
   * Retrieves all ticket types for a specific event.
   *
   * @param eventId - The ID of the event.
   * @returns An array of ticket type entities.
   */
  async getTicketsForEvent(eventId: string): Promise<TicketCreatedEntity[]> {
    return this.prisma.ticketType.findMany({
      where: { eventId },
      include: { event: true },
    });
  }

  /**
   * Marks a ticket as scanned.
   *
   * @param ticketId - The ID of the ticket.
   * @param userId - The ID of the user scanning the ticket.
   * @returns The updated ticket entity.
   */
  async scanTicket(ticketId: string, userId: string): Promise<TicketEntity> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { event: true, user: true },
    });

    if (!ticket) {
      throw new Error('Ticket not found.');
    }
    if (ticket.userId !== userId) {
      throw new Error('You are not authorized to scan this ticket.');
    }
    if (ticket.scanned) {
      throw new Error('Ticket has already been scanned.');
    }

    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: { scanned: true },
      include: { event: true, user: true },
    });
  }

  /**
   * Updates the quantity of a ticket type for an event.
   *
   * @param ticketTypeId - The ID of the ticket type.
   * @param quantity - The new quantity for the ticket type.
   * @param admin - The authenticated admin.
   * @returns The updated ticket type entity.
   */
  async updateTicketTypeQuantity(
    ticketTypeId: string,
    quantity: number,
    admin: UserEntity,
  ) {
    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    try {
      const ticketType = await this.prisma.ticketType.findUnique({
        where: { id: ticketTypeId },
        include: { event: true },
      });

      if (!ticketType) {
        throw new BadRequestException('Ticket type not found');
      }
      if (ticketType.event.creatorId !== admin.id) {
        throw new ForbiddenException(
          'You are not authorized to edit this ticket type',
        );
      }

      return this.prisma.ticketType.update({
        where: { id: ticketTypeId },
        data: { quantity },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update ticket type quantity',
      );
    }
  }

  /**
   * Deletes a ticket by its ID.
   *
   * @param ticketId - The ID of the ticket.
   * @returns `true` if the ticket was successfully deleted.
   */
  async deleteTicket(ticketId: string) {
    await this.prisma.ticket.delete({ where: { id: ticketId } });
    return true;
  }
}
