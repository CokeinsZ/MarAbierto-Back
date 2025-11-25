import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { DatabaseModule } from '../databases/database.module';
import { StatsRepository } from '../databases/repositories/stats/stats.repository';

@Module({
  imports: [DatabaseModule],
  providers: [StatsService, StatsRepository],
  controllers: [StatsController]
})
export class StatsModule {}
