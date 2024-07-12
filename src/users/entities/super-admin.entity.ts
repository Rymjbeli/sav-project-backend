import { ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { ObjectType } from '@nestjs/graphql';

@ChildEntity()
@ObjectType()
export class SuperAdmin extends User {}
