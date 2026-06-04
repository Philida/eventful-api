import {
  Controller,
  Post,
  Param,
  Request,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { TicketsService } from './tickets.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @Post('purchase/:eventId')
  @UseGuards(JwtAuthGuard)
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

  @Patch('scan/:ticketId')
  @UseGuards(JwtAuthGuard)
  scanTicket(
    @Param('ticketId')
    ticketId: string,
  ) {
    return this.ticketsService.scanTicket(ticketId);
  }
}