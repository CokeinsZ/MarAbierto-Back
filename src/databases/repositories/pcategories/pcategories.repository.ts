import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { PCategory } from 'src/pcategories/interfaces/pcategory.interface';
import { CreatePCategoryDto } from 'src/pcategories/dtos/pcategory.dto';

@Injectable()
export class PCategoriesRepository {
  constructor(private readonly db: DatabaseService) {}

  async createPCategory(dto: CreatePCategoryDto): Promise<PCategory> {
    const rows = await this.db.query<PCategory>`
      INSERT INTO pcategories (name)
      VALUES (${dto.name})
      RETURNING *`;
    return rows[0];
  }

  async listPCategories(max: number, page: number): Promise<PCategory[]> {
    const rows = await this.db.query<PCategory>`
      SELECT * FROM pcategories
      ORDER BY pcategory_id
      LIMIT ${max} OFFSET ${page}`;
    return rows;
  }

  async getPCategoryById(pcategory_id: number): Promise<PCategory> {
    const rows = await this.db.query<PCategory>`
      SELECT * FROM pcategories
      WHERE pcategory_id = ${pcategory_id}`;
    return rows[0];
  }

  async updatePCategory(
    pcategory_id: number,
    dto: Partial<CreatePCategoryDto>,
  ): Promise<PCategory> {
    const rows = await this.db.query<PCategory>`
      UPDATE pcategories
      SET name = COALESCE(${dto.name}, name)
      WHERE pcategory_id = ${pcategory_id}
      RETURNING *`;
    return rows[0];
  }

  async deletePCategory(pcategory_id: number): Promise<void> {
    await this.db.query`
      DELETE FROM pcategories
      WHERE pcategory_id = ${pcategory_id}`;
  }
}
