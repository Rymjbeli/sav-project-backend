import { forwardRef, Module } from '@nestjs/common';
import { VehiculesService } from './vehicules.service';
import { VehiculesResolver } from './vehicules.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicule, Appointment]),
    UsersModule,
    JwtModule,
  ],
  providers: [VehiculesResolver, VehiculesService],
  exports: [VehiculesService],
})
export class VehiculesModule {}
