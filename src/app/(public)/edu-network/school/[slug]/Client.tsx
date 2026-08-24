'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2, MapPin, Star, CheckCircle2, SlidersHorizontal,
  Search, ArrowRight, ExternalLink, Phone, Mail, Filter,
  Share2, Heart, Scale, X, Check, Globe, ChevronRight,
  Sparkles, Award, Users, BookOpen
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import ShareButton from '@/components/shared/ShareButton';
import { ALL_ORGANIZATIONS, OrganizationItem } from '@/lib/eduNetworkData';

interface CitySchoolPageClientProps {
  slug: string;
  cityName: string;
  categoryTitle: string;
  categoryDesc: string;
}

export const POPULAR_CITIES = [
  { name: 'All India', slug: 'top-schools-in-india' },
  { name: 'Delhi NCR', slug: 'schools-in-delhi' },
  { name: 'Mumbai', slug: 'schools-in-mumbai' },
  { name: 'Bengaluru', slug: 'schools-in-bengaluru' },
  { name: 'Pune', slug: 'schools-in-pune' },
  { name: 'Bhubaneswar', slug: 'schools-in-bhubaneswar' },
  { name: 'Lucknow', slug: 'schools-in-lucknow' },
  { name: 'Jaipur', slug: 'schools-in-jaipur' },
  { name: 'Hyderabad', slug: 'schools-in-hyderabad' },
  { name: 'Chennai', slug: 'schools-in-chennai' },
  { name: 'Kolkata', slug: 'schools-in-kolkata' },
  { name: 'Ahmedabad', slug: 'schools-in-ahmedabad' },
  { name: 'Dehradun', slug: 'schools-in-dehradun' },
  { name: 'Patna', slug: 'schools-in-patna' },
  { name: 'Bhopal', slug: 'schools-in-bhopal' },
];

