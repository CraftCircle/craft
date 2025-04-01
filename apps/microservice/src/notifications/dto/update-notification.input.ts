import { InputType, Field, PartialType } from '@nestjs/graphql';
import { NotificationEntity } from '../entities/notification.entity'; // or actual input type

@InputType()
export class UpdateNotificationInput extends PartialType(NotificationEntity) {
  @Field()
  id: string;
}
