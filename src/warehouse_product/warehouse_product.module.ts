import { Module } from '@nestjs/common';
import { WarehouseProductController } from './warehouse_product.controller';
import { WarehouseProductService } from './warehouse_product.service';
import { DatabaseModule } from 'src/databases/database.module';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';
import { WarehouseProductRepository } from 'src/databases/repositories/warehouse_product/warehouse_product.repository';

@Module({
  imports: [DatabaseModule, AbilitiesModule],
  controllers: [WarehouseProductController],
  providers: [WarehouseProductService, WarehouseProductRepository],
  exports: [WarehouseProductService],
})
export class WarehouseProductModule {}
