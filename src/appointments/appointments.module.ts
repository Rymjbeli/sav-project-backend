import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsResolver } from './appointments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { UsersModule } from '../users/users.module';
import { VehiculesModule } from '../vehicules/vehicules.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    UsersModule,
    VehiculesModule,
    ServicesModule,
  ],
  providers: [AppointmentsResolver, AppointmentsService],
})
export class AppointmentsModule {}
