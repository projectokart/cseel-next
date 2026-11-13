'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Copy,
  Check,
  Building2,
  GraduationCap,
  Send,
  CheckCircle2,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  UserCheck,
  Briefcase,
} from 'lucide-react';

const SchoolFooterMap = dynamic(() => import('@/components/schools/profile/SchoolFooterMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[190px] sm:h-[215px] w-full rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-xs text-slate-200">
      Loading campus map...
    </div>
  ),
});

export interface SchoolFooterSectionProps {
  displayName: string;
  actualSchoolLogo?: string;
  templateData: any;
  displayAddress: string;
  displayState?: string;
  displayDistrict?: string;
  village?: string;
  pincode?: string;
  displayPhone: string;
  displayEmail: string;
  displayGeneralPhone?: string;
  displayGeneralEmail?: string;
  displayAdmissionsPhone?: string;
  displayAdmissionsEmail?: string;
  displayPrincipalPhone?: string;
  displayPrincipalEmail?: string;
  displayCareersPhone?: string;
  displayCareersEmail?: string;
  website?: string;
  lat: number;
  lng: number;
  onTabSwitch?: (tab: any) => void;
  onApplyClick?: () => void;
}

const cleanMetaValue = (val: string | undefined, placeholders: string[] = []): string => {
  const trimmed = String(val || '').trim();
  if (!trimmed) return '';
  if (placeholders.includes(trimmed.toLowerCase())) return '';
  return trimmed;
};

