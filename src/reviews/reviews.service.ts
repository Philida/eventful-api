import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createReview(
    userId: string,
    eventId: string,
    dto: CreateReviewDto,
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

const existingReview =
  await this.prisma.review.findFirst({
    where: {
      userId,
      eventId,
    },
  });

if (existingReview) {
  throw new BadRequestException(
    'You have already reviewed this event',
  );
}

return this.prisma.review.create({
  data: {
    rating: dto.rating,
    comment: dto.comment,
    userId,
    eventId,
  },
  include: {
    user: true,
  },
});
  }

  async getEventReviews(
    eventId: string,
  ) {
    const reviews =
      await this.prisma.review.findMany({
        where: {
          eventId,
        },
        include: {
          user: true,
        },
      });

    const aggregate =
      await this.prisma.review.aggregate({
        where: {
          eventId,
        },
        _avg: {
          rating: true,
        },
      });

    return {
      averageRating:
        aggregate._avg.rating || 0,
      totalReviews: reviews.length,
      reviews,
    };
  }
}