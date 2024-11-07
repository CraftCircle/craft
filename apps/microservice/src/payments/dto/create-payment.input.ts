import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
  @Field()
  phoneNumber: string;

  @Field()
  amount: number;

  @Field()
  accountReference: string;
}
