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

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentsService,
    private notificationService: NotificationsService,
  ) {}

  /**
   * Admin creates a ticket type for an Event
   */
  async createTicketType(
    createTicketTypeDto: CreateTicketTypeDTO,
    admin: UserEntity,
  ) {
    const { ticketType, price, quantity, eventId } = createTicketTypeDto;

    try {
      // Ensure the event exists
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
      });
      if (!event) {
        throw new BadRequestException('Event not found');
      }

      // Ensure that the authenticated admin is the creator of the event
      if (event.creatorId !== admin.id) {
        throw new ForbiddenException(
          'You are not authorized to create ticket types for this event',
        );
      }

      // Create a ticket type for the event
      return await this.prisma.ticketType.create({
        data: {
          ticketType,
          price,
          quantity,
          event: {
            connect: { id: eventId },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create ticket type');
    }
  }

  /**
   * User purchases a ticket for an Event
   */
  async purchaseTicket(
    createTicketPurchaseDto: CreateTicketPurchaseDTO,
    user: UserEntity,
  ) {
    const { ticketTypeId, quantity, transactionId, eventId, name } =
      createTicketPurchaseDto;

    // Temporary bypass for payment verification if not implemented
    const skipPaymentVerification = true;

    if (!skipPaymentVerification) {
      try {
        // Verify payment
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
      // Log for debugging
      this.logger.log(`Looking for ticket type with ID: ${ticketTypeId}`);

      // Check ticket type availability
      ticketType = await this.prisma.ticketType.findUnique({
        where: { id: ticketTypeId },
      });

      // Check if the ticket type was found
      if (!ticketType) {
        this.logger.warn(`Ticket type with ID ${ticketTypeId} not found.`);
        throw new BadRequestException('Ticket type not found');
      }

      // Log ticket type details for debugging
      this.logger.log(`Found ticket type: ${JSON.stringify(ticketType)}`);

      // Check if enough tickets are available
      if (ticketType.quantity < quantity) {
        this.logger.warn(
          `Requested quantity (${quantity}) exceeds available tickets (${ticketType.quantity})`,
        );
        throw new BadRequestException('Not enough tickets available');
      }

      
      await this.prisma.ticketType.update({
        where: { id: ticketTypeId },
        data: {
          quantity: {
            decrement: quantity, 
          },
        },
      });

      // Log successful update
      this.logger.log(
        `Successfully decremented ticket type quantity by ${quantity}`,
      );
    } catch (error) {
      this.logger.error(
        'Error during ticket availability check:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Ticket availability check failed',
      );
    }

    try {
      // Create a user-specific ticket
      const ticket = await this.prisma.ticket.create({
        data: {
          name,
          phoneNumber: user.phoneNumber || null,
          email: user.email,
          price: ticketType.price,
          ticketType: ticketType.ticketType,
          transactionId,
          quantity,
          event: { connect: { id: eventId } },
          user: { connect: { id: user.id } },
          scanned: false,
        },
      });

      // Populate the event name to pass to the notification
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
      });

      const notificationData = {
        ...ticket,
        eventName: event?.name,
      };

      // Send notification to the user
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

  // Get all tickets for a specific event
  async getTicketsForEvent(eventId: string) {
    return await this.prisma.ticket.findMany({ where: { eventId } });
  }

  // Admin retrieves all tickets
  async getAllTickets() {
    return await this.prisma.ticket.findMany();
  }

  // Method to allow admin to update ticket type quantity
  async updateTicketTypeQuantity(
    ticketTypeId: string,
    quantity: number,
    admin: UserEntity,
  ) {
    // Ensure quantity is a valid positive integer
    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    try {
      // Retrieve ticket type and associated event to verify ownership
      const ticketType = await this.prisma.ticketType.findUnique({
        where: { id: ticketTypeId },
        include: { event: true },
      });

      // Check if ticket type exists
      if (!ticketType) {
        this.logger.warn(`Ticket type with ID ${ticketTypeId} not found.`);
        throw new BadRequestException('Ticket type not found');
      }

      // Verify that the admin is the creator of the event
      if (ticketType.event.creatorId !== admin.id) {
        this.logger.warn(
          `User ${admin.id} is not authorized to modify ticket type ${ticketTypeId}`,
        );
        throw new ForbiddenException(
          'You are not authorized to edit this ticket type',
        );
      }

      // Update the ticket type quantity
      const updatedTicketType = await this.prisma.ticketType.update({
        where: { id: ticketTypeId },
        data: { quantity },
      });

      this.logger.log(
        `Ticket type ${ticketTypeId} quantity updated successfully by admin ${admin.id}`,
      );
      return updatedTicketType;
    } catch (error) {
      this.logger.error('Failed to update ticket type quantity', error.message);
      throw new InternalServerErrorException(
        'Failed to update ticket type quantity',
      );
    }
  }

  // Delete a ticket by ID
  async deleteTicket(ticketId: string) {
    await this.prisma.ticket.delete({ where: { id: ticketId } });
    return true;
  }
}
