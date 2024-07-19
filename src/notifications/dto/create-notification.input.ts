import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { NotificationEnum } from '../../enums/notification.enum';

@InputType()
export class CreateNotificationInput {
  @Field(() => NotificationEnum)
  @IsEnum(NotificationEnum)
  @IsNotEmpty()
  type: NotificationEnum;
  @Field(() => String)
  @IsNotEmpty()
  content: string;
  @Field({ nullable: true })
  @IsOptional()
  receiverID!: string;
}
