'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Plus,
  Trash2,
  Check,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import EditableText from './EditableText';
import { useOptionalSchoolTemplate, SchoolFaqItem } from './SchoolTemplateContext';
import { cleanBoardName } from '@/integrations/supabase/schoolSearchClient';
export interface AuthenticFaqProps {
  id?: string;
  schoolName?: string;
  board?: string;
  udiseCode?: string;
  address?: string;
  state?: string;
  district?: string;
  village?: string;
  pincode?: string;
  classFrom?: string;
  classTo?: string;
  schoolCategory?: string;
  management?: string;
  medium?: string;
  genderType?: string;
  totalStudents?: number | string;
  totalTeachers?: number | string;
  workingSmartBoards?: number;
  computerIctLab?: string;
  atalStemLab?: string;
  playgroundAvailable?: string;
}

function FaqEditCard({
  faq,
  idx,
  onSave,
  onDelete,
}: {
  faq: SchoolFaqItem;
  idx: number;
  onSave: (q: string, a: string) => void;
  onDelete: () => void;
}) {
  const [q, setQ] = useState(faq.q);
  const [a, setA] = useState(faq.a);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setQ(faq.q);
    setA(faq.a);
  }, [faq.q, faq.a]);

  const handleAutoSave = () => {
    if (q !== faq.q || a !== faq.a) {
      onSave(q, a);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  return (
    <div className="p-3.5 sm:p-5 rounded-2xl border-2 border-[#006FCC]/40 bg-white shadow-sm space-y-3.5">
      <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-slate-100">
        <span className="flex items-center gap-2 text-[#006FCC]">
          <span className="w-5 h-5 rounded-full bg-[#EDF5FA] border border-[#D0E4F5] flex items-center justify-center text-[10.5px] font-black">
            {idx + 1}
          </span>
          <span className="font-['Montserrat',sans-serif] uppercase tracking-wide">FAQ Question #{idx + 1}</span>
        </span>

        <div className="flex items-center gap-2">
          {justSaved && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 border border-emerald-200">
              <Check className="w-3 h-3" /> Auto-saved
            </span>
          )}

          {/* Icon-Only Delete Button (no words, just clean trash icon) */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
            title="Delete FAQ"
            aria-label="Delete FAQ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Question Text Area: Full width, spacious, entire question visible, auto-saves on blur */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
          Question Text
        </label>
        <textarea
          rows={2}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setJustSaved(false);
          }}
          onBlur={handleAutoSave}
          placeholder="Enter complete parent or student query here..."
          className="w-full p-3 text-sm sm:text-[15px] font-medium text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC] focus:ring-2 focus:ring-[#006FCC]/20 transition-all bg-slate-50/50 leading-relaxed"
        />
      </div>

      {/* 2. Institutional Answer Text Area: Full width, spacious, entire answer visible, auto-saves on blur */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
          Institutional Answer
        </label>
        <textarea
          rows={3}
          value={a}
          onChange={(e) => {
            setA(e.target.value);
            setJustSaved(false);
          }}
          onBlur={handleAutoSave}
          placeholder="Enter complete, authentic institutional answer..."
          className="w-full p-3 text-sm sm:text-[15px] font-normal text-slate-800 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006FCC] focus:ring-2 focus:ring-[#006FCC]/20 transition-all bg-slate-50/50 leading-relaxed"
        />
      </div>
    </div>
  );
}

