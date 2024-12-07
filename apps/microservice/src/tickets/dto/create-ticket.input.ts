import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTicketDto {
  @Field()
  name: string;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;

  @Field()
  price: number;


  @Field()
  eventId: string;

  @Field()
  transactionId: string;

  @Field()
  quantity: number;

}
