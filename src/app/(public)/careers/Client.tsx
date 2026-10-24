'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, DollarSign, Sparkles, Search, Filter,
  CheckCircle2, ArrowRight, Upload, FileText, Check, X, Building2,
  Users, Award, Heart, Laptop, ShieldCheck, ChevronRight, Send, Star,
  BookOpen, Download, TrendingUp, Zap, HelpCircle, Play
} from 'lucide-react';
import PageTransition from "@/components/shared/PageTransition";
import { M3Button, M3IconButton } from '@/components/google-ui';
import { trackCseelEvent } from '@/components/analytics/AnalyticsScripts';

interface CseelCareerJob {
  id: string;
  title: string;
  department: "Curriculum & Pedagogy" | "Interactive STEM Software & Live Labs" | "Atal Tinkering & Robotics" | "Academic Growth & Partnerships";
  roleType: "Full-Time" | "Hybrid" | "Remote" | "On-Campus";
  location: string;
  experience: string;
  salary: string;
  openings: number;
  isUrgent?: boolean;
  postedDate: string;
  shortDescription: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  skills: string[];
}

const CSEEL_CAREERS_DATA: CseelCareerJob[] = [
  {
    id: "cseel-curriculum-lead",
    title: "Senior STEAM Curriculum Specialist (Physics & Chemistry)",
    department: "Curriculum & Pedagogy",
    roleType: "Full-Time",
    location: "New Delhi (Hybrid / On-Site Lab)",
    experience: "3 - 6 Years",
    salary: "₹10,00,000 – ₹16,00,000 PA",
    openings: 2,
    isUrgent: true,
    postedDate: "2 days ago",
    shortDescription: "Lead the design of hands-on, inquiry-based practical science experiments, teacher activity manuals, and NEP-2020 competency frameworks for Grades 6 to 12.",
    responsibilities: [
      "Author experiential physics and chemistry lab activity blueprints aligning with CBSE, ICSE, and IB criteria.",
      "Design safe, low-cost apparatus kits and verify physical experiments before national school rollouts.",
      "Collaborate closely with live lab & interactive software engineers to translate real physics apparatus into WebGL interactive practicals.",
      "Conduct masterclass teacher training workshops across partner schools in Delhi-NCR, Bangalore, and Bhubaneswar."
    ],
    requirements: [
      "Master's degree (M.Sc. / M.Ed. / B.Tech) in Physics, Chemistry, or Science Education.",
      "3+ years of experience in STEM curriculum writing, textbook development, or teaching at premier institutions.",
      "Deep understanding of NEP-2020 pedagogical reforms and experimental inquiry methodologies.",
      "Strong communication and scientific writing skills."
    ],
    perks: [
      "Work directly with former ISRO/IISc scientific advisory mentors.",
      "Generous prototype testing & science book purchase allowance.",
      "Comprehensive medical health insurance for self & dependents.",
      "Flexible hybrid work culture."
    ],
    skills: ["NEP-2020 Framework", "Experimental Physics", "Green Chemistry", "Curriculum Design", "Teacher Training"]
  },
  {
    id: "cseel-3d-engineer",
    title: "Senior 3D WebGL & Interactive Simulation Engineer",
    department: "Interactive STEM Software & Live Labs",
    roleType: "Full-Time",
    location: "Remote (Pan-India) / Bengaluru",
    experience: "3 - 7 Years",
    salary: "₹14,00,000 – ₹22,00,000 PA",
    openings: 2,
    isUrgent: true,
    postedDate: "3 days ago",
    shortDescription: "Architect interactive, real-time 3D physics and chemistry laboratory simulations using Three.js, React-Three-Fiber, Next.js, and WebGL raycasting.",
    responsibilities: [
      "Build high-performance, browser-based 3D laboratory apparatus (optical benches, titrators, pendulums, particle accelerators).",
      "Implement realistic physics kinematics, ray optics refraction, fluid dynamics, and molecular kinematics shaders.",
      "Optimize rendering pipelines for smooth 60 FPS performance on lower-end school Chromebooks and mobile tablets.",
      "Collaborate with science SMEs to ensure mathematical accuracy in practical experiment calculations."
    ],
    requirements: [
      "Strong proficiency in JavaScript/TypeScript, React/Next.js, Three.js, React-Three-Fiber, and GLSL shaders.",
      "Solid mathematical foundation in vector math, kinematics, and raycasting mechanics.",
      "Experience with 3D modeling pipelines (Blender, GLTF/GLB optimization, Draco compression).",
      "Track record of building complex interactive web applications or gamified 3D products."
    ],
    perks: [
      "100% Remote-first work with top-tier M3 Max / RTX workstation setup allowance.",
      "Annual conference & technical certification sponsorship.",
      "Stock appreciation options (ESOPs).",
      "Flexible working hours."
    ],
    skills: ["Three.js", "React-Three-Fiber", "TypeScript", "Next.js", "GLSL Shaders", "WebGL", "Blender"]
  },
  {
    id: "cseel-robotics-mentor",
    title: "Chief Atal Tinkering Lab & Robotics Mentor",
    department: "Atal Tinkering & Robotics",
    roleType: "Full-Time",
    location: "Delhi-NCR / Bhubaneswar (Campus Lab)",
    experience: "2 - 5 Years",
    salary: "₹8,00,000 – ₹13,00,000 PA",
    openings: 1,
    isUrgent: false,
    postedDate: "5 days ago",
    shortDescription: "Oversee NITI Aayog ATL incubation setups, coach student robotics cohorts in Arduino/Raspberry Pi maker projects, and lead national science hackathons.",
    responsibilities: [
      "Train students and teachers on 3D printing, laser cutting, drone telemetry, and IoT sensor circuits.",
      "Mentor student innovator teams for national events like CBSE Science Exhibition, IRIS National Fair, and Olympiads.",
      "Curate hands-on maker challenges, electronics tinkering kits, and AI vision sensor modules.",
      "Maintain laboratory equipment inventory and safety protocol standards across ATL hubs."
    ],
    requirements: [
      "B.Tech / B.E in Electronics, Robotics, Mechatronics, or Computer Science.",
      "Hands-on mastery of Arduino IDE, ESP32, Python, 3D CAD modeling, and soldering.",
      "Prior experience conducting robotics bootcamps or managing Atal Tinkering Labs in schools.",
      "High energy, enthusiasm, and passion for mentoring young school innovators."
    ],
    perks: [
      "Complete access to high-end prototyping labs (industrial 3D printers, CNCs, laser cutters).",
      "Travel allowance for national science competitions and school hackathons.",
      "Performance incentives on school lab ratings.",
      "Health & accidental insurance coverage."
    ],
    skills: ["Arduino", "Raspberry Pi", "IoT", "3D Printing", "Robotics", "Python", "ATL Guidelines"]
  },
  {
    id: "cseel-biotech-specialist",
    title: "Molecular Biology & Biotechnology Content Specialist",
    department: "Curriculum & Pedagogy",
    roleType: "Full-Time",
    location: "Bengaluru / Hybrid",
    experience: "2 - 5 Years",
    salary: "₹9,00,000 – ₹14,00,000 PA",
    openings: 1,
    isUrgent: false,
    postedDate: "1 week ago",
    shortDescription: "Author cutting-edge genetics, microbiology, and plant physiology experiential practical protocols and interactive digital histology modules.",
    responsibilities: [
      "Develop safe bio-experiments for DNA extraction, gel electrophoresis, microscope slide preparation, and enzyme kinetics.",
      "Author detailed student lab logbooks and interactive hands-on biology practical guides.",
      "Review interactive 3D anatomical models and microbiological cell interactive practicals for pedagogical accuracy.",
      "Coordinate with partner biotechnology labs for student internships and live workshop sessions."
    ],
    requirements: [
      "M.Sc. or Ph.D. in Molecular Biology, Biotechnology, Genetics, or Life Sciences.",
      "Demonstrated experience in academic practical pedagogy or educational content development.",
      "Familiarity with standard BSL-1 laboratory safety guidelines and school biology curriculum.",
      "Passion for making life sciences interactive and visually captivating."
    ],
    perks: [
      "Research grant support and patent filing sponsorship.",
      "Collaborative ecosystem with leading national biology research centers.",
      "Flexible hybrid working options.",
      "Comprehensive medical benefits."
    ],
    skills: ["Molecular Biology", "Biotechnology", "Genetics", "Histology", "NEP-2020 Bio-Practicals"]
  },
  {
    id: "cseel-fullstack-dev",
    title: "Full-Stack Platform Engineer (Next.js & Supabase)",
    department: "Interactive STEM Software & Live Labs",
    roleType: "Full-Time",
    location: "Remote / New Delhi",
    experience: "3 - 6 Years",
    salary: "₹12,00,000 – ₹20,00,000 PA",
    openings: 2,
    isUrgent: true,
    postedDate: "4 days ago",
    shortDescription: "Scale the CSEEL EduNetwork ecosystem, institution job portal engines, real-time student experiment assessments, and school analytics dashboards.",
    responsibilities: [
      "Develop scalable full-stack features using Next.js 14 App Router, TypeScript, Tailwind CSS, and Supabase / PostgreSQL.",
      "Architect fast, responsive UI components with clean server/client separation and real-time WebSockets.",
      "Build robust role-based access control (RBAC) for Schools, Teachers, Students, and Administrators.",
      "Optimize SEO, core web vitals, and database query performance across all dynamic routes."
    ],
    requirements: [
      "3+ years of full-stack production experience with React, Next.js, Node.js, and SQL databases.",
      "Strong command of TypeScript, state management, and modern CSS frameworks (Tailwind).",
      "Experience with authentication, Supabase Row-Level Security (RLS), and REST/GraphQL APIs.",
      "Clean code mindset, automated testing, and CI/CD deployment proficiency."
    ],
    perks: [
      "Top-tier compensation with annual bonuses and equity upside.",
      "Home office setup reimbursement & high-speed internet allowance.",
      "Generous paid time off (PTO) and wellness leave.",
      "Rapid career acceleration in a high-growth STEAM edtech venture."
    ],
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase", "REST APIs"]
  },
  {
    id: "cseel-field-trainer",
    title: "Regional STEAM Lab Operations & Master Trainer",
    department: "Atal Tinkering & Robotics",
    roleType: "On-Campus",
    location: "Mumbai / Pune / Delhi-NCR",
    experience: "1 - 4 Years",
    salary: "₹6,00,000 – ₹9,50,000 PA",
    openings: 2,
    isUrgent: false,
    postedDate: "6 days ago",
    shortDescription: "Conduct on-site science lab audits, deliver lively hands-on practical masterclasses for school educators, and ensure optimal lab kit readiness.",
    responsibilities: [
      "Visit partner schools to conduct immersive hands-on science workshops for teachers and students.",
      "Perform periodic calibration and maintenance checks on physics, chemistry, and biology apparatus.",
      "Collect teacher feedback and assist in the deployment of new experiment upgrade modules.",
      "Inspire students through high-energy live science stage demonstrations and discovery days."
    ],
    requirements: [
      "Bachelor's or Master's degree in Science (B.Sc. / B.Ed. / B.Tech).",
      "Charismatic public presentation and teacher facilitation skills.",
      "Willingness to travel locally and regionally to school campuses.",
      "Strong fundamentals in experimental school science concepts."
    ],
    perks: [
      "Full regional travel and daily accommodation allowances.",
      "Quarterly incentive bonus based on school satisfaction scores.",
      "Fast-track growth to Regional Operations Manager.",
      "Health and personal accident insurance."
    ],
    skills: ["Science Demonstrations", "Teacher Training", "Lab Operations", "Public Speaking", "School Relations"]
  },
  {
    id: "cseel-partnerships-lead",
    title: "Institutional Partnerships & School Onboarding Lead",
    department: "Academic Growth & Partnerships",
    roleType: "Hybrid",
    location: "New Delhi / Gurugram (Delhi-NCR)",
    experience: "3 - 7 Years",
    salary: "₹11,00,000 – ₹18,00,000 PA + Incentives",
    openings: 1,
    isUrgent: false,
    postedDate: "1 week ago",
    shortDescription: "Drive adoption of CSEEL experiential labs, EduNetwork memberships, and ATL turnkey setups across top CBSE, ICSE, and IB school groups.",
    responsibilities: [
      "Engage with School Principals, Trustees, and Academic Directors to present CSEEL's NEP-2020 lab solutions.",
      "Lead high-value institutional contract negotiations, lab upgrade proposals, and onboarding roadmaps.",
      "Represent CSEEL at national educational leadership summits, FICCI EdTech conferences, and school expos.",
      "Manage client success relationships ensuring high renewal rates and multi-campus rollouts."
    ],
    requirements: [
      "Proven 3+ years track record in B2B K-12 institutional sales, edtech school onboarding, or educational publishing.",
      "Strong network and relationships with school principals and decision-makers across Delhi-NCR or North India.",
      "Exceptional pitch, presentation, and consultative solution-selling abilities.",
      "Self-driven, target-oriented mindset with high integrity."
    ],
    perks: [
      "Lucrative uncapped quarterly performance incentives on school sign-ups.",
      "Company car / conveyance allowance for institutional campus visits.",
      "Executive leadership coaching and networking opportunities.",
      "Comprehensive medical health insurance."
    ],
    skills: ["B2B School Sales", "Institutional Partnerships", "Client Negotiation", "K-12 Network", "EdTech Growth"]
  },
  {
    id: "cseel-physics-incharge",
    title: "Senior Physics & Ray Optics Lab In-Charge",
    department: "Curriculum & Pedagogy",
    roleType: "On-Campus",
    location: "Rewari / Haryana Campus Lab",
    experience: "2 - 5 Years",
    salary: "₹7,00,000 – ₹11,00,000 PA",
    openings: 1,
    isUrgent: true,
    postedDate: "Just now",
    shortDescription: "Direct our flagship Physics & Optics laboratory, overseeing precision ray benches, laser diffraction apparatus, and senior secondary student cohorts.",
    responsibilities: [
      "Calibrate precision spectrometers, optical benches, cathode ray tubes, and galvanometer stations.",
      "Conduct live experimental physics practicals for Class 11-12 visiting student batches.",
      "Ensure 100% SARAS & CBSE composite science laboratory safety standards.",
      "Author SOPs and troubleshooting manuals for lab apparatus maintenance."
    ],
    requirements: [
      "M.Sc. in Physics or Applied Optics / Electronics.",
      "Hands-on experience in high-school or university physical laboratories.",
      "Rigorous attention to experimental protocol, precision, and student safety.",
      "Fluent communication in Hindi and English."
    ],
    perks: [
      "Campus accommodation facility available.",
      "Full medical health insurance.",
      "Annual apparatus prototyping stipend.",
      "Direct mentorship from senior physics academicians."
    ],
    skills: ["Ray Optics", "Wave Mechanics", "Spectrometry", "Lab Safety SOPs", "CBSE Practicals"]
  }
];

