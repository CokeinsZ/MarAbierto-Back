import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { DashboardDataDto } from './dtos/stats.dto';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  async getDashboard(): Promise<DashboardDataDto> {
    return await this.statsService.getDashboardData();
  }
}
