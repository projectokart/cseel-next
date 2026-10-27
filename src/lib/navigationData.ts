export interface NavStage3Item {
  id: string;
  label: string;
  to: string;
  desc?: string;
  badge?: string;
  enabled?: boolean;
  subItems?: {
    id?: string;
    label: string;
    to: string;
    badge?: string;
  }[];
}

export interface NavStage2Column {
  id: string;
  categoryTitle: string;
  to?: string;
  enabled?: boolean;
  items: NavStage3Item[];
}

export interface NavStage1Category {
  id: string;
  label: string;
  to?: string;
  enabled: boolean;
  hasDropdown: boolean;
  columns?: NavStage2Column[];
  featuredPanel?: {
    eyebrow: string;
    title: string;
    desc: string;
    ctaText: string;
    ctaHref: string;
  };
}

export const DEFAULT_NAV_3STAGE_DATA: NavStage1Category[] = [
  {
    id: 'experiential-labs',
    label: 'Experiential Labs',
    to: '/domain/science',
    enabled: true,
    hasDropdown: true,
    columns: [
      {
        id: 'col-core-steam-science-math',
        categoryTitle: 'Science & Mathematics',
        to: '/domain/science',
        enabled: true,
        items: [
          {
            id: 'item-science-lab',
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
            id: 'item-math-modeling',
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
        id: 'col-engineering-maker-art',
        categoryTitle: 'Engineering, Maker & STEAM Arts',
        to: '/subject/engineering',
        enabled: true,
        items: [
          {
            id: 'item-engineering-tech',
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
            id: 'item-maker-lab',
            label: 'Maker Lab & Tinkering Studio',
            to: '/makerspace',
            desc: 'Hands-on makerspace with woodworking, prototyping, electronics workbench & hand tools.',
            badge: 'Makerspace',
            subItems: [
              { label: 'Complete Makerspace Catalog', to: '/makerspace', badge: 'Catalog' },
              { label: 'Prototyping & Digital Fabrication', to: '/makerspace' },
              { label: 'Hand & Power Tools Workshop', to: '/makerspace' },
            ],
          },
          {
            id: 'item-projectokart',
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
            id: 'item-art-craft',
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
    enabled: true,
    hasDropdown: true,
    columns: [
      {
        id: 'col-materials-catalog',
        categoryTitle: 'Apparatus Catalog & Lab Packages',
        to: '/materials',
        enabled: true,
        items: [
          {
            id: 'item-materials-catalog',
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
            id: 'item-atl-materials',
            label: 'ATL Lab Material List (Packages 1-4)',
            to: '/steam-lab/atl',
            desc: 'Complete NITI Aayog Package 1-4 equipment list, 3D printers, sensors & robotics BOQ.',
            badge: 'ATL Material',
            subItems: [
              { label: 'ATL Material List & Equipment BOQ', to: '/steam-lab/atl', badge: 'Equipment List' },
              { label: 'Package 1 & 2: Prototyping & 3D Printers', to: '/steam-lab/atl' },
              { label: 'Package 3 & 4: Robotics, IoT & Power Tools', to: '/steam-lab/atl' },
              { label: 'NITI Aayog GeM Compliance Norms', to: '/schemes/atl-grants' },
            ],
          },
          {
            id: 'item-cbse-mandatory',
            label: 'CBSE Composite Science Lab (49 List)',
            to: '/composite-lab',
            desc: 'Mandatory SARAS 49 non-consumable apparatus list and lab setup specifications.',
            badge: 'CBSE Norms',
            subItems: [
              { label: '49 Mandatory Non-Consumable List', to: '/composite-lab', badge: 'CBSE List' },
              { label: '600 Sq Ft Lab Blueprint & 8 Sinks', to: '/composite-lab' },
              { label: 'SARAS Lab Safety & First Aid Setup', to: '/safety' },
            ],
          },
        ],
      },
      {
        id: 'col-materials-procurement',
        categoryTitle: 'Procurement & Institutional Cart',
        to: '/materials',
        enabled: true,
        items: [
          {
            id: 'item-instant-quotation',
            label: 'Instant Quotation Generator',
            to: '/materials',
            desc: 'Generate instant GST-compliant formal estimates and quotations for school tenders.',
            subItems: [
              { label: 'Instant Quotation Download', to: '/materials', badge: 'Instant PDF' },
              { label: 'GeM Procurement Assistance', to: '/schemes' },
            ],
          },
          {
            id: 'item-requisition-cart',
            label: 'Requisition Cart & Checkout',
            to: '/cart',
            desc: 'Review selected school lab equipment and submit official purchase inquiries.',
            subItems: [
              { label: 'Open Material Cart', to: '/cart', badge: 'Cart' },
              { label: 'Bulk School Purchase Request', to: '/contact-us' },
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
    enabled: true,
    hasDropdown: true,
    columns: [
      {
        id: 'col-schools-directory',
        categoryTitle: 'Directory & Discovery',
        to: '/schools',
        enabled: true,
        items: [
          {
            id: 'item-partner-schools',
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
            id: 'item-board-explorer',
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
        id: 'col-schools-faculty',
        categoryTitle: 'Faculty & Enablement',
        to: '/edu-network/teachers',
        enabled: true,
        items: [
          {
            id: 'item-verified-faculty',
            label: 'Verified Faculty and Teaching Jobs',
            to: '/edu-network/teachers',
            desc: 'Certified STEM educators, ATL coordinators, and hands-on lab demonstrators.',
            subItems: [
              { label: 'STEM Educator Roster', to: '/edu-network/teachers' },
              { label: 'Expert ATL Mentors', to: '/edu-network/teachers' },
            ],
          },
          {
            id: 'item-institutional-partnerships',
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
    enabled: true,
    hasDropdown: true,
    columns: [
      {
        id: 'col-competitions-hackathons',
        categoryTitle: 'Student Competitions & Hackathons',
        to: '/events',
        enabled: true,
        items: [
          {
            id: 'item-national-hackathons',
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
            id: 'item-science-exhibitions',
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
        id: 'col-workshops-training',
        categoryTitle: 'Workshops & Faculty CPD',
        to: '/events',
        enabled: true,
        items: [
          {
            id: 'item-student-workshops',
            label: 'Hands-on Student Workshops',
            to: '/workshops',
            desc: 'Weekend robotics, 3D printing, space science, and AI immersion bootcamps.',
            subItems: [
              { label: 'Weekend Robotics Bootcamps', to: '/workshops' },
              { label: 'AI & IoT Tinkering Workshops', to: '/workshops' },
            ],
          },
          {
            id: 'item-teacher-cpd',
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
    enabled: true,
    hasDropdown: true,
    columns: [
      {
        id: 'col-about-pedagogy',
        categoryTitle: 'Our Organization & Pedagogy',
        to: '/about',
        enabled: true,
        items: [
          {
            id: 'item-about-cseel',
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
            id: 'item-why-cseel',
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
        id: 'col-stakeholders-careers',
        categoryTitle: 'Who It\'s For & Careers',
        to: '/for-institutions',
        enabled: true,
        items: [
          {
            id: 'item-for-stakeholders',
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
            id: 'item-careers',
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
    enabled: true,
    hasDropdown: true,
    columns: [
      {
        id: 'col-academic-schemes',
        categoryTitle: 'Academic Insights & Govt Schemes',
        to: '/blog',
        enabled: true,
        items: [
          {
            id: 'item-academic-blog',
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
            id: 'item-govt-schemes',
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
        id: 'col-media-tour',
        categoryTitle: 'Media & Visual Showcase',
        to: '/virtual-lab-tour',
        enabled: true,
        items: [
          {
            id: 'item-360-tour',
            label: '360° Interactive Lab Tour',
            to: '/virtual-lab-tour',
            desc: 'Take an interactive walkthrough inside modern composite science laboratories.',
            subItems: [
              { label: 'Launch 360° Walkthrough', to: '/virtual-lab-tour', badge: '360°' },
              { label: 'Lab Equipment Inspection', to: '/virtual-lab-tour' },
            ],
          },
          {
            id: 'item-media-gallery',
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
