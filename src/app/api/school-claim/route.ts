import { NextRequest, NextResponse } from 'next/server';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import {
  checkRateLimitAndBots,
  sanitizePayloadDeep,
  generate16CharMixedMagicKey,
  isAdminRequest,
} from '@/lib/security/apiSecurityGuard';

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
  request_type?: 'claim' | 'add_school';
  status: 'pending' | 'approved' | 'rejected';
  magic_key?: string;
  visual_edit_token: string;
  visual_edit_url: string;
  verification_message?: string;
  created_at: string;
  updated_at?: string;
  approved_at?: string;
  user_id?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
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

function sanitizeInput(str: any): string {
  if (!str) return '';
  return String(str).replace(/[<>]/g, '').trim();
}

function slugifySegment(text: string, fallback: string): string {
  const cleaned = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || fallback;
}

// Build canonical school profile path from Supabase udise_private_schools row
async function resolveSchoolProfilePath(
  cleanUdise: string,
  fallbackName: string,
  fallbackState?: string,
  fallbackDistrict?: string,
  fallbackCity?: string
): Promise<string> {
  try {
    const { data: row } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('school_name, school_slug, state_name, district_name, village_name, village_ward, block_name')
      .eq('udise_code', cleanUdise)
      .maybeSingle();

    if (row) {
      const st = slugifySegment(row.state_name || fallbackState || 'delhi', 'delhi');
      const dt = slugifySegment(row.district_name || fallbackDistrict || 'new-delhi', 'new-delhi');
      const vl = slugifySegment(
        row.village_name || row.village_ward || row.block_name || fallbackCity || dt,
        dt
      );
      const baseSlug = slugifySegment(row.school_name || fallbackName, 'school');
      const sSlug = row.school_slug
        ? row.school_slug.endsWith(cleanUdise.toLowerCase())
          ? row.school_slug
          : `${row.school_slug}-${cleanUdise}`
        : `${baseSlug}-${cleanUdise}`;
      return `/school/${st}/${dt}/${vl}/${sSlug}`;
    }
  } catch {}

  const st = slugifySegment(fallbackState || 'delhi', 'delhi');
  const dt = slugifySegment(fallbackDistrict || 'new-delhi', 'new-delhi');
  const vl = slugifySegment(fallbackCity || dt, dt);
  const baseSlug = slugifySegment(fallbackName || 'school', 'school');
  return `/school/${st}/${dt}/${vl}/${baseSlug}-${cleanUdise}`;
}

// Strict Server-Side UDISE Verification with Government Central Database + Supabase Fallback
const UDISE_BASE_URL = 'https://kys.udiseplus.gov.in/web-app/api';
const UDISE_HEADERS = {
  'x-app-signature': '9f2c7a4b8e1d6c3f5a9b0e2d4f6a7c8b',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
};

