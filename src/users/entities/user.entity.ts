import { ObjectType, Field, Int, ID, InputType } from '@nestjs/graphql';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { SexeEnum } from '../../enums/sexe.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { TimestampEntity } from '../../shared/entities/timestamp';

@Entity()
@TableInheritance({
  column: { type: 'varchar', name: 'role', enum: UserRoleEnum },
})
@ObjectType()
@InputType('UserInput')
export class User extends TimestampEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column({})
  @Field(() => String)
  role: string;

  @Column()
  @Field(() => String)
  nom: string;

  @Column()
  @Field(() => String)
  prenom: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column()
  salt: string;

  @Column({ unique: true })
  @Field(() => Int)
  cin: number;

  @Column()
  @Field(() => String)
  telephone: string;

  @Column({ nullable: true })
  @Field(() => String)
  adresse: string;

  @Column({
    type: 'enum',
    enum: SexeEnum,
    default: SexeEnum.MASCULIN,
  })
  @Field(() => SexeEnum)
  sexe: SexeEnum;

  @Column({ nullable: true })
  @Field(() => Date)
  dateNaissance: Date;

  @Column({ nullable: true })
  @Field(() => String)
  emploi: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isVerified: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  verificationToken: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  verificationTokenExpiry: Date;

  toJSON() {
    const obj = Object.assign({}, this);
    delete obj.password;
    delete obj.salt;
    delete obj.verificationToken;
    delete obj.verificationTokenExpiry;
    return obj;
  }
}
