import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Vehicule } from '../../vehicules/entities/vehicule.entity';
import { Service } from '../../services/entities/service.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../../users/entities/client.entity';
import { TimestampEntity } from '../../shared/entities/timestamp';

@Entity()
@ObjectType()
export class Appointment extends TimestampEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => Date)
  date: Date;

  @Column()
  @Field(() => String)
  heure: string;

  @Column()
  @Field(() => Int)
  kilometrage: number;

  @ManyToOne(() => Service)
  @Field(() => Service)
  service: Service;

  @ManyToOne(() => Vehicule, (vehicule) => vehicule.appointments)
  @Field(() => Vehicule)
  vehicule: Vehicule;

  @ManyToOne(() => Client, (client) => client.appointments)
  @Field(() => Client)
  client: Client;

  // @Column()
  // @Field(() => ID)
  // clientID: number;
  //
  // @Column()
  // @Field(() => ID)
  // vehiculeID: number;
  //
  // @Column()
  // @Field(() => ID)
  // serviceID: number;
}
