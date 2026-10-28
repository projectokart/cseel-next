import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content?: any;
    path?: string;
    contentType?: string;
  }>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Returns a configured Nodemailer transporter.
 * Prioritizes direct Gmail App Password SMTP for instant, unsandboxed delivery to all recipient domains.
 */
export function getEmailTransporter() {
  const gmailUser = process.env.SMTP_USER;
  const gmailPass = process.env.SMTP_PASS;

  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }

  const host = process.env.SES_SMTP_HOST || 'email-smtp.ap-southeast-2.amazonaws.com';
  const port = Number(process.env.SES_SMTP_PORT) || 587;
  const user = process.env.SES_SMTP_USER;
  const pass = process.env.SES_SMTP_PASS;

  if (!user || !pass) {
    console.warn('[mailerService] SMTP credentials not configured.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
}

export function getDefaultFrom(): string {
  const name = process.env.MAIL_FROM_NAME || 'CSEEL Security & Verification';
  const email = process.env.SMTP_USER || process.env.MAIL_FROM_EMAIL || 'ptdevkaushik104@gmail.com';
  return `"${name}" <${email}>`;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const transporter = getEmailTransporter();
  if (!transporter) {
    return {
      success: false,
      error: 'SMTP credentials missing. Please configure SMTP_USER and SMTP_PASS in environment variables.',
    };
  }

  const from = options.from || getDefaultFrom();
  const replyTo = options.replyTo || process.env.SMTP_USER || 'ptdevkaushik104@gmail.com';

  try {
    const info = await transporter.sendMail({
      from,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      replyTo,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]+>/g, ' '),
      html: options.html,
      attachments: options.attachments,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('[mailerService] Failed to send email:', error);
    return {
      success: false,
      error: error?.message || 'Unknown SMTP error',
    };
  }
}
