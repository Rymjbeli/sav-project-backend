import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';
import { User } from '../users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRoleEnum } from '../enums/user-role.enum';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver(() => Service)
export class ServicesResolver {
  constructor(private readonly servicesService: ServicesService) {}

  @Mutation(() => Service)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPERADMIN, UserRoleEnum.ADMIN)
  createService(
    @Args('createServiceInput') createServiceInput: CreateServiceInput,
  ) {
    return this.servicesService.create(createServiceInput);
  }

  @Query(() => [Service], { name: 'services' })
  // @UseGuards(AuthGuard)
  findAll() {
    return this.servicesService.findAll();
  }

  @Query(() => Service, { name: 'service' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPERADMIN, UserRoleEnum.ADMIN)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.servicesService.findOne(id);
  }

  @Mutation(() => Service)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPERADMIN, UserRoleEnum.ADMIN)
  updateService(
    @Args('updateServiceInput') updateServiceInput: UpdateServiceInput,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.servicesService.update(id, updateServiceInput);
  }

  @Mutation(() => Service)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPERADMIN, UserRoleEnum.ADMIN)
  removeService(@Args('id', { type: () => ID }) id: string) {
    return this.servicesService.remove(id);
  }

  @Mutation(() => Service)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPERADMIN, UserRoleEnum.ADMIN)
  restoreService(@Args('id', { type: () => ID }) id: string) {
    return this.servicesService.restore(id);
  }
}
