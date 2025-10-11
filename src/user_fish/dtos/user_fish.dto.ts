import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { UserFish, Origin } from '../interfaces/user_fish.interface';

export class LinkUserFishDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  fish_id: number;

  @IsNotEmpty()
  @IsEnum(Origin, {
    message: 'origin must be one of the following: fishing, store',
  })
  origin: Origin;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  size?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  weight?: string;

  @IsNotEmpty()
  @IsBoolean()
  is_favorite: boolean = false;
}

export class UpdateUserFishDto {
  @IsOptional()
  @IsEnum(Origin, {
    message: 'origin must be one of the following: fishing, store',
  })
  origin?: Origin;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  size?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  weight?: string;

  @IsOptional()
  @IsBoolean()
  is_favorite?: boolean;
}
