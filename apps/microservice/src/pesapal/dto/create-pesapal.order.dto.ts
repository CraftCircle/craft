import { InputType, Field, ObjectType } from '@nestjs/graphql';

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

@ObjectType()
export class PesapalError {
  @Field()
  error_type: string;

  @Field()
  code: string;

  @Field()
  message: string;

  @Field()
  call_back_url: string;
}



@ObjectType()
export class PesapalTransactionStatus {
  @Field({ nullable: true })
  payment_method?: string;

  @Field({ nullable: true })
  amount?: number;

  @Field({ nullable: true })
  created_date?: string;

  @Field({ nullable: true })
  confirmation_code?: string;

  @Field({ nullable: true })
  order_tracking_id?: string;

  @Field({ nullable: true })
  payment_status_description?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  payment_account?: string;

  @Field({ nullable: true })
  call_back_url?: string;

  @Field({ nullable: true })
  status_code?: number;

  @Field({ nullable: true })
  merchant_reference?: string;

  @Field({ nullable: true })
  account_number?: string;

  @Field({ nullable: true })
  payment_status_code?: string;

  @Field({ nullable: true })
  currency?: string;

  @Field(() => PesapalError, { nullable: true })
  error?: PesapalError;

  @Field({ nullable: true })
  status?: string;
}

