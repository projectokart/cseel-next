import { NextRequest, NextResponse } from 'next/server';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import {
  checkRateLimitAndBots,
  sanitizePayloadDeep,
  verifySchoolWriteAuth,
} from '@/lib/security/apiSecurityGuard';
import {
  readSyncStore,
  writeSyncStore,
  findSchoolTokenRecord,
  fetchBaseSchoolRow,
  extractSectionsFromData,
} from '@/lib/schools/schoolSectionsManager';

export async function POST(req: NextRequest) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_profile_save',
    maxRequestsPerMinute: 40,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  try {
    const rawBody = await req.json().catch(() => ({}));
    const body = sanitizePayloadDeep(rawBody);

    const udiseCode = String(
      body.udiseCode || body.udise_code || body.data?.udiseCode || ''
    )
      .replace(/\D/g, '')
      .trim();

    if (!udiseCode || udiseCode.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_UDISE_CODE',
          message: 'A valid UDISE code is required to save school profile changes.',
        },
        { status: 400 }
      );
    }

    // Strict Authorization: Only Admin OR Verified 16-character Magic Link key can save
    const authResult = await verifySchoolWriteAuth(req, udiseCode, {
      magicKey: body.magicKey || body.token || body.syncToken,
      adminKey: body.adminKey,
      adminEmail: body.adminEmail,
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED_WRITE',
          message:
            authResult.reason ||
            'Unauthorized: Only an Administrator or a verified School with an Admin-approved 16-character Magic Link can modify school data.',
        },
        { status: 403 }
      );
    }

    const incomingData = body.data || body.profileData || body;

    // 1. Fetch existing row in udise_private_schools and school_profiles
    const baseRow = await fetchBaseSchoolRow(udiseCode);
    const { data: existingProfRow } = await schoolSearchSupabase
      .from('school_profiles')
      .select('*')
      .eq('udise_code', udiseCode)
      .maybeSingle();

    const existingProfData =
      typeof existingProfRow?.profile_data === 'string'
        ? JSON.parse(existingProfRow.profile_data)
        : existingProfRow?.profile_data || {};

    // Preserve permanent magicAuth and claimRequests inside profile_data
    const mergedProfileData: Record<string, any> = {
      ...existingProfData,
      ...incomingData,
      udiseCode,
      magicAuth: existingProfData.magicAuth || incomingData.magicAuth,
      claimRequests: existingProfData.claimRequests || incomingData.claimRequests,
      lastSavedAt: new Date().toISOString(),
      lastSavedByMode: authResult.mode,
    };

    // Resolve primary image / logo so both profile and directory listing reflect updates
    const resolvedLogo =
      incomingData.logoImage !== undefined
        ? incomingData.logoImage
        : existingProfData.logoImage || '';
    const resolvedHeroImage =
      incomingData.heroImage !== undefined
        ? incomingData.heroImage
        : existingProfData.heroImage || baseRow?.image_url || '';

    mergedProfileData.logoImage = resolvedLogo;
    mergedProfileData.heroImage = resolvedHeroImage;

    // Determine primary image_url for udise_private_schools listing card
    const primaryListingImage =
      resolvedLogo && !resolvedLogo.includes('default-school-placeholder')
        ? resolvedLogo
        : resolvedHeroImage || baseRow?.image_url || '';

    // 2. Build valid column update payload for udise_private_schools
    const udiseUpdatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (mergedProfileData.schoolName) {
      udiseUpdatePayload.school_name = String(mergedProfileData.schoolName).trim();
    }
    if (mergedProfileData.affiliationNumber !== undefined) {
      udiseUpdatePayload.affiliation_number = String(mergedProfileData.affiliationNumber).trim();
    }
    if (mergedProfileData.address) {
      udiseUpdatePayload.address = String(mergedProfileData.address).trim();
    }
    if (mergedProfileData.pincode) {
      udiseUpdatePayload.pincode = String(mergedProfileData.pincode).trim();
    }
    if (mergedProfileData.state) {
      udiseUpdatePayload.state_name = String(mergedProfileData.state).trim();
    }
    if (mergedProfileData.district || mergedProfileData.city) {
      udiseUpdatePayload.district_name = String(
        mergedProfileData.district || mergedProfileData.city
      ).trim();
    }
    if (mergedProfileData.phone) {
      udiseUpdatePayload.phone = String(mergedProfileData.phone).trim();
    }
    if (mergedProfileData.email) {
      udiseUpdatePayload.email = String(mergedProfileData.email).trim();
    }
    if (mergedProfileData.website !== undefined) {
      udiseUpdatePayload.website = String(mergedProfileData.website).trim();
    }
    if (mergedProfileData.principalName) {
      udiseUpdatePayload.principal_name = String(mergedProfileData.principalName).trim();
    }
    if (mergedProfileData.establishedYear) {
      const yr = parseInt(String(mergedProfileData.establishedYear), 10);
      if (!isNaN(yr)) udiseUpdatePayload.established_year = yr;
    }
    if (mergedProfileData.totalStudents !== undefined) {
      udiseUpdatePayload.total_students = Number(mergedProfileData.totalStudents) || 0;
    }
    if (mergedProfileData.totalBoys !== undefined) {
      udiseUpdatePayload.total_boys = Number(mergedProfileData.totalBoys) || 0;
    }
    if (mergedProfileData.totalGirls !== undefined) {
      udiseUpdatePayload.total_girls = Number(mergedProfileData.totalGirls) || 0;
    }
    if (mergedProfileData.totalTeachers !== undefined) {
      udiseUpdatePayload.total_teachers = Number(mergedProfileData.totalTeachers) || 0;
    }
    if (mergedProfileData.maleTeachers !== undefined) {
      udiseUpdatePayload.male_teachers = Number(mergedProfileData.maleTeachers) || 0;
    }
    if (mergedProfileData.femaleTeachers !== undefined) {
      udiseUpdatePayload.female_teachers = Number(mergedProfileData.femaleTeachers) || 0;
    }
    if (mergedProfileData.classroomsCount !== undefined) {
      const cc = Number(mergedProfileData.classroomsCount) || 0;
      udiseUpdatePayload.classrooms_count = cc;
      udiseUpdatePayload.total_classrooms = cc;
    }
    if (mergedProfileData.workingSmartBoards !== undefined) {
      udiseUpdatePayload.working_smart_boards = Number(mergedProfileData.workingSmartBoards) || 0;
    }
    if (mergedProfileData.board) {
      udiseUpdatePayload.board_10th = String(mergedProfileData.board).trim();
      udiseUpdatePayload.board_12th = String(mergedProfileData.board).trim();
    }
    if (mergedProfileData.medium) {
      udiseUpdatePayload.primary_medium = String(mergedProfileData.medium).trim();
    }
    if (mergedProfileData.genderType) {
      udiseUpdatePayload.gender_type = String(mergedProfileData.genderType).trim();
    }
    if (mergedProfileData.schoolCategory) {
      udiseUpdatePayload.school_category = String(mergedProfileData.schoolCategory).trim();
    }
    if (mergedProfileData.schoolType || mergedProfileData.management) {
      udiseUpdatePayload.management_desc = String(
        mergedProfileData.management || mergedProfileData.schoolType
      ).trim();
    }
    if (mergedProfileData.admissionsOpen !== undefined) {
      udiseUpdatePayload.admissions_open = Boolean(mergedProfileData.admissionsOpen);
    }
    if (mergedProfileData.annualFee !== undefined) {
      const numericFee = parseInt(String(mergedProfileData.annualFee).replace(/[^\d]/g, ''), 10);
      if (!isNaN(numericFee) && numericFee > 0) {
        udiseUpdatePayload.annual_fee = numericFee;
      }
    }
    if (primaryListingImage) {
      udiseUpdatePayload.image_url = primaryListingImage;
    }

    let udiseUpdated = false;
    if (baseRow) {
      const { error: uErr } = await schoolSearchSupabase
        .from('udise_private_schools')
        .update(udiseUpdatePayload)
        .eq('udise_code', udiseCode);
      if (!uErr) udiseUpdated = true;
      else console.warn('[school-profile-save] udise_private_schools update warning:', uErr.message);
    } else {
      const slugBase = String(mergedProfileData.schoolName || `school-${udiseCode}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const { error: insErr } = await schoolSearchSupabase
        .from('udise_private_schools')
        .upsert(
          {
            udise_code: udiseCode,
            school_id: udiseCode,
            school_name: mergedProfileData.schoolName || 'School Profile',
            school_slug: `${slugBase}-${udiseCode}`,
            state_name: mergedProfileData.state || 'DELHI',
            district_name: mergedProfileData.district || mergedProfileData.city || 'NEW DELHI',
            ...udiseUpdatePayload,
          },
          { onConflict: 'udise_code' }
        );
      if (!insErr) udiseUpdated = true;
    }

    // 3. Extract all structured sections so every tab column in school_profiles is also synced
    const compiledSections = extractSectionsFromData(
      { ...(baseRow || {}), ...udiseUpdatePayload },
      mergedProfileData
    );

    const sectionVisibility =
      mergedProfileData.sectionVisibility ||
      existingProfRow?.section_visibility || {
        basic_info: true,
        hero: true,
        stats: true,
        about: true,
        principal: true,
        management: true,
        academics: true,
        results: true,
        facilities: true,
        gallery: true,
        fees: true,
        admissions: true,
        faqs: true,
        contact: true,
        careers: true,
      };

    const schoolProfilesPayload: Record<string, any> = {
      udise_code: udiseCode,
      basic_info: compiledSections.basic_info,
      hero: compiledSections.hero,
      stats: compiledSections.stats,
      about: compiledSections.about,
      principal: compiledSections.principal,
      management: compiledSections.management,
      academics: compiledSections.academics,
      results: compiledSections.results,
      facilities: compiledSections.facilities,
      gallery: compiledSections.gallery,
      fees: compiledSections.fees,
      admissions: compiledSections.admissions,
      faqs: compiledSections.faqs,
      contact: compiledSections.contact,
      careers: compiledSections.careers,
      profile_data: mergedProfileData,
      section_visibility: sectionVisibility,
      updated_at: new Date().toISOString(),
    };

    let profilesUpdated = false;
    const { error: profErr } = await schoolSearchSupabase
      .from('school_profiles')
      .upsert(schoolProfilesPayload, { onConflict: 'udise_code' });

    if (!profErr) {
      profilesUpdated = true;
    } else {
      console.warn('[school-profile-save] school_profiles full upsert warning:', profErr.message);
      const { error: fbErr } = await schoolSearchSupabase
        .from('school_profiles')
        .upsert(
          {
            udise_code: udiseCode,
            profile_data: mergedProfileData,
            section_visibility: sectionVisibility,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'udise_code' }
        );
      if (!fbErr) profilesUpdated = true;
    }

    // 4. Keep local sync store in sync as fallback cache
    try {
      const store = readSyncStore();
      const match = findSchoolTokenRecord(udiseCode, store);
      const tokenKey = match?.tokenKey || `sync_${udiseCode.toLowerCase()}`;
      store.tokens[tokenKey] = {
        ...(match?.record || {}),
        token: tokenKey,
        schoolId: udiseCode,
        schoolName: mergedProfileData.schoolName || baseRow?.school_name || 'School',
        isPermanent: true,
        isApproved: true,
        status: 'approved',
        lastUpdatedAt: Date.now(),
        lastUpdatedSource: `Supabase Profile Save (${authResult.mode})`,
        profileData: mergedProfileData,
      };
      writeSyncStore(store);
    } catch (e) {
      console.warn('[school-profile-save] local sync store update warning:', e);
    }

    return NextResponse.json({
      success: true,
      udiseCode,
      authMode: authResult.mode,
      supabaseSynced: udiseUpdated || profilesUpdated,
      udiseUpdated,
      profilesUpdated,
      updatedAt: schoolProfilesPayload.updated_at,
      message: 'School profile, logo, and all section tabs saved permanently to Supabase.',
    });
  } catch (err: any) {
    console.error('[school-profile-save] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'SAVE_FAILED',
        message: err.message || 'Failed to save school profile to Supabase.',
      },
      { status: 500 }
    );
  }
}
