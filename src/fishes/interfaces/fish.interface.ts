import { 
    CreateFishDto, 
    UpdateFishDto,
    FilterByHabitatDto,
    FilterByDietDto,
    FilterBySizeDto,
    FilterByWeightDto,
    FilterByFishingSiteDto
} from "../dtos/fish.dto";

export interface Fish {
    fish_id?: number;
    common_name: string;
    scientific_name?: string;
    habitat: string;
    mean_size?: number;
    mean_weight?: number;
    diet: string;
    img: string;
}

export interface FishServiceInterface {
    create(createFishDto: CreateFishDto): Promise<Fish>;
    findAll(): Promise<Fish[]>;
    findById(id: number): Promise<Fish>;
    findByName(common_name: string): Promise<Fish[]>;
    filterByFishingSite(site: FilterByFishingSiteDto): Promise<Fish[]>;
    filterByHabitat(dto: FilterByHabitatDto): Promise<Fish[]>;
    filterByDiet(dto: FilterByDietDto): Promise<Fish[]>;
    filterBySize(dto: FilterBySizeDto): Promise<Fish[]>;
    filterByWeight(dto: FilterByWeightDto): Promise<Fish[]>;
    update(id: number, updateFishDto: UpdateFishDto): Promise<Fish>;
    remove(id: number): Promise<void>;
}
