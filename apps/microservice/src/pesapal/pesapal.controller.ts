import { Controller, Get, Query, Logger } from '@nestjs/common';
import { TicketsService } from '../tickets/tickets.service';

@Controller('pesapal')
export class PesapalController {
  private readonly logger = new Logger(PesapalController.name);

  constructor(private readonly ticketsService: TicketsService) {}

  @Get('payment-callback')
  async paymentCallback(@Query('OrderTrackingId') orderTrackingId: string) {
    this.logger.log(`Payment callback received for OrderTrackingId: ${orderTrackingId}`);
    const isConfirmed = await this.ticketsService.confirmTicketPurchase(orderTrackingId);
    return { status: isConfirmed ? "success" : "pending" };
  }
}
