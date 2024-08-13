import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { User } from '../entities/user.entity';
import { subDays } from 'date-fns';
@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async findOne(id: string, user: User) {
    const fetchedUser = await this.clientRepository.findOne({
      where: { id },
      relations: ['vehicules', 'appointments'],
    });
    if (!fetchedUser) {
      throw new NotFoundException('Client not found');
    }
    if (
      +id === +user?.id ||
      user.role === UserRoleEnum.ADMIN ||
      user.role === UserRoleEnum.SUPERADMIN
    ) {
      return fetchedUser;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async findAll(user: User) {
    // if (
    //   user.role === UserRoleEnum.ADMIN ||
    //   user.role === UserRoleEnum.SUPERADMIN
    // ) {
    return this.clientRepository.find({
      relations: ['vehicules'],
    });
    // } else {
    //   throw new UnauthorizedException('Unauthorized');
    // }
  }

  async numberOfClients() {
    return this.clientRepository.count();
  }
  async numberOfNewClients() {
    const oneWeekAgo = subDays(new Date(), 7);
    return this.clientRepository.count({
      where: { createdAt: MoreThan(oneWeekAgo) },
    });
  }
}
