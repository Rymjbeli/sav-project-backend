import { registerEnumType } from '@nestjs/graphql';

export enum ServiceEnum {
  VIDANGE = 'Vidange',
  REPARATION = 'Réparation',
  DIAGNOSTIC = 'Diagnostic',
  AUTRES = 'Autres',
}

registerEnumType(ServiceEnum, {
  name: 'ServiceEnum',
  description: 'Liste de services disponibles',
});
