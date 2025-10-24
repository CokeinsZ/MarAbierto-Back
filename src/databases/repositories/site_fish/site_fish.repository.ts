import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { FishingSite } from '../../../fishing_sites/interfaces/fishing_site.interface';
import { Fish } from '../../../fishes/interfaces/fish.interface';
import { SiteFish } from 'src/site_fish/interfaces/site_fish.interface';

@Injectable()
export class SiteFishRepository {
    constructor(private readonly db: DatabaseService) { }

    async addFishToSite(site_id: number, fish_id: number): Promise<SiteFish> {
        const rows = await this.db.query<SiteFish>`
            INSERT INTO site_fish (site_id, fish_id)
            VALUES (${site_id}, ${fish_id})
            RETURNING *`;
        return rows[0];
    }

	async addBulkFishToSite(site_id: number, fish_ids: number[]): Promise<SiteFish[]> {
		const siteFishRelations: SiteFish[] = [];
		let query = `INSERT INTO site_fish (site_id, fish_id) VALUES `;
		const values: any[] = [];

		fish_ids.forEach((fish_id, index) => {
			query += `($${index * 2 + 1}, $${index * 2 + 2})`;
			if (index < fish_ids.length - 1) {
				query += ', ';
			}
			values.push(site_id, fish_id);
		});

		query += ' RETURNING *';

		const rows = await this.db.unsafe<SiteFish>(query, values);
		rows.forEach(row => siteFishRelations.push(row));

		return siteFishRelations;
	}

	async addBulkSitesToFish(fish_id: number, site_ids: number[]): Promise<SiteFish[]> {
		const siteFishRelations: SiteFish[] = [];
		let query = `INSERT INTO site_fish (site_id, fish_id) VALUES `;
		const values: any[] = [];

		site_ids.forEach((site_id, index) => {
			query += `($${index * 2 + 1}, $${index * 2 + 2})`;
			if (index < site_ids.length - 1) {
				query += ', ';
			}
			values.push(site_id, fish_id);
		});

		query += ' RETURNING *';

		const rows = await this.db.unsafe<SiteFish>(query, values);
		rows.forEach(row => siteFishRelations.push(row));

		return siteFishRelations;
	}

	async getFishBySite(site_id: number): Promise<Fish[]> {
		const rows = await this.db.query<Fish>`
			SELECT f.*
			FROM fishes f
			JOIN site_fish sf ON f.fish_id = sf.fish_id
			WHERE sf.site_id = ${site_id}`;
		return rows;
	}

	async getSitesByFish(fish_id: number): Promise<FishingSite[]> {
		const rows = await this.db.query<FishingSite>`
			SELECT fs.*
			FROM fishing_sites fs
			JOIN site_fish sf ON fs.site_id = sf.site_id
			WHERE sf.fish_id = ${fish_id}`;
		return rows;
	}

	async removeFishFromSite(site_id: number, fish_id: number): Promise<void> {
		const result = await this.db.query`
			DELETE FROM site_fish
			WHERE site_id = ${site_id} AND fish_id = ${fish_id}
			RETURNING *`;
	}

}