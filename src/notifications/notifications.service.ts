import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createNotification(
    userId: string,
    message: string,
    eventId?: string,
  ) {
    return this.prisma.notification.create({
      data: {
        message,
        userId,
        eventId,
      },
    });
  }

  async getMyNotifications(
    userId: string,
  ) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        event: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(
    notificationId: string,
  ) {
    const notification =
      await this.prisma.notification.findUnique({
        where: {
          id: notificationId,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    return this.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
  }
}