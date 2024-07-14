import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}
  async create(createServiceInput: CreateServiceInput, user: User) {
    if (user.role === 'admin' || user.role === 'super_admin') {
      const newService =
        await this.serviceRepository.create(createServiceInput);
      return await this.serviceRepository.save(newService);
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async findAll(user: User) {
    if (user.role === 'admin' || user.role === 'super_admin') {
      return await this.serviceRepository.find();
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async findOne(id: string, user: User) {
    if (user.role === 'admin' || user.role === 'super_admin') {
      return await this.serviceRepository.findOneBy({ id });
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async update(updateServiceInput: UpdateServiceInput, user: User) {
    const id = updateServiceInput.id;
    const service = await this.serviceRepository.findOneBy({ id });
    if (service) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        return await this.serviceRepository.save({
          ...service,
          ...updateServiceInput,
        });
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
  }

  async remove(id: string, user: User) {
    const service = await this.findOne(id, user);
    if (service) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        return await this.serviceRepository.softRemove(service);
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
    throw new NotFoundException('Service not found');
  }

  async restore(id: string, user: User) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (service) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        return await this.serviceRepository.recover(service);
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
    throw new NotFoundException('Service not found');
  }
}
