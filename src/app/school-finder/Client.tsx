'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { fetchLiveSchoolsFromSupabase } from '@/integrations/supabase/schoolSearchClient';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Navigation,
  School as SchoolIcon,
  BookOpen,
  Filter,
  RotateCcw,
  Check,
  X,
  Compass,
  Crosshair,
  Building,
  Building2,
  User,
  ExternalLink,
  Layers,
  Map as MapIcon,
  ListFilter,
  Home,
  Menu,
  Sparkles,
  Flame,
  Users,
  Award,
  Hash,
  PanelLeftClose,
  PanelLeftOpen,
  GraduationCap,
  Microscope,
  Monitor,
  CheckCircle2,
  IndianRupee,
  Star,
  Phone,
  Mail,
  Globe,
  Share2,
  Bed,
  Loader2,
  Beaker,
  Sun,
  Moon,
  Laptop,
  PlusCircle,
  Settings,
  ShieldCheck,
  ArrowRight,
  Info,
  Download,
} from 'lucide-react';
import SchoolFinderMap from '@/components/school-finder/SchoolFinderMap';
import SchoolDetailModal from '@/components/school-finder/SchoolDetailModal';
import {
  POPULAR_CITIES,
  SchoolRecord,
  calculateDistanceKm,
} from '@/data/schoolFinderData';
import {
  querySchoolsFromSupabase,
  querySchoolMapPoints,
  SchoolMapPoint,
  SearchSchoolOptions,
  geocodeAddressNominatim,
  reverseGeocodeNominatim,
  parseDirectCoordinates,
  fetchOverpassSchools,
  detectUserLocationWithIpFallback,
  searchGoogleMapsAutocomplete,
  SearchSuggestion,
} from '@/integrations/supabase/schoolSearchClient';

function parseClassNumber(clsStr: string): number {
  if (!clsStr) return 1;
  const lower = clsStr.toLowerCase();
  if (lower.includes('nursery') || lower.includes('pre') || lower.includes('kg')) return 0;
  const match = lower.match(/\d+/);
  return match ? parseInt(match[0]) : 1;
}

function schoolHasClass(school: SchoolRecord, targetClass: string): boolean {
  if (!targetClass || targetClass === 'all') return true;
  if (targetClass === 'nursery') {
    return (
      school.class_from?.toLowerCase().includes('nursery') ||
      school.class_from?.toLowerCase().includes('pre') ||
      school.pre_primary_section === '1-Yes' ||
      school.pre_primary_section === 'Yes'
    );
  }
  const targetNum = parseInt(targetClass);
  const fromNum = parseClassNumber(school.class_from || '1');
  const toNum = parseClassNumber(school.class_to || '12');
  return targetNum >= fromNum && targetNum <= toNum;
}

function schoolHasBoard(school: SchoolRecord, b: string): boolean {
  return (
    (school.board_secondary_10th && school.board_secondary_10th.includes(b)) ||
    (school.board_higher_secondary_12th && school.board_higher_secondary_12th.includes(b)) ||
    (school.board && school.board.includes(b)) ||
    false
  );
}

function schoolHasFacility(school: SchoolRecord, fac: string): boolean {
  const isYes = (val: any) => val === true || String(val || '').toLowerCase().includes('yes') || String(val || '') === '1';
  if (fac === 'Library') return isYes(school.library) || (school.facilities || []).includes('Library');
  if (fac === 'Smart Classrooms') return (school.digital_boards_working ?? 0) > 0 || (school.facilities || []).some((f) => f.toLowerCase().includes('smart'));
  if (fac === 'Atal Tinkering Lab') return isYes(school.tinkering_lab_atl);
  if (fac === 'Computer Lab') return isYes(school.ict_lab);
  if (fac === 'Science') return isYes(school.integrated_science_lab) || (school.facilities || []).some((f) => f.toLowerCase().includes('science') || f.toLowerCase().includes('lab'));
  if (fac === 'Sports') return isYes(school.playground) || (school.facilities || []).some((f) => f.toLowerCase().includes('sport'));
  return (school.facilities || []).some((f) => f.toLowerCase().includes(fac.toLowerCase()));
}

