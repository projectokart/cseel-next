'use client';
import { JobsCacheStorage } from '@/lib/services/jobsCacheStorage';

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}


import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { useAuth } from '@/contexts/AuthContext';
import {
  MoreVertical,
  GraduationCap, MapPin, Search, Star, CheckCircle2, ShieldCheck,
  Filter, Sparkles, Phone, Mail, Award, Clock, X, Check,
  Send, Users, BookOpen, ExternalLink, Briefcase, Building2,
  Calendar, Layers, Map as MapIcon, LayoutGrid,
  DollarSign, AlertCircle, RefreshCw, Share2, Flame, Zap, CheckCheck,
  SlidersHorizontal, Bookmark, ChevronDown, ChevronRight, ChevronLeft,
  Columns3, Columns2, List, Maximize2, Minimize2, IndianRupee, Globe, Navigation, FileText, Bell
} from 'lucide-react';
import {
  FacultyJobItem,
  VerifiedFacultyItem,
  getActiveFacultyJobs,
  VERIFIED_FACULTY_MEMBERS,
  getJobFacilityTags,
  getJobRequirementTags,
  getMinExperience,
  isJobForLady
} from '@/data/facultyJobsData';
import { getAnnualSalaryNumber } from '@/lib/salaryUtils';
import { formatStructuredAddress, formatCleanSalary, getSourceDisplayName, getSourceBadgeColor, getGoogleMapsSearchUrl, extractPureLocalAddress, getJobAgeInfo } from '@/lib/jobCardUtils';
import { trackCseelEvent } from '@/components/analytics/AnalyticsScripts';
import { calculateDynamicFacets, DEFAULT_JOB_FACETS } from '@/data/jobFilterFacets';
import { matchesJobFuzzy, filterAndRankJobsBySearch } from '@/lib/fuzzySearch';

const FacultyFilterSheet = dynamic(() => import('@/components/teachers/FacultyFilterSheet'), {
  ssr: false,
});
const FacultyAdBanner = dynamic(() => import('@/components/teachers/FacultyAdBanner'), {
  ssr: false,
});

// Indian States & Districts Master Database for Auto-Populating Dependent District Select
export const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  'Haryana': [
    'Gurugram', 'Faridabad', 'Rewari', 'Rohtak', 'Panipat', 'Sonipat', 'Ambala', 'Karnal',
    'Hisar', 'Panchkula', 'Yamunanagar', 'Kurukshetra', 'Jhajjar', 'Bhiwani', 'Sirsa',
    'Palwal', 'Jind', 'Mahendragarh', 'Kaithal', 'Fatehabad', 'Charkhi Dadri', 'Nuh'
  ],
  'Delhi NCR': [
    'New Delhi', 'South Delhi', 'North Delhi', 'West Delhi', 'East Delhi', 'Central Delhi',
    'North West Delhi', 'South West Delhi', 'South East Delhi', 'Shahdara', 'North East Delhi'
  ],
  'Uttar Pradesh': [
    'Gautam Buddha Nagar (Noida)', 'Greater Noida', 'Ghaziabad', 'Lucknow', 'Kanpur Nagar',
    'Agra', 'Meerut', 'Varanasi', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad',
    'Saharanpur', 'Mathura', 'Ayodhya', 'Jhansi', 'Gorakhpur', 'Muzaffarnagar'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer', 'Alwar', 'Bhilwara',
    'Sikar', 'Bharatpur', 'Pali', 'Sri Ganganagar', 'Jhunjhunu', 'Chittorgarh'
  ],
  'Punjab': [
    'Mohali (SAS Nagar)', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda',
    'Hoshiarpur', 'Pathankot', 'Moga', 'Firozpur'
  ],
  'Chandigarh': [
    'Chandigarh'
  ],
  'Maharashtra': [
    'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Navi Mumbai',
    'Chhatrapati Sambhaji Nagar', 'Solapur', 'Kolhapur', 'Amravati'
  ],
  'Karnataka': [
    'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru',
    'Belagavi', 'Kalaburagi', 'Shivamogga', 'Tumakuru'
  ],
  'Telangana': [
    'Hyderabad', 'Secunderabad', 'Medchal-Malkajgiri', 'Rangareddy', 'Warangal', 'Sangareddy'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar', 'Jamnagar', 'Anand'
  ],
  'West Bengal': [
    'Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 'Darjeeling', 'Siliguri'
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur', 'Kollam'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Nainital', 'Rishikesh', 'Udham Singh Nagar'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Dharamshala / Kangra', 'Solan', 'Mandi', 'Kullu'
  ]
};

const FacultyJobMap = dynamic(() => import('@/components/teachers/FacultyJobMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] bg-slate-100 rounded-2xl flex items-center justify-center text-xs font-bold text-slate-500 animate-pulse border border-slate-200">
      Loading Live Interactive Map...
    </div>
  ),
});


function formatJobDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (mIdx >= 0 && mIdx < 12 && !isNaN(day)) {
        return `${day} ${months[mIdx]}`;
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  } catch {}
  return dateStr;
}

function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface TeachersDirectoryClientProps {
  initialJobs?: FacultyJobItem[];
  initialTab?: 'jobs' | 'faculty';
  totalVacanciesCount?: number;
}

