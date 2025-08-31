import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    // Placeholder: integrate with real provider (e.g., SES, SendGrid) later.
    this.logger.log(`Send verification code ${code} to ${to}`);
  }
}
