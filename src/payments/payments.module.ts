import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { DatabaseModule } from 'src/databases/database.module';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';
import { PaymentsRepository } from 'src/databases/repositories/payments/payments.repository';

@Module({
  imports: [DatabaseModule, AbilitiesModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
