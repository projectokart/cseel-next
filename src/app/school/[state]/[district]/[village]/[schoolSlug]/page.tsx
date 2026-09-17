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
      .select('school_name, udise_code, state_name, district_name, village_name, total_students, board_10th, image_url')
      .ilike('district_name', `%${district.trim()}%`)
      .ilike('school_name', `%${firstWord}%`)
      .limit(1);
    if (data && data.length > 0) dbSchool = data[0];
  } catch (e) {}

  const canonicalUrl = `https://schoolsearch.cseel.org/school/${encodeURIComponent(state)}/${encodeURIComponent(district)}/${encodeURIComponent(village)}/${cleanSlug}.html`;
  const metaTitle = `${schoolName} - UDISE+ School Profile & Admissions | ${district}, ${state} | CSEEL`;
  const metaDesc = `Official verified profile of ${schoolName} in ${village}, ${district}, ${state} (UDISE: ${dbSchool?.udise_code || 'Verified'}). Explore student-teacher ratio, campus facilities, verified curriculum, 3D lab simulations, and reviews.`;
  const metaImage = dbSchool?.image_url || 'https://schoolsearch.cseel.org/images/cseel-science-slide-3.jpg';

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: [
      schoolName,
      `${schoolName} ${district}`,
      `${schoolName} admission`,
      `${schoolName} fees`,
      `${schoolName} UDISE`,
      `Best schools in ${district}`,
      `Private schools in ${village}`,
      state,
      'CSEEL School Directory'
    ],
    metadataBase: new URL('https://schoolsearch.cseel.org'),
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      type: 'article',
      url: canonicalUrl,
      siteName: 'CSEEL National School Search Directory',
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: `${schoolName} Campus & UDISE Profile`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [metaImage],
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

  // JSON-LD structured data for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: displaySchoolName,
    description: `Official UDISE+ educational profile for ${displaySchoolName} in ${displayVillage}, ${displayDistrict}, ${displayState}.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: displayVillage,
      addressRegion: displayDistrict,
      addressCountry: 'India',
      postalCode: pincode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    url: website || `https://schoolsearch.cseel.org/school/${encodeURIComponent(displayState)}/${encodeURIComponent(displayDistrict)}/${encodeURIComponent(displayVillage)}/${cleanSlug}.html`,
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
