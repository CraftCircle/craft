import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserResolver } from './user.resolver';

@Module({
  controllers: [UserController],
  providers: [UserService, UserResolver],
  imports: [PrismaModule],
  exports:[UserService]
})
export class UserModule {}


