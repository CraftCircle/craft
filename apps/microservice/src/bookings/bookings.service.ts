import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { CreateAvailabilityInput } from './dto/create-availability.input';
import {
  BookingStatus,
  NotificationCategory,
  NotificationType,
} from '@prisma/client';
import { NotificationService } from '../notifications/notifications.service';
import {
  bookingUserTemplate,
  bookingAdminTemplate,
} from '../notifications/templates/booking';
import { createICSFile } from '../bookings/utils/calendar';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Allows an admin to define availability for booking.
   */
  async setAvailability(adminId: string, input: CreateAvailabilityInput) {
    return this.prisma.availability.create({
      data: {
        adminId,
        startTime: input.startTime,
        endTime: input.endTime,
        dayOfWeek: input.dayOfWeek,
      },
    });
  }

  /**
   * Fetch availability slots for the given admin.
   */
  async getAvailabilityForAdmin(adminId: string) {
    return this.prisma.availability.findMany({
      where: { adminId },
    });
  }

  /**
   * Allows a user to book a specific availability slot.
   * Checks for time conflicts and sends calendar invites.
   */
  async bookAppointment(userId: string, input: CreateBookingInput) {
    const availability = await this.prisma.availability.findUnique({
      where: { id: input.availabilityId },
      include: {
        bookings: true,
        admin: true,
      },
    });

    if (!availability) throw new NotFoundException('Availability not found');

    // Prevent double-booking by time overlap
    const overlapping = await this.prisma.booking.findFirst({
      where: {
        availability: {
          adminId: availability.adminId,
          startTime: { lt: availability.endTime },
          endTime: { gt: availability.startTime },
        },
        status: { not: BookingStatus.CANCELLED },
      },
    });

    if (overlapping) {
      throw new BadRequestException(
        'This time slot is already booked. Please choose another.',
      );
    }

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        availabilityId: input.availabilityId,
        notes: input.notes,
      },
      include: {
        user: true,
        availability: { include: { admin: true } },
      },
    });

    const start = new Date(booking.availability.startTime);
    const end = new Date(booking.availability.endTime);

    const dateStr = start.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const timeStr = start.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });

    const link = `https://craftcirclehq.com/bookings/${booking.id}`;

    const calendarEvent = {
      title: 'CraftCircle Booking',
      description: `Appointment with ${booking.availability.admin.name}`,
      start,
      end,
      location: 'Online / Custom location',
    };

    // Notify user
    await this.notificationService.send({
      recipientId: booking.user.id,
      title: '📅 Booking Confirmed',
      message: `Your booking with ${booking.availability.admin.name} is confirmed.`,
      category: NotificationCategory.General,
      types: [NotificationType.Email, NotificationType.InApp],
      additionalData: {
        template: bookingUserTemplate(
          booking.user.name,
          dateStr,
          timeStr,
          booking.availability.admin.name,
          link,
        ),
        calendarEvent,
      },
    });

    // Notify admin
    await this.notificationService.send({
      recipientId: booking.availability.admin.id,
      title: '📥 New Booking Received',
      message: `${booking.user.name} booked a time slot with you.`,
      category: NotificationCategory.General,
      types: [NotificationType.Email, NotificationType.InApp],
      additionalData: {
        template: bookingAdminTemplate(
          booking.availability.admin.name,
          booking.user.name,
          dateStr,
          timeStr,
          link,
        ),
        calendarEvent,
      },
    });

    return booking;
  }

  /**
   * Returns a paginated list of the user's bookings.
   */
  async getMyBookings(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.booking.findMany({
      where: { userId },
      include: { availability: true, user: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin retrieves all their incoming bookings.
   */
  async getAllBookingsForAdmin(adminId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.booking.findMany({
      where: { availability: { adminId } },
      include: { availability: true, user: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Cancels a user's booking.
   */
  async cancelBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== userId) {
      throw new NotFoundException('Booking not found or unauthorized');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  /**
   * Allows user to reschedule their booking to a new slot.
   */
  async rescheduleBooking(
    userId: string,
    bookingId: string,
    newAvailabilityId: string,
    notes?: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== userId) {
      throw new NotFoundException('Booking not found or unauthorized');
    }

    // Update the booking
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        availabilityId: newAvailabilityId,
        status: BookingStatus.PENDING,
        notes,
      },
      include: {
        user: true,
        availability: { include: { admin: true } },
      },
    });

    // Format date/time
    const start = new Date(updated.availability.startTime);
    const end = new Date(updated.availability.endTime);
    const dateStr = start.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = start.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });

    const link = `https://craftcirclehq.com/bookings/${updated.id}`;
    const calendarEvent = {
      title: 'Rescheduled Booking - CraftCircle',
      description: `Rescheduled with ${updated.availability.admin.name}`,
      start,
      end,
      location: 'Online / Custom location',
    };

    // Send to user
    await this.notificationService.send({
      recipientId: updated.user.id,
      title: '🔁 Booking Rescheduled',
      message: `Your booking has been successfully rescheduled.`,
      category: NotificationCategory.General,
      types: [NotificationType.Email, NotificationType.InApp],
      additionalData: {
        template: bookingUserTemplate(
          updated.user.name,
          dateStr,
          timeStr,
          updated.availability.admin.name,
          link,
        ),
        calendarEvent,
      },
    });

    // Notify admin
    await this.notificationService.send({
      recipientId: updated.availability.admin.id,
      title: '📅 Booking Rescheduled',
      message: `${updated.user.name} rescheduled their booking.`,
      category: NotificationCategory.General,
      types: [NotificationType.Email, NotificationType.InApp],
      additionalData: {
        template: bookingAdminTemplate(
          updated.availability.admin.name,
          updated.user.name,
          dateStr,
          timeStr,
          link,
        ),
        calendarEvent,
      },
    });

    return updated;
  }
}
