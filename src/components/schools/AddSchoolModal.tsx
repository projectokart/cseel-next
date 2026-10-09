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
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Lock,
  Search,
  Loader2,
  AlertCircle,
  HelpCircle,
  CheckCheck
} from 'lucide-react';

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
  const [successData, setSuccessData] = useState<{
    magicUrl: string;
    token: string;
    schoolName: string;
    udise: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-verify if initialUdise provided
  useEffect(() => {
    if (isOpen && initialUdise && initialUdise.replace(/\D/g, '').length === 11) {
      setUdiseCode(initialUdise.replace(/\D/g, ''));
      handleVerifyUdise(initialUdise.replace(/\D/g, ''));
    }
  }, [isOpen, initialUdise]);

  if (!isOpen) return null;

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

      // Suggest representative details if available and currently empty
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

    // Strict validation: UDISE must be verified
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
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit school profile.');
      }

      const generatedToken = data.claim?.visual_edit_token || `csl_ai_magic_${cleanUdise}`;
      const directEditUrl = `/school-template?token=${generatedToken}&edit=true`;

      setSuccessData({
        magicUrl: data.visual_edit_url || directEditUrl,
        token: generatedToken,
        schoolName: schoolName.trim(),
        udise: cleanUdise,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!successData?.magicUrl) return;
    navigator.clipboard.writeText(successData.magicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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
                {successData ? 'School Profile Verified & Created!' : 'Add Your School Profile'}
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                {successData
                  ? 'Your unique magic edit link has been generated.'
                  : 'UDISE-verified registration & direct live visual editor'}
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
          {successData ? (
            /* Success Screen */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-900 mb-1">
                  School Profile Added Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Congratulations <strong>{claimantName}</strong>! <strong>{successData.schoolName}</strong> (UDISE: {successData.udise}) has been verified and registered. Official notification dispatched.
                </p>
              </div>

              {/* Magic Link Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    Your Visual Editing Magic Link
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white px-3 py-1 rounded-lg border border-emerald-300 shadow-2xs cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-600 font-mono bg-white p-2.5 rounded-xl border border-emerald-200 break-all select-all">
                  {successData.magicUrl}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`/school-template?token=${successData.token}&edit=true`}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open Visual Editor Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
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
                      <span>Verify 11-Digit UDISE to Register</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Registering School & Generating Link...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Register & Open Visual Live Editor</span>
                    </>
                  )}
                </button>

                <a
                  href="/school-template?edit=true&mode=new"
                  className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs text-center transition cursor-pointer"
                  title="Directly launch the blank WYSIWYG editor without registering first"
                >
                  Direct Blank Editor &rarr;
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
