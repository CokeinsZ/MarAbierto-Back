import { Injectable } from '@nestjs/common';
import { StatsRepository } from '../databases/repositories/stats/stats.repository';
import { DashboardDataDto } from './dtos/stats.dto';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  async getDashboardData(): Promise<DashboardDataDto> {
    return await this.statsRepository.getDashboardData();
  }
}
