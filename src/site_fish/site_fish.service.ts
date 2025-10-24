import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SiteFish, SiteFishServiceInterface } from './interfaces/site_fish.interface';
import { SiteFishRepository } from 'src/databases/repositories/site_fish/site_fish.repository';
import { AddBulkFishToSiteDto, AddBulkSitesToFishDto, AddFishToSiteDto, RemoveFishFromSiteDto } from './dtos/site_fish.dto';
import { Fish } from 'src/fishes/interfaces/fish.interface';
import { FishingSite } from 'src/fishing_sites/interfaces/fishing_site.interface';

@Injectable()
export class SiteFishService implements SiteFishServiceInterface {
    constructor(private readonly siteFishRepository: SiteFishRepository) { }

    async addFishToSite(dto: AddFishToSiteDto): Promise<SiteFish> {
        try {
            const created = await this.siteFishRepository.addFishToSite(dto.site_id, dto.fish_id);
            if (!created) throw new Error('Failed to add fish to site');
            return this.toSiteFishInterface(created);
        } catch (error) {
            if (error.code === '23505') { // PostgreSQL unique violation
                throw new ConflictException('This fish is already associated with this site');
            }
            if (error.code === '23503') { // PostgreSQL foreign key violation
                throw new NotFoundException('Fish or site not found');
            }
            throw error;
        }
    }

    async addBulkFishToSite(dto: AddBulkFishToSiteDto): Promise<SiteFish[]> {
        try {
            const created = await this.siteFishRepository.addBulkFishToSite(dto.site_id, dto.fish_ids);
            return created.map(this.toSiteFishInterface);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('One or more fish are already associated with this site');
            }
            if (error.code === '23503') {
                throw new NotFoundException('One or more fish or the site were not found');
            }
            throw error;
        }
    }

    async addBulkSitesToFish(dto: AddBulkSitesToFishDto): Promise<SiteFish[]> {
        try {
            const created = await this.siteFishRepository.addBulkSitesToFish(dto.fish_id, dto.site_ids);
            return created.map(this.toSiteFishInterface);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('This fish is already associated with one or more sites');
            }
            if (error.code === '23503') {
                throw new NotFoundException('Fish or one or more sites were not found');
            }
            throw error;
        }
    }

    async getFishBySite(site_id: number): Promise<Fish[]> {
        const fishes = await this.siteFishRepository.getFishBySite(site_id);
        return fishes.map(this.toFishInterface);
    }

    async getSitesByFish(fish_id: number): Promise<FishingSite[]> {
        const sites = await this.siteFishRepository.getSitesByFish(fish_id);
        return sites.map(this.toFishingSiteInterface);
    }

    async removeFishFromSite(dto: RemoveFishFromSiteDto): Promise<void> {
        await this.siteFishRepository.removeFishFromSite(dto.site_id, dto.fish_id);
    }

    private toSiteFishInterface(siteFish: any): SiteFish {
        return {
            site_id: siteFish.site_id,
            fish_id: siteFish.fish_id,
        };
    }

    private toFishInterface(fish: any): Fish {
        return {
            fish_id: fish.fish_id,
            common_name: fish.common_name,
            scientific_name: fish.scientific_name,
            habitat: fish.habitat,
            mean_size: fish.mean_size,
            mean_weight: fish.mean_weight,
            diet: fish.diet,
            img: fish.img,
        };
    }

    private toFishingSiteInterface(site: any): FishingSite {
        return {
            site_id: site.site_id,
            name: site.name,
            address: site.address,
            description: site.description,
        };
    }
}
