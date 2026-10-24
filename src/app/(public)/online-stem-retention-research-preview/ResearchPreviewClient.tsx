'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Share2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Users,
  Compass,
  Check,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Clock,
  Briefcase
} from 'lucide-react';

export default function ResearchPreviewClient() {
  const [copied, setCopied] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadEmail, setDownloadEmail] = useState('');
  const [downloadName, setDownloadName] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadEmail) return;
    setDownloaded(true);
    setTimeout(() => {
      // Simulate download trigger
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', 'CSEEL-Confidence-Effect-Research-Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 800);
  };

  return (
    <article className="min-h-screen bg-white text-slate-800 selection:bg-[#D6EDFF] selection:text-[#003C6E]">
      
      {/* ═════════════════════════════════════════════════════════════════════════
          1. HERO HEADER SECTION (Midnight Navy Deep Gradient matching Editorial Research Style)
          ═════════════════════════════════════════════════════════════════════════ */}
      <header className="relative bg-[#001C33] text-white pt-10 sm:pt-14 pb-16 sm:pb-24 overflow-hidden border-b border-white/10">
        
        {/* Subtle Background Glow & Radial Accents */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#006FCC]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-sky-600/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb strip */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#CCE2F5]/80 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/research" className="hover:text-white transition-colors">Research</Link>
            <span>/</span>
            <span className="text-white font-semibold truncate">The Confidence Effect</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left 7 Columns: Titles, Lead, Metadata & CTAs */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#85C4F7] text-xs font-bold tracking-wider uppercase font-['Montserrat',sans-serif]">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Research Report • Empirical Study</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-[44px] font-black text-white leading-[1.15] tracking-tight font-['Montserrat',sans-serif]">
                The #1 Predictor of STEM Retention Isn’t Flexibility. <br className="hidden sm:inline" />
                <span className="text-[#66A9E0]">It’s Confidence.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#CCE2F5] leading-relaxed font-normal font-['Lato',sans-serif]">
                Why Experiential Learning Has Become Essential to Student Retention, Career Readiness, &amp; the Future of STEM Education.
              </p>

              {/* Research Chips */}
              <div className="flex flex-wrap items-center gap-4 py-2 text-xs text-[#CCE2F5]/90 border-y border-white/10 font-medium">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sky-400 shrink-0" />
                  <span><strong>411</strong> STEM Students Surveyed</span>
                </div>
                <span className="text-white/30 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>April – June 2026 Study</span>
                </div>
                <span className="text-white/30 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>13-Page Investigation</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#report-content"
                  className="px-5 py-3 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white text-sm font-bold font-['Montserrat',sans-serif] shadow-md transition-all active:scale-[0.98] inline-flex items-center gap-2"
                >
                  <span>Read Full Report Below</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setDownloadModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-sm font-bold font-['Montserrat',sans-serif] transition-all active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Download Report (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
                  title="Share Article"
                  aria-label="Share Article"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

            </div>

            {/* Right 5 Columns: 3D Booklet Cover Graphic */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative group max-w-[340px] sm:max-w-[380px] w-full">
                
                {/* Glow ring under card */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-400/40 via-blue-600/30 to-indigo-500/40 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />
                
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#002244] border border-white/20">
                  <img
                    src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75ff0972d096cdd6372596_Thumbnail.jpg"
                    alt="The Confidence Effect Research Report Cover"
                    className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="p-4 bg-[#00182E] border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white font-['Montserrat',sans-serif]">RESEARCH BRIEF</div>
                      <div className="text-[11px] text-[#CCE2F5]/70">The Confidence Effect • 13 Pages</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDownloadModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold font-['Montserrat',sans-serif] transition"
                    >
                      Download
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════════════════
          2. MAIN REPORT BODY AREA
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

            {/* Editorial Pull Quote Banner */}
            <div className="my-8 p-6 sm:p-8 rounded-2xl bg-[#EDF5FA] border-l-4 border-[#006FCC] shadow-xs">
              <blockquote className="text-lg sm:text-xl font-bold text-[#003C6E] italic leading-snug font-['Montserrat',sans-serif]">
                “Today’s students are extraordinarily motivated, but they need learning experiences that fit the realities of their lives without compromising the quality of their education.”
              </blockquote>
              <div className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                — CSEEL National STEM Retention Investigation (2026)
              </div>
            </div>

            {/* Image 1: Motivated student at computer */}
            <figure className="my-8 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75e847ef54c09f8d196334_extraordinarily%20motivated.jpg"
                alt="Motivated student working remotely with headphones and digital lab modules"
                className="w-full h-auto object-cover"
              />
              <figcaption className="p-3 bg-slate-50 text-xs text-slate-500 text-center font-medium">
                Figure 1: Today’s remote and hybrid STEM learners balance demanding coursework with professional work shifts.
              </figcaption>
            </figure>
          </section>

          {/* ── Section 2: The New Challenge ─────────────────────────────────── */}
          <section className="mt-14 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              Yet expanding access introduces a new challenge.
            </h2>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              STEM has always been grounded in experience. Students do not become scientists by reading about experiments. They become scientists by designing them, testing hypotheses, making mistakes, interpreting results, and gradually building the confidence to apply what they’ve learned. That confidence, as this research suggests, may be one of the most important and overlooked predictors of persistence and retention in online STEM education.
            </p>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              To better understand what today’s online and hybrid STEM learners need to succeed, researchers surveyed <strong>411 students</strong> enrolled in four-year undergraduate and graduate online and hybrid STEM programs across universities. Conducted between April and June 2026, the study explored how learners choose programs, what keeps them engaged, what threatens persistence, what improves retention, and how experiential learning shapes confidence and career readiness.
            </p>

            {/* Central Institutional Question Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#002244] to-[#003C6E] text-white shadow-lg my-8">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-300 font-['Montserrat',sans-serif] mb-2">
                The Central Question for Higher Education
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug font-['Montserrat',sans-serif]">
                How do we preserve the flexibility learners need while delivering the hands-on experiences they expect and require?
              </h3>
            </div>

            {/* Image 2: Student working on inquiry questions */}
            <figure className="my-8 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75e99261df5a0d9a3f98e9_important%20question.jpg"
                alt="Student analyzing interactive telemetry"
                className="w-full h-auto object-cover"
              />
              <figcaption className="p-3 bg-slate-50 text-xs text-slate-500 text-center font-medium">
                Figure 2: Preserving educational flexibility without sacrificing practical scientific rigor.
              </figcaption>
            </figure>
          </section>

          {/* ── Section 3: Students Are Investing in Their Future ─────────────── */}
          <section className="mt-14 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              Students Are Investing in Their Future
            </h2>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Career advancement has become the primary driver behind STEM enrollment decisions. Nearly every student surveyed <strong>(94%)</strong> said they selected an online or hybrid STEM program because they believed it would help advance their career. At the same time, flexibility remains essential, with more than 4 in 5 students saying the ability to balance education around their lives influenced their decision. Personal passion for STEM also remains remarkably strong <strong>(70%)</strong>, suggesting learners are motivated by both professional aspirations and genuine curiosity.
            </p>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Students willingly accept demanding coursework because they believe a STEM degree represents higher earning potential <strong>(67%)</strong>, career advancement <strong>(69%)</strong>, and job stability <strong>(63%)</strong>. They are investing significant time, money, and effort because they expect the experience to prepare them for the workforce.
            </p>

            {/* Four Donut Stat Rings ("What Students Are Up Against") */}
            <div className="my-10 p-6 sm:p-8 rounded-2xl bg-[#F7F8F8] border border-slate-200">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-xs font-bold text-[#006FCC] uppercase tracking-wider font-['Montserrat',sans-serif]">Survey Findings</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#003C6E] mt-1 font-['Montserrat',sans-serif]">
                  What Students Are Up Against
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Today’s STEM learners are balancing competing responsibilities while wondering whether an online education can truly prepare them for what’s ahead.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                
                {/* 81% Card */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#006FCC] flex items-center justify-center font-black text-xl text-[#003C6E] mb-3">
                    81%
                  </div>
                  <p className="text-xs text-slate-700 font-semibold leading-snug">
                    struggle balancing coursework with work &amp; personal responsibilities
                  </p>
                </div>

                {/* 73% Card 1 */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#006FCC] flex items-center justify-center font-black text-xl text-[#003C6E] mb-3">
                    73%
                  </div>
                  <p className="text-xs text-slate-700 font-semibold leading-snug">
                    continue working while earning their degree
                  </p>
                </div>

                {/* 73% Card 2 */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-600 flex items-center justify-center font-black text-xl text-[#003C6E] mb-3">
                    73%
                  </div>
                  <p className="text-xs text-slate-700 font-semibold leading-snug">
                    entered their program concerned it would be less engaging
                  </p>
                </div>

                {/* 71% Card */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-600 flex items-center justify-center font-black text-xl text-[#003C6E] mb-3">
                    71%
                  </div>
                  <p className="text-xs text-slate-700 font-semibold leading-snug">
                    worried it would be less effective than traditional learning
                  </p>
                </div>

              </div>
            </div>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Taken together, these findings paint a clear picture: today’s students are not looking for an easier education. They are looking for an education they can realistically complete and that will prepare them for a future career. They need institutions to show them a path forward.
            </p>
          </section>

          {/* ── Section 4: The Path to a STEM Career Shouldn’t Feel Out of Reach ─── */}
          <section className="mt-14 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              The Path to a STEM Career Shouldn’t Feel Out of Reach
            </h2>

            {/* Maya's Narrative Container */}
            <div className="p-6 sm:p-7 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider font-['Montserrat',sans-serif] mb-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Learner Profile: Maya, 34</span>
              </div>
              <p className="text-slate-800 text-[15.5px] leading-relaxed font-['Lato',sans-serif]">
                Maya is 34 years old, works full time, and is pursuing an online biology degree after years away from school. She studies after her children go to bed, completes assignments during lunch breaks, and spends weekends catching up on coursework. She is exactly the type of student online STEM programs were designed to serve. But when laboratory experiences require travel to campus or are limited to a fixed schedule, the balance she has worked so hard to achieve begins to unravel. Missing a lab is more than missing a class. It can mean falling behind in an entire course.
              </p>
            </div>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Maya’s story is fictional, but the challenges she faces are not. More than four in five students <strong>(81%)</strong> say balancing coursework with work and personal responsibilities is difficult. Among fully online STEM students, <strong>40%</strong> have questioned whether it is realistic to continue their program because of outside responsibilities. More than half <strong>(54%)</strong> of those considering leaving cite work-life balance as a primary reason.
            </p>

            <div className="p-6 rounded-2xl bg-[#EDF5FA] border-l-4 border-[#006FCC] italic text-lg font-bold text-[#003C6E] font-['Montserrat',sans-serif]">
              “Students rarely lose motivation overnight. More often, they lose confidence gradually when they no longer feel prepared to succeed.”
            </div>
          </section>

          {/* ── Section 5: What’s Driving Student Persistence? ───────────────── */}
          <section className="mt-14 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              Yet Time Is Only Part of the Challenge
            </h2>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              STEM education depends on experience. When students have limited opportunities to practice laboratory techniques, apply scientific concepts, or revisit complex procedures, confidence begins to erode. More than one-third of students say their program does not provide enough experiential learning opportunities. <strong>41% report that the lack of experiential learning has made them question whether they want to finish their program.</strong> Nearly eight in ten <strong>(78%)</strong> say that without experiential learning experiences, they feel less prepared for their future careers.
            </p>

            {/* 5 Persistence Metrics Horizontal Grid */}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <div className="text-2xl font-black text-[#006FCC]">79%</div>
                <div className="text-[11.5px] text-slate-600 mt-1 leading-snug">
                  judge program quality based on meaningful hands-on experiences
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <div className="text-2xl font-black text-amber-600">41%</div>
                <div className="text-[11.5px] text-slate-600 mt-1 leading-snug">
                  questioned finishing because of insufficient experiential learning
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <div className="text-2xl font-black text-slate-700">40%</div>
                <div className="text-[11.5px] text-slate-600 mt-1 leading-snug">
                  questioned continuing because of outside responsibilities
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <div className="text-2xl font-black text-rose-600">54%</div>
                <div className="text-[11.5px] text-slate-600 mt-1 leading-snug">
                  cite work-life balance as a primary reason for considering leaving
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <div className="text-2xl font-black text-indigo-600">31%</div>
                <div className="text-[11.5px] text-slate-600 mt-1 leading-snug">
                  have deep concerns about their workplace career readiness
                </div>
              </div>

            </div>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              The consequence is not simply frustration. It is self-doubt. While work-life balance and competing responsibilities are the most visible barriers, the research points to a less obvious challenge: when students begin questioning whether they’re developing the skills needed for future careers, they often begin questioning whether they can succeed in the program itself.
            </p>
          </section>

          {/* ── Section 6: What Students Need to Succeed ──────────────────────── */}
          <section className="mt-14 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              What Students Need to Succeed
            </h2>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Throughout this research, students consistently linked meaningful experiential learning with feeling more prepared, more capable, and more confident in their ability to succeed. Students who believe they are developing real-world skills are more likely to stay engaged, remain committed to their program, and feel prepared for the careers they hope to pursue.
            </p>

            {/* What Matters Most Highlight Grid */}
            <div className="my-8 p-6 sm:p-8 rounded-2xl bg-[#001C33] text-white">
              <h3 className="text-xl font-bold text-white mb-6 font-['Montserrat',sans-serif]">
                What Matters Most to Online &amp; Hybrid STEM Students:
              </h3>

              <div className="space-y-4">
                
                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black text-emerald-400 shrink-0 w-16">97%</div>
                  <div className="text-sm text-[#CCE2F5] leading-snug">
                    are more likely to remain committed to their program when coursework clearly connects to real-world skills.
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black text-sky-400 shrink-0 w-16">93%</div>
                  <div className="text-sm text-[#CCE2F5] leading-snug">
                    say experiential learning makes completing a STEM program substantially more valuable to employers.
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black text-sky-400 shrink-0 w-16">91%</div>
                  <div className="text-sm text-[#CCE2F5] leading-snug">
                    believe hands-on practice is absolutely vital for preparing for a modern STEM career.
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black text-amber-400 shrink-0 w-16">84%</div>
                  <div className="text-sm text-[#CCE2F5] leading-snug">
                    say more experiential learning opportunities would increase their motivation to pursue a STEM profession.
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black text-amber-400 shrink-0 w-16">74%</div>
                  <div className="text-sm text-[#CCE2F5] leading-snug">
                    say access to virtual labs would directly increase their motivation to complete their STEM degree.
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ── Section 7: The Future of Online & Hybrid STEM Learning ─────────── */}
          <section className="mt-14 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              The Future of Online &amp; Hybrid STEM Learning
            </h2>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              The strongest STEM programs won’t simply be more flexible. They’ll provide more opportunities for students to practice, make mistakes, and apply what they’ve learned. Virtual labs are one example of how institutions are responding to that challenge. In hybrid programs, virtual labs complement traditional laboratory instruction with interactive digital experiences. They allow students to prepare before entering a physical lab, reinforce concepts afterward, and revisit complex procedures whenever they need additional practice. Rather than replacing physical labs, they help extend learning beyond the limited time students spend in them.
            </p>

            {/* 4 Pillars of Future STEM Learning */}
            <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-6 rounded-2xl bg-[#EDF5FA] border border-[#d3e3fd]">
                <div className="text-3xl font-black text-[#006FCC] mb-2 font-['Montserrat',sans-serif]">93%</div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Employer Valuation</h4>
                <p className="text-xs text-slate-600">
                  Hands-on practice makes completing a STEM program more valuable to hiring managers and industry employers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#EDF5FA] border border-[#d3e3fd]">
                <div className="text-3xl font-black text-[#006FCC] mb-2 font-['Montserrat',sans-serif]">92%</div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Safe Failure &amp; Mastery</h4>
                <p className="text-xs text-slate-600">
                  Virtual labs provide a zero-risk environment to test hypotheses and fail safely before real-world physical bench work.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#EDF5FA] border border-[#d3e3fd]">
                <div className="text-3xl font-black text-[#006FCC] mb-2 font-['Montserrat',sans-serif]">83%</div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Repeatable Practice</h4>
                <p className="text-xs text-slate-600">
                  Students would stay more engaged if they could revisit and repeat learning experiences on their own schedule.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#EDF5FA] border border-[#d3e3fd]">
                <div className="text-3xl font-black text-emerald-600 mb-2 font-['Montserrat',sans-serif]">24% Surge</div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Retention Multiplier</h4>
                <p className="text-xs text-slate-600">
                  Students who feel confident in their lab practical skills are significantly more likely to persist and complete their degree.
                </p>
              </div>

            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-[#002F56] text-white my-8 text-center">
              <h3 className="text-lg sm:text-xl font-bold font-['Montserrat',sans-serif] leading-snug">
                “The future of online and hybrid STEM education isn’t defined by where students learn. It’s defined by how often they have opportunities to practice and apply what they’re learning.”
              </h3>
            </div>
          </section>

          {/* ── Section 8: When the Physical Lab Is Not an Option ──────────────── */}
          <section className="mt-14 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              When the Physical Lab Is Not an Option
            </h2>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              For fully online institutions, the challenge is different. Without access to campus laboratory facilities, programs must find ways to provide meaningful experiential learning wherever students are, without creating additional barriers to participation. Historically, many programs relied on at-home lab kits. While kits provide hands-on experiences, they introduce significant logistical hurdles: shipping delays, missing reagents, storage issues, and the safety risks of conducting chemical reactions in home kitchens.
            </p>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              By providing interactive, experiential learning through digital devices, experiential simulations give students opportunities to investigate scientific concepts, practice techniques, and learn from mistakes without requiring physical consumables. Students can learn on their own time, repeat experiments as often as needed, and arrive at exams thoroughly prepared.
            </p>

            {/* Stacked Percentage Impact */}
            <div className="my-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="font-bold text-[#003C6E] text-base font-['Montserrat',sans-serif]">
                Measurable Impact of Experiential Learning on Coursework:
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 font-medium">Helps confirm understanding of theoretical material</span>
                  <span className="font-black text-[#006FCC] ml-2">88%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#006FCC] h-full rounded-full" style={{ width: '88%' }} />
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-slate-700 font-medium">Repeating lab exercises improves conceptual understanding</span>
                  <span className="font-black text-[#006FCC] ml-2">88%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#006FCC] h-full rounded-full" style={{ width: '88%' }} />
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-slate-700 font-medium">Repetition builds personal confidence in science</span>
                  <span className="font-black text-[#006FCC] ml-2">88%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#006FCC] h-full rounded-full" style={{ width: '88%' }} />
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-slate-700 font-medium">Felt significantly more prepared for graded coursework</span>
                  <span className="font-black text-emerald-600 ml-2">85%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '85%' }} />
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-slate-700 font-medium">Felt more engaged and motivated during the semester</span>
                  <span className="font-black text-emerald-600 ml-2">77%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '77%' }} />
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 9: The Confidence Effect ──────────────────────────────── */}
          <section className="mt-14 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003C6E] font-['Montserrat',sans-serif] tracking-tight">
              Confidence: The Least Talked About Outcome With the Most Impact
            </h2>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              Throughout this research, one message has remained remarkably consistent: students want to build practical skills, connect coursework to real-world applications, and graduate with confidence in their ability to succeed. When students have opportunities to practice, revisit concepts, and apply their knowledge in authentic settings, they report feeling more prepared, more confident in their abilities, and more committed to continuing their STEM education.
            </p>

            {/* The Confidence Matrix Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#006FCC] flex items-center justify-center shrink-0 font-black text-xl">
                  60%
                </div>
                <div>
                  <h4 className="font-bold text-[#003C6E] text-sm">Laboratory Competency</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    More likely to report high confidence in their physical laboratory and apparatus skills.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-black text-xl">
                  56%
                </div>
                <div>
                  <h4 className="font-bold text-[#003C6E] text-sm">Career Application</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    More likely to say they feel very confident applying those STEM skills in future industry careers.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-black text-xl">
                  74%
                </div>
                <div>
                  <h4 className="font-bold text-[#003C6E] text-sm">Persistence Motivation</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Report access to experiential virtual labs directly increased their motivation to persist in STEM.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-black text-xl">
                  84%
                </div>
                <div>
                  <h4 className="font-bold text-[#003C6E] text-sm">Enrollment Magnet</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Say knowing a program offers interactive virtual labs makes that institution more appealing.
                  </p>
                </div>
              </div>

            </div>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-['Lato',sans-serif]">
              The future of STEM education is not simply about expanding access. It is about ensuring every student has the opportunity to build the confidence, competence, and practical experience needed to thrive in modern science and technology.
            </p>
          </section>

          {/* ── Section 10: Survey Demographics & Methodology (Page 13 of PDF) ─── */}
          <section className="mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-[#003C6E] font-['Montserrat',sans-serif] mb-4">
              Survey Methodology &amp; Demographics
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              This report is based on a survey of 411 undergraduate and graduate students enrolled in online or hybrid STEM programs at 4-year universities or graduate schools across North America and international academic partners. Conducted between April 24 and June 9, 2026, the study carries a 95% confidence level with a ±4.8% margin of error.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Respondents</span>
                <span className="text-slate-600">411 STEM Learners</span>
                <span className="text-slate-500 block text-[11px] mt-1">74% Undergrad • 26% Grad</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 block">Program Format</span>
                <span className="text-slate-600">71% Hybrid</span>
                <span className="text-slate-500 block text-[11px] mt-1">29% Fully Online</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 block">Employment Status</span>
                <span className="text-slate-600">73% Employed</span>
                <span className="text-slate-500 block text-[11px] mt-1">37% Full-Time • 36% Part-Time</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 block">Caregiving</span>
                <span className="text-slate-600">36% Caregivers</span>
                <span className="text-slate-500 block text-[11px] mt-1">22% Children • 8% Adults</span>
              </div>
            </div>

            {/* Academic References */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
              <div className="font-bold text-slate-700 uppercase tracking-wider mb-2">Research References:</div>
              <div>1. What’s Behind the 2026 College Enrollment Surge? Higher Education Insights Report.</div>
              <div>2. Higher Ed Enrollment Continues Its Comeback: National Student Clearinghouse Research Center (2025-2026).</div>
              <div>3. Predictions for 2026: What’s Next for Graduate and Online STEM Enrollment, EAB Academic Research.</div>
              <div>4. Kolb’s Experiential Learning Theory &amp; Virtual Laboratory Integration, CSEEL Empirical Studies.</div>
            </div>
          </section>

          {/* ── Section 11: Final Conversion Banner ────────────────────────────── */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#001C33] via-[#002F56] to-[#003C6E] text-white shadow-xl text-center relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <span className="px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-bold tracking-wider uppercase font-['Montserrat',sans-serif]">
                Institutional Advisory
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-['Montserrat',sans-serif]">
                When Students Feel Prepared, Institutions Become Stronger
              </h3>
              <p className="text-sm sm:text-base text-[#CCE2F5] leading-relaxed">
                Discover how CSEEL’s experiential learning labs and curriculum-aligned simulations help schools and universities increase student retention, build genuine scientific confidence, and prepare graduates for future careers.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/demo"
                  className="px-6 py-3 rounded-xl bg-white text-[#001C33] hover:bg-slate-100 font-bold text-sm font-['Montserrat',sans-serif] shadow-md transition-all active:scale-[0.98]"
                >
                  Book an Institutional Demo
                </Link>
                <Link
                  href="/virtual-lab"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm font-['Montserrat',sans-serif] transition"
                >
                  Explore Virtual Labs
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ═════════════════════════════════════════════════════════════════════════
          3. DOWNLOAD PDF MODAL
          ═════════════════════════════════════════════════════════════════════════ */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <button
              type="button"
              onClick={() => {
                setDownloadModalOpen(false);
                setDownloaded(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              aria-label="Close modal"
            >
              ✕
            </button>

            {downloaded ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#003C6E] font-['Montserrat',sans-serif]">Report Ready!</h3>
                <p className="text-xs text-slate-600">
                  Your PDF report download has begun. A copy has also been registered for <strong>{downloadEmail}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDownloadModalOpen(false);
                    setDownloaded(false);
                  }}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#006FCC] text-white text-xs font-bold font-['Montserrat',sans-serif]"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-[#006FCC] text-xs font-bold mb-2">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Free 13-Page PDF Report</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#003C6E] font-['Montserrat',sans-serif]">
                    Download The Confidence Effect
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Get the complete survey data, statistical charts, and institutional persistence strategies.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={downloadName}
                    onChange={(e) => setDownloadName(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Sharma"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:border-[#006FCC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
                  <input
                    type="email"
                    required
                    value={downloadEmail}
                    onChange={(e) => setDownloadEmail(e.target.value)}
                    placeholder="e.g. educator@school.edu.in"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:border-[#006FCC]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white text-sm font-bold font-['Montserrat',sans-serif] shadow-xs transition"
                >
                  Download PDF Report Now
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Zero spam. Published under CSEEL Open Academic Research License.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

    </article>
  );
}
