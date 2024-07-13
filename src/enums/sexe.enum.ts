import { registerEnumType } from '@nestjs/graphql';

export enum SexeEnum {
  MASCULIN = 'MASCULIN',
  FEMININ = 'FEMININ',
}

registerEnumType(SexeEnum, {
  name: 'Sexe',
});
