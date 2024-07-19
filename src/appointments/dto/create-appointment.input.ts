import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatusEnum } from '../../enums/appointment-status.enum';
import { TypeEnum } from '../../enums/type.enum';

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
  @IsNotEmpty()
  @IsEnum(AppointmentStatusEnum)
  @Field(() => AppointmentStatusEnum)
  etat: string;
}
