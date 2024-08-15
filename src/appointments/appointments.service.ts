import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Client } from '../users/entities/client.entity';
import { VehiculesService } from '../vehicules/vehicules.service';
import { ServicesService } from '../services/services.service';
import { ClientService } from '../users/client/client.service';
import { UserRoleEnum } from '../enums/user-role.enum';
import { Vehicule } from '../vehicules/entities/vehicule.entity';
import { Service } from '../services/entities/service.entity';
import { PubSub } from 'graphql-subscriptions';
import { CreateNotificationInput } from '../notifications/dto/create-notification.input';
import { NotificationEnum } from '../enums/notification.enum';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private clientsService: ClientService,
    private vehiculesService: VehiculesService,
    private servicesService: ServicesService,
    private notificationService: NotificationsService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}
  async create(createAppointmentInput: CreateAppointmentInput, client: Client) {
    if (+createAppointmentInput.clientID === +client.id) {
      const owner = await this.findAppointmentOwner(
        createAppointmentInput.clientID,
        client,
      );
      const vehicule = await this.findAppointmentVehicle(
        createAppointmentInput.vehiculeID,
        client,
      );
      const service = await this.findAppointmentService(
        createAppointmentInput.serviceID,
      );

      const newAppointment = await this.appointmentRepository.create(
        createAppointmentInput,
      );

      newAppointment.client = owner;
      newAppointment.vehicule = vehicule;
      newAppointment.service = service;
      // console.log('newAppointment', newAppointment);

      const notification =
        await this.notificationService.createNotifForNewAppointment(
          newAppointment,
        );
      await this.pubSub.publish('appointmentCreated', {
        appointmentCreated: notification,
      });
      return await this.appointmentRepository.save(newAppointment);
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async findAll(user: User) {
    // if (
    //   user.role === UserRoleEnum.ADMIN ||
    //   user.role === UserRoleEnum.SUPERADMIN
    // ) {
    return this.appointmentRepository.find();
    // } else {
    //   return await this.appointmentRepository.find({
    //     where: {
    //       client: { id: user.id } as Client,
    //     },
    //   });
    // }
  }

  async findOne(id: string, user: User) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    // if (
    //   appointment.client?.id === user.id ||
    //   user.role === UserRoleEnum.ADMIN ||
    //   user.role === UserRoleEnum.SUPERADMIN
    // ) {
    return appointment;
    // } else {
    //   throw new UnauthorizedException('Unauthorized');
    // }
  }

  async update(
    id: string,
    updateAppointmentInput: UpdateAppointmentInput,
    user: User,
  ) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['client', 'service'],
    });
    // console.log('appointment', appointment);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (
      appointment.client?.id === user.id ||
      user.role === UserRoleEnum.ADMIN ||
      user.role === UserRoleEnum.SUPERADMIN
    ) {
      const notification =
        await this.notificationService.createNotifForUpdatedAppointment(
          appointment,
          user,
        );

      await this.pubSub.publish('appointmentUpdated', {
        appointmentUpdated: notification,
      });
      return await this.appointmentRepository.save({
        ...appointment,
        ...updateAppointmentInput,
      });
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async remove(id: string, user: User) {
    const appointment = await this.findOne(id, user);
    if (appointment) {
      if (
        user.role === UserRoleEnum.ADMIN ||
        user.role === UserRoleEnum.SUPERADMIN ||
        appointment.client?.id === user?.id
      ) {
        return await this.appointmentRepository.softRemove(appointment);
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
    throw new NotFoundException('Appointment not found');
  }

  async restore(id: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return await this.appointmentRepository.recover(appointment);
  }

  async findAppointmentOwner(clientID: string, user: User) {
    return await this.clientsService.findOne(clientID, user);
  }

  async findAppointmentVehicle(vehicleID: string, user: User) {
    return await this.vehiculesService.findOne(vehicleID, user);
  }

  async findAppointmentService(serviceID: string) {
    return await this.servicesService.findOne(serviceID);
  }
  async numberOfAppointments() {
    return this.appointmentRepository.count();
  }
}
