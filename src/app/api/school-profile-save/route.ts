export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import {
  checkRateLimitAndBots,
  sanitizePayloadDeep,
  verifySchoolWriteAuth,
  checkCsrfOrigin,
} from '@/lib/security/apiSecurityGuard';
import {
  readSyncStore,
  writeSyncStore,
  findSchoolTokenRecord,
  fetchBaseSchoolRow,
  extractSectionsFromData,
} from '@/lib/schools/schoolSectionsManager';
import { revalidateAndPurgePaths } from '@/lib/cache/cloudflarePurge';

export async function POST(req: NextRequest) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_profile_save',
    maxRequestsPerMinute: 40,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  const csrfBlock = checkCsrfOrigin(req);
  if (csrfBlock) return csrfBlock;

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

    // Strict Authorization: Only Admin OR Verified School Owner OR Verified Magic Link key can save
    const authResult = await verifySchoolWriteAuth(req, udiseCode, {
      magicKey: body.magicKey || body.token || body.syncToken || body.secret_key || body.secretKey,
      adminKey: body.adminKey,
      adminEmail: body.adminEmail,
      userId: body.userId || body.user_id,
      userEmail: body.userEmail || body.user_email || body.email,
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

    // Extract facility IDs for direct array column
    let facilityIds: string[] = [];
    if (Array.isArray(mergedProfileData.facility_ids)) {
      facilityIds = mergedProfileData.facility_ids.map(String);
    } else if (Array.isArray(mergedProfileData.facilities)) {
      facilityIds = mergedProfileData.facilities
        .filter((f: any) => (typeof f === 'string' ? true : f.selected !== false))
        .map((f: any) => (typeof f === 'string' ? f : f.id || f.code || f.key))
        .filter(Boolean);
    }

    // 3. Extract 16-column modular architecture payloads
    const snapshotPayload = {
      established_year: String(mergedProfileData.establishedYear || baseRow?.established_year || '').trim(),
      campus_area: String(mergedProfileData.campusArea || '').trim(),
      board: String(mergedProfileData.board || baseRow?.board_10th || 'CBSE').trim(),
      school_type: String(mergedProfileData.schoolType || baseRow?.management_desc || 'Private Unaided').trim(),
      school_gender: String(mergedProfileData.genderType || mergedProfileData.school_gender || 'Co-Educational').trim(),
      total_students: Number(mergedProfileData.totalStudents || baseRow?.total_students || 0),
      total_teachers: Number(mergedProfileData.totalTeachers || baseRow?.total_teachers || 0),
      student_teacher_ratio: String(mergedProfileData.studentTeacherRatio || '1:17').trim(),
      class_from: String(mergedProfileData.classFrom || baseRow?.class_from || 'Nursery').trim(),
      class_to: String(mergedProfileData.classTo || baseRow?.class_to || 'Class 12th').trim(),
    };

    const videoGalleryPayload = {
      video_url: String(mergedProfileData.campusVideoUrl || mergedProfileData.video_url || '').trim(),
      images: Array.isArray(compiledSections.gallery?.images || mergedProfileData.gallery || mergedProfileData.galleryItems)
        ? (compiledSections.gallery?.images || mergedProfileData.gallery || mergedProfileData.galleryItems)
        : [],
    };

    const importantDatesPayload = {
      academic_session: String(mergedProfileData.academicSession || '2026-2027').trim(),
      admission_status: String(mergedProfileData.admissionStatus || (mergedProfileData.admissionsOpen ? 'Open for 2026-27' : 'Closed')).trim(),
      due_dates: Array.isArray(mergedProfileData.dueDates) && mergedProfileData.dueDates.length > 0
        ? mergedProfileData.dueDates
        : [
            { title: 'Online Registration Opens', date: '01 Jan 2026' },
            { title: 'First Admission List & Verification', date: '15 Feb 2026' },
            { title: 'Session Orientation & Induction', date: '01 Apr 2026' }
          ],
      required_documents: Array.isArray(mergedProfileData.requiredDocuments || compiledSections.admissions?.required_documents)
        ? (mergedProfileData.requiredDocuments || compiledSections.admissions?.required_documents)
        : [],
      guidelines: String(mergedProfileData.admissionProcess || mergedProfileData.guidelines || compiledSections.admissions?.process || '').trim(),
    };

    const admissionDeskPayload = Array.isArray(mergedProfileData.admissionDeskContacts) && mergedProfileData.admissionDeskContacts.length > 0
      ? mergedProfileData.admissionDeskContacts
      : [
          {
            desk_name: 'Central Admissions Cell',
            phone: String(mergedProfileData.phone || baseRow?.phone || '').trim(),
            email: String(mergedProfileData.email || baseRow?.email || '').trim(),
          },
          {
            desk_name: 'Principal Secretariat',
            phone: String(mergedProfileData.principalPhone || '').trim(),
            email: String(mergedProfileData.principalEmail || '').trim(),
          }
        ];

    // Normalize boardResults: dashboard saves as {class10, class12} but component expects {class10Results, class12Results}
    const rawBoardResults = mergedProfileData.boardResults || compiledSections.results?.boardResults || {};
    const normalizedBoardResults = (() => {
      if (!rawBoardResults || typeof rawBoardResults !== 'object') return {};
      // If already correct format (has class10Results key), return as-is
      if (rawBoardResults.class10Results !== undefined || rawBoardResults.class12Results !== undefined) {
        return rawBoardResults;
      }
      // Dashboard format: {class10: {...}, class12: {...}} — convert to {class10Results: [...], class12Results: [...]}
      if (rawBoardResults.class10 !== undefined || rawBoardResults.class12 !== undefined) {
        return {
          class10Results: Array.isArray(rawBoardResults.class10) ? rawBoardResults.class10 : (rawBoardResults.class10 ? [rawBoardResults.class10] : []),
          class12Results: Array.isArray(rawBoardResults.class12) ? rawBoardResults.class12 : (rawBoardResults.class12 ? [rawBoardResults.class12] : []),
        };
      }
      return rawBoardResults;
    })();

    const academicResultsPayload = {
      lead_paragraph: String(mergedProfileData.resultsHighlights || mergedProfileData.academicResults?.lead_paragraph || '').trim(),
      board_results: normalizedBoardResults,
    };

    const facilitiesPayload = facilityIds.length > 0
      ? facilityIds
      : Array.isArray(compiledSections.facilities?.facilities)
      ? compiledSections.facilities.facilities
      : (mergedProfileData.facilities || []);

    const schoolProfilesPayload: Record<string, any> = {
      udise_code: udiseCode,
      about: String(mergedProfileData.aboutText || mergedProfileData.about_school || compiledSections.about?.text || '').trim(),
      logo_url: String(resolvedLogo || '').trim(),
      campus_image_url: String(resolvedHeroImage || '').trim(),
      school_snapshot: snapshotPayload,
      video_gallery: videoGalleryPayload,
      faqs: Array.isArray(mergedProfileData.faqs || compiledSections.faqs?.faqs)
        ? (mergedProfileData.faqs || compiledSections.faqs?.faqs)
        : [],
      fees_table: Array.isArray(mergedProfileData.feeTable || mergedProfileData.feeTableData || mergedProfileData.fee_structure || compiledSections.fees?.table)
        ? (mergedProfileData.feeTable || mergedProfileData.feeTableData || mergedProfileData.fee_structure || compiledSections.fees?.table)
        : [],
      important_dates_guidelines: importantDatesPayload,
      admission_desk_contacts: admissionDeskPayload,
      academic_results: academicResultsPayload,
      facilities: facilitiesPayload,
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
      console.warn('[school-profile-save] school_profiles 16-column upsert warning:', profErr.message);
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

    // 5. Purge Next.js ISR + Cloudflare edge cache for this school profile & directory
    try {
      const toSeg = (val: string, fallback: string) =>
        (val || fallback).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || fallback;
      const stateSlug = toSeg(String(mergedProfileData.state || baseRow?.state_name || ''), 'delhi');
      const districtSlug = toSeg(String(mergedProfileData.district || baseRow?.district_name || ''), 'delhi');
      const villageSlug = toSeg(
        String(mergedProfileData.village || mergedProfileData.city || baseRow?.village_ward || baseRow?.locality || ''),
        'main'
      );
      const nameSlug = toSeg(String(mergedProfileData.schoolName || baseRow?.school_name || ''), '');
      const basePath = `/school/${stateSlug}/${districtSlug}/${villageSlug}/${udiseCode}`;
      const pathsToPurge = [basePath, ...(nameSlug ? [`${basePath}/${nameSlug}`] : []), '/schools'];
      await revalidateAndPurgePaths(pathsToPurge);
    } catch (purgeErr) {
      console.warn('[school-profile-save] cache purge warning:', purgeErr);
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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const udise = String(url.searchParams.get('udise') || url.searchParams.get('code') || '').replace(/\D/g, '').trim();

    if (!udise || udise.length < 6) {
      return NextResponse.json(
        { success: false, error: 'INVALID_UDISE', message: 'Valid UDISE code is required' },
        { status: 400 }
      );
    }

    const { data: profRow, error } = await schoolSearchSupabase
      .from('school_profiles')
      .select('*')
      .eq('udise_code', udise)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'DB_ERROR', message: error.message },
        { status: 500 }
      );
    }

    if (!profRow) {
      const baseRow = await fetchBaseSchoolRow(udise);
      if (baseRow) {
        return NextResponse.json({
          success: true,
          found: true,
          isCustomized: false,
          udiseCode: udise,
          profileData: {
            udiseCode: udise,
            schoolName: baseRow.school_name || '',
            aboutText: '',
            logoImage: '',
            heroImage: '',
            establishedYear: baseRow.year_established || '',
            campusArea: '',
            board: baseRow.board_12th || baseRow.board_10th || '',
            schoolType: baseRow.school_management || 'Private Unaided',
            school_gender: baseRow.school_type || 'Co-Educational',
            genderType: baseRow.school_type || 'Co-Educational',
            totalStudents: Number(baseRow.total_students) || 0,
            totalTeachers: Number(baseRow.total_teachers) || 0,
            studentTeacherRatio: (baseRow.total_students && baseRow.total_teachers) ? `1:${Math.round(baseRow.total_students / baseRow.total_teachers)}` : '',
            classFrom: baseRow.class_from ? String(baseRow.class_from) : '',
            classTo: baseRow.class_to ? String(baseRow.class_to) : '',
            state: baseRow.state_name || '',
            district: baseRow.district_name || '',
            pincode: baseRow.pincode || '',
            campusVideoUrl: '',
            gallery: [],
            galleryItems: [],
            faqs: [],
            feeTable: [],
            feeTableData: [],
            dueDates: [],
            requiredDocuments: [],
            admissionDeskContacts: [],
            resultsHighlights: '',
            boardResults: {},
            facilities: [],
            facility_ids: [],
            sectionVisibility: {},
          },
          overview: {
            aboutText: '',
            heroImage: '',
            logoImage: '',
            gallery: [],
            faqs: [],
          },
          gallery: [],
        });
      }

      return NextResponse.json(
        { success: false, found: false, message: `No profile or base school record found for UDISE ${udise}` },
        { status: 404 }
      );
    }

    // Assemble profile data cleanly from the 16 modular columns
    const snapshot = (profRow.school_snapshot && typeof profRow.school_snapshot === 'object') ? profRow.school_snapshot : {};
    const videoGallery = (profRow.video_gallery && typeof profRow.video_gallery === 'object') ? profRow.video_gallery : {};
    const importantDates = (profRow.important_dates_guidelines && typeof profRow.important_dates_guidelines === 'object') ? profRow.important_dates_guidelines : {};
    const academicResults = (profRow.academic_results && typeof profRow.academic_results === 'object') ? profRow.academic_results : {};
    const deskContacts = Array.isArray(profRow.admission_desk_contacts) ? profRow.admission_desk_contacts : [];
    const galleryImages = Array.isArray(videoGallery.images) ? videoGallery.images : [];

    const compiledProfileData: Record<string, any> = {
      udiseCode: udise,
      aboutText: profRow.about || '',
      logoImage: profRow.logo_url || '',
      heroImage: profRow.campus_image_url || '',
      establishedYear: snapshot.established_year || '',
      campusArea: snapshot.campus_area || '',
      board: snapshot.board || '',
      schoolType: snapshot.school_type || 'Private Unaided',
      school_gender: snapshot.school_gender || 'Co-Educational',
      genderType: snapshot.school_gender || 'Co-Educational',
      totalStudents: snapshot.total_students || 0,
      totalTeachers: snapshot.total_teachers || 0,
      studentTeacherRatio: snapshot.student_teacher_ratio || '',
      classFrom: snapshot.class_from || '',
      classTo: snapshot.class_to || '',

      campusVideoUrl: videoGallery.video_url || '',
      gallery: galleryImages,
      galleryItems: galleryImages,

      faqs: Array.isArray(profRow.faqs) ? profRow.faqs : [],
      feeTable: Array.isArray(profRow.fees_table) ? profRow.fees_table : [],
      feeTableData: Array.isArray(profRow.fees_table) ? profRow.fees_table : [],

      academicSession: importantDates.academic_session || '2026-2027',
      admissionStatus: importantDates.admission_status || 'Open',
      dueDates: importantDates.due_dates || [],
      requiredDocuments: importantDates.required_documents || [],
      admissionProcess: importantDates.guidelines || '',

      admissionDeskContacts: deskContacts,
      phone: deskContacts[0]?.phone || '',
      email: deskContacts[0]?.email || '',

      resultsHighlights: academicResults.lead_paragraph || '',
      boardResults: academicResults.board_results || academicResults.boardResults || {},

      facilities: Array.isArray(profRow.facilities) ? profRow.facilities : [],
      facility_ids: Array.isArray(profRow.facilities) ? profRow.facilities : [],

      sectionVisibility: profRow.section_visibility || {},
      updatedAt: profRow.updated_at,
    };

    return NextResponse.json({
      success: true,
      found: true,
      udiseCode: udise,
      profileData: compiledProfileData,
      overview: {
        aboutText: profRow.about || '',
        heroImage: profRow.campus_image_url || '',
        logoImage: profRow.logo_url || '',
        gallery: galleryImages,
        faqs: Array.isArray(profRow.faqs) ? profRow.faqs : [],
      },
      gallery: galleryImages,
      updatedAt: profRow.updated_at,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: err.message },
      { status: 500 }
    );
  }
}
