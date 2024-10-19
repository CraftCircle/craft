import { User } from '@prisma/client';
import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class UserEntity implements User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  createdAt: Date;

  updatedAt: Date;
}
