import { Field, Float, InputType, Int } from '@nestjs/graphql';
@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;

  @Field()
  category: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  contactNumber?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];
}
