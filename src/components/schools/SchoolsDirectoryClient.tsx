'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
  LayoutGrid, List, Columns3, Lock, ShieldAlert, ShieldCheck, LogIn, Key, AlertCircle,
  RefreshCw, Loader2, Globe, ArrowRight, PlusCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SchoolsDirectoryResult } from '@/integrations/supabase/schoolsDirectoryDb';
import { SchoolRecord } from '@/data/schoolFinderData';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { renderFacilityIcon, renderCategoryHeaderIcon, renderBoardLogo, renderClassIcon, renderSchoolTypeIcon, renderSpecialCategoryIcon } from './FacilityIcons';
import AddSchoolModal from './AddSchoolModal';
import ClaimSchoolModal from './ClaimSchoolModal';

const SchoolFinderMap = dynamic(() => import('@/components/school-finder/SchoolFinderMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-slate-50 rounded-3xl border border-slate-200">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-[#005689]" />
        <span className="text-xs font-bold text-slate-600">Loading Interactive Map...</span>
      </div>
    </div>
  ),
});

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
  { name: 'Rewari', icon: 'https://img.icons8.com/color/48/marker.png' },
];

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Delhi NCR': { lat: 28.6139, lng: 77.2090 },
  'Agra': { lat: 27.1767, lng: 78.0081 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 },
  'Raipur': { lat: 21.2514, lng: 81.6296 },
  'Bhubaneswar': { lat: 20.2961, lng: 85.8245 },
  'Gurugram': { lat: 28.4595, lng: 77.0266 },
  'Faridabad': { lat: 28.4089, lng: 77.3178 },
  'Rewari': { lat: 28.1833, lng: 76.6167 },
};

import { FACILITY_CATEGORIES } from './FacilityData';

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
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
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
  
  // View mode supports 2 Cols, 3 Cols, Compact, and Map
  const [viewMode, setViewMode] = useState<'grid' | 'grid3' | 'compact' | 'map'>(() => {
    if (typeof window !== 'undefined') {
      const paramView = new URLSearchParams(window.location.search).get('view');
      if (paramView === 'map' || paramView === 'grid' || paramView === 'grid3' || paramView === 'compact') {
        return paramView as 'grid' | 'grid3' | 'compact' | 'map';
      }
    }
    return 'grid3';
  });

  // Map state
  const [mapSelectedSchool, setMapSelectedSchool] = useState<SchoolRecord | null>(null);
  const [googleMapModalSchool, setGoogleMapModalSchool] = useState<SchoolRecord | null>(null);
  const modalMapContainerRef = useRef<HTMLDivElement | null>(null);
  const modalMapInstanceRef = useRef<any>(null);

  // Initialize interactive Leaflet map inside preview modal (never blocked by X-Frame-Options)
  useEffect(() => {
    if (!googleMapModalSchool || !modalMapContainerRef.current) return;

    const lat = Number(googleMapModalSchool.lat) || 28.4595;
    const lng = Number(googleMapModalSchool.lng) || 77.0266;

    let isMounted = true;

    import('leaflet').then((leafletModule) => {
      if (!isMounted || !modalMapContainerRef.current) return;
      const L = (leafletModule as any).default || leafletModule;

      if (modalMapInstanceRef.current) {
        modalMapInstanceRef.current.remove();
        modalMapInstanceRef.current = null;
      }

      const map = L.map(modalMapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom pulsing pin
      const customPin = L.divIcon({
        className: 'custom-school-map-pin',
        html: `
          <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(0, 111, 204, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: #005689; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([lat, lng], { icon: customPin }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 180px; padding: 4px;">
          <b style="color: #003c6e; font-size: 13px;">${googleMapModalSchool.school_name || googleMapModalSchool.name}</b>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${googleMapModalSchool.village_ward || ''}, ${googleMapModalSchool.district_name || ''}</div>
          <div style="font-size: 11px; color: #059669; font-weight: bold; margin-top: 4px;">★ Verified Campus</div>
        </div>
      `).openPopup();

      modalMapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 150);
    }).catch((err) => console.warn('Modal map leaflet load error:', err));

    return () => {
      isMounted = false;
      if (modalMapInstanceRef.current) {
        modalMapInstanceRef.current.remove();
        modalMapInstanceRef.current = null;
      }
    };
  }, [googleMapModalSchool]);

  const [mapRadiusKm, setMapRadiusKm] = useState<number>(3);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number }>({ lat: 28.1846, lng: 77.4105 }); // Default to detected live area (Palwal/Delhi NCR)
  const [mapFocus, setMapFocus] = useState<{ lat: number; lng: number; zoom?: number; timestamp: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Auto-detect user's high-precision live GPS location on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (latitude && longitude) {
            setSearchCenter({ lat: latitude, lng: longitude });
            setMapFocus({ lat: latitude, lng: longitude, zoom: 14, timestamp: Date.now() });
          }
        },
        () => {
          // Fallback to first school coords only if user denies location permission
          const firstWithCoords = initialData.schools.find(s => s.lat && s.lng && !isNaN(s.lat) && !isNaN(s.lng) && s.lat > 5);
          if (firstWithCoords && firstWithCoords.lat && firstWithCoords.lng) {
            setSearchCenter({ lat: firstWithCoords.lat, lng: firstWithCoords.lng });
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Memoized GPS callbacks to ensure child Map doesn't drop persistent layers
  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setSearchCenter({ lat, lng });
  }, []);

  const handleLocateMe = useCallback(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setSearchCenter({ lat: latitude, lng: longitude });
          setMapFocus({ lat: latitude, lng: longitude, zoom: 15, timestamp: Date.now() });
          setIsLocating(false);
        },
        (err) => {
          console.warn('GPS location error:', err);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  // ── Access Control: Logged-in users immediately get verified access ───────
  const { user, loading: authLoading, isVerified, signInWithGoogle, verifyUser } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  // Admin detection (super_admin / admin login session - only when ?admin=true or explicitly activated)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return new URLSearchParams(window.location.search).get('admin') === 'true';
    } catch {
      return false;
    }
  });

  // Admin switch: is school listing enabled?
  const [isListingEnabledByAdmin, setIsListingEnabledByAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const stored = localStorage.getItem('cseel_schools_listing_enabled');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  // Simulation mode for admin testing: 'normal' | 'simulate_public' | 'simulate_unverified'
  const [adminSimulateMode, setAdminSimulateMode] = useState<'normal' | 'simulate_public' | 'simulate_unverified'>('normal');

  const effectiveUser = adminSimulateMode === 'simulate_public' ? null : user;
  
  // Logged-in users (Google / Email) are immediately verified unless admin simulates otherwise
  const effectiveIsVerified = adminSimulateMode === 'simulate_unverified'
    ? false
    : Boolean(effectiveUser);
  const effectiveListingEnabled = isListingEnabledByAdmin;

  // Access rules:
  const isGuest = !authLoading && !effectiveUser;
  const isListingDisabled = !authLoading && Boolean(effectiveUser) && !effectiveListingEnabled;
  const isUserUnverified = !authLoading && Boolean(effectiveUser) && effectiveListingEnabled && !effectiveIsVerified;
  const canViewSchools = !authLoading && Boolean(effectiveUser) && effectiveListingEnabled && effectiveIsVerified;

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle('/schools');
      if (error) {
        alert(error.message || 'Google sign-in failed');
        setGoogleLoading(false);
      }
    } catch (err: any) {
      alert(err?.message || 'Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  // Persist viewMode in localStorage across page refreshes
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('cseel_school_view_mode') as 'grid' | 'grid3' | 'compact' | 'map' | null;
      if (savedMode && (savedMode === 'grid' || savedMode === 'grid3' || savedMode === 'compact' || savedMode === 'map')) {
        setViewMode(savedMode);
      }
    } catch {
      // Ignore storage errors in SSR or restricted environments
    }
  }, []);

  const handleViewModeChange = (mode: 'grid' | 'grid3' | 'compact' | 'map') => {
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
  
  // Modal States for Add School & Claim School
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);
  const [claimModalData, setClaimModalData] = useState<{
    isOpen: boolean;
    schoolName: string;
    udiseCode: string;
  }>({
    isOpen: false,
    schoolName: '',
    udiseCode: '',
  });
  
  // Add School / Profile Button Handler
  const handleAddSchoolClick = () => {
    setIsAddSchoolModalOpen(true);
  };

  // Hero Carousel state
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

