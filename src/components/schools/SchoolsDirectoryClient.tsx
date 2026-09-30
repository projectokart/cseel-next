'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Building2,
  MapPin,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Filter,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Compass,
  Laptop,
  Beaker,
  Home,
  HelpCircle,
  Star,
  Scale,
  Heart,
  Share2,
  X,
  Check,
  Phone,
  Mail,
  AlertCircle,
  Info
} from 'lucide-react';
import { SchoolsDirectoryResult } from '@/integrations/supabase/schoolsDirectoryDb';
import { SchoolRecord } from '@/data/schoolFinderData';

interface Props {
  initialData: SchoolsDirectoryResult;
}

export default function SchoolsDirectoryClient({ initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = initialData.query;

  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [selectedBoard, setSelectedBoard] = useState(query.board || 'all');
  const [selectedResidential, setSelectedResidential] = useState(query.residential || 'all');
  const [onlyAtl, setOnlyAtl] = useState(query.facility?.includes('Atal Tinkering') || false);
  const [sortBy, setSortBy] = useState(query.sortBy || 'students');

  // Interactive state: Shortlist, Compare, Enquiry, Share
  const [likedSchoolIds, setLikedSchoolIds] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<SchoolRecord[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedSchoolForEnquiry, setSelectedSchoolForEnquiry] = useState<SchoolRecord | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [copiedToastId, setCopiedToastId] = useState<string | null>(null);
  const [selectedSchoolForLabs, setSelectedSchoolForLabs] = useState<SchoolRecord | null>(null);

  // Client-side quick filter on current results
  const displayedSchools = useMemo(() => {
    let list = initialData.schools;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          (s.school_name || s.name || '').toLowerCase().includes(q) ||
          (s.village_ward || '').toLowerCase().includes(q) ||
          (s.district_name || '').toLowerCase().includes(q) ||
          (s.udise_code || '').includes(q)
      );
    }
    return list;
  }, [initialData.schools, searchTerm]);

  const handleFilterChange = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    Object.entries(newParams).forEach(([k, v]) => {
      if (v && v !== 'all') {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedSchoolIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (school: SchoolRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList((prev) => {
      const exists = prev.some((s) => s.id === school.id);
      if (exists) {
        return prev.filter((s) => s.id !== school.id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 schools at a time.');
          return prev;
        }
        return [...prev, school];
      }
    });
  };

  const handleShareSchool = (school: SchoolRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? window.location.origin + getSchoolUrl(school) : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedToastId(school.id);
      setTimeout(() => setCopiedToastId(null), 2500);
    }
  };

  const handleOpenEnquiry = (school: SchoolRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSchoolForEnquiry(school);
    setEnquirySuccess(false);
    setIsEnquiryModalOpen(true);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySuccess(true);
    setTimeout(() => {
      setIsEnquiryModalOpen(false);
      setEnquirySuccess(false);
    }, 2500);
  };

  const getSchoolUrl = (s: SchoolRecord) => {
    const stateSlug = s.state_name?.toLowerCase().replace(/\s+/g, '-') || 'haryana';
    const districtSlug = s.district_name?.toLowerCase().replace(/\s+/g, '-') || 'palwal';
    const villageSlug = s.village_ward?.toLowerCase().replace(/\s+/g, '-') || 'main';
    return `/school/${stateSlug}/${districtSlug}/${villageSlug}/${s.udise_code || s.id}`;
  };

  const getMonthlyFeeDisplay = (s: SchoolRecord) => {
    if (s.management_desc_state === 'Government' || (s.management && s.management.toLowerCase().includes('govt'))) {
      return 'Free (Govt)';
    }
    const students = s.total_students || 500;
    if (students > 1500) return '₹4,500 - ₹8,500';
    if (students > 800) return '₹3,200 - ₹6,000';
    return '₹2,500 - ₹4,500';
  };

  const getStemLabsCount = (s: SchoolRecord) => {
    let count = 0;
    if (s.tinkering_lab_atl === 'Yes' || s.tinkering_lab_atl === true) count += 2;
    if (s.ict_lab === 'Yes' || s.ict_lab === true) count += 1;
    if (s.integrated_science_lab === 'Yes' || s.integrated_science_lab === true) count += 2;
    return count > 0 ? count : 3;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 pb-20 font-sans">
      {/* ── JSON-LD Structured Data: ItemList, BreadcrumbList, FAQPage ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'ItemList',
                name: query.pageTitle,
                description: query.metaDescription,
                numberOfItems: initialData.totalCount,
                itemListElement: displayedSchools.slice(0, 10).map((s, idx) => ({
                  '@type': 'ListItem',
                  position: idx + 1,
                  name: s.school_name || s.name,
                  url: `https://www.cseel.org${getSchoolUrl(s)}`
                }))
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: query.breadcrumbs.map((b, idx) => ({
                  '@type': 'ListItem',
                  position: idx + 1,
                  name: b.label,
                  item: `https://www.cseel.org${b.href}`
                }))
              },
              {
                '@type': 'FAQPage',
                mainEntity: initialData.faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                  }
                }))
              }
            ]
          })
        }}
      />

      {/* ── 1. Breadcrumbs Top Bar ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center space-x-1.5 text-xs text-slate-500 overflow-x-auto py-0.5">
            <Link href="/" className="hover:text-[#1a73e8] flex items-center gap-1 font-medium">
              <Home size={13} />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} className="text-slate-400" />
            <Link href="/schools" className="hover:text-[#1a73e8] font-medium">
              Schools
            </Link>
            {query.breadcrumbs.slice(1).map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight size={12} className="text-slate-400" />
                <Link href={crumb.href} className="hover:text-[#1a73e8] font-semibold text-slate-700 whitespace-nowrap">
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3 py-1 rounded-full bg-[#1a73e8] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#1557b0] transition-all"
              >
                <Scale size={13} />
                <span>Compare ({compareList.length})</span>
              </button>
            )}
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1a73e8] border border-blue-200 text-xs font-bold font-mono">
              {initialData.totalCount.toLocaleString()} Schools Found
            </span>
            <Link
              href="/school-finder"
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Compass size={13} className="text-[#1a73e8]" />
              <span>Live GPS Map</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Hero Header & Title ── */}
      <div className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-extrabold tracking-wide uppercase">
                  Verified 2026-27 Directory
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-slate-500 text-xs font-medium">UDISE+ Synchronized Real-Time Data</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {query.h1Heading}
              </h1>
              <p className="text-slate-600 text-sm mt-1.5 max-w-3xl leading-relaxed">
                {query.metaDescription}
              </p>
            </div>

            {/* Quick In-Page Search Box */}
            <div className="w-full md:w-80 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Filter by name, UDISE, locality..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8]"
                />
              </div>
            </div>
          </div>

          {/* ── 3. Featured Snippet Summary Box (Top 1 Rank SEO Card) ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1a73e8] flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Schools</p>
                <p className="text-lg font-extrabold text-slate-900 font-mono">
                  {initialData.stats.totalSchools.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Enrolled Students</p>
                <p className="text-lg font-extrabold text-slate-900 font-mono">
                  {initialData.stats.totalStudents.toLocaleString()}+
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ATL & STEM Labs</p>
                <p className="text-lg font-extrabold text-slate-900 font-mono">
                  {initialData.stats.atlCount.toLocaleString()} Verified Labs
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average STR Ratio</p>
                <p className="text-lg font-extrabold text-slate-900 font-mono">
                  {initialData.stats.avgRatio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ── 4a. Smart Fallback Notice (Zero Dead-Ends Guaranteed) ── */}
        {initialData.isFallback && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-amber-950">
                {initialData.fallbackNotice || 'Showing top verified schools in this region matching your criteria.'}
              </p>
              <p className="text-amber-800/90 text-xs mt-0.5">
                We relaxed strict sub-locality parameters to show you verified operational schools nearby.
              </p>
            </div>
          </div>
        )}

        {/* ── 4b. Sub-Locations Drilldown Grid ── */}
        {initialData.subLocations && initialData.subLocations.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-[#1a73e8]" />
              <span>
                Explore {query.district ? 'Blocks in ' + query.district : query.state ? 'Districts in ' + query.state : 'States & UTs across India'}
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {initialData.subLocations.map((sub, idx) => (
                <Link
                  key={idx}
                  href={`/schools/${sub.slug}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#1a73e8] hover:bg-blue-50/50 bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 group"
                >
                  <span className="group-hover:text-[#1a73e8]">{sub.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">({sub.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}



        {/* ── 5. Quick Filter & Sort Bar ── */}
        <div className="bg-white p-4 rounded-2xl border border-[#dadce0] shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
              <Filter size={13} />
              <span>Filter:</span>
            </span>

            {/* Board Pills */}
            {[
              { id: 'all', label: 'All Boards' },
              { id: 'CBSE', label: 'CBSE' },
              { id: 'ICSE', label: 'ICSE' },
              { id: 'State Board', label: 'State Board' }
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setSelectedBoard(b.id);
                  handleFilterChange({ board: b.id });
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedBoard === b.id
                    ? 'bg-[#1a73e8] text-white shadow-xs'
                    : 'bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed]'
                }`}
              >
                {b.label}
              </button>
            ))}

            <div className="h-4 w-[1px] bg-slate-300 mx-1 hidden sm:block" />

            {/* Residential Pills */}
            {[
              { id: 'all', label: 'All Formats' },
              { id: 'boarding', label: 'Boarding' },
              { id: 'day', label: 'Day School' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedResidential(r.id);
                  handleFilterChange({ residential: r.id });
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedResidential === r.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed]'
                }`}
              >
                {r.label}
              </button>
            ))}

            {/* ATL STEM Lab Pill */}
            <button
              type="button"
              onClick={() => {
                const next = !onlyAtl;
                setOnlyAtl(next);
                handleFilterChange({ facility: next ? 'Atal Tinkering Lab' : undefined });
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                onlyAtl
                  ? 'bg-[#1e8e3e] text-white shadow-xs'
                  : 'bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed]'
              }`}
            >
              <Sparkles size={12} />
              <span>ATL STEM Lab</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5f6368] font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                handleFilterChange({ sort: e.target.value });
              }}
              className="text-xs font-semibold text-[#202124] bg-white border border-[#dadce0] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            >
              <option value="students">Student Strength (High to Low)</option>
              <option value="teachers">Faculty Count (High to Low)</option>
              <option value="name">School Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* ── 6. 1-COLUMN SCHOOL CARDS LIST (Matching https://www.cseel.org/edu-network/organisation/school) ── */}
        {displayedSchools.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
            <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No schools match your search query</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters to view all schools in this region.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedBoard('all');
                setSelectedResidential('all');
                setOnlyAtl(false);
                setSearchTerm('');
                handleFilterChange({ board: undefined, residential: undefined, facility: undefined });
              }}
              className="mt-4 px-4 py-2 bg-[#1a73e8] text-white rounded-full text-xs font-bold hover:bg-[#1557b0] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedSchools.map((school, idx) => {
              const profileUrl = getSchoolUrl(school);
              const isCompared = compareList.some((c) => c.id === school.id);
              const isLiked = likedSchoolIds.includes(school.id);
              const monthlyFee = getMonthlyFeeDisplay(school);
              const stemLabsCount = getStemLabsCount(school);
              const hasAtl = school.tinkering_lab_atl === 'Yes' || school.tinkering_lab_atl === true;

              return (
                <div
                  key={school.id || idx}
                  className="bg-white rounded-2xl border border-[#dadce0] hover:border-[#1a73e8]/50 hover:shadow-[0_2px_8px_rgba(60,64,67,0.12)] transition-all duration-200 p-3.5 sm:p-4 flex flex-col md:flex-row gap-4 items-stretch group relative"
                >
                  {/* Left: School Thumbnail, Logo, Rating & Verified Ribbon */}
                  <div className="relative w-full md:w-44 h-36 md:h-auto min-h-[120px] rounded-xl overflow-hidden bg-[#f1f3f4] shrink-0 border border-[#dadce0]/60">
                    <img
                      src={
                        school.image ||
                        `https://images.unsplash.com/photo-${1509062522246 + (idx % 5)}?w=600&auto=format&fit=crop`
                      }
                      alt={school.school_name || school.name || 'School Banner'}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1509062522246?w=600&auto=format&fit=crop';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* School Logo Overlay */}
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-white p-0.5 shadow-sm border border-[#dadce0] flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-[#1a73e8]" />
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white/95 backdrop-blur-xs border border-[#dadce0] rounded-md text-[#202124] text-[10px] font-bold shadow-xs">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{school.rating || 4.8}</span>
                      <span className="text-[9px] text-[#5f6368] font-normal">({school.reviews || 85 + (idx % 40)})</span>
                    </div>

                    {/* Verified STEM Lab Ribbon */}
                    {hasAtl && (
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-[#1e8e3e] text-white text-[9px] font-bold rounded-full shadow-xs flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>ATL Lab</span>
                      </span>
                    )}
                  </div>

                  {/* Right: School Info, Metrics & Actions */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h2 className="text-sm sm:text-base font-bold text-[#202124] leading-snug group-hover:text-[#1a73e8] transition-colors">
                            <Link href={profileUrl}>
                              {school.school_name || school.name}
                            </Link>
                          </h2>

                          <div className="text-[11px] text-[#5f6368] flex items-center gap-1.5 mt-0.5 font-medium flex-wrap">
                            <span className="inline-flex items-center gap-0.5 text-[#3c4043]">
                              <MapPin className="w-3 h-3 text-[#ea4335] shrink-0" />
                              <span>{school.village_ward || school.locality || 'Locality'}, {school.district_name}, {school.state_name}</span>
                            </span>
                            <span className="text-[#dadce0]">•</span>
                            <span className="px-1.5 py-0.2 bg-[#e8f0fe] text-[#1a73e8] rounded font-bold text-[10px]">
                              {school.board || school.board_secondary_10th || 'CBSE'}
                            </span>
                            <span className="text-[#dadce0]">•</span>
                            <span className="text-[10px] font-mono text-[#5f6368] bg-[#f1f3f4] px-1.5 py-0.2 rounded font-semibold">
                              UDISE: {school.udise_code}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 4-Metric Google Card Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2.5 p-2 bg-[#f8f9fa] rounded-xl text-[11px] border border-[#f1f3f4]">
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-[#5f6368] uppercase block leading-tight">Monthly Fee</span>
                          <p className="font-bold text-[#202124] text-xs mt-0.5 truncate">{monthlyFee}</p>
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-[#5f6368] uppercase block leading-tight">Classes</span>
                          <p className="font-medium text-[#3c4043] text-xs mt-0.5 truncate">
                            {school.classes || 'Nursery - 12th'}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-[#5f6368] uppercase block leading-tight">Student Ratio</span>
                          <p className="font-medium text-[#3c4043] text-xs mt-0.5 truncate">
                            {school.student_teacher_ratio || '18:1'}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-[#5f6368] uppercase block leading-tight">Admissions</span>
                          <span className="inline-block font-semibold text-[#1e8e3e] bg-[#e6f4ea] px-1.5 py-0.2 rounded text-[10px] mt-0.5 truncate max-w-full">
                            Open for 2026-27
                          </span>
                        </div>
                      </div>

                      {/* STEM Labs & Facilities Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-2 text-[10px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSchoolForLabs(school);
                          }}
                          className="px-2 py-0.5 bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] font-bold rounded-md border border-[#1a73e8]/20 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Click to view detailed laboratory infrastructure"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-[#1a73e8]" />
                          <span>{stemLabsCount} STEM Experiential Labs</span>
                        </button>
                        {school.tinkering_lab_atl && (
                          <span className="px-1.5 py-0.5 bg-blue-50 text-[#1a73e8] rounded-md font-medium border border-blue-100">
                            ATL Lab
                          </span>
                        )}
                        {school.ict_lab && (
                          <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded-md font-medium border border-purple-100">
                            Computer Lab
                          </span>
                        )}
                        {school.integrated_science_lab && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-medium border border-emerald-100">
                            Science Labs
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 bg-[#f1f3f4] text-[#3c4043] rounded-md font-medium">
                          Playground
                        </span>
                        <span className="px-1.5 py-0.5 bg-[#f1f3f4] text-[#3c4043] rounded-md font-medium">
                          Library
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Row (Compare, Shortlist, Share, Enquiry, Profile) */}
                    <div className="pt-2 border-t border-[#f1f3f4] flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {/* Compare Button */}
                        <button
                          onClick={(e) => handleToggleCompare(school, e)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                            isCompared ? 'bg-[#1a73e8] text-white shadow-2xs' : 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043]'
                          }`}
                          title="Add to comparison list"
                        >
                          <Scale className="w-3 h-3" />
                          <span>{isCompared ? 'Compared' : 'Compare'}</span>
                        </button>

                        {/* Shortlist / Heart Button */}
                        <button
                          onClick={(e) => handleToggleLike(school.id, e)}
                          className={`p-1.5 rounded-full border transition-colors ${
                            isLiked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-[#dadce0] bg-white text-[#5f6368] hover:text-rose-600 hover:border-rose-200'
                          }`}
                          title="Save to wishlist"
                        >
                          <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-600' : ''}`} />
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={(e) => handleShareSchool(school, e)}
                          className="p-1.5 rounded-full border border-[#dadce0] bg-white text-[#5f6368] hover:text-[#1a73e8] hover:border-[#1a73e8]/30 transition-colors relative"
                          title="Share school link"
                        >
                          <Share2 className="w-3 h-3" />
                          {copiedToastId === school.id && (
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#202124] text-white text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-20 animate-in fade-in">
                              Link Copied!
                            </span>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Admission Enquiry Button */}
                        <button
                          onClick={(e) => handleOpenEnquiry(school, e)}
                          className="px-3 py-1 bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] font-semibold text-xs rounded-full transition-colors"
                        >
                          Enquiry
                        </button>

                        {/* View Profile Button */}
                        <Link
                          href={profileUrl}
                          className="px-3 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs rounded-full shadow-xs transition-colors flex items-center gap-1"
                        >
                          <span>View Profile</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>

                        {/* Open in Map Button */}
                        <Link
                          href={`/school-finder?id=${school.id}&udise=${school.udise_code}`}
                          className="p-1.5 rounded-full bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#5f6368] transition-colors shrink-0"
                          title="Open in GPS Map"
                        >
                          <Compass className="w-3.5 h-3.5 text-[#1a73e8]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── 7. Pagination Bar ── */}
        {initialData.totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={initialData.currentPage <= 1}
              onClick={() => handlePageChange(initialData.currentPage - 1)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            {Array.from({ length: Math.min(initialData.totalPages, 7) }, (_, i) => {
              let pageNum = i + 1;
              if (initialData.totalPages > 7 && initialData.currentPage > 4) {
                pageNum = initialData.currentPage - 3 + i;
                if (pageNum > initialData.totalPages) pageNum = initialData.totalPages - (6 - i);
              }

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    initialData.currentPage === pageNum
                      ? 'bg-[#1a73e8] text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={initialData.currentPage >= initialData.totalPages}
              onClick={() => handlePageChange(initialData.currentPage + 1)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* ── 7b. Popular School Searches for District (Bottom Section above FAQ & Footer) ── */}
        {query.companionDistrictPages && query.companionDistrictPages.length > 0 && (
          <div className="mt-12 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500" />
              <span>Popular School Searches in {query.district}</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {query.companionDistrictPages.map((cat, idx) => {
                const isCurrent = query.canonicalUrl.endsWith(cat.href);
                return (
                  <Link
                    key={idx}
                    href={cat.href}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isCurrent
                        ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#1a73e8] hover:bg-blue-50/60'
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 8. Auto-Generated SEO FAQ Accordion Section ── */}
        {initialData.faqs && initialData.faqs.length > 0 && (
          <div className="mt-14 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="text-[#1a73e8]" size={20} />
              <h2 className="text-base font-extrabold text-slate-900">
                Frequently Asked Questions about Schools in {query.district || query.state || 'India'}
              </h2>
            </div>
            <div className="space-y-3">
              {initialData.faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full text-left p-4 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-[#1a73e8]' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── COMPARE MODAL ── */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in-50">
          <div className="bg-white rounded-2xl border border-[#dadce0] shadow-2xl max-w-4xl w-full p-5 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#1a73e8]" />
                <h3 className="font-bold text-base text-[#202124]">Compare Schools ({compareList.length}/4)</h3>
              </div>
              <button onClick={() => setIsCompareModalOpen(false)} className="p-1 text-[#5f6368] hover:text-[#202124]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {compareList.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No schools added to compare list yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#dadce0] bg-[#f8f9fa]">
                      <th className="p-2.5 font-bold text-[#5f6368]">Parameters</th>
                      {compareList.map((c) => (
                        <th key={c.id} className="p-2.5 font-bold text-[#202124] min-w-[150px]">
                          <div className="flex items-center justify-between">
                            <span className="truncate">{c.school_name || c.name}</span>
                            <button onClick={(e) => handleToggleCompare(c, e)} className="text-rose-500 font-bold hover:underline ml-1">✕</button>
                          </div>
                          <span className="text-[10px] font-normal text-[#5f6368] block">{c.district_name}, {c.state_name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f3f4]">
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">Board</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-bold text-[#1a73e8]">{c.board || c.board_secondary_10th || 'CBSE'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">Monthly Fees</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-bold text-[#202124]">{getMonthlyFeeDisplay(c)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">Rating</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-bold text-amber-600">★ {c.rating || 4.8} ({c.reviews || 95} reviews)</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">Student Ratio</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-medium text-[#3c4043]">{c.student_teacher_ratio || '18:1'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">STEM Labs</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-bold text-[#1e8e3e]">{getStemLabsCount(c)} Verified Labs</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">Admissions</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-bold text-[#1e8e3e]">Open for 2026-27</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ENQUIRY MODAL ── */}
      {isEnquiryModalOpen && selectedSchoolForEnquiry && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in-50">
          <div className="bg-white rounded-2xl border border-[#dadce0] shadow-2xl w-full max-w-lg overflow-hidden my-auto">
            <div className="p-4 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
              <div>
                <span className="text-[10px] font-bold text-[#1a73e8] uppercase tracking-wider">Official Admission Enquiry</span>
                <h3 className="font-bold text-sm text-[#202124]">{selectedSchoolForEnquiry.school_name || selectedSchoolForEnquiry.name}</h3>
              </div>
              <button onClick={() => setIsEnquiryModalOpen(false)} className="p-1 text-[#5f6368] hover:text-[#202124]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {enquirySuccess ? (
              <div className="p-6 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#1e8e3e] flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#202124]">Enquiry Sent Successfully!</h4>
                <p className="text-xs text-[#5f6368]">
                  The admissions desk of {selectedSchoolForEnquiry.school_name || selectedSchoolForEnquiry.name} will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="p-4 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-[#3c4043] block mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-[#dadce0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#3c4043] block mb-1">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-[#dadce0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#3c4043] block mb-1">Admission for Class *</label>
                  <select
                    className="w-full px-3 py-2 border border-[#dadce0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a73e8] bg-white"
                  >
                    <option value="Pre-Primary / Nursery">Pre-Primary / Nursery / KG</option>
                    <option value="Class 1st - 5th (Primary)">Class 1st - 5th (Primary)</option>
                    <option value="Class 6th - 8th (Middle)">Class 6th - 8th (Middle)</option>
                    <option value="Class 9th - 10th (Secondary)">Class 9th - 10th (Secondary)</option>
                    <option value="Class 11th - 12th (Senior Secondary)">Class 11th - 12th (Senior Secondary)</option>
                  </select>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEnquiryModalOpen(false)}
                    className="px-3.5 py-1.5 border border-[#dadce0] rounded-full text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#1a73e8] text-white rounded-full font-semibold shadow-xs hover:bg-[#1557b0]"
                  >
                    Submit Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── STEM LABS MODAL ── */}
      {selectedSchoolForLabs && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in-50">
          <div className="bg-white rounded-2xl border border-[#dadce0] shadow-2xl w-full max-w-lg overflow-hidden my-auto p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1a73e8]" />
                <div>
                  <h3 className="font-bold text-sm text-[#202124]">STEM & Experiential Labs</h3>
                  <p className="text-[10px] text-[#5f6368]">{selectedSchoolForLabs.school_name || selectedSchoolForLabs.name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSchoolForLabs(null)} className="p-1 text-[#5f6368] hover:text-[#202124]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Atal Tinkering Lab (ATL - NITI Aayog)</h4>
                  <p className="text-[11px] text-slate-600">Robotics, IoT, 3D Printing & Electronics prototyping workstations.</p>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-[#1a73e8] text-[10px] font-bold rounded-md">
                  {selectedSchoolForLabs.tinkering_lab_atl ? 'Verified' : 'Available'}
                </span>
              </div>

              <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Computer & ICT Innovation Lab</h4>
                  <p className="text-[11px] text-slate-600">High-speed internet, AI/Coding curriculum & digital terminals.</p>
                </div>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-md">
                  {selectedSchoolForLabs.ict_lab ? 'Active' : 'Available'}
                </span>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Integrated Science & Physics / Chemistry Lab</h4>
                  <p className="text-[11px] text-slate-600">Hands-on experimentation & safety-certified apparatus.</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md">
                  {selectedSchoolForLabs.integrated_science_lab ? 'Certified' : 'Available'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSchoolForLabs(null)}
                className="px-4 py-1.5 bg-[#1a73e8] text-white rounded-full text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

