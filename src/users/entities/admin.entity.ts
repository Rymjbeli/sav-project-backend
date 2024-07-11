import { ChildEntity, Column } from 'typeorm';
import { User } from './user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@ChildEntity()
@ObjectType()
export class Admin extends User {
  @Column()
  @Field(() => String)
  photo: string;
}
