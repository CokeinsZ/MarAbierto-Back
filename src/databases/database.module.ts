import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UsersRepository } from './repositories/users/users.repository';
import { SecurityCodesRepository } from './repositories/users/security_codes.repository';
import { UserFishRepository } from './repositories/user_fish/user_fish.repository';
import { FishesRepository } from './repositories/fishes/fishes.repository';

@Module({
    providers: [
        DatabaseService, 
        UsersRepository, SecurityCodesRepository, FishesRepository, UserFishRepository
    ],
    exports: [DatabaseService, UsersRepository, SecurityCodesRepository, FishesRepository, UserFishRepository],
})
export class DatabaseModule {}
