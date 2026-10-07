'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MapPin, Filter, ChevronRight, ChevronLeft, ChevronDown, Search, CheckCircle2,
  Compass, Star, Scale, Heart, Share2, X, Check, Building2, Users, Award, Sparkles,
  HelpCircle, Home, Map, Navigation, BookOpen, Briefcase, Shield, FileText, Building,
  Landmark, Castle, Hotel, Banknote, GraduationCap, FlaskConical, Monitor, Tv, Library,
  Wrench, Bot, Mic, Calculator, Glasses, Laptop, Trees, Gamepad2, Waves, Activity,
  Trophy, Target, CircleDashed, Dumbbell, HeartHandshake, Swords, Footprints, Cctv, Wind,
  Wifi, Bus, Bed, Utensils, Cross, Accessibility, Sun, Droplet, Palette, Music,
  Clapperboard, Medal, Leaf, Camera, UsersRound, Tent, ArrowUpDown, SlidersHorizontal,
  LayoutGrid, List, Columns3
} from 'lucide-react';
import { SchoolsDirectoryResult } from '@/integrations/supabase/schoolsDirectoryDb';
import { SchoolRecord } from '@/data/schoolFinderData';

interface Props {
  initialData: SchoolsDirectoryResult;
}

const HERO_IMAGES = [
  '/images/schools/hero-school-1.png',
  '/images/schools/hero-school-2.jpg',
  '/images/schools/hero-school-3.jpg',
  '/images/schools/hero-school-4.png',
];

const POPULAR_CITIES = [
  { name: 'Delhi NCR', icon: '/images/cities/delhi-ncr.png' }, // Or https://img.icons8.com/color/48/india.png
  { name: 'Agra', icon: 'https://img.icons8.com/color/48/taj-mahal.png' },
  { name: 'Mumbai', icon: 'https://img.icons8.com/color/48/train-station.png' },
  { name: 'Pune', icon: 'https://img.icons8.com/color/48/castle.png' },
  { name: 'Bangalore', icon: 'https://img.icons8.com/color/48/laptop.png' },
  { name: 'Hyderabad', icon: 'https://img.icons8.com/color/48/mosque.png' },
  { name: 'Chennai', icon: 'https://img.icons8.com/color/48/temple.png' },
  { name: 'Kolkata', icon: 'https://img.icons8.com/color/48/bridge.png' },
  { name: 'Chandigarh', icon: 'https://img.icons8.com/color/48/city.png' },
  { name: 'Raipur', icon: 'https://img.icons8.com/color/48/factory.png' },
  { name: 'Bhubaneswar', icon: 'https://img.icons8.com/color/48/pagoda.png' },
  { name: 'Gurugram', icon: 'https://img.icons8.com/color/48/skyscrapers.png' },
  { name: 'Faridabad', icon: 'https://img.icons8.com/color/48/factory.png' },
];

