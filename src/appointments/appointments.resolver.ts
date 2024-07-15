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
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRoleEnum } from '../enums/user-role.enum';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver(() => Appointment)
export class AppointmentsResolver {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Mutation(() => Appointment)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CLIENT)
  async createAppointment(
    @Args('createAppointmentInput')
    createAppointmentInput: CreateAppointmentInput,
    @CurrentUser() client: Client,
  ) {
    return await this.appointmentsService.create(
      createAppointmentInput,
      client,
    );
  }

  @Query(() => [Appointment], { name: 'appointments' })
  @UseGuards(AuthGuard)
  async findAll(@CurrentUser() user: User) {
    return await this.appointmentsService.findAll(user);
  }

  @Query(() => Appointment, { name: 'appointment' })
  @UseGuards(AuthGuard)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.appointmentsService.findOne(id, user);
  }

  @Mutation(() => Appointment)
  @UseGuards(AuthGuard)
  async updateAppointment(
    @Args('updateAppointmentInput')
    updateAppointmentInput: UpdateAppointmentInput,
    @CurrentUser() user: User,
  ) {
    return await this.appointmentsService.update(updateAppointmentInput, user);
  }

  @Mutation(() => Appointment)
  @UseGuards(AuthGuard)
  async removeAppointment(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.appointmentsService.remove(id, user);
  }

  @Mutation(() => Appointment)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPERADMIN, UserRoleEnum.ADMIN)
  async restoreAppointment(@Args('id', { type: () => ID }) id: string) {
    return await this.appointmentsService.restore(id);
  }

  @ResolveField(() => Client)
  async client(@Parent() appointment: Appointment) {
    return await this.appointmentsService.findAppointmentOwner(
      appointment.client?.id,
    );
  }

  @ResolveField(() => Vehicule)
  async vehicule(
    @Parent() appointment: Appointment,
    @CurrentUser() user: User,
  ) {
    return await this.appointmentsService.findAppointmentVehicle(
      appointment.vehicule?.id,
      user,
    );
  }

  @ResolveField(() => Service)
  async service(@Parent() appointment: Appointment) {
    return await this.appointmentsService.findAppointmentService(
      appointment.service?.id,
    );
  }
}
