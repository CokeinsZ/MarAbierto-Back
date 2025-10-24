import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PcategoriesService } from './pcategories.service';
import { Public } from 'src/tools/decorators/public.decorator';
import {
  CreatePCategoryDto,
  FindAllDto,
  UpdatePCategoryDto,
} from './dtos/pcategory.dto';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';

@Controller('pcategories')
export class PcategoriesController {
  constructor(private readonly pcategoriesService: PcategoriesService) {}

  @Post()
  @CheckPolicies({ action: Action.Create, subject: 'PCategory' })
  createPCategory(@Body() dto: CreatePCategoryDto) {
    return this.pcategoriesService.createPCategory(dto);
  }

  @Public()
  @Get()
  listPCategories(@Body() dto: FindAllDto) {
    return this.pcategoriesService.listPCategories(dto);
  }

  @Public()
  @Get(':id')
  getPCategoryById(@Param('id') id: number) {
    return this.pcategoriesService.getPCategoryById(id);
  }

  @CheckPolicies({ action: Action.Update, subject: 'PCategory' })
  @Patch(':id')
  updatePCategory(@Param('id') id: number, @Body() dto: UpdatePCategoryDto) {
    return this.pcategoriesService.updatePcategory(id, dto);
  }

  @CheckPolicies({ action: Action.Delete, subject: 'PCategory' })
  @Delete(':id')
  deletePCategory(@Param('id') id: number) {
    return this.pcategoriesService.deletePCategory(id);
  }
}
