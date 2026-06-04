import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  initialize(
    @Body() dto: InitializePaymentDto,
  ) {
    return this.paymentsService.initializePayment(
      dto.ticketId,
    );
  }

  @Get('verify/:reference')
  @UseGuards(JwtAuthGuard)
  verify(
    @Param('reference') reference: string,
  ) {
    return this.paymentsService.verifyPayment(
      reference,
    );
  }
}