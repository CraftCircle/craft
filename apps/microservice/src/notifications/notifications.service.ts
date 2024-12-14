import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import * as nodemailer from 'nodemailer';
import * as Brevo from '@getbrevo/brevo';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly emailApi: Brevo.TransactionalEmailsApi;

  constructor(private readonly configService: ConfigService) {
    // Initialize the Transactional Emails API and set the API key
    this.emailApi = new Brevo.TransactionalEmailsApi();
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    this.emailApi.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
  }

  /**
   * Send registration confirmation email
   */
  async sendRegistrationNotification(
    userEmail: string,
    userName: string,
  ): Promise<void> {
    const subject = 'Welcome To CraftCircle!';
    const templateId = 2;
    const params = { name: userName };

    await this.sendEmail(userEmail, userName, subject, params, templateId);
  }

  /**
   * Send login notification email
   */
  async sendLoginNotification(
    userEmail: string,
    userName: string,
    loginTime: string,
    // ipAddress: string,
  ): Promise<void> {
    const subject = 'Login Alert Tor Your CraftCircle Account';
    const templateId = 2;
    const params = {
      name: userName,
      loginTime,
      // ipAddress,
    };

    await this.sendEmail(userEmail, userName, subject, params, templateId);
  }

  /**
   * General method to send transactional emails via Brevo
   */
  private async sendEmail(
    toEmail: string,
    toName: string,
    subject: string,
    params: Record<string, any>,
    templateId: number,
  ): Promise<void> {
    const senderEmail = this.configService.get<string>('BREVO_SENDER_EMAIL');
    const senderName = this.configService.get<string>('BREVO_SENDER_NAME');

    // Initialize SendSmtpEmail instance and set properties individually
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.templateId = templateId;
    sendSmtpEmail.sender = { email: senderEmail, name: senderName };
    sendSmtpEmail.to = [{ email: toEmail, name: toName }];
    sendSmtpEmail.params = params;

    try {
      await this.emailApi.sendTransacEmail(sendSmtpEmail);
      this.logger.log(`Email sent successfully to ${toEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${toEmail}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send ticket purchase notification email
   */
  async sendTicketNotification(ticket: any): Promise<void> {
    const subject = `Your Ticket for ${ticket.eventName} is Confirmed!`;
    const templateId = 789; // Replace with your Brevo template ID for ticket purchase
    const params = {
      name: ticket.name,
      eventName: ticket.eventName,
      quantity: ticket.quantity,
      price: ticket.price,
      ticketType: ticket.ticketType,
      transactionId: ticket.transactionId,
    };

    const senderEmail = this.configService.get<string>('BREVO_SENDER_EMAIL');
    const senderName = this.configService.get<string>('BREVO_SENDER_NAME');

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.templateId = templateId;
    sendSmtpEmail.sender = { email: senderEmail, name: senderName };
    sendSmtpEmail.to = [{ email: ticket.email, name: ticket.name }];
    sendSmtpEmail.params = params;

    try {
      const response = await this.emailApi.sendTransacEmail(sendSmtpEmail);
      this.logger.log(
        `Ticket purchase notification sent successfully to ${ticket.email}: ${JSON.stringify(response)}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send ticket notification to ${ticket.email}: ${error.message}`,
      );
      throw error;
    }
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationInput: UpdateNotificationInput) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
