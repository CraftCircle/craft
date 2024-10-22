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

  @Field({ nullable: true })
  password: string | null;
  @Field()
  name: string;

  @Field(() => Role)
  role: Role;

  @Field()
  provider: string;

  @Field()
  providerId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
