import { IsUUID } from 'class-validator';

export class BuyTicketDto {
  @IsUUID()
  eventId!: string;
}