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
  Maximize2
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
}: SchoolProfileViewProps) {
  // Modal states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReviewsAnalysisModalOpen, setIsReviewsAnalysisModalOpen] = useState(false);
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

  // Review analysis modal filter states
  const [modalRoleFilter, setModalRoleFilter] = useState<'all' | 'Parent' | 'Student' | 'Alumni'>('all');
  const [modalStarFilter, setModalStarFilter] = useState<number | 'all'>('all');
  const [modalSearchText, setModalSearchText] = useState('');
  const [modalVisibleCount, setModalVisibleCount] = useState(4);
  // Image fallback state dictionary: maps image keys to boolean
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Map interactive states
  const [mapMode, setMapMode] = useState<'osm' | 'satellite' | 'google'>('osm');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isAddressCopied, setIsAddressCopied] = useState(false);
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

  // Open review modal directly
  const handleInitiateWriteReview = () => {
    setIsReviewModalOpen(true);
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
      role: 'Verified Parent • Class 8 Student',
      date: '2 weeks ago',
      rating: 5,
      likes: 34,
      comment:
        'The hands-on practical science labs and faculty dedication are truly commendable. My daughter enjoys the robotics and debate clubs. Transparency in communication and fees gives complete peace of mind.',
      metrics: { academics: '5.0', sports: '4.8', safety: '5.0' }
    },
    {
      id: 2,
      author: 'Rajesh Kulkarni',
      role: 'Verified Parent • Class 10 Student',
      date: '1 month ago',
      rating: 5,
      likes: 27,
      comment:
        'Outstanding academic discipline combined with NEP 2020 experiential learning. The teachers give individual attention to each child. Clean campus and safe GPS-tracked school buses.',
      metrics: { academics: '4.9', sports: '4.7', safety: '4.9' }
    },
    {
      id: 3,
      author: 'Aman Preet Singh',
      role: 'Student Alumni • Batch 2024 (96.4% in CBSE)',
      date: '2 months ago',
      rating: 5,
      likes: 42,
      comment:
        'Studied here from Class 6 to 12. The Atal Tinkering Lab and library resources built my foundation for cracking competitive exams. Blessed to have such supportive mentors.',
      metrics: { academics: '5.0', sports: '4.9', safety: '4.9' }
    },
    {
      id: 4,
      author: 'Pooja Hegde',
      role: 'Verified Parent • Class 2 Student',
      date: '3 months ago',
      rating: 4,
      likes: 19,
      comment:
        'The primary wing teachers are so warm and nurturing! Activity-based foundational learning makes my son love going to school every morning without tears.',
      metrics: { academics: '4.8', sports: '4.6', safety: '5.0' }
    },
    {
      id: 5,
      author: 'Col. Arvind Mehra',
      role: 'Verified Parent • Class 9 Student',
      date: '3 months ago',
      rating: 5,
      likes: 31,
      comment:
        'Discipline, physical fitness and mental agility are prioritized equally. The football coach and sports academy here have trained my son for district championships. CCTV security and campus entry protocols are top-notch.',
      metrics: { academics: '4.8', sports: '5.0', safety: '5.0' }
    },
    {
      id: 6,
      author: 'Dr. Neha Kapoor',
      role: 'Verified Parent • Class 6 & 11 Students',
      date: '4 months ago',
      rating: 5,
      likes: 24,
      comment:
        'Having two children in different wings gives me a full perspective. The science lab practicals for class 11 physics and chemistry are genuinely collegiate grade. Fee receipts and communication on the parent portal are 100% transparent.',
      metrics: { academics: '5.0', sports: '4.7', safety: '4.9' }
    },
    {
      id: 7,
      author: 'Rohan Deshmukh',
      role: 'Student Alumni • Batch 2023 (IIT Kharagpur)',
      date: '5 months ago',
      rating: 5,
      likes: 56,
      comment:
        'The teachers in senior school never hesitated to spend extra hours clearing doubts. The robotics lab and coding bootcamps sparked my passion for computer science. Highly recommend this school to any aspiring engineer.',
      metrics: { academics: '5.0', sports: '4.8', safety: '4.8' }
    },
    {
      id: 8,
      author: 'Meenakshi Sundaram',
      role: 'Verified Parent • Class 4 Student',
      date: '6 months ago',
      rating: 4,
      likes: 18,
      comment:
        'Very happy with the school bus facility and safety tracking. The female attendants on buses are courteous. Music and art classes have brought out wonderful creativity in my daughter.',
      metrics: { academics: '4.7', sports: '4.6', safety: '5.0' }
    }
  ]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantClass, setApplicantClass] = useState('Nursery');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Display texts matching the exact reference design
  const displayName = (!schoolName || /^\d+$/.test(schoolName.trim()))
    ? 'BrightFuture Public School'
    : schoolName;
  const displayEstablished = establishedYear || '1975';
  const displayStudents = totalStudents > 0 ? `${totalStudents.toLocaleString()}+` : '2,500+';
  const displayTeachers = totalTeachers > 0 ? `${totalTeachers}+` : '120+';
  const displayYears = establishedYear && !isNaN(parseInt(establishedYear))
    ? `${Math.max(10, 2026 - parseInt(establishedYear))}+`
    : '50+';
  const displayPrincipal = principalName || 'Dr. Meera Sharma';
  const displayAddress = rawAddress || '123 Green Valley Road, Bangalore - 560001';
  const displayPhone = rawPhone || '+91 98765 43210';
  const displayEmail = rawEmail || 'info@brightfuture.edu.in';

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Official Institutional & Govt Accreditation Details
  const displayUdise = udiseCode || '06070123456';
  const displayBoard = board || 'CBSE (Central Board of Secondary Education)';
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

  const displayClasses = (classFrom && classTo) ? `Class ${classFrom} to Class ${classTo}` : 'Nursery to Class 12';
  
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
  }, [mapLoaded, mapMode, mapLat, mapLng, displayName, displayAddress]);

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
    if (!reviewerName || !reviewComment) return;
    const newRev = {
      id: Date.now(),
      author: reviewerName,
      role: `${reviewerRole} • Verified Contributor`,
      date: 'Just now',
      rating: userRating,
      likes: 1,
      comment: reviewComment,
      metrics: { academics: `${userRating}.0`, sports: '4.8', safety: '5.0' }
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setIsReviewModalOpen(false);
      setReviewerName('');
      setReviewComment('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 1. TOP NAVBAR / HEADER                                    */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          
          {/* School Brand / Logo */}
          <Link href="#home" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
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
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-2xl font-black tracking-tight text-gray-950 font-serif leading-tight truncate max-w-[195px] xs:max-w-[260px] sm:max-w-none">
                {displayName}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-500 truncate max-w-[195px] xs:max-w-[260px] sm:max-w-none">
                Public School • {district || 'Campus'}
              </span>
            </div>
          </Link>

          {/* Centered Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-600">
            <Link href="#home" className="text-gray-900 border-b-2 border-[#FBBC04] pb-0.5">Home</Link>
            <Link href="#credentials" className="hover:text-[#006FCC] transition-colors">School Details</Link>
            <Link href="#about" className="hover:text-[#006FCC] transition-colors">About</Link>
            <Link href="#principles" className="hover:text-[#006FCC] transition-colors">Vision & Mission</Link>
            <Link href="#facilities" className="hover:text-[#006FCC] transition-colors">Facilities</Link>
            <Link href="#admissions" className="hover:text-[#006FCC] transition-colors">Admissions</Link>
            <Link href="#fees" className="hover:text-[#006FCC] transition-colors">Fee Structure</Link>
            <button
              type="button"
              onClick={() => setIsReviewsAnalysisModalOpen(true)}
              className="hover:text-[#006FCC] transition-colors text-left font-semibold text-gray-600 cursor-pointer"
            >
              Reviews & Ratings
            </button>
            <Link href="#contact-info" className="hover:text-[#006FCC] transition-colors">Contact</Link>
          </nav>

          {/* Right Action Icons & Apply Button */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Search Button */}
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-[#F1F3F4] flex items-center justify-center text-gray-600 hover:text-gray-950 transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                  <input
                    type="text"
                    placeholder="Search admissions, fees, labs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Apply Now Yellow Pill Button */}
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="button_primary inline-flex items-center gap-1.5 sm:gap-2 bg-[#FBBC04] hover:bg-[#F2A900] text-gray-950 font-bold px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-[12px] text-xs sm:text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-950 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>


      {/* ========================================================= */}
      {/* 2. HERO SECTION (5 AUTO-ROTATING REAL CAMPUS PHOTOS)       */}
      {/* ========================================================= */}
      <section id="home" className="relative min-h-[580px] sm:min-h-[620px] lg:h-[calc(100vh-72px)] lg:min-h-[640px] lg:max-h-[760px] flex items-center overflow-hidden bg-slate-900 pt-6 pb-20 sm:pb-24">
        
        {/* 5 Rotating Background Photos with Smooth 1s Crossfade */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroSlides.map((slide, sIdx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                sIdx === activeHeroSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{ transitionProperty: 'opacity, transform' }}
            >
              {!slide.image || imageErrors[slide.id] ? (
                <div className="w-full h-full flex items-center justify-center bg-blue-50/70 p-6">
                  <SchoolCampusIllustration className="w-full h-full max-w-xl max-h-[460px] opacity-90" />
                </div>
              ) : (
                <img
                  src={slide.image}
                  alt={`${displayName} - ${slide.tag}`}
                  onError={() => setImageErrors((prev) => ({ ...prev, [slide.id]: true }))}
                  className="w-full h-full object-cover object-center"
                />
              )}
            </div>
          ))}

          {/* Directional Gradient: White backing on left for text legibility, transparent on right to show background photo */}
          {/* Desktop: Smooth left-to-right fade, leaving right 55%+ completely open */}
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 via-45% md:via-40% to-transparent z-10 pointer-events-none" />
          
          {/* Mobile: Left-to-right soft fade covering text zone while leaving right side of campus photo completely visible */}
          <div className="sm:hidden absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 via-65% to-transparent z-10 pointer-events-none" />
          <div className="sm:hidden absolute inset-0 bg-gradient-to-b from-white/50 via-transparent via-30% to-transparent z-10 pointer-events-none" />
          
          {/* Subtle Bottom Transition Blend */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent z-10 pointer-events-none" />
        </div>

        {/* Paper Airplanes & Curved Dashed Trails Overlay (Desktop only to prevent line clutter over mobile text) */}
        <div className="hidden sm:block absolute inset-0 z-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 120 200 Q 300 70 500 120 T 780 60"
              fill="none"
              stroke="#006FCC"
              strokeWidth="2.5"
              strokeDasharray="6 7"
              strokeOpacity="0.35"
            />
            <path
              d="M 500 360 Q 700 440 900 380 T 1180 280"
              fill="none"
              stroke="#006FCC"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeOpacity="0.25"
            />
          </svg>

          {/* Paper airplane doodle */}
          <div className="absolute top-16 left-[45%] text-[#006FCC] rotate-12 opacity-60 hidden md:block">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </div>
        </div>

        {/* Top Badges Bar - Stacked vertically (not in one row as requested) */}
        <div className="absolute top-3.5 sm:top-5 left-4 sm:left-6 lg:left-8 z-30 flex flex-col items-start gap-1.5 sm:gap-2">
          {/* Slide Category Badge */}
          <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200/80 shadow-2xs text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#005689]">
            <span className="w-4 sm:w-5 h-1 bg-[#FBBC04] rounded-full inline-block" />
            <span>{heroSlides[activeHeroSlide].badge}</span>
          </div>

          {/* Admissions Open Pill */}
          <div 
            onClick={() => setIsApplyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBC04] hover:bg-[#F2A900] text-gray-950 font-extrabold text-[11px] sm:text-xs tracking-wide shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>ADMISSIONS OPEN</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Content Area - Clean left alignment, spaced below the stacked top badges */}
            <div className="lg:col-span-7 xl:col-span-6 max-w-lg lg:max-w-xl py-2 sm:py-4 pt-16 sm:pt-18">
              <div className="space-y-3.5 sm:space-y-4 md:space-y-5 text-left">
                

                {/* Headline - Clean left alignment, responsive, wraps naturally */}
                <div className="min-w-0">
                  <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-950 leading-[1.2] break-words text-left">
                    {heroSlides[activeHeroSlide].heading} <br className="hidden sm:inline" />
                    <span className="text-[#005689]">{heroSlides[activeHeroSlide].highlight}</span>
                  </h1>
                </div>

                {/* Subtitle - Clean left alignment, natural wrap */}
                <div className="min-w-0 max-w-md sm:max-w-xl">
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium leading-relaxed break-words text-left">
                    {heroSlides[activeHeroSlide].desc}
                  </p>
                </div>

                {/* CTA Buttons - Side by Side on left, compact width */}
                <div className="flex flex-row items-center justify-start gap-2.5 sm:gap-3.5 pt-1">
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="button_primary inline-flex items-center justify-center gap-1.5 bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm shadow-btn hover:shadow-btn-hi hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0"
                  >
                    <span>Explore School</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => setIsTourModalOpen(true)}
                    className="button_secondary inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white/90 hover:bg-[#D6EDFF] border border-[#D6EDFF] text-[#006FCC] font-bold px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#E8F0FE] text-[#006FCC] flex items-center justify-center shadow-xs shrink-0">
                      <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                    </span>
                    <span>Campus Tour</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Right Area - Open and Unobstructed showcasing the Campus Photo! */}
            <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 flex-col justify-between items-end min-h-[380px] py-4 pointer-events-none">
              
              {/* Desktop Admissions Open Badge (Floating Top Right over image) */}
              <div 
                onClick={() => setIsApplyModalOpen(true)}
                className="pointer-events-auto cursor-pointer w-28 h-28 rounded-full bg-[#FBBC04] hover:bg-[#F2A900] text-gray-950 flex flex-col items-center justify-center text-center p-2 shadow-2xl border-4 border-white rotate-6 hover:rotate-12 hover:scale-105 transition-all"
              >
                <span className="text-[10px] font-black tracking-widest uppercase">ADMISSIONS</span>
                <span className="text-2xl font-black leading-tight">OPEN</span>
                <span className="text-[11px] font-bold text-gray-900">2026-27</span>
              </div>

              {/* Floating Photo Feature Tag in Bottom Right of image */}
              <div className="pointer-events-auto bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                <span>Campus Showcase: <strong className="text-[#FBBC04] font-bold">{heroSlides[activeHeroSlide].tag}</strong></span>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom Stats Ribbon - Centered horizontally in the mid of the screen (left-1/2 -translate-x-1/2) */}
        <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center justify-center">
          <div className="flex items-center justify-center gap-7 sm:gap-10 bg-transparent">
            
            {/* Stat 1: Students */}
            <div className="flex flex-col items-center text-center gap-1.5 min-w-[60px] sm:min-w-[70px]">
              <div className="w-8 h-8 rounded-full bg-[#E8F0FE] text-[#006FCC] flex items-center justify-center shadow-xs shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-black text-gray-950 leading-tight">
                  {displayStudents}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-700 font-semibold mt-0.5">
                  Students
                </div>
              </div>
            </div>

            {/* Stat 2: Faculty */}
            <div className="flex flex-col items-center text-center gap-1.5 min-w-[60px] sm:min-w-[70px]">
              <div className="w-8 h-8 rounded-full bg-[#E8F0FE] text-[#006FCC] flex items-center justify-center shadow-xs shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-black text-gray-950 leading-tight">
                  {displayTeachers}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-700 font-semibold mt-0.5">
                  Faculty
                </div>
              </div>
            </div>

            {/* Stat 3: Years */}
            <div className="flex flex-col items-center text-center gap-1.5 min-w-[60px] sm:min-w-[70px]">
              <div className="w-8 h-8 rounded-full bg-[#E8F0FE] text-[#006FCC] flex items-center justify-center shadow-xs shrink-0">
                <Star className="w-4 h-4" />
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-black text-gray-950 leading-tight">
                  {displayYears}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-700 font-semibold mt-0.5">
                  Years
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Centered Bottom Photo Indicators (Swap Image Circles) */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-xl">
          <button
            type="button"
            aria-label="Previous campus photo"
            onClick={() => setActiveHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {heroSlides.map((slide, sIdx) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show campus photo ${sIdx + 1}: ${slide.tag}`}
              onClick={() => setActiveHeroSlide(sIdx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                sIdx === activeHeroSlide
                  ? 'w-7 h-2 bg-[#006FCC] shadow-sm'
                  : 'w-2 h-2 bg-white/60 hover:bg-white'
              }`}
            />
          ))}

          <button
            type="button"
            aria-label="Next campus photo"
            onClick={() => setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length)}
            className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Wavy bottom transition curve into white section */}
        <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-12 overflow-hidden leading-none pointer-events-none z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
            <path d="M0,0 C150,90 400,120 600,60 C800,0 1050,90 1200,30 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

      </section>


      {/* ========================================================= */}
      {/* 2.5 OFFICIAL INSTITUTIONAL PROFILE & CREDENTIALS SECTION  */}
      {/* ========================================================= */}
      <section id="credentials" className="py-8 sm:py-10 bg-gradient-to-b from-[#EDF5FA]/80 via-white to-white relative border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Row - Compact */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#005689] mb-1">
                <span className="w-5 h-1 bg-[#FBBC04] rounded-full inline-block" />
                <span>OFFICIAL VERIFIED CREDENTIALS</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-950 tracking-tight">
                School Profile & <span className="text-[#005689]">Accreditations</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>{displayManagementType}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>{displayGenderTag}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>UDISE+ Verified</span>
              </span>
            </div>
          </div>

          {/* 4 Sleek Compact Credential Cards - Horizontal Scroll on Mobile, 4-Col Grid on Desktop */}
          <div
            ref={credentialsScrollRef}
            onScroll={(e) => handleContainerScroll(e, setCredentialsActiveIndex)}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            
            {/* CARD 1: School Authority (Private vs Govt & UDISE) */}
            <div className="w-[82vw] max-w-[310px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink bg-white rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md border border-gray-200/90 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isGovt ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                  }`}>
                    {displayManagementType}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500">
                    Est. {displayEstablished}
                  </span>
                </div>

                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Ownership & Management
                </div>
                <div className="text-base font-bold text-gray-950 mt-0.5 leading-snug line-clamp-1" title={displayManagementLabel}>
                  {displayManagementLabel}
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">UDISE+ Code:</span>
                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">{displayUdise}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium text-gray-800">{ruralUrban || 'Urban Campus'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium text-gray-800 truncate max-w-[130px]">{village || district}, {state}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleCopy(displayUdise, 'udise')}
                  className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    copiedKey === 'udise'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200'
                  }`}
                >
                  {copiedKey === 'udise' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Copied UDISE Code!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>Copy UDISE Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* CARD 2: Campus Format & Student Gender (Day/Boarding & Co-Ed/Girls/Boys) */}
            <div className="w-[82vw] max-w-[310px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink bg-white rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md border border-gray-200/90 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                    {displayGenderFormat}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700">
                    {displayBoardingType}
                  </span>
                </div>

                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Format & Student Type
                </div>
                <div className="text-base font-bold text-gray-950 mt-0.5 leading-snug">
                  {displayGenderTag}
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Boarding:</span>
                    <span className="font-semibold text-emerald-700">{displayBoardingType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Classes:</span>
                    <span className="font-medium text-gray-800">{displayClasses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Hostel/Day:</span>
                    <span className="font-medium text-gray-800 truncate max-w-[130px]">{displayBoardingSub}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-2 border-t border-gray-100">
                <div className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>NEP 2020 Aligned Structure</span>
                </div>
              </div>
            </div>

            {/* CARD 3: Academic Board(s) & Affiliation (Multiple Boards Supported) */}
            <div className="w-[82vw] max-w-[310px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink bg-white rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md border border-gray-200/90 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                    {boardsList.length > 1 ? `${boardsList.length} Boards` : 'Affiliation'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-800">
                    Code: {displaySchoolCode}
                  </span>
                </div>

                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Affiliated Board(s)
                </div>
                
                {/* Multiple Board Chips */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {boardsList.map((bName, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-950 border border-amber-200"
                    >
                      {bName}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Affiliation No:</span>
                    <span className="font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 truncate max-w-[130px]">
                      {displayAffiliationNo}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Level:</span>
                    <span className="font-medium text-gray-800">Senior Secondary (1-12)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Validity:</span>
                    <span className="font-semibold text-emerald-700">Permanent / Regular</span>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleCopy(displayAffiliationNo, 'aff')}
                  className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    copiedKey === 'aff'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-900 border border-gray-200'
                  }`}
                >
                  {copiedKey === 'aff' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Copied Affiliation!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>Copy Affiliation No.</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* CARD 4: Medium of Instruction & Official Channels (Multiple Mediums Supported) */}
            <div className="w-[82vw] max-w-[310px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink bg-white rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md border border-gray-200/90 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md">
                    {mediumsList.length > 1 ? `${mediumsList.length} Mediums` : 'Medium'}
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-700">
                    Verified
                  </span>
                </div>

                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Instruction Medium & Desk
                </div>

                {/* Multiple Medium Chips */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {mediumsList.map((mName, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-950 border border-indigo-200"
                    >
                      {mName}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Website:</span>
                    <a
                      href={displayWebsiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-indigo-700 hover:underline truncate max-w-[130px] flex items-center gap-0.5"
                    >
                      <span>{displayWebsiteClean}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Official Mail:</span>
                    <a
                      href={`mailto:${displayAdminEmail}`}
                      className="font-medium text-gray-800 hover:text-blue-600 truncate max-w-[130px]"
                    >
                      {displayAdminEmail}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Admissions:</span>
                    <a
                      href={`mailto:${displayAdmissionsEmail}`}
                      className="font-medium text-indigo-600 hover:underline truncate max-w-[130px]"
                    >
                      {displayAdmissionsEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-2 border-t border-gray-100 flex items-center gap-1.5">
                <a
                  href={displayWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button_primary flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold bg-[#006FCC] hover:bg-[#005499] text-white flex items-center justify-center gap-1 shadow-btn hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  title="Copy Official Website URL"
                  onClick={() => handleCopy(displayWebsiteUrl, 'web')}
                  className="p-1.5 rounded-xl bg-gray-50 hover:bg-[#EDF5FA] border border-[#DADCE0] text-gray-600 transition-colors"
                >
                  {copiedKey === 'web' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>

          {/* Indicator Dots for Mobile View */}
          {renderScrollDots(4, credentialsActiveIndex, credentialsScrollRef, 'sm:hidden')}

          {/* Compact Institutional Summary Bar - Fully Responsive with Zero Overflow */}
          <div className="mt-4 bg-[#EDF5FA] border border-[#D6EDFF] rounded-xl p-3 sm:px-4 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs overflow-hidden">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-gray-700 min-w-0">
              <span className="font-bold text-gray-950 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#006FCC] shrink-0" />
                <span>{displayName}</span>
              </span>
              <span className="text-gray-300">•</span>
              <span>Type: <strong className="text-gray-900">{displayManagementType}</strong></span>
              <span className="text-gray-300">•</span>
              <span>Campus: <strong className="text-gray-900">{displayBoardingType} ({displayGenderFormat})</strong></span>
              <span className="text-gray-300">•</span>
              <span>UDISE: <strong className="font-mono text-gray-900">{displayUdise}</strong></span>
              <span className="text-gray-300">•</span>
              <span>Board(s): <strong className="text-amber-900">{boardsList.join(', ')}</strong></span>
              <span className="text-gray-300">•</span>
              <span>Medium(s): <strong className="text-indigo-900">{mediumsList.join(', ')}</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-semibold text-xs border-t md:border-t-0 pt-2 md:pt-0 border-[#D6EDFF]/80 min-w-0">
              <a
                href={`mailto:${displayAdminEmail}`}
                className="text-[#005689] hover:text-[#003C6E] flex items-center gap-1 hover:underline truncate max-w-[200px] sm:max-w-none"
                title={displayAdminEmail}
              >
                <Mail className="w-3.5 h-3.5 text-[#006FCC] shrink-0" />
                <span className="truncate">{displayAdminEmail}</span>
              </a>
              <span className="text-gray-300 hidden xs:inline">|</span>
              <a
                href={displayWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#006FCC] hover:text-[#005499] flex items-center gap-1 hover:underline truncate max-w-[200px] sm:max-w-none"
                title={displayWebsiteClean}
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{displayWebsiteClean}</span>
              </a>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 3. ABOUT OUR SCHOOL SECTION                               */}
      {/* ========================================================= */}
      <section id="about" className="py-12 sm:py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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
                  className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-btn hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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

          {/* 4 Stat Cards in 1 Single Line (4 Columns, Compact Size - Image 1) */}
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
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="text-left max-w-2xl">
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

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scrollHorizontally(principlesScrollRef, 'left')}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scrollHorizontally(principlesScrollRef, 'right')}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={principlesScrollRef}
            onScroll={(e) => handleContainerScroll(e, setPrinciplesActiveIndex)}
            className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            
            {/* Card 1: Vision (Telescope / Looking into Future) */}
            <div className="w-[300px] sm:w-[350px] md:w-[380px] shrink-0 snap-start bg-gradient-to-b from-blue-50/50 via-white to-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
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
            <div className="w-[300px] sm:w-[350px] md:w-[380px] shrink-0 snap-start bg-gradient-to-b from-sky-50/50 via-white to-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
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
            <div className="w-[300px] sm:w-[350px] md:w-[380px] shrink-0 snap-start bg-gradient-to-b from-amber-50/40 via-white to-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
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

          {/* Dynamic Scroll Dots for Guiding Principles */}
          {renderScrollDots(3, principlesActiveIndex, principlesScrollRef)}

        </div>
      </section>


      {/* ========================================================= */}
      {/* 6. OUR FACILITIES SECTION (10-GRID)                       */}
      {/* ========================================================= */}
      <section id="facilities" className="pt-10 sm:pt-16 pb-6 sm:pb-8 bg-[#F8FAFC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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
              <button
                onClick={() => setSelectedFacility(facilities[0])}
                className="button_secondary inline-flex items-center gap-2 bg-[#EDF5FA] hover:bg-[#D6EDFF] border border-[#D6EDFF] text-[#006FCC] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xs"
              >
                <span>All Details</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Scroll facilities left"
                  onClick={() => scrollHorizontally(facilitiesScrollRef, 'left')}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll facilities right"
                  onClick={() => scrollHorizontally(facilitiesScrollRef, 'right')}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontally Scrollable 10-Facility Cards with Real Photos & 3D Hover Flip */}
          <div
            ref={facilitiesScrollRef}
            onScroll={(e) => handleContainerScroll(e, setFacilitiesActiveIndex)}
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-8 pt-3 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {facilities.map((facility) => {
              const IconComponent = facility.icon;
              return (
                <div
                  key={facility.id}
                  className="w-[290px] sm:w-[320px] md:w-[340px] h-[410px] shrink-0 snap-start [perspective:1200px] group cursor-pointer"
                >
                  <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] rounded-3xl shadow-sm hover:shadow-2xl">
                    
                    {/* ================= FRONT FACE: REAL PHOTOGRAPH ================= */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl overflow-hidden bg-white border border-gray-200/90 flex flex-col justify-between shadow-sm">
                      
                      {/* Real Facility Photograph or Fallback SVG Illustration */}
                      <div className="relative h-[210px] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                        {!facility.photo || imageErrors[facility.id] ? (
                          <div className="w-full h-full bg-slate-50 flex items-center justify-center p-3">
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
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${facility.color} text-white shadow-md backdrop-blur-sm`}>
                            <IconComponent className="w-3.5 h-3.5" />
                            <span>{facility.category}</span>
                          </span>
                        </div>

                        {/* Capacity and Verification Tag */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium pointer-events-none">
                          <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                            👥 {facility.capacity}
                          </span>
                          <span className="bg-emerald-500/90 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            {!facility.photo || imageErrors[facility.id] ? 'Campus Facility' : 'Real Lab Photo'}
                          </span>
                        </div>
                      </div>

                      {/* Front Card Narrative */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-bold text-gray-950 text-base sm:text-lg group-hover:text-[#006FCC] transition-colors">
                            {facility.name}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
                            {facility.tagline}
                          </p>
                          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                            {facility.desc}
                          </p>
                        </div>

                        {/* Interactive 3D Flip Hint Bar */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#006FCC] flex items-center gap-1.5">
                            <span>Hover card to flip specs</span>
                            <span className="text-sm font-black">↷</span>
                          </span>
                          <div className="w-7 h-7 rounded-full bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center group-hover:bg-[#006FCC] group-hover:text-white transition-colors">
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* ================= BACK FACE: 3D LAB SPECIFICATIONS ================= */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl overflow-hidden bg-gradient-to-br from-[#071F38] via-[#0B2A4A] to-[#005689] text-white p-4 sm:p-5 flex flex-col justify-between border-2 border-blue-400/40 shadow-2xl">
                      <div>
                        {/* Header with Lab Name & Icon */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-white/15">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 shrink-0">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm sm:text-base leading-tight">
                                {facility.name}
                              </h4>
                              <span className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">
                                {facility.category}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                            Key Details
                          </span>
                        </div>

                        {/* Concise Small Summary Paragraph */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 my-2.5 border border-white/10">
                          <p className="text-[11px] text-blue-50 leading-relaxed line-clamp-2">
                            {facility.details}
                          </p>
                        </div>

                        {/* Numbered Highlight Lines with Icons */}
                        <div className="space-y-1.5">
                          {facility.specs.map((sp: any, sIdx: number) => (
                            <div
                              key={sIdx}
                              className="bg-black/20 hover:bg-black/30 backdrop-blur-xs rounded-xl px-2.5 py-1.5 border border-white/10 flex items-center gap-2 transition-colors"
                            >
                              {/* Small Number Badge with Check Icon */}
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="w-4 h-4 rounded-full bg-[#FBBC04] text-gray-950 font-black text-[9px] flex items-center justify-center shadow-xs">
                                  {sIdx + 1}
                                </span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              </div>

                              <div className="min-w-0 flex-1 flex items-baseline gap-1.5 truncate">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 shrink-0">
                                  {sp.label}:
                                </span>
                                <span className="font-medium text-white text-[11px] truncate">
                                  {sp.val}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Back Footer with Timings and Full View CTA */}
                      <div className="pt-2.5 border-t border-white/15 flex items-center justify-between gap-2 mt-2">
                        <div className="text-[10px] text-blue-100 truncate">
                          <span className="font-bold text-white">🕒 Timings:</span> {facility.timings}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFacility(facility);
                          }}
                          className="bg-[#FBBC04] hover:bg-[#F2A900] text-gray-950 font-bold px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95 shrink-0"
                        >
                          <span>Full Detail</span>
                          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Scroll Dots for 10 Facility Cards */}
          {renderScrollDots(facilities.length, facilitiesActiveIndex, facilitiesScrollRef)}

        </div>
      </section>


      {/* ========================================================= */}
      {/* 7. ADMISSIONS 2026-27 (CLEAR STEP-BY-STEP ROADMAP)         */}
      {/* ========================================================= */}
      <section id="admissions" className="pt-6 sm:pt-10 pb-12 sm:pb-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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
                  className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-7 py-3 rounded-xl text-sm flex items-center gap-2 shadow-btn hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0"
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
                  4-Step Admission Roadmap
                </span>
                <div className="flex items-center gap-2">
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
                </div>
              </div>

              <div
                ref={admissionsScrollRef}
                onScroll={(e) => handleContainerScroll(e, setAdmissionsActiveIndex)}
                className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {admissionSteps.map((step) => (
                  <div
                    key={step.step}
                    className="w-[260px] sm:w-[290px] shrink-0 snap-start bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative group flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-3xl font-black text-blue-100 group-hover:text-[#006FCC] transition-colors">
                        {step.step}
                      </div>
                      <h3 className="text-lg font-bold text-gray-950 mt-2 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-gray-50 flex items-center gap-1.5 text-[11px] font-semibold text-[#006FCC]">
                      <span>Step {step.step.replace(/\D/g, '')} of 4</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Scroll Dots for Admission Steps */}
              {renderScrollDots(admissionSteps.length, admissionsActiveIndex, admissionsScrollRef)}
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 8. FEE STRUCTURE SECTION (LOWER GRADE TO 12TH)            */}
      {/* ========================================================= */}
      <section id="fees" className="py-12 sm:py-16 bg-[#F8FAFC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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
                  className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'button_primary bg-[#006FCC] text-white shadow-btn scale-105'
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
                      className="w-full button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-btn hover:shadow-btn-hi flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0"
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


      {/* ========================================================= */}
      {/* 9. AUTHENTIC PARENTS & STUDENTS REVIEWS (100% GENUINE)    */}
      {/* ========================================================= */}
      <section id="reviews" className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Write Review Action */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
                <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
                <span>GENUINE COMMUNITY RATINGS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                What Parents & Students Say
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Real feedback from verified enrolled families and proud alumni.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
              <button
                type="button"
                onClick={() => setIsReviewsAnalysisModalOpen(true)}
                className="button_secondary inline-flex items-center gap-2 bg-[#EDF5FA] hover:bg-[#D6EDFF] text-[#006FCC] px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-[#D6EDFF] shadow-xs active:scale-95"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Rating & Sentiment Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleInitiateWriteReview}
                className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-btn hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Write Review</span>
                {!isLoggedIn && <Lock className="w-3 h-3 opacity-80" />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Scroll reviews left"
                  onClick={() => scrollHorizontally(reviewsScrollRef, 'left')}
                  className="w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll reviews right"
                  onClick={() => scrollHorizontally(reviewsScrollRef, 'right')}
                  className="w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-[#EDF5FA] text-gray-700 hover:text-[#006FCC] flex items-center justify-center shadow-sm transition-all active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Rating Summary Bar (Clickable to open Analysis Modal) */}
          <div
            onClick={() => setIsReviewsAnalysisModalOpen(true)}
            className="cursor-pointer group bg-[#f8fafd] hover:bg-blue-50/40 hover:border-[#006FCC]/50 rounded-3xl p-6 sm:p-8 border border-gray-200/90 mb-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm transition-all"
          >
            
            {/* Score Big Display */}
            <div className="md:col-span-4 text-center md:text-left md:border-r border-gray-200 md:pr-8">
              <div className="text-5xl sm:text-6xl font-black text-gray-900 group-hover:text-[#006FCC] transition-colors">4.8</div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 my-2">
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
              <div className="mt-3 text-[11px] text-[#006FCC] font-bold flex items-center justify-center md:justify-start gap-1">
                <span>Click to open rating intelligence pop-up</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Metrics Breakdown Progress Bars */}
            <div className="md:col-span-8 space-y-3">
              {[
                { label: 'Academics & Faculty Mentorship', score: '4.9', pct: '98%' },
                { label: 'Campus Safety & Transport', score: '4.9', pct: '98%' },
                { label: 'Science & Computer Laboratories', score: '4.8', pct: '96%' },
                { label: 'Sports, Arts & Extracurriculars', score: '4.7', pct: '94%' },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4 text-xs font-medium">
                  <span className="w-48 text-gray-700 truncate">{m.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-[#006FCC] rounded-full" style={{ width: m.pct }} />
                  </div>
                  <span className="w-8 text-right text-gray-900 font-bold">{m.score}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Horizontally Scrollable Reviews List */}
          <div
            ref={reviewsScrollRef}
            onScroll={(e) => handleContainerScroll(e, setReviewsActiveIndex)}
            className="flex gap-6 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                onClick={() => setIsReviewsAnalysisModalOpen(true)}
                className="w-[320px] sm:w-[380px] md:w-[420px] shrink-0 snap-start bg-white hover:bg-blue-50/20 hover:border-[#006FCC] hover:shadow-xl rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h4 className="font-bold text-gray-950 text-base group-hover:text-[#006FCC] transition-colors">{rev.author}</h4>
                      <p className="text-xs text-gray-500 font-medium">{rev.role}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="group-hover:text-[#006FCC] font-medium transition-colors">Click to read analysis ↗</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex items-center gap-1 hover:text-[#006FCC] transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.likes})</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Final Carousel Card to Read More / Open Full Analysis Modal */}
            <div
              onClick={() => setIsReviewsAnalysisModalOpen(true)}
              className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-gradient-to-br from-[#EDF5FA] via-sky-50 to-white rounded-2xl p-6 border-2 border-dashed border-[#006FCC]/40 shadow-sm hover:shadow-md hover:border-[#006FCC] transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#006FCC] text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 text-base mb-1">
                Read More Reviews
              </h4>
              <p className="text-xs text-gray-600 mb-4">
                Explore in-depth sentiment metrics, category breakdowns & verified testimonials.
              </p>
              <span className="text-xs font-bold text-[#006FCC] flex items-center gap-1 group-hover:underline">
                <span>Open Instant Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Dynamic Scroll Dots for Community Reviews */}
          {renderScrollDots(reviewsList.length + 1, reviewsActiveIndex, reviewsScrollRef)}

          {/* Dedicated Review & Rating Analysis Callout Banner */}
          <div className="mt-10 bg-gradient-to-r from-[#003C6E] via-[#005689] to-[#006FCC] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/15">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-blue-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Instant Rating Intelligence Modal</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Want Complete Transparency? Explore Rating Analysis
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
                Open our fast-loading analysis pop-up to inspect category scores (Academics, Campus Safety, Labs, Sports & Bus tracking), sentiment keywords, and verified feedback with continuous scroll.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsReviewsAnalysisModalOpen(true)}
              className="shrink-0 bg-white hover:bg-[#EDF5FA] text-[#005689] font-bold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <BarChart3 className="w-4 h-4 text-[#006FCC]" />
              <span>Read More & View Analysis</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 10. DIRECT CONTACT DESK & LIVE CAMPUS MAP                 */}
      {/* ========================================================= */}
      <section id="contact-info" className="py-20 bg-[#F8FAFC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
              <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
              <span>DIRECT CONTACT & VERIFIED LOCATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Get in Touch with School Authorities
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Choose who you wish to contact directly: School Administration, Principal's Secretariat, or WhatsApp Helpdesk.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 4 Distinct Labeled Action Cards */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Button 1: Call Administration Desk */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-xs hover:border-[#006FCC] hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-950 text-sm sm:text-base leading-tight">
                        School Administration Desk
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Admissions, Fee Inquiries, Transport & General Desk
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-[#EDF5FA] text-[#005689] border border-[#D6EDFF] px-2 py-0.5 rounded-full shrink-0">
                    Main Office
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-gray-700">
                    {displayPhone}
                  </span>
                  <a
                    href={`tel:${displayPhone}`}
                    className="inline-flex items-center gap-1.5 button_primary bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-btn hover:shadow-btn-hi transition-transform active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Administration</span>
                  </a>
                </div>
              </div>

              {/* Button 2: Call Principal's Office */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-xs hover:border-amber-400 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-950 text-sm sm:text-base leading-tight">
                        Principal's Secretariat
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {displayPrincipal} • Academic Counseling & Grievance Desk
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full shrink-0">
                    Principal Desk
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-gray-700">
                    +91 98765 43211
                  </span>
                  <a
                    href={`tel:${displayPhone.replace(/\d{2}$/, '11')}`}
                    className="inline-flex items-center gap-1.5 bg-[#FBBC04] hover:bg-[#F2A900] text-gray-950 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-transform active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Principal's Desk</span>
                  </a>
                </div>
              </div>

              {/* Button 3: Official WhatsApp Helpline */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-950 text-sm sm:text-base leading-tight">
                        Official WhatsApp Support
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Instant Admission Prospectus PDF & Quick WhatsApp Replies
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-gray-500">
                    Response within 5 mins
                  </span>
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello, I would like to inquire about admissions and school details for ${displayName}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-transform active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Admissions</span>
                  </a>
                </div>
              </div>

              {/* Button 4: Official School Emails */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-xs hover:border-[#006FCC] hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-950 text-sm sm:text-base leading-tight">
                      Official School Email Inboxes
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Formal document submission & inquiries
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <a
                    href={`mailto:${displayEmail}`}
                    className="flex flex-col p-2.5 rounded-xl bg-gray-50 hover:bg-[#EDF5FA] border border-gray-100 hover:border-[#D6EDFF] transition-colors"
                  >
                    <span className="text-[10px] font-bold uppercase text-gray-500">School Admin Email</span>
                    <span className="text-xs font-semibold text-[#006FCC] truncate mt-0.5">{displayEmail}</span>
                  </a>

                  <a
                    href={`mailto:principal@${displayEmail.split('@')[1] || 'brightfuture.edu.in'}`}
                    className="flex flex-col p-2.5 rounded-xl bg-gray-50 hover:bg-amber-50 border border-gray-100 hover:border-amber-200 transition-colors"
                  >
                    <span className="text-[10px] font-bold uppercase text-gray-500">Principal Office Email</span>
                    <span className="text-xs font-semibold text-amber-700 truncate mt-0.5">principal@{displayEmail.split('@')[1] || 'brightfuture.edu.in'}</span>
                  </a>
                </div>
              </div>

              {/* Button 5: Official Website & Credentials */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D6EDFF] shadow-xs hover:border-[#006FCC] hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-950 text-sm sm:text-base leading-tight">
                        Official Website & Registry
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        UDISE: <span className="font-mono font-semibold text-gray-800">{displayUdise}</span> • Affiliation: <span className="font-mono font-semibold text-amber-800">{displayAffiliationNo}</span>
                      </p>
                    </div>
                  </div>
                  <a
                    href={displayWebsiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button_primary inline-flex items-center gap-1.5 bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-btn hover:shadow-btn-hi transition-transform active:scale-95 shrink-0"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

            {/* Right Interactive Live Campus Map Card */}
            <div className={`lg:col-span-7 transition-all ${isMapFullscreen ? 'fixed inset-4 z-[99999] bg-white rounded-3xl p-6 shadow-2xl flex flex-col' : ''}`}>
              <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-gray-200/80 overflow-hidden relative flex flex-col h-full">
                
                {/* Map Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
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
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-md">{displayAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="button_primary inline-flex items-center gap-1.5 bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-btn hover:shadow-btn-hi transition-transform active:scale-95"
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
                    {/* Recenter Button (for Leaflet) */}
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
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 border border-gray-200 shadow-inner flex-1 min-h-[320px]">
                  {mapMode === 'google' ? (
                    <iframe
                      title="Google Maps Verified Campus"
                      src={`https://maps.google.com/maps?q=${mapLat},${mapLng}+(${encodeURIComponent(displayName)})&hl=en&z=15&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <div ref={mapContainerRef} className="w-full h-full z-0" />
                      {!mapLoaded && (
                        <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center gap-2">
                          <div className="w-8 h-8 rounded-full border-2 border-[#006FCC] border-t-transparent animate-spin" />
                          <span className="text-xs font-semibold text-gray-500">Loading interactive campus map...</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Floating Campus Badge Preview Overlay */}
                  <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-lg border border-gray-200/90 max-w-[280px] xs:max-w-xs transition-transform hover:scale-[1.02]">
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

                {/* Bottom Landmark, Parking & Copy Info */}
                <div className="pt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-700">
                      🕒 Mon - Sat: 8:00 AM – 3:30 PM
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-emerald-200">
                      🅿️ Free Visitor Parking
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(displayAddress);
                        setIsAddressCopied(true);
                        setTimeout(() => setIsAddressCopied(false), 2000);
                      }
                    }}
                    className="text-[#006FCC] hover:text-[#005499] font-bold text-xs flex items-center gap-1.5 transition-colors"
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

              {/* Social Icons */}
              <div className="flex items-center gap-2 pt-2">
                {[Facebook, Instagram, Youtube, Linkedin].map((SocialIcon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-8 h-8 rounded-full bg-blue-900/60 hover:bg-[#FBBC04] hover:text-gray-950 flex items-center justify-center text-blue-200 transition-colors"
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
                <li><Link href="#home" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#principles" className="hover:text-white transition-colors">Vision & Mission</Link></li>
                <li><Link href="#facilities" className="hover:text-white transition-colors">Facilities</Link></li>
                <li><Link href="#admissions" className="hover:text-white transition-colors">Admissions</Link></li>
                <li><Link href="#fees" className="hover:text-white transition-colors">Fee Structure</Link></li>
                <li><Link href="#reviews" className="hover:text-white transition-colors">Reviews & Ratings</Link></li>
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
                <MapPin className="w-3.5 h-3.5 text-[#FBBC04] shrink-0 mt-0.5" />
                <span>{displayAddress}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-blue-200/80">
                <Phone className="w-3.5 h-3.5 text-[#FBBC04] shrink-0" />
                <span>{displayPhone}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-blue-200/80">
                <Mail className="w-3.5 h-3.5 text-[#FBBC04] shrink-0" />
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
                  className="bg-white text-gray-900 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FBBC04] flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#FBBC04] hover:bg-[#F2A900] text-gray-950 font-bold px-4 py-2 rounded-xl text-xs shrink-0 transition-colors shadow-sm"
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
                    className="w-full button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-btn hover:shadow-btn-hi transition-all mt-6 hover:-translate-y-0.5 active:translate-y-0"
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
                    className="w-full button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-btn hover:shadow-btn-hi transition-all mt-6 hover:-translate-y-0.5 active:translate-y-0"
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
                  className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-1.5 shadow-btn hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0"
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
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-[#EDF5FA] shadow-sm transition-all active:scale-[0.99] mb-4"
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
                        className={`py-2 px-2 text-[11px] font-bold rounded-xl border text-center transition-colors ${
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
                className="w-full button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-btn hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{authTab === 'signin' ? 'Sign In & Write Review' : 'Create Account & Write Review'}</span>
              </button>
            </form>
          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* 17. FAST REVIEWS & RATING ANALYSIS MODAL                  */}
      {/* ========================================================= */}
      {isReviewsAnalysisModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
            
            {/* Modal Sticky Header */}
            <div className="px-6 py-4 border-b border-gray-200/80 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#005689] to-[#006FCC] text-white flex items-center justify-center shadow-md">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-gray-950">
                      {displayName} • Rating Intelligence
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> 210+ Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    High-density analysis of sentiment, infrastructure & academic ratings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInitiateWriteReview}
                  className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-btn hover:shadow-btn-hi transition-all active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Write Review</span>
                  {!isLoggedIn && <Lock className="w-3 h-3 opacity-80" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsReviewsAnalysisModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Rating Score & Category Breakdown Card */}
              <div className="bg-[#F8FAFD] rounded-2xl p-5 border border-blue-100/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Big Score Box */}
                <div className="md:col-span-4 text-center md:text-left md:border-r border-gray-200 md:pr-6">
                  <div className="text-5xl font-black text-gray-900 leading-none">4.8</div>
                  <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 my-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Based on <strong>210+ Verified Enrolled Community Reviews</strong>
                  </div>
                  
                  {/* Star Distribution Small Bars */}
                  <div className="mt-3 space-y-1 text-[11px] text-gray-600">
                    {[
                      { star: '5 ★', pct: '86%' },
                      { star: '4 ★', pct: '11%' },
                      { star: '3 ★', pct: '2%' },
                      { star: '2 ★', pct: '1%' },
                      { star: '1 ★', pct: '0%' }
                    ].map((row, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2">
                        <span className="w-7 font-semibold">{row.star}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: row.pct }} />
                        </div>
                        <span className="w-7 text-right font-medium">{row.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Department Breakdown */}
                <div className="md:col-span-8 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Performance by Department
                  </h4>
                  {[
                    { label: 'Academics & Faculty Mentorship', score: '4.9', pct: '98%' },
                    { label: 'Campus Safety & Transport', score: '4.9', pct: '98%' },
                    { label: 'Science & Computer Laboratories', score: '4.8', pct: '96%' },
                    { label: 'Sports, Arts & Extracurriculars', score: '4.7', pct: '94%' },
                    { label: 'Affordability & Fee Value', score: '4.7', pct: '94%' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className="w-44 text-gray-700 font-medium truncate">{m.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: m.pct }} />
                      </div>
                      <span className="w-8 text-right font-bold text-gray-900">{m.score}</span>
                    </div>
                  ))}

                  {/* Quick Positive Sentiment Chips */}
                  <div className="pt-2 flex flex-wrap items-center gap-1.5">
                    {[
                      '🏆 Top Board Results',
                      '🔬 High-Grade Labs',
                      '🚌 GPS Buses & Female Attendants',
                      '🌱 Safe Green Campus',
                      '💡 NEP 2020 Experiential'
                    ].map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="bg-white border border-blue-200 text-blue-800 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Strip */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200/80">
                
                {/* Role Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(['all', 'Parent', 'Student', 'Alumni'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setModalRoleFilter(role)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors shrink-0 ${
                        modalRoleFilter === role
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {role === 'all' ? 'All Roles' : `${role}s`}
                    </button>
                  ))}
                </div>

                {/* Star Filter & Search */}
                <div className="flex items-center gap-2">
                  <select
                    value={modalStarFilter}
                    onChange={(e) => setModalStarFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">All Stars</option>
                    <option value="5">5 Stars only</option>
                    <option value="4">4 Stars only</option>
                  </select>

                  <div className="relative flex-1 sm:w-48">
                    <input
                      type="text"
                      placeholder="Search reviews..."
                      value={modalSearchText}
                      onChange={(e) => setModalSearchText(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
                  </div>
                </div>
              </div>

              {/* Reviews Feed with Infinite/Continuous Scroll */}
              <div className="space-y-4">
                {reviewsList
                  .filter((rev) => {
                    if (modalRoleFilter !== 'all' && !rev.role.toLowerCase().includes(modalRoleFilter.toLowerCase())) {
                      return false;
                    }
                    if (modalStarFilter !== 'all' && rev.rating !== modalStarFilter) {
                      return false;
                    }
                    if (modalSearchText && !rev.comment.toLowerCase().includes(modalSearchText.toLowerCase()) && !rev.author.toLowerCase().includes(modalSearchText.toLowerCase())) {
                      return false;
                    }
                    return true;
                  })
                  .slice(0, modalVisibleCount)
                  .map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-blue-200 transition-colors shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center">
                            {rev.author.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-950 text-sm">{rev.author}</h4>
                              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500">{rev.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed mb-3">
                        "{rev.comment}"
                      </p>

                      {/* Sub-Metrics tags if present */}
                      {rev.metrics && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                          <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            Academics: <strong className="text-gray-800">{rev.metrics.academics}</strong>
                          </span>
                          <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            Sports: <strong className="text-gray-800">{rev.metrics.sports}</strong>
                          </span>
                          <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            Campus Safety: <strong className="text-gray-800">{rev.metrics.safety}</strong>
                          </span>
                          <span className="ml-auto text-gray-400 text-[10px]">{rev.date}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Load More Continuous Scroll Trigger Button */}
              {modalVisibleCount < reviewsList.length && (
                <div className="text-center pt-2 pb-4">
                  <button
                    type="button"
                    onClick={() => setModalVisibleCount((c) => c + 4)}
                    className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold text-xs px-6 py-2.5 rounded-full shadow-xs transition-all active:scale-95 inline-flex items-center gap-2"
                  >
                    <span>Load More Verified Reviews</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
