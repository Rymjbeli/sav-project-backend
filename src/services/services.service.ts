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
  async create(createServiceInput: CreateServiceInput) {
    const newService = await this.serviceRepository.create(createServiceInput);
    return await this.serviceRepository.save(newService);
  }

  async findAll() {
    return await this.serviceRepository.find();
  }

  async findOne(id: string) {
    return await this.serviceRepository.findOneBy({ id });
  }

  async update(id:string, updateServiceInput: UpdateServiceInput) {
    const service = await this.serviceRepository.findOneBy({ id });
    if (service) {
      return await this.serviceRepository.save({
        ...service,
        ...updateServiceInput,
      });
    }
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    if (service) {
      return await this.serviceRepository.softRemove(service);
    }
    throw new NotFoundException('Service not found');
  }

  async restore(id: string) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (service) {
      return await this.serviceRepository.recover(service);
    }
    throw new NotFoundException('Service not found');
  }
}
