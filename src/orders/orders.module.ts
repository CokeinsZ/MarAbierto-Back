import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DatabaseModule } from 'src/databases/database.module';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';
import { OrdersRepository } from 'src/databases/repositories/orders/orders.repository';
import { PaymentsRepository } from 'src/databases/repositories/payments/payments.repository';

@Module({
  imports: [DatabaseModule, AbilitiesModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, PaymentsRepository],
  exports: [OrdersService],
})
export class OrdersModule {}
