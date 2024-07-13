import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailResolver } from './mail.resolver';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from '../config/mailer.config';

@Module({
  providers: [MailResolver, MailService],
  imports: [MailerModule.forRoot(mailerConfig)],
  exports: [MailerModule, MailService],
})
export class MailModule {}
