import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FishingSitesService } from './fishing_sites.service';
import { Public } from 'src/tools/decorators/public.decorator';
import { CreateFishingSiteDto, FilterByAddressDto, FindAllDto, FindByNameDto } from './dtos/fishing_site.dto';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';

@Controller('fishing-sites')
export class FishingSitesController {
    constructor(private readonly fishingSitesService: FishingSitesService) { }

    @Post()
    @CheckPolicies({ action: Action.Create, subject: 'FishingSite' })
    create(@Body() dto: CreateFishingSiteDto) {
        return this.fishingSitesService.create(dto);
    }

    @Public()
    @Get()
    findAll(@Body() dto: FindAllDto) {
        return this.fishingSitesService.findAll(dto);
    }

    @Public()   
    @Get(':id')
    findById(@Param('id') id: number) {
        return this.fishingSitesService.findById(id);
    }

    @Public()
    @Get('filter/name')
    findByName(@Query() dto: FindByNameDto) {
        return this.fishingSitesService.findByName(dto.name);
    }

    @Public()
    @Get('filter/address')
    filterByAddress(@Query() dto: FilterByAddressDto) {
        return this.fishingSitesService.filterByAddress(dto.address);
    }

    @CheckPolicies({ action: Action.Update, subject: 'FishingSite' })
    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: CreateFishingSiteDto) {
        return this.fishingSitesService.update(id, dto);
    }

    @CheckPolicies({ action: Action.Delete, subject: 'FishingSite' })
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.fishingSitesService.remove(id);
    }
}