// Haversine Distance Calculation (Km)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 99999;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

  const displayedSchools = useMemo(() => {
    // 1. Calculate distance from searchCenter for every school
    let list = initialData.schools.map((s) => {
      const schoolLat = s.lat || s.latitude;
      const schoolLng = s.lng || s.longitude;
      const dist =
        schoolLat && schoolLng && searchCenter.lat && searchCenter.lng
          ? calculateDistanceKm(searchCenter.lat, searchCenter.lng, schoolLat, schoolLng)
          : undefined;
      return {
        ...s,
        lat: schoolLat,
        lng: schoolLng,
        distance: dist,
      };
    });

    // 2. Text Search Filtering
    if (searchTerm.trim() && searchMode === 'text') {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          (s.school_name || s.name || '').toLowerCase().includes(q) ||
          (s.village_ward || '').toLowerCase().includes(q) ||
          (s.district_name || '').toLowerCase().includes(q) ||
          (s.udise_code || '').includes(q)
      );
    } else if (searchMode === 'near_me' || viewMode === 'map') {
      // 3. Near Me or Map View: Filter by Radius & sort by closest distance
      const inRadius = list.filter((s) => s.distance !== undefined && s.distance <= mapRadiusKm);
      if (inRadius.length > 0) {
        list = inRadius.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      } else {
        // If none strictly within the radius, show all sorted by closest distance
        list = list.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
      }
    }

    // 4. Facilities Filtering
    if (selectedFacilities.length > 0) {
      list = list.filter((s) => {
        const facs = (s.facilities || []).map((f: string) => f.toLowerCase());
        return selectedFacilities.every((selected) =>
          facs.some((f: string) => f.includes(selected.toLowerCase()) || selected.toLowerCase().includes(f))
        );
      });
    }

    return list;
  }, [initialData.schools, searchTerm, searchMode, searchCenter.lat, searchCenter.lng, mapRadiusKm, viewMode, selectedFacilities]);

  const toggleFacility = (facilityName: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityName)
        ? prev.filter((f) => f !== facilityName)
        : [...prev, facilityName]
    );
  };

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

  const openGoogleMaps = (school: SchoolRecord, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setGoogleMapModalSchool(school);
  };

  const handleNearMeSearch = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setSearchCenter({ lat: latitude, lng: longitude });
          setMapFocus({ lat: latitude, lng: longitude, zoom: 14, timestamp: Date.now() });
          setViewMode('map');
          setSearchMode('near_me');
        },
        (err) => {
          console.warn('Geolocation error:', err);
          alert('Please allow Location Access in your browser settings to search schools with high GPS accuracy.');
        },
        {
          enableHighAccuracy: true, // Forces Hardware GPS & Wi-Fi Triangulation (10m accuracy, NO coarse ISP fallback)
          timeout: 15000,
          maximumAge: 0,            // Never use stale cached position
        }
      );
    } else {
      alert('High precision Geolocation is not supported by your browser.');
    }
  };

  const topSchools = useMemo(() => {
    return [...initialData.schools]
      .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
      .slice(0, 8);
  }, [initialData.schools]);

  // Helper to attach verified badge to the last word of school name (prevents orphan badge on new line)
  const renderSchoolTitleWithVerified = (name: string, isVerified: boolean = true) => {
    const raw = (name || '').trim();
    if (!raw) return null;
    const parts = raw.split(/\s+/);
    const lastWord = parts.pop() || '';
    const leadingWords = parts.join(' ');

    return (
      <span className="inline">
        {leadingWords ? `${leadingWords} ` : ''}
        <span className="inline-flex items-center gap-1 whitespace-nowrap align-middle">
          <span>{lastWord}</span>
          {isVerified && (
            <span className="inline-flex items-center justify-center shrink-0" title="CSEEL Verified School">
              <CheckCircle2 size={15} className="text-white fill-blue-600 drop-shadow-xs" />
            </span>
          )}
        </span>
      </span>
    );
  };

  const renderSchoolCard = (school: SchoolRecord, idx: number) => {
    const profileUrl = getSchoolUrl(school);
    const isCompared = compareList.some((c) => c.id === school.id);
    const isLiked = likedSchoolIds.includes(school.id);
    const rawWebsite = (school as any).website || school.website || '';
    const hasWebsite = Boolean(rawWebsite && rawWebsite.trim() !== '' && rawWebsite !== '#' && !rawWebsite.includes('example.com'));
    const cleanWebsiteUrl = hasWebsite ? (rawWebsite.startsWith('http') ? rawWebsite : `https://${rawWebsite}`) : '';
    
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
          
          {/* Top Action Buttons (Website, Compare, Share, Like) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {hasWebsite ? (
              <a
                href={cleanWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-md text-blue-600 hover:bg-white hover:text-blue-700 shadow-sm transition"
                title="Visit Official School Website"
              >
                <Globe size={14} />
              </a>
            ) : (
              <button
                disabled
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/60 backdrop-blur-md text-gray-400 opacity-40 cursor-not-allowed select-none shadow-xs pointer-events-none"
                title="Official Website Not Available"
              >
                <Globe size={14} />
              </button>
            )}
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
          <div className="mb-1.5">
            <h3 className="font-bold text-base sm:text-[17px] text-gray-900 leading-snug">
              <Link href={profileUrl} className="hover:text-blue-600 transition-colors inline">
                {renderSchoolTitleWithVerified(school.school_name || school.name || 'School')}
              </Link>
            </h3>
          </div>
          
          {/* Rating - Only display if real rating exists */}
          {school.rating && Number(school.rating) > 0 ? (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-[13px] font-bold text-gray-800">{school.rating}</span>
              <div className="flex text-amber-400">
                <Star size={12} className="fill-amber-400" />
              </div>
              {school.reviews && Number(school.reviews) > 0 ? (
                <span className="text-xs text-gray-500 ml-1">({school.reviews})</span>
              ) : null}
            </div>
          ) : null}
          
          {/* Address & Meta */}
          <div className="text-[13px] text-gray-600 flex items-start justify-between gap-1.5 mb-3 leading-snug">
            <div className="flex items-start gap-1.5 min-w-0">
              <MapPin size={15} className="text-red-500 shrink-0 mt-0.5" />
              <span className="break-words">{school.village_ward || school.locality}, {school.district_name}, {school.state_name}</span>
            </div>
            {school.distance !== undefined && school.distance > 0 && (
              <span className="shrink-0 bg-black/60 backdrop-blur-md border border-white/10 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold shadow-sm whitespace-nowrap">
                {school.distance} km
              </span>
            )}
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
          <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-[11px] sm:text-xs text-gray-700 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-1.5 min-w-0">
              <Award size={13} className="text-blue-600 shrink-0" />
              <span className="font-medium truncate">{school.board || school.board_secondary_10th || 'CBSE'}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Users size={13} className="text-purple-600 shrink-0" />
              <span className="font-medium truncate">{school.classes || 'Class 1st - 10th'}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Building2 size={13} className="text-indigo-600 shrink-0" />
              <span className="font-medium truncate">{school.medium || school.medium_of_instruction_1 || 'English Medium'}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <GraduationCap size={13} className="text-emerald-600 shrink-0" />
              <span className="font-medium truncate">{school.school_type || school.gender || 'Co-ed Day'}</span>
            </div>
          </div>

          {/* Card Actions - Responsive Dual Button Grid (Fits perfectly in 2 Cols & 3 Cols) */}
          <div className="mt-auto pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => openGoogleMaps(school, e)}
              className="h-9 px-2.5 rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-600 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer group shadow-2xs whitespace-nowrap min-w-0"
              title="Open location on Google Maps (Popup Window)"
            >
              <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.8" fill="#FFFFFF"/>
              </svg>
              <span className="truncate">Google Maps</span>
            </button>
            
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setClaimModalData({
                  isOpen: true,
                  schoolName: school.school_name || school.name || 'School Profile',
                  udiseCode: school.udise_code || school.id || '',
                });
              }}
              className="h-9 px-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold inline-flex items-center justify-center gap-1 shadow-2xs hover:shadow transition-all whitespace-nowrap min-w-0 cursor-pointer"
              title="Claim this school profile to edit details & admissions"
            >
              <ShieldCheck size={13} className="text-amber-600 shrink-0" />
              <span className="truncate">Claim</span>
            </button>
            
            <Link
              href={profileUrl}
              className="h-9 px-2.5 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold inline-flex items-center justify-center gap-1 shadow-xs hover:shadow-md transition-all whitespace-nowrap min-w-0"
            >
              <span className="truncate">View Details</span>
              <ArrowRight size={13} className="shrink-0" />
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
    const rawWebsite = (school as any).website || school.website || '';
    const hasWebsite = Boolean(rawWebsite && rawWebsite.trim() !== '' && rawWebsite !== '#' && !rawWebsite.includes('example.com'));
    const cleanWebsiteUrl = hasWebsite ? (rawWebsite.startsWith('http') ? rawWebsite : `https://${rawWebsite}`) : '';
    const boardName = school.board || school.board_secondary_10th || 'CBSE';
    const locationStr = [school.village_ward || school.locality, school.district_name].filter(Boolean).join(', ') || school.state_name;

    return (
      <div 
        key={school.id || idx} 
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 hover:border-blue-400 hover:shadow-md transition-all p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 group relative overflow-hidden"
      >
        {/* Top/Main block: Thumbnail + Info */}
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Thumbnail with Rating and Distance at Bottom */}
          <div className="relative w-20 h-20 min-w-[80px] max-w-[80px] sm:w-28 sm:h-24 sm:min-w-[112px] sm:max-w-[112px] rounded-xl bg-gray-100 overflow-hidden shrink-0 shadow-xs">
            <img
              src={school.image || HERO_IMAGES[idx % HERO_IMAGES.length]}
              alt={school.school_name || school.name || 'School'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.currentTarget.src = HERO_IMAGES[0]; }}
            />
            {/* Bottom Overlay: Compact Dark Blurred Rectangular Tags */}
            {(school.rating && Number(school.rating) > 0) || (school.distance !== undefined && school.distance > 0) ? (
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 pointer-events-none">
                {school.rating && Number(school.rating) > 0 ? (
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 shadow-sm leading-none">
                    <Star size={9} className="fill-amber-400 text-amber-400" />
                    <span>{school.rating}</span>
                  </div>
                ) : <span />}
                {school.distance !== undefined && school.distance > 0 && (
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 text-emerald-300 px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10px] font-bold shadow-sm whitespace-nowrap leading-none">
                    <span>{school.distance < 1 ? `${Math.round(school.distance * 1000)} m` : `${Number(school.distance.toFixed(1))} km`}</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Info Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {/* Title & Iconic Verified Badge (right behind school name) + Board */}
            <div className="flex items-start sm:items-center gap-1.5 mb-1 flex-wrap">
              <Link 
                href={profileUrl} 
                className="font-bold text-sm sm:text-base text-gray-900 leading-snug hover:text-blue-600 transition-colors inline"
                title={school.school_name || school.name}
              >
                {renderSchoolTitleWithVerified(school.school_name || school.name || 'School')}
              </Link>
              <span className="inline-flex text-[9.5px] sm:text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-100 shrink-0 align-middle">
                {boardName}
              </span>
            </div>

            {/* Location: Full Address (no truncation) */}
            <div className="flex items-start gap-1 text-[11px] sm:text-xs text-gray-500 mb-1.5 leading-snug">
              <MapPin size={12} className="text-red-500 shrink-0 mt-0.5" />
              <span className="break-words">{locationStr}</span>
            </div>

            {/* Quick Info Tags */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-[10px] sm:text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded font-semibold">
                {school.classes || 'Class 1st - 10th'}
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Admissions Open</span>
              </span>
              {school.facilities?.includes('Experiential Science Lab') && (
                <span className="text-[10px] sm:text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded font-medium hidden lg:inline-flex items-center gap-1">
                  <FlaskConical size={10} /> Experiential Lab
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Responsive Toolbar */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 shrink-0 pt-2 sm:pt-0 border-t border-gray-100 sm:border-0 sm:pl-2">
          {/* Secondary Actions group */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Website Icon Button */}
            {hasWebsite ? (
              <a
                href={cleanWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-gray-200 transition cursor-pointer shrink-0"
                title="Visit Official School Website"
              >
                <Globe size={14} />
              </a>
            ) : (
              <button
                disabled
                className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 bg-gray-50 border border-gray-200 opacity-40 cursor-not-allowed select-none pointer-events-none shrink-0"
                title="Website Not Available"
              >
                <Globe size={14} />
              </button>
            )}

            {/* Google Maps Pin Icon Only (h-8 w-8) */}
            <button
              type="button"
              onClick={(e) => openGoogleMaps(school, e)}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border border-gray-200 transition cursor-pointer shrink-0"
              title="Open location on Google Maps"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.8" fill="#FFFFFF"/>
              </svg>
            </button>

            {/* Compare Button */}
            <button
              type="button"
              onClick={(e) => handleToggleCompare(school, e)}
              className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs transition cursor-pointer border ${
                isCompared ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 border-gray-200'
              }`}
              title="Compare School"
            >
              <Scale size={14} />
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={(e) => handleShareSchool(school, e)}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200 transition relative cursor-pointer"
              title="Share Profile"
            >
              <Share2 size={14} />
              {copiedToastId === school.id && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
                  Copied!
                </span>
              )}
            </button>

            {/* Like / Save Button */}
            <button
              type="button"
              onClick={(e) => handleToggleLike(school.id, e)}
              className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs transition cursor-pointer border ${
                isLiked ? 'text-rose-500 bg-rose-50 border-rose-200' : 'text-gray-500 hover:text-rose-500 hover:bg-rose-50 border-gray-200'
              }`}
              title="Save to Favorites"
            >
              <Heart size={14} className={isLiked ? "fill-rose-500" : ""} />
            </button>
          </div>
          
          {/* Claim School CTA */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setClaimModalData({
                isOpen: true,
                schoolName: school.school_name || school.name || 'School Profile',
                udiseCode: school.udise_code || school.id || '',
              });
            }}
            className="h-8 px-2.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition shrink-0 inline-flex items-center justify-center gap-1 cursor-pointer"
            title="Claim this school profile"
          >
            <ShieldCheck size={13} className="text-amber-600" />
            <span className="hidden sm:inline">Claim</span>
          </button>
          
          {/* View Details CTA - Google Button Style */}
          <Link
            href={profileUrl}
            className="button_google h-8 px-3.5 sm:px-4 text-white text-xs sm:text-[13px] font-medium !rounded-lg transition shrink-0 inline-flex items-center justify-center shadow-xs"
          >
            <span>View Details</span>
          </Link>
        </div>
      </div>
    );
  };

  const renderTopSchoolCard = (school: SchoolRecord, idx: number) => {
    const profileUrl = getSchoolUrl(school);
    const isCompared = compareList.some((c) => c.id === school.id);
    const isLiked = likedSchoolIds.includes(school.id);
    const rawWebsite = (school as any).website || school.website || '';
    const hasWebsite = Boolean(rawWebsite && rawWebsite.trim() !== '' && rawWebsite !== '#' && !rawWebsite.includes('example.com'));
    const cleanWebsiteUrl = hasWebsite ? (rawWebsite.startsWith('http') ? rawWebsite : `https://${rawWebsite}`) : '';
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
          {school.rating && Number(school.rating) > 0 ? (
            <div className="absolute top-2.5 left-2.5 bg-black/75 text-white px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span>{school.rating}</span>
            </div>
          ) : null}

          {/* Action buttons */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {hasWebsite ? (
              <a
                href={cleanWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md bg-white/90 text-blue-600 hover:bg-white transition shadow-xs"
                title="Official Website"
              >
                <Globe size={12} />
              </a>
            ) : (
              <button
                disabled
                className="w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md bg-white/50 text-gray-400 opacity-40 cursor-not-allowed pointer-events-none"
                title="Website Not Available"
              >
                <Globe size={12} />
              </button>
            )}
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
            <h3 className="font-bold text-sm text-gray-900 leading-snug mb-1">
              <Link href={profileUrl} className="hover:text-blue-600 transition-colors inline">
                {renderSchoolTitleWithVerified(school.school_name || school.name || 'School')}
              </Link>
            </h3>

            <div className="text-[11px] text-gray-500 flex items-start gap-1 mb-2.5 leading-snug">
              <MapPin size={11} className="text-red-500 shrink-0 mt-0.5" />
              <span className="break-words">{locationStr}</span>
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

          {/* Bottom CTA - Responsive Dual Button Grid */}
          <div className="pt-2.5 border-t border-gray-100 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => openGoogleMaps(school, e)}
              className="h-8.5 px-2 rounded-lg border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-600 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer group shadow-2xs whitespace-nowrap min-w-0"
              title="Open location on Google Maps (Popup)"
            >
              <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.8" fill="#FFFFFF"/>
              </svg>
              <span className="truncate">Google Maps</span>
            </button>
            <Link
              href={profileUrl}
              className="h-8.5 px-2 rounded-lg bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold inline-flex items-center justify-center gap-1 shadow-xs hover:shadow-md transition-all whitespace-nowrap min-w-0"
            >
              <span className="truncate">View Details</span>
              <ArrowRight size={12} className="shrink-0" />
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
                            const coords = CITY_COORDINATES[city.name];
                            if (coords) {
                              setSearchCenter(coords);
                              setMapFocus({ lat: coords.lat, lng: coords.lng, zoom: 13, timestamp: Date.now() });
                            }
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

          {/* Quick CTA: Add / Claim Your School Profile */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-center">
            <span className="text-xs text-white/85">Are you a school principal or administrator?</span>
            <button
              type="button"
              onClick={handleAddSchoolClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-amber-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <PlusCircle size={13} className="text-amber-300 stroke-[2.5]" />
              <span>Add Your School Profile</span>
            </button>
          </div>
          </div>
        </div>


      {/* ── Admin Access & Directory Governance Control Bar ── */}
      {isAdmin && (
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-6 lg:px-8 pt-4">
          <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Admin Control Portal</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">School Directory Governance</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Control public visibility, user verification and directory status</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Toggle Directory Listing Status */}
              <button
                type="button"
                onClick={() => {
                  const nextVal = !isListingEnabledByAdmin;
                  setIsListingEnabledByAdmin(nextVal);
                  try {
                    localStorage.setItem('cseel_schools_listing_enabled', String(nextVal));
                  } catch {}
                }}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  isListingEnabledByAdmin
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                }`}
                title="Admin switch: Toggle school list display"
              >
                <span>Directory Display:</span>
                <span className="font-black underline">{isListingEnabledByAdmin ? 'ENABLED' : 'DISABLED (Verification Notice)'}</span>
              </button>

              {/* Verify Current Account Shortcut */}
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    verifyUser(user.email || user.id);
                    alert(`Account ${user.email} verified successfully!`);
                  }}
                  className="px-3 py-1.5 rounded-xl font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-all cursor-pointer"
                  title="Mark current account as verified"
                >
                  <CheckCircle2 size={13} className="inline mr-1" />
                  <span>Verify My Account</span>
                </button>
              )}

              {/* Simulation Mode Switcher */}
              <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setAdminSimulateMode('normal')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    adminSimulateMode === 'normal' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Admin View
                </button>
                <button
                  type="button"
                  onClick={() => setAdminSimulateMode('simulate_unverified')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    adminSimulateMode === 'simulate_unverified' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Test Unverified
                </button>
                <button
                  type="button"
                  onClick={() => setAdminSimulateMode('simulate_public')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    adminSimulateMode === 'simulate_public' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Test Public Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

            {/* Map Radius Range (Max 5 km) - Compact */}
            <div className="mb-4 p-2.5 rounded-xl bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-white border border-blue-200/70 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                  <Navigation size={12} className="text-[#005689]" />
                  <span>Map Radius</span>
                </div>
                <span className="text-[11px] font-black text-[#005689] bg-white px-2 py-0.5 rounded-full border border-blue-200 shadow-2xs">
                  {mapRadiusKm} km
                </span>
              </div>

              <div className="space-y-1.5">
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={mapRadiusKm}
                  onChange={(e) => setMapRadiusKm(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-blue-200/70 rounded-lg appearance-none cursor-pointer accent-[#005689]"
                />

                <div className="flex justify-between text-[10px] font-semibold text-slate-400 px-0.5">
                  <span>0.5 km</span>
                  <span>2.5 km</span>
                  <span className="font-bold text-[#005689]">Max 5 km</span>
                </div>

                {/* Quick select pills */}
                <div className="grid grid-cols-4 gap-1 pt-0.5">
                  {[1, 2, 3, 5].map((km) => (
                    <button
                      key={km}
                      type="button"
                      onClick={() => setMapRadiusKm(km)}
                      className={`py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        mapRadiusKm === km
                          ? 'bg-[#005689] text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-[#005689]'
                      }`}
                    >
                      {km} km
                    </button>
                  ))}
                </div>
              </div>
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
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {renderClassIcon(cls.label)}
                        </div>
                        <span className="text-sm text-gray-700 flex-1 group-hover:text-blue-600 transition-colors">{cls.label}</span>
                      </label>
                    ))}
                  </div>
            </div>

            {/* Board */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Curriculum Board</h3>
                {selectedBoard !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedBoard('all')}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {[
                  { name: 'CBSE' },
                  { name: 'ICSE' },
                  { name: 'IB' },
                  { name: 'Cambridge/IGCSE' },
                  { name: 'State Board' }
                ].map((b) => {
                  const isSelected = selectedBoard.toLowerCase() === b.name.toLowerCase() || (b.name === 'CBSE' && selectedBoard === 'CBSE');
                  return (
                    <div key={b.name} className="group">
                      <label className={`flex items-center gap-2.5 p-1.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/80 text-blue-800 font-semibold' : 'hover:bg-slate-50 text-gray-700'
                      }`}>
                        <input
                          type="checkbox"
                          name="board"
                          checked={isSelected}
                          onChange={() => setSelectedBoard(isSelected ? 'all' : b.name)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {renderBoardLogo(b.name)}
                        </div>
                        <span className="text-sm flex-1 group-hover:text-blue-600 transition-colors">
                          {b.name}
                        </span>
                        {b.name === 'State Board' && (
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsStateModalOpen(true); }}
                            className="ml-auto text-[11px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
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
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {renderSchoolTypeIcon(type.name)}
                        </div>
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
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {renderSpecialCategoryIcon(cat.name)}
                        </div>
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Facilities</h3>
                {selectedFacilities.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedFacilities([])}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Clear ({selectedFacilities.length})
                  </button>
                )}
              </div>
              <div className="space-y-2.5">
                {FACILITY_CATEGORIES.map((cat, cIdx) => (
                  <details key={cat.category} className="group" open={cIdx === 0 || cIdx === 1}>
                    <summary className="text-xs font-bold text-gray-800 cursor-pointer list-none flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-colors border border-slate-200/70">
                      <div className="flex items-center gap-2">
                        {renderCategoryHeaderIcon(cat.category, cat.categoryIcon)}
                        <span>{cat.category}</span>
                      </div>
                      <ChevronDown size={14} className="text-gray-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="mt-1.5 space-y-1 px-1 py-1 max-h-48 overflow-y-auto custom-scrollbar">
                      {cat.items.map((item) => {
                        const isChecked = selectedFacilities.includes(item.name);
                        return (
                          <label
                            key={item.name}
                            className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors group ${
                              isChecked ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleFacility(item.name)}
                              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            {renderFacilityIcon(item)}
                            <span className="text-xs group-hover:text-blue-600 transition-colors leading-tight">
                              {item.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </details>
                ))}
              </div>
            </div>

              <button
                onClick={() => {
                  setSelectedBoard('all');
                  setSelectedResidential('all');
                  setSelectedFacilities([]);
                  setOnlyAtl(false);
                  setSearchTerm('');
                  setSearchMode('text');
                  handleFilterChange({ board: undefined, residential: undefined, facility: undefined });
                }}
                className="button_secondary w-full py-2.5 rounded-[12px] text-xs font-bold transition mt-auto cursor-pointer border border-[#D6EDFF] text-[#006FCC]"
              >
                Reset Filters
              </button>
            
            </div> {/* End collapse wrapper */}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 flex flex-col gap-4">
          
          {/* Active Status & View Switcher Bar */}
          <div className="bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Result count */}
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 whitespace-nowrap">
                  {displayedSchools.length} {displayedSchools.length === 1 ? 'Result' : 'Results'}
                </h2>
                
                {/* View Mode Switcher (Icons on mobile, Labels on desktop) */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg sm:rounded-xl border border-gray-200/70">
                  {/* Standard Grid / Cards */}
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-semibold transition ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="Card View (2 Columns)"
                  >
                    <LayoutGrid size={14} />
                    <span className="hidden sm:inline">2 Cols</span>
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

                  {/* Compact List */}
                  <button
                    onClick={() => handleViewModeChange('compact')}
                    className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-semibold transition ${
                      viewMode === 'compact'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="Compact View"
                  >
                    <List size={14} />
                    <span className="hidden sm:inline">Compact</span>
                  </button>

                  {/* Integrated Map View Toggle */}
                  <button
                    onClick={() => handleViewModeChange('map')}
                    className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-bold transition ${
                      viewMode === 'map'
                        ? 'bg-[#1A73E8] text-white shadow-xs'
                        : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100'
                    }`}
                    title="Map View"
                  >
                    <Map size={14} />
                    <span className="hidden sm:inline">Map</span>
                  </button>
                </div>
              </div>

              {/* Actions: Add School Profile & Mobile Filter Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddSchoolClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#005689] hover:bg-[#003c6e] active:scale-95 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer whitespace-nowrap"
                  title="List and customize your school on CSEEL"
                >
                  <PlusCircle size={13} className="stroke-[2.5]" />
                  <span className="hidden xs:inline">Add Your Profile</span>
                  <span className="xs:hidden">+ Add</span>
                </button>

                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="md:hidden h-8 px-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition"
                  title="Open Filters"
                >
                  <Filter size={13} />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            <Link href="/about-experiential-lab" className="text-blue-500 hover:text-blue-700 hover:underline text-xs sm:text-[13px] font-semibold transition-colors">
              What is Experiential Science Lab?
            </Link>
          </div>

          {/* ── Conditional Display: Auth & Verification Gate vs School Cards ── */}
          {isGuest ? (
            /* 1. Public Visitor: NOT logged in ("Login first to see the school") */
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-10 md:p-12 text-center my-4 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#005689] to-[#0084cc] text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                  <span>Member Access Only</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Sign in to Access School Directory
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Please log in to explore comprehensive school profiles, fee structures, ratings, and academic facilities. Full directory details are accessible exclusively to verified members.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-60"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>Login with Google</span>
                </button>

                {/* Email Sign In Button */}
                <Link
                  href="/login"
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Email</span>
                </Link>
              </div>
            </div>
          ) : isListingDisabled || isUserUnverified ? (
            /* 2. Logged In, but Admin disabled list OR user unverified */
            <div className="bg-white rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 shadow-lg p-6 sm:p-10 md:p-12 text-center my-4 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Verification in Progress</span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  School Directory Verification in Progress
                </h3>

                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  We are continuously auditing and verifying institutional profiles. The comprehensive school directory will be displayed here once administrative review is complete.
                </p>

                {effectiveUser && (
                  <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 text-left space-y-1.5 max-w-md mx-auto">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Account Logged In: {effectiveUser.email}</span>
                    </div>
                    <p className="text-amber-800 text-[11px] pl-5.5">
                      {isListingDisabled
                        ? 'Administrative notice: School directory display is currently set to verification review mode by administrator.'
                        : 'Your account is queued for admin approval. Once verified by our administration team, full directory access will be unlocked.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 3. Authorized View: Display Schools & Pagination */
            <>
              {/* School Cards: Map, Grid, or Compact List */}
              {viewMode === 'map' ? (
                <div className="w-full h-[620px] sm:h-[720px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg relative my-2 bg-slate-50">
                  <SchoolFinderMap
                    searchCenter={searchCenter}
                    mapFocus={mapFocus}
                    radiusKm={mapRadiusKm}
                    schools={displayedSchools}
                    selectedSchool={mapSelectedSchool}
                    onSelectSchool={(school) => setMapSelectedSchool(school as SchoolRecord)}
                    onOpenDetails={(school) => router.push(getSchoolUrl(school as SchoolRecord))}
                    onLocationChange={handleLocationChange}
                    onLocateMe={handleLocateMe}
                    isLocating={isLocating}
                  />
                </div>
              ) : viewMode === 'compact' ? (
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
            </>
          )}
        </main>
      </div>

      {/* ── Top Rated Schools Section (Horizontal Scroll Carousel) ── */}
      {canViewSchools && topSchools.length > 0 && (
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
                  <tr><td className="p-3 font-semibold">Rating</td>{compareList.map(c => <td key={c.id} className="p-3 text-amber-600 font-bold">{c.rating && Number(c.rating) > 0 ? `★ ${c.rating}` : 'Verified'}</td>)}</tr>
                  <tr><td className="p-3 font-semibold">Classes</td>{compareList.map(c => <td key={c.id} className="p-3">{c.classes || 'Class 1st - 10th'}</td>)}</tr>
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

      {/* ── Google Maps In-Screen Popup Modal ── */}
      {googleMapModalSchool && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setGoogleMapModalSchool(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200/80 relative flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.8" fill="#FFFFFF"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                      {googleMapModalSchool.school_name || googleMapModalSchool.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 size={11} className="text-emerald-600 fill-emerald-100" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                    <span className="truncate">
                      {[
                        googleMapModalSchool.village_ward || googleMapModalSchool.locality,
                        googleMapModalSchool.district_name,
                        googleMapModalSchool.state_name,
                        googleMapModalSchool.pincode
                      ].filter(Boolean).join(', ')}
                    </span>
                    {googleMapModalSchool.distance !== undefined && (
                      <span className="shrink-0 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                        📍 {googleMapModalSchool.distance < 1 ? `${Math.round(googleMapModalSchool.distance * 1000)}m away` : `${googleMapModalSchool.distance} km away`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setGoogleMapModalSchool(null)} 
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition shrink-0 cursor-pointer"
                title="Close Map"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Interactive Leaflet Map (Guaranteed No Iframe Blocking) */}
            <div className="relative w-full h-[380px] sm:h-[480px] bg-slate-100 overflow-hidden">
              <div ref={modalMapContainerRef} className="w-full h-full min-h-[380px] sm:min-h-[480px] z-0" />
            </div>

            {/* Modal Footer: Action Buttons */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Board:</span> {googleMapModalSchool.board || 'CBSE'}
                <span>•</span>
                <span className="font-semibold text-slate-700">Classes:</span> {googleMapModalSchool.classes || 'Nursery - 12th'}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={
                    googleMapModalSchool.lat && googleMapModalSchool.lng
                      ? `https://www.google.com/maps/dir/?api=1&destination=${googleMapModalSchool.lat},${googleMapModalSchool.lng}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${googleMapModalSchool.school_name || googleMapModalSchool.name}, ${googleMapModalSchool.district_name || ''}`
                        )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Compass size={15} />
                  <span>Get Directions</span>
                </a>

                <Link
                  href={getSchoolUrl(googleMapModalSchool)}
                  onClick={() => setGoogleMapModalSchool(null)}
                  className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1 shadow-sm transition"
                >
                  <span>View Full Profile</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add School Profile Modal ── */}
      <AddSchoolModal

        isOpen={isAddSchoolModalOpen}
        onClose={() => setIsAddSchoolModalOpen(false)}
      />

      {/* ── Claim School Profile Modal ── */}
      <ClaimSchoolModal
        isOpen={claimModalData.isOpen}
        onClose={() => setClaimModalData({ isOpen: false, schoolName: '', udiseCode: '' })}
        schoolName={claimModalData.schoolName}
        udiseCode={claimModalData.udiseCode}
      />
    </div>
  );
}

