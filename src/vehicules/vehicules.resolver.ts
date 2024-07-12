import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VehiculesService } from './vehicules.service';
import { Vehicule } from './entities/vehicule.entity';
import { CreateVehiculeInput } from './dto/create-vehicule.input';
import { UpdateVehiculeInput } from './dto/update-vehicule.input';
import { User } from '../users/entities/user.entity';
import { Client } from '../users/entities/client.entity';

@Resolver(() => Vehicule)
export class VehiculesResolver {
  constructor(private readonly vehiculesService: VehiculesService) {}

  @Mutation(() => Vehicule)
  createVehicule(
    @Args('createVehiculeInput') createVehiculeInput: CreateVehiculeInput,
    client: Client,
  ) {
    return this.vehiculesService.create(createVehiculeInput, client);
  }

  @Query(() => [Vehicule], { name: 'vehicules' })
  findAll(user: User) {
    return this.vehiculesService.findAll(user);
  }

  @Query(() => Vehicule, { name: 'vehicule' })
  findOne(@Args('id', { type: () => Int }) id: number, user: User) {
    return this.vehiculesService.findOne(id, user);
  }

  @Mutation(() => Vehicule)
  updateVehicule(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateVehiculeInput') updateVehiculeInput: UpdateVehiculeInput,
    client: Client,
  ) {
    return this.vehiculesService.update(id, updateVehiculeInput, client);
  }

  @Mutation(() => Vehicule)
  removeVehicule(@Args('id', { type: () => Int }) id: number, user: User) {
    return this.vehiculesService.remove(id, user);
  }

  @Mutation(() => Vehicule)
  restoreVehicule(@Args('id', { type: () => Int }) id: number, user: User) {
    return this.vehiculesService.restore(id, user);
  }
}
