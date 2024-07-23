import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEnum } from '../enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    const user = this.userRepository.findOne({ where: { email } });
    return user;
  }

  async findOne(id: string, user: User) {
    const fetchedUser = await this.userRepository.findOneBy({ id });
    if (!fetchedUser) {
      throw new NotFoundException('User not found');
    }
    // if (
    //   +id === +user.id ||
    //   user.role === UserRoleEnum.ADMIN ||
    //   user.role === UserRoleEnum.SUPERADMIN
    // ) {
      return fetchedUser;
    // } else {
    //   throw new UnauthorizedException('Unauthorized');
    // }
  }
  async remove(id: string, user: User) {
    const fetchedUser = await this.findOne(id, user);
    if (fetchedUser) {
      // if (
      //   user.role === UserRoleEnum.ADMIN ||
      //   user.role === UserRoleEnum.SUPERADMIN
      // ) {
        return await this.userRepository.softRemove(fetchedUser);
      // } else {
      //   throw new UnauthorizedException('Unauthorized');
      // }
    }
  }

  async restore(id: string) {
    const fetchedUser = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!fetchedUser) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.recover(fetchedUser);
  }
}
