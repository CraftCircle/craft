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
import { TicketType as PrismaTicketType } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentsService,
    private notificationService: NotificationsService,
  ) {}

  /**
   * Admin creates a ticket type for an Event
   */
  async createTicketType(createTicketTypeDto: CreateTicketTypeDTO, admin: UserEntity) {
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
          throw new ForbiddenException('You are not authorized to create ticket types for this event');
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
    const { ticketTypeId, quantity, transactionId, eventId } =
      createTicketPurchaseDto;

    try {
      // Verify payment
      const paymentVerified =
        await this.paymentService.verifyPayment(transactionId);
      if (!paymentVerified) {
        throw new BadRequestException('Payment could not be verified');
      }
    } catch (error) {
      throw new InternalServerErrorException('Payment verification failed');
    }

    let ticketType: PrismaTicketType | null;

    try {
      // Check ticket type availability
      ticketType = await this.prisma.ticketType.findUnique({
        where: { id: ticketTypeId },
      });
      if (!ticketType || ticketType.quantity < quantity) {
        throw new BadRequestException('Not enough tickets available');
      }

      // Update ticket type quantity to reflect the purchase
      await this.prisma.ticketType.update({
        where: { id: ticketTypeId },
        data: { quantity: ticketType.quantity - quantity },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Ticket availability check failed',
      );
    }

    try {
      // Create a user-specific ticket
      const ticket = await this.prisma.ticket.create({
        data: {
          name: user.name,
          phoneNumber: user.phoneNumber,
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

      // Send notification to the user
      await this.notificationService.sendTicketNotification(ticket);
      return ticket;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to complete ticket purchase',
      );
    }
  }
}
