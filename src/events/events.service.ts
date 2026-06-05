import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { QueryEventsDto } from './dto/query-events.dto';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createEvent(
    creatorId: string,
    dto: CreateEventDto,
    file?: Express.Multer.File,
  ) {
    let imageUrl: string | null = null;

    if (file) {
      imageUrl =
        await this.cloudinaryService.uploadImage(
          file.path,
        );
    }

    return this.prisma.event.create({
      data: {
        ...dto,
        eventDate: new Date(dto.eventDate),
        creatorId,
        imageUrl,
      },
    });
  }

  async findAll(query: QueryEventsDto) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.search) {
    where.title = {
      contains: query.search,
      mode: 'insensitive',
    };
  }

  if (query.location) {
    where.location = {
      contains: query.location,
      mode: 'insensitive',
    };
  }

  if (query.category) {
  where.category = query.category;
}

  const events =
    await this.prisma.event.findMany({
      where,
      skip,
      take: limit,
      include: {
  creator: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
}
    });

  const total =
    await this.prisma.event.count({
      where,
    });

  return {
    page,
    limit,
    total,
    data: events,
  };
}

  async findOne(id: string) {
  const event =
    await this.prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

  if (!event) {
    throw new NotFoundException(
      'Event not found',
    );
  }

  return event;
}

  async updateEvent(
    eventId: string,
    userId: string,
    dto: any,
  ) {
    const event =
      await this.prisma.event.findUnique({
        where: { id: eventId },
      });

    if (!event) {
      throw new NotFoundException(
        'Event not found',
      );
    }

    if (event.creatorId !== userId) {
      throw new ForbiddenException(
        'You do not own this event',
      );
    }

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...dto,
        eventDate: dto.eventDate
          ? new Date(dto.eventDate)
          : undefined,
      },
    });
  }

  async deleteEvent(
    eventId: string,
    userId: string,
  ) {
    const event =
      await this.prisma.event.findUnique({
        where: { id: eventId },
      });

    if (!event) {
      throw new NotFoundException(
        'Event not found',
      );
    }

    if (event.creatorId !== userId) {
      throw new ForbiddenException(
        'You do not own this event',
      );
    }

    await this.prisma.event.delete({
      where: { id: eventId },
    });

    return {
      message:
        'Event deleted successfully',
    };
  }

  async topRatedEvents() {
  const events =
    await this.prisma.event.findMany({
      include: {
        reviews: true,
      },
    });

  return events
    .map((event) => {
      const reviewCount =
        event.reviews.length;

      const averageRating =
        reviewCount > 0
          ? event.reviews.reduce(
              (sum, review) =>
                sum + review.rating,
              0,
            ) / reviewCount
          : 0;

      return {
        id: event.id,
        title: event.title,
        imageUrl: event.imageUrl,
        averageRating,
        reviewCount,
      };
    })
    .sort(
      (a, b) =>
        b.averageRating -
        a.averageRating,
    );
}
  async getMyEvents(userId: string) {
    const events =
      await this.prisma.event.findMany({
        where: {
          creatorId: userId,
        },
        include: {
          tickets: true,
          reviews: true,
        },
      });

    return events.map((event) => {
      const reviewCount =
        event.reviews.length;

      const averageRating =
        reviewCount > 0
          ? event.reviews.reduce(
              (sum, review) =>
                sum + review.rating,
              0,
            ) / reviewCount
          : 0;

      return {
        id: event.id,
        title: event.title,
        imageUrl: event.imageUrl,
        ticketPrice: event.ticketPrice,
        ticketsSold:
          event.tickets.length,
        reviewCount,
        averageRating,
      };
    });
  }

  async getRecommendedEvents(
    userId: string,
  ) {
    const favorites =
      await this.prisma.favorite.findMany({
        where: {
          userId,
        },
        include: {
          event: true,
        },
      });

    const categories = [
  ...new Set(
    favorites.map(
      (favorite) =>
        favorite.event.category,
    ),
  ),
];

    if (categories.length === 0) {
      return this.prisma.event.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return this.prisma.event.findMany({
      where: {
        category: {
          in: categories,
        },
        NOT: {
          favorites: {
            some: {
              userId,
            },
          },
        },
      },
      take: 10,
    });
  }
}

