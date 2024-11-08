import { Controller, Post, Body, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('callback')
  async handleCallback(@Body() callbackData: any, @Res() res: Response) {
    this.logger.log('Received callback data', callbackData); // Log incoming callback data

    try {
      const result = await this.paymentsService.processCallback(callbackData);
      return res.json(result);
    } catch (error) {
      this.logger.error('Error handling callback', error.message);
      return res.status(500).json({ message: 'Callback processing failed' });
    }
  }
}
