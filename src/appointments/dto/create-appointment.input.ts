import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateAppointmentInput {
  @IsNotEmpty()
  @Field(() => Date)
  date: Date;
  @IsNotEmpty()
  @Field(() => String)
  heure: string;
  @IsNotEmpty()
  @Field(() => Int)
  kilometrage: number;
  @IsNotEmpty()
  @Field(() => ID)
  clientID: string;
  @IsNotEmpty()
  @Field(() => ID)
  vehiculeID: string;
  @IsNotEmpty()
  @Field(() => ID)
  serviceID: string;
}
