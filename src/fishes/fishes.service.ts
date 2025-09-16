import { Injectable } from '@nestjs/common';
import { Fish, FishServiceInterface } from './interfaces/fish.interface';

import { 
    CreateFishDto, 
    UpdateFishDto,
    FilterByHabitatDto,
    FilterByDietDto,
    FilterBySizeDto,
    FilterByWeightDto,
    FilterByFishingSiteDto
} from "./dtos/fish.dto";

@Injectable()
export class FishesService implements FishServiceInterface {
    create(createFishDto: CreateFishDto): Promise<Fish> {
        // Implementation here
    }

    findAll(): Promise<Fish[]> {
        // Implementation here
    }

    findById(id: number): Promise<Fish> {
        // Implementation here
    }

    findByName(common_name: string): Promise<Fish[]> {
        // Implementation here
    }

    filterByFishingSite(site: FilterByFishingSiteDto): Promise<Fish[]> {
        // Implementation here
    }

    filterByHabitat(dto: FilterByHabitatDto): Promise<Fish[]> {
        // Implementation here
    }

    filterByDiet(dto: FilterByDietDto): Promise<Fish[]> {
        // Implementation here
    }

    filterBySize(dto: FilterBySizeDto): Promise<Fish[]> {
        // Implementation here
    }

    filterByWeight(dto: FilterByWeightDto): Promise<Fish[]> {
        // Implementation here
    }

    update(id: number, updateFishDto: UpdateFishDto): Promise<Fish> {
        // Implementation here
    }

    remove(id: number): Promise<void> {
        // Implementation here
    }

    private toFishInterface(fish: any): Fish {
        return {
            common_name: fish.common_name,
            scientific_name: fish.scientific_name,
            habitat: fish.habitat,
            mean_size: fish.mean_size,
            mean_weight: fish.mean_weight,
            diet: fish.diet,
            img: fish.img,
        };
    }
     
}
