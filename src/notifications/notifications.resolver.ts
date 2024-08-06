import {
  Args,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { UserRoleEnum } from '../enums/user-role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Subscription(() => Notification, {
    filter: (payload, variables) => {
      return (
        variables?.role === UserRoleEnum.ADMIN ||
        variables?.role === UserRoleEnum.SUPERADMIN
      );
    },
  })
  appointmentCreated(@Args('role') role: string) {
    return this.pubSub.asyncIterator('appointmentCreated');
  }
  @Subscription(() => Notification, {
    filter: (payload, variables) => {
      console.log('payload', payload);
      console.log('variables', variables?.id);
      console.log(payload?.appointmentUpdated?.receiver?.id === variables?.id);
      return (
        +payload?.appointmentUpdated?.receiver?.id === +variables?.id ||
        (!payload?.appointmentUpdated?.receiver?.id &&
          (variables?.role === UserRoleEnum.ADMIN ||
            variables?.role === UserRoleEnum.SUPERADMIN))
      );
    },
  })
  appointmentUpdated(
    @Args('role') role: UserRoleEnum,
    @Args('id', { type: () => ID, nullable: true }) id: string,
  ) {
    return this.pubSub.asyncIterator('appointmentUpdated');
  }
  @Mutation(() => Notification)
  createNotification(
    @Args('createNotificationInput')
    createNotificationInput: CreateNotificationInput,
  ) {
    return this.notificationsService.create(createNotificationInput);
  }

  @Query(() => [Notification], { name: 'notifications' })
  @UseGuards(AuthGuard)
  findAll(@CurrentUser() user: User) {
    return this.notificationsService.findAll(user);
  }

  @Query(() => Notification, { name: 'notification' })
  @UseGuards(AuthGuard)
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.findOne(id, user);
  }

  @Mutation(() => Notification)
  @UseGuards(AuthGuard)
  removeNotification(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.remove(id, user);
  }

  @Mutation(() => Notification)
  // @UseGuards(AuthGuard)
  markAsRead(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.markAsRead(id, user);
  }
  @Mutation(() => Notification)
  // @UseGuards(AuthGuard)
  markAsSeen(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.markAsSeen(id, user);
  }
}
