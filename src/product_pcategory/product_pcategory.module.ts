import { Module } from '@nestjs/common';
import { ProductPcategoryController } from './product_pcategory.controller';
import { ProductPcategoryService } from './product_pcategory.service';
import { DatabaseModule } from 'src/databases/database.module';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';
import { ProductPcategoryRepository } from 'src/databases/repositories/product_pcategory/product_pcategory.repository';

@Module({
  imports: [DatabaseModule, AbilitiesModule],
  controllers: [ProductPcategoryController],
  providers: [ProductPcategoryService, ProductPcategoryRepository],
  exports: [ProductPcategoryService],
})
export class ProductPcategoryModule {}
