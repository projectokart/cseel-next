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
import { SchoolTemplateProvider } from '@/components/schools/template/SchoolTemplateContext';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

// Helper to retrieve official AI synced profile data from sync store
function getSyncedProfileData(udiseCode: string, cleanSlug: string): any {
  try {
    const tokensFile = path.join(process.cwd(), 'src', 'data', 'school_ai_sync_tokens.json');
    if (fs.existsSync(tokensFile)) {
      const store = JSON.parse(fs.readFileSync(tokensFile, 'utf8'));
      const tokens = store.tokens || {};
      const targetDigits = (udiseCode || '').replace(/\D/g, '');
      const cleanSlugNorm = cleanSlug.replace(/[^a-z0-9]/gi, '').toLowerCase();

      for (const tKey of Object.keys(tokens)) {
        const rec = tokens[tKey];
        const recSchoolId = (rec.schoolId || '').replace(/\D/g, '');
        const recUdise = (rec.profileData?.udiseCode || '').replace(/\D/g, '');

        if (
          (targetDigits && targetDigits.length >= 6 && (recSchoolId === targetDigits || recUdise === targetDigits)) ||
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
    total_students: s.total_students,
    total_boys: s.total_boys || Math.round(s.total_students * 0.52),
    total_girls: s.total_girls || Math.round(s.total_students * 0.48),
    total_teachers: s.total_teachers,
    male_teachers: s.male_teachers || Math.round(s.total_teachers * 0.4),
    female_teachers: s.female_teachers || Math.round(s.total_teachers * 0.6),
    total_classrooms: s.classrooms_total || 28,
    working_smart_boards: s.digital_boards_working || 6,
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

  const displayName = synced?.schoolName || dbSchool?.school_name || fallbackSchoolName;
  const displayVillage = synced?.village || dbSchool?.village_name || village;
  const displayDistrict = synced?.district || dbSchool?.district_name || district;
  const displayState = synced?.state || dbSchool?.state_name || state;
  const pincode = (synced?.pincode || dbSchool?.pincode ? String(synced?.pincode || dbSchool.pincode).replace(/\.0$/, '') : '');
  const board = (synced?.board || dbSchool?.board_12th || dbSchool?.board_10th || 'CBSE').replace(/^\d+-/, '');

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
  const udiseCode = isTemplate ? '06170100101' : (schoolData?.udise_code || '');
  const syncedProfileData = getSyncedProfileData(udiseCode, cleanSlug);
  const displaySchoolName = isTemplate ? 'Write Your School Name Here' : (schoolData?.school_name || fallbackSchoolName);
  const displayState = schoolData?.state_name || rawState;
  const displayDistrict = schoolData?.district_name || rawDistrict;
  const displayBlock = schoolData?.block_name || rawVillage || '';
  const displayVillage = schoolData?.village_name || rawVillage;
  const pincode = cleanCodePrefix(schoolData?.pincode);
  const management = cleanManagementDesc(schoolData?.management_desc);
  const board = cleanBoardName(schoolData?.board_12th) || cleanBoardName(schoolData?.board_10th) || 'State Board / CBSE';
  const medium = cleanMediumName(schoolData?.primary_medium) || 'English';
  const establishedYear = cleanCodePrefix(schoolData?.established_year);
  const totalStudents = Number(schoolData?.total_students) || 0;
  const totalBoys = Number(schoolData?.total_boys) || 0;
  const totalGirls = Number(schoolData?.total_girls) || 0;
  const totalTeachers = Number(schoolData?.total_teachers) || 0;
  const maleTeachers = Number(schoolData?.male_teachers) || 0;
  const femaleTeachers = Number(schoolData?.female_teachers) || 0;
  const classroomsCount = Number(schoolData?.total_classrooms) || 0;
  const classFrom = cleanCodePrefix(schoolData?.class_from) || '1';
  const classTo = cleanCodePrefix(schoolData?.class_to) || '10';
  const schoolCategory = cleanSchoolCategory(schoolData?.school_category);
  const genderType = cleanGenderType(schoolData?.gender_type);
  const ruralUrban = cleanRuralUrban(schoolData?.rural_urban);
  
  const workingSmartBoards = Number(schoolData?.working_smart_boards) || 0;
  const computerIctLab = schoolData?.computer_ict_lab || '';
  const atalStemLab = schoolData?.atal_stem_lab || '';
  const playgroundAvailable = schoolData?.playground_available || '';

  const principalName = schoolData?.principal_name || '';
  const rawPhone = schoolData?.phone ? String(schoolData.phone).replace(/\.0$/, '') : '';
  const rawEmail = schoolData?.email || '';
  const website = schoolData?.website || '';
  
  const lat = Number(schoolData?.latitude) || 28.1405;
  const lng = Number(schoolData?.longitude) || 77.3259;
  const rawAddress = schoolData?.address 
    ? schoolData.address.split('\n')[0] 
    : `${displayVillage}, ${displayBlock ? `${displayBlock}, ` : ''}${displayDistrict}, ${displayState}${pincode ? ` - ${pincode}` : ''}`;

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        imageUrl={syncedProfileData?.heroImage || schoolData?.image_url || ''}
        logoUrl={syncedProfileData?.logoImage || syncedProfileData?.imageOverrides?.['school_logo'] || ''}
        affiliationNumber={syncedProfileData?.affiliationNumber || schoolData?.affiliation_number || schoolData?.affiliation_no || ''}
        lat={lat}
        lng={lng}
        clusterSchools={clusterSchools}
        districtSchools={districtSchools}
        isTemplate={isTemplate}
        initialProfileData={syncedProfileData}
        flipbookSlides={syncedProfileData?.flipbookSlides}
      />
    </>
  );
}
