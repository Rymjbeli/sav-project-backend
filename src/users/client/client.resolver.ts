import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { Vehicule } from '../../vehicules/entities/vehicule.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';

@Resolver()
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Query(() => Client, { name: 'client' })
  @UseGuards(AuthGuard)
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.clientService.findOne(id, user);
  }
  @Query(() => [Client], { name: 'clients' })
  // @UseGuards(AuthGuard)
  findAll(@CurrentUser() user: User) {
    return this.clientService.findAll(user);
  }
  @Query(() => Number, { name: 'numberOfClients' })
  // @UseGuards(AuthGuard)
  numberOfClients() {
    return this.clientService.numberOfClients();
  }
  @Query(() => Number, { name: 'numberOfNewClients' })
  // @UseGuards(AuthGuard)
  numberOfNewClients() {
    return this.clientService.numberOfNewClients();
  }
}
