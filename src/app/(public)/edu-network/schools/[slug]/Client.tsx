'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2, MapPin, Star, Sparkles, Filter, ChevronRight,
  Search, SlidersHorizontal, Scale, Heart, Share2, ArrowRight,
  X, Check, CheckCircle2, ChevronDown, Award, Globe, Phone, Mail,
  Calendar, Layers, School, GraduationCap, Compass, Navigation,
  ExternalLink, CheckCheck, HelpCircle
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { ALL_ORGANIZATIONS, OrganizationItem } from '@/lib/eduNetworkData';
import { supabaseSchoolService } from '@/features/edu-network/db/supabaseSchoolService';
import uniqueLocations from '@/data/unique_locations.json';
import { getSearchSuggestions, matchesClassLevel, getFuzzyScore, SearchSuggestion } from '@/features/edu-network/utils/fuzzySearch';

interface ClientProps {
  slug: string;
  categoryTitle: string;
  categoryDesc: string;
  cityName: string;
}

const POPULAR_CITIES = [
  { name: 'All India', slug: 'all' },
  { name: 'Delhi NCR', slug: 'delhi' },
  { name: 'Faridabad', slug: 'faridabad' },
  { name: 'Gurugram', slug: 'gurugram' },
  { name: 'Sonipat', slug: 'sonipat' },
  { name: 'Noida', slug: 'noida' },
  { name: 'Bengaluru', slug: 'bengaluru' },
  { name: 'Pune', slug: 'pune' },
  { name: 'Hyderabad', slug: 'hyderabad' },
  { name: 'Chennai', slug: 'chennai' },
  { name: 'Thane', slug: 'thane' },
  { name: 'Dehradun', slug: 'dehradun' },
  { name: 'Lucknow', slug: 'lucknow' },
  { name: 'Jaipur', slug: 'jaipur' },
  { name: 'Kolkata', slug: 'kolkata' },
  { name: 'Bhopal', slug: 'bhopal' },
  { name: 'Ahmedabad', slug: 'ahmedabad' }
];

