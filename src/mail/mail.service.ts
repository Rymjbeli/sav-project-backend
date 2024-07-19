import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserInput } from '../users/dto/create-user.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(user: User) {
    try {
      const subject = 'Email Verification';
      const content = this.createVerificationMailContent(user);
      await this.mailerService.sendMail({
        to: user.email,
        subject: subject,
        html: content,
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(user: User, password: string) {
    try {
      const subject = 'Welcome to Our App';
      const content = this.createWelcomeMailContent(user, password);
      await this.mailerService.sendMail({
        to: user.email,
        subject: subject,
        html: content,
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendResetPasswordEmail(email: string, token: string) {
    try {
      const subject = 'Reset Password';
      const content = this.createResetPasswordMailContent(token);
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        html: content,
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
  createVerificationMailContent(user: User) {
    const url = `http://localhost:3000/verify?token=${user.verificationToken}`;

    return `<p>Dear ${user.prenom},</p>
    <p>We're excited to have you get started. First, you need to verify your email address. Click the link to verify your email:</p>
    <p> <a href="${url}"> ${url}</a></p>
    <p>Best regards,</p>`;
  }

  createWelcomeMailContent(user: User, password: string) {
    return `<p>Dear ${user.prenom},</p>
    <p>Welcome to our platform XXX. Your account has been created. We are glad to have you with us. You can now log in to your account with the following credentials:</p>
    <p> <strong> Email: ${user.email}</strong></p>
    <p> <strong> Password: ${password}</strong></p>
    <p>We recommend that you change your password for more security</p>
    <p>Best regards,</p>`;
  }

  createResetPasswordMailContent(token: string) {
    const url = `http://localhost:3000/reset-password?token=${token}`;

    return `<p>Dear User,</p>
    <p>We received a request to reset your password. Click the link to reset your password:</p>
    <p> <a href="${url}"> ${url}</a></p>
    <p>If you didn't request a password reset, you can ignore this email.</p>
    <p>Best regards,</p>`;
  }
}
