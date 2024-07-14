import { Resolver, Query, Mutation, Args, Int, ID } from "@nestjs/graphql";
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';
import { User } from '../users/entities/user.entity';

@Resolver(() => Service)
export class ServicesResolver {
  constructor(private readonly servicesService: ServicesService) {}

  @Mutation(() => Service)
  createService(
    @Args('createServiceInput') createServiceInput: CreateServiceInput,
    user: User,
  ) {
    return this.servicesService.create(createServiceInput, user);
  }

  @Query(() => [Service], { name: 'services' })
  findAll(user: User) {
    return this.servicesService.findAll(user);
  }

  @Query(() => Service, { name: 'service' })
  findOne(@Args('id', { type: () => ID }) id: string, user: User) {
    return this.servicesService.findOne(id, user);
  }

  @Mutation(() => Service)
  updateService(
    @Args('updateServiceInput') updateServiceInput: UpdateServiceInput,
    user: User,
  ) {
    return this.servicesService.update(
      updateServiceInput,
      user
    );
  }

  @Mutation(() => Service)
  removeService(@Args('id', { type: () => ID }) id: string, user: User) {
    return this.servicesService.remove(id, user);
  }

  @Mutation(() => Service)
  restoreService(@Args('id', { type: () => ID }) id: string, user: User) {
    return this.servicesService.restore(id, user);
  }
}
