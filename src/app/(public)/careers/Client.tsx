'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, DollarSign, Sparkles, Search, Filter,
  CheckCircle2, ArrowRight, Upload, FileText, Check, X, Building2,
  Users, Award, Heart, Laptop, ShieldCheck, ChevronRight, Send, Star
} from 'lucide-react';
import PageTransition from "@/components/shared/PageTransition";

interface CseelCareerJob {
  id: string;
  title: string;
  department: "Curriculum & Pedagogy" | "Software & 3D Simulations" | "Atal Tinkering & Robotics" | "Academic Growth & Partnerships";
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
      "Collaborate closely with 3D simulation engineers to translate real physics apparatus into WebGL interactive virtual labs.",
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
    title: "Senior 3D WebGL & Virtual Simulation Engineer",
    department: "Software & 3D Simulations",
    roleType: "Full-Time",
    location: "Remote (Pan-India) / Bengaluru",
    experience: "3 - 7 Years",
    salary: "₹14,00,000 – ₹22,00,000 PA",
    openings: 2,
    isUrgent: true,
    postedDate: "3 days ago",
    shortDescription: "Architect interactive, real-time 3D physics and chemistry virtual laboratory simulations using Three.js, React-Three-Fiber, Next.js, and WebGL raycasting.",
    responsibilities: [
      "Build high-performance, browser-based 3D laboratory apparatus (optical benches, titrators, pendulums, particle accelerators).",
      "Implement realistic physics kinematics, ray optics refraction, fluid dynamics, and molecular kinematics shaders.",
      "Optimize rendering pipelines for smooth 60 FPS performance on lower-end school Chromebooks and mobile tablets.",
      "Collaborate with science SMEs to ensure mathematical accuracy in simulation calculations."
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
      "Author detailed student lab logbooks and interactive virtual biology experiment guides.",
      "Review virtual 3D anatomical models and microbiological cell simulations for pedagogical accuracy.",
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
    department: "Software & 3D Simulations",
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
  }
];

