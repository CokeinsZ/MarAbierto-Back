import { LinkUserFishDto, UpdateUserFishDto } from "../dtos/user_fish.dto";

export enum Origin {
    FISHING = 'fishing',
    STORE = 'store',
}

export interface UserFish {
    user_id: number,
    fish_id: number,
    origin: Origin,
    size?: string,
    weight?: string,
    is_favorite: boolean,
}

export interface UserFishServiceInterface {
    linkUserFish(dto: LinkUserFishDto): Promise<UserFish>;
    getUserFishes(user_id: number): Promise<UserFish[]>;
    getUserFish(user_id: number, fish_id: number): Promise<UserFish>;
    updateUserFish(user_id: number, fish_id: number, dto: UpdateUserFishDto): Promise<UserFish>;
    unlinkUserFish(id: number, req: any): Promise<void>;
}
