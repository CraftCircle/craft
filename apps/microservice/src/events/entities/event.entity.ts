import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Event {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  date: Date;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field()
  location: string;

  @Field() 
  image: string;

  @Field()
  creatorId: string;
}
