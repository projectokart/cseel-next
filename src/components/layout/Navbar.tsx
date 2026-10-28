'use client';
import Link from 'next/link';
import { ChevronDown, Menu, X, ArrowRight, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavVisibility } from '@/contexts/NavigationContext';
import { useBookDemoModal } from '@/contexts/BookDemoModalContext';
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

const getSubmenuHeading = (label: string = '') => {
  const l = label.toLowerCase();
  if (l.includes('blog') || l.includes('article') || l.includes('insight')) {
    return 'Articles, Blogs & Guides';
  }
  if (l.includes('scheme') || l.includes('grant')) {
    return 'Government Schemes & Grants';
  }
  if (l.includes('material') || l.includes('catalog') || l.includes('equipment') || l.includes('apparatus')) {
    return 'Materials & Apparatus Lists';
  }
  if (l.includes('project') || l.includes('maker')) {
    return 'Student Projects & Schematics';
  }
  if (l.includes('tour') || l.includes('media') || l.includes('gallery')) {
    return 'Media & Visual Walkthroughs';
  }
  if (l.includes('school') || l.includes('directory')) {
    return 'School Directory & Categories';
  }
  return 'Related Pages & Subcategories';
};

/* ─── Minimal, High-Impact Experiential Learning Menus with Subcategories ─── */
const navItems: NavItem[] = [
  {
    id: 'experiential-labs',
    label: 'Experiential Labs',
    to: '/domain/science',
    hasDropdown: true,
    columns: [
      {
        categoryTitle: 'Science & Mathematics',
        items: [
          {
            label: 'Science Lab',
            to: '/domain/science',
            desc: 'Physics, Chemistry, Biology & Earth science experiential simulations and hands-on experiments.',
            subItems: [
              { label: 'Physics Practicals & Mechanics', to: '/subject/physics' },
              { label: 'Chemistry Titration & Salt Analysis', to: '/subject/chemistry' },
              { label: 'Biology Microscopy & Specimen Slides', to: '/subject/biology' },
              { label: 'Science Domain Hub', to: '/domain/science' },
            ],
          },
          {
            label: 'Mathematics & Modeling',
            to: '/subject/mathematics',
            desc: 'Tactile 3D geometry, coordinate visualizers, conic sections & practical calculus proofs.',
            subItems: [
              { label: 'Tactile 3D Conics & Surfaces', to: '/subject/mathematics' },
              { label: 'Coordinate Geometry Visualizer', to: '/subject/mathematics' },
              { label: 'Algebra & Calculus Proofs', to: '/subject/mathematics' },
            ],
          },
        ],
      },
      {
        categoryTitle: 'Engineering, Maker & STEAM Arts',
        items: [
          {
            label: 'Engineering & Technology',
            to: '/subject/engineering',
            desc: 'Hands-on engineering design, IoT, smart circuits, robotics, and ATL maker challenges.',
            subItems: [
              { label: 'Engineering Practicals Lab', to: '/subject/engineering' },
              { label: 'Atal Tinkering Lab (ATL 2.0)', to: '/steam-lab/atl', badge: 'ATL 2.0' },
              { label: 'AI, IoT & Robotics Workstations', to: '/steam-lab/ai-robotics-lab' },
              { label: 'Engineering Domain Overview', to: '/domain/engineering' },
            ],
          },
          {
            label: 'Maker Lab & Tinkering Studio',
            to: '/makerspace',
            desc: 'Hands-on makerspace with woodworking, prototyping, electronics workbench & hand tools.',
            subItems: [
              { label: 'Complete Makerspace Catalog', to: '/makerspace', badge: 'Catalog' },
              { label: 'Prototyping & Digital Fabrication', to: '/makerspace' },
              { label: 'Hand & Power Tools Workshop', to: '/makerspace' },
            ],
          },
          {
            label: 'Projectokart STEM Projects',
            to: '/projects',
            desc: 'Student-led maker projects with circuit schematics, bill of materials & working builds.',
            subItems: [
              { label: 'Working Science Fair Prototypes', to: '/projects' },
              { label: 'Innovation Schematics & BOM', to: '/projects' },
              { label: 'Student Innovation Showcase', to: '/projects' },
            ],
          },
          {
            label: 'Art, Design & Craft',
            to: '/domain/art',
            desc: 'Creative STEAM studio, color physics, photochemistry, model making & design thinking.',
            subItems: [
              { label: 'Creative STEAM Studio', to: '/domain/art' },
              { label: 'Color Physics & Optics Lab', to: '/domain/art' },
              { label: 'Design Thinking & Prototyping', to: '/domain/art' },
            ],
          },
        ],
      },
    ],
    featuredPanel: {
      eyebrow: 'STEAM Experiential Learning',
      title: '4 Core STEAM Domains Aligned with NEP 2020',
      desc: 'Explore Science, Mathematics, Engineering & Technology, and Creative Arts through blended virtual & physical practicals.',
      ctaText: 'Explore Experiential Labs',
      ctaHref: '/domain/science',
    },
  },
  {
    id: 'lab-materials',
    label: 'Lab Materials',
    to: '/materials',
    hasDropdown: true,
    columns: [
      {
        categoryTitle: 'Apparatus Catalog & Lab Packages',
        items: [
          {
            label: '950+ Lab Materials Catalog',
            to: '/materials',
            desc: 'Certified laboratory apparatus, glassware, chemicals, electronic sensors & makerspace tools.',
            subItems: [
              { label: 'Physics Apparatus & Ray Benches', to: '/materials' },
              { label: 'Chemistry Reagents & Glassware', to: '/materials' },
              { label: 'Biology Models & Microscopes', to: '/materials' },
              { label: 'Robotics Sensors & Microcontrollers', to: '/materials' },
            ],
          },
          {
            label: 'ATL Lab Material List (Packages 1-4)',
            to: '/steam-lab/atl',
            desc: 'Complete NITI Aayog Package 1-4 equipment list, 3D printers, sensors & robotics BOQ.',
            subItems: [
              { label: 'ATL Material List & Equipment BOQ', to: '/steam-lab/atl', badge: 'Equipment List' },
              { label: 'Package 1 & 2: Prototyping & 3D Printers', to: '/steam-lab/atl' },
              { label: 'Package 3 & 4: Robotics, IoT & Power Tools', to: '/steam-lab/atl' },
              { label: 'NITI Aayog GeM Compliance Norms', to: '/schemes/atl-grants' },
            ],
          },
          {
            label: 'CBSE Composite Science Lab (49 List)',
            to: '/composite-lab',
            desc: 'Mandatory SARAS 49 non-consumable apparatus list and lab setup specifications.',
            subItems: [
              { label: '49 Mandatory Non-Consumable List', to: '/composite-lab', badge: 'CBSE List' },
              { label: '600 Sq Ft Lab Blueprint & 8 Sinks', to: '/composite-lab' },
              { label: 'SARAS Lab Safety & First Aid Setup', to: '/safety' },
            ],
          },
        ],
      },
      
    ],
    featuredPanel: {
      eyebrow: 'Institutional Procurement',
      title: '950+ Certified School Lab & ATL Materials',
      desc: 'Everything required for CBSE composite science labs and ATL setups with instant quotation and doorstep delivery.',
      ctaText: 'Browse Lab Catalog',
      ctaHref: '/materials',
    },
  },
  {
    id: 'edu-network',
    label: 'Edu Network',
    to: '/schools',
    hasDropdown: true,
    columns: [
      {
        categoryTitle: 'Directory & Discovery',
        items: [
          {
            label: 'Schools Directory',
            to: '/schools',
            desc: 'Explore 28,000+ verified schools equipped with modern experiential labs.',
            subItems: [
              { label: 'Pan-India School Search', to: '/schools' },
              { label: 'Search Schools Near Me', to: '/schools', badge: 'Near Me' },
              { label: 'UDISE Verified Directory', to: '/schools' },
            ],
          },
          {
            label: 'Affiliation & Board Explorer',
            to: '/schools',
            desc: 'Filter schools by CBSE, ICSE, Cambridge and State Board accreditations.',
            subItems: [
              { label: 'CBSE Affiliated Labs', to: '/schools' },
              { label: 'Composite Science Lab Schools', to: '/schools' },
            ],
          },
        ],
      },
      {
        categoryTitle: 'Faculty & Enablement',
        items: [
          {
            label: 'Verified Faculty and Teaching Jobs',
            to: '/edu-network/teachers',
            desc: 'Certified STEM educators, ATL coordinators, and hands-on lab demonstrators.',
            subItems: [
              { label: 'STEM Educator Roster', to: '/edu-network/teachers' },
              { label: 'Expert ATL Mentors', to: '/edu-network/teachers' },
            ],
          },
          {
            label: 'Institutional Solutions',
            to: '/for-institutions',
            desc: "Join India's experiential education network and upgrade your school lab infrastructure.",
            subItems: [
              { label: 'Register Your School', to: '/contact-us' },
              { label: 'School Lab Audit Request', to: '/contact-us' },
            ],
          },
        ],
      },
    ],
    featuredPanel: {
      eyebrow: 'Pan-India Network',
      title: '28,000+ Experiential Schools Nationwide',
      desc: 'Discover schools leading practical STEAM learning with modern composite science laboratories and Atal Tinkering Labs.',
      ctaText: 'Explore Schools Directory',
      ctaHref: '/schools',
    },
  },
  {
    id: 'events-workshops',
    label: 'Events & Workshops',
    to: '/events',
    hasDropdown: true,
    columns: [
      {
        categoryTitle: 'Student Competitions & Hackathons',
        items: [
          {
            label: 'National STEM Hackathons',
            to: '/events',
            desc: 'Inter-school robotics, maker challenges, and experiential prototype competitions.',
            subItems: [
              { label: 'National STEM Hackathon 2026', to: '/events', badge: 'Upcoming' },
              { label: 'Inter-School Science Olympiad', to: '/events' },
              { label: 'Innovation Project Showcase', to: '/projects' },
            ],
          },
          {
            label: 'Science Exhibitions & Fairs',
            to: '/exhibitions',
            desc: 'Annual district and national science project exhibitions and award ceremonies.',
            subItems: [
              { label: 'Annual Science Exhibition', to: '/exhibitions' },
              { label: 'Winner Showcase & Gallery', to: '/media-archive' },
            ],
          },
        ],
      },
      {
        categoryTitle: 'Workshops & Faculty CPD',
        items: [
          {
            label: 'Hands-on Student Workshops',
            to: '/workshops',
            desc: 'Weekend robotics, 3D printing, space science, and AI immersion bootcamps.',
            subItems: [
              { label: 'Weekend Robotics Bootcamps', to: '/workshops' },
              { label: 'AI & IoT Tinkering Workshops', to: '/workshops' },
            ],
          },
          {
            label: 'Teacher Training Masterclasses',
            to: '/teacher-training',
            desc: 'CPD masterclasses in experiential lab pedagogy, safety SOPs, and NEP 2020.',
            subItems: [
              { label: 'Experiential Lab Leadership', to: '/teacher-training' },
              { label: 'CBSE Safety SOP Certification', to: '/safety' },
            ],
          },
        ],
      },
    ],
    featuredPanel: {
      eyebrow: 'Upcoming Conclaves',
      title: 'Participate in National STEM Competitions & Bootcamps',
      desc: 'Register your school teams for upcoming hackathons, innovation challenges, and hands-on faculty workshops.',
      ctaText: 'Browse All Events',
      ctaHref: '/events',
    },
  },
  {
    id: 'about-cseel',
    label: 'About CSEEL',
    to: '/about',
    hasDropdown: true,
    columns: [
      {
        categoryTitle: 'Our Organization & Pedagogy',
        items: [
          {
            label: 'About CSEEL',
            to: '/about',
            desc: 'Our mission to bring experiential hands-on science to every learner across India.',
            subItems: [
              { label: 'Our Mission & Vision', to: '/about' },
              { label: 'Our Story & Journey', to: '/our-story' },
              { label: 'Leadership & Advisory Team', to: '/team' },
              { label: 'Contact Us & Lab Advisory', to: '/contact-us' },
            ],
          },
          {
            label: 'Why CSEEL & Efficacy',
            to: '/why-cseel',
            desc: 'Experiential learning architecture & hands-on practical methodology aligned with NEP 2020.',
            subItems: [
              { label: 'Experiential Pedagogy Framework', to: '/why-cseel' },
              { label: 'Proven Academic Efficacy (+34%)', to: '/why-cseel' },
              { label: 'Lab Safety & Compliance SOPs', to: '/safety' },
              { label: 'School Plans & Packages', to: '/compare-plans' },
            ],
          },
        ],
      },
      {
        categoryTitle: 'Who It\'s For & Careers',
        items: [
          {
            label: 'CSEEL for Stakeholders',
            to: '/for-institutions',
            desc: 'Tailored experiential science solutions for school principals, educators and students.',
            subItems: [
              { label: 'For School Principals', to: '/for-institutions' },
              { label: 'For School Educators', to: '/for-educators' },
              { label: 'For K-12 Students', to: '/for-students' },
            ],
          },
          {
            label: 'Careers at CSEEL',
            to: '/careers',
            desc: 'Join our team as we empower students across India with hands-on practical science.',
            subItems: [
              { label: 'STEM & Robotics Educators', to: '/careers' },
              { label: 'Lab In-Charge & Demonstrators', to: '/careers' },
              { label: 'ATL Mentors of Change', to: '/careers' },
              { label: 'School Faculty Placement', to: '/careers' },
            ],
          },
        ],
      },
    ],
    featuredPanel: {
      eyebrow: 'Our Mission',
      title: 'Transforming Indian Science Education Through Hands-On Learning',
      desc: 'Discover how CSEEL equips 28,000+ schools with modern composite labs, ATL setups, and teacher masterclasses.',
      ctaText: 'Learn About CSEEL',
      ctaHref: '/about',
    },
  },
  {
    id: 'resources-media',
    label: 'Resources & Media',
    to: '/resources',
    hasDropdown: true,
    columns: [
      {
        categoryTitle: 'Academic Insights & Govt Schemes',
        items: [
          {
            label: 'Academic Blog & Articles',
            to: '/blog',
            desc: 'Pedagogical research, empirical studies, CBSE practical guidelines, and NEP 2020 insights.',
            badge: 'Articles & Blog',
            subItems: [
              { label: 'Research Article: The Confidence Effect', to: '/online-stem-retention-research-preview', badge: 'Article' },
              { label: 'Academic STEM Blog (All Posts)', to: '/blog', badge: 'Blog' },
              { label: 'STEM Research & Whitepapers', to: '/research', badge: 'Research' },
              { label: 'Experiential Learning Pedagogy', to: '/blog' },
              { label: 'CBSE Practical Exam Guidelines', to: '/blog' },
              { label: 'Lab Safety & Emergency SOPs', to: '/safety' },
            ],
          },
          {
            label: 'Government Schemes & Grants',
            to: '/schemes',
            desc: 'PM SHRI, Atal Tinkering Labs, and Samagra Shiksha school funding blueprints.',
            subItems: [
              { label: 'PM SHRI Lab Grants', to: '/schemes/pm-shri', badge: 'Govt Grant' },
              { label: 'ATL ₹20 Lakh Grant Blueprint', to: '/schemes/atl-grants' },
              { label: 'Samagra Shiksha Norms', to: '/schemes/samagra-shiksha' },
            ],
          },
        ],
      },
      {
        categoryTitle: 'Media & Visual Showcase',
        items: [
          {
            label: '360° Interactive Lab Tour',
            to: '/virtual-lab-tour',
            desc: 'Take an interactive walkthrough inside modern composite science laboratories.',
            subItems: [
              { label: 'Launch 360° Walkthrough', to: '/virtual-lab-tour', badge: '360°' },
              { label: 'Lab Equipment Inspection', to: '/virtual-lab-tour' },
            ],
          },
          {
            label: 'Media & Installations Gallery',
            to: '/media-archive',
            desc: 'Photos, video walkthroughs, and press coverage of real lab installations.',
            subItems: [
              { label: 'School Lab Photo Gallery', to: '/media-archive' },
              { label: 'Video Demonstrations', to: '/media-archive' },
              { label: 'Press & Conclave Highlights', to: '/media-archive' },
            ],
          },
        ],
      },
    ],
    featuredPanel: {
      eyebrow: 'Interactive Tour',
      title: 'Walk Through a Turnkey 600 Sq Ft Composite Science Lab',
      desc: 'Experience our interactive 360° virtual tour and browse high-resolution photos of school installations across India.',
      ctaText: 'Launch 360° Lab Tour',
      ctaHref: '/virtual-lab-tour',
    },
  },
];

