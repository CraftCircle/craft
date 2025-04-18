import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PesapalIPN {
  @Field()
  ipn_id: string;

  @Field()
  url: string;

  @Field()
  created_date: string;

  @Field()
  ipn_notification_type_description: string;

  @Field()
  ipn_status_description: string;

  @Field()
  status: string;
}