import { InputType, Field } from '@nestjs/graphql';


@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field({ nullable: true })  
  audio?: string;

  @Field({ nullable: true })  
  image?: string;

  @Field({ nullable: true })  
  video?: string;
}
