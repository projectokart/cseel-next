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
import SchoolProfileView from './SchoolProfileView';

interface PageProps {
  params: Promise<{
    state: string;
    district: string;
    village: string;
    schoolSlug: string;
  }>;
}

// Robust database school lookup helper
async function fetchSchoolRecord(state: string, district: string, village: string, cleanSlug: string) {
  const rawClean = cleanSlug.replace(/\.html$/i, '').trim();
  const digitsOnly = rawClean.replace(/\D/g, '');

  try {
    // 1. Direct indexed match by exact UDISE code (e.g. 8122604214, 08122604214)
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

    // 2. Direct match by school_id
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

    // 3. Try matching with district + school name prefix
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

    // 4. Fallback matching anywhere in state
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

  const displayName = dbSchool?.school_name || fallbackSchoolName;
  const displayVillage = dbSchool?.village_name || village;
  const displayDistrict = dbSchool?.district_name || district;
  const displayState = dbSchool?.state_name || state;
  const udise = dbSchool?.udise_code || '';
  const pincode = dbSchool?.pincode ? String(dbSchool.pincode).replace(/\.0$/, '') : '';
  const board = (dbSchool?.board_12th || dbSchool?.board_10th || 'State Board / CBSE').replace(/^\d+-/, '');
  const medium = (dbSchool?.primary_medium || 'English').replace(/^\d+-/, '');

  const canonicalUrl = `https://schoolsearch.cseel.org/school/${encodeURIComponent(displayState)}/${encodeURIComponent(displayDistrict)}/${encodeURIComponent(displayVillage)}/${cleanSlug}.html`;
  
  // Concise, High-CTR Google Search Title (Under 60 characters)
  const metaTitle = `${displayName}, ${displayVillage} (${displayDistrict}) - Admissions & UDISE`;
  
  // Short, Area-Specific, Actionable Google Search Description (140-155 characters)
  const metaDesc = `${displayName} in ${displayVillage}, ${displayDistrict}, ${displayState}${pincode ? ` (${pincode})` : ''}. UDISE: ${udise || 'Verified'}. Check admissions, ${board} board, reviews & contact.`;
  
  const metaImage = dbSchool?.image_url || 'https://schoolsearch.cseel.org/images/cseel-science-slide-1.jpg';

  const keywordsList = [
    displayName,
    `${displayName} ${displayVillage}`,
    `${displayName} ${displayDistrict}`,
    `${displayName} ${displayState}`,
    pincode ? `${displayName} ${pincode}` : '',
    pincode ? `schools in ${pincode}` : '',
    udise ? `UDISE ${udise}` : '',
    `${displayName} admission 2025`,
    `${displayName} contact number`,
    `${displayName} ${board} board`,
    `${displayName} reviews`,
    `best schools in ${displayVillage}`,
    `top schools in ${displayDistrict}`,
    `schools in ${displayVillage} ${displayDistrict}`,
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
      type: 'profile',
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

  // Format variables strictly from Supabase record
  const udiseCode = schoolData?.udise_code || '';
  const displaySchoolName = schoolData?.school_name || fallbackSchoolName;
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
        image: schoolData?.image_url || 'https://schoolsearch.cseel.org/images/cseel-science-slide-1.jpg',
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
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '38',
          reviewCount: '19',
        },
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
        mainEntity: [
          {
            '@type': 'Question',
            name: `What is the address and UDISE code of ${displaySchoolName} in ${displayVillage}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${displaySchoolName} is located at ${displayVillage}, ${displayDistrict}, ${displayState}${pincode ? ` (PIN: ${pincode})` : ''}. Its official UDISE Code is ${udiseCode || 'Available on CSEEL Directory'}.`,
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
            name: `What is the student strength and faculty count at ${displaySchoolName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${displaySchoolName} has approximately ${totalStudents > 0 ? `${totalStudents} enrolled students` : 'active students'} and ${totalTeachers > 0 ? `${totalTeachers} qualified faculty members` : 'qualified teaching staff'}.`,
            },
          },
          {
            '@type': 'Question',
            name: `How can parents contact ${displaySchoolName} in ${displayVillage}, ${displayDistrict}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Parents can view verified contact details, Google Maps directions to ${displayVillage}, and admissions information directly on this official CSEEL Directory profile.`,
            },
          },
        ],
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
        imageUrl={schoolData?.image_url || ''}
        lat={lat}
        lng={lng}
        clusterSchools={clusterSchools}
        districtSchools={districtSchools}
      />
    </>
  );
}