export default function CitySchoolDirectoryClient({
  slug,
  cityName,
  categoryTitle,
  categoryDesc,
}: CitySchoolPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<string>('All');
  const [selectedAdmissionStatus, setSelectedAdmissionStatus] = useState<string>('All');
  const [maxMonthlyFee, setMaxMonthlyFee] = useState<number>(50000);
  const [onlyWithLabs, setOnlyWithLabs] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'feeAsc' | 'feeDesc'>('popularity');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Compare & Enquiry state
  const [compareList, setCompareList] = useState<OrganizationItem[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [likedOrgIds, setLikedOrgIds] = useState<string[]>([]);
  const [selectedOrgForEnquiry, setSelectedOrgForEnquiry] = useState<OrganizationItem | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    parentName: '',
    studentName: '',
    grade: 'Class 9',
    phone: '',
    email: '',
    message: '',
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Filter organizations by city and query
  const cityOrgs = useMemo(() => {
    return ALL_ORGANIZATIONS.filter((org) => {
      // If specific city page, match city
      if (cityName !== 'All India') {
        const matchesCity =
          org.city.toLowerCase().includes(cityName.toLowerCase()) ||
          (cityName === 'Delhi' && (org.city.includes('Delhi') || org.city.includes('Noida')));
        if (!matchesCity) return false;
      }

      // If board slug (e.g. cbse-schools-in-india)
      if (slug.startsWith('cbse-') && org.board !== 'CBSE') return false;
      if (slug.startsWith('icse-') && org.board !== 'ICSE') return false;
      if (slug.startsWith('ib-') && org.board !== 'IB') return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          org.name.toLowerCase().includes(q) ||
          org.city.toLowerCase().includes(q) ||
          (org.locality || '').toLowerCase().includes(q) ||
          (org.board || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Board
      if (selectedBoard !== 'All' && org.board !== selectedBoard) return false;

      // Admission status
      if (selectedAdmissionStatus !== 'All' && org.admissionStatus !== selectedAdmissionStatus) return false;

      // Max monthly fee
      if (org.monthlyFeesNum && org.monthlyFeesNum > maxMonthlyFee) return false;

      // Only with labs
      if (onlyWithLabs && org.stemLabsCount <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'feeAsc') return (a.monthlyFeesNum || 0) - (b.monthlyFeesNum || 0);
      if (sortBy === 'feeDesc') return (b.monthlyFeesNum || 0) - (a.monthlyFeesNum || 0);
      return b.reviews - a.reviews; // popularity
    });
  }, [cityName, slug, searchQuery, selectedBoard, selectedAdmissionStatus, maxMonthlyFee, onlyWithLabs, sortBy]);

  const handleToggleCompare = (org: OrganizationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === org.id);
      if (exists) {
        return prev.filter((item) => item.id !== org.id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 institutions at a time.');
        return prev;
      }
      return [...prev, org];
    });
  };

  const handleToggleLike = (orgId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedOrgIds((prev) =>
      prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]
    );
  };

  const handleOpenEnquiry = (org: OrganizationItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOrgForEnquiry(org);
    setIsEnquiryModalOpen(true);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setIsEnquiryModalOpen(false);
      setEnquiryForm({ parentName: '', studentName: '', grade: 'Class 9', phone: '', email: '', message: '' });
    }, 1800);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-28">
        
        {/* ── BREADCRUMB & HEADER SECTION ───────────────────────────────── */}
        <div className="bg-white border-b border-slate-200/90 pt-6 pb-6 px-4">
          <div className="max-w-7xl mx-auto space-y-3">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/edu-network" className="hover:text-primary transition-colors">EduNetwork</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/edu-network/school" className="hover:text-primary transition-colors">Schools</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-900">{cityName}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-[11px] font-bold mb-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Verified STEM & Experiential Science Directory</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {categoryTitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1">
                  {categoryDesc} Showing <strong className="text-slate-900 font-black">{cityOrgs.length} verified schools & institutions</strong> with live laboratory infrastructure, fees, and admission status.
                </p>
              </div>

              {/* Compare Button if items selected */}
              {compareList.length > 0 && (
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 shrink-0 animate-bounce"
                >
                  <Scale className="w-4 h-4" />
                  <span>Compare ({compareList.length}/4 Schools)</span>
                </button>
              )}
            </div>

            {/* City Carousel Quick Filter Badges */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Explore Schools by Major City:</p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {POPULAR_CITIES.map((c) => {
                  const isActive = slug === c.slug;
                  return (
                    <Link
                      key={c.slug}
                      href={`/edu-network/school/${c.slug}`}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {c.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT: FILTER BAR & SCHOOL CARDS ────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* ── LEFT FILTER SIDEBAR (DESKTOP) ── */}
            <div className="hidden lg:block bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-5 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span>Filter Schools</span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedBoard('All');
                    setSelectedAdmissionStatus('All');
                    setMaxMonthlyFee(50000);
                    setOnlyWithLabs(false);
                    setSearchQuery('');
                  }}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Search Inside City */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Search Name or Locality</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search in ${cityName}...`}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Board Filter */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Board / Affiliation</label>
                <select
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="All">All Boards (CBSE, ICSE, IB)</option>
                  <option value="CBSE">CBSE Board</option>
                  <option value="ICSE">ICSE Board</option>
                  <option value="IB">IB / Cambridge</option>
                  <option value="State Board">State Board</option>
                </select>
              </div>

              {/* Monthly Fee Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <label className="font-bold text-slate-700">Max Monthly Fee</label>
                  <span className="font-black text-blue-700">₹{maxMonthlyFee.toLocaleString()}/mo</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={50000}
                  step={2000}
                  value={maxMonthlyFee}
                  onChange={(e) => setMaxMonthlyFee(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>₹5k</span>
                  <span>₹25k</span>
                  <span>₹50k+</span>
                </div>
              </div>

              {/* Admission Status */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Admission Status</label>
                <select
                  value={selectedAdmissionStatus}
                  onChange={(e) => setSelectedAdmissionStatus(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open for 2026-27">Open for 2026-27</option>
                  <option value="On Going">On Going</option>
                  <option value="Closing Soon">Closing Soon</option>
                  <option value="Merit Based">Merit Based</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div className="pt-2 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyWithLabs}
                    onChange={(e) => setOnlyWithLabs(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Has Verified STEM Labs</span>
                </label>
              </div>
            </div>

            {/* ── RIGHT LISTING AREA ── */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Sort & Mobile Filter Button Header */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-2xs">
                <span className="text-slate-600 font-bold">
                  Showing <strong className="text-slate-900">{cityOrgs.length}</strong> institutions in {cityName}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden px-3 py-1.5 bg-slate-100 font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filter</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-bold hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                    >
                      <option value="popularity">Most Popular</option>
                      <option value="rating">Highest Rated</option>
                      <option value="feeAsc">Fee: Low to High</option>
                      <option value="feeDesc">Fee: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* School Cards Grid */}
              {cityOrgs.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-base text-slate-800">No schools matching your filters in {cityName}</h3>
                  <p className="text-xs text-slate-500">Try broadening your fee range or selecting a different board.</p>
                  <button
                    onClick={() => {
                      setSelectedBoard('All');
                      setSelectedAdmissionStatus('All');
                      setMaxMonthlyFee(50000);
                      setOnlyWithLabs(false);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cityOrgs.map((org) => {
                    const isCompared = compareList.some((c) => c.id === org.id);
                    const isLiked = likedOrgIds.includes(org.id);

                    return (
                      <div
                        key={org.id}
                        className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-stretch relative group"
                      >
                        {/* School Logo / Image thumbnail */}
                        <div className="relative w-full md:w-48 h-36 md:h-auto rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          <img
                            src={org.bannerImage || org.logo}
                            alt={org.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-slate-100 flex items-center justify-center">
                            <img src={org.logo} alt={org.name} className="w-full h-full object-contain rounded-lg" />
                          </div>
                          {org.verified && (
                            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full shadow-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified Lab</span>
                            </span>
                          )}
                        </div>

                        {/* School Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                                    <Link href={`/edu-network/org/${org.id}`}>
                                      {org.name}
                                    </Link>
                                  </h2>
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                  <span>{org.locality ? `${org.locality}, ` : ''}{org.city}, {org.state}</span>
                                  <span>•</span>
                                  <span className="font-bold text-slate-700">{org.board || 'CBSE'}</span>
                                </p>
                              </div>

                              {/* Rating badge */}
                              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-black shrink-0">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span>{org.rating}</span>
                                <span className="text-[10px] text-slate-400 font-normal">({org.reviews})</span>
                              </div>
                            </div>

                            {/* UniApply-Style Key Metrics Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 p-3 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Fee</span>
                                <p className="font-black text-slate-900">{org.monthlyFees || '₹12,000 / mo'}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Classes</span>
                                <p className="font-bold text-slate-800">{org.classesOffered || 'Nursery - 12th'}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Student Ratio</span>
                                <p className="font-bold text-slate-800">{org.studentFacultyRatio || '20:1'}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Admissions</span>
                                <span className="inline-block font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md text-[11px]">
                                  {org.admissionStatus || 'Open 2026-27'}
                                </span>
                              </div>
                            </div>

                            {/* Facilities Pills */}
                            <div className="flex items-center gap-1.5 flex-wrap mt-3 text-[11px]">
                              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-100 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-blue-600" />
                                <span>{org.stemLabsCount} STEM Labs</span>
                              </span>
                              {org.facilities.slice(0, 3).map((f, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg">
                                  {f}
                                </span>
                              ))}
                              {org.facilities.length > 3 && (
                                <span className="text-[10px] text-slate-400 font-bold">
                                  +{org.facilities.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              {/* Compare Checkbox */}
                              <button
                                onClick={(e) => handleToggleCompare(org, e)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                  isCompared
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                <Scale className="w-3.5 h-3.5" />
                                <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                              </button>

                              {/* Save/Like */}
                              <button
                                onClick={(e) => handleToggleLike(org.id, e)}
                                className={`p-1.5 rounded-xl border transition-all ${
                                  isLiked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500'
                                }`}
                                title="Shortlist school"
                              >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleOpenEnquiry(org, e)}
                                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
                              >
                                Apply / Enquire
                              </button>

                              <Link
                                href={`/edu-network/org/${org.id}`}
                                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-all"
                              >
                                <span>View Profile</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── COMPARISON MODAL ───────────────────────────────────────────── */}
        {isCompareModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600" />
                  <span>Compare Schools ({compareList.length}/4)</span>
                </h3>
                <button onClick={() => setIsCompareModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-x-auto flex-1">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="p-3 font-bold text-slate-400 w-36">Metric</th>
                      {compareList.map((c) => (
                        <th key={c.id} className="p-3 font-black text-slate-900 min-w-[200px]">
                          <div className="flex items-center justify-between">
                            <span>{c.name}</span>
                            <button
                              onClick={() => setCompareList((prev) => prev.filter((item) => item.id !== c.id))}
                              className="text-rose-500 text-[10px] hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <span className="text-[10px] font-normal text-slate-500 block">{c.city}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-500">Board</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-3 font-black text-blue-700">{c.board || 'CBSE'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-500">Monthly Fees</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-3 font-black text-slate-900">{c.monthlyFees || '₹12,000 / mo'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-500">Rating</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-3 font-bold text-amber-600">★ {c.rating} ({c.reviews} reviews)</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-500">Student-Faculty Ratio</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-3 font-bold text-slate-700">{c.studentFacultyRatio || '20:1'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-500">STEM Labs Count</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-3 font-bold text-emerald-700">{c.stemLabsCount} Verified Labs</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-500">Admissions</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-3 font-black text-emerald-600">{c.admissionStatus || 'Open for 2026-27'}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ENQUIRY MODAL ──────────────────────────────────────────────── */}
        {isEnquiryModalOpen && selectedOrgForEnquiry && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-auto">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Admission & Lab Tour Enquiry</span>
                  <h3 className="font-black text-base text-slate-900">{selectedOrgForEnquiry.name}</h3>
                </div>
                <button onClick={() => setIsEnquiryModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {enquirySuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-base text-slate-900">Enquiry Sent Successfully!</h4>
                  <p className="text-xs text-slate-500">The admission and STEM lab counseling desk of {selectedOrgForEnquiry.name} will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="p-6 space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Parent / Guardian Name *</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.parentName}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, parentName: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Student Name</label>
                      <input
                        type="text"
                        value={enquiryForm.studentName}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, studentName: e.target.value })}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Applying for Grade</label>
                      <select
                        value={enquiryForm.grade}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, grade: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                      >
                        <option value="Nursery">Nursery / KG</option>
                        <option value="Class 1-5">Class 1st - 5th</option>
                        <option value="Class 6-8">Class 6th - 8th (Middle)</option>
                        <option value="Class 9">Class 9th (Secondary)</option>
                        <option value="Class 10">Class 10th (Secondary)</option>
                        <option value="Class 11">Class 11th (Senior Secondary)</option>
                        <option value="Class 12">Class 12th (Senior Secondary)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="parent@example.com"
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs rounded-xl shadow-md transition-all mt-4"
                  >
                    Submit Admission Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
