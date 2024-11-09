import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field()
  userId: string;
}
