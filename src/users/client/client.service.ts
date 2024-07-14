import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "../entities/client.entity";
import { Repository } from "typeorm";

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async findOne(id: string){
    return await this.clientRepository.findOneBy({ id });
  }
}