export function buildAuthenticFaqs(props: AuthenticFaqProps): SchoolFaqItem[] {
  const name = props.schoolName || 'This school';
  const faqs: SchoolFaqItem[] = [];

  // 1. Board Affiliation (Strictly from UDISE)
  const cleanedBoard = cleanBoardName(props.board);
  if (cleanedBoard && cleanedBoard !== '—' && cleanedBoard !== 'N/A' && cleanedBoard.toLowerCase() !== 'other') {
    faqs.push({
      id: 'faq-board',
      q: `Which educational board is ${name} affiliated with?`,
      a: `${name} is affiliated with ${cleanedBoard} under official government educational records.`,
      category: 'Academics',
    });
  }

  // 2. Official UDISE Code (Strictly from UDISE)
  const rawUdise = (props.udiseCode || '').replace(/\D/g, '');
  if (rawUdise && rawUdise.length >= 8) {
    faqs.push({
      id: 'faq-udise',
      q: `What is the official UDISE Code of ${name}?`,
      a: `The official UDISE+ code for ${name} is ${rawUdise}, registered under the Department of School Education, Ministry of Education, Government of India.`,
      category: 'Accreditation',
    });
  }

  // 3. Classes Offered (Strictly from UDISE)
  const hasClasses = props.classFrom && props.classTo && props.classFrom !== '—' && props.classTo !== '—';
  if (hasClasses) {
    faqs.push({
      id: 'faq-classes',
      q: `Which grade levels and classes are taught at ${name}?`,
      a: `${name} offers school education from ${props.classFrom} to ${props.classTo}.`,
      category: 'Academics',
    });
  } else if (props.schoolCategory && props.schoolCategory !== '—') {
    faqs.push({
      id: 'faq-classes',
      q: `What institutional grade category does ${name} belong to?`,
      a: `${name} is categorized as ${props.schoolCategory} under official records.`,
      category: 'Academics',
    });
  }

  // 4. Management & Authority (Strictly from UDISE)
  if (props.management && props.management.trim() && props.management !== '—') {
    faqs.push({
      id: 'faq-mgmt',
      q: `What type of management operates ${name}?`,
      a: `${name} operates under ${props.management} administration.`,
      category: 'Accreditation',
    });
  }

  // 5. Medium of Instruction (Strictly from UDISE)
  if (props.medium && props.medium.trim() && props.medium !== '—') {
    faqs.push({
      id: 'faq-medium',
      q: `What is the medium of instruction at ${name}?`,
      a: `The recognized medium of instruction at ${name} is ${props.medium}.`,
      category: 'Academics',
    });
  }

  // 6. School Gender Format (Strictly from UDISE)
  if (props.genderType && props.genderType.trim() && props.genderType !== '—') {
    faqs.push({
      id: 'faq-gender',
      q: `Is ${name} a co-educational or single-gender institution?`,
      a: `${name} is recognized as a ${props.genderType} school.`,
      category: 'General',
    });
  }

  // 7. Student-Teacher Ratio (Strictly only when both students and teachers > 0)
  const students = Number(props.totalStudents) || 0;
  const teachers = Number(props.totalTeachers) || 0;
  if (students > 0 && teachers > 0) {
    const ratio = Math.round(students / teachers);
    faqs.push({
      id: 'faq-ratio',
      q: `What is the student-teacher ratio at ${name}?`,
      a: `According to verified government records, the school reports ${students.toLocaleString()} enrolled students and ${teachers.toLocaleString()} faculty members, establishing a student-teacher ratio of 1:${ratio}.`,
      category: 'Faculty',
    });
  }

  // 8. Campus Location (Strictly from UDISE)
  const location = props.address || [props.village, props.district, props.state, props.pincode].filter(Boolean).join(', ');
  if (location && location.trim() && location !== '—' && location !== 'Campus Address') {
    faqs.push({
      id: 'faq-location',
      q: `Where is the campus of ${name} located?`,
      a: `${name} is located at ${location}.`,
      category: 'Location',
    });
  }

  // 9. Digital & STEM Labs (Strictly from UDISE)
  const smartBoards = Number(props.workingSmartBoards) || 0;
  const strIct = String(props.computerIctLab ?? '').toLowerCase();
  const strStem = String(props.atalStemLab ?? '').toLowerCase();
  const hasIct = strIct === 'true' || strIct.includes('yes') || strIct.includes('avail') || strIct === '1';
  const hasStem = strStem === 'true' || strStem.includes('yes') || strStem.includes('avail') || strStem === '1';
  const facilitiesList: string[] = [];
  if (hasStem) facilitiesList.push('Atal Tinkering STEM Lab');
  if (hasIct) facilitiesList.push('Computer ICT Lab');
  if (smartBoards > 0) facilitiesList.push(`${smartBoards} Smart Classrooms`);

  if (facilitiesList.length > 0) {
    faqs.push({
      id: 'faq-labs',
      q: `What digital learning and laboratory infrastructure is available at ${name}?`,
      a: `Official records confirm the availability of ${facilitiesList.join(', ')}.`,
      category: 'Facilities',
    });
  }

  // 10. Dedicated Playground (Strictly from UDISE)
  const strPlayground = String(props.playgroundAvailable ?? '').toLowerCase();
  const hasPlayground = strPlayground === 'true' || strPlayground.includes('yes') || strPlayground.includes('avail') || strPlayground === '1';
  if (hasPlayground) {
    faqs.push({
      id: 'faq-playground',
      q: `Does ${name} have a playground for sports and athletic activities?`,
      a: `Yes, official records confirm dedicated playground facilities for sports and physical education.`,
      category: 'Facilities',
    });
  }

  return faqs;
}

