'use client';

import React, { useState, useEffect } from 'react';
import { SchoolTemplateProvider } from '@/components/schools/template/SchoolTemplateContext';
import SchoolProfileView from '@/app/school/[state]/[district]/[village]/[schoolSlug]/SchoolProfileView';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Lock, LogIn, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SchoolTemplateClient() {
  const { user: authContextUser, loading: authContextLoading } = useAuth();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

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

  // User is Authenticated -> Render Template Profile
  return (
    <SchoolTemplateProvider>
      <SchoolProfileView
        isTemplate={true}
        schoolName="Write Your School Name Here"
        schoolSlug="school-template"
        state="State Name (e.g. Haryana)"
        district="District Name (e.g. Rewari)"
        blockName="Zone / Block Name"
        village="Locality / Sector / Village"
        pincode="123401"
        udiseCode="06170100101"
        board="CBSE (Central Board of Secondary Education)"
        medium="English & Hindi Medium"
        management="Private Unaided / Government / Aided"
        establishedYear="2008"
        schoolCategory="Senior Secondary (Class Nursery to 12th)"
        classFrom="Nursery"
        classTo="12th"
        genderType="Co-Educational"
        ruralUrban="Urban"
        totalStudents={1480}
        totalBoys={780}
        totalGirls={700}
        totalTeachers={72}
        maleTeachers={24}
        femaleTeachers={48}
        classroomsCount={52}
        workingSmartBoards={28}
        computerIctLab="Yes"
        atalStemLab="Yes"
        playgroundAvailable="Yes"
        principalName="Write Principal / Headmaster Name Here"
        rawPhone="+91 98XXXXXXXX / Official School Helpline"
        rawEmail="admissions@yourschoolname.edu.in"
        website="https://www.yourschoolname.edu.in"
        rawAddress="Plot No. 12, Knowledge Park / Institutional Area, Your City - PIN Code"
        imageUrl="/images/schools/hero-school-1.png"
        lat={28.1885}
        lng={76.6215}
        clusterSchools={[]}
        districtSchools={[]}
      />
    </SchoolTemplateProvider>
  );
}
