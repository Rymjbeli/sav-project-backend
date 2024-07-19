import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { Repository } from 'typeorm';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { User } from '../entities/user.entity';

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
    // if (
    //   +id === +user?.id ||
    //   user.role === UserRoleEnum.ADMIN ||
    //   user.role === UserRoleEnum.SUPERADMIN
    // ) {
      return fetchedUser;
    // } else {
    //   throw new UnauthorizedException('Unauthorized');
    // }
  }
}
