import { registerEnumType } from '@nestjs/graphql';

export enum NotificationEnum {
  ADD_APPOINTMENT = 'Add_Appointment',
  UPDATE_APPOINTMENT = 'Update_Appointment',
  DELETE_APPOINTMENT = 'Delete_Appointment',
  Notice = 'Notice',
  Reminder = 'Reminder',
}

registerEnumType(NotificationEnum, {
  name: 'notificationEnum',
});
