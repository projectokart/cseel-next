'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  GraduationCap,
  Users,
  Calendar,
  Languages,
  Search,
  Navigation,
  RotateCcw,
  SlidersHorizontal,
  X,
  ShieldCheck,
  ArrowRight,
  Globe,
  Share2,
  Heart,
  Star,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowUpDown,
  Award,
  CheckCircle2,
  Minimize2,
  Maximize2,
  LayoutGrid,
  List,
  AlertCircle,
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import ClaimSchoolModal from './ClaimSchoolModal';
import { renderBoardLogo } from './FacilityIcons';

interface SchoolItem {
  school_id: number | string;
  udise_code: string;
  school_name: string;
  address: string;
  pincode: string;
  state_id: number;
  state_name: string;
  district_id: number;
  district_name: string;
  block_name?: string;
  cluster_name?: string;
  board_name?: string;
  gender_type?: string;
  category_id: number;
  category_desc: string;
  management_id: number;
  management_desc: string;
  medium_id: number;
  medium_name: string;
  total_students: number | null;
  established_year: number | null;
  residential_desc: string | null;
  website?: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_km: number | null;
  is_claimed: boolean;
  verification_status: string;
  profile_url: string;
  logo_url?: string | null;
  image?: string | null;
  image_url?: string | null;
  rating?: number | null;
  reviews?: number | null;
}

interface LookupState {
  state_id: number;
  state_name: string;
  total_schools?: number;
}

interface LookupDistrict {
  district_id: number;
  district_name: string;
  state_id: number;
  state_name?: string;
  total_schools?: number;
}

interface LookupBlock {
  block_id: number;
  block_name: string;
  district_id: number;
  district_name?: string;
  total_schools?: number;
}

interface LookupCluster {
  cluster_id: string;
  cluster_name: string;
  block_id?: string;
  total_schools?: number;
}

interface LookupBoard {
  board_id: string;
  board_name: string;
  code?: string;
}

interface LookupManagement {
  management_id: string;
  management_desc: string;
}

interface LookupCategory {
  category_id: number;
  category_desc: string;
}

interface LookupMedium {
  medium_id: number;
  medium_name: string;
}

interface Props {
  verifiedOnly?: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
}

const HERO_IMAGES = [
  '/images/schools/hero-school-1.png',
  '/images/schools/hero-school-2.jpg',
  '/images/schools/hero-school-3.jpg',
  '/images/schools/hero-school-4.png',
];

const PLACEHOLDER_EMPTY_IMAGE = '/images/default-school-placeholder.png?v=3';

