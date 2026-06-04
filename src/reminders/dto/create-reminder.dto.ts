import {
  IsDateString,
  IsString,
} from 'class-validator';

export class CreateReminderDto {
  @IsString()
  eventId!: string;

  @IsDateString()
  remindAt!: string;
}