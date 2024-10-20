import { InputType, Field } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'name of the user' })
  name: string;
  @Field(() => String, { description: 'email of the user' })
  email: string;
  @Field(() => String, { description: 'password of the user' })
  password: string;
  @Field(() => Role, {
    description: 'role of the user',
    defaultValue: Role.USER,
  }) 
  role: Role;
}
