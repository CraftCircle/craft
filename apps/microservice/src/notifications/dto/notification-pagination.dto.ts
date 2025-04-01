import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class GetNotificationsInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;
}

@InputType()
export class MarkAsReadInput {
  @Field(() => String)
  notificationId: string;
}
