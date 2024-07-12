import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { MarqueEnum } from '../../enums/marque.enum';
import { TypeEnum } from '../../enums/type.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Client } from '../../users/entities/client.entity';

@Entity()
@ObjectType()
export class Vehicule {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({
    type: 'enum',
    enum: MarqueEnum,
    default: MarqueEnum.AUDI,
  })
  @Field(() => MarqueEnum)
  marque: MarqueEnum;

  @Column()
  @Field(() => String)
  modele: string;

  @Column({
    type: 'enum',
    enum: TypeEnum,
    default: TypeEnum.VOITURE,
  })
  @Field(() => TypeEnum)
  type: TypeEnum;

  @Column()
  @Field(() => String)
  numChassis: string;

  @Column()
  @Field(() => String)
  immatriculation: string;

  @Column()
  @Field(() => String)
  annee: string;

  @Column()
  @Field(() => String)
  couleur: string;

  @Column()
  @Field(() => Int)
  kilometrage: number;

  @OneToMany(() => Appointment, (appointment) => appointment.vehicule)
  @Field(() => [Appointment])
  appointments: Appointment[];

  @ManyToOne(() => Client, (client) => client.vehicules)
  @Field(() => Client)
  client: Client;
}
