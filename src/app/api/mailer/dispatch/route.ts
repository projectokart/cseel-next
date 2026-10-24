import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

function getTransporter() {
  const host = process.env.SES_SMTP_HOST || process.env.SMTP_HOST || 'email-smtp.ap-southeast-2.amazonaws.com';
  const port = Number(process.env.SES_SMTP_PORT || process.env.SMTP_PORT) || 587;
  const user = process.env.SES_SMTP_USER || process.env.SMTP_USER;
  const pass = process.env.SES_SMTP_PASS || process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: true },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });
}

// GET: Check SMTP Connection Status
export async function GET() {
  const transporter = getTransporter();
  if (!transporter) {
    return NextResponse.json({
      status: 'error',
      message: 'SMTP credentials not found in environment (SES_SMTP_USER / SES_SMTP_PASS)',
      ready: false,
    }, { status: 500 });
  }

  try {
    await transporter.verify();
    return NextResponse.json({
      status: 'ready',
      message: 'AWS SES SMTP is fully connected & authenticated',
      host: process.env.SES_SMTP_HOST || 'email-smtp.ap-southeast-2.amazonaws.com',
      from: process.env.MAIL_FROM_EMAIL || 'resume@mailer.cseel.org',
      replyTo: process.env.MAIL_REPLY_TO || 'resume@mailer.cseel.org',
      ready: true,
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      message: err?.message || 'SMTP Authentication failed',
      ready: false,
    }, { status: 500 });
  }
}

// POST: Dispatch a single personalized email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { to, subject, html, text, fromName, replyTo, metadata } = body;

    if (!to || typeof to !== 'string' || !to.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or missing recipient email address',
      }, { status: 400 });
    }

    if (!subject || !html) {
      return NextResponse.json({
        success: false,
        error: 'Missing subject or html content',
      }, { status: 400 });
    }

    const transporter = getTransporter();
    if (!transporter) {
      return NextResponse.json({
        success: false,
        error: 'AWS SES SMTP credentials not configured in environment',
      }, { status: 500 });
    }

    const senderEmail = process.env.MAIL_FROM_EMAIL || 'resume@mailer.cseel.org';
    const senderDisplayName = fromName || process.env.MAIL_FROM_NAME || 'CSEEL Resumes & Faculty Network';
    const effectiveReplyTo = replyTo || process.env.MAIL_REPLY_TO || 'resume@mailer.cseel.org';

    // Anti-spam & professional deliverability headers
    const headers: Record<string, string> = {
      'X-Mailer': 'CSEEL-Desktop-Resume-Engine/1.0',
      'List-Unsubscribe': `<mailto:${effectiveReplyTo}?subject=Unsubscribe>`,
      'Precedence': 'bulk',
    };

    const cleanPlainText = text || html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                                     .replace(/<[^>]+>/g, ' ')
                                     .replace(/\s{2,}/g, ' ')
                                     .trim();

    const info = await transporter.sendMail({
      from: `"${senderDisplayName}" <${senderEmail}>`,
      to: to.trim(),
      replyTo: effectiveReplyTo,
      subject,
      html,
      text: cleanPlainText,
      headers,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      to: to.trim(),
      timestamp: new Date().toISOString(),
      metadata,
    });
  } catch (error: any) {
    const errorMsg = error?.message || 'Unknown SMTP Error';
    let failureCategory = 'UNKNOWN';

    if (errorMsg.includes('MessageRejected') || errorMsg.includes('not verified')) {
      failureCategory = 'SANDBOX_RESTRICTED_OR_VERIFICATION_REQUIRED';
    } else if (errorMsg.includes('550') || errorMsg.includes('User unknown') || errorMsg.includes('does not exist')) {
      failureCategory = 'HARD_BOUNCE_INVALID_MAILBOX';
    } else if (errorMsg.includes('Throttling') || errorMsg.includes('Rate exceeded')) {
      failureCategory = 'RATE_LIMIT_THROTTLED';
    }

    return NextResponse.json({
      success: false,
      error: errorMsg,
      category: failureCategory,
      code: error?.code,
      responseCode: error?.responseCode,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
