import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreatePesapalAuth } from './dto/pesapal.auth';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PesapalService {
  private readonly logger = new Logger(PesapalService.name);
  private readonly baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('PESAPAL_ENV') === 'demo'
        ? 'https://cybqa.pesapal.com/pesapalv3/api'
        : 'https://pay.pesapal.com/v3/api';
  }

  private async refreshToken(): Promise<void> {
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

      const { token, expiryDate } = response.data;

      if (!token) {
        this.logger.error('Pesapal response missing token', response.data);
        throw new Error('Access token not received from Pesapal');
      }

      this.accessToken = token;
      this.tokenExpiry = new Date(expiryDate);
    } catch (error) {
      this.logger.error(
        'Failed to retrieve access token',
        error?.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to retrieve access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAccessToken(forceRefresh = false): Promise<string> {
    const now = new Date();

    if (
      !forceRefresh &&
      this.accessToken &&
      this.tokenExpiry &&
      now < this.tokenExpiry
    ) {
      this.logger.log('Using cached access token.');
      return this.accessToken;
    }

    await this.refreshToken();
    return this.accessToken!;
  }

  private async withTokenRetry<T>(
    fn: (token: string) => Promise<T>,
  ): Promise<T> {
    try {
      const token = await this.getAccessToken();
      return await fn(token);
    } catch (e) {
      this.logger.warn('Retrying with refreshed token...');
      const token = await this.getAccessToken(true);
      return await fn(token);
    }
  }

  async getTransactionStatus(orderTrackingId: string): Promise<any> {
    const url = `${this.baseUrl}/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`;

    this.logger.log(
      `Fetching transaction status for orderTrackingId: ${orderTrackingId}`,
    );

    return this.withTokenRetry(async (token) => {
      this.logger.log(`Using access token: ${token}`);
      try {
        const response = await firstValueFrom(
          this.httpService.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }),
        );

        this.logger.log(
          'Raw Pesapal transaction status response:',
          JSON.stringify(response.data),
        );

        if (!response.data) {
          this.logger.warn('No data received from Pesapal.');
          throw new HttpException(
            'No data received from Pesapal',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        const data = response.data;

        return {
          status: data.status ?? null,
          message: data.message ?? null,
          description: data.description ?? null,
          confirmation_code: data.confirmation_code ?? null,
          payment_method: data.payment_method ?? null,
          amount: data.amount ?? null,
          created_date: data.created_date ?? null,
          order_tracking_id: data.order_tracking_id ?? null,
          merchant_reference: data.merchant_reference ?? null,
          payment_account: data.payment_account ?? null,
          call_back_url: data.call_back_url ?? null,
          payment_status_code: data.payment_status_code ?? null,
          payment_status_description: data.payment_status_description ?? null,
          account_number: data.account_number ?? null,
          currency: data.currency ?? null,
          status_code: data.status_code ?? null,
          error: data.error ?? null,
        };
      } catch (error) {
        this.logger.error(
          'Error fetching transaction status:',
          error?.response?.data || error.message,
        );
        throw new HttpException(
          'Failed to fetch transaction status',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }

  async submitOrder(orderPayload: any): Promise<any> {
    const url = `${this.baseUrl}/Transactions/SubmitOrderRequest`;

    return this.withTokenRetry(async (token) => {
      const response = await firstValueFrom(
        this.httpService.post(url, orderPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
      );

      this.logger.debug(
        'Pesapal submitOrder response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    });
  }

  async getRegisteredIPNs(): Promise<any> {
    const url = `${this.baseUrl}/URLSetup/GetIpnList`;

    return this.withTokenRetry(async (token) => {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
      );

      this.logger.debug(
        'Pesapal registered IPNs response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    });
  }

  async requestRefund(refundPayload: any): Promise<any> {
    const url = `${this.baseUrl}/Transactions/RefundRequest`;

    return this.withTokenRetry(async (token) => {
      const response = await firstValueFrom(
        this.httpService.post(url, refundPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
      );

      this.logger.debug(
        'Pesapal refund response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    });
  }

  async cancelOrder(orderTrackingId: string): Promise<any> {
    const url = `${this.baseUrl}/Transactions/CancelOrder`;

    return this.withTokenRetry(async (token) => {
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          { order_tracking_id: orderTrackingId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.debug(
        'Pesapal cancel order response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    });
  }

  async getOrRegisterIPN(
    ipnNotificationType: 'GET' | 'POST',
    ipnUrl: string,
  ): Promise<string> {
    const existing = await this.prisma.pesapalIPN.findFirst({
      where: {
        ipnUrl,
        type: ipnNotificationType,
      },
    });

    if (existing) {
      this.logger.log(`Reusing existing IPN: ${existing.ipnId}`);
      return existing.ipnId;
    }

    const url = `${this.baseUrl}/URLSetup/RegisterIPN`;

    const data = await this.withTokenRetry(async (token) => {
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            url: ipnUrl,
            ipn_notification_type: ipnNotificationType,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      this.logger.debug(
        'Pesapal register IPN response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    });

    const saved = await this.prisma.pesapalIPN.create({
      data: {
        ipnId: data.ipn_id,
        ipnUrl,
        type: ipnNotificationType,
      },
    });

    this.logger.log(`New IPN saved to DB: ${saved.ipnId}`);
    return saved.ipnId;
  }
}
