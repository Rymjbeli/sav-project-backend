import { registerEnumType } from '@nestjs/graphql';

export enum TypeEnum {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  VOITURE = 'VOITURE',
  MOTO = 'MOTO',
  CAMION = 'CAMION',
  CAMIONNETTE = 'CAMIONNETTE',
  BUS = 'BUS',
}

registerEnumType(TypeEnum, {
  name: 'Type',
});
