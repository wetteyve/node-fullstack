import { Resend } from 'resend';

type MailClient = 'yves' | 'uht';

export const createResend = (mailClient: MailClient) => new Resend(process.env[`RESEND_${mailClient.toUpperCase()}`]);
