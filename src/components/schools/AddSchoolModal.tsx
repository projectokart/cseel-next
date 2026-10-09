'use client';

import React, { useState } from 'react';
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
  MapPin,
  BookOpen
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
  // Form State
  const [schoolName, setSchoolName] = useState(initialSchoolName);
  const [udiseCode, setUdiseCode] = useState(initialUdise);
  const [board, setBoard] = useState('CBSE');
  const [schoolType, setSchoolType] = useState('Day School');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Haryana');
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [designation, setDesignation] = useState('Principal / Head of Institution');
  const [note, setNote] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    magicUrl: string;
    token: string;
    schoolName: string;
    udise: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!schoolName.trim()) {
      setErrorMsg('Please enter your School Name.');
      return;
    }

    const cleanUdise = udiseCode.replace(/\D/g, '').trim();
    if (!cleanUdise || cleanUdise.length !== 11) {
      setErrorMsg('Please enter a valid 11-digit UDISE code.');
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
          claimant_name: claimantName.trim(),
          claimant_email: claimantEmail.trim().toLowerCase(),
          whatsapp_number: cleanPhone,
          designation: designation.trim(),
          note: `[Add School Profile] Board: ${board}, Format: ${schoolType}, Location: ${city}, ${stateName}. Note: ${note.trim()}`,
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
                {successData ? 'School Profile Created!' : 'Add Your School Profile'}
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                {successData
                  ? 'Your unique magic edit link has been generated.'
                  : 'Register your school, enable experiential labs & visually edit profile'}
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
                  Congratulations <strong>{claimantName}</strong>! <strong>{successData.schoolName}</strong> (UDISE: {successData.udise}) has been registered. An official notification has been dispatched to administration.
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
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Section 1: School Identity */}
              <div className="space-y-3 pb-3 border-b border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#005689]" />
                  School Identity
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      School Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Heritage Xperiential Learning School"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      UDISE Code (11 Digits) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      required
                      placeholder="e.g. 06180101926"
                      value={udiseCode}
                      onChange={(e) => setUdiseCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Board Affiliation
                    </label>
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689]"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE / ISC</option>
                      <option value="IB">IB (International Baccalaureate)</option>
                      <option value="Cambridge">Cambridge / IGCSE</option>
                      <option value="State Board">State Board</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      School Format
                    </label>
                    <select
                      value={schoolType}
                      onChange={(e) => setSchoolType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689]"
                    >
                      <option value="Day School">Day School</option>
                      <option value="Day Boarding">Day Boarding</option>
                      <option value="Boarding / Residential">Boarding / Residential</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / District
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gurugram"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005689]/20 focus:border-[#005689]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Authority & Verification Details */}
              <div className="space-y-3 pb-3 border-b border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#005689]" />
                  Authorized Representative Details
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Registering School & Generating Link...</span>
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
