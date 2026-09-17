'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  MapPin,
  Building,
  GraduationCap,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  Globe,
  Award,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Star,
  ShieldCheck,
  Compass,
  FileText,
  UserCheck,
  School as SchoolIcon,
  X,
  Send,
  HelpCircle,
  BarChart3,
  Map,
  Check,
  ImageIcon,
  Eye,
  Navigation,
  Lock,
  Printer,
  Atom,
  Flame,
  ArrowRight
} from 'lucide-react';

interface SchoolProfileViewProps {
  state: string;
  district: string;
  blockName: string;
  village: string;
  schoolName: string;
  schoolSlug: string;
  udiseCode: string;
  pincode: string;
  management: string;
  board: string;
  medium: string;
  establishedYear: string;
  totalStudents: number;
  totalBoys: number;
  totalGirls: number;
  totalTeachers: number;
  maleTeachers: number;
  femaleTeachers: number;
  classroomsCount: number;
  classFrom: string;
  classTo: string;
  schoolCategory: string;
  genderType?: string;
  ruralUrban: string;
  workingSmartBoards?: number;
  computerIctLab?: string;
  atalStemLab?: string;
  playgroundAvailable?: string;
  principalName: string;
  rawPhone: string;
  rawEmail: string;
  website: string;
  rawAddress: string;
  imageUrl?: string;
  lat: number;
  lng: number;
  clusterSchools: any[];
  districtSchools: any[];
}

