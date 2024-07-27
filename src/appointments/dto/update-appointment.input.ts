import { CreateAppointmentInput } from './create-appointment.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateAppointmentInput extends PartialType(
  CreateAppointmentInput,
) {}
