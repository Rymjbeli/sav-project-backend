import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginResponse } from './dto/login-response-type';
import { LoginCredentialsDto } from './dto/login-credentials.input';
import { User } from '../users/entities/user.entity';
import { CreateUserInput } from '../users/dto/create-user.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRoleEnum } from '../enums/user-role.enum';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('credentials') credentials: LoginCredentialsDto,
  ): Promise<LoginResponse> {
    const { accessToken, user } = await this.authService.login(credentials);
    return { accessToken, user };
  }

  @Mutation(() => User)
/*  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPERADMIN)*/
  async registerSuperAdmin(
    @CurrentUser() user: User,
    @Args('userData') userData: CreateUserInput,
  ): Promise<User> {
    return this.authService.registerSuperAdmin(userData);
  }

  @Mutation(() => User)
  async registerClient(
    @Args('userData') userData: CreateUserInput,
  ): Promise<User> {
    return this.authService.registerClient(userData);
  }

  @Mutation(() => Boolean)
  async resetVerificationToken(@Args('email') email: string): Promise<boolean> {
    return await this.authService.resetVerificationToken(email);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPERADMIN, UserRoleEnum.ADMIN)
  async registerAdmin(
    @CurrentUser() user: User,
    @Args('userData') userData: CreateUserInput,
  ): Promise<User> {
    return this.authService.registerAdmin(userData);
  }

  @Mutation(() => Boolean)
  async verifyEmail(
    @Args('token') token: string,
    @Args('email') email: string,
  ): Promise<boolean> {
    try {
      await this.authService.verifyEmail(token, email);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => Boolean)
  async logout(@Context() context): Promise<boolean> {
    const authHeader = context.req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }
    await this.authService.logout(token);
    return true;
  }
}
