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

@Injectable()
export class VehiculesService {
  constructor(
    @InjectRepository(Vehicule)
    private vehiculeRepository: Repository<Vehicule>,
  ) {}
  async create(createVehiculeInput: CreateVehiculeInput, client: Client) {
    const newVehicule = this.vehiculeRepository.create(createVehiculeInput);
    newVehicule.client = client;
    return await this.vehiculeRepository.save(newVehicule);
  }

  async findAll(user: User) {
    if (user.role === 'admin' || user.role === 'super_admin') {
      return this.vehiculeRepository.find();
    } else {
      return await this.vehiculeRepository.find({
        where: {
          client: user as Client,
        },
      });
    }
  }

  async findOne(id: number, user: User) {
    const vehicule = await this.vehiculeRepository.findOneBy({ id });
    if (!vehicule) {
      throw new NotFoundException('Vehicule not found');
    }
    if (
      vehicule.client?.id === user.id ||
      user.role === 'admin' ||
      user.role === 'super_admin'
    ) {
      return await this.vehiculeRepository.findOneBy({ id });
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async update(
    id: number,
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

  async remove(id: number, user: User) {
    const vehicule = await this.findOne(id, user);
    if (user.role === 'admin' || user.role === 'super_admin') {
      return this.vehiculeRepository.softRemove(vehicule);
    } else {
      return this.vehiculeRepository.delete({ id, client: user as Client });
    }
  }

  async restore(id: number, user: User) {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!vehicule) {
      throw new NotFoundException('Vehicule not found');
    }
    if (user.role === 'admin' || user.role === 'super_admin') {
      return this.vehiculeRepository.recover(vehicule);
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
