'use client';

import React, { useState, useEffect } from 'react';
import { SchoolTemplateProvider, PLACEHOLDER_EMPTY_IMAGE } from '@/components/schools/template/SchoolTemplateContext';
import { parseSchoolJsonToState } from '@/components/schools/template/SchoolJsonSchemaHelper';
import SchoolProfileView from '@/app/school/[state]/[district]/[village]/[schoolSlug]/SchoolProfileView';
import { Loader2 } from 'lucide-react';

export default function SchoolTemplateClient() {
  // Dynamic school state loaded from token or UDISE (if specified in query params)
  const [resolvedSchool, setResolvedSchool] = useState<any>(null);
  const [isResolvingSchool, setIsResolvingSchool] = useState(false);

  // Fetch verified school details if token or UDISE is present in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const udise = params.get('udise');
    const extractedUdise = (udise || (token ? (token.match(/\d{11}/)?.[0] || '') : '')).replace(/\D/g, '');

    if (extractedUdise && extractedUdise.length === 11) {
      setIsResolvingSchool(true);

      const fetchers: Promise<any>[] = [
        fetch(`/api/udise/standard-profile?code=${extractedUdise}`).then((r) => r.json()).catch(() => null),
      ];

      if (token) {
        fetchers.push(
          fetch(`/api/school-ai-sync?token=${encodeURIComponent(token)}&format=json`).then((r) => r.json()).catch(() => null)
        );
      }

      Promise.all(fetchers).then(([standardData, syncData]) => {
        const rawProfile = syncData?.profileData || syncData?.data || standardData?.data;
        if (rawProfile) {
          const parsed = parseSchoolJsonToState(rawProfile);
          if (parsed.success && parsed.state) {
            if (!parsed.state.heroImage || parsed.state.heroImage.includes('hero-school-1.png')) {
              parsed.state.heroImage = PLACEHOLDER_EMPTY_IMAGE;
            }
            if (Array.isArray(parsed.state.flipbookSlides)) {
              parsed.state.flipbookSlides = parsed.state.flipbookSlides.map((slide) => ({
                ...slide,
                image: (slide.image && !slide.image.includes('hero-school-')) ? slide.image : PLACEHOLDER_EMPTY_IMAGE,
              }));
            }
            setResolvedSchool(parsed.state);
            return;
          }
        }

        // Fallback to basic standardData fields if parse failed
        if (standardData?.data?.schoolIdentity) {
          const id = standardData.data.schoolIdentity;
          const loc = standardData.data.contact?.campusLocation || {};
          setResolvedSchool({
            schoolName: id.schoolName,
            udiseCode: extractedUdise,
            board: id.board || 'CBSE',
            state: loc.state || 'DELHI',
            district: loc.district || 'CENTRAL',
            pincode: loc.pincode || '110002',
            address: loc.streetAddress || '',
            phone: standardData.data.contact?.contactDesks?.[0]?.phone || '',
            email: standardData.data.contact?.contactDesks?.[0]?.email || '',
            heroImage: PLACEHOLDER_EMPTY_IMAGE,
            flipbookSlides: [],
            facilities: [],
          });
        }
      }).finally(() => {
        setIsResolvingSchool(false);
      });
    }
  }, []);

  // Resolving school data loader
  if (isResolvingSchool) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#005689]" />
          <p className="text-xs font-semibold text-slate-700">
            Auto-loading verified institutional data...
          </p>
        </div>
      </div>
    );
  }

  // Showcase Template School Profile Props
  const schoolProps = resolvedSchool || {
    schoolName: 'Delhi Public Model School',
    udiseCode: '07010100101',
    state: 'Delhi',
    district: 'Central',
    pincode: '110001',
    address: 'Plot No. 12, Institutional Area, Barakhamba Road, New Delhi - 110001',
    board: 'CBSE (Central Board of Secondary Education)',
    phone: '+91 11 2345 6789',
    email: 'info@delhipublicmodelschool.org',
    totalStudents: 1450,
    totalTeachers: 78,
    classFrom: 'Class Nursery',
    classTo: 'Class 12th',
  };

  return (
    <SchoolTemplateProvider
      initialData={resolvedSchool || undefined}
      initialEditMode={false}
      canEdit={false}
      authRole="unauthorized"
    >
      <SchoolProfileView
        isTemplate={true}
        schoolName={schoolProps.schoolName}
        schoolSlug="school-template"
        state={schoolProps.state}
        district={schoolProps.district}
        blockName={schoolProps.district}
        village={schoolProps.district}
        pincode={schoolProps.pincode}
        udiseCode={schoolProps.udiseCode}
        board={schoolProps.board}
        medium="English & Hindi Medium"
        management="Private Unaided / Recognized Institution"
        establishedYear={schoolProps.establishedYear || "1995"}
        schoolCategory={schoolProps.schoolCategory || "Senior Secondary (Class 1 to 12th)"}
        classFrom={schoolProps.classFrom}
        classTo={schoolProps.classTo}
        genderType={schoolProps.genderType || "Co-Educational"}
        ruralUrban={schoolProps.ruralUrban || "Urban"}
        totalStudents={schoolProps.totalStudents}
        totalBoys={schoolProps.totalBoys || Math.round(Number(schoolProps.totalStudents) * 0.52)}
        totalGirls={schoolProps.totalGirls || Math.round(Number(schoolProps.totalStudents) * 0.48)}
        totalTeachers={schoolProps.totalTeachers}
        maleTeachers={schoolProps.maleTeachers || Math.round(Number(schoolProps.totalTeachers) * 0.35)}
        femaleTeachers={schoolProps.femaleTeachers || Math.round(Number(schoolProps.totalTeachers) * 0.65)}
        classroomsCount={schoolProps.classroomsCount || 64}
        workingSmartBoards={schoolProps.workingSmartBoards || 18}
        computerIctLab="Yes"
        atalStemLab="Yes"
        playgroundAvailable="Yes"
        principalName={schoolProps.principalName || "Dr. Rajesh Sharma"}
        rawPhone={schoolProps.phone}
        rawEmail={schoolProps.email}
        website={schoolProps.website || "https://delhipublicmodelschool.org"}
        rawAddress={schoolProps.address}
        imageUrl={schoolProps.heroImage || PLACEHOLDER_EMPTY_IMAGE}
        lat={28.6304}
        lng={77.2285}
        clusterSchools={[]}
        districtSchools={[]}
      />
    </SchoolTemplateProvider>
  );
}