export interface SchoolFaqSectionProps extends AuthenticFaqProps {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  isEditMode?: boolean;
}

export default function SchoolFaqSection({
  id = 'faq',
  className = '',
  title = 'Frequently Asked Questions',
  subtitle = 'Authentic questions and verified information derived directly from official government records.',
  isEditMode: propIsEditMode,
  schoolName,
  board,
  udiseCode,
  address,
  state,
  district,
  village,
  pincode,
  classFrom,
  classTo,
  schoolCategory,
  management,
  medium,
  genderType,
  totalStudents,
  totalTeachers,
  workingSmartBoards,
  computerIctLab,
  atalStemLab,
  playgroundAvailable,
}: SchoolFaqSectionProps) {
  const ctx = useOptionalSchoolTemplate();
  const isEditMode = propIsEditMode !== undefined ? propIsEditMode : (ctx?.isEditMode ?? false);

  // Build authentic FAQs strictly from current real UDISE data
  const defaultUdiseFaqs = React.useMemo(() => {
    return buildAuthenticFaqs({
      schoolName: schoolName || ctx?.data?.schoolName,
      board: board || ctx?.data?.board,
      udiseCode: udiseCode || ctx?.data?.udiseCode,
      address: address || ctx?.data?.address,
      state: state || ctx?.data?.state,
      district: district || ctx?.data?.district,
      village: village || ctx?.data?.village,
      pincode: pincode || ctx?.data?.pincode,
      classFrom: classFrom || ctx?.data?.classFrom,
      classTo: classTo || ctx?.data?.classTo,
      schoolCategory: schoolCategory || (ctx?.data as any)?.schoolCategory,
      management: management || ctx?.data?.management,
      medium: medium || ctx?.data?.medium,
      genderType: genderType || ctx?.data?.genderType,
      totalStudents: totalStudents ?? ctx?.data?.totalStudents,
      totalTeachers: totalTeachers ?? ctx?.data?.totalTeachers,
      workingSmartBoards: workingSmartBoards ?? (ctx?.data?.workingSmartBoards ? Number(ctx.data.workingSmartBoards) : undefined),
      computerIctLab: computerIctLab,
      atalStemLab: atalStemLab,
      playgroundAvailable: playgroundAvailable,
    });
  }, [
    schoolName,
    board,
    udiseCode,
    address,
    state,
    district,
    village,
    pincode,
    classFrom,
    classTo,
    schoolCategory,
    management,
    medium,
    genderType,
    totalStudents,
    totalTeachers,
    workingSmartBoards,
    computerIctLab,
    atalStemLab,
    playgroundAvailable,
    ctx?.data,
  ]);

  // Use school's custom saved FAQs if present, otherwise fall back to authentic UDISE data (capped to 5 concise questions)
  const MAX_FAQS_LIMIT = 10;
  const rawFaqs: SchoolFaqItem[] =
    ctx?.data?.faqs && ctx.data.faqs.length > 0
      ? ctx.data.faqs
      : defaultUdiseFaqs;

  const faqs: SchoolFaqItem[] = rawFaqs.slice(0, MAX_FAQS_LIMIT);

  // Track which FAQ items are open (accordion)
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>(() => {
    const firstId = faqs[0]?.id || 'faq-board';
    return { [firstId]: true };
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const toggleFaq = (faqId: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [faqId]: !prev[faqId],
    }));
  };

  // Derive categories dynamically ONLY from existing FAQs
  const availableCategories = React.useMemo(() => {
    const cats = new Set<string>();
    faqs.forEach((f) => {
      if (f.category) cats.add(f.category);
    });
    return ['All', ...Array.from(cats)];
  }, [faqs]);

  const filteredFaqs = faqs.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  // Edit Mode actions (School khud add/edit/delete karegi - Max 10 Limit)
  const handleAddFaq = () => {
    if (!ctx?.addFaq) return;
    if (rawFaqs.length >= MAX_FAQS_LIMIT) {
      alert('Maximum 10 FAQ questions allowed.');
      return;
    }
    const newId = `faq-${Date.now().toString(36)}`;
    ctx.addFaq({
      q: 'Write parent or student query here?',
      a: 'Provide clear, authentic institutional information.',
      category: activeCategory !== 'All' ? activeCategory : 'General',
    }, rawFaqs);
    setOpenFaqIds((prev) => ({ ...prev, [newId]: true }));
  };

  const handleDeleteFaq = (faqId: string) => {
    if (!ctx?.deleteFaq) return;
    ctx.deleteFaq(faqId, rawFaqs);
  };

  if (faqs.length === 0 && !isEditMode) {
    return null;
  }

  return (
    <section id={id} className={`py-5 sm:py-7 bg-[#EEF2F6] border-b border-[#DCE2E8] relative overflow-hidden ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Section Header */}
        <div className="mb-4 sm:mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EDF5FA] border border-[#D0E4F5] text-[10.5px] font-bold tracking-wider uppercase text-[#006FCC] mb-1.5 font-['Montserrat',sans-serif]">
            <HelpCircle className="w-3 h-3 text-[#006FCC]" />
            <EditableText
              contentKey="faq_eyebrow"
              value="FREQUENTLY ASKED QUESTIONS"
              maxLength={35}
              className="inline-block"
            />
          </div>

          <h2 className="text-[18px] sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-snug pl-2.5 border-l-[3px] border-[#006FCC] m-0">
            <EditableText
              contentKey="faq_heading"
              value={title}
              maxLength={60}
              className="inline-block"
            />
          </h2>
        </div>

        {/* FAQ List: Full-Width Editing Cards in Edit Mode, Interactive Accordions for Visitors */}
        {isEditMode ? (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, idx) => (
              <FaqEditCard
                key={faq.id || idx}
                faq={faq}
                idx={idx}
                onSave={(newQ, newA) => {
                  if (!ctx?.updateFaq) return;
                  ctx.updateFaq(faq.id, { q: newQ, a: newA }, rawFaqs);
                }}
                onDelete={() => handleDeleteFaq(faq.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1.5 sm:space-y-2">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = !!openFaqIds[faq.id];

              return (
                <div
                  key={faq.id || idx}
                  className={`rounded-xl border transition-all duration-150 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[#006FCC]/45 shadow-xs'
                      : 'bg-white border-[#E8EAED] hover:border-[#006FCC]/35'
                  }`}
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 text-left cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-2.5 pr-2 flex-1 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
                          isOpen 
                            ? 'bg-[#006FCC] text-white border-[#006FCC]' 
                            : 'bg-[#EDF5FA] text-[#006FCC] border-[#D0E4F5] group-hover:bg-[#006FCC] group-hover:text-white'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] sm:text-[14.5px] font-normal text-[#3C4043] group-hover:text-[#006FCC] transition-colors leading-snug">
                          <span>{faq.q}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 ${
                          isOpen 
                            ? 'rotate-180 bg-[#EDF5FA] text-[#006FCC]' 
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}
                      >
                        <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>

                  {/* Accordion Answer Content */}
                  {isOpen && (
                    <div className="px-3 sm:px-4 pb-3 pt-0 border-t border-slate-100">
                      <div className="pl-8.5 pt-2 !text-[15px] font-['Lato',var(--font-roboto),Roboto,sans-serif] text-[#3C4043] !leading-[1.68] font-normal">
                        <p className="m-0 !text-[15px] font-['Lato',var(--font-roboto),Roboto,sans-serif] !text-[#3C4043] !leading-[1.68] font-normal">{faq.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Mode Actions (School Manual FAQ Management - Max 10 Questions) */}
        {isEditMode && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {rawFaqs.length < MAX_FAQS_LIMIT ? (
              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#005689] text-white hover:bg-[#003c6e] font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom FAQ Question ({rawFaqs.length}/{MAX_FAQS_LIMIT})</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                Maximum limit of 10 FAQ questions reached ({rawFaqs.length}/{MAX_FAQS_LIMIT})
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
