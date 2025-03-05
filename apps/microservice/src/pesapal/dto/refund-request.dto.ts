import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RefundRequestDTO {
  @Field()
  confirmation_code: string; 

  @Field()
  amount: number; 

  @Field()
  username: string; 

  @Field()
  remarks: string; 
}
