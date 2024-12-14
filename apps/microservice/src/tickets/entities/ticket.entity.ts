import {
  ObjectType,
  Field,
  Float,
  Int,
  registerEnumType,
  ID,
} from '@nestjs/graphql';
import { TicketTypeEnum } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';

registerEnumType(TicketTypeEnum, {
  name: 'TicketTypeEnum',
  description: 'The type of ticket',
});

@ObjectType()
export class TicketEntity {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => TicketTypeEnum)
  ticketType: string;

  @Field()
  user : UserEntity;

  @Field()
  transactionId: string;

  @Field()
  eventId: string;
}
