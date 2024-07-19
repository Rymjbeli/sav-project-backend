import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Mutation(() => User)
  async changePassword(
    @CurrentUser() user: User,
    @Args('password') password: string,
    @Args('confirmPassword') confirmPassword: string,
  ) {
    return this.usersService.changePassword(user, password, confirmPassword);
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Args('email') email: string) {
    return await this.usersService.forgotPassword(email);
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('token') token: string,
    @Args('password') password: string,
    @Args('confirmPassword') confirmPassword: string,
  ) {
    return await this.usersService.resetPassword(
      token,
      password,
      confirmPassword,
    );
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
