import {
  Controller,
  Post,
  Param,
  Request,
  Patch,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard)
  @Post('purchase/:eventId')
  purchaseTicket(
    @Param('eventId')
    eventId: string,

    @Request()
    req,
  ) {
    return this.ticketsService.purchaseTicket(
      req.user.sub,
      eventId,
    );
  }

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard)
  @Patch('scan/:ticketId')
  scanTicket(
    @Param('ticketId')
    ticketId: string,
  ) {
    return this.ticketsService.scanTicket(ticketId);
  }
}