import { registerEnumType } from '@nestjs/graphql';

export enum TypeEnum {
  SEDAN = 'Sedan',
  SUV = 'SUV',
  VOITURE = 'Voiture',
  MOTO = 'Moto',
  CAMION = 'Camion',
  CAMIONNETTE = 'Camionnette',
  BUS = 'Bus',
}

registerEnumType(TypeEnum, {
  name: 'Type',
});
