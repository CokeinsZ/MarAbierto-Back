import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddFishToSiteDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  site_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  fish_id: number;
}

export class AddBulkFishToSiteDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  site_id: number;

  @IsNotEmpty({ each: true })
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  fish_ids: number[];
}

export class AddBulkSitesToFishDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  fish_id: number;

  @IsNotEmpty({ each: true })
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  site_ids: number[];
}

export class RemoveFishFromSiteDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  site_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  fish_id: number;
}
