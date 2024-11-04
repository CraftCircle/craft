import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
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

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Mutation(() => Event)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
    @Args({ name: 'image', type: () => GraphQLUpload }) image: FileUpload,
    @CurrentUser() admin: UserEntity,
  ) {
    return this.eventsService.create(createEventInput, admin.id, image);
  }

  @Query(() => [Event], { name: 'Events' })
  findAll() {
    return this.eventsService.getAllEvents();
  }
  @Query(() => Event, { name: 'Event' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.eventsService.getEventById(id);
  }
  // Mutation to update an event by ID
  @Mutation(() => Event)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateEvent(
    @Args('id', { type: () => String }) id: string,
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
    @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
    image?: FileUpload,
  ) {
    return this.eventsService.update(id, updateEventInput, image);
  }

  // Mutation to delete an event by ID
  @Mutation(() => Boolean)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteEvent(@Args('id', { type: () => String }) id: string) {
    return this.eventsService.delete(id);
  }
}
