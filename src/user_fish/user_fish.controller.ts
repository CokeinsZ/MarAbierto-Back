import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Post, Put, Request } from '@nestjs/common';
import { UserFishService } from './user_fish.service';
import { LinkUserFishDto, UpdateUserFishDto } from './dtos/user_fish.dto';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';

@Controller('user-fish')
export class UserFishController {
	constructor(private readonly service: UserFishService) {}

	@Post()
	@CheckPolicies({ action: Action.Create, subject: 'UserFish' })
	link(@Body() dto: LinkUserFishDto, @Request() req) {
		//Check user specific permission condition
        if (req.user.role != 'admin' && req.user.id != dto.user_id) {
            // If the user is not an admin and is trying to access another user's account
            throw new ForbiddenException('You do not have permission to access this resource');
        }
        
        return this.service.linkUserFish(dto);
	}

	// Get all fishes for a user
	@Get(':user_id')
	getAll(@Param('user_id', ParseIntPipe) user_id: number) {
		return this.service.getUserFishes(user_id);
	}

	// Get specific fish for a user
	@Get(':user_id/fish/:fish_id')
	@CheckPolicies({ action: Action.Read, subject: 'UserFish' })
	getOne(
		@Param('user_id', ParseIntPipe) user_id: number,
		@Param('fish_id', ParseIntPipe) fish_id: number,
	) {
		return this.service.getUserFish(user_id, fish_id);
	}

	// Update link
	@Put(':user_id/fish/:fish_id')
	@CheckPolicies({ action: Action.Update, subject: 'UserFish' })
	update(
		@Param('user_id', ParseIntPipe) user_id: number,
		@Param('fish_id', ParseIntPipe) fish_id: number,
		@Body() dto: UpdateUserFishDto,
		@Request() req
	) {
		// Check user specific permission condition
        if (req.user.role != 'admin' && req.user.id != user_id) {
            // If the user is not an admin and is trying to access another user's account
            throw new ForbiddenException('You do not have permission to access this resource');
        }

		return this.service.updateUserFish(user_id, fish_id, dto);
	}

	// Delete link
	@Delete(':user_id/fish/:fish_id')
	@CheckPolicies({ action: Action.Delete, subject: 'UserFish' })
	unlink(
		@Param('user_id', ParseIntPipe) user_id: number,
		@Param('fish_id', ParseIntPipe) fish_id: number,
		@Request() req
	) {
		// Check user specific permission condition
        if (req.user.role != 'admin' && req.user.id != user_id) {
            // If the user is not an admin and is trying to access another user's account
            throw new ForbiddenException('You do not have permission to access this resource');
        }

		return this.service.unlinkUserFish(user_id, fish_id);
	}
}
