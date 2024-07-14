import { forwardRef, Global, Module } from "@nestjs/common";
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AuthModule } from '../auth/auth.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminResolver } from './super-admin/super-admin.resolver';
import { SuperAdminService } from './super-admin/super-admin.service';
import { SuperAdmin } from './entities/super-admin.entity';
import { AdminResolver } from './admin/admin.resolver';
import { ClientResolver } from './client/client.resolver';
import { AdminService } from './admin/admin.service';
import { ClientService } from './client/client.service';
import { Client } from "./entities/client.entity";
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, SuperAdmin, Client]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UsersResolver,
    UsersService,
    SuperAdminResolver,
    SuperAdminService,
    AdminResolver,
    AdminService,
    ClientResolver,
    ClientService,
  ],
  exports: [UsersService, ClientService, AdminService, SuperAdminService],
})
export class UsersModule {}
