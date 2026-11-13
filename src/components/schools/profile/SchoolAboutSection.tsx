'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Share2, Check, ArrowRight, Star } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import EditableImage from '@/components/schools/template/EditableImage';
import EditorialMarkupRenderer from '@/components/schools/profile/EditorialMarkupRenderer';
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
}

export default function SchoolAboutSection({
  displayName,
  displayUdise = '',
  displayBoard = '',
  isLiveTemplate,
  isEditMode,
  templateData,
  initialProfileData,
  imageUrl,
  onApplyClick,
}: SchoolAboutSectionProps) {
  const { user } = useAuth();
  const effectiveUserId =
    user?.id || user?.email || (typeof window !== 'undefined' ? getPersistentClientId() : '');

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

  const udiseMetaText = displayUdise
    ? `UDISE Code **${displayUdise}**${displayBoard ? ` • [${displayBoard}]` : ''}`
    : displayBoard
      ? `[${displayBoard}]`
      : '';

  const defaultAboutCopy = `At ${displayName}${displayUdise ? ` (UDISE Code: **${displayUdise}**${displayBoard ? `, **${displayBoard}**` : ''})` : ''}, education goes beyond textbook instruction to build confident, compassionate, and capable learners. Our student-centered approach nurtures conceptual clarity, creative expression, and strong academic foundations.`;

  const customAbout = String(templateData?.aboutText || '').trim();
  const effectiveAboutCopy = customAbout
    ? displayUdise && !customAbout.includes(displayUdise)
      ? `${customAbout}\n\n${udiseMetaText}`
      : customAbout
    : defaultAboutCopy;

  const fallbackCampusSvg =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' fill='%23002B49'%3E%3Crect width='800' height='600' fill='%230D4979'/%3E%3Crect y='480' width='800' height='120' fill='%2309375C'/%3E%3Cg fill='%23196296' opacity='0.7'%3E%3Crect x='100' y='220' width='220' height='260' rx='8'/%3E%3Crect x='360' y='160' width='340' height='320' rx='8'/%3E%3Cpolygon points='400,160 530,70 660,160' fill='%232279B5'/%3E%3Crect x='490' y='180' width='80' height='100' rx='4' fill='%23EDF5FA' opacity='0.8'/%3E%3C/g%3E%3Cg fill='%23EDF5FA' opacity='0.85'%3E%3Ccircle cx='530' cy='230' r='18' fill='%23005689'/%3E%3Crect x='140' y='260' width='40' height='50' rx='4'/%3E%3Crect x='200' y='260' width='40' height='50' rx='4'/%3E%3Crect x='260' y='260' width='40' height='50' rx='4'/%3E%3Crect x='140' y='340' width='40' height='50' rx='4'/%3E%3Crect x='200' y='340' width='40' height='50' rx='4'/%3E%3Crect x='260' y='340' width='40' height='50' rx='4'/%3E%3Crect x='410' y='320' width='50' height='60' rx='4'/%3E%3Crect x='490' y='320' width='50' height='60' rx='4'/%3E%3Crect x='570' y='320' width='50' height='60' rx='4'/%3E%3Crect x='650' y='320' width='35' height='60' rx='4'/%3E%3C/g%3E%3C/svg%3E";

  return (
    <section id="about" className="-mt-px pt-0 pb-5 lg:py-8 bg-white border-b border-[#E8EAED] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-start">
          {/* Campus Photo (Edge-to-edge full width on all mobile/tablet screens with zero top/side gap) */}
          <div className="lg:col-span-5 lg:order-2">
            <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] lg:mx-0 lg:w-full h-[250px] sm:h-[340px] lg:h-[380px] rounded-none lg:rounded-2xl overflow-hidden shadow-none lg:shadow-sm border-0 border-b lg:border border-[#E8EAED] bg-slate-100 group">
              <EditableImage
                imageKey="about_campus_photo"
                src={
                  templateData?.imageOverrides?.about_campus_photo ||
                  initialProfileData?.imageOverrides?.about_campus_photo ||
                  imageUrl
                }
                defaultSrc={fallbackCampusSvg}
                alt={`${displayName} Campus`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Action Row Below Image on Right-Hand Side: School Rating + Icon-only Like & Share */}
            <div className="flex items-center justify-end gap-2 mt-2">
              <div
                className="inline-flex items-center gap-1 h-8 px-2.5 rounded-full bg-amber-50 border border-amber-200/90 text-amber-800 text-xs font-bold select-none"
                title={`Rated ${ratingValue} out of 5`}
                aria-label={`School rating ${ratingValue} out of 5`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                <span>{ratingValue}</span>
              </div>

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

            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onApplyClick}
                className="rounded-xl px-4 py-2 sm:px-5 sm:py-2.5 bg-[#006FCC] hover:bg-[#005399] text-white text-xs sm:text-sm font-bold font-['Montserrat',sans-serif] tracking-wide shadow-xs hover:shadow transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <EditableText
                  contentKey="about_cta_btn"
                  value="Apply for Admission"
                  showVerificationBadge={false}
                />
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
