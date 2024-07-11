import { CreateVehiculeInput } from './create-vehicule.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVehiculeInput extends PartialType(CreateVehiculeInput) {
  @Field(() => Int)
  id: number;
}
