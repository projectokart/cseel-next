'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  BookOpen, 
  ShoppingCart, 
  FileText, 
  Newspaper, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Search, 
  ShieldCheck, 
  FlaskConical, 
  GraduationCap, 
  ExternalLink,
  ChevronRight,
  Layers,
  HelpCircle,
  Clock,
  PhoneCall
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';

export default function ResourcesClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'schemes' | 'materials' | 'manuals' | 'blog' | 'news' | 'careers'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Government Schemes Data
  const schemes = [
    {
      slug: 'pm-shri',
      title: 'PM SHRI Schools Scheme',
      badge: 'National Flagship Grant',
      grant: 'Up to ₹2 Crore per School',
      desc: 'Modern composite science laboratory infrastructure, experiential learning pedagogical kits, and green lab architecture for shortlisted model schools.',
      link: '/schemes/pm-shri',
      tags: ['Infrastructure', 'Composite Lab', 'Central Grant']
    },
    {
      slug: 'atl-grants',
      title: 'NITI Aayog Atal Tinkering Labs (ATL 2.0)',
      badge: 'NITI Aayog Initiative',
      grant: '₹20 Lakh Grant-in-Aid',
      desc: 'Package 1 to 4 tinkering setups with 3D printers, IoT kits, robotics, breadboards, and GeM portal vendor compliance documentation.',
      link: '/schemes/atl-grants',
      tags: ['Robotics', 'IoT', 'GeM Portal', 'Tinkering']
    },
    {
      slug: 'samagra-shiksha',
      title: 'Samagra Shiksha Secondary Lab Grants',
      badge: 'State & Central Allocation',
      grant: 'Annual Science Consumables & Lab Grant',
      desc: 'Annual funding for secondary and senior secondary school laboratories, mandatory apparatus replacement, and safety upgrades.',
      link: '/schemes/samagra-shiksha',
      tags: ['CBSE Affiliation', 'Safety Upgrades', 'Annual Grant']
    },
    {
      slug: 'nep-2020-guidelines',
      title: 'NEP 2020 Experiential Lab Guidelines',
      badge: 'National Education Policy',
      grant: 'Curriculum & Pedagogy Framework',
      desc: 'Comprehensive framework mandating practical-first experiential learning, 5E inquiry-based science lessons, and bagless school days.',
      link: '/schemes/nep-2020-guidelines',
      tags: ['NEP 2020', '5E Model', 'Experiential Learning']
    },
    {
      slug: 'cbse-skill-hub',
      title: 'CBSE Skill Hub & PMKVY Alignment',
      badge: 'Skill Education Mission',
      grant: 'Vocational Lab Sanction',
      desc: 'Skill education modules for Class 6-12 in applied science, robotics, artificial intelligence, electronics and maker mechanics.',
      link: '/schemes/cbse-skill-hub',
      tags: ['Vocational', 'AI & Robotics', 'CBSE Norms']
    }
  ];

  // 2. Materials & Equipment Cart Categories
  const materialCategories = [
    {
      name: 'Chemical Reagents & Lab Glassware',
      items: 'Borosilicate Beakers, Flasks, Pipettes, Acids & Salt Analysis Reagents',
      tag: 'CBSE Mandatory',
      link: '/materials'
    },
    {
      name: 'Physics Mechanics & Optics Apparatus',
      items: 'Optical Benches, Prisms, Spherometers, Vernier Calipers, Pendulums',
      tag: 'Class 9-12',
      link: '/materials'
    },
    {
      name: 'Biology Microscopes & Specimens',
      items: 'Compound Microscopes, Permanent Slides, Human Anatomy 3D Models',
      tag: 'Certified Specimens',
      link: '/materials'
    },
    {
      name: 'ATL Tinkering & Electronics Packages',
      items: 'Arduino/ESP32 Boards, Sensors, Soldering Stations, 3D Filaments',
      tag: 'NITI Aayog Pkg 1-4',
      link: '/materials'
    }
  ];

  // 3. Lab Manuals
  const labManuals = [
    {
      title: 'Class 9-10 Composite Science Lab Manual',
      board: 'CBSE & ICSE Aligned',
      pages: '48 Experiments',
      desc: 'Step-by-step practical SOPs, apparatus lists, observation tables, and viva-voce question banks.',
      link: '/hands-on-experiments'
    },
    {
      title: 'Class 11-12 Physics Practical Standard SOPs',
      board: 'Senior Secondary',
      pages: '32 Practicals',
      desc: 'Measurement verification, ray diagrams, circuit connections, and experimental error analysis.',
      link: '/hands-on-experiments'
    },
    {
      title: 'Class 11-12 Chemistry Practical Guide & Salt Analysis',
      board: 'Board Practical Standard',
      pages: '28 Practicals',
      desc: 'Volumetric titration tables, qualitative anion/cation detection schemes, and chemical safety SOPs.',
      link: '/hands-on-experiments'
    },
    {
      title: 'ATL 2.0 Teacher Mentor Handbook',
      board: 'NITI Aayog & STEM',
      pages: '50+ Tinkering Challenges',
      desc: 'Design thinking worksheets, rapid prototyping cycles, and student competition rubric.',
      link: '/schemes/atl-grants'
    }
  ];

  // 4. Blog Articles
  const blogPosts = [
    {
      title: 'How Experiential Learning Boosts CBSE Practical Exam Scores by 34%',
      category: 'Academic Research',
      readTime: '6 min read',
      date: 'October 2026',
      desc: 'A comparative study of schools shifting from rote practical memorization to structured hands-on inquiry.',
      link: '/blog'
    },
    {
      title: 'Complete GeM Portal Procurement Guide for School Science Labs',
      category: 'Procurement & DPR',
      readTime: '8 min read',
      date: 'September 2026',
      desc: 'How school administrators can smoothly navigate GeM bidding, OEM authorizations, and PAC certificates.',
      link: '/blog'
    },
    {
      title: 'Designing a Safe 600 Sq Ft CBSE Composite Lab: Floor Plan & 8 Sinks Rule',
      category: 'Lab Architecture',
      readTime: '5 min read',
      date: 'September 2026',
      desc: 'Detailed blueprint walkthrough ensuring compliance with CBSE SARAS affiliation bye-laws.',
      link: '/blog'
    }
  ];

  // 5. News & Media Updates
  const newsItems = [
    {
      title: 'CSEEL Partners with 50+ New Senior Secondary Schools for Turnkey Experiential Labs',
      source: 'National Education Wire',
      date: 'October 2026',
      link: '/media-archive'
    },
    {
      title: 'New PM SHRI Model Composite Science Lab Inaugurated in Central Delhi',
      source: 'Press Release',
      date: 'September 2026',
      link: '/media-archive'
    },
    {
      title: 'Annual State STEM Exhibition & Tinkering Hackathon Announced for Class 6-12',
      source: 'Event Dispatch',
      date: 'August 2026',
      link: '/exhibitions'
    }
  ];

  // 6. Careers
  const careerRoles = [
    {
      title: 'STEM Lab Trainer & Experiential Educator',
      location: 'Delhi NCR / Hybrid',
      type: 'Full-time',
      experience: '2-4 Years in Science Teaching',
      link: '/careers'
    },
    {
      title: 'Curriculum Engineer (Physics & Chemistry Practicals)',
      location: 'New Delhi / Remote',
      type: 'Full-time',
      experience: '3+ Years in CBSE/ICSE Curriculum Design',
      link: '/careers'
    },
    {
      title: 'School Lab Implementation Specialist',
      location: 'Field Operations',
      type: 'Full-time',
      experience: 'Hands-on lab setup & GeM procurement',
      link: '/careers'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8FAFD] text-slate-800">
        
        {/* ── HERO BANNER ── */}
        <section 
          className="relative text-white py-16 lg:py-20 overflow-hidden"
          style={{ background: 'linear-gradient(110deg, #023858 36%, #005499 68%)' }}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-sky-200 mb-5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Knowledge & Institutional Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
                Resources, Government Schemes & Lab Manuals
              </h1>
              <p className="text-base sm:text-lg text-sky-100/90 leading-relaxed font-normal mb-8">
                Empowering school leaders, educators, and science faculty with verified government lab funding schemes, GeM procurement blueprints, curriculum practical manuals, lab equipment material cart, academic blogs, and career opportunities.
              </p>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap gap-2.5">
                <a 
                  href="#schemes"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Government Schemes</span>
                </a>
                <a 
                  href="#materials"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Material Cart & Store</span>
                </a>
                <a 
                  href="#manuals"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-300" />
                  <span>Lab Manuals & SOPs</span>
                </a>
                <a 
                  href="#blog"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-300" />
                  <span>Articles & Blog</span>
                </a>
                <a 
                  href="#news"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all"
                >
                  <Newspaper className="w-3.5 h-3.5 text-pink-300" />
                  <span>News & Press</span>
                </a>
                <a 
                  href="#careers"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5 text-orange-300" />
                  <span>Careers</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT CONTAINER ── */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

          {/* ══════════════════════════════════════════════════
              1. GOVERNMENT SCHEMES & LAB MODERNIZATION GRANTS
             ══════════════════════════════════════════════════ */}
          <section id="schemes" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#E8E9E9]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#006FCC] mb-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>National Grants & Policies</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023858] tracking-tight">
                  Government Schemes & Lab Funding
                </h2>
                <p className="text-sm text-[#5F6265] mt-1">
                  Verified central and state schemes for modernizing school science infrastructure and setting up turnkey composite labs.
                </p>
              </div>

              <Link
                href="/schemes"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#006FCC] hover:text-[#005499] transition-colors shrink-0"
              >
                <span>View All Schemes Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((item) => (
                <div 
                  key={item.slug}
                  className="bg-white rounded-[16px] border border-[#E8E9E9] p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#006FCC]/40 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EDF5FA] text-[#006FCC]">
                        {item.badge}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {item.grant}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#023858] group-hover:text-[#006FCC] transition-colors leading-snug mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-[#5F6265] leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.tags.map(t => (
                        <span key={t} className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={item.link}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-[10px] bg-[#EDF5FA] hover:bg-[#006FCC] text-[#006FCC] hover:text-white text-xs font-bold transition-all"
                    >
                      <span>Read Guidelines & DPR</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}

              {/* Callout Card */}
              <div 
                className="rounded-[16px] p-6 text-white flex flex-col justify-between"
                style={{ background: 'linear-gradient(135deg, #023858 0%, #005499 100%)' }}
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white inline-block mb-3">
                    Institutional Advisory
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Need Free DPR & GeM Procurement Documentation?
                  </h3>
                  <p className="text-xs text-sky-100/90 leading-relaxed mb-4">
                    Our compliance specialists assist school principals with Detailed Project Reports (DPR), BoQ specifications, and GeM portal bids for PM SHRI and ATL grants.
                  </p>
                </div>

                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-white text-[#023858] font-bold text-xs hover:bg-sky-50 transition-all shadow-sm"
                >
                  <span>Request Free DPR Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              2. MATERIAL CART & LAB EQUIPMENT SUPPLIES
             ══════════════════════════════════════════════════ */}
          <section id="materials" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#E8E9E9]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#006FCC] mb-1.5">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Lab Supplies & Reagents</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023858] tracking-tight">
                  Material Cart & Equipment Store
                </h2>
                <p className="text-sm text-[#5F6265] mt-1">
                  Order CBSE-compliant science apparatus, non-consumables, chemical reagents, glassware, and DIY kits directly with instant cart checkout.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#006FCC]/30 text-[#006FCC] bg-white hover:bg-[#EDF5FA] text-xs font-bold transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>View Material Cart</span>
                </Link>
                <Link
                  href="/materials"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>Browse Full Store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {materialCategories.map((cat, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-[16px] border border-[#E8E9E9] p-5 flex flex-col justify-between shadow-xs hover:border-[#006FCC]/40 hover:shadow-md transition-all"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#006FCC] bg-[#EDF5FA] px-2 py-0.5 rounded">
                      {cat.tag}
                    </span>
                    <h4 className="text-base font-bold text-[#023858] mt-2.5 mb-2 leading-snug">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-[#5F6265] leading-relaxed">
                      {cat.items}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#F0F2F4]">
                    <Link
                      href={cat.link}
                      className="text-xs font-bold text-[#006FCC] hover:text-[#005499] inline-flex items-center gap-1"
                    >
                      <span>Explore & Add to Cart</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              3. LAB MANUALS & PRACTICAL EXPERIMENT GUIDES
             ══════════════════════════════════════════════════ */}
          <section id="manuals" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#E8E9E9]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#006FCC] mb-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Curriculum SOPs & Workbooks</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023858] tracking-tight">
                  Lab Manuals & Practical Guides
                </h2>
                <p className="text-sm text-[#5F6265] mt-1">
                  CBSE and ICSE curriculum-aligned practical procedures, teacher demonstration notes, safety protocols, and student observation tables.
                </p>
              </div>

              <Link
                href="/hands-on-experiments"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#006FCC] hover:text-[#005499] transition-colors shrink-0"
              >
                <span>Browse All Practical Modules</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {labManuals.map((man, i) => (
                <div 
                  key={i}
                  className="bg-white rounded-[16px] border border-[#E8E9E9] p-5 flex flex-col justify-between shadow-xs hover:border-[#006FCC]/40 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#006FCC] mb-2">
                      <span>{man.board}</span>
                      <span className="text-[#5F6265] bg-slate-100 px-2 py-0.5 rounded">{man.pages}</span>
                    </div>

                    <h4 className="text-base font-bold text-[#023858] group-hover:text-[#006FCC] transition-colors mb-2 leading-snug">
                      {man.title}
                    </h4>

                    <p className="text-xs text-[#5F6265] leading-relaxed">
                      {man.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#F0F2F4]">
                    <Link
                      href={man.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006FCC] hover:text-[#005499]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Access Practical Manual</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              4. BLOG & ARTICLES
             ══════════════════════════════════════════════════ */}
          <section id="blog" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#E8E9E9]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#006FCC] mb-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Pedagogical Insights</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023858] tracking-tight">
                  Articles & STEM Insights
                </h2>
                <p className="text-sm text-[#5F6265] mt-1">
                  In-depth articles by STEM curriculum architects, lab safety audits, and pedagogical frameworks.
                </p>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#006FCC] hover:text-[#005499] transition-colors shrink-0"
              >
                <span>Visit Knowledge Blog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post, i) => (
                <div 
                  key={i}
                  className="bg-white rounded-[16px] border border-[#E8E9E9] p-6 flex flex-col justify-between shadow-xs hover:border-[#006FCC]/40 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold mb-3">
                      <span className="text-[#006FCC] bg-[#EDF5FA] px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                      <span className="text-[#5F6265]">{post.readTime}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#023858] group-hover:text-[#006FCC] transition-colors leading-snug mb-2.5">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#5F6265] leading-relaxed">
                      {post.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#F0F2F4] flex items-center justify-between">
                    <span className="text-[11px] text-[#5F6265]">{post.date}</span>
                    <Link
                      href={post.link}
                      className="text-xs font-bold text-[#006FCC] hover:text-[#005499] inline-flex items-center gap-1"
                    >
                      <span>Read Full Article</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              5. NEWS & MEDIA PRESS UPDATES
             ══════════════════════════════════════════════════ */}
          <section id="news" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#E8E9E9]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#006FCC] mb-1.5">
                  <Newspaper className="w-4 h-4" />
                  <span>Media Archive & Coverage</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023858] tracking-tight">
                  News & Media Press
                </h2>
                <p className="text-sm text-[#5F6265] mt-1">
                  Stay updated with our latest turnkey school installations, teacher conclaves, and nationwide STEM achievements.
                </p>
              </div>

              <Link
                href="/media-archive"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#006FCC] hover:text-[#005499] transition-colors shrink-0"
              >
                <span>View Full Media Archive</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newsItems.map((news, i) => (
                <div 
                  key={i}
                  className="bg-white rounded-[16px] border border-[#E8E9E9] p-6 flex flex-col justify-between shadow-xs hover:border-[#006FCC]/40 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold mb-3">
                      <span className="text-[#006FCC] bg-[#EDF5FA] px-2 py-0.5 rounded">
                        {news.source}
                      </span>
                      <span className="text-[#5F6265]">{news.date}</span>
                    </div>

                    <h4 className="text-base font-bold text-[#023858] group-hover:text-[#006FCC] transition-colors leading-snug mb-3">
                      {news.title}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0F2F4]">
                    <Link
                      href={news.link}
                      className="text-xs font-bold text-[#006FCC] hover:text-[#005499] inline-flex items-center gap-1"
                    >
                      <span>Read Story & Photos</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              6. CAREERS AT CSEEL
             ══════════════════════════════════════════════════ */}
          <section id="careers" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#E8E9E9]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#006FCC] mb-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Join Our STEM Mission</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023858] tracking-tight">
                  Careers at CSEEL
                </h2>
                <p className="text-sm text-[#5F6265] mt-1">
                  We are hiring passionate science educators, lab engineers, and STEM curriculum developers across India.
                </p>
              </div>

              <Link
                href="/careers"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#006FCC] hover:text-[#005499] transition-colors shrink-0"
              >
                <span>View All Open Positions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {careerRoles.map((role, i) => (
                <div 
                  key={i}
                  className="bg-white rounded-[16px] border border-[#E8E9E9] p-6 flex flex-col justify-between shadow-xs hover:border-[#006FCC]/40 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold mb-3">
                      <span className="text-[#006FCC] bg-[#EDF5FA] px-2 py-0.5 rounded">
                        {role.type}
                      </span>
                      <span className="text-[#5F6265]">{role.location}</span>
                    </div>

                    <h4 className="text-base font-bold text-[#023858] group-hover:text-[#006FCC] transition-colors leading-snug mb-2">
                      {role.title}
                    </h4>

                    <p className="text-xs text-[#5F6265] leading-relaxed">
                      {role.experience}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#F0F2F4]">
                    <Link
                      href={role.link}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <span>Apply for this Role</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              FINAL CTA BANNER
             ══════════════════════════════════════════════════ */}
          <section 
            className="rounded-[20px] p-8 sm:p-12 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(110deg, #023858 36%, #005499 68%)' }}
          >
            <div className="max-w-2xl relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-200 bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block mb-4">
                Partner with CSEEL Today
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                Ready to Upgrade Your School’s Science Laboratories?
              </h3>
              <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed mb-6 font-normal">
                Book a personalized consultation with our laboratory infrastructure engineers. Get turnkey layout drawings, CBSE SARAS compliance checklists, and government grant advisory.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#023858] font-bold text-sm rounded-[12px] hover:bg-sky-50 transition-all shadow-md"
                >
                  Get a Free School Lab Audit
                </Link>
                <a
                  href="tel:+919050778830"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-[12px] border border-white/25 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-sky-200" />
                  <span>Call +91-9050778830</span>
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageTransition>
  );
}
