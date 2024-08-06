import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql';
import { VehiculesService } from './vehicules.service';
import { Vehicule } from './entities/vehicule.entity';
import { CreateVehiculeInput } from './dto/create-vehicule.input';
import { UpdateVehiculeInput } from './dto/update-vehicule.input';
import { User } from '../users/entities/user.entity';
import { Client } from '../users/entities/client.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRoleEnum } from '../enums/user-role.enum';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Appointment } from '../appointments/entities/appointment.entity';

@Resolver(() => Vehicule)
export class VehiculesResolver {
  constructor(private readonly vehiculesService: VehiculesService) {}

  @Mutation(() => Vehicule)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CLIENT)
  createVehicule(
    @Args('createVehiculeInput') createVehiculeInput: CreateVehiculeInput,
    @CurrentUser() client: Client,
  ) {
    return this.vehiculesService.create(createVehiculeInput, client);
  }
  // @UseGuards(AuthGuard)
  @Query(() => [Vehicule], { name: 'vehicules' })
  findAll(@CurrentUser() user: User) {
    return this.vehiculesService.findAll(user);
  }

  @Query(() => Vehicule, { name: 'vehicule' })
  @UseGuards(AuthGuard)
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.vehiculesService.findOne(id, user);
  }

  @Mutation(() => Vehicule)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CLIENT)
  updateVehicule(
    @Args('updateVehiculeInput') updateVehiculeInput: UpdateVehiculeInput,
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() client: Client,
  ) {
    return this.vehiculesService.update(id, updateVehiculeInput, client);
  }

  @Mutation(() => Vehicule)
  // @UseGuards(AuthGuard)
  removeVehicule(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.vehiculesService.remove(id, user);
  }

  @Mutation(() => Vehicule)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPERADMIN, UserRoleEnum.ADMIN)
  restoreVehicule(@Args('id', { type: () => ID }) id: string) {
    return this.vehiculesService.restore(id);
  }

  @ResolveField(() => Client)
  client(@Parent() vehicule: Vehicule, @CurrentUser() user: User) {
    return this.vehiculesService.findVehiculeOwner(vehicule.client?.id, user);
  }
  @ResolveField(() => [Appointment])
  appointments(@Parent() vehicule: Vehicule) {
    return this.vehiculesService.findVehiculeAppointments(vehicule.id);
  }
  @Query(() => Number, { name: 'numberOfVehicules' })
  // @UseGuards(AuthGuard)
  numberOfVehicules() {
    return this.vehiculesService.numberOfVehicules();
  }
}
