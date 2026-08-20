'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, GraduationCap, Briefcase, Users, Search, MapPin,
  CheckCircle2, ShieldCheck, Star, Award, Plus, Download,
  ExternalLink, Phone, Mail, Filter, ArrowRight, Sparkles,
  BookOpen, Beaker, FileText, Send, X, Check, Globe, ChevronRight,
  Eye, HelpCircle, Navigation, Heart, SlidersHorizontal, CheckSquare,
  Square, Scale, MessageSquare, ChevronDown, DollarSign, Bookmark,
  ThumbsDown, Share2, Clock, Compass, Locate, Crosshair, Radio,
  RotateCcw, Sliders
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import ShareButton from '@/components/shared/ShareButton';
import {
  ALL_ORGANIZATIONS, ALL_TEACHERS, ALL_STUDENTS, ALL_JOBS,
  OrganizationItem, TeacherItem, StudentItem, EduJobItem
} from '@/lib/eduNetworkData';

// ── Indian Major Cities Coordinates Reference for Haversine Distance ────────
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'New Delhi': { lat: 28.6139, lng: 77.2090 },
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Bhubaneswar': { lat: 20.2961, lng: 85.8245 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 },
  'Dehradun': { lat: 30.3165, lng: 78.0322 },
  'Patna': { lat: 25.5941, lng: 85.1376 },
  'Bhopal': { lat: 23.2599, lng: 77.4126 },
  'Kochi': { lat: 9.9312, lng: 76.2673 },
  'Guwahati': { lat: 26.1445, lng: 91.7362 },
};

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function EduNetworkClient({ initialTab }: { initialTab?: 'orgs' | 'jobs' | 'teachers' | 'students' } = {}) {
  const [activeTab, setActiveTab] = useState<'orgs' | 'jobs' | 'teachers' | 'students'>(initialTab || 'orgs');

  const handleTabChange = (newTab: 'orgs' | 'jobs' | 'teachers' | 'students') => {
    setActiveTab(newTab);
    if (typeof window !== 'undefined') {
      const targetPath =
        newTab === 'jobs'
          ? '/edu-network/jobs'
          : newTab === 'teachers'
          ? '/edu-network/teachers'
          : newTab === 'students'
          ? '/edu-network/students'
          : '/edu-network';
      
      window.history.pushState({ tab: newTab }, '', targetPath);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const tabParam = params.get('tab');

      if (pathname.includes('/jobs') || tabParam === 'jobs') {
        setActiveTab('jobs');
      } else if (pathname.includes('/teachers') || tabParam === 'teachers') {
        setActiveTab('teachers');
      } else if (pathname.includes('/students') || tabParam === 'students') {
        setActiveTab('students');
      } else if (tabParam === 'orgs' || pathname.includes('/schools') || pathname.includes('/org')) {
        setActiveTab('orgs');
      }

      const jobParam = params.get('job');
      if (jobParam) {
        setSelectedJobId(jobParam);
      }

      const handlePopState = () => {
        const currentPath = window.location.pathname;
        const currentParams = new URLSearchParams(window.location.search);
        const currentTab = currentParams.get('tab');

        if (currentPath.includes('/jobs') || currentTab === 'jobs') {
          setActiveTab('jobs');
        } else if (currentPath.includes('/teachers') || currentTab === 'teachers') {
          setActiveTab('teachers');
        } else if (currentPath.includes('/students') || currentTab === 'students') {
          setActiveTab('students');
        } else {
          setActiveTab('orgs');
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);
  
  // ── Search & Filter State (UniApply Style) ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [maxMonthlyFee, setMaxMonthlyFee] = useState<number>(50000);
  const [selectedBoard, setSelectedBoard] = useState<string>('All');
  const [selectedClasses, setSelectedClasses] = useState<string>('All');
  const [selectedOrgType, setSelectedOrgType] = useState<string>('All');
  const [selectedAdmissionStatus, setSelectedAdmissionStatus] = useState<string>('All');
  const [selectedRatio, setSelectedRatio] = useState<string>('All');
  const [onlyWithJobs, setOnlyWithJobs] = useState<boolean>(false);
  const [onlyWithLabs, setOnlyWithLabs] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'feeAsc' | 'feeDesc' | 'jobsCount'>('popularity');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Subject filter for jobs / teachers
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // ── Split-View Job State (Indeed Style) ──
  const [selectedJobId, setSelectedJobId] = useState<string>(ALL_JOBS.length > 0 ? ALL_JOBS[0].id : '');
  const [jobSearchTitle, setJobSearchTitle] = useState('');
  const [jobSearchLocation, setJobSearchLocation] = useState('');
  const [jobSelectedSubject, setJobSelectedSubject] = useState<string>('All');
  const [jobSelectedRoleType, setJobSelectedRoleType] = useState<string>('All');
  const [jobSelectedCity, setJobSelectedCity] = useState<string>('All');
  const [jobSortBy, setJobSortBy] = useState<'relevance' | 'date' | 'salary'>('relevance');
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [dismissedJobIds, setDismissedJobIds] = useState<string[]>([]);

  // ── Teacher Geolocation & Near-Me Filters ──
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [teacherSelectedSubject, setTeacherSelectedSubject] = useState<string>('All');
  const [teacherSelectedCity, setTeacherSelectedCity] = useState<string>('All');
  const [teacherSelectedState, setTeacherSelectedState] = useState<string>('All');
  const [teacherPincode, setTeacherPincode] = useState('');
  const [teacherMinExp, setTeacherMinExp] = useState<number>(0);
  const [teacherSelectedRole, setTeacherSelectedRole] = useState<string>('All');
  const [teacherOnlyNep, setTeacherOnlyNep] = useState(false);
  const [teacherOnlyVerified, setTeacherOnlyVerified] = useState(false);
  const [teacherOnlySeekingJob, setTeacherOnlySeekingJob] = useState(false);
  const [teacherSortBy, setTeacherSortBy] = useState<'distance' | 'rating' | 'experience' | 'salary'>('rating');

  // GPS / Geolocation State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(50);
  const [isNearMeActive, setIsNearMeActive] = useState(false);

  // 3-Day Flash Job Seeking Activation Modal State
  const [isActivateJobSeekingModalOpen, setIsActivateJobSeekingModalOpen] = useState(false);
  const [activateJobSeekingForm, setActivateJobSeekingForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Physics' as TeacherItem['subject'],
    city: 'New Delhi',
    experienceYears: 4,
    qualification: 'M.Sc Physics, B.Ed',
    expectedSalary: '₹60,000 - ₹90,000 / month',
    availableFor: 'Full-Time' as const,
    immediateJoining: true,
  });
  const [activateJobSeekingSuccess, setActivateJobSeekingSuccess] = useState(false);

  // Teacher Direct Connect Modal State
  const [selectedTeacherForConnect, setSelectedTeacherForConnect] = useState<TeacherItem | null>(null);
  const [isTeacherConnectOpen, setIsTeacherConnectOpen] = useState(false);
  const [teacherConnectForm, setTeacherConnectForm] = useState({
    name: '',
    email: '',
    phone: '',
    orgName: '',
    message: '',
  });
  const [teacherConnectSuccess, setTeacherConnectSuccess] = useState(false);

  const handleDetectLocation = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: 'Your Current GPS Coordinates',
          });
          setIsNearMeActive(true);
          setTeacherSortBy('distance');
          setIsDetectingLocation(false);
        },
        (error) => {
          setUserLocation({
            lat: 28.6139,
            lng: 77.2090,
            label: 'Delhi NCR (Default Location)',
          });
          setIsNearMeActive(true);
          setTeacherSortBy('distance');
          setIsDetectingLocation(false);
        },
        { timeout: 8000 }
      );
    } else {
      setUserLocation({
        lat: 28.6139,
        lng: 77.2090,
        label: 'Delhi NCR (Default)',
      });
      setIsNearMeActive(true);
      setTeacherSortBy('distance');
    }
  };

  const handleResetLocation = () => {
    setUserLocation(null);
    setIsNearMeActive(false);
    setTeacherSortBy('rating');
  };

  const handleOpenTeacherConnect = (teacher: TeacherItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTeacherForConnect(teacher);
    setIsTeacherConnectOpen(true);
  };

  const handleTeacherConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherConnectSuccess(true);
    setTimeout(() => {
      setTeacherConnectSuccess(false);
      setIsTeacherConnectOpen(false);
      setTeacherConnectForm({ name: '', email: '', phone: '', orgName: '', message: '' });
    }, 1800);
  };

  // Interactive Likes & Shortlists
  const [likedOrgIds, setLikedOrgIds] = useState<string[]>(['isro-hq', 'dps-rkp']);

  // Comparison System
  const [compareList, setCompareList] = useState<OrganizationItem[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Quick Enquiry Modal
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedOrgForEnquiry, setSelectedOrgForEnquiry] = useState<OrganizationItem | null>(null);
  const [enquiryForm, setEnquiryForm] = useState({
    parentName: '',
    studentName: '',
    grade: 'Class 9',
    phone: '',
    email: '',
    preferredStream: 'Physics & STEM Labs',
    message: '',
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Modals for Jobs & Profile Creation
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [selectedJobToApply, setSelectedJobToApply] = useState<EduJobItem | null>(null);

  // Data lists
  const [jobsList, setJobsList] = useState<EduJobItem[]>(ALL_JOBS);
  const [orgsList, setOrgsList] = useState<OrganizationItem[]>(ALL_ORGANIZATIONS);
  const [teachersList, setTeachersList] = useState<TeacherItem[]>(ALL_TEACHERS);
  const [studentsList, setStudentsList] = useState<StudentItem[]>(ALL_STUDENTS);

  // Job creation form
  const [newJob, setNewJob] = useState({
    orgName: '',
    title: '',
    subject: 'Physics' as EduJobItem['subject'],
    roleType: 'Full-Time' as EduJobItem['roleType'],
    city: '',
    state: '',
    pincode: '',
    salary: '₹50,000 - ₹80,000 / month',
    experienceRequired: '2+ Years',
    description: '',
  });

  const [applyForm, setApplyForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    message: '',
  });
  const [applySuccess, setApplySuccess] = useState(false);

  const [profileForm, setProfileForm] = useState({
    role: 'Teacher' as 'Student' | 'Teacher' | 'Organization',
    name: '',
    email: '',
    city: '',
    state: '',
    pincode: '',
    subjectOrType: 'Physics',
    bio: '',
  });
  const [profileSuccess, setProfileSuccess] = useState(false);

  // ── UniApply Filters Calculation ──
  const filteredOrgs = useMemo(() => {
    return orgsList.filter((org) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        org.name.toLowerCase().includes(q) ||
        org.city.toLowerCase().includes(q) ||
        org.state.toLowerCase().includes(q) ||
        (org.locality && org.locality.toLowerCase().includes(q)) ||
        org.pincode.includes(q);

      const matchCity = selectedCity === 'All' || org.city === selectedCity;
      const matchBoard = selectedBoard === 'All' || org.board === selectedBoard;
      const matchClasses = selectedClasses === 'All' || org.classesOffered === selectedClasses;
      const matchType = selectedOrgType === 'All' || org.type === selectedOrgType;
      const matchStatus = selectedAdmissionStatus === 'All' || org.admissionStatus === selectedAdmissionStatus;
      
      const fee = org.monthlyFeesNum || 0;
      const matchFee = fee <= maxMonthlyFee;

      const matchJobs = !onlyWithJobs || org.openJobsCount > 0;
      const matchLabs = !onlyWithLabs || org.stemLabsCount >= 3;

      let matchRatio = true;
      if (selectedRatio === 'under15') {
        const rNum = parseInt(org.studentFacultyRatio?.split(':')[0] || '15');
        matchRatio = rNum <= 15;
      }

      return matchSearch && matchCity && matchBoard && matchClasses && matchType && matchStatus && matchFee && matchJobs && matchLabs && matchRatio;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'feeAsc') return (a.monthlyFeesNum || 0) - (b.monthlyFeesNum || 0);
      if (sortBy === 'feeDesc') return (b.monthlyFeesNum || 0) - (a.monthlyFeesNum || 0);
      if (sortBy === 'jobsCount') return b.openJobsCount - a.openJobsCount;
      return (b.likesCount || 0) - (a.likesCount || 0); // default popularity
    });
  }, [
    orgsList, searchQuery, selectedCity, selectedBoard, selectedClasses,
    selectedOrgType, selectedAdmissionStatus, maxMonthlyFee, onlyWithJobs,
    onlyWithLabs, selectedRatio, sortBy
  ]);

  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      if (dismissedJobIds.includes(job.id)) return false;

      const qTitle = (jobSearchTitle || searchQuery).toLowerCase().trim();
      const qLoc = jobSearchLocation.toLowerCase().trim();

      const matchTitle =
        !qTitle ||
        job.title.toLowerCase().includes(qTitle) ||
        job.subject.toLowerCase().includes(qTitle) ||
        job.orgName.toLowerCase().includes(qTitle) ||
        job.description.toLowerCase().includes(qTitle);

      const matchLoc =
        !qLoc ||
        job.city.toLowerCase().includes(qLoc) ||
        job.state.toLowerCase().includes(qLoc) ||
        job.pincode.includes(qLoc) ||
        (job.address && job.address.toLowerCase().includes(qLoc));

      const matchSubj = jobSelectedSubject === 'All' || job.subject === jobSelectedSubject;
      const matchRole = jobSelectedRoleType === 'All' || job.roleType === jobSelectedRoleType;
      const matchCity = jobSelectedCity === 'All' || job.city === jobSelectedCity;

      return matchTitle && matchLoc && matchSubj && matchRole && matchCity;
    }).sort((a, b) => {
      if (jobSortBy === 'salary') return b.salaryNumMax - a.salaryNumMax;
      if (jobSortBy === 'date') return a.id.localeCompare(b.id);
      return 0;
    });
  }, [jobsList, jobSearchTitle, searchQuery, jobSearchLocation, jobSelectedSubject, jobSelectedRoleType, jobSelectedCity, jobSortBy, dismissedJobIds]);

  const selectedJob = useMemo(() => {
    return filteredJobs.find((j) => j.id === selectedJobId) || filteredJobs[0] || ALL_JOBS[0];
  }, [selectedJobId, filteredJobs]);

  const filteredTeachers = useMemo(() => {
    const q = (teacherSearchQuery || searchQuery).toLowerCase().trim();

    return teachersList.map((t) => {
      // Get teacher reference coordinates
      const tCoords = CITY_COORDINATES[t.city] || {
        lat: 28.6139 + (parseInt(t.pincode || '110001') % 100) * 0.01,
        lng: 77.2090 + (parseInt(t.pincode || '110001') % 100) * 0.01
      };
      
      let distanceKm: number | null = null;
      if (userLocation) {
        distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, tCoords.lat, tCoords.lng);
      } else if (teacherSelectedCity !== 'All' && CITY_COORDINATES[teacherSelectedCity]) {
        const refCoords = CITY_COORDINATES[teacherSelectedCity];
        distanceKm = calculateDistanceKm(refCoords.lat, refCoords.lng, tCoords.lat, tCoords.lng);
      }

      return {
        ...t,
        distanceKm,
      };
    }).filter((t) => {
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.pincode.includes(q) ||
        t.currentInstitute.toLowerCase().includes(q) ||
        t.skills.some((s) => s.toLowerCase().includes(q));

      const matchSubject = teacherSelectedSubject === 'All' || t.subject === teacherSelectedSubject;
      const matchCity = teacherSelectedCity === 'All' || t.city === teacherSelectedCity;
      const matchState = teacherSelectedState === 'All' || t.state.toLowerCase().includes(teacherSelectedState.toLowerCase());
      const matchPin = !teacherPincode || t.pincode.startsWith(teacherPincode);
      const matchExp = t.experienceYears >= teacherMinExp;
      const matchRole = teacherSelectedRole === 'All' || t.availableFor.includes(teacherSelectedRole as any);
      const matchNep = !teacherOnlyNep || t.nepCertified;
      const matchVerified = !teacherOnlyVerified || t.verified;
      const matchSeeking = !teacherOnlySeekingJob || t.isActivelySeekingJob;
      
      // Distance filter when Near Me is active
      const matchDistance = !isNearMeActive || t.distanceKm === null || t.distanceKm === undefined || t.distanceKm <= maxDistanceKm;

      return matchSearch && matchSubject && matchCity && matchState && matchPin && matchExp && matchRole && matchNep && matchVerified && matchSeeking && matchDistance;
    }).sort((a, b) => {
      if (teacherSortBy === 'distance' && a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      if (teacherSortBy === 'rating') return b.rating - a.rating;
      if (teacherSortBy === 'experience') return b.experienceYears - a.experienceYears;
      return b.rating - a.rating;
    });
  }, [
    teachersList, teacherSearchQuery, searchQuery, teacherSelectedSubject,
    teacherSelectedCity, teacherSelectedState, teacherPincode, teacherMinExp,
    teacherSelectedRole, teacherOnlyNep, teacherOnlyVerified, teacherOnlySeekingJob,
    isNearMeActive, maxDistanceKm, userLocation, teacherSortBy
  ]);

  // Counts for 72-Hour Flash Job Seeking
  const activelySeekingAllIndiaCount = useMemo(() => {
    return teachersList.filter((t) => t.isActivelySeekingJob).length;
  }, [teachersList]);

  const activelySeekingNearbyCount = useMemo(() => {
    const targetCity = teacherSelectedCity !== 'All' ? teacherSelectedCity : (userLocation ? 'Your Region' : 'Delhi NCR');
    const localMatches = teachersList.filter((t) => t.isActivelySeekingJob && (targetCity === 'Your Region' || t.city.toLowerCase().includes(targetCity.toLowerCase()) || targetCity === 'All'));
    return localMatches.length > 0 ? localMatches.length : 14;
  }, [teachersList, teacherSelectedCity, userLocation]);

  const filteredStudents = useMemo(() => {
    return studentsList.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      return !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.schoolCollege.toLowerCase().includes(q);
    });
  }, [studentsList, searchQuery]);

  const handleActivateJobSeekingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activateJobSeekingForm.name || !activateJobSeekingForm.city) return;

    const newSeekingTeacher: TeacherItem = {
      id: `teacher-seeking-${Date.now()}`,
      name: activateJobSeekingForm.name,
      email: activateJobSeekingForm.email || `${activateJobSeekingForm.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@cseel.network`,
      phone: activateJobSeekingForm.phone || '+91 98765 00000',
      subject: activateJobSeekingForm.subject,
      qualification: activateJobSeekingForm.qualification,
      experienceYears: Number(activateJobSeekingForm.experienceYears) || 4,
      currentInstitute: 'Actively Looking (Ready for Immediate Joining)',
      city: activateJobSeekingForm.city,
      state: 'India',
      pincode: '110001',
      verified: true,
      nepCertified: true,
      rating: 4.9,
      reviewsCount: 1,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
      bio: `Verified ${activateJobSeekingForm.subject} educator with ${activateJobSeekingForm.experienceYears}+ years experience. Profile activated with 72-Hour Flash Job Seeking status.`,
      skills: ['Hands-on Experiments', 'NEP-2020 Pedagogy', 'Interactive Lab Demonstrations'],
      expectedSalary: activateJobSeekingForm.expectedSalary,
      availableFor: [activateJobSeekingForm.availableFor as any],
      isActivelySeekingJob: true,
      jobSeekingExpiresInHours: 72,
      immediateJoining: true,
      jobSeekingActivatedDate: 'Just activated (Active for 72h)',
    };

    setTeachersList((prev) => [newSeekingTeacher, ...prev]);
    setTeacherOnlySeekingJob(true);
    setActivateJobSeekingSuccess(true);
    setTimeout(() => {
      setActivateJobSeekingSuccess(false);
      setIsActivateJobSeekingModalOpen(false);
    }, 2000);
  };

  // Handlers
  const handleToggleLike = (orgId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedOrgIds((prev) =>
      prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]
    );
  };

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
      setEnquiryForm({ parentName: '', studentName: '', grade: 'Class 9', phone: '', email: '', preferredStream: 'Physics & STEM Labs', message: '' });
    }, 1800);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.orgName || !newJob.city) return;

    const created: EduJobItem = {
      id: `job-custom-${Date.now()}`,
      orgId: `org-custom-${Date.now()}`,
      orgName: newJob.orgName,
      orgLogo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop',
      orgRating: 4.9,
      title: newJob.title,
      subject: newJob.subject,
      roleType: newJob.roleType,
      jobTypeCategory: 'Permanent / Full-Time',
      jobShift: 'Day shift (8:00 AM – 3:30 PM)',
      city: newJob.city,
      state: newJob.state || 'India',
      pincode: newJob.pincode || '110001',
      address: `Institutional Sector, ${newJob.city}`,
      salary: newJob.salary,
      salaryNumMin: 50000,
      salaryNumMax: 85000,
      experienceRequired: newJob.experienceRequired,
      qualifications: 'B.Ed / M.Sc / Relevant Degree',
      openings: 1,
      postedDate: 'Just now',
      isUrgentlyHiring: true,
      easilyApply: true,
      benefits: ['Health insurance', 'Provident Fund', 'Lab allowance'],
      description: newJob.description || 'Join our dedicated STEM faculty and lab training program.',
      responsibilities: [
        'Conduct laboratory practicals and mentor students.',
        'Implement NEP-2020 curriculum standards.'
      ],
      requirements: ['Demonstrated laboratory practical teaching skills', 'NEP-2020 pedagogy familiarity'],
      verified: true,
    };

    setJobsList([created, ...jobsList]);
    setIsPostJobOpen(false);
    setActiveTab('jobs');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedJobToApply(null);
      setApplyForm({ name: '', email: '', phone: '', experience: '', message: '' });
    }, 1800);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email || !profileForm.city) return;
    setProfileSuccess(true);
    setTimeout(() => {
      setProfileSuccess(false);
      setIsCreateProfileOpen(false);
    }, 1800);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setMaxMonthlyFee(50000);
    setSelectedBoard('All');
    setSelectedClasses('All');
    setSelectedOrgType('All');
    setSelectedAdmissionStatus('All');
    setSelectedRatio('All');
    setOnlyWithJobs(false);
    setOnlyWithLabs(false);
    setSortBy('popularity');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f7f8fa] text-gray-900 pb-28">

        {/* ── HERO BANNER ────────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-r from-slate-950 via-[#002b4e] to-slate-950 text-white pt-10 pb-8 px-4 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>India's National Verified STEM EduNetwork Directory</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                Find Top Schools, Colleges & Institutes with Lab Infrastructure
              </h1>
              <p className="text-xs md:text-sm text-gray-300">
                Compare fees, boards, student-faculty ratios, verified STEM laboratories, and active teaching faculty jobs across India.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <Link
                href="/edu-network/jobs"
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                <span>Indeed Jobs Portal</span>
              </Link>
              <button
                onClick={() => setIsCreateProfileOpen(true)}
                className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Join Network</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── ROLE TABS WITH SOFT DISTINCT THEMES ───────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 mt-5">
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                {
                  id: 'orgs',
                  label: 'Schools & Institutions',
                  icon: Building2,
                  count: filteredOrgs.length,
                  color: 'blue',
                  desc: 'Fees, Boards & STEM Labs',
                  activeBg: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20 border-blue-600',
                  inactiveBg: 'bg-blue-50/60 hover:bg-blue-100/70 text-blue-900 border-blue-200/60',
                  badgeActive: 'bg-white text-blue-700',
                  badgeInactive: 'bg-blue-200/80 text-blue-900',
                  iconColor: 'text-blue-600',
                },
                {
                  id: 'jobs',
                  label: 'Teaching & Lab Jobs',
                  icon: Briefcase,
                  count: filteredJobs.length,
                  color: 'emerald',
                  desc: 'Indeed Career Hub',
                  activeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 border-emerald-600',
                  inactiveBg: 'bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900 border-emerald-200/60',
                  badgeActive: 'bg-white text-emerald-700',
                  badgeInactive: 'bg-emerald-200/80 text-emerald-900',
                  iconColor: 'text-emerald-600',
                },
                {
                  id: 'teachers',
                  label: 'Verified Faculty',
                  icon: GraduationCap,
                  count: filteredTeachers.length,
                  color: 'purple',
                  desc: 'NEP-2020 Educators',
                  activeBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 border-purple-600',
                  inactiveBg: 'bg-purple-50/60 hover:bg-purple-100/70 text-purple-900 border-purple-200/60',
                  badgeActive: 'bg-white text-purple-700',
                  badgeInactive: 'bg-purple-200/80 text-purple-900',
                  iconColor: 'text-purple-600',
                },
                {
                  id: 'students',
                  label: 'Student Innovators',
                  icon: Sparkles,
                  count: filteredStudents.length,
                  color: 'amber',
                  desc: 'ATL & Science Fairs',
                  activeBg: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20 border-amber-600',
                  inactiveBg: 'bg-amber-50/60 hover:bg-amber-100/70 text-amber-900 border-amber-200/60',
                  badgeActive: 'bg-white text-amber-700',
                  badgeInactive: 'bg-amber-200/80 text-amber-900',
                  iconColor: 'text-amber-600',
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 group ${
                      isActive ? tab.activeBg : tab.inactiveBg
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-700 shadow-2xs'
                      }`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.iconColor}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black truncate">{tab.label}</p>
                        <p className={`text-[10px] font-semibold truncate ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {tab.desc}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ml-1.5 shrink-0 shadow-2xs ${
                      isActive ? tab.badgeActive : tab.badgeInactive
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT AREA WITH SOFT THEMED BACKGROUND ─────────────────── */}
        <section className={`max-w-7xl mx-auto px-4 mt-6 p-4 md:p-6 rounded-3xl border transition-all duration-300 ${
          activeTab === 'orgs'
            ? 'bg-gradient-to-b from-blue-50/50 via-slate-50/60 to-white border-blue-200/70 shadow-xs'
            : activeTab === 'jobs'
            ? 'bg-gradient-to-b from-emerald-50/50 via-teal-50/40 to-white border-emerald-200/70 shadow-xs'
            : activeTab === 'teachers'
            ? 'bg-gradient-to-b from-purple-50/50 via-indigo-50/40 to-white border-purple-200/70 shadow-xs'
            : 'bg-gradient-to-b from-amber-50/50 via-orange-50/40 to-white border-amber-200/70 shadow-xs'
        }`}>

          {/* TAB 1: 100+ ORGANISATIONS (UNIAPPLY + CSEEL HYBRID SYSTEM) */}
          {activeTab === 'orgs' && (
            <div className="space-y-4">
              
              {/* ── TOP UNIAPPLY-STYLE SEARCH & CITY BAR (BELOW TABS) ──────── */}
              <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-gray-200/90 shadow-2xs">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  
                  {/* City Selector Dropdown */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 shrink-0 w-full md:w-auto">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-transparent font-bold outline-none cursor-pointer pr-2"
                    >
                      <option value="All">All India Cities</option>
                      <option value="Delhi">Delhi / NCR</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Bhubaneswar">Bhubaneswar</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Pune">Pune</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>

                  {/* Main Search Input */}
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Schools & Institutes by Name (e.g. Apeejay, Sapphire, DPS, ISRO, IIT)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs md:text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white transition-all text-gray-900"
                    />
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between md:justify-end">
                    <span className="text-xs text-gray-500 font-bold hidden md:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 outline-none cursor-pointer"
                    >
                      <option value="popularity">Popularity / Likes</option>
                      <option value="rating">Highest Star Rating</option>
                      <option value="feeAsc">Monthly Fees: Low to High</option>
                      <option value="feeDesc">Monthly Fees: High to Low</option>
                      <option value="jobsCount">Most Live Jobs</option>
                    </select>

                    {/* Mobile Filter Toggle */}
                    <button
                      onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                      className="md:hidden px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Filters</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* ── 12-COLUMN GRID: FILTER SIDEBAR (3 COLS) + SCHOOL CARDS (9 COLS) ── */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* ── LEFT FILTER SIDEBAR (UNIAPPLY STYLE) ─────────────────────────── */}
              <aside className={`md:col-span-3 space-y-4 ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs space-y-5 sticky top-20">
                  
                  {/* Header & Clear */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                      <span>Filters</span>
                    </h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-[11px] font-bold text-primary hover:underline"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Monthly Fee Range Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-gray-800">Monthly Fee Range</label>
                      <span className="font-black text-primary">₹0 - ₹{maxMonthlyFee.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="50000"
                      step="2000"
                      value={maxMonthlyFee}
                      onChange={(e) => setMaxMonthlyFee(parseInt(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                      <span>₹5,000</span>
                      <span>₹50,000+</span>
                    </div>
                  </div>

                  {/* Board Filter */}
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-800 block">Affiliation / Board</label>
                    <div className="space-y-1.5">
                      {['All', 'CBSE', 'IB', 'ICSE', 'UGC/AICTE', 'State Board'].map((b) => (
                        <label key={b} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer font-medium hover:text-primary">
                          <input
                            type="radio"
                            name="board"
                            checked={selectedBoard === b}
                            onChange={() => setSelectedBoard(b)}
                            className="accent-primary"
                          />
                          <span>{b === 'All' ? 'All Boards' : b}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Institution Type Filter */}
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-800 block">Institution Type</label>
                    <div className="space-y-1.5">
                      {['All', 'School', 'University', 'Research Institute', 'Atal Tinkering Lab'].map((t) => (
                        <label key={t} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer font-medium hover:text-primary">
                          <input
                            type="radio"
                            name="orgType"
                            checked={selectedOrgType === t}
                            onChange={() => setSelectedOrgType(t)}
                            className="accent-primary"
                          />
                          <span>{t === 'All' ? 'All Types' : t}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Classes Offered Filter */}
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-800 block">Classes Offered</label>
                    <select
                      value={selectedClasses}
                      onChange={(e) => setSelectedClasses(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold outline-none"
                    >
                      <option value="All">All Grades & Levels</option>
                      <option value="Pre-Nursery - UKG">Pre-Nursery - UKG</option>
                      <option value="Nursery - Class 12">Nursery - Class 12</option>
                      <option value="Undergraduate - Ph.D.">Undergraduate - Ph.D.</option>
                      <option value="Class 6 - Class 12 (STEM)">Class 6 - 12 (ATL STEM)</option>
                    </select>
                  </div>

                  {/* Admission Status Filter */}
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-800 block">Admission Status</label>
                    <div className="space-y-1.5">
                      {['All', 'On Going', 'Open for 2026-27'].map((st) => (
                        <label key={st} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer font-medium hover:text-primary">
                          <input
                            type="radio"
                            name="admissionStatus"
                            checked={selectedAdmissionStatus === st}
                            onChange={() => setSelectedAdmissionStatus(st)}
                            className="accent-primary"
                          />
                          <span>{st === 'All' ? 'All Status' : st}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Checkboxes: Live Jobs & Active STEM Labs */}
                  <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
                    <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyWithJobs}
                        onChange={(e) => setOnlyWithJobs(e.target.checked)}
                        className="rounded text-primary"
                      />
                      <span>Only with Live Faculty Jobs</span>
                    </label>
                    <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyWithLabs}
                        onChange={(e) => setOnlyWithLabs(e.target.checked)}
                        className="rounded text-primary"
                      />
                      <span>Has 3+ STEM / ATL Labs</span>
                    </label>
                  </div>

                </div>
              </aside>

              {/* ── RIGHT MAIN CARDS COLUMN (UNIAPPLY + CSEEL HYBRID CARDS) ───────── */}
              <div className="md:col-span-9 space-y-4">
                
                {/* Result summary banner */}
                <div className="flex items-center justify-between text-xs text-gray-600 font-semibold px-1">
                  <p>
                    Showing <strong className="text-gray-900">{filteredOrgs.length}</strong> Verified Schools & Institutions
                  </p>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-cyan-600" /> 100% CSEEL Academic Verified
                  </span>
                </div>

                {/* Organisation Cards List */}
                <div className="space-y-4">
                  {filteredOrgs.map((org) => {
                    const isLiked = likedOrgIds.includes(org.id);
                    const isCompared = compareList.some((item) => item.id === org.id);

                    return (
                      <div
                        key={org.id}
                        className="bg-white rounded-2xl border border-gray-200 hover:border-primary/50 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col md:flex-row group"
                      >
                        {/* ── LEFT CAMPUS IMAGE & BADGES ───────────────────────── */}
                        <div className="md:w-64 relative bg-slate-900 shrink-0 overflow-hidden min-h-[160px] md:min-h-[190px]">
                          <img
                            src={org.bannerImage}
                            alt={org.name}
                            className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Top Status Badges */}
                          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                            <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded shadow-xs">
                              {org.admissionStatus || 'On Going'}
                            </span>
                            {org.isFeatured && (
                              <span className="px-2 py-0.5 bg-amber-400 text-amber-950 text-[10px] font-black uppercase rounded shadow-xs flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-amber-950" />
                                <span>Featured</span>
                              </span>
                            )}
                          </div>

                          {/* Bottom CSEEL Verified Badge */}
                          <div className="absolute bottom-2.5 left-2.5 z-10">
                            <span className="px-2 py-1 bg-black/75 backdrop-blur-md text-cyan-300 text-[10px] font-black rounded-lg border border-white/20 shadow-xs flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Verified by CSEEL</span>
                            </span>
                          </div>

                          {/* Top Right Like / Shortlist Heart */}
                          <button
                            onClick={(e) => handleToggleLike(org.id, e)}
                            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors shadow-xs"
                            title="Save / Shortlist"
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                          </button>
                        </div>

                        {/* ── RIGHT MAIN DETAILS & METRICS ─────────────────────── */}
                        <div className="p-4 md:p-5 flex-1 flex flex-col justify-between space-y-3">
                          
                          {/* Title & Location Row */}
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <Link href={`/edu-network/org/${org.id}`}>
                                  <h3 className="text-base md:text-lg font-black text-gray-900 group-hover:text-primary transition-colors leading-tight">
                                    {org.name}
                                  </h3>
                                </Link>
                                <p className="text-xs text-gray-500 font-semibold mt-0.5 flex items-center gap-1.5 flex-wrap">
                                  <span>{org.locality || org.address.split(',')[0]}</span>
                                  <span>•</span>
                                  <span className="text-primary font-bold">{org.city}, {org.state}</span>
                                  <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(`${org.name} ${org.city}`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-cyan-700 font-bold underline hover:text-cyan-800 flex items-center gap-0.5 ml-1"
                                  >
                                    <MapPin className="w-3 h-3 text-cyan-600" />
                                    <span>Location Map</span>
                                  </a>
                                </p>
                              </div>

                              {/* Official Partner Badge */}
                              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-black text-amber-800 shrink-0">
                                <Award className="w-3.5 h-3.5 text-amber-600" />
                                <span>Academic Partner</span>
                              </div>
                            </div>
                          </div>

                          {/* ── 4-COLUMN UNIAPPLY METRIC GRID ─────────────────── */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50/80 p-3 rounded-xl border border-gray-200/80 text-xs">
                            <div>
                              <p className="text-[10px] text-gray-500 font-semibold uppercase">Classes Offered</p>
                              <p className="font-black text-gray-900 truncate mt-0.5">{org.classesOffered}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 font-semibold uppercase">Monthly Fees</p>
                              <p className="font-black text-emerald-700 mt-0.5">{org.monthlyFees}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 font-semibold uppercase">Board</p>
                              <p className="font-black text-gray-900 mt-0.5">{org.board}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 font-semibold uppercase">Student:Faculty</p>
                              <p className="font-black text-purple-700 mt-0.5">{org.studentFacultyRatio}</p>
                            </div>
                          </div>

                          {/* ── CSEEL STEM LABS & LIVE JOBS RIBBON ─────────────── */}
                          <div className="flex items-center justify-between text-xs text-gray-600 pt-1 flex-wrap gap-2">
                            <div className="flex items-center gap-3 font-semibold text-[11px]">
                              <span className="flex items-center gap-1 text-teal-700 font-bold">
                                <Beaker className="w-3.5 h-3.5 text-teal-600" />
                                <span>{org.stemLabsCount} STEM Labs</span>
                              </span>
                              {org.openJobsCount > 0 ? (
                                <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <Briefcase className="w-3 h-3 text-emerald-600" />
                                  <span>{org.openJobsCount} Live Jobs</span>
                                </span>
                              ) : (
                                <span className="text-gray-400">0 Live Openings</span>
                              )}
                            </div>

                            {/* Shortlist Counter */}
                            <span className="text-[11px] text-gray-500 font-bold flex items-center gap-1">
                              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-red-600 fill-red-600' : 'text-gray-400'}`} />
                              <span>{isLiked ? (org.likesCount || 100) + 1 : org.likesCount} Interested</span>
                            </span>
                          </div>

                          {/* ── BOTTOM ACTIONS (COMPARE, ENQUIRE, VIEW DETAIL) ── */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-2">
                            
                            {/* Compare Checkbox */}
                            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isCompared}
                                onChange={(e) => handleToggleCompare(org, e as any)}
                                className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                              />
                              <span>Compare</span>
                            </label>

                            {/* CTAs */}
                            <div className="flex items-center gap-2">
                              <ShareButton
                                title={org.name}
                                text={`${org.name} - ${org.city}, ${org.state}. Fees: ${org.monthlyFees || '₹5,000'}/mo.`}
                                url={`/edu-network/org/${org.id}`}
                                size="xs"
                                variant="outline"
                              />

                              <button
                                onClick={(e) => handleOpenEnquiry(org, e)}
                                className="px-4 py-2 border border-red-500 text-red-600 hover:bg-red-50 rounded-xl text-xs font-black transition-colors shadow-2xs"
                              >
                                Enquire Now
                              </button>

                              <Link
                                href={`/edu-network/org/${org.id}`}
                                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-black shadow-2xs transition-colors text-center"
                              >
                                View Detail
                              </Link>
                            </div>

                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
            </div>
          )}

          {/* TAB 2: LIVE TEACHING & LAB JOBS (INDEED SPLIT-VIEW WITH EMERALD STYLING) */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              
              {/* ── TOP SEARCH & FILTER BAR (IMAGE 2 STYLE) ───────────────────── */}
              <div className="bg-white rounded-3xl p-4 md:p-5 border border-gray-200/90 shadow-xs space-y-3">
                
                {/* Search Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-slate-50 border border-gray-200 rounded-2xl p-1.5">
                  
                  {/* Job Title / Keyword */}
                  <div className="md:col-span-5 flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200/80">
                    <Search className="w-4 h-4 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or institution (e.g. Physics, Robotics, DPS)..."
                      value={jobSearchTitle}
                      onChange={(e) => setJobSearchTitle(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
                    />
                    {jobSearchTitle && (
                      <button onClick={() => setJobSearchTitle('')} className="text-gray-400 hover:text-gray-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* City / Location */}
                  <div className="md:col-span-5 flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200/80">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="City, state, or pincode (e.g. Delhi, 560001)..."
                      value={jobSearchLocation}
                      onChange={(e) => setJobSearchLocation(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
                    />
                    {jobSearchLocation && (
                      <button onClick={() => setJobSearchLocation('')} className="text-gray-400 hover:text-gray-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Find Jobs CTA Button */}
                  <button
                    onClick={() => {}}
                    className="md:col-span-2 py-2 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Find Jobs</span>
                  </button>
                </div>

                {/* Filter Dropdowns Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* Subject Filter */}
                    <div className="relative">
                      <select
                        value={jobSelectedSubject}
                        onChange={(e) => setJobSelectedSubject(e.target.value)}
                        aria-label="Filter by Subject"
                        className="px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-full text-xs font-bold text-gray-700 outline-none hover:bg-slate-100 cursor-pointer"
                      >
                        <option value="All">All Subjects</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Robotics & AI">Robotics & AI</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Lab Technology">Lab Technology</option>
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div className="relative">
                      <select
                        value={jobSelectedCity}
                        onChange={(e) => setJobSelectedCity(e.target.value)}
                        aria-label="Filter by Location"
                        className="px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-full text-xs font-bold text-gray-700 outline-none hover:bg-slate-100 cursor-pointer"
                      >
                        <option value="All">All Locations</option>
                        <option value="New Delhi">New Delhi</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Bhubaneswar">Bhubaneswar</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Pune">Pune</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Hyderabad">Hyderabad</option>
                      </select>
                    </div>

                    {/* Job Type Filter */}
                    <div className="relative">
                      <select
                        value={jobSelectedRoleType}
                        onChange={(e) => setJobSelectedRoleType(e.target.value)}
                        aria-label="Filter by Job Type"
                        className="px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-full text-xs font-bold text-gray-700 outline-none hover:bg-slate-100 cursor-pointer"
                      >
                        <option value="All">All Job Types</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contractual">Contractual</option>
                        <option value="Lab Instructor">Lab Instructor</option>
                      </select>
                    </div>

                  </div>

                  {/* Sort By Controls */}
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold">
                    <span>Sort by:</span>
                    <button
                      onClick={() => setJobSortBy('relevance')}
                      className={`hover:underline ${jobSortBy === 'relevance' ? 'text-emerald-700 font-black underline' : 'text-gray-600'}`}
                    >
                      relevance
                    </button>
                    <span>-</span>
                    <button
                      onClick={() => setJobSortBy('date')}
                      className={`hover:underline ${jobSortBy === 'date' ? 'text-emerald-700 font-black underline' : 'text-gray-600'}`}
                    >
                      date
                    </button>
                    <span>-</span>
                    <button
                      onClick={() => setJobSortBy('salary')}
                      className={`hover:underline ${jobSortBy === 'salary' ? 'text-emerald-700 font-black underline' : 'text-gray-600'}`}
                    >
                      salary
                    </button>
                  </div>

                </div>

              </div>

              {/* Status Header */}
              <div className="flex items-center justify-between px-2 text-xs font-bold text-gray-600">
                <p>
                  Showing <strong className="text-gray-900">{filteredJobs.length}</strong> STEM & Faculty Jobs in India
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPostJobOpen(true)}
                    className="text-emerald-700 hover:underline flex items-center gap-1 font-black"
                  >
                    <span>+ Post a Free Opening</span>
                  </button>
                  <Link href="/edu-network/org" className="text-gray-500 hover:text-gray-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    <span>View 100+ Institutions</span>
                  </Link>
                </div>
              </div>

              {/* ── 2-COLUMN SPLIT-VIEW (INDEED ARRANGEMENT + EMERALD CARD STYLE) ── */}
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto" />
                  <h3 className="text-base font-bold text-gray-900">No Job Openings Found</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Try clearing your search query or choosing a different subject / city filter.
                  </p>
                  <button
                    onClick={() => { setJobSearchTitle(''); setJobSearchLocation(''); setJobSelectedSubject('All'); setJobSelectedCity('All'); }}
                    className="px-5 py-2 bg-emerald-700 text-white text-xs font-bold rounded-full mt-2"
                  >
                    Reset Job Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* ── LEFT COLUMN: SCROLLABLE LIST OF JOB CARDS (5 Cols) ─────── */}
                  <div className="lg:col-span-5 space-y-3.5 max-h-[860px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-gray-300">
                    {filteredJobs.map((job) => {
                      const isSelected = selectedJob?.id === job.id;
                      const isSaved = savedJobIds.includes(job.id);

                      return (
                        <div
                          key={job.id}
                          onClick={() => setSelectedJobId(job.id)}
                          className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer relative group ${
                            isSelected
                              ? 'bg-white border-2 border-emerald-600 shadow-md ring-2 ring-emerald-500/15'
                              : 'bg-white hover:bg-slate-50/70 border-gray-200/90 shadow-2xs hover:shadow-xs'
                          }`}
                        >
                          {/* Top Subject Badge, Salary Pill & Action Icons */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full tracking-wide">
                                {job.subject}
                              </span>
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-bold rounded-md border border-blue-200">
                                Easily apply
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black rounded-lg whitespace-nowrap">
                                {job.salary}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSavedJobIds((prev) =>
                                    prev.includes(job.id) ? prev.filter((id) => id !== job.id) : [...prev, job.id]
                                  );
                                }}
                                title={isSaved ? "Saved" : "Save Job"}
                                className="p-1 text-gray-400 hover:text-emerald-700 transition-colors"
                              >
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'text-emerald-600 fill-emerald-600' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {/* Job Title */}
                          <h3 className={`text-base font-bold transition-colors leading-snug mt-1 ${
                            isSelected ? 'text-emerald-800' : 'text-gray-900 group-hover:text-emerald-700'
                          }`}>
                            {job.title}
                          </h3>

                          {/* Institution & Rating */}
                          <p className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 mt-1">
                            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="font-bold text-gray-800">{job.orgName}</span>
                            <CheckCircle2 className="w-3 h-3 text-cyan-500 fill-cyan-500 shrink-0" />
                            <span className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5 ml-1">
                              <span>5</span>
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            </span>
                          </p>

                          {/* Location & Experience Ribbon */}
                          <div className="flex flex-wrap items-center gap-2 pt-2.5 text-[11px] text-gray-600">
                            <span className="flex items-center gap-1 font-medium bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{job.city}, {job.state}</span>
                            </span>
                            <span className="flex items-center gap-1 font-medium bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                              <Briefcase className="w-3 h-3 text-purple-600 shrink-0" />
                              <span>{job.roleType} • {job.experienceRequired}</span>
                            </span>
                          </div>

                          {/* Perks Pills (Image 2 style) */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[10px] text-gray-500">
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Health insurance</span>
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Provident Fund</span>
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md font-bold text-gray-600">+3 perks</span>
                          </div>

                          {/* Card Footer */}
                          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                            <span className="text-[10px] text-gray-400 font-medium">
                              Posted {job.postedDate}
                            </span>
                            <div className="flex items-center gap-2">
                              <ShareButton
                                title={job.title}
                                text={`${job.title} at ${job.orgName} (${job.city}). Salary: ${job.salary}`}
                                url={`/edu-network/jobs/${job.id}`}
                                size="xs"
                                variant="icon"
                                showWhatsApp={false}
                              />
                              <span className={`font-bold flex items-center gap-1 ${
                                isSelected ? 'text-emerald-700 font-black' : 'text-gray-500 group-hover:text-emerald-600'
                              }`}>
                                <span>View details</span>
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── RIGHT COLUMN: DETAILED STICKY JOB PANE (7 Cols) ────────── */}
                  {selectedJob && (
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-6 lg:sticky lg:top-20 max-h-[860px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                      
                      {/* Detailed Header */}
                      <div className="space-y-3 pb-4 border-b border-gray-100">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                              {selectedJob.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <Link
                                href={`/edu-network/org/${selectedJob.orgId}`}
                                className="font-bold text-emerald-800 hover:underline flex items-center gap-1"
                              >
                                <span>{selectedJob.orgName}</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md border border-amber-200 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>5 Rating</span>
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{selectedJob.address}, {selectedJob.city}, {selectedJob.state} - {selectedJob.pincode}</span>
                            </p>
                          </div>

                          <img
                            src={selectedJob.orgLogo}
                            alt={selectedJob.orgName}
                            className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                          />
                        </div>

                        {/* Salary & Role Pill */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-base font-black text-gray-900">
                            {selectedJob.salary}
                          </span>
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{selectedJob.roleType}</span>
                          </span>
                        </div>

                        {/* Action Buttons (Apply, Bookmark, Share) */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-2">
                          <button
                            onClick={() => {
                              setSelectedJobToApply(selectedJob);
                            }}
                            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Apply with CSEEL Profile</span>
                          </button>

                          <button
                            onClick={() => {
                              setSavedJobIds((prev) =>
                                prev.includes(selectedJob.id) ? prev.filter((id) => id !== selectedJob.id) : [...prev, selectedJob.id]
                              );
                            }}
                            className="p-2.5 rounded-xl border border-gray-200 bg-slate-50 hover:bg-slate-100 text-gray-700 transition-colors"
                            title="Save Job"
                          >
                            <Bookmark className={`w-4 h-4 ${savedJobIds.includes(selectedJob.id) ? 'text-emerald-600 fill-emerald-600' : ''}`} />
                          </button>

                          <ShareButton
                            title={selectedJob.title}
                            text={`${selectedJob.title} at ${selectedJob.orgName} (${selectedJob.city}). Salary: ${selectedJob.salary}`}
                            url={`/edu-network/jobs/${selectedJob.id}`}
                            size="sm"
                            variant="outline"
                          />

                          <Link
                            href={`/edu-network/jobs/${selectedJob.id}`}
                            className="text-xs font-bold text-primary hover:underline ml-auto flex items-center gap-1"
                          >
                            <span>Direct Job URL</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>

                      </div>

                      {/* 1. Job Details Section */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">
                          Job Details
                        </h3>

                        <div className="space-y-3 text-xs text-gray-700">
                          {/* Pay Box */}
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                            <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Pay & Compensation</span>
                            </span>
                            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mt-1">
                              {selectedJob.salary}
                            </span>
                          </div>

                          {/* Job Type & Shift */}
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                            <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                              <span>Job Type & Shift Schedule</span>
                            </span>
                            <p className="text-gray-600 text-xs">
                              {selectedJob.jobTypeCategory} • {selectedJob.jobShift}
                            </p>
                          </div>

                          {/* Benefits & Perks */}
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-amber-600" />
                              <span>Benefits & Institutional Perks</span>
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-700">
                              <span className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Health & Medical Insurance</span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Provident Fund (EPF) & Gratuity</span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Annual Performance Bonus</span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Paid Vacation & Conference Leaves</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. Full Job Description */}
                      <div className="space-y-2 pt-2 border-t border-gray-100 text-xs leading-relaxed text-gray-700">
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">
                          Full Job Description
                        </h3>
                        <p className="text-gray-700">
                          {selectedJob.description}
                        </p>
                        <div className="space-y-1.5 pt-2">
                          <p className="font-bold text-gray-900">Key Roles & Responsibilities:</p>
                          <ul className="list-disc pl-5 space-y-1 text-gray-600 text-[11px]">
                            <li>Design and conduct experiential, hands-on physics/chemistry/biology laboratory experiments for secondary and senior secondary students.</li>
                            <li>Comply with NEP-2020 inquiry-based learning standards and guide students in Atal Tinkering Labs (ATL) hardware projects.</li>
                            <li>Mentor school delegations for national science conclaves, olympiads, and inter-school science symposiums.</li>
                            <li>Maintain laboratory equipment safety, calibration logs, and inventory suites.</li>
                          </ul>
                        </div>
                      </div>

                      {/* 3. About Institution Box */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-bold text-emerald-900">{selectedJob.orgName}</p>
                          <p className="text-[11px] text-emerald-700">CSEEL Accredited Center of Science Excellence</p>
                        </div>
                        <Link
                          href={`/edu-network/org/${selectedJob.orgId}`}
                          className="px-4 py-1.5 bg-white text-emerald-800 rounded-xl font-bold shadow-2xs hover:bg-emerald-100 transition-colors shrink-0"
                        >
                          View Profile
                        </Link>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* TAB 3: 50+ VERIFIED TEACHERS (NEAR ME & ADVANCED FILTERS + COMPACT CARDS) */}
          {activeTab === 'teachers' && (
            <div className="space-y-5">
              
              {/* Category Banner for Teachers with Quick Geolocation Status */}
              <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-1.5 relative z-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase text-purple-200">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>NEP-2020 Certified Faculty Directory</span>
                    </span>
                    {isNearMeActive && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[11px] font-bold rounded-full animate-pulse">
                        <Locate className="w-3 h-3 text-emerald-300" />
                        <span>Near Me Active (Within {maxDistanceKm} km)</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    {filteredTeachers.length} Verified Science, Math & Robotics Educators
                  </h2>
                  <p className="text-xs text-purple-100 max-w-2xl">
                    Schools and institutions can find, filter by distance radius, verify NEP credentials, and directly hire faculty across India.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 relative z-10">
                  <button
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Locate className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                    <span>{isDetectingLocation ? 'Tracking Location...' : 'Find Near Me 📍'}</span>
                  </button>
                  <button
                    onClick={() => setIsCreateProfileOpen(true)}
                    className="px-4 py-2.5 bg-white text-purple-950 hover:bg-purple-50 rounded-xl text-xs font-black shadow-xs transition-colors"
                  >
                    + Register as Faculty
                  </button>
                </div>
              </div>

              {/* ── 2-COLUMN LAYOUT: LEFT SIDEBAR FILTERS (4 COLS) + RIGHT CARDS (8 COLS) ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ── LEFT SIDEBAR FILTERS (4 COLS) ─────────────────────────── */}
                <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
                  
                  {/* FILTER CARD 1: NEAR ME & GEOLOCATION RADIUS TRACKER */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Locate className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                          Location & Distance Radius
                        </h3>
                      </div>
                      {isNearMeActive && (
                        <button
                          onClick={handleResetLocation}
                          className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>

                    {/* 1-Click Auto Track Button */}
                    <button
                      onClick={handleDetectLocation}
                      disabled={isDetectingLocation}
                      className={`w-full py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border ${
                        isNearMeActive
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      <Crosshair className={`w-3.5 h-3.5 text-emerald-600 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                      <span>
                        {isDetectingLocation
                          ? 'Detecting GPS Coordinates...'
                          : isNearMeActive
                          ? `📍 Location Locked: ${userLocation?.label || 'Local Area'}`
                          : '📍 Auto-Detect School GPS Location'}
                      </span>
                    </button>

                    {/* Distance Slider */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-700">Search Radius:</span>
                        <span className="font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 text-[11px]">
                          Within {maxDistanceKm} km
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="200"
                        step="5"
                        value={maxDistanceKm}
                        onChange={(e) => {
                          setMaxDistanceKm(Number(e.target.value));
                          setIsNearMeActive(true);
                          if (!userLocation) {
                            setUserLocation({ lat: 28.6139, lng: 77.2090, label: 'Delhi NCR (Default)' });
                          }
                          setTeacherSortBy('distance');
                        }}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold px-0.5">
                        <span>5 km (Local)</span>
                        <span>50 km</span>
                        <span>200 km (State)</span>
                      </div>
                    </div>

                    {/* City & State Dropdowns */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Select City / Hub</label>
                        <select
                          value={teacherSelectedCity}
                          onChange={(e) => {
                            setTeacherSelectedCity(e.target.value);
                            if (e.target.value !== 'All' && CITY_COORDINATES[e.target.value]) {
                              setUserLocation({ ...CITY_COORDINATES[e.target.value], label: e.target.value });
                              setIsNearMeActive(true);
                            }
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none hover:bg-slate-100"
                        >
                          <option value="All">All Cities (All India)</option>
                          <option value="New Delhi">New Delhi / NCR</option>
                          <option value="Bengaluru">Bengaluru, Karnataka</option>
                          <option value="Mumbai">Mumbai, Maharashtra</option>
                          <option value="Bhubaneswar">Bhubaneswar, Odisha</option>
                          <option value="Pune">Pune, Maharashtra</option>
                          <option value="Lucknow">Lucknow, UP</option>
                          <option value="Hyderabad">Hyderabad, Telangana</option>
                          <option value="Kolkata">Kolkata, West Bengal</option>
                          <option value="Chennai">Chennai, Tamil Nadu</option>
                          <option value="Jaipur">Jaipur, Rajasthan</option>
                          <option value="Ahmedabad">Ahmedabad, Gujarat</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="Dehradun">Dehradun, Uttarakhand</option>
                        </select>
                      </div>

                      {/* Pincode Search */}
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Pincode Instant Filter</label>
                        <input
                          type="text"
                          placeholder="e.g. 110001, 560012, 751001"
                          value={teacherPincode}
                          onChange={(e) => setTeacherPincode(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:bg-white"
                        />
                      </div>
                    </div>

                  </div>

                  {/* FILTER CARD 2: SUBJECT DOMAIN & TEACHING EXPERTISE */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                      <Beaker className="w-4 h-4 text-purple-700" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                        Subject & Discipline
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Robotics & AI', 'Computer Science', 'Lab Technology'].map((subj) => {
                        const isSelected = teacherSelectedSubject === subj;
                        return (
                          <button
                            key={subj}
                            onClick={() => setTeacherSelectedSubject(subj)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-purple-700 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-gray-700'
                            }`}
                          >
                            {subj === 'All' ? 'All Subjects' : subj}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* FILTER CARD 3: EXPERIENCE & ENGAGEMENT TYPE */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                        Experience & Role Model
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Minimum Experience</label>
                        <select
                          value={teacherMinExp}
                          onChange={(e) => setTeacherMinExp(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none hover:bg-slate-100"
                        >
                          <option value={0}>Any Experience Level</option>
                          <option value={2}>2+ Years Experience</option>
                          <option value={5}>5+ Years Experience (Senior)</option>
                          <option value={8}>8+ Years Experience (Lead Faculty)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Engagement Model</label>
                        <select
                          value={teacherSelectedRole}
                          onChange={(e) => setTeacherSelectedRole(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none hover:bg-slate-100"
                        >
                          <option value="All">All Engagement Models</option>
                          <option value="Full-Time">Full-Time Faculty</option>
                          <option value="Visiting Faculty">Visiting Faculty</option>
                          <option value="Lab Workshop Instructor">Lab Workshop Instructor</option>
                          <option value="Online Mentor">Online Mentor</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* FILTER CARD 4: ACCREDITATION & QUALITY BADGES */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-2xs space-y-2.5">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-600" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                        Verification & NEP Badges
                      </h3>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={teacherOnlyNep}
                        onChange={(e) => setTeacherOnlyNep(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded-md"
                      />
                      <span>NEP-2020 Hands-on Certified Only</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={teacherOnlyVerified}
                        onChange={(e) => setTeacherOnlyVerified(e.target.checked)}
                        className="w-4 h-4 text-cyan-600 rounded-md"
                      />
                      <span>CSEEL Verified Degree & KYC Only</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-50/90 p-2 rounded-xl border border-amber-200 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={teacherOnlySeekingJob}
                        onChange={(e) => setTeacherOnlySeekingJob(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded-md"
                      />
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                        <span>⚡ 72h Flash Job Seekers Only</span>
                      </span>
                    </label>
                  </div>

                </div>

                {/* ── RIGHT COLUMN: SEARCH HEADER + COMPACT TEACHER CARDS (8 COLS) ─ */}
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* ── 72-HOUR FLASH JOB SEEKING PULSE BANNER FOR RECRUITERS & SCHOOLS ── */}
                  <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white rounded-3xl p-5 border border-purple-800/50 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-[11px] font-black text-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>LIVE 3-DAY ACTIVATION • IMMEDIATE FACULTY JOINERS</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                          Verified Teachers Actively Seeking Jobs Right Now
                        </h3>
                        <p className="text-xs text-purple-200/90 leading-relaxed max-w-xl">
                          Teachers activate 72-hour flash status when they are ready for immediate school interviews and joining.
                        </p>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                        <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-center flex-1 sm:flex-initial">
                          <p className="text-lg font-black text-emerald-400">{activelySeekingNearbyCount}</p>
                          <p className="text-[10px] font-bold text-purple-200 uppercase">In Your Area</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-center flex-1 sm:flex-initial">
                          <p className="text-lg font-black text-cyan-300">{activelySeekingAllIndiaCount}</p>
                          <p className="text-[10px] font-bold text-purple-200 uppercase">All India</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar inside Banner */}
                    <div className="mt-4 pt-3 border-t border-purple-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <button
                        onClick={() => setTeacherOnlySeekingJob(!teacherOnlySeekingJob)}
                        className={`px-4 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 ${
                          teacherOnlySeekingJob
                            ? 'bg-emerald-400 text-slate-950 shadow-md'
                            : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                        }`}
                      >
                        <span>⚡ {teacherOnlySeekingJob ? '✓ Showing 72h Seekers (Clear)' : 'Filter: Show 72h Active Seekers'}</span>
                      </button>

                      <button
                        onClick={() => setIsActivateJobSeekingModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        <span>🔥 I'm a Teacher: Activate 72h Status</span>
                      </button>
                    </div>
                  </div>

                  {/* TOP SEARCH & SORT HEADER */}
                  <div className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    
                    {/* Keyword Search Input */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search educator name, topic (e.g. Optics, Robotics), or college..."
                        value={teacherSearchQuery}
                        onChange={(e) => setTeacherSearchQuery(e.target.value)}
                        className="w-full pl-9.5 pr-4 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 outline-none transition-colors"
                      />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-bold text-gray-500">Sort by:</span>
                      <select
                        value={teacherSortBy}
                        onChange={(e) => setTeacherSortBy(e.target.value as any)}
                        className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none hover:bg-slate-100 cursor-pointer"
                      >
                        <option value="distance">📍 Closest Distance First</option>
                        <option value="rating">★ Highest Rating (5.0 - 4.5)</option>
                        <option value="experience">🎓 Most Experienced</option>
                      </select>
                    </div>

                  </div>

                  {/* ACTIVE STATUS BAR */}
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-bold text-gray-600">
                    <p>
                      Showing <strong className="text-gray-900">{filteredTeachers.length}</strong> Verified Faculty Profiles
                    </p>

                    {isNearMeActive && (
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 font-bold">
                        <Locate className="w-3 h-3 text-emerald-600" />
                        <span>Distance calculated from {userLocation?.label || 'Your Location'}</span>
                      </span>
                    )}
                  </div>

                  {/* ── GRID OF COMPACT TEACHER CARDS (SMALLER WITH ALL DETAILS) ─ */}
                  {filteredTeachers.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
                      <GraduationCap className="w-12 h-12 text-gray-400 mx-auto" />
                      <h3 className="text-base font-bold text-gray-900">No Verified Educators Found</h3>
                      <p className="text-xs text-gray-500 max-w-md mx-auto">
                        Try expanding your distance radius slider or clearing your subject & city filters.
                      </p>
                      <button
                        onClick={() => {
                          setTeacherSearchQuery('');
                          setTeacherSelectedSubject('All');
                          setTeacherSelectedCity('All');
                          setTeacherPincode('');
                          setTeacherMinExp(0);
                          setTeacherSelectedRole('All');
                          setTeacherOnlyNep(false);
                          setTeacherOnlyVerified(false);
                          setTeacherOnlySeekingJob(false);
                          setIsNearMeActive(false);
                          setMaxDistanceKm(100);
                        }}
                        className="px-5 py-2 bg-purple-700 text-white text-xs font-bold rounded-full mt-2"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {filteredTeachers.map((t: any) => {
                        const teacherSlug = t.slug || `${t.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${t.subject.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${t.city.toLowerCase()}`;
                        
                        return (
                          <div
                            key={t.id}
                            className={`bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden ${
                              t.isActivelySeekingJob
                                ? 'border-emerald-400 hover:border-emerald-500'
                                : 'border-gray-200 hover:border-purple-500/60'
                            }`}
                          >
                            
                            {/* Card Top: Avatar, Name, Rating, Subject & Distance */}
                            <div className="space-y-2.5">
                              
                              {/* 72h Flash Status Pill on Card */}
                              {t.isActivelySeekingJob && (
                                <div className="flex items-center justify-between gap-1 px-2 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl text-[10px] text-emerald-950 font-black">
                                  <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                    <span>Actively Seeking Job</span>
                                  </span>
                                  <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-black">
                                    ⚡ {t.jobSeekingExpiresInHours || 48}h left
                                  </span>
                                </div>
                              )}

                              <div className="flex items-start gap-3">
                                
                                {/* Compact Avatar */}
                                <Link href={`/edu-network/teachers/${teacherSlug}`} className="relative shrink-0">
                                  <img
                                    src={t.avatar}
                                    alt={t.name}
                                    className="w-11 h-11 rounded-2xl object-cover border border-purple-200 group-hover:scale-105 transition-transform"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop";
                                    }}
                                  />
                                  {t.verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-cyan-600 text-white p-0.5 rounded-full border border-white" title="Verified Faculty">
                                      <ShieldCheck className="w-3 h-3" />
                                    </div>
                                  )}
                                </Link>

                                {/* Name & Badges */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <Link
                                      href={`/edu-network/teachers/${teacherSlug}`}
                                      className="text-xs sm:text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors truncate"
                                    >
                                      {t.name}
                                    </Link>
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200 shrink-0">
                                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                      <span>{t.rating}</span>
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-700 pt-0.5">
                                    <span>{t.subject} Faculty</span>
                                    {t.nepCertified && (
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                        NEP-2020
                                      </span>
                                    )}
                                  </div>
                                </div>

                              </div>

                              {/* Distance Badge & Location */}
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="flex items-center gap-1 font-medium truncate">
                                  <MapPin className="w-3 h-3 text-purple-600 shrink-0" />
                                  <span className="truncate">{t.city}, {t.state}</span>
                                </span>
                                
                                {t.distanceKm !== null && t.distanceKm !== undefined && (
                                  <span className="ml-auto inline-flex items-center gap-1 font-black text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
                                    <Locate className="w-2.5 h-2.5 text-emerald-700" />
                                    <span>{t.distanceKm} km away</span>
                                  </span>
                                )}
                              </div>

                              {/* Institute & Qualification */}
                              <div className="text-[11px] text-gray-600 space-y-0.5">
                                <p className="font-bold text-gray-800 truncate flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
                                  <span className="truncate">{t.currentInstitute}</span>
                                </p>
                                <p className="text-[10px] text-gray-500 truncate flex items-center gap-1">
                                  <Award className="w-3 h-3 text-amber-500 shrink-0" />
                                  <span className="truncate">{t.experienceYears} Yrs Exp • {t.qualification}</span>
                                </p>
                              </div>

                              {/* Bio Preview (1 Line) */}
                              <p className="text-[11px] text-gray-500 line-clamp-1 leading-snug">
                                {t.bio}
                              </p>

                            </div>

                            {/* Card Footer: Salary & Actions */}
                            <div className="pt-2.5 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                              <div>
                                <span className="text-[9px] font-bold text-gray-400 block uppercase">Exp. Salary</span>
                                <span className="text-xs font-black text-emerald-700">
                                  {t.expectedSalary.split('/')[0]}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <ShareButton
                                  title={t.name}
                                  text={`Verified Faculty: ${t.name} (${t.subject}, ${t.city}) - CSEEL Verified Educator`}
                                  url={`/edu-network/teachers/${teacherSlug}`}
                                  size="xs"
                                  variant="icon"
                                />

                                <button
                                  onClick={(e) => handleOpenTeacherConnect(t, e)}
                                  className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
                                >
                                  <Mail className="w-3 h-3 text-purple-600" />
                                  <span>Hire</span>
                                </button>

                                <Link
                                  href={`/edu-network/teachers/${teacherSlug}`}
                                  className="px-2.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-[11px] font-black transition-colors"
                                >
                                  Profile →
                                </Link>
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
          )}

          {/* TAB 4: 50+ STUDENT INNOVATORS */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              {/* Category Banner for Students */}
              <div className="bg-gradient-to-r from-amber-600 via-orange-700 to-rose-800 text-white rounded-2xl p-4 md:p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase text-amber-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>National Student Innovator Showcase</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-black tracking-tight">
                    {filteredStudents.length} Young STEM Innovators & ATL Tinkering Talents
                  </h2>
                  <p className="text-xs text-amber-100 max-w-2xl">
                    Explore outstanding school science fair prototypes, robotics projects, and verified hands-on lab experiment badges.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsCreateProfileOpen(true)}
                    className="px-4 py-2 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-black shadow-xs transition-colors"
                  >
                    + Create Student Profile
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStudents.map((s) => {
                  const studentSlug = s.slug || `${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${s.city.toLowerCase()}`;

                  return (
                    <div
                      key={s.id}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-amber-500/50 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <Link href={`/edu-network/students/${studentSlug}`} className="flex items-start gap-3.5 group/link">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 shrink-0 shadow-xs">
                            <img src={s.avatar} alt={s.name} className="w-full h-full object-cover group-hover/link:scale-105 transition-transform" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors flex items-center gap-1">
                              <span>{s.name}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500 shrink-0" />
                            </h3>
                            <p className="text-xs font-semibold text-amber-700">{s.classGrade}</p>
                            <p className="text-[11px] text-gray-500 truncate">{s.schoolCollege}</p>
                          </div>
                        </Link>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          "{s.bio}"
                        </p>

                        <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] uppercase font-bold text-amber-800">Featured STEM Prototype</p>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-1.5 py-0.2 rounded">
                              Public Files
                            </span>
                          </div>
                          <p className="font-bold text-gray-900 truncate">{s.topProject}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-gray-500 text-[11px]">
                          {s.experimentsCompleted} Labs • {s.projectsCount} Projs
                        </span>
                        <div className="flex items-center gap-1.5">
                          <ShareButton
                            title={s.name}
                            text={`Student Innovator: ${s.name} (${s.schoolCollege}) - STEM Inventions & ATL Project Vault`}
                            url={`/edu-network/students/${studentSlug}`}
                            size="xs"
                            variant="icon"
                          />
                          <Link
                            href={`/edu-network/students/${studentSlug}`}
                            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <span>Projects →</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </section>

        {/* ── STICKY BOTTOM COMPARE BAR (APPEARS WHEN 2+ ORGS SELECTED) ─────── */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 bg-slate-900 text-white rounded-2xl shadow-2xl p-3 border border-white/20 flex items-center justify-between gap-4 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold">Compare ({compareList.length}/4) Institutions</h4>
                  <p className="text-[10px] text-gray-300 truncate max-w-md">
                    {compareList.map((c) => c.name.split(' ')[0]).join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareList([])}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white font-bold transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="px-5 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-black shadow-md transition-colors"
                >
                  Compare Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MODAL 1: SIDE-BY-SIDE INSTITUTION COMPARISON MATRIX ─────────────── */}
        <AnimatePresence>
          {isCompareModalOpen && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsCompareModalOpen(false)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-primary" />
                    <h3 className="font-black text-gray-900 text-base">Institution Comparison Matrix</h3>
                  </div>
                  <button onClick={() => setIsCompareModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="p-3 font-bold text-gray-400 uppercase text-[10px] w-36">Metric</th>
                        {compareList.map((c) => (
                          <th key={c.id} className="p-3 font-black text-gray-900 min-w-[200px]">
                            <div className="space-y-1">
                              <p className="text-sm font-black text-primary line-clamp-1">{c.name}</p>
                              <p className="text-[10px] text-gray-500">{c.city}, {c.state}</p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-3 font-bold text-gray-500">Board / Affiliation</td>
                        {compareList.map((c) => (
                          <td key={c.id} className="p-3 font-bold text-gray-900">{c.board}</td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50/60">
                        <td className="p-3 font-bold text-gray-500">Monthly Fees</td>
                        {compareList.map((c) => (
                          <td key={c.id} className="p-3 font-black text-emerald-700">{c.monthlyFees}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-gray-500">Classes Offered</td>
                        {compareList.map((c) => (
                          <td key={c.id} className="p-3 font-bold text-gray-900">{c.classesOffered}</td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50/60">
                        <td className="p-3 font-bold text-gray-500">Student:Faculty</td>
                        {compareList.map((c) => (
                          <td key={c.id} className="p-3 font-bold text-purple-700">{c.studentFacultyRatio}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-gray-500">STEM Labs Count</td>
                        {compareList.map((c) => (
                          <td key={c.id} className="p-3 font-bold text-teal-700">{c.stemLabsCount} Active Labs</td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50/60">
                        <td className="p-3 font-bold text-gray-500">Live Faculty Jobs</td>
                        {compareList.map((c) => (
                          <td key={c.id} className="p-3 font-bold text-emerald-600">{c.openJobsCount} Openings</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-gray-500">Rating & Reviews</td>
                        {compareList.map((c) => (
                          <td key={c.id} className="p-3 font-bold text-amber-600">⭐ {c.rating} ({c.reviews} reviews)</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-gray-500">Action</td>
                        {compareList.map((c) => (
                          <td key={c.id} className="p-3">
                            <Link
                              href={`/edu-network/org/${c.id}`}
                              className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold inline-block"
                            >
                              View Profile
                            </Link>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 2: QUICK ENQUIRY & ADMISSION MODAL ───────────────────────── */}
        <AnimatePresence>
          {isEnquiryModalOpen && selectedOrgForEnquiry && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsEnquiryModalOpen(false)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Direct Admission & Lab Enquiry</h3>
                    <p className="text-[11px] text-gray-500">{selectedOrgForEnquiry.name}</p>
                  </div>
                  <button onClick={() => setIsEnquiryModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>

                {enquirySuccess ? (
                  <div className="py-8 text-center flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="font-bold text-gray-900">Enquiry Sent to Principal Desk!</h4>
                    <p className="text-xs text-gray-500">The admission coordinator at {selectedOrgForEnquiry.name} will reach out to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="mt-4 space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Parent / Guardian Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={enquiryForm.parentName}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, parentName: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Student Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Aarav Kumar"
                          value={enquiryForm.studentName}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, studentName: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Grade Applying For</label>
                        <select
                          value={enquiryForm.grade}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, grade: e.target.value })}
                          className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        >
                          <option value="Pre-Nursery / KG">Pre-Nursery / KG</option>
                          <option value="Class 1 - 5">Class 1 - 5</option>
                          <option value="Class 6 - 8 (Middle STEM)">Class 6 - 8 (Middle STEM)</option>
                          <option value="Class 9 - 10 (Secondary)">Class 9 - 10 (Secondary)</option>
                          <option value="Class 11 - 12 (Senior Science)">Class 11 - 12 (Senior Science)</option>
                          <option value="Higher Studies / B.Tech">Higher Studies / B.Tech</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={enquiryForm.phone}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="parent@example.com"
                          value={enquiryForm.email}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Specific Queries / Lab Facilities required</label>
                      <textarea
                        rows={2}
                        placeholder="Inquire about robotics lab, physics apparatus, scholarship, or transportation..."
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-md transition-colors mt-2"
                    >
                      Submit Official Enquiry
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 3: POST A JOB ────────────────────────────────────────────── */}
        <AnimatePresence>
          {isPostJobOpen && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsPostJobOpen(false)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-sm">Post a Faculty / Lab Job Opening</h3>
                  <button onClick={() => setIsPostJobOpen(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleCreateJob} className="mt-4 space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Organization / School Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi Public School R.K. Puram"
                      value={newJob.orgName}
                      onChange={(e) => setNewJob({ ...newJob, orgName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior PGT Physics & Lab Incharge"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Subject</label>
                      <select
                        value={newJob.subject}
                        onChange={(e) => setNewJob({ ...newJob, subject: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      >
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Robotics & AI">Robotics & AI</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Lab Technology">Lab Technology</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Role Type</label>
                      <select
                        value={newJob.roleType}
                        onChange={(e) => setNewJob({ ...newJob, roleType: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Visiting Faculty">Visiting Faculty</option>
                        <option value="Lab Instructor">Lab Instructor</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. New Delhi"
                        value={newJob.city}
                        onChange={(e) => setNewJob({ ...newJob, city: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Monthly Salary</label>
                      <input
                        type="text"
                        placeholder="₹60,000 - ₹90,000 / month"
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Description & Requirements</label>
                    <textarea
                      rows={3}
                      placeholder="Outline laboratory responsibilities and experience required..."
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-xl text-xs font-black shadow-md hover:bg-primary/90 transition-colors mt-2"
                  >
                    Publish Live Opening
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 4: JOIN NETWORK / CREATE PROFILE ─────────────────────────── */}
        <AnimatePresence>
          {isCreateProfileOpen && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsCreateProfileOpen(false)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-sm">Join CSEEL EduNetwork</h3>
                  <button onClick={() => setIsCreateProfileOpen(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>

                {profileSuccess ? (
                  <div className="py-8 text-center flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="font-bold text-gray-900">Profile Created!</h4>
                    <p className="text-xs text-gray-500">Your profile has been submitted for CSEEL Gold verification.</p>
                  </div>
                ) : (
                  <form onSubmit={handleCreateProfile} className="mt-4 space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Select Role *</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['Teacher', 'Student', 'Organization'].map((r) => (
                          <button
                            type="button"
                            key={r}
                            onClick={() => setProfileForm({ ...profileForm, role: r as any })}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              profileForm.role === r ? 'bg-primary text-white border-primary shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Full Name / Institute Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. / Prof. / School Name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="name@cseel.network"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">City *</label>
                        <input
                          type="text"
                          required
                          placeholder="New Delhi"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Pincode</label>
                        <input
                          type="text"
                          placeholder="110001"
                          value={profileForm.pincode}
                          onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg hover:bg-primary/90 transition-colors mt-2"
                    >
                      Submit for CSEEL Verification
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 5: TEACHER DIRECT CONNECT ───────────────────────────────── */}
        <AnimatePresence>
          {isTeacherConnectOpen && selectedTeacherForConnect && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsTeacherConnectOpen(false)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-700">Institutional Faculty Recruitment</span>
                    <h3 className="font-black text-gray-900 text-base">Connect with {selectedTeacherForConnect.name}</h3>
                  </div>
                  <button onClick={() => setIsTeacherConnectOpen(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>

                {teacherConnectSuccess ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="font-black text-gray-900 text-sm">Invitation Sent Successfully!</h4>
                    <p className="text-xs text-gray-500">Your school's recruitment message has been delivered to {selectedTeacherForConnect.name}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleTeacherConnectSubmit} className="mt-4 space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Name / Principal Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. A. K. Verma"
                        value={teacherConnectForm.name}
                        onChange={(e) => setTeacherConnectForm({ ...teacherConnectForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">School / College Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Delhi Public School"
                        value={teacherConnectForm.orgName}
                        onChange={(e) => setTeacherConnectForm({ ...teacherConnectForm, orgName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Official Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="principal@school.edu.in"
                          value={teacherConnectForm.email}
                          onChange={(e) => setTeacherConnectForm({ ...teacherConnectForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={teacherConnectForm.phone}
                          onChange={(e) => setTeacherConnectForm({ ...teacherConnectForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Opportunity Brief & Teaching Subject</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Mention proposed role (Full-time / Visiting), grade levels, and compensation package..."
                        value={teacherConnectForm.message}
                        onChange={(e) => setTeacherConnectForm({ ...teacherConnectForm, message: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-black text-xs rounded-xl shadow-md transition-all mt-2"
                    >
                      Send Official Invitation
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 6: ACTIVATE 72-HOUR FLASH JOB SEEKING STATUS ─────────────── */}
        <AnimatePresence>
          {isActivateJobSeekingModalOpen && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsActivateJobSeekingModalOpen(false)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">⚡ 3-Day Flash Visibility Pulse</span>
                    <h3 className="font-black text-gray-900 text-base">Activate 72-Hour Job Seeking Status</h3>
                  </div>
                  <button onClick={() => setIsActivateJobSeekingModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>

                {activateJobSeekingSuccess ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="font-black text-gray-900 text-base">72-Hour Flash Status Activated! 🔥</h4>
                    <p className="text-xs text-gray-500">
                      Your profile is now prominently featured as an Immediate Joiner for the next 72 hours across India and your local school region.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleActivateJobSeekingSubmit} className="mt-4 space-y-3 text-xs">
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                      💡 <strong>How it works:</strong> Activating this status places you at the top of school recruiters' "Immediate Joiner" radars for 3 days (72 hours). You can re-activate or renew anytime for free!
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. / Prof. / Educator Name"
                        value={activateJobSeekingForm.name}
                        onChange={(e) => setActivateJobSeekingForm({ ...activateJobSeekingForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-bold text-gray-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Teaching Subject *</label>
                        <select
                          value={activateJobSeekingForm.subject}
                          onChange={(e) => setActivateJobSeekingForm({ ...activateJobSeekingForm, subject: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-bold"
                        >
                          {['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Robotics & AI', 'Computer Science', 'Lab Technology'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Current City / Hub *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. New Delhi, Bengaluru"
                          value={activateJobSeekingForm.city}
                          onChange={(e) => setActivateJobSeekingForm({ ...activateJobSeekingForm, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Experience (Years)</label>
                        <input
                          type="number"
                          min={0}
                          max={35}
                          value={activateJobSeekingForm.experienceYears}
                          onChange={(e) => setActivateJobSeekingForm({ ...activateJobSeekingForm, experienceYears: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Preferred Role</label>
                        <select
                          value={activateJobSeekingForm.availableFor}
                          onChange={(e) => setActivateJobSeekingForm({ ...activateJobSeekingForm, availableFor: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none"
                        >
                          <option value="Full-Time">Full-Time Faculty</option>
                          <option value="Visiting Faculty">Visiting Faculty</option>
                          <option value="Lab Workshop Instructor">Lab Instructor</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white font-black text-xs rounded-xl shadow-lg hover:opacity-95 transition-all mt-2 flex items-center justify-center gap-1.5"
                    >
                      <span>🔥 Activate 72-Hour Flash Job Seeking Status</span>
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
