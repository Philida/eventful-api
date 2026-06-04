import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../email/email.service';
@Injectable()
export class ReminderProcessorService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  @Cron('* * * * *')
  async handleReminders() {
    console.log('Checking reminders...');

    const now = new Date();

    const reminders =
      await this.prisma.reminder.findMany({
        where: {
          remindAt: {
            lte: now,
          },
        },
        include: {
          user: true,
          event: true,
        },
      });

    for (const reminder of reminders) {
      await this.emailService.sendTestEmail(
        reminder.user.email,
        `Reminder: ${reminder.event.title}`,
        `
          <h1>Event Reminder</h1>

          <p>Hello ${reminder.user.name},</p>

          <p>
            This is a reminder for the event
            <strong>${reminder.event.title}</strong>.
          </p>

          <p>
            Location: ${reminder.event.location}
          </p>

          <p>
            Date: ${reminder.event.eventDate}
          </p>

          <p>See you there!</p>
        `,
      );

      await this.prisma.reminder.delete({
        where: {
          id: reminder.id,
        },
      });

      console.log(
        `Reminder sent to ${reminder.user.email}`,
      );
    }
  }
}