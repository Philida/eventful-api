import { IsUUID } from 'class-validator';

export class ScanTicketDto {
  @IsUUID()
  ticketId!: string;
}