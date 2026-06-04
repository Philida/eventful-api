import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { EventsService } from './events.service';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CREATOR')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  create(
    @Request() req,
    @Body() dto: CreateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventsService.createEvent(
      req.user.sub,
      dto,
      file,
    );
  }

  @Get()
  findAll(
    @Query() query: QueryEventsDto,
  ) {
    return this.eventsService.findAll(
      query,
    );
  }

  @Get('top-rated')
topRatedEvents() {
  return this.eventsService.topRatedEvents();
}

@Get('my-events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CREATOR')
getMyEvents(@Request() req) {
  return this.eventsService.getMyEvents(
    req.user.sub,
  );
}

@Get('recommended')
@UseGuards(JwtAuthGuard)
getRecommendedEvents(
  @Request() req,
) {
  return this.eventsService.getRecommendedEvents(
    req.user.sub,
  );
}

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CREATOR')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(
      id,
      req.user.sub,
      dto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CREATOR')
  remove(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.eventsService.deleteEvent(
      id,
      req.user.sub,
    );
  }
}