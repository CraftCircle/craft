import { Role, User } from '@prisma/client';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';


registerEnumType(Role, {
  name: 'Role',
  description: 'The roles a user can have',
});
@ObjectType()
export class UserEntity implements User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field(() => Role)
  role: Role;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
