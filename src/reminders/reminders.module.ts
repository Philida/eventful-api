import { Module } from '@nestjs/common';

import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { ReminderProcessorService } from './reminder-processor/reminder-processor.service';

import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
  ],
  controllers: [RemindersController],
  providers: [
    RemindersService,
    ReminderProcessorService,
  ],
})
export class RemindersModule {}