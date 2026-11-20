'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Share2, Check, ArrowRight, Star, ShieldCheck, CheckCircle2, Eye, EyeOff, Power, XCircle } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import EditableImage from '@/components/schools/template/EditableImage';
import EditorialMarkupRenderer from '@/components/schools/profile/EditorialMarkupRenderer';
import { useOptionalSchoolTemplate } from '@/components/schools/template/SchoolTemplateContext';
import { useAuth } from '@/contexts/AuthContext';

function getPersistentClientId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = localStorage.getItem('cseel_client_uid');
    if (!id) {
      id = 'usr_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('cseel_client_uid', id);
    }
    return id;
  } catch {
    return 'guest_user';
  }
}

export interface SchoolAboutSectionProps {
  displayName: string;
  displayUdise?: string;
  displayBoard?: string;
  isLiveTemplate: boolean;
  isEditMode: boolean;
  templateData: any;
  initialProfileData?: any;
  imageUrl?: string;
  displayEstablished: string;
  displayStudents: string;
  displayTeachers: string;
  displayCampusArea: string;
  onApplyClick: () => void;
  onClaimClick?: () => void;
  canEditSchool?: boolean;
}

export default function SchoolAboutSection({
  displayName,
  displayUdise = '',
  displayBoard = '',
  displayEstablished = '',
  displayStudents = '',
  displayTeachers = '',
  displayCampusArea = '',
  isLiveTemplate,
  isEditMode,
  templateData,
  initialProfileData,
  imageUrl,
  onApplyClick,
  onClaimClick,
  canEditSchool = false,
}: SchoolAboutSectionProps) {
  const { user } = useAuth();
  const effectiveUserId =
    user?.id || user?.email || (typeof window !== 'undefined' ? getPersistentClientId() : '');

  const templateCtx = useOptionalSchoolTemplate();
  const isUnverified = !canEditSchool && !isEditMode && !templateData?.isClaimed && !templateData?.isVerified;
  const isApplyBtnHidden = (templateCtx?.getContent?.('apply_btn_hidden', 'false') || templateData?.contentOverrides?.['apply_btn_hidden']) === 'true';
  const isApplyBtnDisabled = (templateCtx?.getContent?.('apply_btn_disabled', 'false') || templateData?.contentOverrides?.['apply_btn_disabled']) === 'true';

  const [likesCount, setLikesCount] = useState<number>(() =>
    typeof templateData?.likesCount === 'number' ? templateData.likesCount : 0
  );
  const [ratingValue, setRatingValue] = useState<string>(() => {
    const raw = Number(templateData?.rating ?? initialProfileData?.rating ?? 0);
    return raw > 0 ? raw.toFixed(1) : '4.5';
  });
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  useEffect(() => {
    if (!displayUdise) return;
    try {
      const localLiked = localStorage.getItem(`liked_school_${displayUdise}`) === 'true';
      if (localLiked) setIsLiked(true);
    } catch {}

    fetch(
      `/api/school-engagement?udiseCode=${encodeURIComponent(displayUdise)}&userId=${encodeURIComponent(effectiveUserId)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (typeof data.likesCount === 'number') setLikesCount(data.likesCount);
          if (Array.isArray(data.reviews) && data.reviews.length > 0) {
            const sum = data.reviews.reduce((acc: number, r: any) => acc + (Number(r?.rating) || 0), 0);
            if (sum > 0) {
              setRatingValue((sum / data.reviews.length).toFixed(1));
            }
          }
          if (typeof data.userLiked === 'boolean') {
            setIsLiked(data.userLiked);
            try {
              localStorage.setItem(`liked_school_${displayUdise}`, data.userLiked ? 'true' : 'false');
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, [displayUdise, effectiveUserId]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!displayUdise || isLiking) return;
    setIsLiking(true);
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => Math.max(0, nextLiked ? prev + 1 : prev - 1));

    try {
      localStorage.setItem(`liked_school_${displayUdise}`, nextLiked ? 'true' : 'false');
      const res = await fetch('/api/school-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          udiseCode: displayUdise,
          userId: effectiveUserId,
          liked: nextLiked,
        }),
      });
      const data = await res.json();
      if (data.success && typeof data.likesCount === 'number') {
        setLikesCount(data.likesCount);
      }
    } catch {} finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: displayName,
          text: `Explore ${displayName} on CSEEL`,
          url: shareUrl,
        });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 1800);
    } catch {}
  };

  const dynamicGeneratedAbout = useMemo(() => {
    // 1. Clean location string
    const locParts = [
      templateData?.address || initialProfileData?.address,
      templateData?.district || initialProfileData?.district,
      templateData?.state || initialProfileData?.state,
    ].filter(Boolean);
    const pin = templateData?.pincode || initialProfileData?.pincode;
    const locationText = locParts.length > 0
      ? locParts.join(', ') + (pin ? ` - ${pin}` : '')
      : (templateData?.state || initialProfileData?.state || 'India');

    // 2. Gender & Management fallback
    const rawGender = templateData?.genderType || initialProfileData?.genderType;
    const cleanGender = (rawGender && rawGender !== 'NA' && rawGender !== '-') ? rawGender : 'Co-Educational';
    
    const rawMgmt = templateData?.management || initialProfileData?.management;
    const cleanMgmt = (rawMgmt && rawMgmt !== 'NA' && rawMgmt !== '-') ? rawMgmt : 'recognized educational committee and management society';

    const rawBoarding = templateData?.boardingStatus || initialProfileData?.boardingStatus;
    const cleanBoarding = (rawBoarding && rawBoarding !== 'NA' && rawBoarding !== '-') ? rawBoarding : 'Day School';

    // 3. Establishment & Heritage fallback
    const rawEst = displayEstablished || templateData?.establishedYear || initialProfileData?.establishedYear;
    const cleanEst = (rawEst && rawEst !== 'NA' && rawEst !== '-' && rawEst !== '0') ? rawEst : '';
    const estSentence = cleanEst 
      ? `Established in the year **${cleanEst}**, the institution operates as a dedicated **${cleanBoarding}** under the governance of **${cleanMgmt}**.`
      : `Operating under the governance of **${cleanMgmt}**, the school functions as a dedicated **${cleanBoarding}** committed to accessible, quality education.`;

    // 4. Board & Curriculum fallback
    const rawBoard = displayBoard || templateData?.board || initialProfileData?.board;
    const cleanBoard = (rawBoard && rawBoard !== 'NA' && rawBoard !== '-') ? rawBoard : 'Recognized Board of Secondary Education';

    const rawClassFrom = templateData?.classFrom ?? initialProfileData?.classFrom;
    const rawClassTo = templateData?.classTo ?? initialProfileData?.classTo;
    const hasClasses = rawClassFrom && rawClassTo && rawClassFrom !== 'NA' && rawClassTo !== 'NA';
    const classesText = hasClasses ? `from **Class ${rawClassFrom} to Class ${rawClassTo}**` : 'across foundational, middle, and senior secondary grade levels';

    // Medium fallback (Bilingual / State board handling)
    const rawState = templateData?.state || initialProfileData?.state || '';
    let rawMedium = templateData?.medium || initialProfileData?.medium || '';
    if (!rawMedium || rawMedium === 'NA' || rawMedium === '-') {
      if (cleanBoard.toLowerCase().includes('state')) {
        rawMedium = `${rawState || 'regional state language'} and English medium`;
      } else {
        rawMedium = 'English and bilingual medium';
      }
    } else if (cleanBoard.toLowerCase().includes('state') && !rawMedium.toLowerCase().includes('english')) {
      rawMedium = `${rawMedium} alongside English curriculum support`;
    }

    // 5. Leadership / Principal fallback
    const rawPrincipal = templateData?.principalName || initialProfileData?.principalName;
    const cleanPrincipal = (rawPrincipal && rawPrincipal !== 'NA' && rawPrincipal !== '-') ? rawPrincipal : '';
    const leadershipText = cleanPrincipal
      ? `Under the visionary academic stewardship of Principal **${cleanPrincipal}**`
      : `Under experienced institutional leadership and a dedicated governing council`;

    // 6. Student Community & Faculty fallback
    const rawStudents = displayStudents || templateData?.totalStudents || initialProfileData?.totalStudents;
    const studentNum = Number(String(rawStudents || '').replace(/\D/g, ''));
    const studentsText = (studentNum && studentNum > 0)
      ? `over **${studentNum.toLocaleString('en-IN')} enrolled students**`
      : 'a vibrant student community of **more than 1,000 learners**';

    const rawTeachers = displayTeachers || templateData?.totalTeachers || initialProfileData?.totalTeachers;
    const teacherNum = Number(String(rawTeachers || '').replace(/\D/g, ''));
    const facultyText = (teacherNum && teacherNum > 0)
      ? `a qualified faculty team of **${teacherNum} certified educators**`
      : 'a dedicated team of experienced, student-focused faculty members';

    const rawStr = templateData?.studentTeacherRatio || initialProfileData?.studentTeacherRatio;
    const strText = (rawStr && rawStr !== 'NA' && rawStr !== '-') 
      ? `maintaining a favorable **${rawStr}** student-to-teacher ratio`
      : 'maintaining a balanced student-to-teacher ratio for focused individual mentorship';

    // 7. Campus Infrastructure fallback
    const rawClassrooms = templateData?.totalClassrooms || initialProfileData?.totalClassrooms;
    const classroomNum = Number(String(rawClassrooms || '').replace(/\D/g, ''));
    const classroomText = (classroomNum && classroomNum > 0)
      ? `**${classroomNum}+ instructional classrooms**`
      : 'well-ventilated, spacious learning classrooms';

    // Construct factual verified statement only
    const p1 = `**${displayName}** is an educational institution located in **${locationText}**.`;
    const p2 = `The school is affiliated with **${cleanBoard}** and offers instruction ${classesText}. It is a **${cleanGender}** school with **${rawMedium || 'English'}** medium of instruction${cleanEst ? `, established in the year **${cleanEst}**` : ''}.`;
    const p3 = displayUdise ? `Official UDISE Code: **${displayUdise}**.` : '';

    return [p1, p2, p3].filter(Boolean).join('\n\n');
  }, [
    displayName,
    displayUdise,
    displayBoard,
    displayEstablished,
    displayStudents,
    displayTeachers,
    templateData,
    initialProfileData,
  ]);

  const customAbout = String(templateData?.aboutText || '').trim();
  const effectiveAboutCopy = (customAbout && customAbout !== 'Write about your school here...' && !customAbout.startsWith('At '))
    ? customAbout
    : dynamicGeneratedAbout;

  const fallbackCampusSvg =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' fill='%23002B49'%3E%3Crect width='800' height='600' fill='%230D4979'/%3E%3Crect y='480' width='800' height='120' fill='%2309375C'/%3E%3Cg fill='%23196296' opacity='0.7'%3E%3Crect x='100' y='220' width='220' height='260' rx='8'/%3E%3Crect x='360' y='160' width='340' height='320' rx='8'/%3E%3Cpolygon points='400,160 530,70 660,160' fill='%232279B5'/%3E%3Crect x='490' y='180' width='80' height='100' rx='4' fill='%23EDF5FA' opacity='0.8'/%3E%3C/g%3E%3Cg fill='%23EDF5FA' opacity='0.85'%3E%3Ccircle cx='530' cy='230' r='18' fill='%23005689'/%3E%3Crect x='140' y='260' width='40' height='50' rx='4'/%3E%3Crect x='200' y='260' width='40' height='50' rx='4'/%3E%3Crect x='260' y='260' width='40' height='50' rx='4'/%3E%3Crect x='140' y='340' width='40' height='50' rx='4'/%3E%3Crect x='200' y='340' width='40' height='50' rx='4'/%3E%3Crect x='260' y='340' width='40' height='50' rx='4'/%3E%3Crect x='410' y='320' width='50' height='60' rx='4'/%3E%3Crect x='490' y='320' width='50' height='60' rx='4'/%3E%3Crect x='570' y='320' width='50' height='60' rx='4'/%3E%3Crect x='650' y='320' width='35' height='60' rx='4'/%3E%3C/g%3E%3C/svg%3E";

  return (
    <section id="about" className="-mt-px pt-0 pb-5 lg:py-8 bg-white border-b border-[#E8EAED] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-start">
          {/* Campus Photo (Edge-to-edge full width on all mobile/tablet screens with zero top/side gap) */}
          <div className="lg:col-span-5 lg:order-2">
            {/* Mobile: Full-width edge-to-edge without rounded corners. Tablet & Desktop: Rounded corners and normal width */}
            <div className="-mx-4 w-[calc(100%+2rem)] sm:mx-0 sm:w-full h-[240px] sm:h-[320px] lg:h-[380px] rounded-none sm:rounded-2xl overflow-hidden shadow-none sm:shadow-sm border-0 border-b sm:border border-[#E8EAED] bg-slate-100 group">
              <EditableImage
                imageKey="about_campus_photo"
                src={
                  templateData?.imageOverrides?.about_campus_photo ||
                  initialProfileData?.imageOverrides?.about_campus_photo ||
                  imageUrl
                }
                defaultSrc={fallbackCampusSvg}
                alt={`${displayName} Campus`}
                containerClassName="relative w-full h-full rounded-none sm:rounded-2xl overflow-hidden"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] rounded-none sm:rounded-2xl"
              />
            </div>

            {/* Action Row Below Image: Left-Hand Side UDISE Code + Right-Hand Side Rating, Like & Share */}
            <div className="flex items-center justify-between gap-2 mt-2">
              {/* Left-Hand Side: Clean UDISE Code Label */}
              {displayUdise ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-bold text-slate-700 font-mono select-none" title={`UDISE Code: ${displayUdise}`}>
                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-[9.5px]">UDISE:</span>
                  <span className="text-slate-900 tracking-tight">{displayUdise}</span>
                </div>
              ) : (
                <div />
              )}

              {/* Right-Hand Side: Icon-only Like & Share */}
              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={handleToggleLike}
                  disabled={isLiking}
                  className={`w-8 h-8 inline-flex items-center justify-center rounded-full transition-all border cursor-pointer select-none active:scale-95 ${
                    isLiked
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-slate-200 text-[#3C4043] hover:text-rose-600 hover:bg-rose-50/50 hover:border-rose-200'
                  }`}
                  aria-label={isLiked ? `Unlike school (${likesCount})` : `Like this school (${likesCount})`}
                  title={likesCount > 0 ? `${likesCount} Likes` : isLiked ? 'Unlike school' : 'Like this school'}
                >
                  <Heart
                    className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                      isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-600'
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-white border border-slate-200 text-[#3C4043] hover:text-[#006FCC] hover:border-[#006FCC]/40 transition-all cursor-pointer select-none active:scale-95"
                  aria-label={copiedShare ? 'Link copied' : 'Share school profile'}
                  title={copiedShare ? 'Copied link!' : 'Share school profile'}
                >
                  {copiedShare ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Share2 className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* About Narrative Column (UDISE integrated directly inside About School prose) */}
          <div className="lg:col-span-7 lg:order-1 space-y-3.5 lg:pt-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-2.5 py-0.5 rounded-none mb-2.5 font-['Montserrat',sans-serif]">
                <EditableText
                  contentKey="about_eyebrow"
                  value="ABOUT OUR INSTITUTION"
                  showVerificationBadge={false}
                />
              </span>

              <h1 className="text-[21px] sm:text-[26px] lg:text-[30px] font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-[1.26] pl-3 border-l-[3px] border-[#006FCC] m-0">
                <EditableText
                  contentKey="about_heading_l1"
                  value={`About ${displayName}`}
                  className="inline text-[#003C6E]"
                  showVerificationBadge={false}
                />
              </h1>
            </div>

            {/* Prominent High-Visibility Official School Admin Banner */}
            {onClaimClick && !canEditSchool && !isEditMode && (
              <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-blue-50/50 border border-emerald-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-100 stroke-[2.4]" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                      <span>Official School Administrator?</span>
                      <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-1.5 py-0.2 rounded">Free</span>
                    </div>
                    <div className="text-[11px] text-emerald-800 font-medium leading-tight">
                      Add your campus facilities, sports grounds, labs, and update school details directly.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  id="claimProfileBannerBtn"
                  onClick={onClaimClick}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-black shadow-xs transition-all inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer hover:shadow"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Add School Facilities</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
                </button>
              </div>
            )}

            {canEditSchool && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-2 my-2 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You are managing this verified official school profile.</span>
                </div>
                <a
                  href="?edit=true"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                >
                  Edit Profile ➔
                </a>
              </div>
            )}

            {isLiveTemplate && isEditMode ? (
              <EditableText
                value={effectiveAboutCopy}
                fieldKey="aboutText"
                multiline={true}
                rows={4}
                showVerificationBadge={false}
                className="text-[#3C4043] leading-[1.68] text-[15px] w-full block font-normal"
              />
            ) : (
              <EditorialMarkupRenderer content={effectiveAboutCopy} />
            )}

            {isEditMode && (
              <div className="flex flex-wrap items-center gap-2 mb-2 p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs w-fit">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Button Controls:</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = (!isApplyBtnHidden).toString();
                    templateCtx?.updateContentOverride?.('apply_btn_hidden', next);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    isApplyBtnHidden
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {isApplyBtnHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{isApplyBtnHidden ? 'Hidden (Click to Show)' : 'Visible (Click to Hide)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = (!isApplyBtnDisabled).toString();
                    templateCtx?.updateContentOverride?.('apply_btn_disabled', next);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    isApplyBtnDisabled
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{isApplyBtnDisabled ? 'Disabled (Click to Enable)' : 'Active (Click to Disable)'}</span>
                </button>
              </div>
            )}

            {isApplyBtnHidden ? (
              isEditMode ? (
                <div className="p-3 border-2 border-dashed border-amber-300 bg-amber-50/70 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-medium">'Apply for Admission' button is hidden from visitors.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => templateCtx?.updateContentOverride?.('apply_btn_hidden', 'false')}
                    className="text-xs font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer shrink-0"
                  >
                    Show Button
                  </button>
                </div>
              ) : null
            ) : (
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  disabled={isApplyBtnDisabled && !isEditMode}
                  onClick={(e) => {
                    if (isApplyBtnDisabled) {
                      e.preventDefault();
                      return;
                    }
                    onApplyClick();
                  }}
                  className={`rounded-xl px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold font-['Montserrat',sans-serif] tracking-wide shadow-xs transition-all inline-flex items-center gap-1.5 ${
                    isApplyBtnDisabled
                      ? 'bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed opacity-85'
                      : 'bg-[#006FCC] hover:bg-[#005399] text-white hover:shadow cursor-pointer'
                  }`}
                >
                  {isApplyBtnDisabled ? (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                      <EditableText
                        contentKey="about_cta_btn_disabled_text"
                        value="Admissions Closed"
                        showVerificationBadge={false}
                      />
                    </>
                  ) : (
                    <>
                      {isUnverified ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-amber-300" />
                          <EditableText
                            contentKey="about_cta_btn"
                            value="Add School Facilities"
                            showVerificationBadge={false}
                          />
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <EditableText
                            contentKey="about_cta_btn"
                            value="Apply for Admission"
                            showVerificationBadge={false}
                          />
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
