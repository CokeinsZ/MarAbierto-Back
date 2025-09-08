import { Injectable, Inject, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailServiceInterface, SendEmailOptions } from './interfaces/mail.interface';
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
    this.appUrl = this.config.get<string>('APP_URL') || 'https://mar-abierto.online';
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
      this.logger.log(`Email sent to ${options.to} subject="${options.subject}"`);
    } catch (error) {
      this.logger.error('Failed to send email', error as any);
      throw error;
    }
  }

  async sendVerificationEmail(to: string, name: string, code: string): Promise<void> {
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

  private sanitizePlainText(input: string): string {
    if (!input || typeof input !== 'string') return '';
    // Quitar saltos de línea y caracteres peligrosos que pudieran romper headers o HTML.
    return input.replace(/[\r\n<>]{1,}/g, '').trim();
  }
}
