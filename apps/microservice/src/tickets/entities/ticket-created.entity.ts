import { ObjectType, Field,  Int } from '@nestjs/graphql';

@ObjectType()
export class TicketCreatedEntity {
  @Field()
  id: string;

  @Field()
  price: number;

  @Field(() => String)
  ticketType: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => String, { nullable: true })
  image?: string;

  @Field(() => String)
  eventId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}