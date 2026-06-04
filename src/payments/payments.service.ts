import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async initializePayment(ticketId: string) {
    const ticket =
      await this.prisma.ticket.findUnique({
        where: {
          id: ticketId,
        },
        include: {
          user: true,
          payment: true,
        },
      });

    if (!ticket) {
      throw new BadRequestException(
        'Ticket not found',
      );
    }

    if (!ticket.payment) {
      throw new BadRequestException(
        'Payment record not found',
      );
    }

    const response = await firstValueFrom(
      this.httpService.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: ticket.user.email,
          amount: ticket.payment.amount * 100,
          reference: ticket.payment.reference,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        },
      ),
    );

    return response.data;
  }

  async verifyPayment(reference: string) {
    const response = await firstValueFrom(
      this.httpService.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        },
      ),
    );

    const paymentData = response.data;

    if (
  paymentData.data.status === 'success'
) {
  const payment =
    await this.prisma.payment.findUnique({
      where: {
        reference,
      },
    });

  if (
    payment &&
    payment.status !== 'SUCCESS'
  ) {
    await this.prisma.payment.update({
      where: {
        reference,
      },
      data: {
        status: 'SUCCESS',
        paidAt: new Date(
          paymentData.data.paid_at,
        ),
      },
    });
  }
}

    return paymentData;
  }
}