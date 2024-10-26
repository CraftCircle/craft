import { ObjectType, Field } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload';
import { FileUpload } from '../../upload/dto/create-upload.input';

@ObjectType()
export class PostEntity {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => GraphQLUpload)
  audio?: Promise<FileUpload>;

  @Field(() => GraphQLUpload)
  image?: Promise<FileUpload>;

  @Field(() => GraphQLUpload)
  video?: Promise<FileUpload>;

  @Field()
  authorId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
