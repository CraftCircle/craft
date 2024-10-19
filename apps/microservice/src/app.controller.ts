import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('api') private readonly clientApi: ClientProxy,
    @Inject('api-gateway') private readonly clientApiGateway: ClientProxy,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const resultApi = await this.clientApi.send('getHello', '').toPromise();
    const resultApiGateway = await this.clientApiGateway
      .send('getHello', '')
      .toPromise();

    return this.appService.getHello(resultApi, resultApiGateway);
  }
}

