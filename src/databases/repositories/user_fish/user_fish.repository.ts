import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { UserFish } from '../../../user_fish/interfaces/user_fish.interface';

@Injectable()
export class UserFishRepository {
  constructor(private readonly db: DatabaseService) {}

  async link(dto: Partial<UserFish>): Promise<UserFish> {
    const rows = await this.db.query<UserFish>`
      INSERT INTO user_fish (user_id, fish_id, origin, size, weight, is_favorite)
      VALUES (${dto.user_id}, ${dto.fish_id}, ${dto.origin ?? null}, ${dto.size ?? null}, ${dto.weight ?? null}, ${dto.is_favorite ?? false})
      RETURNING *`;
    return rows[0];
  }

  async findAllByUser(user_id: number): Promise<UserFish[]> {
    return this.db
      .query<UserFish>`SELECT * FROM user_fish WHERE user_id = ${user_id}`;
  }

  async findOneById(id: number): Promise<UserFish | null> {
    const rows = await this.db.query<UserFish>`
      SELECT * FROM user_fish WHERE id = ${id}`;
    return rows[0] || null;
  }

  async findByUserIdAndFishId(
    user_id: number,
    fish_id: number,
  ): Promise<UserFish | null> {
    const rows = await this.db.query<UserFish>`
      SELECT * FROM user_fish WHERE user_id = ${user_id} AND fish_id = ${fish_id}`;
    return rows[0] || null;
  }

  async update(
    user_id: number,
    fish_id: number,
    data: Partial<UserFish>,
  ): Promise<UserFish> {
    // Only include provided fields (not undefined/null) and never allow updating composite PKs
    const entries = Object.entries(data).filter(
      ([key, value]) =>
        value !== undefined &&
        value !== null &&
        !['user_id', 'fish_id', 'id'].includes(key),
    );
    if (entries.length === 0) {
      throw new BadRequestException(
        "No fields to update. (You can't update user_id or fish_id)",
      );
    }
    const setClauses: string[] = entries.map(([key], idx) => `${key} = $${idx + 1}`);
    const values: any[] = entries.map(([, value]) => value as any);
    setClauses.push('updated_at = NOW()');
    const whereUserIndex = values.length + 1;
    const whereFishIndex = values.length + 2;
    const sql = `UPDATE user_fish SET ${setClauses.join(', ')} WHERE user_id = $${whereUserIndex} AND fish_id = $${whereFishIndex} RETURNING *`;
    values.push(user_id, fish_id);
    const rows = await this.db.unsafe<UserFish>(sql, values);
    return rows[0];
  }

  async unlink(id: number): Promise<void> {
    await this.db.query`DELETE FROM user_fish WHERE id = ${id}`;
  }
}