export default function SchoolFinderClient() {
  // Desktop Drawer & Mobile Bottom Sheet State
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [mobileSheetState, setMobileSheetState] = useState<'peek' | 'half' | 'full'>('peek');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Right Navigation Drawer, Theme Selection & School Profile State
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [currentSchoolProfile, setCurrentSchoolProfile] = useState<{
    schoolName: string;
    photoUrl: string;
    district: string;
    state: string;
  }>({
    schoolName: 'Delhi Public International School',
    photoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&auto=format&fit=crop&q=80',
    district: 'Gurugram',
    state: 'Haryana',
  });

  // Sync saved School Profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cseel_school_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentSchoolProfile({
          schoolName: parsed.schoolName || 'School Profile',
          photoUrl: parsed.photoUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&auto=format&fit=crop&q=80',
          district: parsed.district || 'City',
          state: parsed.state || 'State',
        });
      }
    } catch (e) {}
  }, []);

  // Theme Initializer & Active Mode Switcher
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
      if (savedTheme) setSelectedTheme(savedTheme);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDark =
      selectedTheme === 'dark' ||
      (selectedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', selectedTheme);
  }, [selectedTheme]);

  // Mobile Drag Gestures & Snapping State
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const [sheetDragHeight, setSheetDragHeight] = useState<number | null>(null);
  const touchStartYRef = useRef<number>(0);
  const touchStartHeightRef = useRef<number>(0);
  const lastTouchYRef = useRef<number>(0);
  const lastTouchTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDragMovedRef = useRef<boolean>(false);
  const sheetAsideRef = useRef<HTMLDivElement>(null);
  const isDraggingSheetRef = useRef(false);
  const currentDragHeightRef = useRef<number | null>(null);

  const getTargetHeightForState = useCallback((state: 'peek' | 'half' | 'full') => {
    if (typeof window === 'undefined') return 165;
    const winH = window.innerHeight;
    if (state === 'peek') return 165;
    if (state === 'half') return Math.round(winH * 0.52);
    return Math.round(winH * 0.94);
  }, []);

  const handleDragStart = useCallback((clientY: number) => {
    const now = performance.now();
    touchStartYRef.current = clientY;
    lastTouchYRef.current = clientY;
    lastTouchTimeRef.current = now;
    velocityRef.current = 0;
    isDragMovedRef.current = false;
    isDraggingSheetRef.current = true;

    const currentH =
      sheetAsideRef.current?.getBoundingClientRect().height ||
      getTargetHeightForState(mobileSheetState);

    touchStartHeightRef.current = currentH;
    currentDragHeightRef.current = currentH;

    if (sheetAsideRef.current) {
      sheetAsideRef.current.style.transition = 'none';
      sheetAsideRef.current.style.height = `${currentH}px`;
    }
  }, [mobileSheetState, getTargetHeightForState]);

  const handleHandleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length > 0) {
      handleDragStart(e.touches[0].clientY);
    }
  }, [handleDragStart]);

  const handleHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleDragStart(e.clientY);
  }, [handleDragStart]);

  useEffect(() => {
    const onMove = (e: TouchEvent | MouseEvent) => {
      if (!isDraggingSheetRef.current || !sheetAsideRef.current) return;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const now = performance.now();
      const dt = now - lastTouchTimeRef.current;

      if (dt > 8) {
        const dy = lastTouchYRef.current - clientY;
        velocityRef.current = dy / dt;
        lastTouchTimeRef.current = now;
        lastTouchYRef.current = clientY;
      }

      const deltaY = touchStartYRef.current - clientY;
      if (Math.abs(deltaY) > 5) {
        isDragMovedRef.current = true;
      }

      const maxH = window.innerHeight * 0.94;
      const minH = 140;
      let targetH = touchStartHeightRef.current + deltaY;

      if (targetH > maxH) {
        targetH = maxH + (targetH - maxH) * 0.25;
      } else if (targetH < minH) {
        targetH = minH - (minH - targetH) * 0.25;
      }

      currentDragHeightRef.current = targetH;
      sheetAsideRef.current.style.height = `${targetH}px`;
    };

    const onEnd = () => {
      if (!isDraggingSheetRef.current) return;
      isDraggingSheetRef.current = false;
      const winH = window.innerHeight;
      const peekH = 165;
      const halfH = winH * 0.52;
      const fullH = winH * 0.94;

      if (sheetAsideRef.current) {
        sheetAsideRef.current.style.transition = 'height 320ms cubic-bezier(0.2, 0.9, 0.3, 1)';
        sheetAsideRef.current.style.height = '';
      }

      if (!isDragMovedRef.current) {
        setMobileSheetState((prev) => (prev === 'peek' ? 'half' : prev === 'half' ? 'full' : 'peek'));
        return;
      }

      const finalH = currentDragHeightRef.current ?? touchStartHeightRef.current;
      const velocity = velocityRef.current;

      if (velocity > 0.4) {
        setMobileSheetState('full');
        return;
      }
      if (velocity < -0.4) {
        setMobileSheetState('peek');
        return;
      }

      const distPeek = Math.abs(finalH - peekH);
      const distHalf = Math.abs(finalH - halfH);
      const distFull = Math.abs(finalH - fullH);

      if (distPeek <= distHalf && distPeek <= distFull) {
        setMobileSheetState('peek');
      } else if (distHalf <= distFull) {
        setMobileSheetState('half');
      } else {
        setMobileSheetState('full');
      }
    };

    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
    };
  }, []);

  // Live Database Schools & Dot Points State
  const [hasUserSearched, setHasUserSearched] = useState(false);
  const [liveSchools, setLiveSchools] = useState<SchoolRecord[]>([]);
  const [mapPoints, setMapPoints] = useState<SchoolMapPoint[]>([]);
  const [totalDatabaseSchools, setTotalDatabaseSchools] = useState<number>(0);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Pagination for DOM rendering (prevents mobile lag when 5,000 schools are loaded in memory)
  const [displayLimit, setDisplayLimit] = useState<number>(40);

  // Search & Geolocation State (Default Empty Address & 2km Radius)
  const [searchLocation, setSearchLocation] = useState('');
  const [currentCity, setCurrentCity] = useState(POPULAR_CITIES[0]); // Rewari coords default
  
  // SEPARATE SEARCH ORIGIN (for distance & radius) FROM MAP FOCUS (for smooth panning)
  const [searchCenter, setSearchCenter] = useState({ lat: POPULAR_CITIES[0].lat, lng: POPULAR_CITIES[0].lng });
  const [mapFocus, setMapFocus] = useState<{ lat: number; lng: number; zoom?: number; timestamp: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [mapViewMode, setMapViewMode] = useState<'auto' | 'pins' | 'dots'>('auto');
  const [localFilterQuery, setLocalFilterQuery] = useState('');

  const [selectedSchool, setSelectedSchool] = useState<SchoolRecord | null>(null);
  const [modalSchool, setModalSchool] = useState<SchoolRecord | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'name' | 'rating' | 'ratio' | 'fees' | 'students' | 'teachers'>('distance');

  // Quick Filters
  const [quickManagementFilter, setQuickManagementFilter] = useState<string>('all'); // all | Government | Private
  const [quickResidentialFilter, setQuickResidentialFilter] = useState<string>('all'); // all | non_res | res

  // Specific Class & Fee Filter
  const [selectedClass, setSelectedClass] = useState<string>('all'); // all | nursery | 1 | 2 ... 12
  const [maxAnnualFee, setMaxAnnualFee] = useState<number | null>(null); // null = any, 0 = free, 35000, 60000, 150000

  // Residential Filter
  const [residentialType, setResidentialType] = useState<string>('all'); // all | non_res | res | partial

  // Student Strength Range Bar Filter
  const [minStudents, setMinStudents] = useState<number>(0);
  const [maxStudents, setMaxStudents] = useState<number | null>(null); // null = any, 250, 500, 1000, 2500

  // Teacher Strength Range Bar Filter
  const [minTeachers, setMinTeachers] = useState<number>(0);
  const [maxTeachers, setMaxTeachers] = useState<number | null>(null); // null = any, 10, 25, 50, 100

  // Comprehensive UDISE Column Filters
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]); // CBSE, ICSE, HBSE, State Board, IB
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Primary, Upper Primary, Secondary, Senior Secondary
  const [selectedManagements, setSelectedManagements] = useState<string[]>([]); // Government, Private, Aided
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]); // Co-ed, Boys, Girls
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]); // English, Hindi, Urdu, Others
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]); // Atal Tinkering Lab, Computer Lab, Library, Smart Classrooms, Science Labs, Sports Ground
  const [maxStr, setMaxStr] = useState<number | null>(null); // null = any, 15, 20, 30
  const [onlyPmShri, setOnlyPmShri] = useState(false);
  const [onlyAdmissionsOpen, setOnlyAdmissionsOpen] = useState(false);

  // Google Maps-style Autocomplete Suggestions State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  // Helper to synchronize active search coordinates & query with URL params
  const syncUrlParams = useCallback((lat: number, lng: number, radius: number, query?: string) => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lat', lat.toFixed(5));
      url.searchParams.set('lng', lng.toFixed(5));
      url.searchParams.set('radius', radius.toString());
      if (query && query.trim() && query !== 'My Current Location') {
        url.searchParams.set('q', query.trim());
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  }, []);

  // Targeted Fast Query Function with Supabase parallel batch fetching & full filter/sort parameters
  const loadNearbySchools = useCallback(async (
    lat: number,
    lng: number,
    radius: number,
    search?: string,
    filterOverrides?: Partial<SearchSchoolOptions>
  ) => {
    setIsLoadingSchools(true);
    setIsProcessing(true);
    setHasUserSearched(true);
    setDisplayLimit(40);
    syncUrlParams(lat, lng, radius, search);
    
    // Clear previous search selection so no stale state lingers
    setSelectedSchool(null);
    setModalSchool(null);

    try {
      const isGPS = search === 'My Current Location' || search === 'My Location';
      // Only pass query to DB if it's a specific keyword and not a full formatted comma address
      const cleanSearch = !isGPS && search && !search.includes(',') && !POPULAR_CITIES.some(c => c.name.toLowerCase() === search.toLowerCase()) ? search.trim() : undefined;

      const fetchLimit = radius >= 20 ? 5000 : 500;
      const pointsLimit = radius >= 20 ? 10000 : 5000;

      const queryOpts: SearchSchoolOptions = {
        centerLat: lat,
        centerLng: lng,
        radiusKm: radius,
        query: cleanSearch,
        boards: filterOverrides?.boards !== undefined ? filterOverrides.boards : (selectedBoards.length > 0 ? selectedBoards : undefined),
        managements: filterOverrides?.managements !== undefined ? filterOverrides.managements : (selectedManagements.length > 0 ? selectedManagements : (quickManagementFilter !== 'all' ? [quickManagementFilter] : undefined)),
        genders: filterOverrides?.genders !== undefined ? filterOverrides.genders : (selectedGenders.length > 0 ? selectedGenders : undefined),
        mediums: filterOverrides?.mediums !== undefined ? filterOverrides.mediums : (selectedMediums.length > 0 ? selectedMediums : undefined),
        minStudents: filterOverrides?.minStudents !== undefined ? filterOverrides.minStudents : (minStudents > 0 ? minStudents : undefined),
        maxStudents: filterOverrides?.maxStudents !== undefined ? filterOverrides.maxStudents : (maxStudents !== null ? maxStudents : undefined),
        minTeachers: filterOverrides?.minTeachers !== undefined ? filterOverrides.minTeachers : (minTeachers > 0 ? minTeachers : undefined),
        maxTeachers: filterOverrides?.maxTeachers !== undefined ? filterOverrides.maxTeachers : (maxTeachers !== null ? maxTeachers : undefined),
        facilities: filterOverrides?.facilities !== undefined ? filterOverrides.facilities : (selectedFacilities.length > 0 ? selectedFacilities : undefined),
        residential: filterOverrides?.residential !== undefined ? filterOverrides.residential : (residentialType !== 'all' ? residentialType : (quickResidentialFilter !== 'all' ? quickResidentialFilter : undefined)),
        onlyPmShri: filterOverrides?.onlyPmShri !== undefined ? filterOverrides.onlyPmShri : onlyPmShri,
        sortBy: (filterOverrides?.sortBy || sortBy) as any,
        limit: fetchLimit,
        offset: 0
      };

      // 1. Fetch schools with all filters & sort parameters from Supabase
      const res = await querySchoolsFromSupabase(queryOpts);

      setLiveSchools(res.schools);
      setTotalDatabaseSchools(res.total);

      // 2. Fetch lightweight map points from indexed Supabase matching same filters
      const points = await querySchoolMapPoints(lat, lng, radius, pointsLimit, queryOpts);
      setMapPoints(points);
    } catch (err) {
      console.error('Error fetching schools:', err);
    } finally {
      setIsLoadingSchools(false);
      setIsProcessing(false);
    }
  }, [
    syncUrlParams,
    selectedBoards,
    selectedManagements,
    quickManagementFilter,
    selectedGenders,
    selectedMediums,
    minStudents,
    maxStudents,
    minTeachers,
    maxTeachers,
    selectedFacilities,
    residentialType,
    quickResidentialFilter,
    onlyPmShri,
    sortBy
  ]);

  // ─── INITIAL MOUNT: RESTORE FROM URL OR AUTO-REQUEST LIVE GEOLOCATION ───
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const latParam = params.get('lat');
    const lngParam = params.get('lng');
    const radiusParam = params.get('radius');
    const qParam = params.get('q');

    // 1. If URL has query parameters from previous search / refresh, restore exact search
    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      const radius = radiusParam ? parseFloat(radiusParam) : 10;
      const q = qParam || '';
      setSearchCenter({ lat, lng });
      setMapFocus({ lat, lng, zoom: 14, timestamp: Date.now() });
      setRadiusKm(radius);
      if (q) setSearchLocation(q);
      setHasUserSearched(true);
      loadNearbySchools(lat, lng, radius, q);
      return;
    }

    // 2. Initial Visit: Automatically detect user location via GPS / WiFi IP network & discover 10km schools!
    (async () => {
      setIsLocating(true);
      setIsProcessing(true);
      try {
        const detected = await detectUserLocationWithIpFallback();
        setSearchCenter({ lat: detected.lat, lng: detected.lng });
        setMapFocus({ lat: detected.lat, lng: detected.lng, zoom: 14, timestamp: Date.now() });
        setSearchLocation(detected.locationName);
        setHasUserSearched(true);
        loadNearbySchools(detected.lat, detected.lng, 10, detected.locationName);
      } catch (e) {
        loadNearbySchools(28.4595, 77.0266, 10, 'Gurugram, Haryana');
      } finally {
        setIsLocating(false);
        setIsProcessing(false);
      }
    })();
  }, [loadNearbySchools]);

  // ─── DRAGGABLE PIN & LONG-PRESS HANDLER WITH REVERSE GEOCODING ───
  const handleLocationPinChange = useCallback(async (newLat: number, newLng: number) => {
    setIsProcessing(true);
    setHasUserSearched(true);
    setSearchCenter({ lat: newLat, lng: newLng });
    setMapFocus({ lat: newLat, lng: newLng, zoom: radiusKm <= 3 ? 14 : 13, timestamp: Date.now() });

    try {
      // Run Reverse Geocoding to get human-readable address / PIN / locality
      const readableAddress = await reverseGeocodeNominatim(newLat, newLng);
      if (readableAddress) {
        setSearchLocation(readableAddress);
      }
    } catch (e) {
      setSearchLocation(`${newLat.toFixed(4)}, ${newLng.toFixed(4)}`);
    } finally {
      setIsProcessing(false);
    }

    loadNearbySchools(newLat, newLng, radiusKm);
  }, [radiusKm, loadNearbySchools]);

  // Infinite Scroll: Load Next 50 Schools
  const handleLoadMoreSchools = useCallback(async () => {
    if (isLoadingMore || liveSchools.length >= totalDatabaseSchools) return;
    setIsLoadingMore(true);
    try {
      const isGPS = searchLocation === 'My Current Location' || searchLocation === 'My Location';
      const cleanSearch = !isGPS && searchLocation && !searchLocation.includes(',') && !POPULAR_CITIES.some(c => c.name.toLowerCase() === searchLocation.toLowerCase()) ? searchLocation.trim() : undefined;

      const res = await querySchoolsFromSupabase({
        centerLat: searchCenter.lat,
        centerLng: searchCenter.lng,
        radiusKm: radiusKm,
        query: cleanSearch,
        limit: 50,
        offset: liveSchools.length
      });

      setLiveSchools((prev) => [...prev, ...res.schools]);
    } catch (err) {
      console.error('Error loading more schools:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, liveSchools.length, totalDatabaseSchools, searchLocation, searchCenter, radiusKm]);

  // Re-fetch when radius changes ONLY IF user has searched
  useEffect(() => {
    if (hasUserSearched) {
      loadNearbySchools(searchCenter.lat, searchCenter.lng, radiusKm, searchLocation);
    }
  }, [radiusKm, hasUserSearched, loadNearbySchools]);

  // Debounced search suggestions effect as user types
  useEffect(() => {
    const q = searchLocation.trim();
    if (!q || q.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsFetchingSuggestions(true);
      try {
        const results = await searchGoogleMapsAutocomplete(q, searchCenter);
        setSuggestions(results);
      } catch (err) {
        console.warn('Suggestions error:', err);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchLocation, searchCenter]);

  // Auto-open school modal popup if school_id, id, or udise query parameter exists in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const targetId = params.get('school_id') || params.get('id') || params.get('udise') || params.get('udise_code') || params.get('school');
    if (targetId) {
      const dataSource = liveSchools;
      const match = dataSource.find(
        (s) =>
          String(s.school_id) === String(targetId) ||
          String(s.id) === String(targetId) ||
          String(s.udise_code) === String(targetId) ||
          (s as any).slug === targetId
      );
      if (match) {
        setSelectedSchool(match);
        setModalSchool(match);
        const schoolLat = match.latitude || match.lat;
        const schoolLng = match.longitude || match.lng;
        setSearchCenter({ lat: schoolLat, lng: schoolLng });
        setMapFocus({ lat: schoolLat, lng: schoolLng, zoom: 14, timestamp: Date.now() });
        setSearchLocation(`${match.school_name} (${match.village_ward})`);
      }
    }
  }, [liveSchools]);

  // Geolocation trigger with GPS + WiFi/IP network detection
  const handleLocateMe = useCallback(async () => {
    setIsLocating(true);
    setIsProcessing(true);
    try {
      const detected = await detectUserLocationWithIpFallback();
      setSearchCenter({ lat: detected.lat, lng: detected.lng });
      setMapFocus({ lat: detected.lat, lng: detected.lng, zoom: 14, timestamp: Date.now() });
      setSearchLocation(detected.locationName);
      setHasUserSearched(true);
      loadNearbySchools(detected.lat, detected.lng, radiusKm, detected.locationName);
    } catch (e) {
      console.warn('Location detection notice:', e);
      loadNearbySchools(searchCenter.lat, searchCenter.lng, radiusKm);
    } finally {
      setIsLocating(false);
      setIsProcessing(false);
    }
  }, [radiusKm, loadNearbySchools, searchCenter]);

  // Select a preset popular city
  const handleSelectCity = (city: typeof POPULAR_CITIES[0]) => {
    setIsProcessing(true);
    setCurrentCity(city);
    setSearchLocation(`${city.name}, ${city.state}`);
    setSearchCenter({ lat: city.lat, lng: city.lng });
    setMapFocus({ lat: city.lat, lng: city.lng, zoom: 14, timestamp: Date.now() });
    setShowSuggestions(false);
    loadNearbySchools(city.lat, city.lng, radiusKm);
  };

  // Select a Google Maps-style Autocomplete Suggestion
  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setIsProcessing(true);
    setShowSuggestions(false);
    setSearchLocation(suggestion.title);
    setSearchCenter({ lat: suggestion.lat, lng: suggestion.lng });
    setMapFocus({
      lat: suggestion.lat,
      lng: suggestion.lng,
      zoom: suggestion.type === 'school' ? 15 : 14,
      timestamp: Date.now(),
    });

    if (suggestion.type === 'school' && suggestion.schoolRecord) {
      setSelectedSchool(suggestion.schoolRecord);
    }

    loadNearbySchools(suggestion.lat, suggestion.lng, radiusKm, suggestion.title);
    setIsProcessing(false);
  };

  // ─── CLEAR SEARCH (Clears search input only - does NOT trigger geolocation or search) ───
  const handleClearSearch = useCallback(() => {
    setSearchLocation('');
    setShowSuggestions(false);
    setSuggestions([]);
  }, []);

  // ─── SEARCH SUBMIT WITH DIRECT COORDINATES & NOMINATIM OPENSTREETMAP GEOCODING ───
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchLocation.trim();
    if (!query) return;

    setIsProcessing(true);
    setShowSuggestions(false);

    // 1. If suggestions already loaded and top suggestion is exact or highly relevant
    if (suggestions.length > 0) {
      const top = suggestions[0];
      handleSelectSuggestion(top);
      return;
    }

    // 2. Check if direct coordinates (e.g., "28.1833, 76.6167")
    const directCoords = parseDirectCoordinates(query);
    if (directCoords) {
      setSearchCenter({ lat: directCoords.lat, lng: directCoords.lng });
      setMapFocus({ lat: directCoords.lat, lng: directCoords.lng, zoom: 14, timestamp: Date.now() });
      try {
        const readable = await reverseGeocodeNominatim(directCoords.lat, directCoords.lng);
        if (readable) setSearchLocation(readable);
      } catch (err) {}
      loadNearbySchools(directCoords.lat, directCoords.lng, radiusKm);
      setIsProcessing(false);
      return;
    }

    // 3. Check popular cities list
    const matchedCity = POPULAR_CITIES.find(
      (c) =>
        c.name.toLowerCase() === query.toLowerCase() ||
        query.toLowerCase().includes(c.name.toLowerCase())
    );
    if (matchedCity) {
      setSearchCenter({ lat: matchedCity.lat, lng: matchedCity.lng });
      setMapFocus({ lat: matchedCity.lat, lng: matchedCity.lng, zoom: 14, timestamp: Date.now() });
      loadNearbySchools(matchedCity.lat, matchedCity.lng, radiusKm);
      setIsProcessing(false);
      return;
    }

    // 4. Forward Geocoding via Nominatim OpenStreetMap (Address, PIN code, District, Landmark)
    try {
      const geoResult = await geocodeAddressNominatim(query);
      if (geoResult) {
        setSearchCenter({ lat: geoResult.lat, lng: geoResult.lng });
        setMapFocus({ lat: geoResult.lat, lng: geoResult.lng, zoom: 14, timestamp: Date.now() });
        setSearchLocation(geoResult.displayName.split(',').slice(0, 3).join(','));
        loadNearbySchools(geoResult.lat, geoResult.lng, radiusKm);
        setIsProcessing(false);
        return;
      }
    } catch (err) {
      console.warn('Geocoding error:', err);
    }

    // 5. Fallback direct keyword query
    loadNearbySchools(searchCenter.lat, searchCenter.lng, radiusKm, query);
    setIsProcessing(false);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setIsProcessing(true);
    setSelectedBoards([]);
    setSelectedTypes([]);
    setSelectedManagements([]);
    setSelectedGenders([]);
    setSelectedMediums([]);
    setSelectedFacilities([]);
    setSelectedClass('all');
    setMaxAnnualFee(null);
    setResidentialType('all');
    setMinStudents(0);
    setMaxStudents(null);
    setMinTeachers(0);
    setMaxTeachers(null);
    setMaxStr(null);
    setOnlyPmShri(false);
    setOnlyAdmissionsOpen(false);
    setQuickManagementFilter('all');
    setQuickResidentialFilter('all');
    setRadiusKm(10);
    setTimeout(() => setIsProcessing(false), 150);
  };

  // ─── DYNAMIC CASCADING FILTER LOGIC (GOOGLE-STYLE) ───
  // A helper to test if a school passes filters, with an optional exclusion dimension
  const passesFilterExcluding = useCallback(
    (s: SchoolRecord & { distance?: number }, excludeDimension?: string): boolean => {
      // 1. Distance Radius
      if (excludeDimension !== 'radius') {
        if ((s.distance || 0) > radiusKm) return false;
      }

      // 2. Management (Quick + Filter Panel)
      if (excludeDimension !== 'management') {
        if (quickManagementFilter !== 'all') {
          if ((s.management_desc_state || s.management) !== quickManagementFilter) return false;
        }
        if (selectedManagements.length > 0) {
          if (!selectedManagements.includes(s.management_desc_state || s.management || '')) return false;
        }
      }

      // 3. Residential (Quick + Filter Panel)
      if (excludeDimension !== 'residential') {
        if (quickResidentialFilter !== 'all') {
          const isRes =
            s.residential_school?.toLowerCase().includes('1-completely') ||
            (s.residential_school?.toLowerCase().includes('residential') && !s.residential_school?.toLowerCase().includes('non')) ||
            s.residential_school?.toLowerCase().includes('boarding');
          if (quickResidentialFilter === 'res' && !isRes) return false;
          if (quickResidentialFilter === 'non_res' && isRes) return false;
        }
        if (residentialType !== 'all') {
          if (residentialType === 'res') {
            const isRes =
              s.residential_school?.toLowerCase().includes('1-completely') ||
              (s.residential_school?.toLowerCase().includes('residential') && !s.residential_school?.toLowerCase().includes('non'));
            if (!isRes) return false;
          } else if (residentialType === 'non_res') {
            const isNonRes =
              !s.residential_school ||
              s.residential_school.toLowerCase().includes('non') ||
              s.residential_school.toLowerCase().includes('day');
            if (!isNonRes) return false;
          }
        }
      }

      // 4. Class / Grade
      if (excludeDimension !== 'class' && selectedClass !== 'all') {
        if (!schoolHasClass(s, selectedClass)) return false;
      }

      // 5. Annual Fee Budget
      if (excludeDimension !== 'fee' && maxAnnualFee !== null) {
        if ((s.annual_fee ?? 0) > maxAnnualFee) return false;
      }

      // 6. Student Strength
      if (excludeDimension !== 'students') {
        if (minStudents > 0 && (s.total_students || 0) < minStudents) return false;
        if (maxStudents !== null && (s.total_students || 0) > maxStudents) return false;
      }

      // 6b. Teacher Strength
      if (excludeDimension !== 'teachers') {
        if (minTeachers > 0 && (s.total_teachers || 0) < minTeachers) return false;
        if (maxTeachers !== null && (s.total_teachers || 0) > maxTeachers) return false;
      }

      // 7. Board Affiliation
      if (excludeDimension !== 'board' && selectedBoards.length > 0) {
        const matchesAnyBoard = selectedBoards.some((b) => schoolHasBoard(s, b));
        if (!matchesAnyBoard) return false;
      }

      // 8. Gender
      if (excludeDimension !== 'gender' && selectedGenders.length > 0) {
        if (!selectedGenders.includes(s.school_type || s.gender || '')) return false;
      }

      // 9. Medium
      if (excludeDimension !== 'medium' && selectedMediums.length > 0) {
        if (!selectedMediums.includes(s.medium_of_instruction_1 || s.medium || '')) return false;
      }

      // 10. Student-Teacher Ratio (STR)
      if (excludeDimension !== 'str' && maxStr !== null) {
        const ratioNum = parseInt(s.student_teacher_ratio) || 15;
        if (ratioNum > maxStr) return false;
      }

      // 11. Facilities
      if (excludeDimension !== 'facilities' && selectedFacilities.length > 0) {
        const matchesAllFacilities = selectedFacilities.every((fac) => schoolHasFacility(s, fac));
        if (!matchesAllFacilities) return false;
      }

      // 12. PM-SHRI
      if (excludeDimension !== 'pm_shri' && onlyPmShri) {
        if (!s.pm_shri) return false;
      }

      // 13. Admissions Open
      if (excludeDimension !== 'admissions' && onlyAdmissionsOpen) {
        if (s.status !== 'Admissions Open') return false;
      }

      return true;
    },
    [
      radiusKm,
      quickManagementFilter,
      selectedManagements,
      quickResidentialFilter,
      residentialType,
      selectedClass,
      maxAnnualFee,
      minStudents,
      maxStudents,
      minTeachers,
      maxTeachers,
      selectedBoards,
      selectedGenders,
      selectedMediums,
      maxStr,
      selectedFacilities,
      onlyPmShri,
      onlyAdmissionsOpen,
    ]
  );

  // Compute schools with distance calculated strictly from searchCenter
  const schoolsWithDistance = useMemo(() => {
    const dataSource = liveSchools;
    return dataSource.map((school) => {
      const dist = calculateDistanceKm(searchCenter.lat, searchCenter.lng, school.lat, school.lng);
      return {
        ...school,
        distance: dist,
      };
    });
  }, [searchCenter, liveSchools]);

  // Dynamic Cascading Option Counts for Google-style intelligent filtering
  const dynamicCounts = useMemo(() => {
    // 1. Board Counts
    const boardSub = schoolsWithDistance.filter((s) => passesFilterExcluding(s, 'board'));
    const boardCounts: Record<string, number> = {};
    ['CBSE', 'ICSE', 'HBSE', 'State Board', 'IB Partner'].forEach((b) => {
      boardCounts[b] = boardSub.filter((s) => schoolHasBoard(s, b)).length;
    });

    // 2. Facilities Counts
    const facSub = schoolsWithDistance.filter((s) => passesFilterExcluding(s, 'facilities'));
    const facilityCounts: Record<string, number> = {};
    ['Library', 'Smart Classrooms', 'Atal Tinkering Lab', 'Computer Lab', 'Science', 'Sports'].forEach((fac) => {
      facilityCounts[fac] = facSub.filter((s) => schoolHasFacility(s, fac)).length;
    });

    // 3. Management Counts
    const mgmtSub = schoolsWithDistance.filter((s) => passesFilterExcluding(s, 'management'));
    const mgmtCounts: Record<string, number> = {
      Government: mgmtSub.filter((s) => (s.management_desc_state || s.management) === 'Government').length,
      Private: mgmtSub.filter((s) => (s.management_desc_state || s.management) === 'Private').length,
    };

    // 4. Gender Counts
    const genderSub = schoolsWithDistance.filter((s) => passesFilterExcluding(s, 'gender'));
    const genderCounts: Record<string, number> = {
      'Co-ed': genderSub.filter((s) => (s.school_type || s.gender) === 'Co-ed').length,
      Boys: genderSub.filter((s) => (s.school_type || s.gender) === 'Boys').length,
      Girls: genderSub.filter((s) => (s.school_type || s.gender) === 'Girls').length,
    };

    // 5. Medium Counts
    const mediumSub = schoolsWithDistance.filter((s) => passesFilterExcluding(s, 'medium'));
    const mediumCounts: Record<string, number> = {
      English: mediumSub.filter((s) => (s.medium_of_instruction_1 || s.medium) === 'English').length,
      Hindi: mediumSub.filter((s) => (s.medium_of_instruction_1 || s.medium) === 'Hindi').length,
    };

    // 6. PM-SHRI Count
    const pmSub = schoolsWithDistance.filter((s) => passesFilterExcluding(s, 'pm_shri'));
    const pmShriCount = pmSub.filter((s) => s.pm_shri).length;

    // 7. Residential Counts
    const resSub = schoolsWithDistance.filter((s) => passesFilterExcluding(s, 'residential'));
    const resCounts: Record<string, number> = {
      all: resSub.length,
      non_res: resSub.filter((s) => !s.residential_school || s.residential_school.toLowerCase().includes('non') || s.residential_school.toLowerCase().includes('day')).length,
      res: resSub.filter((s) => s.residential_school?.toLowerCase().includes('1-completely') || (s.residential_school?.toLowerCase().includes('residential') && !s.residential_school?.toLowerCase().includes('non'))).length,
    };

    return {
      boardCounts,
      facilityCounts,
      mgmtCounts,
      genderCounts,
      mediumCounts,
      pmShriCount,
      resCounts,
    };
  }, [schoolsWithDistance, passesFilterExcluding]);

  // Filtered and Sorted Schools (Stable Numbering & Order when a card is selected)
  const filteredSchools = useMemo(() => {
    let result = schoolsWithDistance.filter((s) => passesFilterExcluding(s));

    if (localFilterQuery.trim()) {
      const q = localFilterQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          (s.school_name || s.name || '').toLowerCase().includes(q) ||
          (s.village_ward || '').toLowerCase().includes(q) ||
          (s.district_name || '').toLowerCase().includes(q) ||
          (s.udise_code || '').toLowerCase().includes(q) ||
          (s.management_desc_state || s.management || '').toLowerCase().includes(q)
      );
    }

    // Stable Sort Order (Sorting strictly by searchCenter origin or criteria)
    if (sortBy === 'distance') {
      result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.school_name || a.name || '').localeCompare(b.school_name || b.name || ''));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'ratio') {
      result.sort((a, b) => {
        const rA = parseInt(a.student_teacher_ratio) || 15;
        const rB = parseInt(b.student_teacher_ratio) || 15;
        return rA - rB;
      });
    } else if (sortBy === 'fees') {
      result.sort((a, b) => (a.annual_fee ?? 0) - (b.annual_fee ?? 0));
    } else if (sortBy === 'students') {
      result.sort((a, b) => (b.total_students || 0) - (a.total_students || 0));
    } else if (sortBy === 'teachers') {
      result.sort((a, b) => (b.total_teachers || 0) - (a.total_teachers || 0));
    }

    return result;
  }, [schoolsWithDistance, passesFilterExcluding, localFilterQuery, sortBy]);

  // Export visible/filtered schools as a CSV file
  const handleExportCSV = useCallback(() => {
    const dataToExport = filteredSchools.length > 0 ? filteredSchools : liveSchools;
    if (dataToExport.length === 0) return;

    const headers = [
      'UDISE Code',
      'School Name',
      'State',
      'District',
      'Block',
      'Village / Ward',
      'Pincode',
      'School Category',
      'Management Type',
      'Board (10th)',
      'Board (12th)',
      'Medium',
      'Gender',
      'Total Students',
      'Total Teachers',
      'Student-Teacher Ratio',
      'ATL Tinkering Lab',
      'Computer / ICT Lab',
      'Science Lab',
      'Playground',
      'Annual Fee (INR)',
      'Status',
      'Distance (km)',
      'Latitude',
      'Longitude',
      'Profile URL'
    ];

    const rows = dataToExport.map((s) => {
      const canonicalUrl = `https://schoolsearch.cseel.org/school/${encodeURIComponent(s.state_name || 'Haryana')}/${encodeURIComponent(s.district_name || 'District')}/${encodeURIComponent(s.village_ward || 'Ward')}/${encodeURIComponent((s.school_name || 'school').replace(/\s+/g, '-'))}.html`;
      return [
        `"${s.udise_code || ''}"`,
        `"${(s.school_name || s.name || '').replace(/"/g, '""')}"`,
        `"${(s.state_name || '').replace(/"/g, '""')}"`,
        `"${(s.district_name || '').replace(/"/g, '""')}"`,
        `"${(s.block_name || '').replace(/"/g, '""')}"`,
        `"${(s.village_ward || '').replace(/"/g, '""')}"`,
        `"${s.pincode || ''}"`,
        `"${(s.school_category || '').replace(/"/g, '""')}"`,
        `"${(s.management_desc_state || s.management || '').replace(/"/g, '""')}"`,
        `"${(s.board_secondary_10th || s.board || '').replace(/"/g, '""')}"`,
        `"${(s.board_higher_secondary_12th || s.board || '').replace(/"/g, '""')}"`,
        `"${(s.medium_of_instruction_1 || s.medium || '').replace(/"/g, '""')}"`,
        `"${(s.school_type || s.gender || '').replace(/"/g, '""')}"`,
        s.total_students || 0,
        s.total_teachers || 0,
        `"${s.student_teacher_ratio || ''}"`,
        `"${s.tinkering_lab_atl === 'Yes' || s.tinkering_lab_atl === true ? 'Yes' : 'No'}"`,
        `"${s.ict_lab === 'Yes' || s.ict_lab === true ? 'Yes' : 'No'}"`,
        `"${s.integrated_science_lab === 'Yes' || s.integrated_science_lab === true ? 'Yes' : 'No'}"`,
        `"${s.playground === 'Yes' || s.playground === true ? 'Yes' : 'No'}"`,
        s.annual_fee ?? 0,
        `"${s.status || 'Verified'}"`,
        s.distance !== undefined ? s.distance : '',
        s.latitude || s.lat || '',
        s.longitude || s.lng || '',
        `"${canonicalUrl}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedQuery = (searchLocation || 'schools').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.setAttribute('href', url);
    link.setAttribute('download', `CSEEL_Schools_${sanitizedQuery}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredSchools, liveSchools, searchLocation]);

  // Handler for clicking a card: sets selectedSchool and smoothly pans map WITHOUT changing distance reference origin or user zoom
  const handleSelectCard = useCallback((school: SchoolRecord) => {
    setSelectedSchool(school);
    setMapFocus({
      lat: school.lat,
      lng: school.lng,
      timestamp: Date.now(),
    });
  }, []);

  // Handler when map marker is clicked: highlights school and smoothly scrolls card in drawer without altering zoom
  const handleMapMarkerSelect = useCallback((school: SchoolRecord) => {
    setSelectedSchool(school);
    setMapFocus({
      lat: school.lat,
      lng: school.lng,
      timestamp: Date.now(),
    });
    const cardEl = document.getElementById(`school-card-${school.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  const handleSelectMapSchool = useCallback((s: any) => {
    if (s.address || s.facilities) {
      handleMapMarkerSelect(s);
    } else {
      const fullRec = liveSchools.find((ls) => ls.id === s.id);
      if (fullRec) setSelectedSchool(fullRec);
    }
  }, [liveSchools, handleMapMarkerSelect]);

  const handleOpenSchoolDetails = useCallback((s: SchoolRecord) => {
    setModalSchool(s);
  }, []);

  const handleDeselectSchool = useCallback(() => {
    setSelectedSchool(null);
  }, []);

  const toggleCheckbox = (list: string[], setList: (val: string[]) => void, item: string) => {
    setIsProcessing(true);
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
    setTimeout(() => setIsProcessing(false), 150);
  };

  const activeFiltersCount =
    selectedBoards.length +
    selectedTypes.length +
    selectedManagements.length +
    selectedGenders.length +
    selectedMediums.length +
    selectedFacilities.length +
    (selectedClass !== 'all' ? 1 : 0) +
    (maxAnnualFee !== null ? 1 : 0) +
    (residentialType !== 'all' ? 1 : 0) +
    (minStudents > 0 || maxStudents !== null ? 1 : 0) +
    (minTeachers > 0 || maxTeachers !== null ? 1 : 0) +
    (maxStr !== null ? 1 : 0) +
    (onlyPmShri ? 1 : 0) +
    (onlyAdmissionsOpen ? 1 : 0) +
    (quickManagementFilter !== 'all' ? 1 : 0) +
    (quickResidentialFilter !== 'all' ? 1 : 0);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f8f9fa] text-[#202124] flex flex-col font-sans select-none antialiased">
      {/* ── Google-Style Top Linear Loading Progress Bar ── */}
      {isProcessing && (
        <div className="absolute top-0 left-0 right-0 h-[2.5px] z-50 overflow-hidden bg-blue-100">
          <div className="h-full bg-[#1a73e8] w-1/3 animate-[progress_1s_ease-in-out_infinite]" />
        </div>
      )}

      {/* ─── 2. MAIN FULL-WINDOW WORKSPACE (Google Maps Full-Screen Layout) ─── */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Full Viewport Leaflet Map with Canvas Density Dots */}
        <div className="absolute inset-0 w-full h-full z-0">
          <SchoolFinderMap
            searchCenter={searchCenter}
            mapFocus={mapFocus}
            radiusKm={radiusKm}
            schools={filteredSchools}
            mapPoints={mapPoints}
            selectedSchool={selectedSchool}
            viewMode={mapViewMode}
            onViewModeChange={setMapViewMode}
            onSelectSchool={handleSelectMapSchool}
            onLocationChange={handleLocationPinChange}
            onLocateMe={handleLocateMe}
            isLocating={isLocating}
            onOpenDetails={handleOpenSchoolDetails}
            onDeselectSchool={handleDeselectSchool}
          />
        </div>

        {/* ─── MERGED TOP FLOATING BAR (Filter + Search Bar + Schools Near Me + Menu) ─── */}
        <div className="absolute top-3 sm:top-4 left-2.5 right-2.5 sm:left-4 sm:right-4 z-30 flex items-center justify-between gap-2 pointer-events-none">
          {/* Left: Filters Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
            <button
              type="button"
              onClick={() => setFilterPanelOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/95 hover:bg-white text-slate-700 active:bg-slate-100 backdrop-blur-md flex items-center justify-center shadow-[0_2px_8px_rgba(60,64,67,0.22)] border border-[#dadce0] transition-all active:scale-95 relative"
              title="Open Search Filters"
              aria-label="Filters"
            >
              <SlidersHorizontal size={16} className="text-[#1a73e8]" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1a73e8] text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Center: Main Geocoding / Location Search Bar with Google Maps Style Autocomplete */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md sm:max-w-xl pointer-events-auto">
            <div className="flex items-center bg-white/95 hover:bg-white border border-[#dadce0] rounded-full px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-[0_2px_8px_rgba(60,64,67,0.22)] backdrop-blur-md focus-within:ring-2 focus-within:ring-[#1a73e8]/30 transition-all">
              {isProcessing || isFetchingSuggestions ? (
                <Loader2 size={15} className="text-[#1a73e8] animate-spin shrink-0 mr-2" />
              ) : (
                <Search size={15} className="text-slate-500 shrink-0 mr-2" />
              )}
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => {
                  setSearchLocation(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search schools, village, area, PIN..."
                className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchLocation ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 hover:text-slate-900 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] active:scale-95 text-white flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer"
                  title="Search location, address or PIN"
                  aria-label="Search"
                >
                  {isProcessing ? (
                    <Loader2 size={13} className="animate-spin text-white" />
                  ) : (
                    <Search size={13} className="text-white" />
                  )}
                </button>
              )}
            </div>

            {/* Google Maps-Style Intelligent Autocomplete Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden py-1 max-h-80 overflow-y-auto">
                <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                  <span>{suggestions.length > 0 ? 'Search Suggestions' : 'Popular Search Locations'}</span>
                  <button type="button" onClick={() => setShowSuggestions(false)} className="text-slate-400 hover:text-slate-600"><X size={12} /></button>
                </div>

                {/* Instant GPS Detection Action */}
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);
                    handleLocateMe();
                  }}
                  className="w-full text-left px-3.5 py-2.5 bg-blue-50/60 hover:bg-blue-100/70 border-b border-blue-100 flex items-center gap-2.5 text-[#1a73e8] font-bold text-xs transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#1a73e8] text-white flex items-center justify-center shrink-0">
                    <Crosshair size={13} className={isLocating ? 'animate-spin' : ''} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="leading-tight">{isLocating ? 'Detecting Live GPS Position...' : 'Use My Current Location (Live GPS)'}</p>
                    <p className="text-[10px] text-blue-600/70 font-normal">Automatically center map & discover 2km nearby schools</p>
                  </div>
                </button>

                {/* If live suggestions found */}
                {suggestions.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {suggestions.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => handleSelectSuggestion(s)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50/70 flex items-start gap-2.5 transition-colors group"
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          s.type === 'school' ? 'bg-blue-100 text-[#1a73e8]' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {s.type === 'school' ? <SchoolIcon size={13} /> : <MapPin size={13} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-[#1a73e8] transition-colors line-clamp-1 leading-snug">
                            {s.title}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {s.subtitle}
                          </p>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-600 shrink-0">
                          {s.type === 'school' ? 'School' : 'Place'}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : searchLocation.trim().length >= 2 ? (
                  <div className="p-3 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">Press Enter or Search to query &ldquo;{searchLocation}&rdquo;</p>
                    <p className="text-[10px] text-slate-400 mt-1">Multi-stage fallback geocoder will find the exact area & schools</p>
                  </div>
                ) : (
                  <div>
                    {POPULAR_CITIES.map((city) => (
                      <button
                        type="button"
                        key={city.name}
                        onClick={() => handleSelectCity(city)}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-800 hover:bg-blue-50 hover:text-[#1a73e8] flex items-center justify-between transition-colors bg-white"
                      >
                        <span className="flex items-center gap-2">
                          <MapPin size={13} className="text-blue-600 shrink-0" />
                          <span className="font-semibold text-slate-800">{city.name}, {city.state}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-medium">{city.defaultRadius}km</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Right: Schools Near Me & 3-Line Menu Icon */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/95 hover:bg-white text-[#1a73e8] backdrop-blur-md shadow-[0_2px_8px_rgba(60,64,67,0.2)] border border-[#dadce0] text-[11px] font-bold transition-all active:scale-95"
              title="Find schools near my current GPS location"
            >
              {isLocating ? (
                <Loader2 size={13} className="animate-spin text-[#1a73e8]" />
              ) : (
                <Navigation size={13} className="text-[#1a73e8] fill-[#1a73e8]" />
              )}
              <span>Schools Near Me</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLeftMenuOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/95 hover:bg-white text-slate-700 active:bg-slate-100 flex items-center justify-center shadow-[0_2px_8px_rgba(60,64,67,0.22)] border border-[#dadce0] backdrop-blur-md transition-all active:scale-95"
              title="Open Navigation Menu"
              aria-label="Menu"
            >
              <Menu size={18} className="text-slate-700" />
            </button>
          </div>
        </div>

        {/* ─── RIGHT SLIDE-OUT DRAWER (School Profile Card, Theme Selection, Navigation) ─── */}
        <div
          className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ${
            isLeftMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsLeftMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`fixed top-0 bottom-0 right-0 w-[310px] sm:w-[350px] max-w-[85vw] bg-white text-slate-900 shadow-2xl flex flex-col transition-transform duration-300 ease-out z-50 ${
              isLeftMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Drawer Header with School Profile Card & Circular Photo */}
            <div className="p-4 border-b border-slate-100 bg-gradient-to-l from-blue-50/80 to-white flex items-center justify-between">
              <Link
                href="/school-profile"
                onClick={() => setIsLeftMenuOpen(false)}
                className="flex items-center gap-3 group max-w-[80%]"
                title="Open School Profile"
              >
                {/* Circular School Photo Icon */}
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#1a73e8]/40 shadow-xs bg-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={currentSchoolProfile.photoUrl}
                    alt={currentSchoolProfile.schoolName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#1a73e8] transition-colors leading-tight line-clamp-1">
                    {currentSchoolProfile.schoolName}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <span>Manage School Profile</span>
                    <ExternalLink size={10} className="text-[#1a73e8]" />
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setIsLeftMenuOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                title="Close Menu"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Body Links & Settings */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Navigation Menu */}
              <div>
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Navigation & School Portal
                </p>
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setIsLeftMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#1a73e8] text-xs font-semibold transition-colors"
                  >
                    <Home size={16} className="text-[#1a73e8]" />
                    <span>Home Page</span>
                  </Link>

                  <Link
                    href="/school-profile"
                    onClick={() => setIsLeftMenuOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 text-slate-800 hover:text-[#1a73e8] text-xs font-bold border border-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-[#1a73e8]" />
                      <span>School Profile</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#1a73e8] text-white font-bold">
                      Google Layout
                    </span>
                  </Link>

                  <Link
                    href="/school-profile"
                    onClick={() => setIsLeftMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#1a73e8] text-xs font-semibold transition-colors"
                  >
                    <PlusCircle size={16} className="text-[#1a73e8]" />
                    <span>Add your School</span>
                  </Link>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="pt-2 border-t border-slate-100">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-500" />
                  <span>Theme Selection</span>
                </p>
                <div className="grid grid-cols-3 gap-1.5 px-1">
                  <button
                    type="button"
                    onClick={() => setSelectedTheme('light')}
                    className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold transition-all border ${
                      selectedTheme === 'light'
                        ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Sun size={15} />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTheme('dark')}
                    className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold transition-all border ${
                      selectedTheme === 'dark'
                        ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Moon size={15} />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTheme('system')}
                    className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold transition-all border ${
                      selectedTheme === 'system'
                        ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Laptop size={15} />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Search Radius Preference Settings */}
              <div className="pt-2 border-t border-slate-100">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Settings size={12} className="text-slate-500" />
                  <span>Search Radius Settings</span>
                </p>
                <div className="grid grid-cols-6 gap-1 px-1">
                  {[2, 5, 10, 20, 50, 100].map((km) => (
                    <button
                      type="button"
                      key={km}
                      onClick={() => {
                        setRadiusKm(km);
                        loadNearbySchools(searchCenter.lat, searchCenter.lng, km, searchLocation);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                        radiusKm === km
                          ? 'bg-blue-50 text-[#1a73e8] border-[#1a73e8] font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {km}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Section (Clean Sign In text link) */}
              <div className="pt-2 border-t border-slate-100">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Account
                </p>
                <Link
                  href="/auth/signin"
                  onClick={() => setIsLeftMenuOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-[#1a73e8] border border-slate-200 text-xs font-bold transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <User size={15} className="text-[#1a73e8]" />
                    <span>Sign in</span>
                  </span>
                  <ArrowRight size={13} className="text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 text-center">
              <p className="text-[10px] text-slate-500 font-medium">
                CSEEL v2.4 • Official UDISE+ Synchronized
              </p>
            </div>
          </div>
        </div>

        {/* ─── FLOATING "SCHOOLS NEAR ME" BUTTON (Bottom Left on Mobile) ─── */}
        <div className="absolute bottom-52 left-3 z-20 sm:hidden">
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 bg-white/95 hover:bg-white text-[#1a73e8] backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_4px_16px_rgba(60,64,67,0.25)] border border-[#dadce0] text-[11px] font-bold transition-all active:scale-95"
            title="Find schools near my GPS location"
          >
            {isLocating ? (
              <Loader2 size={13} className="animate-spin text-[#1a73e8]" />
            ) : (
              <Navigation size={13} className="text-[#1a73e8] fill-[#1a73e8]" />
            )}
            <span>Schools Near Me</span>
          </button>
        </div>

        {/* ─── SLIDE-OUT FILTER DRAWER / SIDE-SHEET (Mockup Style with Rounded Corners & Frosted Glass) ─── */}
        <div
          className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ${
            filterPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setFilterPanelOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-0 bottom-0 left-0 w-[360px] sm:w-[440px] max-w-[92vw] bg-white/95 backdrop-blur-xl shadow-2xl border-r border-slate-200 rounded-r-3xl flex flex-col transition-transform duration-300 ease-out text-xs ${
              filterPanelOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Filter Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 rounded-tr-3xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1a73e8] flex items-center justify-center font-bold">
                  <SlidersHorizontal size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Filters & Controls</h3>
                  <p className="text-[11px] text-slate-500">{totalDatabaseSchools.toLocaleString('en-IN')} schools available</p>
                </div>
              </div>
              <button
                onClick={() => setFilterPanelOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
                aria-label="Close filters"
              >
                <X size={15} />
              </button>
            </div>

            {/* Filter Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 1. Distance Radius Slider & Presets */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                    <Compass size={14} className="text-[#1a73e8]" />
                    <span>Search Radius:</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1a73e8] font-black text-xs font-mono">
                    {radiusKm} km
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1 mb-2">
                  {[2, 5, 10, 20, 50, 100].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRadiusKm(r)}
                      className={`py-1.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        radiusKm === r
                          ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {r}k
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
                />
              </div>

              {/* 2. Management Type (Always Full Text) */}
              <div>
                <span className="font-bold text-slate-700 text-xs block mb-1.5">Management Type:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'all', label: 'All Schools' },
                    { id: 'Private', label: `Private (${dynamicCounts.mgmtCounts.Private || 0})` },
                    { id: 'Government', label: `Government (${dynamicCounts.mgmtCounts.Government || 0})` },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setQuickManagementFilter(m.id)}
                      className={`py-2 px-2 rounded-xl border text-center text-xs font-bold transition-all whitespace-normal break-words leading-tight ${
                        quickManagementFilter === m.id
                          ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Class/Grade & Annual Fee Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-slate-700 text-xs block mb-1">Target Class:</span>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                  >
                    <option value="all">All Classes (Pre-Nur to 12th)</option>
                    <option value="nursery">Pre-Primary / Nursery</option>
                    <option value="1">Class 1st</option>
                    <option value="5">Class 5th</option>
                    <option value="8">Class 8th</option>
                    <option value="10">Class 10th (Secondary)</option>
                    <option value="12">Class 12th (Sr Secondary)</option>
                  </select>
                </div>

                <div>
                  <span className="font-bold text-slate-700 text-xs block mb-1">Max Annual Fee:</span>
                  <select
                    value={maxAnnualFee === null ? 'any' : maxAnnualFee.toString()}
                    onChange={(e) => setMaxAnnualFee(e.target.value === 'any' ? null : Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                  >
                    <option value="any">Any Budget</option>
                    <option value="0">Free / Government (₹0)</option>
                    <option value="25000">Under ₹25,000 / year</option>
                    <option value="45000">Under ₹45,000 / year</option>
                    <option value="75000">Under ₹75,000 / year</option>
                    <option value="150000">Under ₹1.5 Lakh / year</option>
                  </select>
                </div>
              </div>

              {/* 4. Student Strength Range Slider */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                    <Users size={14} className="text-[#1a73e8]" />
                    <span>Student Strength:</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1a73e8] font-bold text-xs font-mono">
                    {minStudents === 0 && maxStudents === null
                      ? 'Any (All Sizes)'
                      : minStudents > 0 && maxStudents !== null
                      ? `${minStudents} - ${maxStudents} Students`
                      : minStudents > 0
                      ? `${minStudents}+ Students`
                      : `Up to ${maxStudents} Students`}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {[
                    { label: 'All', min: 0, max: null },
                    { label: '< 250', min: 0, max: 250 },
                    { label: '250-500', min: 250, max: 500 },
                    { label: '500-1k', min: 500, max: 1000 },
                    { label: '1k+', min: 1000, max: null },
                  ].map((item) => {
                    const isSelected = minStudents === item.min && maxStudents === item.max;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setMinStudents(item.min);
                          setMaxStudents(item.max);
                        }}
                        className={`py-1 rounded-lg border text-center text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="range"
                  min={0}
                  max={3000}
                  step={50}
                  value={maxStudents ?? 3000}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMaxStudents(val >= 3000 ? null : val);
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0</span>
                  <span>500</span>
                  <span>1,500</span>
                  <span>3,000+ (Any)</span>
                </div>
              </div>

              {/* 5. Teacher Strength Range Slider */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-[#1a73e8]" />
                    <span>Faculty / Teacher Count:</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1a73e8] font-bold text-xs font-mono">
                    {minTeachers === 0 && maxTeachers === null
                      ? 'Any (All Faculty)'
                      : minTeachers > 0 && maxTeachers !== null
                      ? `${minTeachers} - ${maxTeachers} Teachers`
                      : minTeachers > 0
                      ? `${minTeachers}+ Teachers`
                      : `Up to ${maxTeachers} Teachers`}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {[
                    { label: 'All', min: 0, max: null },
                    { label: '10+', min: 10, max: null },
                    { label: '25+', min: 25, max: null },
                    { label: '50+', min: 50, max: null },
                    { label: '100+', min: 100, max: null },
                  ].map((item) => {
                    const isSelected = minTeachers === item.min && maxTeachers === item.max;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setMinTeachers(item.min);
                          setMaxTeachers(item.max);
                        }}
                        className={`py-1 rounded-lg border text-center text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={minTeachers}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMinTeachers(val);
                    setMaxTeachers(null);
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0 (Any)</span>
                  <span>25+</span>
                  <span>50+</span>
                  <span>100+ Teachers</span>
                </div>
              </div>

              {/* 6. Facilities Checklist */}
              <div>
                <span className="font-bold text-slate-700 text-xs block mb-1.5">Campus Facilities:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'Library', label: 'Library', icon: BookOpen },
                    { id: 'Smart Classrooms', label: 'Smart Classrooms', icon: Monitor },
                    { id: 'Atal Tinkering Lab', label: 'ATL Tinkering Lab', icon: Beaker },
                    { id: 'Computer Lab', label: 'Computer / ICT Lab', icon: Laptop },
                    { id: 'Science', label: 'Science Labs', icon: Microscope },
                    { id: 'Sports', label: 'Sports Playground', icon: Flame },
                  ].map((f) => {
                    const count = dynamicCounts.facilityCounts[f.id] ?? 0;
                    const IconComp = f.icon;
                    const isChecked = selectedFacilities.includes(f.id);
                    return (
                      <label
                        key={f.id}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                          isChecked
                            ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] font-bold shadow-2xs'
                            : count === 0
                            ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheckbox(selectedFacilities, setSelectedFacilities, f.id)}
                          className="w-4 h-4 rounded text-[#1a73e8] focus:ring-[#1a73e8] accent-[#1a73e8] shrink-0"
                        />
                        <IconComp size={14} className={isChecked ? 'text-[#1a73e8] shrink-0' : 'text-slate-500 shrink-0'} />
                        <span className="flex-1 font-medium leading-snug whitespace-normal break-words">{f.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 7. Board Affiliation */}
              <div>
                <span className="font-bold text-slate-700 text-xs block mb-1.5">Board Affiliation:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['CBSE', 'ICSE', 'HBSE', 'State Board', 'IB Partner'].map((b) => {
                    const count = dynamicCounts.boardCounts[b] ?? 0;
                    const isChecked = selectedBoards.includes(b);
                    return (
                      <label
                        key={b}
                        className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer text-xs transition-all ${
                          isChecked
                            ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] font-bold'
                            : count === 0
                            ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheckbox(selectedBoards, setSelectedBoards, b)}
                          className="w-4 h-4 rounded text-[#1a73e8] accent-[#1a73e8] shrink-0"
                        />
                        <span className="flex-1 font-medium leading-snug whitespace-normal break-words">{b}</span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 8. Special Flag Filters (PM SHRI & Admissions Open) */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  onlyPmShri ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}>
                  <span className="flex items-center gap-2 leading-snug whitespace-normal break-words">
                    <Sparkles size={14} className="text-amber-500 shrink-0" />
                    <span>PM SHRI Schools Only (Govt Scheme)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={onlyPmShri}
                    onChange={(e) => setOnlyPmShri(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1a73e8] accent-[#1a73e8] shrink-0 ml-2"
                  />
                </label>

                <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  onlyAdmissionsOpen ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}>
                  <span className="flex items-center gap-2 leading-snug whitespace-normal break-words">
                    <Award size={14} className="text-emerald-600 shrink-0" />
                    <span>Admissions Open (2026-27 Academic Year)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={onlyAdmissionsOpen}
                    onChange={(e) => setOnlyAdmissionsOpen(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1a73e8] accent-[#1a73e8] shrink-0 ml-2"
                  />
                </label>
              </div>
            </div>

            {/* Filter Drawer Footer Buttons */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/80 rounded-br-3xl flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors text-center"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterPanelOpen(false);
                  loadNearbySchools(searchCenter.lat, searchCenter.lng, radiusKm, searchLocation);
                }}
                className="flex-2 py-2.5 px-4 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold transition-all shadow-md text-center"
              >
                Apply Filters ({filteredSchools.length})
              </button>
            </div>
          </div>
        </div>

        {/* ─── 3. RESPONSIVE BOTTOM SHEET / DESKTOP SIDEBAR (Frosted Card with Grab Handle) ─── */}
        <aside
          ref={sheetAsideRef}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            height:
              sheetDragHeight !== null
                ? `${sheetDragHeight}px`
                : undefined,
            transition: isDraggingSheet ? 'none' : 'height 320ms cubic-bezier(0.2, 0.9, 0.3, 1)',
          }}
          className={`absolute left-0 right-0 bottom-0 sm:left-4 sm:top-20 sm:bottom-4 sm:right-auto sm:w-[420px] z-30 bg-white/95 sm:bg-white/90 backdrop-blur-xl rounded-t-3xl sm:rounded-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.18)] sm:shadow-[0_4px_20px_rgba(60,64,67,0.2)] border-t sm:border border-slate-200 flex flex-col overflow-hidden ${
            sheetDragHeight === null
              ? mobileSheetState === 'peek'
                ? 'h-[160px] sm:h-auto sm:max-h-[calc(100vh-100px)]'
                : mobileSheetState === 'half'
                ? 'h-[52vh] sm:h-auto sm:max-h-[calc(100vh-100px)]'
                : 'h-[94vh] sm:h-auto sm:max-h-[calc(100vh-100px)]'
              : ''
          }`}
        >
          {/* Visible Grab Handle on Mobile (Interactive Touch-Drag & Tap-to-Slide Gestures) */}
          <div
            onMouseDown={handleHandleMouseDown}
            onTouchStart={handleHandleTouchStart}
            className="w-full pt-3 pb-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing sm:hidden select-none active:opacity-75 touch-none shrink-0"
          >
            <div className="w-12 h-1.5 bg-slate-300 rounded-full transition-colors group-hover:bg-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1 pointer-events-none">
              {mobileSheetState === 'full'
                ? 'Swipe Down to Minimize'
                : mobileSheetState === 'half'
                ? 'Swipe Up for Full List'
                : 'Swipe Up for Results'}
              <ChevronUp
                size={11}
                className={`transition-transform duration-300 ${mobileSheetState === 'full' ? 'rotate-180' : ''}`}
              />
            </span>
          </div>

          {/* ─── UNIFIED FULL-PAGE SCROLLABLE BODY (Scrolls All Header Controls, Mode, Search, Filters, Sort & Cards) ─── */}
          <div className="overflow-y-auto flex-1 p-3 space-y-2.5">
            
            {/* Top Toolbar / Mode Switcher & Count Header */}
            <div className="flex items-center justify-between bg-slate-50/90 p-2 rounded-2xl border border-slate-200/80 gap-2">
              {/* Left: Results Count & CSV Export */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="truncate">
                  <span className="font-bold text-xs text-slate-900">{filteredSchools.length}</span>
                  <span className="text-[11px] text-slate-500"> of </span>
                  <span className="font-bold text-xs text-[#1a73e8]">{totalDatabaseSchools.toLocaleString('en-IN')}</span>
                  <span className="text-[11px] text-slate-500"> in {radiusKm}km</span>
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={filteredSchools.length === 0}
                  className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 border border-emerald-300 font-bold transition-all flex items-center justify-center shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
                  title="Download CSV"
                  aria-label="Download CSV"
                >
                  <Download size={13} className="text-emerald-700" />
                </button>
              </div>

              {/* Right: Auto | Dots | Pins Mode Switcher */}
              <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs shrink-0">
                <button
                  type="button"
                  onClick={() => setMapViewMode('auto')}
                  className={`px-2 py-0.5 rounded-md font-medium text-[10px] transition-all ${
                    mapViewMode === 'auto'
                      ? 'bg-[#1a73e8] text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Auto Mode: Dots when zoomed out, detailed Pins when zoomed in"
                >
                  Auto
                </button>
                <button
                  type="button"
                  onClick={() => setMapViewMode('dots')}
                  className={`px-2 py-0.5 rounded-md font-medium text-[10px] transition-all flex items-center gap-1 ${
                    mapViewMode === 'dots'
                      ? 'bg-[#ea4335] text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Density Dots Cluster Mode"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                  Dots
                </button>
                <button
                  type="button"
                  onClick={() => setMapViewMode('pins')}
                  className={`px-2 py-0.5 rounded-md font-medium text-[10px] transition-all flex items-center gap-1 ${
                    mapViewMode === 'pins'
                      ? 'bg-[#1a73e8] text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Detailed Pins Mode"
                >
                  <MapPin size={9} />
                  Pins
                </button>
              </div>
            </div>

            {/* In-Result Quick Filter Search Bar */}
            <div className="relative">
              <div className="flex items-center bg-slate-100/90 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#1a73e8]/30 transition-all">
                <Search size={13} className="text-slate-400 shrink-0 mr-1.5" />
                <input
                  type="text"
                  value={localFilterQuery}
                  onChange={(e) => setLocalFilterQuery(e.target.value)}
                  placeholder="Filter results (e.g. DPS, Govt, St. Mary...)"
                  className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                {localFilterQuery && (
                  <button
                    type="button"
                    onClick={() => setLocalFilterQuery('')}
                    className="p-0.5 text-slate-400 hover:text-slate-700"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Filter Horizontal Scroll Chips & Sort Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
                <button
                  type="button"
                  onClick={() => setFilterPanelOpen(true)}
                  className={`h-6 px-2 rounded-full font-bold shrink-0 transition-all flex items-center justify-center gap-1 border text-[11px] ${
                    activeFiltersCount > 0 ? 'bg-blue-50 text-[#1a73e8] border-[#1a73e8]' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title="Filters"
                  aria-label="Filters"
                >
                  <SlidersHorizontal size={12} />
                  {activeFiltersCount > 0 && (
                    <span className="w-3.5 h-3.5 bg-[#1a73e8] text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setQuickManagementFilter('all')}
                  className={`h-6 px-2.5 rounded-full font-bold shrink-0 transition-all border text-[11px] ${
                    quickManagementFilter === 'all'
                      ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => setQuickManagementFilter(quickManagementFilter === 'Private' ? 'all' : 'Private')}
                  className={`h-6 px-2.5 rounded-full font-bold shrink-0 transition-all border text-[11px] ${
                    quickManagementFilter === 'Private'
                      ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Private ({dynamicCounts.mgmtCounts.Private})
                </button>

                <button
                  type="button"
                  onClick={() => setQuickManagementFilter(quickManagementFilter === 'Government' ? 'all' : 'Government')}
                  className={`h-6 px-2.5 rounded-full font-bold shrink-0 transition-all border text-[11px] ${
                    quickManagementFilter === 'Government'
                      ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Govt ({dynamicCounts.mgmtCounts.Government})
                </button>
              </div>

              {/* Sort Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span>{filteredSchools.length} results matching</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e: any) => {
                      const newSort = e.target.value;
                      setSortBy(newSort);
                      if (hasUserSearched) {
                        loadNearbySchools(searchCenter.lat, searchCenter.lng, radiusKm, searchLocation, { sortBy: newSort });
                      }
                    }}
                    className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md px-1.5 py-0.5 focus:outline-none cursor-pointer"
                  >
                    <option value="distance">Distance (Nearest)</option>
                    <option value="students">Student Strength (High to Low)</option>
                    <option value="teachers">Teacher Strength (High to Low)</option>
                    <option value="fees">Fees (Low to High)</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* School Cards List with DOM virtualization */}
            <div className="space-y-2 pt-1">
              {filteredSchools.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Building size={28} className="mx-auto mb-1.5 opacity-50" />
                  <p className="text-xs font-bold text-slate-600">No schools match in {radiusKm}km.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalFilterQuery('');
                      setRadiusKm(50);
                    }}
                    className="mt-1.5 text-xs text-[#1a73e8] font-bold hover:underline block mx-auto"
                  >
                    Increase Radius to 50km
                  </button>
                </div>
              ) : (
                <>
                {filteredSchools.slice(0, displayLimit).map((school, idx) => {
                  const isSelected = selectedSchool?.id === school.id;
                  const isGovt = (school.management_desc_state || school.management) === 'Government';

                  const distFormatted =
                    school.distance !== undefined && school.distance > 0
                      ? school.distance < 1
                        ? `${Math.round(school.distance * 1000)} m`
                        : `${school.distance} km`
                      : (school.distance === 0 ? 'Exact Location' : 'In District');

                  return (
                    <div
                      key={school.id}
                      id={`school-card-${school.id}`}
                      onClick={() => handleSelectCard(school)}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'bg-blue-50/95 border-[#1a73e8] shadow-sm ring-1 ring-[#1a73e8]/30'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-[11px] font-black text-slate-400 mt-0.5 min-w-[16px]">
                          {idx + 1}.
                        </span>

                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                            isGovt ? 'bg-[#059669] text-white' : 'bg-[#1a73e8] text-white'
                          }`}
                        >
                          <SchoolIcon size={14} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1a73e8] transition-colors line-clamp-1 leading-snug">
                              {school.school_name || school.name}
                            </h4>
                            <span className="text-[10px] font-bold text-[#1a73e8] shrink-0 flex items-center gap-0.5 ml-1 font-mono bg-blue-50 px-1.5 py-0.2 rounded-md">
                              <MapPin size={10} /> {distFormatted}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {school.udise_code || school.udiseCode}
                            </span>
                            <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {school.annual_fee === 0 ? 'Free' : `₹${(school.annual_fee / 1000).toFixed(0)}k/yr`}
                            </span>
                            <span className="text-[8.5px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {school.board_secondary_10th || school.board || 'CBSE'}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-500 truncate mt-1">
                            {school.village_ward}, {school.district_name} • {school.class_from}-{school.class_to}
                          </div>

                          <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalSchool(school);
                              }}
                              className="text-[11px] font-bold text-[#1a73e8] hover:underline flex items-center gap-1"
                            >
                              <span>Profile Details</span>
                              <ExternalLink size={10} />
                            </button>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${school.lat},${school.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-0.5 ml-auto"
                            >
                              <Navigation size={10} />
                              <span>Navigate</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Progressive Show More Button (keeps DOM lightweight) */}
                {filteredSchools.length > displayLimit && (
                  <div className="pt-2 pb-4 text-center">
                    <button
                      type="button"
                      onClick={() => setDisplayLimit((prev) => prev + 50)}
                      className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl text-xs font-bold text-[#1a73e8] shadow-xs transition flex items-center justify-center gap-2"
                    >
                      <span>Show More ({displayLimit} of {filteredSchools.length} loaded)</span>
                    </button>
                  </div>
                )}
              </>
            )}
            </div>
          </div>
        </aside>

        {/* ─── 4. FULL MODAL POPUP FOR COMPREHENSIVE SCHOOL DETAILS ─── */}
        {modalSchool && (
          <SchoolDetailModal
            school={modalSchool}
            onClose={() => setModalSchool(null)}
          />
        )}
      </div>

      {/* Global CSS Animation for Loading Progress */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
