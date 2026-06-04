import {
  IsOptional,
  IsString,
  IsNumberString,
  IsEnum,
} from 'class-validator';

export enum EventCategory {
  TECHNOLOGY = 'TECHNOLOGY',
  BUSINESS = 'BUSINESS',
  MUSIC = 'MUSIC',
  SPORTS = 'SPORTS',
  EDUCATION = 'EDUCATION',
}

export class QueryEventsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}