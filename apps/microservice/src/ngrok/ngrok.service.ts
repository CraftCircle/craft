import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as ngrok from 'ngrok';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class NgrokService implements OnModuleInit {
  private readonly logger = new Logger(NgrokService.name);
  private tunnelUrl: string | null = null;
  private initialized = false;

  async onModuleInit(): Promise<void> {
    if (process.env.LOCAL === 'true') {
      await this.initTunnel();
    }
  }

  async initTunnel(): Promise<void> {
    if (this.initialized) {
      this.logger.log('Ngrok tunnel already initialized.');
      return;
    }

    try {

      
      const url = await ngrok.connect({
        addr: 8080,
        authtoken: process.env.NGROK_AUTH_TOKEN,
      });

      this.tunnelUrl = url;
      this.initialized = true;
      this.logger.log(`✅ Ngrok tunnel started at: ${url}`);
    } catch (error) {
      this.logger.error('❌ Failed to start ngrok tunnel:', error.message);
    }
  }

  getTunnelUrl(): string {
    if (!this.initialized || !this.tunnelUrl) {
      this.logger.warn('Tunnel URL requested before Ngrok initialized.');
      return '';
    }
    return this.tunnelUrl;
  }
}
