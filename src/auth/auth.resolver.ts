import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginResponse } from './dto/login-response-type';
import { LoginCredentialsDto } from './dto/login-credentials.input';
import { User } from '../users/entities/user.entity';
import { CreateUserInput } from '../users/dto/create-user.input';

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
  async registerSuperAdmin(
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

  @Mutation(() => User)
  async registerAdmin(
    @Args('userData') userData: CreateUserInput,
  ): Promise<User> {
    return this.authService.registerAdmin(userData);
  }

  @Mutation(() => Boolean)
  async verifyEmail(@Args('token') token: string): Promise<boolean> {
    await this.authService.verifyEmail(token);
    return true;
  }
}
