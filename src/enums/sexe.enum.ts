import { registerEnumType } from '@nestjs/graphql';

export enum SexeEnum {
  MASCULIN = 'MASCULIN',
  FEMININ = 'FEININ',
}

registerEnumType(SexeEnum, {
  name: 'Sexe',
});
