'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Copy,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  Camera,
  Award,
  Layers,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  X
} from 'lucide-react';

export interface AiSectionGuideData {
  sectionKey: string;
  sectionNumber: number;
  title: string;
  summary: string;
  wordCount?: string;
  requiredFields: string[];
  mediaSpecs?: string;
  aiPromptSnippet: string;
  adminTips: string[];
}

export const AI_TEMPLATE_SECTIONS: Record<string, AiSectionGuideData> = {
  hero: {
    sectionKey: 'hero',
    sectionNumber: 1,
    title: 'School Identity & Hero Banner',
    summary: 'The top fold where parents form their first impression. Establish immediate credibility, board affiliation, and brand distinction.',
    wordCount: 'Motto: 8-15 words | Subtitle: 20-30 words',
    requiredFields: [
      'Official Registered School Name (matches CBSE/Affiliation certificate)',
      'Inspiring School Motto / Tagline (e.g., "Nurturing Minds, Inspiring Excellence")',
      'Affiliation Board & Code (CBSE / ICSE / State Board + 6-digit affiliation number)',
      '11-Digit UDISE+ Code (mandated under Department of School Education)',
      'Establishment Year (establishes heritage & track record)',
      'Current Admission Status ("Admissions Open for 2026-27")'
    ],
    mediaSpecs: 'Banner: 1920x600 px (16:5 ratio, <1MB JPG/WebP). School Crest/Logo: 512x512 px (transparent PNG).',
    aiPromptSnippet: 'Write a powerful 2-line vision tagline and school welcome subtitle for a leading CBSE co-educational school emphasizing holistic learning, modern STEM labs, and values.',
    adminTips: [
      'Avoid abbreviations in your school name unless officially registered in board gazettes.',
      'Always keep the admission status badge updated with the current academic cycle.'
    ]
  },
  metrics: {
    sectionKey: 'metrics',
    sectionNumber: 2,
    title: 'Key Quantitative Indicators (Metrics Strip)',
    summary: 'Data-driven metrics that build parent confidence. Concrete numbers prove scale, safety, and individual care.',
    wordCount: 'Numeric data values only',
    requiredFields: [
      'Total Enrolled Students (audited student headcount)',
      'Student-to-Teacher Ratio (ideal benchmark: 20:1 to 30:1 for personalized attention)',
      'Total Certified Faculty Members (B.Ed/M.Ed/CTET qualified teachers)',
      'Total Smart & Digital Classrooms count',
      'CBSE / State Board 10th & 12th Pass Percentage (e.g., "98%+ First Division")',
      'Campus Land Acreage (e.g., "5.5 Acres Green Campus")'
    ],
    mediaSpecs: 'Numerical metrics with clean graphical icons.',
    aiPromptSnippet: 'Provide a breakdown of ideal student-teacher ratios, board pass rates, and classroom counts for a standard 1,500-student school profile.',
    adminTips: [
      'Ensure the student-teacher ratio aligns with your state RTE regulatory compliance.',
      'Showcase board toppers or district rank accomplishments alongside pass rates.'
    ]
  },
  about: {
    sectionKey: 'about',
    sectionNumber: 3,
    title: 'About Us, Heritage & Principal’s Desk',
    summary: 'Articulates your educational philosophy, founding story, core values, and leadership accountability.',
    wordCount: 'About Us: 180-250 words | Principal Message: 120-180 words',
    requiredFields: [
      'Founding heritage and the visionaries behind the institution',
      'Core Educational Philosophy (NEP 2020 experiential learning, STEM integration)',
      'Values & Ethics (empathy, critical thinking, global citizenship)',
      'Principal’s Personal Message & Academic Leadership Credentials',
      'Safety and inclusive pastoral care pledge for all grades'
    ],
    mediaSpecs: 'Principal Portrait: 600x600 px professional headshot. Campus Architecture Photo: 1200x800 px landscape.',
    aiPromptSnippet: 'Write an inspiring 200-word "About Us" and 150-word "Message from the Principal" for an Indian CBSE school focusing on NEP 2020 experiential learning, values, and student well-being.',
    adminTips: [
      'Keep the tone welcoming, empathetic, and future-forward rather than overly rigid.',
      'Highlight specific learning methodologies such as project-based inquiry and peer collaboration.'
    ]
  },
  labs: {
    sectionKey: 'labs',
    sectionNumber: 4,
    title: 'STEM Labs & Modern Learning Infrastructure',
    summary: 'Physical and virtual laboratory infrastructure that validates hands-on learning capabilities.',
    wordCount: '40-60 words description per laboratory facility',
    requiredFields: [
      'Composite Science Lab / Individual Physics, Chemistry, Biology Labs',
      'Atal Tinkering Lab (ATL) or Robotics & AI Innovation Hub',
      'Computer Science & ICT Center (workstation count, high-speed broadband)',
      'Mathematics Practical Lab & Digital Language Lab',
      'Individual student workstation count & safety protocols (fire extinguisher, eye-wash stations)',
      'Hands-on practical frequency (e.g., "Weekly scheduled practical sessions for Grades 6-12")'
    ],
    mediaSpecs: 'High-res lab photos showing real students in lab coats/goggles performing experiments.',
    aiPromptSnippet: 'Describe a state-of-the-art Composite Science Lab and Atal Tinkering Lab for a school profile, listing equipment, safety measures, and student practical benefits.',
    adminTips: [
      'Specify whether each student gets an individual bench or works in pairs.',
      'Mention ATL grant status or robotics competition achievements if applicable.'
    ]
  },
  fees: {
    sectionKey: 'fees',
    sectionNumber: 5,
    title: 'Fee Structure & Transparent Policies',
    summary: 'Complete fee transparency builds lasting trust and reduces admission drop-offs.',
    wordCount: 'Tabular fee tiers + 20-30 words policy notes',
    requiredFields: [
      'Grade-wise annual/quarterly fee tiers (Pre-Primary, Primary, Middle, Secondary, Senior)',
      'One-time admission fee & registration fee',
      'Caution money deposit (clearly state refundable terms upon TC issuance)',
      'Optional transport bus fee slabs according to distance radius (0-5 km, 5-10 km, 10+ km)',
      'Meal / Cafeteria subscription plans (if day-boarding)',
      'Scholarship criteria (merit scholarships for 90%+ scorers, sports quota, sibling discount)'
    ],
    mediaSpecs: 'Structured tables or clean pricing breakdown cards with currency formatted in ₹.',
    aiPromptSnippet: 'Create a clear, transparent quarterly fee structure for an Indian school from Nursery to Grade 12, including refund terms and 10% sibling discount policy.',
    adminTips: [
      'Clearly specify due dates (e.g., 10th of April, July, October, January) and grace periods.',
      'Affirm strict zero-donation / no capitation fee compliance under the RTE Act.'
    ]
  },
  admissions: {
    sectionKey: 'admissions',
    sectionNumber: 6,
    title: 'Admissions Roadmap & Document Checklist',
    summary: 'A friction-free, 4-step roadmap that walks parents through the admission journey.',
    wordCount: 'Step-by-step points + eligibility criteria (150 words)',
    requiredFields: [
      '4-Step Roadmap: Step 1 (Online Inquiry) -> Step 2 (Campus Tour) -> Step 3 (Verification) -> Step 4 (Seat Confirmation)',
      'Age eligibility criteria for Nursery, LKG, UKG, and Grade 1 (in line with NEP 2020 age 6+ rule)',
      'Mandatory documents: Birth Certificate, Transfer Certificate (TC), Aadhaar Card, Previous Grade Marksheet, Passport Photos',
      'Interactive online inquiry / registration form with immediate confirmation message'
    ],
    mediaSpecs: 'Infographic roadmap icons or numbered card sequence.',
    aiPromptSnippet: 'Draft a 4-step school admission process guide for parents, detailing required documentation, age criteria, and interactive tour scheduling.',
    adminTips: [
      'Highlight prompt turnaround time (e.g., "Admissions counselor calls within 24 hours").',
      'Provide a downloadable admission prospectus PDF link for parents.'
    ]
  },
  photos: {
    sectionKey: 'photos',
    sectionNumber: 7,
    title: 'Campus Visual Tour & School PhotoBook',
    summary: 'Authentic visuals prove the actual physical condition of campus facilities.',
    wordCount: 'Captions: 5-10 words per photograph',
    requiredFields: [
      'Campus exterior facade & main entrance building',
      'Classrooms with natural lighting and smart boards',
      'Science & computer laboratories with active students',
      'Library with reading sections and book stacks',
      'Sports fields (athletic track, basketball, football, cricket pitch)',
      'Cultural auditorium / amphitheater / art & music room'
    ],
    mediaSpecs: '8 to 15 authentic landscape photos (1200x800 px, 3:2 ratio, JPG/WebP). Avoid generic internet stock photos!',
    aiPromptSnippet: 'Suggest the 10 most impactful photos a school should upload to its online directory profile to maximize parent engagement and campus transparency.',
    adminTips: [
      'Ensure photographs are well-lit, taken on sunny days, and feature neat campus surroundings.',
      'Obtain standard parental consent for student faces featured in public photographs.'
    ]
  },
  reviews: {
    sectionKey: 'reviews',
    sectionNumber: 8,
    title: 'Verified Community Reviews & Feedback',
    summary: 'Genuine testimonials from parents, current students, and alumni validate your quality claims.',
    wordCount: 'Detailed comments: 40-100 words per verified review',
    requiredFields: [
      'Ratings across 5 core criteria: Academics, Infrastructure, Safety, Sports, and Value for Money',
      'Reviewer identity & verification badge (Parent, Student, Alumni, Faculty)',
      'Specific details on teacher support, bus transport safety, and board examination prep',
      'Gated authentication to prevent fake or automated spam reviews'
    ],
    mediaSpecs: 'User avatar icons with star ratings and verified role badges.',
    aiPromptSnippet: 'Write 3 realistic, authentic parent and alumni review examples highlighting strong teacher commitment, individual attention in science labs, and safe bus transport.',
    adminTips: [
      'Encourage genuine feedback by sending annual review invitations to your PTA members.',
      'Never fabricate fake reviews — authentic feedback including constructive points builds greater trust.'
    ]
  },
  contact: {
    sectionKey: 'contact',
    sectionNumber: 9,
    title: 'Contact Information & Interactive Campus Map',
    summary: 'Clear contact coordinates and map pin ensure visiting parents can easily find and reach the campus.',
    wordCount: 'Exact addresses, telephone numbers, and email contacts',
    requiredFields: [
      'Complete postal address with locality, landmark, district, state, and 6-digit PIN code',
      'Official admissions helpline phone number & WhatsApp inquiry link',
      'Official institutional domain email (e.g., admissions@schoolname.edu.in)',
      'Principal / Administrative Office operating hours (e.g., Mon-Sat 8:30 AM - 3:30 PM)',
      'Accurate GPS coordinates (Latitude & Longitude) for Google Maps navigation'
    ],
    mediaSpecs: 'Interactive Google Maps / OpenStreetMap embed container.',
    aiPromptSnippet: 'Draft contact information and visitor guidelines for a school campus, including visiting hours, parking access, and admissions reception desk details.',
    adminTips: [
      'Use an official domain email rather than a generic Gmail address to maintain high trust.',
      'Verify the Google Maps pin points precisely to your school entrance gate.'
    ]
  }
};

