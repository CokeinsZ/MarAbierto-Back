import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Fish, FishServiceInterface } from './interfaces/fish.interface';
import { FishesRepository } from '../databases/repositories/fishes/fishes.repository';

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
  constructor(private readonly fishesRepository: FishesRepository) { }

  async create(createFishDto: CreateFishDto): Promise<Fish> {
    const existing = await this.fishesRepository.findByName(createFishDto.common_name);
    existing.forEach(fish => {
      if (fish.common_name.toLowerCase() === createFishDto.common_name.toLowerCase()) {
        throw new BadRequestException('Fish with this common name already exists');
      }
    });

    const created = await this.fishesRepository.createFish(createFishDto);
    if (!created) throw new BadRequestException('Fish creation failed');
    return this.toFishInterface(created);
  }

  async findAll(): Promise<Fish[]> {
    const fishes = await this.fishesRepository.findAll();
    return fishes.map(f => this.toFishInterface(f));
  }

  async findById(id: number): Promise<Fish> {
    const fish = await this.fishesRepository.findById(id);
    if (!fish) throw new NotFoundException('Fish not found');
    return this.toFishInterface(fish);
  }

  async findByName(common_name: string): Promise<Fish[]> {
    const fishes = await this.fishesRepository.findByName(common_name);
    return fishes.map(f => this.toFishInterface(f));
  }

  async filterByFishingSite(site: FilterByFishingSiteDto): Promise<Fish[]> {
    const fishes = await this.fishesRepository.filterByFishingSite(site.site);
    return fishes.map(f => this.toFishInterface(f));
  }

  async filterByHabitat(dto: FilterByHabitatDto): Promise<Fish[]> {
    const fishes = await this.fishesRepository.filterByHabitat(dto.habitat);
    return fishes.map(f => this.toFishInterface(f));
  }

  async filterByDiet(dto: FilterByDietDto): Promise<Fish[]> {
    const fishes = await this.fishesRepository.filterByDiet(dto.diet);
    return fishes.map(f => this.toFishInterface(f));
  }

  async filterBySize(dto: FilterBySizeDto): Promise<Fish[]> {
    const fishes = await this.fishesRepository.filterBySize(dto.minSize, dto.maxSize);
    return fishes.map(f => this.toFishInterface(f));
  }

  async filterByWeight(dto: FilterByWeightDto): Promise<Fish[]> {
    const fishes = await this.fishesRepository.filterByWeight(dto.minWeight, dto.maxWeight);
    return fishes.map(f => this.toFishInterface(f));
  }

  async update(id: number, updateFishDto: UpdateFishDto): Promise<Fish> {
    const existing = await this.fishesRepository.findById(id);
    if (!existing) throw new NotFoundException('Fish not found');
    
    const updated = await this.fishesRepository.updateFish(id, updateFishDto);
    return this.toFishInterface(updated);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.fishesRepository.findById(id);
    if (!existing) throw new NotFoundException('Fish not found');
    await this.fishesRepository.deleteFish(id);
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
