import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PCategory,
  PCategoryServiceInterface,
} from './interfaces/pcategory.interface';
import { PCategoriesRepository } from 'src/databases/repositories/pcategories/pcategories.repository';
import {
  CreatePCategoryDto,
  FindAllDto,
  UpdatePCategoryDto,
} from './dtos/pcategory.dto';

@Injectable()
export class PcategoriesService implements PCategoryServiceInterface {
  constructor(private readonly pcategoriesRepository: PCategoriesRepository) {}

  async createPCategory(dto: CreatePCategoryDto): Promise<PCategory> {
    const created = await this.pcategoriesRepository.createPCategory(dto);
    if (!created) throw new Error('PCategory creation failed');
    return this.toPCategoryInterface(created);
  }

  async listPCategories(dto: FindAllDto): Promise<PCategory[]> {
    const pcategories = await this.pcategoriesRepository.listPCategories(
      dto.max,
      (dto.page - 1) * dto.max,
    );
    return pcategories.map(this.toPCategoryInterface);
  }

  async getPCategoryById(pcategory_id: number): Promise<PCategory> {
    const pcategory =
      await this.pcategoriesRepository.getPCategoryById(pcategory_id);
    if (!pcategory) throw new NotFoundException('PCategory not found');
    return this.toPCategoryInterface(pcategory);
  }

  async updatePcategory(
    pcategory_id: number,
    dto: UpdatePCategoryDto,
  ): Promise<PCategory> {
    const pcategory =
      await this.pcategoriesRepository.getPCategoryById(pcategory_id);
    if (!pcategory) throw new NotFoundException('PCategory not found');

    const updated = await this.pcategoriesRepository.updatePCategory(
      pcategory_id,
      dto,
    );
    if (!updated) throw new Error('PCategory update failed');
    return this.toPCategoryInterface(updated);
  }

  async deletePCategory(pcategory_id: number): Promise<void> {
    const pcategory =
      await this.pcategoriesRepository.getPCategoryById(pcategory_id);
    if (!pcategory) throw new NotFoundException('PCategory not found');

    await this.pcategoriesRepository.deletePCategory(pcategory_id);
  }

  private toPCategoryInterface(pcategory: any): PCategory {
    return {
      pcategory_id: pcategory.pcategory_id,
      name: pcategory.name,
    };
  }
}
