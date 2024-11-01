import {
  ObjectType,
  Field,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { TicketTypeEnum } from '@prisma/client';


registerEnumType(TicketTypeEnum, {
  name: 'TicketTypeEnum',
  description: 'The type of ticket',
});

@ObjectType()
export class TicketEntity {
  @Field()
  name: string;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => TicketTypeEnum)
  ticketType: TicketTypeEnum;

  @Field()
  transactionId: string;

  @Field()
  eventId: string;
}
