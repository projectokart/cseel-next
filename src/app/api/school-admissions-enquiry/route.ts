import { NextRequest, NextResponse } from 'next/server';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const ENQUIRIES_FILE = path.join(process.cwd(), 'src', 'data', 'school_admission_enquiries.json');
const DEFAULT_FALLBACK_EMAIL = process.env.ADMIN_CLAIM_EMAIL || 'ptdevkaushik104@gmail.com';

export interface AdmissionEnquiryRecord {
  id: string;
  udise_code: string;
  school_slug: string;
  school_name: string;
  applicant_name: string;
  phone_number: string;
  applying_class: string;
  email?: string;
  school_target_email: string;
  school_target_phone?: string;
  created_at: string;
  email_sent: boolean;
}

function readEnquiriesStore(): { enquiries: AdmissionEnquiryRecord[] } {
  try {
    if (fs.existsSync(ENQUIRIES_FILE)) {
      return JSON.parse(fs.readFileSync(ENQUIRIES_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Error reading enquiries store:', err);
  }
  return { enquiries: [] };
}

function writeEnquiriesStore(data: { enquiries: AdmissionEnquiryRecord[] }) {
  try {
    const dir = path.dirname(ENQUIRIES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing enquiries store:', err);
  }
}

async function sendAdmissionEnquiryEmail(enquiry: AdmissionEnquiryRecord) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
      <div style="background: #005689; padding: 20px 24px; border-radius: 12px; margin-bottom: 24px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px; font-weight: bold;">🎓 New Admission Inquiry Received</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Center for Scientific Exploration and Experiential Learning (CSEEL)</p>
      </div>

      <div style="margin-bottom: 20px;">
        <p style="margin: 0 0 16px; font-size: 14px; color: #334155;">
          A prospective student/parent has submitted an admission inquiry for <strong>${enquiry.school_name}</strong>.
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: bold; width: 40%;">Student / Parent Name:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: bold;">${enquiry.applicant_name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Contact Phone:</td>
            <td style="padding: 10px 0; color: #005689; font-weight: bold;">
              <a href="tel:${enquiry.phone_number}" style="color: #005689; text-decoration: none;">${enquiry.phone_number}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Applying For Class:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: bold;">${enquiry.applying_class}</td>
          </tr>
          ${enquiry.email ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Parent Email:</td>
            <td style="padding: 10px 0; color: #0f172a;">${enquiry.email}</td>
          </tr>
          ` : ''}
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: bold;">School Name:</td>
            <td style="padding: 10px 0; color: #0f172a;">${enquiry.school_name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-weight: bold;">UDISE Code:</td>
            <td style="padding: 10px 0; color: #0f172a; font-family: monospace;">${enquiry.udise_code || 'Verified'}</td>
          </tr>
        </table>
      </div>

      <div style="background: #edf5fa; border: 1px solid #d6edff; border-radius: 10px; padding: 14px; text-align: center; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 13px; color: #005689; font-weight: bold;">
          Direct Call Action: <a href="tel:${enquiry.phone_number}" style="color: #005689;">Call ${enquiry.phone_number}</a>
        </p>
      </div>

      <div style="font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 14px;">
        This email was automatically dispatched by CSEEL School Admissions Portal (https://cseel.org).
      </div>
    </div>
  `;

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      const recipientList = [enquiry.school_target_email];
      if (DEFAULT_FALLBACK_EMAIL && DEFAULT_FALLBACK_EMAIL !== enquiry.school_target_email) {
        recipientList.push(DEFAULT_FALLBACK_EMAIL);
      }

      await transporter.sendMail({
        from: `"CSEEL Admissions" <${user}>`,
        to: recipientList.join(', '),
        subject: `🎓 New Admission Inquiry: ${enquiry.applicant_name} (${enquiry.applying_class}) - ${enquiry.school_name}`,
        html: htmlContent,
      });

      return true;
    } catch (err) {
      console.error('SMTP email dispatch error in admission inquiry:', err);
      return false;
    }
  } else {
    console.log(`[Admission Inquiry Simulation] Email for ${enquiry.school_name} to ${enquiry.school_target_email}:`, {
      applicant: enquiry.applicant_name,
      phone: enquiry.phone_number,
      class: enquiry.applying_class,
    });
    return true;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      udiseCode = '',
      schoolSlug = '',
      schoolName = '',
      applicantName = '',
      phoneNumber = '',
      applyingClass = 'Nursery',
      email = '',
      schoolTargetEmail = '',
      schoolTargetPhone = '',
    } = body;

    if (!applicantName.trim() || !phoneNumber.trim()) {
      return NextResponse.json(
        { success: false, message: 'Applicant name and phone number are required.' },
        { status: 400 }
      );
    }

    const effectiveTargetEmail = (schoolTargetEmail && schoolTargetEmail.includes('@'))
      ? schoolTargetEmail.trim()
      : DEFAULT_FALLBACK_EMAIL;

    const record: AdmissionEnquiryRecord = {
      id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      udise_code: udiseCode,
      school_slug: schoolSlug,
      school_name: schoolName,
      applicant_name: applicantName.trim(),
      phone_number: phoneNumber.trim(),
      applying_class: applyingClass,
      email: email.trim() || undefined,
      school_target_email: effectiveTargetEmail,
      school_target_phone: schoolTargetPhone || undefined,
      created_at: new Date().toISOString(),
      email_sent: false,
    };

    // 1. Save to local JSON store
    const store = readEnquiriesStore();
    store.enquiries.unshift(record);
    writeEnquiriesStore(store);

    // 2. Also try inserting to Supabase if table exists
    try {
      await (schoolSearchSupabase as any).from('school_admission_enquiries').insert([
        {
          id: record.id,
          udise_code: record.udise_code,
          school_slug: record.school_slug,
          school_name: record.school_name,
          applicant_name: record.applicant_name,
          phone_number: record.phone_number,
          applying_class: record.applying_class,
          email: record.email,
          school_target_email: record.school_target_email,
          created_at: record.created_at,
        }
      ]);
    } catch (_) {
      // Graceful fallback to file store
    }

    // 3. Dispatch Email Notification
    const sent = await sendAdmissionEnquiryEmail(record);
    record.email_sent = sent;
    writeEnquiriesStore(store);

    return NextResponse.json({
      success: true,
      message: 'Admission enquiry submitted successfully and notification sent to school admissions desk.',
      enquiryId: record.id,
      dispatchedTo: effectiveTargetEmail,
    });
  } catch (error: any) {
    console.error('API /api/school-admissions-enquiry error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
