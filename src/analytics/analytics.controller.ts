import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AnalyticsService } from './analytics.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get('overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CREATOR')
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('my-events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CREATOR')
getMyEventsAnalytics(
  @Request() req,
) {
  return this.analyticsService.getMyEventsAnalytics(
    req.user.sub,
  );
}

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CREATOR')
  getEventAnalytics(
    @Param('eventId') eventId: string,
  ) {
    return this.analyticsService.getEventAnalytics(
      eventId,
    );
  }
}