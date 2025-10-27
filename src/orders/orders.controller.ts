import { Controller, Post, Get, Param, Body, Patch, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Public } from 'src/tools/decorators/public.decorator';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Roles } from 'src/tools/decorators/roles.decorator';
import { Action } from 'src/tools/abilities/ability.factory';
import { CreateOrderDto, UpdateOrderStatusDto } from './dtos/orders.dtos';

@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post()
  @CheckPolicies({ action: Action.Create, subject: 'Order' })
	create(@Body() dto: CreateOrderDto, @Request() req) {
    if (req.user.role === 'user' && req.user.id != dto.user_id) {
      // If the user is not an admin and is trying to access another user's account
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

		return this.ordersService.createOrder(dto);
	}

	@Public()
	@Get(':order_id')
  @CheckPolicies({ action: Action.Read, subject: 'Order' })
	async getById(@Param('order_id') order_id: string, @Request() req) {
		const order = await this.ordersService.getOrderById(order_id);
    if (!order) throw new NotFoundException('Order not found');

    if (req.user.role === 'user' && req.user.id != order.user.user_id) {
      // If the user is not an admin and is trying to access another user's account
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return order;
	}

	@Get('user/:user_id')
  @CheckPolicies({ action: Action.Read, subject: 'Order' })
	listByUser(@Param('user_id') user_id: string, @Request() req) {
		if (req.user.role === 'user' && req.user.id != user_id) {
			// If the user is not an admin and is trying to access another user's account
			throw new ForbiddenException(
				'You do not have permission to access this resource',
			);
		}
		return this.ordersService.listOrdersByUser(user_id);
	}

	@Patch(':order_id/status')
	@Roles('admin')
	updateStatus(@Param('order_id') order_id: string, @Body() dto: UpdateOrderStatusDto) {
		return this.ordersService.updateOrderStatus(order_id, dto);
	}

		@Patch(':order_id/cancel')
		@CheckPolicies({ action: Action.Update, subject: 'Order' })
		async cancel(@Param('order_id') order_id: string, @Request() req) {
			const order = await this.ordersService.getOrderById(order_id);
			if (!order) throw new NotFoundException('Order not found');

			if (req.user.role === 'user' && req.user.id != order.user.user_id) {
				throw new ForbiddenException('You do not have permission to access this resource');
			}

			return this.ordersService.cancelOrder(order_id);
		}
}
