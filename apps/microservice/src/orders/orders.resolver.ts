import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { Logger } from '@nestjs/common';


@Resolver(() => Order)
export class OrdersResolver {
  private readonly logger = new Logger(OrdersResolver.name);
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @CurrentUser() user: UserEntity,
  ) {
    return this.ordersService.createOrder(createOrderInput, user);
  }

  @Query(() => [Order], { name: 'orders' })
  findAll(@CurrentUser() user: UserEntity) {
    return this.ordersService.getOrders(user);
  }

  @Query(() => Order, { name: 'order' })
  findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.ordersService.getOrderById(id, user);
  }

  @Mutation(() => Order)
  updateOrder(
    @Args('id', { type: () => String }) id: string,
    @Args('status', { type: () => String })
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED',
    @CurrentUser() user: UserEntity,
  ) {
    return this.ordersService.updateOrderStatus(id, status, user);
  }

  @Mutation(() => Boolean)
  async removeOrder(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    try {
      await this.ordersService.deleteOrder(id, user);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete order: ${error.message}`);
      return false;
    }
  }
}
