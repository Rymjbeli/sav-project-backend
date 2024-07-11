import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VehiculesService } from './vehicules.service';
import { Vehicule } from './entities/vehicule.entity';
import { CreateVehiculeInput } from './dto/create-vehicule.input';
import { UpdateVehiculeInput } from './dto/update-vehicule.input';

@Resolver(() => Vehicule)
export class VehiculesResolver {
  constructor(private readonly vehiculesService: VehiculesService) {}

  @Mutation(() => Vehicule)
  createVehicule(
    @Args('createVehiculeInput') createVehiculeInput: CreateVehiculeInput,
  ) {
    return this.vehiculesService.create(createVehiculeInput);
  }

  @Query(() => [Vehicule], { name: 'vehicules' })
  findAll() {
    return this.vehiculesService.findAll();
  }

  @Query(() => Vehicule, { name: 'vehicule' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.vehiculesService.findOne(id);
  }

  @Mutation(() => Vehicule)
  updateVehicule(
    @Args('updateVehiculeInput') updateVehiculeInput: UpdateVehiculeInput,
  ) {
    return this.vehiculesService.update(
      updateVehiculeInput.id,
      updateVehiculeInput,
    );
  }

  @Mutation(() => Vehicule)
  removeVehicule(@Args('id', { type: () => Int }) id: number) {
    return this.vehiculesService.remove(id);
  }
}
