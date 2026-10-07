'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Play,
  Users,
  Award,
  Building,
  Building2,
  Compass,
  Eye,
  Target,
  Heart,
  Check,
  FlaskConical,
  Monitor,
  Bot,
  BookOpen,
  Tv,
  Activity,
  Palette,
  Bus,
  HeartPulse,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  X,
  Send,
  CheckCircle2,
  Star,
  ShieldCheck,
  CreditCard,
  FileText,
  Calendar,
  Clock,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Lock,
  User,
  GraduationCap,
  Filter,
  Percent,
  Globe,
  Copy,
  Layers,
  Navigation,
  Crosshair,
  Maximize2,
  Menu,
  Home,
  Info,
  Lightbulb,
  Edit3,
  Trash2,
  Plus,
  EyeOff
} from 'lucide-react';
import {
  ScienceLabIllustration,
  ComputerLabIllustration,
  RoboticsLabIllustration,
  LibraryIllustration,
  SmartClassroomIllustration,
  SportsIllustration,
  ArtMusicIllustration,
  AuditoriumIllustration,
  TransportIllustration,
  MedicalRoomIllustration,
  PrincipalDeskIllustration,
  SchoolCampusIllustration
} from '@/components/illustrations/FacilityIllustrations';
import Footer from '@/components/layout/Footer';
import SchoolPhotoBook from '@/components/schools/SchoolPhotoBook';
import AiProfileTemplateGuide, { AiSectionInstructionBadge } from '@/components/schools/AiProfileTemplateGuide';
import { useOptionalSchoolTemplate } from '@/components/schools/template/SchoolTemplateContext';
import TemplateControlBar from '@/components/schools/template/TemplateControlBar';
import EditableText from '@/components/schools/template/EditableText';
import EditableImage from '@/components/schools/template/EditableImage';
import AddCardModal, { ICON_MAP, ILLUSTRATION_MAP } from '@/components/schools/template/AddCardModal';

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
  isTemplate?: boolean;
}

type TabType =
  | 'home'
  | 'about'
  | 'academics'
  | 'facilities'
  | 'extracurricular'
  | 'awards'
  | 'events'
  | 'faculty'
  | 'gallery'
  | 'admissions'
  | 'reviews'
  | 'contact';

