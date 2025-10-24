import { Fish } from "src/fishes/interfaces/fish.interface";
import { FishingSite } from "src/fishing_sites/interfaces/fishing_site.interface";
import { AddBulkFishToSiteDto, AddBulkSitesToFishDto, AddFishToSiteDto, RemoveFishFromSiteDto } from "../dtos/site_fish.dto";

export interface SiteFish {
  site_id: number;
  fish_id: number;
} 

export interface SiteFishServiceInterface {
  addFishToSite(dto: AddFishToSiteDto): Promise<SiteFish>;
  addBulkFishToSite(dto: AddBulkFishToSiteDto): Promise<SiteFish[]>;
  addBulkSitesToFish(dto: AddBulkSitesToFishDto): Promise<SiteFish[]>;
  getFishBySite(site_id: number): Promise<Fish[]>;
  getSitesByFish(fish_id: number): Promise<FishingSite[]>;
  removeFishFromSite(dto: RemoveFishFromSiteDto): Promise<void>;
}