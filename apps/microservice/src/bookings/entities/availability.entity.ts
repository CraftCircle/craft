import { Field, ObjectType, ID } from '@nestjs/graphql';
import { BookingEntity } from './booking.entity';
import { UserEntity } from '../../users/entities/user.entity';

@ObjectType()
export class AvailabilityEntity {
  @Field(() => String)
  id: string;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field(() => UserEntity)
  admin: UserEntity;

  @Field()
  dayOfWeek: string;

  @Field(() => [BookingEntity], { nullable: 'itemsAndList' })
  appointments?: BookingEntity[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
