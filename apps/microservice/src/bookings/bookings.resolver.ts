import {
  Resolver,
  Mutation,
  Args,
  Query,
  Int,
} from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CreateAvailabilityInput } from './dto/create-availability.input';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateAppointmentInput } from './dto/update-appointment';
import { AvailabilityEntity } from './entities/availability.entity';
import { BookingEntity } from './entities/booking.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver()
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Admin creates available booking slots.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => AvailabilityEntity)
  async setAvailability(
    @Args('input') input: CreateAvailabilityInput,
    @CurrentUser() admin: UserEntity,
  ) {
    return this.bookingsService.setAvailability(admin.id, input);
  }

  /**
   * Admin retrieves their own defined slots.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [AvailabilityEntity])
  async getMyAvailability(@CurrentUser() admin: UserEntity) {
    return this.bookingsService.getAvailabilityForAdmin(admin.id);
  }

  /**
   * User books an available slot.
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => BookingEntity)
  async bookAppointment(
    @Args('input') input: CreateBookingInput,
    @CurrentUser() user: UserEntity,
  ) {
    return this.bookingsService.bookAppointment(user.id, input);
  }

  /**
   * User views their own bookings (paginated).
   */
  @UseGuards(JwtAuthGuard)
  @Query(() => [BookingEntity])
  async getMyBookings(
    @CurrentUser() user: UserEntity,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    return this.bookingsService.getMyBookings(user.id, page, limit);
  }

  /**
   * Admin views all bookings made for their slots (paginated).
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [BookingEntity])
  async getAllBookingsForAdmin(
    @CurrentUser() admin: UserEntity,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    return this.bookingsService.getAllBookingsForAdmin(admin.id, page, limit);
  }

  /**
   * User cancels their booking.
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => BookingEntity)
  async cancelMyBooking(
    @Args('bookingId', { type: () => String }) bookingId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.bookingsService.cancelBooking(user.id, bookingId);
  }

  /**
   * User reschedules a booking to a new availability slot.
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => BookingEntity)
  async rescheduleBooking(
    @Args('bookingId', { type: () => String }) bookingId: string,
    @Args('input') input: UpdateAppointmentInput,
    @CurrentUser() user: UserEntity,
  ) {
    if (!input.newAvailabilityId) {
      throw new Error('New availability ID is required to reschedule');
    }

    return this.bookingsService.rescheduleBooking(
      user.id,
      bookingId,
      input.newAvailabilityId,
      input.notes,
    );
  }
}