async function verifyGovtUdiseRecord(
  cleanUdise: string
): Promise<{ valid: boolean; schoolName?: string; district?: string; state?: string; reason?: string }> {
  // 1. Check Supabase udise_private_schools first (fast & reliable)
  try {
    const { data: dbSchool } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('school_name, district_name, state_name')
      .eq('udise_code', cleanUdise)
      .maybeSingle();
    if (dbSchool && dbSchool.school_name) {
      return {
        valid: true,
        schoolName: dbSchool.school_name,
        district: dbSchool.district_name,
        state: dbSchool.state_name,
      };
    }
  } catch (_) {}

  // 2. Query official UDISE+ API
  try {
    const res = await fetch(`${UDISE_BASE_URL}/school/by-year?udiseSchCode=${cleanUdise}&action=1`, {
      headers: UDISE_HEADERS,
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const data = Array.isArray(json?.data) ? json.data[0] : json?.data;
      if (data && data.schoolName) {
        return {
          valid: true,
          schoolName: String(data.schoolName || '').trim(),
          district: String(data.districtName || '').trim(),
          state: String(data.stateName || '').trim(),
        };
      }
    }
  } catch {}

  return {
    valid: false,
    reason: `No official institution found under UDISE ${cleanUdise} in government or CSEEL database.`,
  };
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
        <h2 style="margin: 0; font-size: 20px;">🔔 New School ${claim.request_type === 'add_school' ? 'Registration' : 'Claim'} Request</h2>
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
        <h4 style="margin: 0 0 8px; color: #92400e;">⚠️ Status: PENDING ADMIN VERIFICATION</h4>
        <p style="margin: 0 0 8px; font-size: 13px; color: #78350f;">
          No Magic Link has been generated yet. Once you verify and approve this request in the Admin Console, a unique 16-character alphanumeric + special-character Magic Link will be created and stored permanently in Supabase.
        </p>
      </div>
    </div>
  `;

  const resendKey = process.env.RESEND_API_KEY;
  const preferredFrom = process.env.RESEND_FROM_EMAIL || 'CSEEL Schools <updates@schools.cseel.org>';

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
          subject: `🔔 New School ${claim.request_type === 'add_school' ? 'Add' : 'Claim'} Request: ${claim.school_name} (UDISE: ${claim.udise_code})`,
          html: htmlContent,
        }),
      });

      if (!res.ok && res.status === 403) {
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
            subject: `🔔 New School Claim Request: ${claim.school_name} (UDISE: ${claim.udise_code})`,
            html: htmlContent,
          }),
        });
      }
      if (res.ok) return true;
    } catch {}
  }

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
      return true;
    } catch {}
  }

  return false;
}

export async function POST(req: NextRequest) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_claim_submit',
    maxRequestsPerMinute: 15,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  try {
    const rawBody = await req.json().catch(() => ({}));
    const body = sanitizePayloadDeep(rawBody);

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
      request_type,
      verified_udise_data,
    } = body;

    // Strict Requirement: "bina login kuch bhi na ho" — User MUST be authenticated
    if (!user_id || !claimant_email) {
      return NextResponse.json(
        {
          success: false,
          error: 'AUTHENTICATION_REQUIRED',
          message: 'You must be logged in to claim or add a school profile.',
        },
        { status: 401 }
      );
    }

    let cleanUdise = String(udise_code || '').replace(/\D/g, '').trim();

    // If UDISE is not provided or incomplete, generate a temporary institutional code
    if (!cleanUdise || cleanUdise.length !== 11) {
      cleanUdise = `SCH${Date.now().toString().slice(-8)}`;
    }

    if (!claimant_name || !claimant_email || !whatsapp_number) {
      return NextResponse.json(
        { success: false, error: 'Name, official email, and contact number are required fields.' },
        { status: 400 }
      );
    }

    // Note: UDISE government verification is now inactive as requested (UDISE data is not guaranteed)

    const sanitizedName = sanitizeInput(claimant_name || 'School Representative');
    const sanitizedEmail = sanitizeInput(claimant_email).toLowerCase();
    const sanitizedPhone = sanitizeInput(whatsapp_number).replace(/[^\d+ -]/g, '');
    const sanitizedDesignation = sanitizeInput(designation || 'School Representative');
    const sanitizedNote = sanitizeInput(note);

    // ── STRICT DUPLICATE REQUEST CHECK (ONE SCHOOL ADD REQUEST PER USER) ──
    const existingStore = readClaimsStore();
    const duplicateClaim = existingStore.claims.find((c) => {
      const matchUser = user_id && String(c.user_id) === String(user_id);
      const matchEmail = c.claimant_email && c.claimant_email.toLowerCase() === sanitizedEmail;
      return (matchUser || matchEmail) && (c.status === 'pending' || c.status === 'approved');
    });

    if (duplicateClaim) {
      return NextResponse.json(
        {
          success: false,
          error: 'ALREADY_REQUESTED',
          message: `A school registration request (${duplicateClaim.school_name}) has already been submitted from this account. Each user can submit one request at a time.`,
          existing_claim: {
            id: duplicateClaim.id,
            school_name: duplicateClaim.school_name,
            status: duplicateClaim.status,
            created_at: duplicateClaim.created_at,
          },
        },
        { status: 409 }
      );
    }
    const resolvedSchoolName = sanitizeInput(
      school_name || verified_udise_data?.schoolName || 'School Profile'
    );
    const resolvedState = sanitizeInput(state || verified_udise_data?.state || 'DELHI');
    const resolvedDistrict = sanitizeInput(
      district || verified_udise_data?.district || 'NEW DELHI'
    );
    const resolvedCity = sanitizeInput(city || verified_udise_data?.village || resolvedDistrict);
    const resolvedPincode = sanitizeInput(pincode || verified_udise_data?.pincode || '');
    const resolvedBoard = sanitizeInput(board || verified_udise_data?.board || 'CBSE');
    const resolvedType = sanitizeInput(school_type || verified_udise_data?.nature || 'Day School');

    const claimId = `claim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // CRITICAL SECURITY RULE: Magic Link is NOT created until Admin verifies & approves!
    const newClaim: SchoolClaimRecord = {
      id: claimId,
      udise_code: cleanUdise,
      school_id: cleanUdise,
      school_name: resolvedSchoolName,
      claimant_name: sanitizedName,
      claimant_email: sanitizedEmail,
      whatsapp_number: sanitizedPhone,
      designation: sanitizedDesignation,
      note: sanitizedNote,
      request_type: request_type === 'add_school' || sanitizedNote.includes('[ADD SCHOOL') ? 'add_school' : 'claim',
      status: 'pending',
      magic_key: '', // Strictly empty until Admin approves
      visual_edit_token: '', // Strictly empty until Admin approves
      visual_edit_url: '', // Strictly empty until Admin approves
      created_at: new Date().toISOString(),
      user_id: String(user_id),
      state: resolvedState,
      district: resolvedDistrict,
      city: resolvedCity,
      pincode: resolvedPincode,
    };

    // 1. Ensure school exists in udise_private_schools if this is an Add School request
    const { data: existingUdise } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('udise_code')
      .eq('udise_code', cleanUdise)
      .maybeSingle();

    if (!existingUdise) {
      const slugBase = slugifySegment(resolvedSchoolName, 'school');
      await schoolSearchSupabase.from('udise_private_schools').upsert(
        {
          udise_code: cleanUdise,
          school_id: cleanUdise,
          school_name: resolvedSchoolName,
          school_slug: `${slugBase}-${cleanUdise}`,
          state_name: resolvedState,
          district_name: resolvedDistrict,
          village_name: resolvedCity,
          pincode: resolvedPincode,
          board_10th: resolvedBoard,
          board_12th: resolvedBoard,
          residential_school: resolvedType,
          phone: sanitizedPhone,
          email: sanitizedEmail,
          is_verified: false,
          admissions_open: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'udise_code' }
      );
    }

    // 2. Store pending claim permanently in Supabase school_profiles
    try {
      const { data: profRow } = await schoolSearchSupabase
        .from('school_profiles')
        .select('profile_data, is_claimed')
        .eq('udise_code', cleanUdise)
        .maybeSingle();

      const existingProfData =
        typeof profRow?.profile_data === 'string'
          ? JSON.parse(profRow.profile_data)
          : profRow?.profile_data || {};

      const prevRequests = Array.isArray(existingProfData.claimRequests)
        ? existingProfData.claimRequests
        : [];

      const updatedProfData = {
        ...existingProfData,
        udiseCode: cleanUdise,
        schoolName: existingProfData.schoolName || resolvedSchoolName,
        claimRequests: [newClaim, ...prevRequests.filter((r: any) => r.id !== newClaim.id)],
        latestClaimStatus: 'pending',
      };

      await schoolSearchSupabase.from('school_profiles').upsert(
        {
          udise_code: cleanUdise,
          profile_data: updatedProfData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'udise_code' }
      );
    } catch (supaErr) {
      console.warn('[school-claim] Supabase school_profiles claim save warning:', supaErr);
    }

    // 3. Save in local JSON store
    const store = readClaimsStore();
    store.claims.unshift(newClaim);
    writeClaimsStore(store);

    // 4. Send email to admin
    await sendAdminNotificationEmail(newClaim);

    return NextResponse.json({
      success: true,
      message:
        'Request submitted successfully! Your request is pending Admin verification. Once Admin verifies your request, a unique 16-character Magic Link will be generated and sent to you.',
      claim_id: newClaim.id,
      udise_code: cleanUdise,
      status: 'pending',
      magic_link_created: false,
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
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_claim_read',
    maxRequestsPerMinute: 60,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  try {
    const { searchParams } = new URL(req.url);
    const udise = searchParams.get('udise');
    const queryUserId = searchParams.get('user_id');
    const queryEmail = searchParams.get('email');
    const callerIsAdmin = isAdminRequest(req);

    const store = readClaimsStore();
    let results = [...store.claims];

    // Filter by user_id or email for checking existing submissions
    if (queryUserId || queryEmail) {
      results = results.filter((c) => {
        const matchUser = queryUserId && String(c.user_id) === String(queryUserId);
        const matchEmail = queryEmail && c.claimant_email && c.claimant_email.toLowerCase() === queryEmail.toLowerCase();
        return matchUser || matchEmail;
      });
    }

    // Also merge any claims stored in Supabase school_profiles if querying by udise
    if (udise) {
      const clean = udise.replace(/\D/g, '');
      try {
        const { data: profRow } = await schoolSearchSupabase
          .from('school_profiles')
          .select('profile_data')
          .eq('udise_code', clean)
          .maybeSingle();
        const pData =
          typeof profRow?.profile_data === 'string'
            ? JSON.parse(profRow.profile_data)
            : profRow?.profile_data || {};
        if (Array.isArray(pData.claimRequests)) {
          for (const cr of pData.claimRequests) {
            if (!results.some((r) => r.id === cr.id)) {
              results.push(cr);
            }
          }
        }
      } catch {}
      results = results.filter((c) => c.udise_code === clean);
    }

    // Privacy & Security: Mask PII and strip Magic Link keys for non-admin callers
    const safeResults = callerIsAdmin
      ? results
      : results.map((c) => ({
          id: c.id,
          udise_code: c.udise_code,
          school_name: c.school_name,
          designation: c.designation,
          status: c.status,
          request_type: c.request_type || 'claim',
          created_at: c.created_at,
          updated_at: c.updated_at,
          claimant_name: c.claimant_name ? `${c.claimant_name.slice(0, 2)}***` : 'Representative',
          claimant_email: c.claimant_email
            ? c.claimant_email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
            : '***',
          whatsapp_number: 'Protected',
        }));

    return NextResponse.json({
      success: true,
      count: safeResults.length,
      claims: safeResults,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_claim_verify',
    maxRequestsPerMinute: 30,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  try {
    const rawBody = await req.json().catch(() => ({}));
    const body = sanitizePayloadDeep(rawBody);

    // Strict Backend Security: Verify that caller is authorized Administrator
    if (!isAdminRequest(req, { adminKey: body.adminKey, adminEmail: body.adminEmail })) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Unauthorized: Only an Administrator can verify school claims and generate Magic Links.',
        },
        { status: 401 }
      );
    }

    const { claim_id, udise_code, status, review_note } = body;

    if ((!claim_id && !udise_code) || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'claim_id (or udise_code) and valid status (approved/rejected/pending) are required.',
        },
        { status: 400 }
      );
    }

    const store = readClaimsStore();
    let claimIndex = store.claims.findIndex(
      (c) => (claim_id && c.id === claim_id) || (udise_code && c.udise_code === String(udise_code).replace(/\D/g, ''))
    );

    let claim: SchoolClaimRecord | null = claimIndex !== -1 ? store.claims[claimIndex] : null;

    // Fallback: Check Supabase school_profiles if claim was only in Supabase
    if (!claim && udise_code) {
      const cleanU = String(udise_code).replace(/\D/g, '');
      const { data: profRow } = await schoolSearchSupabase
        .from('school_profiles')
        .select('profile_data')
        .eq('udise_code', cleanU)
        .maybeSingle();
      const pData =
        typeof profRow?.profile_data === 'string'
          ? JSON.parse(profRow.profile_data)
          : profRow?.profile_data || {};
      const foundInSupa = (pData.claimRequests || []).find(
        (r: any) => (claim_id && r.id === claim_id) || r.udise_code === cleanU
      );
      if (foundInSupa) {
        claim = foundInSupa;
        store.claims.unshift(foundInSupa);
        claimIndex = 0;
      }
    }

    if (!claim) {
      return NextResponse.json({ success: false, error: 'Claim record not found.' }, { status: 404 });
    }

    claim.status = status;
    claim.updated_at = new Date().toISOString();
    if (review_note) {
      claim.note = `${claim.note || ''}\n[Admin Review]: ${review_note}`.trim();
    }

    let generatedMagicKey = '';
    let generatedMagicLinkUrl = '';
    let verificationMessage = '';
    let whatsappShareUrl = '';

    // CRITICAL REQUIREMENT: Generate 16-Char Mixed Magic Key & Magic Link ONLY when Admin Approves!
    if (status === 'approved') {
      // Reuse existing 16-char magic key if already approved earlier, or generate a brand-new 16-char mixed key
      generatedMagicKey =
        claim.magic_key && claim.magic_key.length === 16
          ? claim.magic_key
          : generate16CharMixedMagicKey();

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const profilePath = await resolveSchoolProfilePath(
        claim.udise_code,
        claim.school_name,
        claim.state,
        claim.district,
        claim.city
      );

      generatedMagicLinkUrl = `${baseUrl}${profilePath}?magicKey=${encodeURIComponent(generatedMagicKey)}&edit=true`;

      claim.magic_key = generatedMagicKey;
      claim.visual_edit_token = generatedMagicKey;
      claim.visual_edit_url = generatedMagicLinkUrl;
      claim.approved_at = new Date().toISOString();

      verificationMessage = `✅ CSEEL Official Verification Approved for ${claim.school_name} (UDISE: ${claim.udise_code}).\n\n🔑 Your 16-Character Security Key: ${generatedMagicKey}\n🔗 Direct Profile Edit Magic Link: ${generatedMagicLinkUrl}\n\nClick the link above to open your school profile directly in Edit Mode and save updates to Supabase.`;
      claim.verification_message = verificationMessage;

      const cleanPhone = (claim.whatsapp_number || '').replace(/\D/g, '');
      const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      whatsappShareUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(verificationMessage)}`;

      // 1. Permanently store Magic Key & Magic Link in Supabase school_profiles & mark udise_private_schools verified
      try {
        const { data: profRow } = await schoolSearchSupabase
          .from('school_profiles')
          .select('profile_data, section_visibility')
          .eq('udise_code', claim.udise_code)
          .maybeSingle();

        const existingProfData =
          typeof profRow?.profile_data === 'string'
            ? JSON.parse(profRow.profile_data)
            : profRow?.profile_data || {};

        const prevRequests = Array.isArray(existingProfData.claimRequests)
          ? existingProfData.claimRequests
          : [];

        const updatedProfData = {
          ...existingProfData,
          udiseCode: claim.udise_code,
          schoolName: existingProfData.schoolName || claim.school_name,
          latestClaimStatus: 'approved',
          magicAuth: {
            magicKey: generatedMagicKey,
            magicLinkUrl: generatedMagicLinkUrl,
            status: 'approved',
            isApproved: true,
            isPermanent: true,
            approvedAt: claim.approved_at,
            claimantName: claim.claimant_name,
            claimantEmail: claim.claimant_email,
            whatsappNumber: claim.whatsapp_number,
            designation: claim.designation,
          },
          claimRequests: [
            claim,
            ...prevRequests.filter((r: any) => r.id !== claim!.id),
          ],
        };

        await schoolSearchSupabase.from('school_profiles').upsert(
          {
            udise_code: claim.udise_code,
            is_claimed: true,
            claimed_by: claim.claimant_email,
            profile_data: updatedProfData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'udise_code' }
        );

        await schoolSearchSupabase
          .from('udise_private_schools')
          .update({
            is_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq('udise_code', claim.udise_code);
      } catch (supaErr) {
        console.error('[school-claim PATCH] Error saving permanent magicAuth to Supabase:', supaErr);
      }

      // 2. Also persist in local sync tokens store for backward compatibility
      try {
        const syncFile = path.join(process.cwd(), 'src', 'data', 'school_ai_sync_tokens.json');
        const syncData = fs.existsSync(syncFile)
          ? JSON.parse(fs.readFileSync(syncFile, 'utf8'))
          : { tokens: {} };
        if (!syncData.tokens) syncData.tokens = {};

        syncData.tokens[generatedMagicKey] = {
          token: generatedMagicKey,
          magicKey: generatedMagicKey,
          magicLinkUrl: generatedMagicLinkUrl,
          schoolId: claim.udise_code,
          schoolName: claim.school_name,
          createdAt: Date.now(),
          expiresAt: 0,
          isPermanent: true,
          isApproved: true,
          status: 'approved',
          lastUpdatedAt: Date.now(),
          lastUpdatedSource: 'Admin Approved 16-Char Magic Link',
          profileData: {
            udiseCode: claim.udise_code,
            schoolName: claim.school_name,
            generalEmail: claim.claimant_email,
            phone: claim.whatsapp_number,
          },
        };
        fs.writeFileSync(syncFile, JSON.stringify(syncData, null, 2), 'utf8');
      } catch (e) {
        console.warn('Could not update sync token store:', e);
      }

      // 3. Send approval notification email with Magic Link + 16-char Key to claimant
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey && claim.claimant_email) {
        try {
          const activeFrom =
            process.env.RESEND_FROM_EMAIL || 'CSEEL Schools <updates@schools.cseel.org>';
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: activeFrom,
              to: [claim.claimant_email],
              subject: `✅ Verified! Your Magic Link & 16-Digit Key for ${claim.school_name}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
                  <h2 style="color: #065f46; margin-top: 0;">🎉 Congratulations! Your School Profile Claim is Approved</h2>
                  <p>Dear ${claim.claimant_name},</p>
                  <p>Your institutional verification for <strong>${claim.school_name}</strong> (UDISE: ${claim.udise_code}) has been verified by CSEEL Administration.</p>
                  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0 0 8px; font-weight: bold; color: #166534;">🔑 Your 16-Character Security Key:</p>
                    <code style="display: inline-block; background: #ffffff; border: 1px solid #86efac; padding: 8px 14px; border-radius: 6px; font-size: 15px; font-weight: bold; color: #0f172a; margin-bottom: 14px;">${generatedMagicKey}</code>
                    <p style="margin: 0 0 10px; font-weight: bold; color: #166534;">🔗 Your Direct Edit Mode Magic Link:</p>
                    <a href="${generatedMagicLinkUrl}" style="display: inline-block; background: #16a34a; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                      Open School Profile in Edit Mode &rarr;
                    </a>
                  </div>
                  <p style="font-size: 12px; color: #64748b;">Clicking this unique link opens your school profile directly in Edit Mode and saves all updates to Supabase.</p>
                </div>
              `,
            }),
          });
        } catch {}
      }
    } else {
      // If rejected or reverted to pending, revoke magicAuth in Supabase
      claim.magic_key = '';
      claim.visual_edit_token = '';
      claim.visual_edit_url = '';
      try {
        const { data: profRow } = await schoolSearchSupabase
          .from('school_profiles')
          .select('profile_data')
          .eq('udise_code', claim.udise_code)
          .maybeSingle();
        if (profRow?.profile_data) {
          const pData =
            typeof profRow.profile_data === 'string'
              ? JSON.parse(profRow.profile_data)
              : profRow.profile_data;
          delete pData.magicAuth;
          pData.latestClaimStatus = status;
          await schoolSearchSupabase
            .from('school_profiles')
            .update({
              is_claimed: false,
              profile_data: pData,
              updated_at: new Date().toISOString(),
            })
            .eq('udise_code', claim.udise_code);
        }
      } catch {}
    }

    store.claims[claimIndex] = claim;
    writeClaimsStore(store);

    return NextResponse.json({
      success: true,
      message:
        status === 'approved'
          ? `Claim for ${claim.school_name} verified! Permanent 16-character Magic Link generated and stored in Supabase.`
          : `Claim for ${claim.school_name} marked as ${status}.`,
      claim,
      magic_key: generatedMagicKey || undefined,
      magic_link_url: generatedMagicLinkUrl || undefined,
      verification_message: verificationMessage || undefined,
      whatsapp_share_url: whatsappShareUrl || undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
