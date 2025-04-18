import { forwardRef, Module } from '@nestjs/common';
import { PesapalService } from './pesapal.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PesapalResolver } from './pesapal.resolver';
import { PesapalController } from './pesapal.controller';
import { TicketsModule } from '../tickets/tickets.module';
import { PrismaService } from '../prisma/prisma.service';
import { NgrokModule } from '../ngrok/ngrok.module';

@Module({
  imports: [HttpModule, ConfigModule, forwardRef(() => TicketsModule),NgrokModule],
  providers: [PesapalResolver, PesapalService, PrismaService],
  controllers: [PesapalController],
  exports: [PesapalService],
})
export class PesapalModule {}
