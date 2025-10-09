import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { Fish } from '../../../fishes/interfaces/fish.interface';

@Injectable()
export class FishesRepository {
  constructor(private readonly db: DatabaseService) { }

  async createFish(fish: Partial<Fish>): Promise<Fish> {
    const rows = await this.db.query<Fish>`
      INSERT INTO fishes (common_name, scientific_name, habitat, mean_size, mean_weight, diet, img)
      VALUES (${fish.common_name}, ${fish.scientific_name ?? null}, ${fish.habitat}, ${fish.mean_size ?? null}, ${fish.mean_weight ?? null}, ${fish.diet}, ${fish.img})
      RETURNING *`;
    return rows[0];
  }

  async findAll(): Promise<Fish[]> {
    return this.db.query<Fish>`SELECT * FROM fishes`;
  }

  async findById(id: number): Promise<Fish | null> {
    const rows = await this.db.query<Fish>`SELECT * FROM fishes WHERE fish_id = ${id}`;
    return rows[0] || null;
  }

  async findByName(common_name: string): Promise<Fish[]> {
    return this.db.query<Fish>`SELECT * FROM fishes WHERE unaccent(common_name) ILIKE '%' || unaccent(${common_name}) || '%'`;
  }

  async filterByFishingSite(site: string): Promise<Fish[]> {
    return this.db.query<Fish>`
      SELECT f.* FROM fishes f
      JOIN site_fish sf ON sf.fish_id = f.fish_id
      JOIN fishingsites fs ON fs.site_id = sf.site_id
      WHERE unaccent(fs.name) ILIKE '%' || unaccent(${site}) || '%'`;
  }

  async filterByHabitat(habitat: string): Promise<Fish[]> {
    return this.db.query<Fish>`SELECT * FROM fishes WHERE unaccent(habitat) ILIKE '%' || unaccent(${habitat}) || '%'`;
  }

  async filterByDiet(diet: string): Promise<Fish[]> {
    return this.db.query<Fish>`SELECT * FROM fishes WHERE unaccent(diet) ILIKE '%' || unaccent(${diet}) || '%'`;
  }

  async filterBySize(min: number, max: number): Promise<Fish[]> {
    return this.db.query<Fish>`
      SELECT * FROM fishes
      WHERE mean_size ~ '^[0-9]+(\\.[0-9]+)?$'
        AND (mean_size)::numeric BETWEEN ${min} AND ${max}`;
  }

  async filterByWeight(min: number, max: number): Promise<Fish[]> {
    return this.db.query<Fish>`
      SELECT * FROM fishes
      WHERE mean_weight ~ '^[0-9]+(\\.[0-9]+)?$'
        AND (mean_weight)::numeric BETWEEN ${min} AND ${max}`;
  }

  async updateFish(id: number, fish: Partial<Fish>): Promise<Fish> {
    const keys = Object.keys(fish).filter(k => k !== 'fish_id');
    if (keys.length === 0) {
      throw new BadRequestException('No fields to update. (You can\'t update the id)');
    }
    const setClauses: string[] = [];
    const values: any[] = [];
    keys.forEach((k, idx) => {
      setClauses.push(`${k} = $${idx + 1}`);
      values.push((fish as any)[k]);
    });
    // WHERE param position is next
    const whereIndex = values.length + 1;
    const sql = `UPDATE fishes SET ${setClauses.join(', ')} WHERE fish_id = $${whereIndex} RETURNING *`;
    values.push(id);
    const rows = await this.db.unsafe<Fish>(sql, values);
    return rows[0];
  }

  async deleteFish(id: number): Promise<void> {
    this.db.query`DELETE FROM fishes WHERE fish_id = ${id}`;
  }
}