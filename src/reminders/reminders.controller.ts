import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reminders')
export class RemindersController {
  constructor(
    private readonly remindersService: RemindersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createReminder(
    @Req() req,
    @Body() dto: CreateReminderDto,
  ) {
    return this.remindersService.createReminder(
      req.user.sub,
      dto,
    );
  }

  @Get('my-reminders')
  @UseGuards(JwtAuthGuard)
  getMyReminders(@Req() req) {
    return this.remindersService.getUserReminders(
      req.user.sub,
    );
  }
}