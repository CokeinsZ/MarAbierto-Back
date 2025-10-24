import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SiteFishService } from './site_fish.service';
import { Public } from 'src/tools/decorators/public.decorator';
import {
  AddBulkFishToSiteDto,
  AddBulkSitesToFishDto,
  AddFishToSiteDto,
  RemoveFishFromSiteDto,
} from './dtos/site_fish.dto';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';

@Controller('site-fish')
export class SiteFishController {
  constructor(private readonly siteFishService: SiteFishService) {}

  @Post()
  @CheckPolicies({ action: Action.Create, subject: 'SiteFish' })
  addFishToSite(@Body() dto: AddFishToSiteDto) {
    return this.siteFishService.addFishToSite(dto);
  }

  @Post('bulk/fish-to-site')
  @CheckPolicies({ action: Action.Create, subject: 'SiteFish' })
  addBulkFishToSite(@Body() dto: AddBulkFishToSiteDto) {
    return this.siteFishService.addBulkFishToSite(dto);
  }

  @Post('bulk/sites-to-fish')
  @CheckPolicies({ action: Action.Create, subject: 'SiteFish' })
  addBulkSitesToFish(@Body() dto: AddBulkSitesToFishDto) {
    return this.siteFishService.addBulkSitesToFish(dto);
  }

  @Public()
  @Get('site/:site_id')
  getFishBySite(@Param('site_id') site_id: number) {
    return this.siteFishService.getFishBySite(site_id);
  }

  @Public()
  @Get('fish/:fish_id')
  getSitesByFish(@Param('fish_id') fish_id: number) {
    return this.siteFishService.getSitesByFish(fish_id);
  }

  @CheckPolicies({ action: Action.Delete, subject: 'SiteFish' })
  @Delete()
  removeFishFromSite(@Body() dto: RemoveFishFromSiteDto) {
    return this.siteFishService.removeFishFromSite(dto);
  }
}
