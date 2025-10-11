import { Module, Logger } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const logger = new Logger('MailConfig');
        const host = config.get<string>('MAIL_HOST');
        const portRaw = config.get<string>('MAIL_PORT') ?? '0';
        const port = parseInt(portRaw, 10);
        const secureEnv = (
          config.get<string>('MAIL_SECURE') || ''
        ).toLowerCase();
        let secure =
          ['true', '1', 'yes'].includes(secureEnv) ||
          (secureEnv === '' && port === 465);
        if (secure && (port === 587 || port === 25)) {
          logger.warn(
            `MAIL_SECURE=true with port ${port}. For STARTTLS on ${port} set MAIL_SECURE=false. Forcing secure=false.`,
          );
          secure = false;
        }
        const rejectUnauthorized =
          (
            config.get<string>('MAIL_TLS_REJECT_UNAUTHORIZED') || 'true'
          ).toLowerCase() !== 'false';

        logger.log(
          `Mail transport => host=${host} port=${port} secure=${secure} rejectUnauthorized=${rejectUnauthorized}`,
        );

        return {
          transport: {
            host,
            port,
            secure,
            auth: {
              user: config.get<string>('MAIL_USER'),
              pass: config.get<string>('MAIL_PASSWORD'),
            },
            tls: { rejectUnauthorized },
          },
          defaults: {
            from: `"${config.get('MAIL_FROM_NAME')}" <${config.get('MAIL_FROM')}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
