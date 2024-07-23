import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateVehiculeInput } from './dto/create-vehicule.input';
import { UpdateVehiculeInput } from './dto/update-vehicule.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Client } from '../users/entities/client.entity';
import { UsersService } from '../users/users.service';
import { ClientService } from '../users/client/client.service';
import { UserRoleEnum } from '../enums/user-role.enum';
import { AppointmentsService } from '../appointments/appointments.service';
import { Appointment } from '../appointments/entities/appointment.entity';

@Injectable()
export class VehiculesService {
  constructor(
    @InjectRepository(Vehicule)
    private vehiculeRepository: Repository<Vehicule>,
    private clientsService: ClientService,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}
  async create(createVehiculeInput: CreateVehiculeInput, client: Client) {
    // if (+createVehiculeInput.clientID === +client.id) {
    const newVehicule = this.vehiculeRepository.create(createVehiculeInput);
    newVehicule.client = { id: createVehiculeInput.clientID } as Client;
    return await this.vehiculeRepository.save(newVehicule);
    // }
    // throw new UnauthorizedException('Unauthorized');
  }

  async findAll(user: User) {
    // if (
    //   user.role === UserRoleEnum.ADMIN ||
    //   user.role === UserRoleEnum.SUPERADMIN
    // ) {
      return this.vehiculeRepository.find();
    // } else {
    //   return await this.vehiculeRepository.find({
    //     where: {
    //       client: { id: user.id } as Client,
    //     },
    //   });
    // }
  }

  async findOne(id: string, user: User) {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!vehicule) {
      throw new NotFoundException('Vehicule not found');
    }
    // if (
    //   +vehicule.client?.id === +user.id ||
    //   user.role === UserRoleEnum.ADMIN ||
    //   user.role === UserRoleEnum.SUPERADMIN
    // ) {
    return vehicule;
    // } else {
    //   throw new UnauthorizedException('Unauthorized');
    // }
  }

  async update(
    id: string,
    updateVehiculeInput: UpdateVehiculeInput,
    client: Client,
  ) {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!vehicule) {
      throw new NotFoundException('Vehicule not found');
    }
    if (vehicule.client?.id === client.id) {
      return this.vehiculeRepository.save({
        ...vehicule,
        ...updateVehiculeInput,
      });
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async remove(id: string, user: User) {
    const vehicule = await this.findOne(id, user);
    if (vehicule) {
      // if (
      //   user.role === UserRoleEnum.ADMIN ||
      //   user.role === UserRoleEnum.SUPERADMIN ||
      //   vehicule.client?.id === user?.id
      // ) {
        return this.vehiculeRepository.softRemove(vehicule);
      // } else {
      //   throw new UnauthorizedException('Unauthorized');
      // }
    }
    throw new NotFoundException('Vehicle not found');
  }

  async restore(id: string) {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!vehicule) {
      throw new NotFoundException('Vehicule not found');
    }
    return this.vehiculeRepository.recover(vehicule);
  }

  async findVehiculeOwner(id: string, user: User) {
    return this.clientsService.findOne(id, user);
  }
  async findVehiculeAppointments(id: string) {
    return await this.appointmentRepository.find({
      where: { vehicule: { id } as Vehicule },
    });
  }

  async numberOfVehicules() {
    return this.vehiculeRepository.count();
  }
}