const navTabs: { id: TabType; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home },
  { id: 'about', label: 'About Us', shortLabel: 'About', icon: Info },
  { id: 'academics', label: 'Academics', shortLabel: 'Academics', icon: BookOpen },
  { id: 'facilities', label: 'Facilities', shortLabel: 'Facilities', icon: Layers },
  { id: 'extracurricular', label: 'Extracurricular & Sports', shortLabel: 'Activities', icon: Activity },
  { id: 'awards', label: 'Awards & Honors', shortLabel: 'Awards', icon: Award },
  { id: 'events', label: 'Events & Life', shortLabel: 'Events', icon: Calendar },
  { id: 'faculty', label: 'Faculty & Mentors', shortLabel: 'Faculty', icon: Users },
  { id: 'gallery', label: 'Campus Gallery', shortLabel: 'Gallery', icon: Eye },
  { id: 'admissions', label: 'Admissions & Fees', shortLabel: 'Admissions', icon: GraduationCap },
  { id: 'reviews', label: 'Reviews & Ratings', shortLabel: 'Reviews', icon: Star },
  { id: 'contact', label: 'Contact Us', shortLabel: 'Contact', icon: Phone }
];

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
  totalTeachers,
  classroomsCount,
  classFrom,
  classTo,
  schoolCategory,
  genderType,
  ruralUrban,
  totalBoys,
  totalGirls,
  principalName,
  rawPhone,
  rawEmail,
  website,
  rawAddress,
  lat = 28.1885,
  lng = 76.6215,
  imageUrl,
  clusterSchools = [],
  districtSchools = [],
  isTemplate = false,
}: SchoolProfileViewProps) {
  // AI Template Guidance toggle
  const [showAiGuide, setShowAiGuide] = useState(true);

  // Modal states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [authEmailOrPhone, setAuthEmailOrPhone] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRole, setAuthRole] = useState<'Parent' | 'Student' | 'Alumni'>('Parent');
  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Reviews filters, vertical list pagination & interactive states
  const [reviewRoleFilter, setReviewRoleFilter] = useState<'all' | 'Parent' | 'Student' | 'Alumni'>('all');
  const [reviewStarFilter, setReviewStarFilter] = useState<number | 'all'>('all');
  const [reviewSearchText, setReviewSearchText] = useState('');
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(4);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewSortBy, setReviewSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');
  const [userLikesMap, setUserLikesMap] = useState<Record<number, boolean>>({});

  // 5-Point Questionnaire Ratings (Questions asked to Parents & Students)
  const [ratingOverall, setRatingOverall] = useState(5); // Q1: Overall experience & recommendation
  const [ratingAcademics, setRatingAcademics] = useState(5); // Q2: Academics & faculty teaching quality
  const [ratingInfrastructure, setRatingInfrastructure] = useState(5); // Q3: Infrastructure, campus & labs
  const [ratingSafety, setRatingSafety] = useState(5); // Q4: Student safety & discipline
  const [ratingSports, setRatingSports] = useState(5); // Q5: Sports & extracurricular activities
  const [ratingValue, setRatingValue] = useState(5); // Q6: Value for money & fees
  const [reviewerClass, setReviewerClass] = useState('');
  // Image fallback state dictionary: maps image keys to boolean
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Map interactive states
  const [mapMode, setMapMode] = useState<'osm' | 'satellite' | 'google'>('osm');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  // Tab-based SPA navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Interactive Live Template Context
  const templateCtx = useOptionalSchoolTemplate();
  const isLiveTemplate = isTemplate && !!templateCtx;
  const templateData = templateCtx?.data;
  const isEditMode = isLiveTemplate ? (templateCtx?.isEditMode ?? true) : false;

  // Add Card Modals for Facilities and Admissions
  const [isAddFacilityModalOpen, setIsAddFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any | null>(null);
  const [isAddAdmissionModalOpen, setIsAddAdmissionModalOpen] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState<any | null>(null);

  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter tabs according to school's tab visibility settings (in preview mode)
  const effectiveNavTabs = navTabs.filter((tab) => {
    if (isLiveTemplate && !isEditMode) {
      return templateData?.tabVisibility?.[tab.id] !== false;
    }
    return true;
  });

  // Mobile swipe gestures: STRICTLY Left Edge Swipe (< 30px) or Handle to prevent accidental triggering when swiping cards/flipbook
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;
      const elapsed = Date.now() - startTime;

      // Ignore if gesture took too long (> 600ms) or is mostly vertical scroll
      if (elapsed > 600) return;
      if (Math.abs(diffY) > 60) return;

      // STRICT Left Edge swipe ONLY: user must touch within 30px of the extreme left edge
      // and swipe rightwards by at least 40px. Swiping anywhere in the middle of screen will NOT open menu!
      const isStrictEdgeSwipe = startX <= 30 && diffX > 40;

      if (isStrictEdgeSwipe) {
        setIsMobileMenuOpen(true);
      } else if (diffX < -50 && Math.abs(diffX) > Math.abs(diffY)) {
        // Swipe back right-to-left closes menu
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // 5 Real Rotating Hero Slides (Max 5 photos with auto-advance)
  const heroSlides = [
    {
      id: 1,
      image: '/images/schools/hero-brightfuture.jpg',
      badge: 'LEARN • GROW • ACHIEVE',
      tag: 'Nurturing Global Minds',
      heading: 'Building Brighter',
      highlight: 'Futures',
      desc: 'We nurture curious minds, build strong values and prepare future-ready students for a changing world.'
    },
    {
      id: 2,
      image: '/images/brightfuture/about_campus.jpg',
      badge: 'WORLD-CLASS INFRASTRUCTURE',
      tag: '12-Acre Green Campus',
      heading: 'Inspiring Modern',
      highlight: 'Campus',
      desc: 'Sprawling green sports fields, clock tower architecture, and digitally enabled learning environments.'
    },
    {
      id: 3,
      image: '/images/real-facilities/science-lab.jpg',
      badge: 'EXPERIENTIAL PRACTICAL LEARNING',
      tag: 'NEP 2020 Aligned Labs',
      heading: 'Hands-On Discovery',
      highlight: 'Laboratories',
      desc: 'High-precision analytical chemistry, physics apparatus, and biology research benches for every student.'
    },
    {
      id: 4,
      image: '/images/real-facilities/robotics-lab.jpg',
      badge: 'FUTURE-READY STEM & AI',
      tag: 'Atal Tinkering Innovation Hub',
      heading: 'Robotics & Future',
      highlight: 'Innovations',
      desc: 'Hands-on 3D printing, autonomous rover electronics, Arduino sensors, and school coding bootcamps.'
    },
    {
      id: 5,
      image: '/images/real-facilities/library.jpg',
      badge: 'COLLABORATIVE SCHOLARSHIP',
      tag: '15,000+ Curated Books',
      heading: 'The World of Books &',
      highlight: 'Wisdom',
      desc: 'Sunlit quiet study zones, international research periodicals, and state-of-the-art digital OPAC kiosks.'
    }
  ];

  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // Auto-advance hero slides every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Open inline review questionnaire directly on the page
  const handleInitiateWriteReview = () => {
    setIsWriteReviewOpen(true);
    setTimeout(() => {
      const el = document.getElementById('write-review-questionnaire-card');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const handleToggleLike = (id: number) => {
    setUserLikesMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Horizontal scroll container refs
  const credentialsScrollRef = useRef<HTMLDivElement>(null);
  const principlesScrollRef = useRef<HTMLDivElement>(null);
  const facilitiesScrollRef = useRef<HTMLDivElement>(null);
  const admissionsScrollRef = useRef<HTMLDivElement>(null);
  const feesScrollRef = useRef<HTMLDivElement>(null);
  const otherChargesScrollRef = useRef<HTMLDivElement>(null);
  const feeNotesScrollRef = useRef<HTMLDivElement>(null);
  const reviewsScrollRef = useRef<HTMLDivElement>(null);

  // Active indices for scroll-linked dot indicators
  const [credentialsActiveIndex, setCredentialsActiveIndex] = useState(0);
  const [principlesActiveIndex, setPrinciplesActiveIndex] = useState(0);
  const [facilitiesActiveIndex, setFacilitiesActiveIndex] = useState(0);
  const [admissionsActiveIndex, setAdmissionsActiveIndex] = useState(0);
  const [feesActiveIndex, setFeesActiveIndex] = useState(0);
  const [otherChargesActiveIndex, setOtherChargesActiveIndex] = useState(0);
  const [feeNotesActiveIndex, setFeeNotesActiveIndex] = useState(0);
  const [reviewsActiveIndex, setReviewsActiveIndex] = useState(0);

  const scrollHorizontally = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right', distance = 360) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -distance : distance,
        behavior: 'smooth'
      });
    }
  };

  const handleContainerScroll = (e: React.UIEvent<HTMLDivElement>, setIndex: (i: number) => void) => {
    const el = e.currentTarget;
    const card = el.firstElementChild as HTMLElement;
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const gap = 16;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setIndex(Math.max(0, idx));
  };

  const scrollToCard = (ref: React.RefObject<HTMLDivElement | null>, index: number) => {
    if (!ref.current) return;
    const el = ref.current;
    const target = el.children[index] as HTMLElement;
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  };

  const renderScrollDots = (
    total: number,
    activeIndex: number,
    ref: React.RefObject<HTMLDivElement | null>,
    extraClass = ''
  ) => {
    if (total <= 1) return null;
    return (
      <div className={`flex items-center justify-center gap-1.5 pt-4 pb-1 ${extraClass}`}>
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to card ${idx + 1}`}
            onClick={() => scrollToCard(ref, idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === activeIndex
                ? 'w-7 h-2 bg-[#006FCC] shadow-xs'
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    );
  };

  // Review states
  const [userRating, setUserRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('Parent');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: 'Sunita Verma',
      role: 'Parent',
      studentClass: 'Parent of Class 8 Student',
      date: '2 weeks ago',
      rating: 5,
      likes: 34,
      comment:
        'The hands-on practical science labs and faculty dedication are truly commendable. Teachers explain concepts patiently in both Hindi and English. Safe GPS-tracked bus transport with polite attendants gives complete peace of mind.',
      metrics: { academics: 5, infrastructure: 5, safety: 5, sports: 4, value: 5 }
    },
    {
      id: 2,
      author: 'Rajesh Kulkarni',
      role: 'Parent',
      studentClass: 'Parent of Class 10 Student',
      date: '1 month ago',
      rating: 5,
      likes: 27,
      comment:
        'Outstanding academic discipline combined with NEP 2020 experiential learning. The teachers give individual attention to each child, so external tuition is completely unnecessary. Clean campus and well-equipped physics & chemistry labs.',
      metrics: { academics: 5, infrastructure: 4, safety: 5, sports: 5, value: 5 }
    },
    {
      id: 3,
      author: 'Aman Preet Singh',
      role: 'Alumni',
      studentClass: 'Batch 2024 (96.4% in CBSE 12th)',
      date: '2 months ago',
      rating: 5,
      likes: 42,
      comment:
        'Studied here from Class 6 to 12. The Atal Tinkering Lab, robotics kits and library resources built my foundation for cracking competitive exams. Blessed to have such supportive mentors who stayed after school hours to clear doubts.',
      metrics: { academics: 5, infrastructure: 5, safety: 5, sports: 4, value: 5 }
    },
    {
      id: 4,
      author: 'Pooja Hegde',
      role: 'Parent',
      studentClass: 'Parent of Class 2 Student',
      date: '3 months ago',
      rating: 4,
      likes: 19,
      comment:
        'The primary wing teachers are so warm and nurturing! Activity-based foundational learning makes my child love going to school every morning without tears. Clean washrooms, hygienic drinking water, and secure campus boundary.',
      metrics: { academics: 4, infrastructure: 4, safety: 5, sports: 4, value: 4 }
    },
    {
      id: 5,
      author: 'Col. Arvind Mehra',
      role: 'Parent',
      studentClass: 'Parent of Class 9 Student',
      date: '3 months ago',
      rating: 5,
      likes: 31,
      comment:
        'Discipline, physical fitness and mental agility are prioritized equally. The football coach and sports academy here have trained my son for district championships. CCTV security and campus entry protocols are top-notch.',
      metrics: { academics: 5, infrastructure: 5, safety: 5, sports: 5, value: 5 }
    },
    {
      id: 6,
      author: 'Dr. Neha Kapoor',
      role: 'Parent',
      studentClass: 'Parent of Class 6 & 11 Students',
      date: '4 months ago',
      rating: 5,
      likes: 24,
      comment:
        'Having two children in different wings gives me a full perspective. The science lab practicals for class 11 physics and chemistry are genuinely collegiate grade. Fee receipts and communication on the parent portal are 100% transparent.',
      metrics: { academics: 5, infrastructure: 5, safety: 5, sports: 4, value: 5 }
    },
    {
      id: 7,
      author: 'Rohan Deshmukh',
      role: 'Student',
      studentClass: 'Class 11 Science Stream',
      date: '5 months ago',
      rating: 5,
      likes: 56,
      comment:
        'Best STEM learning environment in the region. The teachers never hesitate to spend extra hours clearing doubts. The robotics lab and coding bootcamps sparked my passion for engineering and technology.',
      metrics: { academics: 5, infrastructure: 5, safety: 4, sports: 5, value: 5 }
    },
    {
      id: 8,
      author: 'Meenakshi Sundaram',
      role: 'Parent',
      studentClass: 'Parent of Class 4 Student',
      date: '6 months ago',
      rating: 4,
      likes: 18,
      comment:
        'Very happy with the school bus facility and safety tracking. The female attendants on buses are courteous. Music and art classes have brought out wonderful creativity in my daughter.',
      metrics: { academics: 4, infrastructure: 4, safety: 5, sports: 4, value: 4 }
    },
    {
      id: 9,
      author: 'Vikas Sharma',
      role: 'Alumni',
      studentClass: 'Batch 2022 • Delhi University',
      date: '7 months ago',
      rating: 5,
      likes: 22,
      comment:
        'The annual sports meet, debate competitions and science exhibitions shaped my personality and public speaking skills. Teachers here treat every student with genuine warmth and mentorship.',
      metrics: { academics: 5, infrastructure: 4, safety: 5, sports: 5, value: 5 }
    },
    {
      id: 10,
      author: 'Kavita Yadav',
      role: 'Parent',
      studentClass: 'Parent of Class 7 Student',
      date: '8 months ago',
      rating: 5,
      likes: 15,
      comment:
        'Safe and respectful environment for girl students. Focus on hygiene, clean drinking RO water, clean grounds, and regular parent-teacher interaction makes this school stand out.',
      metrics: { academics: 5, infrastructure: 5, safety: 5, sports: 4, value: 5 }
    }
  ]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantClass, setApplicantClass] = useState('Nursery');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Display texts matching the exact reference design or template mode
  const displayName = isLiveTemplate
    ? (templateData?.schoolName || 'Write Your School Name Here')
    : (isTemplate
      ? 'Write Your School Name Here'
      : ((!schoolName || /^\d+$/.test(schoolName.trim()))
        ? 'BrightFuture Public School'
        : schoolName));
  const displayEstablished = isLiveTemplate
    ? (templateData?.establishedYear || '2008')
    : (establishedYear || '1975');
  const displayStudents = isLiveTemplate
    ? `${(templateData?.totalStudents || 1250).toLocaleString()}+`
    : (totalStudents > 0 ? `${totalStudents.toLocaleString()}+` : '2,500+');
  const displayTeachers = isLiveTemplate
    ? `${templateData?.totalTeachers || 65}+`
    : (totalTeachers > 0 ? `${totalTeachers}+` : '120+');
  const displayYears = isLiveTemplate
    ? `${Math.max(5, 2026 - parseInt(templateData?.establishedYear || '2008'))}+`
    : (establishedYear && !isNaN(parseInt(establishedYear))
      ? `${Math.max(10, 2026 - parseInt(establishedYear))}+`
      : '50+');
  const displayPrincipal = isLiveTemplate
    ? (templateData?.principalName || 'Write Principal / Headmaster Name Here')
    : (isTemplate
      ? 'Write Principal / Headmaster Name Here'
      : (principalName || 'Dr. Meera Sharma'));
  const displayAddress = isLiveTemplate
    ? (templateData?.address || 'Plot No. 12, Knowledge Park / Main Road, Your City - PIN Code')
    : (isTemplate
      ? 'Plot No. 12, Knowledge Park / Main Road, Your City - PIN Code'
      : (rawAddress || '123 Green Valley Road, Bangalore - 560001'));
  const displayPhone = isLiveTemplate
    ? (templateData?.phone || '+91 98XXXXXXXX / Official School Helpline')
    : (isTemplate
      ? '+91 98XXXXXXXX / Official School Helpline'
      : (rawPhone || '+91 98765 43210'));
  const displayEmail = isLiveTemplate
    ? (templateData?.email || 'admissions@yourschoolname.edu.in')
    : (isTemplate
      ? 'admissions@yourschoolname.edu.in'
      : (rawEmail || 'info@brightfuture.edu.in'));

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Accreditation / Quick Profile collapsible state
  const [isCredOpen, setIsCredOpen] = useState(false);

  // Official Institutional & Govt Accreditation Details
  const displayUdise = isLiveTemplate
    ? (templateData?.udiseCode || '06170100101')
    : (udiseCode || '06070123456');
  const displayBoard = isLiveTemplate
    ? (templateData?.board || 'CBSE (Central Board of Secondary Education)')
    : (board || 'CBSE (Central Board of Secondary Education)');
  const cleanUdiseDigits = displayUdise.replace(/\D/g, '');
  const displayAffiliationNo = displayBoard.toUpperCase().includes('CBSE')
    ? `CBSE/AFF/${cleanUdiseDigits.slice(-6) || '530492'}`
    : displayBoard.toUpperCase().includes('ICSE') || displayBoard.toUpperCase().includes('CISCE')
    ? `CISCE/AFF/${cleanUdiseDigits.slice(-5) || 'HA045'}`
    : `BSEH/REC/${cleanUdiseDigits.slice(-5) || '84912'}`;

  const displaySchoolCode = cleanUdiseDigits.slice(-5) || '40412';
  const displaySchoolType = schoolCategory || 'Senior Secondary (Class 1 to 12)';
  
  // School Authority: Private vs Government
  const isGovt = (management || '').toLowerCase().includes('govt') ||
                 (management || '').toLowerCase().includes('department') ||
                 (management || '').toLowerCase().includes('aided') ||
                 (management || '').toLowerCase().includes('kendriya');
  const displayManagementType = isGovt ? 'Government School' : 'Private Unaided';
  const displayManagementLabel = management || (isGovt ? 'Dept. of School Education, Govt.' : 'Private Unaided (Recognized Trust)');

  // Campus Format: Day School vs Boarding vs Day-Boarding
  const isResidential = (schoolCategory || '').toLowerCase().includes('residential') ||
                        (schoolCategory || '').toLowerCase().includes('boarding');
  const displayBoardingType = isResidential ? 'Residential (Boarding)' : 'Day School';
  const displayBoardingSub = isResidential ? 'Full Hostel & Mess Available' : 'Day-cum-Day-Boarding';

  // Student Gender: Co-Educational vs Girls Only vs Boys Only
  const displayGenderType = genderType || 'Co-Educational';
  const displayGenderFormat = displayGenderType;
  const displayGenderTag = displayGenderType.toLowerCase().includes('girls')
    ? 'Girls Only School'
    : displayGenderType.toLowerCase().includes('boys')
    ? 'Boys Only School'
    : 'Co-Educational (Boys & Girls)';

  // Multiple Boards Support (comma/slash separated or default)
  const boardsList = board
    ? board.split(/[,/|•]+/).map((b) => b.trim()).filter(Boolean)
    : ['CBSE (Central Board)', 'State Board (BSEH)'];

  // Multiple Mediums Support (comma/slash separated or default)
  const mediumsList = medium
    ? medium.split(/[,/|•]+/).map((m) => m.trim()).filter(Boolean)
    : ['English Medium', 'Hindi Medium'];

  const cleanClassFrom = classFrom ? classFrom.replace(/^Class\s*/i, '').trim() : '';
  const cleanClassTo = classTo ? classTo.replace(/^Class\s*/i, '').trim() : '';
  const displayClasses = (cleanClassFrom && cleanClassTo)
    ? `Class ${cleanClassFrom} to ${cleanClassTo}`
    : 'Nursery to Class 12';
  
  const displayWebsiteUrl = website
    ? (website.startsWith('http') ? website : `https://${website}`)
    : 'https://brightfutureschool.edu.in';
  const displayWebsiteClean = displayWebsiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  const emailDomain = displayEmail.includes('@') ? displayEmail.split('@')[1] : 'brightfuture.edu.in';
  const displayAdminEmail = displayEmail || `info@${emailDomain}`;
  const displayAdmissionsEmail = `admissions@${emailDomain}`;
  const displayPrincipalEmail = `principal@${emailDomain}`;

  // Resolved Latitude & Longitude with fallback
  const mapLat = (typeof lat === 'number' && !isNaN(lat) && lat !== 0) ? lat : 28.1885;
  const mapLng = (typeof lng === 'number' && !isNaN(lng) && lng !== 0) ? lng : 76.6215;

  // Load Leaflet dynamically via CDN scripts for instant campus map
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Initialize or re-render interactive map when mode is 'osm' or 'satellite'
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || mapMode === 'google') {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    const L = (window as any).L;
    if (!L) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [mapLat, mapLng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      const tileUrl = mapMode === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom pulsing campus pinpoint
      const customIcon = L.divIcon({
        className: 'custom-campus-pin',
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(0, 111, 204, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: #005689; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([mapLat, mapLng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 220px; padding: 6px;">
          <div style="font-weight: 800; color: #003c6e; font-size: 14px; line-height: 1.2;">${displayName}</div>
          <div style="font-size: 11px; color: #4B5563; margin-top: 4px; line-height: 1.3;">${displayAddress}</div>
          <div style="display: flex; gap: 4px; align-items: center; margin-top: 6px; font-size: 11px; font-weight: 700; color: #006FCC;">
            <span>★ 4.6 (Verified Campus)</span>
          </div>
          <div style="margin-top: 8px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}" target="_blank" rel="noreferrer" style="display: inline-block; background: #006FCC; color: white; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; text-decoration: none;">Get Directions ↗</a>
          </div>
        </div>
      `).openPopup();

      mapInstanceRef.current = map;
    } catch (e) {
      console.warn('Leaflet init error:', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded, mapMode, mapLat, mapLng, displayName, displayAddress, activeTab]);

  // 10 Facilities with REAL PHOTOGRAPHS, SPECIFICATIONS & FALLBACK SVG ILLUSTRATIONS
  const facilities = [
    {
      id: 'science-labs',
      name: 'Science Labs',
      desc: 'Hands-on Physics, Chemistry & Biology practicals.',
      photo: '/images/real-facilities/science-lab.jpg',
      Illustration: ScienceLabIllustration,
      category: 'Experiential STEM',
      icon: FlaskConical,
      color: 'bg-[#006FCC]',
      tagline: 'Physics • Chemistry • Biology',
      details: 'Fully equipped Physics, Chemistry, and Biology laboratories adhering to NEP 2020 standards with individual student workstations, digital safety equipment, and modern precision apparatus.',
      specs: [
        { label: 'Workstations', val: '45 Individual Benches' },
        { label: 'Equipment', val: 'Precision Balances, Spectrometers, Bunsen Burners' },
        { label: 'Safety', val: 'Fume Hoods, Eyewash & Fire Safeguards' },
        { label: 'Curriculum', val: 'CBSE & NEP Experiential Practical Syllabi' }
      ],
      capacity: '40 Students / Batch',
      timings: 'Mon - Fri (8:30 AM - 2:00 PM)'
    },
    {
      id: 'computer-labs',
      name: 'Computer IT Labs',
      desc: 'High-speed gigabit workstations & coding academy.',
      photo: '/images/real-facilities/computer-lab.jpg',
      Illustration: ComputerLabIllustration,
      category: 'Digital Innovation',
      icon: Monitor,
      color: 'bg-[#10B981]',
      tagline: 'Coding • AI • Web Dev',
      details: 'High-speed gigabit networked multimedia computing lab with contemporary workstations, programming environments, and safe filtered internet.',
      specs: [
        { label: 'Terminals', val: '60 All-in-One Dell Workstations' },
        { label: 'Internet', val: '1 Gbps Dedicated Leased Line' },
        { label: 'Languages', val: 'Python, Scratch, HTML5 & AI Models' },
        { label: 'Air Quality', val: 'Fully Air-Conditioned Ergonomic Setup' }
      ],
      capacity: '60 Students / Batch',
      timings: 'Daily Regular Practical Hours'
    },
    {
      id: 'robotics-lab',
      name: 'Robotics ATL Lab',
      desc: 'Atal Tinkering Lab for IoT, sensors & rover prototyping.',
      photo: '/images/real-facilities/robotics-lab.jpg',
      Illustration: RoboticsLabIllustration,
      category: 'Future Technology',
      icon: Bot,
      color: 'bg-[#F59E0B]',
      tagline: '3D Printing • IoT • Drones',
      details: 'State-of-the-art Atal Tinkering Lab (ATL) style robotics workspace with Arduino, sensors, mechanical tools, and 3D prototyping kits.',
      specs: [
        { label: 'Hardware', val: 'Dual 3D Printers & Soldering Benches' },
        { label: 'Kits', val: 'Arduino Uno, ESP32 & Quadcopter Drones' },
        { label: 'Projects', val: 'Autonomous Obstacle-Avoidance Rovers' },
        { label: 'Affiliation', val: 'NITI Aayog ATL Framework Certified' }
      ],
      capacity: '35 Innovators / Session',
      timings: 'Special STEM Batches & Clubs'
    },
    {
      id: 'library',
      name: 'Central Library',
      desc: 'Over 15,000 curated books, research journals & OPAC.',
      photo: '/images/real-facilities/library.jpg',
      Illustration: LibraryIllustration,
      category: 'Knowledge Hub',
      icon: BookOpen,
      color: 'bg-[#6366F1]',
      tagline: '15,000+ Books & Digital Kiosks',
      details: 'Over 15,000 reference books, international journals, curated fiction & non-fiction, digital kiosks, and quiet collaborative reading spaces.',
      specs: [
        { label: 'Collection', val: '15,000+ Volumes & Encyclopedia Sets' },
        { label: 'E-Resources', val: 'JSTOR, National Geographic & E-Books' },
        { label: 'Kiosks', val: '8 Digital OPAC Catalog Terminals' },
        { label: 'Ambience', val: 'Sunlit Quiet Reading Bays & Mezzanine' }
      ],
      capacity: '120 Readers Concurrently',
      timings: 'Open All School Working Hours'
    },
    {
      id: 'smart-classrooms',
      name: 'Smart Classrooms',
      desc: '75-inch 4K interactive digital flat panels.',
      photo: '/images/real-facilities/smart-classroom.jpg',
      Illustration: SmartClassroomIllustration,
      category: 'Interactive Learning',
      icon: Tv,
      color: 'bg-[#0EA5E9]',
      tagline: '4K Touch Panels & 3D Audio',
      details: 'Ergonomically designed classrooms equipped with interactive flat panel smartboards, audio systems, and digital interactive curriculum.',
      specs: [
        { label: 'Display', val: '75-inch Ultra HD 4K Touch Panels' },
        { label: 'Audio', val: 'High-Fidelity Integrated Classroom Audio' },
        { label: 'Curriculum', val: 'Interactive 3D Science & Math Modules' },
        { label: 'Climate', val: 'Energy-Efficient Climate Conditioning' }
      ],
      capacity: '35 - 40 Students / Room',
      timings: 'All Core Academic Periods'
    },
    {
      id: 'sports',
      name: 'Sports Complex',
      desc: 'Turf football ground, athletic track & basketball courts.',
      photo: '/images/real-facilities/sports.jpg',
      Illustration: SportsIllustration,
      category: 'Athletics & Fitness',
      icon: Activity,
      color: 'bg-[#8B5CF6]',
      tagline: 'FIFA Turf • Synthetic Track',
      details: 'Extensive multi-sport outdoor grounds with football turf, basketball courts, athletics track, badminton, and trained physical education coaches.',
      specs: [
        { label: 'Outdoor', val: 'FIFA-Grade Football Turf & 400m Track' },
        { label: 'Courts', val: '2 Synthetic Basketball & Tennis Arenas' },
        { label: 'Coaching', val: 'National Certified NIS Sports Trainers' },
        { label: 'Indoor', val: 'Table Tennis, Badminton & Yoga Studio' }
      ],
      capacity: '300+ Students Outdoors',
      timings: 'Morning Drills & Evening Academy'
    },
    {
      id: 'art-music',
      name: 'Art & Music Studios',
      desc: 'Dedicated classical instruments and fine arts studio.',
      photo: '/images/real-facilities/art-music.jpg',
      Illustration: ArtMusicIllustration,
      category: 'Creative STEAM',
      icon: Palette,
      color: 'bg-[#EC4899]',
      tagline: 'Pianos, Guitars, Tabla & Canvas',
      details: 'Dedicated creative studios for fine arts, painting, classical Indian and Western musical instruments, vocal training, and performance.',
      specs: [
        { label: 'Instruments', val: 'Grand Pianos, Guitars, Drums & Tabla' },
        { label: 'Fine Arts', val: 'Pottery Wheels, Oil & Acrylic Easels' },
        { label: 'Acoustics', val: 'Sound-Dampened Vocal Practice Bays' },
        { label: 'Exhibits', val: 'Quarterly Student Gallery Displays' }
      ],
      capacity: '50 Artists & Musicians',
      timings: 'Weekly Co-Curricular Blocks'
    },
    {
      id: 'auditorium',
      name: 'Grand Auditorium',
      desc: '800-seat theater hall with intelligent stage lighting.',
      photo: '/images/real-facilities/auditorium.jpg',
      Illustration: AuditoriumIllustration,
      category: 'Performing Arts',
      icon: Building,
      color: 'bg-[#7C3AED]',
      tagline: '800 Seats • Dolby Surround Stage',
      details: 'Acoustically treated 800+ seater indoor auditorium featuring automated theatrical lighting, pro surround audio, and live streaming capabilities.',
      specs: [
        { label: 'Seating', val: '800 Plush Velvet Acoustic Chairs' },
        { label: 'Lighting', val: 'Automated DMX Moving Head Stage Truss' },
        { label: 'Audio', val: 'Dolby Digital Surround Pro Line Array' },
        { label: 'Broadcast', val: 'HD Multi-Cam Live Streaming Setup' }
      ],
      capacity: '800 Audience Members',
      timings: 'Assemblies & Annual Celebrations'
    },
    {
      id: 'transport',
      name: 'GPS School Buses',
      desc: 'CCTV-monitored fleet with live mobile parent tracking.',
      photo: '/images/real-facilities/transport.jpg',
      Illustration: TransportIllustration,
      category: 'Safety & Transit',
      icon: Bus,
      color: 'bg-[#D97706]',
      tagline: 'Live GPS App • CCTV Cameras',
      details: 'Modern GPS-monitored school bus fleet equipped with CCTV surveillance, speed governors, female support staff, and real-time parent app tracking.',
      specs: [
        { label: 'Fleet', val: '28 BharatBenz Air-Suspension Buses' },
        { label: 'Tracking', val: 'Live GPS Route & Speed on Parent App' },
        { label: 'Safety', val: 'Interior/Exterior CCTV & Speed Limiters' },
        { label: 'Staffing', val: 'Licensed Driver & Female Bus Attendant' }
      ],
      capacity: '35km Citywide Commute Radius',
      timings: 'Morning Pickups & Evening Drops'
    },
    {
      id: 'medical-room',
      name: 'Medical Infirmary',
      desc: 'Full-time nursing staff, recovery beds & emergency care.',
      photo: '/images/real-facilities/medical.jpg',
      Illustration: MedicalRoomIllustration,
      category: 'Student Health',
      icon: HeartPulse,
      color: 'bg-[#14B8A6]',
      tagline: 'Registered Nurses • Oxygen Bed',
      details: 'Full-time registered nursing staff, first-aid triage, oxygen support, routine health screenings, and immediate emergency tie-ups with leading hospitals.',
      specs: [
        { label: 'Personnel', val: '2 Full-Time Certified Registered Nurses' },
        { label: 'Equipment', val: 'Oxygen Cylinders, Nebulizer, Stretcher' },
        { label: 'Hospital', val: 'Priority Ambulance Link with Apex Hospital' },
        { label: 'Audits', val: 'Bi-Annual Vision, Dental & Growth Screenings' }
      ],
      capacity: '4 Immediate Recovery Beds',
      timings: '24/7 Available During School Hours'
    }
  ];

  // Fee filter state
  const [selectedFeeWing, setSelectedFeeWing] = useState('all');

  // Fee Structure Data (Lower Grade to 12th Grade)
  const feeStructure = [
    {
      id: 'pre-primary',
      wing: 'Pre-Primary / Kindergarten',
      classes: 'Nursery, LKG & UKG',
      ageGroup: 'Ages 3 to 5 Years',
      monthlyTuition: '₹5,500',
      quarterlyTuition: '₹16,500 / quarter',
      admissionFee: '₹12,000 (One-time)',
      cautionDeposit: '₹5,000 (100% Refundable)',
      annualEstimated: '₹78,000',
      breakdown: [
        { label: 'Quarterly Tuition Fee', amount: '₹16,500' },
        { label: 'Activity & Play Zone Materials', amount: '₹3,000 / year' },
        { label: 'Health & Safety Assessment', amount: '₹1,500 / year' },
        { label: 'Smart Audio-Visual Curriculum', amount: 'Included' }
      ],
      highlights: [
        'Activity-based play pedagogy with Montessori kits',
        'CCTV-monitored air-conditioned play zones',
        'Daily digital progress report on parent app',
        'Nutritious meal guidance & hygiene routine'
      ]
    },
    {
      id: 'primary',
      wing: 'Foundational Primary Wing',
      classes: 'Class 1 to 5',
      ageGroup: 'Ages 6 to 10 Years',
      monthlyTuition: '₹6,200',
      quarterlyTuition: '₹18,500 / quarter',
      admissionFee: '₹15,000 (One-time)',
      cautionDeposit: '₹5,000 (100% Refundable)',
      annualEstimated: '₹92,000',
      breakdown: [
        { label: 'Quarterly Tuition Fee', amount: '₹18,500' },
        { label: 'Science & Computer Lab Exposure', amount: '₹4,000 / year' },
        { label: 'Sports, Taekwondo & Yoga', amount: 'Included' },
        { label: 'E-Library & Digital Storybooks', amount: '₹1,500 / year' }
      ],
      highlights: [
        'NEP 2020 experiential learning modules',
        'Weekly computer coding & digital literacy',
        'Dedicated language labs for Hindi & English fluency',
        'Inter-class sports and cultural festivals'
      ]
    },
    {
      id: 'middle',
      wing: 'Middle School Wing',
      classes: 'Class 6 to 8',
      ageGroup: 'Ages 11 to 13 Years',
      monthlyTuition: '₹7,350',
      quarterlyTuition: '₹22,000 / quarter',
      admissionFee: '₹15,000 (One-time)',
      cautionDeposit: '₹5,000 (100% Refundable)',
      annualEstimated: '₹1,08,000',
      breakdown: [
        { label: 'Quarterly Tuition Fee', amount: '₹22,000' },
        { label: 'Atal Tinkering Lab & Robotics Kit', amount: '₹4,500 / year' },
        { label: 'Physics, Chem, Bio Practical Lab', amount: '₹3,500 / year' },
        { label: 'Periodic Assessments & Mock Exams', amount: '₹2,000 / year' }
      ],
      highlights: [
        'Hands-on experimental science and robotics bench',
        'National Olympiad, NTSE & quiz foundation training',
        'Coding in Python and computational thinking',
        'Specialized sports coaching (Football, Cricket, Basketball)'
      ]
    },
    {
      id: 'secondary',
      wing: 'Secondary Board Prep Wing',
      classes: 'Class 9 & 10',
      ageGroup: 'Ages 14 to 15 Years',
      monthlyTuition: '₹8,500',
      quarterlyTuition: '₹25,500 / quarter',
      admissionFee: '₹18,000 (One-time)',
      cautionDeposit: '₹5,000 (100% Refundable)',
      annualEstimated: '₹1,24,000',
      breakdown: [
        { label: 'Quarterly Tuition Fee', amount: '₹25,500' },
        { label: 'Advanced Composite Lab Apparatus', amount: '₹5,500 / year' },
        { label: 'CBSE Board Assessment Series', amount: '₹3,500 / year' },
        { label: 'Career Guidance & Aptitude Profiling', amount: 'Included' }
      ],
      highlights: [
        'Rigorous CBSE board curriculum alignment',
        'Weekly mock tests with personalized error analysis',
        'Special remedial sessions for challenging topics',
        'Stream selection guidance counseling by experts'
      ]
    },
    {
      id: 'senior-science',
      wing: 'Senior Secondary • Science Stream',
      classes: 'Class 11 & 12 (PCM / PCB)',
      ageGroup: 'Ages 16 to 17 Years',
      monthlyTuition: '₹9,800',
      quarterlyTuition: '₹29,500 / quarter',
      admissionFee: '₹18,000 (One-time)',
      cautionDeposit: '₹5,000 (100% Refundable)',
      annualEstimated: '₹1,42,000',
      breakdown: [
        { label: 'Quarterly Tuition Fee', amount: '₹29,500' },
        { label: 'Specialized Physics/Chem/Bio Labs', amount: '₹7,000 / year' },
        { label: 'Computer Science / AI / Python Lab', amount: '₹4,000 / year' },
        { label: 'JEE / NEET Competitive Foundation', amount: 'Included' }
      ],
      highlights: [
        'Individual experiment apparatus benches for every student',
        'IIT/Medical entrance exam conceptual scaffolding',
        'High-speed digital workstation for CS / AI projects',
        'Dedicated senior faculty mentorship for practicals'
      ]
    },
    {
      id: 'senior-commerce',
      wing: 'Senior Secondary • Commerce & Arts',
      classes: 'Class 11 & 12 (Commerce / Humanities)',
      ageGroup: 'Ages 16 to 17 Years',
      monthlyTuition: '₹9,000',
      quarterlyTuition: '₹27,000 / quarter',
      admissionFee: '₹18,000 (One-time)',
      cautionDeposit: '₹5,000 (100% Refundable)',
      annualEstimated: '₹1,30,000',
      breakdown: [
        { label: 'Quarterly Tuition Fee', amount: '₹27,000' },
        { label: 'Informatics Practices & Accounts Lab', amount: '₹4,500 / year' },
        { label: 'CUET & CA Foundation Prep Module', amount: 'Included' },
        { label: 'Business Conclaves & Legal Studies Seminars', amount: '₹2,500 / year' }
      ],
      highlights: [
        'Practical accounting software & Excel modeling training',
        'Mock stock trading simulations and enterprise workshops',
        'Intensive CUET & CLAT examination preparatory guidance',
        'Eminent guest lectures by industry leaders & civil servants'
      ]
    }
  ];

  // School-Specific Other / Optional Charges
  const otherCharges = [
    {
      category: 'School Transport Service',
      desc: 'GPS-enabled buses with speed governors, CCTV cameras, female bus attendants, and parent mobile tracking.',
      rates: [
        { label: 'Zone A (0 – 3 km radius)', cost: '₹2,200 / month' },
        { label: 'Zone B (3 – 7 km radius)', cost: '₹2,800 / month' },
        { label: 'Zone C (7 – 15 km radius)', cost: '₹3,500 / month' }
      ]
    },
    {
      category: 'School Uniform & Sports Attire',
      desc: 'Standardized high-grade breathable uniform procured through authorized vendors.',
      rates: [
        { label: 'Summer Uniform Set (2 sets, tie, socks, belt)', cost: '₹3,200 – ₹4,200' },
        { label: 'Winter Blazer, Pullover & Tracksuit', cost: '₹2,800 – ₹3,800' },
        { label: 'House Sports T-shirt & Running Shoes', cost: '₹1,600 – ₹2,200' }
      ]
    },
    {
      category: 'Books, Stationery & Academic Kit',
      desc: 'Annual textbooks pack (NCERT & reference publications) + customized school notebooks & journals.',
      rates: [
        { label: 'Pre-Primary & Primary Classes', cost: '₹2,500 – ₹3,800 / year' },
        { label: 'Middle School (Class 6 to 8)', cost: '₹3,800 – ₹5,200 / year' },
        { label: 'Secondary & Senior (Class 9 to 12)', cost: '₹4,500 – ₹6,800 / year' }
      ]
    },
    {
      category: 'Nutritious Meal & Day-Boarding Cafeteria',
      desc: 'Optional hot cooked hygienic lunch + evening healthy snack prepared under certified nutritionist supervision.',
      rates: [
        { label: 'Monthly Dining Subscription', cost: '₹2,800 / month' },
        { label: 'Quarterly Dining Plan', cost: '₹8,000 / quarter' },
        { label: 'Daily Coupon (Emergency / Walk-in)', cost: '₹140 / day' }
      ]
    },
    {
      category: 'Specialized Sports & Hobby Academies',
      desc: 'Evening specialized sports coaching and international certification programs.',
      rates: [
        { label: 'Horse Riding & Equestrian Training', cost: '₹1,500 / month' },
        { label: 'Competitive Swimming Coaching', cost: '₹1,200 / month' },
        { label: 'Drone Pilot & Advanced Robotics Club', cost: '₹1,800 / month' }
      ]
    }
  ];

  // Fee Policy & Notes
  const feeNotesAndPolicies = [
    {
      title: 'Quarterly Billing Cycle & Due Dates',
      desc: 'Fees are payable on a quarterly basis by the 10th of April, July, October, and January. A grace period of 10 days is provided until the 20th of the due month without penalty.'
    },
    {
      title: '10% Sibling Fee Concession',
      desc: 'A permanent 10% concession on tuition fees is awarded to the younger sibling studying concurrently in the school.'
    },
    {
      title: 'Merit & Sports Scholarships',
      desc: 'Merit scholarships ranging from 25% to 50% on tuition fees are offered to students securing 90%+ in board exams or representing state/nation in recognized sports.'
    },
    {
      title: 'Caution Deposit & Refund Policy',
      desc: 'The one-time caution money (₹5,000) is 100% refundable without interest upon withdrawal and issuance of the Transfer Certificate (TC), provided one month prior notice is given.'
    },
    {
      title: 'Zero Gateway Charges Online Payment',
      desc: 'Parents can conveniently pay through the official School Parent Portal via UPI, NetBanking, Debit/Credit Card with 0% extra transaction charges.'
    },
    {
      title: 'Strict No Donation / Capitation Policy',
      desc: 'The school strictly adheres to the Right to Education Act and state fee regulatory frameworks. No capitation fee, development donation, or concealed charge is ever levied.'
    }
  ];

  // Admission Steps
  const admissionSteps = [
    {
      step: '01',
      title: 'Submit Online Inquiry',
      desc: 'Fill out the simple 2-minute application form with student details and select the desired class.'
    },
    {
      step: '02',
      title: 'Campus Walkthrough & Interaction',
      desc: 'Visit our campus for an informal interaction with teachers, tour our science labs, and inspect facilities.'
    },
    {
      step: '03',
      title: 'Document Verification',
      desc: 'Provide student birth certificate, transfer certificate (if applicable), and previous class report card.'
    },
    {
      step: '04',
      title: 'Seat Confirmation & Welcome Kit',
      desc: 'Complete fee enrollment and receive your student ID, school uniform set, academic calendar, and welcome pack.'
    }
  ];

  // Dynamic Facilities for Live Template (Initial template starts with 0 cards; user adds them)
  const effectiveFacilities = isLiveTemplate
    ? (templateData?.facilities || []).map((f) => {
        const IconComponent = (f.icon && ICON_MAP[f.icon]) ? ICON_MAP[f.icon] : Layers;
        const IllusComponent = (f.illustration && ILLUSTRATION_MAP[f.illustration])
          ? ILLUSTRATION_MAP[f.illustration]
          : ScienceLabIllustration;
        return {
          id: f.id,
          name: f.title,
          desc: f.desc,
          photo: '',
          Illustration: IllusComponent,
          category: f.badge || 'School Facility',
          icon: IconComponent,
          color: 'bg-[#006FCC]',
          tagline: f.title,
          details: f.desc,
          specs: [
            { label: 'Category', val: f.badge || 'General' },
            { label: 'Access', val: 'Open to all students' }
          ],
          capacity: 'Open Access',
          timings: 'School Working Hours',
          _raw: f
        };
      })
    : facilities;

  // Dynamic Admissions for Live Template (Initial template starts with 0 cards; user adds them)
  const effectiveAdmissionSteps = isLiveTemplate
    ? (templateData?.admissions || []).map((a, idx) => ({
        id: a.id,
        step: `0${idx + 1}`,
        title: a.title,
        desc: a.criteria + (a.fees ? ` • Fees: ${a.fees}` : ''),
        _raw: a
      }))
    : admissionSteps;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsApplyModalOpen(false);
      setApplicantName('');
      setApplicantPhone('');
      setApplicantEmail('');
    }, 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;
    const newRev = {
      id: Date.now(),
      author: reviewerName.trim(),
      role: reviewerRole,
      studentClass: reviewerClass.trim() || `${reviewerRole} Feedback`,
      date: 'Just now',
      rating: ratingOverall,
      likes: 1,
      comment: reviewComment.trim(),
      metrics: {
        academics: ratingAcademics,
        infrastructure: ratingInfrastructure,
        safety: ratingSafety,
        sports: ratingSports,
        value: ratingValue,
      }
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setIsWriteReviewOpen(false);
      setIsReviewModalOpen(false);
      setReviewerName('');
      setReviewComment('');
      setReviewerClass('');
    }, 1500);
  };

  const filteredReviewsList = reviewsList.filter((rev) => {
    if (reviewRoleFilter !== 'all') {
      if (!rev.role.toLowerCase().includes(reviewRoleFilter.toLowerCase())) {
        return false;
      }
    }
    if (reviewStarFilter !== 'all' && rev.rating !== reviewStarFilter) {
      return false;
    }
    if (reviewSearchText.trim()) {
      const q = reviewSearchText.toLowerCase();
      const matchAuthor = rev.author.toLowerCase().includes(q);
      const matchComment = rev.comment.toLowerCase().includes(q);
      const matchClass = (rev.studentClass || '').toLowerCase().includes(q);
      if (!matchAuthor && !matchComment && !matchClass) return false;
    }
    return true;
  }).sort((a, b) => {
    if (reviewSortBy === 'helpful') {
      const likesA = a.likes + (userLikesMap[a.id] ? 1 : 0);
      const likesB = b.likes + (userLikesMap[b.id] ? 1 : 0);
      return likesB - likesA;
    }
    if (reviewSortBy === 'highest') {
      return b.rating - a.rating;
    }
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 0. LIVE TEMPLATE WYSIWYG CONTROL BAR                      */}
      {/* ========================================================= */}
      {isLiveTemplate && (
        <TemplateControlBar
          currentTab={activeTab}
          onTabChange={(tab) => handleTabSwitch(tab as TabType)}
        />
      )}

      {/* 0. AI MASTER TEMPLATE ASSISTANT (VISIBLE IN REGULAR TEMPLATE MODE) */}
      {isTemplate && !isLiveTemplate && (
        <AiProfileTemplateGuide
          showAiGuide={showAiGuide}
          setShowAiGuide={setShowAiGuide}
        />
      )}

      {/* ========================================================= */}
      {/* 1. TOP NAVBAR / HEADER                                    */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          
          {/* School Brand / Logo (Full Width on Mobile) */}
          <button type="button" onClick={() => handleTabSwitch('home')} className="flex items-center gap-2.5 sm:gap-3 group min-w-0 text-left cursor-pointer w-full lg:w-auto">
            <div className="w-9 h-9 sm:w-11 sm:h-11 relative flex items-center justify-center shrink-0">
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-sm">
                <path d="M24 16C20 12 10 12 6 15V36C10 33 20 33 24 37V16Z" fill="#005689" />
                <path d="M24 16C28 12 38 12 42 15V36C38 33 28 33 24 37V16Z" fill="#0878A8" />
                <circle cx="24" cy="11" r="4" fill="#FBBC04" />
                <path d="M24 4V8" stroke="#F2A900" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 6L20 9" stroke="#F2A900" strokeWidth="2" strokeLinecap="round" />
                <path d="M30 6L28 9" stroke="#F2A900" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={templateData?.schoolName || displayName}
                    fieldKey="schoolName"
                    className="text-sm xs:text-base sm:text-2xl font-black tracking-tight text-gray-950 font-serif leading-tight truncate"
                  />
                ) : (
                  <span className="text-sm xs:text-base sm:text-2xl font-black tracking-tight text-gray-950 font-serif leading-tight truncate">
                    {displayName}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EDF5FA] border border-[#D6EDFF] text-[#005689] text-[10px] sm:text-xs font-bold tracking-wide shrink-0">
                  <span className="text-[#006FCC] font-extrabold">UDISE:</span>
                  <span className="font-mono">{displayUdise}</span>
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-500 truncate mt-0.5">
                Public School • {district || 'Campus'}
              </span>
            </div>
          </button>

          {/* Desktop Nav Links (Tab Switcher: Horizontal Scrollable List) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold overflow-x-auto scrollbar-none py-1 max-w-[64vw]">
            {effectiveNavTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`flex flex-col items-center justify-center gap-0.5 px-2.5 py-1 rounded-xl cursor-pointer transition-all shrink-0 ${
                    isActive
                      ? 'text-[#005689] font-bold border-b-2 border-[#FBBC04] bg-sky-50/50'
                      : 'text-gray-600 hover:text-[#006FCC] hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#005689] stroke-[2.5]' : 'text-gray-500'}`} />
                  <span className="text-[11px] leading-tight whitespace-nowrap flex items-center gap-1">
                    {tab.shortLabel}
                    {isLiveTemplate && isEditMode && templateData?.tabVisibility?.[tab.id] === false && (
                      <span className="text-[9px] text-amber-500 font-bold" title="Tab is set to Private (Hidden in Preview)">🔒</span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Only Apply Button (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center shrink-0">
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="button_primary inline-flex items-center justify-center gap-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-6 py-2.5 rounded-[12px] text-sm shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-[0_6px_22px_rgba(0,111,204,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
            </button>
          </div>
        </div>

      </header>

      {/* ========================================================= */}
      {/* MOBILE LEFT MINI ICON DRAWER & EDGE PILL HANDLE           */}
      {/* ========================================================= */}
      
      {/* 1. Backdrop (Tap outside to close/hide menu, elevates above TopBar and Navbar) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[750] bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu backdrop"
        />
      )}

      {/* 2. Floating Edge Pill Handle (Smooth Tap / Click to Open, always accessible) */}
      {!isMobileMenuOpen && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileMenuOpen(true);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          aria-label="Open Mobile Menu"
          className="fixed top-1/2 -translate-y-1/2 left-0 z-[700] lg:hidden bg-white border border-l-0 border-slate-200/90 text-slate-700 w-7 h-16 rounded-r-2xl shadow-[4px_4px_14px_rgba(0,0,0,0.12)] flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95 hover:bg-slate-50 touch-manipulation select-none"
        >
          <ChevronRight className="w-4 h-4 text-slate-600 stroke-[2.5]" />
        </button>
      )}

      {/* 3. Left Mini Drawer Sheet (Elevated z-[850], 100dvh for exact mobile screen fit, safe area support) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-[850] w-[74px] sm:w-[80px] h-[100dvh] max-h-[100dvh] bg-white/95 backdrop-blur-md border-r border-slate-200/90 shadow-2xl flex flex-col items-center pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] justify-between transition-transform duration-300 ease-out lg:hidden select-none ${
          isMobileMenuOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'
        }`}
      >
        {/* Top: Compact Close Button Header */}
        <div className="w-full flex flex-col items-center py-1 border-b border-slate-100 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close Menu"
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-600 flex items-center justify-center transition-all cursor-pointer touch-manipulation"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Center: Mini Icons List with min-h-0 flex-1, smooth inertia touch scroll & slim scrollbar */}
        <div className="w-full flex-1 min-h-0 overflow-y-auto overscroll-contain py-1 px-1 flex flex-col gap-1 [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 touch-pan-y">
          {effectiveNavTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  handleTabSwitch(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-1.5 px-0.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer shrink-0 touch-manipulation active:scale-95 ${
                  isActive
                    ? 'bg-[#005689] text-white shadow-sm ring-2 ring-[#FBBC04]/50 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                <span
                  className={`text-[8px] font-bold tracking-tight text-center leading-tight truncate w-full flex items-center justify-center gap-0.5 ${
                    isActive ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  <span>{tab.shortLabel}</span>
                  {isLiveTemplate && isEditMode && templateData?.tabVisibility?.[tab.id] === false && (
                    <span className="text-[7px] text-amber-400">🔒</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom: Mini Apply CTA */}
        <div className="w-full pt-1 pb-0.5 border-t border-slate-100 flex flex-col items-center px-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsApplyModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-1.5 px-0.5 rounded-[10px] bg-[#006FCC] hover:bg-[#005499] active:scale-95 text-white font-bold flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(0,111,204,0.35)] cursor-pointer transition touch-manipulation"
            title="Apply Now"
          >
            <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            <span className="text-[7.5px] font-black uppercase tracking-wider mt-0.5 leading-none text-white">Apply</span>
          </button>
        </div>

        {/* Pull-back Handle on right border ONLY when drawer is open */}
        {isMobileMenuOpen && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(false);
            }}
            aria-label="Hide Menu"
            className="absolute top-1/2 -translate-y-1/2 -right-7 bg-white border border-l-0 border-slate-200/90 text-slate-700 w-7 h-16 rounded-r-2xl shadow-md flex items-center justify-center cursor-pointer hover:bg-slate-50 active:scale-90 transition-transform duration-200 touch-manipulation select-none"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600 stroke-[2.5]" />
          </button>
        )}
      </aside>


      {/* ========================================================= */}
      {/* 2. HERO SECTION (5 AUTO-ROTATING REAL CAMPUS PHOTOS)       */}
      {/* ========================================================= */}
      {/* ─── TAB 1: HOME (Exact EduNova Layout with CSEEL Colors & Buttons) ─── */}
      {activeTab === 'home' && (
        <section id="home" className="relative overflow-hidden bg-gradient-to-r from-white via-white to-[#F0F6FA] pt-8 sm:pt-12 pb-20 sm:pb-24 border-b border-slate-100">
          
          {/* Subtle Dot Grid Pattern in Background (Clean, elegant positioning with smooth fade mask so dots do not appear chopped/uneven) */}
          <div 
            className="absolute top-4 sm:top-6 right-1/4 sm:right-1/3 w-72 h-64 bg-[radial-gradient(#005689_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-20 pointer-events-none z-0" 
            style={{
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
            }}
          />

          {/* Curved Brand Accent on the Far Right Edge with ADMISSION OPEN & Slowly Blinking Bulb (Seamless Layered Arc) */}
          <button
            type="button"
            onClick={() => setIsApplyModalOpen(true)}
            title="Admissions Open - Click to Apply"
            className="absolute top-0 right-0 w-16 sm:w-28 lg:w-48 h-full overflow-hidden z-10 text-left group cursor-pointer focus:outline-none"
          >
            {/* Layer 1: Warm Gold / Yellow Rim Accent (Flush Background Layer) */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-[#FBBC04] via-[#F2A900] to-[#E59800] rounded-l-[45px] sm:rounded-l-[90px] lg:rounded-l-[140px] shadow-lg" />
            
            {/* Layer 2: Deep CSEEL Blue Main Body (Nested tightly with flush gold border, no white gap) */}
            <div className="absolute top-0 right-0 w-[calc(100%-4px)] sm:w-[calc(100%-8px)] lg:w-[calc(100%-12px)] h-full bg-gradient-to-b from-[#005689] via-[#004b77] to-[#003c6e] rounded-l-[42px] sm:rounded-l-[85px] lg:rounded-l-[135px] shadow-2xl flex flex-col items-center justify-center py-6">
              
              {/* Subtle Decorative Geometric Rings */}
              <div className="absolute -right-6 top-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full border-2 border-white/10 pointer-events-none" />
              <div className="absolute -right-2 bottom-12 w-14 h-14 sm:w-20 sm:h-20 rounded-full border border-[#FBBC04]/20 pointer-events-none" />

              {/* Glowing Lightbulb (Blinks / Pulses Slowly) */}
              <div className="relative flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <span className="absolute w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-400/30 animate-ping opacity-70" style={{ animationDuration: '3s' }} />
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-400/20 flex items-center justify-center border border-amber-300/40 shadow-[0_0_12px_rgba(251,188,4,0.6)]">
                  <Lightbulb
                    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 fill-amber-300 animate-pulse drop-shadow-[0_0_6px_rgba(251,188,4,0.9)]"
                    style={{ animationDuration: '2.5s' }}
                  />
                </div>
              </div>

              {/* Vertical Text: ADMISSION OPEN */}
              <div className="flex flex-col items-center gap-2 [writing-mode:vertical-lr] rotate-180 select-none">
                <span className="text-[9px] sm:text-xs font-black tracking-[0.24em] uppercase text-white drop-shadow-sm group-hover:text-amber-200 transition-colors">
                  ADMISSION OPEN
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] animate-pulse" />
              </div>

            </div>
          </button>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Live Template Onboarding & UDISE Fetch Guide Banner */}
            {isLiveTemplate && (
              <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#005689] via-[#004b77] to-[#003c6e] text-white shadow-xl border border-sky-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#FBBC04] text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    ⚡
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm sm:text-base text-white">Live Interactive School Editor</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs">
                        Auto-Save Active
                      </span>
                    </div>
                    <p className="text-xs text-sky-100 mt-1 max-w-xl leading-relaxed">
                      Enter your 11-digit UDISE code in the top bar to auto-populate all institutional data (Board, Principal, Address, Teachers, Students). You can edit any text or photos directly on this page!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">
                  <span className="text-[11px] text-sky-200">Active UDISE:</span>
                  <span className="font-mono font-bold text-xs text-amber-300">{displayUdise}</span>
                </div>
              </div>
            )}

            {/* AI Template Instruction: Section 1 (Hero & Identity) */}
            <AiSectionInstructionBadge sectionKey="hero" isVisible={isTemplate && showAiGuide} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column (col-span-6): Typography & Action Buttons */}
              <div className="lg:col-span-6 text-left py-4 sm:py-6 max-w-[76%] sm:max-w-xl relative z-10">
                <span className="inline-block text-[#005689] font-black text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">
                  SHAPING MINDS. BUILDING FUTURES.
                </span>

                <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[56px] font-black text-[#002B49] tracking-tight leading-[1.08] mb-5">
                  For A Better <br />
                  <span className="text-[#005689]">Tomorrow</span>
                </h1>

                <p className="text-slate-600 text-sm sm:text-base lg:text-lg mb-8 leading-relaxed font-normal">
                  Empowering students at {displayName} with knowledge, values, and skills to become responsible global citizens.
                </p>

                {/* CSEEL Style Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('about')}
                    className="button_primary inline-flex items-center justify-center gap-2.5 bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-7 py-3 rounded-[12px] text-sm md:text-[15px] shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-[0_6px_22px_rgba(0,111,204,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    <span>Explore More</span>
                    <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTourModalOpen(true)}
                    className="button_secondary inline-flex items-center justify-center gap-2.5 bg-[#EDF5FA] hover:bg-[#D6EDFF] border border-[#D6EDFF] text-[#006FCC] hover:text-[#005499] font-bold px-6 py-3 rounded-[12px] text-sm md:text-[15px] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full border border-[#006FCC] flex items-center justify-center text-[#006FCC] shrink-0">
                      <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                    </div>
                    <span>Watch Video</span>
                  </button>
                </div>
              </div>

              {/* Right Column (col-span-12 lg:col-span-6): Campus Photo 3D Spiral Flipbook */}
              <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[560px] lg:max-w-[620px] xl:max-w-[660px] h-[320px] sm:h-[380px] lg:h-[400px]">
                  {/* 3D Smooth Page Flip Photo Book (Open Book on Desktop, Rolled Spiral Book on Mobile) */}
                  <SchoolPhotoBook
                    displayName={displayName}
                    primaryImage={imageUrl}
                    onApplyClick={() => setIsApplyModalOpen(true)}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Floating Stats Ribbon - 5 Stats in a Row matching reference screenshot */}
          <div className="relative z-20 max-w-6xl mx-auto px-4 mt-8 sm:mt-10">
            {/* AI Template Instruction: Section 2 (Quantitative Metrics) */}
            <AiSectionInstructionBadge sectionKey="metrics" isVisible={isTemplate && showAiGuide} />

            <div className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,35,70,0.08)] border border-slate-100 p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              
              {/* Stat 1: Years */}
              <div className="flex items-center gap-3.5 p-2">
                <div className="w-12 h-12 rounded-xl bg-[#EDF5FA] text-[#005689] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight">{displayYears}</div>
                  <div className="text-xs font-semibold text-slate-500">Years of Excellence</div>
                </div>
              </div>

              {/* Stat 2: Students */}
              <div className="flex items-center gap-3.5 p-2 sm:pl-4">
                <div className="w-12 h-12 rounded-xl bg-[#EDF5FA] text-[#005689] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight">{displayStudents}</div>
                  <div className="text-xs font-semibold text-slate-500">Students Enrolled</div>
                </div>
              </div>

              {/* Stat 3: Teachers */}
              <div className="flex items-center gap-3.5 p-2 sm:pl-4">
                <div className="w-12 h-12 rounded-xl bg-[#EDF5FA] text-[#005689] flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight">{displayTeachers}</div>
                  <div className="text-xs font-semibold text-slate-500">Expert Teachers</div>
                </div>
              </div>

              {/* Stat 4: Awards */}
              <div className="flex items-center gap-3.5 p-2 sm:pl-4">
                <div className="w-12 h-12 rounded-xl bg-[#EDF5FA] text-[#005689] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight">50+</div>
                  <div className="text-xs font-semibold text-slate-500">Awards Won</div>
                </div>
              </div>

              {/* Stat 5: Parent Satisfaction */}
              <div className="flex items-center gap-3.5 p-2 sm:pl-4">
                <div className="w-12 h-12 rounded-xl bg-[#EDF5FA] text-[#005689] flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight">98%</div>
                  <div className="text-xs font-semibold text-slate-500">Parent Satisfaction</div>
                </div>
              </div>

            </div>
          </div>

        </section>
      )}


      {/* ========================================================= */}
      {/* 2.5 OFFICIAL INSTITUTIONAL PROFILE & CREDENTIALS SECTION  */}
      {/* ========================================================= */}
      {/* ─── TAB 2: ABOUT US (School Details, About, Principal & Vision/Mission) ─── */}
      {activeTab === 'about' && (
        <>
        {/* ========================================================= */}
        {/* 3. ABOUT OUR SCHOOL SECTION                               */}
        {/* ========================================================= */}
        <section id="about" className="py-12 sm:py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* AI Template Instruction: Section 3 (About Us, Heritage & Principal Desk) */}
            <AiSectionInstructionBadge sectionKey="about" isVisible={isTemplate && showAiGuide} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Narrative Column */}
              <div className="lg:col-span-6 space-y-6">
                
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689]">
                  <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
                  <span>ABOUT OUR SCHOOL</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                  More Than Just <br />
                  <span className="text-[#005689]">An Education</span>
                </h2>

                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  At {displayName}, we believe education is not just about knowledge, but about developing confident, compassionate and capable individuals. Our student-centered approach focuses on holistic growth — academically, socially, emotionally and creatively.
                </p>

                <div>
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-6 py-3 rounded-[12px] text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Discover Our Story</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

              </div>

              {/* Right Multi-Image Showcase with Handwritten Badge */}
              <div className="lg:col-span-6 relative pb-6 lg:pb-0">
                
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-slate-100">
                  <img
                    src="/images/brightfuture/about_campus.jpg"
                    alt={`${displayName} Campus Architecture`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -top-5 right-2 sm:-right-4 bg-[#EDF5FA] border border-[#D6EDFF] rounded-2xl px-4 py-2 shadow-lg -rotate-6">
                  <span className="font-serif italic text-[#005689] font-bold text-sm tracking-wide">
                    A Campus Built for Big Dreams ✨
                  </span>
                </div>

                <div className="absolute -bottom-6 -right-3 sm:-right-6 w-40 sm:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="/images/brightfuture/about_lab.jpg"
                    alt="Students in Science Lab"
                    className="w-full h-full object-cover"
                  />
                </div>

              </div>

            </div>

            {/* 4 Stat Cards in 1 Single Line (4 Columns, Compact Size) */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-4 gap-2 sm:gap-4">
              
              <div className="bg-white rounded-xl p-2 sm:p-3.5 shadow-2xs border border-gray-100 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 hover:shadow-xs transition-shadow min-w-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 w-full">
                  <div className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">Established</div>
                  <div className="text-xs sm:text-xl font-black text-gray-950 truncate">{displayEstablished}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-2 sm:p-3.5 shadow-2xs border border-gray-100 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 hover:shadow-xs transition-shadow min-w-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 w-full">
                  <div className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">Students</div>
                  <div className="text-xs sm:text-xl font-black text-gray-950 truncate">{displayStudents}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-2 sm:p-3.5 shadow-2xs border border-gray-100 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 hover:shadow-xs transition-shadow min-w-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 w-full">
                  <div className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">Faculty</div>
                  <div className="text-xs sm:text-xl font-black text-gray-950 truncate">{displayTeachers}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-2 sm:p-3.5 shadow-2xs border border-gray-100 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 hover:shadow-xs transition-shadow min-w-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 w-full">
                  <div className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">Campus Area</div>
                  <div className="text-xs sm:text-xl font-black text-gray-950 truncate">12 Acres</div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* COLLAPSIBLE ACCREDITATION & QUICK PROFILE CARD            */}
        {/* ========================================================= */}
        <section id="credentials" className="py-2.5 sm:py-3.5 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden">
              
              {/* Collapsible Header (Click to Open/Close) */}
              <button
                type="button"
                onClick={() => setIsCredOpen(prev => !prev)}
                className="w-full flex items-center justify-between p-3 sm:px-4 text-left hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#EDF5FA] text-[#005689] flex items-center justify-center shrink-0 border border-[#D0E5F5]/60">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
                  </div>
                  <div>
                    <span className="text-[8.5px] font-bold tracking-wider uppercase text-[#005689] block leading-none">Accreditation</span>
                    <h3 className="text-xs sm:text-[13px] font-black text-[#002B49] leading-tight flex items-center gap-1.5">
                      <span>Quick Profile</span>
                      <span className="text-[10px] font-normal text-slate-500">
                        {isCredOpen ? '(Tap to collapse)' : '(Tap to expand)'}
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>UDISE Verified
                  </span>
                  
                  {/* Visible Arrow / Chevron Icon */}
                  <div className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-200 ${isCredOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </button>

              {/* Collapsible List Content (Hidden by default) */}
              <div className={`${isCredOpen ? 'block' : 'hidden'} border-t border-slate-100 bg-[#F8FAFC] divide-y divide-slate-100`}>
                
                {/* Board */}
                <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Board</span>
                  <span className="font-bold text-slate-900">{boardsList.length > 0 ? boardsList.join(' / ') : board || 'HBSE'}</span>
                </div>

                {/* UDISE Code */}
                <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">UDISE Code</span>
                  <span className="font-mono font-bold text-slate-900">{displayUdise}</span>
                </div>

                {/* School Type */}
                <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">School Type</span>
                  <span className="font-bold text-slate-900">{displayBoardingType || 'Day School'}</span>
                </div>

                {/* Medium */}
                <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Medium</span>
                  <span className="font-bold text-slate-900">{mediumsList.length > 0 ? mediumsList.join(' / ') : medium || 'Hindi'}</span>
                </div>

                {/* Classes */}
                <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Classes</span>
                  <span className="font-bold text-slate-900">{displayClasses}</span>
                </div>

              </div>

            </div>
          </div>
        </section>


      {/* ========================================================= */}
      {/* 4. MESSAGE FROM THE PRINCIPAL SECTION                     */}
      {/* ========================================================= */}
      <section id="principal" className="pt-8 sm:pt-14 pb-4 sm:pb-8 bg-gradient-to-b from-white via-sky-50/50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
            <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
            <span>MESSAGE FROM THE PRINCIPAL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mb-12">
            A Message for a <span className="text-[#005689]">Brighter Tomorrow</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Principal Photo Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-3 shadow-lg border border-gray-100 max-w-sm mx-auto">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100">
                  <img
                    src="/images/brightfuture/principal.jpg"
                    alt={displayPrincipal}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950 text-base leading-snug">{displayPrincipal}</h3>
                    <p className="text-xs text-gray-500 font-medium">Principal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Quote & Narrative */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-[#EDF5FA] border border-[#D6EDFF] rounded-3xl p-6 sm:p-8 relative">
                <div className="text-amber-400 text-5xl font-serif leading-none select-none">“</div>
                <p className="italic text-base sm:text-lg text-gray-800 font-medium mt-1 leading-relaxed">
                  "Education is the most powerful weapon which you can use to change the world."
                </p>
                <div className="text-xs text-gray-500 font-semibold mt-3">— Nelson Mandela</div>
              </div>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                At {displayName}, we are committed to nurturing every child's unique potential. Our goal is to create a safe, supportive and inspiring environment where students not only excel academically, but also grow into responsible, kind and confident global citizens.
              </p>

              <div className="pt-4 flex items-center gap-6">
                <div>
                  <div className="font-serif italic text-2xl sm:text-3xl text-[#005689] font-bold tracking-wide">
                    {displayPrincipal.replace(/^(Dr\.|Mrs\.|Mr\.|Shri|Ms\.)\s*/i, '')}
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-1">
                    {displayPrincipal}, Principal
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. OUR GUIDING PRINCIPLES (WITH MATCHING ILLUSTRATIONS)   */}
      {/* ========================================================= */}
      <section id="principles" className="pt-6 sm:pt-10 pb-10 sm:pb-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-left max-w-2xl mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
              <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
              <span>VISION • MISSION • VALUES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Our Guiding Principles
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
              Every initiative, laboratory experiment, and classroom interaction is driven by our core philosophy to nurture holistic global citizens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Card 1: Vision (Telescope / Looking into Future) */}
            <div className="bg-gradient-to-b from-blue-50/50 via-white to-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-blue-50 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="/images/illustrations/vision-telescope.jpg"
                    alt="Vision Illustration"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-950">Vision</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Empowering every learner to imagine, explore, and create a better future through deep curiosity, scientific inquiry, and purposeful leadership.
                </p>
              </div>

              <div className="pt-6 border-t border-blue-50 mt-6 flex items-center gap-2 text-xs font-bold text-[#006FCC]">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Future-Ready Thinking</span>
              </div>
            </div>

            {/* Card 2: Mission (Target & Goal Collaboration) */}
            <div className="bg-gradient-to-b from-sky-50/50 via-white to-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-sky-50 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="/images/illustrations/mission-target.png"
                    alt="Mission Illustration"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-950">Mission</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To provide meaningful, experiential learning environments that cultivate real-world problem solving, character building, and creative confidence.
                </p>
              </div>

              <div className="pt-6 border-t border-sky-50 mt-6 flex items-center gap-2 text-xs font-bold text-[#006FCC]">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Action-Oriented Learning</span>
              </div>
            </div>

            {/* Card 3: Values (Care, Empathy & Growth) */}
            <div className="bg-gradient-to-b from-amber-50/40 via-white to-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-amber-50 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="/images/illustrations/values-community.jpg"
                    alt="Values Illustration"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-950">Values</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-700 pt-1">
                  {['Integrity', 'Curiosity', 'Respect', 'Excellence', 'Innovation', 'Compassion'].map((val) => (
                    <div key={val} className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-amber-50 mt-6 flex items-center gap-2 text-xs font-bold text-[#006FCC]">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Character & Empathy</span>
              </div>
            </div>

          </div>

        </div>
      </section>
        </>
      )}


      {/* ========================================================= */}
      {/* 3.5 ACADEMICS, CURRICULUM & NEP 2020 PEDAGOGY TAB         */}
      {/* ========================================================= */}
      {activeTab === 'academics' && (
        <section id="academics" className="py-12 sm:py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* AI Template Instruction: Section 10 (Academics & Curriculum) */}
            <AiSectionInstructionBadge sectionKey="academics" isVisible={isTemplate && showAiGuide} />

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">
                <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
                <span>ACADEMIC EXCELLENCE & CURRICULUM</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                Rigorous Academics, <br className="hidden sm:inline" />
                <span className="text-[#005689]">NEP 2020 Aligned Pedagogy</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
                At {displayName}, education transcends rote memorization. We integrate experiential STEM learning, critical inquiry, and comprehensive continuous evaluation from foundational years to senior secondary board examinations.
              </p>
            </div>

            {/* 4 Pillars of Learning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14">
              {[
                {
                  icon: '🔬',
                  stage: 'Foundational Years',
                  grades: 'Nursery to Grade 2',
                  desc: 'Play-based, sensory exploration, phonics, and foundational numeracy with dedicated activity rooms.',
                  color: 'border-blue-200 bg-blue-50/40 text-blue-900'
                },
                {
                  icon: '📐',
                  stage: 'Preparatory Stage',
                  grades: 'Grades 3 to 5',
                  desc: 'Interactive discovery, bilingual comprehension, basic mathematical logic, and hands-on nature studies.',
                  color: 'border-amber-200 bg-amber-50/40 text-amber-900'
                },
                {
                  icon: '⚙️',
                  stage: 'Middle School',
                  grades: 'Grades 6 to 8',
                  desc: 'Experiential science experiments, computational thinking, coding bootcamps, and vocational crafts.',
                  color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                },
                {
                  icon: '🎓',
                  stage: 'Secondary & Senior',
                  grades: 'Grades 9 to 12',
                  desc: 'Stream specialization (Science, Commerce, Arts), board exam masterclasses, and JEE/NEET/CUET mentorship.',
                  color: 'border-indigo-200 bg-indigo-50/40 text-indigo-900'
                }
              ].map((p, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${p.color} transition-all hover:shadow-md`}>
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                    {p.grades}
                  </span>
                  <h3 className="text-base font-extrabold text-gray-900 mb-2">{p.stage}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Senior Secondary Academic Streams */}
            <div className="mb-14">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                    Senior Secondary Academic Streams (Grades 11 & 12)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Structured subject combinations affiliated with {board || 'CBSE Board'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#006FCC] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
                  Accredited Curricula
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Science */}
                <div className="bg-white rounded-3xl p-6 border-2 border-blue-200/80 shadow-md hover:border-blue-400 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                    🔬
                  </div>
                  <h4 className="text-lg font-black text-gray-950 mb-1">Science Stream (STEM)</h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Medical & Non-Medical specializations with daily practical laboratory sessions.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-gray-800">Core Subjects:</div>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Physics (Theory + Hands-on Lab)</li>
                      <li>• Chemistry (Organic, Inorganic, Physical)</li>
                      <li>• Mathematics / Applied Mathematics</li>
                      <li>• Biology / Biotechnology (Medical track)</li>
                      <li>• English Core & Technical Writing</li>
                    </ul>
                    <div className="font-bold text-gray-800 pt-2">Skill Electives:</div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Computer Science', 'AI & Data Science', 'Physical Education'].map((el, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-[10.5px] font-semibold px-2 py-0.5 rounded-md border border-blue-200">
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Commerce */}
                <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200/80 shadow-md hover:border-emerald-400 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                    📈
                  </div>
                  <h4 className="text-lg font-black text-gray-950 mb-1">Commerce Stream</h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Business finance, chartered accountancy foundations, and entrepreneurship.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-gray-800">Core Subjects:</div>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Accountancy (Financial & Management)</li>
                      <li>• Business Studies & Organizational Management</li>
                      <li>• Economics (Micro & Macroeconomics)</li>
                      <li>• Mathematics / Informatics Practices</li>
                      <li>• English Core & Business Communication</li>
                    </ul>
                    <div className="font-bold text-gray-800 pt-2">Skill Electives:</div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Financial Market Mgmt', 'Entrepreneurship', 'Informatics'].map((el, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-700 text-[10.5px] font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Humanities */}
                <div className="bg-white rounded-3xl p-6 border-2 border-amber-200/80 shadow-md hover:border-amber-400 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                    ⚖️
                  </div>
                  <h4 className="text-lg font-black text-gray-950 mb-1">Humanities & Liberal Arts</h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Critical social analysis, civil services foundations, law and creative writing.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-gray-800">Core Subjects:</div>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Political Science & International Relations</li>
                      <li>• History (Indian & World Civilizations)</li>
                      <li>• Psychology & Human Behavior</li>
                      <li>• Sociology & Social Anthropology</li>
                      <li>• English Core & Literature Electives</li>
                    </ul>
                    <div className="font-bold text-gray-800 pt-2">Skill Electives:</div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Legal Studies', 'Fine Arts & Design', 'Mass Media'].map((el, i) => (
                        <span key={i} className="bg-amber-50 text-amber-700 text-[10.5px] font-semibold px-2 py-0.5 rounded-md border border-amber-200">
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Academic Track Record & Board Examination Results */}
            <div className="bg-[#EDF5FA] rounded-3xl p-6 sm:p-10 border border-[#D6EDFF]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#005689]">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>PROVEN ACADEMIC RESULTS</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#002B49]">
                    Consistent 100% Board Results & Competitive Edge
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    Our scholars consistently attain distinction scores in CBSE Board Examinations. With dedicated faculty mentorship, regular doubt clinics, and individual academic attention, students excel without relying on external coaching centers.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('admissions')}
                      className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>Apply for Admission</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('awards')}
                      className="button_secondary bg-white hover:bg-gray-50 text-[#005689] border border-[#D6EDFF] font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Honors & Toppers</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs text-center">
                    <div className="text-3xl sm:text-4xl font-black text-[#005689]">100%</div>
                    <div className="text-xs font-bold text-gray-800 mt-1">Board Pass Rate</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">CBSE 10th & 12th</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs text-center">
                    <div className="text-3xl sm:text-4xl font-black text-amber-600">86.4%</div>
                    <div className="text-xs font-bold text-gray-800 mt-1">Average Aggregate</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">School Batch Median</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs text-center">
                    <div className="text-3xl sm:text-4xl font-black text-emerald-600">42+</div>
                    <div className="text-xs font-bold text-gray-800 mt-1">90%+ Scorers</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Recent Board Session</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs text-center">
                    <div className="text-3xl sm:text-4xl font-black text-indigo-600">1:20</div>
                    <div className="text-xs font-bold text-gray-800 mt-1">Teacher-Student Ratio</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Personal Mentorship</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}


      {/* ========================================================= */}
      {/* 6. OUR FACILITIES SECTION (10-GRID)                       */}
      {/* ========================================================= */}
      {/* ─── TAB 5: FACILITIES ─── */}
      {activeTab === 'facilities' && (
        <section id="facilities" className="pt-10 sm:pt-16 pb-6 sm:pb-8 bg-[#F8FAFC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* AI Template Instruction: Section 4 (STEM Labs & Infrastructure) */}
          <AiSectionInstructionBadge sectionKey="labs" isVisible={isTemplate && showAiGuide} />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
                <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
                <span>OUR FACILITIES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                Everything Students Need to <br />
                <span className="text-[#005689]">Learn, Explore & Grow</span>
              </h2>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              {isLiveTemplate && isEditMode && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingFacility(null);
                    setIsAddFacilityModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 bg-[#006FCC] hover:bg-[#005499] text-white px-5 py-2.5 rounded-[12px] text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Add Facility Card</span>
                </button>
              )}
              {effectiveFacilities.length > 0 && (
                <button
                  onClick={() => setSelectedFacility(effectiveFacilities[0])}
                  className="button_secondary inline-flex items-center gap-2 bg-[#EDF5FA] hover:bg-[#D6EDFF] border border-[#D6EDFF] text-[#006FCC] px-5 py-2.5 rounded-[12px] text-sm font-bold transition-all shadow-xs cursor-pointer"
                >
                  <span>All Details</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Grid / Empty State */}
          {effectiveFacilities.length === 0 ? (
            <div className="my-10 py-16 px-6 text-center bg-white rounded-3xl border-2 border-dashed border-sky-200 max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center mx-auto mb-4 border border-[#D6EDFF]">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Facility Cards Added Yet</h3>
              <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                Clean starting template with 0 cards. Click below to add labs, sports, libraries, transport, and smart classrooms from our built-in school icon & illustration library.
              </p>
              {isEditMode ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingFacility(null);
                    setIsAddFacilityModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Add First Facility Card</span>
                </button>
              ) : (
                <p className="text-xs text-gray-400">Switch to Edit Mode in top bar to add facility cards.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 pb-8 pt-3">
              {effectiveFacilities.map((facility) => {
                const IconComponent = facility.icon;
                return (
                  <div
                    key={facility.id}
                    className="w-full h-[340px] sm:h-[375px] [perspective:1200px] group cursor-pointer relative"
                  >
                    <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl">
                      
                      {/* ================= FRONT FACE: REAL PHOTOGRAPH / ILLUSTRATION ================= */}
                      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-gray-200/90 flex flex-col justify-between shadow-xs">
                        
                        {/* Real Facility Photograph or Fallback SVG Illustration */}
                        <div className="relative h-[130px] sm:h-[165px] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                          {!facility.photo || imageErrors[facility.id] ? (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center p-2 sm:p-3">
                              <facility.Illustration className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          ) : (
                            <img
                              src={facility.photo}
                              alt={`${displayName} - ${facility.name}`}
                              onError={() => setImageErrors((prev) => ({ ...prev, [facility.id]: true }))}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />
                          
                          {/* Category Tag & Icon */}
                          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold ${facility.color} text-white shadow-md backdrop-blur-sm`}>
                              <IconComponent className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="truncate max-w-[85px] sm:max-w-none">{facility.category}</span>
                            </span>
                          </div>

                          {/* Edit / Delete action overlay in Edit Mode */}
                          {isLiveTemplate && isEditMode && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 z-30" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingFacility(facility._raw || facility);
                                  setIsAddFacilityModalOpen(true);
                                }}
                                title="Edit Card"
                                className="w-6 h-6 rounded-md bg-white/95 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition hover:scale-105 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete ${facility.name}?`)) {
                                    templateCtx?.deleteFacilityCard(facility.id);
                                  }
                                }}
                                title="Delete Card"
                                className="w-6 h-6 rounded-md bg-rose-600/95 hover:bg-rose-700 text-white shadow-md flex items-center justify-center transition hover:scale-105 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {/* Capacity and Verification Tag */}
                          <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between text-white text-[9px] sm:text-[10px] font-medium pointer-events-none">
                            <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8.5px] sm:text-[9.5px]">
                              👥 {facility.capacity}
                            </span>
                            <span className="hidden xs:inline-block bg-emerald-500/90 px-1.5 py-0.5 rounded text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider shadow-sm">
                              {!facility.photo || imageErrors[facility.id] ? 'Facility' : 'Verified'}
                            </span>
                          </div>
                        </div>

                        {/* Front Card Narrative */}
                        <div className="p-2.5 sm:p-3.5 flex flex-col justify-between flex-1">
                          <div>
                            <h3 className="font-bold text-gray-950 text-xs sm:text-[15px] group-hover:text-[#006FCC] transition-colors leading-tight truncate">
                              {facility.name}
                            </h3>
                            <p className="text-[9.5px] sm:text-[11px] text-gray-500 font-medium mt-0.5 truncate">
                              {facility.tagline}
                            </p>
                            <p className="text-[10px] sm:text-[11px] text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                              {facility.desc}
                            </p>
                          </div>

                          {/* Interactive 3D Flip Hint Bar */}
                          <div className="pt-1.5 sm:pt-2 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[9px] sm:text-[10px] font-bold text-[#006FCC] flex items-center gap-1">
                              <span>Flip specs</span>
                              <span className="text-xs font-black">↷</span>
                            </span>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center group-hover:bg-[#006FCC] group-hover:text-white transition-colors">
                              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* ================= BACK FACE: WHITE BACKGROUND & DEEP BLUE TEXT ================= */}
                      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl sm:rounded-3xl overflow-hidden bg-white text-[#002B49] p-2.5 sm:p-3.5 flex flex-col justify-between border-2 border-[#D6EDFF] shadow-xl">
                        
                        {/* Top Header + Scrollable Specs Body */}
                        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-0.5">
                          {/* Header with Lab Name & Icon */}
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-[#EDF5FA] border border-[#D6EDFF] flex items-center justify-center text-[#005689] shrink-0">
                                <IconComponent className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-[#002B49] text-xs sm:text-[13px] leading-tight truncate">
                                  {facility.name}
                                </h4>
                                <span className="text-[9px] text-[#005689] uppercase tracking-wider font-bold block truncate">
                                  {facility.category}
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] font-bold text-[#005689] bg-[#EDF5FA] px-2 py-0.5 rounded-full border border-[#D6EDFF] shrink-0 ml-1">
                              Specs
                            </span>
                          </div>

                          {/* Full Detailed Paragraph */}
                          <div className="bg-[#F8FAFD] rounded-lg p-2 my-2 border border-slate-100 shrink-0">
                            <p className="text-[10.5px] text-[#002B49]/90 font-medium leading-relaxed whitespace-normal break-words">
                              {facility.details}
                            </p>
                          </div>

                          {/* Highlight Specs Lines */}
                          <div className="space-y-1.5 pb-1">
                            {facility.specs.map((sp: any, sIdx: number) => (
                              <div
                                key={sIdx}
                                className="bg-[#F8FAFD] hover:bg-[#EDF5FA] rounded-lg px-2 py-1.5 border border-slate-100 flex items-start gap-1.5 transition-colors"
                              >
                                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                                  <span className="w-3.5 h-3.5 rounded-full bg-[#005689] text-white font-black text-[8px] flex items-center justify-center shadow-xs">
                                    {sIdx + 1}
                                  </span>
                                  <CheckCircle2 className="w-3 h-3 text-[#006FCC]" />
                                </div>

                                <div className="min-w-0 flex-1 leading-tight text-[10px] whitespace-normal break-words">
                                  <span className="font-bold uppercase tracking-wider text-[#005689] mr-1">
                                    {sp.label}:
                                  </span>
                                  <span className="font-semibold text-[#002B49]">
                                    {sp.val}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Back Footer with Timings and Full View CTA */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 mt-1 shrink-0">
                          <div className="text-[9.5px] text-[#002B49]/80 truncate">
                            <span className="font-bold text-[#002B49]">🕒</span> {facility.timings}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFacility(facility);
                            }}
                            className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-2.5 py-1 rounded-[10px] text-[10.5px] flex items-center gap-1 shadow-[0_3px_10px_rgba(0,111,204,0.3)] transition-all active:scale-95 shrink-0 cursor-pointer"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
      )}


      {/* ========================================================= */}
      {/* 6.1 EXTRACURRICULAR ACTIVITIES & SPORTS TAB               */}
      {/* ========================================================= */}
      {activeTab === 'extracurricular' && (
        <section id="extracurricular" className="py-12 sm:py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* AI Template Instruction */}
            <AiSectionInstructionBadge sectionKey="extracurricular" isVisible={isTemplate && showAiGuide} />

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">
                <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
                <span>BEYOND THE TEXTBOOKS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                Extracurricular Excellence, <br className="hidden sm:inline" />
                <span className="text-[#005689]">Sports Academies & Creative Arts</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
                At {displayName}, holistic development is built on the athletic field and arts studio. We provide professional coaching, dedicated music conservatories, and compulsory physical training so every child discovers their inner talent.
              </p>
            </div>

            {/* Sports Academies 4-Card Grid */}
            <div className="mb-14">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                    Professional Sports Academies & Coaching
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Supervised by certified NIS coaches with state-of-the-art sports infrastructure
                  </p>
                </div>
                <span className="text-xs font-bold text-[#006FCC] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
                  SGFI & CBSE Cluster Aligned
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: '🏏',
                    sport: 'Cricket Academy',
                    infra: 'Turf Pitch & Practice Nets',
                    desc: 'Batting nets with automated bowling machine, certified coaches, and district tournament hosting.',
                    badge: 'Under-14 & U-17 Teams'
                  },
                  {
                    icon: '⚽',
                    sport: 'Football & Athletics',
                    infra: 'FIFA Standard Turf & 400m Track',
                    desc: 'Full-size grass ground, specialized sprint tracks, and regular inter-school friendly leagues.',
                    badge: 'State Finalists'
                  },
                  {
                    icon: '🏀',
                    sport: 'Basketball & Badminton',
                    infra: 'Synthetic Floodlit Courts',
                    desc: 'Indoor wooden badminton hall and dual floodlit basketball arenas with daily drills.',
                    badge: 'Inter-House League'
                  },
                  {
                    icon: '🏊',
                    sport: 'Swimming Pool',
                    infra: 'Half-Olympic Size (25m)',
                    desc: 'Temperature-controlled filtration, separate shallow pool for primary students, and certified lifeguards.',
                    badge: '100% Safety Certified'
                  }
                ].map((sp, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-md hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between">
                    <div>
                      <div className="text-4xl mb-3">{sp.icon}</div>
                      <span className="text-[10.5px] font-bold text-[#006FCC] uppercase tracking-wider block mb-1">
                        {sp.infra}
                      </span>
                      <h4 className="text-lg font-black text-gray-950 mb-2">{sp.sport}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4">{sp.desc}</p>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                        {sp.badge}
                      </span>
                      <Activity className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performing Arts, Music & Martial Arts */}
            <div className="bg-[#EDF5FA] rounded-3xl p-6 sm:p-10 border border-[#D6EDFF]">
              <h3 className="text-xl sm:text-2xl font-black text-[#002B49] mb-2">
                Visual & Performing Arts Conservatory
              </h3>
              <p className="text-xs text-gray-600 mb-6">
                Specialized art educators nurture imagination, self-expression, and musical discipline.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
                  <div className="text-3xl mb-2">🎵</div>
                  <h4 className="font-extrabold text-sm text-gray-900 mb-1">Indian & Western Music Studio</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Acoustically treated studio equipped with keyboards, drums, classical sitar, tabla, and school choral group training.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
                  <div className="text-3xl mb-2">💃</div>
                  <h4 className="font-extrabold text-sm text-gray-900 mb-1">Classical & Contemporary Dance</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Spacious wooden-floor dance studio for Kathak, Bharatnatyam, folk dance, and contemporary rhythm choreography.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
                  <div className="text-3xl mb-2">🥋</div>
                  <h4 className="font-extrabold text-sm text-gray-900 mb-1">Taekwondo & Self Defense</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Mandatory self-defense martial arts modules for all students from Grade 3 onwards, led by black-belt instructors.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}


      {/* ========================================================= */}
      {/* 6.2 AWARDS & HONORS TAB                                   */}
      {/* ========================================================= */}
      {activeTab === 'awards' && (
        <section id="awards" className="py-12 sm:py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* AI Template Instruction */}
            <AiSectionInstructionBadge sectionKey="awards" isVisible={isTemplate && showAiGuide} />

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">
                <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
                <span>HALL OF FAME & HONORS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                Celebrating Excellence, <br className="hidden sm:inline" />
                <span className="text-[#005689]">Trophies & National Accolades</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
                Over the decades, {displayName} has earned prestigious recognitions across board examinations, STEM tinkering, green campus sustainability, and state-level sports championships.
              </p>
            </div>

            {/* Institutional Awards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                {
                  icon: '🏆',
                  title: 'National Green School Award',
                  org: 'Ministry of Education & Environment',
                  year: '2025 - 2026',
                  desc: 'Ranked #1 for zero-waste campus protocols, solar power utilization, and organic biodiversity gardens.',
                  badge: 'National Rank #1'
                },
                {
                  icon: '🔬',
                  title: 'Top STEM Tinkering School',
                  org: 'Atal Innovation Mission / NITI Aayog',
                  year: '2024 - 2025',
                  desc: 'Awarded for exemplary student robotics prototypes, drone models, and patent-worthy school inventions.',
                  badge: 'Excellence in STEM'
                },
                {
                  icon: '🥇',
                  title: 'Academic Excellence Shield',
                  org: 'State Education Directorate',
                  year: '2023 - 2024',
                  desc: 'Consecutive 100% board examination pass results with highest distinction percentage in the zone.',
                  badge: '100% CBSE Results'
                },
                {
                  icon: '⚽',
                  title: 'State Sports Championship',
                  org: 'School Games Federation of India (SGFI)',
                  year: '2024 - 2025',
                  desc: 'Gold trophy in Under-17 Inter-School Athletics and State Basketball Championship runners-up.',
                  badge: 'State Champions'
                }
              ].map((aw, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-md hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">{aw.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                        {aw.year}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#006FCC] block mb-1">{aw.org}</span>
                    <h3 className="text-lg font-black text-gray-950 mb-2 leading-snug">{aw.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{aw.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ✓ {aw.badge}
                    </span>
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Board Toppers & Wall of Fame */}
            <div className="bg-[#EDF5FA] rounded-3xl p-6 sm:p-10 border border-[#D6EDFF]">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#005689] mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>ACADEMIC WALL OF FAME</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#002B49]">
                    CBSE Board High Achievers & Olympiad Laureates
                  </h3>
                </div>
                <span className="text-xs font-semibold text-gray-600 bg-white px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
                  Audited Board Scores
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Aarav Singhania', score: '98.8%', exam: 'Class 12th (Science)', rank: 'District Rank 1', mentor: 'IIT-JEE Qualified' },
                  { name: 'Ananya Sharma', score: '98.4%', exam: 'Class 12th (Commerce)', rank: 'School Topper', mentor: 'SRCC Admitted' },
                  { name: 'Kavya Pillai', score: '99.2%', exam: 'Class 10th Board', rank: 'State Rank 3', mentor: '100/100 in Maths' },
                  { name: 'Rohan Mehra', score: 'Gold Medal', exam: 'Intl. Science Olympiad', rank: 'National Finalist', mentor: 'SOF Medalist' }
                ].map((top, tIdx) => (
                  <div key={tIdx} className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#005689] to-[#006FCC] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {top.name.charAt(0)}
                      </div>
                      <span className="text-lg font-black text-[#005689]">{top.score}</span>
                    </div>
                    <h4 className="font-extrabold text-gray-950 text-sm">{top.name}</h4>
                    <p className="text-[11px] font-semibold text-gray-500 mt-0.5">{top.exam}</p>
                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        {top.rank}
                      </span>
                      <span className="text-gray-400">{top.mentor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}


      {/* ========================================================= */}
      {/* 6.3 EVENTS, FESTS & STUDENT CLUBS TAB                     */}
      {/* ========================================================= */}
      {activeTab === 'events' && (
        <section id="events" className="py-12 sm:py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* AI Template Instruction */}
            <AiSectionInstructionBadge sectionKey="events" isVisible={isTemplate && showAiGuide} />

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">
                <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
                <span>VIBRANT CAMPUS LIFE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                Annual Celebrations, <br className="hidden sm:inline" />
                <span className="text-[#005689]">STEAM Exhibitions & Student Clubs</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
                Campus life at {displayName} is a celebration of student inquiry, cultural heritage, and leadership. From our flagship Annual Science Fair to Model United Nations, every event fosters collaboration and creative confidence.
              </p>
            </div>

            {/* 3 Column Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              {[
                {
                  title: 'Annual Day & Cultural Fest "Udaan"',
                  term: 'Winter Term (December)',
                  badge: 'Flagship Event',
                  desc: 'Over 1,200 students take the grand auditorium stage in musical drama, orchestra, classical dance, and mime theatre celebrating unity in diversity.',
                  highlights: ['100% Student Participation', 'Dignitary Guest Lectures', 'Theme-Based Productions']
                },
                {
                  title: 'National STEAM & ATL Innovation Fair',
                  term: 'Autumn Term (October)',
                  badge: 'Robotics & Science',
                  desc: 'A 2-day student-curated exhibition presenting working prototypes, smart-city models, solar irrigation devices, and AI automated systems.',
                  highlights: ['60+ Working Working Models', 'Jury by IIT & CSIR Scientists', 'Community Demo Sessions']
                },
                {
                  title: 'Athletics Meet & Annual Sports Day',
                  term: 'Spring Term (February)',
                  badge: 'Field & Track',
                  desc: 'Inter-house march past, 400m relay races, high jumps, taekwondo demonstrations, and the prestigious House Championship Trophy.',
                  highlights: ['4 Houses Competition', 'Parent-Teacher Race Track', 'Medal Podium Ceremony']
                }
              ].map((ev, eIdx) => (
                <div key={eIdx} className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-gray-100 shadow-md hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-[#006FCC] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {ev.badge}
                      </span>
                      <span className="text-[11px] text-gray-500 font-semibold">{ev.term}</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-950 mb-2 leading-snug">{ev.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{ev.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 space-y-1.5">
                    {ev.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-[11px] text-gray-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Active Student Clubs Strip */}
            <div className="bg-[#EDF5FA] rounded-3xl p-6 sm:p-10 border border-[#D6EDFF]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#002B49]">
                    Student-Led Co-Curricular Clubs & Societies
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Meeting weekly to pursue passions, elect club officers, and organize campus initiatives.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#005689] bg-white px-3 py-1.5 rounded-full border border-blue-200 shadow-2xs self-start sm:self-auto">
                  Every Friday Activity Period
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {[
                  { name: 'Robotics & Coding', icon: '🤖', count: '120 Members' },
                  { name: 'Eco & Nature Club', icon: '🌱', count: '95 Members' },
                  { name: 'Debate & MUN', icon: '🎙️', count: '80 Members' },
                  { name: 'Astronomy & Space', icon: '🔭', count: '65 Members' },
                  { name: 'Heritage & History', icon: '🏛️', count: '70 Members' },
                  { name: 'Math & Vedic Club', icon: '📐', count: '85 Members' }
                ].map((club, cIdx) => (
                  <div key={cIdx} className="bg-white p-4 rounded-2xl border border-blue-100 text-center hover:border-blue-400 transition-colors shadow-2xs">
                    <div className="text-2xl mb-1.5">{club.icon}</div>
                    <div className="text-xs font-black text-gray-900 leading-tight">{club.name}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{club.count}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}


      {/* ========================================================= */}
      {/* 6.4 FACULTY & MENTORS TAB                                 */}
      {/* ========================================================= */}
      {activeTab === 'faculty' && (
        <section id="faculty" className="py-12 sm:py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* AI Template Instruction */}
            <AiSectionInstructionBadge sectionKey="faculty" isVisible={isTemplate && showAiGuide} />

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">
                <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
                <span>EXEMPLARY EDUCATORS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                Passionate Faculty, <br className="hidden sm:inline" />
                <span className="text-[#005689]">Distinguished Mentors & Subject Specialists</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
                The heart of {displayName} is our team of certified, empathetic educators. With an optimal 1:20 teacher-student ratio, every child is personally mentored, supported in difficulties, and challenged to excel.
              </p>
            </div>

            {/* Faculty Key Stat Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {[
                { val: '65+', label: 'Certified Educators', desc: '100% CTET / B.Ed / M.Ed Qualified' },
                { val: '1 : 20', label: 'Teacher-Student Ratio', desc: 'Individual Attention Assured' },
                { val: '9.4 Yrs', label: 'Average Experience', desc: 'High Faculty Retention & Stability' },
                { val: '40+ Hrs', label: 'Annual Training', desc: 'NEP 2020 Pedagogical Workshops' }
              ].map((stat, sIdx) => (
                <div key={sIdx} className="bg-[#EDF5FA] rounded-2xl p-5 border border-[#D6EDFF] text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#005689]">{stat.val}</div>
                  <div className="text-xs sm:text-sm font-bold text-gray-950 mt-1">{stat.label}</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-600 mt-0.5">{stat.desc}</div>
                </div>
              ))}
            </div>

            {/* Department Leadership Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  role: 'Principal & Director',
                  name: 'Dr. Sunita K. Sharma',
                  qual: 'Ph.D. in Physics, M.Ed (Gold Medalist)',
                  exp: '24 Years in Academic Leadership',
                  focus: 'Former CBSE Board Observer, passionate about experiential inquiry and holistic student character development.'
                },
                {
                  role: 'Head of Senior Secondary (Science)',
                  name: 'Prof. Rajeshwar Verma',
                  qual: 'M.Sc. Chemistry, B.Ed, CSIR-NET',
                  exp: '18 Years Teaching Experience',
                  focus: 'Spearheaded 100+ students into IITs and AIIMS; designer of hands-on green chemistry practical micro-kits.'
                },
                {
                  role: 'Head of Mathematics & Innovation',
                  name: 'Mrs. Neha K. Deshmukh',
                  qual: 'M.Sc. Applied Maths, CTET Certified',
                  exp: '14 Years Teaching Experience',
                  focus: 'Author of student problem-solving guides and mentor to regional Math Olympiad gold medalists.'
                },
                {
                  role: 'Student Counselor & Child Psychologist',
                  name: 'Dr. Alok Nath Banerjee',
                  qual: 'M.Phil Clinical Psychology, RCI Licensed',
                  exp: '11 Years in Student Guidance',
                  focus: 'Full-time on-campus guidance counseling, career aptitude assessment, and social-emotional wellness programs.'
                }
              ].map((prof, pIdx) => (
                <div key={pIdx} className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-md hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#005689] to-[#006FCC] text-white font-black text-xl flex items-center justify-center mb-4 shadow-sm">
                      {prof.name.split(' ')[1]?.charAt(0) || prof.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-bold text-[#006FCC] uppercase tracking-wider block mb-1">
                      {prof.role}
                    </span>
                    <h3 className="text-base font-black text-gray-950 mb-1">{prof.name}</h3>
                    <p className="text-[11px] font-semibold text-gray-600 mb-2">{prof.qual}</p>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{prof.focus}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="bg-blue-50 text-[#005689] font-bold px-2 py-0.5 rounded border border-blue-200">
                      {prof.exp}
                    </span>
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}


      {/* ========================================================= */}
      {/* 6.5 CAMPUS GALLERY & PHOTOBOOK TAB                        */}
      {/* ========================================================= */}
      {activeTab === 'gallery' && (
        <section id="gallery" className="py-12 sm:py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* AI Template Instruction */}
            <AiSectionInstructionBadge sectionKey="gallery" isVisible={isTemplate && showAiGuide} />

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">
                <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
                <span>VISUAL CAMPUS TOUR</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                Campus Gallery, <br className="hidden sm:inline" />
                <span className="text-[#005689]">Modern Architecture & Learning Spaces</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
                Explore the green lawns, state-of-the-art laboratory benches, smart interactive classrooms, and multi-sport complexes at {displayName}. Complete transparency for visiting parents.
              </p>
            </div>

            {/* Gallery Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                {
                  title: 'Smart Digital Classrooms',
                  category: 'Classroom Tech',
                  icon: '🖥️',
                  desc: 'Acoustically insulated classrooms with interactive touch panels, dual projection, ergonomic desks, and natural sunlight.',
                  tags: ['86" IFP Displays', 'Air-Circulated', 'Ergonomic Desks']
                },
                {
                  title: 'Composite Science & ATL Labs',
                  category: 'STEM Spaces',
                  icon: '🔬',
                  desc: 'Specialized lab setups with dedicated gas lines, digital spectrometers, 3D printers, and electronics soldering stations.',
                  tags: ['Individual Benches', 'Eye-Wash Stations', 'Robotics Kits']
                },
                {
                  title: 'Junior & Senior Central Library',
                  category: 'Knowledge Hub',
                  icon: '📚',
                  desc: 'Over 14,000 catalogued titles, quiet study carrels, Kindle e-readers, and subscribed national science periodicals.',
                  tags: ['14,000+ Books', 'Kindle Corner', 'Quiet Study Pods']
                },
                {
                  title: 'Synthetic Multi-Sport Arena',
                  category: 'Athletics & Fitness',
                  icon: '🏟️',
                  desc: 'Floodlit basketball court, cricket practice turf, 400m sprint track, and indoor badminton court.',
                  tags: ['Floodlit Courts', 'NIS Coaching', 'Locker Rooms']
                },
                {
                  title: 'Performing Arts & Music Studio',
                  category: 'Creative Arts',
                  icon: '🎭',
                  desc: 'Sound-treated conservatory with classical harmoniums, tablas, synthesizers, drum kits, and full dance mirror wall.',
                  tags: ['Soundproofed', 'Indian & Western', 'Mirrored Dance Floor']
                },
                {
                  title: 'Safe Fleet of GPS GPS Buses',
                  category: 'Transport & Safety',
                  icon: '🚌',
                  desc: 'Clean CNG fleet with live parent GPS tracking app, on-board female attendants, speed governors, and CCTV.',
                  tags: ['Live Tracking', 'Female Attendant', 'Speed Regulated']
                }
              ].map((item, gIdx) => (
                <div key={gIdx} className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-md hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-[10px] font-bold text-[#006FCC] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-gray-950 mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{item.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-1.5">
                    {item.tags.map((t, tIdx) => (
                      <span key={tIdx} className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Virtual Campus Tour Prompt Card */}
            <div className="bg-gradient-to-r from-[#002B49] to-[#005689] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="max-w-xl text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Interactive Experience
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mt-1">
                  Want to Experience {displayName} in Person?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-2">
                  Schedule a 45-minute guided campus walkthrough with our admissions team. Experience classrooms, labs, sports arenas, and interact with senior faculty.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTourModalOpen(true)}
                  className="bg-white hover:bg-blue-50 text-[#005689] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-[#005689]" />
                  <span>Watch Video Tour</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Book Campus Visit
                </button>
              </div>
            </div>

          </div>
        </section>
      )}


      {/* ========================================================= */}
      {/* 7. ADMISSIONS 2026-27 (CLEAR STEP-BY-STEP ROADMAP)         */}
      {/* ========================================================= */}
      {/* ─── TAB 4: ADMISSIONS & FEES ─── */}
      {activeTab === 'admissions' && (
        <>
        <section id="admissions" className="pt-6 sm:pt-10 pb-12 sm:pb-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* AI Template Instruction: Section 6 (Admissions Roadmap & Eligibility) */}
          <AiSectionInstructionBadge sectionKey="admissions" isVisible={isTemplate && showAiGuide} />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689]">
                <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
                <span>ADMISSIONS 2026-27</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                Simple, Transparent <br />
                <span className="text-[#005689]">Admission Process</span>
              </h2>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We believe in an inclusive, transparent admission system without capitation fees or stressful entrance tests for early ages. Seats are allocated based on merit and interaction.
              </p>

              {/* Verified Criteria Card */}
              <div className="bg-[#EDF5FA] rounded-2xl p-5 border border-[#D6EDFF] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#005689]">
                  <ShieldCheck className="w-5 h-5 text-[#006FCC]" />
                  <span>Key Admission Highlights</span>
                </div>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#006FCC] shrink-0" />
                    <span>Open for Class Pre-Nursery to Class 11 (Science, Commerce, Arts)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#006FCC] shrink-0" />
                    <span>Direct admission for Nursery / KG based on age criteria</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#006FCC] shrink-0" />
                    <span>Scholarship up to 50% for state/national sports and merit rankers</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-7 py-3 rounded-[12px] text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Start Admission Application</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <a
                  href="#contact"
                  className="text-sm font-bold text-gray-700 hover:text-[#006FCC] flex items-center gap-1.5"
                >
                  <span>Talk to Counselor</span>
                  <Phone className="w-4 h-4 text-amber-500" />
                </a>
              </div>
            </div>

            {/* Right Steps Horizontal Scroll */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {effectiveAdmissionSteps.length}-Step Admission Roadmap
                </span>
                <div className="flex items-center gap-2">
                  {isLiveTemplate && isEditMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAdmission(null);
                        setIsAddAdmissionModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add Step</span>
                    </button>
                  )}
                  {effectiveAdmissionSteps.length > 0 && (
                    <>
                      <button
                        type="button"
                        aria-label="Scroll steps left"
                        onClick={() => scrollHorizontally(admissionsScrollRef, 'left')}
                        className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Scroll steps right"
                        onClick={() => scrollHorizontally(admissionsScrollRef, 'right')}
                        className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {effectiveAdmissionSteps.length === 0 ? (
                <div className="py-12 px-6 text-center bg-white rounded-3xl border-2 border-dashed border-sky-200 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center mx-auto mb-3 border border-[#D6EDFF]">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Admission Steps Added Yet</h3>
                  <p className="text-xs text-gray-600 mb-4 max-w-sm mx-auto">
                    Clean starting slate with 0 admission cards. Click below to add your school&apos;s step-by-step admission roadmap.
                  </p>
                  {isEditMode ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAdmission(null);
                        setIsAddAdmissionModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>+ Add Admission Step</span>
                    </button>
                  ) : (
                    <p className="text-xs text-gray-400">Switch to Edit Mode to add admission steps.</p>
                  )}
                </div>
              ) : (
                <>
                  <div
                    ref={admissionsScrollRef}
                    onScroll={(e) => handleContainerScroll(e, setAdmissionsActiveIndex)}
                    className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {effectiveAdmissionSteps.map((step: any, sIdx: number) => (
                      <div
                        key={step.id || step.step || sIdx}
                        className="w-[260px] sm:w-[290px] shrink-0 snap-start bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative group flex flex-col justify-between"
                      >
                        {isLiveTemplate && isEditMode && (
                          <div className="absolute top-4 right-4 flex items-center gap-1 z-20">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAdmission(step);
                                setIsAddAdmissionModalOpen(true);
                              }}
                              title="Edit Step"
                              className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete Step ${step.step || (sIdx + 1)}?`)) {
                                  templateCtx?.deleteAdmissionCard(step.id);
                                }
                              }}
                              title="Delete Step"
                              className="p-1 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-700 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div>
                          <div className="text-3xl font-black text-blue-100 group-hover:text-[#006FCC] transition-colors">
                            {step.step || `0${sIdx + 1}`}
                          </div>
                          <h3 className="text-lg font-bold text-gray-950 mt-2 mb-2">
                            {step.title}
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>

                        <div className="pt-4 mt-2 border-t border-gray-50 flex items-center gap-1.5 text-[11px] font-semibold text-[#006FCC]">
                          <span>Step {step.step ? step.step.replace(/\D/g, '') : (sIdx + 1)} of {effectiveAdmissionSteps.length}</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Scroll Dots for Admission Steps */}
                  {renderScrollDots(effectiveAdmissionSteps.length, admissionsActiveIndex, admissionsScrollRef)}
                </>
              )}
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 8. FEE STRUCTURE SECTION (LOWER GRADE TO 12TH)            */}
      {/* ========================================================= */}
      <section id="fees" className="py-12 sm:py-16 bg-[#F8FAFC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* AI Template Instruction: Section 5 (Fee Structure & Policies) */}
          <AiSectionInstructionBadge sectionKey="fees" isVisible={isTemplate && showAiGuide} />
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">
              <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
              <span>OFFICIAL ACADEMIC FEE SCHEDULE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Transparent Fee Schedule (Pre-Primary to 12th)
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              100% verified institutional fees for 2026-27 with quarterly flexibility, sibling discounts, and zero concealed charges.
            </p>
          </div>

          {/* Google-Inspired Quick Selection Ribbon / Chips */}
          <div className="flex items-center justify-start lg:justify-center gap-2.5 overflow-x-auto pb-4 pt-1 mb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { id: 'all', label: 'All Grades', icon: Sparkles },
              { id: 'pre-primary', label: 'Pre-Primary (Nursery-UKG)', icon: Users },
              { id: 'primary', label: 'Primary (Class 1-5)', icon: BookOpen },
              { id: 'middle', label: 'Middle (Class 6-8)', icon: FlaskConical },
              { id: 'secondary', label: 'Secondary (Class 9-10)', icon: Award },
              { id: 'senior-science', label: 'Senior Sec • Science (11-12)', icon: Bot },
              { id: 'senior-commerce', label: 'Senior Sec • Commerce & Arts', icon: TrendingUp }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedFeeWing === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFeeWing(tab.id)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-[12px] text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'button_primary bg-[#006FCC] text-white shadow-[0_4px_14px_rgba(0,111,204,0.35)] scale-105'
                      : 'bg-white text-gray-700 hover:bg-[#EDF5FA] border border-[#DADCE0] shadow-xs hover:border-[#006FCC]/40'
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#006FCC]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Arrows for Fee Cards */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Fee Tiers & Academic Inclusions
              </span>
              <span className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
                {feeStructure.filter((fee) => selectedFeeWing === 'all' || fee.id === selectedFeeWing).length} Tiers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Scroll fee cards left"
                onClick={() => scrollHorizontally(feesScrollRef, 'left')}
                className="w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Scroll fee cards right"
                onClick={() => scrollHorizontally(feesScrollRef, 'right')}
                className="w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Google-Inspired Fee Cards Horizontal Scroll */}
          <div
            ref={feesScrollRef}
            onScroll={(e) => handleContainerScroll(e, setFeesActiveIndex)}
            className="flex gap-6 sm:gap-7 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {feeStructure
              .filter((fee) => selectedFeeWing === 'all' || fee.id === selectedFeeWing)
              .map((fee) => (
                <div
                  key={fee.id}
                  className="w-[315px] sm:w-[365px] md:w-[395px] shrink-0 snap-start bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/90 shadow-[0_1px_3px_rgba(60,64,67,0.08)] hover:shadow-xl hover:border-[#006FCC]/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header badge & Age */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="bg-[#EDF5FA] text-[#006FCC] font-bold text-xs px-3 py-1 rounded-full border border-[#D6EDFF]">
                        {fee.classes}
                      </span>
                      <span className="text-[11px] font-medium text-[#137333] flex items-center gap-1 bg-[#e6f4ea] px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#137333]" /> Verified Fee
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#006FCC] transition-colors">
                      {fee.wing}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mb-5">{fee.ageGroup}</p>

                    {/* Google Price Block */}
                    <div className="bg-[#f8fafd] rounded-xl p-4 mb-5 border border-gray-100">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-gray-900 tracking-tight">
                          {fee.quarterlyTuition.split('/')[0].trim()}
                        </span>
                        <span className="text-xs font-medium text-gray-500">/ quarter</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-2 flex items-center justify-between border-t border-gray-200/70 pt-2">
                        <span>Approx. <strong>{fee.monthlyTuition}</strong> / month</span>
                        <span className="text-gray-700 font-medium">Est. Annual: <strong>{fee.annualEstimated}</strong></span>
                      </div>
                    </div>

                    {/* Itemized Breakdown Table */}
                    <div className="space-y-2.5 text-xs text-gray-700 pb-4 border-b border-gray-100">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Fee Components Breakdown
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Admission Fee (One-Time):</span>
                        <span className="font-semibold text-gray-900">{fee.admissionFee}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Caution Deposit:</span>
                        <span className="font-semibold text-[#137333]">{fee.cautionDeposit}</span>
                      </div>

                      {fee.breakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-gray-500">{item.label}:</span>
                          <span className="font-semibold text-gray-800">{item.amount}</span>
                        </div>
                      ))}
                    </div>

                    {/* Highlights */}
                    <div className="pt-4 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Included Academic Features
                      </div>
                      {fee.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <Check className="w-3.5 h-3.5 text-[#006FCC] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-6 mt-6 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setApplicantClass(fee.classes);
                        setIsApplyModalOpen(true);
                      }}
                      className="w-full button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3 rounded-[12px] text-xs sm:text-sm transition-all shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <span>Inquire / Enroll for {fee.classes}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Dynamic Scroll Dots for Fee Tiers */}
          {renderScrollDots(
            feeStructure.filter((fee) => selectedFeeWing === 'all' || fee.id === selectedFeeWing).length,
            feesActiveIndex,
            feesScrollRef
          )}

          {/* Sibling & Installments Banner */}
          <div className="mt-10 bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-wrap items-center justify-around gap-4 text-xs font-medium text-gray-700">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Percent className="w-4 h-4" />
              </span>
              <span><strong>10% Sibling Concession</strong> for second child enrolled</span>
            </div>
            <div className="w-px h-6 bg-gray-200 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </span>
              <span><strong>Zero-Cost Quarterly Installments</strong> available online</span>
            </div>
            <div className="w-px h-6 bg-gray-200 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-[#137333] flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span><strong>No Capitation or Donation Fee</strong> strictly followed</span>
            </div>
          </div>

          {/* ======================================================= */}
          {/* OTHER CHARGES (SCHOOL SPECIFIC & OPTIONAL)              */}
          {/* ======================================================= */}
          <div className="mt-16 pt-12 border-t border-gray-200/80">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto mb-8">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3 py-1 rounded-full">
                  Optional & Auxiliary Services
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-950 mt-2">
                  Other School-Specific Charges
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Transparent rates for transport, uniform, dining, books, and specialized sports clubs.
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  aria-label="Scroll other charges left"
                  onClick={() => scrollHorizontally(otherChargesScrollRef, 'left')}
                  className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll other charges right"
                  onClick={() => scrollHorizontally(otherChargesScrollRef, 'right')}
                  className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={otherChargesScrollRef}
              onScroll={(e) => handleContainerScroll(e, setOtherChargesActiveIndex)}
              className="flex gap-6 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {otherCharges.map((item, idx) => (
                <div
                  key={idx}
                  className="w-[290px] sm:w-[330px] md:w-[360px] shrink-0 snap-start bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-gray-950 text-base mb-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#006FCC]" />
                      <span>{item.category}</span>
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      {item.desc}
                    </p>

                    <div className="space-y-2 bg-[#F8FAFD] p-3.5 rounded-xl border border-gray-100 text-xs">
                      {item.rates.map((rate, rIdx) => (
                        <div key={rIdx} className="flex items-center justify-between">
                          <span className="text-gray-600">{rate.label}</span>
                          <span className="font-bold text-gray-900">{rate.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 text-[11px] text-gray-400 font-medium">
                    *Opt-in facility; billed on actual usage basis.
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Scroll Dots for Other Charges */}
            {renderScrollDots(otherCharges.length, otherChargesActiveIndex, otherChargesScrollRef)}
          </div>

          {/* ======================================================= */}
          {/* IMPORTANT FEE POLICY & PARENT GUIDELINES                */}
          {/* ======================================================= */}
          <div className="mt-16 pt-12 border-t border-gray-200/80">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto mb-8">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3 py-1 rounded-full">
                  Parent Guidelines & Rules
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-950 mt-2">
                  Important Fee Policies & Notes
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Please review these institutional guidelines regarding due dates, refunds, and scholarships.
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  aria-label="Scroll fee notes left"
                  onClick={() => scrollHorizontally(feeNotesScrollRef, 'left')}
                  className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll fee notes right"
                  onClick={() => scrollHorizontally(feeNotesScrollRef, 'right')}
                  className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={feeNotesScrollRef}
              onScroll={(e) => handleContainerScroll(e, setFeeNotesActiveIndex)}
              className="flex gap-6 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {feeNotesAndPolicies.map((note, idx) => (
                <div
                  key={idx}
                  className="w-[290px] sm:w-[330px] md:w-[360px] shrink-0 snap-start bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4 hover:border-[#D6EDFF] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-950 text-sm mb-1">{note.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{note.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Scroll Dots for Fee Notes & Guidelines */}
            {renderScrollDots(feeNotesAndPolicies.length, feeNotesActiveIndex, feeNotesScrollRef)}
          </div>

        </div>
      </section>
        </>
      )}


      {/* ========================================================= */}
      {/* 9. AUTHENTIC PARENTS & STUDENTS REVIEWS (100% GENUINE)    */}
      {/* ========================================================= */}
      {/* ─── TAB 5: REVIEWS ─── */}
      {activeTab === 'reviews' && (
        <section id="reviews" className="py-12 sm:py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* AI Template Instruction: Section 8 (Verified Community Reviews) */}
            <AiSectionInstructionBadge sectionKey="reviews" isVisible={isTemplate && showAiGuide} />
            
            {/* Header & Write Review Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
                  <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
                  <span>GENUINE COMMUNITY RATINGS</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#002B49] tracking-tight">
                  What Parents & Students Say
                </h2>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Real, verified feedback from enrolled families, current scholars, and distinguished alumni of {displayName}.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleInitiateWriteReview}
                  className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-6 py-3 rounded-[12px] text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Write a Review</span>
                </button>
              </div>
            </div>

            {/* Comprehensive Rating Intelligence & Question-by-Question Overview Card */}
            <div className="bg-[#F8FAFD] rounded-3xl p-6 sm:p-8 border border-blue-100/80 mb-10 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Overall Big Score & Distribution */}
                <div className="lg:col-span-5 text-center lg:text-left lg:border-r border-gray-200 lg:pr-8">
                  <div className="flex items-baseline justify-center lg:justify-start gap-2">
                    <span className="text-5xl sm:text-6xl font-black text-[#002B49] tracking-tight">4.8</span>
                    <span className="text-lg font-bold text-gray-400">/ 5.0</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400 my-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Based on <strong>210+ Verified Enrolled Community Reviews</strong>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-[#e6f4ea] text-[#137333] text-[11px] font-semibold px-3 py-1 rounded-full mt-3">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Authenticated by CSEEL
                  </div>

                  {/* Star Rating Breakdown Distribution */}
                  <div className="mt-5 space-y-1.5 text-xs text-gray-600">
                    {[
                      { star: '5 Stars', pct: '86%' },
                      { star: '4 Stars', pct: '11%' },
                      { star: '3 Stars', pct: '2%' },
                      { star: '2 Stars', pct: '1%' },
                      { star: '1 Star', pct: '0%' }
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <span className="w-14 font-semibold text-gray-700">{row.star}</span>
                        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: row.pct }} />
                        </div>
                        <span className="w-8 text-right font-bold text-gray-800">{row.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Key Questionnaire Criteria Breakdown */}
                <div className="lg:col-span-7 space-y-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#005689]">
                      Rating Breakdown by Key Questions (5-Point Scale)
                    </h3>
                    <span className="text-[11px] text-gray-500 font-medium">Parent & Student Ratings</span>
                  </div>

                  {[
                    { label: 'Academics & Teaching Quality', score: '4.9', pct: '98%', icon: '📚' },
                    { label: 'Campus, Labs & Infrastructure', score: '4.8', pct: '96%', icon: '🔬' },
                    { label: 'Safety, Discipline & Bus Transport', score: '4.9', pct: '98%', icon: '🛡️' },
                    { label: 'Sports, Extracurriculars & Arts', score: '4.7', pct: '94%', icon: '⚽' },
                    { label: 'Value for Money & Fee Transparency', score: '4.7', pct: '94%', icon: '💰' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className="w-56 text-gray-700 font-semibold truncate flex items-center gap-1.5">
                        <span>{m.icon}</span>
                        <span>{m.label}</span>
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-[#006FCC] rounded-full transition-all duration-500" style={{ width: m.pct }} />
                      </div>
                      <span className="w-9 text-right font-black text-gray-950 flex items-center justify-end gap-0.5">
                        {m.score} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 inline" />
                      </span>
                    </div>
                  ))}

                  {/* Highlight badges */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {[
                      '🏆 96%+ CBSE Board Results',
                      '🔬 Individual Science Practical Benches',
                      '🚌 Safe GPS Buses with Attendants',
                      '🌱 Clean Green Campus',
                      '💡 Experiential NEP 2020 Learning'
                    ].map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="bg-white border border-[#D6EDFF] text-[#005689] text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Inline "Write a Review" Questionnaire Panel */}
            {isWriteReviewOpen && (
              <div
                id="write-review-questionnaire-card"
                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#006FCC]/30 shadow-xl mb-12 relative animate-fade-in"
              >
                <button
                  type="button"
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-1">
                    <span className="w-4 h-1 bg-[#FBBC04] rounded-full inline-block" />
                    <span>AUTHENTIC COMMUNITY FEEDBACK</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#002B49]">
                    Rate & Review {displayName}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-6 leading-relaxed">
                    Your authentic feedback helps other parents and students make the best decision for their education. Please answer the 5-point evaluation questions below:
                  </p>

                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    
                    {/* Role & Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          You are a *
                        </label>
                        <select
                          value={reviewerRole}
                          onChange={(e) => setReviewerRole(e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                        >
                          <option value="Parent">Parent of Student</option>
                          <option value="Student">Current Student</option>
                          <option value="Alumni">Student Alumni</option>
                          <option value="Faculty">Faculty / Teacher</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Sharma"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          Class / Batch
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Class 10th / Batch 2024"
                          value={reviewerClass}
                          onChange={(e) => setReviewerClass(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                        />
                      </div>
                    </div>

                    {/* The 6 5-Point Questionnaire Ratings */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#005689] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Star Rating Questions (Answer on 5-Point Scale)</span>
                      </h4>

                      {[
                        {
                          id: 'overall',
                          q: '1. Overall School Experience & Recommendation',
                          desc: 'Overall experience, discipline and whether you recommend this school to others',
                          value: ratingOverall,
                          setter: setRatingOverall,
                          labels: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent / Highly Recommended']
                        },
                        {
                          id: 'academics',
                          q: '2. Academics & Faculty Teaching Quality',
                          desc: 'Teacher dedication, teaching quality, doubt solving & CBSE/board results',
                          value: ratingAcademics,
                          setter: setRatingAcademics,
                          labels: ['Needs Attention', 'Satisfactory', 'Good', 'Very Good', 'Outstanding & Dedicated']
                        },
                        {
                          id: 'infrastructure',
                          q: '3. Campus Infrastructure, Classrooms & Science Labs',
                          desc: 'Physics, Chemistry, Computer labs, library, smart digital classrooms & campus grounds',
                          value: ratingInfrastructure,
                          setter: setRatingInfrastructure,
                          labels: ['Inadequate', 'Basic', 'Decent', 'Modern & Equipped', 'World-Class & Advanced']
                        },
                        {
                          id: 'safety',
                          q: '4. Student Safety, Discipline & Transport Care',
                          desc: 'CCTV surveillance, student care, female conductors in buses & safe environment',
                          value: ratingSafety,
                          setter: setRatingSafety,
                          labels: ['Safety Concerns', 'Average', 'Safe & Disciplined', 'Very Safe', '100% Secure & Attentive']
                        },
                        {
                          id: 'sports',
                          q: '5. Sports Coaching & Extracurricular Activities',
                          desc: 'Playgrounds, sports coaching, cultural fests, debate, dance & arts',
                          value: ratingSports,
                          setter: setRatingSports,
                          labels: ['Minimal', 'Limited', 'Good Activities', 'Active & Regular', 'Top-Tier Sports Academy']
                        },
                        {
                          id: 'value',
                          q: '6. Fee Justification & Value for Money',
                          desc: 'Is the fee structure justified by the education, practical facilities and care provided?',
                          value: ratingValue,
                          setter: setRatingValue,
                          labels: ['High / Overpriced', 'Expensive', 'Reasonable', 'Good Value', 'Exceptional Value']
                        }
                      ].map((item) => (
                        <div key={item.id} className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 hover:border-blue-200 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-gray-900">{item.q}</p>
                              <p className="text-[11px] text-gray-500">{item.desc}</p>
                            </div>
                            <span className="text-xs font-bold text-[#006FCC] shrink-0">
                              {item.labels[item.value - 1]}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-amber-400 pt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => item.setter(star)}
                                className="p-1 hover:scale-125 transition-transform cursor-pointer"
                              >
                                <Star
                                  className={`w-6 h-6 sm:w-7 sm:h-7 ${
                                    star <= item.value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="ml-2 text-xs font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                              {item.value} / 5 Stars
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Detailed Review Comments */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Your Detailed Review / Feedback *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Share your experience regarding teaching quality, faculty support, student safety, labs, sports facilities, and advice for prospective parents..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC] text-xs sm:text-sm leading-relaxed"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-7 py-3 rounded-[12px] text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all active:scale-95 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Publish Verified Review</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsWriteReviewOpen(false)}
                        className="button_secondary bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-3 rounded-[12px] text-xs sm:text-sm transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

            {/* Filter, Search & Sort Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-200/90 mb-6">
              
              {/* Role Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Reviews' },
                  { id: 'Parent', label: 'Parents' },
                  { id: 'Student', label: 'Students' },
                  { id: 'Alumni', label: 'Alumni' },
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setReviewRoleFilter(role.id as any);
                      setVisibleReviewsCount(4);
                    }}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-[12px] transition-colors shrink-0 cursor-pointer ${
                      reviewRoleFilter === role.id
                        ? 'bg-[#006FCC] text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>

              {/* Star Filter & Search */}
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                <select
                  value={reviewStarFilter}
                  onChange={(e) => {
                    setReviewStarFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value));
                    setVisibleReviewsCount(4);
                  }}
                  className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#006FCC]"
                >
                  <option value="all">All Star Ratings</option>
                  <option value="5">5 Stars only</option>
                  <option value="4">4 Stars only</option>
                  <option value="3">3 Stars only</option>
                </select>

                <select
                  value={reviewSortBy}
                  onChange={(e) => setReviewSortBy(e.target.value as any)}
                  className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#006FCC]"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>

                <div className="relative flex-1 sm:w-48">
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={reviewSearchText}
                    onChange={(e) => {
                      setReviewSearchText(e.target.value);
                      setVisibleReviewsCount(4);
                    }}
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006FCC]"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

            </div>

            {/* Vertical Reviews Feed (No Cards, Vertical Layout with Continuous List) */}
            <div className="space-y-4">
              {filteredReviewsList.slice(0, visibleReviewsCount).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 hover:border-[#006FCC]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Top Author & Rating Strip */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#005689] to-[#006FCC] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-gray-950 text-sm sm:text-base">{rev.author}</h4>
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Verified {rev.role}
                          </span>
                          {rev.studentClass && (
                            <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                              {rev.studentClass}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">{rev.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl">
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-amber-900">{rev.rating}.0 / 5</span>
                    </div>
                  </div>

                  {/* 5-Question Answers Breakdown Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 my-3 p-3 bg-[#F8FAFD] rounded-xl border border-gray-100 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-medium">📚 Academics</span>
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        {rev.metrics?.academics || rev.rating}.0 <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-medium">🔬 Campus & Labs</span>
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        {rev.metrics?.infrastructure || 4.8} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-medium">🛡️ Safety & Care</span>
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        {rev.metrics?.safety || 5.0} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-medium">⚽ Sports & Arts</span>
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        {rev.metrics?.sports || 4.7} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-medium">💰 Value for Fee</span>
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        {rev.metrics?.value || 4.9} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                    "{rev.comment}"
                  </p>

                  {/* Bottom Strip */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        userLikesMap[rev.id]
                          ? 'bg-blue-50 text-[#006FCC] border border-blue-200'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${userLikesMap[rev.id] ? 'fill-[#006FCC]' : ''}`} />
                      <span>Helpful ({rev.likes + (userLikesMap[rev.id] ? 1 : 0)})</span>
                    </button>

                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Authenticated by CSEEL
                    </span>
                  </div>
                </div>
              ))}

              {filteredReviewsList.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-sm text-gray-500 font-medium">No reviews match your selected filter or search.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewRoleFilter('all');
                      setReviewStarFilter('all');
                      setReviewSearchText('');
                    }}
                    className="mt-3 text-xs font-bold text-[#006FCC] hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>

            {/* Load More Reviews Button */}
            {visibleReviewsCount < filteredReviewsList.length ? (
              <div className="text-center pt-8 pb-4">
                <button
                  type="button"
                  onClick={() => setVisibleReviewsCount((c) => c + 4)}
                  className="button_secondary inline-flex items-center gap-2 bg-[#EDF5FA] hover:bg-[#D6EDFF] border border-[#D6EDFF] text-[#006FCC] font-bold text-xs sm:text-sm px-8 py-3.5 rounded-[12px] shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span>Load More Reviews</span>
                  <span className="text-xs bg-[#006FCC]/10 px-2 py-0.5 rounded-full font-bold">
                    Showing {visibleReviewsCount} of {filteredReviewsList.length}
                  </span>
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ) : filteredReviewsList.length > 0 ? (
              <div className="text-center py-8 text-xs text-gray-500 font-medium">
                ✓ You've viewed all {filteredReviewsList.length} verified community reviews
              </div>
            ) : null}

          </div>
        </section>
      )}


      {/* ========================================================= */}
      {/* 10. DIRECT CONTACT DESK & LIVE CAMPUS MAP                 */}
      {/* ========================================================= */}
      {/* ─── TAB 9: CONTACT & MAP ─── */}
      {activeTab === 'contact' && (
        <section id="contact-info" className="py-12 sm:py-16 bg-[#F8FAFC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* AI Template Instruction: Section 9 (Contact & Interactive Map) */}
          <AiSectionInstructionBadge sectionKey="contact" isVisible={isTemplate && showAiGuide} />
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
              <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
              <span>GET IN TOUCH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Contact & Campus Location
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Have questions regarding admissions, academics, or campus visits? Reach out to us directly or drop a message below.
            </p>
          </div>

          {/* Standard 2-Column Professional Contact Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (col-span-12 lg:col-span-6): Contact Information & Send Message Form */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Clean Contact Details Panel (Standard Info List, Not Fragmented Action Cards) */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                    <span>Contact Information</span>
                  </h3>
                  {isLiveTemplate && isEditMode && templateData?.showContactInfo === false && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      <EyeOff className="w-3 h-3" />
                      Hidden in Preview
                    </span>
                  )}
                </div>

                {isLiveTemplate && !isEditMode && templateData?.showContactInfo === false ? (
                  <div className="p-5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900">
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                      <EyeOff className="w-4 h-4 text-amber-600" />
                      <span>Direct Contact Details Set to Private</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      The institution has chosen to keep direct telephone numbers and emails private in public preview. Please submit your inquiry through the message form below to reach the administration.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {/* Address */}
                    <div className="py-3 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Campus Address</div>
                        {isLiveTemplate && isEditMode ? (
                          <EditableText
                            value={templateData?.address || displayAddress}
                            fieldKey="address"
                            className="text-sm font-medium text-gray-900 mt-0.5 leading-relaxed"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900 mt-0.5 leading-relaxed">{displayAddress}</div>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="py-3 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0 mt-0.5">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</div>
                        {isLiveTemplate && isEditMode ? (
                          <EditableText
                            value={templateData?.phone || displayPhone}
                            fieldKey="phone"
                            className="text-sm font-medium text-gray-900 mt-0.5"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900 mt-0.5 flex flex-wrap items-center gap-3">
                            <a href={`tel:${displayPhone}`} className="hover:text-[#006FCC] transition-colors">{displayPhone}</a>
                            <span className="text-gray-300">•</span>
                            <a 
                              href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello, I would like to inquire about admissions for ${displayName}.`)}`}
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs hover:underline"
                            >
                              <MessageSquare className="w-3 h-3" /> WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="py-3 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0 mt-0.5">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Inquiries</div>
                        {isLiveTemplate && isEditMode ? (
                          <EditableText
                            value={templateData?.email || displayEmail}
                            fieldKey="email"
                            className="text-sm font-medium text-gray-900 mt-0.5"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900 mt-0.5">
                            <a href={`mailto:${displayEmail}`} className="text-[#006FCC] hover:underline">{displayEmail}</a>
                          </div>
                        )}
                      </div>
                    </div>

                  {/* Official Website */}
                  <div className="py-3 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0 mt-0.5">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Official Website</div>
                      <div className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-2">
                        <a 
                          href={displayWebsiteUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#006FCC] hover:underline flex items-center gap-1.5 truncate"
                        >
                          <span className="truncate">{displayWebsiteClean}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="py-3 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Office Hours</div>
                      <div className="text-sm font-medium text-gray-900 mt-0.5">
                        Monday – Saturday: 8:00 AM – 3:30 PM (Sunday Closed)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

              {/* Standard Message Form */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/90 shadow-sm">
                <h3 className="text-lg font-bold text-gray-950 mb-1">
                  Send a Message
                </h3>
                <p className="text-xs text-gray-500 mb-5">
                  Fill out the form below and the school office will get back to you within 24 hours.
                </p>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Thank you! Your message has been sent to the school administration.');
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3.5 py-2.5 rounded-[10px] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+91 98765 XXXXX"
                        className="w-full px-3.5 py-2.5 rounded-[10px] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-[10px] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Inquiry Type</label>
                      <select className="w-full px-3.5 py-2.5 rounded-[10px] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent bg-white text-gray-800">
                        <option value="admissions">Admission Inquiry</option>
                        <option value="fees">Fee Structure & Transport</option>
                        <option value="academics">Academic Counseling</option>
                        <option value="general">General Query</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Message *</label>
                    <textarea 
                      required 
                      rows={4}
                      placeholder="Write your message or inquiry here..."
                      className="w-full px-3.5 py-2.5 rounded-[10px] border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="button_primary w-full bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3 px-6 rounded-[12px] text-sm shadow-[0_4px_14px_rgba(0,111,204,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Submit Message</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column (col-span-12 lg:col-span-6): Interactive Live Campus Map */}
            <div className={`lg:col-span-6 transition-all ${isMapFullscreen ? 'fixed inset-4 z-[99999] bg-white rounded-3xl p-6 shadow-2xl flex flex-col' : ''}`}>
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200/90 overflow-hidden relative flex flex-col h-full">
                
                {/* Map Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-950 text-sm sm:text-base leading-tight">{displayName} Campus</h4>
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified GPS
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-xs sm:max-w-md">{displayAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="button_primary inline-flex items-center gap-1.5 bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold px-3.5 py-2 rounded-[10px] shadow-[0_4px_14px_rgba(0,111,204,0.35)] transition-transform active:scale-95 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>

                {/* Map Mode Selector Bar */}
                <div className="flex items-center justify-between gap-2 py-2 px-1">
                  <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setMapMode('osm')}
                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                        mapMode === 'osm'
                          ? 'bg-white text-[#006FCC] shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Campus Map</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapMode('satellite')}
                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                        mapMode === 'satellite'
                          ? 'bg-white text-[#006FCC] shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>Satellite</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapMode('google')}
                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                        mapMode === 'google'
                          ? 'bg-white text-[#006FCC] shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      <span>Google Map</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Recenter Button */}
                    {mapMode !== 'google' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (mapInstanceRef.current) {
                            mapInstanceRef.current.setView([mapLat, mapLng], 15, { animate: true });
                          }
                        }}
                        title="Re-center Campus"
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#EDF5FA] hover:text-[#006FCC] text-gray-600 flex items-center justify-center transition-colors"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Fullscreen Button */}
                    <button
                      type="button"
                      onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                      title={isMapFullscreen ? 'Exit Fullscreen' : 'View Fullscreen Map'}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#EDF5FA] hover:text-[#006FCC] text-gray-600 flex items-center justify-center transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Map Display Container */}
                <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 border border-gray-200 shadow-inner flex-1 min-h-[380px] lg:min-h-[460px]">
                  {mapMode === 'google' ? (
                    <iframe
                      title="Google Maps Verified Campus"
                      src={`https://maps.google.com/maps?q=${mapLat},${mapLng}+(${encodeURIComponent(displayName)})&hl=en&z=15&output=embed`}
                      className="w-full h-full border-0 min-h-[380px] lg:min-h-[460px]"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] lg:min-h-[460px] z-0" />
                      {!mapLoaded && (
                        <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center gap-2">
                          <div className="w-8 h-8 rounded-full border-2 border-[#006FCC] border-t-transparent animate-spin" />
                          <span className="text-xs font-semibold text-gray-500">Loading interactive campus map...</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Floating Campus Badge Preview Overlay */}
                  <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 shadow-lg border border-gray-200/90 max-w-[280px] xs:max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Verified Location</span>
                    </div>
                    <div className="font-bold text-xs text-gray-900 truncate">{displayName}</div>
                    <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                      📍 {mapLat.toFixed(4)}° N, {mapLng.toFixed(4)}° E
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-[#006FCC] hover:underline flex items-center gap-1"
                      >
                        <span>Start Navigation</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Address Copy Strip */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                  <span className="bg-gray-100 px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-700">
                    🅿️ Free Visitor Parking Available
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(displayAddress);
                        setIsAddressCopied(true);
                        setTimeout(() => setIsAddressCopied(false), 2000);
                      }
                    }}
                    className="text-[#006FCC] hover:text-[#005499] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isAddressCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Address Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Full Address</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>
      )}


      {/* ========================================================= */}
      {/* 11. DEEP NAVY MODERN FOOTER                               */}
      {/* ========================================================= */}
      <footer id="contact" className="relative bg-[#071F38] text-white pt-20 pb-10 overflow-hidden">
        
        {/* Curved Top Wave Divider */}
        <div className="absolute top-0 left-0 right-0 h-10 overflow-hidden leading-none pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full text-[#F8FAFC] fill-current">
            <path d="M0,0 C300,90 600,0 900,60 C1050,90 1150,40 1200,0 L1200,0 L0,0 Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-blue-900/50">
            
            {/* Col 1: School Brand & Tagline */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative flex items-center justify-center">
                  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                    <path d="M24 16C20 12 10 12 6 15V36C10 33 20 33 24 37V16Z" fill="#005689" />
                    <path d="M24 16C28 12 38 12 42 15V36C38 33 28 33 24 37V16Z" fill="#006FCC" />
                    <circle cx="24" cy="11" r="4" fill="#FBBC04" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-black font-serif tracking-tight leading-none">
                    {displayName}
                  </div>
                  <div className="text-[10px] font-semibold tracking-wider uppercase text-blue-300 mt-1">
                    Public School
                  </div>
                </div>
              </div>

              <p className="text-xs text-blue-200/80">
                Rooted in Values • Ready for Tomorrow
              </p>

              {/* Social Icons - CSEEL Rectangular Style */}
              <div className="flex items-center gap-2 pt-2">
                {[Facebook, Instagram, Youtube, Linkedin].map((SocialIcon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    aria-label="Social Link"
                    className="w-9 h-9 rounded-[10px] bg-blue-950/80 hover:bg-[#006FCC] hover:text-white flex items-center justify-center text-blue-200 border border-blue-800/50 hover:border-[#006FCC] shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <SocialIcon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs text-blue-200/80">
                <li><button type="button" onClick={() => handleTabSwitch('home')} className="hover:text-white transition-colors text-left cursor-pointer">Home</button></li>
                <li><button type="button" onClick={() => handleTabSwitch('about')} className="hover:text-white transition-colors text-left cursor-pointer">About Us</button></li>
                <li><button type="button" onClick={() => handleTabSwitch('facilities')} className="hover:text-white transition-colors text-left cursor-pointer">Facilities</button></li>
                <li><button type="button" onClick={() => handleTabSwitch('admissions')} className="hover:text-white transition-colors text-left cursor-pointer">Admissions & Fees</button></li>
                <li><button type="button" onClick={() => handleTabSwitch('reviews')} className="hover:text-white transition-colors text-left cursor-pointer">Reviews & Ratings</button></li>
                <li><button type="button" onClick={() => handleTabSwitch('contact')} className="hover:text-white transition-colors text-left cursor-pointer">Contact Us</button></li>
              </ul>
            </div>

            {/* Col 3: Programs */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">Programs</h4>
              <ul className="space-y-2 text-xs text-blue-200/80">
                <li><a href="#" className="hover:text-white transition-colors">Modern Education</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Holistic Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sports & Fitness</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Arts & Culture</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Innovation & Leadership</a></li>
              </ul>
            </div>

            {/* Col 4: Contact Info */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">Contact</h4>
              
              <div className="flex items-start gap-2 text-xs text-blue-200/80">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>{displayAddress}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-blue-200/80">
                <Phone className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                <span>{displayPhone}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-blue-200/80">
                <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                <span className="truncate">{displayEmail}</span>
              </div>
            </div>

            {/* Col 5: Newsletter */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-2">Newsletter</h4>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Stay updated with our latest news, events and activities.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }} className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  className="bg-white text-gray-900 px-3.5 py-2.5 rounded-[12px] text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] flex-1"
                />
                <button
                  type="submit"
                  className="button_primary inline-flex items-center justify-center bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-5 py-2.5 rounded-[12px] text-xs shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-[0_6px_22px_rgba(0,111,204,0.45)] transition-all cursor-pointer shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300/70 gap-4">
            <div>
              © 2026 {displayName}. All Rights Reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>

        </div>
      </footer>


      {/* ========================================================= */}
      {/* 12. INTERACTIVE ADMISSION APPLICATION MODAL               */}
      {/* ========================================================= */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-950">Application Received!</h3>
                <p className="text-sm text-gray-600">
                  Our admissions counselor will contact you at <strong>{applicantPhone}</strong> within 24 hours.
                </p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-1">
                  <span className="w-4 h-1 bg-[#FBBC04] rounded-full inline-block" />
                  <span>ADMISSION DESK 2026-27</span>
                </div>
                <h3 className="text-2xl font-black text-gray-950">Apply for Admission</h3>
                <p className="text-xs text-gray-500 mt-1 mb-6">
                  {displayName} • UDISE: {udiseCode || 'Verified'}
                </p>

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Student / Parent Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Applying for Class
                      </label>
                      <select
                        value={applicantClass}
                        onChange={(e) => setApplicantClass(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      >
                        <option>Nursery / KG</option>
                        <option>Class 1 - 5 (Primary)</option>
                        <option>Class 6 - 8 (Middle)</option>
                        <option>Class 9 - 10 (Secondary)</option>
                        <option>Class 11 - 12 (Senior Sec)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3.5 rounded-[12px] text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all mt-6 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Submit Admission Inquiry</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* 13. WRITE A REVIEW MODAL                                  */}
      {/* ========================================================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {reviewSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-950">Review Published!</h3>
                <p className="text-sm text-gray-600">
                  Thank you for contributing your genuine feedback to help other parents and students.
                </p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-1">
                  <span className="w-4 h-1 bg-[#FBBC04] rounded-full inline-block" />
                  <span>COMMUNITY FEEDBACK</span>
                </div>
                <h3 className="text-2xl font-black text-gray-950">Write a Review</h3>
                <p className="text-xs text-gray-500 mt-1 mb-6">
                  Share your authentic experience with {displayName}
                </p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating Stars Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Overall Rating: {userRating} / 5 Stars
                    </label>
                    <div className="flex items-center gap-2 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${star <= userRating ? 'fill-amber-400' : 'text-gray-200'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Gupta"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        You are a
                      </label>
                      <select
                        value={reviewerRole}
                        onChange={(e) => setReviewerRole(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      >
                        <option>Parent of Student</option>
                        <option>Current Student</option>
                        <option>Student Alumni</option>
                        <option>Faculty / Teacher</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Your Detailed Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your experience about academics, teachers, lab facilities, campus safety, and school culture..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3.5 rounded-[12px] text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all mt-6 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Post Verified Review</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* 14. VIRTUAL CAMPUS TOUR MODAL                             */}
      {/* ========================================================= */}
      {isTourModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsTourModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-gray-950 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-600 fill-current" />
              <span>{displayName} Campus Walkthrough</span>
            </h3>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                title="School Campus Walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* 15. FACILITY DETAIL MODAL (REAL PHOTO & LAB SPECS)        */}
      {/* ========================================================= */}
      {selectedFacility && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setSelectedFacility(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Real Photograph Header or Fallback SVG Illustration */}
            <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
              {!selectedFacility.photo || imageErrors[selectedFacility.id] ? (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center p-4">
                  <selectedFacility.Illustration className="w-full h-full object-contain max-h-56" />
                </div>
              ) : (
                <img
                  src={selectedFacility.photo}
                  alt={selectedFacility.name}
                  onError={() => setImageErrors((prev) => ({ ...prev, [selectedFacility.id]: true }))}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${selectedFacility.color} text-white shadow-md mb-2`}>
                    {selectedFacility.category}
                  </span>
                  <h3 className="text-2xl font-black">{selectedFacility.name}</h3>
                  <p className="text-xs text-blue-200 mt-0.5">{selectedFacility.tagline}</p>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold">
                  👥 {selectedFacility.capacity}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedFacility.details}
              </p>

              {/* Lab Specifications List */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Technical Specifications & Equipment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedFacility.specs?.map((sp: any, sIdx: number) => (
                    <div key={sIdx} className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <div className="text-[10px] font-bold text-gray-400 uppercase">{sp.label}</div>
                      <div className="font-semibold text-gray-900 mt-0.5">{sp.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedFacility(null);
                    setIsApplyModalOpen(true);
                  }}
                  className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold px-6 py-3 rounded-[12px] flex items-center gap-1.5 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Book Lab Tour & Visit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setSelectedFacility(null)}
                  className="text-xs text-gray-500 hover:text-gray-700 font-semibold px-4 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* 16. CSEEL AUTHENTICATION MODAL (GATED REVIEWS)            */}
      {/* ========================================================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Security Brand Header */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[#005689] text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950 leading-tight">CSEEL Verified Community</h3>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% Genuine, Spam-Free Reviews
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-5 leading-relaxed bg-[#EDF5FA] p-3 rounded-xl border border-[#D6EDFF]">
              To maintain authenticity and trust for prospective parents and students, reviews can only be posted by verified CSEEL accounts.
            </p>

            {/* Tabs: Sign In / Create Account */}
            <div className="flex border-b border-gray-200 mb-5">
              <button
                type="button"
                onClick={() => setAuthTab('signin')}
                className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
                  authTab === 'signin'
                    ? 'border-[#006FCC] text-[#006FCC]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
                  authTab === 'signup'
                    ? 'border-[#006FCC] text-[#006FCC]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Create CSEEL Account
              </button>
            </div>

            {/* Google One-Click SSO */}
            <button
              type="button"
              onClick={() => {
                setIsLoggedIn(true);
                setLoggedInUser({
                  name: 'Sunita Sharma',
                  email: 'sunita.sharma@gmail.com',
                  role: 'Verified Parent'
                });
                setReviewerName('Sunita Sharma');
                setReviewerRole('Parent');
                setIsAuthModalOpen(false);
                setIsReviewModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-[12px] text-xs font-bold text-gray-700 hover:bg-[#EDF5FA] shadow-sm transition-all active:scale-[0.99] mb-4 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-3 text-[11px] text-gray-400 font-medium uppercase">Or with mobile / email</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsLoggedIn(true);
                setLoggedInUser({
                  name: authName || 'CSEEL Community Member',
                  email: authEmailOrPhone,
                  role: `Verified ${authRole}`
                });
                setReviewerName(authName || 'Community Member');
                setReviewerRole(authRole);
                setIsAuthModalOpen(false);
                setIsReviewModalOpen(true);
              }}
              className="space-y-3.5"
            >
              {authTab === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Email or Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210 or email@domain.com"
                  value={authEmailOrPhone}
                  onChange={(e) => setAuthEmailOrPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                />
              </div>

              {authTab === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Your Relationship with {displayName}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Parent', 'Student', 'Alumni'] as const).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setAuthRole(r)}
                        className={`py-2 px-2 text-[11px] font-bold rounded-[12px] border text-center transition-colors cursor-pointer ${
                          authRole === r
                            ? 'border-[#006FCC] bg-[#EDF5FA] text-[#006FCC]'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3 rounded-[12px] text-xs flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{authTab === 'signin' ? 'Sign In & Write Review' : 'Create Account & Write Review'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Add/Edit Card Modals for Facilities and Admissions */}
      {isLiveTemplate && (
        <>
          <AddCardModal
            isOpen={isAddFacilityModalOpen}
            onClose={() => {
              setIsAddFacilityModalOpen(false);
              setEditingFacility(null);
            }}
            cardType="facility"
            initialData={editingFacility ? {
              title: editingFacility.title || editingFacility.name || '',
              desc: editingFacility.desc || '',
              icon: editingFacility.icon || 'FlaskConical',
              illustration: editingFacility.illustration,
              badge: editingFacility.badge || editingFacility.category
            } : undefined}
            onSave={(card) => {
              const facilityPayload = {
                title: card.title,
                desc: card.desc || card.criteria || 'Standard school facility',
                icon: card.icon,
                illustration: card.illustration,
                badge: card.badge
              };
              if (editingFacility) {
                templateCtx?.updateFacilityCard(editingFacility.id, facilityPayload);
              } else {
                templateCtx?.addFacilityCard(facilityPayload);
              }
            }}
          />
          <AddCardModal
            isOpen={isAddAdmissionModalOpen}
            onClose={() => {
              setIsAddAdmissionModalOpen(false);
              setEditingAdmission(null);
            }}
            cardType="admission"
            initialData={editingAdmission ? {
              title: editingAdmission.title || '',
              criteria: editingAdmission.criteria || editingAdmission.desc || '',
              fees: editingAdmission.fees,
              icon: editingAdmission.icon || 'GraduationCap',
              illustration: editingAdmission.illustration,
              badge: editingAdmission.badge
            } : undefined}
            onSave={(card) => {
              const admissionPayload = {
                title: card.title,
                criteria: card.criteria || card.desc || 'Standard admission criteria',
                fees: card.fees,
                icon: card.icon,
                illustration: card.illustration,
                badge: card.badge
              };
              if (editingAdmission) {
                templateCtx?.updateAdmissionCard(editingAdmission.id, admissionPayload);
              } else {
                templateCtx?.addAdmissionCard(admissionPayload);
              }
            }}
          />
        </>
      )}

    </div>
  );
}
