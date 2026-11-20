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
  isClaimed?: boolean;
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
  onReportClick?: () => void;
}

const cleanMetaValue = (val: string | undefined, placeholders: string[] = []): string => {
  const trimmed = String(val || '').trim();
  if (!trimmed) return '';
  if (placeholders.includes(trimmed.toLowerCase())) return '';
  return trimmed;
};

// Mask email addresses for unclaimed profiles (only first 4 characters visible)
export function maskEmail(email?: string): string {
  if (!email) return '';
  const trimmed = email.trim();
  const atIdx = trimmed.indexOf('@');
  if (atIdx === -1) {
    if (trimmed.length <= 4) return `${trimmed.slice(0, 2)}••••`;
    return `${trimmed.slice(0, 4)}••••••••`;
  }
  const username = trimmed.slice(0, atIdx);
  const domain = trimmed.slice(atIdx + 1);
  const visible = username.slice(0, 4);
  const domainParts = domain.split('.');
  const topDomain = domainParts.length > 1 ? `.${domainParts.slice(-1)[0]}` : '';
  return `${visible}••••••••@••••${topDomain}`;
}

// Mask phone numbers for unclaimed profiles (only first 2 characters visible)
export function maskPhone(phone?: string): string {
  if (!phone) return '';
  const trimmed = phone.trim();
  let num = trimmed;
  let prefix = '';
  if (num.startsWith('+91')) {
    prefix = '+91 ';
    num = num.slice(3).trim().replace(/^[- ]+/, '');
  }
  const cleanDigits = num.replace(/[^0-9]/g, '');
  if (cleanDigits.length >= 2) {
    const firstTwo = cleanDigits.slice(0, 2);
    return `${prefix}${firstTwo}••••••••`;
  }
  return `${trimmed.slice(0, 2)}••••••••`;
}

