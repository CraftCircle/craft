import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(apiService: string, apiGatewayService: string, userId: string): string {
    return `Api Service says: ${apiService},  Api-Gateway Service says: ${apiGatewayService} , UserId: ${userId}`;
  }
}
