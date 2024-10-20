import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.dto';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserInput) {
  @Field()
  id: string;
  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  email?: string;
}
