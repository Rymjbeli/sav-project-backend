import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
