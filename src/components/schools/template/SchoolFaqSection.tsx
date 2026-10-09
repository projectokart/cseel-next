'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import EditableText from './EditableText';
import { useOptionalSchoolTemplate, SchoolFaqItem } from './SchoolTemplateContext';

const DEFAULT_SCHOOL_FAQS: SchoolFaqItem[] = [
  {
    id: 'faq-1',
    q: 'What is the age criteria for Nursery and KG admissions?',
    a: 'For Nursery, the child must be 3+ years old as of March 31st of the academic session. For KG / Prep, the minimum age is 4+ years. A birth certificate and immunization card are required during registration.',
    category: 'Admissions',
  },
  {
    id: 'faq-2',
    q: 'Which education board does the school follow?',
    a: 'The school is affiliated with the Central Board of Secondary Education (CBSE), New Delhi, implementing NEP 2020 experiential learning practicals, coding labs, and continuous formative evaluations.',
    category: 'Academics',
  },
  {
    id: 'faq-3',
    q: 'Is school transport available and how is child safety monitored?',
    a: 'Yes, we operate a dedicated fleet of GPS-tracked, CCTV-enabled buses across all major routes. Every vehicle is staffed with a certified driver, male cleaner, and trained female attendant for maximum student safety.',
    category: 'Transport & Safety',
  },
  {
    id: 'faq-4',
    q: 'Can the annual school fees be paid in installments?',
    a: 'Yes, tuition fees can be paid in four convenient quarterly installments via online portal (UPI, Net Banking, Cards) or at the accounts desk. Detailed fee receipts are issued instantly.',
    category: 'Fees',
  },
  {
    id: 'faq-5',
    q: 'What is the teacher-student ratio in foundational classes?',
    a: 'We maintain an optimal 1:15 teacher-student ratio in primary grades to ensure every learner receives individual attention, customized remediation, and continuous mentor feedback.',
    category: 'Academics',
  },
  {
    id: 'faq-6',
    q: 'What sports and practical hands-on facilities are available?',
    a: 'The campus features advanced STEM & Robotics innovation labs, composite science labs, 15,000+ volume central library, football grounds, basketball arenas, athletics tracks, and yoga pavilions.',
    category: 'Facilities',
  },
];

interface SchoolFaqSectionProps {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function SchoolFaqSection({
  id = 'faq',
  className = '',
  title = 'Frequently Asked Questions',
  subtitle = 'Find clear, authentic answers to top parent questions regarding admissions, fees, transport, and academic life.',
}: SchoolFaqSectionProps) {
  const ctx = useOptionalSchoolTemplate();
  const isEditMode = ctx?.isEditMode ?? false;

  const faqs: SchoolFaqItem[] =
    ctx?.data?.faqs && ctx.data.faqs.length > 0
      ? ctx.data.faqs
      : DEFAULT_SCHOOL_FAQS;

  // Track which FAQ items are open (accordion)
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    'faq-1': true, // First one open by default
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const toggleFaq = (faqId: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [faqId]: !prev[faqId],
    }));
  };

  // Categories
  const categories = ['All', 'Admissions', 'Academics', 'Fees', 'Transport & Safety', 'Facilities'];

  const filteredFaqs = faqs.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  // Edit Mode actions
  const handleAddFaq = () => {
    if (!ctx?.addFaq) return;
    const newId = `faq-${Date.now().toString(36)}`;
    ctx.addFaq({
      q: 'Write parent or student query here?',
      a: 'Provide clear, reassuring information about school policy, timings, or procedures.',
      category: activeCategory !== 'All' ? activeCategory : 'Admissions',
    });
    setOpenFaqIds((prev) => ({ ...prev, [newId]: true }));
  };

  const handleDeleteFaq = (faqId: string) => {
    if (!ctx?.deleteFaq) return;
    ctx.deleteFaq(faqId);
  };

  return (
    <section id={id} className={`py-12 sm:py-20 bg-gradient-to-b from-white via-[#F8FAFC] to-white relative ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDF5FA] border border-[#D0E5F5] text-xs font-bold tracking-wider uppercase text-[#005689] mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#005689]" />
            <EditableText
              contentKey="faq_eyebrow"
              value="HELP & ADMISSIONS DESK"
              maxLength={30}
              className="inline-block"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
            <EditableText
              contentKey="faq_heading"
              value={title}
              maxLength={60}
              className="inline-block"
            />
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
            <EditableText
              contentKey="faq_subtitle"
              value={subtitle}
              maxLength={180}
              multiline
              rows={2}
              className="inline-block"
            />
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#005689] text-white shadow-sm shadow-[#005689]/20 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5 sm:space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = !!openFaqIds[faq.id];

            return (
              <div
                key={faq.id || idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#005689]/30 shadow-md shadow-slate-200/50 ring-1 ring-[#005689]/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Accordion Question Header */}
                <div
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer select-none group"
                >
                  <div className="flex items-start gap-3 sm:gap-4 pr-3 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-[#005689] text-white' : 'bg-[#EDF5FA] text-[#005689] group-hover:bg-[#005689]/10'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 mb-1">
                        {faq.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                            {faq.category}
                          </span>
                        )}
                      </div>

                      <div className="text-sm sm:text-base font-bold text-gray-950 group-hover:text-[#005689] transition-colors">
                        {isEditMode ? (
                          <EditableText
                            contentKey={`faq_q_${faq.id}`}
                            value={faq.q}
                            maxLength={120}
                            placeholder="Enter question text..."
                            className="inline-block"
                          />
                        ) : (
                          <span>{faq.q}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFaq(faq.id);
                        }}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete this FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-[#EDF5FA] text-[#005689]' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* Accordion Answer Content */}
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-0 border-t border-slate-100 mt-1">
                    <div className="pl-11 sm:pl-13 pt-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {isEditMode ? (
                        <EditableText
                          contentKey={`faq_a_${faq.id}`}
                          value={faq.a}
                          multiline
                          rows={3}
                          maxLength={350}
                          placeholder="Enter clear, helpful answer..."
                          className="inline-block"
                        />
                      ) : (
                        <p>{faq.a}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add FAQ Button in Edit Mode */}
        {isEditMode && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#005689] text-white hover:bg-[#003c6e] font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Frequently Asked Question</span>
            </button>
          </div>
        )}

        {/* Bottom Help Banner */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#005689]/10 via-[#EDF5FA] to-[#005689]/5 border border-[#005689]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#005689] text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-950">Still Have Questions About Admissions?</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Our admissions counselors are available Monday to Saturday (8:00 AM - 4:00 PM) to help you.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#contact-info"
              className="px-4 py-2 rounded-xl bg-[#005689] text-white hover:bg-[#003c6e] text-xs font-bold transition shadow-sm"
            >
              Contact Admissions Desk →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
