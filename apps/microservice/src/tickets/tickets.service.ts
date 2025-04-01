import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notifications/notifications.service';
// import { PaymentsService } from '../payments/payments.service';
import { CreateTicketTypeDTO } from './dto/create-ticket-type.dto';
import { CreateTicketPurchaseDTO } from './dto/create-ticket-purchase.dto';
import { UserEntity } from '../users/entities/user.entity';
import { PesapalService } from '../pesapal/pesapal.service';
import { Logger } from '@nestjs/common';
import { TicketCreatedEntity } from './entities/ticket-created.entity';
import { TicketPurchasedEntity } from './entities/ticket-purchased.entity';
import { TicketEntity } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  constructor(
    private prisma: PrismaService,
    // private paymentService: PaymentsService,
    private pesapalService: PesapalService,
    private notificationService: NotificationService,
  ) {}


  

  /**
   * Creates a new ticket type for an event.
   *
   * @param createTicketTypeDto - Details of the ticket type to create.
   * @param admin - The authenticated admin creating the ticket type.
   * @returns The created ticket type entity.
   */

  
  async createTicketType(
    createTicketTypeDto: CreateTicketTypeDTO,
    admin: UserEntity,
  ): Promise<TicketCreatedEntity> {
    const { ticketType, price, quantity, eventId, image} = createTicketTypeDto;

  

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
          image,
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
    const { ticketTypeId, quantity, eventId, phoneNumber } =
      createTicketPurchaseDto;

    try {
      // Validate Ticket Type
      const ticketType = await this.prisma.ticketType.findUnique({
        where: { id: ticketTypeId },
      });
      if (!ticketType) {
        throw new BadRequestException(
          'The selected ticket type does not exist.',
        );
      }
      if (ticketType.quantity < quantity) {
        throw new BadRequestException(
          `Insufficient ticket quantity. Only ${ticketType.quantity} tickets are available.`,
        );
      }

      // Validate Event
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
      });
      if (!event) {
        throw new BadRequestException('The associated event does not exist.');
      }

      // Calculate Total Amount
      const amount = ticketType.price * quantity;
      // Get Pesapal IPN (if not registered, register one)
      let ipnList = await this.pesapalService.getRegisteredIPNs();
      if (!ipnList || ipnList.length === 0) {
        const ipnResponse = await this.pesapalService.registerIPN(
          'POST',
          'https://yourdomain.com/ipn',
        );
        ipnList = [{ ipn_id: ipnResponse.ipn_id }];
      }

      const pesapalNotificationId = ipnList[0].ipn_id;

      // Prepare Order Payload
      const orderPayload = {
        id: `TXN-${Date.now()}`, // Unique transaction reference
        currency: 'KES',
        amount,
        description: `Ticket purchase for ${event.name}`,
        callback_url: 'https://yourdomain.com/payment-callback',
        notification_id: pesapalNotificationId,
        billing_address: {
          phone_number: phoneNumber,
          email_address: user.email,
          country_code: 'KE',
          first_name: user.name,
          last_name: '',
        },
      };

      // Submit Order to Pesapal
      const orderResponse = await this.pesapalService.submitOrder(orderPayload);

      // Store Transaction in DB
      const transaction = await this.prisma.transaction.create({
        data: {
          amount,
          invoiceNumber: orderPayload.id,
          userId: user.id,
          pesapalOrderId: orderResponse.order_tracking_id,
          status: 'PENDING',
        },
      });

      // Temporarily Reserve Tickets
      const reservation = await this.prisma.ticket.create({
        data: {
          price: ticketType.price,
          ticketType: ticketType.ticketType,
          transactionId: transaction.id,
          quantity,
          eventId,
          userId: user.id,
          scanned: false,
        },
      });

      this.logger.log(
        `Ticket reservation created for user ${user.email}. Waiting for payment confirmation.`,
      );

      return reservation;
    } catch (error) {
      this.logger.error('Error during ticket purchase:', error.message);
      throw new InternalServerErrorException(
        'Failed to complete ticket purchase. Please try again later.',
      );
    }
  }

  /**
   * Checks the payment status and confirms ticket purchases.
   */
  async confirmTicketPurchase(orderTrackingId: string): Promise<boolean> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { pesapalOrderId: orderTrackingId },
      });
      if (!transaction) throw new BadRequestException('Transaction not found.');

      const paymentStatus =
        await this.pesapalService.getTransactionStatus(orderTrackingId);

      if (paymentStatus.payment_status_description === 'COMPLETED') {
        // Update transaction status
        await this.prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'CONFIRMED' },
        });

        // Confirm the ticket purchase
        await this.prisma.ticket.updateMany({
          where: { transactionId: transaction.id },
          data: { scanned: false }, // Mark as valid
        });

        this.logger.log(
          `Payment confirmed. Tickets activated for transaction: ${transaction.id}`,
        );
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error('Failed to confirm ticket purchase:', error.message);
      throw new InternalServerErrorException(
        'Failed to confirm ticket purchase.',
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
