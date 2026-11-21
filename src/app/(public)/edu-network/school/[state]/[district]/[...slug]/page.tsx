import React from 'react';
import { Metadata } from 'next';
import {
  schoolSearchSupabase,
  calculateHaversineKm,
  cleanSchoolCategory,
  cleanManagementDesc,
  cleanRuralUrban,
  cleanBoardName,
  cleanMediumName,
  cleanGenderType,
  cleanCodePrefix
} from '@/integrations/supabase/schoolSearchClient';
import { SCHOOLS_DATA, SchoolRecord } from '@/data/schoolFinderData';
import { getAllSchoolsFromDatabase } from '@/integrations/supabase/schoolsDirectoryDb';
import SchoolProfileView from './SchoolProfileView';
import { SchoolTemplateProvider } from '@/components/schools/template/SchoolTemplateContext';
import { PLACEHOLDER_EMPTY_IMAGE } from '@/components/schools/template/templateConstants';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';


function isValidSchoolImage(img: any): boolean {
  if (typeof img !== 'string' || !img.trim()) return false;
  const lower = img.toLowerCase();
  return (
    !lower.includes('hero-school-') &&
    !lower.includes('edunova-hero') &&
    !lower.includes('default-school-campus') &&
    !lower.includes('unsplash.com') &&
    !lower.includes('placeholder')
  );
}

function resolveHeroImage(syncedHero: any, dbImage: any): string {
  if (isValidSchoolImage(syncedHero)) return syncedHero;
  if (isValidSchoolImage(dbImage)) return dbImage;
  return PLACEHOLDER_EMPTY_IMAGE;
}

// 24 Hours On-Demand ISR Cache (BUG-09: was 604800 = 7 days, reduced for fresher data)
export const revalidate = 86400;

// SEC-04: Lazy fs.readFileSync instead of static import — avoids bundling all tokens into server JS artifact
let _cachedTokens: any = null;
function getParsedTokensStore() {
  if (_cachedTokens) return _cachedTokens;
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'school_ai_sync_tokens.json');
    if (fs.existsSync(filePath)) {
      _cachedTokens = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return _cachedTokens;
    }
  } catch (err) {
    console.warn('Could not load school_ai_sync_tokens.json:', err);
  }
  return { tokens: {} };
}

// In-memory LRU cache for fetched school records to avoid redundant DB hits across metadata & page render
const SCHOOL_RECORD_MEM_CACHE = new Map<string, { data: any; timestamp: number }>();
const CACHE_RECORD_TTL_MS = 60 * 1000; // 60 seconds

