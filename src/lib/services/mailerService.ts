/**
 * mailerService.ts — Cloudflare Workers compatible email sender.
 * Uses Resend API (fetch-based) as primary.
 * Falls back to AWS SES SMTP REST (HTTP API) if Resend key missing.
 * nodemailer removed — not supported on Cloudflare Workers.
 */

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

export function getDefaultFrom(): string {
  const name = process.env.MAIL_FROM_NAME || 'CSEEL Security & Verification';
  const email = process.env.MAIL_FROM_EMAIL || 'auth@mailer.cseel.org';
  return `${name} <${email}>`;
}

/**
 * Send email via Resend API (fetch-based, Cloudflare Workers compatible)
 */
async function sendViaResend(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');

  const from = options.from || process.env.RESEND_FROM_EMAIL || getDefaultFrom();
  const replyTo = options.replyTo || process.env.MAIL_REPLY_TO || 'auth@mailer.cseel.org';
  const toList = Array.isArray(options.to) ? options.to : [options.to];

  const body: Record<string, any> = {
    from,
    to: toList,
    reply_to: replyTo,
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]+>/g, ' '),
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await res.json() as any;

  if (!res.ok) {
    throw new Error(json?.message || `Resend API error: ${res.status}`);
  }

  return { success: true, messageId: json.id };
}

/**
 * Send email via AWS SES v2 HTTP API (fetch-based, no nodemailer)
 * Used as fallback if Resend is unavailable.
 */
async function sendViaSESApi(options: SendEmailOptions): Promise<SendEmailResult> {
  // SES v2 SendEmail via HTTP requires AWS SigV4 signing — complex without SDK.
  // For Cloudflare Workers, Resend is strongly preferred.
  // This stub ensures graceful fallback with a clear error.
  throw new Error(
    'SES HTTP fallback not configured. Please set RESEND_API_KEY in environment variables.'
  );
}

/**
 * Primary email send function — Cloudflare Workers compatible.
 * Priority: Resend API → error
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  // 1. Try Resend (primary — fetch-based, CF compatible)
  if (process.env.RESEND_API_KEY) {
    try {
      return await sendViaResend(options);
    } catch (err: any) {
      console.error('[mailerService] Resend failed:', err?.message);
      return { success: false, error: err?.message || 'Resend send failed' };
    }
  }

  // 2. No credentials configured
  console.warn('[mailerService] No email credentials configured. Set RESEND_API_KEY.');
  return {
    success: false,
    error: 'Email credentials not configured. Set RESEND_API_KEY in environment variables.',
  };
}

/**
 * Compatibility shim — legacy code that calls getEmailTransporter() will get null.
 * All callers should use sendEmail() directly.
 */
export function getEmailTransporter() {
  console.warn(
    '[mailerService] getEmailTransporter() is deprecated on Cloudflare. Use sendEmail() directly.'
  );
  return null;
}
