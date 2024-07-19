import { Injectable } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  async changePassword(
    user: User,
    password: string,
    confirmPassword: string,
  ): Promise<User> {
    if (password !== confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    if (password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }
    if (password === user.password) {
      throw new Error("Le mot de passe doit être différent de l'ancien");
    }
    // user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    return await this.userRepository.save(user);
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    const token = await bcrypt.hash(user.email, user.salt);
    user.resetPasswordToken = token;

    const resetTokenExpiry = new Date();
    resetTokenExpiry.setDate(resetTokenExpiry.getDate() + 3);
    user.resetTokenExpiry = resetTokenExpiry;

    await this.userRepository.save(user);
    await this.mailService.sendResetPasswordEmail(user.email, token);
    return true;
  }

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { resetPasswordToken: token } });
    if (!user) {
      throw new Error('Token invalide');
    }
    if (new Date() > user.resetTokenExpiry) {
      throw new Error('Le token a expiré');
    }
    if (password !== confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    if (password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }
    user.password = await bcrypt.hash(password, user.salt);
    user.resetPasswordToken = null;
    user.resetTokenExpiry = null;
    await this.userRepository.save(user);
    return true;
  }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
