import {
  IsString,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';

import { Type } from 'class-transformer';

export enum EventCategory {
  TECHNOLOGY = 'TECHNOLOGY',
  BUSINESS = 'BUSINESS',
  MUSIC = 'MUSIC',
  SPORTS = 'SPORTS',
  EDUCATION = 'EDUCATION',
}

export class CreateEventDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  location!: string;

  @IsDateString()
  eventDate!: string;

  @Type(() => Number)
  @IsNumber()
  ticketPrice!: number;

  @Type(() => Number)
  @IsNumber()
  totalTickets!: number;

  @IsEnum(EventCategory)
  category!: EventCategory;
}