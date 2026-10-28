export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const ENQUIRY_FILE = path.join(process.cwd(), 'src', 'data', 'school_website_enquiries.json');
const LIMITS_FILE = path.join(process.cwd(), 'src', 'data', 'enquiry_rate_limits.json');
const NOTIFICATION_EMAILS = ['dev@mailer.cseel.org', 'ptdevkaushik101@gmail.com'];
const SENDER_EMAIL = 'webdesign@mailer.cseel.org';
const REPLY_TO_EMAIL = 'webdesign@mailer.cseel.org';

export interface SchoolWebsiteEnquiry {
  id: string;
  school_name: string;
  person_name: string;
  email: string;
  contact_number: string;
  notes: string;
  template_name?: string;
  template_link?: string;
  ip: string;
  device_id: string;
  createdAt: string;
  source: string;
}

// ----------------------------------------------------
// Storage Helpers
// ----------------------------------------------------
function readEnquiries(): { enquiries: SchoolWebsiteEnquiry[] } {
  try {
    if (fs.existsSync(ENQUIRY_FILE)) {
      return JSON.parse(fs.readFileSync(ENQUIRY_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Error reading enquiries file:', err);
  }
  return { enquiries: [] };
}

function writeEnquiry(data: { enquiries: SchoolWebsiteEnquiry[] }) {
  try {
    const dir = path.dirname(ENQUIRY_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ENQUIRY_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing enquiries file:', err);
  }
}

interface RateLimitStore {
  ip_records: Record<string, number[]>;
  device_records: Record<string, number[]>;
}

function readRateLimits(): RateLimitStore {
  try {
    if (fs.existsSync(LIMITS_FILE)) {
      return JSON.parse(fs.readFileSync(LIMITS_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Error reading rate limits file:', err);
  }
  return { ip_records: {}, device_records: {} };
}

function writeRateLimits(data: RateLimitStore) {
  try {
    const dir = path.dirname(LIMITS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LIMITS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing rate limits file:', err);
  }
}

// ----------------------------------------------------
// Security & Validation Helpers
// ----------------------------------------------------
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

function checkMaliciousPayload(text: string): boolean {
  if (!text) return false;

  // SQL Injection patterns
  const sqlPatterns = [
    /(\bunion\s+(all\s+)?select\b)/i,
    /(\bselect\s+[\w\*\s,]+\s+from\b)/i,
    /(\binsert\s+into\s+[\w\.]+)/i,
    /(\bdrop\s+table\b)/i,
    /(\btruncate\s+table\b)/i,
    /(\balter\s+table\b)/i,
    /(\bdelete\s+from\b)/i,
    /(\bexec(ute)?\s*\()/i,
    /('|\")\s*(or|and)\s*('|\")?\d+('|\")?\s*=\s*('|\")?\d+/i,
    /('|\")\s*(or|and)\s+true\b/i,
    /(--\s*$|--\s*[\r\n]|;\s*--|;\s*drop|;\s*select|;\s*delete)/i,
    /(\/\*[\s\S]*?\*\/)/i,
    /(\bxp_cmdshell\b)/i,
  ];

  for (const pattern of sqlPatterns) {
    if (pattern.test(text)) return true;
  }

  // XSS & Script Execution patterns
  const xssPatterns = [
    /<script\b[\s\S]*?>/i,
    /<\/script>/i,
    /javascript\s*:/i,
    /vbscript\s*:/i,
    /<iframe\b[\s\S]*?>/i,
    /<embed\b[\s\S]*?>/i,
    /<object\b[\s\S]*?>/i,
    /<svg\b[\s\S]*?>/i,
    /\bonerror\s*=/i,
    /\bonload\s*=/i,
    /\bonclick\s*=/i,
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(text)) return true;
  }

  return false;
}

// ----------------------------------------------------
// Email Notification Dispatcher
// ----------------------------------------------------
async function sendEmailNotification(enquiry: SchoolWebsiteEnquiry) {
  const cleanPhone = enquiry.contact_number.replace(/[^0-9]/g, '').slice(-10);
  const waMessage = encodeURIComponent(
    'Hi Dev, I found you online on your website. Can you develop a modern CBSE/ICSE school website for our institution?'
  );
  const waUrl = `https://wa.me/91${cleanPhone}?text=${waMessage}`;

  const isMoreTemplatesRequest = Boolean(
    enquiry.template_name?.toLowerCase().includes('more') ||
    enquiry.template_name?.toLowerCase().includes('catalog') ||
    enquiry.notes?.toLowerCase().includes('more template') ||
    enquiry.notes?.toLowerCase().includes('catalog')
  );

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 2px solid #00AF90; border-radius: 16px; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #00AF90 0%, #141E28 100%); padding: 22px 26px; border-radius: 12px; margin-bottom: 24px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 21px; font-weight: 800;">
          ${isMoreTemplatesRequest ? '📁 User Requested 50+ More Templates Catalog!' : '🏫 New School Website Enquiry Received!'}
        </h2>
        <p style="margin: 6px 0 0; font-size: 13.5px; color: #A7F3D0;">D.S Sharma • School Website Specialist • New Delhi (+91 9050778830)</p>
      </div>

      ${
        isMoreTemplatesRequest
          ? `<div style="background: #FEF3C7; border: 2px solid #F59E0B; padding: 14px 18px; border-radius: 10px; margin-bottom: 20px; color: #92400E; font-size: 15px; font-weight: 800;">
              ⭐ USER DEMAND: The user has requested more school website templates / full 50+ templates catalog! Please send the catalog PDF & demo links immediately.
            </div>`
          : ''
      }

      <div style="margin-bottom: 24px;">
        <p style="margin: 0 0 16px; font-size: 15px; color: #1B2732; font-weight: 700;">
          ${isMoreTemplatesRequest ? 'A school representative has requested additional website design templates:' : 'A school administrator has submitted an official project enquiry:'}
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 14.5px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 35%;">School Name:</td>
            <td style="padding: 10px 0; color: #00AF90; font-weight: 900; font-size: 16px;">${enquiry.school_name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Contact Person:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 800;">${enquiry.person_name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Email Address:</td>
            <td style="padding: 10px 0; color: #008770; font-weight: 700;">
              <a href="mailto:${enquiry.email}" style="color: #008770; text-decoration: underline;">${enquiry.email}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Mobile / WhatsApp:</td>
            <td style="padding: 10px 0; color: #00AF90; font-weight: 800; font-size: 16px;">
              <a href="tel:${enquiry.contact_number}" style="color: #00AF90; text-decoration: none;">${enquiry.contact_number}</a>
              &nbsp;|&nbsp;
              <a href="${waUrl}" style="color: #25D366; text-decoration: none; font-weight: 800;">WhatsApp Lead &rarr;</a>
            </td>
          </tr>
          ${
            enquiry.template_name
              ? `
          <tr style="border-bottom: 1px solid #f1f5f9; background: #E6F7F4;">
            <td style="padding: 10px 8px; color: #008770; font-weight: 800;">Requested Item / Template:</td>
            <td style="padding: 10px 8px; color: #008770; font-weight: 800;">
              ${enquiry.template_name}
              ${enquiry.template_link ? `<br><a href="${enquiry.template_link}" target="_blank" style="color: #00AF90; font-size: 13px;">View Template Demo &rarr;</a>` : ''}
            </td>
          </tr>`
              : ''
          }
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600; vertical-align: top;">Notes / Requirements:</td>
            <td style="padding: 10px 0; color: #334155; line-height: 1.6;">${enquiry.notes}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">IP Address & Device:</td>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">IP: ${enquiry.ip} • Device ID: ${enquiry.device_id.slice(0, 16)}...</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Submitted At:</td>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
          </tr>
        </table>
      </div>

      <div style="background: #E6F7F4; padding: 14px 18px; border-radius: 10px; font-size: 13px; color: #008770; font-weight: 700;">
        💡 Direct Reply: You can reply directly to this email to reach the school at ${enquiry.email} (or contact via WhatsApp at +91 ${cleanPhone})
      </div>
    </div>
  `;

  const emailSubject = isMoreTemplatesRequest
    ? `📁 [CATALOG REQUEST] ${enquiry.school_name} - ${enquiry.person_name} (${enquiry.contact_number}) requested 50+ School Templates`
    : `🚨 [School Website Lead] ${enquiry.school_name} - ${enquiry.person_name} (${enquiry.contact_number})${enquiry.template_name ? ' [' + enquiry.template_name + ']' : ''}`;

  // 1. Brevo Transactional Email
  const brevoApiKey = process.env.BREVO_API_KEY || '';

  if (brevoApiKey) {
    try {
      const brevoPayload = {
        sender: { name: 'D.S Sharma • School Web Specialist', email: SENDER_EMAIL },
        to: NOTIFICATION_EMAILS.map((email) => ({ email, name: 'D.S Sharma' })),
        replyTo: { email: enquiry.email, name: enquiry.person_name },
        subject: emailSubject,
        htmlContent: htmlContent,
      };

      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify(brevoPayload),
      });

      if (brevoRes.ok) {
        console.log('[school-website-enquiry] Delivered via Brevo API');
        return true;
      }
    } catch (brevoErr) {
      console.warn('[school-website-enquiry] Brevo error, trying Gmail SMTP:', brevoErr);
    }
  }

  // 2. Gmail SMTP Fallback
  try {
    const gmailUser = process.env.GMAIL_SMTP_USER || process.env.SMTP_USER;
    const gmailPass = process.env.GMAIL_SMTP_PASS || process.env.SMTP_PASS;

    if (gmailUser && gmailPass) {
      const gmailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

    await gmailTransporter.sendMail({
      from: `"D.S Sharma • School Web Specialist" <${SENDER_EMAIL}>`,
      to: NOTIFICATION_EMAILS,
      replyTo: enquiry.email,
      subject: emailSubject,
      html: htmlContent,
    });

    console.log('[school-website-enquiry] Delivered successfully via Gmail SMTP');
      return true;
    }
    return false;
  } catch (err) {
    console.error('[school-website-enquiry] Email delivery error:', err);
    return false;
  }
}

// ----------------------------------------------------
// Main POST Handler
// ----------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      school_name,
      person_name,
      email,
      contact_number,
      notes,
      template_name,
      template_link,
      device_id,
      website_hp, // Honeypot anti-spam
    } = body;

    // 1. Anti-bot honeypot check (hidden field)
    if (website_hp) {
      console.warn('[Security] Bot trapped via honeypot field');
      return NextResponse.json({ error: 'Spam submission detected.' }, { status: 400 });
    }

    const clientIp = getClientIp(req);
    const resolvedDeviceId = String(device_id || `fallback_${clientIp}`).trim();

    // 2. Rate Limiting: IP (Max 10 per day) & Device ID (Max 5 per week)
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const rateLimits = readRateLimits();

    // Clean old records
    const ipTimestamps = (rateLimits.ip_records[clientIp] || []).filter((t) => t > oneDayAgo);
    const deviceTimestamps = (rateLimits.device_records[resolvedDeviceId] || []).filter((t) => t > oneWeekAgo);

    if (ipTimestamps.length >= 10) {
      return NextResponse.json(
        {
          error:
            'Daily submission limit reached (Maximum 10 enquiries allowed per day from your IP). Please contact D.S Sharma directly on WhatsApp or Call: +91 9050778830.',
        },
        { status: 429 }
      );
    }

    if (deviceTimestamps.length >= 5) {
      return NextResponse.json(
        {
          error:
            'Weekly submission limit reached (Maximum 5 enquiries allowed per week from your device). Please reach out directly on WhatsApp or Call: +91 9050778830.',
        },
        { status: 429 }
      );
    }

    // 3. Compulsory Fields Presence Check
    if (!school_name || !person_name || !email || !contact_number || !notes) {
      return NextResponse.json(
        {
          error:
            'All fields are compulsory. Please provide School Name, Contact Person Name, Email Address, Contact Number, and Project Notes.',
        },
        { status: 400 }
      );
    }

    const cleanSchoolName = String(school_name).trim();
    const cleanPersonName = String(person_name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const rawContact = String(contact_number).trim();
    const cleanContact = rawContact.replace(/[^0-9]/g, '').slice(-10);
    const cleanNotes = String(notes).trim();

    // 4. Input Length & Format Validations
    if (cleanSchoolName.length < 2 || cleanSchoolName.length > 120) {
      return NextResponse.json(
        { error: 'School Name must be between 2 and 120 characters.' },
        { status: 400 }
      );
    }

    if (cleanPersonName.length < 2 || cleanPersonName.length > 60) {
      return NextResponse.json(
        { error: 'Contact Person Name must be between 2 and 60 characters.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid official email address (e.g. principal@school.edu.in).' },
        { status: 400 }
      );
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanContact)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian Mobile / WhatsApp number (starts with 6-9).' },
        { status: 400 }
      );
    }

    // 5. Notes Word Count Check (Max 150 words)
    const words = cleanNotes.split(/\s+/).filter(Boolean);
    if (words.length > 150) {
      return NextResponse.json(
        {
          error: `Project notes exceed the maximum limit of 150 words (current: ${words.length} words). Please summarize concisely.`,
        },
        { status: 400 }
      );
    }
    if (words.length < 2) {
      return NextResponse.json(
        { error: 'Please describe your project requirements in at least 2-3 words.' },
        { status: 400 }
      );
    }

    // 6. Security Check: SQL Injection & Malicious Script Injection
    const fieldsToInspect = [cleanSchoolName, cleanPersonName, cleanEmail, rawContact, cleanNotes];
    for (const field of fieldsToInspect) {
      if (checkMaliciousPayload(field)) {
        console.warn('[Security] Malicious payload pattern detected from IP:', clientIp);
        return NextResponse.json(
          {
            error:
              'Invalid characters or suspicious code pattern detected. Please enter legitimate plain text only.',
          },
          { status: 400 }
        );
      }
    }

    // 7. Update Rate Limits for IP and Device ID
    ipTimestamps.push(now);
    deviceTimestamps.push(now);
    rateLimits.ip_records[clientIp] = ipTimestamps;
    rateLimits.device_records[resolvedDeviceId] = deviceTimestamps;
    writeRateLimits(rateLimits);

    // 8. Create & Save Enquiry
    const newEnquiry: SchoolWebsiteEnquiry = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      school_name: cleanSchoolName,
      person_name: cleanPersonName,
      email: cleanEmail,
      contact_number: cleanContact,
      notes: cleanNotes,
      template_name: template_name ? String(template_name).trim() : undefined,
      template_link: template_link ? String(template_link).trim() : undefined,
      ip: clientIp,
      device_id: resolvedDeviceId,
      createdAt: new Date().toISOString(),
      source: 'D.S Sharma School Portfolio',
    };

    const existing = readEnquiries();
    existing.enquiries.unshift(newEnquiry);
    writeEnquiry(existing);

    // 9. Dispatch Email Notification
    sendEmailNotification(newEnquiry).catch((e) => console.error('Background email failed:', e));

    const isMoreReq = Boolean(
      newEnquiry.template_name?.toLowerCase().includes('more') ||
      newEnquiry.template_name?.toLowerCase().includes('catalog') ||
      newEnquiry.notes?.toLowerCase().includes('more template') ||
      newEnquiry.notes?.toLowerCase().includes('catalog')
    );

    return NextResponse.json({
      success: true,
      message: isMoreReq
        ? 'Request for 50+ More School Templates received successfully! D.S Sharma will send the complete catalog and contact your WhatsApp/Phone (+91 ' + cleanContact + ') within 2 hours.'
        : 'Enquiry received successfully! D.S Sharma will contact your WhatsApp/Phone (+91 ' + cleanContact + ') within 2 hours.',
      id: newEnquiry.id,
      selected_template: newEnquiry.template_name || null,
      is_more_templates: isMoreReq,
    });
  } catch (err: any) {
    console.error('Error in school-website-enquiry:', err);
    return NextResponse.json({ error: 'Server error processing enquiry.' }, { status: 500 });
  }
}

export async function GET() {
  const data = readEnquiries();
  return NextResponse.json(data);
}
