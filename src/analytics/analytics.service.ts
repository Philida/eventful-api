import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getOverview() {
    const totalEvents =
      await this.prisma.event.count();

    const totalTicketsSold =
      await this.prisma.ticket.count();

    const totalAttendees =
      await this.prisma.ticket.count({
        where: {
          isScanned: true,
        },
      });

    const payments =
      await this.prisma.payment.findMany({
        where: {
          status: 'SUCCESS',
        },
      });

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    return {
      totalEvents,
      totalTicketsSold,
      totalAttendees,
      totalRevenue,
    };
  }

  async getEventAnalytics(
    eventId: string,
  ) {
    const event =
      await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          tickets: {
            include: {
              payment: true,
            },
          },
        },
      });

    if (!event) {
      throw new Error(
        'Event not found',
      );
    }

    const ticketsSold =
      event.tickets.length;

    const ticketsScanned =
      event.tickets.filter(
        (ticket) => ticket.isScanned,
      ).length;

    const revenue =
      event.tickets.reduce(
        (sum, ticket) =>
          sum +
          (ticket.payment?.status ===
          'SUCCESS'
            ? ticket.payment.amount
            : 0),
        0,
      );

    return {
      eventId: event.id,
      eventTitle: event.title,
      ticketsSold,
      ticketsScanned,
      revenue,
    };
  }

  async getMyEventsAnalytics(
    creatorId: string,
  ) {
    const events =
      await this.prisma.event.findMany({
        where: {
          creatorId,
        },
        include: {
          tickets: {
            include: {
              payment: true,
            },
          },
          reviews: true,
        },
      });

    const totalEvents =
      events.length;

    const totalTicketsSold =
      events.reduce(
        (sum, event) =>
          sum + event.tickets.length,
        0,
      );

    const totalRevenue =
      events.reduce(
        (sum, event) =>
          sum +
          event.tickets.reduce(
            (ticketSum, ticket) =>
              ticketSum +
              (ticket.payment?.status ===
              'SUCCESS'
                ? ticket.payment.amount
                : 0),
            0,
          ),
        0,
      );

    const allReviews =
      events.flatMap(
        (event) => event.reviews,
      );

    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0,
          ) / allReviews.length
        : 0;

    return {
      totalEvents,
      totalTicketsSold,
      totalRevenue,
      averageRating,
    };
  }
}