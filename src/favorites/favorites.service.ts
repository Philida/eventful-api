import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async addFavorite(
    userId: string,
    eventId: string,
  ) {
    const event =
      await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

    if (!event) {
      throw new BadRequestException(
        'Event not found',
      );
    }

    const existingFavorite =
      await this.prisma.favorite.findFirst({
        where: {
          userId,
          eventId,
        },
      });

    if (existingFavorite) {
      throw new BadRequestException(
        'Event already in favorites',
      );
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        eventId,
      },
    });
  }

  async getMyFavorites(
    userId: string,
  ) {
    return this.prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        event: true,
      },
    });
  }
}