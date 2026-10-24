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
 * Returns a configured Nodemailer transporter for AWS SES or configured SMTP provider.
 */
export function getEmailTransporter() {
  const host = process.env.SES_SMTP_HOST || process.env.SMTP_HOST || 'email-smtp.ap-southeast-2.amazonaws.com';
  const port = Number(process.env.SES_SMTP_PORT || process.env.SMTP_PORT) || 587;
  const user = process.env.SES_SMTP_USER || process.env.SMTP_USER;
  const pass = process.env.SES_SMTP_PASS || process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('[mailerService] AWS SES SMTP credentials not configured (SES_SMTP_USER / SES_SMTP_PASS).');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587 (STARTTLS)
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
}

/**
 * Default sender formatted as "CSEEL Resumes <resumes@mailer.cseel.org>"
 */
export function getDefaultFrom(): string {
  const name = process.env.MAIL_FROM_NAME || 'CSEEL Resumes & Faculty Network';
  const email = process.env.MAIL_FROM_EMAIL || 'resume@mailer.cseel.org';
  return `"${name}" <${email}>`;
}

/**
 * Sends an email using AWS SES SMTP.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const transporter = getEmailTransporter();
  if (!transporter) {
    return {
      success: false,
      error: 'SMTP credentials missing. Please configure SMTP_USER and SMTP_PASS in environment variables.',
    };
  }

  const from = options.from || getDefaultFrom();
  const replyTo = options.replyTo || process.env.MAIL_REPLY_TO || 'resume@mailer.cseel.org';

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
    console.error('[mailerService] Failed to send email via AWS SES:', error);
    return {
      success: false,
      error: error?.message || 'Unknown SMTP error',
    };
  }
}

/**
 * Verified helper to send resume notifications / acknowledgements.
 */
export async function sendResumeNotification(params: {
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  subjectSpecialization?: string;
  resumeDownloadUrl?: string;
  message?: string;
}): Promise<SendEmailResult> {
  const adminEmail = process.env.ADMIN_CLAIM_EMAIL || 'ptdevkaushik104@gmail.com';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #005689 0%, #003c6e 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px; color: #ffffff;">
        <span style="display:inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 999px; margin-bottom: 8px;">
          resumes@mailer.cseel.org
        </span>
        <h2 style="margin: 0; font-size: 20px; font-weight: 800;">📄 New Faculty Resume Submission</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Centre for Science, Engineering and Experiential Learning (CSEEL)</p>
      </div>

      <div style="margin-bottom: 24px; color: #334155;">
        <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.5;">
          A new teacher / educator has submitted their resume on <strong>resumes.cseel.org</strong>:
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 35%;">Candidate Name:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">${params.candidateName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Email Address:</td>
            <td style="padding: 10px 0; color: #005689; font-weight: 700;">
              <a href="mailto:${params.candidateEmail}" style="color: #005689; text-decoration: none;">${params.candidateEmail}</a>
            </td>
          </tr>
          ${params.candidatePhone ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Phone / WhatsApp:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${params.candidatePhone}</td>
          </tr>` : ''}
          ${params.subjectSpecialization ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Subject / Domain:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${params.subjectSpecialization}</td>
          </tr>` : ''}
          ${params.resumeDownloadUrl ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Resume PDF / Link:</td>
            <td style="padding: 10px 0; font-weight: 600;">
              <a href="${params.resumeDownloadUrl}" target="_blank" style="color: #005689; text-decoration: underline;">View / Download Resume</a>
            </td>
          </tr>` : ''}
          ${params.message ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Note / Cover Letter:</td>
            <td style="padding: 10px 0; color: #334155; font-style: italic;">${params.message}</td>
          </tr>` : ''}
        </table>
      </div>

      <div style="padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
        <a href="mailto:${params.candidateEmail}?subject=${encodeURIComponent('CSEEL Faculty Network — Application Acknowledgement')}" 
           style="display: inline-block; background: #005689; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 999px; font-weight: 700; font-size: 13px;">
          Reply to Candidate
        </a>
      </div>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    replyTo: params.candidateEmail,
    subject: `📄 Resume Submission: ${params.candidateName} (${params.subjectSpecialization || 'Faculty'})`,
    html,
  });
}
