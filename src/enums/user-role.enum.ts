import { registerEnumType } from '@nestjs/graphql';

export enum UserRoleEnum {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

registerEnumType(UserRoleEnum, {
  name: 'UserRole',
});
