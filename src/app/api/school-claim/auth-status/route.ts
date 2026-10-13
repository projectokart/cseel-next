export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
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

    if (isCallerAdmin) {
      canEditCurrentSchool = true;
      role = 'admin';
      currentSchoolStatus = 'approved';
    } else {
      // Check magicKey for target school
      if (candidateMagicKey && targetUdise) {
        const magicClaim = store.claims.find(
          (c) =>
            c.udise_code === targetUdise &&
            c.status === 'approved' &&
            (c.magic_key === candidateMagicKey || c.visual_edit_token === candidateMagicKey)
        );
        if (magicClaim) {
          canEditCurrentSchool = true;
          role = 'magic_link';
          currentSchoolStatus = 'approved';
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

      // Fallback check against Supabase if not found locally
      if (!canEditCurrentSchool && targetUdise) {
        try {
          const { data: profRow } = await schoolSearchSupabase
            .from('school_profiles')
            .select('profile_data, is_claimed, claimed_by')
            .eq('udise_code', targetUdise)
            .maybeSingle();

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
            }

            // Check email ownership in Supabase
            if (
              !canEditCurrentSchool &&
              queryEmail &&
              profRow.is_claimed &&
              profRow.claimed_by &&
              profRow.claimed_by.toLowerCase() === queryEmail
            ) {
              canEditCurrentSchool = true;
              role = 'owner';
              currentSchoolStatus = 'approved';
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
      primarySchool,
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
