import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserFishServiceInterface, UserFish } from './interfaces/user_fish.interface';
import { LinkUserFishDto, UpdateUserFishDto } from './dtos/user_fish.dto';
import { UserFishRepository } from '../databases/repositories/user_fish/user_fish.repository';

@Injectable()
export class UserFishService implements UserFishServiceInterface {
	constructor(private readonly repository: UserFishRepository) {}

	async linkUserFish(dto: LinkUserFishDto): Promise<UserFish> {
		const created = await this.repository.link(dto);
		if (!created) throw new BadRequestException('Failed to link user to fish');
		return this.toInterface(created);
	}

	async getUserFishes(user_id: number): Promise<UserFish[]> {
		const rows = await this.repository.findAllByUser(user_id);
		return rows.map((r) => this.toInterface(r));
	}

	async getUserFish(user_id: number, fish_id: number): Promise<UserFish> {
		const row = await this.repository.findOne(user_id, fish_id);
		if (!row) throw new NotFoundException('User fish link not found');
		return this.toInterface(row);
	}

	async updateUserFish(user_id: number, fish_id: number, dto: UpdateUserFishDto): Promise<UserFish> {
		const existing = await this.repository.findOne(user_id, fish_id);
		if (!existing) throw new NotFoundException('User fish link not found');
		
		const updated = await this.repository.update(user_id, fish_id, dto);
		return this.toInterface(updated);
	}

	async unlinkUserFish(user_id: number, fish_id: number): Promise<void> {
		await this.repository.unlink(user_id, fish_id);
	}

	private toInterface(row: any): UserFish {
		return {
			user_id: row.user_id,
			fish_id: row.fish_id,
			origin: row.origin,
			size: row.size,
			weight: row.weight,
			is_favorite: row.is_favorite,
		};
	}
}
