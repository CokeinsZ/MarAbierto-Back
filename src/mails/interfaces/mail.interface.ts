export interface SendEmailOptions {
  to: string;
  subject: string;
  template?: string;
  context?: Record<string, any>;
  attachments?: Array<{ filename: string; content: Buffer | string }>;
}

export interface MailServiceInterface {
  sendMail(options: SendEmailOptions): Promise<void>;
  sendVerificationEmail(to: string, name: string, code: string): Promise<void>;
  sendOrderStatusChangeEmail(
    to: string,
    name: string,
    orderId: string,
    newStatus: string,
  ): Promise<void>;
  sendUserStatusChangeEmail(
    to: string,
    name: string,
    newStatus: string,
  ): Promise<void>;
  sendUserRoleChangeEmail(
    to: string,
    name: string,
    newRole: string,
  ): Promise<void>;
}
