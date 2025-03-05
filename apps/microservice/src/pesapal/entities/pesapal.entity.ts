import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Pesapal {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
