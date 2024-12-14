import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterOAuthInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  provider: string;

  @Field()
  providerId: string;
}
