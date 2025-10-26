import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from '../databases/repositories/warehouse/warehouse.repository';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';
import { DatabaseModule } from 'src/databases/database.module';

@Module({
  imports: [DatabaseModule, AbilitiesModule],
  controllers: [WarehouseController],
  providers: [WarehouseService, WarehouseRepository],
  exports: [WarehouseService],
})
export class WarehouseModule {}
