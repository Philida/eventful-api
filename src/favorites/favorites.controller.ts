import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { FavoritesService } from './favorites.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth('bearer')
@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post(':eventId')
  @UseGuards(JwtAuthGuard)
  addFavorite(
    @Param('eventId')
    eventId: string,

    @Request()
    req,
  ) {
    return this.favoritesService.addFavorite(
      req.user.sub,
      eventId,
    );
  }

  @Get('my-favorites')
  @UseGuards(JwtAuthGuard)
  getMyFavorites(
    @Request()
    req,
  ) {
    return this.favoritesService.getMyFavorites(
      req.user.sub,
    );
  }
}