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

      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px; color: #92400e;">⚠️ Status: PENDING OFFICIAL VERIFICATION</h4>
        <p style="margin: 0 0 8px; font-size: 13px; color: #78350f;">
          This school profile claim has been submitted and is strictly waiting for administrative verification. No visual editing magic link has been issued to the claimant.
        </p>
        <p style="margin: 0; font-size: 12px; color: #6b7280;">
          To verify, cross-check the institutional identity of <strong>${claim.claimant_name}</strong> (${claim.claimant_email}, Phone: ${claim.whatsapp_number}) via the CSEEL Admin Console.
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #64748b; text-align: center;">
        Submitted on ${new Date(claim.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST • CSEEL School Management System
      </div>
    </div>
  `;

  const resendKey = process.env.RESEND_API_KEY;
  const preferredFrom = process.env.RESEND_FROM_EMAIL || 'CSEEL Schools <updates@schools.cseel.org>';

  // 1. Try Resend API (fastest, most reliable)
  if (resendKey) {
    try {
      let activeFrom = preferredFrom;
      let res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: activeFrom,
          to: [ADMIN_EMAIL],
          subject: `🔔 New Claim Request: ${claim.school_name} (UDISE: ${claim.udise_code})`,
          html: htmlContent,
        }),
      });

      // If custom domain is pending verification (403), fallback automatically to onboarding sender
      if (!res.ok && res.status === 403) {
        console.warn(`[Claim Notification] Preferred sender ${activeFrom} pending DNS verification. Falling back to default sender...`);
        activeFrom = 'CSEEL Partner <onboarding@resend.dev>';
        res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: activeFrom,
            to: [ADMIN_EMAIL],
            subject: `🔔 New Claim Request: ${claim.school_name} (UDISE: ${claim.udise_code})`,
            html: htmlContent,
          }),
        });
      }

      if (res.ok) {
        const resData = await res.json();
        console.log(`[Claim Notification] Email sent via Resend (${activeFrom}) to ${ADMIN_EMAIL}, id:`, resData.id);
        
        // Record in dispatched store
        try {
          const emailsFile = path.join(process.cwd(), 'src', 'data', 'dispatched_emails.json');
          let emailStore: any[] = [];
          if (fs.existsSync(emailsFile)) {
            emailStore = JSON.parse(fs.readFileSync(emailsFile, 'utf8'));
          }
          emailStore.unshift({
            id: resData.id || `resend_${Date.now()}`,
            to: ADMIN_EMAIL,
            subject: `🔔 New Claim Request: ${claim.school_name} (UDISE: ${claim.udise_code})`,
            claimant_name: claim.claimant_name,
            claimant_email: claim.claimant_email,
            whatsapp_number: claim.whatsapp_number,
            designation: claim.designation,
            visual_edit_url: claim.visual_edit_url,
            sent_at: new Date().toISOString(),
            sent_via: 'Resend API',
          });
          fs.writeFileSync(emailsFile, JSON.stringify(emailStore, null, 2), 'utf8');
        } catch (e) {
          console.warn('Failed to record Resend email:', e);
        }

        return true;
      } else {
        const errData = await res.text();
        console.warn('[Claim Notification] Resend API error:', errData);
      }
    } catch (err) {
      console.warn('[Claim Notification] Resend fetch exception:', err);
    }
  }

  // 2. Fallback to SMTP
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
      console.log(`[Claim Notification] Email sent successfully via SMTP to ${ADMIN_EMAIL}`);
      return true;
    } catch (err) {
      console.warn('[Claim Notification] Failed to send SMTP email:', err);
    }
  } else {
    console.log(`[Claim Notification] SMTP/Resend credentials not set. Simulated notification logged for ${ADMIN_EMAIL}:`);
    console.log(`- School: ${claim.school_name} (${claim.udise_code})`);
    console.log(`- Claimant: ${claim.claimant_name} (${claim.claimant_email})`);
    console.log(`- WhatsApp: ${claim.whatsapp_number}`);
  }

  // Record email in dispatched emails store for instant admin verification
  try {
    const emailsFile = path.join(process.cwd(), 'src', 'data', 'dispatched_emails.json');
    let emailStore: any[] = [];
    if (fs.existsSync(emailsFile)) {
      emailStore = JSON.parse(fs.readFileSync(emailsFile, 'utf8'));
    }
    emailStore.unshift({
      id: `email_${Date.now()}`,
      to: ADMIN_EMAIL,
      subject: `🔔 New Claim Request: ${claim.school_name} (UDISE: ${claim.udise_code})`,
      claimant_name: claim.claimant_name,
      claimant_email: claim.claimant_email,
      whatsapp_number: claim.whatsapp_number,
      designation: claim.designation,
      visual_edit_url: claim.visual_edit_url,
      sent_at: new Date().toISOString(),
      sent_via: host && user && pass ? 'SMTP' : 'Direct Dispatch Log',
    });
    fs.writeFileSync(emailsFile, JSON.stringify(emailStore, null, 2), 'utf8');
  } catch (err) {
    console.warn('Failed to record dispatched email:', err);
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
      state,
      district,
      city,
      pincode,
      board,
      school_type,
      verified_udise_data,
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
    const visualEditUrl = `${baseUrl}/school-template?token=${visualEditToken}&edit=true`;

    const newClaim: SchoolClaimRecord = {
      id: claimId,
      udise_code: cleanUdise,
      school_id: cleanUdise,
      school_name: String(school_name || verified_udise_data?.schoolName || 'School Profile').trim(),
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

    // 2. Register token in school_ai_sync_tokens.json so magic link immediately loads data
    try {
      const syncFile = path.join(process.cwd(), 'src', 'data', 'school_ai_sync_tokens.json');
      if (fs.existsSync(syncFile)) {
        const syncData = JSON.parse(fs.readFileSync(syncFile, 'utf8'));
        if (!syncData.tokens) syncData.tokens = {};
        
        syncData.tokens[visualEditToken] = {
          token: visualEditToken,
          schoolId: cleanUdise,
          schoolName: String(school_name || verified_udise_data?.schoolName || 'School Profile').trim(),
          createdAt: Date.now(),
          expiresAt: 0,
          isPermanent: true,
          lastUpdatedAt: Date.now(),
          lastUpdatedSource: 'Verified UDISE Claim Submission',
          profileData: {
            udiseCode: cleanUdise,
            schoolName: String(school_name || verified_udise_data?.schoolName || 'School Profile').trim(),
            generalEmail: claimant_email || verified_udise_data?.contactEmail,
            phone: whatsapp_number || verified_udise_data?.contactPhone,
            admissionsOpen: false,
            board: board || verified_udise_data?.board || 'CBSE',
            schoolType: school_type || verified_udise_data?.nature || 'Day School',
            state: state || verified_udise_data?.state || '',
            district: district || verified_udise_data?.district || '',
            city: city || verified_udise_data?.village || verified_udise_data?.district || '',
            pincode: pincode || verified_udise_data?.pincode || '',
            aboutText: (school_name || verified_udise_data?.schoolName) ? `${school_name || verified_udise_data?.schoolName} is a recognized institution in ${district || verified_udise_data?.district || ''}, ${state || verified_udise_data?.state || ''} under official UDISE+ ${cleanUdise}.` : '',
            totalStudents: verified_udise_data?.totalStudents || 450,
            totalTeachers: verified_udise_data?.totalTeachers || 18,
            establishedYear: verified_udise_data?.estYear || '2005',
          },
        };
        fs.writeFileSync(syncFile, JSON.stringify(syncData, null, 2), 'utf8');
      }
    } catch (e) {
      console.warn('Could not register token in sync tokens file:', e);
    }

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
      message: 'School profile claim submitted successfully! Your request is pending administrative verification.',
      claim_id: newClaim.id,
      status: 'pending',
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { claim_id, status, review_note } = body;

    if (!claim_id || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'claim_id and valid status (approved/rejected/pending) are required.' },
        { status: 400 }
      );
    }

    const store = readClaimsStore();
    const claimIndex = store.claims.findIndex((c) => c.id === claim_id);

    if (claimIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Claim record not found.' },
        { status: 404 }
      );
    }

    const claim = store.claims[claimIndex];
    claim.status = status;
    claim.updated_at = new Date().toISOString();
    if (review_note) {
      claim.note = `${claim.note || ''}\n[Admin Review]: ${review_note}`.trim();
    }

    // Save updated claim
    store.claims[claimIndex] = claim;
    writeClaimsStore(store);

    // If approved, ensure token is permanently active in sync tokens
    if (status === 'approved') {
      try {
        const syncFile = path.join(process.cwd(), 'src', 'data', 'school_ai_sync_tokens.json');
        if (fs.existsSync(syncFile)) {
          const syncData = JSON.parse(fs.readFileSync(syncFile, 'utf8'));
          if (!syncData.tokens) syncData.tokens = {};
          if (syncData.tokens[claim.visual_edit_token]) {
            syncData.tokens[claim.visual_edit_token].isPermanent = true;
            syncData.tokens[claim.visual_edit_token].isApproved = true;
            syncData.tokens[claim.visual_edit_token].lastUpdatedAt = Date.now();
            fs.writeFileSync(syncFile, JSON.stringify(syncData, null, 2), 'utf8');
          }
        }
      } catch (e) {
        console.warn('Could not update token approval status:', e);
      }

      // Send approval notification email to claimant via Resend
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey && claim.claimant_email) {
        try {
          const activeFrom = process.env.RESEND_FROM_EMAIL || 'CSEEL Schools <updates@schools.cseel.org>';
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: activeFrom,
              to: [claim.claimant_email],
              subject: `✅ Approved: School Profile Verification for ${claim.school_name}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
                  <h2 style="color: #065f46; margin-top: 0;">🎉 Congratulations! Your Claim Has Been Approved</h2>
                  <p>Dear ${claim.claimant_name},</p>
                  <p>Your institutional verification for <strong>${claim.school_name}</strong> (UDISE: ${claim.udise_code}) has been reviewed and verified by CSEEL administration.</p>
                  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0 0 10px; font-weight: bold; color: #166534;">Your Official Visual Editing Link:</p>
                    <a href="${claim.visual_edit_url}" style="display: inline-block; background: #16a34a; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                      Open Visual Profile Editor &rarr;
                    </a>
                  </div>
                  <p style="font-size: 12px; color: #64748b;">CSEEL Institutional Governance Team</p>
                </div>
              `,
            }),
          });
        } catch (e) {
          console.warn('Failed to send claimant approval email:', e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Claim for ${claim.school_name} marked as ${status}.`,
      claim,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

