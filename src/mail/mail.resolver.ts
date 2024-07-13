import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MailService } from './mail.service';
import { Mail } from './entities/mail.entity';
import { User } from '../users/entities/user.entity';

@Resolver(() => Mail)
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation(() => Mail)
  sendVerificationEmail(@Args('user') user: User) {
    const emailSent = this.mailService.sendVerificationEmail(user);

    if (emailSent) {
      return { message: 'Email sent successfully' };
    } else {
      return { message: 'Error sending email' };
    }
  }

  @Mutation(() => Mail)
  sendWelcomeEmail(
    @Args('user') user: User,
    @Args('password') password: string,
  ) {
    const emailSent = this.mailService.sendWelcomeEmail(user, password);

    if (emailSent) {
      return { message: 'Email sent successfully' };
    } else {
      return { message: 'Error sending email' };
    }
  }
}
