'use client';

import React, { useState, useEffect } from 'react';
import { SchoolTemplateProvider, PLACEHOLDER_EMPTY_IMAGE } from '@/components/schools/template/SchoolTemplateContext';
import { parseSchoolJsonToState } from '@/components/schools/template/SchoolJsonSchemaHelper';
import SchoolProfileView from '@/app/school/[state]/[district]/[village]/[schoolSlug]/SchoolProfileView';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Lock, LogIn, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SchoolTemplateClient() {
  const { user: authContextUser, loading: authContextLoading } = useAuth();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // Dynamic school state loaded from token or UDISE
  const [resolvedSchool, setResolvedSchool] = useState<any>(null);
  const [isResolvingSchool, setIsResolvingSchool] = useState(false);

  const currentUser = authContextUser || sessionUser;
  const isAuthLoading = authContextLoading && isSessionLoading && !currentUser;

  useEffect(() => {
    let isMounted = true;
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!isMounted) return;
        setIsSessionLoading(false);
        if (session?.user && !error) {
          setSessionUser(session.user);
        } else {
          setSessionUser(null);
        }
      })
      .catch(() => {
        if (isMounted) setIsSessionLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
            // Guarantee image is placeholder if no custom image is uploaded
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

  // While verifying session
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 animate-spin text-blue-400" />
          <p className="text-xs font-semibold text-slate-300">
            Verifying authorized management session...
          </p>
        </div>
      </div>
    );
  }

  // Strict Authentication Gate: User NOT logged in
  if (!currentUser) {
    const returnUrl = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/school-template';
    const loginLink = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Authentication Required
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2.5">
              School Management Gate
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              To edit school profile data, manage admissions, or customize live visual elements, you must be logged in with an authenticated account.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#005689]" />
              Authorized Access Only
            </div>
            <p>• Profile editing without active authentication is strictly prohibited.</p>
            <p>• Only verified school representatives or administrators may modify institution records.</p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <a
              href={loginLink}
              className="w-full py-3 px-5 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google / Email</span>
            </a>

            <Link
              href="/schools"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Schools Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Resolving school data
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

  // User is Authenticated -> Render Template Profile with dynamically resolved or default props
  const schoolProps = resolvedSchool || {
    schoolName: 'Write Your School Name Here',
    udiseCode: '',
    state: 'State Name',
    district: 'District Name',
    pincode: '123401',
    address: 'Plot No. 12, Institutional Area, Your City - PIN Code',
    board: 'CBSE (Central Board of Secondary Education)',
    phone: '',
    email: '',
    totalStudents: 1250,
    totalTeachers: 65,
    classFrom: 'Class Nursery',
    classTo: 'Class 12th',
  };

  return (
    <SchoolTemplateProvider initialData={resolvedSchool || undefined}>
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
        establishedYear={schoolProps.establishedYear || "1948"}
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
        classroomsCount={schoolProps.classroomsCount || 63}
        workingSmartBoards={schoolProps.workingSmartBoards || 15}
        computerIctLab="Yes"
        atalStemLab="Yes"
        playgroundAvailable="Yes"
        principalName={schoolProps.principalName || "Principal / Head of Institution"}
        rawPhone={schoolProps.phone}
        rawEmail={schoolProps.email}
        website={schoolProps.website || ""}
        rawAddress={schoolProps.address}
        imageUrl={schoolProps.heroImage || PLACEHOLDER_EMPTY_IMAGE}
        lat={28.1885}
        lng={76.6215}
        clusterSchools={[]}
        districtSchools={[]}
      />
    </SchoolTemplateProvider>
  );
}
