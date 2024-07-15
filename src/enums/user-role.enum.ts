import { registerEnumType } from '@nestjs/graphql';

export enum UserRoleEnum {
  CLIENT = 'Client',
  ADMIN = 'Admin',
  SUPERADMIN = 'SuperAdmin',
}

registerEnumType(UserRoleEnum, {
  name: 'UserRole',
});