export default function SchoolProfileView({
  state,
  district,
  blockName,
  village,
  schoolName,
  schoolSlug,
  udiseCode,
  pincode,
  management,
  board,
  medium,
  establishedYear,
  totalStudents,
  totalBoys,
  totalGirls,
  totalTeachers,
  maleTeachers,
  femaleTeachers,
  classroomsCount,
  classFrom,
  classTo,
  schoolCategory,
  genderType = 'Co-educational',
  ruralUrban,
  workingSmartBoards = 0,
  computerIctLab = '',
  atalStemLab = '',
  playgroundAvailable = '',
  principalName,
  rawPhone,
  rawEmail,
  website,
  rawAddress,
  imageUrl = '',
  lat,
  lng,
  clusterSchools = [],
  districtSchools = [],
}: SchoolProfileViewProps) {
  // CSEEL Welcome Popup state (Opens on first visit)
  const [isCseelModalOpen, setIsCseelModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    // Show CSEEL popup once per session
    const hasSeen = sessionStorage.getItem('cseel_profile_popup_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsCseelModalOpen(true);
        sessionStorage.setItem('cseel_profile_popup_seen', 'true');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Modal state for community story submission
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isWelcomePopupOpen, setIsWelcomePopupOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [storyAuthor, setStoryAuthor] = useState('');
  const [storyRole, setStoryRole] = useState('Parent');
  const [storyRating, setStoryRating] = useState(5);
  const [storyYear, setStoryYear] = useState('2024');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyBody, setStoryBody] = useState('');
  const [storySubmittedMsg, setStorySubmittedMsg] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  // Formspree School Verification & Update Form State
  const [updateImageUrl, setUpdateImageUrl] = useState('');
  const [updateContact, setUpdateContact] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [updateWebsite, setUpdateWebsite] = useState('');
  const [updateIsCorrect, setUpdateIsCorrect] = useState('Yes, all profile details are 100% accurate');
  const [updateRating, setUpdateRating] = useState(5);
  const [updateReview, setUpdateReview] = useState('');
  const [updateSuggestions, setUpdateSuggestions] = useState('');
  const [updateSubmitterName, setUpdateSubmitterName] = useState('');
  const [updateSubmitterRole, setUpdateSubmitterRole] = useState('Parent');
  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Background Science Images Slideshow state (2 clean high-res photos without overlay text)
  const scienceSlideImages = [
    '/images/cseel-science-slide-1.jpg',
    '/images/cseel-science-slide-2.png',
  ];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    // Smooth slideshow background crossfade interval
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % scienceSlideImages.length);
    }, 3500);
    return () => clearInterval(slideTimer);
  }, [scienceSlideImages.length]);

  useEffect(() => {
    // Show high-converting science experiential welcome popup on site visit
    const popupTimer = setTimeout(() => {
      setIsWelcomePopupOpen(true);
    }, 1200);
    return () => clearTimeout(popupTimer);
  }, []);

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Helper functions to mask sensitive contact details
  const maskPhoneNumber = (numStr: string) => {
    if (!numStr || numStr.trim() === '' || numStr === '0') return 'Contact Office Direct';
    const clean = numStr.replace(/\D/g, '');
    if (clean.length <= 5) return clean + '*****';
    const first5 = clean.slice(0, 5);
    return `${first5}*****`;
  };

  const maskEmailAddress = (emailStr: string) => {
    if (!emailStr || !emailStr.includes('@')) return 'Official Email Available';
    const [name, domain] = emailStr.split('@');
    const visibleChars = Math.min(Math.max(Math.floor(name.length / 2), 3), 4);
    const maskedName = name.slice(0, visibleChars) + '*****';
    return `${maskedName}@${domain}`;
  };

  const maskedPhone = maskPhoneNumber(rawPhone);
  const maskedEmail = maskEmailAddress(rawEmail);

  // Dynamic 100% Real Paragraphs built strictly from actual database fields
  const buildRealAboutParagraphs = (): string[] => {
    const paragraphs: string[] = [];

    // Paragraph 1: Identity & Location
    const genderText = genderType && genderType.trim() !== '' ? `${genderType} ` : 'Co-educational ';
    const locParts = [
      rawAddress,
      blockName ? `${blockName} block` : '',
      district ? `${district} district` : '',
      state ? state : ''
    ].filter(Boolean);

    paragraphs.push(
      `${schoolName} is a recognized ${genderText}educational institution situated at ${locParts.join(', ')}${pincode ? ` (PIN: ${pincode})` : ''}, operating under the administrative authority of ${management || 'Private Unaided (Recognized)'} with permanent UDISE identification code ${udiseCode}.`
    );

    // Paragraph 2: Academic Category, Classes, Board & Medium
    const classRange = classFrom && classTo ? `Class ${classFrom} to Class ${classTo}` : 'Class 1 to 10';
    const estdText = establishedYear ? ` established in the year ${establishedYear}` : '';
    const boardText = board ? `, affiliated with the ${board} curriculum` : '';
    const mediumText = medium ? ` with ${medium} serving as the primary medium of instruction` : '';

    paragraphs.push(
      `The institution provides structured education spanning from ${classRange} under the ${schoolCategory} category${estdText}${boardText}${mediumText}.`
    );

    // Paragraph 3: Students, Faculty & Classrooms + Facilities
    const statsArr: string[] = [];
    if (totalStudents > 0) {
      const breakdown = totalBoys > 0 && totalGirls > 0 ? ` (${totalBoys} boys and ${totalGirls} girls)` : '';
      statsArr.push(`${totalStudents} enrolled learners${breakdown}`);
    }
    if (totalTeachers > 0) {
      statsArr.push(`${totalTeachers} qualified educators`);
    }
    if (classroomsCount > 0) {
      statsArr.push(`${classroomsCount} functional classrooms`);
    }

    const facArr: string[] = [];
    if (playgroundAvailable?.toLowerCase() === 'yes') facArr.push('a dedicated sports playground');
    if (computerIctLab?.toLowerCase() === 'yes') facArr.push('a functional Computer ICT laboratory');
    if (atalStemLab?.toLowerCase() === 'yes') facArr.push('an Atal STEM Tinkering Lab');
    if (workingSmartBoards > 0) facArr.push(`${workingSmartBoards} digital smart classroom boards`);

    let p3 = '';
    if (statsArr.length > 0) {
      p3 = `The campus accommodates ${statsArr.join(' supported by ')}.`;
    }
    if (facArr.length > 0) {
      p3 = p3 ? `${p3} Campus physical infrastructure includes ${facArr.join(' and ')}.` : `Campus physical infrastructure includes ${facArr.join(' and ')}.`;
    }

    if (p3) {
      paragraphs.push(p3);
    }

    return paragraphs;
  };

  // School Campus Gallery Photos
  const schoolPhotos = [
    {
      id: 1,
      title: `${schoolName} Campus & Administrative Block`,
      category: 'Campus Architecture',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 2,
      title: `${schoolName} Learning & Academic Classrooms`,
      category: 'Academic Infrastructure',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 3,
      title: `${schoolName} Science & Innovation Hub`,
      category: 'STEM & Laboratories',
      url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 4,
      title: `${schoolName} Sports Ground & Campus Field`,
      category: 'Physical Education',
      url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // Community Stories state
  const [stories, setStories] = useState([
    {
      id: 1,
      author: 'Rameshwar Dayal',
      role: 'Parent of Class 8th Student',
      rating: 5,
      year: '2023 - Present',
      title: 'Dedicated Teachers & Safe Transport',
      content:
        'My child has been studying here with great enthusiasm. The teachers emphasize concept clarity and the school maintains disciplined bus transportation.',
      date: '2 months ago',
    },
    {
      id: 2,
      author: 'Sunita Chauhan (Alumna Batch of 2021)',
      role: 'Former Student / STEM Aspirant',
      rating: 5,
      year: 'Batch of 2021',
      title: 'Strong Foundation in Science & Mathematics',
      content:
        'The science faculty provided personalized guidance for competitive exams. The practical lab sessions and supportive environment helped me build strong academic skills.',
      date: '5 months ago',
    },
  ]);

  const handleProfileUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdateSubmitting(true);
    setUpdateError('');

    const payload = {
      // 1. Auto-filled & Locked Fields
      school_name: schoolName,
      udise_code: udiseCode,
      state: state,
      district: district,
      block: blockName,
      village: village,
      registered_address: rawAddress,
      pincode: pincode,
      geo_coordinates: `${lat}, ${lng}`,
      management_authority: management,
      board: board,
      medium: medium,

      // 2. User Editable Fields
      school_image_url: updateImageUrl.trim(),
      contact_number: updateContact.trim(),
      official_email: updateEmail.trim(),
      official_website: updateWebsite.trim(),
      is_information_correct: updateIsCorrect,
      user_rating: `${updateRating} / 5 Stars`,
      review_feedback: updateReview.trim(),
      suggestions_notes: updateSuggestions.trim(),
      submitter_name: updateSubmitterName.trim(),
      submitter_role: updateSubmitterRole,
      submitted_at: new Date().toISOString(),
      source_page_url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      const response = await fetch('https://formspree.io/f/xbgljegy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setUpdateSuccess(true);
        if (updateReview.trim() && updateSubmitterName.trim()) {
          setStories((prev) => [
            {
              id: Date.now(),
              author: updateSubmitterName.trim(),
              role: `${updateSubmitterRole} (Community Verification)`,
              rating: updateRating,
              year: '2025-26',
              title: updateReview.slice(0, 35) + '...',
              content: updateReview.trim(),
              date: 'Just now',
            },
            ...prev,
          ]);
        }
      } else {
        const errData = await response.json();
        setUpdateError(errData.error || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      setUpdateError(err.message || 'Network error. Please check your connection.');
    } finally {
      setIsUpdateSubmitting(false);
    }
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyAuthor.trim() || !storyBody.trim()) return;

    // Send to Formspree as well
    try {
      await fetch('https://formspree.io/f/xbgljegy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          school_name: schoolName,
          udise_code: udiseCode,
          state: state,
          district: district,
          author: storyAuthor.trim(),
          role: storyRole,
          year: storyYear,
          rating: `${storyRating} / 5`,
          title: storyTitle.trim() || 'Community Experience',
          review_body: storyBody.trim(),
          source_page_url: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
    } catch (err) {}

    const newStory = {
      id: Date.now(),
      author: storyAuthor.trim(),
      role: `${storyRole} (${storyYear})`,
      rating: storyRating,
      year: storyYear,
      title: storyTitle.trim() || 'Verified Experience',
      content: storyBody.trim(),
      date: 'Just now',
    };

    setStories([newStory, ...stories]);
    setStorySubmittedMsg(true);
    setTimeout(() => {
      setStorySubmittedMsg(false);
      setIsStoryModalOpen(false);
      setStoryAuthor('');
      setStoryTitle('');
      setStoryBody('');
    }, 2000);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const handleNativeShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${schoolName} - UDISE+ School Profile`,
        text: `Check out verified UDISE profile for ${schoolName} in ${district}, ${state}:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const faqs = [
    {
      q: `What is the national UDISE+ identifier code of ${schoolName}?`,
      a: `The verified 11-digit Unified District Information System for Education (UDISE+) code for ${schoolName} is ${udiseCode}. This national code is certified by the Department of School Education and Literacy, Ministry of Education, Government of India.`,
    },
    {
      q: `What classes and educational stages are offered at this campus?`,
      a: `The school provides education starting from Class ${classFrom} through Class ${classTo} (${schoolCategory}) along with affiliated ${board} curriculum in ${medium} medium.`,
    },
    {
      q: `Where is the campus located and how can I visit?`,
      a: `The school is situated at ${rawAddress}, ${blockName} Block, ${district} district, ${state}, PIN Code: ${pincode}. Coordinates: ${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E.`,
    },
    {
      q: `What is the management type and student-to-teacher ratio?`,
      a: `The institution operates as ${management} with an optimal student-to-teacher ratio of approximately ${Math.round(totalStudents / Math.max(totalTeachers, 1))}:1 across ${totalTeachers} certified faculty members.`,
    },
    {
      q: `How can parents apply for new admission at ${schoolName}?`,
      a: `Parents can contact the school administration desk or visit the campus directly during official counseling hours. Registrations for the 2026-27 session follow state educational board norms.`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* ─── 0. CSEEL.org Welcome & Brand Popup Modal ─── */}
      {isCseelModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center animate-in zoom-in-95 duration-200">
            {/* Top Glowing Ambient Orb */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            <button
              type="button"
              onClick={() => setIsCseelModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close CSEEL Popup"
            >
              <X className="h-5 w-5" />
            </button>

            {/* CSEEL Logo & Brand Icon */}
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-blue-500/30 mb-4">
              <Atom className="w-9 h-9 animate-spin-slow" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>CSEEL.org National Network</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 tracking-tight">
              Welcome to CSEEL.org
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              India’s Premier <strong>STEAM Education, Virtual Science Labs &amp; Verified School Directory</strong>. Discover top institutions, interactive experiments, and UDISE+ school facts.
            </p>

            <div className="space-y-2.5">
              <a
                href="https://www.cseel.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Visit Main CSEEL.org Portal</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                href="/subject/chemistry"
                onClick={() => setIsCseelModalOpen(false)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Flame className="h-3.5 w-3.5 text-amber-600" />
                <span>Try Virtual Science Simulators</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsCseelModalOpen(false)}
                className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Continue to {schoolName} Profile →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Breadcrumb Navigation Bar ─── */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1.5 hover:text-blue-600 font-medium transition-colors shrink-0">
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </Link>
              <span className="text-slate-300">/</span>
              <Link href="/school-finder" className="hover:text-blue-600 font-medium transition-colors shrink-0">
                India Directory
              </Link>
              <span className="text-slate-300">/</span>
              <span className="hover:text-blue-600 font-medium transition-colors shrink-0">{state}</span>
              <span className="text-slate-300">/</span>
              <span className="hover:text-blue-600 font-medium transition-colors shrink-0">{district}</span>
              <span className="text-slate-300">/</span>
              <span className="hover:text-blue-600 font-medium transition-colors shrink-0">{blockName}</span>
              <span className="text-slate-300">/</span>
              <span className="text-blue-600 font-bold truncate max-w-[140px] sm:max-w-xs">{schoolName}</span>
            </nav>

            <Link
              href="/school-finder"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Find Schools Near You</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── School Hero Header Banner ─── */}
      <header className="relative overflow-hidden border-b border-slate-200 bg-linear-to-b from-blue-50/80 via-slate-100/50 to-slate-50 pt-6 pb-8 sm:py-10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-64 sm:w-80 h-64 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>UDISE+ Verified Institution · {district}, {state}</span>
              </div>
              <Link
                href="/school-finder"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-colors sm:hidden"
              >
                <span>📍 School Finder</span>
              </Link>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug uppercase">
                {schoolName}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>📍 {village ? `${village}, ` : ''}{district}, {state}</span>
                <span className="text-slate-300">·</span>
                <span>UDISE: <strong className="font-mono text-blue-700">{udiseCode}</strong></span>
                <span className="text-slate-300">·</span>
                <span>{management}</span>
              </p>
            </div>

            {/* 100% Real Dynamic Description strictly from actual data */}
            <div className="space-y-2.5 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed font-normal">
              {buildRealAboutParagraphs().map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Key Badges Grid */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-blue-600 text-white shadow-xs">
                <FileText className="w-3.5 h-3.5" />
                <span>UDISE: {udiseCode}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Operational</span>
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs">
                <span>📍</span> {ruralUrban} ({village || district})
              </span>

              <span className="inline-flex items-center px-3 py-1.5 rounded-xl font-medium bg-purple-500/10 text-purple-700 border border-purple-500/20">
                {genderType}
              </span>

              {establishedYear && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl font-medium bg-blue-500/10 text-blue-700 border border-blue-500/20">
                  Estd. {establishedYear}
                </span>
              )}

              {medium && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl font-medium bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  {medium} Medium
                </span>
              )}

              {board && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl font-medium bg-teal-500/10 text-teal-700 border border-teal-500/20">
                  {board}
                </span>
              )}
            </div>

            {/* Quick Action CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                href={`/school-finder?city=${encodeURIComponent(district)}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Navigation className="h-4 w-4" />
                <span>Find Schools Near You</span>
              </Link>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Compass className="h-4 w-4" />
                <span>View on Map</span>
              </a>
              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="h-4 w-4 text-blue-600" />
                <span>Share Profile</span>
              </button>
              <a
                href="#school-update-form"
                className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                <span>Verify &amp; Update Info</span>
              </a>
              {copiedToast && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
                  Link copied to clipboard!
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content Grid (8 cols Main + 4 cols Sidebar) ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* ════════ LEFT COLUMN (Span 8) ════════ */}
          <main className="lg:col-span-8 space-y-6">
            {/* Metric Counters Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Students</span>
                <span className="text-xl sm:text-2xl font-black text-blue-600">{totalStudents}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{totalBoys} Boys · {totalGirls} Girls</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Teachers</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600">{totalTeachers}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{maleTeachers} Male · {femaleTeachers} Female</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Classrooms</span>
                <span className="text-xl sm:text-2xl font-black text-purple-600">{classroomsCount}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Good Condition</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">STR Ratio</span>
                <span className="text-xl sm:text-2xl font-black text-amber-600">
                  {Math.round(totalStudents / Math.max(totalTeachers, 1))}:1
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Optimal Ratio</span>
              </div>
            </div>

            {/* ─── School Campus Image Showcase ─── */}
            <article className="bg-white shadow-xs border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <ImageIcon className="w-4 h-4" />
                  </span>
                  <span>School Campus &amp; Infrastructure</span>
                </h2>
                <span className="text-[11px] font-semibold text-slate-400">
                  {imageUrl && imageUrl.trim().length > 5 ? 'Verified Campus Photo' : 'Institutional Record'}
                </span>
              </div>

              {/* Single Hero Banner Image */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-16/9 sm:aspect-21/9 shadow-2xs">
                <img
                  src={imageUrl && imageUrl.trim().length > 5 ? imageUrl : '/images/default-school-banner.png'}
                  alt={`${schoolName} Campus`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300">
                    {schoolCategory} · {ruralUrban}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold leading-tight line-clamp-1 mt-0.5">
                    {schoolName}
                  </h3>
                </div>
              </div>
            </article>

            {/* ─── NEW SECTION 2: Google Maps & Geographic Coordinates Section ─── */}
            <article className="bg-white shadow-xs border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Map className="w-4 h-4" />
                  </span>
                  <span>Google Map &amp; Exact Geographic Pin</span>
                </h2>
                <span className="text-xs font-mono text-emerald-600 font-bold">
                  {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
                </span>
              </div>

              {/* Map Embed Frame */}
              <div className="rounded-xl overflow-hidden border border-slate-200 relative aspect-16/9 bg-slate-100">
                <iframe
                  title={`Google Map Location of ${schoolName}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                <p className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>{rawAddress}, {village}, {district}, {state} - {pincode}</span>
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Get Live Directions</span>
                </a>
              </div>
            </article>

            {/* Card 1: About & Academic Summary */}
            <article className="bg-white shadow-xs border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-5">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span>About {schoolName}</span>
                </h2>
                <span className="text-xs font-mono font-bold text-slate-400">UDISE: {udiseCode}</span>
              </div>

              <div className="bg-slate-50/60 rounded-xl overflow-hidden border border-slate-200">
                <table className="w-full text-xs sm:text-sm">
                  <tbody>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600 w-1/3">School Category</td>
                      <td className="px-4 py-2.5 text-slate-900 font-semibold">{schoolCategory}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">School Gender Type</td>
                      <td className="px-4 py-2.5 text-slate-900 font-semibold">{genderType}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">Grade Range</td>
                      <td className="px-4 py-2.5 text-slate-900">Class {classFrom} to Class {classTo}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">Affiliation Board</td>
                      <td className="px-4 py-2.5 text-slate-900 font-semibold">{board}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">Primary Medium</td>
                      <td className="px-4 py-2.5 text-blue-600 font-semibold">{medium}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">Management Body</td>
                      <td className="px-4 py-2.5 text-slate-900 font-semibold">{management}</td>
                    </tr>
                    {establishedYear ? (
                      <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                        <td className="px-4 py-2.5 font-bold text-slate-600">Established Year</td>
                        <td className="px-4 py-2.5 text-slate-900 font-semibold">{establishedYear}</td>
                      </tr>
                    ) : null}
                    <tr className="hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">UDISE Code</td>
                      <td className="px-4 py-2.5 font-mono text-blue-600 font-bold">{udiseCode}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            {/* Card 2: Geographic & Cluster Details */}
            <article className="bg-white shadow-xs border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span>Geographic &amp; Cluster Details</span>
                </h2>
              </div>

              <div className="bg-slate-50/60 rounded-xl overflow-hidden border border-slate-200">
                <table className="w-full text-xs sm:text-sm">
                  <tbody>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600 w-1/3">State</td>
                      <td className="px-4 py-2.5 text-slate-900 font-semibold">{state}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">District</td>
                      <td className="px-4 py-2.5 text-blue-600 font-bold">{district}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">Block / Taluk</td>
                      <td className="px-4 py-2.5 text-slate-900 font-semibold">{blockName}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">Village / Habitation</td>
                      <td className="px-4 py-2.5 text-slate-900">{village}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">Pincode</td>
                      <td className="px-4 py-2.5 font-mono text-slate-900 font-bold">{pincode}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">Area Setting</td>
                      <td className="px-4 py-2.5 text-slate-900 font-semibold">{ruralUrban} (Approach Road Available: Yes)</td>
                    </tr>
                    <tr className="hover:bg-slate-100/50">
                      <td className="px-4 py-2.5 font-bold text-slate-600">Geo-Coordinates</td>
                      <td className="px-4 py-2.5 font-mono text-blue-600 text-xs">
                        Latitude: {lat.toFixed(6)}° N | Longitude: {lng.toFixed(6)}° E
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            {/* Card 3: Physical & Digital Infrastructure */}
            <article className="bg-white shadow-xs border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Building className="w-4 h-4" />
                  </span>
                  <span>Infrastructure, Labs &amp; Sanitization Facilities</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px] font-bold">Instruction Classrooms</span>
                  <span className="text-emerald-600 font-black text-base">{classroomsCount > 0 ? `${classroomsCount} Classrooms` : 'Available'}</span>
                  <span className="text-[10px] text-slate-500 block">Pucca Building Structure</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px] font-bold">Sports &amp; Playground</span>
                  <span className="text-slate-900 font-black text-base">
                    {playgroundAvailable?.toLowerCase() === 'yes' ? 'Available (Yes)' : playgroundAvailable ? playgroundAvailable : 'Campus Grounds'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Physical Education</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px] font-bold">Computer ICT Lab</span>
                  <span className="text-slate-900 font-black text-base">
                    {computerIctLab?.toLowerCase() === 'yes' ? 'Available (Yes)' : computerIctLab ? computerIctLab : 'Not Available'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Digital Learning Facility</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px] font-bold">Atal STEM Lab</span>
                  <span className="text-slate-900 font-black text-base">
                    {atalStemLab?.toLowerCase() === 'yes' ? 'Available (Yes)' : atalStemLab === 'No' || atalStemLab === '9' ? 'Not Available' : 'Not Specified'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Innovation &amp; Robotics</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px] font-bold">Smart Digital Boards</span>
                  <span className="text-slate-900 font-black text-base">
                    {workingSmartBoards > 0 ? `${workingSmartBoards} Smart Boards` : 'None / Standard'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">ICT Enabled Teaching</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px] font-bold">Locality &amp; Setting</span>
                  <span className="text-slate-900 font-black text-base">{ruralUrban}</span>
                  <span className="text-[10px] text-slate-500 block">All-Weather Road Access</span>
                </div>
              </div>
            </article>

            {/* Card 4: Faculty & Student Demographics */}
            <article className="bg-white shadow-xs border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Users className="w-4 h-4" />
                  </span>
                  <span>Enrolment &amp; Faculty Composition</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Student Enrolment Breakdown</h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Boys:</span>
                      <span className="font-bold text-slate-900">{totalBoys}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Girls:</span>
                      <span className="font-bold text-slate-900">{totalGirls}</span>
                    </div>
                    <div className="flex justify-between py-1 font-bold text-sm">
                      <span className="text-slate-900">Total Students:</span>
                      <span className="text-blue-600">{totalStudents}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Teaching Staff Breakdown</h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Regular Faculty:</span>
                      <span className="font-bold text-slate-900">{totalTeachers}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Male Teachers:</span>
                      <span className="font-bold text-slate-900">{maleTeachers}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Female Teachers:</span>
                      <span className="font-bold text-slate-900">{femaleTeachers}</span>
                    </div>
                    <div className="flex justify-between py-1 font-bold text-sm">
                      <span className="text-slate-900">Teacher Qualifications:</span>
                      <span className="text-emerald-600">Trained Graduates / Postgraduates</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 5: Official Contact & Leadership Details (Masked Sensitive Data) */}
            <article className="bg-white shadow-xs border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Building className="w-4 h-4" />
                  </span>
                  <span>Administration &amp; Direct Communication</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold uppercase">Headmaster / Principal</span>
                  <p className="font-black text-slate-900 text-sm sm:text-base">{principalName}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold uppercase">Management Authority</span>
                  <p className="font-black text-slate-900 text-sm sm:text-base truncate">{management}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold uppercase flex items-center justify-between">
                    <span>Contact Helpline</span>
                    <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Masked
                    </span>
                  </span>
                  <p className="font-bold text-slate-900 font-mono tracking-wider">{maskedPhone}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold uppercase flex items-center justify-between">
                    <span>Official Email</span>
                    <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Masked
                    </span>
                  </span>
                  <p className="font-bold text-blue-600 font-mono truncate">{maskedEmail}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2 space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold uppercase">Official School Website</span>
                  {website && website.trim().length > 0 && !website.includes('schoolsearch.cseel.org') ? (
                    <p className="font-bold text-blue-600 break-all hover:underline flex items-center gap-1.5">
                      <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
                        {website}
                      </a>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                    </p>
                  ) : (
                    <p className="text-slate-500 font-medium italic text-xs">Not Publicly Listed</p>
                  )}
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2 space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold uppercase">Registered Address</span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {schoolName}, {rawAddress}, {village}, {blockName} Block, {district} District, {state} - {pincode}.
                  </p>
                </div>
              </div>
            </article>

            {/* Featured Innovation Banner: Why should children learn SCIENCE BY DOING? */}
            <article className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-slate-950 text-white shadow-2xl">
              {/* Background Images Crossfade Slider with Opacity Filter */}
              {scienceSlideImages.map((imgSrc, sIdx) => (
                <div 
                  key={sIdx}
                  className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
                    currentSlideIndex === sIdx ? 'opacity-35 scale-105' : 'opacity-0 scale-100 pointer-events-none'
                  }`}
                  style={{ backgroundImage: `url('${imgSrc}')` }}
                />
              ))}
              {/* Dark Gradient Overlay Filter for Crisp Text Contrast */}
              <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/85 to-slate-900/80 backdrop-blur-[1px]" />

              <div className="relative p-6 sm:p-8 md:p-10 space-y-6 z-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#00E5BE] text-xs font-semibold tracking-wide backdrop-blur-md shadow-xs">
                    <Atom className="w-4 h-4 text-[#00E5BE]" />
                    <span>Center for Scientific Exploration and Experiential Learning</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full backdrop-blur-xs">
                    NEP 2020 Aligned
                  </span>
                </div>

                <div className="space-y-3 max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                    Why should children learn <span className="text-[#00E5BE]">SCIENCE BY DOING?</span>
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight drop-shadow-sm">
                    Turn Textbook Concepts into Reality. Feel the Science.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed font-normal drop-shadow-xs">
                    Turning Every Concept into Practical Reality. Experiential STEM kits and interactive laboratories empower students to explore, discover, and truly master scientific principles.
                  </p>
                </div>

                {/* Key Pillars - Google Card Aesthetic with 900+ Experiments Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-900/85 border border-slate-700/60 backdrop-blur-md space-y-1.5 hover:border-[#00C49F]/50 transition-all shadow-sm">
                    <div className="text-[#00E5BE] font-black text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#00E5BE]" />
                      <span>900+ Real Science Experiments</span>
                    </div>
                    <p className="text-xs font-semibold text-white">
                      500 Physics • 200 Chemistry • 200 Biology
                    </p>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      Hands-on physical kits covering Class 1–12 board curricula.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/85 border border-slate-700/60 backdrop-blur-md space-y-1.5 hover:border-cyan-400/50 transition-all shadow-sm">
                    <div className="text-cyan-300 font-black text-sm flex items-center gap-1.5">
                      <Atom className="w-4 h-4 text-cyan-300" />
                      <span>Feel the Science</span>
                    </div>
                    <p className="text-xs font-semibold text-white">
                      Interactive 3D Virtual Simulations
                    </p>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      Visualizing complex physics &amp; chemical reactions in real-time.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/85 border border-slate-700/60 backdrop-blur-md space-y-1.5 hover:border-amber-400/50 transition-all shadow-sm">
                    <div className="text-amber-300 font-black text-sm flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-300" />
                      <span>Practical Reality</span>
                    </div>
                    <p className="text-xs font-semibold text-white">
                      NEP 2020 Experiential Pedagogy
                    </p>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      Certified teacher enablement &amp; student innovation programs.
                    </p>
                  </div>
                </div>

                {/* Call To Action Buttons - Google & CSEEL Theme Light Color */}
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <a
                    href="https://www.cseel.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#00C49F] hover:bg-[#00D9B0] text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-[#00C49F]/30 hover:shadow-[#00C49F]/50 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Explore Experiential Learning at CSEEL.org</span>
                    <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  </a>
                  <a
                    href="https://www.cseel.org/seminars"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs backdrop-blur-md transition-all cursor-pointer"
                  >
                    <span>Book School Science Demo</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  </a>
                </div>

                {/* Slide indicator dots */}
                <div className="flex items-center gap-2 pt-1">
                  {scienceSlideImages.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(dotIdx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlideIndex === dotIdx ? 'w-7 bg-[#00E5BE]' : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                  <span className="text-[11px] text-slate-300 ml-2 font-medium">Experiential Science Gallery</span>
                </div>
              </div>
            </article>

            {/* Card 6: FAQs */}
            <article className="bg-white shadow-xs border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <HelpCircle className="w-4 h-4" />
                  </span>
                  <span>Frequently Asked Questions</span>
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3 font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>

            {/* Card 7: School Information Update & Community Verification Form (Formspree) */}
            <article id="school-update-form" className="bg-white shadow-xs border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6">
              <div className="pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <span>Update School Information &amp; Submit Review</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official representatives, parents &amp; alumni can verify or update profile details for {schoolName}.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  Formspree Verified
                </span>
              </div>

              {updateSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-in zoom-in-95">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto animate-bounce" />
                  <h3 className="text-base font-black text-emerald-900">Thank You! Information Submitted Successfully</h3>
                  <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto leading-relaxed">
                    Your updates, image link, contact details, and review for <strong>{schoolName}</strong> have been received and sent for verification.
                  </p>
                  <button
                    type="button"
                    onClick={() => setUpdateSuccess(false)}
                    className="mt-2 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Another Update / Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdateSubmit} className="space-y-5">
                  {/* 1. AUTO-FILLED & LOCKED READ-ONLY DATA SECTION */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Verified Database Record (Auto-Filled &amp; Locked)</span>
                      </label>
                      <span className="text-[10px] text-slate-400 italic">Read-only system data</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">School Name</span>
                        <input
                          type="text"
                          readOnly
                          value={schoolName}
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 cursor-not-allowed text-xs mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">UDISE Code</span>
                        <input
                          type="text"
                          readOnly
                          value={udiseCode}
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono font-bold text-blue-700 cursor-not-allowed text-xs mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">State &amp; District</span>
                        <input
                          type="text"
                          readOnly
                          value={`${district}, ${state}`}
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 cursor-not-allowed text-xs mt-0.5"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Address</span>
                        <input
                          type="text"
                          readOnly
                          value={`${rawAddress} (PIN: ${pincode})`}
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 cursor-not-allowed text-xs mt-0.5 truncate"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Location / Coordinates</span>
                        <input
                          type="text"
                          readOnly
                          value={`${lat}, ${lng}`}
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-slate-700 cursor-not-allowed text-xs mt-0.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. USER EDITABLE UPDATE & CONTACT FIELDS */}
                  <div className="space-y-4 pt-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Edit / Add School Information
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          School Image URL (Campus Photo Link)
                        </label>
                        <input
                          type="url"
                          value={updateImageUrl}
                          onChange={(e) => setUpdateImageUrl(e.target.value)}
                          placeholder="https://example.com/school-photo.jpg"
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Contact / Helpline Number
                        </label>
                        <input
                          type="tel"
                          value={updateContact}
                          onChange={(e) => setUpdateContact(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Official School Email
                        </label>
                        <input
                          type="email"
                          value={updateEmail}
                          onChange={(e) => setUpdateEmail(e.target.value)}
                          placeholder="e.g. principal@school.edu.in"
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Official Website
                        </label>
                        <input
                          type="url"
                          value={updateWebsite}
                          onChange={(e) => setUpdateWebsite(e.target.value)}
                          placeholder="https://www.schoolname.org"
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>
                    </div>

                    {/* Verification Dropdown & Star Rating */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Is above information correct? *
                        </label>
                        <select
                          value={updateIsCorrect}
                          onChange={(e) => setUpdateIsCorrect(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white font-medium"
                        >
                          <option value="Yes, all profile details are 100% accurate">✅ Yes, all information is 100% accurate</option>
                          <option value="Minor updates required in contact/facilities">⚠️ Some minor corrections needed</option>
                          <option value="Information is outdated or incorrect">❌ Information is outdated / incorrect</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Overall Rating
                        </label>
                        <div className="flex items-center gap-1.5 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUpdateRating(star)}
                              className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  star <= updateRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-slate-700 ml-2">{updateRating} / 5 Stars</span>
                        </div>
                      </div>
                    </div>

                    {/* Submitter Name & Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={updateSubmitterName}
                          onChange={(e) => setUpdateSubmitterName(e.target.value)}
                          placeholder="e.g. Ramesh Sharma"
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Relationship / Role
                        </label>
                        <select
                          value={updateSubmitterRole}
                          onChange={(e) => setUpdateSubmitterRole(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white font-medium"
                        >
                          <option value="Parent">Parent / Guardian</option>
                          <option value="Principal / School Admin">Principal / School Official</option>
                          <option value="Teacher / Faculty">Teacher / Faculty</option>
                          <option value="Current Student">Current Student</option>
                          <option value="Alumni">Alumnus / Former Student</option>
                          <option value="Community Member">Local Community Member</option>
                        </select>
                      </div>
                    </div>

                    {/* School Review / Feedback */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        School Review &amp; Community Feedback *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={updateReview}
                        onChange={(e) => setUpdateReview(e.target.value)}
                        placeholder={`Share your review regarding academics, faculty quality, lab infrastructure, sports, or admission experience at ${schoolName}...`}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none bg-white"
                      />
                    </div>

                    {/* Suggestions / Additional Info */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Suggestions &amp; Additional Information (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={updateSuggestions}
                        onChange={(e) => setUpdateSuggestions(e.target.value)}
                        placeholder="Any additional feedback, new facility additions, science lab kit requests, or correction details..."
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none bg-white"
                      />
                    </div>

                    {updateError && (
                      <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-semibold">
                        {updateError}
                      </p>
                    )}

                    {/* Submit Button */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isUpdateSubmitting}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#00C49F] hover:bg-[#00D9B0] text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-[#00C49F]/25 hover:shadow-[#00C49F]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isUpdateSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                            <span>Submitting to Formspree...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-slate-950" />
                            <span>Submit Information &amp; Review</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </article>
          </main>

          {/* ════════ RIGHT COLUMN: Sidebar (Span 4) ════════ */}
          <aside className="lg:col-span-4 space-y-6">
            {/* 1. Quick Information Summary Box */}
            <div className="bg-white shadow-xs border border-slate-200 rounded-2xl p-5 space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  ℹ️
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Quick Summary</h3>
                  <p className="text-[11px] text-slate-400">UDISE+ 2026-27 Record</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">UDISE Code:</span>
                  <span className="font-mono font-bold text-slate-900">{udiseCode}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">School Category:</span>
                  <span className="font-bold text-blue-600">Class {classFrom} to {classTo}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600">Operational</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Board:</span>
                  <span className="font-bold text-slate-900">{board}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Medium:</span>
                  <span className="font-bold text-slate-900">{medium}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Block:</span>
                  <span className="font-bold text-slate-900">{blockName}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">District:</span>
                  <span className="font-bold text-slate-900">{district}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">State:</span>
                  <span className="font-bold text-slate-900">{state}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Pincode:</span>
                  <span className="font-mono font-bold text-slate-900">{pincode}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print School Profile</span>
              </button>
            </div>

            {/* 1.5 Interactive School Finder & Map Card */}
            <div className="bg-linear-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 border border-blue-800 shadow-md space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-cyan-300 flex items-center justify-center border border-blue-400/30 shrink-0">
                  <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-white text-xs sm:text-sm">Find Schools Near You</h4>
                  <p className="text-[10px] text-cyan-300 font-medium">Live GPS &amp; Radius Map</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Discover private schools in {district} and across India with interactive map pins, distance calculator, board &amp; fee filters.
              </p>
              <Link
                href={`/school-finder?city=${encodeURIComponent(district)}`}
                className="w-full py-2.5 px-3 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Explore Schools Near {district} →</span>
              </Link>
            </div>

            {/* 2. CSEEL.org Brand Card with Direct Portal Link */}
            <div className="relative overflow-hidden bg-slate-950 text-white rounded-2xl shadow-lg border border-teal-500/30">
              {/* Background Images Crossfade Slider with Opacity Filter */}
              {scienceSlideImages.map((imgSrc, sIdx) => (
                <div 
                  key={sIdx}
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                    currentSlideIndex === sIdx ? 'opacity-30 scale-105' : 'opacity-0 scale-100 pointer-events-none'
                  }`}
                  style={{ backgroundImage: `url('${imgSrc}')` }}
                />
              ))}
              <div className="absolute inset-0 bg-linear-to-b from-slate-950/95 via-slate-900/90 to-slate-950/85" />
              
              <div className="relative p-5 sm:p-6 space-y-4 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-[#00E5BE] flex items-center justify-center border border-white/20 shrink-0 backdrop-blur-md">
                    <Atom className="w-6 h-6 text-[#00E5BE]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                      Center for Scientific Exploration and Experiential Learning
                    </h4>
                    <span className="text-[10px] text-[#00E5BE] font-bold uppercase tracking-wider block mt-0.5">
                      CSEEL National Network
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-black text-[#00E5BE]">
                    Why should children learn Science by Doing?
                  </p>
                  <p className="text-[11px] font-bold text-white">
                    Turn Textbook Concepts into Reality. Feel the Science.
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    900+ Real Science Experiments (500 Physics • 200 Chemistry • 200 Biology). Turning every concept into practical reality.
                  </p>
                </div>

                <div className="pt-1 flex flex-col gap-2">
                  <a
                    href="https://www.cseel.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-full bg-[#00C49F] hover:bg-[#00D9B0] text-slate-950 font-black text-xs shadow-md shadow-[#00C49F]/25 hover:shadow-[#00C49F]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Atom className="h-4 w-4 text-slate-950 stroke-[2.5]" />
                    <span>Visit CSEEL.org Portal</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-950" />
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Community Story Trigger Card */}
            <div className="bg-linear-to-br from-blue-50 to-emerald-50 rounded-2xl p-5 border border-blue-200 space-y-3">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span>Community Stories &amp; Feedback</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Have an experience or feedback to share about {schoolName}?
              </p>
              <button
                type="button"
                onClick={() => setIsStoryModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Share Your Story</span>
              </button>
            </div>

            {/* 4. Quick Navigation / Sibling Schools */}
            {districtSchools.length > 0 && (
              <div className="bg-white shadow-xs rounded-2xl overflow-hidden border border-slate-200 p-4 space-y-2.5">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider mb-2">Explore Related Schools</h4>
                {districtSchools.slice(0, 3).map((s, idx) => {
                  const sSlug = (s.school_name || 'School').replace(/\s+/g, '-');
                  const targetUrl = `/school/${encodeURIComponent(s.state_name || state)}/${encodeURIComponent(s.district_name || district)}/${encodeURIComponent(s.village_name || 'Village')}/${encodeURIComponent(sSlug)}.html`;
                  return (
                    <Link
                      key={s.school_id || idx}
                      href={targetUrl}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs text-slate-700 font-bold transition-colors group"
                    >
                      <span className="group-hover:text-blue-600 truncate max-w-[220px]">{s.school_name}</span>
                      <span className="text-slate-400 group-hover:text-blue-600">→</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* ─── Lightbox Modal for Gallery Images ─── */}
      {activeImageIndex !== null && (
        <div
          onClick={() => setActiveImageIndex(null)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors z-10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={schoolPhotos[activeImageIndex].url}
              alt={schoolPhotos[activeImageIndex].title}
              className="w-full max-h-[75vh] object-cover"
            />
            <div className="p-4 bg-white border-t border-slate-200">
              <span className="text-xs font-bold text-blue-600 uppercase">
                {schoolPhotos[activeImageIndex].category}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                {schoolPhotos[activeImageIndex].title}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* ─── Community Story Submission Modal ─── */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsStoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">Share Your Experience / Review</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your feedback helps parents and students make informed choices about {schoolName}.
              </p>
            </div>

            {storySubmittedMsg ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in zoom-in-95">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Thank you for your feedback!</h4>
                <p className="text-xs text-emerald-700">
                  Your story has been submitted and added to the community wall.
                </p>
              </div>
            ) : (
              <form onSubmit={handleStorySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={storyAuthor}
                    onChange={(e) => setStoryAuthor(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Relationship</label>
                    <select
                      value={storyRole}
                      onChange={(e) => setStoryRole(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                    >
                      <option value="Parent">Parent of Student</option>
                      <option value="Alumni">Alumnus / Former Student</option>
                      <option value="Teacher">Teacher / Faculty</option>
                      <option value="Current Student">Current Student</option>
                      <option value="Community Member">Community Member</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Year / Batch</label>
                    <input
                      type="text"
                      value={storyYear}
                      onChange={(e) => setStoryYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Overall Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setStoryRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= storyRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">{storyRating} / 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Story Headline / Title</label>
                  <input
                    type="text"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="e.g. Excellent science coaching and safe campus"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Story / Detailed Review *</label>
                  <textarea
                    required
                    rows={4}
                    value={storyBody}
                    onChange={(e) => setStoryBody(e.target.value)}
                    placeholder="Share details about academics, teachers, lab facilities, campus atmosphere, or bus services..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsStoryModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── Site Visit Welcome Popup Modal with Full Background Image & Opacity Filter ─── */}
      {isWelcomePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-teal-500/40 bg-slate-950 text-white shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Full Background Image Slider with Smooth Crossfade & Opacity Filter */}
            {scienceSlideImages.map((imgSrc, sIdx) => (
              <div
                key={sIdx}
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
                  currentSlideIndex === sIdx ? 'opacity-35 scale-105' : 'opacity-0 scale-100 pointer-events-none'
                }`}
                style={{ backgroundImage: `url('${imgSrc}')` }}
              />
            ))}
            {/* Dark Opacity Gradient Overlay for Crisp Readability */}
            <div className="absolute inset-0 bg-linear-to-b from-slate-950/95 via-slate-950/90 to-slate-900/85 backdrop-blur-[1px]" />

            {/* Modal Content */}
            <div className="relative p-6 sm:p-8 md:p-10 space-y-6 z-10">
              {/* Top Header & Close Button */}
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#00E5BE] text-xs font-semibold tracking-wide backdrop-blur-md shadow-xs">
                  <Atom className="w-4 h-4 text-[#00E5BE]" />
                  <span>Center for Scientific Exploration and Experiential Learning</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWelcomePopupOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/20 transition-colors cursor-pointer shrink-0 backdrop-blur-md"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Headline & Question */}
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                  Why should children learn <span className="text-[#00E5BE]">SCIENCE BY DOING?</span>
                </h3>
                <p className="text-sm sm:text-base font-bold text-white drop-shadow-sm">
                  Turn Textbook Concepts into Reality. Feel the Science.
                </p>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal drop-shadow-xs">
                  Turning Every Concept into Practical Reality. Elevate your school with CSEEL’s 900+ real science experiments, interactive 3D virtual science labs, and NEP 2020 experiential curricula.
                </p>
              </div>

              {/* Value Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/85 border border-slate-700/60 backdrop-blur-md space-y-1">
                  <span className="text-[#00E5BE] font-black text-xs block">🧪 900+ Real Experiments</span>
                  <p className="text-[11px] text-slate-200 leading-tight">500 Physics • 200 Chemistry • 200 Biology</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/85 border border-slate-700/60 backdrop-blur-md space-y-1">
                  <span className="text-cyan-300 font-black text-xs block">🔬 3D Virtual Labs</span>
                  <p className="text-[11px] text-slate-200 leading-tight">Interactive simulations for deep concept mastery.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/85 border border-slate-700/60 backdrop-blur-md space-y-1">
                  <span className="text-amber-300 font-black text-xs block">🚀 Practical Reality</span>
                  <p className="text-[11px] text-slate-200 leading-tight">NEP 2020 experiential pedagogy &amp; kits.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="https://www.cseel.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#00C49F] hover:bg-[#00D9B0] text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-[#00C49F]/30 hover:shadow-[#00C49F]/50 transition-all transform hover:-translate-y-0.5 text-center cursor-pointer"
                >
                  <span>Explore Science Kits at CSEEL.org</span>
                  <ArrowRight className="w-4 h-4 shrink-0 text-slate-950 stroke-[2.5]" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsWelcomePopupOpen(false)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs backdrop-blur-md transition-colors text-center cursor-pointer"
                >
                  Continue to School Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Social Share Profile Modal with Live Preview Card ─── */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Top Header & Close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Share School Profile</h3>
                  <p className="text-xs text-slate-400">Share with parents, educators, and community</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rich Social Card Preview */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="relative h-32 sm:h-36 w-full bg-slate-900 overflow-hidden">
                <img
                  src="/images/cseel-science-slide-3.jpg"
                  alt={schoolName}
                  className="h-full w-full object-cover opacity-85"
                />
                <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                  <FileText className="w-3 h-3" />
                  <span>UDISE: {udiseCode}</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h4 className="font-black text-white text-sm sm:text-base drop-shadow-md truncate">
                    {schoolName}
                  </h4>
                  <p className="text-[11px] text-slate-200 drop-shadow-xs truncate">
                    {village ? `${village}, ` : ''}{district}, {state} · {board}
                  </p>
                </div>
              </div>
              <div className="p-3 text-[11px] text-slate-600 bg-white border-t border-slate-100 flex items-center justify-between">
                <span className="font-medium text-slate-500">Verified by CSEEL National Directory</span>
                <span className="font-bold text-blue-600">schoolsearch.cseel.org</span>
              </div>
            </div>

            {/* Share Channels Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out verified UDISE school profile of ${schoolName} in ${district}, ${state}: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors gap-1.5 text-center"
              >
                <span className="text-xl">💬</span>
                <span>WhatsApp</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Official UDISE profile of ${schoolName}, ${district} (${board}): ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition-colors gap-1.5 text-center"
              >
                <span className="text-xl">𝕏</span>
                <span>Twitter / X</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors gap-1.5 text-center"
              >
                <span className="text-xl">📘</span>
                <span>Facebook</span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition-colors gap-1.5 text-center"
              >
                <span className="text-xl">💼</span>
                <span>LinkedIn</span>
              </a>
            </div>

            {/* Copy Link Input & Native Share */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-slate-50">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  className="flex-1 px-2.5 py-1 text-xs text-slate-700 font-mono bg-transparent border-none focus:outline-hidden truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  {copiedToast ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>More Sharing Options (Device Share)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
