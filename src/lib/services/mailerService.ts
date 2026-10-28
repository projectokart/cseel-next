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
 * Prioritizes authenticated AWS SES on mailer.cseel.org for 100% DKIM/SPF compliance.
 */
export function getEmailTransporter() {
  const sesUser = process.env.SES_SMTP_USER;
  const sesPass = process.env.SES_SMTP_PASS;

  if (sesUser && sesPass) {
    return nodemailer.createTransport({
      host: process.env.SES_SMTP_HOST || 'email-smtp.ap-southeast-2.amazonaws.com',
      port: Number(process.env.SES_SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: sesUser,
        pass: sesPass,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
  }

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

  console.warn('[mailerService] SMTP credentials not configured.');
  return null;
}

export function getDefaultFrom(): string {
  const name = process.env.MAIL_FROM_NAME || 'CSEEL Security & Verification';
  const email = process.env.MAIL_FROM_EMAIL || 'auth@mailer.cseel.org';
  return `"${name}" <${email}>`;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const transporter = getEmailTransporter();
  if (!transporter) {
    return {
      success: false,
      error: 'SMTP credentials missing. Please configure SES_SMTP_USER and SES_SMTP_PASS in environment variables.',
    };
  }

  const from = options.from || getDefaultFrom();
  const replyTo = options.replyTo || process.env.MAIL_REPLY_TO || 'auth@mailer.cseel.org';

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
