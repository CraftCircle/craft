import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class BillingAddressDTO {
  @Field({ nullable: true })
  phone_number?: string;

  @Field({ nullable: true })
  email_address?: string;

  @Field({ nullable: true })
  country_code?: string;

  @Field({ nullable: true })
  first_name?: string;

  @Field({ nullable: true })
  last_name?: string;

  @Field({ nullable: true })
  line_1?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  postal_code?: number;
}

@InputType()
export class CreatePesapalOrderDTO {
  @Field()
  id: string; // Unique merchant reference

  @Field()
  currency: string;

  @Field()
  amount: number;

  @Field()
  description: string;

  @Field()
  callback_url: string;

  @Field()
  notification_id: string;

  @Field({ nullable: true })
  redirect_mode?: string;

  @Field({ nullable: true })
  cancellation_url?: string;

  @Field({ nullable: true })
  branch?: string;

  @Field(() => BillingAddressDTO) 
  billing_address: BillingAddressDTO;
}
