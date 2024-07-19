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
import { TimestampEntity } from '../../shared/entities/timestamp';

@Entity()
@ObjectType()
export class Vehicule extends TimestampEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column({
    type: 'enum',
    enum: MarqueEnum,
    default: MarqueEnum.AUDI,
  })
  @Field(() => String)
  marque: string;

  @Column()
  @Field(() => String)
  modele: string;

  @Column({
    type: 'enum',
    enum: TypeEnum,
    default: TypeEnum.VOITURE,
  })
  @Field(() => String)
  type: string;

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

  // @Column()
  // @Field(() => ID)
  // clientID: number;
  @ManyToOne(() => Client, (client) => client.vehicules)
  @Field(() => Client)
  client: Client;
}
