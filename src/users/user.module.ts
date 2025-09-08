import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../databases/database.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mails/mails.module';
import { PassportModule } from '@nestjs/passport';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    DatabaseModule,
    AbilitiesModule,
    MailModule,
  ],

  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
