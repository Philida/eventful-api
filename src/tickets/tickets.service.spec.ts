import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          TicketsService,
          {
            provide: PrismaService,
            useValue: {},
          },
          {
            provide: EmailService,
            useValue: {},
          },
        ],
      }).compile();

    service =
      module.get<TicketsService>(
        TicketsService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});