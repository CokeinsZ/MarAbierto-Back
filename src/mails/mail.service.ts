import { Injectable, Inject, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  MailServiceInterface,
  SendEmailOptions,
} from './interfaces/mail.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService implements MailServiceInterface {
  private readonly logger = new Logger(MailService.name);
  private readonly appName: string;
  private readonly appUrl: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {
    this.appName = this.config.get<string>('APP_NAME') || 'MarAbierto';
    this.appUrl =
      this.config.get<string>('APP_URL') || 'https://mar-abierto.online';
  }

  async sendMail(options: SendEmailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template, // nombre de la plantilla .hbs
        context: options.context,
        attachments: options.attachments,
      });
      this.logger.log(
        `Email sent to ${options.to} subject="${options.subject}"`,
      );
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    code: string,
  ): Promise<void> {
    const cleanName = this.sanitizePlainText(name);
    const subject = 'Verificación de cuenta';

    const context = {
      name: cleanName,
      code: code,
      appName: this.appName,
      appUrl: this.appUrl,
      year: new Date().getFullYear(),
    };

    await this.sendMail({
      to,
      subject,
      template: 'verification', // usará verification.hbs en templates/
      context,
    });
  }

  async sendOrderStatusChangeEmail(
    to: string,
    name: string,
    orderId: string,
    newStatus: string,
  ): Promise<void> {
    const cleanName = this.sanitizePlainText(name);
    const subject = `Actualización de Orden #${orderId}`;

    const statusTexts: Record<string, string> = {
      pending: 'Pendiente',
      received: 'Recibida',
      sent: 'Enviada',
      canceled: 'Cancelada',
    };

    const messages: Record<string, string> = {
      pending: 'Tu orden está siendo procesada.',
      received: 'Hemos recibido tu orden y estamos preparándola.',
      sent: 'Tu orden ha sido enviada y está en camino.',
      canceled: 'Tu orden ha sido cancelada.',
    };

    const context = {
      name: cleanName,
      orderId,
      newStatus,
      newStatusText: statusTexts[newStatus] || newStatus,
      message: messages[newStatus] || '',
      appName: this.appName,
      appUrl: this.appUrl,
      year: new Date().getFullYear(),
    };

    await this.sendMail({
      to,
      subject,
      template: 'order-status-change',
      context,
    });
  }

  async sendUserStatusChangeEmail(
    to: string,
    name: string,
    newStatus: string,
  ): Promise<void> {
    const cleanName = this.sanitizePlainText(name);
    const subject = 'Actualización del Estado de tu Cuenta';

    const statusTexts: Record<string, string> = {
      active: 'Activa',
      banned: 'Suspendida',
      not_verified: 'No Verificada',
    };

    const messages: Record<string, string> = {
      active: 'Tu cuenta ahora está activa. Puedes acceder a todos los servicios.',
      banned:
        'Tu cuenta ha sido suspendida. Si crees que esto es un error, por favor contacta con soporte.',
      not_verified:
        'Tu cuenta requiere verificación. Por favor, verifica tu correo electrónico.',
    };

    const context = {
      name: cleanName,
      newStatus,
      newStatusText: statusTexts[newStatus] || newStatus,
      message: messages[newStatus] || '',
      appName: this.appName,
      appUrl: this.appUrl,
      year: new Date().getFullYear(),
    };

    await this.sendMail({
      to,
      subject,
      template: 'user-status-change',
      context,
    });
  }

  async sendUserRoleChangeEmail(
    to: string,
    name: string,
    newRole: string,
  ): Promise<void> {
    const cleanName = this.sanitizePlainText(name);
    const subject = 'Actualización de tu Rol';

    const roleTexts: Record<string, string> = {
      admin: 'Administrador',
      user: 'Cliente'
    };

    const messages: Record<string, string> = {
      admin:
        'Ahora tienes permisos de administrador. Puedes gestionar la plataforma.',
      user:
        'Tu rol ha sido cambiado a cliente.',
    };

    const context = {
      name: cleanName,
      newRole,
      newRoleText: roleTexts[newRole] || newRole,
      message: messages[newRole] || '',
      appName: this.appName,
      appUrl: this.appUrl,
      year: new Date().getFullYear(),
    };

    await this.sendMail({
      to,
      subject,
      template: 'user-role-change',
      context,
    });
  }

  private sanitizePlainText(input: string): string {
    if (!input || typeof input !== 'string') return '';
    // Quitar saltos de línea y caracteres peligrosos que pudieran romper headers o HTML.
    return input.replace(/[\r\n<>]{1,}/g, '').trim();
  }
}