export default function SchoolsDirectoryClient({ initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = initialData.query;

  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'text' | 'near_me'>('text');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [selectedBoard, setSelectedBoard] = useState(query.board || 'all');
  const [selectedResidential, setSelectedResidential] = useState(query.residential || 'all');
  const [onlyAtl, setOnlyAtl] = useState(query.facility?.includes('Atal Tinkering') || false);
  const [sortBy, setSortBy] = useState(query.sortBy || 'students');
  const [feeMax, setFeeMax] = useState(500000);
  const [studentMax, setStudentMax] = useState(5000);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);

  // Interactive state
  const [likedSchoolIds, setLikedSchoolIds] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<SchoolRecord[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [copiedToastId, setCopiedToastId] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'grid3' | 'compact'>('grid');

  // Persist viewMode in localStorage across page refreshes
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('cseel_school_view_mode') as 'grid' | 'grid3' | 'compact' | null;
      if (savedMode && (savedMode === 'grid' || savedMode === 'grid3' || savedMode === 'compact')) {
        setViewMode(savedMode);
      }
    } catch {
      // Ignore storage errors in SSR or restricted environments
    }
  }, []);

  const handleViewModeChange = (mode: 'grid' | 'grid3' | 'compact') => {
    setViewMode(mode);
    try {
      localStorage.setItem('cseel_school_view_mode', mode);
    } catch {
      // Ignore storage errors
    }
  };
  
  // Dynamic counts for filters
  const boardCounts = useMemo(() => {
    const counts = { 'CBSE': 0, 'ICSE': 0, 'State Board': 0 };
    initialData.schools.forEach(s => {
      const boardStr = (s.board || s.board_secondary_10th || '').toUpperCase();
      if (boardStr.includes('CBSE')) counts['CBSE']++;
      if (boardStr.includes('ICSE')) counts['ICSE']++;
      if (boardStr.includes('STATE')) counts['State Board']++;
    });
    return counts;
  }, [initialData.schools]);

  const formatCounts = useMemo(() => {
    const counts = { boarding: 0, day: 0 };
    initialData.schools.forEach(s => {
      const typeStr = (s.school_category || '').toLowerCase();
      if (typeStr.includes('boarding') || typeStr.includes('residential')) counts.boarding++;
      else counts.day++;
    });
    return counts;
  }, [initialData.schools]);
  
  // Hero Carousel state
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const displayedSchools = useMemo(() => {
    let list = initialData.schools;
    if (searchTerm.trim() && searchMode === 'text') {
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
  }, [initialData.schools, searchTerm, searchMode]);

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
      if (exists) return prev.filter((s) => s.id !== school.id);
      if (prev.length >= 4) {
        alert('You can compare up to 4 schools at a time.');
        return prev;
      }
      return [...prev, school];
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

  const getSchoolUrl = (s: SchoolRecord) => {
    const stateSlug = s.state_name?.toLowerCase().replace(/\s+/g, '-') || 'haryana';
    const districtSlug = s.district_name?.toLowerCase().replace(/\s+/g, '-') || 'palwal';
    const villageSlug = s.village_ward?.toLowerCase().replace(/\s+/g, '-') || 'main';
    return `/school/${stateSlug}/${districtSlug}/${villageSlug}/${s.udise_code || s.id}`;
  };

  const handleNearMeSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        alert(`Searching near: ${pos.coords.latitude}, ${pos.coords.longitude}`);
        // In real implementation, pass coords to search params
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const topSchools = useMemo(() => {
    return [...initialData.schools]
      .sort((a, b) => (Number(b.rating) || 4.5) - (Number(a.rating) || 4.5))
      .slice(0, 8);
  }, [initialData.schools]);

  const renderSchoolCard = (school: SchoolRecord, idx: number) => {
    const profileUrl = getSchoolUrl(school);
    const isCompared = compareList.some((c) => c.id === school.id);
    const isLiked = likedSchoolIds.includes(school.id);
    
    // Google Local Inspired Card
    return (
      <div key={school.id || idx} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow group flex flex-col">
        {/* Card Image Header */}
        <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
          <img
            src={school.image || HERO_IMAGES[idx % HERO_IMAGES.length]}
            alt={school.school_name || school.name || 'School Banner'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.currentTarget.src = HERO_IMAGES[0]; }}
          />
          
          {/* Top Action Buttons (Like, Share, Compare) */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={(e) => handleToggleCompare(school, e)}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition ${
                isCompared ? 'bg-blue-600 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
              title="Compare"
            >
              <Scale size={14} />
            </button>
            <button
              onClick={(e) => handleShareSchool(school, e)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white shadow-sm transition relative"
              title="Share"
            >
              <Share2 size={14} />
              {copiedToastId === school.id && (
                <span className="absolute -bottom-8 bg-gray-900 text-white text-[10px] px-2 py-1 rounded">Copied!</span>
              )}
            </button>
            <button
              onClick={(e) => handleToggleLike(school.id, e)}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition ${
                isLiked ? 'bg-rose-50 text-rose-500' : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
              title="Like"
            >
              <Heart size={14} className={isLiked ? "fill-rose-500" : ""} />
            </button>
          </div>

          {/* Badge: Open/Closed Admission */}
          <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
            <CheckCircle2 size={12} /> Admissions Open
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-[17px] text-gray-900 leading-tight">
              <Link href={profileUrl} className="hover:text-blue-600 transition-colors line-clamp-1">
                {school.school_name || school.name}
              </Link>
            </h3>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[13px] font-bold text-gray-800">{school.rating || '4.5'}</span>
            <div className="flex text-amber-400">
              <Star size={12} className="fill-amber-400" />
              <Star size={12} className="fill-amber-400" />
              <Star size={12} className="fill-amber-400" />
              <Star size={12} className="fill-amber-400" />
              <Star size={12} className="fill-amber-400 half-star" />
            </div>
            <span className="text-xs text-gray-500 ml-1">({school.reviews || 120})</span>
          </div>
          
          {/* Address & Meta */}
          <div className="text-[13px] text-gray-600 flex items-start gap-1.5 mb-3 line-clamp-2">
            <MapPin size={15} className="text-red-500 shrink-0 mt-0.5" />
            <span>{school.village_ward || school.locality}, {school.district_name}, {school.state_name}</span>
          </div>

          {/* Experiential Science Lab Badge */}
          {school.facilities?.includes('Experiential Science Lab') && (
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-md text-[10px] font-bold">
                <FlaskConical size={12} />
                Have Experiential Science Lab
              </span>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] sm:text-xs text-gray-700 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-1.5">
              <Award size={13} className="text-blue-600 shrink-0" />
              <span className="font-medium truncate">{school.board || school.board_secondary_10th || 'CBSE'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={13} className="text-purple-600 shrink-0" />
              <span className="font-medium truncate">{school.classes || 'Nursery - 12th'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 size={13} className="text-indigo-600 shrink-0" />
              <span className="font-medium truncate">{school.school_category || 'Co-ed Day School'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              <span className="font-medium truncate">Affiliation: {(school as any).affiliation_no || 'Pending'}</span>
            </div>
          </div>

          {/* Card Actions */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
            <Link
              href={`/school-finder?id=${school.id}`}
              className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              <Compass size={16} /> View on Map
            </Link>
            
            <Link
              href={profileUrl}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderCompactSchoolRow = (school: SchoolRecord, idx: number) => {
    const profileUrl = getSchoolUrl(school);
    const isCompared = compareList.some((c) => c.id === school.id);
    const isLiked = likedSchoolIds.includes(school.id);
    const boardName = school.board || school.board_secondary_10th || 'CBSE';
    const locationStr = [school.village_ward || school.locality, school.district_name].filter(Boolean).join(', ') || school.state_name;

    return (
      <div 
        key={school.id || idx} 
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 hover:border-blue-400 hover:shadow-md transition-all p-2 sm:p-3 flex flex-row items-center gap-2.5 sm:gap-4 group relative overflow-hidden"
      >
        {/* Left Thumbnail (Strictly locked size on mobile & desktop) */}
        <div className="relative w-20 h-20 min-w-[80px] max-w-[80px] sm:w-28 sm:h-24 sm:min-w-[112px] sm:max-w-[112px] rounded-lg sm:rounded-xl bg-gray-100 overflow-hidden shrink-0">
          <img
            src={school.image || HERO_IMAGES[idx % HERO_IMAGES.length]}
            alt={school.school_name || school.name || 'School'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.currentTarget.src = HERO_IMAGES[0]; }}
          />
          <div className="absolute bottom-1 left-1 bg-black/75 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
            <Star size={9} className="fill-amber-400 text-amber-400" />
            <span>{school.rating || '4.5'}</span>
          </div>
        </div>

        {/* Center Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-xs sm:text-base text-gray-900 leading-snug truncate">
              <Link href={profileUrl} className="hover:text-blue-600 transition-colors">
                {school.school_name || school.name}
              </Link>
            </h3>
            <span className="hidden sm:inline-flex text-[10px] sm:text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
              {boardName}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 mb-1 truncate">
            <MapPin size={11} className="text-red-500 shrink-0" />
            <span className="truncate">{locationStr}</span>
            <span className="text-gray-300 sm:hidden">•</span>
            <span className="font-semibold text-blue-700 text-[10px] sm:hidden">{boardName}</span>
          </div>

          {/* Quick Info Tags */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <span className="text-[10px] sm:text-xs text-gray-600 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded font-medium">
              {school.classes || 'Nursery - 12th'}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-600 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded font-medium hidden md:inline">
              {school.school_category || 'Co-ed Day'}
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Admissions Open
            </span>
            {school.facilities?.includes('Experiential Science Lab') && (
              <span className="text-[10px] sm:text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded font-medium hidden lg:inline-flex items-center gap-1">
                <FlaskConical size={10} /> Experiential Lab
              </span>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto pl-1">
          <button
            onClick={(e) => handleToggleLike(school.id, e)}
            className={`p-1.5 sm:p-2 rounded-lg text-xs transition ${
              isLiked ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title="Save"
          >
            <Heart size={14} className={isLiked ? "fill-rose-500" : ""} />
          </button>
          
          <Link
            href={profileUrl}
            className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition shrink-0 flex items-center gap-0.5"
          >
            <span>View</span>
            <ChevronRight size={13} className="hidden sm:inline" />
          </Link>
        </div>
      </div>
    );
  };

  const renderTopSchoolCard = (school: SchoolRecord, idx: number) => {
    const profileUrl = getSchoolUrl(school);
    const isCompared = compareList.some((c) => c.id === school.id);
    const isLiked = likedSchoolIds.includes(school.id);
    const boardName = school.board || school.board_secondary_10th || 'CBSE';
    const locationStr = [school.village_ward || school.locality, school.district_name].filter(Boolean).join(', ') || school.state_name;

    return (
      <div 
        key={`top-${school.id || idx}`}
        className="w-[260px] sm:w-[280px] shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-gray-200/90 hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col"
      >
        {/* Compact Image */}
        <div className="relative h-36 w-full bg-gray-100 overflow-hidden shrink-0">
          <img
            src={school.image || HERO_IMAGES[idx % HERO_IMAGES.length]}
            alt={school.school_name || school.name || 'School'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.currentTarget.src = HERO_IMAGES[0]; }}
          />

          {/* Top Rating Badge */}
          <div className="absolute top-2.5 left-2.5 bg-black/75 text-white px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>{school.rating || '4.5'}</span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            <button
              onClick={(e) => handleToggleCompare(school, e)}
              className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                isCompared ? 'bg-blue-600 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
              title="Compare"
            >
              <Scale size={12} />
            </button>
            <button
              onClick={(e) => handleToggleLike(school.id, e)}
              className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                isLiked ? 'bg-rose-50 text-rose-500' : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
              title="Save"
            >
              <Heart size={12} className={isLiked ? "fill-rose-500" : ""} />
            </button>
          </div>

          {/* Admission Pill */}
          <div className="absolute bottom-2 left-2.5 bg-emerald-600/95 text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <CheckCircle2 size={10} /> Admissions Open
          </div>
        </div>

        {/* Compact Card Body */}
        <div className="p-3.5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900 leading-snug truncate mb-1">
              <Link href={profileUrl} className="hover:text-blue-600 transition-colors">
                {school.school_name || school.name}
              </Link>
            </h3>

            <div className="text-[11px] text-gray-500 flex items-center gap-1 mb-2.5 truncate">
              <MapPin size={11} className="text-red-500 shrink-0" />
              <span className="truncate">{locationStr}</span>
            </div>

            {/* Quick Pills */}
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {boardName}
              </span>
              <span className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md">
                {school.classes || 'Nursery - 12th'}
              </span>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
            <Link
              href={`/school-finder?id=${school.id}`}
              className="text-gray-500 hover:text-blue-600 text-xs font-medium flex items-center gap-1 truncate"
            >
              <Compass size={13} className="shrink-0" />
              <span>Map</span>
            </Link>
            <Link
              href={profileUrl}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shrink-0"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans flex flex-col">
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: query.pageTitle,
            numberOfItems: initialData.totalCount,
            itemListElement: displayedSchools.slice(0, 10).map((s, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: s.school_name || s.name,
              url: `https://www.cseel.org${getSchoolUrl(s)}`
            }))
          })
        }}
      />

      {/* ── Top Nav / Breadcrumbs ── */}


      {/* ── Hero Section (Carousel & Search) ── */}
      <div className="relative h-[400px] w-full bg-gray-900 flex items-center justify-center z-10">
        {/* Carousel Background */}
        <div className="absolute inset-0 overflow-hidden">
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentHeroIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={img} alt="School" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>
        
        {/* Search Overlay */}
        <div className="relative z-20 w-full max-w-3xl px-4 flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3 drop-shadow-md">
            Find the Best Schools for Your Child
          </h1>
          <p className="text-sm sm:text-base text-white/90 text-center mb-6 drop-shadow max-w-xl">
            {query.metaDescription || "Search through thousands of verified schools with detailed insights."}
          </p>

          <div className="w-full max-w-2xl flex flex-col sm:flex-row items-stretch sm:items-center bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full shadow-lg relative z-30 p-1.5 sm:p-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100">

            {/* City Selector */}
            <div className="relative w-full sm:w-auto z-40 shrink-0">
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center justify-between gap-3 px-3 py-2 w-full sm:w-[170px] transition-all group rounded-xl sm:rounded-full hover:bg-gray-100/70 active:bg-gray-100"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform shrink-0">
                    <MapPin size={15} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate block">
                    {selectedLocation || 'Select City'}
                  </span>
                </div>
                <ChevronDown size={13} className={`text-gray-400 group-hover:text-gray-600 transition-transform shrink-0 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* City Dropdown Menu */}
              {isLocationDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLocationDropdownOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 sm:mt-3 w-[290px] sm:w-[500px] md:w-[680px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Popular Cities</span>
                    </div>
                    <div className="p-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-60 sm:max-h-80 overflow-y-auto custom-scrollbar">
                      {POPULAR_CITIES.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => {
                            setSelectedLocation(city.name);
                            setIsLocationDropdownOpen(false);
                            setSearchTerm(city.name);
                            setSearchMode('text');
                          }}
                          className={`flex items-center gap-2 px-2 py-2 rounded-xl text-xs sm:text-sm transition-colors text-left ${
                            selectedLocation === city.name
                              ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                          }`}
                        >
                          <img
                            src={city.icon}
                            alt={city.name}
                            className="w-4 h-4 sm:w-5 sm:h-5 object-contain shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/48/marker.png'; }}
                          />
                          <span className="truncate whitespace-nowrap">{city.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-50">
                      <button
                        onClick={() => { setSelectedLocation(null); setIsLocationDropdownOpen(false); setSearchTerm(''); }}
                        className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        Clear Location
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Search Input & Near Me */}
            <div className="flex w-full flex-1 items-center bg-transparent px-2 sm:px-3 py-1 sm:py-0">
              <div className="flex-1 flex items-center bg-gray-50/80 sm:bg-gray-50 border border-gray-200/60 sm:border-transparent sm:focus-within:border-blue-500 sm:focus-within:bg-white rounded-xl sm:rounded-full px-3 py-1.5 transition-all">
                <Search
                  size={16}
                  className={`mr-2 shrink-0 transition-colors ${
                    searchTerm.trim() ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search school, city, UDISE..."
                  value={searchMode === 'near_me' ? '' : searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setSearchMode('text'); }}
                  disabled={searchMode === 'near_me'}
                  className="bg-transparent w-full focus:outline-none text-xs text-gray-800 placeholder-gray-400 font-medium"
                />
                {searchTerm.trim() && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 p-1 rounded-full hover:bg-gray-200/80 text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Near Me Button */}
              <div className="flex items-center pl-2 shrink-0">
                <button
                  onClick={() => { setSearchMode('near_me'); handleNearMeSearch(); }}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-full text-xs font-semibold transition-all border group ${
                    searchMode === 'near_me'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent'
                  }`}
                  title="Near Me"
                >
                  <MapPin size={15} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Near Me</span>
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>


      {/* ── Main Layout: Admin Dashboard Style (Sidebar + Content) ── */}
      <div className="max-w-screen-2xl mx-auto w-full flex flex-col md:flex-row gap-4 sm:gap-6 p-4 md:p-6 lg:p-8 flex-1">
        {/* Mobile Filter Backdrop */}
        {isMobileFilterOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-[60] md:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          />
        )}
        
        {/* Left Sidebar Filters (Side Sheet on Mobile) */}
        <aside className={`
          fixed inset-y-0 right-0 z-[70] w-4/5 max-w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
          ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}
          md:static md:translate-x-0 md:bg-transparent md:shadow-none md:z-auto md:shrink-0
          ${isDesktopSidebarOpen ? 'md:w-64 lg:w-72' : 'md:w-16'}
        `}>
          {/* Collapsed Desktop Icon Strip */}
          {!isDesktopSidebarOpen && (
            <div className="hidden md:flex flex-col items-center py-3 bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-24 w-16 max-h-[calc(100vh-8rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {/* Expand Toggle */}
              <button 
                onClick={() => setIsDesktopSidebarOpen(true)}
                className="w-11 h-11 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition group relative mb-2"
                title="Expand Filters"
              >
                <SlidersHorizontal className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute left-full ml-2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
                  Expand Filters
                </span>
              </button>

              <div className="w-8 h-px bg-gray-100 mb-2 shrink-0" />

              {/* Minimized Category Icons */}
              <div className="flex flex-col items-center gap-1 w-full px-2">
                {[
                  { icon: ArrowUpDown, label: 'Sort Results' },
                  { icon: Users, label: 'Eligible Schools' },
                  { icon: GraduationCap, label: 'Class' },
                  { icon: Award, label: 'Curriculum Board' },
                  { icon: Building2, label: 'School Type' },
                  { icon: Shield, label: 'Special Categories' },
                  { icon: Banknote, label: 'Fees Range' },
                  { icon: UsersRound, label: 'Student Strength' },
                  { icon: Sparkles, label: 'Facilities' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setIsDesktopSidebarOpen(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition group relative shrink-0"
                    title={item.label}
                  >
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="absolute left-full ml-2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Full Filter Panel */}
          <div className={`flex-1 overflow-y-auto overflow-x-hidden md:bg-white md:rounded-2xl md:border md:border-gray-200 md:shadow-sm md:sticky md:top-24 md:max-h-[calc(100vh-8rem)] p-4 sm:p-5 flex-col custom-scrollbar ${isDesktopSidebarOpen ? 'flex' : 'flex md:hidden'}`}>
            
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 md:hidden">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                <h2 className="font-bold text-lg text-gray-800">Filters</h2>
              </div>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Desktop Header with Collapse Button */}
            <div className="hidden md:flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-700 shrink-0" />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Filters
                </span>
              </div>
              <button 
                onClick={() => setIsDesktopSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition"
                title="Collapse Filters"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
            
            {/* Filter Content */}
            <div className="flex-1 flex flex-col">
            
            {/* Sort */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Sort Results</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      handleFilterChange({ sort: e.target.value });
                    }}
                    className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="students">Student Strength</option>
                    <option value="teachers">Faculty Count</option>
                    <option value="name">School Name (A-Z)</option>
                  </select>
            </div>

            {/* Eligible Schools (Add Child Details) */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Eligible Schools</h3>
                  <button
                    className="w-full text-left text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 px-3 rounded-xl transition-colors flex items-center justify-between"
                    onClick={() => alert("Add Child Details Modal")}
                  >
                    + Add Child Details
                  </button>
            </div>

            {/* Class Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                    Class
                    <span className="text-gray-400 hover:text-gray-600 cursor-pointer" title="Select class and get better search results specific to it!">
                      <HelpCircle size={14} />
                    </span>
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {[
                      { id: 'playgroup', label: 'Play Group' },
                      { id: 'prenursery', label: 'Pre-Nursery' },
                      { id: 'nursery', label: 'Nursery' },
                      { id: 'lkg', label: 'LKG' },
                      { id: 'ukg', label: 'UKG' },
                      { id: 'class1', label: 'Class 1' },
                      { id: 'class2', label: 'Class 2' },
                      { id: 'class3', label: 'Class 3' },
                      { id: 'class4', label: 'Class 4' },
                      { id: 'class5', label: 'Class 5' },
                      { id: 'class6', label: 'Class 6' },
                      { id: 'class7', label: 'Class 7' },
                      { id: 'class8', label: 'Class 8' },
                      { id: 'class9', label: 'Class 9' },
                      { id: 'class10', label: 'Class 10' },
                      { id: 'class11', label: 'Class 11' },
                      { id: 'class12', label: 'Class 12' },
                    ].map((cls) => (
                      <label key={cls.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <BookOpen size={14} className="text-[#0D4979]" />
                        <span className="text-sm text-gray-700 flex-1 group-hover:text-blue-600 transition-colors">{cls.label}</span>
                      </label>
                    ))}
                  </div>
            </div>

            {/* Board */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Curriculum Board</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'CBSE', Icon: BookOpen },
                      { name: 'ICSE', Icon: FileText },
                      { name: 'IB', Icon: Award },
                      { name: 'Cambridge/IGCSE', Icon: Landmark },
                      { name: 'State Board', Icon: Map }
                    ].map((b) => {
                      return (
                        <div key={b.name} className="group">
                          <label className="flex items-center gap-2 cursor-pointer group-hover:text-blue-600">
                            <input
                              type="checkbox"
                              name="board"
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <b.Icon size={14} className="text-[#0D4979]" />
                            <span className="text-sm text-gray-700 flex-1 group-hover:text-blue-600 transition-colors">
                              {b.name}
                            </span>
                            {b.name === 'State Board' && (
                              <button 
                                onClick={(e) => { e.preventDefault(); setIsStateModalOpen(true); }}
                                className="ml-auto text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                              >
                                Select State
                              </button>
                            )}
                          </label>
                        </div>
                      );
                    })}
                  </div>
            </div>

            {/* School Type */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">School Type</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Private Unaided', Icon: Building },
                      { name: 'Government', Icon: Landmark },
                      { name: 'Government Aided', Icon: Castle },
                      { name: 'International', Icon: Compass }
                    ].map((type) => (
                      <label key={type.name} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                        <type.Icon size={14} className="text-[#0D4979]" />
                        <span className="text-sm text-gray-700 flex-1 group-hover:text-blue-600 transition-colors">{type.name}</span>
                      </label>
                    ))}
                  </div>
            </div>

            {/* School Category (Find) */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Special Categories</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Sainik School', Icon: Shield },
                      { name: 'Kendriya Vidyalaya (KVS)', Icon: Landmark },
                      { name: 'Navodaya Vidyalaya (JNV)', Icon: GraduationCap },
                      { name: 'Army Public School (APS)', Icon: Swords },
                      { name: 'Eklavya Model (EMRS)', Icon: Target }
                    ].map((cat) => (
                      <label key={cat.name} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                        <cat.Icon size={14} className="text-[#0D4979]" />
                        <span className="text-sm text-gray-700 flex-1 group-hover:text-blue-600 transition-colors">{cat.name}</span>
                      </label>
                    ))}
                  </div>
            </div>

            {/* Fees Range */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Annual Fees Range</h3>
                  <div className="space-y-4 px-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>₹0</span>
                      <span className="font-semibold text-gray-700">Up to ₹{(feeMax / 100000).toFixed(1)}L</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="50000"
                      value={feeMax}
                      onChange={(e) => setFeeMax(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
            </div>

            {/* Student Strength */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Student Strength</h3>
                  <div className="space-y-4 px-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span className="font-semibold text-gray-700">Up to {studentMax === 5000 ? '5000+' : studentMax} students</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={studentMax}
                      onChange={(e) => setStudentMax(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
            </div>

            {/* Comprehensive Facilities */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Facilities</h3>
                  <div className="space-y-3">
                    {/* Academic Facilities */}
                    <details className="group">
                      <summary className="text-sm font-medium text-gray-800 cursor-pointer list-none flex items-center justify-between bg-gray-50 p-2 rounded-lg hover:bg-gray-100">
                        Academic & Labs
                        <ChevronDown size={16} className="text-gray-500 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="mt-2 space-y-2 px-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {[
                          { name: 'Science Lab', Icon: FlaskConical },
                          { name: 'Experiential Science Lab', Icon: FlaskConical },
                          { name: 'Computer Lab', Icon: Monitor },
                          { name: 'Smart Classes', Icon: Tv },
                          { name: 'Library', Icon: Library },
                          { name: 'ATL Tinkering Lab', Icon: Wrench },
                          { name: 'Robotics Lab', Icon: Bot },
                          { name: 'Language Lab', Icon: Mic },
                          { name: 'Math Lab', Icon: Calculator },
                          { name: 'VR/AR Learning', Icon: Glasses },
                          { name: 'E-Library', Icon: Laptop }
                        ].map((fac) => (
                          <label key={fac.name} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <fac.Icon size={12} className="text-[#0D4979]" />
                            <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{fac.name}</span>
                          </label>
                        ))}
                      </div>
                    </details>

                    {/* Sports & Fitness */}
                    <details className="group">
                      <summary className="text-sm font-medium text-gray-800 cursor-pointer list-none flex items-center justify-between bg-gray-50 p-2 rounded-lg hover:bg-gray-100">
                        Sports & Fitness
                        <ChevronDown size={16} className="text-gray-500 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="mt-2 space-y-2 px-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {[
                          { name: 'Playground', Icon: Trees },
                          { name: 'Indoor Games', Icon: Gamepad2 },
                          { name: 'Swimming Pool', Icon: Waves },
                          { name: 'Basketball Court', Icon: Activity },
                          { name: 'Football Ground', Icon: Trophy },
                          { name: 'Cricket Pitch', Icon: Target },
                          { name: 'Tennis Court', Icon: CircleDashed },
                          { name: 'Gymnasium', Icon: Dumbbell },
                          { name: 'Skating Rink', Icon: Activity },
                          { name: 'Yoga Center', Icon: HeartHandshake },
                          { name: 'Martial Arts', Icon: Swords },
                          { name: 'Running Track', Icon: Footprints }
                        ].map((fac) => (
                          <label key={fac.name} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <fac.Icon size={12} className="text-[#0D4979]" />
                            <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{fac.name}</span>
                          </label>
                        ))}
                      </div>
                    </details>

                    {/* Infrastructure & Safety */}
                    <details className="group">
                      <summary className="text-sm font-medium text-gray-800 cursor-pointer list-none flex items-center justify-between bg-gray-50 p-2 rounded-lg hover:bg-gray-100">
                        Infrastructure & Safety
                        <ChevronDown size={16} className="text-gray-500 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="mt-2 space-y-2 px-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {[
                          { name: 'CCTV Surveillance', Icon: Cctv },
                          { name: 'AC Classrooms', Icon: Wind },
                          { name: 'Wi-Fi Campus', Icon: Wifi },
                          { name: 'Transport Facility', Icon: Bus },
                          { name: 'Hostel (Boys/Girls)', Icon: Bed },
                          { name: 'Cafeteria/Canteen', Icon: Utensils },
                          { name: 'Medical Room/Clinic', Icon: Cross },
                          { name: 'Auditorium', Icon: Users },
                          { name: 'Disabled Friendly', Icon: Accessibility },
                          { name: 'Solar Power', Icon: Sun },
                          { name: 'RO Water', Icon: Droplet }
                        ].map((fac) => (
                          <label key={fac.name} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <fac.Icon size={12} className="text-[#0D4979]" />
                            <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{fac.name}</span>
                          </label>
                        ))}
                      </div>
                    </details>

                    {/* Extracurricular */}
                    <details className="group">
                      <summary className="text-sm font-medium text-gray-800 cursor-pointer list-none flex items-center justify-between bg-gray-50 p-2 rounded-lg hover:bg-gray-100">
                        Extracurricular
                        <ChevronDown size={16} className="text-gray-500 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="mt-2 space-y-2 px-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {[
                          { name: 'Art & Craft Room', Icon: Palette },
                          { name: 'Dance Room', Icon: Music },
                          { name: 'Music Room', Icon: Music },
                          { name: 'Drama Theatre', Icon: Clapperboard },
                          { name: 'NCC', Icon: Medal },
                          { name: 'Scouts & Guides', Icon: Tent },
                          { name: 'Debate Club', Icon: Mic },
                          { name: 'Eco Club', Icon: Leaf },
                          { name: 'Photography Club', Icon: Camera },
                          { name: 'Student Council', Icon: UsersRound }
                        ].map((fac) => (
                          <label key={fac.name} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <fac.Icon size={12} className="text-[#0D4979]" />
                            <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{fac.name}</span>
                          </label>
                        ))}
                      </div>
                    </details>

                  </div>
            </div>

            <button
                onClick={() => {
                  setSelectedBoard('all');
                  setSelectedResidential('all');
                  setOnlyAtl(false);
                  setSearchTerm('');
                  setSearchMode('text');
                  handleFilterChange({ board: undefined, residential: undefined, facility: undefined });
                }}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition mt-auto"
              >
                Reset Filters
              </button>
            
            </div> {/* End collapse wrapper */}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 flex flex-col gap-4">
          
          {/* Active Status, View Switcher & Map button */}
          <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-gray-700">
                  Showing {displayedSchools.length} {displayedSchools.length === 1 ? 'Result' : 'Results'}
                </h2>
                
                {/* View Mode Switcher */}
                <div className="flex items-center bg-gray-100 p-0.5 sm:p-1 rounded-xl border border-gray-200/60">
                  {/* Standard Grid / Cards */}
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="Card View (2 Columns on Desktop)"
                  >
                    <LayoutGrid size={14} />
                    <span className="hidden sm:inline">2 Cols</span>
                    <span className="sm:hidden">Cards</span>
                  </button>

                  {/* 3 Columns Grid (Desktop only) */}
                  <button
                    onClick={() => handleViewModeChange('grid3')}
                    className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      viewMode === 'grid3'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="3 Columns Grid"
                  >
                    <Columns3 size={14} />
                    <span>3 Cols</span>
                  </button>

                  {/* Compact List (4-5 on mobile screen!) */}
                  <button
                    onClick={() => handleViewModeChange('compact')}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      viewMode === 'compact'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="Compact View (4-5 schools on screen)"
                  >
                    <List size={14} />
                    <span>Compact</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="md:hidden p-2 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center transition"
                  title="Filters"
                >
                  <Filter size={14} className="sm:w-4 sm:h-4" />
                </button>
                
                <Link
                  href="/school-template"
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition"
                  title="School Profile Master Template & AI Content Guide for School Administrators"
                >
                  <Sparkles size={14} className="text-amber-600 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">School Template</span>
                  <span className="sm:hidden">Template</span>
                </Link>

                <Link
                  href="/school-finder"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition"
                >
                  <Map size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">View on Map</span>
                  <span className="sm:hidden">Map</span>
                </Link>
              </div>
            </div>

            <Link href="/about-experiential-lab" className="text-blue-500 hover:text-blue-700 hover:underline text-xs sm:text-[13px] font-semibold transition-colors">
              What is Experiential Science Lab?
            </Link>
          </div>

          {/* School Cards: Grid or Compact List */}
          {viewMode === 'compact' ? (
            <div className="flex flex-col gap-2 sm:gap-2.5">
              {displayedSchools.map((school, idx) => renderCompactSchoolRow(school, idx))}
            </div>
          ) : viewMode === 'grid3' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {displayedSchools.map((school, idx) => renderSchoolCard(school, idx))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-5">
              {displayedSchools.map((school, idx) => renderSchoolCard(school, idx))}
            </div>
          )}

          {displayedSchools.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-4">
              <Building2 size={40} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-800">No schools match your search</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or location settings.</p>
            </div>
          )}

          {/* Pagination */}
          {initialData.totalPages > 1 ? (
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Page <span className="font-bold text-gray-800">{initialData.currentPage}</span> of{' '}
                <span className="font-bold text-gray-800">{initialData.totalPages}</span> ({initialData.totalCount} schools)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={initialData.currentPage <= 1}
                  onClick={() => handlePageChange(initialData.currentPage - 1)}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition"
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(initialData.totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-bold transition ${
                          initialData.currentPage === pageNum
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={initialData.currentPage >= initialData.totalPages}
                  onClick={() => handlePageChange(initialData.currentPage + 1)}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            displayedSchools.length > 0 && (
              <div className="mt-6 text-center text-xs text-gray-400 font-medium py-2">
                Showing all {displayedSchools.length} {displayedSchools.length === 1 ? 'school' : 'schools'}
              </div>
            )
          )}
        </main>
      </div>

      {/* ── Top Rated Schools Section (Horizontal Scroll Carousel) ── */}
      {topSchools.length > 0 && (
        <div className="w-full bg-gray-50/80 py-8 sm:py-10 border-t border-gray-200">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={22} />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Top Rated Schools
                </h2>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                  (Swipe horizontally to explore)
                </span>
              </div>

              {/* Navigation arrows for desktop/tablet */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const el = document.getElementById('top-schools-slider');
                    if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition shadow-xs"
                  title="Scroll Left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('top-schools-slider');
                    if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition shadow-xs"
                  title="Scroll Right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Horizontal scroll container with compact cards */}
            <div
              id="top-schools-slider"
              className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4 md:mx-0 md:px-1"
            >
              {topSchools.map((school, idx) => renderTopSchoolCard(school, idx))}
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 relative">
            <button onClick={() => setIsCompareModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900">
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Scale className="text-blue-600" /> Compare Schools</h3>
            {/* Simple table for compare */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Parameters</th>
                    {compareList.map(c => <th key={c.id} className="p-3 font-bold">{c.school_name || c.name}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3 font-semibold">Board</td>{compareList.map(c => <td key={c.id} className="p-3">{c.board || 'CBSE'}</td>)}</tr>
                  <tr><td className="p-3 font-semibold">Rating</td>{compareList.map(c => <td key={c.id} className="p-3 text-amber-600 font-bold">★ {c.rating || 4.5}</td>)}</tr>
                  <tr><td className="p-3 font-semibold">Classes</td>{compareList.map(c => <td key={c.id} className="p-3">{c.classes || 'Nursery - 12th'}</td>)}</tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* State Board Modal */}
      {isStateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
            <button onClick={() => setIsStateModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900">
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="text-[#0D4979]" /> Select State Board</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1 custom-scrollbar">
              {['Andhra Pradesh', 'Delhi', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Maharashtra', 'Madhya Pradesh', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'].map(state => (
                <label key={state} className="flex items-center gap-2 p-3 border border-gray-100 hover:border-blue-300 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group">
                  <input type="checkbox" name="state_board_select" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{state}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setIsStateModalOpen(false)}
                className="px-6 py-2 bg-[#0D4979] text-white rounded-xl font-semibold shadow-md hover:bg-[#093254] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
