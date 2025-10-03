import { Module } from '@nestjs/common';
import { UserFishController } from './user_fish.controller';
import { UserFishService } from './user_fish.service';
import { DatabaseModule } from '../databases/database.module';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';
import { FishesModule } from 'src/fishes/fishes.module';
import { UserModule } from 'src/users/user.module';
import { UserFishRepository } from '../databases/repositories/user_fish/user_fish.repository';

@Module({
  imports: [DatabaseModule, AbilitiesModule, FishesModule, UserModule],
  controllers: [UserFishController],
  providers: [UserFishService, UserFishRepository],
  exports: [UserFishService]
})
export class UserFishModule {}
