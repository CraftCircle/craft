import { ObjectType, Field, ID } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

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

  @Field(() => GraphQLUpload) 
  image: FileUpload;

  @Field()
  creatorId: string;
}
