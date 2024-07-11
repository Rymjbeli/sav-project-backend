import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Vehicule } from '../../vehicules/entities/vehicule.entity';
import { Service } from '../../services/entities/service.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../../users/entities/client.entity';

@Entity()
@ObjectType()
export class Appointment {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => Date)
  date: Date;

  @Column()
  @Field(() => String)
  heure: string;

  @ManyToOne(() => Vehicule, (vehicule) => vehicule.appointments)
  @Field(() => Vehicule)
  vehicule: Vehicule;

  @Column()
  @Field(() => Int)
  kilometrage: number;

  @ManyToOne(() => Service)
  @Field(() => Service)
  service: Service;

  @ManyToOne(() => Client, (client) => client.appointments)
  @Field(() => Client)
  client: Client;
}
