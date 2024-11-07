import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreatePaymentAuth {
  @Field()
  access_token: string;
  expires_in: string;
}
