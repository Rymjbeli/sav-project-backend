import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { Client } from '../users/entities/client.entity';
import { Vehicule } from '../vehicules/entities/vehicule.entity';
import { Service } from '../services/entities/service.entity';
import { User } from '../users/entities/user.entity';

@Resolver(() => Appointment)
export class AppointmentsResolver {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Mutation(() => Appointment)
  async createAppointment(
    @Args('createAppointmentInput')
    createAppointmentInput: CreateAppointmentInput,
    client: Client,
  ) {
    return await this.appointmentsService.create(
      createAppointmentInput,
      client,
    );
  }

  @Query(() => [Appointment], { name: 'appointments' })
  async findAll(user: User) {
    return await this.appointmentsService.findAll(user);
  }

  @Query(() => Appointment, { name: 'appointment' })
  async findOne(@Args('id', { type: () => ID }) id: string, user: User) {
    return await this.appointmentsService.findOne(id, user);
  }

  @Mutation(() => Appointment)
  async updateAppointment(
    @Args('updateAppointmentInput')
    updateAppointmentInput: UpdateAppointmentInput,
    user: User,
  ) {
    return await this.appointmentsService.update(updateAppointmentInput, user);
  }

  @Mutation(() => Appointment)
  async removeAppointment(
    @Args('id', { type: () => ID }) id: string,
    user: User,
  ) {
    return await this.appointmentsService.remove(id, user);
  }

  @Mutation(() => Appointment)
  async restoreAppointment(
    @Args('id', { type: () => ID }) id: string,
    user: User,
  ) {
    return await this.appointmentsService.restore(id, user);
  }

  @ResolveField(() => Client)
  async client(@Parent() appointment: Appointment) {
    return await this.appointmentsService.findAppointmentOwner(
      appointment.client?.id,
    );
  }

  @ResolveField(() => Vehicule)
  async vehicule(@Parent() appointment: Appointment, user: User) {
    return await this.appointmentsService.findAppointmentVehicle(
      appointment.vehicule?.id,
      user,
    );
  }

  @ResolveField(() => Service)
  async service(@Parent() appointment: Appointment, user: User) {
    return await this.appointmentsService.findAppointmentService(
      appointment.service?.id,
      user,
    );
  }
}
