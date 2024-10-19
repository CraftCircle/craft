import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserResolver } from './user.resolver';

@Module({
  controllers: [UsersController],
  providers: [UserService, UserResolver],
  imports: [PrismaModule],
  exports:[UserService]
})
export class UsersModule {}
