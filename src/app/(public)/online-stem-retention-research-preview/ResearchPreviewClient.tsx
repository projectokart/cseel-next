'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Share2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Check,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Clock,
  Briefcase,
  HelpCircle,
  Building2,
  Mail,
  User,
  Phone
} from 'lucide-react';

export default function ResearchPreviewClient() {
  const [copied, setCopied] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    institution: '',
    institutionType: 'Secondary School',
    position: 'Professor/Instructor'
  });

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setFormSubmitted(true);
  };

  return (
    <article className="min-h-screen bg-white text-slate-800 selection:bg-[#D6EDFF] selection:text-[#003C6E]">
      
      {/* ═════════════════════════════════════════════════════════════════════════
          1. HERO HEADER SECTION (Exact Webflow / Image Layout & Deep Navy #003C6E)
          ═════════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#003C6E] text-white pt-8 sm:pt-12 pb-12 sm:pb-16 overflow-hidden border-b border-white/10">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb strip */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#CCE2F5]/80 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/research" className="hover:text-white transition-colors">Research</Link>
            <span>/</span>
            <span className="text-white font-semibold truncate">The Confidence Effect</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Eyebrow, Heading, Subtitle & Single CTA Button */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              
              <div className="text-[#FAB40E] uppercase text-xs sm:text-[13px] font-extrabold tracking-[0.14em] font-['Montserrat',sans-serif]">
                THE CONFIDENCE EFFECT
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-[1.14] tracking-tight font-['Montserrat',sans-serif]">
                The #1 Predictor of STEM Retention Isn’t Flexibility.<br className="hidden sm:inline" />
                It’s Confidence.
              </h1>

              <p className="text-base sm:text-lg text-[#F7F8F8]/90 font-normal leading-relaxed font-['Lato',sans-serif] max-w-xl">
                Why Experiential Learning Has Become Essential to Student Retention &amp; the Future of STEM Education
              </p>

              {/* Research Metrics Strip */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-2 text-xs text-[#CCE2F5]/85 border-y border-white/15 font-medium">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  <span><strong>411</strong> STEM Students Surveyed</span>
                </div>
                <span className="text-white/30 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  <span>Empirical Investigation</span>
                </div>
                <span className="text-white/30 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  <span>13-Page Comprehensive Report</span>
                </div>
              </div>

              {/* ONLY ONE BUTTON: Book Free Demo */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-sm sm:text-base font-['Montserrat',sans-serif] shadow-lg shadow-black/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>Book Free Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
                  title="Share Article"
                  aria-label="Share Article"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

            </div>

            {/* Right Column: Hero Graphic Illustration (Person standing on blue blocks reaching for star) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative max-w-[500px] w-full rounded-2xl overflow-hidden">
                <img
                  src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75ff0972d096cdd6372596_Thumbnail.jpg"
                  alt="The Confidence Effect - STEM Retention and Experiential Learning"
                  className="w-full h-auto object-cover rounded-xl"
                  loading="eager"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          2. MAIN REPORT BODY AREA (Clean Editorial Style)
          ═════════════════════════════════════════════════════════════════════════ */}
      <main id="report-content" className="py-12 sm:py-20">
        <div className="max-w-[880px] mx-auto px-4 sm:px-6">

          {/* ── Section 1: The Landscape Shift ───────────────────────────────── */}
          <section className="space-y-6">
            <p className="text-xl sm:text-[22px] font-semibold text-[#003C6E] leading-relaxed font-['Montserrat',sans-serif]">
              The landscape of STEM education is undergoing a profound shift. For the first time, more college students are learning entirely online than in person. Career-focused certificates and short-term credentials are growing faster than traditional degree programs, and adult learners and working professionals make up a substantial share of the STEM pipeline.
            </p>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Today’s STEM student is less likely to be the stereotypical undergraduate living on campus and attending scheduled lab sessions each week and more likely to be studying remotely, balancing coursework with a job. While STEM remains strong, the pathways students are taking to get into it look increasingly different from the traditional four-year, on-campus model that has long defined the field.
            </p>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              For these learners, online and hybrid education is not simply a matter of convenience. It is often the only path to earning a degree. This shift presents an extraordinary opportunity for colleges and universities. Online and hybrid STEM programs have opened doors for students who may never have considered science education possible. It has long been established that flexible scheduling has expanded access, diversified enrollment, and helped institutions reach learners whose lives extend far beyond the classroom.
            </p>

            {/* Motivated Student Image */}
            <figure className="my-8 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <img
                src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75e847ef54c09f8d196334_extraordinarily%20motivated.jpg"
                alt="Motivated student working remotely with digital lab simulations"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </figure>
          </section>

          {/* ── Section 2: The New Challenge ─────────────────────────────────── */}
          <section className="mt-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              Yet expanding access introduces a new challenge.
            </h2>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              STEM has always been grounded in experience. Students do not become scientists by reading about experiments. They become scientists by designing them, testing hypotheses, making mistakes, interpreting results, and gradually building the confidence to apply what they’ve learned. That confidence, as this research suggests, may be one of the most important and overlooked predictors of persistence and retention in online STEM education.
            </p>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              To better understand what today’s online and hybrid STEM learners need to succeed, researchers surveyed <strong>411 students</strong> enrolled in four-year undergraduate and graduate online and hybrid STEM programs across universities. Conducted between April and June 2026, the study explored how learners choose programs, what keeps them engaged, what threatens persistence, what improves retention, and how experiential learning shapes confidence and career readiness.
            </p>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              The findings reveal a story that extends well beyond online education. They show that learners expect both flexibility and rigor. More importantly, the data reveal that meaningful experiential learning builds the confidence students need to persist in their programs, prepare for the workforce, graduate, and pursue careers in STEM.
            </p>

            {/* Important Question Image */}
            <figure className="my-8 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <img
                src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75e99261df5a0d9a3f98e9_important%20question.jpg"
                alt="An important question facing STEM higher education"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </figure>
          </section>

          {/* ── Section 3: Students Are Investing in Their Future ─────────────── */}
          <section className="mt-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              Students Are Investing in Their Future
            </h2>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              For years, institutions have recognized that flexible online and hybrid scheduling removes geographic barriers, accommodates working adults, and expands enrollment opportunities for learners whose lives cannot fit a traditional academic calendar. That remains true. What has changed is why students are making the choice to a STEM pathway.
            </p>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Career advancement has become the primary driver behind STEM enrollment decisions. Nearly every student surveyed (<strong>94%</strong>) said they selected an online or hybrid STEM program because they believed it would help advance their career. At the same time, flexibility remains essential, with more than 4 in 5 students saying the ability to balance education around their lives influenced their decision. Personal passion for STEM also remains remarkably strong (<strong>70%</strong>), suggesting learners are motivated by both professional aspirations and genuine curiosity.
            </p>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Students willingly accept demanding coursework because they believe a STEM degree represents higher earning potential (<strong>67%</strong>), career advancement (<strong>69%</strong>), and job stability (<strong>63%</strong>). They are investing significant time, money, and effort because they expect the experience to prepare them for the workforce.
            </p>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Taken together, these findings paint a clear picture: today’s students are not looking for an easier education. They are looking for an education they can realistically complete and that will prepare them for a future career. They need institutions to show them a path forward.
            </p>

            {/* Blockquote in Deep Navy */}
            <blockquote className="my-8 p-6 sm:p-7 rounded-2xl bg-[#EDF5FA] border-l-4 border-[#006FCC] text-lg sm:text-xl font-bold text-[#003C6E] leading-relaxed font-['Montserrat',sans-serif]">
              “Programs that successfully combine flexibility with meaningful experiential learning are positioned to attract a growing population of career-focused students who increasingly evaluate schools not only on reputation, but on whether graduates leave feeling capable, confident, and prepared to succeed.”
            </blockquote>

            {/* What Students Are Up Against Card (with exact Webflow donut PNGs) */}
            <div className="my-10 p-6 sm:p-8 rounded-2xl bg-[#EDF5FA] border border-[#CCE2F5]">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[#003C6E] font-['Montserrat',sans-serif]">
                  What Students Are Up Against
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Today’s STEM learners are balancing competing responsibilities while wondering whether an online education can truly prepare them for what’s ahead.
                </p>
              </div>

              {/* 2x2 Grid with Donut Chart Icons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                
                {/* 81% Stat Card */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <img
                    src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75f330ef08c7a8148e2485_81-percent.png"
                    alt="81 percent"
                    className="w-14 h-14 shrink-0 object-contain"
                  />
                  <div className="text-sm text-slate-800 font-bold leading-snug">
                    81% struggle balancing coursework with work and personal responsibilities
                  </div>
                </div>

                {/* 73% Stat Card 1 */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <img
                    src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75f37c2837182dfa74eff0_73-percent.png"
                    alt="73 percent"
                    className="w-14 h-14 shrink-0 object-contain"
                  />
                  <div className="text-sm text-slate-800 font-bold leading-snug">
                    73% entered their program concerned it would be less engaging
                  </div>
                </div>

                {/* 73% Stat Card 2 */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <img
                    src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75f37c2837182dfa74eff0_73-percent.png"
                    alt="73 percent"
                    className="w-14 h-14 shrink-0 object-contain"
                  />
                  <div className="text-sm text-slate-800 font-bold leading-snug">
                    73% continue working while earning their degree
                  </div>
                </div>

                {/* 71% Stat Card */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <img
                    src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75f3919c0b8581b9dc4491_71-percent.png"
                    alt="71 percent"
                    className="w-14 h-14 shrink-0 object-contain"
                  />
                  <div className="text-sm text-slate-800 font-bold leading-snug">
                    71% worried it would be less effective than traditional learning
                  </div>
                </div>

              </div>

              <p className="text-xs sm:text-sm text-slate-600 mt-6 pt-4 border-t border-slate-200/60 font-medium">
                The institutions best positioned for the future will deliver the experiences that transform enrollment into confidence and confidence into career readiness.
              </p>
            </div>
          </section>

          {/* ── Section 4: The Path to a STEM Career Shouldn’t Feel Out of Reach ─── */}
          <section className="mt-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              The Path to a STEM Career Shouldn’t Feel Out of Reach
            </h2>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Meet Maya. She is 34 years old, works full time, and is pursuing an online biology degree after years away from school. She studies after her children go to bed, completes assignments during lunch breaks, and spends weekends catching up on coursework. She is exactly the type of student online STEM programs were designed to serve. But when laboratory experiences require travel to campus or are limited to a fixed schedule, the balance she has worked so hard to achieve begins to unravel. Missing a lab is more than missing a class. It can mean falling behind in an entire course.
            </p>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Maya’s story is fictional, but the challenges she faces are not. More than four in five students (<strong>81%</strong>) say balancing coursework with work and personal responsibilities is difficult. Among fully online STEM students, <strong>40%</strong> have questioned whether it is realistic to continue their program because of outside responsibilities. More than half (<strong>54%</strong>) of those considering leaving cite work-life balance as a primary reason.
            </p>

            <blockquote className="my-8 p-6 sm:p-7 rounded-2xl bg-[#EDF5FA] border-l-4 border-[#006FCC] text-lg sm:text-xl font-bold text-[#003C6E] leading-relaxed font-['Montserrat',sans-serif]">
              “Students rarely lose motivation overnight. More often, they lose confidence gradually when they no longer feel prepared to succeed.”
            </blockquote>
          </section>

          {/* ═════════════════════════════════════════════════════════════════════
              EMBEDDED "BOOK FREE DEMO" SECTION
              ═════════════════════════════════════════════════════════════════════ */}
          <section id="book-demo-section" className="my-14 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#002244] to-[#003C6E] text-white shadow-xl border border-white/10">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#FAB40E] text-xs font-bold tracking-wider uppercase font-['Montserrat',sans-serif]">
                <Sparkles className="w-3.5 h-3.5 text-[#FAB40E]" />
                <span>Live Interactive Experience</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Montserrat',sans-serif]">
                Book a Free Institutional Demo
              </h2>
              <p className="text-sm sm:text-base text-slate-200">
                Experience how CSEEL interactive virtual labs enhance STEM retention and student confidence. Schedule a 20-minute tailored walkthrough for your institution.
              </p>
            </div>

            {formSubmitted ? (
              <div className="max-w-md mx-auto text-center py-8 px-6 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-sm space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white font-['Montserrat',sans-serif]">Demo Request Received!</h3>
                <p className="text-xs text-slate-200">
                  Thank you, <strong>{formData.firstName || 'Educator'}</strong>. An academic specialist from CSEEL will contact you at <strong>{formData.email}</strong> to confirm your personalized walkthrough.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="max-w-xl mx-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      placeholder="e.g. Ramesh"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-[#006FCC] focus:bg-white/15 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">Last Name *</label>
                    <input
                      type="text"
                      required
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      placeholder="e.g. Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-[#006FCC] focus:bg-white/15 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">Institutional Email *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="e.g. educator@school.edu.in"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-[#006FCC] focus:bg-white/15 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-[#006FCC] focus:bg-white/15 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">Institution / School *</label>
                    <input
                      type="text"
                      required
                      name="institution"
                      value={formData.institution}
                      onChange={handleFormChange}
                      placeholder="e.g. Delhi Public School"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-[#006FCC] focus:bg-white/15 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">Position / Role *</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#002B52] border border-white/20 text-white text-sm focus:outline-hidden focus:border-[#006FCC] transition"
                    >
                      <option value="Professor/Instructor">Professor / Instructor</option>
                      <option value="Dean/Director">Dean / Principal / Director</option>
                      <option value="Laboratory Based Faculty">Lab HOD / Faculty</option>
                      <option value="Educational Developer">Curriculum Developer</option>
                      <option value="IT Admin">IT / Academic Admin</option>
                      <option value="Student">Student / Researcher</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-sm sm:text-base font-['Montserrat',sans-serif] shadow-lg shadow-black/20 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Book Free Demo
                  </button>
                </div>

                <p className="text-[11px] text-slate-300/80 text-center pt-1">
                  By submitting, you agree to receive a tailored STEM demo invite. Zero spam guarantee.
                </p>
              </form>
            )}
          </section>

          {/* ── Section 5: The Four Pillars of Future STEM Learning ─────────────── */}
          <section className="mt-14 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              Four Pillars of Retention-Driven STEM Education
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center font-bold mb-3">
                  01
                </div>
                <h4 className="text-base font-bold text-[#003C6E] mb-1 font-['Montserrat',sans-serif]">Safe Failure &amp; Iteration</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Allows students to experiment, make errors, and reset without physical hazards or costly reagent waste. Mistakes become learning milestones rather than grade penalties.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center font-bold mb-3">
                  02
                </div>
                <h4 className="text-base font-bold text-[#003C6E] mb-1 font-['Montserrat',sans-serif]">Concept-to-Application Bridging</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Abstract equations come alive when students see molecular kinetics, electromagnetic waves, and chemical equilibria react dynamically to their direct inputs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center font-bold mb-3">
                  03
                </div>
                <h4 className="text-base font-bold text-[#003C6E] mb-1 font-['Montserrat',sans-serif]">Unrestricted Self-Paced Mastery</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students can run an experiment once, three times, or ten times until mastery is attained, decoupling practical proficiency from strict 50-minute bell schedules.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center font-bold mb-3">
                  04
                </div>
                <h4 className="text-base font-bold text-[#003C6E] mb-1 font-['Montserrat',sans-serif]">Equity &amp; Equal Bench Access</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Eliminates the common passive spectator phenomenon where three students huddle around one piece of lab gear. Every learner actively conducts every single step.
                </p>
              </div>
            </div>
          </section>

          {/* ── Section 6: Demographic & Methodology Summary ───────────────────── */}
          <section className="mt-14 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-lg font-bold text-[#003C6E] mb-3 font-['Montserrat',sans-serif]">
              Investigation Methodology &amp; Sample Demographics
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              The survey was fielded between April 14 and June 28, 2026. A total of 411 respondents completed the survey. Eligible respondents were individuals aged 18+ currently enrolled in an online or hybrid degree program in STEM disciplines at an accredited four-year college or university.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-base font-black text-[#003C6E]">411</div>
                <div className="text-[11px] text-slate-500 font-medium">Valid Sample</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-base font-black text-[#003C6E]">84%</div>
                <div className="text-[11px] text-slate-500 font-medium">Undergraduate</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-base font-black text-[#003C6E]">16%</div>
                <div className="text-[11px] text-slate-500 font-medium">Postgraduate</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-base font-black text-[#003C6E]">95%</div>
                <div className="text-[11px] text-slate-500 font-medium">Confidence Margin</div>
              </div>
            </div>
          </section>

          {/* ── Bottom Section: Final CTA ───────────────────────────────────────── */}
          <div className="mt-16 text-center space-y-4">
            <h3 className="text-2xl font-bold text-[#003C6E] font-['Montserrat',sans-serif]">
              Ready to Transform STEM Retention at Your Institution?
            </h3>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              Equip your educators with immersive, experiential virtual laboratories that turn hesitation into confidence.
            </p>
            <div>
              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-sm sm:text-base font-['Montserrat',sans-serif] shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Book Free Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* ═════════════════════════════════════════════════════════════════════════
          3. "BOOK FREE DEMO" MODAL (Clean, Instant Modal)
          ═════════════════════════════════════════════════════════════════════════ */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setDemoModalOpen(false);
                setFormSubmitted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer transition"
              aria-label="Close modal"
            >
              ✕
            </button>

            {formSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#003C6E] font-['Montserrat',sans-serif]">Demo Request Confirmed!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you, <strong>{formData.firstName || 'Educator'}</strong>. We have received your request. Our STEM academic team will connect with you at <strong>{formData.email}</strong> to schedule your personalized institutional demo.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDemoModalOpen(false);
                      setFormSubmitted(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#006FCC] text-white text-xs font-bold font-['Montserrat',sans-serif]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#006FCC] text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#006FCC]" />
                    <span>Free Institutional STEM Demo</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#003C6E] font-['Montserrat',sans-serif]">
                    Book Free Demo
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    See how experiential STEM simulations boost student retention and practical understanding.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      placeholder="First Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:border-[#006FCC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      placeholder="Last Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:border-[#006FCC]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="name@institution.edu"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:border-[#006FCC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:border-[#006FCC]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Institution Name *</label>
                    <input
                      type="text"
                      required
                      name="institution"
                      value={formData.institution}
                      onChange={handleFormChange}
                      placeholder="School / College Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:border-[#006FCC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Role / Position *</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:border-[#006FCC] bg-white"
                    >
                      <option value="Professor/Instructor">Professor / Instructor</option>
                      <option value="Dean/Director">Dean / Principal / Director</option>
                      <option value="Laboratory Based Faculty">Lab Faculty / HOD</option>
                      <option value="Educational Developer">Curriculum Developer</option>
                      <option value="IT Admin">IT / Academic Admin</option>
                      <option value="Student">Student / Researcher</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white text-sm font-bold font-['Montserrat',sans-serif] shadow-xs transition cursor-pointer"
                  >
                    Book Free Demo
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  Private &amp; Confidential. Verified institutional demo.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

    </article>
  );
}
