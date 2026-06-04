import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createReminder(
    userId: string,
    dto: CreateReminderDto,
  ) {
    const event =
      await this.prisma.event.findUnique({
        where: {
          id: dto.eventId,
        },
      });

    if (!event) {
      throw new BadRequestException(
        'Event not found',
      );
    }

    return this.prisma.reminder.create({
      data: {
        userId,
        eventId: dto.eventId,
        remindAt: new Date(dto.remindAt),
      },
    });
  }

  async getUserReminders(userId: string) {
    return this.prisma.reminder.findMany({
      where: {
        userId,
      },
      include: {
        event: true,
      },
    });
  }
}