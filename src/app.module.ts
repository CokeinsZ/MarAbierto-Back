import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { DatabaseModule } from './databases/database.module';
import { DatabaseService } from './databases/database.service';
import { PoliciesGuard } from './tools/guards/policies.guard';
import { JwtAuthGuard } from './tools/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './tools/guards/roles.guard';
import { AbilitiesModule } from './tools/abilities/abilities.module';
import { JwtStrategy } from './tools/strategies/jwt.strategy';
import { MailModule } from './mails/mails.module';
import { FishesModule } from './fishes/fishes.module';
import { UserFishModule } from './user_fish/user_fish.module';
import { FishingSitesModule } from './fishing_sites/fishing_sites.module';
import { SiteFishModule } from './site_fish/site_fish.module';
import { ProductsModule } from './products/products.module';
import { WarehouseProductModule } from './warehouse_product/warehouse_product.module';
import { ProductPcategoryModule } from './product_pcategory/product_pcategory.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { PcategoriesModule } from './pcategories/pcategories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AbilitiesModule,
    DatabaseModule,
    MailModule,
    FishesModule,
    UserFishModule,
    FishingSitesModule,
    SiteFishModule,
    ProductsModule,
    PcategoriesModule,
    WarehouseModule,
    ProductPcategoryModule,
    WarehouseProductModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtStrategy,
    DatabaseService,
  ],
})
export class AppModule {}
