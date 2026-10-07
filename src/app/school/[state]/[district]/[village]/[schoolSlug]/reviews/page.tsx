import React from 'react';
import { Metadata } from 'next';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import SchoolReviewsAnalysisView from './SchoolReviewsAnalysisView';

interface PageProps {
  params: Promise<{
    state: string;
    district: string;
    village: string;
    schoolSlug: string;
  }>;
}

// Database school lookup helper
async function fetchSchoolRecord(state: string, district: string, village: string, cleanSlug: string) {
  const rawClean = cleanSlug.replace(/\.html$/i, '').trim();
  const digitsOnly = rawClean.replace(/\D/g, '');

  try {
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
  } catch (err) {
    console.warn('DB lookup error in reviews page:', err);
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

  const school = await fetchSchoolRecord(state, district, village, cleanSlug);
  const name = school?.school_name || fallbackSchoolName;

  return {
    title: `${name} Reviews & Rating Analysis | Genuine Parent & Student Feedback - CSEEL`,
    description: `Detailed ratings, verified parent feedback, academics, safety & transport analysis for ${name}, ${village}, ${district}.`,
  };
}

export default async function SchoolReviewsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const state = decodeURIComponent(resolvedParams.state || 'Haryana');
  const district = decodeURIComponent(resolvedParams.district || 'District');
  const village = decodeURIComponent(resolvedParams.village || 'Village');
  const cleanSlug = decodeURIComponent(resolvedParams.schoolSlug || 'school').replace(/\.html$/i, '');
  const fallbackSchoolName = cleanSlug.replace(/[-_]/g, ' ');

  const school = await fetchSchoolRecord(state, district, village, cleanSlug);

  const schoolName = school?.school_name || fallbackSchoolName;
  const udiseCode = school?.udise_code || 'Verified';
  const board = (school?.board_12th || school?.board_10th || 'CBSE').replace(/^\d+-/, '');
  const rawAddress = school?.address || `${village}, ${district}, ${state}`;
  const pincode = school?.pincode ? String(school.pincode).replace(/\.0$/, '') : '';

  return (
    <SchoolReviewsAnalysisView
      state={state}
      district={district}
      village={village}
      schoolName={schoolName}
      schoolSlug={cleanSlug}
      udiseCode={udiseCode}
      board={board}
      rawAddress={rawAddress}
      pincode={pincode}
    />
  );
}
