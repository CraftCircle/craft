import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { PesapalService } from './pesapal.service';
import { Pesapal } from './entities/pesapal.entity';
import { CreatePesapalOrderDTO, PesapalTransactionStatus } from './dto/create-pesapal.order.dto';
import { RefundRequestDTO } from './dto/refund-request.dto';
import { Logger } from '@nestjs/common';

@Resolver(() => Pesapal)
export class PesapalResolver {
   private readonly logger = new Logger(PesapalResolver.name);
  constructor(private readonly pesapalService: PesapalService) {}

  @Query(() => String)
  async getAccessToken() {
    return this.pesapalService.getAccessToken();
  }
  @Query(() => [String])
  async getRegisteredIPNs() {
    return this.pesapalService.getRegisteredIPNs();
  }

  @Query(() => PesapalTransactionStatus)
  async getTransactionStatus(@Args('orderTrackingId') orderTrackingId: string) {
    this.logger.log(`Resolver: Fetching status for orderTrackingId: ${orderTrackingId}`);
    return this.pesapalService.getTransactionStatus(orderTrackingId);
  }
  

  @Mutation(() => String)
  async registerIPN(
    @Args('ipnNotificationType') ipnNotificationType: 'GET' | 'POST',
    @Args('ipnUrl') ipnUrl: string,
  ) {
    return this.pesapalService.getOrRegisterIPN(ipnNotificationType, ipnUrl);
  }

  @Mutation(() => String)
  async submitOrder(@Args('orderPayload') orderPayload: CreatePesapalOrderDTO) {
    return this.pesapalService.submitOrder(orderPayload);
  }

  @Mutation(() => String)
  async requestRefund(
    @Args('refundPayload', { type: () => RefundRequestDTO })
    refundPayload: RefundRequestDTO,
  ) {
    return this.pesapalService.requestRefund(refundPayload);
  }
  @Mutation(() => String)
  async cancelOrder(@Args('orderTrackingId') orderTrackingId: string) {
    return this.pesapalService.cancelOrder(orderTrackingId);
  }
}
