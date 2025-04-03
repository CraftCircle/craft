import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TicketsService } from './tickets.service';
import { TicketEntity } from './entities/ticket.entity';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTicketTypeDTO } from './dto/create-ticket-type.dto';
import { CreateTicketPurchaseDTO } from './dto/create-ticket-purchase.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { TicketCreatedEntity } from './entities/ticket-created.entity';
import { TicketPurchasedEntity } from './entities/ticket-purchased.entity';
import { UploadHelper } from '../upload/utils/upload-helper';
import { UploadService } from '../upload/upload.service';

@Resolver()
export class TicketsResolver {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Upload ticket image independently (for preview and separate upload flow)
   * Returns Cloudinary URL.
   */
  @Mutation(() => String, { name: 'uploadTicketImage' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async uploadTicketImage(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    const uploader = new UploadHelper(this.uploadService);
    const { image } = await uploader.uploadFields({ image: file });
    return image;
  }
  /**
   * Admin creates a ticket type for an event.
   * Requires the admin to be authenticated and authorized.
   */
  @Mutation(() => TicketCreatedEntity, { name: 'CreateTicket' })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createTicketType(
    @Args('createTicketTypeDTO') createTicketTypeDTO: CreateTicketTypeDTO,
    @CurrentUser() admin: UserEntity,
  ) {
    return this.ticketsService.createTicketType(createTicketTypeDTO, admin);
  }

  /**
   * User purchases a ticket for an event.
   * Requires the user to be authenticated.
   */
  @Mutation(() => TicketPurchasedEntity, { name: 'PurchaseTicket' })
  @UseGuards(JwtAuthGuard)
  async purchaseTicket(
    @Args('createTicketPurchaseDTO')
    createTicketPurchaseDTO: CreateTicketPurchaseDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return this.ticketsService.purchaseTicket(createTicketPurchaseDTO, user);
  }

  /**
   * Retrieves all tickets purchased by the authenticated user for a specific event.
   */
  @Query(() => [TicketPurchasedEntity], { name: 'MyTicketsForEvent' })
  @UseGuards(JwtAuthGuard)
  async getUserTicketsForEvent(
    @Args('eventId', { type: () => String }) eventId: string,
    @CurrentUser() user: UserEntity,
  ): Promise<TicketPurchasedEntity[]> {
    return this.ticketsService.getUserTicketsForEvent(user.id, eventId);
  }

  /**
   * Retrieves all tickets purchased by the authenticated user across all events.
   */
  @Query(() => [TicketPurchasedEntity], { name: 'MyAllTickets' })
  @UseGuards(JwtAuthGuard)
  async getAllTicketsForUser(
    @CurrentUser() user: UserEntity,
  ): Promise<TicketPurchasedEntity[]> {
    return this.ticketsService.getAllTicketsForUser(user.id);
  }

  /**
   * Retrieves a single ticket by its ID for the authenticated user.
   */
  @Query(() => TicketEntity, { name: 'GetTicketById' })
  @UseGuards(JwtAuthGuard)
  async getTicketById(
    @Args('ticketId', { type: () => String }) ticketId: string,
    @CurrentUser() user: UserEntity,
  ): Promise<TicketEntity> {
    return this.ticketsService.getTicketById(ticketId, user.id);
  }

  /**
   * Admin retrieves all tickets across all events created by them.
   * Requires admin authentication and authorization.
   */
  @Query(() => [TicketCreatedEntity], { name: 'AllTickets' })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAllTickets(@CurrentUser() admin: UserEntity) {
    return this.ticketsService.getAllTickets(admin);
  }

  /**
   * Admin retrieves all tickets for a specific event.
   * Requires admin authentication and authorization.
   */
  @Query(() => [TicketCreatedEntity], { name: 'TicketsForEvent' })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getTicketsForEvent(
    @Args('eventId', { type: () => String }) eventId: string,
    @CurrentUser() admin: UserEntity,
  ) {
    return this.ticketsService.getTicketsForEvent(eventId);
  }

  /**
   * Admin scans a ticket by its ID to validate entry.
   * Requires admin authentication and authorization.
   */
  @Mutation(() => TicketEntity, { name: 'ScanTicket' })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async scanTicket(
    @Args('ticketId', { type: () => String }) ticketId: string,
    @CurrentUser() user: UserEntity,
  ): Promise<TicketEntity> {
    return this.ticketsService.scanTicket(ticketId, user.id);
  }

  /**
   * Admin updates the quantity of a specific ticket type for an event.
   * Requires admin authentication and authorization.
   */
  @Mutation(() => TicketCreatedEntity, { name: 'UpdateTicketTypeQuantity' })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateTicket(
    @Args('ticketId', { type: () => String }) ticketId: string,
    @Args('quantity', { type: () => Int }) quantity: number,
    @CurrentUser() admin: UserEntity,
  ) {
    return this.ticketsService.updateTicketTypeQuantity(
      ticketId,
      quantity,
      admin,
    );
  }

  /**
   * Admin deletes a ticket by its ID.
   * Requires admin authentication and authorization.
   */
  @Mutation(() => Boolean, { name: 'DeleteTickets' })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteTicket(
    @Args('ticketId', { type: () => String }) ticketId: string,
  ) {
    return this.ticketsService.deleteTicket(ticketId);
  }
}
