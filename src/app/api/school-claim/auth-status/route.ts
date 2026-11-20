export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import { isAdminRequest, isSuperAdminEmail } from '@/lib/security/apiSecurityGuard';
import { SchoolClaimRecord } from '../route';

const CLAIMS_FILE = path.join(process.cwd(), 'src', 'data', 'school_claims.json');

function readClaimsStore(): { claims: SchoolClaimRecord[] } {
  try {
    if (fs.existsSync(CLAIMS_FILE)) {
      return JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Error reading claims store in auth-status:', err);
  }
  return { claims: [] };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUdise = String(searchParams.get('udise') || '').replace(/\D/g, '').trim();
    const queryUserId = String(searchParams.get('user_id') || '').trim();
    const queryEmail = String(searchParams.get('email') || '').trim().toLowerCase();
    const candidateMagicKey = String(searchParams.get('magicKey') || '').trim();

    const isCallerAdmin = isSuperAdminEmail(queryEmail) || isAdminRequest(req, { adminEmail: queryEmail });

    const store = readClaimsStore();

    // 1. Identify all claims belonging to this user
    const userClaims: SchoolClaimRecord[] = [];
    if (queryUserId || queryEmail) {
      for (const c of store.claims) {
        const matchUser = queryUserId && c.user_id && String(c.user_id) === queryUserId;
        const matchEmail = queryEmail && c.claimant_email && c.claimant_email.toLowerCase() === queryEmail;
        if (matchUser || matchEmail) {
          userClaims.push(c);
        }
      }
    }

    // 2. Format user's schools
    const ownedSchools = userClaims.map((c) => ({
      id: c.id,
      udise_code: c.udise_code,
      school_name: c.school_name,
      status: c.status,
      isApproved: c.status === 'approved',
      profile_path: c.profile_path || `/school/delhi/new-delhi/new-delhi/${c.udise_code}`,
      magic_key: c.status === 'approved' ? c.magic_key : undefined,
      created_at: c.created_at,
    }));

    const primarySchool = ownedSchools.length > 0 ? ownedSchools[0] : null;
    const hasSubmittedAnySchool = ownedSchools.length > 0;

    // 3. Determine permissions for targetUdise
    let canEditCurrentSchool = false;
    let role: 'admin' | 'owner' | 'magic_link' | 'unauthorized' = 'unauthorized';
    let currentSchoolStatus: 'approved' | 'pending' | 'unclaimed' = 'unclaimed';

    let matchedClaim: SchoolClaimRecord | null = null;

    // Universal Admin Code: '1234' gives universal admin editing access across all schools
    if (isCallerAdmin || candidateMagicKey === '1234') {
      canEditCurrentSchool = true;
      role = 'admin';
      currentSchoolStatus = 'approved';
    } else {
      // Check magicKey for target school or any approved school matching this secret key
      if (candidateMagicKey) {
        const magicClaim = store.claims.find(
          (c) =>
            (!targetUdise || c.udise_code === targetUdise) &&
            c.status === 'approved' &&
            (c.magic_key === candidateMagicKey || c.visual_edit_token === candidateMagicKey)
        );
        if (magicClaim) {
          canEditCurrentSchool = true;
          role = 'magic_link';
          currentSchoolStatus = 'approved';
          matchedClaim = magicClaim;
        }
      }

      // Check user ownership for target school
      if (!canEditCurrentSchool && targetUdise && (queryUserId || queryEmail)) {
        const matchingClaim = userClaims.find((c) => c.udise_code === targetUdise);
        if (matchingClaim) {
          if (matchingClaim.status === 'approved') {
            canEditCurrentSchool = true;
            role = 'owner';
            currentSchoolStatus = 'approved';
          } else if (matchingClaim.status === 'pending') {
            currentSchoolStatus = 'pending';
          }
        }
      }

      // Check Supabase school_claims table with Bcrypt Hash (Secure Row-level Verification)
      if (!canEditCurrentSchool && candidateMagicKey) {
        try {
          let claimsQuery = schoolSearchSupabase
            .from('school_claims')
            .select('*')
            .eq('status', 'approved');

          if (targetUdise) {
            claimsQuery = claimsQuery.eq('udise_code', targetUdise);
          }

          const { data: dbClaims } = await claimsQuery;
          if (dbClaims && dbClaims.length > 0) {
            for (const claim of dbClaims) {
              let isMatch = false;
              if (claim.key_hash) {
                isMatch = bcrypt.compareSync(candidateMagicKey, claim.key_hash);
              } else if (claim.magic_key) {
                if (claim.magic_key.startsWith('$2a$') || claim.magic_key.startsWith('$2b$')) {
                  isMatch = bcrypt.compareSync(candidateMagicKey, claim.magic_key);
                } else {
                  isMatch = claim.magic_key === candidateMagicKey;
                }
              }

              if (isMatch) {
                canEditCurrentSchool = true;
                role = 'magic_link';
                currentSchoolStatus = 'approved';
                matchedClaim = {
                  id: claim.id,
                  udise_code: claim.udise_code,
                  school_id: claim.school_id || claim.udise_code,
                  school_name: claim.school_name || 'School Profile',
                  claimant_name: claim.claimant_name || 'Verified School Owner',
                  claimant_email: claim.claimant_email || '',
                  whatsapp_number: claim.whatsapp_number || '',
                  designation: claim.designation || 'Administrator',
                  note: claim.note || '',
                  status: 'approved',
                  magic_key: '••••••••',
                  visual_edit_token: '••••••••',
                  visual_edit_url: '',
                  created_at: claim.created_at || new Date().toISOString(),
                  profile_path: `/edu-network/school/delhi/west-b/janakpuri/${claim.udise_code}/cseel-global-education`,
                };
                break;
              }
            }
          }
        } catch (err) {
          console.warn('Error checking school_claims with bcrypt in Supabase:', err);
        }
      }

      // Fallback check against Supabase school_profiles if not found
      if (!canEditCurrentSchool && (targetUdise || candidateMagicKey)) {
        try {
          let query = schoolSearchSupabase
            .from('school_profiles')
            .select('udise_code, profile_data');
          
          if (targetUdise) {
            query = query.eq('udise_code', targetUdise);
          }

          const { data: profRows } = await query;
          const rowsList = Array.isArray(profRows) ? profRows : (profRows ? [profRows] : []);

          for (const profRow of rowsList) {
            if (profRow) {
              const pData =
                typeof profRow.profile_data === 'string'
                  ? JSON.parse(profRow.profile_data)
                  : profRow.profile_data || {};

              // Check magic key in Supabase
              if (
                candidateMagicKey &&
                pData?.magicAuth?.isApproved === true &&
                pData?.magicAuth?.magicKey === candidateMagicKey
              ) {
                canEditCurrentSchool = true;
                role = 'magic_link';
                currentSchoolStatus = 'approved';
                matchedClaim = {
                  id: String(profRow.udise_code),
                  udise_code: String(profRow.udise_code),
                  school_id: String(profRow.udise_code),
                  school_name: pData?.schoolName || 'School Profile',
                  claimant_name: pData?.magicAuth?.claimantName || 'Verified School Owner',
                  claimant_email: pData?.magicAuth?.claimantEmail || '',
                  whatsapp_number: '',
                  designation: 'Administrator',
                  note: '',
                  status: 'approved',
                  visual_edit_token: candidateMagicKey,
                  visual_edit_url: '',
                  created_at: new Date().toISOString(),
                  profile_path: `/school/delhi/new-delhi/new-delhi/${profRow.udise_code}`,
                };
                break;
              }

              // Check email ownership in Supabase
              if (
                !canEditCurrentSchool &&
                queryEmail &&
                pData?.magicAuth?.claimantEmail &&
                pData.magicAuth.claimantEmail.toLowerCase() === queryEmail
              ) {
                canEditCurrentSchool = true;
                role = 'owner';
                currentSchoolStatus = 'approved';
                break;
              }
            }
          }
        } catch (_) {}
      }
    }

    return NextResponse.json({
      success: true,
      canEditCurrentSchool,
      role,
      currentSchoolStatus,
      hasSubmittedAnySchool,
      primarySchool: primarySchool || (matchedClaim ? {
        id: matchedClaim.id,
        udise_code: matchedClaim.udise_code,
        school_name: matchedClaim.school_name,
        status: matchedClaim.status,
        isApproved: true,
        profile_path: matchedClaim.profile_path,
        magic_key: matchedClaim.magic_key,
        created_at: matchedClaim.created_at,
      } : null),
      profile_path: matchedClaim?.profile_path || null,
      udise_code: matchedClaim?.udise_code || null,
      ownedSchools,
    });
  } catch (err: any) {
    console.error('Error checking school auth status:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Error checking school authorization status',
        canEditCurrentSchool: false,
        role: 'unauthorized',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetUdise = String(body.udise || body.udise_code || body.udiseCode || '').replace(/\D/g, '').trim();
    const queryUserId = String(body.user_id || body.userId || '').trim();
    const queryEmail = String(body.email || body.claimant_email || '').trim().toLowerCase();
    const candidateMagicKey = String(body.secret_key || body.secretKey || body.magicKey || body.magic_key || '').trim();

    const url = new URL(req.url);
    if (targetUdise) url.searchParams.set('udise', targetUdise);
    if (queryUserId) url.searchParams.set('user_id', queryUserId);
    if (queryEmail) url.searchParams.set('email', queryEmail);
    if (candidateMagicKey) url.searchParams.set('magicKey', candidateMagicKey);

    const syntheticReq = new NextRequest(url.toString(), {
      method: 'GET',
      headers: req.headers,
    });

    return GET(syntheticReq);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, canEditCurrentSchool: false }, { status: 500 });
  }
}
