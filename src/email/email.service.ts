import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendTestEmail(
    to: string,
    subject: string,
    html: string,
  ) {
    try {
      console.log(
        'EMAIL USER:',
        process.env.EMAIL_USER,
      );

      const transporter =
        nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

      const info =
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to,
          subject,
          html,
        });

      console.log(
        'Email sent:',
        info.messageId,
      );

      return info;
    } catch (error) {
      console.error(
        'EMAIL ERROR:',
        error,
      );

      throw error;
    }
  }
}