interface AiProfileTemplateGuideProps {
  showAiGuide: boolean;
  setShowAiGuide: (val: boolean) => void;
  activeSectionKey?: string;
  onNavigateSection?: (sectionKey: string) => void;
}

export default function AiProfileTemplateGuide({
  showAiGuide,
  setShowAiGuide,
  activeSectionKey,
  onNavigateSection
}: AiProfileTemplateGuideProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [selectedPromptKey, setSelectedPromptKey] = useState<string>('hero');
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  const handleCopyText = (text: string, key: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const fullChecklistText = Object.values(AI_TEMPLATE_SECTIONS)
    .map(
      (s) =>
        `==============================\nSECTION ${s.sectionNumber}: ${s.title.toUpperCase()}\n==============================\nPurpose: ${s.summary}\nRecommended Word Count: ${s.wordCount || 'N/A'}\nMedia Specs: ${s.mediaSpecs || 'N/A'}\n\nRequired Data Points:\n${s.requiredFields.map((f, i) => `  [ ] ${i + 1}. ${f}`).join('\n')}\n\nAdmin Pro-Tips:\n${s.adminTips.map((t) => `  * ${t}`).join('\n')}\n`
    )
    .join('\n\n');

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TOP STICKY AI TEMPLATE BAR                            */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-[#00284D] via-[#00487A] to-[#0A649D] text-white py-3 px-4 sm:px-6 shadow-lg border-b border-sky-400/30 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-black">
              <Bot className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-300/40 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                  AI School Profile Template
                </span>
                <span className="text-sky-200 text-xs font-semibold">
                  CSEEL Verified Master Format
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
                <span>Write Your School Name Here</span>
                <span className="text-xs font-normal text-sky-200 hidden sm:inline">• Administrator Setup Blueprint</span>
              </h1>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-between md:justify-end flex-wrap">
            
            {/* Toggle AI Instructions */}
            <button
              type="button"
              onClick={() => setShowAiGuide(!showAiGuide)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showAiGuide
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
              title="Toggle AI Section Guidelines on the page"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Guidance: {showAiGuide ? 'Visible' : 'Hidden'}</span>
            </button>

            {/* AI Prompts Generator Button */}
            <button
              type="button"
              onClick={() => setIsPromptModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-sky-500/30 hover:bg-sky-500/50 text-white border border-sky-300/40 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">AI Prompts</span>
              <span className="sm:hidden">Prompts</span>
            </button>

            {/* Copy Full Checklist */}
            <button
              type="button"
              onClick={() => setIsChecklistModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Admin Checklist</span>
            </button>

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PROMPT GENERATOR MODAL                                 */}
      {/* ========================================================= */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-200">
            <button
              type="button"
              onClick={() => setIsPromptModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#005689] text-white flex items-center justify-center font-black">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-950">AI Content Prompt Generator</h3>
                <p className="text-xs text-gray-500">Copy these tailored prompts directly into ChatGPT or Gemini to write your school content.</p>
              </div>
            </div>

            {/* Section tabs */}
            <div className="flex gap-1.5 overflow-x-auto py-3 scrollbar-none border-b border-gray-100">
              {Object.entries(AI_TEMPLATE_SECTIONS).map(([key, sec]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPromptKey(key)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                    selectedPromptKey === key
                      ? 'bg-[#006FCC] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sec.sectionNumber}. {sec.title.split('&')[0].trim()}
                </button>
              ))}
            </div>

            {/* Active prompt display */}
            {AI_TEMPLATE_SECTIONS[selectedPromptKey] && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">
                    Recommended Prompt for {AI_TEMPLATE_SECTIONS[selectedPromptKey].title}:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(
                        AI_TEMPLATE_SECTIONS[selectedPromptKey].aiPromptSnippet,
                        'prompt_' + selectedPromptKey
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#006FCC] hover:text-[#00487A] bg-blue-50 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    {copiedKey === 'prompt_' + selectedPromptKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 bg-slate-900 text-sky-100 rounded-2xl font-mono text-xs leading-relaxed border border-slate-700 select-all">
                  "{AI_TEMPLATE_SECTIONS[selectedPromptKey].aiPromptSnippet}"
                </div>

                <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-xs text-sky-950">
                  <span className="font-bold">Target Word Count:</span>{' '}
                  {AI_TEMPLATE_SECTIONS[selectedPromptKey].wordCount || 'Standard concise paragraph'}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPromptModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. FULL CHECKLIST MODAL                                   */}
      {/* ========================================================= */}
      {isChecklistModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-200 max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={() => setIsChecklistModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-black text-gray-950">
                  School Profile Complete Master Checklist
                </h3>
                <p className="text-xs text-gray-500">
                  Share this comprehensive specification checklist with your administrative team or principal's desk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(fullChecklistText, 'full_checklist')}
                className="inline-flex items-center gap-1.5 bg-[#006FCC] hover:bg-[#005499] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              >
                {copiedKey === 'full_checklist' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>

            {/* Scrollable checklist items */}
            <div className="overflow-y-auto space-y-4 py-4 pr-1 text-xs">
              {Object.values(AI_TEMPLATE_SECTIONS).map((sec) => (
                <div
                  key={sec.sectionKey}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-extrabold text-sm text-[#005689]">
                      Section {sec.sectionNumber}: {sec.title}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                      {sec.wordCount || 'Specification'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2.5 leading-relaxed">{sec.summary}</p>

                  <div className="space-y-1 mb-2.5">
                    <span className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
                      Required Content & Data:
                    </span>
                    {sec.requiredFields.map((field, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{field}</span>
                      </div>
                    ))}
                  </div>

                  {sec.mediaSpecs && (
                    <div className="text-[11px] text-indigo-900 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{sec.mediaSpecs}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsChecklistModalOpen(false)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Checklist
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Visual AI Instruction Callout Card rendered right above or inside a specific section
 */
export function AiSectionInstructionBadge({
  sectionKey,
  isVisible
}: {
  sectionKey: keyof typeof AI_TEMPLATE_SECTIONS | string;
  isVisible: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isVisible) return null;

  const data = AI_TEMPLATE_SECTIONS[sectionKey];
  if (!data) return null;

  const handleCopyPrompt = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(data.aiPromptSnippet);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  return (
    <div className="my-6 bg-gradient-to-br from-amber-50/90 via-sky-50/50 to-white rounded-3xl p-4 sm:p-6 border-2 border-amber-300/80 shadow-md transition-all">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                AI Template Instruction #{data.sectionNumber}
              </span>
              <span className="text-xs font-bold text-[#005689]">{data.title}</span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">{data.summary}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          title={isExpanded ? 'Collapse instructions' : 'Expand instructions'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Body */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-amber-200/60 space-y-3.5 text-xs">
          
          {/* What to write & specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-200/50 shadow-2xs">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>What to Write Here (Mandatory Information):</span>
              </h4>
              <ul className="space-y-1.5 text-gray-700">
                {data.requiredFields.map((field, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              {data.wordCount && (
                <div className="bg-white/90 p-3 rounded-2xl border border-amber-200/50 shadow-2xs flex items-center justify-between">
                  <span className="font-bold text-gray-700 text-[11px]">Recommended Length:</span>
                  <span className="font-bold text-[#006FCC] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {data.wordCount}
                  </span>
                </div>
              )}

              {data.mediaSpecs && (
                <div className="bg-white/90 p-3 rounded-2xl border border-amber-200/50 shadow-2xs">
                  <div className="font-bold text-gray-700 text-[11px] mb-1 flex items-center gap-1">
                    <Camera className="w-3 h-3 text-indigo-600" />
                    <span>Media & Photo Guidelines:</span>
                  </div>
                  <p className="text-gray-600 text-[11px] leading-relaxed">{data.mediaSpecs}</p>
                </div>
              )}

              <div className="bg-white/90 p-3 rounded-2xl border border-amber-200/50 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-700 text-[11px] flex items-center gap-1">
                    <Bot className="w-3 h-3 text-emerald-600" />
                    <span>AI Writing Prompt:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006FCC] hover:text-[#00487A] cursor-pointer"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-[11px] text-gray-800 bg-gray-50 p-2 rounded-lg border border-gray-200 italic">
                  "{data.aiPromptSnippet}"
                </p>
              </div>
            </div>
          </div>

          {/* Admin Tips */}
          {data.adminTips.length > 0 && (
            <div className="bg-amber-100/60 p-2.5 rounded-xl border border-amber-300/60 flex items-start gap-2 text-[11px] text-amber-950">
              <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Administrator Pro-Tip: </span>
                {data.adminTips.join(' • ')}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
