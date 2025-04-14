import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class TicketPurchasedEntity {
  @Field()
  id: string;

  @Field(() => Float)
  price: number;

  @Field(() => String)
  ticketType: string; // TicketTypeEnum (e.g., GENERAL, VIP)

  @Field(() => Int)
  quantity: number;

  @Field()
  transactionId: string;

  @Field(() => Boolean)
  scanned: boolean;


  @Field(() => String)
  eventId: string;

  @Field(() => String, { nullable: true })
  eventName?: string; // Add event name for better user experience

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
