import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UsersRepository } from './repositories/users/users.repository';
import { SecurityCodesRepository } from './repositories/users/security_codes.repository';
import { UserFishRepository } from './repositories/user_fish/user_fish.repository';
import { FishesRepository } from './repositories/fishes/fishes.repository';
import { FishingSitesRepository } from './repositories/fishing_sites/fishing_sites.repository';
import { SiteFishRepository } from './repositories/site_fish/site_fish.repository';
import { ProductsRepository } from './repositories/products/products.repository';
import { PCategoriesRepository } from './repositories/pcategories/pcategories.repository';
import { WarehouseRepository } from './repositories/warehouse/warehouse.repository';
import { ProductPcategoryRepository } from './repositories/product_pcategory/product_pcategory.repository';
import { WarehouseProductRepository } from './repositories/warehouse_product/warehouse_product.repository';
import { OrdersRepository } from './repositories/orders/orders.repository';
import { PaymentsRepository } from './repositories/payments/payments.repository';

@Module({
  providers: [
    DatabaseService,
    UsersRepository,
    SecurityCodesRepository,
    FishesRepository,
    UserFishRepository,
    FishingSitesRepository,
    SiteFishRepository,
    ProductsRepository,
    PCategoriesRepository,
    WarehouseRepository,
    ProductPcategoryRepository,
    WarehouseProductRepository,
    OrdersRepository,
    PaymentsRepository,
  ],
  exports: [
    DatabaseService,
    UsersRepository,
    SecurityCodesRepository,
    FishesRepository,
    UserFishRepository,
    FishingSitesRepository,
    SiteFishRepository,
    ProductsRepository,
    PCategoriesRepository,
    WarehouseRepository,
    ProductPcategoryRepository,
    WarehouseProductRepository,
    OrdersRepository,
    PaymentsRepository,
  ],
})
export class DatabaseModule {}
