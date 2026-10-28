import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getEmailTransporter, getDefaultFrom } from '@/lib/services/mailerService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const transporter = getEmailTransporter();
  const configured = !!transporter;

  return NextResponse.json({
    status: 'ok',
    service: 'AWS SES Mailer',
    subdomain: 'mailer.cseel.org',
    defaultFrom: getDefaultFrom(),
    smtpHost: process.env.SMTP_HOST || 'email-smtp.ap-south-1.amazonaws.com',
    smtpPort: Number(process.env.SMTP_PORT) || 587,
    isConfigured: configured,
    instructions: configured
      ? 'SMTP credentials detected. POST to this endpoint with { "to": "your-email@example.com" } to send a test email.'
      : 'Please add SMTP_USER and SMTP_PASS generated from AWS SES SMTP Settings to .env.local',
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('x-admin-key');
    const secretKey = process.env.ADMIN_SECRET_KEY || process.env.CRON_SECRET;

    if (!secretKey || (authHeader !== `Bearer ${secretKey}` && authHeader !== secretKey)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin key required to dispatch test emails' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const to = body.to || process.env.ADMIN_CLAIM_EMAIL || 'ptdevkaushik104@gmail.com';

    const result = await sendEmail({
      to,
      subject: '✅ AWS SES Test: resumes@mailer.cseel.org',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #005689;">AWS SES Setup Verified!</h2>
          <p>This email was successfully sent from <strong>resumes@mailer.cseel.org</strong> via AWS SES SMTP.</p>
          <ul>
            <li><strong>Subdomain:</strong> mailer.cseel.org</li>
            <li><strong>Sender:</strong> ${getDefaultFrom()}</li>
            <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
          </ul>
        </div>
      `,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      recipient: to,
      from: getDefaultFrom(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
