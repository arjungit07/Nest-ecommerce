import { SetMetadata } from '@nestjs/common';

export const AuthRoles = (...roles: string[]) =>
  SetMetadata('allowedRoles', roles);
