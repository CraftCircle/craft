import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAvailabilityInput {
  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field()
  dayOfWeek: string;
}
