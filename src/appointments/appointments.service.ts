import {
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
import { UsersService } from '../users/users.service';
import { VehiculesService } from '../vehicules/vehicules.service';
import { ServicesService } from '../services/services.service';
import { ClientService } from "../users/client/client.service";

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private clientsService: ClientService,
    private vehiculesService: VehiculesService,
    private servicesService: ServicesService,
  ) {}
  async create(createAppointmentInput: CreateAppointmentInput, client: Client) {
    if (createAppointmentInput.clientID === client.id) {
      const newAppointment = this.appointmentRepository.create(
        createAppointmentInput,
      );
      return await this.appointmentRepository.save(newAppointment);
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async findAll(user: User) {
    if (user.role === 'admin' || user.role === 'super_admin') {
      return this.appointmentRepository.find();
    } else {
      return await this.appointmentRepository.find({
        where: {
          client: user as Client,
        },
      });
    }
  }

  async findOne(id: string, user: User) {
    const appointment = await this.appointmentRepository.findOneBy({ id });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (
      appointment.client?.id === user.id ||
      user.role === 'admin' ||
      user.role === 'super_admin'
    ) {
      return appointment;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async update(updateAppointmentInput: UpdateAppointmentInput, user: User) {
    const id = updateAppointmentInput.id;
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (
      appointment.client?.id === user.id ||
      user.role === 'admin' ||
      user.role === 'super_admin'
    ) {
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
        user.role === 'admin' ||
        user.role === 'super_admin' ||
        appointment.client === user
      ) {
        return await this.appointmentRepository.softRemove(appointment);
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
    throw new NotFoundException('Appointment not found');
  }

  async restore(id: string, user: User) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (user.role === 'admin' || user.role === 'super_admin') {
      return await this.appointmentRepository.recover(appointment);
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async findAppointmentOwner(clientID: string) {
    return await this.clientsService.findOne(clientID);
  }

  async findAppointmentVehicle(vehicleID: string, user: User) {
    return await this.vehiculesService.findOne(vehicleID, user);
  }

  async findAppointmentService(serviceID: string, user: User) {
    return await this.servicesService.findOne(serviceID, user);
  }
}
