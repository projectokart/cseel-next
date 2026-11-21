'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  User,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ClaimSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolName: string;
  udiseCode: string;
  currentUser?: any;
}

export default function ClaimSchoolModal({
  isOpen,
  onClose,
  schoolName,
  udiseCode,
  currentUser: currentUserProp,
}: ClaimSchoolModalProps) {
  const { user: authContextUser, loading: authContextLoading } = useAuth();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const currentUser = currentUserProp || authContextUser || sessionUser;
  const isAuthLoading = authContextLoading && isSessionLoading && !currentUser;

  // Form State
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [designation, setDesignation] = useState('Principal / Head of School');
  const [note, setNote] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check login state upon modal opening
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setErrorMsg(null);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setIsSessionLoading(false);
      const active = session?.user || currentUserProp || authContextUser;
      if (active) {
        setSessionUser(active);
        if (active.email) setClaimantEmail((prev) => prev || active.email || '');
        const metaName = active.user_metadata?.full_name || active.user_metadata?.name || '';
        if (metaName) setClaimantName((prev) => prev || metaName);
        const metaPhone = active.user_metadata?.phone || active.phone || '';
        if (metaPhone) setWhatsappNumber((prev) => prev || metaPhone);
      }
    }).catch(() => {
      if (isMounted) setIsSessionLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentUserProp, authContextUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.email && !claimantEmail) setClaimantEmail(currentUser.email);
      const metaName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || '';
      if (metaName && !claimantName) setClaimantName(metaName);
      const metaPhone = currentUser.user_metadata?.phone || currentUser.phone || '';
      if (metaPhone && !whatsappNumber) setWhatsappNumber(metaPhone);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    const returnUrl = typeof window !== 'undefined' ? window.location.pathname : '/';
    window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  const handleSubmitClaim = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (!claimantName.trim()) {
      setErrorMsg('Please enter your Full Name / कृपया अपना नाम दर्ज करें');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!claimantEmail.trim() || !emailRegex.test(claimantEmail.trim())) {
      setErrorMsg('Please enter a valid Email Address / कृपया वैध ईमेल पता दर्ज करें');
      return;
    }
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Phone Number / कृपया 10 अंकों का फोन नंबर दर्ज करें');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Trigger background server notification with table-based HTML template
      await fetch('/api/school-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_name: schoolName,
          udise_code: udiseCode,
          claimant_name: claimantName.trim(),
          claimant_email: claimantEmail.trim() || currentUser?.email || 'update@cseel.org',
          whatsapp_number: whatsappNumber.trim(),
          designation,
          note: `Claim Request for ${schoolName} (UDISE: ${udiseCode}) by ${claimantName.trim()} (${designation}, Email: ${claimantEmail.trim()}, Tel: ${whatsappNumber.trim()})`,
          user_id: currentUser?.id,
        }),
      }).catch(() => {});

      // 2. Open Gmail Web Compose immediately with rich table-based HTML template copied
      handleOpenGmailCompose();
      onClose();
    } catch (err: any) {
      handleOpenGmailCompose();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateRichHtmlDraft = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const safeName = claimantName.trim() || 'Authorized Representative';
    const safeEmail = claimantEmail.trim() || currentUser?.email || 'Not specified';
    const safePhone = whatsappNumber.trim() || 'Not specified';
    const safeDesignation = designation || 'Principal / Head of School';

    return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #005689;">
    <tr>
      <td style="padding: 24px 28px; color: #ffffff;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
          <tr>
            <td style="background-color: rgba(251, 191, 36, 0.2); border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 9999px; padding: 4px 12px; font-size: 11px; font-weight: 700; color: #fde68a; text-transform: uppercase; letter-spacing: 1px;">
              Official Verification & Claim Request
            </td>
          </tr>
        </table>
        <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
          ${schoolName}
        </h1>
        <p style="margin: 0; font-size: 13px; color: #bae6fd; font-weight: 500;">
          UDISE+ Code: <strong style="color: #ffffff; font-family: monospace;">${udiseCode}</strong>
        </p>
      </td>
    </tr>
  </table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding: 24px; color: #1e293b; font-size: 14px; line-height: 1.6;">

        <!-- Section 1: Institution Details -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 18px;">
          <tr>
            <td style="padding: 16px;">
              <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 800; color: #005689; text-transform: uppercase; letter-spacing: 0.5px;">
                1. School Profile Metadata
              </h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
                <tr>
                  <td style="padding: 5px 0; color: #64748b; width: 140px; font-weight: 600;">School Name:</td>
                  <td style="padding: 5px 0; color: #0f172a; font-weight: 700;">${schoolName}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #64748b; font-weight: 600;">UDISE Code:</td>
                  <td style="padding: 5px 0; color: #0f172a; font-family: monospace; font-weight: 700;">${udiseCode}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Live Profile:</td>
                  <td style="padding: 5px 0;"><a href="${currentUrl}" style="color: #0284c7; text-decoration: underline; font-weight: 600;">${currentUrl}</a></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Section 2: Claimant Details (From Form) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 18px;">
          <tr>
            <td style="padding: 16px;">
              <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 800; color: #005689; text-transform: uppercase; letter-spacing: 0.5px;">
                2. Authorized Representative
              </h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
                <tr>
                  <td style="padding: 5px 0; color: #64748b; width: 140px; font-weight: 600;">Full Name:</td>
                  <td style="padding: 5px 0; color: #0f172a; font-weight: 700;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Official Email:</td>
                  <td style="padding: 5px 0; color: #0f172a; font-weight: 600;">${safeEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Designation:</td>
                  <td style="padding: 5px 0; color: #0f172a; font-weight: 600;">${safeDesignation}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Contact Phone:</td>
                  <td style="padding: 5px 0; color: #0f172a; font-weight: 700; font-family: monospace;">${safePhone}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Section 3: Verification Statement -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eff6ff; border-left: 4px solid #005689; border-radius: 6px; margin-bottom: 18px;">
          <tr>
            <td style="padding: 14px 16px; font-size: 13px; color: #1e3a8a; line-height: 1.5;">
              <strong>Verification Declaration:</strong> I hereby declare that I am the authorized representative (<strong>${safeDesignation}</strong>) of <strong>${schoolName}</strong> and request verified administrative access on CSEEL. Attached with this email are our official institutional affiliation certificates / authorized letterhead for identity validation.
            </td>
          </tr>
        </table>

        <p style="margin: 0; font-size: 13px; color: #475569;">
          Sincerely,<br />
          <strong>${safeName}</strong><br />
          <span style="color: #64748b;">${safeDesignation}</span><br />
          ${schoolName}
        </p>
      </td>
    </tr>
  </table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; border-top: 1px solid #e2e8f0;">
    <tr>
      <td style="padding: 12px 24px; font-size: 11px; color: #64748b; text-align: center;">
        Center for Scientific Exploration and Experiential Learning (CSEEL) • School Directory Division
      </td>
    </tr>
  </table>
</div>`;
  };

  const handleOpenGmailCompose = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const safeName = claimantName.trim() || 'Principal / Authorized Representative';
    const safeEmail = claimantEmail.trim() || currentUser?.email || 'Not specified';
    const safePhone = whatsappNumber.trim() || 'Not specified';
    const safeDesignation = designation || 'Principal / Head of School';

    const subject = `Claim Official Profile Request: ${schoolName} (UDISE: ${udiseCode})`;
    const body = `╔══════════════════════════════════════════════════════════════╗
║        OFFICIAL SCHOOL PROFILE CLAIM & VERIFICATION REQUEST   ║
╚══════════════════════════════════════════════════════════════╝

■ SCHOOL DETAILS:
• School Name: ${schoolName}
• UDISE Code: ${udiseCode}
• Profile URL: ${currentUrl}

■ AUTHORIZED REPRESENTATIVE DETAILS:
• Full Name: ${safeName}
• Official Email: ${safeEmail}
• Designation: ${safeDesignation}
• Contact / WhatsApp: ${safePhone}

■ VERIFICATION NOTE & DOCUMENTS:
I am the authorized institutional representative (${safeDesignation}) for ${schoolName}.
Please verify our institutional ownership and grant official administrative editing rights on CSEEL.
Official proof of affiliation or institutional letterhead is attached with this email for identity validation.

Thank you,
${safeName}
${safeDesignation}
${schoolName}`;

    // Copy rich HTML to clipboard so user can press Ctrl+V inside Gmail for full styling
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && (window as any).ClipboardItem) {
        const richHtml = generateRichHtmlDraft();
        const htmlBlob = new Blob([richHtml], { type: 'text/html' });
        const textBlob = new Blob([body], { type: 'text/plain' });
        navigator.clipboard.write([
          new (window as any).ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob,
          })
        ]).catch(() => {});
      }
    } catch (_) {}

    const mailtoUrl = `mailto:update@cseel.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Trigger device native email client (Gmail app, Apple Mail, Outlook, Windows Mail) directly on both mobile and desktop
    try {
      const tempLink = document.createElement('a');
      tempLink.href = mailtoUrl;
      tempLink.target = '_self';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    } catch {
      window.location.href = mailtoUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005689] via-[#0D4979] to-[#003c6e] p-5 sm:p-6 text-white flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full mb-1">
                Official Verification Desk
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">Send Claim Request</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            {/* Hidden Target School Profile & UDISE Metadata (Preserved for Backend Submission) */}
            <div className="hidden" aria-hidden="true">
              <input type="hidden" name="school_name" value={schoolName} />
              <input type="hidden" name="udise_code" value={udiseCode} />
              <input type="hidden" name="desk_email" value="update@cseel.org" />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form Inputs (Full Name, Official Email, Mobile/WhatsApp, Designation) */}
            <form onSubmit={handleSubmitClaim} className="space-y-3.5">
              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name / पूरा नाम <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#005689] focus:ring-2 focus:ring-[#005689]/20 outline-none transition text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* 2. Official Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email / आधिकारिक ईमेल <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={claimantEmail}
                    onChange={(e) => setClaimantEmail(e.target.value)}
                    placeholder="e.g. principal@school.edu.in"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#005689] focus:ring-2 focus:ring-[#005689]/20 outline-none transition text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* 3. Mobile / WhatsApp Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#005689] focus:ring-2 focus:ring-[#005689]/20 outline-none transition text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* 3. Designation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation / पद <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:border-[#005689] focus:ring-2 focus:ring-[#005689]/20 outline-none transition text-slate-800 appearance-none cursor-pointer"
                  >
                    <option value="Principal / Head of School">Principal / Head of School</option>
                    <option value="School Owner / Management / Trustee">School Owner / Management / Trustee</option>
                    <option value="Admissions / Administrative Incharge">Admissions / Administrative Incharge</option>
                    <option value="Other Authorized Authority">Other Authorized Authority</option>
                  </select>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-2xl bg-[#005689] hover:bg-[#003c6e] active:scale-[0.99] text-white font-black text-sm shadow-lg shadow-[#005689]/25 transition-all cursor-pointer flex items-center justify-center gap-2.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Opening Mail Client...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-amber-300" />
                      <span>Send Claim Request</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-end text-xs pt-0.5 px-1 text-slate-500">
                  <button
                    type="button"
                    onClick={onClose}
                    className="font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
