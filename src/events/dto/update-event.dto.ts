import {
  IsOptional,
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

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ticketPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalTickets?: number;

  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;
}