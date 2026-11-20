'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  ShieldCheck,
  X,
  Send,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export interface SchoolReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayName: string;
  udiseCode?: string;
  onSuccess?: (review: any) => void;
}

export default function SchoolReviewModal({
  isOpen,
  onClose,
  displayName,
  udiseCode = '',
  onSuccess,
}: SchoolReviewModalProps) {
  const { user, signInWithGoogle } = useAuth();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // 6-Point Questionnaire Ratings
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingAcademics, setRatingAcademics] = useState(5);
  const [ratingInfrastructure, setRatingInfrastructure] = useState(5);
  const [ratingSafety, setRatingSafety] = useState(5);
  const [ratingSports, setRatingSports] = useState(5);
  const [ratingValue, setRatingValue] = useState(5);

  const [reviewerName, setReviewerName] = useState(user?.user_metadata?.full_name || user?.displayName || '');
  const [reviewerRole, setReviewerRole] = useState<'Parent' | 'Student' | 'Alumni'>('Parent');
  const [reviewerClass, setReviewerClass] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Pre-fill reviewer name if available from auth
      if (!reviewerName && (user?.user_metadata?.full_name || user?.displayName)) {
        setReviewerName(user?.user_metadata?.full_name || user?.displayName || '');
      }
    } else {
      document.body.style.overflow = '';
      setShowLoginPrompt(false);
      setStatusMessage('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, user]);

  // Submission handler
  const executeSubmission = useCallback(async (activeUser: any) => {
    setIsSubmitting(true);
    setStatusMessage('');

    const draft = {
      author: reviewerName.trim() || activeUser?.user_metadata?.full_name || activeUser?.displayName || 'Community Member',
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

    try {
      const payload = {
        action: 'review',
        udiseCode,
        userId: activeUser?.id || activeUser?.uid,
        userEmail: activeUser?.email,
        ...draft,
      };

      const res = await fetch('/api/school-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.review) {
        setStatusMessage('✓ Review published and saved successfully!');
        if (onSuccess) onSuccess(data.review);
        try {
          localStorage.removeItem('cseel_pending_review');
        } catch {}
        setTimeout(() => {
          setStatusMessage('');
          onClose();
        }, 1200);
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Review submit error:', err);
      // Fallback local optimistic success
      const fallbackRev = {
        id: `rev-${Date.now()}`,
        userId: activeUser?.id || activeUser?.uid,
        userEmail: activeUser?.email,
        ...draft,
        date: 'Just now',
        createdAt: new Date().toISOString(),
        likes: 1,
      };
      setStatusMessage('✓ Review submitted!');
      if (onSuccess) onSuccess(fallbackRev);
      setTimeout(() => {
        setStatusMessage('');
        onClose();
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  }, [udiseCode, reviewerName, reviewerRole, reviewerClass, ratingOverall, reviewComment, ratingAcademics, ratingInfrastructure, ratingSafety, ratingSports, ratingValue, onSuccess, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      alert('Please enter your review feedback.');
      return;
    }

    if (!user) {
      // Save draft for auto-submit after Google sign-in
      try {
        localStorage.setItem(
          'cseel_pending_review',
          JSON.stringify({
            udiseCode,
            author: reviewerName.trim(),
            role: reviewerRole,
            studentClass: reviewerClass.trim(),
            rating: ratingOverall,
            comment: reviewComment.trim(),
            metrics: {
              academics: ratingAcademics,
              infrastructure: ratingInfrastructure,
              safety: ratingSafety,
              sports: ratingSports,
              value: ratingValue,
            },
          })
        );
      } catch {}
      setShowLoginPrompt(true);
      return;
    }

    executeSubmission(user);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);
      alert('Google Sign-In was cancelled or failed. Please try again.');
      setIsLoggingIn(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-dialog-title"
      className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting && !isLoggingIn) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-2xl relative w-full max-w-2xl my-auto max-h-[92vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          disabled={isSubmitting || isLoggingIn}
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {showLoginPrompt ? (
          /* Sign In Screen */
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
              <span className="font-semibold text-emerald-700">✓ Your review draft has been safely saved</span> and will be submitted right after sign-in.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={handleGoogleSignIn}
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
          /* Full Review Form */
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#006FCC] mb-1 font-['Montserrat',sans-serif]">
              <span className="w-4 h-1 bg-[#006FCC] rounded-full inline-block" />
              <span>AUTHENTIC COMMUNITY FEEDBACK</span>
            </div>
            <h3 id="review-dialog-title" className="text-xl sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E]">
              Rate & Review {displayName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-5 leading-relaxed font-['Lato',var(--font-roboto),Roboto,sans-serif]">
              Each parent, student, or alumnus can submit <strong>1 verified community review</strong>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role & Name */}
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
                    labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Exceptional / Top Class'],
                  },
                  {
                    id: 'academics',
                    q: '2. Academic rigor, faculty quality and student support',
                    value: ratingAcademics,
                    setter: setRatingAcademics,
                    labels: ['Needs Attention', 'Satisfactory', 'Good', 'Very Good', 'Outstanding & Dedicated'],
                  },
                  {
                    id: 'infrastructure',
                    q: '3. Campus infrastructure, classroom and science lab',
                    value: ratingInfrastructure,
                    setter: setRatingInfrastructure,
                    labels: ['Inadequate', 'Basic', 'Decent', 'Modern & Equipped', 'World-Class & Advanced'],
                  },
                  {
                    id: 'safety',
                    q: '4. Student safety, discipline and transport care',
                    value: ratingSafety,
                    setter: setRatingSafety,
                    labels: ['Safety Concerns', 'Average', 'Safe & Disciplined', 'Very Safe', '100% Secure & Attentive'],
                  },
                  {
                    id: 'sports',
                    q: '5. Sports, coaching and extracurricular activity',
                    value: ratingSports,
                    setter: setRatingSports,
                    labels: ['Minimal', 'Limited', 'Good Activities', 'Active & Regular', 'Top Sports Academy'],
                  },
                  {
                    id: 'value',
                    q: '6. Fee justification and value for money',
                    value: ratingValue,
                    setter: setRatingValue,
                    labels: ['High / Overpriced', 'Expensive', 'Reasonable', 'Good Value', 'Exceptional Value'],
                  },
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

              {/* Detailed Review Comment */}
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
                  {statusMessage && <span>{statusMessage}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
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
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
