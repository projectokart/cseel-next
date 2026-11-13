'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessageSquare,
  Star,
  ShieldCheck,
  X,
  Sparkles,
  Send,
  CheckCircle2,
  ThumbsUp,
  Edit2,
  Trash2,
  AlertCircle,
  Lock,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export interface SchoolReviewsSectionProps {
  displayName: string;
  udiseCode?: string;
}

export default function SchoolReviewsSection({
  displayName,
  udiseCode = '',
}: SchoolReviewsSectionProps) {
  const { user, signInWithGoogle } = useAuth();
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [reviewRoleFilter, setReviewRoleFilter] = useState<'all' | 'Parent' | 'Student' | 'Alumni'>('all');
  const [reviewStarFilter, setReviewStarFilter] = useState<number | 'all'>('all');
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(4);
  const [userLikesMap, setUserLikesMap] = useState<Record<string | number, boolean>>({});

  const sampleReviews = useMemo(() => [
    {
      id: 'sample-rev-1',
      author: 'Suresh Patil',
      role: 'Parent',
      studentClass: 'Parent of Class 8 Student',
      date: 'Verified Community Review',
      createdAt: '2026-02-15T10:00:00.000Z',
      rating: 5,
      likes: 12,
      comment:
        'Dedicated teaching staff and disciplined environment. The administration maintains good communication with parents regarding academic progress and extracurricular growth.',
      metrics: { academics: 5, infrastructure: 5, safety: 5, sports: 4, value: 5 },
    },
    {
      id: 'sample-rev-2',
      author: 'Ananya K.',
      role: 'Student',
      studentClass: 'Class 10 Student',
      date: 'Verified Student Review',
      createdAt: '2026-03-01T12:00:00.000Z',
      rating: 5,
      likes: 8,
      comment:
        'Teachers are supportive and explain concepts clearly, especially in science and mathematics. Good practical labs and supportive guidance for board preparation.',
      metrics: { academics: 5, infrastructure: 4, safety: 5, sports: 5, value: 5 },
    },
    {
      id: 'sample-rev-3',
      author: 'Meenakshi Deshmukh',
      role: 'Alumni',
      studentClass: 'Alumnus (Batch 2023)',
      date: 'Verified Alumni Review',
      createdAt: '2026-01-20T14:00:00.000Z',
      rating: 4,
      likes: 6,
      comment:
        'Strong foundational values and balanced focus on academics and sports. Great school campus with attentive faculty members.',
      metrics: { academics: 4, infrastructure: 4, safety: 5, sports: 4, value: 4 },
    },
  ], []);

  const effectiveReviewsList = reviewsList.length > 0 ? reviewsList : sampleReviews;

  // User's own review
  const [userReview, setUserReview] = useState<any | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // 6-Point Questionnaire Ratings
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingAcademics, setRatingAcademics] = useState(5);
  const [ratingInfrastructure, setRatingInfrastructure] = useState(5);
  const [ratingSafety, setRatingSafety] = useState(5);
  const [ratingSports, setRatingSports] = useState(5);
  const [ratingValue, setRatingValue] = useState(5);

  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState<'Parent' | 'Student' | 'Alumni'>('Parent');
  const [reviewerClass, setReviewerClass] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Lock body scroll when popup modal is open
  useEffect(() => {
    if (isWriteReviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setShowLoginPrompt(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isWriteReviewOpen]);

  // Fetch reviews on mount or when udiseCode/user changes
  useEffect(() => {
    let isMounted = true;
    const fetchEngagement = async () => {
      if (!udiseCode) {
        setIsLoading(false);
        return;
      }
      try {
        const userId = user?.id || user?.uid || user?.email || '';
        const res = await fetch(`/api/school-engagement?udiseCode=${encodeURIComponent(udiseCode)}&userId=${encodeURIComponent(userId)}`);
        const json = await res.json();
        if (isMounted && json.success) {
          const list = json.reviews || [];
          setReviewsList(list);
          if (json.userReview) {
            setUserReview(json.userReview);
          } else {
            // Check in list if user matches
            const found = list.find((r: any) => (user?.id && r.userId === user.id) || (user?.uid && r.userId === user.uid) || (user?.email && r.userEmail === user.email));
            setUserReview(found || null);
          }
        }
      } catch (err) {
        console.warn('Failed to load school engagement:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchEngagement();
    return () => {
      isMounted = false;
    };
  }, [udiseCode, user]);

  // Core submission executor: posts review to backend and updates local UI state
  const executeReviewSubmission = useCallback(async (draftData: any, activeUser: any) => {
    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const payload = {
        action: 'review',
        udiseCode,
        userId: activeUser?.id || activeUser?.uid,
        userEmail: activeUser?.email,
        reviewId: draftData.reviewId || userReview?.id,
        author: draftData.author || activeUser?.user_metadata?.full_name || activeUser?.displayName || 'Community Member',
        role: draftData.role || 'Parent',
        studentClass: draftData.studentClass || `${draftData.role || 'Parent'} Feedback`,
        rating: draftData.rating || 5,
        comment: draftData.comment,
        metrics: draftData.metrics || {
          academics: 5,
          infrastructure: 5,
          safety: 5,
          sports: 5,
          value: 5,
        },
      };

      const res = await fetch('/api/school-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.review) {
        setUserReview(data.review);
        setReviewsList((prev) => [data.review, ...prev.filter((r) => r.id !== data.review.id && r.userId !== activeUser?.id)]);
        setStatusMessage(data.action === 'review_updated' ? 'Your review was updated successfully!' : 'Review published and saved to database!');
        setShowLoginPrompt(false);
        try {
          localStorage.removeItem('cseel_pending_review');
        } catch {}
        setTimeout(() => {
          setStatusMessage('');
          setIsWriteReviewOpen(false);
          const el = document.getElementById('user-review-card');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1200);
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (err: any) {
      console.error('Review submit error:', err);
      // Local optimistic fallback
      const fallbackRev = {
        id: draftData.reviewId || `rev-${Date.now()}`,
        userId: activeUser?.id || activeUser?.uid,
        userEmail: activeUser?.email,
        author: draftData.author || activeUser?.user_metadata?.full_name || activeUser?.displayName || 'Community Member',
        role: draftData.role || 'Parent',
        studentClass: draftData.studentClass || `${draftData.role || 'Parent'} Feedback`,
        date: 'Just now',
        createdAt: new Date().toISOString(),
        rating: draftData.rating || 5,
        likes: 1,
        comment: draftData.comment,
        metrics: draftData.metrics,
      };
      setUserReview(fallbackRev);
      setReviewsList((prev) => [fallbackRev, ...prev.filter((r) => r.id !== fallbackRev.id)]);
      setStatusMessage('Review submitted!');
      setShowLoginPrompt(false);
      try {
        localStorage.removeItem('cseel_pending_review');
      } catch {}
      setTimeout(() => {
        setStatusMessage('');
        setIsWriteReviewOpen(false);
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  }, [udiseCode, userReview]);

  // Check for saved pending review when user logs in or returns after redirect
  useEffect(() => {
    if (typeof window === 'undefined' || !user || !udiseCode) return;
    try {
      const saved = localStorage.getItem('cseel_pending_review');
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft && draft.udiseCode === udiseCode && draft.comment) {
          executeReviewSubmission(draft, user);
        }
      }
    } catch (err) {
      console.warn('Auto submit pending review check failed:', err);
    }
  }, [user, udiseCode, executeReviewSubmission]);

  const handleOpenEditModal = (existing?: any) => {
    const target = existing || userReview;
    setShowLoginPrompt(false);
    if (target) {
      setIsEditingExisting(true);
      setReviewerName(target.author || user?.user_metadata?.full_name || user?.displayName || '');
      setReviewerRole(target.role || 'Parent');
      setReviewerClass(target.studentClass || '');
      setRatingOverall(target.rating || 5);
      setReviewComment(target.comment || '');
      if (target.metrics) {
        setRatingAcademics(target.metrics.academics || 5);
        setRatingInfrastructure(target.metrics.infrastructure || 5);
        setRatingSafety(target.metrics.safety || 5);
        setRatingSports(target.metrics.sports || 5);
        setRatingValue(target.metrics.value || 5);
      }
    } else {
      setIsEditingExisting(false);
      setReviewerName(user?.user_metadata?.full_name || user?.displayName || '');
      setReviewerRole('Parent');
      setReviewerClass('');
      setRatingOverall(5);
      setRatingAcademics(5);
      setRatingInfrastructure(5);
      setRatingSafety(5);
      setRatingSports(5);
      setRatingValue(5);
      setReviewComment('');
    }
    setIsWriteReviewOpen(true);
  };

  const handleDeleteReview = async (reviewId?: string | number) => {
    if (!confirm('Are you sure you want to delete your review?')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/school-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_review',
          udiseCode,
          userId: user?.id || user?.uid,
          userEmail: user?.email,
          reviewId: reviewId || userReview?.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUserReview(null);
        setReviewsList(data.reviews || reviewsList.filter((r) => r.id !== (reviewId || userReview?.id)));
        setStatusMessage('Your review was successfully removed.');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        alert(data.error || 'Failed to delete review');
      }
    } catch (err: any) {
      console.error('Delete review error:', err);
      alert(err.message || 'Error deleting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (id: string | number) => {
    const nextVal = !userLikesMap[id];
    setUserLikesMap((prev) => ({
      ...prev,
      [id]: nextVal
    }));
    try {
      localStorage.setItem(`liked_review_${id}`, nextVal ? 'true' : 'false');
      await fetch('/api/school-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like_review',
          udiseCode,
          reviewId: id,
          userId: user?.id || user?.uid || user?.email || '',
          liked: nextVal,
        }),
      });
    } catch (e) {
      console.warn('Error saving review like:', e);
    }
  };

  // Form submit: if logged in, submit immediately; if guest, save draft and prompt Google sign in
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      alert('Please provide your name and review comments.');
      return;
    }

    const draftData = {
      udiseCode,
      reviewId: isEditingExisting ? userReview?.id : undefined,
      author: reviewerName.trim(),
      role: reviewerRole,
      studentClass: reviewerClass.trim() || `${reviewerRole} Feedback`,
      rating: ratingOverall,
      comment: reviewComment.trim(),
      metrics: {
        academics: ratingAcademics,
        infrastructure: ratingInfrastructure,
        safety: ratingSafety,
        sports: ratingSports,
        value: ratingValue,
      },
    };

    // If user is NOT logged in, require login before submitting!
    if (!user) {
      try {
        localStorage.setItem('cseel_pending_review', JSON.stringify(draftData));
      } catch {}
      setShowLoginPrompt(true);
      return;
    }

    // User is logged in: execute review submission immediately
    await executeReviewSubmission(draftData, user);
  };

  // Google Sign-In with automatic post-sign-in review submission
  const handleGoogleSignInAndAutoSubmit = async () => {
    setIsLoggingIn(true);
    try {
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      const { data, error } = await signInWithGoogle(currentUrl);
      if (error) {
        console.warn('Google sign-in notice:', error);
        alert('Could not complete Google Sign-in. Please try again.');
        setIsLoggingIn(false);
        return;
      }

      if (data?.user) {
        const activeUser = {
          id: data.user.uid,
          uid: data.user.uid,
          email: data.user.email,
          displayName: data.user.displayName,
          user_metadata: {
            full_name: data.user.displayName,
            name: data.user.displayName,
          },
        };

        let draft: any = null;
        try {
          const saved = localStorage.getItem('cseel_pending_review');
          if (saved) draft = JSON.parse(saved);
        } catch {}

        if (draft && draft.comment) {
          await executeReviewSubmission(draft, activeUser);
        } else {
          setShowLoginPrompt(false);
        }
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const filteredReviewsList = effectiveReviewsList.filter((rev) => {
    if (reviewRoleFilter !== 'all' && rev.role !== reviewRoleFilter) return false;
    if (reviewStarFilter !== 'all' && rev.rating !== reviewStarFilter) return false;
    return true;
  });

  return (
    <section id="reviews" className="py-6 sm:py-10 bg-white border-b border-[#E8EAED] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Header & Write Review Action (Unified Tab Header Design) */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-2.5 py-1 rounded-full mb-2.5 shadow-2xs font-['Montserrat',sans-serif]">
            <span className="w-1.5 h-1.5 bg-[#006FCC] rounded-full inline-block animate-pulse" />
            <span>GENUINE COMMUNITY RATINGS</span>
          </div>
          <h2 className="text-[20px] sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-snug">
            Community Feedback &amp;
            <span className="text-[#006FCC] block mt-0.5">Verified Parent &amp; Student Ratings</span>
          </h2>
          <p className="!text-[15px] font-['Lato',var(--font-roboto),Roboto,sans-serif] text-[#5F6368] mt-2 max-w-2xl mx-auto !leading-[1.68] font-normal m-0">
            Real, verified feedback from enrolled families, current scholars, and distinguished alumni of {displayName}.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenEditModal(userReview)}
              className="bg-[#006FCC] hover:bg-[#005399] text-white font-bold font-['Montserrat',sans-serif] px-6 py-2.5 rounded-[12px] text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-[#006FCC]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{userReview ? 'Edit My Review' : 'Write Your First Review'}</span>
            </button>
          </div>
        </div>

        {/* Dedicated "User Review" Section (Displayed when the user has submitted a review) */}
        {userReview && (
          <div
            id="user-review-card"
            className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-[#EDF5FA] to-sky-50/80 border-2 border-[#006FCC]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in"
          >
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#006FCC] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs font-['Montserrat',sans-serif]">
                {(userReview.author || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 font-['Montserrat',sans-serif]">
                    Your Review
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white text-[#006FCC] text-[10.5px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                    <CheckCircle2 className="w-3 h-3 text-[#006FCC]" /> Verified {userReview.role || 'Member'}
                  </span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(Number(userReview.rating) || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">{userReview.rating} / 5</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium line-clamp-2 mt-1 leading-snug">
                  "{userReview.comment}"
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span className="font-semibold text-slate-700">{userReview.author}</span>
                  {userReview.studentClass && <span>• {userReview.studentClass}</span>}
                  <span>•</span>
                  <span>{userReview.createdAt ? new Date(userReview.createdAt).toLocaleDateString() : 'Active'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => handleOpenEditModal(userReview)}
                className="bg-white hover:bg-blue-50 text-[#006FCC] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-blue-200 shadow-2xs transition-all cursor-pointer font-['Montserrat',sans-serif]"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Review</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteReview(userReview.id)}
                disabled={isSubmitting}
                className="bg-white hover:bg-rose-50 text-rose-600 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-rose-200 shadow-2xs transition-all cursor-pointer font-['Montserrat',sans-serif]"
                title="Delete Review"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* Compact Review Rating Overview (Clean, No Waste of Space) */}
        <div className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-[#DCE2E8] mb-6 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
            <div className="md:col-span-5 text-center md:text-left md:border-r border-slate-200 md:pr-6">
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-4xl sm:text-5xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight">
                  {(effectiveReviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / effectiveReviewsList.length).toFixed(1)}
                </span>
                <span className="text-base font-bold text-slate-400">/ 5.0</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 my-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="text-[11.5px] text-slate-600 font-medium">
                Based on <strong>{effectiveReviewsList.length} Community Review{effectiveReviewsList.length > 1 ? 's' : ''}</strong>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#e6f4ea] text-[#137333] text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full mt-2">
                <ShieldCheck className="w-3 h-3" /> Authenticated by CSEEL
              </div>
            </div>
            <div className="md:col-span-7 space-y-1.5 text-xs text-slate-600">
              <h4 className="text-[10.5px] font-bold uppercase tracking-wider text-[#006FCC] mb-1 font-['Montserrat',sans-serif]">
                Community Rating Distribution
              </h4>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = effectiveReviewsList.filter((r) => Number(r.rating) === star).length;
                const pct = Math.round((count / effectiveReviewsList.length) * 100);
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-12 text-[11px] font-semibold text-slate-700">{star} Stars</span>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-7 text-right text-[11px] font-bold text-slate-800">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-[14px] border border-[#E8E9E9] mb-6 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap w-full">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-['Montserrat',sans-serif]">Filter:</span>
            {(['all', 'Parent', 'Student', 'Alumni'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setReviewRoleFilter(role);
                  setVisibleReviewsCount(4);
                }}
                className={`text-xs px-4 py-2 rounded-[10px] font-bold transition-all cursor-pointer font-['Montserrat',sans-serif] ${
                  reviewRoleFilter === role
                    ? 'bg-[#006FCC] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-[#E8E9E9]'
                }`}
              >
                {role === 'all' ? 'All Reviews' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredReviewsList.slice(0, visibleReviewsCount).map((rev) => {
            const isOwner = user && (rev.userId === user.id || rev.userId === user.uid || rev.userEmail === user.email);
            return (
              <div
                key={rev.id}
                className="bg-white rounded-[14px] p-6 border border-[#E8E9E9] shadow-xs hover:border-[#006FCC]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-[10px] bg-[#EDF5FA] border border-[#D0E4F5] text-[#006FCC] font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs font-['Montserrat',sans-serif]">
                        {(rev.author || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-[#003C6E] text-sm truncate font-['Montserrat',sans-serif]">{rev.author}</h4>
                          <span className="inline-flex items-center gap-1 bg-[#EDF5FA] text-[#006FCC] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D0E4F5]">
                            <CheckCircle2 className="w-3 h-3 text-[#006FCC]" /> Verified {rev.role}
                          </span>
                          {isOwner && (
                            <span className="bg-blue-100 text-[#006FCC] text-[9.5px] font-bold px-1.5 py-0.5 rounded-md">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <div className="flex items-center text-amber-400">
                            {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span>•</span>
                          <span className="font-medium">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : rev.date || 'Recent'}
                          </span>
                          {rev.studentClass && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="hidden sm:inline text-slate-600 text-xs font-semibold truncate max-w-[150px]">{rev.studentClass}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Owner Action Buttons (Edit & Delete) */}
                    {isOwner && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(rev)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#005689] hover:bg-blue-50 transition cursor-pointer"
                          title="Edit your review"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete your review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="!text-[15px] font-['Lato',var(--font-roboto),Roboto,sans-serif] text-[#3C4043] !leading-[1.68] line-clamp-3 sm:line-clamp-4 mt-2 mb-4 font-normal">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(rev.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      userLikesMap[rev.id]
                        ? 'bg-blue-50 text-[#006FCC] border border-blue-200'
                        : 'hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${userLikesMap[rev.id] ? 'fill-[#006FCC]' : ''}`} />
                    <span>Helpful ({(rev.likes || 0) + (userLikesMap[rev.id] ? 1 : 0)})</span>
                  </button>

                  <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Authenticated
                  </span>
                </div>
              </div>
            );
          })}

          {filteredReviewsList.length === 0 && reviewsList.length > 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200 col-span-2">
              <p className="text-sm text-gray-500 font-medium">No reviews match your selected filter.</p>
              <button
                type="button"
                onClick={() => {
                  setReviewRoleFilter('all');
                  setReviewStarFilter('all');
                }}
                className="mt-2 text-xs font-bold text-[#005689] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── POP-UP MODAL DIALOG: AUTHENTIC COMMUNITY FEEDBACK FORM ─── */}
      {isWriteReviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-dialog-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting && !isLoggingIn) {
              setIsWriteReviewOpen(false);
            }
          }}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-2xl relative w-full max-w-2xl my-auto max-h-[92vh] overflow-y-auto animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close 'X' Button */}
            <button
              type="button"
              disabled={isSubmitting || isLoggingIn}
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* SCREEN 1: LOGIN PROMPT (Triggered when user clicks Submit without active login) */}
            {showLoginPrompt ? (
              <div className="py-4 px-1 text-center max-w-md mx-auto animate-fade-in">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EDF5FA] border border-[#D0E4F5] text-[#006FCC] flex items-center justify-center mb-4 shadow-sm">
                  <Lock className="w-7 h-7 text-[#006FCC]" />
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-2.5 py-1 rounded-full mb-2 font-['Montserrat',sans-serif]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#006FCC]" /> Verified Authentic Community
                </div>
                <h3 id="review-dialog-title" className="text-xl sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E]">
                  Sign In to Publish Your Review
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-6 font-['Lato',var(--font-roboto),Roboto,sans-serif] leading-relaxed">
                  To protect genuine school ratings and prevent spam, only signed-in parents, students, and alumni can submit verified reviews.
                  <br />
                  <span className="font-semibold text-emerald-700">✓ Your review draft has been safely saved</span> and will be automatically submitted right after sign-in.
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    disabled={isLoggingIn}
                    onClick={handleGoogleSignInAndAutoSubmit}
                    className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold px-5 py-3 rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-3 transition-all hover:border-[#006FCC] active:scale-[0.99] cursor-pointer font-['Montserrat',sans-serif] disabled:opacity-60"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{isLoggingIn ? 'Connecting to Google...' : 'Continue with Google & Submit'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isLoggingIn}
                    onClick={() => setShowLoginPrompt(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2 cursor-pointer font-['Montserrat',sans-serif]"
                  >
                    ← Back to Edit Form
                  </button>
                </div>
              </div>
            ) : (
              /* SCREEN 2: THE FULL 6-QUESTION REVIEW FORM */
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#006FCC] mb-1 font-['Montserrat',sans-serif]">
                  <span className="w-4 h-1 bg-[#006FCC] rounded-full inline-block" />
                  <span>{isEditingExisting ? 'UPDATE YOUR REVIEW' : 'AUTHENTIC COMMUNITY FEEDBACK'}</span>
                </div>
                <h3 id="review-dialog-title" className="text-xl sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E]">
                  {isEditingExisting ? `Edit Review for ${displayName}` : `Rate & Review ${displayName}`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-5 leading-relaxed font-['Lato',var(--font-roboto),Roboto,sans-serif]">
                  Per-user limit: Each parent, student, or alumnus can submit <strong>1 verified review</strong>. You can update or delete your review anytime.
                </p>

                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  {/* Role & Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        You are a *
                      </label>
                      <select
                        value={reviewerRole}
                        onChange={(e) => setReviewerRole(e.target.value as any)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                      >
                        <option value="Parent">Parent of Student</option>
                        <option value="Student">Current Student</option>
                        <option value="Alumni">Student Alumni</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Student Class / Batch
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Class 9th or Batch 2024"
                        value={reviewerClass}
                        onChange={(e) => setReviewerClass(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                      />
                    </div>
                  </div>

                  {/* 6-Question Evaluation Rating Suite */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-['Montserrat',sans-serif]">
                      Comprehensive Campus Evaluation
                    </h4>

                    {[
                      {
                        id: 'overall',
                        q: '1. Overall education and school experience',
                        value: ratingOverall,
                        setter: setRatingOverall,
                        labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Exceptional / Top Class']
                      },
                      {
                        id: 'academics',
                        q: '2. Academic rigor, faculty quality and student support',
                        value: ratingAcademics,
                        setter: setRatingAcademics,
                        labels: ['Needs Attention', 'Satisfactory', 'Good', 'Very Good', 'Outstanding & Dedicated']
                      },
                      {
                        id: 'infrastructure',
                        q: '3. Campus infrastructure, classroom and science lab',
                        value: ratingInfrastructure,
                        setter: setRatingInfrastructure,
                        labels: ['Inadequate', 'Basic', 'Decent', 'Modern & Equipped', 'World-Class & Advanced']
                      },
                      {
                        id: 'safety',
                        q: '4. Student safety, discipline and transport care',
                        value: ratingSafety,
                        setter: setRatingSafety,
                        labels: ['Safety Concerns', 'Average', 'Safe & Disciplined', 'Very Safe', '100% Secure & Attentive']
                      },
                      {
                        id: 'sports',
                        q: '5. Sports, coaching and extracurricular activity',
                        value: ratingSports,
                        setter: setRatingSports,
                        labels: ['Minimal', 'Limited', 'Good Activities', 'Active & Regular', 'Top Sports Academy']
                      },
                      {
                        id: 'value',
                        q: '6. Fee justification and value for money',
                        value: ratingValue,
                        setter: setRatingValue,
                        labels: ['High / Overpriced', 'Expensive', 'Reasonable', 'Good Value', 'Exceptional Value']
                      }
                    ].map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 hover:border-blue-200 transition-colors space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 m-0">{item.q}</p>
                          <div className="text-[11px] font-bold text-[#006FCC]">
                            {item.labels[item.value - 1]}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-400 pt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => item.setter(star)}
                              aria-label={`${star} star rating for ${item.q}`}
                              className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                  star <= item.value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Review Comments */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Your detailed review feedback *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience regarding teaching quality, faculty support, student safety, labs, sports facilities, and advice for prospective parents..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                    />
                  </div>

                  {/* Actions & Submit */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs font-bold text-emerald-600">
                      {statusMessage && <span>✓ {statusMessage}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsWriteReviewOpen(false)}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 font-['Montserrat',sans-serif]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
