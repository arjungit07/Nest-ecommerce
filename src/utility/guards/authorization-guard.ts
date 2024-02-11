import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const userRoles = request?.currentUser?.roles;

    if (!userRoles || !Array.isArray(userRoles)) {
      throw new UnauthorizedException('User roles not available or invalid');
    }

    const result = userRoles
      .map((role: string) => allowedRoles.includes(role))
      .find((val: boolean) => val === true);

    if (result) return true;

    throw new UnauthorizedException('Unauthorized');
  }
}
