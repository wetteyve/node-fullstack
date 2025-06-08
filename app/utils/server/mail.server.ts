import { createTransport } from 'nodemailer';

type MailClient = 'yves' | 'uht';

export const createTransporter = (mailClient: MailClient) =>
  createTransport({
    host: 'mail.cyon.ch',
    port: 465,
    secure: true,
    auth: {
      user: process.env[`EMAIL_${mailClient.toUpperCase()}`],
      pass: process.env[`EMAIL_${mailClient.toUpperCase()}_KEY`],
    },
  });
