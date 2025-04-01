import { InputType, PartialType } from '@nestjs/graphql';
import { CreateAvailabilityInput } from './create-availability.input';

@InputType()
export class UpdateAvailabilityInput extends PartialType(
  CreateAvailabilityInput,
) {}
