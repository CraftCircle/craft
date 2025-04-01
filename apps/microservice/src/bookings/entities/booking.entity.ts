import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';
import { AvailabilityEntity } from './availability.entity';
import { UserEntity } from '../../users/entities/user.entity';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
});

@ObjectType()
export class BookingEntity {
  @Field(() => String)
  id: string;

  @Field(() => AvailabilityEntity, {nullable: true})
  availability: AvailabilityEntity;

  @Field(() => UserEntity)
  user: UserEntity;

  @Field(() => BookingStatus)
  status: BookingStatus;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
