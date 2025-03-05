import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreatePesapalAuth {
  @Field(() => String)
  token: string;

  @Field(() => String)
  expiryDate: string;
}
