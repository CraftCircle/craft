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

type NotificationBody = {
  message: string;
  additionalData?: object;
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
    additionalData?: object;
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

  async sendInAppNotification(
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
      this.logger.error('Failed to send in-app notification', error);
      throw new InternalServerErrorException(
        'Could not send in-app notification',
      );
    }
  }

  async sendEmailNotification(
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
        select: { email: true },
      });

      if (!user?.email) {
        this.logger.warn(`No email found for user ID: ${recipientId}`);
        return;
      }

      const html = body.additionalData?.['template']
        ? String(body.additionalData['template']?.html || '')
        : this.defaultEmailHTML(body.message);

      await this.transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: title,
        text: body.message,
        html,
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
        'Could not send email notification',
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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }
          h1 { color: #000000; text-align: center; font-size: 28px; font-weight: bold; }
          p { color: #333333; font-size: 16px; line-height: 1.6; text-align: center; }
          .content { margin-top: 20px; padding: 20px; text-align: center; }
          .logo { display: block; margin: 0 auto 20px; max-width: 150px; }
          .footer { font-size: 12px; text-align: center; color: #999999; margin-top: 40px; }
          .button { background-color: rgb(184, 153, 52); color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://res.cloudinary.com/djhugxcv9/image/upload/v1743468786/logo_ph9j6b.png" alt="CraftCircle Logo" class="logo" />
          <div class="content">
            <p>${message}</p>
            <a href="https://craftcirclehq.com/" class="button">Get Started</a>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact us at support@craftcirclehq.com</p>
            <p>&copy; ${new Date().getFullYear()} CraftCircle. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
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
