import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserFishServiceInterface, UserFish } from './interfaces/user_fish.interface';
import { LinkUserFishDto, UpdateUserFishDto } from './dtos/user_fish.dto';
import { UserFishRepository } from '../databases/repositories/user_fish/user_fish.repository';
import { UsersService } from 'src/users/user.service';
import { FishesService } from 'src/fishes/fishes.service';

@Injectable()
export class UserFishService implements UserFishServiceInterface {
	constructor(
		private readonly repository: UserFishRepository,
		private readonly usersService: UsersService,
		private readonly fishesService: FishesService
	) {}

	async linkUserFish(dto: LinkUserFishDto): Promise<UserFish> {
		// Check if user exists
		const user = await this.usersService.findOne(dto.user_id);
		if (!user) throw new NotFoundException('User not found');

		// Check if fish exists
		const fish = await this.fishesService.findById(dto.fish_id);
		if (!fish) throw new NotFoundException('Fish not found');

		const created = await this.repository.link(dto);
		if (!created) throw new BadRequestException('Failed to link user to fish');
		return this.toInterface(created);
	}

	async getUserFishes(user_id: number): Promise<UserFish[]> {
		const rows = await this.repository.findAllByUser(user_id);
		return rows.map((r) => this.toInterface(r));
	}

	async getUserFish(user_id: number, fish_id: number): Promise<UserFish> {
		const row = await this.repository.findByUserIdAndFishId(user_id, fish_id);
		if (!row) throw new NotFoundException('User fish link not found');
		return this.toInterface(row);
	}

	async updateUserFish(user_id: number, fish_id: number, dto: UpdateUserFishDto): Promise<UserFish> {
		const existing = await this.repository.findByUserIdAndFishId(user_id, fish_id);
		if (!existing) throw new NotFoundException('User fish link not found');
		
		const updated = await this.repository.update(user_id, fish_id, dto);
		return this.toInterface(updated);
	}

	async unlinkUserFish(id: number, req: any): Promise<void> {
		const userFish = await this.repository.findOneById(id);
		if (!userFish) throw new NotFoundException('User fish link not found');

		// Check user specific permission condition
        if (req.user.role != 'admin' && req.user.id != userFish.user_id) {
            // If the user is not an admin and is trying to access another user's account
            throw new ForbiddenException('You do not have permission to access this resource');
        }

		await this.repository.unlink(id);
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
