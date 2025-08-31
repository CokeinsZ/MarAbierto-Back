import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UsersRepository } from './repositories/users.repository';
import { SecurityCodesRepository } from './repositories/security_codes.repository';

@Module({
    providers: [DatabaseService, UsersRepository, SecurityCodesRepository],
    exports: [DatabaseService, UsersRepository, SecurityCodesRepository],
})
export class DatabaseModule {}