export default function CareersClient() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<CseelCareerJob | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [applyingJob, setApplyingJob] = useState<CseelCareerJob | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  // Application Form State
  const [applyForm, setApplyForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentCity: "",
    experience: "3+ Years",
    portfolioUrl: "",
    coverNote: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Filter Jobs
  const filteredJobs = CSEEL_CAREERS_DATA.filter((job) => {
    const matchesDept = selectedDepartment === "All" || job.department === selectedDepartment;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  const handleOpenApply = (job?: CseelCareerJob) => {
    setApplyingJob(job || {
      id: "general-application",
      title: "General / Spontaneous STEAM Application",
      department: "Curriculum & Pedagogy",
      roleType: "Full-Time",
      location: "India (Hybrid / Remote / On-Site)",
      experience: "All Levels",
      salary: "Competitive Industry Standard",
      openings: 1,
      postedDate: "Ongoing",
      shortDescription: "General spontaneous application for educators, engineers, 3D artists, and STEM mentors.",
      responsibilities: [],
      requirements: [],
      perks: [],
      skills: []
    });
    setIsApplyModalOpen(true);
    setSubmitSuccess(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    trackCseelEvent('job_application_submitted', {
      job_title: applyingJob?.title,
      department: applyingJob?.department,
      city: applyForm.currentCity,
    });
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  return (
    <PageTransition>
      {/* ── GOOGLE FONTS: MONTSERRAT & LATO (MATCHING LABSTER TYPOGRAPHY) ─────── */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap"
      />
      <style>{`
        .careers-page-wrap {
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .careers-page-wrap p,
        .careers-page-wrap li,
        .careers-page-wrap input,
        .careers-page-wrap select,
        .careers-page-wrap textarea,
        .careers-page-wrap label,
        .careers-page-wrap .font-body {
          font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>

      <div className="min-h-screen bg-[#f8fafd] pb-20 select-none careers-page-wrap">

        {/* ── 1. LABSTER-STYLE HERO BANNER (WHERE PASSION MEETS PURPOSE) ────────── */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-r from-[#D6EDFF] via-[#E8F6FE] to-[#F2FDF9] border-b border-[#D6EDFF]/80">
          {/* Subtle Decorative Background Ring */}
          <div className="absolute right-[-80px] bottom-[-80px] md:right-[-40px] md:bottom-[-40px] pointer-events-none select-none opacity-70 z-0">
            <svg width="449" height="449" viewBox="0 0 449 449" fill="none">
              <circle cx="224" cy="224" r="223.5" stroke="#BCE3FF" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              
              {/* Left Column: Text & CTA */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-block text-[11px] sm:text-xs font-bold text-[#006FCC] uppercase tracking-[0.2em]">
                  CAREERS AT CSEEL
                </div>
                
                <h1
                  style={{ color: '#003c6e' }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.15]"
                >
                  Where Passion Meets Purpose
                </h1>

                <p className="text-base sm:text-lg text-slate-700 max-w-xl leading-relaxed font-normal">
                  Dive into an innovative, mission-driven role that will help revolutionize learning. We’re breaking barriers with immersive tech to captivate learners and improve lives.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="#open-positions"
                    className="inline-flex items-center justify-center px-7 py-3.5 bg-[#006FCC] hover:bg-[#005399] text-white font-bold rounded-xl text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    View Open Positions
                  </a>
                  
                  <button
                    type="button"
                    onClick={() => handleOpenApply()}
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-slate-50 text-[#003c6e] font-bold rounded-xl text-sm sm:text-base border border-slate-300 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Spontaneous Application
                  </button>
                </div>
              </div>

              {/* Right Column: Overlapping Visual Cards matching Labster reference */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[420px] aspect-[412/422] flex items-center justify-center">
                  <img
                    src="/images/careers-hero-team.png"
                    alt="CSEEL Team and STEM Innovators"
                    className="w-full h-auto object-contain drop-shadow-2xl"
                    loading="eager"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 2. LABSTER-STYLE DISCOVER STORY & VIDEO SECTION ──────────────────── */}
        <section className="bg-white py-16 md:py-24 border-b border-[#E5E9F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              
              {/* Left Column: Video Preview Card */}
              <div className="lg:col-span-5">
                <div
                  onClick={() => setIsVideoModalOpen(true)}
                  className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group cursor-pointer aspect-[16/10] bg-slate-900 transition-transform duration-300 hover:scale-[1.01]"
                >
                  <img
                    src="/images/careers-video-thumb.jpg"
                    alt="CSEEL STEM laboratory classroom learning"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Centered Circular Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-[#006FCC] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all pl-1">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-[#006FCC] text-[#006FCC]" />
                    </div>
                  </div>

                  {/* Bottom Text Badge */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white pointer-events-none">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white drop-shadow-md">
                      WE HELP POWER LEARNING
                    </span>
                    <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/30">
                      Watch Video
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Discover Heading & CTA */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <h2
                  style={{ color: '#003c6e' }}
                  className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-snug tracking-tight"
                >
                  Discover CSEEL, where creativity and innovation collide with explosive results. Experience our story to see how you can make a real impact.
                </h2>

                <div>
                  <Link
                    href="/why-cseel"
                    className="inline-flex items-center justify-center px-7 py-3.5 bg-[#006FCC] hover:bg-[#005399] text-white font-bold rounded-xl text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    Discover CSEEL
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 3. LABSTER-STYLE 3-CARD "NOT A TYPICAL EDTECH" SECTION ───────────── */}
        <section className="bg-[#f8fafd] py-16 md:py-24 border-b border-[#dadce0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Heading */}
            <div className="text-left">
              <h2
                style={{ color: '#003c6e' }}
                className="text-2xl sm:text-3xl lg:text-[38px] font-bold tracking-tight max-w-3xl leading-snug"
              >
                CSEEL isn’t a typical edtech company — we help power knowledge.
              </h2>
            </div>

            {/* 3 Color Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Card 1: Ambitious Mindsets (Peach / Soft Orange) */}
              <div className="bg-[#FDEEE4] rounded-3xl p-7 sm:p-8 border border-[#FAD8C3] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="text-sm font-bold text-slate-800 tracking-wide">
                    Ambitious Mindsets
                  </div>
                  <div className="w-full h-[1px] bg-[#F8C6AA] my-4" />
                  
                  <div className="w-8 h-8 rounded-lg bg-[#E06D28]/15 flex items-center justify-center text-[#C05621] mb-4">
                    <Sparkles className="w-4 h-4 text-[#C05621]" />
                  </div>

                  <h3
                    style={{ color: '#16171A' }}
                    className="text-xl font-bold mb-3 tracking-tight"
                  >
                    Rooted in Innovation
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    We don’t follow trends, we create them. Our bold approach depends on the smartest people who want to put their minds to the test as they tackle challenges, break boundaries, and redefine the future of science and healthcare education. Do you have a mind to help us shape what’s next?
                  </p>
                </div>
              </div>

              {/* Card 2: Meaningful Impact (Mint / Soft Green) */}
              <div className="bg-[#E2F7EF] rounded-3xl p-7 sm:p-8 border border-[#C5EFE0] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="text-sm font-bold text-slate-800 tracking-wide">
                    Meaningful Impact
                  </div>
                  <div className="w-full h-[1px] bg-[#A5E3CD] my-4" />

                  <div className="w-8 h-8 rounded-lg bg-[#1B805E]/15 flex items-center justify-center text-[#137333] mb-4">
                    <Heart className="w-4 h-4 text-[#137333]" />
                  </div>

                  <h3
                    style={{ color: '#16171A' }}
                    className="text-xl font-bold mb-3 tracking-tight"
                  >
                    Committed to Education
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    In an AI-powered world, we still put people first. CSEEL empowers STEM and nurse learners with solutions that strengthen — not replace — the vital bond between educators and learners. We’re changing how science is taught and experienced every day, around the world.
                  </p>
                </div>
              </div>

              {/* Card 3: A Career That Fits (Butter / Soft Yellow) */}
              <div className="bg-[#FFF8DE] rounded-3xl p-7 sm:p-8 border border-[#FEEFBD] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="text-sm font-bold text-slate-800 tracking-wide">
                    A Career That Fits
                  </div>
                  <div className="w-full h-[1px] bg-[#FCE394] my-4" />

                  <div className="w-8 h-8 rounded-lg bg-[#D97706]/15 flex items-center justify-center text-[#B45309] mb-4">
                    <Zap className="w-4 h-4 text-[#B45309]" />
                  </div>

                  <h3
                    style={{ color: '#16171A' }}
                    className="text-xl font-bold mb-3 tracking-tight"
                  >
                    Empowered by Flexibility
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    At CSEEL, flexibility and accessibility aren’t just principles we apply to learning — they define how we work. As a remote-first company, we embrace a culture that values inclusivity, adaptability, and a shared sense of purpose, empowering our team to do their best work.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── 4. LABSTER-STYLE COMMITMENTS & BENEFITS SECTION ──────────────────── */}
        <section className="bg-[#F4F7FB] py-16 md:py-24 border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Header */}
            <div className="text-left max-w-3xl space-y-3">
              <div className="text-[11px] sm:text-xs font-bold text-[#006FCC] uppercase tracking-[0.2em]">
                BENEFITS &amp; COMMITMENTS
              </div>
              <h2
                style={{ color: '#003c6e' }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug"
              >
                Fuel Your Growth with CSEEL
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Our immersive learning platform and hands-on laboratory setups allow students to engage in real-world scenarios safely. We offer a comprehensive suite of benefits so you can focus on making a transformative educational impact.
              </p>
            </div>

            {/* 6 Commitments Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Card 1: Healthcare Benefits */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#D6EDFF] flex items-center justify-center text-[#003C6E] mb-5">
                    <Heart className="w-6 h-6 text-[#003C6E]" />
                  </div>
                  <h3
                    style={{ color: '#003c6e' }}
                    className="text-xl font-bold mb-3 tracking-tight"
                  >
                    Healthcare Benefits
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    We offer a comprehensive healthcare plan with top-tier medical coverage so you and your family can stay healthy and focus on what you do best.
                  </p>
                </div>
              </div>

              {/* Card 2: Flexible Time Off */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#D6EDFF] flex items-center justify-center text-[#003C6E] mb-5">
                    <Clock className="w-6 h-6 text-[#003C6E]" />
                  </div>
                  <h3
                    style={{ color: '#003c6e' }}
                    className="text-xl font-bold mb-3 tracking-tight"
                  >
                    Flexible Time Off
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    Paid company holidays and flexible leave options that promote rest, balance, continuous rejuvenation, and mutual accountability.
                  </p>
                </div>
              </div>

              {/* Card 3: Family Benefits */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#D6EDFF] flex items-center justify-center text-[#003C6E] mb-5">
                    <Users className="w-6 h-6 text-[#003C6E]" />
                  </div>
                  <h3
                    style={{ color: '#003c6e' }}
                    className="text-xl font-bold mb-3 tracking-tight"
                  >
                    Family Benefits
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    Generous paid parental leave to support growing families and ensure a smooth, respected transition back to collaborative work.
                  </p>
                </div>
              </div>

              {/* Card 4: Mental Well-being */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#D6EDFF] flex items-center justify-center text-[#003C6E] mb-5">
                    <ShieldCheck className="w-6 h-6 text-[#003C6E]" />
                  </div>
                  <h3
                    style={{ color: '#003c6e' }}
                    className="text-xl font-bold mb-3 tracking-tight"
                  >
                    Mental Well-being
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    We take mental health seriously. We offer wellness allowances and confidential 1-on-1 counseling sessions to every team member.
                  </p>
                </div>
              </div>

              {/* Card 5: Growth Opportunities */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#D6EDFF] flex items-center justify-center text-[#003C6E] mb-5">
                    <TrendingUp className="w-6 h-6 text-[#003C6E]" />
                  </div>
                  <h3
                    style={{ color: '#003c6e' }}
                    className="text-xl font-bold mb-3 tracking-tight"
                  >
                    Growth Opportunities
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    Whether you're looking to sharpen pedagogy, advance into product leadership, or explore hardware maker tech, we partner with you to help you thrive.
                  </p>
                </div>
              </div>

              {/* Card 6: Additional Benefits */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#D6EDFF] flex items-center justify-center text-[#003C6E] mb-5">
                    <Award className="w-6 h-6 text-[#003C6E]" />
                  </div>
                  <h3
                    style={{ color: '#003c6e' }}
                    className="text-xl font-bold mb-3 tracking-tight"
                  >
                    Additional Benefits
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    Competitive compensation, an annual apparatus prototyping stipend, freedom-to-choose workstation hardware, and tailored local perks.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── 5. LABSTER-STYLE VALUES SECTION (GUIDED BY PURPOSE) ───────────────── */}
        <section className="bg-white py-16 md:py-24 border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Header */}
            <div className="text-left max-w-3xl space-y-3">
              <div className="text-[11px] sm:text-xs font-bold text-[#006FCC] uppercase tracking-[0.2em]">
                OUR VALUES
              </div>
              <h2
                style={{ color: '#003c6e' }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug"
              >
                Guided by Purpose, Grounded in Values
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Authenticity, teamwork, and shared purpose drive everything we engineer. These core principles define our daily interactions and long-term vision.
              </p>
            </div>

            {/* 5 Core Values Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="p-7 rounded-3xl bg-[#F8FAFD] border border-slate-200/80 hover:border-[#006FCC]/40 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-[#006FCC] flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 style={{ color: '#003c6e' }} className="text-xl font-bold mb-2.5 tracking-tight">
                  Be Empathetic
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  We prioritize understanding and respect in every interaction — whether with customers, colleagues, or partner schools. Through honest communication, we build genuine relationships.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-[#F8FAFD] border border-slate-200/80 hover:border-[#006FCC]/40 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-[#006FCC] flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 style={{ color: '#003c6e' }} className="text-xl font-bold mb-2.5 tracking-tight">
                  Inclusively Collaborate
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Authenticity, teamwork, and shared mission drive us. We celebrate diverse perspectives, foster deep trust, and create an environment where creativity, kindness, and fun thrive.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-[#F8FAFD] border border-slate-200/80 hover:border-[#006FCC]/40 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-[#006FCC] flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 style={{ color: '#003c6e' }} className="text-xl font-bold mb-2.5 tracking-tight">
                  Learn Continuously
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  We embrace curiosity, challenge assumptions, and seek new perspectives. By iterating, experimenting, and applying what we learn, we stay at the forefront of STEM innovation.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-[#F8FAFD] border border-slate-200/80 hover:border-[#006FCC]/40 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-[#006FCC] flex items-center justify-center font-bold text-sm mb-4">
                  04
                </div>
                <h3 style={{ color: '#003c6e' }} className="text-xl font-bold mb-2.5 tracking-tight">
                  Pursue Growth
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  We understand the significance of our individual contributions to student practical success. When we create meaningful impact for learners, we grow our company and our careers.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-[#F8FAFD] border border-slate-200/80 hover:border-[#006FCC]/40 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-[#006FCC] flex items-center justify-center font-bold text-sm mb-4">
                  05
                </div>
                <h3 style={{ color: '#003c6e' }} className="text-xl font-bold mb-2.5 tracking-tight">
                  Take Ownership
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Our ambition, honesty, and adaptability drive us to continuously improve while trusting each other to do what is right. By taking responsibility for our roles, we empower success.
                </p>
              </div>

              {/* Direct Link to Culture */}
              <div className="p-7 rounded-3xl bg-gradient-to-br from-[#003c6e] to-[#005689] text-white flex flex-col justify-between shadow-md">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-cyan-200 tracking-wider">
                    Our Philosophy
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Powering Minds Across India
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                    Experiential learning turns textbook intimidation into student confidence.
                  </p>
                </div>
                <Link
                  href="/why-cseel"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-white transition-colors"
                >
                  <span>Explore Our Pedagogical Blueprint</span>
                  
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* ── 6. CURRENT OPEN POSITIONS / TALENT DIRECTORY ───────────────────────── */}
        <section id="open-positions" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="space-y-2 text-left">
            <div className="text-[11px] sm:text-xs font-bold text-[#006FCC] uppercase tracking-[0.2em]">
              CAREER OPPORTUNITIES
            </div>
            <h2
              style={{ color: '#003c6e' }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug"
            >
              Current Job Openings
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal">
              Showing {filteredJobs.length} of {CSEEL_CAREERS_DATA.length} active roles across curriculum, engineering, and school operations.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Department Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {[
                  "All",
                  "Curriculum & Pedagogy",
                  "Interactive STEM Software & Live Labs",
                  "Atal Tinkering & Robotics",
                  "Academic Growth & Partnerships"
                ].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedDepartment === dept
                        ? "bg-[#006FCC] text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roles, skills (e.g. Physics, 3D)..."
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#006FCC] rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 style={{ color: '#003c6e' }} className="text-lg font-bold">
                  No Roles Found
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  No openings match "{searchQuery}". Reset filters or submit a spontaneous application.
                </p>
                <button
                  onClick={() => { setSelectedDepartment("All"); setSearchQuery(""); }}
                  className="px-5 py-2.5 bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-[#006FCC]/50 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    
                    {/* Role Info */}
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-[#D6EDFF]/70 text-[#005689] border border-[#BCE3FF] text-[11px] font-bold uppercase rounded-lg tracking-wider">
                          {job.department}
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg">
                          {job.roleType}
                        </span>
                        {job.isUrgent && (
                          <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold uppercase rounded-lg flex items-center gap-1">
                            ⚡ Urgently Hiring
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-medium ml-1">
                          Posted {job.postedDate}
                        </span>
                      </div>

                      <h3
                        style={{ color: '#003c6e' }}
                        className="text-xl sm:text-2xl font-bold group-hover:text-[#006FCC] transition-colors leading-snug tracking-tight"
                      >
                        {job.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed max-w-4xl font-normal">
                        {job.shortDescription}
                      </p>

                      {/* Meta Tags (Location, Experience, Salary) */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-slate-600 font-medium pt-1">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#006FCC] shrink-0" />
                          <span>{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>{job.experience} Experience</span>
                        </span>
                        <span className="flex items-center gap-1 text-[#137333] font-semibold bg-[#e6f4ea] px-3 py-0.5 rounded-lg border border-[#ceead6]">
                          <DollarSign className="w-3.5 h-3.5 text-[#137333] shrink-0" />
                          <span>{job.salary}</span>
                        </span>
                      </div>

                      {/* Skill Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-row lg:flex-col items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
                      <button
                        onClick={() => handleOpenApply(job)}
                        className="w-full sm:w-auto lg:w-44 px-6 py-3 bg-[#006FCC] hover:bg-[#005399] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Apply Now</span>
                      </button>

                      <button
                        onClick={() => setSelectedJob(job)}
                        className="w-full sm:w-auto lg:w-44 px-5 py-3 bg-white hover:bg-slate-50 text-[#003c6e] border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                      >
                        <span>Role Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </article>
              ))
            )}
          </div>

          {/* ── 7. LABSTER-STYLE LASTING IMPACT BANNER ───────────────────────────── */}
          <div className="bg-gradient-to-r from-[#003c6e] via-[#005689] to-[#086fa6] rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl space-y-4 relative overflow-hidden mt-12">
            <div className="inline-block text-[10px] sm:text-[11px] font-bold text-cyan-200 uppercase tracking-[0.2em] px-3 py-1 bg-white/10 rounded-full border border-white/20">
              JOIN OUR MISSION
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white max-w-2xl mx-auto">
              Ready to Make a Lasting Impact?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Empower the world with knowledge at CSEEL. Join our team of educators, engineers, and scientists shaping hands-on practical learning.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => handleOpenApply()}
                className="px-8 py-3.5 bg-white text-[#003c6e] hover:bg-blue-50 font-bold rounded-xl text-sm shadow-xl transition-all active:scale-[0.98] cursor-pointer"
              >
                Submit Spontaneous Application
              </button>
              <a
                href="mailto:careers@cseel.org?subject=Spontaneous%20Application%20-%20CSEEL"
                className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl text-sm border border-white/30 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>careers@cseel.org</span>
              </a>
            </div>
          </div>

        </section>

        {/* ── MODAL 1: JOB DETAILS MODAL ────────────────────────────────────────── */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                onClick={() => setSelectedJob(null)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#dadce0] max-h-[85vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 bg-[#f8fafd]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-3 py-1 bg-[#D6EDFF]/70 text-[#005689] border border-[#BCE3FF] text-[11px] font-bold uppercase rounded-lg tracking-wider">
                        {selectedJob.department}
                      </span>
                      <h3 style={{ color: '#003c6e' }} className="text-xl sm:text-2xl font-bold mt-2 tracking-tight">
                        {selectedJob.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                        {selectedJob.roleType} &bull; {selectedJob.location} &bull; {selectedJob.experience}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="px-3 py-1 bg-[#e6f4ea] text-[#137333] border border-[#ceead6] font-semibold rounded-lg">
                      {selectedJob.salary}
                    </span>
                    <span className="text-slate-600 font-medium">{selectedJob.openings} Openings Available</span>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
                  <div>
                    <h4 style={{ color: '#003c6e' }} className="font-bold uppercase tracking-wider mb-2 text-xs">
                      Role Summary
                    </h4>
                    <p>{selectedJob.shortDescription}</p>
                  </div>

                  <div>
                    <h4 style={{ color: '#003c6e' }} className="font-bold uppercase tracking-wider mb-2 text-xs">
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-1.5 list-disc pl-5">
                      {selectedJob.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ color: '#003c6e' }} className="font-bold uppercase tracking-wider mb-2 text-xs">
                      Requirements &amp; Qualifications
                    </h4>
                    <ul className="space-y-1.5 list-disc pl-5">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ color: '#003c6e' }} className="font-bold uppercase tracking-wider mb-2 text-xs">
                      Perks &amp; Benefits
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedJob.perks.map((p, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 font-medium text-xs">
                          <CheckCircle2 className="w-4 h-4 text-[#137333] shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const j = selectedJob;
                      setSelectedJob(null);
                      handleOpenApply(j);
                    }}
                    className="px-7 py-2.5 bg-[#006FCC] hover:bg-[#005399] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply for this Role</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 2: EASY APPLY APPLICATION MODAL ─────────────────────────────── */}
        <AnimatePresence>
          {isApplyModalOpen && applyingJob && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                onClick={() => setIsApplyModalOpen(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col"
              >
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-slate-200 bg-[#f8fafd] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#006FCC] uppercase tracking-wider">
                      CSEEL Job Application
                    </span>
                    <h3 style={{ color: '#003c6e' }} className="text-lg sm:text-xl font-bold truncate max-w-md mt-0.5 tracking-tight">
                      {applyingJob.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form or Success State */}
                {submitSuccess ? (
                  <div className="p-8 text-center space-y-4 my-auto">
                    <div className="w-16 h-16 bg-[#e6f4ea] text-[#137333] rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <h3 style={{ color: '#003c6e' }} className="text-xl font-bold">
                      Application Submitted Successfully!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-slate-900">{applyForm.fullName || "Candidate"}</strong>. Your application for <strong className="text-[#006FCC]">{applyingJob.title}</strong> has been received with Application ID <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">CSEEL-2026-{(Math.random() * 9000 + 1000).toFixed(0)}</code>. Our academic talent team will review your profile and reach out within 48 hours.
                    </p>
                    <button
                      onClick={() => setIsApplyModalOpen(false)}
                      className="px-7 py-3 bg-[#006FCC] hover:bg-[#005399] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Done &amp; Return to Careers
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="font-bold text-slate-800 block mb-1 text-xs">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Raghav Singhania"
                          value={applyForm.fullName}
                          onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-[#006FCC] outline-none text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-800 block mb-1 text-xs">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={applyForm.email}
                          onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-[#006FCC] outline-none text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="font-bold text-slate-800 block mb-1 text-xs">Phone / WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={applyForm.phone}
                          onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-[#006FCC] outline-none text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-800 block mb-1 text-xs">Current City / Location *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Delhi NCR, Bangalore, Pune"
                          value={applyForm.currentCity}
                          onChange={(e) => setApplyForm({ ...applyForm, currentCity: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-[#006FCC] outline-none text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="font-bold text-slate-800 block mb-1 text-xs">Relevant Experience</label>
                        <select
                          value={applyForm.experience}
                          onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-[#006FCC] outline-none bg-white text-xs sm:text-sm"
                        >
                          <option>0 - 1 Years (Entry Level / Fresh Graduate)</option>
                          <option>1 - 3 Years</option>
                          <option>3 - 5 Years</option>
                          <option>5 - 8 Years</option>
                          <option>8+ Years (Senior Lead)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-800 block mb-1 text-xs">LinkedIn / Portfolio URL</label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          value={applyForm.portfolioUrl}
                          onChange={(e) => setApplyForm({ ...applyForm, portfolioUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-[#006FCC] outline-none text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1 text-xs">Cover Note / Why CSEEL?</label>
                      <textarea
                        rows={3}
                        placeholder="Briefly tell us about your experience in hands-on science pedagogy, interactive software, or robotics..."
                        value={applyForm.coverNote}
                        onChange={(e) => setApplyForm({ ...applyForm, coverNote: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-[#006FCC] outline-none resize-none text-xs sm:text-sm"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-[#006FCC] hover:bg-[#005399] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                      >
                        {isSubmitting ? (
                          <span>Submitting Application...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Application to CSEEL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── VIDEO / STORY MODAL ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {isVideoModalOpen && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-xs"
                onClick={() => setIsVideoModalOpen(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-3xl bg-[#001833] rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-video flex flex-col items-center justify-center"
              >
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
                  aria-label="Close video"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center text-white bg-gradient-to-br from-[#002244] to-[#003c6e]">
                  <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-5 shadow-inner">
                    <Play className="w-10 h-10 fill-cyan-400 text-cyan-400 pl-1" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-bold uppercase tracking-widest border border-cyan-400/30 mb-3">
                    CSEEL Experiential Innovation Story
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold max-w-lg mb-2">
                    How We Help Power Learning Across India
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100/90 max-w-md leading-relaxed mb-6">
                    From hands-on physics &amp; chemistry benches to ATL robotics and virtual simulations — join the team empowering next-generation scientists and engineers.
                  </p>
                  <Link
                    href="/why-cseel"
                    onClick={() => setIsVideoModalOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-white text-[#003c6e] font-bold text-xs sm:text-sm hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    Learn More About Our Pedagogy →
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
