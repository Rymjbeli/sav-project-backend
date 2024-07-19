import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthService } from '../auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Mutation(() => User)
  async registerClient(
    @Args('userData') userData: CreateUserInput,
  ): Promise<User> {
    return this.authService.registerClient(userData);
  }

  @Mutation(() => User)
  async registerAdmin(
    @Args('userData') userData: CreateUserInput,
  ): Promise<User> {
    return this.authService.registerAdmin(userData);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(AuthGuard)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.usersService.findOne(id, user);
  }
}