// Task 9: Clean School Names (strip leading dashes, dots, punctuation, serial codes)
export function cleanSchoolName(rawName: string | null | undefined): string {
  if (!rawName) return 'School';
  let name = String(rawName).trim();

  // Strip leading punctuation, symbols, brackets, quotes
  name = name.replace(/^[-–—_.~*#'"`\s]+/, '');

  // Strip leading numbers with dots/brackets e.g. "(01002) ", "01. ", "01- ", "A-", "1. "
  name = name.replace(/^\(?\d+[\).]?[-\s]+/, '');
  name = name.replace(/^\[?\d+\]?[-\s]+/, '');
  name = name.replace(/^[-–—_.~*#'"`\s]+/, '');

  name = name.trim();
  if (!name) return 'School';

  // Convert ALL CAPS to title case nicely
  if (name === name.toUpperCase() && name.length > 3) {
    name = name
      .toLowerCase()
      .split(/\s+/)
      .map((word) => {
        const w = word.trim();
        const cleanWord = w.replace(/[^a-zA-Z0-9]/g, '');
        if (['cbse', 'icse', 'kv', 'dps', 'dav', 'aps', 'jnv', 'pm', 'govt', 'sms'].includes(cleanWord)) {
          return w.toUpperCase();
        }
        if (['sr', 'sec', 'no', 'dr', 'mr', 'mrs', 'st'].includes(cleanWord)) {
          return w.charAt(0).toUpperCase() + w.slice(1);
        }
        if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i.test(cleanWord)) {
          return w.toUpperCase();
        }
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(' ');
  }

  return name;
}

const getSafeSchoolImage = (img?: string | null) => {
  if (
    !img ||
    img.includes('default-school-campus') ||
    img.includes('default-campus') ||
    img.includes('hero-school-') ||
    img.includes('edunova-hero') ||
    img.includes('unsplash.com')
  ) {
    return PLACEHOLDER_EMPTY_IMAGE;
  }
  return img;
};

function formatCardLocation(school: SchoolItem): string {
  const dist = (school.district_name || '').trim();
  const st = (school.state_name || '').trim();
  let addr = (school.address || '').trim();

  let cleanDist = dist
    ? dist.toLowerCase().split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : '';
  let cleanState = st
    ? st.toLowerCase().split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : '';

  if (cleanDist.toLowerCase() === 'east' && cleanState.toLowerCase().includes('delhi')) {
    cleanDist = 'East Delhi';
  } else if (cleanDist.toLowerCase() === 'west' && cleanState.toLowerCase().includes('delhi')) {
    cleanDist = 'West Delhi';
  } else if (cleanDist.toLowerCase() === 'north' && cleanState.toLowerCase().includes('delhi')) {
    cleanDist = 'North Delhi';
  } else if (cleanDist.toLowerCase() === 'south' && cleanState.toLowerCase().includes('delhi')) {
    cleanDist = 'South Delhi';
  } else if (cleanDist.toLowerCase() === 'central' && cleanState.toLowerCase().includes('delhi')) {
    cleanDist = 'Central Delhi';
  }

  if (!addr) {
    return [cleanDist, cleanState].filter(Boolean).join(', ') || 'India';
  }

  addr = addr.replace(/[\s,-]+\b\d{6}\b.*$/i, '').trim();

  if (addr === addr.toUpperCase() && addr.length > 3) {
    addr = addr
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  const lowerAddr = addr.toLowerCase();
  const parts: string[] = [addr];
  if (cleanDist && !lowerAddr.includes(cleanDist.toLowerCase())) {
    parts.push(cleanDist);
  }
  if (cleanState && !lowerAddr.includes(cleanState.toLowerCase())) {
    parts.push(cleanState);
  }
  return parts.join(', ');
}

const formatCompactClasses = (classesVal?: string): string => {
  const raw = (classesVal || '').trim();
  if (!raw) return 'Class 1st-12th';
  const lower = raw.toLowerCase();

  let res = '1st-12th';
  if (/^\d+(?:st|nd|rd|th)?\s*[-–]\s*\d+(?:st|nd|rd|th)?$/i.test(raw)) {
    res = raw.replace(/\s*[-–]\s*/, '-');
  } else if (/^(?:nursery|play|kg|pre-nursery|pre-school|prep)\s*[-–]\s*\d+(?:st|nd|rd|th)?$/i.test(raw)) {
    res = raw.replace(/\s*[-–]\s*/, '-');
  } else if (lower.includes('pre') || lower.includes('nurs') || lower.includes('kg') || lower.includes('play')) {
    if (lower.includes('12') || lower.includes('senior') || lower.includes('sr.')) res = 'Nursery-12th';
    else if (lower.includes('10') || lower.includes('sec')) res = 'Nursery-10th';
    else if (lower.includes('8') || lower.includes('middle')) res = 'Nursery-8th';
    else if (lower.includes('5') || lower.includes('primary')) res = 'Nursery-5th';
    else res = 'Nursery-12th';
  } else if (lower.includes('primary') || lower.includes('class 1') || lower.includes('1st')) {
    if (lower.includes('senior') || lower.includes('12') || lower.includes('sr.')) res = '1st-12th';
    else if (lower.includes('second') || lower.includes('10')) res = '1st-10th';
    else if (lower.includes('middle') || lower.includes('8')) res = '1st-8th';
    else if (lower.includes('5')) res = '1st-5th';
    else res = '1st-10th';
  } else if (lower.includes('middle') || lower.includes('class 6') || lower.includes('6th')) {
    if (lower.includes('senior') || lower.includes('12')) res = '6th-12th';
    else res = '6th-10th';
  } else if (lower.includes('higher secondary') || lower.includes('jr. college') || lower.includes('11-12') || lower.includes('11th')) {
    res = '11th-12th';
  } else if (lower.includes('secondary') || lower.includes('9-10') || lower.includes('9th')) {
    res = '9th-10th';
  } else {
    const numbers = raw.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      res = `${numbers[0]}th-${numbers[1]}th`;
    } else {
      res = '1st-12th';
    }
  }
  return `Class ${res}`;
};

const renderSchoolTitleWithVerified = (name: string, isVerified: boolean = true) => {
  const clean = cleanSchoolName(name);
  if (!clean) return null;

  return (
    <span className="inline">
      {clean}
      {isVerified && (
        <span title="CSEEL Verified School" className="inline-flex items-center">
          <CheckCircle2
            size={13}
            className="inline-block align-baseline ml-1 text-white fill-blue-600 drop-shadow-xs -translate-y-[1px] shrink-0"
            aria-label="CSEEL Verified School"
          />
        </span>
      )}
    </span>
  );
};

export default function AllIndiaSchoolsView({
  verifiedOnly = false,
  pageTitle = "All India Private Schools Directory",
  pageSubtitle = "India's largest verified database of over 4.4 Lakh private schools across 35 States, 871 Districts, 7,800+ Blocks, and 61,000+ Clusters to discover your nearby educational institutions.",
}: Props) {
  // Data States
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lookups State
  const [states, setStates] = useState<LookupState[]>([]);
  const [districts, setDistricts] = useState<LookupDistrict[]>([]);
  const [blocks, setBlocks] = useState<LookupBlock[]>([]);
  const [clusters, setClusters] = useState<LookupCluster[]>([]);
  const [boards, setBoards] = useState<LookupBoard[]>([]);
  const [managements, setManagements] = useState<LookupManagement[]>([]);
  const [categories, setCategories] = useState<LookupCategory[]>([]);
  const [mediums, setMediums] = useState<LookupMedium[]>([]);

  // Committed / Active Search Filter States
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [activeState, setActiveState] = useState<string>('');
  const [activeDistrict, setActiveDistrict] = useState<string>('');
  const [activeBlock, setActiveBlock] = useState<string>('');
  const [activeCluster, setActiveCluster] = useState<string>('');
  const [activeBoard, setActiveBoard] = useState<string>('');
  const [activeManagement, setActiveManagement] = useState<string>('');
  const [activeResidential, setActiveResidential] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeMedium, setActiveMedium] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');

  // Draft Filter States (Updated in UI, Committed on "Apply Filters" click)
  const [draftSearch, setDraftSearch] = useState<string>('');
  const [draftState, setDraftState] = useState<string>('');
  const [draftDistrict, setDraftDistrict] = useState<string>('');
  const [draftBlock, setDraftBlock] = useState<string>('');
  const [draftCluster, setDraftCluster] = useState<string>('');
  const [draftBoard, setDraftBoard] = useState<string>('');
  const [draftManagement, setDraftManagement] = useState<string>('');
  const [draftResidential, setDraftResidential] = useState<string>('');
  const [draftCategory, setDraftCategory] = useState<string>('');
  const [draftMedium, setDraftMedium] = useState<string>('');

  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
  const [loadingBlocks, setLoadingBlocks] = useState<boolean>(false);
  const [loadingClusters, setLoadingClusters] = useState<boolean>(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState<boolean>(false);

  // Dynamic Pagination (Strictly capped at 10 pages maximum)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(441516);
  const [totalPages, setTotalPages] = useState<number>(10);
  const isInitializedRef = useRef<boolean>(false);

  // Hierarchical 11-Metric Summary State (Reactive to State -> District -> Block -> Cluster)
  const [hierarchySummary, setHierarchySummary] = useState<{
    total_schools: number;
    cbse_count: number;
    icse_count: number;
    ib_count: number;
    state_board_count: number;
    madarsa_board_count: number;
    sanskrit_board_count: number;
    other_boards_count: number;
    recognized_count: number;
    unrecognized_count: number;
    residential_count: number;
    non_residential_count: number;
  }>({
    total_schools: 441516,
    cbse_count: 20306,
    icse_count: 2505,
    ib_count: 267,
    state_board_count: 105080,
    madarsa_board_count: 106,
    sanskrit_board_count: 192,
    other_boards_count: 313622,
    recognized_count: 405296,
    unrecognized_count: 36220,
    residential_count: 1474,
    non_residential_count: 440042,
  });

  // Reactive Summary Fetch Effect whenever hierarchy selection changes
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const params = new URLSearchParams();
        const sState = draftState || activeState;
        const sDist = draftDistrict || activeDistrict;
        const sBlk = draftBlock || activeBlock;
        const sClust = draftCluster || activeCluster;

        if (sState) params.set('state', sState);
        if (sDist) params.set('district', sDist);
        if (sBlk) params.set('block', sBlk);
        if (sClust) params.set('cluster', sClust);

        const res = await fetch(`/api/schools/summary?${params.toString()}`);
        const data = await res.json();
        if (data.success && data.summary) {
          setHierarchySummary(data.summary);
        }
      } catch (err) {
        console.error('Failed to fetch hierarchy summary:', err);
      }
    };
    fetchSummary();
  }, [draftState, activeState, draftDistrict, activeDistrict, draftBlock, activeBlock, draftCluster, activeCluster]);

  const getBoardCount = (boardName: string): number => {
    const b = (boardName || '').toLowerCase();
    if (b.includes('cbse') && b.includes('state')) return 3;
    if (b.includes('cbse')) return hierarchySummary.cbse_count;
    if (b.includes('icse') || b.includes('cisce')) return hierarchySummary.icse_count;
    if (b.includes('international') || b.includes('ib') || b.includes('cambridge')) return hierarchySummary.ib_count;
    if (b.includes('madarsa') || b.includes('madrasa')) return hierarchySummary.madarsa_board_count;
    if (b.includes('sanskrit')) return hierarchySummary.sanskrit_board_count;
    if (b.includes('state')) return hierarchySummary.state_board_count;
    return hierarchySummary.other_boards_count;
  };

  const getManagementCount = (mgmtDesc: string): number => {
    const m = (mgmtDesc || '').toLowerCase();
    if (m.includes('unrecognized') || m.includes('un-recog')) return hierarchySummary.unrecognized_count;
    return hierarchySummary.recognized_count;
  };

  // Task 3: View Mode Toggle (Default to 'compact' list card)
  const [viewMode, setViewMode] = useState<'compact' | 'grid'>('compact');

  // Geolocation & Consent State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [cookieConsentDismissed, setCookieConsentDismissed] = useState<boolean>(true);
  const [locatingUser, setLocatingUser] = useState<boolean>(false);
  const [mapRadiusKm, setMapRadiusKm] = useState<number>(10);

  // UI Controls
  const [isHeroMinimized, setIsHeroMinimized] = useState<boolean>(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0);
  const [navBottomOffset, setNavBottomOffset] = useState<number>(64);

  // Claim Modal State
  const [claimModalData, setClaimModalData] = useState<{
    isOpen: boolean;
    schoolName: string;
    udiseCode: string;
  }>({
    isOpen: false,
    schoolName: '',
    udiseCode: '',
  });

  // Share & Like States
  const [copiedUdise, setCopiedUdise] = useState<string | null>(null);
  const [likedSchools, setLikedSchools] = useState<Record<string, boolean>>({});

  // Dynamic Navbar Offset Detection
  useEffect(() => {
    const updateNavOffset = () => {
      if (typeof window === 'undefined') return;
      const navEl =
        document.querySelector('header') ||
        document.querySelector('#site-topbar') ||
        document.querySelector('.site-topbar') ||
        document.querySelector('nav');
      if (navEl) {
        const rect = navEl.getBoundingClientRect();
        const bottom = Math.round(rect.bottom);
        if (bottom > 0 && bottom < 160) {
          setNavBottomOffset(bottom);
          return;
        }
      }
      setNavBottomOffset(64);
    };
    updateNavOffset();
    window.addEventListener('scroll', updateNavOffset, { passive: true });
    window.addEventListener('resize', updateNavOffset);
    return () => {
      window.removeEventListener('scroll', updateNavOffset);
      window.removeEventListener('resize', updateNavOffset);
    };
  }, []);

  // URL Query Sync (Mount initialization & browser navigation)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const pPage = parseInt(urlParams.get('page') || '1', 10);
    if (!isNaN(pPage) && pPage >= 1) {
      setCurrentPage(pPage);
    }
    const pSearch = urlParams.get('search');
    if (pSearch) {
      setActiveSearch(pSearch);
      setDraftSearch(pSearch);
    }
    const pState = urlParams.get('state') || urlParams.get('state_name');
    if (pState) {
      setActiveState(pState);
      setDraftState(pState);
    }
    const pDistrict = urlParams.get('district') || urlParams.get('district_name');
    if (pDistrict) {
      setActiveDistrict(pDistrict);
      setDraftDistrict(pDistrict);
    }
    const pBlock = urlParams.get('block') || urlParams.get('block_name');
    if (pBlock) {
      setActiveBlock(pBlock);
      setDraftBlock(pBlock);
    }
    const pCluster = urlParams.get('cluster') || urlParams.get('cluster_name');
    if (pCluster) {
      setActiveCluster(pCluster);
      setDraftCluster(pCluster);
    }
    const pBoard = urlParams.get('board') || urlParams.get('board_name');
    if (pBoard) {
      setActiveBoard(pBoard);
      setDraftBoard(pBoard);
    }
    const pMgmt = urlParams.get('management') || urlParams.get('management_desc');
    if (pMgmt) {
      setActiveManagement(pMgmt);
      setDraftManagement(pMgmt);
    }
    const pRes = urlParams.get('residential');
    if (pRes) {
      setActiveResidential(pRes);
      setDraftResidential(pRes);
    }
    const pCat = urlParams.get('category');
    if (pCat) {
      setActiveCategory(pCat);
      setDraftCategory(pCat);
    }
    const pMed = urlParams.get('medium');
    if (pMed) {
      setActiveMedium(pMed);
      setDraftMedium(pMed);
    }
    const pSort = urlParams.get('sort');
    if (pSort) {
      setSortBy(pSort);
    }

    const pNearMe = urlParams.get('nearMe') === 'true' || urlParams.get('locate') === 'true';
    const pLat = parseFloat(urlParams.get('lat') || '');
    const pLng = parseFloat(urlParams.get('lng') || '');
    if (pNearMe) {
      if (!isNaN(pLat) && !isNaN(pLng)) {
        setUserCoords({ lat: pLat, lng: pLng });
        setLocationName('Near Me (10 km radius)');
      } else {
        if (typeof window !== 'undefined' && navigator.geolocation) {
          setLocatingUser(true);
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setUserCoords({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
              setLocationName('Near Me (10 km radius)');
              setLocatingUser(false);
              setCurrentPage(1);
            },
            (err) => {
              console.warn('Geolocation error:', err);
              setLocatingUser(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
          );
        }
      }
    }

    // Mark as initialized so URL sync won't wipe initial query parameters
    isInitializedRef.current = true;

    const handlePopState = () => {
      const q = new URLSearchParams(window.location.search);
      const curP = parseInt(q.get('page') || '1', 10);
      setCurrentPage(!isNaN(curP) && curP >= 1 ? curP : 1);
      setActiveSearch(q.get('search') || '');
      setDraftSearch(q.get('search') || '');
      setActiveState(q.get('state') || '');
      setDraftState(q.get('state') || '');
      setActiveDistrict(q.get('district') || '');
      setDraftDistrict(q.get('district') || '');
      setActiveBlock(q.get('block') || '');
      setDraftBlock(q.get('block') || '');
      setActiveCluster(q.get('cluster') || '');
      setDraftCluster(q.get('cluster') || '');
      setActiveBoard(q.get('board') || '');
      setDraftBoard(q.get('board') || '');
      setActiveManagement(q.get('management') || '');
      setDraftManagement(q.get('management') || '');
      setActiveResidential(q.get('residential') || '');
      setDraftResidential(q.get('residential') || '');
      setActiveCategory(q.get('category') || '');
      setDraftCategory(q.get('category') || '');
      setActiveMedium(q.get('medium') || '');
      setDraftMedium(q.get('medium') || '');
      setSortBy(q.get('sort') || 'default');

      const qNearMe = q.get('nearMe') === 'true' || q.get('locate') === 'true';
      const qLat = parseFloat(q.get('lat') || '');
      const qLng = parseFloat(q.get('lng') || '');
      if (qNearMe && !isNaN(qLat) && !isNaN(qLng)) {
        setUserCoords({ lat: qLat, lng: qLng });
        setLocationName('Near Me (10 km radius)');
      } else if (!qNearMe) {
        setUserCoords(null);
        setLocationName('');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync active filters and pagination directly to URL
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitializedRef.current) return;
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', String(currentPage));
    if (activeSearch.trim()) params.set('search', activeSearch.trim());
    if (activeState) params.set('state', activeState);
    if (activeDistrict) params.set('district', activeDistrict);
    if (activeBlock) params.set('block', activeBlock);
    if (activeCluster) params.set('cluster', activeCluster);
    if (activeBoard && activeBoard !== 'all') params.set('board', activeBoard);
    if (activeManagement && activeManagement !== 'all') params.set('management', activeManagement);
    if (activeResidential && activeResidential !== 'all') params.set('residential', activeResidential);
    if (activeCategory && activeCategory !== 'all') params.set('category', activeCategory);
    if (activeMedium && activeMedium !== 'all') params.set('medium', activeMedium);
    if (sortBy && sortBy !== 'default') params.set('sort', sortBy);
    if (userCoords) {
      params.set('nearMe', 'true');
      params.set('lat', String(userCoords.lat));
      params.set('lng', String(userCoords.lng));
    }

    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    if (window.location.search !== (qs ? `?${qs}` : '')) {
      window.history.pushState(null, '', newUrl);
    }
  }, [
    currentPage,
    activeSearch,
    activeState,
    activeDistrict,
    activeBlock,
    activeCluster,
    activeBoard,
    activeManagement,
    activeResidential,
    activeCategory,
    activeMedium,
    sortBy,
    userCoords,
  ]);

  // Hero carousel auto-play
  useEffect(() => {
    if (isHeroMinimized) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHeroMinimized]);

  // Load Base Lookups on mount
  useEffect(() => {
    async function loadLookups() {
      try {
        const res = await fetch('/api/schools/lookups');
        const data = await res.json();
        if (data.success) {
          setStates(data.states || []);
          setBoards(data.boards || []);
          setManagements(data.managements || []);
          setCategories(data.categories || []);
          setMediums(data.mediums || []);
        }
      } catch (err) {
        console.error('Failed to load lookups:', err);
      }
    }
    loadLookups();
  }, []);

  // Dynamically load districts when draftState changes
  useEffect(() => {
    if (!draftState) {
      setDistricts([]);
      setDraftDistrict('');
      setBlocks([]);
      setDraftBlock('');
      setClusters([]);
      setDraftCluster('');
      return;
    }
    let isMounted = true;
    setLoadingDistricts(true);
    fetch(`/api/schools/lookups?state_name=${encodeURIComponent(draftState)}`)
      .then((r) => r.json())
      .then((data) => {
        if (isMounted && data.success) {
          setDistricts(data.districts || []);
        }
      })
      .catch((err) => console.error('Error fetching districts:', err))
      .finally(() => {
        if (isMounted) setLoadingDistricts(false);
      });
    return () => {
      isMounted = false;
    };
  }, [draftState]);

  // Dynamically load blocks when draftDistrict changes
  useEffect(() => {
    if (!draftDistrict) {
      setBlocks([]);
      setDraftBlock('');
      setClusters([]);
      setDraftCluster('');
      return;
    }
    let isMounted = true;
    setLoadingBlocks(true);
    fetch(`/api/schools/lookups?district_name=${encodeURIComponent(draftDistrict)}`)
      .then((r) => r.json())
      .then((data) => {
        if (isMounted && data.success) {
          setBlocks(data.blocks || []);
        }
      })
      .catch((err) => console.error('Error fetching blocks:', err))
      .finally(() => {
        if (isMounted) setLoadingBlocks(false);
      });
    return () => {
      isMounted = false;
    };
  }, [draftDistrict]);

  // Dynamically load clusters when draftBlock changes
  useEffect(() => {
    if (!draftBlock) {
      setClusters([]);
      setDraftCluster('');
      return;
    }
    const blkObj = blocks.find((b) => b.block_name === draftBlock || String(b.block_id) === draftBlock);
    const blkId = blkObj ? blkObj.block_id : draftBlock;
    let isMounted = true;
    setLoadingClusters(true);
    fetch(`/api/schools/lookups?block_id=${blkId}`)
      .then((r) => r.json())
      .then((data) => {
        if (isMounted && data.success) {
          setClusters(data.clusters || []);
        }
      })
      .catch((err) => console.error('Error fetching clusters:', err))
      .finally(() => {
        if (isMounted) setLoadingClusters(false);
      });
    return () => {
      isMounted = false;
    };
  }, [draftBlock, blocks]);

  // Active filters count
  const activeCount = useMemo(() => {
    let count = 0;
    if (activeState) count++;
    if (activeDistrict) count++;
    if (activeBlock) count++;
    if (activeCluster) count++;
    if (activeBoard) count++;
    if (activeManagement) count++;
    if (activeResidential && activeResidential !== 'all') count++;
    if (activeCategory) count++;
    if (activeMedium) count++;
    if (activeSearch.trim()) count++;
    if (sortBy && sortBy !== 'default') count++;
    if (userCoords) count++;
    return count;
  }, [
    activeState,
    activeDistrict,
    activeBlock,
    activeCluster,
    activeBoard,
    activeManagement,
    activeResidential,
    activeCategory,
    activeMedium,
    activeSearch,
    sortBy,
    userCoords,
  ]);

  // Alphabetical sorting for all filter options (Task 1)
  const sortedStates = useMemo(() => {
    return [...states].sort((a, b) =>
      (a.state_name || '').localeCompare(b.state_name || '', undefined, { sensitivity: 'base' })
    );
  }, [states]);

  const sortedDistricts = useMemo(() => {
    return [...districts].sort((a, b) =>
      (a.district_name || '').localeCompare(b.district_name || '', undefined, { sensitivity: 'base' })
    );
  }, [districts]);

  const sortedBlocks = useMemo(() => {
    return [...blocks].sort((a, b) =>
      (a.block_name || '').localeCompare(b.block_name || '', undefined, { sensitivity: 'base' })
    );
  }, [blocks]);

  const sortedClusters = useMemo(() => {
    return [...clusters].sort((a, b) =>
      (a.cluster_name || '').localeCompare(b.cluster_name || '', undefined, { sensitivity: 'base' })
    );
  }, [clusters]);

  const sortedBoards = useMemo(() => {
    return [...boards].sort((a, b) =>
      (a.board_name || '').localeCompare(b.board_name || '', undefined, { sensitivity: 'base' })
    );
  }, [boards]);

  const sortedManagements = useMemo(() => {
    return [...managements].sort((a, b) =>
      (a.management_desc || '').localeCompare(b.management_desc || '', undefined, { sensitivity: 'base' })
    );
  }, [managements]);

  // Dynamic compact pagination range window calculation (1, 2, ..., 10)
  const paginationRange = useMemo<(number | string)[]>(() => {
    const effectiveTotal = Math.min(10, Math.max(1, totalPages));
    if (effectiveTotal <= 4) {
      return Array.from({ length: effectiveTotal }, (_, i) => i + 1);
    }
    // Compact layout requested by user: 1 2 ... 10
    if (currentPage <= 2) {
      return [1, 2, '...', effectiveTotal];
    } else if (currentPage >= effectiveTotal - 1) {
      return [1, '...', effectiveTotal - 1, effectiveTotal];
    } else {
      return [1, '...', currentPage, '...', effectiveTotal];
    }
  }, [currentPage, totalPages]);

  // Main Fetch Function (Triggered by active search states with sessionStorage cache)
  const fetchSchools = useCallback(async () => {
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', '25');

      if (verifiedOnly) params.set('verified_only', 'true');
      if (activeSearch.trim()) params.set('search', activeSearch.trim());
      if (activeState) params.set('state', activeState);
      if (activeDistrict) params.set('district', activeDistrict);
      if (activeBlock) params.set('block', activeBlock);
      if (activeCluster) params.set('cluster', activeCluster);
      if (activeBoard) params.set('board', activeBoard);
      if (activeManagement) params.set('management', activeManagement);
      if (activeResidential && activeResidential !== 'all') params.set('residential', activeResidential);
      if (activeCategory) params.set('category', activeCategory);
      if (activeMedium) params.set('medium', activeMedium);
      if (sortBy) params.set('sort', sortBy);
      if (userCoords) {
        params.set('lat', String(userCoords.lat));
        params.set('lng', String(userCoords.lng));
        params.set('radius_km', String(mapRadiusKm));
      }

      // Real-time fetch directly from Supabase (never serve stale cache)
      setLoading(true);
      const res = await fetch(`/api/schools/all-india?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      const data = await res.json();
      if (data.success) {
        const schoolsList = data.schools || [];
        setSchools(schoolsList);
        const resolvedTotal = typeof data.totalCount === 'number' ? data.totalCount : totalCount;
        let resolvedPages = 10;
        if (typeof data.totalPages === 'number') {
          resolvedPages = Math.max(1, Math.min(10, data.totalPages));
        } else if (typeof data.totalCount === 'number') {
          resolvedPages = Math.max(1, Math.min(10, Math.ceil(data.totalCount / 25)));
        }
        setTotalCount(resolvedTotal);
        setTotalPages(resolvedPages);
      } else {
        setError(data.error || 'Unable to load schools');
      }
    } catch (err: any) {
      console.error('Fetch schools error:', err);
      setError('Unable to load schools at this time');
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    verifiedOnly,
    activeSearch,
    activeState,
    activeDistrict,
    activeBlock,
    activeCluster,
    activeBoard,
    activeManagement,
    activeResidential,
    activeCategory,
    activeMedium,
    sortBy,
    userCoords,
    mapRadiusKm,
  ]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  // Task 4: Apply Filters Trigger Function
  const handleApplyFilters = () => {
    setActiveState(draftState);
    setActiveDistrict(draftDistrict);
    setActiveBlock(draftBlock);
    setActiveCluster(draftCluster);
    setActiveBoard(draftBoard);
    setActiveManagement(draftManagement);
    setActiveResidential(draftResidential);
    setActiveCategory(draftCategory);
    setActiveMedium(draftMedium);
    setActiveSearch(draftSearch.replace(/[^a-zA-Z0-9\s]/g, '').trim());
    setCurrentPage(1);
    if (isMobileFilterOpen) setIsMobileFilterOpen(false);
    const contentEl = document.getElementById('schools-directory-content');
    if (contentEl) contentEl.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset Filters
  const handleClearFilters = () => {
    setDraftSearch('');
    setDraftState('');
    setDraftDistrict('');
    setDraftBlock('');
    setDraftCluster('');
    setDraftBoard('');
    setDraftManagement('');
    setDraftResidential('');
    setDraftCategory('');
    setDraftMedium('');
    setSortBy('default');

    setActiveSearch('');
    setActiveState('');
    setActiveDistrict('');
    setActiveBlock('');
    setActiveCluster('');
    setActiveBoard('');
    setActiveManagement('');
    setActiveResidential('');
    setActiveCategory('');
    setActiveMedium('');
    setUserCoords(null);
    setLocationName('');
    setCurrentPage(1);
  };

  const handleSelectStateQuick = (stateName: string) => {
    setDraftState(stateName);
    setActiveState(stateName);
    setDraftDistrict('');
    setActiveDistrict('');
    setDraftBlock('');
    setActiveBlock('');
    setDraftCluster('');
    setActiveCluster('');
    setCurrentPage(1);
    setIsLocationDropdownOpen(false);
  };

  const handleResetLocationQuick = () => {
    setDraftState('');
    setActiveState('');
    setDraftDistrict('');
    setActiveDistrict('');
    setDraftBlock('');
    setActiveBlock('');
    setDraftCluster('');
    setActiveCluster('');
    setCurrentPage(1);
    setIsLocationDropdownOpen(false);
  };

  // Task 5: Handle Locate User (Schools Near Me)
  const handleLocateUser = () => {
    if (userCoords) {
      setUserCoords(null);
      setLocationName('');
      setCurrentPage(1);
      return;
    }
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationName('Near Me (10 km radius)');
        setLocatingUser(false);
        setCurrentPage(1);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocatingUser(false);
        alert('Could not access your location. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleShare = (school: SchoolItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = `${window.location.origin}${school.profile_url}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedUdise(school.udise_code);
      setTimeout(() => setCopiedUdise(null), 2500);
    }
  };

  const handleToggleLike = (udise: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedSchools((prev) => ({ ...prev, [udise]: !prev[udise] }));
  };

  const openGoogleMaps = (school: SchoolItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const query =
      school.latitude && school.longitude
        ? `${school.latitude},${school.longitude}`
        : encodeURIComponent(`${school.school_name}, ${school.district_name}, ${school.state_name}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // ── Render Filter Body (Shared between Desktop Sidebar & Mobile Sheet) ──────
  const renderFilterBody = () => (
    <div className="space-y-3.5 text-[13px] text-gray-700">
      {/* Active Filter Chips Bar */}
      {activeCount > 0 && (
        <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              {activeCount} Active Filter{activeCount > 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[11px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition hover:underline"
            >
              <RotateCcw size={11} />
              Reset All
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {activeSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200">
                Search: {activeSearch}
                <button type="button" onClick={() => { setActiveSearch(''); setDraftSearch(''); setCurrentPage(1); }} className="hover:text-red-600 ml-0.5">
                  <X size={11} />
                </button>
              </span>
            )}
            {activeState && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200">
                State: {activeState}
                <button type="button" onClick={() => { setActiveState(''); setDraftState(''); setActiveDistrict(''); setDraftDistrict(''); setCurrentPage(1); }} className="hover:text-red-600 ml-0.5">
                  <X size={11} />
                </button>
              </span>
            )}
            {activeDistrict && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200">
                District: {activeDistrict}
                <button type="button" onClick={() => { setActiveDistrict(''); setDraftDistrict(''); setActiveBlock(''); setDraftBlock(''); setCurrentPage(1); }} className="hover:text-red-600 ml-0.5">
                  <X size={11} />
                </button>
              </span>
            )}
            {activeBlock && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200">
                Block: {activeBlock}
                <button type="button" onClick={() => { setActiveBlock(''); setDraftBlock(''); setActiveCluster(''); setDraftCluster(''); setCurrentPage(1); }} className="hover:text-red-600 ml-0.5">
                  <X size={11} />
                </button>
              </span>
            )}
            {activeCluster && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200">
                Cluster: {activeCluster}
                <button type="button" onClick={() => { setActiveCluster(''); setDraftCluster(''); setCurrentPage(1); }} className="hover:text-red-600 ml-0.5">
                  <X size={11} />
                </button>
              </span>
            )}
            {activeBoard && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200">
                Board: {activeBoard}
                <button type="button" onClick={() => { setActiveBoard(''); setDraftBoard(''); setCurrentPage(1); }} className="hover:text-red-600 ml-0.5">
                  <X size={11} />
                </button>
              </span>
            )}
            {activeManagement && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200">
                Management: {activeManagement}
                <button type="button" onClick={() => { setActiveManagement(''); setDraftManagement(''); setCurrentPage(1); }} className="hover:text-red-600 ml-0.5">
                  <X size={11} />
                </button>
              </span>
            )}
            {activeResidential && activeResidential !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200">
                Residential: {activeResidential}
                <button type="button" onClick={() => { setActiveResidential(''); setDraftResidential(''); setCurrentPage(1); }} className="hover:text-red-600 ml-0.5">
                  <X size={11} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Section 1: State / UT Filter (Hierarchical with live counts) ── */}
      <div className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <MapPin size={14} className="text-blue-600" />
            <span>State / UT</span>
          </div>
          {draftState && (
            <button
              type="button"
              onClick={() => {
                setDraftState('');
                setDraftDistrict('');
                setDraftBlock('');
                setDraftCluster('');
              }}
              className="text-[11px] font-medium text-blue-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={draftState}
            onChange={(e) => {
              setDraftState(e.target.value);
              setDraftDistrict('');
              setDraftBlock('');
              setDraftCluster('');
            }}
            className="w-full text-xs text-gray-800 font-medium bg-gray-50/80 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition appearance-none"
          >
            <option value="">All States ({sortedStates.length})</option>
            {sortedStates.map((st) => (
              <option key={st.state_id} value={st.state_name}>
                {st.state_name} {st.total_schools ? `(${st.total_schools.toLocaleString()})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* ── Section 2: District Filter (Filtered by State with live counts) ── */}
      <div className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <MapPin size={14} className="text-blue-600" />
            <span>District</span>
            {loadingDistricts && <Loader2 size={12} className="animate-spin text-blue-600" />}
          </div>
          {draftDistrict && (
            <button
              type="button"
              onClick={() => {
                setDraftDistrict('');
                setDraftBlock('');
                setDraftCluster('');
              }}
              className="text-[11px] font-medium text-blue-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={draftDistrict}
            onChange={(e) => {
              setDraftDistrict(e.target.value);
              setDraftBlock('');
              setDraftCluster('');
            }}
            disabled={!draftState || loadingDistricts}
            className="w-full text-xs text-gray-800 font-medium bg-gray-50/80 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition appearance-none disabled:opacity-50"
          >
            <option value="">
              {!draftState
                ? 'Select State first'
                : loadingDistricts
                ? 'Loading districts...'
                : `All Districts (${sortedDistricts.length})`}
            </option>
            {sortedDistricts.map((d) => (
              <option key={d.district_id || d.district_name} value={d.district_name}>
                {d.district_name} {d.total_schools ? `(${d.total_schools.toLocaleString()})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* ── Section 3: Block / Zone Filter (Filtered by District with live counts) ── */}
      <div className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <MapPin size={14} className="text-blue-600" />
            <span>Block / Zone</span>
            {loadingBlocks && <Loader2 size={12} className="animate-spin text-blue-600" />}
          </div>
          {draftBlock && (
            <button
              type="button"
              onClick={() => {
                setDraftBlock('');
                setDraftCluster('');
              }}
              className="text-[11px] font-medium text-blue-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={draftBlock}
            onChange={(e) => {
              setDraftBlock(e.target.value);
              setDraftCluster('');
            }}
            disabled={!draftDistrict || loadingBlocks}
            className="w-full text-xs text-gray-800 font-medium bg-gray-50/80 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition appearance-none disabled:opacity-50"
          >
            <option value="">
              {!draftDistrict
                ? 'Select District first'
                : loadingBlocks
                ? 'Loading blocks...'
                : `All Blocks (${sortedBlocks.length})`}
            </option>
            {sortedBlocks.map((b) => (
              <option key={b.block_id || b.block_name} value={b.block_name}>
                {b.block_name} {b.total_schools ? `(${b.total_schools.toLocaleString()})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* ── Section 4: Cluster Filter (Filtered by Block) ── */}
      <div className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <Building2 size={14} className="text-blue-600" />
            <span>Cluster</span>
            {loadingClusters && <Loader2 size={12} className="animate-spin text-blue-600" />}
          </div>
          {draftCluster && (
            <button
              type="button"
              onClick={() => setDraftCluster('')}
              className="text-[11px] font-medium text-blue-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={draftCluster}
            onChange={(e) => setDraftCluster(e.target.value)}
            disabled={!draftBlock || loadingClusters}
            className="w-full text-xs text-gray-800 font-medium bg-gray-50/80 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition appearance-none disabled:opacity-50"
          >
            <option value="">
              {!draftBlock
                ? 'Select Block first'
                : loadingClusters
                ? 'Loading clusters...'
                : `All Clusters (${sortedClusters.length})`}
            </option>
            {sortedClusters.map((c) => (
              <option key={c.cluster_id || c.cluster_name} value={c.cluster_name}>
                {c.cluster_name} {c.total_schools ? `(${c.total_schools.toLocaleString()})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* ── Section 5: Curriculum Board (Task 1: CBSE, State Board, ICSE, IB) ── */}
      <div className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <Award size={14} className="text-blue-600" />
            <span>Curriculum Board</span>
          </div>
          {draftBoard && (
            <button
              type="button"
              onClick={() => setDraftBoard('')}
              className="text-[11px] font-medium text-blue-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={draftBoard}
            onChange={(e) => setDraftBoard(e.target.value)}
            className="w-full text-xs text-gray-800 font-medium bg-gray-50/80 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition appearance-none"
          >
            <option value="">All Boards ({hierarchySummary.total_schools.toLocaleString()})</option>
            {sortedBoards.map((b) => {
              const cnt = getBoardCount(b.board_name);
              return (
                <option key={b.board_id} value={b.board_name} disabled={cnt === 0}>
                  {b.board_name} ({cnt.toLocaleString()}){cnt === 0 ? ' - (0 Available)' : ''}
                </option>
              );
            })}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* ── Section 6: Private Management (Task 1: Strictly Private) ── */}
      <div className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <Building2 size={14} className="text-blue-600" />
            <span>Management Type</span>
          </div>
          {draftManagement && (
            <button
              type="button"
              onClick={() => setDraftManagement('')}
              className="text-[11px] font-medium text-blue-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={draftManagement}
            onChange={(e) => setDraftManagement(e.target.value)}
            className="w-full text-xs text-gray-800 font-medium bg-gray-50/80 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition appearance-none"
          >
            <option value="">All Private Managements ({hierarchySummary.total_schools.toLocaleString()})</option>
            {sortedManagements.map((m) => {
              const cnt = getManagementCount(m.management_desc);
              return (
                <option key={m.management_id} value={m.management_desc} disabled={cnt === 0}>
                  {m.management_desc} ({cnt.toLocaleString()}){cnt === 0 ? ' - (0 Available)' : ''}
                </option>
              );
            })}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* ── Section 7: Residential Status (Task 1: Residential vs Day School) ── */}
      <div className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <Building2 size={14} className="text-blue-600" />
            <span>School Type / Hostel</span>
          </div>
          {draftResidential && (
            <button
              type="button"
              onClick={() => setDraftResidential('')}
              className="text-[11px] font-medium text-blue-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={draftResidential}
            onChange={(e) => setDraftResidential(e.target.value)}
            className="w-full text-xs text-gray-800 font-medium bg-gray-50/80 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition appearance-none"
          >
            <option value="">All Types ({hierarchySummary.total_schools.toLocaleString()})</option>
            <option value="residential" disabled={hierarchySummary.residential_count === 0}>
              Residential / Boarding School ({hierarchySummary.residential_count.toLocaleString()}){hierarchySummary.residential_count === 0 ? ' - (0 Available)' : ''}
            </option>
            <option value="day" disabled={hierarchySummary.non_residential_count === 0}>
              Day School (Non-Residential) ({hierarchySummary.non_residential_count.toLocaleString()}){hierarchySummary.non_residential_count === 0 ? ' - (0 Available)' : ''}
            </option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* ── Section 8: Sort Order ── */}
      <div className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <ArrowUpDown size={14} className="text-blue-600" />
            <span>Sort By</span>
          </div>
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
            className="w-full text-xs text-gray-800 font-medium bg-gray-50/80 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition appearance-none"
          >
            <option value="default">Default Relevance</option>
            <option value="name_asc">Alphabetical: A to Z</option>
            <option value="name_desc">Alphabetical: Z to A</option>
            <option value="students_desc">Student Strength: High to Low</option>
            <option value="students_asc">Student Strength: Low to High</option>
            <option value="established_desc">Established: Newest First</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  );

  return (
    <PageTransition>
      <style
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
          @media (min-width: 768px) {
            .directory-sidebar-fixed {
              top: ${navBottomOffset}px !important;
              height: calc(100vh - ${navBottomOffset}px) !important;
              max-height: calc(100vh - ${navBottomOffset}px) !important;
            }
          }
        `,
        }}
      />

      <div className="min-h-screen bg-[#F8F9FA] text-slate-900 pb-20">
        {/* ── 1. HERO SECTION (Task 6: Directory with 4.4+ Lakh Private Schools, No 'Best' claims) ── */}
        {!isHeroMinimized ? (
          <div className="relative z-40 min-h-[300px] sm:min-h-[340px] w-full bg-slate-950 flex flex-col items-center justify-center transition-all duration-300">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {HERO_IMAGES.map((img, idx) => (
                <div
                  key={img}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === currentHeroIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img src={img} alt="School Campus" className="w-full h-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}
                  />
                </div>
              ))}
            </div>

            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-4 z-30 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsHeroMinimized(true)}
                className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white/85 hover:text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95 group"
                title="Minimise Banner"
              >
                <Minimize2 size={11} className="text-cyan-300 group-hover:scale-110 transition-transform" />
                <span>Minimise</span>
              </button>
            </div>

            <div className="relative z-30 w-full max-w-4xl px-4 py-8 flex flex-col items-center text-center">
              {/* Single Unified Directory Navigation Link (Matching Schools Directory) */}
              <Link
                href="/schools"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 hover:text-white border border-cyan-400/40 text-xs font-semibold backdrop-blur-md transition-all shadow-sm mb-3 group cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Explore Top Verified Schools &amp; Campus Directory</span>
                <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform text-cyan-300" />
              </Link>

              {/* Task 6: Directory Title */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-2.5 drop-shadow-md">
                {pageTitle}
              </h1>
              {/* Task 6: Directory Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-slate-200/90 max-w-2xl mb-6 drop-shadow leading-relaxed">
                {pageSubtitle}
              </p>

              {/* Centered Hero Search Bar (Strictly matching SchoolsDirectoryClient layout) */}
              <div className="w-full max-w-3xl flex justify-center relative z-40">
                <div className="w-full flex items-center gap-2 max-w-2xl">
                  <div className="flex-1 flex flex-row items-center bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.18)] px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-200 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#0b57d0]">
                    {/* Location Filter Dropdown Trigger with MapPin */}
                    <div className="relative shrink-0 flex items-center">
                      <button
                        type="button"
                        onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                        className="flex items-center gap-1 py-1 pr-1 transition-all duration-200 group cursor-pointer hover:opacity-80 active:scale-95 text-[#5f6368] hover:text-[#1f1f1f]"
                        title={activeDistrict || activeState || "Select State / UT"}
                      >
                        <MapPin size={17} className={activeState || activeDistrict ? 'text-[#0b57d0]' : 'text-[#5f6368]'} />
                        {activeDistrict || activeState ? (
                          <span className="text-xs font-bold text-[#0b57d0] max-w-[80px] sm:max-w-[100px] truncate">
                            {activeDistrict || activeState}
                          </span>
                        ) : null}
                        <ChevronDown size={11} className={`text-[#5f6368] transition-transform shrink-0 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Vertical Divider */}
                      <div className="h-5 w-[1px] bg-slate-300 mx-2 shrink-0" aria-hidden="true" />

                      {/* Location Dropdown Menu (Floats over all content, styled identical to SchoolsDirectoryClient) */}
                      {isLocationDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsLocationDropdownOpen(false)} />
                          <div className="absolute top-full left-0 mt-2 w-[280px] sm:w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-[#E8E9E9] z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
                            <div className="p-3 border-b border-[#E8E9E9] bg-[#F7F8F8] flex items-center justify-between">
                              <span className="text-[11px] font-bold text-[#003C6E] uppercase tracking-wider font-['Montserrat',sans-serif]">Select State / UT</span>
                              {(activeState || activeDistrict) && (
                                <button
                                  type="button"
                                  onClick={handleResetLocationQuick}
                                  className="text-[11px] text-[#006FCC] hover:underline font-bold cursor-pointer"
                                >
                                  Clear Location
                                </button>
                              )}
                            </div>
                            <div className="p-2.5 grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                              {states.map((st) => (
                                <button
                                  key={st.state_id}
                                  type="button"
                                  onClick={() => handleSelectStateQuick(st.state_name)}
                                  className={`flex items-center justify-between gap-1.5 px-3 py-2 rounded-[12px] text-xs transition-all duration-200 text-left cursor-pointer active:scale-[0.98] ${
                                    activeState === st.state_name
                                      ? 'bg-[#EDF5FA] text-[#006FCC] font-bold border border-[#DDF0FC]'
                                      : 'text-[#1B1F23] hover:bg-[#F7F8F8] font-medium'
                                  }`}
                                >
                                  <span className="truncate whitespace-nowrap">{st.state_name}</span>
                                  {Boolean(st.total_schools) && (
                                    <span className="text-[10px] font-bold text-[#006FCC] bg-[#EDF5FA] px-1.5 py-0.2 rounded-full shrink-0">
                                      {st.total_schools}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                            <div className="p-2.5 border-t border-[#E8E9E9] bg-slate-50 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={handleResetLocationQuick}
                                className="flex-1 flex items-center justify-center px-3 py-1.5 text-xs font-bold text-[#006FCC] hover:bg-[#EDF5FA] active:bg-[#DDF0FC] rounded-[10px] transition-colors cursor-pointer"
                              >
                                All India
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsLocationDropdownOpen(false);
                                  setIsMobileFilterOpen(true);
                                }}
                                className="flex-1 flex items-center justify-center px-3 py-1.5 text-xs font-bold bg-[#006FCC] text-white hover:bg-[#005399] rounded-[10px] transition-colors cursor-pointer"
                              >
                                More Filters
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Search Input: Clean Text Area (Strictly zero inner boundary, ring or outline) */}
                    <div className="flex-1 flex items-center min-w-0 border-0 border-none outline-none ring-0">
                      <input
                        type="text"
                        data-clean-search="true"
                        placeholder="Search private schools by name, UDISE code, locality..."
                        value={draftSearch}
                        onChange={(e) => setDraftSearch(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyFilters();
                          }
                        }}
                        className="search-clean-input no-focus-ring bg-transparent w-full border-0 border-none outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 text-xs sm:text-sm text-[#1f1f1f] placeholder-[#5f6368]/70 font-medium min-w-0"
                        style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                      />
                      {draftSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setDraftSearch('');
                            setActiveSearch('');
                            setCurrentPage(1);
                          }}
                          className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full shrink-0 cursor-pointer transition-colors mr-1"
                          title="Clear search"
                          aria-label="Clear search"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>

                    {/* Clickable Bare Blue Search Icon */}
                    <button
                      type="button"
                      onClick={handleApplyFilters}
                      className="p-1.5 text-[#0b57d0] hover:text-[#0842a0] hover:bg-blue-50/70 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90"
                      title="Search schools"
                      aria-label="Search schools"
                    >
                      <Search size={18} strokeWidth={2.2} />
                    </button>
                  </div>

                  {/* Near Me GPS Companion Pill */}
                  <button
                    type="button"
                    onClick={handleLocateUser}
                    disabled={locatingUser}
                    className={`h-10 sm:h-11 px-3.5 sm:px-4 text-xs sm:text-sm rounded-full inline-flex items-center justify-center gap-1.5 font-bold shrink-0 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm ${
                      userCoords
                        ? 'bg-[#137333] text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                    title="Find private schools within 10 km radius of your location"
                    aria-label="Search schools near your location"
                  >
                    <Navigation size={15} className={locatingUser ? 'animate-spin text-amber-300' : userCoords ? 'text-white' : 'text-[#0b57d0]'} />
                    <span className="hidden sm:inline">{locatingUser ? 'Locating...' : userCoords ? 'Near Me (Active)' : 'Near Me'}</span>
                    <span className="sm:hidden">{locatingUser ? '...' : 'Near Me'}</span>
                  </button>
                </div>
              </div>

              {/* Geolocation Active Badge */}
              {userCoords && (
                <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 rounded-full text-emerald-100 text-xs font-semibold">
                  <span>📍 Showing private schools within 10 km of your location</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUserCoords(null);
                      setLocationName('');
                      setCurrentPage(1);
                    }}
                    className="hover:text-white p-0.5 rounded-full hover:bg-emerald-400/30 transition cursor-pointer"
                    title="Clear location filter"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* Carousel Indicators */}
              <div className="flex items-center gap-1.5 mt-5">
                {HERO_IMAGES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentHeroIndex(dotIdx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      dotIdx === currentHeroIndex ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    title={`Slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <span className="text-xs font-bold text-cyan-300 hidden sm:inline">Private Schools Directory</span>
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search private schools..."
                  value={draftSearch}
                  onChange={(e) => setDraftSearch(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyFilters();
                  }}
                  className="w-full bg-slate-800 text-white pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none border border-slate-700 focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsHeroMinimized(false)}
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
            >
              Expand Banner
            </button>
          </div>
        )}

        {/* ── 2. MAIN LAYOUT: LEFT SIDEBAR FILTER + RIGHT SCHOOL CONTENT ── */}
        <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4 px-3 sm:px-4 md:pl-0 md:pr-4 lg:pr-5 pt-3 md:pt-4 pb-6 flex-1">

          {/* ── Mobile Filter Sheet (Drawer on < 768px) ── */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="relative mr-auto w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-blue-600" />
                    <h2 className="text-sm font-bold text-gray-900">Filters</h2>
                    {activeCount > 0 && (
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {activeCount} active
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {renderFilterBody()}
                </div>

                {/* Sticky Bottom Actions */}
                <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition border border-gray-300 cursor-pointer whitespace-nowrap"
                  >
                    Reset All
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#006FCC] hover:bg-[#005399] text-white flex items-center justify-center gap-1.5 shadow-sm transition active:scale-98 cursor-pointer"
                  >
                    <span>Apply Filters</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Minimized Desktop Sidebar Strip ── */}
          {isSidebarMinimized && (
            <aside className="hidden md:flex flex-col w-12 shrink-0 md:fixed md:left-0 md:z-30 directory-sidebar-fixed rounded-none transition-all duration-300">
              <div className="bg-white rounded-none border-r border-b border-gray-200/90 shadow-xs h-full py-2.5 px-1.5 flex flex-col items-center justify-between">
                <div className="flex flex-col items-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setIsSidebarMinimized(false)}
                    className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition shadow-2xs group relative cursor-pointer"
                    title="Expand Filters"
                  >
                    <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <div className="w-6 h-px bg-gray-200 my-1" />
                  <div className="flex flex-col items-center gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => setIsSidebarMinimized(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition"
                      title="Curriculum Board"
                    >
                      <Award size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSidebarMinimized(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition"
                      title="State and District"
                    >
                      <MapPin size={16} />
                    </button>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-gray-400 rotate-180 [writing-mode:vertical-rl] flex items-center gap-1.5 py-4">
                  <SlidersHorizontal size={11} className="rotate-90 text-blue-600" />
                  <span>FILTERS</span>
                </div>
              </div>
            </aside>
          )}

          {/* ── Full Desktop Filter Sidebar (>= 768px Full Sidebar) ── */}
          {!isSidebarMinimized && (
            <aside className="hidden md:flex flex-col md:fixed md:left-0 md:w-64 lg:w-72 md:z-30 directory-sidebar-fixed rounded-none">
              <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white rounded-none md:border-r md:border-b md:border-gray-200 md:shadow-xs p-3.5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <SlidersHorizontal size={13} />
                    </div>
                    <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Filters
                    </span>
                    {activeCount > 0 ? (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200">
                        {activeCount}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-gray-400">All</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {activeCount > 0 && (
                      <button
                        type="button"
                        onClick={handleClearFilters}
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 transition cursor-pointer"
                        title="Reset all active filters"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsSidebarMinimized(true)}
                      className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition cursor-pointer"
                      title="Minimise Filters"
                    >
                      <ChevronLeft size={15} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {renderFilterBody()}
                </div>

                {/* Sticky Bottom Apply Action (Desktop) */}
                <div className="mt-2.5 pt-2.5 border-t border-gray-200 bg-white flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition border border-gray-300 cursor-pointer whitespace-nowrap"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#006FCC] hover:bg-[#005399] text-white flex items-center justify-center gap-1.5 shadow-sm transition active:scale-98 cursor-pointer"
                  >
                    <span>Apply Filters</span>
                  </button>
                </div>
              </div>
            </aside>
          )}

          {/* ── Right Content Area: Cards Grid & Toolbar ── */}
          <section
            id="schools-directory-content"
            className={`flex-1 min-w-0 flex flex-col gap-4 transition-all duration-300 ${
              isSidebarMinimized ? 'md:ml-16' : 'md:ml-64 lg:ml-72'
            }`}
          >
            {/* Status & Control Bar with Task 3 View Mode Toggle and Task 7 Count */}
            <div className="bg-white p-3 rounded-2xl border border-gray-200/90 shadow-xs flex items-center justify-between gap-3">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Showing {schools.length} out of {totalCount.toLocaleString()} {totalCount === 1 ? 'Result' : 'Results'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle Buttons (Task 3) */}
                <div className="flex items-center bg-[#F7F8F8] p-0.5 rounded-xl border border-[#E8E9E9]">
                  <button
                    type="button"
                    onClick={() => setViewMode('compact')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'compact'
                        ? 'bg-white text-[#006FCC] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Compact List View (Mobile-Friendly)"
                  >
                    <List size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-[#006FCC] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                </div>

                {/* Mobile Filter Sheet Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold"
                >
                  <SlidersHorizontal size={13} />
                  <span>Filters</span>
                  {activeCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {activeCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#E8E9E9] space-y-3 shadow-xs">
                <Loader2 className="w-8 h-8 text-[#006FCC] animate-spin" />
                <p className="text-sm font-bold text-slate-700">Loading private schools...</p>
              </div>
            )}

            {/* Error Message */}
            {!loading && error && (
              <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <p className="font-bold text-base">
                    {currentPage > 10 ? 'Page Limit Exceeded (Strict 10-Page Cap)' : 'Unable to load schools'}
                  </p>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed font-medium">
                  {error}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {currentPage > 10 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setCurrentPage(1)}
                        className="px-4 py-2 bg-[#006FCC] text-white rounded-xl text-xs font-bold hover:bg-[#005399] transition cursor-pointer shadow-xs"
                      >
                        Return to Page 1
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPage(10)}
                        className="px-4 py-2 bg-white border border-rose-300 text-rose-800 rounded-xl text-xs font-bold hover:bg-rose-100/50 transition cursor-pointer"
                      >
                        Go to Page 10
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fetchSchools()}
                      className="px-4 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && schools.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E9E9] p-8 space-y-3 shadow-xs">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No private schools found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your filter criteria or search keywords.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-[#006FCC] text-white text-xs font-bold rounded-xl hover:bg-[#005399] shadow-sm cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* School Cards: Task 3 View Mode Toggle (Compact vs Grid) */}
            {!loading && !error && schools.length > 0 && (
              viewMode === 'compact' ? (
                /* ── COMPACT LIST VIEW (3-4 cards visible on mobile screen) ── */
                <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
                  {schools.map((school, idx) => {
                    const isVerified = school.is_claimed && school.verification_status === 'verified';
                    const isLiked = Boolean(likedSchools[school.udise_code]);
                    const cleanName = cleanSchoolName(school.school_name);
                    const cleanBoard = school.board_name || 'CBSE';
                    const cleanMedium = school.medium_name ? school.medium_name.replace(/^\d+[-_:\s]+/, '') : 'English';
                    const cleanGender = school.gender_type || 'Co-ed';
                    const compactClasses = formatCompactClasses(school.category_desc);
                    const formattedLocation = formatCardLocation(school);

                    const rawWebsite = school.website || '';
                    const hasWebsite = Boolean(
                      rawWebsite && rawWebsite.trim() !== '' && rawWebsite !== '#' && !rawWebsite.includes('example.com')
                    );
                    const cleanWebsiteUrl = hasWebsite
                      ? rawWebsite.startsWith('http')
                        ? rawWebsite
                        : `https://${rawWebsite}`
                      : '';

                    return (
                      <div
                        key={`compact-card-${school.udise_code || idx}`}
                        className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#006FCC]/50 hover:shadow-md transition-all duration-300 p-2.5 sm:p-3 flex flex-col justify-between gap-2 group relative overflow-hidden w-full max-w-full box-border"
                      >
                        {/* Top Block: Small Left Icon + School Details */}
                        <div className="flex items-start gap-2.5 sm:gap-3 w-full min-w-0">
                          {/* Small Left Thumbnail Icon */}
                          <div className="relative w-14 h-14 min-w-[56px] max-w-[56px] sm:w-16 sm:h-16 sm:min-w-[64px] sm:max-w-[64px] rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden shrink-0 shadow-2xs">
                            <img
                              src={getSafeSchoolImage(school.image || school.image_url || school.logo_url)}
                              alt={cleanName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = PLACEHOLDER_EMPTY_IMAGE;
                              }}
                            />
                            {school.rating && Number(school.rating) > 0 && (
                              <div className="absolute bottom-0.5 inset-x-0.5 flex items-center justify-center">
                                <div className="bg-black/80 backdrop-blur-xs text-white px-1 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5 leading-none shadow-xs border border-white/10">
                                  <Star size={7} className="fill-amber-400 text-amber-400 shrink-0" />
                                  <span>{school.rating}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Information Block */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
                            {/* Title & Board Badges */}
                            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                              <Link
                                href={school.profile_url}
                                className="font-['Montserrat',sans-serif] font-extrabold text-[12.5px] sm:text-[14px] text-[#003C6E] leading-snug tracking-tight hover:text-[#006FCC] transition-colors break-words line-clamp-1"
                                title={cleanName}
                              >
                                {renderSchoolTitleWithVerified(cleanName, isVerified)}
                              </Link>
                              <span className="inline-flex text-[9px] sm:text-[10px] font-bold text-[#006FCC] bg-[#EDF5FA] px-1.5 py-0.5 rounded-md border border-[#DDF0FC] shrink-0">
                                {cleanBoard}
                              </span>
                            </div>

                            {/* Address with MapPin */}
                            <div className="flex items-start gap-1 text-[11px] sm:text-[11.5px] text-slate-500 leading-tight min-w-0 flex-wrap">
                              <MapPin size={12} className="text-red-500 shrink-0 mt-0.5" />
                              <span className="truncate">{formattedLocation}</span>
                              {school.distance_km !== null && (
                                <span className="ml-1 inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                                  📍 {school.distance_km} km away
                                </span>
                              )}
                            </div>

                            {/* Tags: Classes, Medium, Format */}
                            <div className="flex items-center gap-1.5 flex-wrap text-[10px] sm:text-[10.5px]">
                              <span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                                {compactClasses}
                              </span>
                              <span className="text-slate-600 bg-slate-50 border border-slate-200/70 px-1.5 py-0.5 rounded">
                                {cleanMedium}
                              </span>
                              <span className="text-teal-700 bg-teal-50 border border-teal-200/60 px-1.5 py-0.5 rounded">
                                {cleanGender}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Action Row */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 w-full min-w-0">
                          <div className="flex items-center gap-1 shrink-0">
                            {hasWebsite ? (
                              <a
                                href={cleanWebsiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 flex items-center justify-center transition"
                                title="Visit Official Website"
                              >
                                <Globe size={11} />
                              </a>
                            ) : null}
                            <button
                              type="button"
                              onClick={(e) => handleShare(school, e)}
                              className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center transition cursor-pointer"
                              title="Share School"
                            >
                              <Share2 size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleToggleLike(school.udise_code, e)}
                              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                                isLiked
                                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                              }`}
                              title="Like School"
                            >
                              <Heart size={11} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                            </button>
                          </div>

                          <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-end min-w-0">
                            <button
                              type="button"
                              onClick={(e) => openGoogleMaps(school, e)}
                              className="h-7 px-2 rounded-lg border border-[#E8E9E9] bg-[#F7F8F8] hover:bg-[#EDF5FA] text-[#003C6E] text-[10.5px] font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1 transition cursor-pointer shrink-0"
                              title="Open in Google Maps"
                            >
                              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                <circle cx="12" cy="9" r="2.8" fill="#FFFFFF" />
                              </svg>
                              <span>Map</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setClaimModalData({
                                  isOpen: true,
                                  schoolName: cleanName,
                                  udiseCode: school.udise_code,
                                });
                              }}
                              className="h-7 px-2 rounded-lg bg-[#EDF5FA] hover:bg-[#DDF0FC] border border-[#DDF0FC] text-[#006FCC] text-[10.5px] font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1 transition cursor-pointer shrink-0"
                            >
                              <ShieldCheck size={11} className="text-[#006FCC] shrink-0" />
                              <span>Claim</span>
                            </button>

                            <Link
                              href={school.profile_url}
                              className="h-7 px-2.5 rounded-lg bg-[#006FCC] hover:bg-[#005399] text-white text-[10.5px] font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1 shadow-xs transition"
                            >
                              <span>View</span>
                              <ArrowRight size={11} className="shrink-0" />
                            </Link>
                          </div>
                        </div>

                        {copiedUdise === school.udise_code && (
                          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs rounded-2xl flex items-center justify-center text-white text-xs font-bold z-20">
                            Link Copied to Clipboard!
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* ── GRID VIEW ── */
                <div
                  className={`grid grid-cols-1 ${
                    isSidebarMinimized ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
                  } gap-3.5 sm:gap-5 touch-pan-y overscroll-contain w-full`}
                >
                  {schools.map((school, idx) => {
                    const isVerified = school.is_claimed && school.verification_status === 'verified';
                    const isLiked = Boolean(likedSchools[school.udise_code]);
                    const cleanName = cleanSchoolName(school.school_name);
                    const cleanBoard = school.board_name || 'CBSE';
                    const cleanMedium = school.medium_name ? school.medium_name.replace(/^\d+[-_:\s]+/, '') : 'English';
                    const cleanGender = school.gender_type || 'Co-educational';
                    const cleanResidential = school.residential_desc || 'Day School';
                    const compactClasses = formatCompactClasses(school.category_desc);
                    const formattedLocation = formatCardLocation(school);

                    const rawWebsite = school.website || '';
                    const hasWebsite = Boolean(
                      rawWebsite && rawWebsite.trim() !== '' && rawWebsite !== '#' && !rawWebsite.includes('example.com')
                    );
                    const cleanWebsiteUrl = hasWebsite
                      ? rawWebsite.startsWith('http')
                        ? rawWebsite
                        : `https://${rawWebsite}`
                      : '';

                    return (
                      <div
                        key={`grid-card-${school.udise_code || idx}`}
                        className="bg-white rounded-2xl overflow-hidden border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 transition-all duration-300 group flex flex-col w-full max-w-full box-border"
                      >
                        <div className="relative h-40 sm:h-44 w-full bg-slate-50 overflow-hidden">
                          <img
                            src={getSafeSchoolImage(school.image || school.image_url || school.logo_url)}
                            alt={cleanName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = PLACEHOLDER_EMPTY_IMAGE;
                            }}
                          />
                          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                            {school.rating && Number(school.rating) > 0 ? (
                              <div className="bg-black/75 backdrop-blur-md text-white px-2 py-0.5 rounded-[8px] text-[11px] font-bold shadow-xs flex items-center gap-1 pointer-events-auto">
                                <Star size={11} className="fill-amber-400 text-amber-400" />
                                <span>{school.rating}</span>
                              </div>
                            ) : (
                              <div />
                            )}
                            <div className="flex items-center gap-1 bg-black/45 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-xs pointer-events-auto">
                              {hasWebsite ? (
                                <a
                                  href={cleanWebsiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/25 transition cursor-pointer"
                                >
                                  <Globe size={13} />
                                </a>
                              ) : null}
                              <button
                                type="button"
                                onClick={(e) => handleShare(school, e)}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/25 transition cursor-pointer"
                              >
                                <Share2 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleToggleLike(school.udise_code, e)}
                                className={`h-7 px-2 rounded-full flex items-center gap-1 transition cursor-pointer text-xs font-semibold ${
                                  isLiked
                                    ? 'bg-rose-500 text-white shadow-xs'
                                    : 'bg-black/35 text-white hover:bg-black/55 hover:text-white'
                                }`}
                              >
                                <Heart size={13} className={isLiked ? 'fill-white text-white' : 'text-white/90'} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 sm:p-4 flex-1 flex flex-col min-w-0 overflow-hidden">
                          <div className="mb-1.5 min-w-0">
                            <h2
                              className="font-['Montserrat',sans-serif] font-extrabold text-[13.5px] sm:text-[15px] leading-snug tracking-tight line-clamp-2 break-words cursor-pointer text-[#003C6E] hover:text-[#006FCC] transition-colors"
                              style={{ color: '#003C6E', lineHeight: '1.3' }}
                            >
                              <Link
                                href={school.profile_url}
                                className="hover:text-[#006FCC] hover:underline transition-colors inline break-words"
                              >
                                {renderSchoolTitleWithVerified(cleanName, isVerified)}
                              </Link>
                            </h2>
                          </div>

                          <div className="text-[12.5px] text-gray-600 flex items-start justify-between gap-1.5 mb-2.5 leading-snug min-w-0">
                            <div className="flex items-start gap-1.5 min-w-0 flex-1">
                              <MapPin size={14} className="text-red-500 shrink-0 mt-0.5" />
                              <span className="break-words line-clamp-2 min-w-0">{formattedLocation}</span>
                            </div>
                            {school.distance_km !== null && (
                              <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                                📍 {school.distance_km} km
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-[11.5px] text-gray-700 mb-3.5 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70 min-w-0 overflow-hidden">
                            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden" title={`Board: ${cleanBoard}`}>
                              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                {renderBoardLogo(cleanBoard)}
                              </div>
                              <span className="font-semibold text-slate-800 truncate">{cleanBoard}</span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden" title={`Classes: ${compactClasses}`}>
                              <GraduationCap size={13} className="text-purple-600 shrink-0" />
                              <span className="font-semibold text-slate-800 truncate">{compactClasses}</span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden" title={`Medium: ${cleanMedium}`}>
                              <Languages size={13} className="text-indigo-600 shrink-0" />
                              <span className="font-medium text-slate-700 truncate">{cleanMedium}</span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden" title={`Type: ${cleanGender} ${cleanResidential}`}>
                              <Building2 size={13} className="text-emerald-600 shrink-0" />
                              <span className="font-medium text-slate-700 truncate">{cleanGender}</span>
                            </div>
                          </div>

                          <div className="mt-auto pt-2.5 sm:pt-3 border-t border-[#E8E9E9] flex items-center gap-1.5 sm:gap-2">
                            <button
                              type="button"
                              onClick={(e) => openGoogleMaps(school, e)}
                              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-[12px] sm:rounded-[14px] border border-[#E8E9E9] bg-[#F7F8F8] hover:bg-[#EDF5FA] hover:border-[#006FCC]/30 text-[#003C6E] hover:text-[#006FCC] text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer group whitespace-nowrap min-w-0 flex-1"
                              title="Open in Google Maps"
                            >
                              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                <circle cx="12" cy="9" r="2.8" fill="#FFFFFF" />
                              </svg>
                              <span className="truncate">Map</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setClaimModalData({
                                  isOpen: true,
                                  schoolName: cleanName,
                                  udiseCode: school.udise_code,
                                });
                              }}
                              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-[12px] sm:rounded-[14px] bg-[#EDF5FA] hover:bg-[#DDF0FC] border border-[#DDF0FC] text-[#006FCC] text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1 transition-all duration-200 active:scale-[0.98] whitespace-nowrap min-w-0 cursor-pointer shrink-0"
                            >
                              <ShieldCheck size={13} className="text-[#006FCC] shrink-0" />
                              <span className="truncate">Claim</span>
                            </button>

                            <Link
                              href={school.profile_url}
                              className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-[12px] sm:rounded-[14px] bg-[#006FCC] hover:bg-[#005399] text-white text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1 shadow-xs hover:shadow transition-all duration-200 active:scale-[0.98] whitespace-nowrap min-w-0 flex-1"
                            >
                              <span className="truncate">View</span>
                              <ArrowRight size={13} className="shrink-0" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Dynamic Pagination Controls (Always persistent, never vanishes on page transitions) */}
            {totalPages > 1 && (
              <div className={`pt-6 border-t border-[#E8E9E9] flex flex-wrap items-center justify-between gap-4 transition-opacity ${loading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                <div className="text-xs text-slate-500 font-semibold">
                  Page {currentPage > 10 ? `${currentPage} (Exceeded)` : currentPage} of {totalPages.toLocaleString()}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      const el = document.getElementById('schools-directory-content');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    disabled={currentPage <= 1}
                    className="px-3 py-1.5 rounded-xl border border-[#E8E9E9] bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    <span>Prev</span>
                  </button>

                  {/* Smart Numbered Page Buttons with Ellipsis */}
                  {paginationRange.map((pageItem, idx) => {
                    if (typeof pageItem === 'string') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 text-xs font-bold select-none">
                          {pageItem}
                        </span>
                      );
                    }
                    return (
                      <button
                        key={pageItem}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageItem);
                          const el = document.getElementById('schools-directory-content');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                          currentPage === pageItem
                            ? 'bg-[#006FCC] text-white shadow-xs'
                            : 'bg-white border border-[#E8E9E9] text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageItem}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      const el = document.getElementById('schools-directory-content');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1.5 rounded-xl border border-[#E8E9E9] bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Claim School Modal */}
        <ClaimSchoolModal
          isOpen={claimModalData.isOpen}
          onClose={() => setClaimModalData({ isOpen: false, schoolName: '', udiseCode: '' })}
          schoolName={claimModalData.schoolName}
          udiseCode={claimModalData.udiseCode}
        />
      </div>
    </PageTransition>
  );
}
