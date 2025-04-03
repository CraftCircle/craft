import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { EventEntity } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { UpdateEventInput } from './dto/update-event.input';
import { UploadService } from '../upload/upload.service';
import { UploadHelper } from '../upload/utils/upload-helper';

@Resolver(() => EventEntity)
export class EventsResolver {
  constructor(
    private readonly eventsService: EventsService,
    private readonly uploadService: UploadService,
  ) {}

   /**
     * Uploads a event image file (optional media for a event).
     * This should be called before `createEvent`, and the returned
     * Cloudinary URL used in the `createEventInput.image` field.
     *
     * @param file - Image file to upload.
     * @returns Cloudinary URL of the uploaded image.
     */
    @Mutation(() => String, { name: 'uploadEventImage' })
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async uploadEventImage(
      @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    ): Promise<string> {
      const uploader = new UploadHelper(this.uploadService);
      const { image } = await uploader.uploadFields({ image: file });
      return image;
    }

  /**
   * Mutation to create a new event.
   *
   * @param createEventInput - Details of the event to create.
   * @param admin - The authenticated admin creating the event.
   * @returns The created event entity.
   *
   * Requires:
   * - Admin authentication and authorization.
   */
  @Mutation(() => EventEntity)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
    @CurrentUser() admin: UserEntity,
  ) {
    console.log('🚀 Admin from JWT:', admin);
    return this.eventsService.createEvent(createEventInput, admin);
  }

  /**
   * Query to retrieve all events created by the logged-in admin.
   *
   * @param admin - The authenticated admin.
   * @returns An array of events created by the admin.
   *
   * Requires:
   * - Admin authentication and authorization.
   */
  @Query(() => [EventEntity], { name: 'MyCreatedEvents' })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllEventsByCreator(
    @CurrentUser() admin: UserEntity,
  ): Promise<EventEntity[]> {
    return this.eventsService.getAllEventsByCreator(admin.id);
  }

  /**
   * Query to retrieve all events available to users.
   *
   * @returns An array of all event entities.
   */
  @Query(() => [EventEntity], { name: 'Events' })
  findAll() {
    return this.eventsService.getAllEvents();
  }

  /**
   * Query to retrieve a specific event by its ID.
   *
   * @param id - The ID of the event.
   * @returns The event entity matching the ID.
   */
  @Query(() => EventEntity, { name: 'GetEventById' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.eventsService.getEventById(id);
  }

  /**
   * Mutation to update an existing event by its ID.
   *
   * @param id - The ID of the event to update.
   * @param updateEventInput - Updated details for the event.
   * @param image - Optional updated image file for the event.
   * @returns The updated event entity.
   *
   * Requires:
   * - Admin authentication and authorization.
   */
  @Mutation(() => EventEntity)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateEvent(
    @Args('id', { type: () => String }) id: string,
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
  ) {
    return this.eventsService.update(id, updateEventInput);
  }

  /**
   * Mutation to delete an event by its ID.
   *
   * @param id - The ID of the event to delete.
   * @returns `true` if the event was successfully deleted.
   *
   * Requires:
   * - Admin authentication and authorization.
   */
  @Mutation(() => Boolean)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteEvent(@Args('id', { type: () => String }) id: string) {
    return this.eventsService.delete(id);
  }
}
