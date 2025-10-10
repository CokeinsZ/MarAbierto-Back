import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { FishingSite } from '../../../fishing_sites/interfaces/fishing_site.interface';

@Injectable()
export class FishingSitesRepository {
    constructor(private readonly db: DatabaseService) { }

    async create(fishingSite: Partial<FishingSite>): Promise<FishingSite> {
        const rows = await this.db.query<FishingSite>`
            INSERT INTO fishingsites (name, address, description)
            VALUES (${fishingSite.name}, ${fishingSite.address}, ${fishingSite.description})
            RETURNING *`;
        return rows[0];
    }

    async findAll(max: number = 10, page: number = 0): Promise<FishingSite[]> {
        return this.db.query<FishingSite>`
            SELECT * FROM fishingsites
            LIMIT ${max} OFFSET ${page * max}`;
    }

    async findById(id: number): Promise<FishingSite | null> {
        const rows = await this.db.query<FishingSite>`SELECT * FROM fishingsites WHERE site_id = ${id}`;
        return rows[0] || null;
    }

    async findByName(name: string): Promise<FishingSite[]> {
        return this.db.query<FishingSite>`SELECT * FROM fishingsites WHERE unaccent(name) ILIKE '%' || unaccent(${name}) || '%'`;
    }

    async filterByAddress(address: string): Promise<FishingSite[]> {
        return this.db.query<FishingSite>`SELECT * FROM fishingsites WHERE unaccent(address) ILIKE '%' || unaccent(${address}) || '%'`;
    }

    async update(id: number, fishingSite: Partial<FishingSite>): Promise<FishingSite> {
        const keys = Object.keys(fishingSite).filter(k => k !== 'site_id');
        if (keys.length === 0) {
            throw new BadRequestException('No fields to update. (You can\'t update the id)');
        }
        const setClauses: string[] = [];
        const values: any[] = [];
        keys.forEach((k, idx) => {
            setClauses.push(`${k} = $${idx + 1}`);
            values.push((fishingSite as any)[k]);
        });
        // WHERE param position is next
        const whereIndex = values.length + 1;
        const sql = `UPDATE fishingsites SET ${setClauses.join(', ')} WHERE site_id = $${whereIndex} RETURNING *`;
        values.push(id);
        const rows = await this.db.unsafe<FishingSite>(sql, values);
        return rows[0];
    }

    async remove(id: number): Promise<void> {
        await this.db.query`DELETE FROM fishingsites WHERE site_id = ${id}`;
    }

}