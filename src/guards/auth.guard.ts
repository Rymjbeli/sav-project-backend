import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    try {
      const authHeader = request.headers.authorization;
      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer')
        throw new UnauthorizedException('Format de jeton invalide');

      if (this.authService.isTokenBlacklisted(token))
        throw new UnauthorizedException("Token n'est plus valide");

      request.user = this.jwtService.verify(token);

      return true;
    } catch (error) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
  }
}
