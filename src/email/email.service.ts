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
    const testAccount =
      await nodemailer.createTestAccount();

    const transporter =
      nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

    const info =
      await transporter.sendMail({
        from:
          '"Eventful" <no-reply@eventful.com>',
        to,
        subject,
        html,
      });

    console.log(
      'Preview URL:',
      nodemailer.getTestMessageUrl(info),
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