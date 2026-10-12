'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FlaskConical,
  Atom,
  Dna,
  Calculator,
  Palette,
  Cpu,
  Wrench,
  Search,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Shield,
  Layers,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Award,
  ArrowUpDown,
  X,
  Play,
  Package,
  Compass,
  Check,
  Zap,
  HelpCircle,
  BookmarkCheck,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  CheckCheck,
  Flame,
  Beaker,
  Heart,
  Share2
} from 'lucide-react';
import { SUBJECTS_DATA, SubjectMetadata, ExperimentActivity, slugifyExperimentTitle } from '@/data/subjectActivitiesData';
import ExperimentDetailModal from '@/components/subject/ExperimentDetailModal';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import {
  M3Button,
  M3IconButton,
  M3FilterChip,
  M3InputChip,
  M3AssistChip,
  M3Badge,
} from '@/components/google-ui';

// Swiper React Component & Modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const CATEGORY_IMAGES: Record<string, string> = {
  chemistry: '/images/categories/chemistry-card-1.jpg',
  physics: '/images/categories/physics.jpg',
  biology: '/images/categories/biology.jpg',
  math: '/images/categories/mathematics.jpg',
  mathematics: '/images/categories/mathematics.jpg',
  art: '/images/categories/art.jpg',
  technology: '/images/categories/technology.jpg',
  engineering: '/images/categories/engineering.jpg',
};

const ALL_SUBJECT_NAV = [
  { slug: 'chemistry', name: 'Chemistry', icon: FlaskConical, color: '#f59e0b' },
  { slug: 'physics', name: 'Physics', icon: Atom, color: '#0ea5e9' },
  { slug: 'biology', name: 'Biology', icon: Dna, color: '#10b981' },
  { slug: 'mathematics', name: 'Mathematics', icon: Calculator, color: '#8b5cf6' },
  { slug: 'technology', name: 'Technology', icon: Cpu, color: '#6366f1' },
  { slug: 'engineering', name: 'Engineering', icon: Wrench, color: '#d97706' },
  { slug: 'art', name: 'Art & STEAM', icon: Palette, color: '#f43f5e' },
];

const CLASS_OPTIONS = [
  { label: 'All Classes', value: 'All' },
  { label: 'Primary (1-5)', value: 'Primary (1-5)' },
  { label: 'Class 6', value: 'Class 6' },
  { label: 'Class 7', value: 'Class 7' },
  { label: 'Class 8', value: 'Class 8' },
  { label: 'Class 9', value: 'Class 9' },
  { label: 'Class 10', value: 'Class 10' },
  { label: 'Class 11', value: 'Class 11' },
  { label: 'Class 12', value: 'Class 12' },
];

const DIFFICULTY_FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const DURATION_FILTERS = [
  { label: 'All Durations', value: 'All' },
  { label: 'Quick (< 25 min)', value: 'quick' },
  { label: 'Standard (25-45 min)', value: 'standard' },
  { label: 'Extended (45+ min)', value: 'extended' },
];

const SAFETY_FILTERS = [
  { label: 'All Environments', value: 'All' },
  { label: 'Safe for Home', value: 'Safe for Home' },
  { label: 'Adult Supervision', value: 'Adult Supervision' },
  { label: 'Lab Required', value: 'Lab Environment Required' },
];

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popularity' },
  { label: 'Title: A → Z', value: 'az' },
  { label: 'Title: Z → A', value: 'za' },
  { label: 'Duration: Shortest', value: 'duration_asc' },
  { label: 'Duration: Longest', value: 'duration_desc' },
  { label: 'Difficulty: Beginner First', value: 'diff_asc' },
];

