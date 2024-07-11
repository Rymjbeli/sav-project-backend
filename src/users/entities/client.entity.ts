import { ChildEntity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Vehicule } from '../../vehicules/entities/vehicule.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
@ChildEntity()
@ObjectType()
export class Client extends User {
  @OneToMany(() => Vehicule, (vehicule) => vehicule.client)
  @Field(() => [Vehicule])
  vehicules: Vehicule[];

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  @Field(() => [Appointment])
  appointments: Appointment[];
}
