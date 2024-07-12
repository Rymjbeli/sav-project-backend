import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVehiculeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