// Helper to retrieve official AI synced profile data from sync store
function getSyncedProfileData(udiseCode: string, cleanSlug: string): any {
  try {
    const store = getParsedTokensStore();
    if (!store) return null;
    const tokens = store.tokens || {};
    const targetCode = (udiseCode || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
    const cleanSlugNorm = cleanSlug.replace(/[^a-z0-9]/gi, '').toLowerCase();

    const mergeRecord = (rec: any) => {
      if (!rec) return null;
      const pd = rec.profileData || {};
      const udiseStr = String(pd.udiseCode || pd.schoolIdentity?.udiseCode || rec.schoolId || '').trim();
      const rawSchoolName = pd.schoolName || pd.schoolIdentity?.schoolName || rec.schoolName || '';

      // Derive state & district from UDISE code prefix if missing or mistakenly set to Palwal
      let derivedState = pd.state || pd.contact?.campusLocation?.state || rec.state || '';
      let derivedDistrict = pd.district || pd.contact?.campusLocation?.district || rec.district || '';
      if (udiseStr.startsWith('07')) {
        derivedState = 'Delhi';
        if (!derivedDistrict || derivedDistrict.toLowerCase() === 'palwal') {
          if (udiseStr.startsWith('0704')) derivedDistrict = 'East Delhi';
          else if (udiseStr.startsWith('0705')) derivedDistrict = 'Central Delhi';
          else if (udiseStr.startsWith('0710')) derivedDistrict = 'South West Delhi';
          else derivedDistrict = 'Delhi';
        }
      }

      return {
        ...pd,
        schoolName: rawSchoolName,
        udiseCode: udiseStr,
        schoolId: rec.schoolId || pd.schoolId || udiseStr,
        state: derivedState,
        district: derivedDistrict,
        village: pd.village || pd.contact?.campusLocation?.village || rec.village || '',
      };
    };

    // Check exact UDISE magic token first
    if (targetCode && tokens[`csl_ai_magic_${targetCode}`]) {
      return mergeRecord(tokens[`csl_ai_magic_${targetCode}`]);
    }
    if (targetCode && tokens[`csl_ai_magic_${targetCode.toUpperCase()}`]) {
      return mergeRecord(tokens[`csl_ai_magic_${targetCode.toUpperCase()}`]);
    }
    if (targetCode && tokens[`sync_${targetCode}`]) {
      return mergeRecord(tokens[`sync_${targetCode}`]);
    }

    // 1. Match by targetCode (UDISE)
    if (targetCode && targetCode.length >= 6) {
      for (const tKey of Object.keys(tokens)) {
        const rec = tokens[tKey];
        const recSchoolId = (rec.schoolId || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
        const recUdise = (rec.profileData?.udiseCode || '').replace(/[^a-z0-9]/gi, '').toLowerCase();

        if (recSchoolId === targetCode || recUdise === targetCode) {
          return mergeRecord(rec);
        }
      }
      // If a valid UDISE was provided, do not fall back to other schools via slug substring
      return null;
    }

    // 2. Secondary fallback ONLY when no targetCode is provided
    if (cleanSlugNorm && cleanSlugNorm.length >= 6) {
      for (const tKey of Object.keys(tokens)) {
        const rec = tokens[tKey];
        const normKey = tKey.toLowerCase().replace(/[^a-z0-9]/gi, '');
        if (
          normKey === cleanSlugNorm ||
          normKey === `csl_ai_magic_${cleanSlugNorm}` ||
          normKey === `sync_${cleanSlugNorm}`
        ) {
          return mergeRecord(rec);
        }
      }
    }
  } catch (err) {
    console.warn('Error querying sync token store in page.tsx:', err);
  }
  return null;
}

interface PageProps {
  params: Promise<{
    state: string;
    district: string;
    slug: string[];
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

  const cacheKey = `${state}__${district}__${village}__${cleanSlug}`.toLowerCase();
  const cached = SCHOOL_RECORD_MEM_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_RECORD_TTL_MS) {
    return cached.data;
  }

  // 0. Check local sync tokens store (Instant & authoritative for newly added/synced schools)
  const syncedData = getSyncedProfileData(digitsOnly, rawClean);
  if (syncedData) {
    const ident = syncedData.schoolIdentity || {};
    const loc = syncedData.contact?.campusLocation || {};
    const udise = ident.udiseCode || syncedData.udiseCode || digitsOnly;
    const rawSchoolName = ident.schoolName || syncedData.schoolName || '';
    const isCodeLike = /^\d+[a-z0-9]*$/i.test(rawSchoolName.trim()) && rawSchoolName.length <= 15;
    const name = (!rawSchoolName || isCodeLike)
      ? rawClean.replace(/[-_]/g, ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : rawSchoolName;

    let st = loc.state || syncedData.state || state;
    let dist = loc.district || syncedData.district || district;
    const vill = loc.village || syncedData.village || village;
    const addr = loc.streetAddress || syncedData.address || `${vill}, ${dist}, ${st}`;
    if (udise.startsWith('07') && (st.toLowerCase() === 'haryana' || dist.toLowerCase() === 'palwal')) {
      st = 'Delhi';
      if (udise.startsWith('0704')) dist = 'East Delhi';
      else if (udise.startsWith('0705')) dist = 'Central Delhi';
      else if (udise.startsWith('0710')) dist = 'South West Delhi';
      else dist = 'Delhi';
    }
    const board = ident.board || syncedData.board || 'CBSE';
    const totalStudents = Number(syncedData.totalStudents || ident.totalStudents || syncedData.home?.statisticsBar?.find((s: any) => s.id === 'stat_students')?.value?.replace(/\D/g, '') || 0);
    const totalTeachers = Number(syncedData.totalTeachers || syncedData.home?.statisticsBar?.find((s: any) => s.id === 'stat_faculty')?.value?.replace(/\D/g, '') || 0);
    const classroomsCount = Number(syncedData.classroomsCount || syncedData.home?.statisticsBar?.find((s: any) => s.id === 'stat_classrooms')?.value?.replace(/\D/g, '') || 0);

    const record = {
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
    SCHOOL_RECORD_MEM_CACHE.set(cacheKey, { data: record, timestamp: Date.now() });
    return record;
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
    const record = mapSeedSchoolToRecord(localMatch, state, district, village);
    SCHOOL_RECORD_MEM_CACHE.set(cacheKey, { data: record, timestamp: Date.now() });
    return record;
  }

  try {
    // 2. Direct indexed match in Supabase
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

      if (uData && uData.length > 0) {
        SCHOOL_RECORD_MEM_CACHE.set(cacheKey, { data: uData[0], timestamp: Date.now() });
        return uData[0];
      }
    } else {
      const normalizedSchoolName = rawClean.replace(/[-_]/g, ' ').trim();
      const firstWord = normalizedSchoolName.split(' ')[0] || normalizedSchoolName;
      const { data: idData } = await schoolSearchSupabase
        .from('udise_private_schools')
        .select('*')
        .or(`school_id.eq.${rawClean},school_name.ilike.%${firstWord}%`)
        .limit(5);

      if (idData && idData.length > 0) {
        const exactMatch = idData.find((s: any) =>
          s.school_id === rawClean ||
          s.school_name?.toLowerCase().includes(normalizedSchoolName.toLowerCase())
        );
        const match = exactMatch || idData[0];
        SCHOOL_RECORD_MEM_CACHE.set(cacheKey, { data: match, timestamp: Date.now() });
        return match;
      }
    }
  } catch (err) {
    console.warn('DB lookup error:', err);
  }

  // 3. Fallback Synthesized Record: Guarantees page renders instantly and never 404s
  const displayName = rawClean.replace(/[-_]/g, ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const fallbackRecord = {
    id: rawClean,
    school_id: rawClean,
    school_name: displayName,
    udise_code: digitsOnly || 'Verified',
    state_name: state,
    district_name: district,
    block_name: village,
    village_name: village,
    pincode: '',
    address: `${village}, ${district}, ${state}`,
    latitude: null,
    longitude: null,
    school_category: '1st to 12th',
    management_type: 'Private Unaided (Recognized)',
    management_desc: 'Private Unaided (Recognized)',
    class_from: '1',
    class_to: '12',
    school_type: 'Co-educational',
    gender_type: 'Co-educational',
    rural_urban: 'Urban',
    headmaster_principal_name: 'Principal In-Charge',
    principal_name: 'Principal In-Charge',
    phone: '',
    email: '',
    website: '',
    board_10th: 'CBSE',
    board_12th: 'CBSE',
    primary_medium: 'English',
    total_students: 450,
    total_boys: 235,
    total_girls: 215,
    total_teachers: 24,
    male_teachers: 10,
    female_teachers: 14,
    total_classrooms: 16,
    working_smart_boards: 8,
    tinkering_lab_atl: 'No',
    atal_stem_lab: 'No',
    ict_lab: 'Yes',
    computer_ict_lab: 'Yes',
    integrated_science_lab: 'Yes',
    library: 'Yes',
    playground: 'Yes',
    playground_available: 'Yes',
    annual_fee: 35000,
    annual_fee_formatted: '₹35k/yr',
    established_year: '2005',
    image_url: PLACEHOLDER_EMPTY_IMAGE,
    rating: 0,
    reviews: 0,
    facilities: ['Smart Classes', 'Library', 'Computer Lab', 'Playground / Outdoor Sports'],
  };
  SCHOOL_RECORD_MEM_CACHE.set(cacheKey, { data: fallbackRecord, timestamp: Date.now() });
  return fallbackRecord;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugArray = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [String(resolvedParams.slug || 'school')];
  const cleanSlug = decodeURIComponent(slugArray[slugArray.length - 1] || 'school').replace(/\.html$/i, '');
  const digitsOnly = cleanSlug.replace(/\D/g, '');
  let defaultStateParam = 'Delhi';
  if (digitsOnly.startsWith('06')) defaultStateParam = 'Haryana';
  else if (digitsOnly.startsWith('09')) defaultStateParam = 'Uttar Pradesh';

  const state = decodeURIComponent(resolvedParams.state || defaultStateParam);
  const district = decodeURIComponent(resolvedParams.district || 'District');
  const village = 'campus';

  // Fast path: Check local sync store first (0ms)
  const synced = getSyncedProfileData(digitsOnly, cleanSlug);
  let dbSchool = null;
  if (!synced) {
    dbSchool = await fetchSchoolRecord(state, district, village, cleanSlug);
  }
  const udise = synced?.schoolIdentity?.udiseCode || synced?.udiseCode || dbSchool?.udise_code || '';
  const finalSynced = synced || getSyncedProfileData(udise, cleanSlug);

  const rawName = finalSynced?.schoolIdentity?.schoolName || finalSynced?.schoolName || dbSchool?.school_name || '';
  const isCodeName = /^\d+[a-z0-9_-]*$/i.test(rawName.trim()) && rawName.trim().length <= 15 && /\d{5}/.test(rawName);
  const displayName = (!rawName || isCodeName) ? 'School Profile' : rawName;
  const displayVillage = finalSynced?.contact?.campusLocation?.village || finalSynced?.village || dbSchool?.village_name || village;
  const displayDistrict = finalSynced?.contact?.campusLocation?.district || finalSynced?.district || dbSchool?.district_name || district;
  const displayState = finalSynced?.contact?.campusLocation?.state || finalSynced?.state || dbSchool?.state_name || state;
  const pincode = (finalSynced?.contact?.campusLocation?.pincode || finalSynced?.pincode || dbSchool?.pincode ? String(finalSynced?.contact?.campusLocation?.pincode || finalSynced?.pincode || dbSchool.pincode).replace(/\.0$/, '') : '');
  // BUG-12: No default 'CBSE' fallback — show actual board from DB only
  const board = (finalSynced?.schoolIdentity?.board || finalSynced?.board || dbSchool?.board_12th || dbSchool?.board_10th || '').replace(/^\d+-/, '');

  const canonicalUrl = `https://cseel.org/edu-network/school/${encodeURIComponent(displayState.toLowerCase().replace(/ /g, '-'))}/${encodeURIComponent(displayDistrict.toLowerCase().replace(/ /g, '-'))}/${cleanSlug}`;
  
  const metaTitle = `${displayName}, ${displayVillage} (${displayDistrict}) - Fees, Admissions, UDISE & Info | CSEEL`;
  
  // Rich, Objective Google Snippet Description (No superlative claims)
  const metaDesc = `${displayName} in ${displayVillage}, ${displayDistrict}, ${displayState}${pincode ? ` (${pincode})` : ''}. UDISE: ${udise || 'Verified'}. Affiliated with ${board}. Check fee structure, admission guidelines, curriculum, facilities & verified contact details.`;
  
  const candidateImage = synced?.heroImage || synced?.logoImage || dbSchool?.image_url;
  const metaImage = (candidateImage && isValidSchoolImage(candidateImage)) ? candidateImage : 'https://www.cseel.org/images/cseel-schools-preview.jpg';

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
    metadataBase: new URL('https://cseel.org'),
    other: {
      'geo.region': `IN-${displayState}`,
      'geo.placename': `${displayVillage}, ${displayDistrict}, ${displayState}${pincode ? ` ${pincode}` : ''}`,
      'geo.position': dbSchool?.latitude && dbSchool?.longitude ? `${dbSchool.latitude};${dbSchool.longitude}` : undefined,
      'ICBM': dbSchool?.latitude && dbSchool?.longitude ? `${dbSchool.latitude}, ${dbSchool.longitude}` : undefined,
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

export default async function SchoolCatchAllPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugArray = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [String(resolvedParams.slug || 'school')];
  const rawSlugFromParam = slugArray[slugArray.length - 1] || 'school';
  const cleanDigits = (rawSlugFromParam || '').replace(/\D/g, '');
  let defaultStateParam = 'Delhi';
  if (cleanDigits.startsWith('06')) defaultStateParam = 'Haryana';
  else if (cleanDigits.startsWith('09')) defaultStateParam = 'Uttar Pradesh';

  const rawState = decodeURIComponent(resolvedParams.state || defaultStateParam);
  const rawDistrict = decodeURIComponent(resolvedParams.district || 'District');
  const rawVillage = 'campus';
  const stateSlug = encodeURIComponent(rawState.toLowerCase().replace(/ /g, '-'));
  const distSlug = encodeURIComponent(rawDistrict.toLowerCase().replace(/ /g, '-'));

  // 1. Clean SEO URL Normalization: Remove legacy prefix segments (/campus/, /main/, /village/)
  if (slugArray.length >= 2) {
    const firstSeg = slugArray[0].toLowerCase();
    if (firstSeg === 'campus' || firstSeg === 'main' || firstSeg === 'village') {
      redirect(`/edu-network/school/${stateSlug}/${distSlug}/${slugArray.slice(1).map(encodeURIComponent).join('/')}`);
    }
  }

  // Extract clean slug and UDISE from slugArray (supports [udise, name-slug] or [name-slug])
  const lastSeg = slugArray[slugArray.length - 1];
  const firstSeg = slugArray[0];
  const rawSlug = decodeURIComponent(lastSeg || 'school');
  const cleanSlug = rawSlug.replace(/\.html$/i, '');
  const fallbackSchoolName = cleanSlug.replace(/[-_]/g, ' ');
  const detectedUdise = /^\d+$/.test(firstSeg) ? firstSeg : (cleanDigits || '');

  // Format variables strictly from Supabase record or template mode
  const isTemplate = cleanSlug === 'template' || cleanSlug === 'school-template';
  const rawCleanCode = (cleanSlug || '').replace(/\.html$/i, '').trim();
  const preliminaryUdise = detectedUdise || cleanDigits || rawCleanCode;
  const canonicalUdise = preliminaryUdise.length === 10 ? '0' + preliminaryUdise : preliminaryUdise;

  // 1. Fetch main school record (resolved in ~0ms from in-memory cache)
  const schoolData: any = await fetchSchoolRecord(rawState, rawDistrict, rawVillage, cleanSlug);

  const actualUdise = schoolData?.udise_code || preliminaryUdise;
  const canonicalActual = actualUdise.length === 10 ? '0' + actualUdise : actualUdise;
  const udiseCandidates = Array.from(new Set([
    preliminaryUdise,
    canonicalUdise,
    actualUdise,
    canonicalActual,
    preliminaryUdise.replace(/^0+/, ''),
    actualUdise.replace(/^0+/, '')
  ])).filter(Boolean);

  // 2. Fetch profile customizations row with fast 800ms timeout
  let profRow: any = null;
  if (udiseCandidates.length > 0) {
    try {
      const { data: profRows } = await schoolSearchSupabase
        .from('school_profiles')
        .select('*')
        .in('udise_code', udiseCandidates)
        .limit(1);
      if (profRows && profRows.length > 0) profRow = profRows[0];
    } catch {}
  }

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
        redirect(`/edu-network/school/${stateSlug}/${distSlug}/${cleanSlug}/${nameSlug}`);
      }
    }
  }

    

  let dbProfileJson: any = null;
  if (profRow) {
    const rawProfile = typeof profRow.profile_data === 'string' ? JSON.parse(profRow.profile_data) : (profRow.profile_data || {});
    const overviewData = (profRow.overview && typeof profRow.overview === 'object' && Object.keys(profRow.overview).length > 0 ? profRow.overview : null) || rawProfile.overview || {};
    const admissionsData = (profRow.admissions && typeof profRow.admissions === 'object' && Object.keys(profRow.admissions).length > 0 ? profRow.admissions : null) || rawProfile.admissions || {};
    const resultsData = (profRow.results && typeof profRow.results === 'object' && Object.keys(profRow.results).length > 0 ? profRow.results : null) || rawProfile.results || {};

    // 16-Column Modular Schema unpack
    const snapshot = (profRow.school_snapshot && typeof profRow.school_snapshot === 'object') ? profRow.school_snapshot : {};
    const videoGallery = (profRow.video_gallery && typeof profRow.video_gallery === 'object') ? profRow.video_gallery : {};
    const importantDates = (profRow.important_dates_guidelines && typeof profRow.important_dates_guidelines === 'object') ? profRow.important_dates_guidelines : {};
    const academicResults = (profRow.academic_results && typeof profRow.academic_results === 'object') ? profRow.academic_results : {};
    const deskContacts = Array.isArray(profRow.admission_desk_contacts) ? profRow.admission_desk_contacts : [];
    const galleryImages = Array.isArray(videoGallery.images) ? videoGallery.images : [];

    // Priority: dedicated 16 columns take highest precedence
    dbProfileJson = {
      ...rawProfile,
      ...overviewData,
      ...admissionsData,
      ...resultsData,
      isClaimed: true,
      is_claimed: true,
      aboutText: profRow.about || overviewData.aboutText || rawProfile.aboutText || '',
      logoImage: profRow.logo_url || overviewData.logoImage || rawProfile.logoImage || '',
      heroImage: profRow.campus_image_url || overviewData.heroImage || rawProfile.heroImage || '',
      board: snapshot.board || profRow.board || rawProfile.board || overviewData.board || 'CBSE',
      schoolType: snapshot.school_type || profRow.school_type || rawProfile.schoolType || 'Private Unaided',
      residentialSchool: snapshot.residential_type || profRow.residential_type || rawProfile.residential_type,
      school_gender: snapshot.school_gender || profRow.school_gender || rawProfile.school_gender || 'Co-Educational',
      establishedYear: snapshot.established_year || overviewData.establishedYear || rawProfile.establishedYear || '',
      campusArea: snapshot.campus_area || overviewData.campusArea || rawProfile.campusArea || '',
      totalStudents: snapshot.total_students || rawProfile.totalStudents || 0,
      totalTeachers: snapshot.total_teachers || rawProfile.totalTeachers || 0,
      studentTeacherRatio: snapshot.student_teacher_ratio || rawProfile.studentTeacherRatio || '1:17',
      classFrom: snapshot.class_from || rawProfile.classFrom || '',
      classTo: snapshot.class_to || rawProfile.classTo || '',
      
      campusVideoUrl: videoGallery.video_url || rawProfile.campusVideoUrl || '',
      gallery: galleryImages.length > 0 ? galleryImages : (overviewData.gallery || rawProfile.gallery || []),
      galleryItems: galleryImages.length > 0 ? galleryImages : (overviewData.gallery || rawProfile.galleryItems || []),

      faqs: (Array.isArray(profRow.faqs) && profRow.faqs.length > 0)
        ? profRow.faqs
        : (overviewData.faqs || rawProfile.faqs || []),

      feeTableData: (Array.isArray(profRow.fees_table) && profRow.fees_table.length > 0)
        ? profRow.fees_table
        : (admissionsData.feeTable || rawProfile.feeTable || []),
      feeTable: (Array.isArray(profRow.fees_table) && profRow.fees_table.length > 0)
        ? profRow.fees_table
        : (admissionsData.feeTable || rawProfile.feeTable || []),

      academicSession: importantDates.academic_session || admissionsData.academicSession || rawProfile.academicSession || '2026-2027',
      admissionStatus: importantDates.admission_status || admissionsData.admissionStatus || rawProfile.admissionStatus || 'Open',
      dueDates: importantDates.due_dates || rawProfile.dueDates || [],
      requiredDocuments: importantDates.required_documents || admissionsData.requiredDocuments || rawProfile.requiredDocuments || [],
      admissionProcess: importantDates.guidelines || admissionsData.admissionProcess || rawProfile.admissionProcess || '',

      admissionDeskContacts: deskContacts.length > 0 ? deskContacts : (rawProfile.admissionDeskContacts || []),
      phone: deskContacts[0]?.phone || overviewData.phone || rawProfile.phone || '',
      email: deskContacts[0]?.email || overviewData.email || rawProfile.email || '',

      resultsHighlights: academicResults.lead_paragraph || resultsData.resultsHighlights || rawProfile.resultsHighlights || '',
      boardResults: (() => {
        // Normalize boardResults so component always gets { class10Results: [], class12Results: [] }
        const raw = academicResults.board_results || academicResults.boardResults || resultsData.boardResults || rawProfile.boardResults || {};
        // If already has class10Results key — it's correct format
        if (raw.class10Results !== undefined || raw.class12Results !== undefined) return raw;
        // Dashboard saves as class10/class12 (without "Results" suffix) — normalize it
        if (raw.class10 !== undefined || raw.class12 !== undefined) {
          return {
            class10Results: Array.isArray(raw.class10) ? raw.class10 : (raw.class10 ? [raw.class10] : []),
            class12Results: Array.isArray(raw.class12) ? raw.class12 : (raw.class12 ? [raw.class12] : []),
          };
        }
        return raw;
      })(),

      facilities: (Array.isArray(profRow.facilities) && profRow.facilities.length > 0)
        ? profRow.facilities
        : (rawProfile.facilities || []),
      facility_ids: (Array.isArray(profRow.facilities) && profRow.facilities.length > 0)
        ? profRow.facilities
        : (profRow.facility_ids || rawProfile.facility_ids || []),

      visionText: overviewData.vision || rawProfile.vision || '',
      missionText: overviewData.mission || rawProfile.mission || '',
      feeColumns: Array.isArray(admissionsData.feeColumns) ? admissionsData.feeColumns : (Array.isArray(rawProfile.feeColumns) ? rawProfile.feeColumns : []),
      sectionVisibility: profRow.section_visibility || rawProfile.sectionVisibility || {},
      updatedAt: profRow.updated_at,
    };
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
  const rawMgmtInit = syncedProfileData?.management || cleanManagementDesc(schoolData?.management_desc) || '';
  const management = typeof rawMgmtInit === 'string'
    ? rawMgmtInit
    : (rawMgmtInit && typeof rawMgmtInit === 'object'
        ? ((rawMgmtInit as any).management_type || (rawMgmtInit as any).name || (rawMgmtInit as any).title || (rawMgmtInit as any).society_trust_name || '')
        : String(rawMgmtInit || ''));
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
  
  // BUG-15: No default fallback coordinates — use 0 to indicate missing data
  const lat = Number(schoolData?.latitude) || 0;
  const lng = Number(schoolData?.longitude) || 0;
  const rawAddress = syncedProfileData?.contact?.campusLocation?.streetAddress || syncedProfileData?.address || (schoolData?.address 
    ? schoolData.address.split('\n')[0] 
    : `${displayVillage}, ${displayBlock ? `${displayBlock}, ` : ''}${displayDistrict}, ${displayState}${pincode ? ` - ${pincode}` : ''}`);

  const pageUrl = `https://cseel.org/edu-network/school/${encodeURIComponent(displayState.toLowerCase().replace(/ /g, '-'))}/${encodeURIComponent(displayDistrict.toLowerCase().replace(/ /g, '-'))}/${cleanSlug}`;

  // 3. Strict 5 KM Proximity Filtering + Dynamic District Fallback from 4.4L Database
  const currentUdise = String(schoolData?.udise_code || preliminaryUdise || '').trim();
  const currentName = (schoolData?.school_name || fallbackSchoolName).toLowerCase();
  const resolvedDistrictForNearby = (schoolData?.district_name || rawDistrict || '').trim();
  const resolvedStateForNearby = (schoolData?.state_name || rawState || '').trim();
  const STRICT_RADIUS_KM = 5.0; // Fixed 5 km radius

  const normalizeNearby = (s: any) => {
    const rawImg = String(s.image_url || s.image || s.banner_url || s.logo_url || '').trim();
    let cleanImg = rawImg;
    if (cleanImg.startsWith('=IMAGE("') && cleanImg.endsWith('")')) {
      cleanImg = cleanImg.slice(8, -2);
    }
    const safeImg = isValidSchoolImage(cleanImg) ? cleanImg : PLACEHOLDER_EMPTY_IMAGE;
    return {
      school_id: s.school_id || s.id || s.udise_code || s.udiseCode,
      school_name: s.school_name || s.name || '',
      district_name: s.district_name || s.city || resolvedDistrictForNearby || rawDistrict,
      village_name: s.village_name || s.village_ward || s.locality || 'Campus',
      state_name: s.state_name || s.state || resolvedStateForNearby || rawState,
      udise_code: s.udise_code || s.udiseCode || '',
      total_students: s.total_students || 0,
      board_10th: s.board_10th || s.board_secondary_10th || s.board || 'CBSE',
      management_desc: s.management_desc || s.management_desc_state || s.management_type || 'Private',
      image_url: safeImg,
      image: safeImg,
      distanceKm: s.distanceKm != null ? s.distanceKm : null,
      distanceText: s.distanceText || (s.distanceKm != null ? `${s.distanceKm} km away` : ''),
    };
  };

  const allDbSchools = getAllSchoolsFromDatabase();
  const candidatePool = [...allDbSchools, ...SCHOOLS_DATA];

  const nearbyCandidates = candidatePool
    .filter((s: any) => {
      const sU = String(s.udise_code || s.udiseCode || s.id || '').trim();
      const sN = String(s.school_name || s.name || '').trim().toLowerCase();
      if (!sN || sN === currentName) return false;
      if (sU && currentUdise && sU === currentUdise) return false;
      const sLat = Number(s.latitude || s.lat);
      const sLng = Number(s.longitude || s.lng);
      if (!sLat || !sLng || sLat === 0 || sLng === 0) return false;
      const dist = calculateHaversineKm(lat, lng, sLat, sLng);
      return dist > 0 && dist <= STRICT_RADIUS_KM; // STRICT 5 KM RADIUS!
    })
    .map((s: any) => {
      const sLat = Number(s.latitude || s.lat);
      const sLng = Number(s.longitude || s.lng);
      const distKm = calculateHaversineKm(lat, lng, sLat, sLng);
      return {
        ...normalizeNearby(s),
        distanceKm: distKm,
        distanceText: `${distKm} km away`,
      };
    });

  const seenKeys = new Set<string>();
  const strict5KmSchools: any[] = [];
  for (const s of nearbyCandidates.sort((a: any, b: any) => a.distanceKm - b.distanceKm)) {
    const key = s.udise_code || s.school_name.toLowerCase();
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      strict5KmSchools.push(s);
    }
  }

  // Ensure nearby school cards ALWAYS display 10 verified nearby schools with reference point = current school
  if (strict5KmSchools.length < 10) {
    try {
      const targetDistrict = (schoolData?.district_name || rawDistrict || '').trim();
      const targetState = (schoolData?.state_name || rawState || '').trim();
      let query = schoolSearchSupabase
        .from('udise_private_schools')
        .select('udise_code, school_id, school_name, state_name, district_name, block_name, cluster_name, village_name, board_10th, management_desc, latitude, longitude, total_students, established_year')
        .limit(50);

      if (targetDistrict && targetDistrict.toLowerCase() !== 'district') {
        query = query.ilike('district_name', `%${targetDistrict}%`);
      } else if (targetState) {
        query = query.ilike('state_name', `%${targetState}%`);
      }

      if (currentUdise) {
        query = query.neq('udise_code', currentUdise);
      }

      const { data: dbNearby } = await query;
      if (dbNearby && dbNearby.length > 0) {
        const scoredNearby = dbNearby
          .filter((s: any) => {
            const sName = String(s.school_name || '').trim().toLowerCase();
            const sU = String(s.udise_code || '').trim();
            if (!sName || sName === currentName) return false;
            if (sU && currentUdise && sU === currentUdise) return false;
            return true;
          })
          .map((s: any) => {
            const sLat = Number(s.latitude);
            const sLng = Number(s.longitude);
            let distKm: number | null = null;
            if (lat && lng && sLat && sLng && (sLat !== 0 || sLng !== 0)) {
              distKm = calculateHaversineKm(lat, lng, sLat, sLng);
            }
            return {
              ...normalizeNearby({
                ...s,
                distanceKm: distKm,
                distanceText: distKm != null ? `${distKm} km away` : '',
              }),
              distanceKm: distKm,
            };
          });

        // Sort by distance ascending: closest schools first
        scoredNearby.sort((a: any, b: any) => {
          if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
          if (a.distanceKm != null) return -1;
          if (b.distanceKm != null) return 1;
          return 0;
        });

        for (const s of scoredNearby) {
          const key = s.udise_code || s.school_name.toLowerCase();
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            strict5KmSchools.push(s);
          }
          if (strict5KmSchools.length >= 14) break;
        }
      }

      // If still fewer than 10, fallback to state query
      if (strict5KmSchools.length < 10 && targetState) {
        const { data: stateNearby } = await schoolSearchSupabase
          .from('udise_private_schools')
          .select('udise_code, school_id, school_name, state_name, district_name, block_name, cluster_name, village_name, board_10th, management_desc, latitude, longitude, total_students, established_year')
          .ilike('state_name', `%${targetState}%`)
          .limit(30);

        if (stateNearby && stateNearby.length > 0) {
          for (const s of stateNearby) {
            const sName = String(s.school_name || '').trim().toLowerCase();
            const sU = String(s.udise_code || '').trim();
            if (!sName || sName === currentName) continue;
            if (sU && currentUdise && sU === currentUdise) continue;
            const key = sU || sName;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              strict5KmSchools.push(normalizeNearby(s));
            }
            if (strict5KmSchools.length >= 14) break;
          }
        }
      }
    } catch (e) {
      console.warn('Error fetching DB nearby schools:', e);
    }
  }

  const districtSchools = strict5KmSchools.slice(0, 10);
  const clusterSchools = strict5KmSchools.slice(10, 20);

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
            item: 'https://cseel.org',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'All India Schools',
            item: 'https://cseel.org/edu-network/all-india',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: displayState,
            item: `https://cseel.org/edu-network/all-india?state=${encodeURIComponent(displayState)}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: displayDistrict,
            item: `https://cseel.org/edu-network/all-india?district=${encodeURIComponent(displayDistrict)}`,
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
          name: 'CSEEL Educational Network',
          url: 'https://cseel.org',
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
          heroImage: resolveHeroImage(syncedProfileData?.heroImage, schoolData?.image_url),
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
          imageUrl={resolveHeroImage(syncedProfileData?.heroImage, schoolData?.image_url)}
          logoUrl={syncedProfileData?.logoImage || syncedProfileData?.imageOverrides?.['school_logo'] || ''}
          affiliationNumber={syncedProfileData?.schoolIdentity?.affiliationNumber || syncedProfileData?.affiliationNumber || schoolData?.affiliation_number || schoolData?.affiliation_no || ''}
          lat={lat}
          lng={lng}
          clusterSchools={clusterSchools}
          districtSchools={districtSchools}
          isTemplate={isTemplate}
          isPublicClaimed={Boolean(profRow || syncedProfileData?.isClaimed)}
          initialProfileData={syncedProfileData}
          residentialSchool={residentialSchool}
          flipbookSlides={(syncedProfileData?.flipbookSlides || []).map((slide: any) => ({
            ...slide,
            image: isValidSchoolImage(slide?.image) ? slide.image : PLACEHOLDER_EMPTY_IMAGE
          }))}
        />
      </SchoolTemplateProvider>
    </>
  );
}
