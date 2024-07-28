import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { NotificationEnum } from '../enums/notification.enum';
import { formatDate } from '../utils/date-format';
import { User } from '../users/entities/user.entity';
import { UserRoleEnum } from '../enums/user-role.enum';
import { AppointmentStatusEnum } from '../enums/appointment-status.enum';
import { Client } from '../users/entities/client.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}
  async create(createNotificationInput: CreateNotificationInput) {
    const newNotification = await this.notificationRepository.create(
      createNotificationInput,
    );
    newNotification.receiver = {
      id: createNotificationInput.receiverID,
    } as User;
    return this.notificationRepository.save(newNotification);
  }

  async createNotifForNewAppointment(appointment: Appointment) {
    const formattedDate = formatDate(appointment.date);
    const content =
      `Un nouveau rendez-vous a été planifié ` +
      `par ${appointment?.client?.nom} ${appointment?.client?.prenom} ` +
      `pour ${appointment?.service?.name} ` +
      `le ${formattedDate} ` +
      `à ${appointment?.heure}.`;

    const notification: CreateNotificationInput = {
      type: NotificationEnum.ADD_APPOINTMENT,
      content: content,
      receiverID: null,
    };
    return await this.create(notification);
  }
  async createNotifForUpdatedAppointment(appointment: Appointment, user: User) {
    console.log('appointment', appointment);

    const formattedDate = formatDate(appointment.date);
    let content = '';

    if (
      user?.role === UserRoleEnum.ADMIN ||
      user?.role === UserRoleEnum.SUPERADMIN
    ) {
      content =
        `Le rendez-vous de ${appointment?.client?.nom} ${appointment?.client?.prenom} ` +
        `pour ${appointment?.service?.name} ` +
        `a été modifié.`;
    } else {
      switch (appointment.etat) {
        case AppointmentStatusEnum.REJECTED:
          content =
            `Votre rendez-vous pour ${appointment?.service?.name} ` +
            `le ${formattedDate} ` +
            `à ${appointment?.heure} ` +
            `a été refusé.`;
          break;
        case AppointmentStatusEnum.CANCELED:
          content =
            `Votre rendez-vous pour ${appointment?.service?.name} ` +
            `le ${formattedDate} ` +
            `à ${appointment?.heure} ` +
            `a été annulé.`;
          break;
        case AppointmentStatusEnum.ACCEPTED:
          content =
            `Votre rendez-vous pour ${appointment?.service?.name} ` +
            `le ${formattedDate} ` +
            `à ${appointment?.heure} ` +
            `a été accepté.`;
          break;
        default:
          content =
            `Votre rendez-vous pour ${appointment?.service?.name} ` +
            `le ${formattedDate} ` +
            `à ${appointment?.heure} ` +
            `a été modifié.`;
          break;
      }
    }

    const notification: CreateNotificationInput = {
      type: NotificationEnum.UPDATE_APPOINTMENT,
      content: content,
      receiverID:
        user?.role === UserRoleEnum.ADMIN ||
        user?.role === UserRoleEnum.SUPERADMIN
          ? null
          : appointment?.client.id,
    };

    return await this.create(notification);
  }

  async findAll(user: User) {
    // if (
    //   user?.role === UserRoleEnum.ADMIN ||
    //   user?.role === UserRoleEnum.SUPERADMIN
    // ) {
      return this.notificationRepository.find();
    // } else {
    //   return await this.notificationRepository.find({
    //     where: {
    //       receiver: { id: user?.id } as User,
    //     },
    //   });
    // }
  }

  async findOne(id: string, user: User) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['receiver'],
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    // if (
    //   notification.receiver?.id === user?.id ||
    //   (!notification.receiver &&
    //     (user.role === UserRoleEnum.ADMIN ||
    //       user?.role === UserRoleEnum.SUPERADMIN))
    // ) {
      return notification;
    // } else {
    //   throw new UnauthorizedException('Unauthorized');
    // }
  }

  async remove(id: string, user: User) {
    const notification = await this.findOne(id, user);
    if (notification) {
      // if (
      //   notification.receiver?.id === user?.id ||
      //   (!notification.receiver &&
      //     (user?.role === UserRoleEnum.ADMIN ||
      //       user?.role === UserRoleEnum.SUPERADMIN))
      // ) {
        return this.notificationRepository.softRemove(notification);
      // } else {
      //   throw new UnauthorizedException('Unauthorized');
      // }
    }
    throw new NotFoundException('Notification not found');
  }
  async markAsRead(id: string, user: User) {
    const notification = await this.findOne(id, user);
    if (notification) {
      notification.isRead = true;
      return this.notificationRepository.save(notification);
    }
    throw new NotFoundException('Notification not found');
  }
  async markAsSeen(id: string, user: User) {
    const notification = await this.findOne(id, user);
    if (notification) {
      notification.isSeen = true;
      return this.notificationRepository.save(notification);
    }
    throw new NotFoundException('Notification not found');
  }
}
