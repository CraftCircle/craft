import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderStatusInput {
  @Field()
  orderId: string;

  @Field()
  status: string; // e.g., PENDING, CONFIRMED, SHIPPED, DELIVERED
}
