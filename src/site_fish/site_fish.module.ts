import { Module } from '@nestjs/common';
import { SiteFishController } from './site_fish.controller';
import { SiteFishService } from './site_fish.service';
import { DatabaseModule } from 'src/databases/database.module';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';
import { SiteFishRepository } from 'src/databases/repositories/site_fish/site_fish.repository';

@Module({
  imports: [DatabaseModule, AbilitiesModule],
  controllers: [SiteFishController],
  providers: [SiteFishService, SiteFishRepository],
  exports: [SiteFishService],
})
export class SiteFishModule {}
