'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PageTransition from '@/components/shared/PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import {
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
  getMinExperience
} from '@/data/facultyJobsData';
import { getAnnualSalaryNumber } from '@/lib/salaryUtils';
import { formatStructuredAddress, formatCleanSalary, getSourceDisplayName, getSourceBadgeColor } from '@/lib/jobCardUtils';
import FacultyFilterSheet from '@/components/teachers/FacultyFilterSheet';

const POPULAR_CITIES = [
  { name: 'Delhi NCR', icon: 'https://img.icons8.com/color/48/india-gate.png' },
  { name: 'Gurugram', icon: 'https://img.icons8.com/color/48/city.png' },
  { name: 'Noida', icon: 'https://img.icons8.com/color/48/building.png' },
  { name: 'Mumbai', icon: 'https://img.icons8.com/color/48/gateway-of-india.png' },
  { name: 'Pune', icon: 'https://img.icons8.com/color/48/city.png' },
  { name: 'Bengaluru', icon: 'https://img.icons8.com/color/48/commercial.png' },
  { name: 'Hyderabad', icon: 'https://img.icons8.com/color/48/charminar.png' },
  { name: 'Jaipur', icon: 'https://img.icons8.com/color/48/hawa-mahal.png' },
  { name: 'Chandigarh', icon: 'https://img.icons8.com/color/48/city.png' },
  { name: 'Kolkata', icon: 'https://img.icons8.com/color/48/howrah-bridge.png' },
];

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