/* ─── Labster Signature SVG Chevron ─── */
const LabsterChevron = ({ isOpen, className = '' }: { isOpen?: boolean; className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`shrink-0 transition-transform duration-200 ease-out ${
      isOpen ? 'rotate-180 text-[#006FCC]' : 'text-[#1B1F23]'
    } ${className}`}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.55806 6.29544C2.46043 6.19781 2.46043 6.03952 2.55806 5.94189L3.44195 5.058C3.53958 4.96037 3.69787 4.96037 3.7955 5.058L8.00001 9.26251L12.2045 5.058C12.3021 4.96037 12.4604 4.96037 12.5581 5.058L13.4419 5.94189C13.5396 6.03952 13.5396 6.19781 13.4419 6.29544L8.17678 11.5606C8.07915 11.6582 7.92086 11.6582 7.82323 11.5606L2.55806 6.29544Z"
    />
  </svg>
);

/* ─── Main Component ─────────────────────────────── */
const Navbar = () => {
  const { navCategories } = useNavVisibility();
  const { openDemoModal } = useBookDemoModal();
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



  const [headerBottom, setHeaderBottom] = useState<number>(54);

  // Safely lock body scroll and calculate exact header bottom when mobile menu is opened
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      if (headerRef.current) {
        setHeaderBottom(Math.round(headerRef.current.getBoundingClientRect().bottom));
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
        className={`site-navbar sticky top-0 w-full z-[500] transition-all duration-200 select-none bg-white border-b border-[rgba(0,0,0,0.12)] ${
          isScrolled
            ? 'shadow-[0_4px_5px_0_rgba(0,0,0,0.14),0_1px_10px_0_rgba(0,0,0,0.12),0_2px_4px_-1px_rgba(0,0,0,0.2)]'
            : ''
        }`}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Main Navbar Bar (Sleek 54px Height matching modern compact navigation) ── */}
        <div className="max-w-[1380px] w-full mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 h-[54px]">

          {/* Brand Logo (Crisp, proportional, prominent within 54px navbar) */}
          <Link
            href="/"
            aria-label="CSEEL - Home"
            className="flex items-center hover:opacity-95 transition-opacity shrink-0 mr-3 xl:mr-5 py-0.5"
          >
            <img
              src="/images/cseel-logo.svg"
              alt="CSEEL - Centre for Scientific Exploration & Experiential Learning"
              width={140}
              height={44}
              style={{ height: '44px', width: 'auto' }}
              className="h-[38px] sm:h-[42px] lg:h-[44px] max-h-[46px] w-auto max-w-[155px] object-contain shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/cseel-logo.png';
              }}
            />
          </Link>

                    {/* Desktop Navigation & Actions: Shifted left closer together, NO empty gap, NO arrow */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 2xl:gap-4 shrink-0">
            <nav className="flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 h-full flex-nowrap shrink-0">
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
                        className={`top-nav-link group flex items-center gap-1.5 text-[14px] xl:text-[15px] 2xl:text-[15.5px] font-bold tracking-tight transition-colors duration-200 ease-in-out cursor-pointer whitespace-nowrap shrink-0 h-[34px] px-2 lg:px-2 xl:px-2.5 2xl:px-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006FCC] ${
                          isOpen
                            ? 'is-open text-[#006FCC]'
                            : 'text-[#1B1F23] hover:text-[#006FCC]'
                        }`}
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                      >
                        <span className="whitespace-nowrap transition-colors duration-200">
                          {item.label}
                        </span>
                        {/* Labster Exact Polygon Chevron Arrow */}
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className={`shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#006FCC]' : 'text-[#1B1F23] group-hover:text-[#006FCC]'
                          }`}
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2.55806 6.29544C2.46043 6.19781 2.46043 6.03952 2.55806 5.94189L3.44195 5.058C3.53958 4.96037 3.69787 4.96037 3.7955 5.058L8.00001 9.26251L12.2045 5.058C12.3021 4.96037 12.4604 4.96037 12.5581 5.058L13.4419 5.94189C13.5396 6.03952 13.5396 6.19781 13.4419 6.29544L8.17678 11.5606C8.07915 11.6582 7.92086 11.6582 7.82323 11.5606L2.55806 6.29544Z"
                          />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={item.to || '/'}
                        onMouseEnter={handleMouseLeave}
                        className="top-nav-link inline-flex items-center text-[14px] xl:text-[15px] 2xl:text-[15.5px] font-bold tracking-tight text-[#1B1F23] hover:text-[#006FCC] transition-colors duration-200 ease-in-out whitespace-nowrap shrink-0 h-[34px] px-2 lg:px-2 xl:px-2.5 2xl:px-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006FCC]"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                      >
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Book a Demo Button: Shifted left closer to nav items, NO arrow */}
            <button
              type="button"
              onClick={() => openDemoModal({ source: 'Navbar Desktop' })}
              className="h-[34px] px-4 text-[13.5px] font-bold bg-[#006FCC] text-white hover:bg-[#005399] shadow-xs hover:shadow rounded-[10px] transition-all duration-200 active:scale-[0.98] inline-flex items-center justify-center shrink-0 whitespace-nowrap font-['Montserrat',sans-serif] cursor-pointer ml-1 xl:ml-2"
            >
              <span>Book a Demo</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 -mr-1.5 rounded-xl text-[#1B1F23] hover:text-[#006FCC] hover:bg-slate-100 active:bg-slate-200 transition-all flex items-center justify-center cursor-pointer"
            >
              {mobileOpen ? (
                <X className="h-7 w-7 stroke-[2.3]" />
              ) : (
                <Menu className="h-7 w-7 stroke-[2.3]" />
              )}
            </button>
          </div>
        </div>

        {/* ── FULL-WIDTH MEGA DROPDOWN (LABSTER EXACT TYPOGRAPHY & DESIGN) ── */}
        {activeItem && activeItem.columns && (
          <div
            className="hidden lg:block absolute top-full left-0 w-full bg-white border-b border-[#E8E9E9] shadow-[0_20px_40px_-10px_rgba(0,28,51,0.08)] z-[450] animate-in fade-in duration-150"
            onMouseEnter={clearTimers}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1360px] mx-auto px-6 lg:px-8 py-6">
              <div className="grid grid-cols-12 gap-8 items-start">

                {/* Left Zone: 2 Columns with Vertical Divider (8 cols) */}
                <div className="col-span-8 pr-4 relative">
                  <div className="grid grid-cols-2 gap-8 relative">

                    {/* Column 1 */}
                    <div className="space-y-4">
                      {activeItem.columns[0] && (
                        <>
                          <div className="pb-2 border-b border-[#E8E9E9]">
                            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#006FCC] font-['Montserrat',sans-serif] block">
                              {activeItem.columns[0].categoryTitle}
                            </span>
                          </div>
                          <div className="space-y-3.5">
                            {activeItem.columns[0].items.map((sub, idx) => {
                              const isSubExpanded = expandedSubItem === sub.label;
                              const hasSub = Boolean(sub.subItems && sub.subItems.length > 0);

                              return (
                                <div key={idx} className="group/item pb-1 transition-all">
                                  <div className="flex items-start justify-between gap-2">
                                    <Link
                                      href={sub.to}
                                      onClick={() => setOpenDropdown(null)}
                                      className="group block flex-1"
                                    >
                                      <div className="flex items-center gap-1.5">
                                        <h5 className="font-['Montserrat',sans-serif] font-bold text-[15px] leading-snug text-[#1B1F23] group-hover:text-[#006FCC] transition-colors">
                                          {sub.label}
                                        </h5>
                                        <ArrowRight className="w-3.5 h-3.5 text-[#006FCC] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                                      </div>
                                      <p className="font-['Lato',sans-serif] text-[13px] text-[#5F6265] leading-[1.5] mt-1 font-normal line-clamp-2">
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
                                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 shrink-0 cursor-pointer font-['Montserrat',sans-serif] ${
                                          isSubExpanded
                                            ? 'bg-[#006FCC] text-white shadow-xs'
                                            : 'bg-[#F7F8F8] text-[#006FCC] border border-[#E8E9E9] hover:bg-[#EDF5FA]'
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
                                    <div className="mt-2 ml-1 pl-3 border-l-2 border-[#006FCC] space-y-1 bg-[#F7F8F8] p-2.5 rounded-r-xl border border-l-0 border-[#E8E9E9] animate-in fade-in slide-in-from-top-1 duration-150">
                                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#006FCC] px-1 py-0.5 font-['Montserrat',sans-serif]">
                                        {getSubmenuHeading(sub.label)}
                                      </div>
                                      {sub.subItems!.map((child, cIdx) => (
                                        <Link
                                          key={cIdx}
                                          href={child.to}
                                          onClick={() => setOpenDropdown(null)}
                                          className="flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-white text-[12px] font-semibold text-[#003C6E] hover:text-[#006FCC] transition-colors group/child font-['Montserrat',sans-serif]"
                                        >
                                          <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#006FCC]/60 group-hover/child:bg-[#006FCC] group-hover/child:scale-125 transition-all" />
                                            <span>{child.label}</span>
                                          </div>
                                          {child.badge && (
                                            <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-white text-[#006FCC] border border-[#006FCC]/20 font-['Montserrat',sans-serif]">
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
                    <div className="space-y-4 pl-4">
                      {activeItem.columns[1] && (
                        <>
                          <div className="pb-2 border-b border-[#E8E9E9]">
                            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#006FCC] font-['Montserrat',sans-serif] block">
                              {activeItem.columns[1].categoryTitle}
                            </span>
                          </div>
                          <div className="space-y-3.5">
                            {activeItem.columns[1].items.map((sub, idx) => {
                              const isSubExpanded = expandedSubItem === sub.label;
                              const hasSub = Boolean(sub.subItems && sub.subItems.length > 0);

                              return (
                                <div key={idx} className="group/item pb-1 transition-all">
                                  <div className="flex items-start justify-between gap-2">
                                    <Link
                                      href={sub.to}
                                      onClick={() => setOpenDropdown(null)}
                                      className="group block flex-1"
                                    >
                                      <div className="flex items-center gap-1.5">
                                        <h5 className="font-['Montserrat',sans-serif] font-bold text-[15px] leading-snug text-[#1B1F23] group-hover:text-[#006FCC] transition-colors">
                                          {sub.label}
                                        </h5>
                                        <ArrowRight className="w-3.5 h-3.5 text-[#006FCC] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                                      </div>
                                      <p className="font-['Lato',sans-serif] text-[13px] text-[#5F6265] leading-[1.5] mt-1 font-normal line-clamp-2">
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
                                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 shrink-0 cursor-pointer font-['Montserrat',sans-serif] ${
                                          isSubExpanded
                                            ? 'bg-[#006FCC] text-white shadow-xs'
                                            : 'bg-[#F7F8F8] text-[#006FCC] border border-[#E8E9E9] hover:bg-[#EDF5FA]'
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
                                    <div className="mt-2 ml-1 pl-3 border-l-2 border-[#006FCC] space-y-1 bg-[#F7F8F8] p-2.5 rounded-r-xl border border-l-0 border-[#E8E9E9] animate-in fade-in slide-in-from-top-1 duration-150">
                                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#006FCC] px-1 py-0.5 font-['Montserrat',sans-serif]">
                                        {getSubmenuHeading(sub.label)}
                                      </div>
                                      {sub.subItems!.map((child, cIdx) => (
                                        <Link
                                          key={cIdx}
                                          href={child.to}
                                          onClick={() => setOpenDropdown(null)}
                                          className="flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-white text-[12px] font-semibold text-[#003C6E] hover:text-[#006FCC] transition-colors group/child font-['Montserrat',sans-serif]"
                                        >
                                          <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#006FCC]/60 group-hover/child:bg-[#006FCC] group-hover/child:scale-125 transition-all" />
                                            <span>{child.label}</span>
                                          </div>
                                          {child.badge && (
                                            <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-white text-[#006FCC] border border-[#006FCC]/20 font-['Montserrat',sans-serif]">
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

                {/* Right Zone: Labster Featured Card (4 cols) */}
                {activeItem.featuredPanel && (
                  <div className="col-span-4 bg-[#F7F8F8] rounded-2xl p-6 flex flex-col justify-between border border-[#E8E9E9] shadow-xs">
                    <div>
                      <span className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#006FCC] font-['Montserrat',sans-serif] block mb-2">
                        {activeItem.featuredPanel.eyebrow}
                      </span>
                      <h4
                        className="font-['Montserrat',sans-serif] text-[17px] font-bold text-[#1B1F23] hover:text-[#006FCC] leading-snug mb-2 cursor-pointer transition-colors"
                      >
                        {activeItem.featuredPanel.title}
                      </h4>
                      <p className="font-['Lato',sans-serif] text-[13px] text-[#5F6265] leading-[1.5]">
                        {activeItem.featuredPanel.desc}
                      </p>
                    </div>

                    <div className="mt-5">
                      <Link
                        href={activeItem.featuredPanel.ctaHref}
                        onClick={() => setOpenDropdown(null)}
                        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-[13.5px] font-bold bg-[#006FCC] text-white hover:bg-[#005399] rounded-[14px] shadow-xs hover:shadow transition-all duration-200 active:scale-[0.98] font-['Montserrat',sans-serif] cursor-pointer whitespace-nowrap"
                      >
                        <span>{activeItem.featuredPanel.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ── Mobile Drawer (Labster Design: Clean Full-Viewport Slide Drawer) ── */}
        <div
          id="mobile-nav-drawer"
          style={{
            top: `${headerBottom}px`,
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
          className={`lg:hidden fixed inset-x-0 bottom-0 bg-white z-[550] flex flex-col justify-between overflow-hidden transition-opacity duration-200 ease-in-out border-t border-[#E8E9E9] shadow-2xl ${
            mobileOpen
              ? 'opacity-100 visible pointer-events-auto'
              : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          {/* Scrollable Navigation List */}
          <div
            style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
            className="mobile-nav-scroll-container flex-1 overflow-y-auto px-5 sm:px-6 py-3 divide-y divide-[#E8E9E9]"
          >
            {visibleNavItems.map((item: any) => {
              const isCategoryOpen = openMobileCategories.includes(item.label);

              return (
                <div key={item.label} className="py-0.5">
                  {item.hasDropdown ? (
                    <button
                      type="button"
                      className={`w-full text-left py-3.5 flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                        isCategoryOpen ? 'text-[#006FCC]' : 'text-[#1B1F23]'
                      }`}
                      onClick={() => toggleMobileCategory(item.label)}
                    >
                      <span className="text-[16.5px] font-bold tracking-tight font-['Montserrat',sans-serif]">
                        {item.label}
                      </span>
                      <LabsterChevron isOpen={isCategoryOpen} />
                    </button>
                  ) : (
                    <Link
                      href={item.to || '/'}
                      className="block py-3.5 text-[16.5px] font-bold text-[#1B1F23] hover:text-[#006FCC] transition-colors tracking-tight font-['Montserrat',sans-serif]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Accordion Content for Category */}
                  {item.hasDropdown && (
                    <div
                      className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out"
                      style={{
                        gridTemplateRows: isCategoryOpen ? '1fr' : '0fr',
                        opacity: isCategoryOpen ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden min-h-0">
                        <div className="pt-1 pb-4 space-y-4">
                          {item.columns?.map((col: any, colIdx: number) => (
                            <div
                              key={colIdx}
                              className={`${colIdx > 0 ? 'pt-3.5 border-t border-[#E8E9E9]' : ''} space-y-2.5`}
                            >
                              {/* Labster Category Title */}
                              <div className="text-[13px] font-bold text-[#006FCC] font-['Montserrat',sans-serif] px-1">
                                {col.categoryTitle}
                              </div>

                              {/* Links list */}
                              <div className="space-y-2.5">
                                {col.items?.map((sub: any, sIdx: number) => {
                                  const subKey = `${item.label}::${col.categoryTitle}::${sub.label}`;
                                  const isMobileSubOpen = openMobileSubItems.includes(subKey);
                                  const hasSub = Boolean(sub.subItems && sub.subItems.length > 0);

                                  return (
                                    <div
                                      key={sIdx}
                                      className="p-2 rounded-xl hover:bg-[#F7F8F8] transition-colors"
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <Link
                                          href={sub.to || '/'}
                                          onClick={() => setMobileOpen(false)}
                                          className="block flex-1 min-w-0 group"
                                        >
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-[14.5px] font-bold text-[#1B1F23] group-hover:text-[#006FCC] transition-colors font-['Montserrat',sans-serif] leading-snug">
                                              {sub.label}
                                            </span>
                                            {sub.badge && (
                                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#EDF5FA] text-[#006FCC] border border-[#006FCC]/20 shrink-0">
                                                {sub.badge}
                                              </span>
                                            )}
                                          </div>
                                          {sub.desc && (
                                            <p className="text-[12.5px] text-[#5F6265] leading-relaxed line-clamp-2 mt-0.5 font-['Lato',sans-serif]">
                                              {sub.desc}
                                            </p>
                                          )}
                                        </Link>

                                        {/* Inner Sub-links Toggle Button */}
                                        {hasSub && (
                                          <button
                                            type="button"
                                            aria-label={isMobileSubOpen ? "Collapse sub-links" : "Expand sub-links"}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              toggleMobileSubItem(subKey);
                                            }}
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-all mt-0.5 ${
                                              isMobileSubOpen
                                                ? 'bg-[#006FCC] text-white shadow-xs'
                                                : 'bg-[#F4F6F8] text-[#1B1F23] border border-[#E8E9E9] hover:bg-[#EDF5FA] hover:text-[#006FCC]'
                                            }`}
                                            title="Toggle Sub-links"
                                          >
                                            <LabsterChevron
                                              isOpen={isMobileSubOpen}
                                              className={`!w-3 !h-3 ${isMobileSubOpen ? '!text-white' : '!text-[#1B1F23]'}`}
                                            />
                                          </button>
                                        )}
                                      </div>

                                      {/* Sub-item child links */}
                                      {hasSub && (
                                        <div
                                          className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-250 ease-out"
                                          style={{
                                            gridTemplateRows: isMobileSubOpen ? '1fr' : '0fr',
                                            opacity: isMobileSubOpen ? 1 : 0,
                                          }}
                                        >
                                          <div className="overflow-hidden min-h-0">
                                            <div className="mt-2.5 ml-1 pl-3 border-l-2 border-[#006FCC] space-y-1 bg-[#F7F8F8] p-2.5 rounded-r-xl border border-l-0 border-[#E8E9E9]">
                                              <div className="text-[10.5px] font-bold text-[#006FCC] px-1 font-['Montserrat',sans-serif]">
                                                {getSubmenuHeading(sub.label)}
                                              </div>
                                              {sub.subItems!.map((child: any, cIdx: number) => (
                                                <Link
                                                  key={cIdx}
                                                  href={child.to || '/'}
                                                  onClick={() => setMobileOpen(false)}
                                                  className="flex items-center justify-between text-[12px] font-medium text-[#1B1F23] hover:text-[#006FCC] py-1 px-1.5 rounded hover:bg-white transition-colors"
                                                >
                                                  <span className="truncate">{child.label}</span>
                                                  {child.badge && (
                                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white text-[#006FCC] border border-[#006FCC]/20 shrink-0 ml-1">
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

                          {/* Featured Panel for Category (Labster Card) */}
                          {item.featuredPanel && (
                            <div className="mt-3 p-4 rounded-xl bg-[#F7F8F8] border border-[#E8E9E9] space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#006FCC] font-['Montserrat',sans-serif] block">
                                {item.featuredPanel.eyebrow}
                              </span>
                              <h5 className="font-['Montserrat',sans-serif] text-[14px] font-bold text-[#1B1F23] leading-snug">
                                {item.featuredPanel.title}
                              </h5>
                              <p className="text-[12px] text-[#5F6265] leading-relaxed line-clamp-2 font-['Lato',sans-serif]">
                                {item.featuredPanel.desc}
                              </p>
                              <div className="pt-2.5">
                                <Link
                                  href={item.featuredPanel.ctaHref}
                                  onClick={() => setMobileOpen(false)}
                                  className="w-full h-10 px-4 text-[13.5px] font-bold bg-[#006FCC] text-white hover:bg-[#005399] shadow-xs rounded-xl transition-all duration-200 active:scale-[0.98] inline-flex items-center justify-center gap-2 font-['Montserrat',sans-serif] cursor-pointer"
                                >
                                  <span>{item.featuredPanel.ctaText}</span>
                                  <ArrowRight className="w-4 h-4 shrink-0" />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Labster Pinned Bottom Action Button ── */}
          <div className="p-4 sm:p-5 border-t border-[#E8E9E9] bg-white shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openDemoModal({ source: 'Navbar Mobile Drawer' });
              }}
              className="w-full h-12 px-6 text-[14.5px] font-bold bg-[#006FCC] text-white hover:bg-[#005399] shadow-sm rounded-xl transition-all duration-200 active:scale-[0.98] inline-flex items-center justify-center gap-2 font-['Montserrat',sans-serif] cursor-pointer"
            >
              <span>Book a Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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