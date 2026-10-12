'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  User,
  Briefcase,
  FileText,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Lock,
  Loader2,
  AlertCircle,
  Clock,
  LogIn,
  Key,
  Compass,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSchoolName?: string;
  currentUser?: any;
}

export default function AddSchoolModal({
  isOpen,
  onClose,
  initialSchoolName = '',
  currentUser: currentUserProp,
}: AddSchoolModalProps) {
  // Authentication State from AuthContext and Supabase Client
  const { user: authContextUser, loading: authContextLoading } = useAuth();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const currentUser = currentUserProp || authContextUser || sessionUser;
  const isAuthLoading = authContextLoading && isSessionLoading && !currentUser;

  // School Information (Clean, Direct Fields as requested)
  const [schoolName, setSchoolName] = useState(initialSchoolName);
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');
  const [localAddress, setLocalAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [note, setNote] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Sync user session
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setErrorMsg(null);
    setIsSubmittedSuccess(false);

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;
        setIsSessionLoading(false);
        const active = session?.user || currentUserProp || authContextUser;
        if (active) {
          setSessionUser(active);
          if (active.email) setContactEmail((prev) => prev || active.email || '');
          const metaName = active.user_metadata?.full_name || active.user_metadata?.name || '';
          if (metaName) setPrincipalName((prev) => prev || metaName);
          const metaPhone = active.user_metadata?.phone || active.phone || '';
          if (metaPhone) setContactNumber((prev) => prev || metaPhone);
        }
      })
      .catch(() => {
        if (isMounted) setIsSessionLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentUserProp, authContextUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.email && !contactEmail) setContactEmail(currentUser.email);
      const metaName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || '';
      if (metaName && !principalName) setPrincipalName(metaName);
      const metaPhone = currentUser.user_metadata?.phone || currentUser.phone || '';
      if (metaPhone && !contactNumber) setContactNumber(metaPhone);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    const returnUrl = typeof window !== 'undefined' ? window.location.pathname : '/schools';
    window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Strict validation: Login MUST
    if (!currentUser) {
      setErrorMsg('Login required: Please sign in with your account to register a school.');
      return;
    }

    // 2. Validate essential fields: Name, State, District, Local Address, Contact, Email
    if (!schoolName.trim()) {
      setErrorMsg('Please enter your School Name.');
      return;
    }

    if (!stateName.trim()) {
      setErrorMsg('Please enter the State where the school is located.');
      return;
    }

    if (!district.trim()) {
      setErrorMsg('Please enter the District.');
      return;
    }

    if (!localAddress.trim()) {
      setErrorMsg('Please enter the School Local Address / Campus Location.');
      return;
    }

    const cleanPhone = contactNumber.replace(/\D/g, '').trim();
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Contact Phone / Mobile number.');
      return;
    }

    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setErrorMsg('Please enter a valid Official Contact Email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/school-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_name: schoolName.trim(),
          state: stateName.trim(),
          district: district.trim(),
          city: localAddress.trim(),
          claimant_name: principalName.trim() || 'Principal / School Representative',
          claimant_email: contactEmail.trim().toLowerCase(),
          whatsapp_number: cleanPhone,
          designation: 'Principal / Management',
          note: `Local Address: ${localAddress.trim()}. Additional Info: ${note.trim()}`,
          request_type: 'add_school',
          user_id: currentUser?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit school registration request.');
      }

      setIsSubmittedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#003c6e] via-[#005689] to-[#0284c7] px-6 py-5 text-white flex items-center justify-between rounded-t-3xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                {isSubmittedSuccess ? 'Registration Submitted' : 'Register Your School'}
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                {isSubmittedSuccess
                  ? 'Request received for administrative approval'
                  : 'Fast-track institutional onboarding (No UDISE barrier)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          {/* ── CASE 1: AUTH LOADING ── */}
          {isAuthLoading && (
            <div className="py-14 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-3 border-[#005689] border-t-transparent animate-spin" />
              <p className="text-xs text-slate-500 font-semibold">Checking authorization status...</p>
            </div>
          )}

          {/* ── CASE 2: USER NOT LOGGED IN (STRICT AUTH GATE) ── */}
          {!isAuthLoading && !currentUser && (
            <div className="text-center py-6 px-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">
                Login Required to Add School
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                To prevent spam and maintain verified ownership, you must be logged in before submitting a new school for registration.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="px-6 py-3 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In with Google / Email
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── CASE 3: SUBMITTED SUCCESS (UNDER REVIEW NOTICE) ── */}
          {!isAuthLoading && currentUser && isSubmittedSuccess && (
            <div className="text-center py-5 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Request Submitted Successfully
                </span>
                <h4 className="text-2xl font-black text-slate-900 mb-1">
                  School Registration Received
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you! Your school registration request for <strong>{schoolName}</strong> has been forwarded to CSEEL Administration.
                </p>
              </div>

              {/* Magic Link Notice */}
              <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 text-left space-y-2 max-w-lg mx-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-[#003c6e]">
                  <Key className="w-4 h-4 text-[#005689]" />
                  What happens next?
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1. Admin verification complete hone par aapke official email (<strong>{contactEmail}</strong>) par <strong>Create School Profile Magic Link</strong> aur <strong>16-Digit Alphanumeric Key</strong> mail ki jayegi.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  2. Magic link par click karke aap school profile template me apna complete data customize karke publish kar sakte hain. Future me usi link se full control (edit, update, unpublish) aapke paas rahega.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-full bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-sm transition cursor-pointer shadow-md"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          )}

          {/* ── CASE 4: LOGGED IN -> CLEAN 6-FIELD INPUT FORM ── */}
          {!isAuthLoading && currentUser && !isSubmittedSuccess && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Account Identity Bar */}
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-medium truncate">
                  <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  Logged in as: <strong className="text-slate-800 truncate">{currentUser.email}</strong>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                  Verified
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. School Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  School Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cambridge International School"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689] font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* 2. State & District (Side by side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haryana, Delhi, Rajasthan"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gurugram, Jaipur, South Delhi"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689] text-slate-800"
                  />
                </div>
              </div>

              {/* 3. Local Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Local Address / Campus Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sector 14, Main Road, Near City Center"
                    value={localAddress}
                    onChange={(e) => setLocalAddress(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689] text-slate-800"
                  />
                </div>
              </div>

              {/* 4. Contact & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689] text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. info@school.edu.in"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689] text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Principal / Representative Name (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Principal / Representative Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689] text-slate-800"
                  />
                </div>
              </div>

              {/* 6. Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note / Special Instructions <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Any details regarding campus, affiliation, or verification..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689] resize-none text-slate-800"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl text-xs sm:text-sm font-bold bg-[#005689] hover:bg-[#003c6e] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Submitting Registration...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>Submit School for Admin Verification</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
