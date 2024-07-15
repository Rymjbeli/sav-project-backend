import { CreateVehiculeInput } from './create-vehicule.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateVehiculeInput extends PartialType(CreateVehiculeInput) {
  @Field(() => ID)
  id: string;
}
