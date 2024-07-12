import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { SexeEnum } from '../../enums/sexe.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

@Entity()
@TableInheritance({
  column: { type: 'varchar', name: 'role', enum: UserRoleEnum },
})
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.CLIENT,
  })
  @Field(() => UserRoleEnum)
  role: string;

  @Column()
  @Field(() => String)
  nom: string;

  @Column()
  @Field(() => String)
  prenom: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column()
  @Field(() => String)
  telephone: string;

  @Column()
  @Field(() => String)
  adresse: string;

  @Column({
    type: 'enum',
    enum: SexeEnum,
    default: SexeEnum.MASCULIN,
  })
  @Field(() => SexeEnum)
  sexe: SexeEnum;

  @Column()
  @Field(() => Date)
  dateNaissance: Date;

  @Column()
  @Field(() => String)
  emploi: string;
}
