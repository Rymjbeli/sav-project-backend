import { Resolver, Query, Mutation, Args, Int, ID, Context } from "@nestjs/graphql";
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
  @UseGuards(AuthGuard)
  async changePassword(
    @CurrentUser() user: User,
    @Args('password') password: string,
    @Args('confirmPassword') confirmPassword: string,
  ) {
    console.log(user);
    return this.usersService.changePassword(user, password, confirmPassword);
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Args('email') email: string) {
    return await this.usersService.forgotPassword(email);
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Context() context,
    @Args('password') password: string,
    @Args('confirmPassword') confirmPassword: string,
  ) {
    const token = context.req.query.token;
    return await this.usersService.resetPassword(
      token,
      password,
      confirmPassword,
    );
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(AuthGuard)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.usersService.findOne(id, user);
  }
  @Mutation(() => User)
  // @UseGuards(AuthGuard)
  async removeUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.usersService.remove(id, user);
  }
  @Mutation(() => User)
  // @UseGuards(AuthGuard)
  async restoreUser(@Args('id', { type: () => ID }) id: string) {
    return await this.usersService.restore(id);
  }
}
