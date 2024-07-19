import { registerEnumType } from '@nestjs/graphql';

export enum AppointmentStatusEnum {
  ACCEPTED = 'Accepté',
  PENDING = 'En attente',
  REJECTED = 'Refusé',
  CANCELED = 'Annulé',
  COMPLETED = 'Terminé',
}

registerEnumType(AppointmentStatusEnum, {
  name: 'AppointmentStatusEnum',
});
