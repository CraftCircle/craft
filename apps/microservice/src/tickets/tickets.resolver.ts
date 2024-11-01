import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TicketsService } from './tickets.service';
import { TicketEntity } from './entities/ticket.entity';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTicketTypeDTO } from './dto/create-ticket-type.dto';
import { CreateTicketPurchaseDTO } from './dto/create-ticket-purchase.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@Resolver(() => TicketEntity)
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) {}

  // Mutation for Admins to create ticket types for an event
  @Mutation(() => TicketEntity)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createTicketType(
    @Args('createTicketTypeDTO') createTicketTypeDTO: CreateTicketTypeDTO,
    @CurrentUser() admin: UserEntity,
  ) {
    return this.ticketsService.createTicketType(createTicketTypeDTO, admin);
  }
  // Mutation to purchase a ticket, with user details passed from CurrentUser
  @Mutation(() => TicketEntity)
  @UseGuards(JwtAuthGuard)
  async purchaseTicket(
    @Args('createTicketPurchaseDTO')
    createTicketPurchaseDTO: CreateTicketPurchaseDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return this.ticketsService.purchaseTicket(createTicketPurchaseDTO, user);
  }
}
