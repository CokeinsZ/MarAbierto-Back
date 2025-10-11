import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UsersRepository } from './repositories/users/users.repository';
import { SecurityCodesRepository } from './repositories/users/security_codes.repository';
import { UserFishRepository } from './repositories/user_fish/user_fish.repository';
import { FishesRepository } from './repositories/fishes/fishes.repository';
import { FishingSitesRepository } from './repositories/fishing_sites/fishing_sites.repository';

@Module({
  providers: [
    DatabaseService,
    UsersRepository,
    SecurityCodesRepository,
    FishesRepository,
    UserFishRepository,
    FishingSitesRepository,
  ],
  exports: [
    DatabaseService,
    UsersRepository,
    SecurityCodesRepository,
    FishesRepository,
    UserFishRepository,
    FishingSitesRepository,
  ],
})
export class DatabaseModule {}
