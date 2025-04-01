import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field()
  availabilityId: string;

  @Field({ nullable: true })
  notes?: string;
}