export default function CareersClient() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<CseelCareerJob | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [applyingJob, setApplyingJob] = useState<CseelCareerJob | null>(null);

  // Application Form State
  const [applyForm, setApplyForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentCity: "",
    experience: "3+ Years",
    portfolioUrl: "",
    coverNote: "",
    resumeFile: null as File | null,
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

  const handleOpenApply = (job: CseelCareerJob) => {
    setApplyingJob(job);
    setIsApplyModalOpen(true);
    setSubmitSuccess(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50/70 pb-20">

        {/* ── HERO BANNER ────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-slate-900 via-primary to-slate-900 text-white pt-14 pb-16 md:pt-20 md:pb-22 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/15 via-transparent to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4 max-w-5xl text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>🚀 We Are Hiring | {CSEEL_CAREERS_DATA.length} Active Positions Open</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Shape the Future of <span className="text-cyan-300">Hands-On Science</span> & STEAM in India
            </h1>

            <p className="text-sm md:text-base text-slate-200 max-w-3xl mx-auto leading-relaxed">
              Join India's premier experiential learning platform. We are building transformative NEP-2020 physics, chemistry, robotics, biology practical laboratories and 3D simulation tools empowering 500+ schools nationwide.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#open-positions"
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-full text-xs md:text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <span>View All Open Positions ({CSEEL_CAREERS_DATA.length})</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/about-us"
                className="px-7 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-xs md:text-sm border border-white/20 backdrop-blur-md transition-all"
              >
                Our Mission & Story
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHY WORK AT CSEEL (CULTURE & PERKS) ─────────────────────────────────── */}
        <section className="py-12 border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-8">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">Culture & Benefits</p>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">Why Build Your Career at CSEEL?</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: Sparkles,
                  title: "National STEAM Impact",
                  desc: "Directly empower 20,000+ school students and 500+ top educational institutions across India.",
                  color: "text-amber-500 bg-amber-50"
                },
                {
                  icon: Laptop,
                  title: "Modern Tech & 3D Labs",
                  desc: "Work on cutting-edge WebGL, Three.js 3D physics engines, and industrial hardware prototyping.",
                  color: "text-cyan-500 bg-cyan-50"
                },
                {
                  icon: Users,
                  title: "Advisory Mentorship",
                  desc: "Learn and collaborate alongside former ISRO, IISc, DRDO scientists, and IIT pedagogical leaders.",
                  color: "text-purple-500 bg-purple-50"
                },
                {
                  icon: Heart,
                  title: "Comprehensive Wellness",
                  desc: "Full family health insurance, liberal learning stipends, flexible hybrid hours, and equity upside.",
                  color: "text-emerald-500 bg-emerald-50"
                }
              ].map((perk, idx) => {
                const Icon = perk.icon;
                return (
                  <div key={idx} className="p-5 rounded-2xl border border-gray-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                    <div className={`w-10 h-10 rounded-xl ${perk.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{perk.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{perk.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── OPEN POSITIONS DIRECTORY ───────────────────────────────────────────── */}
        <section id="open-positions" className="py-12">
          <div className="container mx-auto px-4 max-w-6xl space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by job title, skill (e.g. Three.js, Physics, Robotics), or location..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-2xl text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold shrink-0">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>Showing {filteredJobs.length} of {CSEEL_CAREERS_DATA.length} Openings</span>
                </div>
              </div>

              {/* Department Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                {[
                  "All",
                  "Curriculum & Pedagogy",
                  "Software & 3D Simulations",
                  "Atal Tinkering & Robotics",
                  "Academic Growth & Partnerships"
                ].map((dept) => {
                  const isActive = selectedDepartment === dept;
                  return (
                    <button
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-gray-700"
                      }`}
                    >
                      {dept} {dept === "All" && `(${CSEEL_CAREERS_DATA.length})`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Jobs List */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-base font-bold text-gray-900">No Positions Matching Your Search</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Try clearing your search query or selecting a different department category. You can also send a general application to <a href="mailto:careers@cseel.org" className="text-primary font-bold underline">careers@cseel.org</a>.
                </p>
                <button
                  onClick={() => { setSelectedDepartment("All"); setSearchQuery(""); }}
                  className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-full mt-2"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-3xl border border-gray-200 p-5 md:p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      
                      {/* Title & Metadata */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-md">
                            {job.department}
                          </span>
                          <span className="px-2.5 py-0.5 bg-slate-100 text-gray-700 text-[10px] font-bold rounded-md">
                            {job.roleType}
                          </span>
                          {job.isUrgent && (
                            <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase rounded-md animate-pulse">
                              ⚡ Urgently Hiring
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 font-medium">
                            Posted {job.postedDate}
                          </span>
                        </div>

                        <h3 className="text-base md:text-lg font-black text-gray-900 group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>

                        <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
                          {job.shortDescription}
                        </p>

                        {/* Meta Tags (Location, Experience, Salary) */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 font-semibold pt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{job.location}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{job.experience} Exp</span>
                          </span>
                          <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{job.salary}</span>
                          </span>
                        </div>

                        {/* Skill Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {job.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-semibold text-gray-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action CTAs */}
                      <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0 pt-2 md:pt-0">
                        <button
                          onClick={() => handleOpenApply(job)}
                          className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-black shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Apply Now</span>
                        </button>
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="flex-1 md:flex-none px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Role Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* General Resume Box */}
            <div className="bg-gradient-to-r from-blue-900 via-primary to-slate-900 rounded-3xl p-6 md:p-8 text-white text-center shadow-md space-y-3">
              <h3 className="text-lg md:text-xl font-black">Don't See the Exact Role You're Looking For?</h3>
              <p className="text-xs md:text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed">
                We are always eager to connect with brilliant science educators, 3D artists, hardware hackers, and student leaders. Send your open portfolio and resume directly to our leadership team.
              </p>
              <div className="pt-2">
                <a
                  href="mailto:careers@cseel.org?subject=Open%20Application%20-%20CSEEL%20Careers"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-primary font-black text-xs rounded-full shadow-md hover:bg-blue-50 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Email Resume to careers@cseel.org</span>
                </a>
              </div>
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
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setSelectedJob(null)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-h-[85vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 bg-slate-50/80">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-md">
                        {selectedJob.department}
                      </span>
                      <h3 className="text-xl font-black text-gray-900 mt-1">{selectedJob.title}</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-1">
                        {selectedJob.roleType} • {selectedJob.location} • {selectedJob.experience}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="p-1.5 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-lg">
                      {selectedJob.salary}
                    </span>
                    <span className="text-gray-500 font-semibold">{selectedJob.openings} Openings Available</span>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700 leading-relaxed">
                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-wider mb-2 text-[11px]">Role Summary</h4>
                    <p>{selectedJob.shortDescription}</p>
                  </div>

                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-wider mb-2 text-[11px]">Key Responsibilities</h4>
                    <ul className="space-y-1.5 list-disc pl-4">
                      {selectedJob.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-wider mb-2 text-[11px]">Requirements & Qualifications</h4>
                    <ul className="space-y-1.5 list-disc pl-4">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-wider mb-2 text-[11px]">Perks & Benefits</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedJob.perks.map((p, i) => (
                        <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const j = selectedJob;
                      setSelectedJob(null);
                      handleOpenApply(j);
                    }}
                    className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
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
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setIsApplyModalOpen(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col"
              >
                {/* Header */}
                <div className="p-5 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase">CSEEL Job Application</span>
                    <h3 className="text-base font-black text-gray-900 truncate max-w-md">{applyingJob.title}</h3>
                  </div>
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form or Success State */}
                {submitSuccess ? (
                  <div className="p-8 text-center space-y-4 my-auto">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Application Submitted Successfully!</h3>
                    <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-gray-900">{applyForm.fullName || "Candidate"}</strong>. Your application for <strong className="text-primary">{applyingJob.title}</strong> has been received with Application ID <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">CSEEL-2026-{(Math.random() * 9000 + 1000).toFixed(0)}</code>. Our academic talent team will review your profile and reach out within 48 hours.
                    </p>
                    <button
                      onClick={() => setIsApplyModalOpen(false)}
                      className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-full shadow-md"
                    >
                      Done & Return to Careers
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Raghav Singhania"
                          value={applyForm.fullName}
                          onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={applyForm.email}
                          onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Phone / WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={applyForm.phone}
                          onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Current Location (City) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. New Delhi / Bengaluru"
                          value={applyForm.currentCity}
                          onChange={(e) => setApplyForm({ ...applyForm, currentCity: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Relevant Experience</label>
                        <select
                          value={applyForm.experience}
                          onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none bg-white"
                        >
                          <option>Fresher / Graduate</option>
                          <option>1 - 2 Years</option>
                          <option>3 - 5 Years</option>
                          <option>5 - 8 Years</option>
                          <option>8+ Years</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">LinkedIn / Portfolio URL</label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/..."
                          value={applyForm.portfolioUrl}
                          onChange={(e) => setApplyForm({ ...applyForm, portfolioUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>

                    {/* Resume Upload File Box */}
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Attach Resume / CV (PDF / DOCX) *</label>
                      <div className="p-4 border-2 border-dashed border-gray-300 hover:border-primary rounded-2xl text-center bg-slate-50 transition-colors relative cursor-pointer">
                        <input
                          type="file"
                          required
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setApplyForm({ ...applyForm, resumeFile: e.target.files[0] });
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <Upload className="w-6 h-6 text-primary mx-auto mb-1.5" />
                        {applyForm.resumeFile ? (
                          <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{applyForm.resumeFile.name}</span>
                          </p>
                        ) : (
                          <div>
                            <p className="text-xs font-bold text-gray-800">Click to upload your resume</p>
                            <p className="text-[10px] text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Why are you excited to join CSEEL? (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Briefly tell us about your passion for science education, key projects, or teaching approach..."
                        value={applyForm.coverNote}
                        onChange={(e) => setApplyForm({ ...applyForm, coverNote: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <span>Uploading Application...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Application for {applyingJob.title}</span>
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

      </div>
    </PageTransition>
  );
}