export default function SchoolFooterSection({
  displayName,
  actualSchoolLogo,
  templateData,
  isClaimed = false,
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
  onReportClick,
}: SchoolFooterSectionProps) {
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubject, setInquirySubject] = useState('Admissions');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null);

  const LEGAL_POLICIES: Record<string, { title: string; content: string }> = {
    disclaimer: {
      title: isClaimed
        ? 'Official School Administration Disclosure / अधिकृत विद्यालय प्रबंधन घोषणा'
        : 'Legal Disclaimer & Public Data Disclosure',
      content: isClaimed
        ? `यह प्रोफ़ाइल डेटा सीधे संबंधित विद्यालय प्रबंधन द्वारा अधिकृत रूप से अद्यतन किया गया है। प्रोफ़ाइल में दर्ज सभी जानकारियों, शुल्कों, सुविधाओं, अकादमिक विवरणों और दावों के लिए संबंधित विद्यालय स्वयं पूर्णतः उत्तरदायी है। CSEEL केवल एक तकनीकी मंच प्रदान करता है और विद्यालय प्रबंधन द्वारा दी गई जानकारियों के लिए किसी भी रूप में उत्तरदायी नहीं है।\n\nOfficial School Administration Disclosure:\nAll institutional information, academic boards, fee structures, facilities, and contact details displayed on this profile have been directly updated and maintained by the verified school administration. The school management is solely responsible for the authenticity, correctness, and legality of all data published herein.\n\nCSEEL functions purely as a digital directory and technical platform and assumes no liability for claims, clerical entries, or operational disclosures made by the school administration.\n\nFor institutional inquiries, contact the school directly or email: update@mailer.cseel.org.`
        : `The institutional information displayed on this profile (including School Name, UDISE+ Code, Affiliation/Board, Management Category, and Geographic Coordinates) is strictly sourced from public domain disclosures maintained by the Unified District Information System for Education Plus (UDISE+), Department of School Education & Literacy, Ministry of Education, Government of India.\n\nCSEEL is an independent informational and education technology platform and is not affiliated with, endorsed by, or representing any government authority or private school board. Information is provided on an 'as is' basis for public convenience and informational reference only, without warranties of any kind. CSEEL assumes no liability for clerical or processing errors originating from public source data.\n\nAuthorized representatives of this institution may claim this profile at any time to verify, manage, or update their official listing.\n\nFor official updates, verification, or legal notices, contact: update@mailer.cseel.org.`
    },
    terms: {
      title: 'Terms of Service',
      content: `1. Acceptance of Terms: By accessing this school profile directory, you agree to comply with all applicable laws and these Terms of Service.\n\n2. Directory Information: Data displayed is aggregated from official public records. CSEEL does not act as an agent or representative of listed schools unless explicitly verified and authorized through official institutional credentials.\n\n3. Institutional Claims: Only principals, directors, chairpersons, or authorized administrative staff may submit verified claims for school profiles.\n\n4. Prohibited Uses: Scraping, automated mass crawling, or using profile information for unauthorized commercial unsolicited marketing is strictly prohibited.\n\nContact: update@mailer.cseel.org.`
    },
    privacy: {
      title: 'Privacy Policy & Data Protection',
      content: `CSEEL complies with India's Digital Personal Data Protection Act (DPDP Act 2023) and global data privacy standards.\n\n1. Public Directory Records: Basic school contact details (official school email, official administrative landline/phone) published in public government records (UDISE+) are maintained strictly for educational directory reference.\n\n2. User Inquiries: Information provided when submitting an admission enquiry or profile claim is encrypted, transmitted securely, and only shared with the designated school administration or verified user account.\n\n3. Cookie & Analytics: We use privacy-preserving, non-invasive analytics to monitor platform reliability without selling personal identifiable information to third parties.\n\nContact: update@mailer.cseel.org.`
    },
    editorial: {
      title: 'Editorial Policy & Directory Standards',
      content: `Our mission is to provide transparent, equitable, and verified educational information for families across India.\n\n1. Source Transparency: Every directory listing clearly identifies its source (e.g., UDISE+ Public Domain Disclosure or School Official Verified Submission).\n\n2. Neutral & Unbiased: CSEEL does not arbitrarily rank, manipulate, or artificially boost schools in organic directories. Basic public listings remain impartial and factual.\n\n3. Correction & Removal: Upon valid verification from school trustees or heads of institution, outdated or disputed attributes are promptly corrected or updated in accordance with institutional documentation.\n\nContact: update@mailer.cseel.org.`
    },
    factcheck: {
      title: 'Fact-Checking & Data Verification Policy',
      content: `CSEEL maintains strict data separation between unverified public domain records and school-verified profiles:\n\n1. Unclaimed Profiles: Display only government-audited baseline information (UDISE Code, Board, Location). Sensitive operational metrics such as fee schedules, board exam pass percentages, and facilities remain unpublished until verified by the school.\n\n2. Verified Profiles: Require administrative verification via official institutional email, registration certificate, or authorization letter before publishing custom fee tables and result statistics.\n\n3. Continuous Auditing: User-reported inaccuracies are investigated within 48 business hours.\n\nContact: update@mailer.cseel.org.`
    },
    dmca: {
      title: 'DMCA & Copyright Compliance Policy',
      content: `CSEEL respects the intellectual property rights of all educational institutions, content creators, and organizations.\n\nIf you believe that any trademark, emblem, campus photograph, or copyrighted material has been included on this directory without authorization, please notify our Grievance Officer with the following:\n- Description of the copyrighted work/trademark.\n- School name, UDISE code, and profile URL.\n- Contact details and proof of authorization.\n\nContact: update@mailer.cseel.org.\nWe act expeditiously on valid notices under Section 79 of the Information Technology Act (Intermediary Guidelines) and DMCA principles.`
    }
  };
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
      setInquiryEmail('');
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
      className="relative isolate z-0 bg-[#001C33] text-white [&_p]:!text-slate-200 [&_li]:!text-slate-200 [&_h3]:!text-white [&_h4]:!text-white pt-7 pb-24 md:pb-8 overflow-hidden border-t border-[#00335E]"
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

            {/* Clean Structured Breakdown: School Address, State, District, Locality & Pin Code */}
            <div className="space-y-2 pt-1 text-xs">
              {displayAddress && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">School Address</div>
                  <div className="text-slate-100 font-medium mt-0.5 leading-relaxed">{displayAddress}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {resolvedState && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">State</div>
                    <div className="text-slate-100 font-medium capitalize mt-0.5">{resolvedState}</div>
                  </div>
                )}
                {resolvedDistrict && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">District</div>
                    <div className="text-slate-100 font-medium capitalize mt-0.5">{resolvedDistrict}</div>
                  </div>
                )}
                {resolvedVillage && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Locality / Area</div>
                    <div className="text-slate-100 font-medium capitalize mt-0.5 truncate">{resolvedVillage}</div>
                  </div>
                )}
                {resolvedPincode && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Pin Code</div>
                    <div className="text-slate-100 font-medium mt-0.5">{resolvedPincode}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Official Website (If present show link; if absent leave completely blank) */}
            {resolvedWebsite ? (
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 shrink-0">Official Website</span>
                <a
                  href={resolvedWebsite.startsWith('http') ? resolvedWebsite : `https://${resolvedWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-300 hover:text-white font-medium transition truncate max-w-[220px]"
                >
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{resolvedWebsite.replace(/^https?:\/\//, '')}</span>
                </a>
              </div>
            ) : null}

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
              {isClaimed && (
                <button
                  type="button"
                  onClick={() => setShowInquiryForm((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006FCC] hover:bg-[#0056a3] text-white text-[11px] font-medium cursor-pointer transition shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>{showInquiryForm ? 'Close Form' : 'Send Message'}</span>
                </button>
              )}
            </div>

            {isClaimed && showInquiryForm ? (
              <div className="pt-1 space-y-2">
                {isSent ? (
                  <div className="py-5 text-center space-y-1.5">
                    <CheckCircle2 className="w-7 h-7 text-emerald-300 mx-auto" />
                    <p className="!text-xs !font-semibold !text-white m-0">Message sent to official desk</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        placeholder="Your Email (Optional)"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
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
                {(generalPhone || generalEmail) && (
                  <div className="pb-2.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-sky-200">
                      <Building2 className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                      <span>General Inquiry</span>
                    </div>
                    <div className="flex flex-col gap-1 pl-5 text-xs text-slate-200">
                      {generalPhone && (
                        isClaimed ? (
                          <a href={`tel:${generalPhone}`} className="inline-flex items-center gap-1.5 text-slate-100 hover:text-sky-200 w-fit">
                            <Phone className="w-3 h-3 text-sky-300 shrink-0" />
                            <span>{generalPhone}</span>
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-slate-300 select-none">
                            <Phone className="w-3 h-3 text-sky-300 shrink-0" />
                            <span className="font-mono tracking-wider text-slate-200">{maskPhone(generalPhone)}</span>
                            <span className="text-[10px] text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-medium">Claim to View</span>
                          </div>
                        )
                      )}
                      {generalEmail && (
                        isClaimed ? (
                          <a href={`mailto:${generalEmail}`} className="inline-flex items-center gap-1.5 text-slate-200 hover:text-sky-200 truncate max-w-full">
                            <Mail className="w-3 h-3 text-sky-300 shrink-0" />
                            <span className="truncate">{generalEmail}</span>
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-slate-300 select-none">
                            <Mail className="w-3 h-3 text-sky-300 shrink-0" />
                            <span className="font-mono tracking-wider text-slate-200">{maskEmail(generalEmail)}</span>
                            <span className="text-[10px] text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-medium">Claim to View</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Admission Related */}
                {(admissionsPhone || admissionsEmail) && (
                  <div className="py-2.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-200">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span>Admission Related</span>
                    </div>
                    <div className="flex flex-col gap-1 pl-5 text-xs text-slate-200">
                      {admissionsPhone && (
                        isClaimed ? (
                          <a href={`tel:${admissionsPhone}`} className="inline-flex items-center gap-1.5 text-slate-100 hover:text-sky-200 w-fit">
                            <Phone className="w-3 h-3 text-emerald-300 shrink-0" />
                            <span>{admissionsPhone}</span>
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-slate-300 select-none">
                            <Phone className="w-3 h-3 text-emerald-300 shrink-0" />
                            <span className="font-mono tracking-wider text-slate-200">{maskPhone(admissionsPhone)}</span>
                            <span className="text-[10px] text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-medium">Claim to View</span>
                          </div>
                        )
                      )}
                      {admissionsEmail && (
                        isClaimed ? (
                          <a href={`mailto:${admissionsEmail}`} className="inline-flex items-center gap-1.5 text-slate-200 hover:text-sky-200 truncate max-w-full">
                            <Mail className="w-3 h-3 text-emerald-300 shrink-0" />
                            <span className="truncate">{admissionsEmail}</span>
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-slate-300 select-none">
                            <Mail className="w-3 h-3 text-emerald-300 shrink-0" />
                            <span className="font-mono tracking-wider text-slate-200">{maskEmail(admissionsEmail)}</span>
                            <span className="text-[10px] text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-medium">Claim to View</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* When unclaimed and no phone/email listed, show clean verification notice */}
                {!generalPhone && !generalEmail && !admissionsPhone && !admissionsEmail && (
                  <div className="py-2 text-slate-300 text-xs">
                    <p className="m-0 leading-relaxed text-slate-300/80">
                      Official administrative contacts will be displayed once this profile is verified by the school administration.
                    </p>
                  </div>
                )}

                {/* Optional Principal / Careers Contacts */}
                {(principalPhone || principalEmail || careersPhone || careersEmail) && (
                  <div className="pt-2.5 space-y-1.5 text-xs text-slate-200">
                    {(principalPhone || principalEmail) && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="inline-flex items-center gap-1 font-medium text-amber-200">
                          <UserCheck className="w-3 h-3" /> Principal:
                        </span>
                        {principalPhone && (
                          isClaimed ? (
                            <a href={`tel:${principalPhone}`} className="hover:text-white">{principalPhone}</a>
                          ) : (
                            <span className="font-mono text-slate-300">{maskPhone(principalPhone)}</span>
                          )
                        )}
                        {principalEmail && (
                          isClaimed ? (
                            <a href={`mailto:${principalEmail}`} className="hover:text-white truncate">{principalEmail}</a>
                          ) : (
                            <span className="font-mono text-slate-300">{maskEmail(principalEmail)}</span>
                          )
                        )}
                      </div>
                    )}
                    {(careersPhone || careersEmail) && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="inline-flex items-center gap-1 font-medium text-sky-200">
                          <Briefcase className="w-3 h-3" /> Careers:
                        </span>
                        {careersPhone && (
                          isClaimed ? (
                            <a href={`tel:${careersPhone}`} className="hover:text-white">{careersPhone}</a>
                          ) : (
                            <span className="font-mono text-slate-300">{maskPhone(careersPhone)}</span>
                          )
                        )}
                        {careersEmail && (
                          isClaimed ? (
                            <a href={`mailto:${careersEmail}`} className="hover:text-white truncate">{careersEmail}</a>
                          ) : (
                            <span className="font-mono text-slate-300">{maskEmail(careersEmail)}</span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Col 3: Interactive Campus Location Map */}
          <div className="md:col-span-2 lg:col-span-4 relative isolate z-0">
            <SchoolFooterMap
              displayName={displayName}
              displayAddress={displayAddress}
              lat={lat}
              lng={lng}
              campusPhoto={templateData?.campus_photo || templateData?.banner_url || actualSchoolLogo}
            />
          </div>
        </div>

        {/* Official Public Domain & UDISE Legal Safe Harbor Banner or Verified School Disclosure */}
        <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-300 leading-relaxed bg-white/5 p-4 sm:p-5 rounded-xl border border-white/10 space-y-2">
          {isClaimed ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-xs tracking-wide uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Official School Administration Disclosure / अधिकृत विद्यालय प्रबंधन घोषणा
                </span>
              </div>
              <p className="m-0 text-slate-200">
                यह प्रोफ़ाइल डेटा सीधे संबंधित विद्यालय प्रबंधन द्वारा अधिकृत रूप से अद्यतन किया गया है। प्रोफ़ाइल में दर्ज सभी जानकारियों, शुल्कों, सुविधाओं और दावों के लिए विद्यालय स्वयं पूर्णतः उत्तरदायी है। CSEEL केवल एक तकनीकी मंच प्रदान करता है और किसी भी दावे के लिए उत्तरदायी नहीं है।
              </p>
              <p className="m-0 text-slate-300 text-[10.5px]">
                All profile information, facilities, academic boards, and fee disclosures displayed on this page have been directly provided and maintained by the verified school management. The institution is solely responsible for data authenticity and accuracy. CSEEL functions purely as a digital directory and technical platform.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-amber-300 font-semibold text-xs tracking-wide uppercase">Legal Disclaimer &amp; Public Data Disclosure</span>
              </div>
              <p className="m-0 text-slate-200">
                The data provided on this school profile is compiled from UDISE public data for educational and reference purposes only. Data is processed from source as-is; CSEEL assumes no liability for clerical or processing errors. School representatives can update or verify details by claiming their profile. For any queries or corrections, contact <a href="mailto:update@mailer.cseel.org" className="text-sky-300 hover:text-white underline font-medium">update@mailer.cseel.org</a>.
              </p>
            </>
          )}
        </div>

        {/* Clean Bottom Links Bar with Comprehensive Legal Policies */}
        <div className="pt-4 mt-3 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between text-[11px] text-slate-300 gap-3">
          <div className="text-slate-300 text-center lg:text-left">
            © 2026{' '}
            <Link href="/" className="text-sky-300 hover:text-white font-medium underline">
              CSEEL
            </Link>{' '}
            • Official School Directory & Technology Network
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-300">
            <button
              type="button"
              onClick={() => setActiveLegalModal('disclaimer')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer hover:underline"
            >
              Disclaimer
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveLegalModal('terms')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer hover:underline"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveLegalModal('privacy')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer hover:underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveLegalModal('editorial')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer hover:underline"
            >
              Editorial Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveLegalModal('factcheck')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer hover:underline"
            >
              Fact-Check Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveLegalModal('dmca')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer hover:underline"
            >
              DMCA Notice
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                if (onReportClick) {
                  onReportClick();
                } else {
                  alert('To report an error or dispute, please contact update@mailer.cseel.org with the UDISE code.');
                }
              }}
              className="text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer hover:underline inline-flex items-center gap-1"
            >
              <span>⚠️</span>
              <span>Report Error / डेटा सुधार</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Legal Policy Modal */}
      {activeLegalModal && LEGAL_POLICIES[activeLegalModal] && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white text-slate-800 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#005689] to-[#004168] p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base leading-tight">
                {LEGAL_POLICIES[activeLegalModal].title}
              </h3>
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {LEGAL_POLICIES[activeLegalModal].content}
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 rounded-xl bg-[#005689] text-white text-xs font-bold hover:bg-[#004168] transition-all cursor-pointer"
              >
                Close / बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
