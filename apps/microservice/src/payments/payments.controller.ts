import { Controller, Post, Body, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('register-urls')
  async registerUrls(@Res() res: Response) {
    try {
      const result = await this.paymentsService.registerUrl();
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: 'URL registration failed' });
    }
  }

  @Post('validation')
  async handleValidation(@Body() validationData: any, @Res() res: Response) {
    this.logger.log('Validation request received');
    // Process validationData and respond with acceptance or rejection
    const response = { ResultCode: '0', ResultDesc: 'Accepted' }; // Accept by default
    return res.json(response);
  }

  @Post('confirmation')
  async handleConfirmation(
    @Body() confirmationData: any,
    @Res() res: Response,
  ) {
    this.logger.log('Confirmation request received');
    // Process confirmationData and store transaction details if needed
    const response = { ResultCode: '0', ResultDesc: 'Success' }; // Always confirm success
    return res.json(response);
  }

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
