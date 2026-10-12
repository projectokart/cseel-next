import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import {
  checkRateLimitAndBots,
  isValid16CharMagicKeyFormat,
  MASTER_ADMIN_KEY,
  MASTER_ADMIN_MAGIC_TOKEN,
} from '@/lib/security/apiSecurityGuard';

const CLAIMS_FILE = path.join(process.cwd(), 'src', 'data', 'school_claims.json');
const SYNC_FILE = path.join(process.cwd(), 'src', 'data', 'school_ai_sync_tokens.json');

export async function GET(req: NextRequest) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'verification_status_check',
    maxRequestsPerMinute: 90,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  const { searchParams } = new URL(req.url);
  const udise = searchParams.get('udise') || searchParams.get('udiseCode');
  const magicKey = (searchParams.get('magicKey') || searchParams.get('token') || '').trim();
  const email = searchParams.get('email');

  const cleanUdise = udise ? String(udise).replace(/\D/g, '').trim() : '';

  try {
    // 1. Check Supabase school_profiles FIRST (Permanent Storage of Magic Link & Claim Status)
    let supabaseMagicAuth: any = null;
    let supabaseClaimed = false;
    let supabaseLatestStatus = '';
    let supabaseSchoolName = '';

    if (cleanUdise) {
      try {
        const { data: profRow } = await schoolSearchSupabase
          .from('school_profiles')
          .select('is_claimed, claimed_by, profile_data')
          .eq('udise_code', cleanUdise)
          .maybeSingle();

        if (profRow) {
          supabaseClaimed = Boolean(profRow.is_claimed);
          const pData =
            typeof profRow.profile_data === 'string'
              ? JSON.parse(profRow.profile_data)
              : profRow.profile_data || {};
          supabaseMagicAuth = pData?.magicAuth || null;
          supabaseLatestStatus = pData?.latestClaimStatus || '';
          supabaseSchoolName = pData?.schoolName || '';
        }
      } catch (e) {
        console.warn('Error checking school_profiles in verification-status:', e);
      }
    }

    // 2. Check Claims Store
    let claimRecord: any = null;
    if (fs.existsSync(CLAIMS_FILE)) {
      try {
        const claimsStore = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf8'));
        const claims = claimsStore?.claims || [];
        claimRecord = claims.find((c: any) => {
          if (cleanUdise && c.udise_code === cleanUdise) {
            if (magicKey) {
              return c.magic_key === magicKey || c.visual_edit_token === magicKey;
            }
            return true;
          }
          if (magicKey && (c.magic_key === magicKey || c.visual_edit_token === magicKey)) return true;
          if (email && c.claimant_email?.toLowerCase() === email.toLowerCase()) return true;
          return false;
        });
      } catch (e) {
        console.warn('Error reading claims store in verification status route:', e);
      }
    }

    // 3. Check Sync Store
    let syncRecord: any = null;
    if (magicKey && fs.existsSync(SYNC_FILE)) {
      try {
        const syncStore = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
        syncRecord = syncStore?.tokens?.[magicKey] || null;
      } catch {}
    }

    // 4. Verify whether the provided magicKey is a valid Admin-approved Magic Link key
    let isMagicKeyValid = false;
    if (magicKey) {
      if (magicKey === MASTER_ADMIN_MAGIC_TOKEN || magicKey === MASTER_ADMIN_KEY) {
        isMagicKeyValid = true;
      } else if (
        supabaseMagicAuth &&
        supabaseMagicAuth.status === 'approved' &&
        supabaseMagicAuth.isApproved === true &&
        supabaseMagicAuth.magicKey === magicKey
      ) {
        isMagicKeyValid = true;
      } else if (
        claimRecord &&
        claimRecord.status === 'approved' &&
        (claimRecord.magic_key === magicKey || claimRecord.visual_edit_token === magicKey)
      ) {
        isMagicKeyValid = true;
      } else if (syncRecord && syncRecord.isApproved === true && syncRecord.status === 'approved') {
        isMagicKeyValid = true;
      }
    }

    const status =
      (supabaseMagicAuth?.status === 'approved' ? 'approved' : '') ||
      claimRecord?.status ||
      supabaseLatestStatus ||
      (syncRecord?.isApproved ? 'approved' : syncRecord?.status) ||
      (supabaseClaimed ? 'approved' : 'not_claimed');

    const isVerified = status === 'approved' || supabaseClaimed === true;

    return NextResponse.json({
      success: true,
      udise_code: cleanUdise || claimRecord?.udise_code || syncRecord?.schoolId || null,
      school_name:
        supabaseSchoolName || claimRecord?.school_name || syncRecord?.schoolName || null,
      status, // 'pending' | 'approved' | 'rejected' | 'not_claimed'
      isVerified,
      isMagicKeyValid,
      is16CharMixedFormat: magicKey ? isValid16CharMagicKeyFormat(magicKey) : false,
      claimant: claimRecord
        ? {
            name: `${(claimRecord.claimant_name || 'Rep').slice(0, 2)}***`,
            designation: claimRecord.designation,
            emailMasked: claimRecord.claimant_email?.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
          }
        : supabaseMagicAuth
        ? {
            name: `${(supabaseMagicAuth.claimantName || 'Rep').slice(0, 2)}***`,
            designation: supabaseMagicAuth.designation || 'Representative',
            emailMasked: supabaseMagicAuth.claimantEmail?.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
          }
        : null,
      message: isMagicKeyValid
        ? 'Valid Admin-approved 16-character Magic Link verified from Supabase. Edit Mode unlocked.'
        : isVerified
        ? 'Institutional verification verified by administrator.'
        : status === 'pending'
        ? 'Claim request is under official administrator review. Magic Link will be generated only after Admin verification.'
        : 'Profile unverified or claim not submitted.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal verification server error.' },
      { status: 500 }
    );
  }
}
