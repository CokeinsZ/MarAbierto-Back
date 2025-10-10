import { CreateFishingSiteDto, FindAllDto, UpdateFishingSiteDto } from "../dtos/fishing_site.dto";

export interface FishingSite {
    site_id: number;
    name: string;
    address: string;
    description: string;
}

export interface FishingSitesServiceInterface {
    create(createFishingSiteDto: CreateFishingSiteDto): Promise<FishingSite>;
    findAll(findAllDto: FindAllDto): Promise<FishingSite[]>;
    findById(id: number): Promise<FishingSite>;
    findByName(name: string): Promise<FishingSite[]>;
    filterByAddress(address: string): Promise<FishingSite[]>;
    update(id: number, updateFishingSiteDto: UpdateFishingSiteDto): Promise<FishingSite>;
    remove(id: number): Promise<void>;
}