import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreatePesapalAuth } from './dto/pesapal.auth';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { PesapalIPN } from '@prisma/client';
import { NgrokService } from '../ngrok/ngrok.service';

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
    private readonly ngrokService: NgrokService,
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
    const buffer = 30 * 1000; // 30 seconds buffer

    if (
      !forceRefresh &&
      this.accessToken &&
      this.tokenExpiry &&
      now.getTime() + buffer < this.tokenExpiry.getTime()
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

  async getTransactionStatus(orderTrackingId: string): Promise<any> {
    const url = `${this.baseUrl}/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`;

    return this.withTokenRetry(async (token) => {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
      );

      return response.data ?? null;
    });
  }

  async getOrRegisterIPN(
    ipnNotificationType: 'GET' | 'POST',
    ipnUrl?: string,
  ): Promise<string> {
    const finalIpnUrl = ipnUrl ?? `${this.ngrokService.getTunnelUrl()}/ipn`;

    const existing = await this.prisma.pesapalIPN.findFirst({
      where: { ipnUrl: finalIpnUrl, type: ipnNotificationType },
    });

    if (existing) {
      this.logger.log(`Reusing existing IPN: ${existing.ipnId}`);
      return existing.ipnId;
    }

    const registerUrl = `${this.baseUrl}/URLSetup/RegisterIPN`;

    const responseData = await this.withTokenRetry(async (token) => {
      const response = await firstValueFrom(
        this.httpService.post(
          registerUrl,
          {
            url: finalIpnUrl,
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

      return response.data;
    });

    const { url, ipn_id, ipn_notification_type_description } = responseData;

    const saved = await this.prisma.pesapalIPN.create({
      data: {
        ipnId: ipn_id,
        ipnUrl: url,
        type: ipn_notification_type_description,
      },
    });

    this.logger.log(`New IPN saved to DB: ${saved.ipnId}`);
    return saved.ipnId;
  }

  async fetchRegisteredIPNDetails(): Promise<PesapalIPN[]> {
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

      return response.data ?? [];
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

      return response.data;
    });
  }

  //Register IPN for local tunnel
  async registerLocalTunnel(tunnelUrl: string): Promise<void> {
    const ipnUrl = `${tunnelUrl}/ipn`;
    const exists = await this.prisma.pesapalIPN.findFirst({
      where: { ipnUrl },
    });
    if (!exists) {
      await this.getOrRegisterIPN('GET', ipnUrl);
      this.logger.log(`Registered local tunnel IPN: ${ipnUrl}`);
    }
  }
}
