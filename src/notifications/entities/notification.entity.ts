import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../shared/entities/timestamp';
import { NotificationEnum } from '../../enums/notification.enum';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity()
export class Notification extends TimestampEntity{
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;
  @Column({
    type: 'enum',
    enum: NotificationEnum,
    default: NotificationEnum.Reminder,
  })
  @Column()
  @Field(() => NotificationEnum)
  type: NotificationEnum;

  @Column({ nullable: true })
  @Field({ nullable: true })
  content!: string;

  @ManyToOne(() => User)
  @Field({ nullable: true })
  receiver!: User;

  @ManyToOne(() => User)
  @Field({ nullable: true })
  sender!: User;
}
