import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotificationCategory,
  NotificationStatus,
  NotificationType,
} from '@prisma/client';
import nodemailer from 'nodemailer';
import { createICSFile } from '../bookings/utils/calendar';

type CalendarEvent = {
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string;
};

type NotificationBody = {
  message: string;
  additionalData?: {
    template?: string;
    calendarEvent?: CalendarEvent;
  };
};

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  constructor(private readonly prisma: PrismaService) {}

  async send({
    recipientId,
    title,
    message,
    category,
    types = [NotificationType.InApp],
    additionalData,
  }: {
    recipientId: string;
    title: string;
    message: string;
    category: NotificationCategory;
    types?: NotificationType[];
    additionalData?: NotificationBody['additionalData'];
  }) {
    const body: NotificationBody = { message, additionalData };
    const results = [];

    if (types.includes(NotificationType.InApp)) {
      results.push(
        await this.sendInAppNotification(recipientId, title, body, category),
      );
    }

    if (types.includes(NotificationType.Email)) {
      results.push(
        await this.sendEmailNotification(recipientId, title, body, category),
      );
    }

    return results;
  }

  private async sendInAppNotification(
    recipientId: string,
    title: string,
    body: NotificationBody,
    category: NotificationCategory,
    externalError: any = null,
  ) {
    try {
      return await this.prisma.notification.create({
        data: {
          title,
          body,
          status: NotificationStatus.Unread,
          category,
          type: NotificationType.InApp,
          user: { connect: { id: recipientId } },
          externalError,
        },
      });
    } catch (error) {
      this.logger.error('In-app notification failed', error);
      throw new InternalServerErrorException(
        'Failed to send in-app notification',
      );
    }
  }

  private async sendEmailNotification(
    recipientId: string,
    title: string,
    body: NotificationBody,
    category: NotificationCategory,
    externalError: any = null,
  ) {
    try {
      this.validateEnvVariables();

      const user = await this.prisma.user.findUnique({
        where: { id: recipientId },
        select: { email: true, name: true },
      });

      if (!user?.email) {
        this.logger.warn(`Email not found for user ID: ${recipientId}`);
        return;
      }

      const template =
        body.additionalData?.template || this.defaultEmailHTML(body.message);
      const calendarEvent = body.additionalData?.calendarEvent;

      const attachments = [];

      if (calendarEvent) {
        const icsBuffer = createICSFile(calendarEvent);
        attachments.push({
          filename: 'booking.ics',
          content: icsBuffer,
          contentType: 'text/calendar',
        });
      }

      await this.transporter.sendMail({
        from: `"CraftCircle" <${process.env.SENDER_EMAIL}>`,
        to: user.email,
        subject: title,
        text: body.message,
        html: template,
        attachments,
      });

      return await this.prisma.notification.create({
        data: {
          title,
          body,
          status: NotificationStatus.Unread,
          category,
          type: NotificationType.Email,
          user: { connect: { id: recipientId } },
          externalError,
        },
      });
    } catch (error) {
      this.logger.error('Failed to send email notification', error);
      throw new InternalServerErrorException(
        'Failed to send email notification',
      );
    }
  }
  async getUserNotifications(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        status: NotificationStatus.Read,
      },
    });
  }

  private defaultEmailHTML(message: string): string {
    return `
      <html><body><p>${message}</p></body></html>
    `;
  }

  private validateEnvVariables() {
    if (!process.env.SENDER_EMAIL || !process.env.SENDER_PASSWORD) {
      throw new Error(
        'Missing SMTP config: SENDER_EMAIL and SENDER_PASSWORD must be set',
      );
    }
  }
}
