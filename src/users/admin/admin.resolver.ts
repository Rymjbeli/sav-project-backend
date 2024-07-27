import { Query, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Admin } from '../entities/admin.entity';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}
  @Query(() => [Admin], { name: 'admins' })
  findAll() {
    return this.adminService.findAll();
  }
}
