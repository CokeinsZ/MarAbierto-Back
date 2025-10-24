import { Module } from '@nestjs/common';
import { PcategoriesService } from './pcategories.service';
import { PcategoriesController } from './pcategories.controller';
import { DatabaseModule } from 'src/databases/database.module';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';
import { PCategoriesRepository } from 'src/databases/repositories/pcategories/pcategories.repository';

@Module({
  imports: [DatabaseModule, AbilitiesModule],
  providers: [PcategoriesService, PCategoriesRepository],
  controllers: [PcategoriesController],
  exports: [PcategoriesService],
})
export class PcategoriesModule {}
