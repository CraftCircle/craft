import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreatePaymentAuth {
  @Field(() => String, { nullable: true }) 
  access_token: string;

  @Field(() => String)
  expires_in: string;
}
