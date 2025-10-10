import { Module } from '@nestjs/common';
import { FishingSitesController } from './fishing_sites.controller';
import { FishingSitesService } from './fishing_sites.service';
import { DatabaseModule } from 'src/databases/database.module';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';
import { FishingSitesRepository } from 'src/databases/repositories/fishing_sites/fishing_sites.repository';

@Module({
  imports: [
      DatabaseModule,
      AbilitiesModule,
    ],
  controllers: [FishingSitesController],
  providers: [FishingSitesService, FishingSitesRepository ],
  exports: [FishingSitesService]
})
export class FishingSitesModule {}
