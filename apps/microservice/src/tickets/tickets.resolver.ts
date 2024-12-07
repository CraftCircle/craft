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
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

@Resolver(() => TicketEntity)
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) {}

  // Mutation for Admins to create ticket types for an event
  @Mutation(() => TicketEntity ,{ name: 'CreateTicket' })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createTicketType(
    @Args('createTicketTypeDTO') createTicketTypeDTO: CreateTicketTypeDTO,
    @Args({ name: 'image', type: () => GraphQLUpload }) image: FileUpload,
    @CurrentUser() admin: UserEntity,
  ) {
    return this.ticketsService.createTicketType(createTicketTypeDTO, admin, image);
  }

  // Mutation to purchase a ticket, available to authenticated users
  @Mutation(() => TicketEntity , { name: 'PurchaseTicket' })
  @UseGuards(JwtAuthGuard)
  async purchaseTicket(
    @Args('createTicketPurchaseDTO')
    createTicketPurchaseDTO: CreateTicketPurchaseDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return this.ticketsService.purchaseTicket(createTicketPurchaseDTO, user);
  }

   // Query for users to view all tickets for a specific event
   @Query(() => [TicketEntity], { name: 'TicketsForAnEvent' })
   async findTicketsForEvent(@Args('eventId', { type: () => String }) eventId: string) {
     return this.ticketsService.getTicketsForEvent(eventId);
   }
 
   // Query for admins to view all tickets
   @Query(() => [TicketEntity], { name: 'AllTickets' })
   @Roles(Role.ADMIN)
   @UseGuards(JwtAuthGuard, RolesGuard)
   async findAllTickets() {
     return this.ticketsService.getAllTickets();
   }
 
   // Mutation for admins to update a ticket
   @Mutation(() => TicketEntity,  { name: 'UpdateTicketTypeQuantity' })
   @Roles(Role.ADMIN)
   @UseGuards(JwtAuthGuard, RolesGuard)
   async updateTicket(
     @Args('ticketId', { type: () => String }) ticketId: string,
     @Args('quantity', { type: () => Int }) quantity: number,
     @CurrentUser() admin: UserEntity
   ) {
     return this.ticketsService.updateTicketTypeQuantity(ticketId, quantity, admin);
   }
 
   // Mutation for admins to delete a ticket
   @Mutation(() => Boolean,  { name: 'DeleteTickets' })
   @Roles(Role.ADMIN)
   @UseGuards(JwtAuthGuard, RolesGuard)
   async deleteTicket(@Args('ticketId', { type: () => String }) ticketId: string) {
     return this.ticketsService.deleteTicket(ticketId);
   }
 }
