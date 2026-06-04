import { IsUUID } from 'class-validator';

export class InitializePaymentDto {
  @IsUUID()
  ticketId!: string;
}