export default function TeachersDirectoryClient({
  initialJobs,
  initialTab = 'jobs',
  totalVacanciesCount = DEFAULT_JOB_FACETS.totalVacancies,
}: TeachersDirectoryClientProps = {}) {
  const { user } = useAuth();
  const latestUpdatedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, []);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const lastGpsCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // High-performance, non-blocking GPS distance application with 200m delta guard
  const applyGpsCoordinates = useCallback((coords: { lat: number; lng: number }, autoSort: boolean = true) => {
    setUserCoords(coords);

    const prev = lastGpsCoordsRef.current;
    if (prev) {
      const deltaKm = getDistanceKm(prev.lat, prev.lng, coords.lat, coords.lng);
      if (deltaKm < 0.2) {
        // Less than 200m difference -> Skip recalculation across all vacancies!
        if (autoSort) setSortBy('near_me');
        return;
      }
    }

    // Delta is >= 200m or initial GPS query -> Non-blocking background calculation
    lastGpsCoordsRef.current = coords;

    requestAnimationFrame(() => {
      setActiveJobs((currentJobs) => {
        const updated = currentJobs.map((j) => {
          if (j.coordinates && typeof j.coordinates.lat === 'number' && typeof j.coordinates.lng === 'number') {
            const d = getDistanceKm(coords.lat, coords.lng, j.coordinates.lat, j.coordinates.lng);
            return { ...j, distanceKm: d };
          }
          return j;
        });

        // Persist updated distances asynchronously in IndexedDB
        JobsCacheStorage.updateDistances(updated, coords).catch(() => {});

        return updated;
      });

      if (autoSort) setSortBy('near_me');
    });
  }, []);

  const [isLocationPromptOpen, setIsLocationPromptOpen] = useState(false);

  const handleRequestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsErrorMessage("Geolocation is not supported by your device or browser.");
      setGpsErrorModalOpen(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyGpsCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude }, false);
      },
      (err) => {
        console.warn('[GPS Location Notice]', err.message);
        if (err.code === 1) {
          setGpsErrorMessage("Location access was disallowed. Please enable location permissions in your browser or device settings to view nearest vacancies.");
        } else {
          setGpsErrorMessage("Could not detect location. Please check if device GPS / Location is turned ON.");
        }
        setGpsErrorModalOpen(true);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [applyGpsCoordinates]);

  // Initial check on mount: If GPS already saved, calculate distance silently; otherwise show prompt popup
  useEffect(() => {
    const checkInitialLocation = async () => {
      try {
        const cached = await JobsCacheStorage.getCache();
        if (cached && cached.lastGps) {
          applyGpsCoordinates(cached.lastGps, false);
          return;
        }

        if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
          try {
            const perm = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
            if (perm.state === 'granted') {
              navigator.geolocation.getCurrentPosition(
                (pos) => applyGpsCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude }, false),
                () => {}
              );
              return;
            }
          } catch {}
        }


      } catch (e) {}
    };

    checkInitialLocation();
  }, [applyGpsCoordinates]);



  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isCompressingAvatar, setIsCompressingAvatar] = useState(false);
  const [avatarCompressedSize, setAvatarCompressedSize] = useState<number | null>(null);

  // Missed Call Phone Verification State
  const [teacherPhoneVerify, setTeacherPhoneVerify] = useState<{
    status: 'idle' | 'initiating' | 'waiting' | 'verified';
    countdown: number;
    sessionId: string;
    tollFreeNumber: string;
    token: string;
    error: string | null;
    phone: string;
  }>({
    status: 'idle',
    countdown: 120,
    sessionId: '',
    tollFreeNumber: '+91 8000 920 920',
    token: '',
    error: null,
    phone: ''
  });

  const [jobPhoneVerify, setJobPhoneVerify] = useState<{
    status: 'idle' | 'initiating' | 'waiting' | 'verified';
    countdown: number;
    sessionId: string;
    tollFreeNumber: string;
    token: string;
    error: string | null;
    phone: string;
  }>({
    status: 'idle',
    countdown: 120,
    sessionId: '',
    tollFreeNumber: '+91 8000 920 920',
    token: '',
    error: null,
    phone: ''
  });

  // Navigation Tabs: 'jobs' (Job Finder & Indexer) or 'faculty' (Verified Teachers)
  const [activeTab, setActiveTab] = useState<'jobs' | 'faculty'>(initialTab);

  // Sync activeTab with URL without page reload and persist across refreshes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'faculty') {
        setActiveTab('faculty');
      } else if (tabParam === 'jobs' || tabParam === 'vacancies') {
        setActiveTab('jobs');
      }
    }
  }, []);

  const handleTabChange = React.useCallback((newTab: 'jobs' | 'faculty') => {
    setActiveTab(newTab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (newTab === 'faculty') {
        url.searchParams.set('tab', 'faculty');
      } else {
        url.searchParams.delete('tab');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, []);
  
  // View Mode: 'grid' (2 cols), 'grid3' (3 cols), 'compact' (list), or 'map' (map) - Default: 'compact' (List Grid)
  const [viewMode, setViewMode] = useState<'grid' | 'grid3' | 'compact' | 'map'>('compact');

  // Sidebar minimize state (Desktop by default OPEN, minimizes in map mode)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleViewModeChange = (mode: 'grid' | 'grid3' | 'compact' | 'map') => {
    setViewMode(mode);
    if (mode === 'map') {
      setIsSidebarMinimized(true);
    }
  };
  const [navBottomOffset, setNavBottomOffset] = useState<number>(54);

  // Filter States (Typing updates searchInput; Search only runs on Enter or Button Click)
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const hasSearchText = searchInput.trim().length > 0;
  const [selectedDesignations, setSelectedDesignations] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedPortals, setSelectedPortals] = useState<string[]>([]);
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);
  const [urgentOnly, setUrgentOnly] = useState<boolean>(false);
  const [forLadyOnly, setForLadyOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'salary' | 'deadline' | 'experience' | 'rating' | 'near_me'>('newest');
  const [distanceRadiusFilter, setDistanceRadiusFilter] = useState<number>(0);

  // Mobile Filter Drawer & Menu States
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobileCityDropdownOpen, setIsMobileCityDropdownOpen] = useState<boolean>(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState<boolean>(false);
  const [locationTab, setLocationTab] = useState<'districts' | 'states'>('districts');
  const [locationSearchInput, setLocationSearchInput] = useState<string>('');

  // Search popover
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [trendingSearches, setTrendingSearches] = useState<{ query: string; count?: number }[]>([
    { query: "PGT Physics Delhi", count: 142 },
    { query: "TGT Chemistry CBSE", count: 118 },
    { query: "ATL Robotics Mentor Gurugram", count: 96 },
    { query: "PRT Primary Science", count: 85 },
    { query: "Composite Lab In-Charge", count: 74 },
    { query: "Class 11-12 Mathematics", count: 68 },
    { query: "Computer Science AI Teacher", count: 57 },
  ]);

  // Saved Jobs local state
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);
  const [shareToastMessage, setShareToastMessage] = useState<string | null>(null);

  // Direct Connect Modal (for Schools to reach Faculty)
  const [selectedFacultyForConnect, setSelectedFacultyForConnect] = useState<VerifiedFacultyItem | null>(null);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectForm, setConnectForm] = useState({ name: '', email: '', phone: '', orgName: '', message: '' });
  const [connectSuccess, setConnectSuccess] = useState(false);

  // "List Yourself as Faculty" Onboarding Modal
  const [isListAsTeacherOpen, setIsListAsTeacherOpen] = useState(false);
  const [teacherOnboardingForm, setTeacherOnboardingForm] = useState({
    name: '',
    email: '',
    phone: '',
    designation: 'PGT',
    subject: 'Physics',
    board: 'CBSE',
    qualification: '',
    experienceYears: 5,
    state: 'Haryana',
    district: 'Gurugram',
    city: 'Gurugram',
    address: '',
    pincode: '',
    pastSchools: '',
    skills: '',
    avatarUrl: '',
    phonePrivate: true,
    emailPrivate: true,
    expectedSalary: '₹9 - ₹12 LPA',
    bio: '',
  });
  const [teacherOnboardingSuccess, setTeacherOnboardingSuccess] = useState(false);

  // "Post a School Vacancy" Modal
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [postJobForm, setPostJobForm] = useState({
    schoolName: '',
    contactPerson: '',
    email: '',
    phone: '',
    postTitle: '',
    subject: 'Physics',
    designation: 'PGT',
    board: 'CBSE',
    roleType: 'Full-Time',
    postCategory: 'Academic',
    salaryMin: '8.0',
    salaryMax: '12.0',
    experienceYears: '3',
    state: 'Haryana',
    district: 'Gurugram',
    address: '',
    pincode: '',
    description: '',
  });
  const [isDescriptionFullscreen, setIsDescriptionFullscreen] = useState(false);
  const [useCustomSchoolDetails, setUseCustomSchoolDetails] = useState(false);

  // Existing School Profile detection from logged in user
  const existingSchoolProfile = useMemo(() => {
    if (!user) return null;
    const meta = (user.user_metadata || {}) as Record<string, any>;
    const schoolName = meta.org_name || meta.school_name || meta.institutionName || meta.institution || meta.displayName || '';
    const email = user.email || meta.email || '';
    const phone = user.phone || meta.phone || '';
    if (schoolName) {
      return { schoolName, email, phone };
    }
    return null;
  }, [user]);

  // Auto-link existing school profile
  useEffect(() => {
    if (existingSchoolProfile && !useCustomSchoolDetails) {
      setPostJobForm(prev => ({
        ...prev,
        schoolName: existingSchoolProfile.schoolName,
        email: existingSchoolProfile.email || prev.email,
        phone: existingSchoolProfile.phone || prev.phone,
      }));
    }
  }, [existingSchoolProfile, useCustomSchoolDetails]);
  const [postJobSuccess, setPostJobSuccess] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Google-Grade Search Execution (Triggered ONLY on Search Button Click or Enter Key)
  const handleExecuteSearch = useCallback((overrideQuery?: string) => {
    const q = (overrideQuery !== undefined ? overrideQuery : searchInput).trim();
    setSearchInput(q);
    setSearchQuery(q);
    setCurrentPage(1);
    setIsSearchFocused(false);

    if (q.length >= 2) {
      fetch('/api/search/record-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }
  }, [searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
    setIsSearchFocused(false);
  }, []);

  // Countdown timer for Teacher Missed Call Verification
  useEffect(() => {
    let timer: any;
    if (teacherPhoneVerify.status === 'waiting' && teacherPhoneVerify.countdown > 0) {
      timer = setInterval(() => {
        setTeacherPhoneVerify((prev) => {
          if (prev.countdown <= 1) {
            return { ...prev, status: 'idle', countdown: 120, error: '2-minute verification window expired. Please retry.' };
          }
          return { ...prev, countdown: prev.countdown - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [teacherPhoneVerify.status, teacherPhoneVerify.countdown]);

  // Countdown timer for Job Missed Call Verification
  useEffect(() => {
    let timer: any;
    if (jobPhoneVerify.status === 'waiting' && jobPhoneVerify.countdown > 0) {
      timer = setInterval(() => {
        setJobPhoneVerify((prev) => {
          if (prev.countdown <= 1) {
            return { ...prev, status: 'idle', countdown: 120, error: '2-minute verification window expired. Please retry.' };
          }
          return { ...prev, countdown: prev.countdown - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [jobPhoneVerify.status, jobPhoneVerify.countdown]);

  // Auto-detect browser geolocation when 'near me' is in query
  useEffect(() => {
    const isNearMe = searchQuery.toLowerCase().includes('near me') || searchQuery.toLowerCase().includes('nearby');
    if (isNearMe && !userCoords && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => applyGpsCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Geolocation permission denied')
      );
    }
  }, [searchQuery, userCoords]);

  // Initiate Missed-call Verification (2 min window)
  const handleInitiatePhoneVerify = async (target: 'teacher' | 'job') => {
    const phone = target === 'teacher' ? teacherOnboardingForm.phone : postJobForm.phone;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number (e.g. 9812345678).");
      return;
    }

    const setVerify = target === 'teacher' ? setTeacherPhoneVerify : setJobPhoneVerify;
    setVerify(prev => ({ ...prev, status: 'initiating', error: null, phone: cleanPhone }));

    try {
      const res = await fetch('/api/auth/phone-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'INITIATE', phone: cleanPhone })
      });
      const data = await res.json();
      if (data.success) {
        setVerify({
          status: 'waiting',
          countdown: 120,
          sessionId: data.sessionId,
          tollFreeNumber: data.tollFreeNumber || '+91 8000 920 920',
          token: '',
          error: null,
          phone: cleanPhone
        });
      } else {
        setVerify(prev => ({ ...prev, status: 'idle', error: data.error || 'Failed to start phone verification.' }));
      }
    } catch (err: any) {
      setVerify(prev => ({ ...prev, status: 'idle', error: err?.message || 'Network error.' }));
    }
  };

  // Check / Confirm Missed-call from server
  const handleCheckCallVerify = async (target: 'teacher' | 'job') => {
    const verify = target === 'teacher' ? teacherPhoneVerify : jobPhoneVerify;
    const setVerify = target === 'teacher' ? setTeacherPhoneVerify : setJobPhoneVerify;

    if (!verify.sessionId) return;

    try {
      const res = await fetch('/api/auth/phone-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CHECK_CALL', sessionId: verify.sessionId, phone: verify.phone })
      });
      const data = await res.json();
      if (data.success && data.verified) {
        setVerify(prev => ({
          ...prev,
          status: 'verified',
          token: data.token,
          error: null
        }));
      } else {
        setVerify(prev => ({ ...prev, error: data.error || 'Call not detected yet. Please ensure you dialed +91 8000 920 920.' }));
      }
    } catch (err: any) {
      setVerify(prev => ({ ...prev, error: err?.message || 'Verification check error.' }));
    }
  };

  // 📍 Location Detection Auto-Fill Handler
  const handleDetectLocation = (target: 'teacher' | 'job') => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          const detectedState = data.principalSubdivision || "";
          const detectedCity = data.city || data.locality || "";
          const detectedPostcode = data.postcode || "";

          // Match state in master list
          const matchedState = Object.keys(INDIAN_STATES_DISTRICTS).find(
            s => s.toLowerCase() === detectedState.toLowerCase() || detectedState.toLowerCase().includes(s.toLowerCase())
          ) || (detectedState.includes("Delhi") ? "Delhi NCR" : "Haryana");

          const districts = INDIAN_STATES_DISTRICTS[matchedState] || [];
          const matchedDistrict = districts.find(
            d => detectedCity.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(detectedCity.toLowerCase())
          ) || districts[0] || detectedCity;

          if (target === 'teacher') {
            setTeacherOnboardingForm(prev => ({
              ...prev,
              state: matchedState,
              district: matchedDistrict,
              city: detectedCity || matchedDistrict,
              pincode: detectedPostcode || prev.pincode,
              address: `${detectedCity}, ${matchedDistrict}, ${matchedState}`
            }));
          } else {
            setPostJobForm(prev => ({
              ...prev,
              state: matchedState,
              district: matchedDistrict,
              city: detectedCity || matchedDistrict,
              pincode: detectedPostcode || prev.pincode,
              address: `${detectedCity}, ${matchedDistrict}, ${matchedState}`
            }));
          }
        } catch (err) {
          console.error("Geocoding failed:", err);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        alert("Unable to detect location. Please grant location permissions in your browser.");
      }
    );
  };

  // Client-Side Canvas Image Compressor (strictly <= 10KB WebP)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    setIsCompressingAvatar(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 256;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);

        // Iteratively compress to WebP strictly <= 10KB (10240 bytes)
        let quality = 0.82;
        let dataUrl = canvas.toDataURL('image/webp', quality);
        let byteLength = Math.round((dataUrl.length * 3) / 4);

        while (byteLength > 9800 && quality > 0.15) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL('image/webp', quality);
          byteLength = Math.round((dataUrl.length * 3) / 4);
        }

        setAvatarCompressedSize(byteLength);
        setTeacherOnboardingForm(prev => ({ ...prev, avatarUrl: dataUrl }));
        setIsCompressingAvatar(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenPostJob = () => {
    if (!user) {
      window.location.href = '/login?returnUrl=/edu-network/jobs/post';
      return;
    }
    window.location.href = '/edu-network/jobs/post';
  };

  const handleOpenListAsTeacher = () => {
    window.location.href = '/edu-network/teachers/register';
  };


  // Dynamically calculate navbar bottom so sidebar is always strictly attached without hiding under navbar (Desktop only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;
    const updateOffset = () => {
      // On mobile screens (< 768px), sidebar is in a slide drawer, no fixed desktop layout calculation needed
      if (window.innerWidth < 768) return;

      if (isFullscreen) {
        setNavBottomOffset(0);
        return;
      }
      const navbar = document.getElementById('site-navbar');
      if (navbar) {
        const rect = navbar.getBoundingClientRect();
        const newOffset = Math.max(0, Math.round(rect.bottom));
        setNavBottomOffset((prev) => (prev === newOffset ? prev : newOffset));
      } else {
        setNavBottomOffset((prev) => (prev === 54 ? prev : 54));
      }
    };

    updateOffset();

    const handleScroll = () => {
      if (window.innerWidth >= 768 && !ticking) {
        window.requestAnimationFrame(() => {
          updateOffset();
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      updateOffset();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isFullscreen]);

  // Fullscreen toggle handler (Native browser fullscreen + In-page immersive view)
  const handleToggleFullscreen = useCallback(() => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    if (typeof document !== 'undefined') {
      if (next) {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }
  }, [isFullscreen]);

  // Handle ESC key & native fullscreenchange event
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Keyboard shortcut '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch trending searches on-demand when user focuses search bar
  const fetchTrendingSearches = useCallback(() => {
    if (trendingSearches.length > 0) return;
    fetch('/api/search/record-query')
      .then((res) => res.json())
      .then((data) => {
        if (data.trending && Array.isArray(data.trending) && data.trending.length > 0) {
          setTrendingSearches(data.trending.slice(0, 8));
        }
      })
      .catch(() => {});
  }, [trendingSearches.length]);

  const toggleDesignation = (id: string) => {
    setSelectedDesignations((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleBoard = (id: string) => {
    setSelectedBoards((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCity = (id: string) => {
    setSelectedCities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleState = (id: string) => {
    setSelectedStates((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleJobType = (id: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const togglePortal = (id: string) => {
    setSelectedPortals((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  // Active 45-Day Vacancies with real-time Supabase hydration
  const [activeJobs, setActiveJobs] = useState<FacultyJobItem[]>(() => 
    initialJobs && initialJobs.length > 0 ? initialJobs : getActiveFacultyJobs()
  );

  const [gpsErrorModalOpen, setGpsErrorModalOpen] = useState(false);
  const [gpsErrorMessage, setGpsErrorMessage] = useState('');

  // Intelligent Near Me handler:
  // - If distance is already calculated: directly sort (0ms, no GPS request)
  // - If not calculated: request GPS, calculate distance once, save in IndexedDB, and sort
  // - If user denies: show prompt popup; when user taps again, re-prompt
  const handleNearMeSort = useCallback(() => {
    setIsSortMenuOpen(false);

    // If any jobs already have distanceKm calculated and userCoords exists -> Instant sort!
    const hasDistances = activeJobs.some((j) => typeof j.distanceKm === 'number');
    if (hasDistances && userCoords) {
      setSortBy('near_me');
      return;
    }

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsErrorMessage("Geolocation is not supported by your device or browser.");
      setGpsErrorModalOpen(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyGpsCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.warn('[GPS Location Notice]', err.message);
        if (err.code === 1) {
          setGpsErrorMessage("Location access was disallowed. Please enable location permissions in your browser or device settings to view nearest vacancies.");
        } else {
          setGpsErrorMessage("Could not detect location. Please check if device GPS / Location is turned ON.");
        }
        setGpsErrorModalOpen(true);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [activeJobs, userCoords, applyGpsCoordinates]);

  const requestUserLocation = handleNearMeSort;

  // Faculty list state initialized with custom registered faculty + admin verified overrides
  const [facultyList, setFacultyList] = useState<VerifiedFacultyItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cseel_custom_faculty');
        const verifiedUsers: string[] = JSON.parse(localStorage.getItem('cseel_admin_verified_users') || '[]');
        if (stored) {
          const custom = JSON.parse(stored);
          if (Array.isArray(custom) && custom.length > 0) {
            const mappedCustom = custom.map((f: any) => ({
              ...f,
              verified: Boolean(f.verified || verifiedUsers.includes(f.id) || verifiedUsers.includes(f.slug) || verifiedUsers.includes(f.name))
            }));
            return [...mappedCustom, ...VERIFIED_FACULTY_MEMBERS];
          }
        }
      } catch {}
    }
    return VERIFIED_FACULTY_MEMBERS;
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cseel_custom_jobs');
      if (stored) {
        const custom = JSON.parse(stored);
        if (Array.isArray(custom) && custom.length > 0) {
          setActiveJobs(prev => [...custom, ...prev]);
        }
      }
    } catch (e) {}
    // 1. IndexedDB Cache-First & Background Version Sync
    const syncJobsData = async () => {
      try {
        // Read local IndexedDB cache first for instant 0.01s load
        const cached = await JobsCacheStorage.getCache();
        if (cached && cached.jobs && cached.jobs.length > 0) {
          setActiveJobs(cached.jobs);
          if (cached.lastGps) {
            lastGpsCoordsRef.current = cached.lastGps;
          }
        }

        // Tiny 80-byte check to server: has database updated?
        const versionRes = await fetch('/api/jobs/version');
        if (versionRes.ok) {
          const versionData = await versionRes.json();
          const serverVersion = versionData.version;

          // If database has new version, or no local cache exists, fetch full dataset
          if (!cached || cached.version !== serverVersion) {
            const jobsRes = await fetch('/api/jobs');
            if (jobsRes.ok) {
              const jobsData = await jobsRes.json();
              if (jobsData.success && Array.isArray(jobsData.jobs) && jobsData.jobs.length > 0) {
                let freshJobs = jobsData.jobs;

                // Pre-calculate distances for fresh jobs if pre-saved GPS exists
                const savedGps = cached?.lastGps || userCoords || lastGpsCoordsRef.current;
                if (savedGps && typeof savedGps.lat === 'number' && typeof savedGps.lng === 'number') {
                  freshJobs = freshJobs.map((j: any) => {
                    if (j.coordinates && typeof j.coordinates.lat === 'number' && typeof j.coordinates.lng === 'number') {
                      const d = getDistanceKm(savedGps.lat, savedGps.lng, j.coordinates.lat, j.coordinates.lng);
                      return { ...j, distanceKm: d };
                    }
                    return j;
                  });
                }

                setActiveJobs(freshJobs);
                await JobsCacheStorage.saveCache(
                  freshJobs,
                  serverVersion,
                  versionData.count || freshJobs.length
                );
              }
            }
          }
        }
      } catch (err) {
        console.warn('[Client] Cache sync warning:', err);
      }
    };

    if (typeof window !== 'undefined') {
      const scheduleSync = (cb: () => void) => {
        const runner = () => {
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(cb, { timeout: 6000 });
          } else {
            setTimeout(cb, 3500);
          }
        };
        if (document.readyState === 'complete') {
          setTimeout(runner, 2500);
        } else {
          window.addEventListener('load', () => setTimeout(runner, 2500), { once: true });
        }
      };

      scheduleSync(() => {
        syncJobsData();

        // Fetch latest verified faculty from database after idle
        fetch('/api/admin/faculty')
          .then((res) => res.json())
          .then((data) => {
            if (data && data.success && Array.isArray(data.faculty) && data.faculty.length > 0) {
              setFacultyList((prev) => {
                const updated = [...prev];
                const verifiedUsers: string[] = typeof window !== 'undefined'
                  ? JSON.parse(localStorage.getItem('cseel_admin_verified_users') || '[]')
                  : [];

                for (const f of data.faculty) {
                  const idx = updated.findIndex((x: any) => x.id === f.id || x.slug === f.slug);
                  const isVer = Boolean(f.verified || verifiedUsers.includes(f.id) || verifiedUsers.includes(f.slug));
                  if (idx !== -1) {
                    updated[idx] = { ...updated[idx], verified: isVer };
                  } else {
                    updated.unshift({
                      id: f.id || f.slug,
                      name: f.name,
                      designation: f.designation || 'PGT',
                      subject: f.subject || 'Faculty',
                      board: f.board || 'CBSE',
                      qualification: f.qualification || 'Post Graduate / B.Ed',
                      experienceYears: f.experienceYears || 3,
                      currentInstitute: f.currentInstitute || 'Senior Secondary School',
                      city: f.city || 'Delhi NCR',
                      state: f.state || 'Delhi NCR',
                      coordinates: { lat: 28.6139, lng: 77.2090 },
                      verified: isVer,
                      nepCertified: false,
                      rating: 5.0,
                      reviewsCount: 0,
                      avatar: f.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
                      bio: f.bio || '',
                      skills: Array.isArray(f.skills) ? f.skills : (f.skills ? f.skills.split(',').map((s: string) => s.trim()) : ['Pedagogy']),
                      expectedSalary: f.expectedSalary || '₹6 - ₹9 LPA',
                      isActivelySeekingJob: true,
                    });
                  }
                }
                return updated;
              });
            }
          })
          .catch((err) => console.warn('[Client] Faculty sync notice:', err));
      });
    }
  }, []);

  // ── PAGINATION (25 ITEMS PER PAGE FOR OPTIMAL PERFORMANCE & FAST RENDERING) ──
  const [currentPage, setCurrentPage] = useState<number>(1);
  const JOBS_PER_PAGE = 25;

  // Reset page to 1 whenever any filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedDesignations,
    selectedSubjects,
    selectedBoards,
    selectedCities,
    selectedStates,
    selectedJobTypes,
    selectedPortals,
    minSalaryFilter,
    urgentOnly,
    sortBy,
    activeTab
  ]);



  const hasActiveFilters = Boolean(
    (searchQuery && searchQuery.trim() !== '') ||
    (locationSearchInput && locationSearchInput.trim() !== '') ||
    selectedDesignations.length > 0 ||
    selectedSubjects.length > 0 ||
    selectedBoards.length > 0 ||
    selectedCities.length > 0 ||
    selectedStates.length > 0 ||
    selectedJobTypes.length > 0 ||
    selectedPortals.length > 0 ||
    minSalaryFilter > 0 ||
    urgentOnly ||
    forLadyOnly
  );

  // Dynamic multi-dimensional drill-down filter counts
  const dynamicCounts = useMemo(() => {
    if (activeTab === 'jobs') {
      // By default when NO search or filter is applied, return precomputed database facet counts!
      if (!hasActiveFilters && DEFAULT_JOB_FACETS?.counts) {
        return {
          subjects: DEFAULT_JOB_FACETS.counts.subjects || {},
          designations: DEFAULT_JOB_FACETS.counts.designations || {},
          boards: DEFAULT_JOB_FACETS.counts.boards || {},
          cities: DEFAULT_JOB_FACETS.counts.cities || {},
          states: DEFAULT_JOB_FACETS.counts.states || {},
          portals: DEFAULT_JOB_FACETS.counts.portals || {},
          forLady: DEFAULT_JOB_FACETS.forLadyCount ?? 28,
        };
      }

      return calculateDynamicFacets(activeJobs, {
        selectedDesignations,
        selectedSubjects,
        selectedBoards,
        selectedCities,
        selectedStates,
        selectedJobTypes,
        selectedPortals,
        minSalaryFilter,
        urgentOnly,
        forLadyOnly,
        searchQuery,
        searchLocation: locationSearchInput,
      });
    } else {
      const desCounts: Record<string, number> = {};
      const subCounts: Record<string, number> = {};
      const boardCounts: Record<string, number> = {};
      const cityCounts: Record<string, number> = {};
      const stateCounts: Record<string, number> = {};

      VERIFIED_FACULTY_MEMBERS.forEach((fac) => {
        if (fac.designation) desCounts[fac.designation] = (desCounts[fac.designation] || 0) + 1;
        if (fac.subject) subCounts[fac.subject] = (subCounts[fac.subject] || 0) + 1;
        if (fac.board) boardCounts[fac.board] = (boardCounts[fac.board] || 0) + 1;
        if (fac.city) cityCounts[fac.city] = (cityCounts[fac.city] || 0) + 1;
        if (fac.state) stateCounts[fac.state] = (stateCounts[fac.state] || 0) + 1;
      });

      return {
        designations: desCounts,
        subjects: subCounts,
        boards: boardCounts,
        cities: cityCounts,
        states: stateCounts,
        portals: {},
      };
    }
  }, [
    activeJobs,
    activeTab,
    selectedDesignations,
    selectedSubjects,
    selectedBoards,
    selectedCities,
    selectedStates,
    selectedJobTypes,
    selectedPortals,
    minSalaryFilter,
    urgentOnly,
    forLadyOnly,
    searchQuery,
    locationSearchInput,
  ]);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    const candidates = activeJobs.filter((job) => {
      if (selectedDesignations.length > 0 && !selectedDesignations.includes(job.designation)) return false;
      if (selectedSubjects.length > 0 && !selectedSubjects.includes(job.subject)) return false;
      if (selectedBoards.length > 0 && !selectedBoards.includes(job.board)) return false;
      if (selectedCities.length > 0 && !selectedCities.some((c) => job.city.toLowerCase().includes(c.toLowerCase()))) return false;
      if (selectedStates.length > 0 && !selectedStates.some((s) => (job.state || '').toLowerCase().includes(s.toLowerCase()))) return false;
      
      // Job Type / Work Mode filter (Full-Time, Part-Time, Remote/Online, Offline/On-site)
      if (selectedJobTypes.length > 0) {
        const matchesJobType = selectedJobTypes.some((jt) => {
          const roleType = (job.roleType || '').toLowerCase();
          const title = (job.jobPostName || '').toLowerCase();
          const desc = (job.shortDescription || '').toLowerCase();
          const fullText = `${roleType} ${title} ${desc}`;
          if (jt === 'Remote') {
            return fullText.includes('remote') || fullText.includes('online') || fullText.includes('work from home');
          }
          if (jt === 'On-site') {
            return !fullText.includes('remote') && !fullText.includes('work from home');
          }
          if (jt === 'Part-Time') {
            return fullText.includes('part-time') || fullText.includes('part time') || fullText.includes('visiting');
          }
          if (jt === 'Full-Time') {
            return fullText.includes('full-time') || fullText.includes('full time') || roleType === 'full-time' || !roleType;
          }
          return roleType.includes(jt.toLowerCase());
        });
        if (!matchesJobType) return false;
      }

      // Portal Source Filter (Naukri, Indeed, LinkedIn, Direct Portal)
      if (selectedPortals.length > 0) {
        const src = (job.source || '').toLowerCase();
        const matchesPortal = selectedPortals.some((p) => {
          const pl = p.toLowerCase();
          if (pl.includes('naukri')) return src.includes('naukri');
          if (pl.includes('indeed')) return src.includes('indeed');
          if (pl.includes('linkedin')) return src.includes('linkedin');
          if (pl.includes('portal') || pl.includes('school') || pl.includes('direct')) {
            return src.includes('direct') || src.includes('school') || src.includes('portal');
          }
          return src.includes(pl);
        });
        if (!matchesPortal) return false;
      }

      if (minSalaryFilter > 0) {
        const annualMax = getAnnualSalaryNumber(job.salary, job.salaryMax).max;
        if (annualMax < minSalaryFilter) return false;
      }
      if (urgentOnly && !job.badge?.includes('🔥')) return false;
      if (forLadyOnly && !isJobForLady(job)) return false;

      // Distance radius filter from user GPS location
      if (distanceRadiusFilter > 0 && userCoords) {
        if (job.coordinates?.lat && job.coordinates?.lng) {
          const d = getDistanceKm(userCoords.lat, userCoords.lng, job.coordinates.lat, job.coordinates.lng);
          if (d > distanceRadiusFilter) return false;
        }
      }

      return true;
    });

    let results = candidates;
    if (searchQuery && searchQuery.trim()) {
      results = filterAndRankJobsBySearch(candidates, searchQuery) as FacultyJobItem[];
    }

    if (sortBy === 'salary') {
      return [...results].sort((a, b) => {
        const salA = getAnnualSalaryNumber(a.salary, a.salaryMax).max;
        const salB = getAnnualSalaryNumber(b.salary, b.salaryMax).max;
        if (salB !== salA) return salB - salA; // Strictly Highest to Lowest in annual INR!
        return (b._dateMs ?? 0) - (a._dateMs ?? 0);
      });
    }
    if (sortBy === 'deadline') {
      return [...results].sort((a, b) => {
        const timeA = a.lastDate ? new Date(a.lastDate).getTime() : Infinity;
        const timeB = b.lastDate ? new Date(b.lastDate).getTime() : Infinity;
        return timeA - timeB;
      });
    }
    if (sortBy === 'near_me') {
      return [...results].sort((a, b) => {
        const distA = typeof a.distanceKm === 'number' ? a.distanceKm : 99999;
        const distB = typeof b.distanceKm === 'number' ? b.distanceKm : 99999;
        return distA - distB;
      });
    }
    if (!searchQuery || !searchQuery.trim()) {
      return [...results].sort((a: any, b: any) => (b._dateMs ?? 0) - (a._dateMs ?? 0));
    }
    return results;
  }, [activeJobs, selectedDesignations, selectedSubjects, selectedBoards, selectedCities, selectedStates, selectedJobTypes, selectedPortals, minSalaryFilter, distanceRadiusFilter, userCoords, urgentOnly, forLadyOnly, searchQuery, sortBy]);

  // Filtered Verified Faculty
  const filteredFaculty = useMemo(() => {
    return facultyList.filter((faculty) => {
      if (selectedDesignations.length > 0 && !selectedDesignations.includes(faculty.designation)) return false;
      if (selectedSubjects.length > 0 && !selectedSubjects.includes(faculty.subject)) return false;
      if (selectedBoards.length > 0 && !selectedBoards.includes(faculty.board)) return false;
      if (selectedCities.length > 0 && !selectedCities.some((c) => faculty.city.toLowerCase().includes(c.toLowerCase()))) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          faculty.name.toLowerCase().includes(q) ||
          faculty.subject.toLowerCase().includes(q) ||
          faculty.designation.toLowerCase().includes(q) ||
          faculty.city.toLowerCase().includes(q) ||
          faculty.qualification.toLowerCase().includes(q) ||
          faculty.currentInstitute.toLowerCase().includes(q) ||
          faculty.skills.some((s) => s.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.rating - a.rating;
    });
  }, [facultyList, selectedDesignations, selectedSubjects, selectedBoards, selectedCities, searchQuery, sortBy]);

  const totalJobsCount = activeTab === 'jobs' ? filteredJobs.length : filteredFaculty.length;
  const totalPages = Math.max(1, Math.ceil(totalJobsCount / JOBS_PER_PAGE));

  // Exactly 50 items for current page!
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const paginatedFaculty = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredFaculty.slice(start, start + JOBS_PER_PAGE);
  }, [filteredFaculty, currentPage]);

  const handlePageChange = (newPage: number) => {
    const p = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(p);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 380, behavior: window.innerWidth < 768 ? 'auto' : 'smooth' });
    }
  };

  // Search telemetry (600ms debounce)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return;

    const timer = setTimeout(() => {
      fetch('/api/search/record-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          category: activeTab,
          filters: {
            designations: selectedDesignations,
            subjects: selectedSubjects,
            boards: selectedBoards,
            cities: selectedCities,
            states: selectedStates,
            minSalaryFilter,
            urgentOnly
          },
          resultsCount: activeTab === 'jobs' ? filteredJobs.length : filteredFaculty.length
        })
      }).catch(() => {});
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, selectedDesignations, selectedSubjects, selectedBoards, selectedCities, selectedStates, minSalaryFilter, urgentOnly, filteredJobs.length, filteredFaculty.length]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedDesignations([]);
    setSelectedSubjects([]);
    setSelectedBoards([]);
    setSelectedCities([]);
    setSelectedStates([]);
    setSelectedJobTypes([]);
    setSelectedPortals([]);
    setMinSalaryFilter(0);
    setUrgentOnly(false);
  };

// hasActiveFilters moved above dynamicCounts

  // 1-Click Share Permanent SEO URL
  const handleCopyJobUrl = (job: FacultyJobItem) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      const shareUrl = `${window.location.origin}/edu-network/teachers/job/${job.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedJobId(job.id);
      setShareToastMessage(`Permanent link for "${job.jobPostName}" copied!`);
      setTimeout(() => {
        setCopiedJobId(null);
        setShareToastMessage(null);
      }, 3000);
    }
  };

  const handleOpenConnect = (faculty: VerifiedFacultyItem) => {
    setSelectedFacultyForConnect(faculty);
    setIsConnectOpen(true);
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConnectSuccess(true);
    setTimeout(() => {
      setConnectSuccess(false);
      setIsConnectOpen(false);
      setConnectForm({ name: '', email: '', phone: '', orgName: '', message: '' });
    }, 1800);
  };

  const handleTeacherOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Direct Indian Mobile Number Validation
    const cleanPhone = teacherOnboardingForm.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    // 2. Character length guards
    if (
      teacherOnboardingForm.name.length > 50 ||
      teacherOnboardingForm.phone.length > 15 ||
      teacherOnboardingForm.email.length > 60 ||
      teacherOnboardingForm.qualification.length > 60 ||
      teacherOnboardingForm.city.length > 40 ||
      teacherOnboardingForm.bio.length > 250
    ) {
      alert("Character limit exceeded on one or more fields. Please keep your entries concise.");
      return;
    }

    // 3. Server-side validation of Avatar payload (strictly <= 10KB)
    if (teacherOnboardingForm.avatarUrl) {
      try {
        const uploadRes = await fetch('/api/upload/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: teacherOnboardingForm.avatarUrl })
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          alert(errData.error || "Avatar upload rejected. File must be <= 10KB.");
          return;
        }
      } catch (err) {
        console.error("Avatar validation failed:", err);
      }
    }

    // 4. Create and persist verified faculty profile
    const newFacultyItem: VerifiedFacultyItem = {
      id: `fac-${Date.now()}`,
      name: teacherOnboardingForm.name,
      designation: (teacherOnboardingForm.designation as any) || 'PGT',
      subject: (teacherOnboardingForm.subject as any) || 'Physics',
      board: (teacherOnboardingForm.board as any) || 'CBSE',
      qualification: teacherOnboardingForm.qualification || 'Post Graduate / B.Ed',
      experienceYears: Number(teacherOnboardingForm.experienceYears) || 3,
      currentInstitute: teacherOnboardingForm.pastSchools || 'Senior Secondary School',
      city: teacherOnboardingForm.city || 'Delhi NCR',
      state: teacherOnboardingForm.state || 'Delhi NCR',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      verified: true,
      nepCertified: true,
      rating: 5.0,
      reviewsCount: 1,
      avatar: teacherOnboardingForm.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
      bio: teacherOnboardingForm.bio || `${teacherOnboardingForm.designation} in ${teacherOnboardingForm.subject}`,
      skills: teacherOnboardingForm.skills ? teacherOnboardingForm.skills.split(',').map(s => s.trim()) : ['Classroom Pedagogy', 'STEM'],
      expectedSalary: teacherOnboardingForm.expectedSalary || '₹6 - ₹9 LPA',
      isActivelySeekingJob: true,
    };

    setFacultyList((prev) => [newFacultyItem, ...prev]);
    try {
      const stored = JSON.parse(localStorage.getItem('cseel_custom_faculty') || '[]');
      localStorage.setItem('cseel_custom_faculty', JSON.stringify([newFacultyItem, ...stored]));
    } catch {}

    setTeacherOnboardingSuccess(true);
    setTimeout(() => {
      setTeacherOnboardingSuccess(false);
      setIsListAsTeacherOpen(false);
      setTeacherOnboardingForm({
        name: '',
        email: '',
        phone: '',
        designation: 'PGT',
        subject: 'Physics',
        board: 'CBSE',
        qualification: '',
        experienceYears: 5,
        state: 'Haryana',
        district: 'Gurugram',
        city: 'Gurugram',
        address: '',
        pincode: '',
        pastSchools: '',
        skills: '',
        avatarUrl: '',
        phonePrivate: true,
        emailPrivate: true,
        expectedSalary: '₹9 - ₹12 LPA',
        bio: '',
      });
      setTeacherPhoneVerify({
        status: 'idle',
        countdown: 120,
        sessionId: '',
        tollFreeNumber: '+91 8000 920 920',
        token: '',
        error: null,
        phone: ''
      });
    }, 2000);
  };

  // Insert formatting tag into job description textarea
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('postJobDescriptionTextarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = postJobForm.description;
    const selected = current.substring(start, end);
    const replacement = `${prefix}${selected || 'Sample Text'}${suffix}`;
    const nextVal = current.substring(0, start) + replacement + current.substring(end);
    if (nextVal.length <= 1000) {
      setPostJobForm((prev) => ({ ...prev, description: nextVal }));
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 11));
      }, 0);
    }
  };

  const checkSecurityThreats = (text: string): string | null => {
    // 1. External URLs or links
    if (/(https?:\/\/|www\.|\.com\b|\.org\b|\.net\b|\.in\b|\.edu\b|\[.*?\]\(.*?\))/i.test(text)) {
      return "External links and web URLs are strictly prohibited to protect against phishing and spam.";
    }
    // 2. Scripts or HTML event injection
    if (/(<script|javascript:|<iframe|<object|<embed|onerror=|onload=|<form)/i.test(text)) {
      return "Script tags and executable code are strictly forbidden.";
    }
    // 3. SQL injection patterns
    if (/(UNION\s+SELECT|DROP\s+TABLE|--|;\s*--|'\s*OR\s*'\d+'='\d+)/i.test(text)) {
      return "Suspicious SQL syntax pattern detected.";
    }
    return null;
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);

    // 1. Security Check on all text fields
    const descThreat = checkSecurityThreats(postJobForm.description);
    if (descThreat) {
      setSecurityError(descThreat);
      return;
    }
    const schoolThreat = checkSecurityThreats(postJobForm.schoolName);
    if (schoolThreat) {
      setSecurityError(`School name error: ${schoolThreat}`);
      return;
    }
    const addressThreat = checkSecurityThreats(postJobForm.address);
    if (addressThreat) {
      setSecurityError(`Address error: ${addressThreat}`);
      return;
    }

    // 2. Description word & character count (Max 200 words, Max 1000 chars)
    const words = postJobForm.description.trim() ? postJobForm.description.trim().split(/\s+/).length : 0;
    if (postJobForm.description.length > 1000) {
      setSecurityError(`Description character limit exceeded (${postJobForm.description.length}/1000 characters max).`);
      return;
    }
    if (words > 200) {
      setSecurityError(`Description word limit exceeded (${words}/200 words max).`);
      return;
    }

    // 3. Salary Band validation
    const minVal = parseFloat(postJobForm.salaryMin);
    const maxVal = parseFloat(postJobForm.salaryMax);
    if (isNaN(minVal) || isNaN(maxVal) || maxVal < minVal) {
      setSecurityError("Maximum salary (LPA) must be greater than or equal to minimum salary.");
      return;
    }

    // 4. Pincode validation (6-digit Indian PIN)
    if (postJobForm.pincode && !/^\d{6}$/.test(postJobForm.pincode)) {
      setSecurityError("Please enter a valid 6-digit Indian postal PIN code.");
      return;
    }

    // 5. Length guards
    if (
      postJobForm.schoolName.length > 70 ||
      postJobForm.postTitle.length > 60 ||
      postJobForm.address.length > 80
    ) {
      setSecurityError("Character limit exceeded on one or more fields. Please keep text concise.");
      return;
    }

    setPostJobSuccess(true);
    setTimeout(() => {
      setPostJobSuccess(false);
      setIsPostJobOpen(false);
      setSecurityError(null);
      setPostJobForm({
        schoolName: existingSchoolProfile ? existingSchoolProfile.schoolName : '',
        contactPerson: '',
        email: existingSchoolProfile ? existingSchoolProfile.email : '',
        phone: existingSchoolProfile ? existingSchoolProfile.phone : '',
        postTitle: '',
        subject: 'Physics',
        designation: 'PGT',
        board: 'CBSE',
        roleType: 'Full-Time',
        postCategory: 'Academic',
        salaryMin: '8.0',
        salaryMax: '12.0',
        experienceYears: '3',
        state: 'Haryana',
        district: 'Gurugram',
        address: '',
        pincode: '',
        description: '',
      });
    }, 2000);
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'LinkedIn':
        return 'bg-blue-50 text-[#005689] border-blue-200';
      case 'Indeed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Naukri.com':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'TimesJobs':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };



  const handleSelectCity = (cityName: string) => {
    setSelectedCities([cityName]);
    setSelectedStates([]);
    setIsLocationDropdownOpen(false);
    setIsMobileCityDropdownOpen(false);
  };

  const handleSelectState = (stateName: string) => {
    setSelectedStates([stateName]);
    setSelectedCities([]);
    setIsLocationDropdownOpen(false);
    setIsMobileCityDropdownOpen(false);
  };

  const handleResetToAllCities = () => {
    setSelectedCities([]);
    setSelectedStates([]);
    setIsLocationDropdownOpen(false);
    setIsMobileCityDropdownOpen(false);
  };

  const handleNearMeSearch = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setSearchInput('Delhi NCR');
          handleExecuteSearch('Delhi NCR');
          setShareToastMessage('Showing opportunities near your GPS location (Delhi NCR)');
          setTimeout(() => setShareToastMessage(null), 3500);
        },
        () => {
          setSearchInput('Delhi NCR');
          handleExecuteSearch('Delhi NCR');
          setShareToastMessage('Location permission denied — defaulting to Delhi NCR');
          setTimeout(() => setShareToastMessage(null), 3500);
        }
      );
    }
  };

  // Google Pill Search Bar (Active Search Button only with text, enter/button triggers search)
  const renderSearchBar = (isCompact: boolean = true) => (
    <div className={`w-full ${isCompact ? 'max-w-2xl' : 'max-w-3xl'} flex flex-row items-center bg-white rounded-full shadow-2xs pl-4 sm:pl-5 pr-1.5 py-1 sm:py-1.5 border border-slate-300 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#005689] focus-within:border-[#005689]`}>
      {/* Search Input with generous padding */}
      <div className="flex-1 flex items-center min-w-0 relative">
        <input
          ref={searchInputRef}
          type="text"
          placeholder={activeTab === 'jobs' ? "Search role, subject, school, location..." : "Search teacher, qualification..."}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => { setIsSearchFocused(true); fetchTrendingSearches(); }}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (hasSearchText) {
                handleExecuteSearch();
              }
            }
          }}
          className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium focus:outline-none min-w-0 py-1"
        />

        {hasSearchText && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="p-1 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer mr-1"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}

        {/* Trending Searches Popover */}
        {isSearchFocused && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Trending Searches</span>
              </span>
              <span className="text-[10px] text-slate-400">Popular Roles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-48 overflow-y-auto">
              {trendingSearches.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={() => {
                    handleExecuteSearch(item.query);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 text-xs text-left transition-colors cursor-pointer group"
                >
                  <span className="truncate group-hover:text-[#005689] font-medium">{item.query}</span>
                  {item.count && (
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons: Near Me & Circular Search */}
      <div className="flex items-center gap-1 pl-1 shrink-0">
        <button
          type="button"
          onClick={handleNearMeSearch}
          className="p-1.5 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Search Near Me"
        >
          <Navigation size={14} className="text-[#005689]" />
        </button>

        <button
          type="button"
          disabled={!hasSearchText}
          onClick={() => handleExecuteSearch()}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition shadow-2xs ${
            hasSearchText
              ? 'bg-[#005689] hover:bg-[#003c6e] text-white cursor-pointer active:scale-95'
              : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-60'
          }`}
          title={hasSearchText ? "Search" : "Type to search"}
        >
          <Search size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28 relative">

        {/* ─── TOAST NOTIFICATION ─── */}
        {shareToastMessage && (
          <div className="fixed top-20 right-4 z-50 bg-[#003c6e] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{shareToastMessage}</span>
          </div>
        )}

        {/* ── Dynamic Sidebar Attachment & Fullscreen Styles ── */}
        <style
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 768px) {
            .directory-sidebar-fixed {
              top: ${isFullscreen ? '0px' : `${navBottomOffset}px`} !important;
              height: ${isFullscreen ? '100vh' : `calc(100vh - ${navBottomOffset}px)`} !important;
              max-height: ${isFullscreen ? '100vh' : `calc(100vh - ${navBottomOffset}px)`} !important;
            }
          }
          ${isFullscreen ? `
            #site-topbar,
            .site-topbar,
            #site-navbar,
            .site-navbar,
            #universal-admin-bar,
            .universal-admin-bar,
            header.fixed,
            nav.fixed,
            header,
            .announcement-bar,
            [id*="admin-bar"] {
              display: none !important;
            }
          ` : ''}
          @media (max-width: 767px) {
            ${isFullscreen ? `
              #site-topbar,
              .site-topbar,
              #site-navbar,
              .site-navbar,
              #universal-admin-bar,
              header.fixed,
              nav.fixed {
                display: none !important;
              }
            ` : ''}
          }
          `}}
        />

        {/* Floating Exit Fullscreen Button - Placed in top middle/center */}
        {isFullscreen && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[99999] animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="h-8 px-3.5 flex items-center gap-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-2xl backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95 transition cursor-pointer text-xs font-bold"
              title="Exit Fullscreen (Esc)"
              aria-label="Exit Fullscreen"
            >
              <X size={15} />
              <span>Exit Fullscreen</span>
            </button>
          </div>
        )}

        {/* ── 1. Minimized Desktop Sidebar Strip (Shown when minimized, exactly like School Listing) ── */}
        {isSidebarMinimized && (
          <aside className="hidden md:flex flex-col w-12 shrink-0 md:fixed md:left-0 md:z-30 directory-sidebar-fixed rounded-none transition-all duration-300">
            <div className="bg-white rounded-none border-r border-b border-gray-200/90 shadow-xs h-full py-2.5 px-1.5 flex flex-col items-center justify-between">
              {/* Top: Expand Chevron Button */}
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

                {/* Category Icons with Chevrons (matching user image) */}
                <div className="flex flex-col items-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setIsSidebarMinimized(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors relative group cursor-pointer"
                    title="Designation Filter (Click to Expand)"
                  >
                    <Award size={16} />
                    <ChevronRight size={12} className="absolute -right-1 text-gray-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSidebarMinimized(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors relative group cursor-pointer"
                    title="Subject Filter (Click to Expand)"
                  >
                    <BookOpen size={16} />
                    <ChevronRight size={12} className="absolute -right-1 text-gray-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSidebarMinimized(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors relative group cursor-pointer"
                    title="Board Filter (Click to Expand)"
                  >
                    <Building2 size={16} />
                    <ChevronRight size={12} className="absolute -right-1 text-gray-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSidebarMinimized(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors relative group cursor-pointer"
                    title="City Filter (Click to Expand)"
                  >
                    <MapPin size={16} />
                    <ChevronRight size={12} className="absolute -right-1 text-gray-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSidebarMinimized(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors relative group cursor-pointer"
                    title="Salary Filter (Click to Expand)"
                  >
                    <IndianRupee size={16} />
                    <ChevronRight size={12} className="absolute -right-1 text-gray-400 group-hover:text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Bottom: Vertical Text */}
              <div className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold text-gray-400 tracking-wider flex items-center gap-1.5 pb-2">
                <SlidersHorizontal size={11} className="rotate-90 text-blue-600" />
                <span>FILTERS</span>
              </div>
            </div>
          </aside>
        )}

        {/* ── 2. Desktop Filter Sidebar Mode (>= 768px Full Sidebar) ── */}
        <FacultyFilterSheet
          mode="sidebar"
          activeTab={activeTab}
          totalCount={activeTab === 'jobs' ? totalVacanciesCount : VERIFIED_FACULTY_MEMBERS.length}
          filteredCount={activeTab === 'jobs' ? (hasActiveFilters ? filteredJobs.length : totalVacanciesCount) : filteredFaculty.length}
          selectedDesignations={selectedDesignations}
          toggleDesignation={toggleDesignation}
          selectedSubjects={selectedSubjects}
          toggleSubject={toggleSubject}
          selectedBoards={selectedBoards}
          toggleBoard={toggleBoard}
          selectedCities={selectedCities}
          toggleCity={toggleCity}
          selectedStates={selectedStates}
          toggleState={toggleState}
          selectedJobTypes={selectedJobTypes}
          toggleJobType={toggleJobType}
          selectedPortals={selectedPortals}
          togglePortal={togglePortal}
          minSalaryFilter={minSalaryFilter}
          setMinSalaryFilter={setMinSalaryFilter}
          urgentOnly={urgentOnly}
          setUrgentOnly={setUrgentOnly}
          forLadyOnly={forLadyOnly}
          setForLadyOnly={setForLadyOnly}
          dynamicCounts={dynamicCounts}
          onResetAll={resetAllFilters}
          isSidebarMinimized={isSidebarMinimized}
          setIsSidebarMinimized={setIsSidebarMinimized}
          distanceRadiusFilter={distanceRadiusFilter}
          setDistanceRadiusFilter={setDistanceRadiusFilter}
          userCoords={userCoords}
          onRequestUserLocation={requestUserLocation}
        />

        {/* ── 3. Mobile Filter Drawer (< 768px) ── */}
        <FacultyFilterSheet
          mode="sheet"
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          activeTab={activeTab}
          totalCount={activeTab === 'jobs' ? totalVacanciesCount : VERIFIED_FACULTY_MEMBERS.length}
          filteredCount={activeTab === 'jobs' ? (hasActiveFilters ? filteredJobs.length : totalVacanciesCount) : filteredFaculty.length}
          selectedDesignations={selectedDesignations}
          toggleDesignation={toggleDesignation}
          selectedSubjects={selectedSubjects}
          toggleSubject={toggleSubject}
          selectedBoards={selectedBoards}
          toggleBoard={toggleBoard}
          selectedCities={selectedCities}
          toggleCity={toggleCity}
          selectedStates={selectedStates}
          toggleState={toggleState}
          selectedJobTypes={selectedJobTypes}
          toggleJobType={toggleJobType}
          selectedPortals={selectedPortals}
          togglePortal={togglePortal}
          minSalaryFilter={minSalaryFilter}
          setMinSalaryFilter={setMinSalaryFilter}
          urgentOnly={urgentOnly}
          setUrgentOnly={setUrgentOnly}
          forLadyOnly={forLadyOnly}
          setForLadyOnly={setForLadyOnly}
          dynamicCounts={dynamicCounts}
          onResetAll={resetAllFilters}
          distanceRadiusFilter={distanceRadiusFilter}
          setDistanceRadiusFilter={setDistanceRadiusFilter}
          userCoords={userCoords}
          onRequestUserLocation={requestUserLocation}
        />

        {/* ── 4. Main Content Area (Offset by fixed sidebar width) ── */}
        <main className={`flex-1 min-w-0 flex flex-col gap-3 transition-all duration-300 pt-3 sm:pt-4 md:pt-4 px-3 sm:px-4 md:pl-0 md:pr-4 lg:pr-5 ${
          isSidebarMinimized ? 'md:ml-14' : 'md:ml-[272px] lg:ml-[296px]'
        }`}>
          
          {/* SEO Header & Immediate LCP Anchor */}
          <div className="mb-0.5">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{activeTab === 'jobs' ? 'Daily School Teaching Vacancies' : 'Verified Faculty & STEM Educators'}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EBF3F8] text-[#004A75] border border-[#D0E6F5]">
                {totalJobsCount.toLocaleString()} {activeTab === 'jobs' ? 'Active Posts' : 'Profiles'}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              Top CBSE, ICSE & private school appointments updated daily with verified salary bands and direct apply links.
            </p>
          </div>

          {/* ── Top Bar Search & Control Card (Exact User Spec Design) ── */}
          <div className={`bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-3 sm:p-4 mb-2 sm:mb-3 flex flex-col gap-2.5 transition-all duration-300 relative ${
            viewMode === 'map'
              ? 'fixed top-2.5 inset-x-2.5 z-40 bg-white/95 backdrop-blur-md shadow-lg md:relative md:top-auto md:inset-x-auto md:z-30 md:bg-white'
              : ''
          }`}>
            {/* Row 1: Search Input (flex-1) + Filter Button + Sort Button + 3-Dots Menu Button */}
            <div className="flex items-center gap-2 w-full">
              {/* Unified Search Input Bar */}
              <div className="relative flex-1 flex items-center bg-[#F4F6F8] rounded-xl px-3 py-2 border border-slate-200/70 focus-within:bg-white focus-within:border-[#004A75] focus-within:ring-2 focus-within:ring-[#004A75]/15 transition-all min-w-0 h-10">
                <Search size={15} className="text-slate-400 shrink-0 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={activeTab === 'jobs' ? "Search role, school, location..." : "Search teacher, qualification..."}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => { setIsSearchFocused(true); fetchTrendingSearches(); }}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (hasSearchText) {
                        handleExecuteSearch();
                      }
                    }
                  }}
                  className="search-clean-input flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium focus:outline-none border-none shadow-none ring-0 focus:ring-0 min-w-0"
                  style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                />
                {hasSearchText && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer ml-1"
                    title="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}

                {/* Trending Searches Popover */}
                {isSearchFocused && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-left animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                        <span>Trending Searches</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Popular Roles</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                      {trendingSearches.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={() => {
                            handleExecuteSearch(item.query);
                          }}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 text-xs text-left transition-colors cursor-pointer group"
                        >
                          <span className="truncate group-hover:text-[#005689] font-medium">{item.query}</span>
                          {item.count && (
                            <span className="text-[10px] text-slate-400 group-hover:text-[#005689] shrink-0 font-medium">
                              {item.count}+
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Button (Mobile & Tablet only; hidden on Desktop where sidebar filter is already open) */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden w-10 h-10 rounded-xl bg-[#F4F6F8] hover:bg-slate-200/80 text-slate-700 flex items-center justify-center border border-slate-200/70 transition cursor-pointer relative shrink-0 active:scale-95"
                title="Filters"
              >
                <SlidersHorizontal size={15} />
                {hasActiveFilters && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#004A75]" />
                )}
              </button>

              {/* Sort Button with Dropdown (Screenshot 3) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsSortMenuOpen(!isSortMenuOpen);
                    setIsMoreMenuOpen(false);
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200/70 transition cursor-pointer active:scale-95 ${
                    isSortMenuOpen ? 'bg-slate-200 text-[#004A75]' : 'bg-[#F4F6F8] hover:bg-slate-200/80 text-slate-700'
                  }`}
                  title="Sort List"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="21" y1="6" x2="3" y2="6"/>
                    <line x1="17" y1="12" x2="3" y2="12"/>
                    <line x1="13" y1="18" x2="3" y2="18"/>
                  </svg>
                </button>

                {/* Sort Dropdown Menu (Screenshot 3) */}
                {isSortMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortMenuOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 p-2.5 text-left animate-in fade-in zoom-in-95">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1 mb-1">
                        SORT LIST BY
                      </div>
                      <div className="space-y-0.5">
                        <button
                          type="button"
                          onClick={handleNearMeSort}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            sortBy === 'near_me' ? 'bg-[#EDF5FA] text-[#004A75] font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#004A75]" />
                            <span>Near Me (Nearest First)</span>
                          </div>
                          {sortBy === 'near_me' && <Check size={14} className="text-[#004A75] stroke-[2.5]" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => { setSortBy('newest'); setIsSortMenuOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            sortBy === 'newest' ? 'bg-[#EDF5FA] text-[#004A75] font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Newest First</span>
                          {sortBy === 'newest' && <Check size={14} className="text-[#004A75] stroke-[2.5]" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => { setSortBy('salary'); setIsSortMenuOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            sortBy === 'salary' ? 'bg-[#EDF5FA] text-[#004A75] font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Salary (Highest)</span>
                          {sortBy === 'salary' && <Check size={14} className="text-[#004A75] stroke-[2.5]" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => { setSortBy('deadline'); setIsSortMenuOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            sortBy === 'deadline' ? 'bg-[#EDF5FA] text-[#004A75] font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Deadline Soonest</span>
                          {sortBy === 'deadline' && <Check size={14} className="text-[#004A75] stroke-[2.5]" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 3-Dots Dark Blue Menu Button with Popover (Screenshot 2) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreMenuOpen(!isMoreMenuOpen);
                    setIsSortMenuOpen(false);
                  }}
                  className="w-10 h-10 rounded-xl bg-[#004A75] hover:bg-[#003859] text-white flex items-center justify-center transition cursor-pointer shadow-sm active:scale-95"
                  title="Browse Category & View Mode"
                >
                  <MoreVertical size={18} className="text-white" />
                </button>

                {/* More Options Popover Menu (Screenshot 2) */}
                {isMoreMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMoreMenuOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-[270px] sm:w-[290px] bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 p-3.5 text-left animate-in fade-in zoom-in-95">
                      {/* Section 1: Browse Category */}
                      <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        BROWSE CATEGORY
                      </div>
                      <div className="bg-[#F4F6F8] p-1 rounded-xl flex items-center gap-1 mb-3.5">
                        <button
                          type="button"
                          onClick={() => { handleTabChange('jobs'); setIsMoreMenuOpen(false); }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition text-center cursor-pointer ${
                            activeTab === 'jobs'
                              ? 'bg-white text-[#004A75] shadow-2xs font-extrabold'
                              : 'text-slate-600 hover:text-slate-900 font-medium'
                          }`}
                        >
                          Vacancies
                        </button>
                        <button
                          type="button"
                          onClick={() => { handleTabChange('faculty'); setIsMoreMenuOpen(false); }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition text-center cursor-pointer ${
                            activeTab === 'faculty'
                              ? 'bg-white text-[#004A75] shadow-2xs font-extrabold'
                              : 'text-slate-600 hover:text-slate-900 font-medium'
                          }`}
                        >
                          Faculty
                        </button>
                      </div>

                      {/* Section 2: View Mode */}
                      <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        VIEW MODE
                      </div>
                      <div className="bg-[#F4F6F8] p-1 rounded-xl flex items-center justify-between gap-1 mb-4">
                        <button
                          type="button"
                          onClick={() => { handleViewModeChange('compact'); setIsMoreMenuOpen(false); }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            viewMode === 'compact'
                              ? 'bg-white text-[#004A75] shadow-2xs font-extrabold'
                              : 'text-slate-600 hover:text-slate-900 font-medium'
                          }`}
                        >
                          <List size={13} />
                          <span>List</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { handleViewModeChange('grid'); setIsMoreMenuOpen(false); }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            viewMode === 'grid' || viewMode === 'grid3'
                              ? 'bg-white text-[#004A75] shadow-2xs font-extrabold'
                              : 'text-slate-600 hover:text-slate-900 font-medium'
                          }`}
                        >
                          <LayoutGrid size={13} />
                          <span>Grid</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { handleViewModeChange('map'); setIsMoreMenuOpen(false); }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            viewMode === 'map'
                              ? 'bg-white text-[#004A75] shadow-2xs font-extrabold'
                              : 'text-slate-600 hover:text-slate-900 font-medium'
                          }`}
                        >
                          <MapIcon size={13} />
                          <span>Map</span>
                        </button>
                      </div>

                      {/* Section 3: Action Buttons */}
                      <div className="space-y-2 pt-1 border-t border-slate-100">
                        <Link
                          href="/edu-network/teachers/register"
                          onClick={() => setIsMoreMenuOpen(false)}
                          className="w-full py-2.5 rounded-xl bg-[#004A75] hover:bg-[#003859] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer active:scale-98"
                        >
                          <GraduationCap size={14} />
                          <span>+ List as Faculty</span>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Row 2: Category Tab Switcher (Vacancies / Faculty) & Updated Date */}
            <div className={`flex items-center justify-between pt-1 px-0.5 text-xs flex-wrap gap-2 ${viewMode === 'map' ? 'hidden md:flex' : 'flex'}`}>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Fast Category Toggle Pill Buttons */}
                <div className="inline-flex items-center bg-[#F1F5F9] p-0.5 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => handleTabChange('jobs')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'jobs'
                        ? 'bg-white text-[#004A75] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase size={13} className={activeTab === 'jobs' ? 'text-[#004A75]' : 'text-slate-400'} />
                    <span>Vacancies</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                      {(hasActiveFilters ? filteredJobs.length : totalVacanciesCount).toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('faculty')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'faculty'
                        ? 'bg-white text-[#004A75] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap size={13} className={activeTab === 'faculty' ? 'text-[#004A75]' : 'text-slate-400'} />
                    <span>Faculty</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                      {filteredFaculty.length.toLocaleString()}
                    </span>
                  </button>
                </div>
              </div>

              <div className="text-[12px] text-slate-500 font-medium">
                Updated: <span className="text-slate-700 font-semibold">{latestUpdatedDate}</span>
              </div>
            </div>
          </div>

          {/* ── Main Flex Layout: Center Feed + Extra Right Panel ── */}
          <div className="w-full flex items-start gap-4 sm:gap-5 mt-2 sm:mt-3">
            
            {/* Center Content: Cards Feed according to viewMode */}
            <div className="flex-1 min-w-0 space-y-3 overflow-visible">
              {/* ── MAP VIEW (IF TOGGLED) ── */}
              {viewMode === 'map' && (
                <div className={`fixed inset-0 z-30 w-screen h-[100dvh] flex flex-col bg-slate-50 overflow-hidden mb-4 ${
                  isFullscreen
                    ? 'md:fixed md:inset-0 md:z-[9999] md:w-screen md:h-screen md:rounded-none'
                    : 'md:relative md:inset-auto md:z-auto md:w-full md:rounded-3xl md:h-[620px]'
                }`}>
                  <FacultyJobMap
                    activeTab={activeTab}
                    jobs={paginatedJobs}
                    faculty={paginatedFaculty}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalJobsCount={totalJobsCount}
                    onPageChange={handlePageChange}
                    selectedCity={selectedCities[0]}
                    onListTeacher={handleOpenListAsTeacher}
                    savedJobIds={savedJobIds}
                    toggleSaveJob={toggleSaveJob}
                    onCopyJobUrl={handleCopyJobUrl}
                    copiedJobId={copiedJobId}
                    onOpenConnect={handleOpenConnect}
                    className="w-full h-full relative"
                  />
                </div>
              )}



              {/* ── JOB CARDS FEED (COMPACT GOOGLE / LABSTER CARD) ── */}
              {activeTab === 'jobs' && viewMode !== 'map' && (
                <div className={
                  viewMode === 'grid3'
                    ? "grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3.5 w-full mt-2 sm:mt-2.5"
                    : viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 w-full mt-2 sm:mt-2.5"
                    : "space-y-3 w-full mt-2 sm:mt-2.5"
                }>
                  {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-2xs space-y-3 col-span-full">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#005689] flex items-center justify-center mx-auto">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900" style={{ color: '#003c6e' }}>
                        No Vacancies Match Your Filters
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        We strictly purge vacancies older than 30 days. Try clearing filters to see active opportunities across India.
                      </p>
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="px-4 py-2 bg-[#005689] text-white rounded-xl text-xs font-bold hover:bg-[#003c6e] transition-colors cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    paginatedJobs.map((job, index) => {
                      const isSaved = savedJobIds.includes(job.id);
                      const structuredAddress = formatStructuredAddress(job);
                      const sourceDisplayName = getSourceDisplayName(job.source);
                      const sourceBadgeColor = getSourceBadgeColor(job.source);

                      // Clean text tags (separated by dots just like Naukri SRP)
                      const cardTags = [
                        job.designation,
                        job.subject,
                        job.board,
                        job.roleType
                      ].filter(Boolean);

                      return (
                        <React.Fragment key={job.id}>
                          <div
                            className="bg-white border border-[#E7E7E7] hover:border-[#0A66C2] rounded-2xl p-4 sm:p-5 pb-3 sm:pb-3.5 transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md flex flex-col justify-between gap-3 group relative box-border overflow-visible"
                          >
                          <div className="space-y-2.5 min-w-0">
                            {/* Conditional Job Image Banner (Only if image_url is available) */}
                            {job.image_url && job.image_url.trim() !== '' && (
                              <div className="w-full aspect-[16/9] sm:aspect-[2/1] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 mb-2.5 relative">
                                <img
                                  src={job.image_url}
                                  alt={job.jobPostName}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                                  onError={(e) => {
                                    const parent = (e.target as HTMLElement).parentElement;
                                    if (parent) parent.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}

                            {/* Row 1: Title, School & Optional Logo (Hide if no valid image URL) */}
                            <div className="flex items-start justify-between gap-3 min-w-0">
                              <div className="min-w-0 flex-1 space-y-1">
                                <h2>
                                  <Link
                                    href={`/edu-network/teachers/job/${job.id}`}
                                    className="font-['Montserrat',sans-serif] font-bold text-[15.5px] sm:text-[16.5px] text-slate-900 group-hover:text-[#0A66C2] leading-snug line-clamp-2 block transition-colors break-words"
                                    title={job.jobPostName}
                                  >
                                    {job.jobPostName}
                                  </Link>
                                </h2>

                                {/* School Name + Very small source tag + Rating */}
                                <div className="flex items-center gap-2 flex-wrap text-[13px] text-slate-700">
                                  <span className="font-semibold text-slate-800" title={job.organisationName}>
                                    {job.organisationName}
                                  </span>
                                  {/* Very small source tag */}
                                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${sourceBadgeColor}`}>
                                    {sourceDisplayName}
                                  </span>
                                  {job.rating && (
                                    <span className="flex items-center gap-1 text-[11.5px] font-semibold text-slate-600 shrink-0">
                                      <Star size={11} className="fill-amber-400 text-amber-400" />
                                      <span>{job.rating}</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* School Logo: ONLY show if valid URL exists. If not available, completely hidden to not waste space */}
                              {job.organisationLogo && job.organisationLogo.trim() !== '' ? (
                                <div className="school-logo-box w-12 h-12 rounded-xl border border-slate-200/80 bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs relative">
                                  <img
                                    src={job.organisationLogo}
                                    alt={job.organisationName}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      // Hide whole logo container if image fails to load so no space is wasted
                                      const box = (e.target as HTMLElement).closest('.school-logo-box') as HTMLElement;
                                      if (box) box.style.display = 'none';
                                    }}
                                  />
                                </div>
                              ) : null}
                            </div>

                            {/* Row 2: Parameters (Experience | Salary) */}
                            <div className="flex items-center gap-2 sm:gap-2.5 text-slate-600 text-[12px] sm:text-[12.5px] font-medium flex-wrap pt-0.5">
                              {/* Experience */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Briefcase size={13} className="text-slate-400 shrink-0" />
                                <span>{job.minExperience ? `${job.minExperience}` : '0-3 Yrs'}</span>
                              </div>

                              <span className="text-slate-300">|</span>

                              {/* Salary (Google Green #0F9D58) */}
                              <div className="flex items-center gap-1 shrink-0">
                                <IndianRupee size={12} className={job.salary && job.salary !== '---' && job.salary !== 'Not Disclosed' ? 'text-[#0F9D58] shrink-0' : 'text-slate-400 shrink-0'} />
                                <span className={job.salary && job.salary !== '---' && job.salary !== 'Not Disclosed' ? 'font-bold text-[#0F9D58]' : 'text-slate-400'}>
                                  {formatCleanSalary(job.salary, false)}
                                </span>
                              </div>
                            </div>

                            {/* Row 3: Full Address & Distance Badge (Always Visible) */}
                            <div className="pt-0.5 flex items-center gap-2 flex-wrap">
                              {typeof job.distanceKm === 'number' ? (
                                <span className="text-[11px] font-bold text-[#004A75] bg-[#EBF3F8] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 border border-[#D0E6F5]">
                                  <MapPin size={11} className="text-[#004A75]" />
                                  <span>{job.distanceKm} km away</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleRequestLocation}
                                  className="text-[11px] font-semibold text-[#005689] bg-[#F0F7FB] hover:bg-[#E2F0F9] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 border border-[#CDE5F5] transition-colors cursor-pointer"
                                  title="Tap to allow location & calculate exact distance"
                                >
                                  <Navigation size={10} className="text-[#005689]" />
                                  <span>📍 Calculate Distance</span>
                                </button>
                              )}
                            </div>
                            <div className="pt-0.5">
                              <a
                                href={getGoogleMapsSearchUrl(job)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-start gap-1.5 text-slate-600 text-[12px] sm:text-[12.5px] font-medium hover:text-[#0A66C2] transition-colors group/loc"
                                title={`Open Google Maps for ${job.organisationName}, ${structuredAddress}`}
                              >
                                <MapPin size={13} className="text-[#005689] group-hover/loc:text-[#EA4335] shrink-0 mt-0.5 transition-colors" />
                                <span className="leading-snug break-words group-hover/loc:underline">
                                  {structuredAddress}
                                </span>
                              </a>
                            </div>

                            {/* Row 4: Only Lady Only badge (description completely removed) */}
                            {isJobForLady(job) && (
                              <div className="flex items-center pt-0.5">
                                <span className="inline-flex items-center gap-1.5 font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md text-[11px] select-none">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                  Lady Only
                                </span>
                              </div>
                            )}

                            {/* Row 5: Clean Text Tags separated by dots */}
                            {cardTags.length > 0 && (
                              <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 font-medium flex-wrap pt-0.5">
                                {cardTags.map((tag, tIdx, arr) => (
                                  <React.Fragment key={tIdx}>
                                    <span className="hover:text-slate-800 transition-colors">{tag}</span>
                                    {tIdx < arr.length - 1 && <span className="text-slate-300">•</span>}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Row 5: Footer (Post Date on Left, Share + Save + Details + Apply on Right) */}
                          <div className="pt-1.5 pb-0.5 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                            {(() => {
                              const age = getJobAgeInfo(job.openingDate);
                              return (
                                <div className={`text-[10.5px] sm:text-[11px] px-2 py-0.5 rounded-full border flex items-center gap-1.5 shrink-0 transition-colors ${age.badgeClass}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${age.dotClass}`} />
                                  <span>{age.label}</span>
                                </div>
                              );
                            })()}

                            <div className="flex items-center gap-1.5 sm:gap-2">
                              {/* Share Button */}
                              <button
                                type="button"
                                onClick={() => handleCopyJobUrl(job)}
                                className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                                title="Share Vacancy"
                              >
                                {copiedJobId === job.id ? <CheckCheck size={13} className="text-emerald-600" /> : <Share2 size={13} className="text-slate-400" />}
                                <span className="hidden sm:inline">Share</span>
                              </button>

                              {/* Save Button (Icon Only) */}
                              <button
                                type="button"
                                onClick={() => toggleSaveJob(job.id)}
                                className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition inline-flex items-center justify-center cursor-pointer shrink-0"
                                title={isSaved ? "Saved" : "Save Vacancy"}
                              >
                                <Bookmark size={14} className={isSaved ? "fill-[#0A66C2] text-[#0A66C2]" : "text-slate-400"} />
                              </button>

                              {/* Details Button */}
                              <Link
                                href={`/edu-network/teachers/job/${job.id}`}
                                className="h-9 px-3.5 sm:px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition inline-flex items-center justify-center"
                              >
                                Details
                              </Link>

                              {/* Apply Button */}
                              <a
                                href={job.applyUrl || job.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                  trackCseelEvent("job_apply_click", {
                                    job_id: job.id,
                                    job_title: job.jobPostName,
                                    school_name: job.organisationName,
                                    city: job.city,
                                    state: job.state,
                                    salary: job.salary,
                                    source: job.source,
                                  });
                                }}
                                className="h-9 px-4 sm:px-4.5 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold shadow-2xs transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <span>Apply</span>
                                <ExternalLink size={12} className="shrink-0" />
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* ── MID-FEED AD BANNER 1 (USER'S IMAGE BANNER) ── */}
                        {index === 3 && paginatedJobs.length >= 4 && (
                          <FacultyAdBanner
                            bannerNumber={1}
                            onRegisterClick={handleOpenListAsTeacher}
                          />
                        )}
                      </React.Fragment>
                      );
                    })
                  )}

                  {/* ── END OF FEED AD BANNER 2 (BOTTOM COMPANION BANNER) ── */}
                  {paginatedJobs.length > 0 && (
                    <FacultyAdBanner
                      bannerNumber={2}
                      onRegisterClick={handleOpenListAsTeacher}
                    />
                  )}
                </div>
              )}

              {/* ── VERIFIED FACULTY CARDS FEED ── */}
              {activeTab === 'faculty' && viewMode !== 'map' && (
                <div className={
                  viewMode === 'grid3'
                    ? "grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3.5 w-full mt-2 sm:mt-2.5"
                    : viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 w-full mt-2 sm:mt-2.5"
                    : "space-y-3 w-full mt-2 sm:mt-2.5"
                }>
                  {paginatedFaculty.map((f) => {
                    /* ── 1. COMPACT LIST VIEW (LinkedIn SRP Mobile Style) ── */
                    if (viewMode === 'compact') {
                      const fullLocation = [f.city, f.qualification].filter(Boolean).join(' • ');

                      return (
                        <div
                          key={f.id}
                          className="p-3 sm:p-3.5 bg-white border border-[#dadce0] hover:border-[#006FCC] rounded-xl sm:rounded-2xl transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-sm group relative flex flex-col w-full max-w-full overflow-hidden box-border"
                        >
                          {/* Content Area: Avatar + Details in 2 columns */}
                          <div className="flex items-start gap-3 min-w-0">
                            {/* Left: Avatar Div */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-slate-200 bg-slate-50 shrink-0 overflow-hidden shadow-2xs mt-0.5">
                              <img src={f.avatar} alt={f.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                            </div>

                            {/* Right: Content Div */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1.5 overflow-hidden">
                              {/* Name */}
                              <div className="flex items-start justify-between gap-1 min-w-0">
                                <h2 className="min-w-0 flex-1">
                                  <span
                                    className="font-['Montserrat',sans-serif] font-bold text-[14.5px] sm:text-[15.5px] text-[#0A66C2] hover:underline line-clamp-2 block leading-snug cursor-pointer break-words"
                                    onClick={() => handleOpenConnect(f)}
                                    title={f.name}
                                  >
                                    {f.name}
                                  </span>
                                </h2>
                              </div>

                              {/* Current Institute */}
                              <div className="text-[12px] sm:text-[12.5px] font-bold text-slate-800 break-words leading-tight" title={f.currentInstitute}>
                                {f.currentInstitute}
                              </div>

                              {/* Location */}
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 min-w-0 font-['Montserrat',sans-serif]">
                                <MapPin size={11} className="text-amber-600 shrink-0" />
                                <span className="break-words line-clamp-1 min-w-0">{fullLocation}</span>
                              </div>

                              {/* Salary & Meta Tags */}
                              <div className="flex items-center gap-2 pt-0.5 border-t border-slate-100 flex-wrap text-xs min-w-0">
                                <span className="font-extrabold text-emerald-600 text-[12.5px] sm:text-[13px] shrink-0">
                                  Exp: {f.expectedSalary}
                                </span>
                                <span className="text-slate-300 shrink-0">•</span>
                                <span className="px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-[#eef3fc] text-[#006FCC] border border-[#d3e3fd] shrink-0">
                                  {f.designation} · {f.subject}
                                </span>
                                <span className="text-[10.5px] text-slate-500 font-medium ml-auto shrink-0">
                                  {f.experienceYears}+ Yrs Exp
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Full-width Footer Strip with Negative Margin */}
                          <div className="pt-2.5 mt-3 -mx-3 -mb-3 sm:-mx-3.5 sm:-mb-3.5 px-3 sm:px-3.5 pb-2.5 bg-slate-50/60 rounded-b-2xl border-t border-slate-100 flex items-center justify-between gap-2">
                            {f.verified ? (
                              <span className="text-[10.5px] text-emerald-700 font-bold flex items-center gap-1 truncate font-['Montserrat',sans-serif]">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate">Verified</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 truncate font-['Montserrat',sans-serif]">
                                <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                                <span className="truncate">Pending Verification</span>
                              </span>
                            )}

                            <div className="flex items-center gap-3">
                              {/* Detail as plain text link */}
                              <Link
                                href={'/edu-network/teachers/' + f.id}
                                className="text-xs font-semibold text-slate-600 hover:text-[#0A66C2] hover:underline transition"
                              >
                                Detail
                              </Link>

                              {/* Connect button */}
                              <button
                                type="button"
                                onClick={() => handleOpenConnect(f)}
                                className="h-7 px-3.5 rounded-lg bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-bold transition inline-flex items-center justify-center gap-1 shadow-xs font-['Montserrat',sans-serif] cursor-pointer"
                              >
                                <Mail size={11} className="shrink-0" />
                                <span>Connect</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    /* ── 2. GRID VIEW (2-COL ON MOBILE / 3-COL ON DESKTOP) ── */
                    const isTwoCol = viewMode === 'grid';
                    return (
                      <div
                        key={f.id}
                        className={`relative flex flex-col justify-between border border-[#dadce0] hover:border-[#006FCC] rounded-2xl bg-white w-full max-w-full select-none overflow-hidden group box-border transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 min-w-0 ${
                          isTwoCol ? 'p-3 sm:p-4 space-y-2.5 sm:space-y-3' : 'p-4 sm:p-5 space-y-3.5'
                        }`}
                      >
                        <div className={`min-w-0 overflow-hidden ${isTwoCol ? 'space-y-1.5 sm:space-y-2' : 'space-y-2.5'}`}>
                          {/* Row 1: Designation Badge & Accreditation */}
                          <div className="flex items-center justify-between gap-1.5 min-w-0 flex-wrap">
                            <div className="flex items-center gap-1 min-w-0 flex-wrap">
                              <span className={`rounded-full font-semibold bg-[#eef3fc] text-[#006FCC] border border-[#d3e3fd] font-['Montserrat',sans-serif] shrink-0 ${
                                isTwoCol ? 'px-2 py-0.5 text-[9.5px] sm:text-[10.5px]' : 'px-2.5 py-0.5 text-[10.5px]'
                              }`}>
                                {f.designation} &bull; {f.subject}
                              </span>
                              {!isTwoCol && (
                                f.verified ? (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 font-['Montserrat',sans-serif]">
                                    <ShieldCheck size={11} className="text-emerald-600" />
                                    <span>Verified</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0 font-['Montserrat',sans-serif]">
                                    <Clock size={11} className="text-amber-600" />
                                    <span>Pending Verification</span>
                                  </span>
                                )
                              )}
                            </div>

                            <span className={`font-mono text-slate-400 shrink-0 font-['Montserrat',sans-serif] ${
                              isTwoCol ? 'text-[9.5px] sm:text-[11px]' : 'text-[11px]'
                            }`}>
                              {f.experienceYears}+ Yrs
                            </span>
                          </div>

                          {/* Row 2: Name & Avatar */}
                          <div className="flex items-start justify-between gap-2 min-w-0">
                            <div className="min-w-0 flex-1 space-y-0.5 overflow-hidden">
                              <h2>
                                <Link
                                  href={'/edu-network/teachers/' + f.id}
                                  className={`font-['Montserrat',sans-serif] font-bold text-[#003C6E] hover:text-[#006FCC] leading-snug tracking-tight block transition-colors line-clamp-2 break-words ${
                                    isTwoCol ? 'text-[13px] sm:text-[15.5px]' : 'text-[15.5px] sm:text-[16.5px]'
                                  }`}
                                  style={{ color: '#003C6E' }}
                                  title={f.name}
                                >
                                  {f.name}
                                </Link>
                              </h2>

                              <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-700 min-w-0">
                                <span className="font-semibold text-slate-800 break-words leading-tight" title={f.currentInstitute}>
                                  {f.currentInstitute}
                                </span>
                              </div>
                            </div>

                            {/* Avatar */}
                            <Link href={'/edu-network/teachers/' + f.id} className="w-14 h-14 shrink-0 aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 shadow-2xs block hover:opacity-90">
                              <img
                                src={f.avatar}
                                alt={f.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                              />
                            </Link>
                          </div>

                          {/* Row 3: Parameter Tuple (Location | Specialization) */}
                          <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[#656773] font-medium font-['Montserrat',sans-serif] py-1 border-y border-slate-100 ${
                            isTwoCol ? 'text-[10px] sm:text-xs' : 'text-xs'
                          }`}>
                            <span className="flex items-center gap-1 shrink-0">
                              <MapPin size={12} className="text-[#d97706]" />
                              <span className="text-slate-700 font-medium">{f.city}</span>
                            </span>
                            <span className="flex items-center gap-1 shrink-0">
                              <GraduationCap size={12} className="text-[#006FCC]" />
                              <span>{f.board || 'CBSE'}</span>
                            </span>
                          </div>

                          {/* Row 4: Bio */}
                          <p className={`text-[#656773] leading-relaxed ${
                            isTwoCol ? 'text-[11px] line-clamp-1 sm:line-clamp-2' : 'text-xs line-clamp-2'
                          }`}>
                            {f.bio}
                          </p>

                          {/* Row 5: Skills Tags */}
                          <div className={`items-center gap-1.5 flex-wrap pt-0.5 ${
                            isTwoCol ? 'hidden sm:flex' : 'flex'
                          }`}>
                            {f.skills.slice(0, 3).map((s, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center text-[10px] font-medium text-[#656773] bg-[#f8f9fa] px-2 py-0.5 rounded-full border border-[#dadce0] font-['Montserrat',sans-serif]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Row 6: Standard Labster CTA Action Footer */}
                        <div className="pt-2 sm:pt-3 border-t border-[#E8E9E9] flex items-center justify-between gap-1.5 mt-auto">
                          {f.verified ? (
                            <span className={`text-emerald-700 font-bold flex items-center gap-1 truncate font-['Montserrat',sans-serif] ${
                              isTwoCol ? 'text-[10px] sm:text-[11px]' : 'text-[11px]'
                            }`}>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">Verified</span>
                            </span>
                          ) : (
                            <span className={`text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 truncate font-['Montserrat',sans-serif] ${
                              isTwoCol ? 'text-[9.5px] sm:text-[10.5px]' : 'text-[10.5px]'
                            }`}>
                              <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                              <span className="truncate">Under Verification</span>
                            </span>
                          )}

                          <div className="flex items-center gap-1.5">
                            <Link
                              href={'/edu-network/teachers/' + f.id}
                              className={`bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center shadow-xs transition-all duration-200 active:scale-[0.98] ${
                                isTwoCol ? 'h-7.5 px-2 sm:h-9 sm:px-3 rounded-xl text-[10px] sm:text-xs' : 'h-9 px-3.5 rounded-[14px] text-xs'
                              }`}
                            >
                              Profile
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleOpenConnect(f)}
                              className={`bg-[#006FCC] hover:bg-[#005399] text-white font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1 shadow-xs hover:shadow transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                                isTwoCol ? 'h-7.5 px-2.5 sm:h-9 sm:px-3.5 rounded-xl text-[10.5px] sm:text-xs' : 'h-9 px-4 rounded-[14px] text-xs'
                              }`}
                            >
                              <Mail size={12} className="shrink-0" />
                              <span>Connect</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}


              {/* ── CLEAN RESPONSIVE NUMBERED PAGINATION BAR (25 ITEMS PER PAGE) ── */}
              {totalPages > 1 && (
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
                    Showing <span className="font-bold text-slate-800">{(currentPage - 1) * JOBS_PER_PAGE + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * JOBS_PER_PAGE, totalJobsCount)}</span> of <span className="font-bold text-slate-900">{totalJobsCount.toLocaleString()}</span> {activeTab === 'jobs' ? 'Vacancies' : 'Faculty'}
                  </div>

                  <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="h-8 px-2.5 sm:px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Numbered page pills */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                      .reduce((acc: (number | string)[], p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                          acc.push('...');
                        }
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, idx) => {
                        if (item === '...') {
                          return (
                            <span key={`dots-${idx}`} className="px-1 text-slate-400 text-xs select-none">
                              ...
                            </span>
                          );
                        }
                        const pageNum = item as number;
                        const isActive = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer select-none ${
                              isActive
                                ? 'bg-[#004A75] text-white shadow-sm'
                                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="h-8 px-2.5 sm:px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* ═══ COLUMN 3 (RIGHT): DYNAMIC CONTEXTUAL RIGHT PANEL (SWITCHES ACCORDING TO TAB) ═══ */}
            <aside className={`w-72 xl:w-80 shrink-0 ${viewMode === 'map' ? 'hidden' : 'hidden xl:flex'} flex-col gap-3.5 sticky top-[68px] max-h-[calc(100vh-80px)] overflow-y-auto pr-1.5 pb-6 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]`}>
              
              {/* ─── CASE A: WHEN ON JOBS TAB (SCHOOL RECRUITMENT & ALERTS) ─── */}
              {activeTab === 'jobs' && (
                <>
                  {/* Widget 1: Post a School Vacancy */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Building2 className="w-4 h-4 text-[#005689] shrink-0" />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#005689] truncate">
                          For Schools & Labs
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#EDF5FA] text-[#005689] text-[10px] font-bold shrink-0 border border-[#005689]/20 whitespace-nowrap">
                        Direct Indexing
                      </span>
                    </div>

                    <div className="space-y-1 pt-0.5">
                      <h4 className="text-[13.5px] font-bold text-slate-900 leading-snug" style={{ color: '#003c6e' }}>
                        Join Verified STEM Faculty Roster
                      </h4>
                      <p className="text-[11.5px] text-slate-500 leading-relaxed">
                        List yourself as a verified PGT, TGT, PRT or Lab Educator to connect directly with top schools.
                      </p>
                    </div>

                    <Link
                      href="/edu-network/teachers/register"
                      className="w-full py-2.5 px-3 bg-[#005689] hover:bg-[#003c6e] text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>+ List as Faculty</span>
                    </Link>
                  </div>

                  {/* Widget 2: Fresh Today Vacancies List */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                        <span>Fresh Today</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">Last 48h</span>
                    </div>

                    <div className="space-y-2">
                      {activeJobs.slice(0, 4).map((tj) => {
                        const salaryDisplay = (tj.salary && tj.salary.includes('LPA'))
                          ? `${tj.salary.split('-')[0].trim()} LPA`
                          : (tj.salary || 'Best in Industry');
                        return (
                          <Link
                            key={tj.id}
                            href={`/edu-network/teachers/job/${tj.id}`}
                            className="block p-2.5 rounded-xl bg-slate-50/70 hover:bg-[#EDF5FA] border border-slate-100 hover:border-[#005689]/30 transition-all group"
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#005689] line-clamp-1 leading-snug flex-1" style={{ color: '#003c6e' }}>
                                {tj.jobPostName}
                              </h5>
                              <span className="text-[10px] font-bold text-[#005689] shrink-0 whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                {salaryDisplay}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                              <span className="truncate flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{tj.city}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium shrink-0">
                                {tj.designation}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Widget 3: Instant STEM Job Alerts */}
                  <div className="bg-[#EDF5FA] rounded-2xl p-4 border border-[#005689]/20 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[#005689] font-bold">
                      <Bell className="w-4 h-4 text-[#005689] shrink-0" />
                      <span className="text-xs">Instant Job Notifications</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Get real-time alerts whenever a verified school posts PGT/TGT openings matching your subject.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShareToastMessage("Job Alert preferences saved! You will receive relevant openings.")}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-[#005689]/30 text-[#005689] font-bold text-xs hover:bg-blue-50 transition-all cursor-pointer shadow-2xs"
                    >
                      Enable Instant Alerts
                    </button>
                  </div>
                </>
              )}

              {/* ─── CASE B: WHEN ON FACULTY TAB (LIST AS TEACHER & TEACHER ONBOARDING) ─── */}
              {activeTab === 'faculty' && (
                <>
                  {/* Widget 1: LIST YOURSELF AS VERIFIED FACULTY (Requested Feature) */}
                  <div className="bg-white rounded-2xl p-4 border border-[#005689]/30 shadow-xs space-y-2.5 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <GraduationCap className="w-4 h-4 text-[#005689] shrink-0" />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#005689] truncate">
                          Teacher Onboarding
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#EDF5FA] text-[#005689] text-[10px] font-bold shrink-0 border border-[#005689]/20 whitespace-nowrap">
                        Direct Connect
                      </span>
                    </div>

                    <div className="space-y-1 pt-0.5">
                      <h4 className="text-[13.5px] font-bold text-slate-900 leading-snug" style={{ color: '#003c6e' }}>
                        List Yourself as a Verified Faculty
                      </h4>
                      <p className="text-[11.5px] text-slate-500 leading-relaxed">
                        Join India&apos;s verified experiential educator directory. Get discovered directly by principals with zero commission.
                      </p>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Verified Faculty Badge</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Direct School Invitations</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>100% Direct Contact</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenListAsTeacher}
                      className="w-full py-2.5 px-3 bg-[#005689] hover:bg-[#003c6e] text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Register as STEM Faculty</span>
                    </button>
                  </div>

                  {/* Widget 2: Verification Criteria */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2 text-xs">
                    <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-2">
                      Verification Criteria
                    </span>
                    <ul className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                      <li className="flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#005689] mt-0.5 shrink-0" />
                        <span><strong>STEM Degree:</strong> M.Sc., Ph.D., B.Ed., or B.Tech with specialization.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#005689] mt-0.5 shrink-0" />
                        <span><strong>Lab Practicals:</strong> Experience in optical, titration, or ATL sessions.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#005689] mt-0.5 shrink-0" />
                        <span><strong>NEP 2020:</strong> Inquiry-based experiential learning pedagogy.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Widget 3: Active School Inquiries Counter */}
                  <div className="bg-[#EDF5FA] rounded-2xl p-4 border border-[#005689]/20 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#005689] text-xs">Active Inquiries</span>
                      <span className="text-base font-black text-[#005689]">58+</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Schools actively reviewing verified teacher profiles across Delhi NCR, Mumbai, and Bengaluru this week.
                    </p>
                  </div>
                </>
              )}

            </aside>

          </div>
        </main>

        {/* ─── MODAL 2: "POST A SCHOOL VACANCY" MODAL ─── */}
        {isPostJobOpen && (
          <div className="fixed inset-0 z-[99999] flex items-start justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-20 sm:pt-10">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto my-auto">
              
              <button
                onClick={() => setIsPostJobOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {postJobSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>Vacancy Submitted for Indexing!</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Thank you. Your school vacancy for {postJobForm.postTitle} has been queued for verification and will go live within 12 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePostJobSubmit} className="space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#005689]">School Vacancy Submission</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5" style={{ color: '#003c6e' }}>
                      Post a School Teaching Vacancy
                    </h3>
                    <p className="text-xs text-slate-500">
                      Reach qualified STEM educators looking for school appointments. All entries are verified before indexing.
                    </p>
                  </div>

                  {/* Security Error Alert */}
                  {securityError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold block">Security & Validation Alert</span>
                        <span>{securityError}</span>
                      </div>
                    </div>
                  )}

                  {/* 1. School Profile Check (Auto-linked if profile already created) */}
                  {existingSchoolProfile && !useCustomSchoolDetails ? (
                    <div className="p-3 bg-blue-50/90 border border-blue-200/90 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#005689] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                          🏫
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold text-[#005689] tracking-wider block">Linked School Profile</span>
                          <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">{existingSchoolProfile.schoolName}</h4>
                          <p className="text-[10.5px] text-slate-500 truncate">
                            {existingSchoolProfile.email} {existingSchoolProfile.phone ? `· ${existingSchoolProfile.phone}` : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUseCustomSchoolDetails(true)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline shrink-0 cursor-pointer"
                        title="Change school details"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-slate-700 block">School / Institution Name *</label>
                          {existingSchoolProfile && (
                            <button
                              type="button"
                              onClick={() => setUseCustomSchoolDetails(false)}
                              className="text-[10.5px] font-semibold text-blue-600 hover:underline cursor-pointer"
                            >
                              Use Linked Profile
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={70}
                          placeholder="e.g. Delhi Public School (Max 70 chars)"
                          value={postJobForm.schoolName}
                          onChange={(e) => setPostJobForm({ ...postJobForm, schoolName: e.target.value })}
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Official School Email *</label>
                          <input
                            type="email"
                            required
                            maxLength={60}
                            placeholder="careers@school.edu"
                            value={postJobForm.email}
                            onChange={(e) => setPostJobForm({ ...postJobForm, email: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">School HR Phone *</label>
                          <input
                            type="tel"
                            required
                            maxLength={15}
                            placeholder="+91 98765 43210"
                            value={postJobForm.phone}
                            onChange={(e) => setPostJobForm({ ...postJobForm, phone: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 2. Job Post Title */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Job Post Title *</label>
                    <input
                      type="text"
                      required
                      maxLength={60}
                      placeholder="e.g. PRT Primary Science & Hands-on Discovery Lead (Max 60 chars)"
                      value={postJobForm.postTitle}
                      onChange={(e) => setPostJobForm({ ...postJobForm, postTitle: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>

                  {/* 3. Backend Categorization Tags (Not displayed on card - used strictly for backend indexing & filters) */}
                  <div className="p-3 bg-slate-50/90 border border-slate-200/90 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800">
                        Post Classification <span className="text-slate-400 font-normal">(Backend filter tags)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 italic">Not shown as card badges</span>
                    </div>

                    {/* Department / Category: Academic, Non-Academic, Technical, Administration */}
                    <div>
                      <label className="text-[10.5px] font-semibold text-slate-600 block mb-1">Post Category *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {[
                          { id: 'Academic', label: 'Academic' },
                          { id: 'Non-Academic', label: 'Non-Academic' },
                          { id: 'Technical', label: 'Technical / Lab' },
                          { id: 'Administration', label: 'Administration' }
                        ].map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setPostJobForm({ ...postJobForm, postCategory: cat.id })}
                            className={`py-1.5 px-2 rounded-lg text-[10.5px] font-semibold transition border cursor-pointer text-center ${
                              postJobForm.postCategory === cat.id
                                ? 'bg-[#005689] text-white border-[#005689] shadow-2xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Teaching Level, Role Commitment & Subject */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      <div>
                        <label className="text-[10.5px] font-semibold text-slate-600 block mb-1">Cadre / Level *</label>
                        <select
                          value={postJobForm.designation}
                          onChange={(e) => setPostJobForm({ ...postJobForm, designation: e.target.value })}
                          className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                        >
                          <option value="PGT">PGT (11-12)</option>
                          <option value="TGT">TGT (6-10)</option>
                          <option value="PRT">PRT (1-5)</option>
                          <option value="Pre-Primary">Pre-Primary</option>
                          <option value="Lab In-Charge">Lab In-Charge</option>
                          <option value="ATL Mentor">ATL Mentor</option>
                          <option value="Coordinator">Coordinator</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10.5px] font-semibold text-slate-600 block mb-1">Role Type *</label>
                        <select
                          value={postJobForm.roleType}
                          onChange={(e) => setPostJobForm({ ...postJobForm, roleType: e.target.value })}
                          className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                        >
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Contractual">Contractual</option>
                          <option value="Visiting Faculty">Visiting Faculty</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10.5px] font-semibold text-slate-600 block mb-1">Discipline / Subject *</label>
                        <select
                          value={postJobForm.subject}
                          onChange={(e) => setPostJobForm({ ...postJobForm, subject: e.target.value })}
                          className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                        >
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Biology">Biology</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Robotics & AI">Robotics & AI</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="General Science">General Science</option>
                          <option value="Composite Lab">Composite Lab</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 4. Salary Band (Min LPA & Max LPA) */}
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                        <span>Offered Salary Band (LPA) *</span>
                      </label>
                      <span className="font-bold text-emerald-700 text-xs bg-white px-2 py-0.5 rounded border border-emerald-300 shadow-2xs">
                        ₹{postJobForm.salaryMin || '0'} - ₹{postJobForm.salaryMax || '0'} LPA
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-600 block mb-1 font-medium">Min Salary (LPA)</span>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          max="50"
                          required
                          placeholder="e.g. 6.0"
                          value={postJobForm.salaryMin}
                          onChange={(e) => setPostJobForm({ ...postJobForm, salaryMin: e.target.value })}
                          className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-600 block mb-1 font-medium">Max Salary (LPA)</span>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          max="60"
                          required
                          placeholder="e.g. 9.5"
                          value={postJobForm.salaryMax}
                          onChange={(e) => setPostJobForm({ ...postJobForm, salaryMax: e.target.value })}
                          className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Experience Required */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Experience Requirement *</label>
                      <select
                        value={postJobForm.experienceYears}
                        onChange={(e) => setPostJobForm({ ...postJobForm, experienceYears: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      >
                        <option value="0">Fresher (0 Years)</option>
                        <option value="1">1+ Years Experience</option>
                        <option value="2">2+ Years Experience</option>
                        <option value="3">3+ Years Experience</option>
                        <option value="4">4+ Years Experience</option>
                        <option value="5">5+ Years Experience</option>
                        <option value="7">7+ Years Experience</option>
                        <option value="10">10+ Years Experience</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Custom Yrs Exp (Max 2 Digits)</label>
                      <input
                        type="number"
                        min="0"
                        max="40"
                        maxLength={2}
                        placeholder="e.g. 3"
                        value={postJobForm.experienceYears}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, 2);
                          setPostJobForm({ ...postJobForm, experienceYears: val });
                        }}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      />
                    </div>
                  </div>

                  {/* 6. Dependent State & District Dropdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">State / UT *</label>
                      <select
                        value={postJobForm.state}
                        onChange={(e) => {
                          const newState = e.target.value;
                          const districts = INDIAN_STATES_DISTRICTS[newState] || [];
                          setPostJobForm({
                            ...postJobForm,
                            state: newState,
                            district: districts[0] || '',
                          });
                        }}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      >
                        {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">District / City * (Auto-updated)</label>
                      <select
                        value={postJobForm.district}
                        onChange={(e) => setPostJobForm({ ...postJobForm, district: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      >
                        {(INDIAN_STATES_DISTRICTS[postJobForm.state] || []).map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 7. Local Address & Pincode + Location Auto-detect */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Local Address * <span className="text-slate-400 font-normal">(Max 80 chars, max 2 lines)</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={80}
                          placeholder="e.g. Sector 14, Near Rapid Metro / Main Campus Road"
                          value={postJobForm.address}
                          onChange={(e) => setPostJobForm({ ...postJobForm, address: e.target.value })}
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Pincode * (6 Digits)</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          pattern="^[1-9][0-9]{5}$"
                          placeholder="e.g. 122001"
                          value={postJobForm.pincode}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setPostJobForm({ ...postJobForm, pincode: clean });
                          }}
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDetectLocation('job')}
                      disabled={isDetectingLocation}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <MapPin size={12} className="text-amber-600" />
                      <span>{isDetectingLocation ? 'Detecting GPS Location...' : '📍 Auto-detect GPS Location'}</span>
                    </button>
                  </div>

                  {/* 8. Job Description with Increased Height & FULL VIEW Option */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Job Description & Laboratory Scope *
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-medium ${
                          postJobForm.description.length > 1000 || (postJobForm.description.trim() ? postJobForm.description.trim().split(/\s+/).length : 0) > 200
                            ? 'text-red-600 font-bold'
                            : 'text-slate-500'
                        }`}>
                          {postJobForm.description.trim() ? postJobForm.description.trim().split(/\s+/).length : 0} / 200 words · {postJobForm.description.length} / 1000 chars
                        </span>

                        {/* Full View Button */}
                        <button
                          type="button"
                          onClick={() => setIsDescriptionFullscreen(true)}
                          className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-[#005689] text-[10.5px] font-bold border border-blue-200 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                          title="Expand to Full View Editor"
                        >
                          <Maximize2 size={11} />
                          <span>Full View</span>
                        </button>
                      </div>
                    </div>

                    {/* Formatting Editor Toolbar */}
                    <div className="flex items-center gap-1 p-1.5 bg-slate-100 rounded-t-xl border border-slate-200 border-b-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => insertFormatting('**', '**')}
                        className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-200 shadow-2xs cursor-pointer"
                        title="Bold Text"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('### ', '\n')}
                        className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-200 shadow-2xs cursor-pointer"
                        title="Section Heading"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('\n\n', '')}
                        className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-200 shadow-2xs cursor-pointer"
                        title="New Paragraph"
                      >
                        ¶ Para
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('1. ', '\n2. \n')}
                        className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-200 shadow-2xs cursor-pointer"
                        title="Numbered List"
                      >
                        1. 2. List
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('• ', '\n• \n')}
                        className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-200 shadow-2xs cursor-pointer"
                        title="Bullet List"
                      >
                        • Bullets
                      </button>
                    </div>

                    <textarea
                      id="postJobDescriptionTextarea"
                      rows={7}
                      required
                      maxLength={1000}
                      placeholder="Specify duties, lab responsibilities, facilities (TA/DA/HRA), and school norms... Strictly no links or scripts allowed."
                      value={postJobForm.description}
                      onChange={(e) => setPostJobForm({ ...postJobForm, description: e.target.value })}
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-b-xl focus:outline-none focus:border-[#005689] font-mono leading-relaxed min-h-[150px]"
                    />

                    {/* Anti-Hacking Security Notice */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-0.5">
                      <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
                      <span>Security Guard: External links, scripts, and SQL syntax are automatically blocked.</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs bg-[#005689] hover:bg-[#003c6e] text-white transition-all shadow-xs cursor-pointer"
                  >
                    Submit Vacancy for National Indexing
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

        {/* ─── FULL VIEW DESCRIPTION EDITOR MODAL (Full View Overlay) ─── */}
        {isDescriptionFullscreen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 flex flex-col h-[85vh] max-h-[750px] relative">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
                    Job Description Editor — Full View
                  </h3>
                  <p className="text-xs text-slate-500">
                    Format your post description comfortably with headings and bullet points.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDescriptionFullscreen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Minimize & Return to Form"
                >
                  <Minimize2 size={14} />
                  <span>Minimize Editor</span>
                </button>
              </div>

              {/* Toolbar & Counter Row */}
              <div className="flex items-center justify-between gap-2 py-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 cursor-pointer"
                  >
                    B (Bold)
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ', '\n')}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 cursor-pointer"
                  >
                    H3 (Heading)
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n\n', '')}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200 cursor-pointer"
                  >
                    ¶ Para
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('1. ', '\n2. \n')}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200 cursor-pointer"
                  >
                    1. 2. Numbered
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('• ', '\n• \n')}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200 cursor-pointer"
                  >
                    • Bullets
                  </button>
                </div>

                <div className="text-xs font-mono font-medium text-slate-600">
                  {postJobForm.description.trim() ? postJobForm.description.trim().split(/\s+/).length : 0} / 200 words · {postJobForm.description.length} / 1000 characters
                </div>
              </div>

              {/* Full Height Textarea */}
              <textarea
                rows={14}
                maxLength={1000}
                placeholder="Write clear, comprehensive job description. Include qualifications, responsibilities, syllabus, and perks like TA/DA/HRA... No external links or scripts allowed."
                value={postJobForm.description}
                onChange={(e) => setPostJobForm({ ...postJobForm, description: e.target.value })}
                className="w-full flex-1 p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#005689] font-mono leading-relaxed resize-none"
              />

              {/* Bottom Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                <span className="text-[11px] text-slate-500">
                  Tip: Once done formatting, click <strong>Done & Minimize</strong> to return and submit.
                </span>

                <button
                  type="button"
                  onClick={() => setIsDescriptionFullscreen(false)}
                  className="px-5 py-2 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Minimize2 size={14} />
                  <span>Done & Minimize</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 3: DIRECT FACULTY CONNECT MODAL ─── */}
        {isConnectOpen && selectedFacultyForConnect && (
          <div className="fixed inset-0 z-[99999] flex items-start justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-20 sm:pt-10">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-auto">
              
              <button
                onClick={() => setIsConnectOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {connectSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>Inquiry Sent Successfully</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Your institutional inquiry has been routed to {selectedFacultyForConnect.name}. They will respond via phone or email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConnectSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <img
                      src={selectedFacultyForConnect.avatar}
                      alt={selectedFacultyForConnect.name}
                      className="w-12 h-12 rounded-xl object-cover border"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900" style={{ color: '#003c6e' }}>Connect with {selectedFacultyForConnect.name}</h3>
                      <p className="text-xs text-slate-500">{selectedFacultyForConnect.designation} · {selectedFacultyForConnect.subject} · {selectedFacultyForConnect.city}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={connectForm.name}
                      onChange={(e) => setConnectForm({ ...connectForm, name: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">School / Institution Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi Public School"
                      value={connectForm.orgName}
                      onChange={(e) => setConnectForm({ ...connectForm, orgName: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Official Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="principal@school.edu"
                        value={connectForm.email}
                        onChange={(e) => setConnectForm({ ...connectForm, email: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={connectForm.phone}
                        onChange={(e) => setConnectForm({ ...connectForm, phone: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Opportunity Details *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Specify your school's requirement, syllabus, and tentative joining timeline..."
                      value={connectForm.message}
                      onChange={(e) => setConnectForm({ ...connectForm, message: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#005689] hover:bg-[#003c6e] text-white transition-all shadow-xs cursor-pointer"
                  >
                    <span>Send Institutional Invitation</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
            {/* ─── INITIAL LOCATION PERMISSION PROMPT MODAL ─── */}
        {isLocationPromptOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-200 relative">
              <button
                type="button"
                onClick={() => {
                  setIsLocationPromptOpen(false);
                  sessionStorage.setItem('cseel_location_prompt_dismissed', 'true');
                }}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="w-14 h-14 bg-sky-50 text-[#005689] rounded-2xl flex items-center justify-center mx-auto border border-sky-100">
                <MapPin size={28} className="text-[#005689] animate-bounce" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Show Nearest Vacancies</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Allow location access to see the exact distance (in km) to every school & institute from your current location.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLocationPromptOpen(false);
                    handleRequestLocation();
                  }}
                  className="w-full py-2.5 px-4 bg-[#004A75] hover:bg-[#003859] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Navigation size={14} />
                  <span>Allow Location</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLocationPromptOpen(false);
                    sessionStorage.setItem('cseel_location_prompt_dismissed', 'true');
                  }}
                  className="w-full py-2 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── GPS PERMISSION GUIDANCE MODAL ─── */}
        {gpsErrorModalOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100">
                <MapPin size={26} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Enable Location Access</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{gpsErrorMessage}</p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGpsErrorModalOpen(false);
                    handleNearMeSort();
                  }}
                  className="w-full py-2.5 px-4 bg-[#004A75] hover:bg-[#003859] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Try Again / Allow
                </button>
                <button
                  type="button"
                  onClick={() => setGpsErrorModalOpen(false)}
                  className="w-full py-2 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
