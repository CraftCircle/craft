import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Mutation(() => String)
  async registerUrl(): Promise<string> {
    await this.paymentsService.registerUrl();
    return 'URL registration successful';
  }
}
