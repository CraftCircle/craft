import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PostEntity {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  audio?: string;

  @Field()
  image?: string;

  @Field()
  video?: string;

  @Field()
  authorId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
