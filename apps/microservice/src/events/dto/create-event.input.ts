import { InputType, Field } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal';

@InputType()
export class CreateEventInput {
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

  @Field(() => GraphQLUpload, { nullable: true
    
  }) // Support image uploads
  image?: FileUpload;
}
