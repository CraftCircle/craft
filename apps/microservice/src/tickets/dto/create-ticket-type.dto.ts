import { InputType, Field, Float, Int, registerEnumType } from '@nestjs/graphql';
import { TicketTypeEnum } from '@prisma/client';



registerEnumType(TicketTypeEnum, {
  name: 'TicketTypeEnum',
  description: 'The type of ticket',
});

@InputType()
export class CreateTicketTypeDTO {
  @Field(() => TicketTypeEnum)
  ticketType: TicketTypeEnum;

  @Field(() => Float)
  price: number;


  @Field({ nullable: true }) 
  image?: string;

  @Field(() => Int)
  quantity: number;

  @Field()
  eventId: string;
}
