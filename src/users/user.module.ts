import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../databases/database.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { PassportModule } from '@nestjs/passport';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';

@Module({
  imports: [
    DatabaseModule,
    AbilitiesModule,
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UserController],
  providers: [UsersService, EmailService],
  exports: [UsersService],
})
export class UserModule {}
