import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateTicketPurchaseDTO {
  @Field()
  ticketTypeId: string; // ID of the TicketType the user is purchasing

  @Field(() => Int)
  quantity: number; // Number of tickets to purchase

  @Field()
  transactionId: string; // Transaction ID from the payment provider

  @Field()
  eventId: string; // ID of the Event associated with the ticket

  @Field(() => String, { nullable: true }) 
  eventName?: string; // Name of the event for better user experience

  @Field({ nullable: true }) //Name of the user purchasing the ticket
  phoneNumber?: string;
}
