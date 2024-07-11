import { Injectable } from '@nestjs/common';
import { CreateVehiculeInput } from './dto/create-vehicule.input';
import { UpdateVehiculeInput } from './dto/update-vehicule.input';

@Injectable()
export class VehiculesService {
  create(createVehiculeInput: CreateVehiculeInput) {
    return 'This action adds a new vehicule';
  }

  findAll() {
    return `This action returns all vehicules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicule`;
  }

  update(id: number, updateVehiculeInput: UpdateVehiculeInput) {
    return `This action updates a #${id} vehicule`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicule`;
  }
}
