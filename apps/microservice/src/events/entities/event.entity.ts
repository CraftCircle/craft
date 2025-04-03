import { ObjectType, Field } from '@nestjs/graphql';
import { TicketTypeEntity } from '../../tickets/entities/ticket-type.entity';
import { TicketEntity } from '../../tickets/entities/ticket.entity';
import { UserEntity } from '../../users/entities/user.entity';

@ObjectType()
export class EventEntity {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  date: Date;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field()
  location: string;

  @Field()
  image: string;

  @Field()
  creatorId: string;

  @Field(() => UserEntity, { nullable: true })
  User?: UserEntity;

  @Field(() => [TicketEntity], { nullable: 'itemsAndList' })
  tickets?: TicketEntity[];

  @Field(() => [TicketTypeEntity], { nullable: 'itemsAndList' })
  ticketTypes?: TicketTypeEntity[];
}