export default function DirectoryClient({
  slug,
  categoryTitle,
  categoryDesc,
  cityName: initialCityName
}: ClientProps) {
  const router = useRouter();

  // Primary Filter States
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCityName, setSelectedCityName] = useState<string>(initialCityName || 'All India');
  const [selectedBoard, setSelectedBoard] = useState<string>('All');
  const [selectedClassLevel, setSelectedClassLevel] = useState<string>('All');
  const [selectedAdmissionStatus, setSelectedAdmissionStatus] = useState<string>('All');
  const [maxMonthlyFee, setMaxMonthlyFee] = useState<number>(50000);
  const [onlyWithLabs, setOnlyWithLabs] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'feeAsc' | 'feeDesc'>('popularity');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Search & Auto-Suggest State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Data & Modal States
  const [liveSchools, setLiveSchools] = useState<OrganizationItem[]>(ALL_ORGANIZATIONS);
  const [compareList, setCompareList] = useState<OrganizationItem[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [likedOrgIds, setLikedOrgIds] = useState<string[]>([]);
  const [selectedOrgForEnquiry, setSelectedOrgForEnquiry] = useState<OrganizationItem | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedOrgForLabsModal, setSelectedOrgForLabsModal] = useState<OrganizationItem | null>(null);
  const [copiedToastOrgId, setCopiedToastOrgId] = useState<string | null>(null);
  
  const [enquiryForm, setEnquiryForm] = useState({
    parentName: '',
    studentName: '',
    grade: 'Class 9',
    phone: '',
    email: '',
    message: ''
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Pagination & Infinite Scroll State
  const PAGE_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Load live schools from Supabase
  useEffect(() => {
    supabaseSchoolService.getSchools().then((data) => {
      if (data && data.length > 0) {
        setLiveSchools(data);
      }
    }).catch(() => {});
  }, []);

  // Close suggestions dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedState, selectedCityName, searchQuery, selectedBoard, selectedClassLevel, selectedAdmissionStatus, maxMonthlyFee, onlyWithLabs, sortBy]);

  // Clean location formatter helper
  const cleanLocation = (org: OrganizationItem) => {
    const parts: string[] = [];
    const add = (val?: string) => {
      if (!val) return;
      const s = val.trim();
      if (s && !parts.some(p => p.toLowerCase() === s.toLowerCase() || (p.length > 3 && s.toLowerCase().includes(p.toLowerCase())))) {
        parts.push(s);
      }
    };
    add(org.locality);
    add(org.city);
    add(org.state);
    return parts.join(', ') || org.city || 'India';
  };

  // State Counts Map
  const stateCountsMap = useMemo(() => {
    const map: Record<string, number> = { 'All': liveSchools.length };
    liveSchools.forEach((s) => {
      const st = s.state || 'Other';
      map[st] = (map[st] || 0) + 1;
    });
    return map;
  }, [liveSchools]);

  // Available Districts / Cities based on Selected State
  const availableDistricts = useMemo(() => {
    if (selectedState === 'All') {
      return uniqueLocations.cities;
    }
    return uniqueLocations.cities.filter(c => c.state.toLowerCase() === selectedState.toLowerCase());
  }, [selectedState]);

  // City Counts Map
  const cityCountsMap = useMemo(() => {
    const map: Record<string, number> = { 'All India': liveSchools.length };
    liveSchools.forEach((s) => {
      const c = (s.city || '').toLowerCase();
      if (c.includes('delhi') || c.includes('noida') || c.includes('gurugram') || c.includes('sonipat') || c.includes('faridabad')) {
        map['Delhi NCR'] = (map['Delhi NCR'] || 0) + 1;
      }
      if (c.includes('faridabad')) map['Faridabad'] = (map['Faridabad'] || 0) + 1;
      if (c.includes('gurugram') || c.includes('gurgaon')) map['Gurugram'] = (map['Gurugram'] || 0) + 1;
      if (c.includes('sonipat')) map['Sonipat'] = (map['Sonipat'] || 0) + 1;
      if (c.includes('noida')) map['Noida'] = (map['Noida'] || 0) + 1;
      if (c.includes('bengaluru') || c.includes('bangalore')) map['Bengaluru'] = (map['Bengaluru'] || 0) + 1;
      if (c.includes('pune')) map['Pune'] = (map['Pune'] || 0) + 1;
      if (c.includes('hyderabad')) map['Hyderabad'] = (map['Hyderabad'] || 0) + 1;
      if (c.includes('chennai')) map['Chennai'] = (map['Chennai'] || 0) + 1;
      if (c.includes('thane')) map['Thane'] = (map['Thane'] || 0) + 1;
      if (c.includes('dehradun')) map['Dehradun'] = (map['Dehradun'] || 0) + 1;
      if (c.includes('lucknow')) map['Lucknow'] = (map['Lucknow'] || 0) + 1;
      if (c.includes('jaipur')) map['Jaipur'] = (map['Jaipur'] || 0) + 1;
      if (c.includes('kolkata')) map['Kolkata'] = (map['Kolkata'] || 0) + 1;
      if (c.includes('bhopal')) map['Bhopal'] = (map['Bhopal'] || 0) + 1;
      if (c.includes('ahmedabad')) map['Ahmedabad'] = (map['Ahmedabad'] || 0) + 1;
    });
    return map;
  }, [liveSchools]);

  // Board Counts Map
  const boardCountsMap = useMemo(() => {
    const map: Record<string, number> = { All: liveSchools.length };
    liveSchools.forEach((s) => {
      const b = s.board || 'CBSE';
      if (b === 'IB' || b.includes('Cambridge') || b.includes('IGCSE')) {
        map['IB'] = (map['IB'] || 0) + 1;
      } else {
        map[b] = (map[b] || 0) + 1;
      }
    });
    return map;
  }, [liveSchools]);

  // Status Counts Map
  const statusCountsMap = useMemo(() => {
    const map: Record<string, number> = { All: liveSchools.length };
    liveSchools.forEach((s) => {
      const st = s.admissionStatus || 'Open for 2026-27';
      map[st] = (map[st] || 0) + 1;
    });
    return map;
  }, [liveSchools]);

  // Search Suggestions Engine
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    return getSearchSuggestions(searchQuery, liveSchools);
  }, [searchQuery, liveSchools]);

  // Handle Suggestion Click
  const handleSelectSuggestion = (sug: SearchSuggestion) => {
    setIsSearchFocused(false);
    if (sug.type === 'school' && sug.schoolId) {
      router.push(`/edu-network/org/${sug.schoolId}`);
      return;
    }
    if (sug.type === 'city' && sug.city) {
      if (sug.state) setSelectedState(sug.state);
      setSelectedCityName(sug.city);
      setSearchQuery('');
      return;
    }
    if (sug.type === 'state' && sug.state) {
      setSelectedState(sug.state);
      setSelectedCityName('All India');
      setSearchQuery('');
      return;
    }
    if (sug.type === 'board' && sug.board) {
      setSelectedBoard(sug.board);
      setSearchQuery('');
      return;
    }
    setSearchQuery(sug.title);
  };

  // Filter and Sort Organizations
  const cityOrgs = useMemo(() => {
    return liveSchools.filter((org) => {
      // 1. State Filter
      if (selectedState !== 'All') {
        const orgState = (org.state || '').toLowerCase();
        if (!orgState.includes(selectedState.toLowerCase()) && !selectedState.toLowerCase().includes(orgState)) {
          return false;
        }
      }

      // 2. City / District Filter
      if (selectedCityName && selectedCityName !== 'All' && selectedCityName !== 'All India') {
        const target = selectedCityName.toLowerCase();
        const orgCity = (org.city || '').toLowerCase();
        const orgLocality = (org.locality || '').toLowerCase();
        const orgAddress = (org.address || '').toLowerCase();
        
        if (target.includes('delhi')) {
          if (!orgCity.includes('delhi') && !orgLocality.includes('delhi') && !orgAddress.includes('delhi') &&
              !orgCity.includes('noida') && !orgCity.includes('gurugram') && !orgCity.includes('sonipat') && !orgCity.includes('faridabad')) {
            return false;
          }
        } else {
          if (!orgCity.includes(target) && !orgLocality.includes(target) && !orgAddress.includes(target) && !target.includes(orgCity)) {
            return false;
          }
        }
      }

      // 3. Board Filter
      if (selectedBoard !== 'All') {
        const b = org.board || 'CBSE';
        if (selectedBoard === 'IB') {
          if (b !== 'IB' && !b.includes('Cambridge') && !b.includes('IGCSE')) return false;
        } else {
          if (b !== selectedBoard) return false;
        }
      }

      // 4. Class Level Filter
      if (selectedClassLevel !== 'All') {
        if (!matchesClassLevel(org.classesOffered, selectedClassLevel)) {
          return false;
        }
      }

      // 5. Admission Status Filter
      if (selectedAdmissionStatus !== 'All') {
        const st = org.admissionStatus || 'Open for 2026-27';
        if (st !== selectedAdmissionStatus) return false;
      }

      // 6. Max Monthly Fee Filter
      if (maxMonthlyFee < 50000) {
        const feeStr = org.monthlyFees || '0';
        const numFee = parseInt(feeStr.replace(/[^0-9]/g, ''), 10) || 0;
        if (numFee > maxMonthlyFee) return false;
      }

      // 7. STEM Labs Filter
      if (onlyWithLabs && org.stemLabsCount <= 0) {
        return false;
      }

      // 8. Text Search Filter (School Name, City, State, UDISE)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (org.name || '').toLowerCase();
        const city = (org.city || '').toLowerCase();
        const state = (org.state || '').toLowerCase();
        const locality = (org.locality || '').toLowerCase();
        const udise = (org.udiseCode || '').toLowerCase();
        const board = (org.board || '').toLowerCase();

        const directMatch = name.includes(q) || city.includes(q) || state.includes(q) || locality.includes(q) || udise.includes(q) || board.includes(q);
        if (!directMatch) {
          const score = getFuzzyScore(q, name);
          if (score < 40) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'feeAsc') {
        const feeA = parseInt((a.monthlyFees || '0').replace(/[^0-9]/g, ''), 10) || 0;
        const feeB = parseInt((b.monthlyFees || '0').replace(/[^0-9]/g, ''), 10) || 0;
        return feeA - feeB;
      }
      if (sortBy === 'feeDesc') {
        const feeA = parseInt((a.monthlyFees || '0').replace(/[^0-9]/g, ''), 10) || 0;
        const feeB = parseInt((b.monthlyFees || '0').replace(/[^0-9]/g, ''), 10) || 0;
        return feeB - feeA;
      }
      return (b.stemLabsCount || 0) - (a.stemLabsCount || 0);
    });
  }, [liveSchools, selectedState, selectedCityName, selectedBoard, selectedClassLevel, selectedAdmissionStatus, maxMonthlyFee, onlyWithLabs, searchQuery, sortBy]);

  // Paginated visible items
  const visibleOrgs = useMemo(() => {
    return cityOrgs.slice(0, visibleCount);
  }, [cityOrgs, visibleCount]);

  const hasMore = visibleCount < cityOrgs.length;

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, cityOrgs.length));
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, isLoadingMore, cityOrgs.length]);

  // Compare and shortlist helpers
  const handleToggleCompare = (org: OrganizationItem, e: React.MouseEvent) => {
    e.preventDefault();
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

  const handleShareSchool = (org: OrganizationItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://www.cseel.org'}/edu-network/org/${org.id}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${org.name} - CSEEL EduNetwork`,
        text: `Check out ${org.name} (${org.city}, ${org.state}) on CSEEL EduNetwork`,
        url: shareUrl
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedToastOrgId(org.id);
      setTimeout(() => setCopiedToastOrgId(null), 2000);
    }
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

  const handleResetFilters = () => {
    setSelectedState('All');
    setSelectedCityName('All India');
    setSelectedBoard('All');
    setSelectedClassLevel('All');
    setSelectedAdmissionStatus('All');
    setMaxMonthlyFee(50000);
    setOnlyWithLabs(false);
    setSearchQuery('');
  };

  const currentDisplayLocation = selectedCityName !== 'All India' && selectedCityName !== 'All'
    ? selectedCityName
    : (selectedState !== 'All' ? selectedState : 'All India');

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans pb-28">
        
        {/* ── BREADCRUMB & GOOGLE STYLE HEADER SECTION ──────────────────────── */}
        <div className="bg-white border-b border-[#dadce0] pt-4 pb-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-3">
            
            {/* Top Navigation / Breadcrumbs */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <nav className="flex items-center gap-1.5 text-[11px] text-[#5f6368] flex-wrap">
                <Link href="/" className="hover:text-[#1a73e8] transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3 text-[#9aa0a6]" />
                <Link href="/edu-network" className="hover:text-[#1a73e8] transition-colors">EduNetwork</Link>
                <ChevronRight className="w-3 h-3 text-[#9aa0a6]" />
                <Link href="/edu-network/organisation/school" className="hover:text-[#1a73e8] transition-colors">Schools</Link>
                {selectedState !== 'All' && (
                  <>
                    <ChevronRight className="w-3 h-3 text-[#9aa0a6]" />
                    <span className="text-[#3c4043] font-semibold">{selectedState}</span>
                  </>
                )}
                <ChevronRight className="w-3 h-3 text-[#9aa0a6]" />
                <span className="font-bold text-[#202124]">{currentDisplayLocation}</span>
              </nav>

              {/* Action Buttons: Find School Near You & Compare & List School */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* 📍 Find School Near You (Interactive Map Button) */}
                <a
                  href="/schools?view=map"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] border border-[#1a73e8]/30 rounded-full text-xs font-bold transition-all shadow-xs hover:shadow-sm group"
                  title="Open Interactive School Finder Map"
                >
                  <Compass className="w-3.5 h-3.5 text-[#1a73e8] group-hover:rotate-45 transition-transform duration-300" />
                  <span>📍 Find School Near You</span>
                  <span className="px-1.5 py-0.2 bg-[#1a73e8] text-white rounded-full text-[9px] font-mono uppercase tracking-wider font-bold">Map</span>
                </a>

                {compareList.length > 0 && (
                  <button
                    onClick={() => setIsCompareModalOpen(true)}
                    className="px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-full shadow-xs transition flex items-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare ({compareList.length})</span>
                  </button>
                )}

                <Link
                  href="/edu-network/create-school-profile"
                  className="px-3.5 py-1.5 bg-[#202124] hover:bg-[#3c4043] text-white font-bold text-xs rounded-full shadow-xs transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ List School</span>
                </Link>
              </div>
            </div>

            {/* Title & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#202124] tracking-tight">
                  {currentDisplayLocation === 'All India' ? `All India Schools Directory (${cityOrgs.length.toLocaleString()}+ Verified)` : `Top Schools in ${currentDisplayLocation} (${cityOrgs.length.toLocaleString()}+ Verified)`}
                </h1>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Compare verified CBSE, ICSE, IB & State Board schools with fees, student ratios, and live experiential STEM laboratories.
                </p>
              </div>
            </div>

            {/* Google-Style City Filter Pills */}
            <div className="pt-1 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              <span className="text-[11px] font-semibold text-[#5f6368] shrink-0 mr-1">Popular:</span>
              {POPULAR_CITIES.map((c) => {
                const isSelected = selectedCityName.toLowerCase() === c.name.toLowerCase() || (c.name === 'All India' && selectedCityName === 'All India' && selectedState === 'All');
                const count = cityCountsMap[c.name] || 0;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => {
                      setSelectedState('All');
                      setSelectedCityName(c.name);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-[#1a73e8] text-white shadow-xs'
                        : 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043]'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-[#1557b0] text-white' : 'bg-[#e8eaed] text-[#5f6368]'}`}>
                      {count.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT: FILTER BAR & SCHOOL CARDS ────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
            
            {/* ── LEFT FILTER SIDEBAR (DESKTOP) ── */}
            <div className="hidden lg:block bg-white p-4 rounded-2xl border border-[#dadce0] shadow-xs space-y-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#dadce0]">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#dadce0]">
                <h3 className="font-bold text-xs text-[#202124] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#1a73e8]" />
                  <span>Filter Schools</span>
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#1a73e8] font-semibold hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* 1. State Filter */}
              <div>
                <label className="text-[11px] font-semibold text-[#5f6368] block mb-1">State / UT</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCityName('All India');
                  }}
                  className="w-full p-2 text-xs bg-[#f8f9fa] hover:bg-white border border-[#dadce0] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] rounded-xl font-medium text-[#202124] outline-none transition"
                >
                  <option value="All">All States ({liveSchools.length.toLocaleString()})</option>
                  {uniqueLocations.states.map((st) => (
                    <option key={st.state} value={st.state}>
                      {st.state} ({st.totalSchools.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. District / City Filter */}
              <div>
                <label className="text-[11px] font-semibold text-[#5f6368] block mb-1">
                  City / District {selectedState !== 'All' ? `(${selectedState})` : ''}
                </label>
                <select
                  value={selectedCityName}
                  onChange={(e) => setSelectedCityName(e.target.value)}
                  className="w-full p-2 text-xs bg-[#f8f9fa] hover:bg-white border border-[#dadce0] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] rounded-xl font-medium text-[#202124] outline-none transition"
                >
                  <option value="All India">All Districts / Cities</option>
                  {availableDistricts.map((ct) => (
                    <option key={ct.city} value={ct.city}>
                      {ct.city} ({ct.totalSchools.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Board / Affiliation */}
              <div>
                <label className="text-[11px] font-semibold text-[#5f6368] block mb-1">Board Affiliation</label>
                <select
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  className="w-full p-2 text-xs bg-[#f8f9fa] hover:bg-white border border-[#dadce0] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] rounded-xl font-medium text-[#202124] outline-none transition"
                >
                  <option value="All">All Boards ({liveSchools.length.toLocaleString()})</option>
                  <option value="CBSE">CBSE Board ({(boardCountsMap.CBSE || 0).toLocaleString()})</option>
                  <option value="State Board">State Board ({(boardCountsMap['State Board'] || 0).toLocaleString()})</option>
                  <option value="ICSE">ICSE Board ({(boardCountsMap.ICSE || 0).toLocaleString()})</option>
                  <option value="IB">IB / Cambridge ({(boardCountsMap.IB || 0).toLocaleString()})</option>
                </select>
              </div>

              {/* 4. Class Level Filter */}
              <div>
                <label className="text-[11px] font-semibold text-[#5f6368] block mb-1">Grade / Classes</label>
                <select
                  value={selectedClassLevel}
                  onChange={(e) => setSelectedClassLevel(e.target.value)}
                  className="w-full p-2 text-xs bg-[#f8f9fa] hover:bg-white border border-[#dadce0] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] rounded-xl font-medium text-[#202124] outline-none transition"
                >
                  <option value="All">All Grades</option>
                  <option value="Pre-Primary">Pre-Primary (Nursery, KG)</option>
                  <option value="Primary">Primary (Class 1-5)</option>
                  <option value="Middle">Middle (Class 6-8)</option>
                  <option value="Secondary">Secondary (Class 9-10)</option>
                  <option value="Senior Secondary">Senior Secondary (Class 11-12)</option>
                  <option value="K-12">Complete K-12</option>
                </select>
              </div>

              {/* 5. Monthly Fee Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-1 text-[11px]">
                  <label className="font-semibold text-[#5f6368]">Max Monthly Fee</label>
                  <span className="font-bold text-[#1a73e8]">₹{maxMonthlyFee.toLocaleString()}/mo</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={50000}
                  step={2000}
                  value={maxMonthlyFee}
                  onChange={(e) => setMaxMonthlyFee(Number(e.target.value))}
                  className="w-full accent-[#1a73e8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#80868b] font-medium mt-0.5">
                  <span>₹5k</span>
                  <span>₹25k</span>
                  <span>₹50k+</span>
                </div>
              </div>

              {/* 6. Admission Status */}
              <div>
                <label className="text-[11px] font-semibold text-[#5f6368] block mb-1">Admission Status</label>
                <select
                  value={selectedAdmissionStatus}
                  onChange={(e) => setSelectedAdmissionStatus(e.target.value)}
                  className="w-full p-2 text-xs bg-[#f8f9fa] hover:bg-white border border-[#dadce0] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] rounded-xl font-medium text-[#202124] outline-none transition"
                >
                  <option value="All">All Statuses ({liveSchools.length.toLocaleString()})</option>
                  <option value="Open for 2026-27">Open for 2026-27 ({(statusCountsMap['Open for 2026-27'] || 0).toLocaleString()})</option>
                  <option value="On Going">On Going ({(statusCountsMap['On Going'] || 0).toLocaleString()})</option>
                  <option value="Closing Soon">Closing Soon ({(statusCountsMap['Closing Soon'] || 0).toLocaleString()})</option>
                  <option value="Merit Based">Merit Based ({(statusCountsMap['Merit Based'] || 0).toLocaleString()})</option>
                </select>
              </div>

              {/* 7. Verified STEM Labs */}
              <div className="pt-1 border-t border-[#f1f3f4]">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#3c4043] text-xs">
                  <input
                    type="checkbox"
                    checked={onlyWithLabs}
                    onChange={(e) => setOnlyWithLabs(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1a73e8] accent-[#1a73e8]"
                  />
                  <span>Has Verified STEM Labs</span>
                </label>
              </div>

              {/* Map Finder Banner in Sidebar */}
              <div className="p-3 bg-[#e8f0fe] rounded-xl border border-[#1a73e8]/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1a73e8]">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Looking for Near You?</span>
                </div>
                <p className="text-[11px] text-[#3c4043] leading-tight">
                  Use our live GPS map to search schools within 5km radius.
                </p>
                <a
                  href="/schools?view=map"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-[11px] font-bold shadow-xs transition"
                >
                  Open Live School Map ↗
                </a>
              </div>
            </div>

            {/* ── RIGHT LISTING AREA ── */}
            <div className="lg:col-span-3 space-y-3.5">
              
              {/* Top Search Bar & Sort Header */}
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-[#dadce0] shadow-xs space-y-2.5">
                {/* Search Bar with Auto-Suggestions */}
                <div ref={searchContainerRef} className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5f6368]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    placeholder="Search by school name, city, state, or UDISE code..."
                    className="w-full pl-9 pr-8 py-2 text-xs bg-[#f1f3f4] hover:bg-[#e8eaed] focus:bg-white border border-transparent focus:border-[#1a73e8] rounded-xl font-medium text-[#202124] transition outline-none focus:ring-1 focus:ring-[#1a73e8]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124] p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* ── SMART AUTO-SUGGEST DROPDOWN ── */}
                  {isSearchFocused && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-[#dadce0] shadow-lg z-50 overflow-hidden divide-y divide-[#f1f3f4] animate-in fade-in-50">
                      <div className="p-2 bg-[#f8f9fa] text-[10px] font-bold uppercase text-[#5f6368] tracking-wider">
                        Suggestions (Click to Filter)
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {searchSuggestions.map((sug) => (
                          <div
                            key={sug.id}
                            onClick={() => handleSelectSuggestion(sug)}
                            className="p-2.5 hover:bg-[#e8f0fe] cursor-pointer transition flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold ${
                                sug.type === 'city' ? 'bg-amber-100 text-amber-700' :
                                sug.type === 'state' ? 'bg-emerald-100 text-emerald-700' :
                                sug.type === 'board' ? 'bg-purple-100 text-purple-700' :
                                'bg-[#e8f0fe] text-[#1a73e8]'
                              }`}>
                                {sug.type === 'city' && '🏙️'}
                                {sug.type === 'state' && '📍'}
                                {sug.type === 'board' && '🎓'}
                                {sug.type === 'school' && '🏫'}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-[#202124] truncate">{sug.title}</p>
                                <p className="text-[11px] text-[#5f6368] truncate">{sug.subtitle}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.5 rounded-full shrink-0">
                              {sug.type === 'school' ? 'View' : 'Filter'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort & Count Bar */}
                <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-[#f1f3f4] flex-wrap">
                  <span className="text-[#5f6368] text-[11px]">
                    Showing <strong className="text-[#202124] font-bold">{visibleOrgs.length} of {cityOrgs.length.toLocaleString()}</strong> schools in {currentDisplayLocation}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMobileFilterOpen(true)}
                      className="lg:hidden px-2.5 py-1 bg-[#f1f3f4] hover:bg-[#e8eaed] font-semibold rounded-lg flex items-center gap-1 text-[#3c4043] text-xs"
                    >
                      <SlidersHorizontal className="w-3 h-3 text-[#1a73e8]" />
                      <span>Filters</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[#5f6368] text-[11px] hidden sm:inline">Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="p-1 bg-[#f8f9fa] border border-[#dadce0] rounded-lg font-medium text-xs text-[#202124] outline-none"
                      >
                        <option value="popularity">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                        <option value="feeAsc">Fee: Low to High</option>
                        <option value="feeDesc">Fee: High to Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* School Cards Grid */}
              {cityOrgs.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border border-[#dadce0] text-center space-y-3">
                  <Building2 className="w-10 h-10 text-[#9aa0a6] mx-auto" />
                  <h3 className="font-bold text-sm text-[#202124]">No schools matching your filters in {currentDisplayLocation}</h3>
                  <p className="text-xs text-[#5f6368]">Try broadening your search keywords, selected district, or fee filter.</p>
                  <button
                    onClick={handleResetFilters}
                    className="px-3.5 py-1.5 bg-[#1a73e8] text-white font-semibold text-xs rounded-full shadow-xs hover:bg-[#1557b0] transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleOrgs.map((org) => {
                    const isCompared = compareList.some((c) => c.id === org.id);
                    const isLiked = likedOrgIds.includes(org.id);

                    return (
                      <div
                        key={org.id}
                        className="bg-white rounded-2xl border border-[#dadce0] hover:border-[#1a73e8]/50 hover:shadow-[0_2px_8px_rgba(60,64,67,0.12)] transition-all duration-200 p-3.5 sm:p-4 flex flex-col md:flex-row gap-4 items-stretch group relative"
                      >
                        {/* School Thumbnail & Badges */}
                        <div className="relative w-full md:w-44 h-32 md:h-auto min-h-[110px] rounded-xl overflow-hidden bg-[#f1f3f4] shrink-0 border border-[#dadce0]/60">
                          <img
                            src={org.bannerImage || org.logo || 'https://images.unsplash.com/photo-1509062522246?w=600&auto=format&fit=crop'}
                            alt={org.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1509062522246?w=600&auto=format&fit=crop';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* School Logo */}
                          <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-white p-0.5 shadow-sm border border-[#dadce0] flex items-center justify-center">
                            <img
                              src={org.logo || 'https://images.unsplash.com/photo-1580582932707?w=100&auto=format&fit=crop'}
                              alt={org.name}
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707?w=100&auto=format&fit=crop';
                              }}
                              className="w-full h-full object-contain rounded"
                            />
                          </div>

                          {/* Rating Badge */}
                          <div className="absolute top-2 right-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white/95 backdrop-blur-xs border border-[#dadce0] rounded-md text-[#202124] text-[10px] font-bold shadow-xs">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{org.rating}</span>
                            <span className="text-[9px] text-[#5f6368] font-normal">({org.reviews})</span>
                          </div>

                          {/* Verified STEM Lab Ribbon */}
                          {org.verified && (
                            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-[#1e8e3e] text-white text-[9px] font-bold rounded-full shadow-xs flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Verified Lab</span>
                            </span>
                          )}
                        </div>

                        {/* School Info & Metrics */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2.5">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h2 className="text-sm sm:text-base font-bold text-[#202124] leading-snug group-hover:text-[#1a73e8] transition-colors truncate">
                                  <Link href={`/edu-network/org/${org.id}`}>
                                    {org.name}
                                  </Link>
                                </h2>

                                <div className="text-[11px] text-[#5f6368] flex items-center gap-1.5 mt-0.5 font-medium flex-wrap">
                                  <span className="inline-flex items-center gap-0.5 text-[#3c4043]">
                                    <MapPin className="w-3 h-3 text-[#ea4335] shrink-0" />
                                    <span>{cleanLocation(org)}</span>
                                  </span>
                                  <span className="text-[#dadce0]">•</span>
                                  <span className="px-1.5 py-0.2 bg-[#e8f0fe] text-[#1a73e8] rounded font-bold text-[10px]">{org.board || 'CBSE'}</span>
                                  <span className="text-[#dadce0]">•</span>
                                  <span className="text-[10px] font-mono text-[#5f6368] bg-[#f1f3f4] px-1 py-0.2 rounded">UDISE: {org.udiseCode || '07010200301'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Clean Google Metrics Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2.5 p-2 bg-[#f8f9fa] rounded-xl text-[11px] border border-[#f1f3f4]">
                              <div className="min-w-0">
                                <span className="text-[9px] font-bold text-[#5f6368] uppercase block leading-tight">Monthly Fee</span>
                                <p className="font-bold text-[#202124] text-xs mt-0.5 truncate">{org.monthlyFees || '₹12.0K'}</p>
                              </div>
                              <div className="min-w-0">
                                <span className="text-[9px] font-bold text-[#5f6368] uppercase block leading-tight">Classes</span>
                                <p className="font-medium text-[#3c4043] text-xs mt-0.5 truncate">{org.classesOffered || 'Nursery - 12th'}</p>
                              </div>
                              <div className="min-w-0">
                                <span className="text-[9px] font-bold text-[#5f6368] uppercase block leading-tight">Student Ratio</span>
                                <p className="font-medium text-[#3c4043] text-xs mt-0.5 truncate">{org.studentFacultyRatio || '15:1'}</p>
                              </div>
                              <div className="min-w-0">
                                <span className="text-[9px] font-bold text-[#5f6368] uppercase block leading-tight">Admissions</span>
                                <span className="inline-block font-semibold text-[#1e8e3e] bg-[#e6f4ea] px-1.5 py-0.2 rounded text-[10px] mt-0.5 truncate max-w-full">
                                  {org.admissionStatus || 'Open for 2026-27'}
                                </span>
                              </div>
                            </div>

                            {/* STEM Labs & Facilities Tags */}
                            <div className="flex items-center gap-1.5 flex-wrap mt-2 text-[10px]">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setSelectedOrgForLabsModal(org); }}
                                className="px-2 py-0.5 bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] font-bold rounded-md border border-[#1a73e8]/20 flex items-center gap-1 cursor-pointer transition-colors"
                                title="Click to view detailed laboratory infrastructure"
                              >
                                <Sparkles className="w-2.5 h-2.5 text-[#1a73e8]" />
                                <span>{org.stemLabsCount} STEM Experiential Labs</span>
                              </button>
                              {org.facilities.slice(0, 3).map((f, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-[#f1f3f4] text-[#3c4043] rounded-md font-medium">{f}</span>
                              ))}
                              {org.facilities.length > 3 && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setSelectedOrgForLabsModal(org); }}
                                  className="text-[10px] text-[#5f6368] font-medium hover:text-[#1a73e8] cursor-pointer"
                                >
                                  +{org.facilities.length - 3} more
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Bottom Action Row (All 100% Retained & Google Styled) */}
                          <div className="pt-2 border-t border-[#f1f3f4] flex items-center justify-between gap-1.5 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              {/* Compare Button */}
                              <button
                                onClick={(e) => handleToggleCompare(org, e)}
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
                                onClick={(e) => handleToggleLike(org.id, e)}
                                className={`p-1.5 rounded-full border transition-colors ${
                                  isLiked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-[#dadce0] bg-white text-[#5f6368] hover:text-rose-600 hover:border-rose-200'
                                }`}
                                title="Save to wishlist"
                              >
                                <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-600' : ''}`} />
                              </button>

                              {/* Share Button */}
                              <button
                                onClick={(e) => handleShareSchool(org, e)}
                                className="p-1.5 rounded-full border border-[#dadce0] bg-white text-[#5f6368] hover:text-[#1a73e8] hover:border-[#1a73e8]/30 transition-colors relative"
                                title="Share school"
                              >
                                <Share2 className="w-3 h-3" />
                                {copiedToastOrgId === org.id && (
                                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#202124] text-white text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-20 animate-in fade-in">
                                    Link Copied!
                                  </span>
                                )}
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Admission Enquiry Button */}
                              <button
                                onClick={(e) => handleOpenEnquiry(org, e)}
                                className="px-3 py-1 bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] font-semibold text-xs rounded-full transition-colors"
                              >
                                Enquiry
                              </button>

                              {/* View Profile Button */}
                              <Link
                                href={`/edu-network/org/${org.id}`}
                                className="px-3.5 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs rounded-full shadow-xs flex items-center gap-1 transition-all"
                              >
                                <span>View Profile</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Infinite Scroll Trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="py-6 text-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-full border border-[#dadce0] shadow-xs text-xs font-medium text-[#5f6368]">
                    <div className="w-3 h-3 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
                    <span>Loading more schools...</span>
                  </div>
                </div>
              )}
            </div>

          </div>
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

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#dadce0] bg-[#f8f9fa]">
                      <th className="p-2.5 font-bold text-[#5f6368]">Parameters</th>
                      {compareList.map((c) => (
                        <th key={c.id} className="p-2.5 font-bold text-[#202124] min-w-[150px]">
                          <div className="flex items-center justify-between">
                            <span className="truncate">{c.name}</span>
                            <button onClick={(e) => handleToggleCompare(c, e)} className="text-rose-500 font-bold hover:underline ml-1">✕</button>
                          </div>
                          <span className="text-[10px] font-normal text-[#5f6368] block">{c.city}, {c.state}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f3f4]">
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">Board</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-bold text-[#1a73e8]">{c.board || 'CBSE'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">Monthly Fees</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-bold text-[#202124]">{c.monthlyFees || '₹12,000 / mo'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">Rating</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-bold text-amber-600">★ {c.rating} ({c.reviews} reviews)</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">Student-Faculty Ratio</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-medium text-[#3c4043]">{c.studentFacultyRatio || '20:1'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">STEM Labs Count</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-bold text-[#1e8e3e]">{c.stemLabsCount} Verified Labs</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5f6368]">Admissions</td>
                      {compareList.map((c) => (
                        <td key={c.id} className="p-2.5 font-bold text-[#1e8e3e]">{c.admissionStatus || 'Open for 2026-27'}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ENQUIRY MODAL ── */}
        {isEnquiryModalOpen && selectedOrgForEnquiry && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in-50">
            <div className="bg-white rounded-2xl border border-[#dadce0] shadow-2xl w-full max-w-lg overflow-hidden my-auto">
              <div className="p-4 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
                <div>
                  <span className="text-[10px] font-bold text-[#1a73e8] uppercase">Official Admission Enquiry</span>
                  <h3 className="font-bold text-sm text-[#202124]">{selectedOrgForEnquiry.name}</h3>
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
                  <p className="text-xs text-[#5f6368]">The admissions desk of {selectedOrgForEnquiry.name} will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="p-4 space-y-2.5 text-xs">
                  <div>
                    <label className="font-semibold text-[#3c4043] block mb-1">Parent / Guardian Name *</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.parentName}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, parentName: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full p-2 border border-[#dadce0] rounded-xl bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-[#3c4043] block mb-1">Student Name</label>
                      <input
                        type="text"
                        value={enquiryForm.studentName}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, studentName: e.target.value })}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full p-2 border border-[#dadce0] rounded-xl bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#3c4043] block mb-1">Applying Grade</label>
                      <select
                        value={enquiryForm.grade}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, grade: e.target.value })}
                        className="w-full p-2 border border-[#dadce0] rounded-xl bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] font-medium outline-none"
                      >
                        <option value="Pre-Primary">Pre-Primary (Nursery / KG)</option>
                        <option value="Class 1-5">Primary (Class 1 to 5)</option>
                        <option value="Class 6-8">Middle School (Class 6 to 8)</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11 (Science)">Class 11 (Science STEM)</option>
                        <option value="Class 11 (Commerce)">Class 11 (Commerce)</option>
                        <option value="Class 11 (Humanities)">Class 11 (Humanities)</option>
                        <option value="Class 12">Class 12</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-[#3c4043] block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full p-2 border border-[#dadce0] rounded-xl bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#3c4043] block mb-1">Email</label>
                      <input
                        type="email"
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="parent@example.com"
                        className="w-full p-2 border border-[#dadce0] rounded-xl bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#3c4043] block mb-1">Message / Queries</label>
                    <textarea
                      rows={2}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      placeholder="Ask about admission dates, fee details, bus transport routes..."
                      className="w-full p-2 border border-[#dadce0] rounded-xl bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] outline-none"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Submit Official Enquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── LABS POPUP MODAL ── */}
        {selectedOrgForLabsModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in-50">
            <div className="bg-white rounded-2xl border border-[#dadce0] shadow-2xl max-w-lg w-full overflow-hidden my-auto">
              <div className="p-4 border-b border-[#dadce0] flex items-center justify-between bg-[#1a73e8] text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wide">
                      STEM Laboratory Infrastructure
                    </span>
                    <h3 className="font-bold text-sm text-white">{selectedOrgForLabsModal.name}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrgForLabsModal(null)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3.5 max-h-[60vh] overflow-y-auto text-xs">
                <div>
                  <h4 className="text-[11px] font-bold text-[#3c4043] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#1a73e8]" />
                    <span>Active STEM Experiential Labs ({selectedOrgForLabsModal.stemLabsCount})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {[
                      'Interactive Science Experiential Lab',
                      'Composite Science Research Lab',
                      'Robotics & Artificial Intelligence Pod',
                      'Atal Tinkering Innovation Lab (ATL)',
                      'AR / VR Immersive Simulation Hub',
                      'Mathematics Concept & Logic Lab',
                      'Space & Astronomy Observatory Unit',
                      'Computer Science & Coding Studio'
                    ].slice(0, Math.max(selectedOrgForLabsModal.stemLabsCount, 4)).map((labName, idx) => {
                      return (
                        <div key={idx} className="p-2 bg-[#e8f0fe]/60 border border-[#d2e3fc] rounded-xl flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-md bg-[#1a73e8] text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                            ✓
                          </div>
                          <span className="font-semibold text-[#202124] text-[11px] leading-tight">{labName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Other Facilities */}
                {selectedOrgForLabsModal.facilities && selectedOrgForLabsModal.facilities.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold text-[#3c4043] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#5f6368]" />
                      <span>Campus Infrastructure & Amenities ({selectedOrgForLabsModal.facilities.length})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedOrgForLabsModal.facilities.map((fac, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#f1f3f4] text-[#3c4043] font-medium rounded-md text-[10px] border border-[#dadce0]/60">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-[#f8f9fa] border-t border-[#dadce0] flex items-center justify-between">
                <span className="text-[11px] text-[#5f6368]">NEP-2020 Compliant Experiential STEM</span>
                <Link
                  href={`/edu-network/org/${selectedOrgForLabsModal.id}`}
                  className="px-3 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs rounded-full shadow-xs transition flex items-center gap-1"
                >
                  <span>View Full Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── MOBILE FILTER MODAL DRAWER ─────────────────────────────────── */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[600] lg:hidden flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in-50">
            <div className="bg-white w-full sm:max-w-md max-h-[85vh] rounded-t-2xl sm:rounded-2xl border border-[#dadce0] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
              <div className="p-3.5 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
                <h3 className="font-bold text-xs text-[#202124] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#1a73e8]" />
                  <span>Filter Schools</span>
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-[#1a73e8] font-semibold hover:underline"
                  >
                    Reset All
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full text-[#5f6368] hover:text-[#202124]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
                {/* 1. State */}
                <div>
                  <label className="font-semibold text-[#5f6368] block mb-1">State / UT</label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCityName('All India');
                    }}
                    className="w-full p-2 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-medium text-xs text-[#202124]"
                  >
                    <option value="All">All States ({liveSchools.length.toLocaleString()})</option>
                    {uniqueLocations.states.map((st) => (
                      <option key={st.state} value={st.state}>
                        {st.state} ({st.totalSchools.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. District / City */}
                <div>
                  <label className="font-semibold text-[#5f6368] block mb-1">
                    City / District {selectedState !== 'All' ? `(${selectedState})` : ''}
                  </label>
                  <select
                    value={selectedCityName}
                    onChange={(e) => setSelectedCityName(e.target.value)}
                    className="w-full p-2 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-medium text-xs text-[#202124]"
                  >
                    <option value="All India">All Districts / Cities</option>
                    {availableDistricts.map((ct) => (
                      <option key={ct.city} value={ct.city}>
                        {ct.city} ({ct.totalSchools.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Board */}
                <div>
                  <label className="font-semibold text-[#5f6368] block mb-1">Board Affiliation</label>
                  <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="w-full p-2 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-medium text-xs text-[#202124]"
                  >
                    <option value="All">All Boards ({liveSchools.length.toLocaleString()})</option>
                    <option value="CBSE">CBSE Board ({(boardCountsMap.CBSE || 0).toLocaleString()})</option>
                    <option value="State Board">State Board ({(boardCountsMap['State Board'] || 0).toLocaleString()})</option>
                    <option value="ICSE">ICSE Board ({(boardCountsMap.ICSE || 0).toLocaleString()})</option>
                    <option value="IB">IB / Cambridge ({(boardCountsMap.IB || 0).toLocaleString()})</option>
                  </select>
                </div>

                {/* 4. Class Level */}
                <div>
                  <label className="font-semibold text-[#5f6368] block mb-1">Grade / Classes</label>
                  <select
                    value={selectedClassLevel}
                    onChange={(e) => setSelectedClassLevel(e.target.value)}
                    className="w-full p-2 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-medium text-xs text-[#202124]"
                  >
                    <option value="All">All Grades</option>
                    <option value="Pre-Primary">Pre-Primary (Nursery / KG)</option>
                    <option value="Primary">Primary (Class 1-5)</option>
                    <option value="Middle">Middle (Class 6-8)</option>
                    <option value="Secondary">Secondary (Class 9-10)</option>
                    <option value="Senior Secondary">Senior Secondary (Class 11-12)</option>
                    <option value="K-12">Complete K-12</option>
                  </select>
                </div>

                {/* 5. Fee Range */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <label className="font-semibold text-[#5f6368]">Max Monthly Fee</label>
                    <span className="font-bold text-[#1a73e8]">₹{maxMonthlyFee.toLocaleString()}/mo</span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={50000}
                    step={2000}
                    value={maxMonthlyFee}
                    onChange={(e) => setMaxMonthlyFee(Number(e.target.value))}
                    className="w-full accent-[#1a73e8]"
                  />
                </div>

                {/* 6. Admission Status */}
                <div>
                  <label className="font-semibold text-[#5f6368] block mb-1">Admission Status</label>
                  <select
                    value={selectedAdmissionStatus}
                    onChange={(e) => setSelectedAdmissionStatus(e.target.value)}
                    className="w-full p-2 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-medium text-xs text-[#202124]"
                  >
                    <option value="All">All Statuses ({liveSchools.length.toLocaleString()})</option>
                    <option value="Open for 2026-27">Open for 2026-27 ({(statusCountsMap['Open for 2026-27'] || 0).toLocaleString()})</option>
                    <option value="On Going">On Going ({(statusCountsMap['On Going'] || 0).toLocaleString()})</option>
                    <option value="Closing Soon">Closing Soon ({(statusCountsMap['Closing Soon'] || 0).toLocaleString()})</option>
                    <option value="Merit Based">Merit Based ({(statusCountsMap['Merit Based'] || 0).toLocaleString()})</option>
                  </select>
                </div>

                {/* 7. Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#3c4043] pt-1">
                  <input
                    type="checkbox"
                    checked={onlyWithLabs}
                    onChange={(e) => setOnlyWithLabs(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1a73e8] accent-[#1a73e8]"
                  />
                  <span>Has Verified STEM Labs</span>
                </label>
              </div>

              <div className="p-3.5 bg-[#f8f9fa] border-t border-[#dadce0]">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Apply Filters ({cityOrgs.length.toLocaleString()} Schools)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
