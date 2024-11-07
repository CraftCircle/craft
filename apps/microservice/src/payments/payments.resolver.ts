import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { CreatePaymentInput } from './dto/create-payment.input';
import { CreatePaymentAuth } from './dto/payment.auth';

@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Mutation(() => CreatePaymentAuth)
  async createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ) {
    return this.paymentsService.createPayment(createPaymentInput);
  }
}
