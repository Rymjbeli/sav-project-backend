import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/login-credentials.input';
import { Repository } from 'typeorm';
import { UserRoleEnum } from '../enums/user-role.enum';
import { CreateUserInput } from '../users/dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { SuperAdmin } from '../users/entities/super-admin.entity';
import { Admin } from '../users/entities/admin.entity';
import { Client } from '../users/entities/client.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(SuperAdmin)
    private superAdminRepository: Repository<SuperAdmin>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  private tokenBlacklist = new Set<string>();

  private generateAccessToken(user: User): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    const tokenLife = this.configService.get('ACCESS_TOKEN_EXPIRATION');
    const expiresIn = isNaN(+tokenLife) ? tokenLife : +tokenLife;
    return this.jwtService.sign(payload, {
      expiresIn,
      algorithm: 'HS256',
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async login(
    credentials: LoginCredentialsDto,
  ): Promise<{ accessToken: string; user: User }> {
    const { email, password } = credentials;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Coordonnées invalides');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Adresse mail non vérifiée');
    }

    const accessToken = this.generateAccessToken(user);

    return { accessToken, user: user.toJSON() };
  }

  async registerSuperAdmin(userData: CreateUserInput): Promise<User> {
    const { password } = userData;

    // Check if all required fields are provided
    if (!userData.email || !userData.password || !userData.cin) {
      throw new BadRequestException('Email, password, and cin are required');
    }

    // Check the number of existing super admins
    const superAdminCount = await this.userRepository.count({
      where: { role: UserRoleEnum.SUPERADMIN },
    });

    // Check if the limit has been reached
    const superAdminLimit = 5; // Set your limit here
    if (superAdminCount >= superAdminLimit) {
      throw new ConflictException('Super admin limit has been reached');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password + Date.now(), salt);

    console.log(userData);
    try {
      // Save the user with the hashed password
      const user = this.userRepository.create({
        ...userData,
        salt: salt,
        password: hashedPassword,
        isVerified: true,
      });

      user.role = this.superAdminRepository.metadata.targetName;

      await this.userRepository.save(user);

      return user;
    } catch (e) {
      throw new ConflictException(
        `Email ${userData.email} ou cin ${userData.cin} déjà existant`,
      );
    }
  }

  async registerClient(userData: CreateUserInput): Promise<User> {
    const { password } = userData;

    // Check if all required fields are provided
    if (!userData.email || !userData.password || !userData.cin) {
      throw new BadRequestException(
        'Email, mot de passe et cin sont obligatoires',
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password + Date.now(), salt);

    // Generate a verification token
    const verificationToken = uuidv4();

    // Set the verification token expiry date to 7 days in the future
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setDate(verificationTokenExpiry.getDate() + 7);

    try {
      // Save the user with the hashed password
      const user = this.userRepository.create({
        ...userData,
        // role: UserRoleEnum.CLIENT,
        salt: salt,
        password: hashedPassword,
        isVerified: false,
        verificationToken,
        verificationTokenExpiry,
      });

      user.role = this.clientRepository.metadata.targetName;

      await this.userRepository.save(user);

      // Send a verification email
      await this.mailService.sendVerificationEmail(user);

      return user;
    } catch (e) {
      throw new ConflictException(
        `Email ${userData.email} ou cin ${userData.cin} déjà existant`,
      );
    }
  }

  async resetVerificationToken(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    // Generate a verification token
    const verificationToken = uuidv4();

    // Set the verification token expiry date to 7 days in the future
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setDate(verificationTokenExpiry.getDate() + 7);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;

    await this.userRepository.save(user);

    return await this.mailService.sendVerificationEmail(user);
  }

  async registerAdmin(userData: CreateUserInput): Promise<User> {
    const password = `${userData.nom}$${userData.cin}`;
    userData.password = password;
    // Check if all required fields are provided
    if (!userData.email || !userData.password || !userData.cin) {
      throw new BadRequestException(
        'Email, mot de passe et cin sont obligatoires',
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password + Date.now(), salt);

    try {
      // Save the user with the hashed password
      const user = this.userRepository.create({
        ...userData,
        // role: UserRoleEnum.ADMIN,
        salt: salt,
        password: hashedPassword,
        isVerified: true,
      });

      user.role = this.adminRepository.metadata.targetName;

      await this.userRepository.save(user);

      // Send a welcome email with the password
      await this.mailService.sendWelcomeEmail(user, password);

      return user;
    } catch (e) {
      throw new ConflictException(
        `Email ${userData.email} ou cin ${userData.cin} déjà existant`,
      );
    }
  }

  async verifyEmail(verificationToken: string): Promise<User> {
    // Find the user with the verification token
    const user = await this.userRepository.findOne({
      where: {
        verificationToken,
      },
    });

    // If the user is not found, throw an error
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // If the verification token has expired, throw an error
    if (user.verificationTokenExpiry < new Date()) {
      throw new UnauthorizedException('Le token de vérification a expiré');
    }

    if (user.isVerified) {
      throw new UnauthorizedException('Compte déjà verifé');
    }

    // Update the user to be verified and clear the verification token
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;

    // Save the user
    await this.userRepository.save(user);

    return user;
  }

  async logout(token: string): Promise<void> {
    this.tokenBlacklist.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}
