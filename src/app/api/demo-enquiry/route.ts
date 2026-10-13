export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const DEMO_LEADS_FILE = path.join(process.cwd(), 'src', 'data', 'demo_enquiries.json');
const ADMIN_EMAIL = process.env.ADMIN_CLAIM_EMAIL || 'ptdevkaushik104@gmail.com';

export interface DemoEnquiryRecord {
  id: string;
  name: string;
  contact: string;
  schoolName: string;
  address: string;
  note?: string;
  source?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'scheduled' | 'closed';
}

function readDemoLeads(): { leads: DemoEnquiryRecord[] } {
  try {
    if (fs.existsSync(DEMO_LEADS_FILE)) {
      return JSON.parse(fs.readFileSync(DEMO_LEADS_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Error reading demo leads file:', err);
  }
  return { leads: [] };
}

function writeDemoLeads(data: { leads: DemoEnquiryRecord[] }) {
  try {
    const dir = path.dirname(DEMO_LEADS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DEMO_LEADS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing demo leads file:', err);
  }
}

async function sendDemoNotificationEmail(lead: DemoEnquiryRecord) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  if (!host || !user || !pass) {
    return false;
  }

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
      <div style="background: #023858; padding: 20px 24px; border-radius: 12px; margin-bottom: 24px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 700;">🚀 New Demo Enquiry Lead</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Center for Scientific Exploration and Experiential Learning (CSEEL)</p>
      </div>

      <div style="margin-bottom: 24px;">
        <p style="margin: 0 0 16px; font-size: 14px; color: #334155;">
          A new school representative has requested a <strong>CSEEL Experiential Lab Demo</strong>.
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 35%;">Applicant Name:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">${lead.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Contact (Phone/Email):</td>
            <td style="padding: 10px 0; color: #023858; font-weight: 700;">${lead.contact}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">School / Institution:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">${lead.schoolName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Address / Location:</td>
            <td style="padding: 10px 0; color: #334155;">${lead.address}</td>
          </tr>
          ${lead.note ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Requirements / Note:</td>
            <td style="padding: 10px 0; color: #334155; font-style: italic;">${lead.note}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Requested At:</td>
            <td style="padding: 10px 0; color: #334155;">${new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
          </tr>
        </table>
      </div>

      <div style="padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
        <a href="tel:${lead.contact.replace(/[^0-9+]/g, '')}" style="display: inline-block; background: #005689; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 999px; font-weight: 700; font-size: 13px;">
          Call Contact Number
        </a>
      </div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"CSEEL Demo Leads" <${user}>`,
      to: ADMIN_EMAIL,
      subject: `🔔 Demo Enquiry: ${lead.schoolName} - ${lead.name}`,
      html: htmlContent,
    });
    return true;
  } catch (err) {
    console.warn('SMTP Demo Notification failed:', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contact, designation, schoolName, address, note, source } = body;

    if (!name?.trim() || !contact?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide Name and Contact.' },
        { status: 400 }
      );
    }

    const leadRecord: DemoEnquiryRecord = {
      id: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      contact: contact.trim(),
      schoolName: (schoolName || designation || 'General Institution').trim(),
      address: (address || 'Not specified').trim(),
      note: [
        designation ? `Designation: ${designation}` : null,
        note ? `Note: ${note}` : null
      ].filter(Boolean).join(' | '),
      source: source || 'Website Pop-up',
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // 1. Persist to local JSON data store
    const store = readDemoLeads();
    store.leads.unshift(leadRecord);
    writeDemoLeads(store);

    // 2. Insert into Supabase contact_messages for admin dashboard visibility
    try {
      const isEmail = leadRecord.contact.includes('@');
      await (supabase as any).from('contact_messages').insert({
        name: leadRecord.name,
        email: isEmail ? leadRecord.contact : 'not-provided@lead.cseel.org',
        phone: !isEmail ? leadRecord.contact : '',
        institution: leadRecord.schoolName,
        message: `Type: Demo Enquiry | Designation: ${designation || 'N/A'} | Address: ${leadRecord.address}\n\nNote: ${leadRecord.note || 'None'}\nSource: ${leadRecord.source}`,
      });
    } catch (dbErr) {
      console.warn('Supabase contact_messages insert failed (offline/fallback):', dbErr);
    }

    // 3. Dispatch Email notification to Admin
    sendDemoNotificationEmail(leadRecord).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Demo inquiry submitted successfully! Our team will contact you shortly.',
      leadId: leadRecord.id,
    });
  } catch (err: any) {
    console.error('Demo inquiry submission error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

import { isAuthorizedAdmin } from '@/lib/auth/adminAuth';

export async function GET(req: NextRequest) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin authorization required to view leads.' },
        { status: 401 }
      );
    }
    const store = readDemoLeads();
    return NextResponse.json({ success: true, count: store.leads.length, leads: store.leads });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
