import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from './auth/decorators/user.decorator';
import { AccessTokenPayload } from './auth/types/AccessTokenPayload';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('api') private readonly clientApi: ClientProxy,
    @Inject('api-gateway') private readonly clientApiGateway: ClientProxy,
  ) {}

  @Get()
  async getHello(@User() user: AccessTokenPayload): Promise<string> {
    const resultApi = await firstValueFrom(this.clientApi.send('getHello', ''));
    const resultApiGateway = await firstValueFrom(
      this.clientApiGateway.send('getHello', ''),
    );

    return this.appService.getHello(
      resultApi,
      resultApiGateway,
      user.userId,
    );
  }
}
