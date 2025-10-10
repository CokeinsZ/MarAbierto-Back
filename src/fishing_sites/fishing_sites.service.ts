import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FishingSite, FishingSitesServiceInterface } from './interfaces/fishing_site.interface';
import { FishingSitesRepository } from 'src/databases/repositories/fishing_sites/fishing_sites.repository';
import { CreateFishingSiteDto, FindAllDto, UpdateFishingSiteDto } from './dtos/fishing_site.dto';
import { max } from 'class-validator';

@Injectable()
export class FishingSitesService implements FishingSitesServiceInterface {
    constructor(private readonly fishingSitesRepository: FishingSitesRepository) { }
    async create(createFishingSiteDto: CreateFishingSiteDto): Promise<FishingSite> {
        const existing = await this.fishingSitesRepository.findByName(createFishingSiteDto.name);
        existing.forEach(site => {
            if (site.name.toLowerCase() === createFishingSiteDto.name.toLowerCase()) {
                throw new ConflictException('Fishing site with this name already exists');
            }
        });

        const created = await this.fishingSitesRepository.create(createFishingSiteDto);
        if (!created) throw new Error('Fishing site creation failed');
        return this.toFishingSiteInterface(created);
    }
    
    async findAll(dto: FindAllDto): Promise<FishingSite[]> {
        const sites = await this.fishingSitesRepository.findAll(dto.max, dto.page);
        return sites.map(this.toFishingSiteInterface);
    }
    
    async findById(id: number): Promise<FishingSite> {
        const site = await this.fishingSitesRepository.findById(id);
        if (!site) throw new NotFoundException('Fishing site not found');
        return this.toFishingSiteInterface(site);
    }

    async findByName(name: string): Promise<FishingSite[]> {
        const sites = await this.fishingSitesRepository.findByName(name);
        return sites.map(this.toFishingSiteInterface);
    }
    
    async filterByAddress(address: string): Promise<FishingSite[]> {
        const sites = await this.fishingSitesRepository.filterByAddress(address);
        return sites.map(this.toFishingSiteInterface);
    }

    async update(id: number, updateFishingSiteDto: UpdateFishingSiteDto): Promise<FishingSite> {
        const site = await this.fishingSitesRepository.findById(id);
        if (!site) throw new NotFoundException('Fishing site not found');

        const updated = await this.fishingSitesRepository.update(id, updateFishingSiteDto);
        if (!updated) throw new Error('Fishing site update failed');
        return this.toFishingSiteInterface(updated);
    }

    async remove(id: number): Promise<void> {
        const site = await this.fishingSitesRepository.findById(id);
        if (!site) throw new NotFoundException('Fishing site not found');

        await this.fishingSitesRepository.remove(id);
    }

    private toFishingSiteInterface(fishingSite: any): FishingSite {
        return {
            site_id: fishingSite.site_id,
            name: fishingSite.name,
            address: fishingSite.address,
            description: fishingSite.description,
        };
      }
}