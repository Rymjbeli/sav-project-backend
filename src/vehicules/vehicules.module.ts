import { Module } from '@nestjs/common';
import { VehiculesService } from './vehicules.service';
import { VehiculesResolver } from './vehicules.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicule])],
  providers: [VehiculesResolver, VehiculesService],
})
export class VehiculesModule {}
