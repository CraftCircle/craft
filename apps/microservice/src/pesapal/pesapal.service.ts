import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreatePesapalAuth } from './dto/pesapal.auth';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PesapalService {
  private readonly logger = new Logger(PesapalService.name);
  private readonly baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('PESAPAL_ENV') === 'demo'
        ? 'https://cybqa.pesapal.com/pesapalv3/api'
        : 'https://pay.pesapal.com/v3/api';
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      this.logger.log('Using cached access token.');
      return this.accessToken;
    }

    const consumerKey = this.configService.get<string>('PESAPAL_CONSUMER_KEY');
    const consumerSecret = this.configService.get<string>(
      'PESAPAL_CONSUMER_SECRET',
    );

    const url = `${this.baseUrl}/Auth/RequestToken`;

    try {
      const response = await firstValueFrom(
        this.httpService.post<CreatePesapalAuth>(
          url,
          {
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        ),
      );

      this.accessToken = response.data.token;
      this.tokenExpiry = new Date(response.data.expiryDate);

      this.logger.log(
        `Successfully retrieved access token, expires at ${response.data.expiryDate}`,
      );
      return this.accessToken;
    } catch (error) {
      this.logger.error(error.message, 'Failed to retrieve access token');
      throw new HttpException(
        'Failed to retrieve access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //Register IPN
  async registerIPN(ipnNotificationType: string, ipnUrl: string): Promise<any> {
    const url = `${this.baseUrl}/URLSetup/RegisterIPN`;

    try {
      const accessToken = await this.getAccessToken();

      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            url: ipnUrl,
            ipn_notification_type: ipnNotificationType,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log(`IPN registered successfully: ${response.data.ipn_id}`);
      return response.data;
    } catch (error) {
      this.logger.error(error.message, 'Failed to register IPN');
      throw new HttpException(
        'Failed to register IPN',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get Registered IPNs
  async getRegisteredIPNs(): Promise<any> {
    const url = `${this.baseUrl}/URLSetup/GetIpnList`;

    try {
      const accessToken = await this.getAccessToken();

      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(error.message, 'Failed to fetch registered IPNs');
      throw new HttpException(
        'Failed to fetch registered IPNs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Submit Order
  async submitOrder(orderPayload: any): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/Transactions/SubmitOrderRequest`,
          orderPayload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log(
        `Order submitted successfully: ${response.data.orderTrackingId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(error.message, 'Failed to submit order');
      throw new HttpException(
        'Failed to submit order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get Transaction Status
  async getTransactionStatus(orderTrackingId: string): Promise<any> {
    const url = `${this.baseUrl}/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`;

    try {
      const accessToken = await this.getAccessToken();

      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(error.message, 'Failed to fetch transaction status');
      throw new HttpException(
        'Failed to fetch transaction status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Request Refund
  async requestRefund(refundPayload: any): Promise<any> {
    const url = `${this.baseUrl}/Transactions/RefundRequest`;

    try {
      const accessToken = await this.getAccessToken();

      const response = await firstValueFrom(
        this.httpService.post(url, refundPayload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
      );

      this.logger.log(
        `Refund requested successfully: ${response.data.message}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(error.message, 'Failed to request refund');
      throw new HttpException(
        'Failed to request refund',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Cancel Order
  async cancelOrder(orderTrackingId: string): Promise<any> {
    const url = `${this.baseUrl}/Transactions/CancelOrder`;

    try {
      const accessToken = await this.getAccessToken();

      const response = await firstValueFrom(
        this.httpService.post(
          url,
          { order_tracking_id: orderTrackingId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log(`Order cancellation requested: ${response.data.message}`);
      return response.data;
    } catch (error) {
      this.logger.error(error.message, 'Failed to cancel order');
      throw new HttpException(
        'Failed to cancel order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
