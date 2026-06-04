import { Test, TestingModule } from '@nestjs/testing';
import { ReminderProcessorService } from './reminder-processor.service';

describe('ReminderProcessorService', () => {
  let service: ReminderProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderProcessorService],
    }).compile();

    service = module.get<ReminderProcessorService>(ReminderProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
