import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreatePaymentAuth } from './dto/payment.auth';
import { firstValueFrom } from 'rxjs';
import moment from 'moment';
import { CreatePaymentInput } from './dto/create-payment.input';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async verifyPayment(transactionId: string) {
    return 'This action adds a new payment';
  }

  async getAccessToken(): Promise<string> {
    const consumerKey = this.configService.get<string>('MPESA_CONSUMER_KEY');
    const consumerSecret = this.configService.get<string>(
      'MPESA_CONSUMER_SECRET',
    );
    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
    ).toString('base64');

    const url =
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    // this.configService.get<string>('MPESA_ENVIRONMENT') === 'sandbox'
    //   ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    //   : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    try {
      const response = await firstValueFrom(
        this.httpService.get<CreatePaymentAuth>(url, {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      const { access_token, expires_in } = response.data;

      this.logger.log(
        `Access Token fetched successfully, expires in ${expires_in} seconds`,
      );
      return access_token;
    } catch (error) {
      this.logger.error('Failed to fetch access token');
      throw new Error('Failed to get access token');
    }
  }
  async initiateStkPush(
    phoneNumber: string,
    amount: string,
    accountReference: string,
  ) {
    const shortCode = this.configService.get<string>('MPESA_SHORTCODE');
    const passKey = this.configService.get<string>('MPESA_PASSKEY');
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString(
      'base64',
    );

    const token = await this.getAccessToken();

    const url =
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    // this.configService.get<string>('MPESA_ENVIRONMENT') === 'sandbox'
    //   ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    //   : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: '1',
      PartyA: '254725552554',
      PartyB: shortCode,
      PhoneNumber: '254725552554',
      CallBackURL: 'https://craft-vnrj.onrender.com/callback',
      AccountReference: 'CRAFTCIRCLEPAY',
      TransactionDesc: 'MPESA TEST',
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, { headers }),
      );

      this.logger.log('STK Push initiated', response.data);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to initiate STK Push');
      throw new Error('STK Push initiation failed');
    }
  }

  async createPayment(
    createPaymentInput: CreatePaymentInput,
  ): Promise<CreatePaymentAuth> {
    const { phoneNumber, amount, accountReference } = createPaymentInput;

    const accessToken = await this.getAccessToken();

    try {
      const response = await this.initiateStkPush(
        phoneNumber,
        amount,
        accountReference,
      );
      this.logger.log(`Payment initiated successfully for ${phoneNumber}`);
      return {
        access_token: accessToken,
        expires_in: '3599',
      };
    } catch (error) {
      this.logger.error(`Failed to initiate payment for ${phoneNumber}`);
      throw new Error('Payment initiation failed');
    }
  }
}
