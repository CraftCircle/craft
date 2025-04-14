import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TicketPurchaseResponse {
  @Field()
  id: string;

  @Field()
  price: number;

  @Field()
  ticketType: string;

  @Field()
  redirectUrl: string;

  @Field()
  pesapalOrderTrackingId: string;
}
