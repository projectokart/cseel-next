export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import { SCHOOLS_DATA } from '@/data/schoolFinderData';

// Helper to generate a friendly, secure 8-character verification key (e.g. CSL-9X2P)
function generateSecureClaimKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = 'CSL-';
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Local claims store reader for fast resilient fallback
const CLAIMS_FILE = path.join(process.cwd(), 'src', 'data', 'school_claims.json');
function readLocalClaims(): any[] {
  try {
    if (fs.existsSync(CLAIMS_FILE)) {
      const data = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf8'));
      if (Array.isArray(data.claims)) return data.claims;
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn('Error reading local claims backup:', err);
  }
  return [];
}

// High-performance Claims Fetcher
async function fetchOptimizedClaims(): Promise<any[]> {
  const localList = readLocalClaims();

  try {
    const fetchPromise = schoolSearchSupabase
      .from('school_claims')
      .select('id, udise_code, school_name, claimant_name, claimant_email, whatsapp_number, designation, status, magic_key, created_at, approved_at, approved_by')
      .order('created_at', { ascending: false })
      .limit(100);

    const timeoutPromise = new Promise<{ data: any[] | null }>((resolve) =>
      setTimeout(() => resolve({ data: null }), 3000)
    );

    const result: any = await Promise.race([fetchPromise, timeoutPromise]);
    const supaClaims = result?.data;

    if (Array.isArray(supaClaims) && supaClaims.length > 0) {
      // Merge with local records
      const seen = new Set<string>();
      const merged: any[] = [];

      for (const sc of supaClaims) {
        const u = String(sc.udise_code || sc.id);
        seen.add(u);
        const isBcrypt = sc.magic_key && (sc.magic_key.startsWith('$2a$') || sc.magic_key.startsWith('$2b$'));
        merged.push({
          ...sc,
          key_hash: isBcrypt ? sc.magic_key : null,
        });
      }

      for (const lc of localList) {
        const u = String(lc.udise_code || lc.id);
        if (!seen.has(u)) {
          seen.add(u);
          const isBcrypt = lc.magic_key && (lc.magic_key.startsWith('$2a$') || lc.magic_key.startsWith('$2b$'));
          merged.push({
            ...lc,
            key_hash: isBcrypt ? lc.magic_key : null,
          });
        }
      }
      return merged;
    }
  } catch (err) {
    console.warn('Supabase claims query fallback:', err);
  }

  // Fallback to local store with normalized key_hash
  return localList.map(c => ({
    ...c,
    key_hash: c.magic_key && (c.magic_key.startsWith('$2a$') || c.magic_key.startsWith('$2b$')) ? c.magic_key : null,
  }));
}

// High-performance Paginated Schools Fetcher
async function fetchOptimizedSchools(search = '', page = 1, limit = 20) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(50, Math.max(5, limit));
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

  try {
    let query = schoolSearchSupabase
      .from('udise_private_schools')
      .select('udise_code, school_name, state_name, district_name, board_10th, board_12th, address, pincode, is_verified', { count: 'estimated' })
      .order('udise_code', { ascending: true })
      .range(from, to);

    if (search) {
      if (/^\d+$/.test(search)) {
        query = query.ilike('udise_code', `%${search}%`);
      } else {
        query = query.ilike('school_name', `%${search}%`);
      }
    }

    const timeoutPromise = new Promise<any>((resolve) =>
      setTimeout(() => resolve({ data: null, count: null }), 3500)
    );

    const result: any = await Promise.race([query, timeoutPromise]);
    let schools = result?.data;
    const totalCount = result?.count || 1542890;

    if (Array.isArray(schools) && schools.length > 0) {
      // Lightweight check for claimed status on the current page's schools only
      const udiseList = schools.map((s: any) => s.udise_code).filter(Boolean);
      let claimedSet = new Set<string>();

      if (udiseList.length > 0) {
        try {
          const { data: profs } = await schoolSearchSupabase
            .from('school_profiles')
            .select('udise_code')
            .in('udise_code', udiseList);

          if (profs) {
            profs.forEach((p: any) => claimedSet.add(p.udise_code));
          }
        } catch (_) {}
      }

      const enriched = schools.map((s: any) => ({
        ...s,
        is_claimed: claimedSet.has(s.udise_code),
        profile_board: s.board_10th || s.board_12th || 'CBSE',
        is_published: s.is_verified !== false,
      }));

      return {
        schools: enriched,
        total: totalCount,
        page: safePage,
        limit: safeLimit,
      };
    }
  } catch (err) {
    console.warn('Supabase schools query fallback:', err);
  }

  // Instant In-Memory Seed Fallback (Never hangs!)
  let filtered = SCHOOLS_DATA;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(s =>
      (s.udise_code && s.udise_code.includes(q)) ||
      (s.school_name && s.school_name.toLowerCase().includes(q)) ||
      (s.name && s.name.toLowerCase().includes(q))
    );
  }

  const sliced = filtered.slice(from, to).map((s: any) => ({
    udise_code: s.udise_code || s.udiseCode || s.id,
    school_name: s.school_name || s.name,
    state_name: s.state_name || s.state || 'DELHI',
    district_name: s.district_name || s.district || 'WEST',
    board_10th: s.board || 'CBSE',
    is_verified: true,
    is_claimed: false,
    is_published: true,
  }));

  return {
    schools: sliced,
    total: filtered.length || 1542890,
    page: safePage,
    limit: safeLimit,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'list_claims';

    // 1. LIST CLAIMS
    if (action === 'list_claims') {
      const claims = await fetchOptimizedClaims();
      return NextResponse.json({ success: true, claims });
    }

    // 2. LIST SCHOOLS (UDISE Master Directory with Pagination)
    if (action === 'list_schools') {
      const search = (searchParams.get('search') || '').trim();
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '20', 10);

      const result = await fetchOptimizedSchools(search, page, limit);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ success: false, error: 'UNKNOWN_ACTION' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || '';

    // ── 0. LIST CLAIMS / SCHOOLS FALLBACK FOR POST ──
    if (action === 'list_claims') {
      const { data: claims, error } = await schoolSearchSupabase
        .from('school_claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, claims: claims || [] });
    }

    if (action === 'list_schools') {
      const search = (body.search || '').trim();
      const limit = parseInt(body.limit || '50', 10);

      let query = schoolSearchSupabase
        .from('udise_private_schools')
        .select('udise_code, school_name, state_name, district_name, board_10th, board_12th, address, pincode, is_verified, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (search) {
        if (/^\d+$/.test(search)) {
          query = query.ilike('udise_code', `%${search}%`);
        } else {
          query = query.ilike('school_name', `%${search}%`);
        }
      }

      const { data: schools, error } = await query;
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, schools: schools || [] });
    }

    // ── 1. APPROVE CLAIM & GENERATE BCRYPT KEY ──
    if (action === 'approve_claim') {
      const udiseCode = String(body.udiseCode || body.udise_code || '').trim();
      const claimId = String(body.claimId || body.claim_id || '').trim();

      if (!udiseCode && !claimId) {
        return NextResponse.json({ success: false, error: 'UDISE_OR_CLAIM_ID_REQUIRED' }, { status: 400 });
      }

      // Generate a new unique secret key or use admin provided one
      const plainKey = body.customKey?.trim() || generateSecureClaimKey();
      const salt = bcrypt.genSaltSync(10);
      const keyHash = bcrypt.hashSync(plainKey, salt);

      // 1. Update target school_claims (storing Bcrypt hash in magic_key for irreversible encryption)
      let updateQuery = schoolSearchSupabase
        .from('school_claims')
        .update({
          status: 'approved',
          magic_key: keyHash,
          approved_by: body.adminEmail || 'Super Admin',
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (claimId) {
        updateQuery = updateQuery.eq('id', claimId);
      } else {
        updateQuery = updateQuery.eq('udise_code', udiseCode);
      }

      const { data: updatedClaims, error: claimErr } = await updateQuery.select();

      if (claimErr) {
        return NextResponse.json({ success: false, error: claimErr.message }, { status: 500 });
      }

      const targetUdise = udiseCode || (updatedClaims && updatedClaims[0]?.udise_code);

      // 2. Mark master table is_verified = true
      if (targetUdise) {
        await schoolSearchSupabase
          .from('udise_private_schools')
          .update({ is_verified: true, updated_at: new Date().toISOString() })
          .eq('udise_code', targetUdise);

        // 3. Upsert school_profiles row so it is immediately marked claimed
        await schoolSearchSupabase
          .from('school_profiles')
          .upsert(
            {
              udise_code: targetUdise,
              is_claimed: true,
              board: body.board || 'CBSE',
              school_type: body.schoolType || 'Private Unaided',
              residential_type: body.residentialType || 'Day School',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'udise_code' }
          );
      }

      return NextResponse.json({
        success: true,
        message: 'Claim approved successfully and Bcrypt key hash stored.',
        generatedSecretKey: plainKey, // Returned once so admin can copy/send to school owner
        claim: updatedClaims && updatedClaims[0] ? updatedClaims[0] : null,
      });
    }

    // ── 2. REJECT CLAIM (Revoke key and change status to rejected) ──
    if (action === 'reject_claim') {
      const udiseCode = String(body.udiseCode || body.udise_code || '').trim();
      const { error } = await schoolSearchSupabase
        .from('school_claims')
        .update({
          status: 'rejected',
          key_hash: null, // Revoke secret access key
          approved_by: body.adminEmail || 'Super Admin',
          updated_at: new Date().toISOString(),
        })
        .eq('udise_code', udiseCode);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      // Reset claimed and verified status in directory master
      try {
        await schoolSearchSupabase
          .from('school_directory_master')
          .update({ is_claimed: false, is_verified: false })
          .eq('udise_code', udiseCode);
      } catch {}

      return NextResponse.json({ success: true, message: `Claim for UDISE ${udiseCode} rejected and key revoked.` });
    }

    // ── 2B. DELETE CLAIM (Admin Full Power: Permanently Delete Claim Record) ──
    if (action === 'delete_claim') {
      const udiseCode = String(body.udiseCode || body.udise_code || '').trim();
      const claimId = body.claimId || body.id;

      let query = schoolSearchSupabase.from('school_claims').delete();
      if (claimId) {
        query = query.eq('id', claimId);
      } else {
        query = query.eq('udise_code', udiseCode);
      }

      const { error } = await query;

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      // Reset claimed & verified status in directory master and school profile
      try {
        await schoolSearchSupabase
          .from('school_directory_master')
          .update({ is_claimed: false, is_verified: false })
          .eq('udise_code', udiseCode);
      } catch {}

      return NextResponse.json({ success: true, message: `Claim for UDISE ${udiseCode} deleted successfully.` });
    }

    // ── 3. CREATE NEW SCHOOL IN UDISE MASTER TABLE ──
    if (action === 'create_udise_school') {
      const udiseCode = String(body.udiseCode || '').replace(/\D/g, '').trim();
      const schoolName = String(body.schoolName || '').trim();
      const stateName = String(body.stateName || 'DELHI').trim().toUpperCase();
      const districtName = String(body.districtName || 'WEST').trim().toUpperCase();
      const board = String(body.board || 'CBSE').trim().toUpperCase();
      const address = String(body.address || '').trim();
      const pincode = String(body.pincode || '').trim();

      if (!udiseCode || udiseCode.length < 6) {
        return NextResponse.json({ success: false, error: 'INVALID_UDISE' }, { status: 400 });
      }
      if (!schoolName) {
        return NextResponse.json({ success: false, error: 'SCHOOL_NAME_REQUIRED' }, { status: 400 });
      }

      const slugBase = schoolName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const { data: newSchool, error: insErr } = await schoolSearchSupabase
        .from('udise_private_schools')
        .upsert(
          {
            udise_code: udiseCode,
            school_id: udiseCode,
            school_name: schoolName,
            school_slug: `${slugBase}-${udiseCode}`,
            state_name: stateName,
            district_name: districtName,
            board_10th: board,
            board_12th: board,
            residential_school: body.residentialSchool || 'Day School',
            address: address || `${schoolName}, ${districtName}, ${stateName}`,
            pincode: pincode || '110001',
            is_verified: Boolean(body.isVerified),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'udise_code' }
        )
        .select()
        .single();

      if (insErr) {
        return NextResponse.json({ success: false, error: insErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'New school successfully added to UDISE Master Directory.',
        school: newSchool,
      });
    }

    // ── 4. TOGGLE PUBLISH / HIDE ──
    if (action === 'toggle_publish') {
      const udiseCode = String(body.udiseCode || '').trim();
      const publishState = Boolean(body.publish);

      await schoolSearchSupabase
        .from('udise_private_schools')
        .update({ is_verified: publishState, updated_at: new Date().toISOString() })
        .eq('udise_code', udiseCode);

      await schoolSearchSupabase
        .from('school_profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('udise_code', udiseCode);

      return NextResponse.json({
        success: true,
        message: `School ${udiseCode} is now ${publishState ? 'Published' : 'Hidden'}.`,
        is_published: publishState,
      });
    }

    // ── 5. DIRECT EDIT SCHOOL PROFILE ──
    if (action === 'edit_school') {
      const udiseCode = String(body.udiseCode || '').trim();
      if (!udiseCode) {
        return NextResponse.json({ success: false, error: 'UDISE_REQUIRED' }, { status: 400 });
      }

      // Update master table
      const masterUpdate: Record<string, any> = { updated_at: new Date().toISOString() };
      if (body.schoolName) masterUpdate.school_name = body.schoolName;
      if (body.board) {
        masterUpdate.board_10th = body.board;
        masterUpdate.board_12th = body.board;
      }
      if (body.stateName) masterUpdate.state_name = body.stateName;
      if (body.districtName) masterUpdate.district_name = body.districtName;
      if (body.address) masterUpdate.address = body.address;
      if (body.pincode) masterUpdate.pincode = body.pincode;

      await schoolSearchSupabase
        .from('udise_private_schools')
        .update(masterUpdate)
        .eq('udise_code', udiseCode);

      // Update school_profiles normalized columns
      const profUpdate: Record<string, any> = { updated_at: new Date().toISOString() };
      if (body.board) profUpdate.board = body.board;
      if (body.schoolType) profUpdate.school_type = body.schoolType;
      if (body.residentialType) profUpdate.residential_type = body.residentialType;
      if (Array.isArray(body.facilityIds)) profUpdate.facility_ids = body.facilityIds;
      if (body.overview) profUpdate.overview = body.overview;
      if (body.admissions) profUpdate.admissions = body.admissions;
      if (body.results) profUpdate.results = body.results;

      await schoolSearchSupabase
        .from('school_profiles')
        .upsert(
          { udise_code: udiseCode, ...profUpdate },
          { onConflict: 'udise_code' }
        );

      return NextResponse.json({
        success: true,
        message: `School ${udiseCode} updated successfully.`,
      });
    }

    return NextResponse.json({ success: false, error: 'UNKNOWN_ACTION' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
