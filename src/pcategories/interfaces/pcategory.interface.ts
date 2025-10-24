import {
  CreatePCategoryDto,
  FindAllDto,
  UpdatePCategoryDto,
} from '../dtos/pcategory.dto';

export interface PCategory {
  pcategory_id: number;
  name: string;
}

export interface PCategoryServiceInterface {
  createPCategory(dto: CreatePCategoryDto): Promise<PCategory>;
  listPCategories(dto: FindAllDto): Promise<PCategory[]>;
  getPCategoryById(pcategory_id: number): Promise<PCategory>;
  updatePcategory(
    pcategory_id: number,
    dto: UpdatePCategoryDto,
  ): Promise<PCategory>;
  deletePCategory(pcategory_id: number): Promise<void>;
}
