'use client';
import Link from 'next/link';
import { ChevronDown, Menu, X, ArrowRight, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavVisibility } from '@/contexts/NavigationContext';
import { M3Button, M3IconButton, M3AssistChip } from '@/components/google-ui';

/* ─── Types ─────────────────────────────────────── */
export interface SubMenuItem {
  label: string;
  to: string;
  desc?: string;
  badge?: string;
}

export interface DropdownLinkItem {
  label: string;
  to: string;
  desc: string;
  subItems?: SubMenuItem[];
}

export interface DropdownColumn {
  categoryTitle: string;
  items: DropdownLinkItem[];
}

export interface FeaturedPanel {
  eyebrow: string;
  title: string;
  desc: string;
  ctaText: string;
  ctaHref: string;
}

export interface NavItem {
  id?: string;
  label: string;
  to?: string;
  enabled?: boolean;
  hasDropdown?: boolean;
  columns?: DropdownColumn[] | any[];
  featuredPanel?: FeaturedPanel;
}

/* ─── Minimal, High-Impact Experiential Learning Menus with Subcategories ─── */
const navItems: NavItem[] = [
  {
    label: 'Experiential Labs',
    hasDropdown: true,
    columns: [
      {
        categoryTitle: 'Experiential Science Labs',
        items: [
          {
            label: 'Physics Lab',
            to: '/subject/physics',
            desc: 'Optics, mechanics, electromagnetic circuits, sound & modern physics practicals.',
            subItems: [
              { label: 'Mechanics, Pendulums & Dynamics', to: '/subject/physics' },
              { label: 'Optics, Ray Benches & Prisms', to: '/subject/physics' },
              { label: 'Electricity & Electromagnetic Circuits', to: '/subject/physics' },
            ],
          },
          {
            label: 'Chemistry Lab',
            to: '/subject/chemistry',
            desc: 'Volumetric titration benches, organic synthesis, reagents & salt analysis.',
            subItems: [
              { label: 'Volumetric Titration Benches', to: '/subject/chemistry' },
              { label: 'Qualitative Salt Analysis', to: '/subject/chemistry' },
              { label: 'Chemical Reagents & Glassware', to: '/materials' },
            ],
          },
          {
            label: 'Biology Lab',
            to: '/subject/biology',
            desc: 'High-precision microscopy, human anatomy models, cell biology & botany specimens.',
            subItems: [
              { label: 'Compound Microscopes & Slides', to: '/subject/biology' },
              { label: 'Human Anatomy 3D Models', to: '/subject/biology' },
              { label: 'Specimen Slides & Botany Kits', to: '/subject/biology' },
            ],
          },
          {
            label: 'Astronomy Lab',
            to: '/domain/science',
            desc: 'Telescopes, celestial mechanics, planetary orbits & space science models.',
            subItems: [
              { label: 'Refractor & Reflector Telescopes', to: '/domain/science' },
              { label: 'Planetary Orbits & Scale Models', to: '/domain/science' },
            ],
          },
          {
            label: 'Mathematics & Modeling Lab',
            to: '/domain/science',
            desc: 'Tactile geometry, conic sections, coordinate visualizers & practical proofs.',
            subItems: [
              { label: 'Tactile 3D Conics & Surfaces', to: '/domain/science' },
              { label: 'Coordinate Geometry Visualizers', to: '/domain/science' },
            ],
          },
        ],
      },
      {
        categoryTitle: 'Turnkey Setups & Tinkering',
        items: [
          {
            label: 'Atal Tinkering Lab (ATL 2.0)',
            to: '/steam-lab/atl',
            desc: 'Complete NITI Aayog Package 1-4 setup with GeM compliance, 3D printers & robotics.',
            subItems: [
              { label: 'ATL Material List & Equipment BOQ', to: '/steam-lab/atl', badge: 'Equipment List' },
              { label: 'Package 1 & 2: Prototyping & 3D Printers', to: '/steam-lab/atl' },
              { label: 'Package 3 & 4: Robotics, IoT & Power Tools', to: '/steam-lab/atl' },
              { label: 'NITI Aayog & GeM Compliance Norms', to: '/schemes/atl-grants' },
            ],
          },
          {
            label: 'CBSE Composite Science Lab',
            to: '/composite-lab',
            desc: 'Mandatory SARAS 600 sq ft & 8 sinks setup with 49 non-consumables & safety fixtures.',
            subItems: [
              { label: '49 Mandatory Non-Consumable List', to: '/composite-lab', badge: 'CBSE Norms' },
              { label: '600 Sq Ft Layout & 8 Sinks Blueprint', to: '/composite-lab' },
              { label: 'SARAS Lab Safety & First Aid Setup', to: '/safety' },
            ],
          },
          {
            label: 'AI, IoT & Robotics Lab',
            to: '/steam-lab/ai-robotics-lab',
            desc: 'Workstations, microcontrollers, computer vision & sensor labs for students.',
            subItems: [
              { label: 'Microcontrollers & Sensor Workstations', to: '/steam-lab/ai-robotics-lab' },
              { label: 'Computer Vision & Autonomous Robotics', to: '/steam-lab/ai-robotics-lab' },
            ],
          },
          {
            label: 'Hands-on Practical Kits',
            to: '/hands-on-experiments',
            desc: 'Blended practicals with physical apparatus kits, data sheets & guided manuals.',
            subItems: [
              { label: 'Student DIY Science Practical Benches', to: '/hands-on-experiments' },
              { label: 'Observation Workbooks & Manuals', to: '/hands-on-experiments' },
            ],
          },
          {
            label: 'Projectokart STEM Projects',
            to: '/projects',
            desc: 'Student-led maker projects with schematics, bill of materials & working builds.',
            subItems: [
              { label: 'Working Science Fair Prototypes', to: '/projects' },
              { label: 'Innovation Schematics & BOM', to: '/projects' },
            ],
          },
        ],
      },
    ],
    featuredPanel: {
      eyebrow: 'Turnkey Laboratory',
      title: 'CBSE Composite Science Lab & ATL 2.0 Setup for Schools',
      desc: 'Complete turnkey room blueprint, 8 sinks layout, 49 mandatory apparatus list, GeM registered equipment, and teacher onboarding.',
      ctaText: 'Explore Lab Setups',
      ctaHref: '/composite-lab',
    },
  },
  {
    label: 'Why CSEEL',
    hasDropdown: true,
    columns: [
      {
        categoryTitle: 'Experiential Pedagogy',
        items: [
          {
            label: 'Capabilities & Pedagogy',
            to: '/why-cseel',
            desc: 'Experiential learning architecture & hands-on practical methodology aligned with NEP 2020.',
          },
          {
            label: 'Proven Academic Efficacy',
            to: '/why-cseel',
            desc: 'See how experiential practical rehearsals boost bench confidence and practical exam scores.',
          },
          {
            label: 'Lab Safety & Compliance',
            to: '/safety',
            desc: 'Safe trial-and-error exploration with standard emergency protocols and zero chemical risk.',
          },
          {
            label: 'School Plans & Packages',
            to: '/compare-plans',
            desc: 'Institutional packages, syllabus bundles & turnkey setup options for every school.',
          },
        ],
      },
      {
        categoryTitle: 'Who It\'s For',
        items: [
          {
            label: 'For School Educators',
            to: '/for-educators',
            desc: 'Hands-on lesson plans, teacher guides, practical rubrics & student assessment tools.',
          },
          {
            label: 'For K-12 Students',
            to: '/for-students',
            desc: 'Experiential practical clarity, tactile discovery & concept mastery at student pace.',
          },
          {
            label: 'For School Principals',
            to: '/for-institutions',
            desc: 'Infrastructure audits, GeM procurement, SARAS compliance & faculty enablement.',
          },
          {
            label: 'NEP 2020 Practical Framework',
            to: '/schemes/nep-2020-guidelines',
            desc: 'Fully aligned to national experiential learning norms and skill education guidelines.',
          },
        ],
      },
    ],
    featuredPanel: {
      eyebrow: 'School Case Study',
      title: 'How Partner Schools Transformed Practical Exam Scores by 34%',
      desc: 'See how hands-on experiential lab setups boosted student participation, safety compliance, and conceptual exam scores.',
      ctaText: 'Read the Case Study',
      ctaHref: '/why-cseel',
    },
  },
  {
    label: 'Resources',
    to: '/resources',
    hasDropdown: true,
    columns: [
      {
        categoryTitle: 'Government Schemes & Policy',
        items: [
          {
            label: 'Government Schemes Hub',
            to: '/schemes',
            desc: 'Central & State funding grants, GeM procurement blueprints & lab compliance.',
            subItems: [
              { label: 'PM SHRI Schools Lab Grant', to: '/schemes/pm-shri', badge: 'Govt Grant' },
              { label: 'NITI Aayog ATL ₹20 Lakh Grant', to: '/schemes/atl-grants' },
              { label: 'Samagra Shiksha Secondary Lab Norms', to: '/schemes/samagra-shiksha' },
              { label: 'CBSE Skill Hub Initiative', to: '/schemes/cbse-skill-hub' },
            ],
          },
          {
            label: 'PM SHRI Schools Scheme',
            to: '/schemes/pm-shri',
            desc: 'Funding for modern experiential composite science laboratories in model schools.',
          },
          {
            label: 'Samagra Shiksha Abhiyan',
            to: '/schemes/samagra-shiksha',
            desc: 'Secondary school science lab infrastructure & apparatus annual allocation.',
          },
          {
            label: 'Atal Tinkering Lab (ATL Grants)',
            to: '/schemes/atl-grants',
            desc: 'NITI Aayog ₹20 Lakh package equipment, 3D printers & GeM registration.',
          },
          {
            label: 'NEP 2020 Practical Framework',
            to: '/schemes/nep-2020-guidelines',
            desc: 'National curriculum framework for experiential learning & practical-first education.',
          },
        ],
      },
      {
        categoryTitle: 'Materials, Manuals & Insights',
        items: [
          {
            label: 'Material Cart & Lab Supplies',
            to: '/materials',
            desc: 'Lab glassware, chemical reagents, biology specimens, DIY kits & cart checkout.',
            subItems: [
              { label: 'ATL Package 1-4 Material List', to: '/materials', badge: 'ATL Material' },
              { label: 'CBSE Composite Apparatus List', to: '/materials' },
              { label: 'Chemical Reagents & Glassware', to: '/materials' },
              { label: 'Open Material Cart', to: '/cart', badge: 'Cart' },
            ],
          },
          {
            label: 'Lab Manuals & Practical Guides',
            to: '/hands-on-experiments',
            desc: 'Step-by-step practical experiment procedures, safety SOPs & teacher guides.',
            subItems: [
              { label: 'Class 9-10 Composite Science Manual', to: '/hands-on-experiments' },
              { label: 'Class 11-12 Physics Practical SOPs', to: '/hands-on-experiments' },
              { label: 'Class 11-12 Chemistry Salt Analysis', to: '/hands-on-experiments' },
              { label: 'Biology Microscopy & Specimen Guides', to: '/hands-on-experiments' },
            ],
          },
          {
            label: 'Academic Blog & Articles',
            to: '/blog',
            desc: 'Expert guides on experiential STEM pedagogy, lab safety, and CBSE practical exams.',
            subItems: [
              { label: 'Experiential STEM Pedagogy Research', to: '/blog' },
              { label: 'GeM Portal Procurement Masterclass', to: '/blog' },
              { label: '600 Sq Ft Lab Floorplan Compliance', to: '/blog' },
            ],
          },
          {
            label: 'Teacher CPD & Safety Guidelines',
            to: '/teacher-training',
            desc: 'Faculty development masterclasses, emergency SOPs, and lab compliance training.',
            subItems: [
              { label: 'Lab In-charge Safety Standards', to: '/safety' },
              { label: 'Faculty Experiential Masterclasses', to: '/teacher-training' },
            ],
          },
        ],
      },
    ],
    featuredPanel: {
      eyebrow: 'Government Lab Grants',
      title: 'Avail PM SHRI & ATL Grants for Your School Lab Setup',
      desc: 'Download GeM procurement documentation, equipment BOQs, and compliance blueprints for government scheme approvals.',
      ctaText: 'Explore Schemes & Resources',
      ctaHref: '/resources',
    },
  },
  {
    label: 'Media & Gallery',
    hasDropdown: true,
    columns: [
      {
        categoryTitle: 'Visual Lab Showcase',
        items: [
          {
            label: '360° Interactive Lab Tour',
            to: '/virtual-lab-tour',
            desc: 'Take an interactive 360-degree walkthrough inside our modern composite school laboratories.',
          },
          {
            label: 'School Lab Installations',
            to: '/media-archive',
            desc: 'High-resolution photo gallery of real composite labs, ATL centers & furniture setups.',
          },
          {
            label: 'Video Walkthroughs & Demos',
            to: '/media-archive',
            desc: 'Watch student practical videos, apparatus demonstrations & turnkey lab walkthroughs.',
          },
          {
            label: 'News & Media Press Updates',
            to: '/media-archive',
            desc: 'School lab inaugurations, national STEM conclaves & latest press coverage.',
          },
        ],
      },
      {
        categoryTitle: 'Events & Activities',
        items: [
          {
            label: 'Events & Exhibitions Gallery',
            to: '/exhibitions',
            desc: 'Photos and highlights from national science exhibitions, inter-school fairs & hackathons.',
          },
          {
            label: 'Teacher Training Glimpses',
            to: '/teacher-training',
            desc: 'Moments from faculty development masterclasses, lab safety workshops & certifications.',
          },
          {
            label: 'Student Innovation Builds',
            to: '/projects',
            desc: 'Working student prototypes, science fair models, and award-winning student projects.',
          },
        ],
      },
    ],
    featuredPanel: {
      eyebrow: 'Interactive Experience',
      title: 'Take the 360° Experiential Lab Tour',
      desc: 'Explore a turnkey 600 sq ft composite school laboratory equipped with mandatory apparatus and student benches.',
      ctaText: 'Launch 360° Tour',
      ctaHref: '/virtual-lab-tour',
    },
  },
  {
    label: 'About & Network',
    hasDropdown: true,
    columns: [
      {
        categoryTitle: 'Verified EduNetwork',
        items: [
          {
            label: 'EduNetwork Directory',
            to: '/edu-network/organisation/school',
            desc: 'India’s verified network of 500+ experiential STEM partner schools & lab hubs.',
          },
          {
            label: 'Verified Faculty Directory',
            to: '/edu-network/teachers',
            desc: 'Connect with certified STEM teachers, ATL mentors, and lab demonstrators nationwide.',
          },
          {
            label: 'Teacher Training & CPD',
            to: '/teacher-training',
            desc: 'Certified masterclasses in experiential science pedagogy and practical lab leadership.',
          },
          {
            label: 'Seminars & Student Bootcamps',
            to: '/workshops',
            desc: 'Hands-on student workshops, robotics bootcamps, and curriculum advisory seminars.',
          },
        ],
      },
      {
        categoryTitle: 'Our Organization',
        items: [
          {
            label: 'About CSEEL',
            to: '/about',
            desc: 'Our mission to bring experiential hands-on science to every learner across India.',
          },
          {
            label: 'Our Story & Journey',
            to: '/our-story',
            desc: 'How CSEEL grew from an educational pilot into a nationwide experiential learning movement.',
          },
          {
            label: 'Leadership & Advisory Team',
            to: '/team',
            desc: 'The passionate educators, scientists, and engineers leading CSEEL.',
          },
          {
            label: 'Careers at CSEEL',
            to: '/careers',
            desc: 'Join our team as we empower students across India with hands-on practical science.',
          },
          {
            label: 'Contact Us & Lab Advisory',
            to: '/contact-us',
            desc: 'Speak with our school consultants, lab setup specialists, or request a site inspection.',
          },
        ],
      },
    ],
    featuredPanel: {
      eyebrow: 'Partner With Us',
      title: 'Setup a Modern Experiential Lab in Your School',
      desc: 'Get turnkey guidance on CBSE affiliation, room layout, GeM procurement, and teacher certification.',
      ctaText: 'Contact Lab Advisors',
      ctaHref: '/contact-us',
    },
  },
];

