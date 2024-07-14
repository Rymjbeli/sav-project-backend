import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent, ID
} from "@nestjs/graphql";
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
  findOne(@Args('id', { type: () => ID }) id: string, user: User) {
    return this.vehiculesService.findOne(id, user);
  }

  @Mutation(() => Vehicule)
  updateVehicule(
    @Args('updateVehiculeInput') updateVehiculeInput: UpdateVehiculeInput,
    client: Client,
  ) {
    return this.vehiculesService.update(updateVehiculeInput, client);
  }

  @Mutation(() => Vehicule)
  removeVehicule(@Args('id', { type: () => ID }) id: string, user: User) {
    return this.vehiculesService.remove(id, user);
  }

  @Mutation(() => Vehicule)
  restoreVehicule(@Args('id', { type: () => ID }) id: string, user: User) {
    return this.vehiculesService.restore(id, user);
  }

  @ResolveField(() => Client)
  client(@Parent() vehicule: Vehicule) {
    return this.vehiculesService.findVehiculeOwner(vehicule.client?.id);
  }
}
