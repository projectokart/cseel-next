import { NextRequest, NextResponse } from 'next/server';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_CLAIM_EMAIL || 'ptdevkaushik104@gmail.com';
const CLAIMS_FILE = path.join(process.cwd(), 'src', 'data', 'school_claims.json');

export interface SchoolClaimRecord {
  id: string;
  udise_code: string;
  school_id: string;
  school_name: string;
  claimant_name: string;
  claimant_email: string;
  whatsapp_number: string;
  designation: string;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  visual_edit_token: string;
  visual_edit_url: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

function readClaimsStore(): { claims: SchoolClaimRecord[] } {
  try {
    if (fs.existsSync(CLAIMS_FILE)) {
      return JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Error reading claims store:', err);
  }
  return { claims: [] };
}

function writeClaimsStore(data: { claims: SchoolClaimRecord[] }) {
  try {
    const dir = path.dirname(CLAIMS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CLAIMS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing claims store:', err);
  }
}

// Helper to send email notification to admin
async function sendAdminNotificationEmail(claim: SchoolClaimRecord) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="background: #005689; padding: 18px 24px; border-radius: 8px; margin-bottom: 24px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">🔔 New School Profile Claim Request</h2>
        <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Center for Scientific Exploration and Experiential Learning (CSEEL)</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #0f172a; border-bottom: 2px solid #005689; padding-bottom: 6px; margin-top: 0;">School Information</h3>
        <p style="margin: 6px 0;"><strong>School Name:</strong> ${claim.school_name}</p>
        <p style="margin: 6px 0;"><strong>UDISE Code:</strong> ${claim.udise_code}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #0f172a; border-bottom: 2px solid #005689; padding-bottom: 6px;">Claimant Details</h3>
        <p style="margin: 6px 0;"><strong>Full Name:</strong> ${claim.claimant_name}</p>
        <p style="margin: 6px 0;"><strong>Official Email:</strong> <a href="mailto:${claim.claimant_email}">${claim.claimant_email}</a></p>
        <p style="margin: 6px 0;"><strong>WhatsApp Number:</strong> <a href="https://wa.me/${claim.whatsapp_number.replace(/\D/g, '')}">${claim.whatsapp_number}</a></p>
        <p style="margin: 6px 0;"><strong>Designation / Role:</strong> ${claim.designation}</p>
        <p style="margin: 6px 0;"><strong>Verification Note:</strong></p>
        <div style="background: #f8fafc; border-left: 4px solid #005689; padding: 12px; border-radius: 4px; font-size: 13px; color: #334155;">
          ${claim.note || 'No additional note provided.'}
        </div>
      </div>

      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px; color: #065f46;">Generated Visual Editing Access Link:</h4>
        <p style="margin: 0 0 12px; font-size: 13px; color: #047857;">Clicking this link allows authorized visual editing of this school's public page:</p>
        <a href="${claim.visual_edit_url}" style="display: inline-block; background: #059669; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; font-size: 13px;" target="_blank">
          Open Visual Editor for ${claim.school_name} &rarr;
        </a>
        <p style="margin: 8px 0 0; font-size: 11px; color: #6b7280; word-break: break-all;">${claim.visual_edit_url}</p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #64748b; text-align: center;">
        Submitted on ${new Date(claim.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST • CSEEL School Management System
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

      await transporter.sendMail({
        from: `"CSEEL School Claims" <${user}>`,
        to: ADMIN_EMAIL,
        subject: `🔔 New Claim Request: ${claim.school_name} (UDISE: ${claim.udise_code})`,
        html: htmlContent,
      });
      console.log(`[Claim Notification] Email sent successfully to ${ADMIN_EMAIL}`);
      return true;
    } catch (err) {
      console.warn('[Claim Notification] Failed to send SMTP email:', err);
    }
  } else {
    console.log(`[Claim Notification] SMTP credentials not set. Simulated notification logged for ${ADMIN_EMAIL}:`);
    console.log(`- School: ${claim.school_name} (${claim.udise_code})`);
    console.log(`- Claimant: ${claim.claimant_name} (${claim.claimant_email})`);
    console.log(`- WhatsApp: ${claim.whatsapp_number}`);
    console.log(`- Visual Edit Link: ${claim.visual_edit_url}`);
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      school_name,
      udise_code,
      claimant_name,
      claimant_email,
      whatsapp_number,
      designation,
      note,
      user_id,
    } = body;

    const cleanUdise = String(udise_code || '').replace(/\D/g, '').trim();

    if (!cleanUdise || cleanUdise.length !== 11) {
      return NextResponse.json(
        { success: false, error: 'A valid 11-digit UDISE code is required.' },
        { status: 400 }
      );
    }

    if (!claimant_name || !claimant_email || !whatsapp_number) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and WhatsApp number are required fields.' },
        { status: 400 }
      );
    }

    const claimId = `claim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const visualEditToken = `csl_ai_magic_${cleanUdise}`;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const visualEditUrl = `${baseUrl}/edu-network/organisation/school?token=${visualEditToken}&edit=true`;

    const newClaim: SchoolClaimRecord = {
      id: claimId,
      udise_code: cleanUdise,
      school_id: cleanUdise,
      school_name: String(school_name || 'School Profile').trim(),
      claimant_name: String(claimant_name).trim(),
      claimant_email: String(claimant_email).trim().toLowerCase(),
      whatsapp_number: String(whatsapp_number).trim(),
      designation: String(designation || 'School Representative').trim(),
      note: String(note || '').trim(),
      status: 'pending',
      visual_edit_token: visualEditToken,
      visual_edit_url: visualEditUrl,
      created_at: new Date().toISOString(),
      user_id: user_id || null,
    };

    // 1. Save in local JSON store
    const store = readClaimsStore();
    store.claims.unshift(newClaim);
    writeClaimsStore(store);

    // 2. Try inserting into Supabase if table exists
    try {
      await schoolSearchSupabase
        .from('school_claims')
        .insert({
          id: newClaim.id,
          udise_code: newClaim.udise_code,
          school_name: newClaim.school_name,
          claimant_name: newClaim.claimant_name,
          claimant_email: newClaim.claimant_email,
          whatsapp_number: newClaim.whatsapp_number,
          designation: newClaim.designation,
          note: newClaim.note,
          status: newClaim.status,
          visual_edit_url: newClaim.visual_edit_url,
          created_at: newClaim.created_at,
          user_id: newClaim.user_id,
        });
    } catch (_) {
      // Table may not exist yet, local store is primary
    }

    // 3. Send email to admin
    await sendAdminNotificationEmail(newClaim);

    return NextResponse.json({
      success: true,
      message: '🎉 School profile claim submitted successfully! Verification details have been sent to administration.',
      claim: newClaim,
      visual_edit_url: visualEditUrl,
    });
  } catch (err: any) {
    console.error('Error submitting school claim:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error processing claim.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const udise = searchParams.get('udise');

    const store = readClaimsStore();
    let results = store.claims;

    if (udise) {
      const clean = udise.replace(/\D/g, '');
      results = results.filter((c) => c.udise_code === clean);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      claims: results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