export default function SchoolFooterSection({
  displayName,
  templateData,
  displayAddress,
  displayState,
  displayDistrict,
  village,
  pincode,
  displayPhone,
  displayEmail,
  displayGeneralPhone,
  displayGeneralEmail,
  displayAdmissionsPhone,
  displayAdmissionsEmail,
  displayPrincipalPhone,
  displayPrincipalEmail,
  displayCareersPhone,
  displayCareersEmail,
  website,
  lat,
  lng,
}: SchoolFooterSectionProps) {
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubject, setInquirySubject] = useState('Admissions');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const generalPhone = (displayGeneralPhone || displayPhone || '').trim();
  const generalEmail = (displayGeneralEmail || displayEmail || '').trim();
  const admissionsPhone = (displayAdmissionsPhone || displayPhone || '').trim();
  const admissionsEmail = (displayAdmissionsEmail || displayEmail || '').trim();
  const principalPhone = (displayPrincipalPhone || '').trim();
  const principalEmail = (displayPrincipalEmail || '').trim();
  const careersPhone = (displayCareersPhone || '').trim();
  const careersEmail = (displayCareersEmail || '').trim();

  const resolvedState = cleanMetaValue(displayState || templateData?.state, ['state', 'unknown']);
  const resolvedDistrict = cleanMetaValue(displayDistrict || templateData?.district, ['district', 'campus', 'unknown']);
  const resolvedVillage = cleanMetaValue(village || templateData?.village, ['village', 'main', 'city']);
  const resolvedPincode = cleanMetaValue(pincode || templateData?.pincode, ['000000', 'na', 'n/a']);
  const resolvedWebsite = cleanMetaValue(website || templateData?.website, ['na', 'n/a', 'none', '-']);

  const handleCopyAddress = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(displayAddress);
      setIsAddressCopied(true);
      setTimeout(() => setIsAddressCopied(false), 2000);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setShowInquiryForm(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMessage('');
    }, 2200);
  };

  const socialItems = [
    { icon: Facebook, name: 'Facebook', url: templateData?.socialLinks?.facebook || templateData?.social_links?.facebook },
    { icon: Instagram, name: 'Instagram', url: templateData?.socialLinks?.instagram || templateData?.social_links?.instagram },
    { icon: Youtube, name: 'YouTube', url: templateData?.socialLinks?.youtube || templateData?.social_links?.youtube },
    { icon: Linkedin, name: 'LinkedIn', url: templateData?.socialLinks?.linkedin || templateData?.social_links?.linkedin },
  ];

  const hasSocialLinks = socialItems.some((item) => Boolean(item.url));

  return (
    <footer
      id="contact"
      className="relative bg-[#001C33] text-white [&_p]:!text-slate-200 [&_li]:!text-slate-200 [&_h3]:!text-white [&_h4]:!text-white pt-7 pb-20 md:pb-8 overflow-hidden border-t border-[#00335E]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Clean, Well-Arranged 3-Column Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Col 1: Structured Address Details & Official Website */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-white/15">
              <h4 className="!text-xs !font-semibold tracking-wider uppercase !text-sky-200 m-0">
                Address Details
              </h4>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:text-white font-medium cursor-pointer transition"
              >
                {isAddressCopied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                <span>{isAddressCopied ? 'Copied' : 'Copy Address'}</span>
              </button>
            </div>

            {/* Full Street Address */}
            <div className="flex items-start gap-2 text-xs text-slate-100 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-sky-300 shrink-0 mt-0.5" />
              <span className="flex-1 text-slate-100">{displayAddress || 'Address details not listed'}</span>
            </div>

            {/* Clean Structured Breakdown: State, District, Pin Code & Locality */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-white/10 text-xs">
              {resolvedDistrict && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">District</div>
                  <div className="text-slate-100 font-medium capitalize mt-0.5">{resolvedDistrict}</div>
                </div>
              )}
              {resolvedState && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">State</div>
                  <div className="text-slate-100 font-medium capitalize mt-0.5">{resolvedState}</div>
                </div>
              )}
              {resolvedPincode && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Pin Code</div>
                  <div className="text-slate-100 font-medium mt-0.5">{resolvedPincode}</div>
                </div>
              )}
              {resolvedVillage && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Locality / Area</div>
                  <div className="text-slate-100 font-medium capitalize mt-0.5 truncate">{resolvedVillage}</div>
                </div>
              )}
            </div>

            {/* Official Website */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 shrink-0">Official Website</span>
              {resolvedWebsite ? (
                <a
                  href={resolvedWebsite.startsWith('http') ? resolvedWebsite : `https://${resolvedWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-300 hover:text-white font-medium transition truncate max-w-[220px]"
                >
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{resolvedWebsite.replace(/^https?:\/\//, '')}</span>
                </a>
              ) : (
                <span className="text-slate-400 text-[11px]">Not listed</span>
              )}
            </div>

            {/* Social Links (only if present) */}
            {hasSocialLinks && (
              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                {socialItems.map((item, idx) =>
                  item.url ? (
                    <a
                      key={idx}
                      href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name}
                      className="w-7 h-7 rounded-full border border-white/15 hover:bg-[#006FCC] hover:border-[#006FCC] text-slate-200 hover:text-white flex items-center justify-center transition"
                    >
                      <item.icon className="w-3.5 h-3.5" />
                    </a>
                  ) : null
                )}
              </div>
            )}
          </div>

          {/* Col 2: Contact Details (General Inquiry, Admission Related + Send Message) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-white/15">
              <h4 className="!text-xs !font-semibold tracking-wider uppercase !text-sky-200 m-0">
                Contact Details
              </h4>
              <button
                type="button"
                onClick={() => setShowInquiryForm((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006FCC] hover:bg-[#0056a3] text-white text-[11px] font-medium cursor-pointer transition shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>{showInquiryForm ? 'Close Form' : 'Send Message'}</span>
              </button>
            </div>

            {showInquiryForm ? (
              <div className="pt-1 space-y-2">
                {isSent ? (
                  <div className="py-5 text-center space-y-1.5">
                    <CheckCircle2 className="w-7 h-7 text-emerald-300 mx-auto" />
                    <p className="!text-xs !font-semibold !text-white m-0">Message sent to official desk</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs focus:outline-none"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone *"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs focus:outline-none"
                      />
                    </div>
                    <select
                      value={inquirySubject}
                      onChange={(e) => setInquirySubject(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs focus:outline-none"
                    >
                      <option value="Admissions">Admission Related</option>
                      <option value="General">General Inquiry</option>
                    </select>
                    <textarea
                      required
                      rows={2}
                      placeholder="Write your message..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded-lg bg-[#006FCC] hover:bg-[#0056a3] text-white text-xs font-semibold cursor-pointer transition"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="divide-y divide-white/10 text-xs">
                {/* General Inquiry */}
                <div className="pb-2.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-sky-200">
                    <Building2 className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    <span>General Inquiry</span>
                  </div>
                  <div className="flex flex-col gap-1 pl-5 text-xs text-slate-200">
                    {generalPhone ? (
                      <a href={`tel:${generalPhone}`} className="inline-flex items-center gap-1.5 text-slate-100 hover:text-sky-200 w-fit">
                        <Phone className="w-3 h-3 text-sky-300 shrink-0" />
                        <span>{generalPhone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Phone not listed</span>
                    )}
                    {generalEmail && (
                      <a href={`mailto:${generalEmail}`} className="inline-flex items-center gap-1.5 text-slate-200 hover:text-sky-200 truncate max-w-full">
                        <Mail className="w-3 h-3 text-sky-300 shrink-0" />
                        <span className="truncate">{generalEmail}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Admission Related */}
                <div className="py-2.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-200">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span>Admission Related</span>
                  </div>
                  <div className="flex flex-col gap-1 pl-5 text-xs text-slate-200">
                    {admissionsPhone ? (
                      <a href={`tel:${admissionsPhone}`} className="inline-flex items-center gap-1.5 text-slate-100 hover:text-sky-200 w-fit">
                        <Phone className="w-3 h-3 text-emerald-300 shrink-0" />
                        <span>{admissionsPhone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Admissions helpline not listed</span>
                    )}
                    {admissionsEmail && (
                      <a href={`mailto:${admissionsEmail}`} className="inline-flex items-center gap-1.5 text-slate-200 hover:text-sky-200 truncate max-w-full">
                        <Mail className="w-3 h-3 text-emerald-300 shrink-0" />
                        <span className="truncate">{admissionsEmail}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Optional Principal / Careers Contacts */}
                {(principalPhone || principalEmail || careersPhone || careersEmail) && (
                  <div className="pt-2.5 space-y-1.5 text-xs text-slate-200">
                    {(principalPhone || principalEmail) && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="inline-flex items-center gap-1 font-medium text-amber-200">
                          <UserCheck className="w-3 h-3" /> Principal:
                        </span>
                        {principalPhone && <a href={`tel:${principalPhone}`} className="hover:text-white">{principalPhone}</a>}
                        {principalEmail && <a href={`mailto:${principalEmail}`} className="hover:text-white truncate">{principalEmail}</a>}
                      </div>
                    )}
                    {(careersPhone || careersEmail) && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="inline-flex items-center gap-1 font-medium text-sky-200">
                          <Briefcase className="w-3 h-3" /> Careers:
                        </span>
                        {careersPhone && <a href={`tel:${careersPhone}`} className="hover:text-white">{careersPhone}</a>}
                        {careersEmail && <a href={`mailto:${careersEmail}`} className="hover:text-white truncate">{careersEmail}</a>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Col 3: Interactive Campus Location Map */}
          <div className="md:col-span-2 lg:col-span-4 space-y-2.5">
            <div className="pb-1.5 border-b border-white/15">
              <h4 className="!text-xs !font-semibold tracking-wider uppercase !text-sky-200 m-0">
                Campus Location Map
              </h4>
            </div>
            <SchoolFooterMap
              displayName={displayName}
              displayAddress={displayAddress}
              lat={lat}
              lng={lng}
            />
          </div>
        </div>

        {/* Clean Bottom Links Bar */}
        <div className="pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-300 gap-2">
          <div className="text-slate-300 text-center sm:text-left">
            © 2026{' '}
            <Link href="/" className="text-sky-300 hover:text-white font-medium underline">
              CSEEL
            </Link>{' '}
            • School Information Directory
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <Link href="/schools" className="text-sky-300 hover:text-white font-medium transition-colors">
              All Schools
            </Link>
            <span>•</span>
            <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
