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
  ShieldAlert,
  MapPin,
  Lock,
  Search,
  Loader2,
  AlertCircle,
  HelpCircle,
  CheckCheck,
  Clock,
  Shield,
  LogIn
} from 'lucide-react';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSchoolName?: string;
  initialUdise?: string;
}

export default function AddSchoolModal({
  isOpen,
  onClose,
  initialSchoolName = '',
  initialUdise = '',
}: AddSchoolModalProps) {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // UDISE Verification State
  const [udiseCode, setUdiseCode] = useState(initialUdise);
  const [isVerifyingUdise, setIsVerifyingUdise] = useState(false);
  const [udiseVerified, setUdiseVerified] = useState(false);
  const [udiseError, setUdiseError] = useState<string | null>(null);
  const [verifiedUdiseData, setVerifiedUdiseData] = useState<any | null>(null);

  // Official Auto-filled & Locked Fields
  const [schoolName, setSchoolName] = useState(initialSchoolName);
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [schoolType, setSchoolType] = useState('Day School');

  // Authorized Representative State (Editable)
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [designation, setDesignation] = useState('Principal / Head of Institution');
  const [note, setNote] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Check login state on modal open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsAuthLoading(true);
    setErrorMsg(null);
    setIsSubmittedSuccess(false);

    schoolSearchSupabase.auth
      .getUser()
      .then(({ data: { user }, error }) => {
        if (!isMounted) return;
        setIsAuthLoading(false);
        if (user && !error) {
          setCurrentUser(user);
          if (user.email) setClaimantEmail(user.email);
          const metaName = user.user_metadata?.full_name || user.user_metadata?.name || '';
          if (metaName) setClaimantName(metaName);
          const metaPhone = user.user_metadata?.phone || user.phone || '';
          if (metaPhone) setWhatsappNumber(metaPhone);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => {
        if (isMounted) setIsAuthLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Auto-verify if initialUdise provided
  useEffect(() => {
    if (isOpen && initialUdise && initialUdise.replace(/\D/g, '').length === 11) {
      setUdiseCode(initialUdise.replace(/\D/g, ''));
      handleVerifyUdise(initialUdise.replace(/\D/g, ''));
    }
  }, [isOpen, initialUdise]);

  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    const returnUrl = typeof window !== 'undefined' ? window.location.pathname : '/schools';
    window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  // Verify UDISE function
  const handleVerifyUdise = async (codeToVerify?: string) => {
    const target = (codeToVerify || udiseCode).replace(/\D/g, '').trim();
    setUdiseError(null);
    setErrorMsg(null);

    if (!target || target.length !== 11) {
      setUdiseError('UDISE code must be exactly 11 digits (e.g. 06180101926).');
      setUdiseVerified(false);
      setVerifiedUdiseData(null);
      return;
    }

    setIsVerifyingUdise(true);
    try {
      const res = await fetch(`/api/udise/lookup?code=${target}`);
      const json = await res.json();

      if (!res.ok || !json.success || !json.data?.schoolName) {
        setUdiseVerified(false);
        setVerifiedUdiseData(null);
        setSchoolName('');
        setStateName('');
        setDistrict('');
        setCity('');
        setPincode('');
        setUdiseError(
          json.error || `No official records found for UDISE Code: ${target}. Please check the 11-digit code.`
        );
        return;
      }

      const d = json.data;
      setVerifiedUdiseData(d);
      setUdiseVerified(true);
      setUdiseError(null);

      // Auto-fill locked official attributes
      setSchoolName(d.schoolName?.trim() || '');
      setStateName(d.state?.trim() || '');
      setDistrict(d.district?.trim() || '');
      setCity(d.village?.trim() || d.block?.trim() || d.district?.trim() || '');
      setPincode(d.pincode ? String(d.pincode).trim() : '');
      if (d.board) setBoard(d.board);
      if (d.nature) setSchoolType(d.nature);

      // Suggest representative details if currently empty
      if (!claimantName && d.headMasterName) {
        setClaimantName(d.headMasterName);
      }
      if (!claimantEmail && d.contactEmail) {
        setClaimantEmail(d.contactEmail);
      }
      if (!whatsappNumber && d.contactPhone) {
        setWhatsappNumber(d.contactPhone);
      }
    } catch (err: any) {
      setUdiseVerified(false);
      setVerifiedUdiseData(null);
      setUdiseError('Failed to query official UDISE database. Please check your connection.');
    } finally {
      setIsVerifyingUdise(false);
    }
  };

  // UDISE Code change handler
  const handleUdiseChange = (val: string) => {
    const cleanDigits = val.replace(/\D/g, '').slice(0, 11);
    setUdiseCode(cleanDigits);

    // Reset verification if user modifies code
    if (udiseVerified || udiseError) {
      setUdiseVerified(false);
      setUdiseError(null);
      setVerifiedUdiseData(null);
      setSchoolName('');
      setStateName('');
      setDistrict('');
      setCity('');
      setPincode('');
    }

    // Auto-verify if full 11 digits typed
    if (cleanDigits.length === 11) {
      handleVerifyUdise(cleanDigits);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Strict validation 1: User must be logged in
    if (!currentUser) {
      setErrorMsg('Login required: Please sign in before submitting a claim.');
      return;
    }

    // Strict validation 2: UDISE must be verified
    if (!udiseVerified || !verifiedUdiseData) {
      setErrorMsg('Mandatory: Please enter and verify your official 11-digit UDISE code first.');
      return;
    }

    const cleanUdise = udiseCode.replace(/\D/g, '').trim();
    if (cleanUdise.length !== 11) {
      setErrorMsg('UDISE code must be exactly 11 digits.');
      return;
    }

    if (!schoolName.trim()) {
      setErrorMsg('Official School Name could not be retrieved from UDISE. Please verify again.');
      return;
    }

    if (!claimantName.trim()) {
      setErrorMsg('Please enter the Principal or Representative full name.');
      return;
    }

    if (!claimantEmail.trim() || !claimantEmail.includes('@')) {
      setErrorMsg('Please enter a valid official school email address.');
      return;
    }

    const cleanPhone = whatsappNumber.replace(/\D/g, '').trim();
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/school-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_name: schoolName.trim(),
          udise_code: cleanUdise,
          state: stateName,
          district: district,
          city: city,
          pincode: pincode,
          board: board,
          school_type: schoolType,
          claimant_name: claimantName.trim(),
          claimant_email: claimantEmail.trim().toLowerCase(),
          whatsapp_number: cleanPhone,
          designation: designation.trim(),
          note: `[Verified UDISE Profile] Board: ${board}, Format: ${schoolType}, Location: ${district}, ${stateName} (${pincode}). Note: ${note.trim()}`,
          verified_udise_data: verifiedUdiseData,
          user_id: currentUser?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit school profile claim.');
      }

      setIsSubmittedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col"
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
                {isSubmittedSuccess ? 'Claim Submitted for Verification' : 'Add / Claim Your School Profile'}
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                {isSubmittedSuccess
                  ? 'Request under official administrative review'
                  : 'Official UDISE-verified institutional profile registration'}
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
        <div className="p-6">
          {/* ── CASE 1: AUTH LOADING ── */}
          {isAuthLoading && (
            <div className="py-14 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-3 border-[#005689] border-t-transparent animate-spin" />
              <p className="text-xs text-slate-500 font-semibold">Verifying your account authorization...</p>
            </div>
          )}

          {/* ── CASE 2: USER NOT LOGGED IN (STRICT AUTH GATE) ── */}
          {!isAuthLoading && !currentUser && (
            <div className="text-center py-6 px-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">
                Login Required to Register or Claim School
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                To protect educational institutions and prevent fraudulent profile modifications, you must be signed in with a verified account before claiming or registering a school.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-6 text-xs text-slate-600 space-y-2 max-w-md mx-auto">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Why is verification required?
                </div>
                <p>• Only authorized school heads, principals, and owners can claim profiles.</p>
                <p>• School identity details are verified with official Ministry of Education UDISE+ database.</p>
                <p>• Administrative review is conducted prior to granting profile editing access.</p>
              </div>

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
            <div className="text-center py-5 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-9 h-9" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  Status: Pending Official Verification
                </span>
                <h4 className="text-2xl font-black text-slate-900 mb-1">
                  Claim Request Submitted for Review
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{claimantName}</strong>! Your claim request for <strong>{schoolName}</strong> (UDISE: {udiseCode}) has been received and submitted for administrative review.
                </p>
              </div>

              {/* Security Verification Notice Box */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-left space-y-2 max-w-lg mx-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-[#003c6e]">
                  <ShieldCheck className="w-4 h-4 text-[#005689]" />
                  Official Institutional Security Protocol
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To protect schools and prevent unauthorized access, <strong>profile editing rights are not granted automatically</strong>.
                  Our administrative verification team will cross-check your institution authorization and contact you at:
                </p>
                <div className="p-3 bg-white rounded-xl border border-blue-200/80 text-xs font-medium text-slate-700 space-y-1">
                  <p>• <strong>Email:</strong> {claimantEmail}</p>
                  <p>• <strong>WhatsApp:</strong> {whatsappNumber}</p>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Once verified and approved, school profile management access will be automatically activated on your account.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition cursor-pointer shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* ── CASE 4: LOGGED IN -> INPUT FORM ── */}
          {!isAuthLoading && currentUser && !isSubmittedSuccess && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Identity Bar */}
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Signed in as: <strong className="text-slate-800">{currentUser.email}</strong>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Authenticated
                </span>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* ── STEP 1: UDISE CODE VERIFICATION (MANDATORY) ── */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 border-2 border-[#005689]/20 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[#003c6e] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#005689]" />
                    Official UDISE+ Code (11 Digits) <span className="text-rose-500">*</span>
                  </label>
                  {udiseVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Record
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={11}
                      required
                      placeholder="e.g. 06180101926"
                      value={udiseCode}
                      onChange={(e) => handleUdiseChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689] bg-white font-bold text-slate-800"
                    />
                    {udiseCode.length > 0 && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400">
                        {udiseCode.length}/11
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVerifyUdise()}
                    disabled={isVerifyingUdise || udiseCode.length !== 11}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                      udiseCode.length === 11 && !isVerifyingUdise
                        ? 'bg-[#005689] hover:bg-[#003c6e] text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isVerifyingUdise ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Check & Verify UDISE</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {udiseError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{udiseError}</span>
                  </div>
                )}

                {udiseVerified && verifiedUdiseData && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 shadow-2xs">
                    <CheckCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {verifiedUdiseData.schoolName}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium">
                        District: {verifiedUdiseData.district || 'N/A'} • State: {verifiedUdiseData.state || 'N/A'} • Pincode: {verifiedUdiseData.pincode || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {!udiseVerified && !udiseError && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    Bina 11-digit UDISE verify kiye submission enable nahi hoga. School name, state, district & pincode UDISE se auto-fill hokar permanently lock rahenge.
                  </p>
                )}
              </div>

              {/* ── STEP 2: SCHOOL IDENTITY (AUTOFILLED & LOCKED) ── */}
              <div className="space-y-3 pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#005689]" />
                    Official School Identity (Locked)
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> Always Locked from UDISE
                  </span>
                </div>

                {/* School Name (Always Locked) */}
                <div>
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Official School Name</span>
                    {schoolName && (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      required
                      placeholder={udiseVerified ? '' : 'Auto-fills from verified UDISE code...'}
                      value={schoolName}
                      className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-100 text-slate-800 cursor-not-allowed select-none"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* State, District, City & Pincode Grid (All Locked) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      State (Locked)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        placeholder="State..."
                        value={stateName}
                        className="w-full pl-2.5 pr-6 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-100 text-slate-700 cursor-not-allowed select-none"
                      />
                      <Lock className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      District (Locked)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        placeholder="District..."
                        value={district}
                        className="w-full pl-2.5 pr-6 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-100 text-slate-700 cursor-not-allowed select-none"
                      />
                      <Lock className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      City / Area (Locked)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        placeholder="City/Area..."
                        value={city}
                        className="w-full pl-2.5 pr-6 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-100 text-slate-700 cursor-not-allowed select-none"
                      />
                      <Lock className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Pincode (Locked)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        placeholder="Pincode..."
                        value={pincode}
                        className="w-full pl-2.5 pr-6 py-2 rounded-xl border border-slate-200 text-xs font-mono font-medium bg-slate-100 text-slate-700 cursor-not-allowed select-none"
                      />
                      <Lock className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Board Affiliation & School Format (Locked) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Board Affiliation (from UDISE)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={board}
                        className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-200 text-xs bg-slate-100 text-slate-700 font-semibold cursor-not-allowed"
                      />
                      <Lock className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      School Format (from UDISE)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={schoolType}
                        className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-200 text-xs bg-slate-100 text-slate-700 font-semibold cursor-not-allowed"
                      />
                      <Lock className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── STEP 3: AUTHORIZED REPRESENTATIVE DETAILS (EDITABLE) ── */}
              <div className="space-y-3 pb-3 border-b border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#005689]" />
                  Authorized Representative Details (Claimant)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Designation / Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Principal / Director"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. principal@school.edu.in"
                      value={claimantEmail}
                      onChange={(e) => setClaimantEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verification Note / Highlights
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Provide website link, affiliation number, or notes for admin verification..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689]"
                  />
                </div>
              </div>

              {/* ── STEP 4: SUBMIT & ACTION BUTTONS ── */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={!udiseVerified || isSubmitting}
                  className={`w-full sm:w-auto flex-1 py-3 px-6 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                    udiseVerified && !isSubmitting
                      ? 'bg-[#005689] hover:bg-[#003c6e] text-white cursor-pointer hover:shadow-lg'
                      : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
                  }`}
                  title={!udiseVerified ? 'Please verify 11-digit UDISE code first' : ''}
                >
                  {!udiseVerified ? (
                    <>
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Verify 11-Digit UDISE to Submit Claim</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Submitting Claim for Verification...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>Submit Claim for Administrative Verification</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs text-center transition cursor-pointer"
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
