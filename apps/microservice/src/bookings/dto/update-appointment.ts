import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';

registerEnumType(BookingStatus, { name: 'BookingStatus' });

@InputType()
export class UpdateAppointmentInput {
  @Field(() => BookingStatus, { nullable: true })
  status?: BookingStatus;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  newAvailabilityId?: string;
}
