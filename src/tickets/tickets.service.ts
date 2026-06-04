import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';
import { EmailService } from '../email/email.service';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async purchaseTicket(
    userId: string,
    eventId: string,
  ) {
    const event =
      await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

    if (!event) {
      throw new BadRequestException(
        'Event not found',
      );
    }

    const soldTickets =
      await this.prisma.ticket.count({
        where: {
          eventId,
        },
      });

    if (
      soldTickets >= event.totalTickets
    ) {
      throw new BadRequestException(
        'Event is sold out',
      );
    }

    const qrCode =
      await QRCode.toDataURL(
        `${userId}-${eventId}-${Date.now()}`,
      );

    const ticket =
  await this.prisma.ticket.create({
    data: {
      userId,
      eventId,
      qrCode,
    },
    include: {
      user: true,
      event: true,
    },
  });

await this.emailService.sendTestEmail(
  ticket.user.email,
  `Your Ticket for ${ticket.event.title}`,
  `
    <h1>Ticket Confirmation</h1>

    <p>Hello ${ticket.user.name},</p>

    <p>
      Your ticket for
      <strong>${ticket.event.title}</strong>
      has been created.
    </p>

    <p>
      Location:
      ${ticket.event.location}
    </p>

    <p>
      Date:
      ${ticket.event.eventDate}
    </p>

    <p>
      Ticket ID:
      ${ticket.id}
    </p>

    <p>
      Your QR Code:
    </p>

    <img
      src="${ticket.qrCode}"
      width="250"
    />
  `,
);

return ticket;
  }

  async scanTicket(
  ticketId: string,
) {
  const ticket =
    await this.prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });

  if (!ticket) {
    throw new BadRequestException(
      'Ticket not found',
    );
  }

  if (ticket.isScanned) {
    throw new BadRequestException(
      'Ticket already scanned',
    );
  }

  return this.prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      isScanned: true,
    },
  });
}
}