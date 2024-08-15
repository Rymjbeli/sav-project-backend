import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../shared/entities/timestamp';
import { NotificationEnum } from '../../enums/notification.enum';
import { User } from '../../users/entities/user.entity';
import { TypeEnum } from '../../enums/type.enum';
import { UserRoleEnum } from '../../enums/user-role.enum';

@ObjectType()
@Entity()
export class Notification extends TimestampEntity {
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

  @Column()
  @Field(() => String)
  content!: string;

  @ManyToOne(() => User)
  @Field({ nullable: true })
  receiver!: User;

  @Column({ default: false })
  @Field({ defaultValue: false })
  isRead!: boolean;

  @Column({ default: false })
  @Field({ defaultValue: false })
  isSeen!: boolean;
  // @ManyToOne(() => User)
  // @Field({ nullable: true })
  // sender!: User;
}
