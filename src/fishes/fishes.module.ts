import { Module } from '@nestjs/common';
import { FishesController } from './fishes.controller';
import { FishesService } from './fishes.service';
import { FishesRepository } from '../databases/repositories/fishes/fishes.repository';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';
import { DatabaseModule } from 'src/databases/database.module';

@Module({
  imports: [DatabaseModule, AbilitiesModule],
  controllers: [FishesController],
  providers: [FishesService, FishesRepository],
  exports: [FishesService],
})
export class FishesModule {}
