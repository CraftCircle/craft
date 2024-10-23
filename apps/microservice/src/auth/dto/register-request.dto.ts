import { Role } from '@prisma/client';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterRequestDTO {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  provider?: string;

  @Field(() => String, { nullable: true })
  providerId?: string;

  @Field(() => Role, { nullable: true })
  role?: Role; 
}
