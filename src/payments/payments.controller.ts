import { Controller, Post, Get, Patch, Param, Body, Req, Request, ForbiddenException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Public } from 'src/tools/decorators/public.decorator';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Roles } from 'src/tools/decorators/roles.decorator';
import { Action } from 'src/tools/abilities/ability.factory';
import { CreatePaymentDto, ChangePaymentStatusDto } from './dtos/payment.dto';

@Controller('payments')
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentsService) {}

	@Post()
	@CheckPolicies({ action: Action.Create, subject: 'Payment' })
	@Roles('admin')
	create(@Body() dto: CreatePaymentDto) {
		return this.paymentsService.createPayment(dto);
	}

	@Public()
	@Get('order/:order_id')
  @CheckPolicies({ action: Action.Read, subject: 'Payment' })
	async getByOrder(@Param('order_id') order_id: string, @Request() req) {
		const [payment, user_id] = await this.paymentsService.getPaymentByOrderId(order_id);

    if (req.user.role === 'user' && req.user.id != user_id) {
      // If the user is not an admin and is trying to access another user's account
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
	}

	@Patch(':payment_id/status')
	@CheckPolicies({ action: Action.Update, subject: 'Payment' })
	@Roles('admin')
	updateStatus(@Param('payment_id') payment_id: string, @Body() dto: ChangePaymentStatusDto) {
		return this.paymentsService.updatePaymentStatus(payment_id, dto);
	}
}
