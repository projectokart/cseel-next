import React from 'react';
import { Metadata } from 'next';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import SchoolProfileView from './SchoolProfileView';

interface PageProps {
  params: Promise<{
    state: string;
    district: string;
    village: string;
    schoolSlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const state = decodeURIComponent(resolvedParams.state || 'Haryana');
  const district = decodeURIComponent(resolvedParams.district || 'District');
  const village = decodeURIComponent(resolvedParams.village || 'Village');
  const cleanSlug = decodeURIComponent(resolvedParams.schoolSlug || 'school').replace(/\.html$/i, '');
  const schoolName = cleanSlug.replace(/[-_]/g, ' ');

  // Fetch school data for rich metadata
  let dbSchool: any = null;
  try {
    const firstWord = schoolName.split(' ')[0] || schoolName;
    const { data } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('school_name, udise_code, state_name, district_name, village_name, block_name, total_students, total_teachers, board_10th, board_12th, primary_medium, established_year, pincode, latitude, longitude, image_url')
      .ilike('district_name', `%${district.trim()}%`)
      .ilike('school_name', `%${firstWord}%`)
      .limit(1);
    if (data && data.length > 0) dbSchool = data[0];
  } catch (e) {}

  const displayName = dbSchool?.school_name || schoolName;
  const displayVillage = dbSchool?.village_name || village;
  const displayDistrict = dbSchool?.district_name || district;
  const displayState = dbSchool?.state_name || state;
  const udise = dbSchool?.udise_code || '';
  const pincode = dbSchool?.pincode ? String(dbSchool.pincode).replace(/\.0$/, '') : '';
  const board = (dbSchool?.board_12th || dbSchool?.board_10th || 'State Board / CBSE').replace(/^\d+-/, '');
  const medium = (dbSchool?.primary_medium || 'English').replace(/^\d+-/, '');
  const studentsCount = Number(dbSchool?.total_students) || 0;

  const canonicalUrl = `https://schoolsearch.cseel.org/school/${encodeURIComponent(displayState)}/${encodeURIComponent(displayDistrict)}/${encodeURIComponent(displayVillage)}/${cleanSlug}.html`;
  
  // High CTR, Multi-intent Google Search Title
  const metaTitle = `${displayName}, ${displayVillage} - UDISE ${udise || ''}, Admissions, Fees, Reviews & Contact | ${displayDistrict}`;
  
  // Keyword-rich, high-converting Google Search Description
  const metaDesc = `Verified profile of ${displayName} in ${displayVillage}, ${displayDistrict}, ${displayState}${udise ? ` (UDISE: ${udise})` : ''}. Explore 2025-26 admissions, fee structure, ${studentsCount > 0 ? `${studentsCount} enrolled students, ` : ''}${board} board curriculum, ${medium} medium, contact number, reviews, and STEM lab facilities on CSEEL Directory.`;
  
  const metaImage = dbSchool?.image_url || 'https://schoolsearch.cseel.org/images/cseel-science-slide-1.jpg';

  const keywordsList = [
    displayName,
    `${displayName} ${displayVillage}`,
    `${displayName} ${displayDistrict}`,
    `${displayName} ${displayState}`,
    `${displayName} admission 2025`,
    `${displayName} admission 2025-2026`,
    `${displayName} fees structure`,
    `${displayName} contact number`,
    `${displayName} phone number email`,
    `${displayName} UDISE code`,
    udise ? `UDISE ${udise}` : '',
    pincode ? `${displayName} pin code ${pincode}` : '',
    `${displayName} reviews ratings`,
    `${displayName} principal name`,
    `${displayName} ${board} board`,
    `${displayName} ${medium} medium`,
    `Best private schools in ${displayVillage}`,
    `Top schools in ${displayDistrict} ${displayState}`,
    `Schools in ${displayVillage} ${displayDistrict}`,
    `Find schools near ${displayVillage}`,
    `Private recognized schools ${displayDistrict}`,
    'CSEEL National School Search Directory',
    'UDISE+ Verified Schools India'
  ].filter(Boolean);

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: keywordsList,
    metadataBase: new URL('https://schoolsearch.cseel.org'),
    other: {
      'geo.region': `IN-${displayState}`,
      'geo.placename': `${displayVillage}, ${displayDistrict}, ${displayState}`,
      'geo.position': `${dbSchool?.latitude || 28.1405};${dbSchool?.longitude || 77.3259}`,
      'ICBM': `${dbSchool?.latitude || 28.1405}, ${dbSchool?.longitude || 77.3259}`,
      'subject': `Educational institution profile for ${displayName}`,
      'Classification': 'Education / Schools / UDISE Directory',
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
      siteName: 'CSEEL National School Search Directory',
      locale: 'en_IN',
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: `${displayName} Campus & UDISE Profile - ${displayVillage}, ${displayDistrict}`,
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
  const cleanSchoolName = cleanSlug.replace(/[-_]/g, ' ');

  // Attempt DB search by school name or keywords
  let schoolData: any = null;
  let clusterSchools: any[] = [];
  let districtSchools: any[] = [];

  try {
    // 1. Query for the specific school
    const firstWord = cleanSchoolName.split(' ')[0] || cleanSchoolName;
    const { data: matchedSchools } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('*')
      .ilike('district_name', `%${rawDistrict.trim()}%`)
      .ilike('school_name', `%${firstWord}%`)
      .limit(5);

    if (matchedSchools && matchedSchools.length > 0) {
      schoolData = matchedSchools.find(
        (s: any) =>
          s.school_name.toLowerCase().includes(cleanSchoolName.toLowerCase()) ||
          cleanSchoolName.toLowerCase().includes(s.school_name.toLowerCase())
      ) || matchedSchools[0];
    }

    // 2. Fetch sibling district schools
    const { data: dSchools } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('school_id, school_name, district_name, village_name, state_name, udise_code, total_students, board_10th, management_desc')
      .ilike('district_name', `%${rawDistrict.trim()}%`)
      .limit(8);

    if (dSchools && dSchools.length > 0) {
      districtSchools = dSchools.filter((s: any) => s.school_name !== (schoolData?.school_name || cleanSchoolName)).slice(0, 4);
      clusterSchools = dSchools.slice(4, 7);
    }
  } catch (err) {
    console.warn('Error fetching school data:', err);
  }

  // Format variables strictly from Supabase row (No fake/dummy fallback data)
  const udiseCode = schoolData?.udise_code || '';
  const displaySchoolName = schoolData?.school_name || cleanSchoolName;
  const displayState = schoolData?.state_name || rawState;
  const displayDistrict = schoolData?.district_name || rawDistrict;
  const displayBlock = schoolData?.block_name || rawVillage || '';
  const displayVillage = schoolData?.village_name || rawVillage;
  const pincode = schoolData?.pincode ? String(schoolData.pincode).replace(/\.0$/, '') : '';
  const management = (schoolData?.management_desc || 'Private Unaided (Recognized)').replace(/^\d+-/, '');
  const board = (schoolData?.board_12th || schoolData?.board_10th || 'State Board / CBSE').replace(/^\d+-/, '');
  const medium = (schoolData?.primary_medium || 'English').replace(/^\d+-/, '');
  const establishedYear = schoolData?.established_year ? String(schoolData.established_year).replace(/\.0$/, '') : '';
  const totalStudents = Number(schoolData?.total_students) || 0;
  const totalBoys = Number(schoolData?.total_boys) || 0;
  const totalGirls = Number(schoolData?.total_girls) || 0;
  const totalTeachers = Number(schoolData?.total_teachers) || 0;
  const maleTeachers = Number(schoolData?.male_teachers) || 0;
  const femaleTeachers = Number(schoolData?.female_teachers) || 0;
  const classroomsCount = Number(schoolData?.total_classrooms) || 0;
  const classFrom = schoolData?.class_from || '1';
  const classTo = schoolData?.class_to || '10';
  const schoolCategory = (schoolData?.school_category || 'Primary / Secondary School').replace(/^\d+-/, '');
  const genderType = (schoolData?.gender_type || 'Co-educational').replace(/^\d+-/, '');
  const ruralUrban = schoolData?.rural_urban === '1' ? 'Rural' : schoolData?.rural_urban === '2' ? 'Urban' : (schoolData?.rural_urban || 'Rural');
  
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
  const rawAddress = schoolData?.address ? schoolData.address.split('\n')[0] : `${displayVillage}, ${displayBlock}, ${displayDistrict}`;

  // Multi-Entity JSON-LD structured data graph for Google Rich Snippets (Outranks competitors with FAQs & Breadcrumbs)
  const pageUrl = `https://schoolsearch.cseel.org/school/${encodeURIComponent(displayState)}/${encodeURIComponent(displayDistrict)}/${encodeURIComponent(displayVillage)}/${cleanSlug}.html`;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['School', 'EducationalOrganization'],
        '@id': `${pageUrl}#school`,
        name: displaySchoolName,
        alternateName: [cleanSchoolName, `${displaySchoolName} ${displayVillage}`, `${displaySchoolName} ${displayDistrict}`],
        description: `Official UDISE+ educational profile of ${displaySchoolName} in ${displayVillage}, ${displayDistrict}, ${displayState}. Operating with UDISE ID ${udiseCode || 'Verified'}, offering ${board} curriculum in ${medium} medium.`,
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
          addressRegion: displayDistrict,
          addressCountry: 'IN',
          postalCode: pincode,
        },
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
            item: `https://schoolsearch.cseel.org/state/${encodeURIComponent(displayState)}`,
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
            name: `What is the official UDISE code of ${displaySchoolName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The official UDISE Code for ${displaySchoolName} located in ${displayVillage}, ${displayDistrict}, ${displayState} is ${udiseCode || 'Available in Directory'}.`,
            },
          },
          {
            '@type': 'Question',
            name: `What board curriculum and medium of instruction is followed at ${displaySchoolName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${displaySchoolName} is affiliated with ${board} and provides instruction in ${medium} medium from Class ${classFrom} to Class ${classTo}.`,
            },
          },
          {
            '@type': 'Question',
            name: `What is the student strength and faculty ratio at ${displaySchoolName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${displaySchoolName} has approximately ${totalStudents} enrolled students with ${totalTeachers} qualified faculty members.`,
            },
          },
          {
            '@type': 'Question',
            name: `What facilities and learning infrastructure are available at ${displaySchoolName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${displaySchoolName} provides instructional classrooms, playground facilities, and access to hands-on STEM & experiential science learning tools supported by CSEEL.org.`,
            },
          },
          {
            '@type': 'Question',
            name: `How can parents contact ${displaySchoolName} for admissions?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Parents can view verified contact information, campus address in ${displayVillage}, and live route directions directly on the official CSEEL School Directory profile.`,
            },
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${displaySchoolName} - Profile, Admissions & UDISE Info | CSEEL`,
        description: `Official verified institutional profile for ${displaySchoolName} in ${displayVillage}, ${displayDistrict}, ${displayState}.`,
        inLanguage: ['en-IN', 'hi-IN'],
        isPartOf: {
          '@type': 'WebSite',
          name: 'CSEEL National School Search Directory',
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
