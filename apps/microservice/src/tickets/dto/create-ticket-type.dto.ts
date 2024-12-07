import { InputType, Field, Float, Int, registerEnumType } from '@nestjs/graphql';
import { TicketTypeEnum } from '@prisma/client';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';



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


  @Field(() => GraphQLUpload, { nullable: true })
  image?: FileUpload;

  @Field(() => Int)
  quantity: number;

  @Field()
  eventId: string;
}
