import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import {
  NotificationCategory,
  NotificationStatus,
  NotificationType,
} from '@prisma/client';
import { GraphQLJSON } from 'graphql-type-json';

registerEnumType(NotificationCategory, { name: 'NotificationCategory' });
registerEnumType(NotificationStatus, { name: 'NotificationStatus' });
registerEnumType(NotificationType, { name: 'NotificationType' });

@ObjectType()
export class NotificationEntity {
  @Field() id: string;
  @Field() title: string;
  @Field(() => GraphQLJSON) body: any;
  @Field(() => NotificationType) type: NotificationType;
  @Field(() => NotificationCategory) category: NotificationCategory;
  @Field(() => NotificationStatus) status: NotificationStatus;
  @Field(() => GraphQLJSON, { nullable: true }) externalError?: any;
  @Field() createdAt: Date;
  @Field() readAt: Date;
}
