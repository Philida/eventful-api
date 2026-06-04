import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get('my-notifications')
  @UseGuards(JwtAuthGuard)
  getMyNotifications(
    @Request() req,
  ) {
    return this.notificationsService.getMyNotifications(
      req.user.sub,
    );
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(
    @Param('id') id: string,
  ) {
    return this.notificationsService.markAsRead(
      id,
    );
  }

  @Get('test')
  @UseGuards(JwtAuthGuard)
  async createTestNotification(
    @Request() req,
  ) {
    return this.notificationsService.createNotification(
      req.user.sub,
      'Welcome to Eventful Notifications!',
    );
  }
}