/* ─── Main Component ─────────────────────────────── */
const Navbar = () => {
  const { navCategories } = useNavVisibility();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedSubItem, setExpandedSubItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile multi-open state: prevents abrupt jumps and preserves scroll position
  const [openMobileCategories, setOpenMobileCategories] = useState<string[]>([]);
  const [openMobileSubItems, setOpenMobileSubItems] = useState<string[]>([]);

  const toggleMobileCategory = (label: string) => {
    setOpenMobileCategories((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const toggleMobileSubItem = (key: string) => {
    setOpenMobileSubItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Read dynamic categories from NavigationContext (with fallback to default)
  const visibleNavItems: any[] = ((navCategories && navCategories.length > 0 ? navCategories : navItems) as any[]).filter(
    (item) => item?.enabled !== false
  );

  const headerRef = useRef<HTMLElement | null>(null);

  const clearTimers = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // 3. Clicking anywhere outside the menu automatically closes it
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        clearTimers();
        setOpenDropdown(null);
        setExpandedSubItem(null);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      clearTimers();
    };
  }, []);

  // 1. Hovering over menu text requires a 300ms delay before opening (prevents accidental flicker)
  const handleMouseEnter = (label: string) => {
    clearTimers();
    openTimer.current = setTimeout(() => {
      setOpenDropdown((prev) => {
        if (prev !== label) setExpandedSubItem(null);
        return label;
      });
    }, 300);
  };

  // 4. Leaving the menu area waits 380ms before closing (prevents accidental closure if mouse slips out)
  const handleMouseLeave = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => {
      setOpenDropdown(null);
      setExpandedSubItem(null);
    }, 380);
  };

  // 2. Clicking the menu button toggles the menu open/closed instantly
  const handleToggle = (label: string) => {
    clearTimers();
    setOpenDropdown((prev) => {
      if (prev !== label) setExpandedSubItem(null);
      return prev === label ? null : label;
    });
  };

  const activeItem = visibleNavItems.find((item) => item.label === openDropdown);

  return (
    <>
      <header
        ref={headerRef}
        id="site-navbar"
        className={`site-navbar sticky top-0 w-full z-[400] transition-all duration-200 select-none bg-white border-b border-[rgba(0,0,0,0.12)] ${
          isScrolled
            ? 'shadow-[0_4px_5px_0_rgba(0,0,0,0.14),0_1px_10px_0_rgba(0,0,0,0.12),0_2px_4px_-1px_rgba(0,0,0,0.2)]'
            : ''
        }`}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Main Navbar Bar (64px Height matching Google Search Console) ── */}
        <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between px-3 sm:px-6 h-16">

          {/* Brand Logo */}
          <Link
            href="/"
            aria-label="CSEEL - Home"
            className="flex items-center hover:opacity-95 transition-opacity shrink-0 mr-2 xl:mr-5"
          >
            <img
              src="/images/cseel-logo.png"
              alt="CSEEL - Centre for Scientific Exploration & Experiential Learning"
              width={140}
              height={40}
              className="h-8 xl:h-10 w-auto object-contain shrink-0"
            />
          </Link>

          {/* Center Desktop Navigation: STRICTLY SINGLE LINE (Official M3 State Layer Pills) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-2 h-full flex-nowrap shrink-0">
            {visibleNavItems.map((item) => {
              const isOpen = openDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="flex items-center shrink-0"
                >
                  {item.hasDropdown ? (
                    <button
                      type="button"
                      onClick={() => handleToggle(item.label)}
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                      className={`top-nav-link flex items-center gap-1 xl:gap-1.5 text-[13px] xl:text-[14px] font-semibold transition-all duration-200 ease-in-out cursor-pointer whitespace-nowrap shrink-0 h-9 xl:h-10 px-2 xl:px-3 rounded-full active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] ${
                        isOpen
                          ? 'is-open text-[#001d35] bg-[#c2e7ff]'
                          : 'text-[#1f1f1f] hover:bg-[#1f1f1f]/[0.08]'
                      }`}
                    >
                      <span className="whitespace-nowrap">
                        {item.label}
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 xl:h-4 xl:w-4 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#001d35]' : 'text-[#444746]'
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.to || '/'}
                      onMouseEnter={handleMouseLeave}
                      className="top-nav-link inline-flex items-center text-[13px] xl:text-[14px] font-semibold text-[#1f1f1f] transition-all duration-200 ease-in-out whitespace-nowrap shrink-0 h-9 xl:h-10 px-2 xl:px-3 rounded-full hover:bg-[#1f1f1f]/[0.08] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0]"
                    >
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Far Right Action Buttons (Responsive width to prevent cut-off on laptop viewports) */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 shrink-0 flex-nowrap ml-1.5 xl:ml-4">
            <Link href="/schools?view=map" className="shrink-0">
              <M3Button
                variant="tonal"
                size="sm"
                className="h-8 xl:h-9 text-xs xl:text-sm px-2.5 xl:px-4 font-semibold"
                leadingIcon={<MapPin className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-[#001d35]" />}
              >
                Find School
              </M3Button>
            </Link>

            <Link href="/contact-us" className="shrink-0">
              <M3Button
                variant="filled"
                size="sm"
                className="h-8 xl:h-9 text-xs xl:text-sm px-3 xl:px-4 font-semibold"
                trailingIcon={<ArrowRight className="w-3.5 h-3.5 xl:w-4 xl:h-4" />}
              >
                Get a Demo
              </M3Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button (Official M3IconButton) */}
          <div className="lg:hidden">
            <M3IconButton
              ariaLabel="Toggle navigation menu"
              variant="standard"
              size="md"
              icon={mobileOpen ? <X className="h-6 w-6 text-[#1f1f1f]" /> : <Menu className="h-6 w-6 text-[#1f1f1f]" />}
              onClick={() => setMobileOpen(!mobileOpen)}
            />
          </div>
        </div>

        {/* ── FULL-WIDTH MEGA DROPDOWN (STANDARD CLEAN TYPOGRAPHY & ZERO SCROLL) ── */}
        {activeItem && activeItem.columns && (
          <div
            className="hidden lg:block absolute top-full left-0 w-full bg-white border-b border-[#E8E9E9] shadow-[0_20px_40px_-10px_rgba(0,28,51,0.08)] z-[450] animate-in fade-in duration-150"
            onMouseEnter={clearTimers}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5">
              <div className="grid grid-cols-12 gap-6 items-start">

                {/* Left Zone: 2 Columns with Vertical Divider (8 cols) */}
                <div className="col-span-8 pr-4 relative">
                  <div className="grid grid-cols-2 gap-8 relative">

                    {/* Column 1 */}
                    <div className="space-y-3">
                      {activeItem.columns[0] && (
                        <>
                          <div className="pb-1 border-b border-gray-100">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006FCC] block">
                              {activeItem.columns[0].categoryTitle}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {activeItem.columns[0].items.map((sub, idx) => {
                              const isSubExpanded = expandedSubItem === sub.label;
                              const hasSub = Boolean(sub.subItems && sub.subItems.length > 0);

                              return (
                                <div key={idx} className="group/item pb-1.5 transition-all">
                                  <div className="flex items-start justify-between gap-2">
                                    <Link
                                      href={sub.to}
                                      onClick={() => setOpenDropdown(null)}
                                      className="group block flex-1"
                                    >
                                      <div className="flex items-center gap-1.5">
                                        <h5 className="nav-menu-item-title text-[13.5px] font-semibold leading-tight text-[#023858] group-hover:text-[#006FCC] transition-colors">
                                          {sub.label}
                                        </h5>
                                        <ArrowRight className="w-3 h-3 text-[#006FCC] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 shrink-0" />
                                      </div>
                                      <p className="text-[11.5px] text-[#5F6265] leading-[1.4] mt-0.5 font-normal line-clamp-2">
                                        {sub.desc}
                                      </p>
                                    </Link>

                                    {hasSub && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setExpandedSubItem(isSubExpanded ? null : sub.label);
                                        }}
                                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                                          isSubExpanded
                                            ? 'bg-[#006FCC] text-white shadow-2xs'
                                            : 'bg-[#EDF5FA] text-[#006FCC] hover:bg-[#DDECF6]'
                                        }`}
                                        title="Toggle Subcategories"
                                      >
                                        <span>{isSubExpanded ? 'Hide' : `${sub.subItems!.length} Sub-links`}</span>
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSubExpanded ? 'rotate-180' : ''}`} />
                                      </button>
                                    )}
                                  </div>

                                  {/* Submenu List */}
                                  {hasSub && isSubExpanded && (
                                    <div className="mt-1.5 ml-1 pl-2.5 border-l-2 border-[#006FCC] space-y-0.5 bg-[#F8FAFD] p-2 rounded-r-lg animate-in fade-in slide-in-from-top-1 duration-150">
                                      <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#006FCC] px-1 py-0.5">
                                        Subcategories & Material Lists
                                      </div>
                                      {sub.subItems!.map((child, cIdx) => (
                                        <Link
                                          key={cIdx}
                                          href={child.to}
                                          onClick={() => setOpenDropdown(null)}
                                          className="flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-white text-[11.5px] font-medium text-[#023858] hover:text-[#006FCC] transition-colors group/child"
                                        >
                                          <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#006FCC]/60 group-hover/child:bg-[#006FCC] group-hover/child:scale-125 transition-all" />
                                            <span>{child.label}</span>
                                          </div>
                                          {child.badge && (
                                            <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-white text-[#006FCC] border border-[#006FCC]/20">
                                              {child.badge}
                                            </span>
                                          )}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Vertical Divider Line */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#E8E9E9]" />

                    {/* Column 2 */}
                    <div className="space-y-3 pl-4">
                      {activeItem.columns[1] && (
                        <>
                          <div className="pb-1 border-b border-gray-100">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006FCC] block">
                              {activeItem.columns[1].categoryTitle}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {activeItem.columns[1].items.map((sub, idx) => {
                              const isSubExpanded = expandedSubItem === sub.label;
                              const hasSub = Boolean(sub.subItems && sub.subItems.length > 0);

                              return (
                                <div key={idx} className="group/item pb-1.5 transition-all">
                                  <div className="flex items-start justify-between gap-2">
                                    <Link
                                      href={sub.to}
                                      onClick={() => setOpenDropdown(null)}
                                      className="group block flex-1"
                                    >
                                      <div className="flex items-center gap-1.5">
                                        <h5 className="nav-menu-item-title text-[13.5px] font-semibold leading-tight text-[#023858] group-hover:text-[#006FCC] transition-colors">
                                          {sub.label}
                                        </h5>
                                        <ArrowRight className="w-3 h-3 text-[#006FCC] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 shrink-0" />
                                      </div>
                                      <p className="text-[11.5px] text-[#5F6265] leading-[1.4] mt-0.5 font-normal line-clamp-2">
                                        {sub.desc}
                                      </p>
                                    </Link>

                                    {hasSub && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setExpandedSubItem(isSubExpanded ? null : sub.label);
                                        }}
                                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                                          isSubExpanded
                                            ? 'bg-[#006FCC] text-white shadow-2xs'
                                            : 'bg-[#EDF5FA] text-[#006FCC] hover:bg-[#DDECF6]'
                                        }`}
                                        title="Toggle Subcategories"
                                      >
                                        <span>{isSubExpanded ? 'Hide' : `${sub.subItems!.length} Sub-links`}</span>
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSubExpanded ? 'rotate-180' : ''}`} />
                                      </button>
                                    )}
                                  </div>

                                  {/* Submenu List */}
                                  {hasSub && isSubExpanded && (
                                    <div className="mt-1.5 ml-1 pl-2.5 border-l-2 border-[#006FCC] space-y-0.5 bg-[#F8FAFD] p-2 rounded-r-lg animate-in fade-in slide-in-from-top-1 duration-150">
                                      <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#006FCC] px-1 py-0.5">
                                        Subcategories & Material Lists
                                      </div>
                                      {sub.subItems!.map((child, cIdx) => (
                                        <Link
                                          key={cIdx}
                                          href={child.to}
                                          onClick={() => setOpenDropdown(null)}
                                          className="flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-white text-[11.5px] font-medium text-[#023858] hover:text-[#006FCC] transition-colors group/child"
                                        >
                                          <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#006FCC]/60 group-hover/child:bg-[#006FCC] group-hover/child:scale-125 transition-all" />
                                            <span>{child.label}</span>
                                          </div>
                                          {child.badge && (
                                            <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-white text-[#006FCC] border border-[#006FCC]/20">
                                              {child.badge}
                                            </span>
                                          )}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                </div>

                {/* Right Zone: Official M3 Surface Container Card (4 cols) */}
                {activeItem.featuredPanel && (
                  <div className="col-span-4 bg-[#f3f6fc] rounded-[14px] p-5 flex flex-col justify-between border border-[#c4c7c5]/50 shadow-2xs">
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#0b57d0] block mb-2">
                        {activeItem.featuredPanel.eyebrow}
                      </span>
                      <h4
                        className="nav-menu-item-title text-[15px] font-bold text-[#1f1f1f] leading-snug mb-2 cursor-pointer"
                      >
                        {activeItem.featuredPanel.title}
                      </h4>
                      <p className="text-[12px] text-[#444746] leading-relaxed">
                        {activeItem.featuredPanel.desc}
                      </p>
                    </div>

                    <div className="mt-5">
                      <Link
                        href={activeItem.featuredPanel.ctaHref}
                        onClick={() => setOpenDropdown(null)}
                      >
                        <M3Button
                          variant="filled"
                          size="sm"
                          trailingIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          {activeItem.featuredPanel.ctaText}
                        </M3Button>
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ── Mobile Drawer (Official M3 Surface & Pill Buttons) ── */}
        <div
          className={`lg:hidden border-t border-[#c4c7c5] bg-[#f8fafd] text-[#1f1f1f] absolute top-full left-0 w-full shadow-[0_8px_24px_rgba(60,64,67,0.2)] rounded-b-[28px] overflow-y-auto max-h-[85vh] transition-all duration-300 ease-in-out z-[410] ${
            mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          <div className="px-5 sm:px-6 py-5 space-y-2">
            {/* Top Action Buttons: Book Demo & Find School (Uniform M3 Pill Buttons) */}
            <div className="grid grid-cols-2 gap-2.5 pb-4">
              <Link
                href="/contact-us"
                onClick={() => setMobileOpen(false)}
              >
                <M3Button variant="filled" size="lg" fullWidth>
                  Book Demo
                </M3Button>
              </Link>
              <Link
                href="/schools?view=map"
                onClick={() => setMobileOpen(false)}
              >
                <M3Button
                  variant="tonal"
                  size="lg"
                  fullWidth
                  leadingIcon={<MapPin className="w-4 h-4 text-[#001d35]" />}
                >
                  Find School
                </M3Button>
              </Link>
            </div>

            {/* Clean Category Rows (Exact match with user's screenshot) */}
            {visibleNavItems.map((item: any) => {
              const isCategoryOpen = openMobileCategories.includes(item.label);

              return (
                <div key={item.label} className="border-b border-[#EDF0F2]">
                  {item.hasDropdown ? (
                    <button
                      type="button"
                      className={`w-full text-left py-4 px-1 text-[17px] font-bold flex items-center justify-between transition-colors duration-200 cursor-pointer ${
                        isCategoryOpen ? 'text-[#006FCC]' : 'text-[#023858]'
                      }`}
                      onClick={() => toggleMobileCategory(item.label)}
                    >
                      <span className="tracking-tight">{item.label}</span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-300 ease-out shrink-0 ${
                          isCategoryOpen ? 'rotate-180 text-[#006FCC]' : 'text-[#023858]'
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.to || '/'}
                      className="block py-4 px-1 text-[17px] font-bold text-[#023858] hover:text-[#006FCC] transition-colors tracking-tight"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Fluid Mobile Category Accordion (Opens DIRECTLY UNDER PARENT without shifting other menus) */}
                  {item.hasDropdown && (
                    <div
                      className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out"
                      style={{
                        gridTemplateRows: isCategoryOpen ? '1fr' : '0fr',
                        opacity: isCategoryOpen ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden min-h-0">
                        <div className="bg-[#F7F8F8] rounded-[16px] p-3.5 my-2 space-y-4 border border-[#E8E9E9]/70">
                          {item.columns?.map((col: any, colIdx: number) => (
                            <div key={colIdx} className={`${colIdx > 0 ? 'pt-3 border-t border-[#E8E9E9]' : ''} space-y-2`}>
                              {/* Section Header */}
                              <div className="px-1.5 py-0.5 flex items-center justify-between">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#006FCC] bg-[#EDF5FA] px-2.5 py-1 rounded-md inline-block">
                                  {col.categoryTitle}
                                </span>
                              </div>

                              {/* Items under this section */}
                              <div className="space-y-1.5">
                                {col.items?.map((sub: any, sIdx: number) => {
                                  const subKey = `${item.label}::${col.categoryTitle}::${sub.label}`;
                                  const isMobileSubOpen = openMobileSubItems.includes(subKey);
                                  const hasSub = Boolean(sub.subItems && sub.subItems.length > 0);

                                  return (
                                    <div
                                      key={sIdx}
                                      className="p-2.5 rounded-xl hover:bg-white transition-all bg-white/70 border border-slate-200/60 shadow-2xs"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <Link
                                          href={sub.to || '/'}
                                          onClick={() => setMobileOpen(false)}
                                          className="group block flex-1 min-w-0"
                                        >
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="nav-menu-item-title font-bold text-sm text-[#023858] group-hover:text-[#006FCC] transition-colors">
                                              {sub.label}
                                            </span>
                                            {sub.badge && (
                                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                                {sub.badge}
                                              </span>
                                            )}
                                          </div>
                                          {sub.desc && (
                                            <span className="text-xs text-[#5F6265] line-clamp-1 mt-0.5 block">{sub.desc}</span>
                                          )}
                                        </Link>

                                        {hasSub && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              toggleMobileSubItem(subKey);
                                            }}
                                            className="p-1.5 text-[#006FCC] bg-[#EDF5FA] hover:bg-[#E0EFF8] rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-all active:scale-95"
                                            title="Toggle Subcategories"
                                          >
                                            <span className="text-[11px] font-extrabold">{sub.subItems!.length}</span>
                                            <ChevronDown
                                              className={`w-3.5 h-3.5 transition-transform duration-250 ease-out ${
                                                isMobileSubOpen ? 'rotate-180 text-[#006FCC]' : 'text-[#023858]/70'
                                              }`}
                                            />
                                          </button>
                                        )}
                                      </div>

                                      {/* Sub-item child list - Opens DIRECTLY UNDER PARENT SUB-ITEM */}
                                      {hasSub && (
                                        <div
                                          className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-250 ease-out"
                                          style={{
                                            gridTemplateRows: isMobileSubOpen ? '1fr' : '0fr',
                                            opacity: isMobileSubOpen ? 1 : 0,
                                          }}
                                        >
                                          <div className="overflow-hidden min-h-0">
                                            <div className="mt-2.5 ml-1 pl-3 border-l-2 border-[#006FCC] space-y-1 bg-white p-2.5 rounded-r-xl shadow-xs">
                                              <div className="text-[10px] font-bold uppercase tracking-wider text-[#006FCC] mb-1">
                                                Subcategories:
                                              </div>
                                              {sub.subItems!.map((child: any, cIdx: number) => (
                                                <Link
                                                  key={cIdx}
                                                  href={child.to || '/'}
                                                  onClick={() => setMobileOpen(false)}
                                                  className="flex items-center justify-between text-xs font-semibold text-[#023858] hover:text-[#006FCC] py-1.5 px-2 rounded-lg hover:bg-[#F8FAFD] transition-colors"
                                                >
                                                  <span className="flex items-center gap-1.5 truncate">
                                                    <span className="text-[#006FCC] text-[10px] shrink-0">•</span>
                                                    <span className="truncate">{child.label}</span>
                                                  </span>
                                                  {child.badge && (
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#EDF5FA] text-[#006FCC] shrink-0 ml-1">
                                                      {child.badge}
                                                    </span>
                                                  )}
                                                </Link>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Dark Backdrop Overlay when Dropdown is open (Labster UX) ── */}
      {activeItem && (
        <div
          className="hidden lg:block fixed inset-0 top-[76px] bg-black/35 z-[390] transition-opacity duration-200 backdrop-blur-[1px]"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </>
  );
};

export default Navbar;