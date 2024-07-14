import { registerEnumType } from '@nestjs/graphql';

export enum UserRoleEnum {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

registerEnumType(UserRoleEnum, {
  name: 'UserRole',
});
