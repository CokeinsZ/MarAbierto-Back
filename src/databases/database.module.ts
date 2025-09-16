import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UsersRepository } from './repositories/users/users.repository';
import { SecurityCodesRepository } from './repositories/users/security_codes.repository';

@Module({
    providers: [
        DatabaseService, 
        UsersRepository, SecurityCodesRepository
    ],
    exports: [DatabaseService, UsersRepository, SecurityCodesRepository],
})
export class DatabaseModule {}
