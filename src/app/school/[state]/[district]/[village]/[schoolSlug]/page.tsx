import React from 'react';
import { Metadata } from 'next';
import {
  schoolSearchSupabase,
  cleanSchoolCategory,
  cleanManagementDesc,
  cleanRuralUrban,
  cleanBoardName,
  cleanMediumName,
  cleanGenderType,
  cleanCodePrefix
} from '@/integrations/supabase/schoolSearchClient';
import { SCHOOLS_DATA, SchoolRecord } from '@/data/schoolFinderData';
import SchoolProfileView from './SchoolProfileView';
import { SchoolTemplateProvider, PLACEHOLDER_EMPTY_IMAGE } from '@/components/schools/template/SchoolTemplateContext';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

// Zero caching: Refreshing or reopening browser fetches live from Supabase
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper to retrieve official AI synced profile data from sync store
function getSyncedProfileData(udiseCode: string, cleanSlug: string): any {
  try {
    const tokensFile = path.join(process.cwd(), 'src', 'data', 'school_ai_sync_tokens.json');
    if (fs.existsSync(tokensFile)) {
      const store = JSON.parse(fs.readFileSync(tokensFile, 'utf8'));
      const tokens = store.tokens || {};
      const targetCode = (udiseCode || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
      const cleanSlugNorm = cleanSlug.replace(/[^a-z0-9]/gi, '').toLowerCase();

      // Check exact UDISE magic token first
      if (targetCode && tokens[`csl_ai_magic_${targetCode}`]?.profileData) {
        return tokens[`csl_ai_magic_${targetCode}`].profileData;
      }
      if (targetCode && tokens[`csl_ai_magic_${targetCode.toUpperCase()}`]?.profileData) {
        return tokens[`csl_ai_magic_${targetCode.toUpperCase()}`].profileData;
      }

      for (const tKey of Object.keys(tokens)) {
        const rec = tokens[tKey];
        const recSchoolId = (rec.schoolId || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
        const recUdise = (rec.profileData?.udiseCode || '').replace(/[^a-z0-9]/gi, '').toLowerCase();

        if (
          (targetCode && targetCode.length >= 6 && (recSchoolId === targetCode || recUdise === targetCode)) ||
          (cleanSlugNorm && tKey.toLowerCase().includes(cleanSlugNorm))
        ) {
          return rec.profileData || null;
        }
      }
    }
  } catch (err) {
    console.warn('Error reading sync token store in page.tsx:', err);
  }
  return null;
}

interface PageProps {
  params: Promise<{
    state: string;
    district: string;
    village: string;
    schoolSlug: string;
  }>;
}

// Helper to map SchoolRecord from seed data to profile format
function mapSeedSchoolToRecord(s: SchoolRecord, fallbackState: string, fallbackDistrict: string, fallbackVillage: string) {
  return {
    id: s.id,
    school_id: s.school_id || s.id,
    school_name: s.school_name || s.name,
    udise_code: s.udise_code || s.udiseCode || '',
    state_name: s.state_name || s.state || fallbackState,
    district_name: s.district_name || fallbackDistrict,
    block_name: s.block_name || fallbackVillage,
    village_name: s.village_ward || s.locality || fallbackVillage,
    pincode: s.pincode,
    address: s.address,
    latitude: s.latitude || s.lat,
    longitude: s.longitude || s.lng,
    school_category: s.school_category || s.category_desc,
    management_type: s.management_type,
    management_desc: s.management_desc_state || s.management || s.management_type,
    class_from: s.class_from || '1',
    class_to: s.class_to || '12',
    school_type: s.school_type || s.gender,
    gender_type: s.school_type || s.gender,
    rural_urban: s.rural_urban,
    pm_shri: s.pm_shri,
    headmaster_principal_name: s.headmaster_principal_name || s.principalName,
    principal_name: s.headmaster_principal_name || s.principalName,
    phone: s.phone,
    email: s.email,
    website: s.website,
    board_10th: s.board_secondary_10th || s.board,
    board_12th: s.board_higher_secondary_12th || s.board,
    primary_medium: s.medium_of_instruction_1 || s.medium,
    total_students: s.total_students || 0,
    total_boys: s.total_boys || 0,
    total_girls: s.total_girls || 0,
    total_teachers: s.total_teachers || 0,
    male_teachers: s.male_teachers || 0,
    female_teachers: s.female_teachers || 0,
    total_classrooms: s.classrooms_total || 0,
    working_smart_boards: s.digital_boards_working || 0,
    tinkering_lab_atl: s.tinkering_lab_atl,
    atal_stem_lab: s.tinkering_lab_atl === 'Yes' || s.tinkering_lab_atl === true ? 'Yes' : 'No',
    ict_lab: s.ict_lab,
    computer_ict_lab: s.ict_lab === 'Yes' || s.ict_lab === true ? 'Yes' : 'No',
    integrated_science_lab: s.integrated_science_lab,
    library: s.library,
    playground: s.playground,
    playground_available: s.playground === 'Yes' || s.playground === true ? 'Yes' : 'No',
    annual_fee: s.annual_fee,
    annual_fee_formatted: s.annual_fee_formatted,
    established_year: s.established_year,
    image_url: s.image,
    rating: s.rating,
    reviews: s.reviews,
    facilities: s.facilities,
  };
}

// Robust database school lookup helper
async function fetchSchoolRecord(state: string, district: string, village: string, cleanSlug: string) {
  const rawClean = cleanSlug.replace(/\.html$/i, '').trim();
  const digitsOnly = rawClean.replace(/\D/g, '');

  // 0. Check local sync tokens store (Instant & authoritative for newly added/synced schools)
  const syncedData = getSyncedProfileData(digitsOnly, rawClean);
  if (syncedData) {
    const ident = syncedData.schoolIdentity || {};
    const loc = syncedData.contact?.campusLocation || {};
    const name = ident.schoolName || syncedData.schoolName || rawClean.replace(/[-_]/g, ' ');
    const st = loc.state || syncedData.state || state;
    const dist = loc.district || syncedData.district || district;
    const vill = loc.village || syncedData.village || village;
    const addr = loc.streetAddress || syncedData.address || `${vill}, ${dist}, ${st}`;
    const udise = ident.udiseCode || syncedData.udiseCode || digitsOnly;
    const board = ident.board || syncedData.board || 'CBSE';
    const totalStudents = Number(syncedData.totalStudents || ident.totalStudents || syncedData.home?.statisticsBar?.find((s: any) => s.id === 'stat_students')?.value?.replace(/\D/g, '') || 0);
    const totalTeachers = Number(syncedData.totalTeachers || syncedData.home?.statisticsBar?.find((s: any) => s.id === 'stat_faculty')?.value?.replace(/\D/g, '') || 0);
    const classroomsCount = Number(syncedData.classroomsCount || syncedData.home?.statisticsBar?.find((s: any) => s.id === 'stat_classrooms')?.value?.replace(/\D/g, '') || 0);

    return {
      id: udise,
      school_id: udise,
      school_name: name,
      udise_code: udise,
      state_name: st,
      district_name: dist,
      block_name: loc.block || vill,
      village_name: vill,
      pincode: loc.pincode || syncedData.pincode || '',
      address: addr,
      latitude: syncedData.contact?.latitude || null,
      longitude: syncedData.contact?.longitude || null,
      school_category: ident.schoolCategory || syncedData.schoolCategory || '',
      management_type: ident.management || syncedData.management || '',
      management_desc: ident.management || syncedData.management || '',
      class_from: ident.classFrom || syncedData.classFrom || '',
      class_to: ident.classTo || syncedData.classTo || '',
      school_type: ident.schoolType || syncedData.schoolType || '',
      gender_type: ident.genderType || syncedData.genderType || '',
      rural_urban: syncedData.ruralUrban || '',
      headmaster_principal_name: syncedData.leadership?.principalName || syncedData.principalName || '',
      principal_name: syncedData.leadership?.principalName || syncedData.principalName || '',
      phone: syncedData.contact?.contactDesks?.[0]?.phone || syncedData.phone || '',
      email: syncedData.contact?.contactDesks?.[0]?.email || syncedData.email || '',
      website: syncedData.contact?.website || syncedData.website || '',
      board_10th: board,
      board_12th: board,
      primary_medium: ident.mediumOfInstruction || syncedData.medium || '',
      total_students: totalStudents,
      total_boys: Number(syncedData.totalBoys || 0),
      total_girls: Number(syncedData.totalGirls || 0),
      total_teachers: totalTeachers,
      male_teachers: Number(syncedData.maleTeachers || 0),
      female_teachers: Number(syncedData.femaleTeachers || 0),
      total_classrooms: classroomsCount,
      working_smart_boards: Number(syncedData.workingSmartBoards || 0),
      tinkering_lab_atl: syncedData.facilities?.items?.some((f: any) => (f.name || f.title || '').toLowerCase().includes('tinkering')) ? 'Yes' : 'No',
      atal_stem_lab: syncedData.facilities?.items?.some((f: any) => (f.name || f.title || '').toLowerCase().includes('stem')) ? 'Yes' : 'No',
      ict_lab: syncedData.facilities?.items?.some((f: any) => (f.name || f.title || '').toLowerCase().includes('computer')) ? 'Yes' : 'No',
      computer_ict_lab: syncedData.facilities?.items?.some((f: any) => (f.name || f.title || '').toLowerCase().includes('computer')) ? 'Yes' : 'No',
      integrated_science_lab: syncedData.facilities?.items?.some((f: any) => (f.name || f.title || '').toLowerCase().includes('science')) ? 'Yes' : 'No',
      library: syncedData.facilities?.items?.some((f: any) => (f.name || f.title || '').toLowerCase().includes('library')) ? 'Yes' : 'No',
      playground: syncedData.facilities?.items?.some((f: any) => (f.name || f.title || '').toLowerCase().includes('playground')) ? 'Yes' : 'No',
      playground_available: syncedData.facilities?.items?.some((f: any) => (f.name || f.title || '').toLowerCase().includes('playground')) ? 'Yes' : 'No',
      annual_fee: syncedData.annual_fee || 0,
      annual_fee_formatted: syncedData.annual_fee_formatted || '',
      established_year: ident.establishedYear || syncedData.establishedYear || '',
      image_url: syncedData.heroImage || PLACEHOLDER_EMPTY_IMAGE,
      image: syncedData.heroImage || PLACEHOLDER_EMPTY_IMAGE,
      rating: 0,
      reviews: 0,
      facilities: syncedData.facilities?.items || [],
      affiliation_number: ident.affiliationNumber || syncedData.affiliationNumber || '',
    };
  }

  // 1. Check local authoritative seed data first (instant & reliable)
  const localMatch = SCHOOLS_DATA.find((s) => {
    const sUdise = (s.udise_code || s.udiseCode || '').replace(/\D/g, '');
    const sId = String(s.school_id || s.id || '').toLowerCase();
    const sNameSlug = (s.school_name || s.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sShortSlug = (s.shortName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const targetClean = rawClean.toLowerCase();

    return (
      (digitsOnly.length >= 6 && sUdise === digitsOnly) ||
      sUdise === rawClean ||
      sId === targetClean ||
      sNameSlug === targetClean ||
      sShortSlug === targetClean ||
      (targetClean.length > 5 && (sNameSlug.includes(targetClean) || targetClean.includes(sNameSlug)))
    );
  });

  if (localMatch) {
    return mapSeedSchoolToRecord(localMatch, state, district, village);
  }

  try {
    // 2. Direct indexed match by exact UDISE code in Supabase
    if (digitsOnly.length >= 6) {
      const candidates = [
        rawClean,
        digitsOnly,
        '0' + digitsOnly,
        digitsOnly.replace(/^0+/, '')
      ];
      const { data: uData } = await schoolSearchSupabase
        .from('udise_private_schools')
        .select('*')
        .in('udise_code', candidates)
        .limit(1);

      if (uData && uData.length > 0) return uData[0];
    }

    // 3. Direct match by school_id
    const { data: idData } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('*')
      .eq('school_id', rawClean)
      .limit(1);

    if (idData && idData.length > 0) return idData[0];

    const normalizedSchoolName = rawClean.replace(/[-_]/g, ' ').trim();
    const firstWord = normalizedSchoolName.split(' ')[0] || normalizedSchoolName;
    const words = normalizedSchoolName.split(' ').filter((w: string) => w.length > 2);
    const searchWord = words.length > 1 ? words.slice(0, 2).join(' ') : firstWord;

    // 4. Try matching with district + school name prefix
    const { data: dData } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('*')
      .ilike('district_name', `%${district.trim()}%`)
      .ilike('school_name', `${searchWord}%`)
      .limit(10);

    if (dData && dData.length > 0) {
      const exactMatch = dData.find((s: any) =>
        s.school_name.toLowerCase().includes(normalizedSchoolName.toLowerCase()) ||
        normalizedSchoolName.toLowerCase().includes(s.school_name.toLowerCase())
      );
      if (exactMatch) return exactMatch;
      return dData[0];
    }

    // 5. Fallback matching anywhere in state
    if (state) {
      const { data: anyData } = await schoolSearchSupabase
        .from('udise_private_schools')
        .select('*')
        .ilike('state_name', `%${state.trim()}%`)
        .ilike('school_name', `${firstWord}%`)
        .limit(1);

      if (anyData && anyData.length > 0) return anyData[0];
    }
  } catch (err) {
    console.warn('DB lookup error:', err);
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const state = decodeURIComponent(resolvedParams.state || 'Haryana');
  const district = decodeURIComponent(resolvedParams.district || 'District');
  const village = decodeURIComponent(resolvedParams.village || 'Village');
  const cleanSlug = decodeURIComponent(resolvedParams.schoolSlug || 'school').replace(/\.html$/i, '');
  const fallbackSchoolName = cleanSlug.replace(/[-_]/g, ' ');

  const dbSchool = await fetchSchoolRecord(state, district, village, cleanSlug);
  const udise = dbSchool?.udise_code || '';
  const synced = getSyncedProfileData(udise, cleanSlug);

  const displayName = synced?.schoolIdentity?.schoolName || synced?.schoolName || dbSchool?.school_name || fallbackSchoolName;
  const displayVillage = synced?.contact?.campusLocation?.village || synced?.village || dbSchool?.village_name || village;
  const displayDistrict = synced?.contact?.campusLocation?.district || synced?.district || dbSchool?.district_name || district;
  const displayState = synced?.contact?.campusLocation?.state || synced?.state || dbSchool?.state_name || state;
  const pincode = (synced?.contact?.campusLocation?.pincode || synced?.pincode || dbSchool?.pincode ? String(synced?.contact?.campusLocation?.pincode || synced?.pincode || dbSchool.pincode).replace(/\.0$/, '') : '');
  const board = (synced?.schoolIdentity?.board || synced?.board || dbSchool?.board_12th || dbSchool?.board_10th || 'CBSE').replace(/^\d+-/, '');

  const canonicalUrl = `https://schoolsearch.cseel.org/school/${encodeURIComponent(displayState)}/${encodeURIComponent(displayDistrict)}/${encodeURIComponent(displayVillage)}/${cleanSlug}.html`;
  
  // High-CTR, High Search-Intent Google Title (Fees, Admissions, Location & UDISE)
  const metaTitle = `${displayName}, ${displayVillage} (${displayDistrict}) - Fees, Admissions, UDISE & Info | CSEEL`;
  
  // Rich, Objective Google Snippet Description (No superlative claims)
  const metaDesc = `${displayName} in ${displayVillage}, ${displayDistrict}, ${displayState}${pincode ? ` (${pincode})` : ''}. UDISE: ${udise || 'Verified'}. Affiliated with ${board}. Check fee structure, admission guidelines, curriculum, facilities & verified contact details.`;
  
  const metaImage = synced?.heroImage || synced?.logoImage || dbSchool?.image_url || 'https://schoolsearch.cseel.org/images/cseel-science-slide-1.jpg';

  // Parents' High-Intent Google Search Query Keywords
  const keywordsList = [
    displayName,
    `${displayName} fees`,
    `${displayName} fee structure 2026-27`,
    `${displayName} admission 2026-27`,
    `${displayName} nursery admission`,
    `${displayName} ${displayVillage}`,
    `${displayName} ${displayDistrict}`,
    `${displayName} ${displayVillage} ${displayDistrict}`,
    `${displayName} contact number`,
    `${displayName} cbse affiliation`,
    `${displayName} curriculum`,
    `${displayName} reviews`,
    `schools in ${displayVillage}`,
    `schools in ${displayDistrict}`,
    `experiential learning schools in ${displayDistrict}`,
    udise ? `UDISE ${udise}` : '',
    pincode ? `schools in ${pincode}` : '',
    `CSEEL School Directory`
  ].filter(Boolean);

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: keywordsList,
    metadataBase: new URL('https://schoolsearch.cseel.org'),
    other: {
      'geo.region': `IN-${displayState}`,
      'geo.placename': `${displayVillage}, ${displayDistrict}, ${displayState}${pincode ? ` ${pincode}` : ''}`,
      'geo.position': `${dbSchool?.latitude || 28.1405};${dbSchool?.longitude || 77.3259}`,
      'ICBM': `${dbSchool?.latitude || 28.1405}, ${dbSchool?.longitude || 77.3259}`,
      'subject': `School profile for ${displayName} in ${displayVillage}, ${displayDistrict}`,
      'Classification': 'Education / School Directory',
      'target': 'all',
      'audience': 'Parents, Students, Educators',
      'coverage': 'India',
      'distribution': 'Global',
      'rating': 'General',
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      type: 'website',
      url: canonicalUrl,
      siteName: 'CSEEL School Directory',
      locale: 'en_IN',
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: `${displayName} - ${displayVillage}, ${displayDistrict}, ${displayState}`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [metaImage],
      site: '@CSEEL_Org',
      creator: '@CSEEL_Org',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function SchoolPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawState = decodeURIComponent(resolvedParams.state || 'Haryana');
  const rawDistrict = decodeURIComponent(resolvedParams.district || 'District');
  const rawVillage = decodeURIComponent(resolvedParams.village || 'Village');
  const rawSlug = decodeURIComponent(resolvedParams.schoolSlug || 'school');

  const cleanSlug = rawSlug.replace(/\.html$/i, '');
  const fallbackSchoolName = cleanSlug.replace(/[-_]/g, ' ');

  // Fetch school from Supabase
  const schoolData = await fetchSchoolRecord(rawState, rawDistrict, rawVillage, cleanSlug);

  // If accessed via digits-only UDISE without school name, redirect to canonical named URL
  const schoolNameParam = (resolvedParams as any).schoolName;
  const isUdiseDigits = /^\d+$/.test(cleanSlug);
  if (!schoolNameParam && isUdiseDigits) {
    const udise = schoolData?.udise_code || cleanSlug;
    const synced = getSyncedProfileData(udise, cleanSlug);
    const targetName = synced?.schoolName || schoolData?.school_name || '';
    if (targetName) {
      const nameSlug = targetName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (nameSlug && nameSlug !== cleanSlug) {
        const stateSlug = encodeURIComponent(rawState.toLowerCase().replace(/ /g, '-'));
        const distSlug = encodeURIComponent(rawDistrict.toLowerCase().replace(/ /g, '-'));
        const villSlug = encodeURIComponent(rawVillage.toLowerCase().replace(/ /g, '-'));
        redirect(`/school/${stateSlug}/${distSlug}/${villSlug}/${cleanSlug}/${nameSlug}`);
      }
    }
  }

  let clusterSchools: any[] = [];
  let districtSchools: any[] = [];

  try {
    // Fetch sibling district schools
    const { data: dSchools } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('school_id, school_name, district_name, village_name, state_name, udise_code, total_students, board_10th, management_desc')
      .ilike('district_name', `%${rawDistrict.trim()}%`)
      .limit(8);

    if (dSchools && dSchools.length > 0) {
      districtSchools = dSchools.filter((s: any) => s.school_name !== (schoolData?.school_name || fallbackSchoolName)).slice(0, 4);
      clusterSchools = dSchools.slice(4, 7);
    }
  } catch (err) {
    console.warn('Error fetching sibling schools:', err);
  }

  // Fallback sibling schools from seed data
  if (districtSchools.length === 0) {
    const currentUdise = schoolData?.udise_code || cleanSlug;
    const currentName = (schoolData?.school_name || fallbackSchoolName).toLowerCase();
    const otherSeedSchools = SCHOOLS_DATA.filter((s) => {
      const sU = s.udise_code || s.udiseCode;
      const sN = (s.school_name || s.name || '').toLowerCase();
      return sU !== currentUdise && sN !== currentName;
    });

    districtSchools = otherSeedSchools.slice(0, 4).map((s) => ({
      school_id: s.school_id || s.id,
      school_name: s.school_name || s.name,
      district_name: s.district_name,
      village_name: s.village_ward,
      state_name: s.state_name,
      udise_code: s.udise_code,
      total_students: s.total_students,
      board_10th: s.board_secondary_10th || s.board,
      management_desc: s.management_desc_state || s.management_type,
    }));

    clusterSchools = otherSeedSchools.slice(4, 7).map((s) => ({
      school_id: s.school_id || s.id,
      school_name: s.school_name || s.name,
      district_name: s.district_name,
      village_name: s.village_ward,
      state_name: s.state_name,
      udise_code: s.udise_code,
      total_students: s.total_students,
      board_10th: s.board_secondary_10th || s.board,
      management_desc: s.management_desc_state || s.management_type,
    }));
  }

  // Format variables strictly from Supabase record or template mode
  const isTemplate = cleanSlug === 'template' || cleanSlug === 'school-template';
  const cleanDigits = (cleanSlug || '').replace(/\D/g, '');
  
  const rawCleanCode = (cleanSlug || '').replace(/\.html$/i, '').trim();
  const targetUdise = cleanDigits || schoolData?.udise_code || rawCleanCode;

  let dbProfileJson: any = null;
  let profRow: any = null;
  if (targetUdise) {
    try {
      const res = await schoolSearchSupabase
        .from('school_profiles')
        .select('*')
        .eq('udise_code', targetUdise)
        .maybeSingle();
      profRow = res.data;
      if (profRow) {
        const rawProfile = typeof profRow.profile_data === 'string' ? JSON.parse(profRow.profile_data) : (profRow.profile_data || {});
        // Priority: dedicated section columns override profile_data
        dbProfileJson = {
          ...rawProfile,
          ...(profRow.basic_info && Object.keys(profRow.basic_info).length > 0 ? { basic_info: profRow.basic_info } : {}),
          ...(profRow.hero && Object.keys(profRow.hero).length > 0 ? { hero: profRow.hero, ...profRow.hero } : {}),
          ...(profRow.stats && Object.keys(profRow.stats).length > 0 ? { stats: profRow.stats, ...profRow.stats } : {}),
          ...(profRow.about && Object.keys(profRow.about).length > 0 ? { about: profRow.about, ...profRow.about } : {}),
          ...(profRow.principal && Object.keys(profRow.principal).length > 0 ? { principal: profRow.principal } : {}),
          ...(profRow.management && Object.keys(profRow.management).length > 0 ? { management: profRow.management } : {}),
          ...(profRow.academics && Object.keys(profRow.academics).length > 0 ? { academics: profRow.academics } : {}),
          ...(profRow.results && Object.keys(profRow.results).length > 0 ? { results: profRow.results } : {}),
          ...(profRow.facilities && (Array.isArray(profRow.facilities) ? profRow.facilities.length > 0 : Object.keys(profRow.facilities).length > 0)
            ? {
                facilities: Array.isArray(profRow.facilities)
                  ? profRow.facilities
                  : Array.isArray(profRow.facilities.facilities_list)
                  ? profRow.facilities.facilities_list
                  : rawProfile.facilities || [],
                facilitiesMeta: !Array.isArray(profRow.facilities) ? profRow.facilities : undefined,
              }
            : {}),
          ...(profRow.gallery && (Array.isArray(profRow.gallery) ? profRow.gallery.length > 0 : Object.keys(profRow.gallery).length > 0)
            ? {
                gallery: profRow.gallery,
                galleryItems: Array.isArray(profRow.gallery)
                  ? profRow.gallery
                  : Array.isArray(profRow.gallery.gallery_items)
                  ? profRow.gallery.gallery_items
                  : rawProfile.galleryItems,
              }
            : {}),
          ...(profRow.fees && Object.keys(profRow.fees).length > 0 ? { fees: profRow.fees } : {}),
          ...(profRow.admissions && Object.keys(profRow.admissions).length > 0 ? { admissions: profRow.admissions } : {}),
          ...(profRow.faqs && (Array.isArray(profRow.faqs) ? profRow.faqs.length > 0 : Object.keys(profRow.faqs).length > 0)
            ? {
                faqs: Array.isArray(profRow.faqs)
                  ? profRow.faqs
                  : Array.isArray(profRow.faqs.faq_items)
                  ? profRow.faqs.faq_items
                  : rawProfile.faqs || [],
              }
            : {}),
          ...(profRow.contact && Object.keys(profRow.contact).length > 0 ? { contact: profRow.contact } : {}),
          ...(profRow.careers && Object.keys(profRow.careers).length > 0 ? { careers: profRow.careers } : {}),
          reviews: Array.isArray(profRow.reviews) && profRow.reviews.length > 0 ? profRow.reviews : (rawProfile.reviews || []),
          likesCount: typeof profRow.likes_count === 'number' ? profRow.likes_count : (rawProfile.likesCount || 0),
          sectionVisibility: profRow.section_visibility || rawProfile.sectionVisibility || {},
        };
      }
    } catch (profErr) {
      console.warn('Error reading live school_profiles from Supabase:', profErr);
    }
  }

  // 2. Fetch from local sync tokens store as fallback/base
  const localSyncedData = getSyncedProfileData(schoolData?.udise_code || rawCleanCode || cleanDigits, cleanSlug);

  // 3. Deeply merge so no section is lost
  const syncedProfileData: any = {
    ...(localSyncedData || {}),
    ...(dbProfileJson || {}),
    contentOverrides: {
      ...(localSyncedData?.contentOverrides || {}),
      ...(dbProfileJson?.contentOverrides || {}),
    },
    imageOverrides: {
      ...(localSyncedData?.imageOverrides || {}),
      ...(dbProfileJson?.imageOverrides || {}),
    },
    sectionVisibility: {
      ...(localSyncedData?.sectionVisibility || {}),
      ...(dbProfileJson?.sectionVisibility || {}),
    },
    feeTableData: dbProfileJson?.feeTableData || dbProfileJson?.feeTable || dbProfileJson?.fees?.fee_table || localSyncedData?.feeTableData || localSyncedData?.feeTable || undefined,
    feeTable: dbProfileJson?.feeTable || dbProfileJson?.feeTableData || dbProfileJson?.fees?.fee_table || localSyncedData?.feeTable || localSyncedData?.feeTableData || undefined,
    class10Results: dbProfileJson?.class10Results || dbProfileJson?.boardResults?.class10Results || dbProfileJson?.results?.class10Results || localSyncedData?.class10Results || localSyncedData?.boardResults?.class10Results || [],
    class12Results: dbProfileJson?.class12Results || dbProfileJson?.boardResults?.class12Results || dbProfileJson?.results?.class12Results || localSyncedData?.class12Results || localSyncedData?.boardResults?.class12Results || [],
    streamCategories: dbProfileJson?.streamCategories || dbProfileJson?.academics?.stream_categories || localSyncedData?.streamCategories || undefined,
    galleryItems: dbProfileJson?.galleryItems || dbProfileJson?.gallery?.gallery_items || localSyncedData?.galleryItems || undefined,
    heroMediaItems: dbProfileJson?.heroMediaItems || dbProfileJson?.hero?.hero_media_items || localSyncedData?.heroMediaItems || undefined,
    facilities: (Array.isArray(dbProfileJson?.facilities) && dbProfileJson.facilities.length > 0)
      ? dbProfileJson.facilities
      : (Array.isArray(dbProfileJson?.facilities?.facilities_list) && dbProfileJson.facilities.facilities_list.length > 0)
      ? dbProfileJson.facilities.facilities_list
      : (localSyncedData?.facilities || undefined),
  };

  const udiseCode = isTemplate ? '06170100101' : (syncedProfileData?.schoolIdentity?.udiseCode || syncedProfileData?.udiseCode || schoolData?.udise_code || cleanDigits || '');
  const displaySchoolName = isTemplate ? 'Write Your School Name Here' : (syncedProfileData?.schoolIdentity?.schoolName || syncedProfileData?.schoolName || schoolData?.school_name || fallbackSchoolName);
  const displayState = syncedProfileData?.contact?.campusLocation?.state || syncedProfileData?.state || schoolData?.state_name || rawState;
  const displayDistrict = syncedProfileData?.contact?.campusLocation?.district || syncedProfileData?.district || schoolData?.district_name || rawDistrict;
  const displayBlock = syncedProfileData?.contact?.campusLocation?.block || schoolData?.block_name || rawVillage || '';
  const displayVillage = syncedProfileData?.contact?.campusLocation?.village || syncedProfileData?.village || schoolData?.village_name || rawVillage;
  const pincode = cleanCodePrefix(syncedProfileData?.contact?.campusLocation?.pincode || syncedProfileData?.pincode || schoolData?.pincode);
  const management = syncedProfileData?.management || cleanManagementDesc(schoolData?.management_desc) || '';
  const board = syncedProfileData?.schoolIdentity?.board || syncedProfileData?.board || cleanBoardName(schoolData?.board_12th) || cleanBoardName(schoolData?.board_10th) || '';
  const medium = syncedProfileData?.schoolIdentity?.mediumOfInstruction || cleanMediumName(schoolData?.primary_medium) || '';
  const establishedYear = cleanCodePrefix(syncedProfileData?.schoolIdentity?.establishedYear || syncedProfileData?.establishedYear || schoolData?.established_year) || '';
  const totalStudents = Number(syncedProfileData?.totalStudents || syncedProfileData?.schoolIdentity?.totalStudents || schoolData?.total_students) || 0;
  const totalBoys = Number(schoolData?.total_boys || syncedProfileData?.totalBoys || 0);
  const totalGirls = Number(schoolData?.total_girls || syncedProfileData?.totalGirls || 0);
  const totalTeachers = Number(syncedProfileData?.totalTeachers || schoolData?.total_teachers) || 0;
  const maleTeachers = Number(schoolData?.male_teachers || syncedProfileData?.maleTeachers || 0);
  const femaleTeachers = Number(schoolData?.female_teachers || syncedProfileData?.femaleTeachers || 0);
  const classroomsCount = Number(syncedProfileData?.classroomsCount || schoolData?.total_classrooms) || 0;
  const classFrom = cleanCodePrefix(schoolData?.class_from) || '';
  const classTo = cleanCodePrefix(schoolData?.class_to) || '';
  const schoolCategory = cleanSchoolCategory(schoolData?.school_category);
  const genderType = cleanGenderType(schoolData?.gender_type);
  const ruralUrban = cleanRuralUrban(schoolData?.rural_urban);
  const residentialSchool = cleanCodePrefix(
    syncedProfileData?.heroSection?.boardingStatus ||
    syncedProfileData?.residentialSchool ||
    syncedProfileData?.schoolFormat ||
    schoolData?.residential_school
  ) || 'Day School';
  
  const workingSmartBoards = Number(schoolData?.working_smart_boards || syncedProfileData?.workingSmartBoards || 0);
  const computerIctLab = schoolData?.computer_ict_lab || (syncedProfileData?.hasComputerLab ? 'Yes' : 'No');
  const atalStemLab = schoolData?.atal_stem_lab || (syncedProfileData?.hasStemLab ? 'Yes' : 'No');
  const playgroundAvailable = schoolData?.playground_available || (syncedProfileData?.hasPlayground ? 'Yes' : 'No');

  const principalName = syncedProfileData?.leadership?.principalName || syncedProfileData?.principalName || schoolData?.principal_name || '';
  const rawPhone = syncedProfileData?.contact?.contactDesks?.[0]?.phone || syncedProfileData?.phone || (schoolData?.phone ? String(schoolData.phone).replace(/\.0$/, '') : '');
  const rawEmail = syncedProfileData?.contact?.contactDesks?.[0]?.email || syncedProfileData?.email || schoolData?.email || '';
  const website = syncedProfileData?.contact?.website || syncedProfileData?.website || schoolData?.website || '';
  
  const lat = Number(schoolData?.latitude) || 28.1405;
  const lng = Number(schoolData?.longitude) || 77.3259;
  const rawAddress = syncedProfileData?.contact?.campusLocation?.streetAddress || syncedProfileData?.address || (schoolData?.address 
    ? schoolData.address.split('\n')[0] 
    : `${displayVillage}, ${displayBlock ? `${displayBlock}, ` : ''}${displayDistrict}, ${displayState}${pincode ? ` - ${pincode}` : ''}`);

  const pageUrl = `https://schoolsearch.cseel.org/school/${encodeURIComponent(displayState)}/${encodeURIComponent(displayDistrict)}/${encodeURIComponent(displayVillage)}/${cleanSlug}.html`;

  // Dynamic social profiles for Google Knowledge Graph
  const socialSameAs: string[] = [];
  if (syncedProfileData?.socialLinks) {
    const s = syncedProfileData.socialLinks;
    if (s.facebook) socialSameAs.push(s.facebook);
    if (s.instagram) socialSameAs.push(s.instagram);
    if (s.linkedin) socialSameAs.push(s.linkedin);
    if (s.youtube) socialSameAs.push(s.youtube);
    if (s.twitter) socialSameAs.push(s.twitter);
  }

  // Dynamic FAQs for Google Search FAQPage Rich Snippet
  const dynamicFaqList: Array<{ '@type': string; name: string; acceptedAnswer: { '@type': string; text: string } }> = [];
  if (Array.isArray(syncedProfileData?.faqs) && syncedProfileData.faqs.length > 0) {
    syncedProfileData.faqs.forEach((f: any) => {
      const q = f.q || f.question;
      const a = f.a || f.answer;
      if (q && a) {
        dynamicFaqList.push({
          '@type': 'Question',
          name: q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: a,
          },
        });
      }
    });
  }

  if (dynamicFaqList.length === 0) {
    dynamicFaqList.push(
      {
        '@type': 'Question',
        name: `What is the address and UDISE code of ${displaySchoolName} in ${displayVillage}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${displaySchoolName} is located at ${displayVillage}, ${displayDistrict}, ${displayState}${pincode ? ` (PIN: ${pincode})` : ''}. Its official UDISE Code is ${udiseCode || 'Verified'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which board curriculum and medium is followed at ${displaySchoolName}, ${displayDistrict}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${displaySchoolName} is affiliated with ${board} and offers instruction in ${medium} medium from Class ${classFrom} to Class ${classTo}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the fee structure and admission procedure for ${displaySchoolName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Parents can check the verified fee schedules, admission eligibility criteria, and required documents directly on this official profile.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can parents contact ${displaySchoolName} in ${displayVillage}, ${displayDistrict}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Parents can view verified phone numbers, official email, Google Maps directions, and visiting hours on this profile.`,
        },
      }
    );
  }
  
  // Area-Specific Multi-Entity Schema.org Graph for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['School', 'EducationalOrganization', 'LocalBusiness'],
        '@id': `${pageUrl}#school`,
        name: displaySchoolName,
        alternateName: [
          fallbackSchoolName,
          `${displaySchoolName} ${displayVillage}`,
          `${displaySchoolName} ${displayDistrict}`,
          `${displaySchoolName} ${displayState}`
        ],
        description: `Official institutional profile for ${displaySchoolName} located in ${displayVillage}, ${displayDistrict}, ${displayState}${pincode ? ` (${pincode})` : ''}. Operating under UDISE Code ${udiseCode || 'Verified'}, offering ${board} curriculum in ${medium} medium from Class ${classFrom} to ${classTo}.`,
        identifier: udiseCode || undefined,
        image: syncedProfileData?.heroImage || schoolData?.image_url || 'https://schoolsearch.cseel.org/images/cseel-science-slide-1.jpg',
        logo: syncedProfileData?.logoImage || undefined,
        telephone: syncedProfileData?.generalPhone || syncedProfileData?.phone || rawPhone || undefined,
        email: syncedProfileData?.generalEmail || syncedProfileData?.email || rawEmail || undefined,
        sameAs: socialSameAs.length > 0 ? socialSameAs : undefined,
        url: website || pageUrl,
        foundingDate: establishedYear || undefined,
        numberOfEmployees: totalTeachers > 0 ? {
          '@type': 'QuantitativeValue',
          value: totalTeachers,
          unitText: 'Teachers'
        } : undefined,
        address: {
          '@type': 'PostalAddress',
          streetAddress: rawAddress,
          addressLocality: displayVillage,
          addressRegion: `${displayDistrict}, ${displayState}`,
          postalCode: pincode || undefined,
          addressCountry: 'IN',
        },
        areaServed: [
          {
            '@type': 'AdministrativeArea',
            name: displayVillage,
          },
          {
            '@type': 'AdministrativeArea',
            name: displayDistrict,
          },
          {
            '@type': 'AdministrativeArea',
            name: displayState,
          },
        ],
        geo: {
          '@type': 'GeoCoordinates',
          latitude: lat,
          longitude: lng,
        },
        parentOrganization: {
          '@type': 'EducationalOrganization',
          name: 'Center for Scientific Exploration and Experiential Learning (CSEEL)',
          url: 'https://www.cseel.org',
        },
        ...(Number(schoolData?.rating) > 0 ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: String(schoolData.rating),
            bestRating: '5',
            worstRating: '1',
            ratingCount: String(schoolData.reviews_count || schoolData.reviews || 1),
            reviewCount: String(schoolData.reviews_count || schoolData.reviews || 1),
          }
        } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://schoolsearch.cseel.org',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: displayState,
            item: `https://schoolsearch.cseel.org/school-finder?state=${encodeURIComponent(displayState)}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: displayDistrict,
            item: `https://schoolsearch.cseel.org/school-finder?city=${encodeURIComponent(displayDistrict)}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: displayVillage,
            item: `https://schoolsearch.cseel.org/school-finder?city=${encodeURIComponent(displayDistrict)}&search=${encodeURIComponent(displayVillage)}`,
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: displaySchoolName,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: dynamicFaqList,
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${displaySchoolName}, ${displayVillage} (${displayDistrict}) - School Profile | CSEEL`,
        description: `Verified UDISE profile for ${displaySchoolName} in ${displayVillage}, ${displayDistrict}, ${displayState}${pincode ? ` (${pincode})` : ''}.`,
        inLanguage: ['en-IN', 'hi-IN'],
        isPartOf: {
          '@type': 'WebSite',
          name: 'CSEEL School Directory',
          url: 'https://schoolsearch.cseel.org',
        },
      },
    ],
  };

  const effectiveAffiliationNo = syncedProfileData?.schoolIdentity?.affiliationNumber || syncedProfileData?.affiliationNumber || schoolData?.affiliation_number || schoolData?.affiliation_no || '';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SchoolTemplateProvider
        initialData={{
          schoolName: displaySchoolName,
          udiseCode: udiseCode,
          board: board,
          medium: medium,
          principalName: principalName,
          address: rawAddress,
          state: displayState,
          district: displayDistrict,
          village: displayVillage,
          pincode: pincode,
          management: management,
          schoolCategory: schoolCategory,
          classFrom: classFrom,
          classTo: classTo,
          totalStudents: totalStudents,
          totalTeachers: totalTeachers,
          classroomsCount: classroomsCount,
          workingSmartBoards: workingSmartBoards,
          phone: rawPhone,
          email: rawEmail,
          website: website,
          heroImage: (syncedProfileData?.heroImage && !syncedProfileData.heroImage.includes('hero-school-') && !syncedProfileData.heroImage.includes('edunova-hero') && !syncedProfileData.heroImage.includes('default-school-campus') && !syncedProfileData.heroImage.includes('unsplash.com'))
            ? syncedProfileData.heroImage
            : ((schoolData?.image_url && !schoolData.image_url.includes('default-school-campus') && !schoolData.image_url.includes('hero-school-') && !schoolData.image_url.includes('unsplash.com')) ? schoolData.image_url : PLACEHOLDER_EMPTY_IMAGE),
          logoImage: syncedProfileData?.logoImage || syncedProfileData?.imageOverrides?.['school_logo'] || '',
          affiliationNumber: effectiveAffiliationNo,
          contentOverrides: syncedProfileData?.contentOverrides || {},
          imageOverrides: syncedProfileData?.imageOverrides || {},
          iconOverrides: syncedProfileData?.iconOverrides || {},
          facilities: syncedProfileData?.facilities || [],
          admissions: syncedProfileData?.admissions || syncedProfileData?.admissionsCards || [],
          feeTableData: syncedProfileData?.feeTableData || syncedProfileData?.feeTable || undefined,
          boardResults: syncedProfileData?.boardResults || ((syncedProfileData?.class10Results?.length > 0 || syncedProfileData?.class12Results?.length > 0) ? {
            class10Results: syncedProfileData?.class10Results || [],
            class12Results: syncedProfileData?.class12Results || [],
          } : undefined),
          campusVideoUrl: syncedProfileData?.campusVideoUrl || '',
          flipbookSlides: syncedProfileData?.flipbookSlides || [],
          galleryItems: syncedProfileData?.galleryItems || [],
          faqs: (syncedProfileData?.faqItems || syncedProfileData?.faqs || []).map((f: any, idx: number) => ({
            id: f.id || `faq-${idx}`,
            q: f.q || f.question || '',
            a: f.a || f.answer || '',
            category: f.category || 'General',
          })),
          includedAcademicFeatures: syncedProfileData?.includedAcademicFeatures || [],
          heroMediaItems: syncedProfileData?.heroMediaItems || [],
          admissionsOpen: Boolean(syncedProfileData?.admissionsOpen),
          sectionVisibility: syncedProfileData?.sectionVisibility || {},
          tabVisibility: syncedProfileData?.tabVisibility || {},
          aboutText: syncedProfileData?.aboutText || '',
          visionText: syncedProfileData?.visionText || '',
          missionText: syncedProfileData?.missionText || '',
          residentialSchool: residentialSchool,
        }}
        initialEditMode={false}
      >
        <SchoolProfileView
          state={displayState}
          district={displayDistrict}
          blockName={displayBlock}
          village={displayVillage}
          schoolName={displaySchoolName}
          schoolSlug={cleanSlug}
          udiseCode={udiseCode}
          pincode={pincode}
          management={management}
          board={board}
          medium={medium}
          establishedYear={establishedYear}
          totalStudents={totalStudents}
          totalBoys={totalBoys}
          totalGirls={totalGirls}
          totalTeachers={totalTeachers}
          maleTeachers={maleTeachers}
          femaleTeachers={femaleTeachers}
          classroomsCount={classroomsCount}
          classFrom={classFrom}
          classTo={classTo}
          schoolCategory={schoolCategory}
          genderType={genderType}
          ruralUrban={ruralUrban}
          workingSmartBoards={workingSmartBoards}
          computerIctLab={computerIctLab}
          atalStemLab={atalStemLab}
          playgroundAvailable={playgroundAvailable}
          principalName={principalName}
          rawPhone={rawPhone}
          rawEmail={rawEmail}
          website={website}
          rawAddress={rawAddress}
          imageUrl={(syncedProfileData?.heroImage && !syncedProfileData.heroImage.includes('hero-school-') && !syncedProfileData.heroImage.includes('edunova-hero') && !syncedProfileData.heroImage.includes('default-school-campus') && !syncedProfileData.heroImage.includes('unsplash.com'))
            ? syncedProfileData.heroImage
            : ((schoolData?.image_url && !schoolData.image_url.includes('default-school-campus') && !schoolData.image_url.includes('hero-school-') && !schoolData.image_url.includes('unsplash.com')) ? schoolData.image_url : PLACEHOLDER_EMPTY_IMAGE)}
          logoUrl={syncedProfileData?.logoImage || syncedProfileData?.imageOverrides?.['school_logo'] || ''}
          affiliationNumber={syncedProfileData?.schoolIdentity?.affiliationNumber || syncedProfileData?.affiliationNumber || schoolData?.affiliation_number || schoolData?.affiliation_no || ''}
          lat={lat}
          lng={lng}
          clusterSchools={clusterSchools}
          districtSchools={districtSchools}
          isTemplate={isTemplate}
          initialProfileData={syncedProfileData}
          residentialSchool={residentialSchool}
          flipbookSlides={(syncedProfileData?.flipbookSlides || []).map((slide: any) => ({
            ...slide,
            image: (slide.image && !slide.image.includes('hero-school-') && !slide.image.includes('edunova-hero')) ? slide.image : PLACEHOLDER_EMPTY_IMAGE
          }))}
        />
      </SchoolTemplateProvider>
    </>
  );
}