export default function SubjectActivityPage() {
  const params = useParams();
  const router = useRouter();
  const { totalItems, isInCart, selectedIds, toggleSelect: cartToggle } = useCart();
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || 'chemistry';

  // Normalize slug variations
  const normalizedSlug = rawSlug
    .replace(/\.html$/i, '')
    .replace(/-activity$/i, '')
    .toLowerCase();

  const activeSlugKey =
    normalizedSlug === 'mathematics' ? 'math' :
    normalizedSlug === 'arts' ? 'art' :
    normalizedSlug;

  const subject: SubjectMetadata = SUBJECTS_DATA[activeSlugKey] || SUBJECTS_DATA['chemistry'];
  const displayName = subject.name.replace(/\s*Activities$/i, '');

  // Hero Slides matching CSEEL Global Design
  // Hero Slides tailored per Subject with authentic images & curriculum copy
  const heroSlides = useMemo(() => {
    if (activeSlugKey === 'chemistry') {
      return [
        {
          id: 'chem-slide-1',
          image: '/images/hero/chemistry-hero-desktop.jpg',
          mobileImage: '/images/hero/chemistry-hero-mobile.jpg',
          badge: 'NEP 2020 • EXPERIENTIAL CHEMISTRY LABS',
          titleLine1: 'Chemistry You Can See.',
          titleLine2: 'Chemistry You Can Experience.',
          tagline: 'Explore • Experiment • Understand',
          description: 'From molecular reactions and crystal growth to acids, bases and chemical energy — experience chemistry through real experiments designed for meaningful learning.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
        {
          id: 'chem-slide-2',
          image: '/images/categories/chemistry-card-2.png',
          badge: 'NEP 2020 • TITRATIONS & REACTION KINETICS',
          titleLine1: 'Precision In Every Reaction.',
          titleLine2: 'Titrations, Salts & Catalysis.',
          tagline: 'Measure • React • Analyze',
          description: 'Master molarity, acid-base neutralization, and chemical equilibrium with guided laboratory protocols and instant observation capture.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
        {
          id: 'chem-slide-3',
          image: '/images/categories/chemistry-card-1.jpg',
          badge: 'NEP 2020 • THERMODYNAMICS & SYNTHESIS',
          titleLine1: 'Energy Changes You Can Measure.',
          titleLine2: 'Endothermic & Exothermic Reactions.',
          tagline: 'Observe • Calculate • Record',
          description: 'Investigate bond energies, enthalpy of dissolution, and precipitation reactions with zero consumable waste and complete lab safety.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
      ];
    }

    if (activeSlugKey === 'biology') {
      return [
        {
          id: 'bio-slide-1',
          image: '/images/hero/biology-hero-desktop.jpg',
          mobileImage: '/images/hero/biology-hero-mobile.jpg',
          badge: 'NEP 2020 • OPTICAL MICROSCOPY & BOTANY LABS',
          titleLine1: 'Living Systems Unveiled.',
          titleLine2: 'Microscopic Wonders In Your Hands.',
          tagline: 'Observe • Dissect • Discover Life',
          description: 'From plant cellular membranes, photosynthesis, and stomata to human physiology and DNA extraction — explore living science hands-on with optical microscopes and guided practicals.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
        {
          id: 'bio-slide-2',
          image: '/images/categories/biology.jpg',
          badge: 'NEP 2020 • BOTANICAL PHYSIOLOGY & PLANT SCIENCE',
          titleLine1: 'Photosynthesis & Plant Anatomy.',
          titleLine2: 'Xylem, Phloem & Cellular Respiration.',
          tagline: 'Investigate • Culture • Grow',
          description: 'Section botanical specimens, observe chloroplast streaming, and track transpiration rates under calibrated environmental controls.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
        {
          id: 'bio-slide-3',
          image: '/images/hero/biology-mitosis-desktop.jpg',
          mobileImage: '/images/hero/biology-mitosis-mobile.jpg',
          badge: 'NEP 2020 • GENETICS & CELLULAR BIOLOGY',
          titleLine1: 'Cell Division Under High Magnification.',
          titleLine2: 'Mitosis, Meiosis & DNA Structure.',
          tagline: 'Stain • Mount • Examine',
          description: 'Prepare onion root tip slides, stain cheek epithelium cells, and uncover the fundamental building blocks of all living organisms.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
      ];
    }

    if (activeSlugKey === 'physics') {
      return [
        {
          id: 'phy-slide-1',
          image: '/images/categories/physics.jpg',
          badge: 'NEP 2020 • EXPERIENTIAL PHYSICS & MECHANICS',
          titleLine1: 'Forces You Can Measure.',
          titleLine2: 'Physics You Can Experience.',
          tagline: 'Observe • Hypothesize • Verify Laws',
          description: 'From simple harmonic motion and wave optics to Ohm\'s Law and electromagnetic induction — verify the fundamental laws of nature through interactive apparatus.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
        {
          id: 'phy-slide-2',
          image: '/images/hero/physics-circuit-desktop.jpg',
          mobileImage: '/images/hero/physics-circuit-mobile.jpg',
          badge: 'NEP 2020 • ELECTRICITY & CIRCUIT DESIGN',
          titleLine1: 'Circuits In Real Time.',
          titleLine2: 'Voltage, Current & Resistance.',
          tagline: 'Build • Measure • Power',
          description: 'Wire series and parallel circuits, calibrate potentiometers, and visualize electric field lines with precision digital meters.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
        {
          id: 'phy-slide-3',
          image: '/images/hero/physics-optics-desktop.jpg',
          mobileImage: '/images/hero/physics-optics-mobile.jpg',
          badge: 'NEP 2020 • RAY OPTICS & WAVE PHENOMENA',
          titleLine1: 'Light, Lenses & Dispersion.',
          titleLine2: 'Refraction & Focal Lengths.',
          tagline: 'Trace • Focus • Resolve',
          description: 'Trace light through convex lenses, triangular prisms, and diffraction gratings with real-time ray diagramming and focal point measurement.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
      ];
    }

    if (activeSlugKey === 'math' || activeSlugKey === 'mathematics') {
      return [
        {
          id: 'math-slide-1',
          image: '/images/categories/mathematics.jpg',
          badge: 'NEP 2020 • VISUAL & EXPERIENTIAL MATHEMATICS',
          titleLine1: 'Math You Can Visualize.',
          titleLine2: 'Geometry, Algebra & Data in Action.',
          tagline: 'Visualize • Model • Prove',
          description: 'Transform abstract formulas into interactive 3D spatial models. Explore conic sections, trigonometry, calculus, and probability through experiential kits.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
        {
          id: 'math-slide-2',
          image: '/images/categories/mathematics.jpg',
          badge: 'NEP 2020 • 3D SPATIAL GEOMETRY & TRIGONOMETRY',
          titleLine1: 'Shapes, Vectors & Theorems.',
          titleLine2: 'Hands-On Geometric Proofs.',
          tagline: 'Construct • Measure • Deduce',
          description: 'Unpack coordinate geometry, surface areas, and Pythagorean triples with manipulatives that turn theorems into intuitive reality.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
      ];
    }

    if (activeSlugKey === 'technology') {
      return [
        {
          id: 'tech-slide-1',
          image: '/images/categories/technology.jpg',
          badge: 'NEP 2020 • COMPUTATIONAL THINKING & AI',
          titleLine1: 'Code You Can Execute.',
          titleLine2: 'Algorithms, IoT & Future Skills.',
          tagline: 'Code • Simulate • Automate',
          description: 'From logic gates and Arduino microcontrollers to machine learning neural networks — build practical digital technology solutions.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
      ];
    }

    if (activeSlugKey === 'engineering') {
      return [
        {
          id: 'eng-slide-1',
          image: '/images/categories/engineering.jpg',
          badge: 'NEP 2020 • ATL TINKERING & MAKER INNOVATION',
          titleLine1: 'Design It. Build It. Test It.',
          titleLine2: 'Real-World Engineering Challenges.',
          tagline: 'Prototype • Stress-Test • Iterate',
          description: 'Tackle civil trusses, mechanical linkages, robotics, and renewable energy grids aligned with Atal Tinkering Labs and STEM competitions.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
      ];
    }

    if (activeSlugKey === 'art') {
      return [
        {
          id: 'art-slide-1',
          image: '/images/categories/art.jpg',
          badge: 'NEP 2020 • CREATIVE STEAM & DESIGN THINKING',
          titleLine1: 'Creativity Meets Science.',
          titleLine2: 'Color Physics & Visual Design.',
          tagline: 'Create • Design • Express',
          description: 'Explore optical color theory, photochemistry, natural pigments, and golden ratio geometry through hands-on creative STEAM explorations.',
          ctaText: 'Explore Labs',
          ctaLink: '#experiments-grid',
        },
      ];
    }

    return [
      {
        id: 'default-slide-1',
        image: CATEGORY_IMAGES[activeSlugKey] || '/images/categories/chemistry.jpg',
        badge: `NEP 2020 • EXPERIENTIAL ${displayName.toUpperCase()} LABS`,
        titleLine1: `${displayName} You Can See.`,
        titleLine2: `${displayName} You Can Experience.`,
        tagline: 'Explore • Experiment • Understand',
        description: subject.description,
        ctaText: 'Explore Labs',
        ctaLink: '#experiments-grid',
      },
    ];
  }, [activeSlugKey, subject, displayName]);

  // Live Supabase Experiments
  const [dbActivities, setDbActivities] = useState<ExperimentActivity[] | null>(null);

  useEffect(() => {
    async function fetchSubjectExperiments() {
      try {
        const querySubject =
          activeSlugKey === 'physics' ? 'Physics' :
          activeSlugKey === 'chemistry' ? 'Chemistry' :
          activeSlugKey === 'biology' ? 'Biology' :
          (activeSlugKey === 'math' || activeSlugKey === 'mathematics') ? 'Mathematics' :
          displayName;

        const { data, error } = await (supabase.from('experiments') as any)
          .select('*')
          .ilike('subject', querySubject);

        if (!error && data && data.length > 0) {
          const mapped: ExperimentActivity[] = data.map((row: any) => ({
            id: row.id,
            slug: row.slug || row.id,
            title: row.title,
            subtitle: row.description || '',
            description: row.description || '',
            category: `${row.subject} Practical Laboratory`,
            gradeLevel:
              row.class?.includes('11') || row.class?.includes('12')
                ? 'Senior Sec (11-12)'
                : row.class?.includes('9') || row.class?.includes('10')
                ? 'Secondary (9-10)'
                : 'Middle (6-8)',
            difficulty: row.difficulty || 'Intermediate',
            duration: `${row.duration_minutes || 45} Mins`,
            safetyLevel: 'Standard Educational Lab Grade',
            scientificPrinciple: row.outcome || row.description || '',
            materials: Array.isArray(row.materials) ? row.materials : [],
            steps: Array.isArray(row.procedure) ? row.procedure : [],
            procedure: Array.isArray(row.procedure) ? row.procedure : [],
            precautions: Array.isArray(row.precautions) ? row.precautions : [],
            outcome: row.outcome || '',
            realWorldApplication: row.outcome || '',
            tags: Array.isArray(row.tags) ? row.tags : [row.subject],
            badge: 'NEP 2020 Aligned',
            image: row.thumbnail_url,
            thumbnail_url: row.thumbnail_url,
            colorTheme:
              row.subject === 'Physics'
                ? 'from-cyan-500 to-blue-600'
                : row.subject === 'Chemistry'
                ? 'from-amber-500 to-orange-600'
                : row.subject === 'Biology'
                ? 'from-emerald-500 to-teal-600'
                : 'from-purple-500 to-indigo-600',
          }));
          setDbActivities(mapped);
        }
      } catch (e) {
        // Fallback to static
      }
    }
    fetchSubjectExperiments();
  }, [activeSlugKey, displayName]);

  const baseActivities = dbActivities && dbActivities.length > 0 ? dbActivities : subject.activities;

  // Dynamic Extractors for Chapters & Topics from Current Subject Activities
  const dynamicChapters = useMemo(() => {
    const map = new Map<string, number>();
    baseActivities.forEach((act) => {
      const cat = act.category || 'General Science';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [baseActivities]);

  const dynamicTopics = useMemo(() => {
    const map = new Map<string, number>();
    baseActivities.forEach((act) => {
      act.tags.forEach((tag) => {
        map.set(tag, (map.get(tag) || 0) + 1);
      });
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [baseActivities]);

  // State Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [selectedSafety, setSelectedSafety] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('popularity');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [activeModalActivity, setActiveModalActivity] = useState<ExperimentActivity | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [shareToastText, setShareToastText] = useState<string | null>(null);

  // Load liked experiments from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cseel_liked_experiments');
      if (stored) setLikedIds(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setLikedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem('cseel_liked_experiments', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  const handleShareActivity = async (e: React.MouseEvent, act: ExperimentActivity) => {
    e.stopPropagation();
    e.preventDefault();
    const expSlug = slugifyExperimentTitle(act.title) || act.id;
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/experiments/${expSlug}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${act.title} | CSEEL Experiment Guide`,
          text: act.subtitle || act.description,
          url,
        });
        return;
      } catch (err) {
        // User dismissed or fallback
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setShareToastText(`Link copied to clipboard!`);
      setTimeout(() => setShareToastText(null), 3000);
    }
  };

  // Close filter sheet on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFilterSheetOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when filter sheet is open
  useEffect(() => {
    if (isFilterSheetOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isFilterSheetOpen]);

  const handleToggleSelect = (act: ExperimentActivity) => {
    cartToggle({
      id: act.id,
      title: act.title,
      subject: subject.name.replace(' Activities', ''),
      thumbnail_url: CATEGORY_IMAGES[activeSlugKey] || '/images/categories/chemistry.jpg',
      class: act.gradeLevel,
    });
  };

  // Helper to match Class selection to gradeLevel
  const matchClassFilter = (gradeLevel: string, classVal: string) => {
    if (classVal === 'All') return true;
    if (gradeLevel === 'All Grades') return true;
    if (classVal === 'Primary (1-5)' && (gradeLevel.includes('Primary') || gradeLevel.includes('1-5'))) return true;
    if (['Class 6', 'Class 7', 'Class 8'].includes(classVal) && (gradeLevel.includes('Middle') || gradeLevel.includes('6-8'))) return true;
    if (['Class 9', 'Class 10'].includes(classVal) && (gradeLevel.includes('Secondary') || gradeLevel.includes('9-10'))) return true;
    if (['Class 11', 'Class 12'].includes(classVal) && (gradeLevel.includes('Senior') || gradeLevel.includes('11-12'))) return true;
    return gradeLevel.toLowerCase().includes(classVal.toLowerCase());
  };

  // Helper to match Duration
  const matchDurationFilter = (durationStr: string, durFilter: string) => {
    if (durFilter === 'All') return true;
    const durNum = parseInt(durationStr) || 30;
    if (durFilter === 'quick') return durNum < 25;
    if (durFilter === 'standard') return durNum >= 25 && durNum <= 45;
    if (durFilter === 'extended') return durNum > 45;
    return true;
  };

  // Filtered & Sorted Activities
  const filteredActivities = useMemo(() => {
    let list = baseActivities.filter((act) => {
      // Search
      const matchesSearch =
        !searchQuery ||
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        act.scientificPrinciple.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Class
      const matchesClass = matchClassFilter(act.gradeLevel, selectedClass);

      // Chapter
      const matchesChapter = selectedChapter === 'All' || act.category === selectedChapter;

      // Topic
      const matchesTopic = selectedTopic === 'All' || act.tags.includes(selectedTopic);

      // Difficulty
      const matchesDiff = selectedDifficulty === 'All' || act.difficulty === selectedDifficulty;

      // Duration
      const matchesDuration = matchDurationFilter(act.duration, selectedDuration);

      // Safety
      const matchesSafety = selectedSafety === 'All' || act.safetyLevel === selectedSafety;

      return matchesSearch && matchesClass && matchesChapter && matchesTopic && matchesDiff && matchesDuration && matchesSafety;
    });

    // Sorting
    if (selectedSort === 'az') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === 'za') {
      list.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSort === 'duration_asc') {
      list.sort((a, b) => (parseInt(a.duration) || 30) - (parseInt(b.duration) || 30));
    } else if (selectedSort === 'duration_desc') {
      list.sort((a, b) => (parseInt(b.duration) || 30) - (parseInt(a.duration) || 30));
    } else if (selectedSort === 'diff_asc') {
      const order: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      list.sort((a, b) => (order[a.difficulty] || 0) - (order[b.difficulty] || 0));
    }

    return list;
  }, [
    baseActivities,
    searchQuery,
    selectedClass,
    selectedChapter,
    selectedTopic,
    selectedDifficulty,
    selectedDuration,
    selectedSafety,
    selectedSort,
  ]);

  // Active filter count
  const activeFilterCount =
    (selectedClass !== 'All' ? 1 : 0) +
    (selectedChapter !== 'All' ? 1 : 0) +
    (selectedTopic !== 'All' ? 1 : 0) +
    (selectedDifficulty !== 'All' ? 1 : 0) +
    (selectedDuration !== 'All' ? 1 : 0) +
    (selectedSafety !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedClass('All');
    setSelectedChapter('All');
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSelectedDuration('All');
    setSelectedSafety('All');
    setSelectedSort('popularity');
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#eef2f6] text-slate-900 font-sans antialiased pb-24 selection:bg-[#003c6e] selection:text-white box-border">
      
      {/* ─── 1. Full-Width Swiper Hero Section (Global Website Theme) ─── */}
      <section className="relative overflow-hidden w-full max-w-full bg-gradient-to-b from-[#002244] via-[#002b55] to-[#001833] text-white border-b border-white/10 select-none">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          speed={850}
          loop={true}
          autoplay={{
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: '.hero-swiper-pagination',
            bulletClass: 'hero-bullet inline-block w-2.5 h-2.5 bg-sky-400/40 rounded-full cursor-pointer transition-all duration-300 mx-1 hover:bg-white/80',
            bulletActiveClass: '!w-2.5 !h-2.5 !bg-[#fbb03b] !rounded-full !shadow-md',
          }}
          navigation={{
            prevEl: '.hero-swiper-prev',
            nextEl: '.hero-swiper-next',
          }}
          className="w-full max-w-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide 
              key={slide.id} 
              className="relative w-full max-w-full px-4 sm:px-8 pt-3 sm:pt-5 pb-4 sm:pb-8 overflow-hidden h-[calc(100dvh-108px)] min-h-[460px] max-h-[580px] sm:h-[520px] md:h-[580px] sm:min-h-0 sm:max-h-none"
            >
              
              {/* Mobile Background (sm:hidden) */}
              <div 
                className="sm:hidden absolute inset-0 z-0 pointer-events-none overflow-hidden bg-cover bg-no-repeat bg-[right_center]"
                style={{
                  backgroundImage: `url(${slide.mobileImage || slide.image})`,
                }}
              />

              {/* Desktop Background (hidden sm:block) */}
              <div 
                className="hidden sm:block absolute inset-0 z-0 pointer-events-none overflow-hidden bg-cover bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              />

              {/* Subtle top/left gradient for text readability */}
              <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#000a18]/80 via-[#000e1f]/35 to-transparent sm:bg-gradient-to-r sm:from-[#000a18]/85 sm:via-[#000e1f]/40 sm:to-transparent" />

              {/* Top Text Content */}
              <div className="relative z-10 w-full max-w-6xl mx-auto pt-1 sm:pt-4">
                <div className="max-w-xl mx-auto sm:mx-0 flex flex-col items-start text-left space-y-1.5 sm:space-y-2 pt-1 sm:pt-3">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#00172e]/70 border border-[#38bdf8]/40 backdrop-blur-md shadow-md">
                    <FlaskConical className="w-3.5 h-3.5 text-[#fbb03b] shrink-0" />
                    <span className="text-[10px] xs:text-[11px] sm:text-xs font-bold tracking-wider uppercase text-sky-100">{slide.badge}</span>
                  </div>

                  {/* Heading: Exact 3-line layout matching phone screenshot */}
                  <div className="space-y-0">
                    <h1 className="subject-hero-h1 text-[22px] xs:text-[24px] sm:text-4xl md:text-5xl font-black !text-white tracking-tight leading-[1.12] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]" style={{ color: '#ffffff' }}>
                      {slide.titleLine1} <br />
                      <span className="text-[#fbb03b]" style={{ color: '#fbb03b' }}>
                        {slide.titleLine2}
                      </span>
                    </h1>
                  </div>

                  {/* Dual Accent Indicator Bar */}
                  <div className="flex items-center gap-1.5 my-1">
                    <div className="w-8 h-[3.5px] rounded-full bg-[#fbb03b]"></div>
                    <div className="w-8 h-[3.5px] rounded-full bg-[#38bdf8]"></div>
                  </div>

                  {/* Sub-tagline */}
                  <p className="text-xs sm:text-sm md:text-base text-white font-bold tracking-wide drop-shadow-sm">
                    {slide.tagline || 'Explore • Experiment • Understand'}
                  </p>

                  {/* Description Paragraph */}
                  <p className="text-[11.5px] xs:text-xs sm:text-sm text-slate-100/90 leading-relaxed font-normal max-w-[280px] xs:max-w-[310px] sm:max-w-md drop-shadow-sm line-clamp-3 xs:line-clamp-none">
                    {slide.description}
                  </p>

                </div>
              </div>

              {/* Hero Footer Bar with Backdrop Blur: Official M3 Buttons */}
              <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-[#000814]/95 via-[#000a18]/80 to-transparent backdrop-blur-md pt-3 sm:pt-5 pb-5 sm:pb-7 px-3 sm:px-8 pointer-events-auto">
                <div className="flex flex-row items-center gap-2.5 xs:gap-3 w-full max-w-sm sm:max-w-md mx-auto sm:mx-0">
                  <M3Button
                    variant="filled"
                    size="md"
                    fullWidth
                    onClick={() => {
                      const el = document.getElementById('experiments-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {slide.ctaText}
                  </M3Button>

                  <M3Button
                    variant="tonal"
                    size="md"
                    fullWidth
                    onClick={() => {
                      const el = document.getElementById('experiments-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    View Experiments
                  </M3Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Desktop Edge Arrows */}
        <button 
          aria-label="Previous Slide"
          className="hero-swiper-prev hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md items-center justify-center transition-all duration-200 active:scale-95 shadow-lg cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>
        <button 
          aria-label="Next Slide"
          className="hero-swiper-next hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md items-center justify-center transition-all duration-200 active:scale-95 shadow-lg cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>

        {/* Pagination Dots */}
        <div className="hero-swiper-pagination !absolute !bottom-1 sm:!bottom-1.5 !left-1/2 !-translate-x-1/2 !z-30 !flex !items-center !justify-center !w-auto !bg-black/35 !backdrop-blur-md !px-3 !py-0.5 sm:!py-1 !rounded-full !border !border-sky-400/20 !shadow-lg"></div>
      </section>

      {/* ─── 2. Search, Filter & Sort Toolbar (Official Google M3 Search & Filter Bar) ─── */}
      <section id="experiments-grid" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6 sm:mt-8 w-full max-w-full">
        
        <div className="w-full bg-white rounded-3xl p-3 sm:p-4 border border-[#dde3ea] shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-all space-y-2.5 box-border">
          
          {/* Official Google M3 Search Bar (52px pill, #eef3fc Surface Container High) */}
          <div className="flex items-center gap-2.5 w-full h-12 bg-[#eef3fc] hover:bg-[#e3ecf8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0b57d0] border border-transparent focus-within:border-[#0b57d0] rounded-full px-4 transition-all">
            <Search size={18} className="text-[#444746] shrink-0" />

            <input 
              type="text" 
              placeholder={`Search ${displayName} experiments, topics, concepts...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#1f1f1f] placeholder-[#444746] outline-none min-w-0"
            />

            {searchQuery && (
              <M3IconButton
                variant="standard"
                size="sm"
                ariaLabel="Clear search"
                icon={<X size={15} />}
                onClick={() => setSearchQuery('')}
              />
            )}

            {/* Bookmark Link Button with M3IconButton & M3Badge */}
            <div className="relative shrink-0">
              <M3IconButton
                variant="tonal"
                size="sm"
                ariaLabel="My Selections"
                icon={<BookmarkCheck size={15} />}
                onClick={() => router.push('/my-selections')}
              />
              {selectedIds.length > 0 && (
                <span className="absolute -top-1 -right-1 pointer-events-none">
                  <M3Badge count={selectedIds.length} />
                </span>
              )}
            </div>
          </div>

          {/* Quick Action & Class Chips Row (Official M3 IconButtons + M3 FilterChips) */}
          <div className="flex items-center gap-2 w-full select-none">
            
            {/* Static Action Buttons: Filter Trigger + Sort Trigger */}
            <div className="flex items-center gap-1.5 shrink-0 relative">
              
              {/* Filter Icon Trigger */}
              <div className="relative">
                <M3IconButton
                  variant={activeFilterCount > 0 ? 'filled' : 'tonal'}
                  size="sm"
                  selected={activeFilterCount > 0}
                  ariaLabel="Open filters"
                  icon={<SlidersHorizontal size={15} strokeWidth={2.2} />}
                  onClick={() => setIsFilterSheetOpen(true)}
                />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 pointer-events-none">
                    <M3Badge count={activeFilterCount} />
                  </span>
                )}
              </div>

              {/* Sort Icon Dropdown Trigger */}
              <div className="relative shrink-0">
                <M3IconButton
                  variant={selectedSort !== 'popularity' || isSortMenuOpen ? 'tonal' : 'outlined'}
                  size="sm"
                  selected={selectedSort !== 'popularity' || isSortMenuOpen}
                  ariaLabel="Open sort menu"
                  icon={<ArrowUpDown size={15} strokeWidth={2.2} />}
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                />

                {/* Floating Google Dropdown Menu */}
                {isSortMenuOpen && (
                  <>
                    {/* Invisible backdrop to dismiss */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsSortMenuOpen(false)} 
                    />

                    {/* Dropdown Card */}
                    <div className="absolute top-full left-0 mt-2 w-56 bg-[#f8fafd] rounded-2xl shadow-2xl border border-[#dde3ea] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-left overflow-hidden">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-[#444746] uppercase tracking-wider border-b border-[#dde3ea] flex items-center justify-between">
                        <span>Sort Activities</span>
                        {selectedSort !== 'popularity' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSort('popularity');
                              setIsSortMenuOpen(false);
                            }}
                            className="text-[10px] text-[#0b57d0] hover:underline font-bold"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <div className="p-1 space-y-0.5">
                        {SORT_OPTIONS.map((opt) => {
                          const isActive = selectedSort === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setSelectedSort(opt.value);
                                setIsSortMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs transition-colors text-left cursor-pointer ${
                                isActive
                                  ? 'bg-[#c2e7ff] text-[#001d35] font-bold'
                                  : 'text-[#1f1f1f] hover:bg-[#eef3fc] font-medium'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isActive && <Check size={14} strokeWidth={2.5} className="text-[#0b57d0] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>

            {/* Small Divider */}
            <div className="h-5 w-px bg-[#c4c7c5] shrink-0 mx-0.5" />

            {/* Scrollable Official M3 FilterChips Container */}
            <div 
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {CLASS_OPTIONS.map((c) => {
                const isActive = selectedClass === c.value;
                return (
                  <M3FilterChip
                    key={c.value}
                    label={c.label}
                    selected={isActive}
                    onClick={() => setSelectedClass(c.value)}
                  />
                );
              })}
            </div>

          </div>

          {/* Active Filters using Official M3 InputChips */}
          {(activeFilterCount > 0 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#dde3ea]">
              <span className="text-[10px] font-bold text-[#444746] uppercase tracking-wider mr-1">Active:</span>

              {searchQuery && (
                <M3InputChip
                  label={`"${searchQuery}"`}
                  selected
                  onRemove={() => setSearchQuery('')}
                />
              )}

              {selectedClass !== 'All' && (
                <M3InputChip
                  label={selectedClass}
                  selected
                  onRemove={() => setSelectedClass('All')}
                />
              )}

              {selectedChapter !== 'All' && (
                <M3InputChip
                  label={selectedChapter}
                  selected
                  onRemove={() => setSelectedChapter('All')}
                />
              )}

              {selectedTopic !== 'All' && (
                <M3InputChip
                  label={selectedTopic}
                  selected
                  onRemove={() => setSelectedTopic('All')}
                />
              )}

              {selectedDifficulty !== 'All' && (
                <M3InputChip
                  label={selectedDifficulty}
                  selected
                  onRemove={() => setSelectedDifficulty('All')}
                />
              )}

              {selectedDuration !== 'All' && (
                <M3InputChip
                  label={DURATION_FILTERS.find((d) => d.value === selectedDuration)?.label || selectedDuration}
                  selected
                  onRemove={() => setSelectedDuration('All')}
                />
              )}

              {selectedSafety !== 'All' && (
                <M3InputChip
                  label={selectedSafety}
                  selected
                  onRemove={() => setSelectedSafety('All')}
                />
              )}

              <div className="ml-auto">
                <M3Button
                  variant="text"
                  size="sm"
                  leadingIcon={<RotateCcw size={13} />}
                  onClick={resetFilters}
                >
                  Clear All
                </M3Button>
              </div>
            </div>
          )}

        </div>

        {/* Results Counter Bar */}
        <div className="mt-5 flex items-center justify-between pb-2.5 border-b border-slate-200">
          <p className="text-xs sm:text-sm font-bold text-slate-700">
            Showing <span className="text-[#0b57d0] font-black">{filteredActivities.length}</span> of {baseActivities.length} {displayName} Experiments
          </p>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            NEP 2020 Hands-On Curriculum
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4.5 mt-5">
          {filteredActivities.map((act, index) => {
            const isSelected = selectedIds.includes(act.id);
            const imageSrc =
              act.image ||
              act.thumbnail_url ||
              CATEGORY_IMAGES[activeSlugKey] ||
              '/images/categories/chemistry.jpg';

            return (
              <div
                key={act.id}
                className={`relative flex flex-col justify-between border rounded-2xl bg-white w-full select-none overflow-hidden cursor-pointer group box-border transition-all duration-300 shadow-[0_2px_12px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_30px_rgba(15,23,42,0.13)] hover:-translate-y-1 ${
                  isSelected ? 'border-[#0b57d0] ring-2 ring-[#0b57d0]/30 shadow-[0_8px_24px_rgba(11,87,208,0.18)]' : 'border-[#dde3ea] hover:border-[#0b57d0]/50'
                }`}
                onClick={() => setActiveModalActivity(act)}
              >
                {/* Top Section: Image and Content Side-by-Side */}
                <div className="flex flex-row items-stretch gap-3 p-3.5">
                  
                  {/* Image on the Left Side */}
                  <div className="w-28 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 relative self-stretch min-h-[96px]">
                    <img
                      src={imageSrc}
                      alt={act.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Time Badge on Image */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/75 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1">
                        <Clock size={9} />
                        {act.duration}
                      </span>
                    </div>
                  </div>

                  {/* Right Content Section */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="space-y-1">
                      {/* Subtle Secondary Category Label */}
                      <span className="text-[10px] font-semibold text-[#0b57d0] block tracking-wide truncate">
                        {act.category}
                      </span>

                      {/* Primary Hero: Bold Prominent Activity Title */}
                      <h3 className="text-[14px] sm:text-[15px] font-bold text-[#1f1f1f] group-hover:text-[#0b57d0] leading-snug transition-colors">
                        {act.title}
                      </h3>

                      {/* Subdued Description */}
                      <p className="text-[11px] text-[#444746] font-normal leading-relaxed line-clamp-2">
                        {act.subtitle || act.description}
                      </p>
                      
                      {/* Concept Tags */}
                      {act.tags && act.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-0.5">
                          {act.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center text-[9px] font-medium text-[#444746] bg-[#eef3fc] px-2 py-0.5 rounded-full border border-[#d3e3fd] transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Full-Width Card Footer using Official Google M3 Components */}
                <div 
                  className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-t border-[#dde3ea] bg-[#f8fafd] rounded-b-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Official M3 AssistChip for Class Badge */}
                  <div className="flex items-center min-w-0">
                    <M3AssistChip
                      label={act.gradeLevel}
                      icon={<GraduationCap className="w-3.5 h-3.5" />}
                    />
                  </div>

                  {/* Official M3 IconButtons & M3Button for Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Like Button */}
                    <M3IconButton
                      variant={likedIds.includes(act.id) ? 'tonal' : 'outlined'}
                      size="sm"
                      selected={likedIds.includes(act.id)}
                      ariaLabel="Like experiment"
                      icon={
                        <Heart
                          size={14}
                          className={likedIds.includes(act.id) ? 'fill-rose-500 text-rose-500' : ''}
                        />
                      }
                      onClick={(e) => toggleLike(e, act.id)}
                    />

                    {/* Share Button */}
                    <M3IconButton
                      variant="outlined"
                      size="sm"
                      ariaLabel="Share experiment"
                      icon={<Share2 size={14} />}
                      onClick={(e) => handleShareActivity(e, act)}
                    />

                    {/* Official M3 Select Button */}
                    <M3Button
                      variant={isSelected ? 'filled' : 'tonal'}
                      size="sm"
                      leadingIcon={isSelected ? <Check size={14} strokeWidth={2.5} /> : undefined}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleToggleSelect(act);
                      }}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </M3Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#dde3ea] mt-6 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#eef3fc] text-[#0b57d0] mx-auto flex items-center justify-center">
              <Search size={22} />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#1f1f1f]">No matching experiments found</h3>
            <p className="text-xs text-[#444746] max-w-md mx-auto">
              We couldn&apos;t find any experiments matching your current filters. Try selecting a different class or chapter.
            </p>
            <div className="pt-1 flex justify-center">
              <M3Button
                variant="filled"
                size="md"
                leadingIcon={<RotateCcw size={15} />}
                onClick={resetFilters}
              >
                Reset All Filters
              </M3Button>
            </div>
          </div>
        )}
      </section>

      {/* ─── 4. Physical Science Kits Banner (Projectokart - Compact Rich Dark Theme) ─── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-12 w-full max-w-full">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0c2340] via-[#123860] to-[#0a467f] p-4 sm:p-6 md:p-7 text-white border border-blue-400/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          
          {/* Subtle Glow Orbs */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-400/15 blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

          {/* Main Content Layout */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
            
            {/* Left Text Section */}
            <div className="space-y-2 sm:space-y-2.5 max-w-xl">
              
              {/* Compact Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-white/15 text-white backdrop-blur-md border border-white/20 shadow-2xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-300" />
                </span>
                <Package size={11} className="text-amber-300" />
                <span>Projectokart Hardware Lab Kits</span>
              </div>

              {/* Heading */}
              <h3 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-white leading-snug">
                Get Physical DIY Experiment Kits for {displayName}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-[13px] text-blue-100/90 font-normal leading-relaxed">
                Order complete lab kits with pre-measured non-toxic reagents, electronic sensors, optical prisms, and ATL tinkering components delivered directly to your school or home.
              </p>

              {/* Action Buttons using Official M3Button */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <M3Button
                  variant="elevated"
                  size="md"
                  trailingIcon={<ArrowRight size={14} />}
                  onClick={() => router.push('/projects')}
                >
                  Browse Projectokart Catalog
                </M3Button>
                <M3Button
                  variant="tonal"
                  size="md"
                  onClick={() => router.push('/materials')}
                >
                  Bulk School Lab Quotation
                </M3Button>
              </div>

            </div>

            {/* Right Highlight Feature Card */}
            <div className="relative z-10 shrink-0 w-full md:w-auto self-stretch md:self-center flex items-center">
              <div className="p-3 sm:p-3.5 bg-white/[0.08] backdrop-blur-md rounded-2xl border border-white/15 shadow-inner space-y-1.5 w-full">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-amber-400/15 border border-amber-400/30 text-[11px] font-bold text-amber-300">
                  <div className="p-0.5 rounded-full bg-amber-400/30 text-amber-300">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span className="tracking-wide">100% Pre-calibrated</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-blue-400/15 border border-blue-400/30 text-[11px] font-bold text-white">
                  <div className="p-0.5 rounded-full bg-blue-400/30 text-blue-200">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span className="tracking-wide">NEP 2020 Teacher Manuals</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-emerald-400/15 border border-emerald-400/30 text-[11px] font-bold text-emerald-300">
                  <div className="p-0.5 rounded-full bg-emerald-400/30 text-emerald-300">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span className="tracking-wide">Instant Pan-India Dispatch</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 5. Compact Google-Style Horizontal STEAM Subjects Swipe Carousel ─── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-10 sm:mt-14 w-full max-w-full">
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#dde3ea] shadow-xs space-y-3.5">
          
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[#dde3ea]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#eef3fc] text-[#0b57d0] flex items-center justify-center shrink-0">
                <Compass size={16} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black text-[#1f1f1f] truncate">
                  Explore Other STEAM Subjects
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#444746] font-medium truncate block">
                  Swipe horizontally to switch between curriculum labs
                </p>
              </div>
            </div>

            <M3Button
              variant="tonal"
              size="sm"
              trailingIcon={<ArrowRight size={13} />}
              onClick={() => router.push('/domain/science')}
            >
              All Subjects ({ALL_SUBJECT_NAV.length})
            </M3Button>
          </div>

          {/* Horizontal Swiper Carousel with Autoplay */}
          <div className="w-full relative">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={10}
              slidesPerView={1.3}
              loop={true}
              speed={600}
              autoplay={{
                delay: 2800,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                480: { slidesPerView: 2.2, spaceBetween: 12 },
                768: { slidesPerView: 3.2, spaceBetween: 14 },
                1024: { slidesPerView: 4.2, spaceBetween: 14 },
                1280: { slidesPerView: 4.8, spaceBetween: 16 },
              }}
              grabCursor={true}
              className="w-full !py-1"
            >
              {ALL_SUBJECT_NAV.map((sub) => {
                const Icon = sub.icon;
                const subSlugKey = sub.slug === 'mathematics' ? 'math' : sub.slug === 'arts' ? 'art' : sub.slug;
                const isCurrent = activeSlugKey === subSlugKey;
                const subjectData = SUBJECTS_DATA[subSlugKey];
                const labCount = subjectData?.activities?.length || 30;
                const bgImg = CATEGORY_IMAGES[subSlugKey] || '/images/categories/chemistry.jpg';

                return (
                  <SwiperSlide key={sub.slug} className="!h-auto">
                    <Link
                      href={`/subject/${sub.slug}`}
                      className={`h-40 sm:h-44 group relative p-3 sm:p-3.5 rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between select-none shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                        isCurrent
                          ? 'border-[#38bdf8] ring-2 ring-[#38bdf8]/50 shadow-md'
                          : 'border-slate-800/20 hover:border-white/50'
                      }`}
                    >
                      {/* Full Card Background Image */}
                      <img
                        src={bgImg}
                        alt={sub.name}
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />

                      {/* Multi-stage Dark Gradient Overlay for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/30 group-hover:via-slate-950/50 transition-all duration-300 pointer-events-none" />

                      {/* Top Row: Icon + Lab Count Badge (Over Image) */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110 ${
                            isCurrent
                              ? 'bg-blue-600/90 text-white border border-blue-400/40 shadow-sm'
                              : 'bg-white/20 text-white border border-white/30'
                          }`}
                        >
                          <Icon size={16} className="text-white" />
                        </div>

                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full backdrop-blur-md border ${
                            isCurrent
                              ? 'bg-blue-600 text-white border-blue-400/40 shadow-xs'
                              : 'bg-black/40 text-white/90 border-white/20'
                          }`}
                        >
                          {labCount} Labs
                        </span>
                      </div>

                      {/* Bottom Row: Subject Name + Tagline + Explore / Current Indicator (Over Image) */}
                      <div className="relative z-10 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs sm:text-[13px] font-black text-white truncate drop-shadow-sm group-hover:text-blue-200 transition-colors">
                            {sub.name}
                          </h4>
                          <div
                            className={`flex items-center gap-1 text-[10px] font-bold shrink-0 ${
                              isCurrent ? 'text-amber-300' : 'text-blue-200 group-hover:text-white group-hover:translate-x-0.5 transition-transform'
                            }`}
                          >
                            <span>{isCurrent ? 'Current' : 'Explore'}</span>
                            <ArrowRight size={10} />
                          </div>
                        </div>

                        <p className="text-[10px] sm:text-[11px] line-clamp-1 text-slate-200/90 font-medium drop-shadow-xs">
                          {subjectData?.tagline || 'Experiential NEP 2020 Labs'}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

        </div>
      </section>

      {/* ─── 5. Dynamic Filter Sheet (Google "Refine results" Left Side Drawer) ─── */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsFilterSheetOpen(false)}
          />

          {/* Sheet Container: Half-screen on mobile (~58vw / 250-280px), compact Google panel on tablet/desktop */}
          <div className="fixed inset-y-0 left-0 right-auto w-[62vw] xs:w-[270px] sm:w-[310px] md:w-[340px] max-w-[85vw] h-full bg-white shadow-2xl flex flex-col z-50 rounded-r-2xl border-r border-slate-200 overflow-hidden box-border animate-in slide-in-from-left duration-300">
            
            {/* Google Refine Results Header */}
            <div className="px-3.5 py-3 border-b border-[#dde3ea] flex items-center justify-between shrink-0 bg-[#f8fafd]">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-[#1f1f1f] tracking-tight truncate">Refine results</h2>
                {activeFilterCount > 0 && (
                  <M3Badge count={activeFilterCount} />
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {activeFilterCount > 0 && (
                  <M3Button
                    variant="text"
                    size="sm"
                    onClick={resetFilters}
                  >
                    Clear
                  </M3Button>
                )}
                <M3IconButton
                  variant="standard"
                  size="sm"
                  ariaLabel="Close refine results"
                  icon={<X size={15} />}
                  onClick={() => setIsFilterSheetOpen(false)}
                />
              </div>
            </div>

            {/* Google Refine Results Body Scrollable */}
            <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-4 no-scrollbar divide-y divide-slate-100">
              
              {/* 0. Sort Order Group */}
              <div className="pt-1 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ArrowUpDown size={13} className="text-[#006fcc]" /> Sort By
                  </span>
                  {selectedSort !== 'popularity' && (
                    <button onClick={() => setSelectedSort('popularity')} className="text-[10px] text-blue-600 hover:underline font-bold">Reset</button>
                  )}
                </div>
                <div className="space-y-0.5">
                  {SORT_OPTIONS.map((opt) => {
                    const isActive = selectedSort === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelectedSort(opt.value)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                          isActive 
                            ? 'bg-blue-50/80 text-[#006fcc] font-bold' 
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                            isActive 
                              ? 'border-[#006fcc] bg-[#006fcc]' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="truncate">{opt.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1. Class / Grade Group */}
              <div className="pt-3 space-y-1.5">
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <GraduationCap size={13} className="text-[#006fcc]" /> Class / Grade
                  </span>
                  {selectedClass !== 'All' && (
                    <button onClick={() => setSelectedClass('All')} className="text-[10px] text-slate-400 hover:text-red-500 font-medium">Clear</button>
                  )}
                </div>
                <div className="space-y-0.5">
                  {CLASS_OPTIONS.map((c) => {
                    const isActive = selectedClass === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setSelectedClass(isActive && c.value !== 'All' ? 'All' : c.value)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                          isActive 
                            ? 'bg-blue-50/80 text-[#006fcc] font-bold' 
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                            isActive 
                              ? 'bg-[#006fcc] border-[#006fcc] text-white' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isActive && <Check size={10} strokeWidth={3} />}
                          </span>
                          <span className="truncate">{c.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Chapter / Category Group */}
              <div className="pt-3 space-y-1.5">
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen size={13} className="text-[#006fcc]" /> Chapter / Category
                  </span>
                  {selectedChapter !== 'All' && (
                    <button onClick={() => setSelectedChapter('All')} className="text-[10px] text-slate-400 hover:text-red-500 font-medium">Clear</button>
                  )}
                </div>
                <div className="space-y-0.5 max-h-48 overflow-y-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setSelectedChapter('All')}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      selectedChapter === 'All' 
                        ? 'bg-blue-50/80 text-[#006fcc] font-bold' 
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                        selectedChapter === 'All' 
                          ? 'bg-[#006fcc] border-[#006fcc] text-white' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {selectedChapter === 'All' && <Check size={10} strokeWidth={3} />}
                      </span>
                      <span>All Chapters</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{subject.activities.length}</span>
                  </button>

                  {dynamicChapters.map((ch) => {
                    const isActive = selectedChapter === ch.name;
                    return (
                      <button
                        key={ch.name}
                        type="button"
                        onClick={() => setSelectedChapter(isActive ? 'All' : ch.name)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left gap-1.5 ${
                          isActive 
                            ? 'bg-blue-50/80 text-[#006fcc] font-bold' 
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                            isActive 
                              ? 'bg-[#006fcc] border-[#006fcc] text-white' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isActive && <Check size={10} strokeWidth={3} />}
                          </span>
                          <span className="truncate">{ch.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">({ch.count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Concept / Topic Tag Group */}
              <div className="pt-3 space-y-1.5">
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#006fcc]" /> Concept / Tag
                  </span>
                  {selectedTopic !== 'All' && (
                    <button onClick={() => setSelectedTopic('All')} className="text-[10px] text-slate-400 hover:text-red-500 font-medium">Clear</button>
                  )}
                </div>
                <div className="space-y-0.5 max-h-40 overflow-y-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setSelectedTopic('All')}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      selectedTopic === 'All' 
                        ? 'bg-blue-50/80 text-[#006fcc] font-bold' 
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                        selectedTopic === 'All' 
                          ? 'bg-[#006fcc] border-[#006fcc] text-white' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {selectedTopic === 'All' && <Check size={10} strokeWidth={3} />}
                      </span>
                      <span>All Topics</span>
                    </div>
                  </button>

                  {dynamicTopics.map((tp) => {
                    const isActive = selectedTopic === tp.name;
                    return (
                      <button
                        key={tp.name}
                        type="button"
                        onClick={() => setSelectedTopic(isActive ? 'All' : tp.name)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left gap-1.5 ${
                          isActive 
                            ? 'bg-blue-50/80 text-[#006fcc] font-bold' 
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                            isActive 
                              ? 'bg-[#006fcc] border-[#006fcc] text-white' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isActive && <Check size={10} strokeWidth={3} />}
                          </span>
                          <span className="truncate">{tp.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">({tp.count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Difficulty Group */}
              <div className="pt-3 space-y-1.5">
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Zap size={13} className="text-[#006fcc]" /> Difficulty
                  </span>
                  {selectedDifficulty !== 'All' && (
                    <button onClick={() => setSelectedDifficulty('All')} className="text-[10px] text-slate-400 hover:text-red-500 font-medium">Clear</button>
                  )}
                </div>
                <div className="space-y-0.5">
                  {DIFFICULTY_FILTERS.map((diff) => {
                    const isActive = selectedDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setSelectedDifficulty(isActive && diff !== 'All' ? 'All' : diff)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                          isActive 
                            ? 'bg-blue-50/80 text-[#006fcc] font-bold' 
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                            isActive 
                              ? 'border-[#006fcc] bg-[#006fcc]' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span>{diff === 'All' ? 'All Levels' : diff}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Duration Group */}
              <div className="pt-3 space-y-1.5">
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock size={13} className="text-[#006fcc]" /> Duration
                  </span>
                  {selectedDuration !== 'All' && (
                    <button onClick={() => setSelectedDuration('All')} className="text-[10px] text-slate-400 hover:text-red-500 font-medium">Clear</button>
                  )}
                </div>
                <div className="space-y-0.5">
                  {DURATION_FILTERS.map((dur) => {
                    const isActive = selectedDuration === dur.value;
                    return (
                      <button
                        key={dur.value}
                        type="button"
                        onClick={() => setSelectedDuration(isActive && dur.value !== 'All' ? 'All' : dur.value)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                          isActive 
                            ? 'bg-blue-50/80 text-[#006fcc] font-bold' 
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                            isActive 
                              ? 'border-[#006fcc] bg-[#006fcc]' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="truncate">{dur.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Environment & Safety Group */}
              <div className="pt-3 space-y-1.5">
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Shield size={13} className="text-[#006fcc]" /> Safety & Setting
                  </span>
                  {selectedSafety !== 'All' && (
                    <button onClick={() => setSelectedSafety('All')} className="text-[10px] text-slate-400 hover:text-red-500 font-medium">Clear</button>
                  )}
                </div>
                <div className="space-y-0.5">
                  {SAFETY_FILTERS.map((safe) => {
                    const isActive = selectedSafety === safe.value;
                    return (
                      <button
                        key={safe.value}
                        type="button"
                        onClick={() => setSelectedSafety(isActive && safe.value !== 'All' ? 'All' : safe.value)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                          isActive 
                            ? 'bg-blue-50/80 text-[#006fcc] font-bold' 
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                            isActive 
                              ? 'border-[#006fcc] bg-[#006fcc]' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="truncate">{safe.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Google Refine Results Sticky Footer */}
            <div className="p-3 border-t border-[#dde3ea] bg-[#f8fafd] flex items-center gap-2 shrink-0">
              <M3Button
                variant="outlined"
                size="md"
                fullWidth
                disabled={activeFilterCount === 0}
                onClick={resetFilters}
              >
                Clear all
              </M3Button>

              <M3Button
                variant="filled"
                size="md"
                fullWidth
                onClick={() => {
                  setIsFilterSheetOpen(false);
                  const el = document.getElementById('experiments-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Apply ({filteredActivities.length})
              </M3Button>
            </div>

          </div>
        </div>
      )}

      {/* ─── 6. Activity Details Draggable Bottom Sheet Drawer ─── */}
      {activeModalActivity && (
        <ExperimentDetailModal
          activity={activeModalActivity}
          onClose={() => setActiveModalActivity(null)}
          accentColor={subject.accentColor}
          relatedPool={baseActivities}
        />
      )}

      {/* ─── 7. Share & Action Floating Toast Notification ─── */}
      {shareToastText && (
        <div className="fixed bottom-6 right-6 z-[1100] bg-slate-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check size={14} className="text-emerald-400 shrink-0" />
          <span>{shareToastText}</span>
        </div>
      )}
    </div>
  );
}
