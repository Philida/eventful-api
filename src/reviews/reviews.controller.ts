import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
  ) {}

  @Post(':eventId')
  @UseGuards(JwtAuthGuard)
  createReview(
    @Req() req,
    @Param('eventId') eventId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(
      req.user.sub,
      eventId,
      dto,
    );
  }

  @Get(':eventId')
  getEventReviews(
    @Param('eventId') eventId: string,
  ) {
    return this.reviewsService.getEventReviews(
      eventId,
    );
  }
}