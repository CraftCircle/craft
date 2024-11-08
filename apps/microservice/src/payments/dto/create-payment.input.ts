import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
  @Field()
  phoneNumber: string;

  @Field()
  amount: string;

  @Field()
  accountReference: string;
}