export default function TeachersDirectoryClient() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
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
  const [activeTab, setActiveTab] = useState<'jobs' | 'faculty'>('jobs');
  
  // View Mode: 'grid' (2 cols), 'grid3' (3 cols), 'compact' (list), or 'map' (map) - Default: 'compact' (List Grid)
  const [viewMode, setViewMode] = useState<'grid' | 'grid3' | 'compact' | 'map'>('compact');

  // Sidebar minimize state (exactly like school listing page)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [navBottomOffset, setNavBottomOffset] = useState<number>(54);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesignations, setSelectedDesignations] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedPortals, setSelectedPortals] = useState<string[]>([]);
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);
  const [urgentOnly, setUrgentOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'salary' | 'deadline' | 'experience' | 'rating'>('newest');

  // Mobile Filter Drawer & Menu States
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
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
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
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
      setIsAuthModalOpen(true);
      return;
    }
    setIsPostJobOpen(true);
  };

  const handleOpenListAsTeacher = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsListAsTeacherOpen(true);
  };


  // Dynamically calculate navbar bottom so sidebar is always strictly attached without hiding under navbar
  useEffect(() => {
    const updateOffset = () => {
      if (isFullscreen) {
        setNavBottomOffset(0);
        return;
      }
      const navbar = document.getElementById('site-navbar');
      if (navbar) {
        const rect = navbar.getBoundingClientRect();
        setNavBottomOffset(Math.max(0, Math.round(rect.bottom)));
      } else {
        setNavBottomOffset(54);
      }
    };

    updateOffset();
    window.addEventListener('scroll', updateOffset, { passive: true });
    window.addEventListener('resize', updateOffset, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateOffset);
      window.removeEventListener('resize', updateOffset);
    };
  }, [isFullscreen]);

  // Handle ESC key to exit fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  // Fetch trending searches
  useEffect(() => {
    fetch('/api/search/record-query')
      .then((res) => res.json())
      .then((data) => {
        if (data.trending && Array.isArray(data.trending) && data.trending.length > 0) {
          setTrendingSearches(data.trending.slice(0, 8));
        }
      })
      .catch(() => {});
  }, []);

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
  const [activeJobs, setActiveJobs] = useState<FacultyJobItem[]>(() => getActiveFacultyJobs());

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setActiveJobs(data.jobs);
        }
      })
      .catch((err) => console.warn('[Client] Jobs fetch error:', err));
  }, []);

  // Dynamic filter counts
  const dynamicCounts = useMemo(() => {
    const desCounts: Record<string, number> = {};
    const subCounts: Record<string, number> = {};
    const boardCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};

    if (activeTab === 'jobs') {
      activeJobs.forEach((job) => {
        if (job.designation) desCounts[job.designation] = (desCounts[job.designation] || 0) + 1;
        if (job.subject) subCounts[job.subject] = (subCounts[job.subject] || 0) + 1;
        if (job.board) boardCounts[job.board] = (boardCounts[job.board] || 0) + 1;
        if (job.city) cityCounts[job.city] = (cityCounts[job.city] || 0) + 1;
        if (job.state) stateCounts[job.state] = (stateCounts[job.state] || 0) + 1;
      });
    } else {
      VERIFIED_FACULTY_MEMBERS.forEach((fac) => {
        if (fac.designation) desCounts[fac.designation] = (desCounts[fac.designation] || 0) + 1;
        if (fac.subject) subCounts[fac.subject] = (subCounts[fac.subject] || 0) + 1;
        if (fac.board) boardCounts[fac.board] = (boardCounts[fac.board] || 0) + 1;
        if (fac.city) cityCounts[fac.city] = (cityCounts[fac.city] || 0) + 1;
        if (fac.state) stateCounts[fac.state] = (stateCounts[fac.state] || 0) + 1;
      });
    }

    return {
      designations: desCounts,
      subjects: subCounts,
      boards: boardCounts,
      cities: cityCounts,
      states: stateCounts,
    };
  }, [activeJobs, activeTab]);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return activeJobs.filter((job) => {
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

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          job.jobPostName.toLowerCase().includes(q) ||
          job.organisationName.toLowerCase().includes(q) ||
          job.city.toLowerCase().includes(q) ||
          (job.state && job.state.toLowerCase().includes(q)) ||
          (job.district && job.district.toLowerCase().includes(q)) ||
          job.subject.toLowerCase().includes(q) ||
          job.designation.toLowerCase().includes(q) ||
          job.shortDescription.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'salary') {
        const salA = getAnnualSalaryNumber(a.salary, a.salaryMax).max;
        const salB = getAnnualSalaryNumber(b.salary, b.salaryMax).max;
        if (salB !== salA) return salB - salA; // Strictly Highest to Lowest in annual INR!
        return new Date(b.openingDate || 0).getTime() - new Date(a.openingDate || 0).getTime();
      }
      if (sortBy === 'deadline') {
        const timeA = a.lastDate ? new Date(a.lastDate).getTime() : Infinity;
        const timeB = b.lastDate ? new Date(b.lastDate).getTime() : Infinity;
        return timeA - timeB;
      }
      return new Date(b.openingDate || 0).getTime() - new Date(a.openingDate || 0).getTime();
    });
  }, [activeJobs, selectedDesignations, selectedSubjects, selectedBoards, selectedCities, selectedStates, selectedJobTypes, selectedPortals, minSalaryFilter, urgentOnly, searchQuery, sortBy]);

  // Filtered Verified Faculty
  const filteredFaculty = useMemo(() => {
    return VERIFIED_FACULTY_MEMBERS.filter((faculty) => {
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
  }, [selectedDesignations, selectedSubjects, selectedBoards, selectedCities, searchQuery, sortBy]);

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

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedDesignations.length > 0 ||
    selectedSubjects.length > 0 ||
    selectedBoards.length > 0 ||
    selectedCities.length > 0 ||
    selectedStates.length > 0 ||
    selectedJobTypes.length > 0 ||
    selectedPortals.length > 0 ||
    minSalaryFilter > 0 ||
    urgentOnly;

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
    // 1. Phone Verification Mandatory Check
    if (teacherPhoneVerify.status !== 'verified' || !teacherPhoneVerify.token) {
      alert("Phone Verification Required: Please verify your 10-digit mobile number via our free missed-call gateway before submitting your profile.");
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

    // 4. Backend validation of phone verification token
    try {
      const valRes = await fetch('/api/auth/phone-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VALIDATE_TOKEN',
          phone: teacherOnboardingForm.phone,
          token: teacherPhoneVerify.token
        })
      });
      const valData = await valRes.json();
      if (!valData.success || !valData.valid) {
        alert("Mobile number verification failed: " + (valData.error || "Invalid token"));
        return;
      }
    } catch (err: any) {
      alert("Phone validation check error: " + err.message);
      return;
    }

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

  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const currentList = activeTab === 'jobs' ? activeJobs : VERIFIED_FACULTY_MEMBERS;
    currentList.forEach((item) => {
      POPULAR_CITIES.forEach((c) => {
        if (
          item.city.toLowerCase().includes(c.name.toLowerCase()) ||
          (c.name === 'Delhi NCR' && item.city.toLowerCase().includes('delhi'))
        ) {
          counts[c.name] = (counts[c.name] || 0) + 1;
        }
      });
    });
    return counts;
  }, [activeTab, activeJobs]);

  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const currentList = activeTab === 'jobs' ? activeJobs : VERIFIED_FACULTY_MEMBERS;
    currentList.forEach((item) => {
      if (item.state) {
        counts[item.state] = (counts[item.state] || 0) + 1;
      }
    });
    return counts;
  }, [activeTab, activeJobs]);

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
          setSelectedCities(['Delhi NCR']);
          setShareToastMessage('Showing opportunities near your GPS location (Delhi NCR)');
          setTimeout(() => setShareToastMessage(null), 3500);
        },
        () => {
          setSelectedCities(['Delhi NCR']);
          setShareToastMessage('Location permission denied — defaulting to Delhi NCR');
          setTimeout(() => setShareToastMessage(null), 3500);
        }
      );
    }
  };

  // Google M3 Search Bar (Matching School Directory)
  const renderSearchBar = (isCompact: boolean = true) => (
    <div className={`w-full ${isCompact ? 'max-w-2xl' : 'max-w-3xl'} flex flex-row items-center bg-white rounded-full shadow-2xs px-1.5 py-0.5 border border-slate-300 divide-x divide-slate-200 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#005689] focus-within:border-[#005689]`}>
      {/* State & District Selector */}
      <div className="relative shrink-0 z-50">
        <button
          type="button"
          onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
          className={`flex items-center justify-between gap-1 px-2.5 py-1.5 transition-all duration-200 group rounded-full hover:bg-slate-100 active:scale-95 cursor-pointer text-xs ${
            isCompact ? 'w-[125px] sm:w-[150px]' : 'w-[145px] sm:w-[175px]'
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-hidden">
            <div className="p-1 rounded-full bg-blue-50 text-[#005689] group-hover:scale-105 transition-transform shrink-0">
              <MapPin size={13} />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-900 truncate block">
              {selectedStates.length > 0
                ? selectedStates[0]
                : selectedCities.length > 0
                ? selectedCities[0]
                : 'All India'}
            </span>
          </div>
          <ChevronDown size={11} className={`text-slate-400 transition-transform shrink-0 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Location Dropdown Menu (Districts & States) */}
        {isLocationDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsLocationDropdownOpen(false)} />
            <div className="absolute top-full left-0 mt-2 w-[310px] sm:w-[350px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                {/* Tabs: Districts vs States */}
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setLocationTab('districts')}
                    className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                      locationTab === 'districts'
                        ? 'bg-[#005689] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Districts
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationTab('states')}
                    className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                      locationTab === 'states'
                        ? 'bg-[#005689] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    States
                  </button>
                </div>

                {(selectedCities.length > 0 || selectedStates.length > 0) && (
                  <button
                    type="button"
                    onClick={handleResetToAllCities}
                    className="text-[11px] text-[#005689] hover:underline font-bold cursor-pointer"
                  >
                    All India
                  </button>
                )}
              </div>

              {/* Search Inside Location Dropdown */}
              <div className="p-2 border-b border-slate-100">
                <input
                  type="text"
                  placeholder={locationTab === 'districts' ? "Search district or city..." : "Search state..."}
                  value={locationSearchInput}
                  onChange={(e) => setLocationSearchInput(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#005689]"
                />
              </div>

              <div className="p-2.5 grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                {locationTab === 'districts' ? (
                  POPULAR_CITIES
                    .filter((c) => !locationSearchInput || c.name.toLowerCase().includes(locationSearchInput.toLowerCase()))
                    .map((city) => {
                      const count = cityCounts[city.name] || 0;
                      const isSelected = selectedCities.includes(city.name);
                      return (
                        <button
                          key={city.name}
                          type="button"
                          onClick={() => handleSelectCity(city.name)}
                          className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition-all duration-200 text-left cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'bg-[#EDF5FA] text-[#005689] font-bold border border-[#005689]/20'
                              : 'text-slate-800 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <img
                              src={city.icon}
                              alt={city.name}
                              className="w-3.5 h-3.5 object-contain shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/48/marker.png'; }}
                            />
                            <span className="truncate whitespace-nowrap text-[11px]">{city.name}</span>
                          </div>
                          {count > 0 && (
                            <span className="text-[10px] font-bold text-[#005689] bg-[#EDF5FA] px-1.5 py-0.2 rounded-full shrink-0">
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })
                ) : (
                  Object.keys(INDIAN_STATES_DISTRICTS)
                    .filter((s) => !locationSearchInput || s.toLowerCase().includes(locationSearchInput.toLowerCase()))
                    .map((stateName) => {
                      const count = stateCounts[stateName] || 0;
                      const isSelected = selectedStates.includes(stateName);
                      return (
                        <button
                          key={stateName}
                          type="button"
                          onClick={() => handleSelectState(stateName)}
                          className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition-all duration-200 text-left cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'bg-[#EDF5FA] text-[#005689] font-bold border border-[#005689]/20'
                              : 'text-slate-800 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span className="truncate whitespace-nowrap text-[11px]">{stateName}</span>
                          {count > 0 && (
                            <span className="text-[10px] font-bold text-[#005689] bg-[#EDF5FA] px-1.5 py-0.2 rounded-full shrink-0">
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })
                )}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={handleResetToAllCities}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-bold text-[#005689] hover:bg-[#EDF5FA] rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Globe size={13} className="text-[#005689] shrink-0" />
                    <span>Pan-India Search (All Locations)</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#EDF5FA] text-[#005689] px-2 py-0.5 rounded-full border border-[#005689]/20">
                    {activeTab === 'jobs' ? activeJobs.length : VERIFIED_FACULTY_MEMBERS.length}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Search Input */}
      <div className="flex-1 flex items-center px-2 min-w-0 relative">
        <input
          ref={searchInputRef}
          type="text"
          placeholder={activeTab === 'jobs' ? "Search role, subject, school..." : "Search teacher, qualification..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
          className="w-full bg-transparent text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 font-medium focus:outline-none min-w-0 py-1"
        />

        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-1 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
            title="Clear search"
          >
            <X size={13} />
          </button>
        ) : (
          <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200 hidden sm:inline-block shrink-0">
            /
          </span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {trendingSearches.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={() => {
                    setSearchQuery(item.query);
                    setIsSearchFocused(false);
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
          onClick={() => {}}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#005689] hover:bg-[#003c6e] text-white flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
          title="Search"
        >
          <Search size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <PageTransition>
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
              top: ${navBottomOffset}px !important;
              height: calc(100vh - ${navBottomOffset}px) !important;
              max-height: calc(100vh - ${navBottomOffset}px) !important;
            }
          }
          @media (max-width: 767px) {
            ${viewMode === 'map' ? `
              html, body {
                overflow: hidden !important;
                height: 100% !important;
                height: 100dvh !important;
                max-height: 100dvh !important;
                position: fixed !important;
                width: 100% !important;
                overscroll-behavior: none !important;
                touch-action: none !important;
              }
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
          totalCount={activeTab === 'jobs' ? activeJobs.length : VERIFIED_FACULTY_MEMBERS.length}
          filteredCount={activeTab === 'jobs' ? filteredJobs.length : filteredFaculty.length}
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
          dynamicCounts={dynamicCounts}
          onResetAll={resetAllFilters}
          isSidebarMinimized={isSidebarMinimized}
          setIsSidebarMinimized={setIsSidebarMinimized}
        />

        {/* ── 3. Mobile Filter Drawer (< 768px) ── */}
        <FacultyFilterSheet
          mode="sheet"
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          activeTab={activeTab}
          totalCount={activeTab === 'jobs' ? activeJobs.length : VERIFIED_FACULTY_MEMBERS.length}
          filteredCount={activeTab === 'jobs' ? filteredJobs.length : filteredFaculty.length}
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
          dynamicCounts={dynamicCounts}
          onResetAll={resetAllFilters}
        />

        {/* ── 4. Main Content Area (Offset by fixed sidebar width) ── */}
        <main className={`flex-1 min-w-0 flex flex-col gap-3 transition-all duration-300 px-3 sm:px-4 md:pl-0 md:pr-4 lg:pr-5 ${
          isSidebarMinimized ? 'md:ml-14' : 'md:ml-[272px] lg:ml-[296px]'
        }`}>
          
          {/* ── Top Bar: Normal Flow (Floating on Mobile when viewMode === 'map') ── */}
          <div className={`transition-all duration-300 ${
            viewMode === 'map'
              ? 'fixed top-2.5 inset-x-2.5 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/90 p-1.5 md:relative md:top-auto md:inset-x-auto md:z-30 md:bg-white md:p-3 sm:md:p-4 md:rounded-2xl md:border md:border-gray-200 md:shadow-2xs flex flex-col gap-1.5 md:gap-2.5 mb-2 sm:mb-3'
              : 'bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col gap-2.5 mb-2 sm:mb-3'
          }`}>
            
            {/* Mobile View (< 768px) */}
            <div className="md:hidden flex flex-col gap-1.5 w-full">
              <div className="flex items-center gap-1 w-full">
                {/* Unified Search Input Bar */}
                <div className="relative flex-1 flex items-center bg-gray-100/90 rounded-xl px-2 py-1.5 border border-gray-200 focus-within:bg-white focus-within:border-blue-500 transition-all min-w-0">
                  {/* Select City Icon & Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsMobileCityDropdownOpen(!isMobileCityDropdownOpen)}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition shrink-0 pr-1.5 border-r border-gray-300 cursor-pointer"
                    title={selectedCities.length === 1 ? `Selected: ${selectedCities[0]}` : "Select City"}
                  >
                    <MapPin size={15} className={selectedCities.length > 0 ? 'text-blue-600' : 'text-gray-500'} />
                    {selectedCities.length === 1 && (
                      <span className="text-[11px] font-bold text-blue-600 max-w-[60px] truncate">
                        {selectedCities[0]}
                      </span>
                    )}
                    <ChevronDown size={11} className={`text-gray-400 transition-transform ${isMobileCityDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Search Text Input */}
                  <input
                    type="text"
                    placeholder={selectedCities.length === 1 ? `Search in ${selectedCities[0]}...` : (activeTab === 'jobs' ? "Search role, school..." : "Search teacher...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent px-2 py-0.5 text-xs text-gray-800 placeholder-gray-400 font-medium focus:outline-none min-w-0"
                  />

                  {/* Clear Text Icon */}
                  {searchQuery.trim() && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
                      title="Clear search"
                    >
                      <X size={12} />
                    </button>
                  )}

                  {/* Search Icon */}
                  <button
                    type="button"
                    onClick={() => {}}
                    className="p-1 text-blue-600 hover:text-blue-700 active:scale-90 transition shrink-0 cursor-pointer"
                    title="Search"
                  >
                    <Search size={16} />
                  </button>

                  {/* Mobile City Dropdown Menu */}
                  {isMobileCityDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsMobileCityDropdownOpen(false)} />
                      <div className="absolute top-full left-0 mt-1.5 w-[260px] bg-white rounded-2xl shadow-xl border border-gray-200 z-50 p-2 text-left animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-gray-100">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Popular Cities</span>
                          {selectedCities.length > 0 && (
                            <button
                              type="button"
                              onClick={handleResetToAllCities}
                              className="text-[10px] text-blue-600 font-bold cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                          {POPULAR_CITIES.map((c) => (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => handleSelectCity(c.name)}
                              className={`p-1.5 rounded-lg text-[11px] text-left truncate cursor-pointer ${
                                selectedCities.includes(c.name)
                                  ? 'bg-blue-50 text-blue-700 font-bold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile View Mode Switcher: 2-Grid, 1-Grid, List, Map */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200/90 shrink-0 gap-0.5">
                  {/* 2-Grid (2 Columns) */}
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-2xs font-bold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="2 Columns Grid"
                  >
                    <Columns2 size={13} />
                  </button>

                  {/* 1-Grid (Single Full Card) */}
                  <button
                    type="button"
                    onClick={() => setViewMode('grid3')}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      viewMode === 'grid3'
                        ? 'bg-white text-blue-600 shadow-2xs font-bold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="1 Column Full Card"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="2" y="2" width="12" height="12" rx="2" />
                    </svg>
                  </button>

                  {/* List Grid (Compact Single-Row List) */}
                  <button
                    type="button"
                    onClick={() => setViewMode('compact')}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      viewMode === 'compact'
                        ? 'bg-white text-blue-600 shadow-2xs font-bold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="Compact List View"
                  >
                    <List size={13} />
                  </button>

                  {/* Map View */}
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-[#1A73E8] text-white shadow-2xs font-bold'
                        : 'text-blue-700 hover:bg-blue-100/60'
                    }`}
                    title="Interactive Map View"
                  >
                    <MapIcon size={13} />
                  </button>
                </div>

                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#005689] flex items-center justify-center transition cursor-pointer relative shrink-0"
                  title="Filters"
                >
                  <SlidersHorizontal size={15} />
                  {hasActiveFilters && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />}
                </button>
              </div>

              {/* Mobile Tab Switcher (Hidden in mobile map mode to keep floating search bar compact) */}
              <div className={`items-center gap-1.5 pt-1 ${viewMode === 'map' ? 'hidden' : 'flex'}`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition text-center cursor-pointer ${
                    activeTab === 'jobs' ? 'bg-[#005689] text-white shadow-2xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Vacancies ({activeJobs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('faculty')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition text-center cursor-pointer ${
                    activeTab === 'faculty' ? 'bg-[#005689] text-white shadow-2xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Verified Faculty ({VERIFIED_FACULTY_MEMBERS.length})
                </button>
              </div>

              {/* Mobile Action & Count Row (Hidden in mobile map mode) */}
              <div className={`items-center justify-between gap-2 pt-2.5 pb-0.5 border-t border-slate-100 text-xs ${viewMode === 'map' ? 'hidden' : 'flex'}`}>
                <span className="text-[11px] font-bold text-slate-700">
                  {activeTab === 'jobs' ? `${filteredJobs.length} Vacancies` : `${filteredFaculty.length} Verified Faculty`}
                </span>

                <div className="flex items-center gap-1.5">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-100 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-800 border-none focus:outline-none"
                  >
                    <option value="newest">Newest</option>
                    <option value="salary">Salary</option>
                    <option value="deadline">Deadline</option>
                  </select>

                  {activeTab === 'jobs' ? (
                    <button
                      type="button"
                      onClick={handleOpenPostJob}
                      className="px-2.5 py-1 rounded-lg bg-[#005689] text-white font-bold text-[11px] hover:bg-[#003c6e] shadow-2xs cursor-pointer active:scale-95"
                    >
                      + Post
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenListAsTeacher}
                      className="px-2.5 py-1 rounded-lg bg-[#005689] text-white font-bold text-[11px] hover:bg-[#003c6e] shadow-2xs cursor-pointer active:scale-95"
                    >
                      + List
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop View (>= 768px): 2-Row Clean Responsive Layout (Zero Overlap Guaranteed) */}
            <div className="hidden md:flex flex-col gap-2 w-full min-w-0">
              {/* Row 1: Tab Switcher (Left) + Search Pill (Center) + Primary CTA (Right) */}
              <div className="flex items-center justify-between gap-3 w-full min-w-0">
                {/* Left: Tab Switcher */}
                <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'jobs' ? 'bg-white text-[#005689] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#005689]" />
                    <span>Vacancies ({activeJobs.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('faculty')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'faculty' ? 'bg-white text-[#005689] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#005689]" />
                    <span>Faculty ({VERIFIED_FACULTY_MEMBERS.length})</span>
                  </button>
                </div>

                {/* Center: Search Bar Pill */}
                <div className="flex-1 max-w-xl mx-auto min-w-0">
                  {renderSearchBar(true)}
                </div>

                {/* Right: Action CTA */}
                <div className="shrink-0">
                  {activeTab === 'jobs' ? (
                    <button
                      type="button"
                      onClick={handleOpenPostJob}
                      className="h-9 px-4 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white flex items-center gap-1.5 transition cursor-pointer text-xs font-bold shrink-0 shadow-sm hover:shadow active:scale-95"
                    >
                      <span>+ Post Vacancy</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenListAsTeacher}
                      className="h-9 px-4 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white flex items-center gap-1.5 transition cursor-pointer text-xs font-bold shrink-0 shadow-sm hover:shadow active:scale-95"
                    >
                      <span>+ List as Faculty</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Sub-bar with Results Count & Sort (Left) + View Mode Switcher (Right) */}
              <div className="flex items-center justify-between gap-3 pt-1.5 border-t border-slate-100 w-full min-w-0">
                {/* Left: Results Count & Sort By */}
                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  <h2 className="text-xs sm:text-[13px] font-bold text-slate-800 whitespace-nowrap">
                    {activeTab === 'jobs'
                      ? `Showing 1–${filteredJobs.length} of ${activeJobs.length} Vacancies`
                      : `Showing 1–${filteredFaculty.length} of ${VERIFIED_FACULTY_MEMBERS.length} Faculty`}
                  </h2>

                  <div className="h-3.5 w-px bg-slate-200" />

                  {/* Sort By Dropdown */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-bold text-slate-800 border-none focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="newest">Newest</option>
                      <option value="salary">Salary (Highest)</option>
                      <option value="deadline">Application Deadline</option>
                      {activeTab === 'faculty' && <option value="experience">Experience</option>}
                      {activeTab === 'faculty' && <option value="rating">Rating</option>}
                    </select>
                  </div>
                </div>

                {/* Right: View Mode Switcher */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200/70 shrink-0 gap-0.5">
                  {/* 2-Col Grid */}
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title="2 Columns Grid"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="2" width="6" height="12" rx="1.5" />
                      <rect x="9" y="2" width="6" height="12" rx="1.5" />
                    </svg>
                  </button>

                  {/* 3-Col Grid */}
                  <button
                    type="button"
                    onClick={() => setViewMode('grid3')}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition cursor-pointer ${
                      viewMode === 'grid3' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title="3 Columns Grid"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="2" width="3.8" height="12" rx="1" />
                      <rect x="6.1" y="2" width="3.8" height="12" rx="1" />
                      <rect x="11.2" y="2" width="3.8" height="12" rx="1" />
                    </svg>
                  </button>

                  {/* Compact List */}
                  <button
                    type="button"
                    onClick={() => setViewMode('compact')}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition cursor-pointer ${
                      viewMode === 'compact' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title="Compact List"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="2" width="14" height="3" rx="1" />
                      <rect x="1" y="6.5" width="14" height="3" rx="1" />
                      <rect x="1" y="11" width="14" height="3" rx="1" />
                    </svg>
                  </button>

                  {/* Map View */}
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition cursor-pointer ${
                      viewMode === 'map' ? 'bg-[#1A73E8] text-white shadow-2xs font-bold' : 'text-blue-700 hover:bg-blue-100/60'
                    }`}
                    title="Interactive Map View"
                  >
                    <MapIcon size={14} />
                  </button>

                  <div className="w-[1px] h-4 bg-gray-300 mx-0.5" />

                  {/* Fullscreen Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition cursor-pointer ${
                      isFullscreen ? 'bg-blue-600 text-white shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title={isFullscreen ? 'Restore Top Bar' : 'Expand Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ── Main Flex Layout: Center Feed + Extra Right Panel ── */}
          <div className="w-full flex items-start gap-4 sm:gap-5 mt-2 sm:mt-3">
            
            {/* Center Content: Cards Feed according to viewMode */}
            <div className="flex-1 min-w-0 space-y-3 overflow-hidden">
              
              {/* ── MAP VIEW (IF TOGGLED) ── */}
              {viewMode === 'map' && (
                <div className="fixed inset-0 z-30 w-screen h-[100dvh] flex flex-col md:relative md:inset-auto md:z-auto md:w-full md:rounded-3xl md:h-[620px] bg-slate-50 overflow-hidden mb-4">
                  <FacultyJobMap
                    activeTab={activeTab}
                    jobs={filteredJobs}
                    faculty={filteredFaculty}
                    selectedCity={selectedCities[0]}
                    onPostJob={handleOpenPostJob}
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
                    filteredJobs.map((job) => {
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
                        <div
                          key={job.id}
                          className="bg-white border border-[#E7E7E7] hover:border-[#0A66C2] rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md flex flex-col justify-between gap-3 group relative box-border overflow-hidden select-none"
                        >
                          <div className="space-y-2.5 min-w-0">
                            {/* Row 1: Title & Logo */}
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
                                  <span className="font-semibold text-slate-800 truncate" title={job.organisationName}>
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

                              {/* School Logo */}
                              <div className="w-12 h-12 rounded-xl border border-slate-200/80 bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs relative">
                                {job.organisationLogo ? (
                                  <img
                                    src={job.organisationLogo}
                                    alt={job.organisationName}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                      const fb = (e.target as HTMLElement).parentElement?.querySelector('.monogram-fb') as HTMLElement;
                                      if (fb) fb.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`monogram-fb w-full h-full rounded-lg bg-blue-50 text-[#006FCC] font-black text-xs items-center justify-center uppercase select-none ${job.organisationLogo ? 'hidden' : 'flex'}`}
                                >
                                  {(job.organisationName || 'SC').slice(0, 2)}
                                </div>
                              </div>
                            </div>

                            {/* Row 2: Parameters Tuple with Icons & Vertical Lines (Exp | Salary | Location) */}
                            <div className="flex items-center gap-2 sm:gap-2.5 text-slate-600 text-[12px] sm:text-[12.5px] font-medium flex-wrap pt-0.5">
                              {/* Experience */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Briefcase size={13} className="text-slate-400 shrink-0" />
                                <span>{job.minExperience ? `${job.minExperience}` : '0-3 Yrs'}</span>
                              </div>

                              <span className="text-slate-300">|</span>

                              {/* Salary */}
                              <div className="flex items-center gap-1 shrink-0">
                                <IndianRupee size={12} className="text-slate-400 shrink-0" />
                                <span className={job.salary && job.salary !== '---' && job.salary !== 'Not Disclosed' ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                                  {formatCleanSalary(job.salary, false)}
                                </span>
                              </div>

                              <span className="text-slate-300">|</span>

                              {/* Location: State + District + Local Address in District */}
                              <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
                                <MapPin size={13} className="text-slate-400 shrink-0" />
                                <span className="truncate" title={structuredAddress}>{structuredAddress}</span>
                              </div>
                            </div>

                            {/* Row 3: Short Description (with document icon) */}
                            {job.shortDescription && (
                              <div className="flex items-start gap-1.5 text-slate-500 text-[11.5px] sm:text-[12px] leading-relaxed line-clamp-1">
                                <FileText size={12} className="text-slate-400 shrink-0 mt-0.5" />
                                <span className="truncate">{job.shortDescription}</span>
                              </div>
                            )}

                            {/* Row 4: Clean Text Tags separated by dots (Lesson Planning · Teaching · Physics · TGT) */}
                            {cardTags.length > 0 && (
                              <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 font-medium flex-wrap">
                                {cardTags.map((tag, tIdx, arr) => (
                                  <React.Fragment key={tIdx}>
                                    <span className="hover:text-slate-800 transition-colors">{tag}</span>
                                    {tIdx < arr.length - 1 && <span className="text-slate-300">•</span>}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Row 5: Footer (Posted Date on Left, Share + Save + Details + Apply on Right) */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                            <div className="text-[11px] text-slate-400 font-medium">
                              {job.openingDate ? formatJobDisplayDate(job.openingDate) : 'Today'}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Share Button */}
                              <button
                                type="button"
                                onClick={() => handleCopyJobUrl(job)}
                                className="flex items-center gap-1 text-[11.5px] text-slate-500 hover:text-[#0A66C2] px-1.5 py-1 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                                title="Share Vacancy"
                              >
                                {copiedJobId === job.id ? <CheckCheck size={13} className="text-emerald-600" /> : <Share2 size={13} className="text-slate-400" />}
                                <span className="hidden sm:inline">Share</span>
                              </button>

                              {/* Save Button */}
                              <button
                                type="button"
                                onClick={() => toggleSaveJob(job.id)}
                                className="flex items-center gap-1 text-[11.5px] text-slate-500 hover:text-[#0A66C2] px-2 py-1 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                                title={isSaved ? "Saved" : "Save Vacancy"}
                              >
                                <Bookmark size={13} className={isSaved ? 'fill-[#0A66C2] text-[#0A66C2]' : 'text-slate-400'} />
                                <span>{isSaved ? 'Saved' : 'Save'}</span>
                              </button>

                              {/* Details Button */}
                              <Link
                                href={`/edu-network/teachers/job/${job.id}`}
                                className="text-[11.5px] font-semibold text-slate-600 hover:text-[#0A66C2] px-2.5 py-1 rounded-lg hover:bg-slate-50 transition"
                              >
                                Details
                              </Link>

                              {/* Apply Button */}
                              <a
                                href={job.applyUrl || job.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-7.5 px-3.5 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition inline-flex items-center justify-center gap-1 shadow-2xs"
                              >
                                <span>Apply</span>
                                <ExternalLink size={10} className="shrink-0" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })
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
                  {filteredFaculty.map((f) => {
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
                              <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
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
                            <span className="text-[10.5px] text-emerald-700 font-bold flex items-center gap-1 truncate font-['Montserrat',sans-serif]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">SARAS Verified</span>
                            </span>

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
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 font-['Montserrat',sans-serif]">
                                  <ShieldCheck size={11} className="text-emerald-600" />
                                  <span>SARAS</span>
                                </span>
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
                          <span className={`text-emerald-700 font-bold flex items-center gap-1 truncate font-['Montserrat',sans-serif] ${
                            isTwoCol ? 'text-[10px] sm:text-[11px]' : 'text-[11px]'
                          }`}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">Verified</span>
                          </span>

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
                        Hiring STEM Educators for Your School?
                      </h4>
                      <p className="text-[11.5px] text-slate-500 leading-relaxed">
                        Submit your PGT, TGT, PRT or Composite Lab vacancy for national indexing across verified STEM faculty.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenPostJob}
                      className="w-full py-2.5 px-3 bg-[#005689] hover:bg-[#003c6e] text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Post School Vacancy</span>
                    </button>
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
                        const salaryDisplay = tj.salary.includes('LPA')
                          ? `${tj.salary.split('-')[0].trim()} LPA`
                          : tj.salary;
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
                        <span>Verified CBSE SARAS Badge</span>
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

        {/* ─── MODAL 1: "LIST YOURSELF AS STEM FACULTY" ONBOARDING MODAL ─── */}
        {isListAsTeacherOpen && (
          <div className="fixed inset-0 z-[99999] flex items-start justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-20 sm:pt-10">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto my-auto space-y-4">
              
              <button
                onClick={() => setIsListAsTeacherOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {teacherOnboardingSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>Faculty Profile Submitted!</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Thank you, {teacherOnboardingForm.name}. Your verified profile with missed-call authentication token has been submitted and will appear across CSEEL EduNetwork.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTeacherOnboardingSubmit} className="space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#005689]">Teacher Onboarding & Profile</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5" style={{ color: '#003c6e' }}>
                      Register as a Verified STEM Faculty
                    </h3>
                    <p className="text-xs text-slate-500">
                      Create your educator profile with verified experience, past schools, and anti-spam contact privacy.
                    </p>
                  </div>

                  {/* 1. Name & Avatar Upload (with client-side canvas <= 10KB compression) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        maxLength={50}
                        placeholder="e.g. Dr. Arvind Joshi"
                        value={teacherOnboardingForm.name}
                        onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, name: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Profile Photo (Max 10KB)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-[#005689] hover:file:bg-blue-100 cursor-pointer w-full"
                      />
                      {isCompressingAvatar && (
                        <p className="text-[10px] text-amber-600 font-semibold mt-1">Compressing to WebP &lt;= 10KB...</p>
                      )}
                      {avatarCompressedSize !== null && !isCompressingAvatar && (
                        <p className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>{(avatarCompressedSize / 1024).toFixed(2)} KB (✓ WebP &lt;= 10KB)</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 2. Mobile Number with Missed-Call Verification Widget */}
                  <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#005689]" />
                        <span>Mobile Phone & Missed-Call Verification *</span>
                      </label>
                      {teacherPhoneVerify.status === 'verified' && (
                        <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono font-bold">+91</span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9876543210 (10 digits)"
                          disabled={teacherPhoneVerify.status === 'waiting' || teacherPhoneVerify.status === 'verified'}
                          value={teacherOnboardingForm.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setTeacherOnboardingForm({ ...teacherOnboardingForm, phone: val });
                          }}
                          className="w-full pl-11 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] font-mono"
                        />
                      </div>

                      {teacherPhoneVerify.status !== 'verified' ? (
                        <button
                          type="button"
                          onClick={() => handleInitiatePhoneVerify('teacher')}
                          disabled={teacherPhoneVerify.status === 'initiating'}
                          className="h-9 px-3.5 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Phone size={12} />
                          <span>{teacherPhoneVerify.status === 'waiting' ? 'Restart Verify' : 'Verify via Call'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setTeacherPhoneVerify(prev => ({ ...prev, status: 'idle', token: '' }))}
                          className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 cursor-pointer"
                        >
                          Change Number
                        </button>
                      )}
                    </div>

                    {/* 2-minute Missed Call Active Box */}
                    {teacherPhoneVerify.status === 'waiting' && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2 animate-in fade-in">
                        <div className="flex items-center justify-between text-amber-900 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                            <span>Missed Call Verification Active</span>
                          </span>
                          <span className="bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full text-[10.5px] font-mono">
                            ⏱️ {Math.floor(teacherPhoneVerify.countdown / 60).toString().padStart(2, '0')}:{(teacherPhoneVerify.countdown % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          Give 1 missed call to <strong>{teacherPhoneVerify.tollFreeNumber}</strong> from <strong>+91 {teacherPhoneVerify.phone}</strong>. Our gateway will automatically disconnect after 1 ring. Zero cost.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={`tel:${teacherPhoneVerify.tollFreeNumber.replace(/\s+/g, '')}`}
                            className="flex-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-center text-xs transition"
                          >
                            📞 Tap to Dial {teacherPhoneVerify.tollFreeNumber}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCheckCallVerify('teacher')}
                            className="py-1.5 px-3 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold rounded-lg text-xs transition cursor-pointer"
                          >
                            Check Now
                          </button>
                        </div>
                      </div>
                    )}

                    {teacherPhoneVerify.error && (
                      <p className="text-[11px] text-red-600 font-medium">{teacherPhoneVerify.error}</p>
                    )}
                  </div>

                  {/* 3. Email & Privacy Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        maxLength={60}
                        placeholder="teacher@gmail.com"
                        value={teacherOnboardingForm.email}
                        onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, email: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Contact Privacy Controls</label>
                      <div className="space-y-1.5 pt-1 text-[11px] text-slate-700">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={teacherOnboardingForm.phonePrivate}
                            onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, phonePrivate: e.target.checked })}
                            className="w-3.5 h-3.5 rounded text-[#005689]"
                          />
                          <span>Keep phone masked (+91 98***** 3210)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={teacherOnboardingForm.emailPrivate}
                            onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, emailPrivate: e.target.checked })}
                            className="w-3.5 h-3.5 rounded text-[#005689]"
                          />
                          <span>Keep email masked from public scrapers</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 4. Level, Subject, Board */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Teaching Level *</label>
                      <select
                        value={teacherOnboardingForm.designation}
                        onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, designation: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      >
                        <option value="PGT">PGT (11-12)</option>
                        <option value="TGT">TGT (6-10)</option>
                        <option value="PRT">PRT (1-5)</option>
                        <option value="Lab In-Charge">Lab In-Charge</option>
                        <option value="ATL Mentor">ATL Mentor</option>
                        <option value="Coordinator">Coordinator</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Core Discipline *</label>
                      <select
                        value={teacherOnboardingForm.subject}
                        onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, subject: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      >
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Robotics & AI">Robotics & AI</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="General Science">General Science</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Board Syllabus *</label>
                      <select
                        value={teacherOnboardingForm.board}
                        onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, board: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      >
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="Cambridge / IB">Cambridge / IB</option>
                        <option value="State Board">State Board</option>
                      </select>
                    </div>
                  </div>

                  {/* 5. Address Details with 📍 Detect My Location */}
                  <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>Address & Location *</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDetectLocation('teacher')}
                        disabled={isDetectingLocation}
                        className="text-[11px] font-bold text-[#005689] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Navigation size={12} className={isDetectingLocation ? 'animate-spin' : ''} />
                        <span>{isDetectingLocation ? 'Detecting...' : '📍 Detect My Location'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">State *</label>
                        <select
                          value={teacherOnboardingForm.state}
                          onChange={(e) => {
                            const newState = e.target.value;
                            const newDistricts = INDIAN_STATES_DISTRICTS[newState] || [];
                            setTeacherOnboardingForm({
                              ...teacherOnboardingForm,
                              state: newState,
                              district: newDistricts[0] || '',
                              city: newDistricts[0] || teacherOnboardingForm.city
                            });
                          }}
                          className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl"
                        >
                          {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">District *</label>
                        <select
                          value={teacherOnboardingForm.district}
                          onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, district: e.target.value, city: e.target.value })}
                          className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl"
                        >
                          {(INDIAN_STATES_DISTRICTS[teacherOnboardingForm.state] || []).map((dst) => (
                            <option key={dst} value={dst}>{dst}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">Local Address / Area</label>
                        <input
                          type="text"
                          maxLength={80}
                          placeholder="e.g. Sector 14, Near Metro Station"
                          value={teacherOnboardingForm.address}
                          onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, address: e.target.value })}
                          className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">PIN Code</label>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="122001"
                          value={teacherOnboardingForm.pincode}
                          onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, pincode: e.target.value.replace(/[^0-9]/g, '') })}
                          className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. Past Schools / Where I Have Taught */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Where You Have Worked / Past Schools (Max 120 chars)
                    </label>
                    <input
                      type="text"
                      maxLength={120}
                      placeholder="e.g. DPS R.K. Puram (PGT), Modern School (TGT Science)"
                      value={teacherOnboardingForm.pastSchools}
                      onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, pastSchools: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>

                  {/* 7. Key Skills & Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Highest Qualification *</label>
                      <input
                        type="text"
                        required
                        maxLength={60}
                        placeholder="e.g. M.Sc. Physics (DU), B.Ed."
                        value={teacherOnboardingForm.qualification}
                        onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, qualification: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Key Skills & Tags (Max 60 chars)</label>
                      <input
                        type="text"
                        maxLength={60}
                        placeholder="e.g. Ray Optics, LCR Circuits, NEP Lab"
                        value={teacherOnboardingForm.skills}
                        onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, skills: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                      />
                    </div>
                  </div>

                  {/* 8. Practical Experience & Bio */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Practical Experience & Bio * (Max 250 chars)</label>
                    <textarea
                      rows={3}
                      required
                      maxLength={250}
                      placeholder="Briefly describe your composite laboratory practical experience, viva preparation, or ATL mentoring background..."
                      value={teacherOnboardingForm.bio}
                      onChange={(e) => setTeacherOnboardingForm({ ...teacherOnboardingForm, bio: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#005689] hover:bg-[#003c6e] text-white transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={14} />
                    <span>Submit Verified Faculty Profile</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

        
        {/* ─── MODAL 3: AUTHENTICATION REQUIRED GUARD ─── */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 text-center space-y-4">
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#005689] flex items-center justify-center mx-auto border border-blue-200 shadow-2xs">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
                  Authentication Required
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To prevent fraudulent data and ensure 100% genuine school recruitment under SARAS guidelines, only verified logged-in users can post vacancies or create faculty profiles.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/login?redirect=/edu-network/teachers"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#005689] hover:bg-[#003c6e] text-white flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <span>Sign In with Account</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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
    </PageTransition>
  );
}
