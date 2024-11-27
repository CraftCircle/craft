import { ObjectType, Field } from '@nestjs/graphql';
import { TicketTypeEnum } from '@prisma/client';
import { EventEntity } from '../../events/entities/event.entity';

@ObjectType()
export class TicketTypeEntity {
  @Field()
  id: string;

  @Field(() => TicketTypeEnum)
  ticketType: TicketTypeEnum;

  @Field()
  price: number;

  @Field()
  quantity: number;

  @Field()
  eventId: string;

  @Field(() => EventEntity)
  event: EventEntity;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
