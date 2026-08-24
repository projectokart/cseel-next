export interface OrganizationItem {
  id: string;
  slug?: string;
  name: string;
  type: "School" | "University" | "Research Institute" | "Atal Tinkering Lab" | "College";
  affiliation: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  locality?: string;
  email: string;
  phone: string;
  website: string;
  verified: boolean;
  rating: number;
  reviews: number;
  stemLabsCount: number;
  studentStrength: number;
  logo: string;
  bannerImage: string;
  description: string;
  openJobsCount: number;
  established: number;
  facilities: string[];
  // UniApply + CSEEL Hybrid Fields
  classesOffered?: string;
  monthlyFees?: string;
  monthlyFeesNum?: number;
  board?: "CBSE" | "ICSE" | "IB" | "State Board" | "UGC/AICTE";
  studentFacultyRatio?: string;
  admissionStatus?: "On Going" | "Closing Soon" | "Open for 2026-27" | "Merit Based";
  isFeatured?: boolean;
  likesCount?: number;
}

export interface TeacherResourceItem {
  id: string;
  title: string;
  type: "Lesson Plan" | "Lab Manual" | "Research Paper" | "Worksheet" | "Simulation Demo";
  subject: string;
  size: string;
  visibility: "public" | "private" | "followers";
  downloadsCount: number;
}

export interface TeacherItem {
  id: string;
  slug?: string;
  name: string;
  email: string;
  phone: string;
  subject: "Physics" | "Chemistry" | "Biology" | "Mathematics" | "Robotics & AI" | "Computer Science" | "Lab Technology";
  qualification: string;
  experienceYears: number;
  currentInstitute: string;
  city: string;
  state: string;
  pincode: string;
  verified: boolean;
  nepCertified: boolean;
  rating: number;
  reviewsCount: number;
  avatar: string;
  bio: string;
  skills: string[];
  expectedSalary: string;
  availableFor: ("Full-Time" | "Visiting Faculty" | "Online Mentor" | "Lab Workshop Instructor")[];
  // 3-Day Flash Job Seeking Status (Immediate Joiner)
  isActivelySeekingJob?: boolean;
  jobSeekingExpiresInHours?: number; // e.g. 68h out of 72h
  immediateJoining?: boolean;
  jobSeekingActivatedDate?: string;
  // Granular Privacy Controls
  profileVisibility?: "public" | "private" | "followers";
  showContactInfo?: boolean;
  resources?: TeacherResourceItem[];
}

export interface ProjectFileItem {
  id: string;
  name: string;
  type: "pdf" | "code" | "cad" | "circuit" | "dataset" | "doc";
  size: string;
  visibility: "public" | "private" | "followers";
  lastUpdated: string;
  url?: string;
}

export interface StudentProjectItem {
  id: string;
  title: string;
  category: "IoT & Robotics" | "Renewable Energy" | "BioTech & Chemistry" | "AI & Space Science" | "Applied Physics";
  description: string;
  status: "Completed" | "In Progress" | "Patent Pending" | "National Fair Winner";
  featuredImage: string;
  visibility: "public" | "private" | "followers";
  award?: string;
  starsCount: number;
  tags: string[];
  files: ProjectFileItem[];
}

export interface StudentItem {
  id: string;
  slug?: string;
  name: string;
  email: string;
  classGrade: string;
  schoolCollege: string;
  city: string;
  state: string;
  pincode: string;
  verified: boolean;
  avatar: string;
  interests: string[];
  projectsCount: number;
  experimentsCompleted: number;
  topProject: string;
  badges: string[];
  bio: string;
  // Granular Privacy Controls
  profileVisibility: "public" | "private" | "followers";
  showContactInfo: boolean;
  projects: StudentProjectItem[];
}

export interface EduJobItem {
  id: string;
  slug?: string;
  orgId: string;
  orgName: string;
  orgLogo: string;
  orgRating: number;
  title: string;
  subject: "Physics" | "Chemistry" | "Biology" | "Mathematics" | "Robotics & AI" | "Computer Science" | "Lab Technology";
  roleType: "Full-Time" | "Part-Time" | "Visiting Faculty" | "Lab Instructor" | "Research Fellow";
  jobTypeCategory: string;
  jobShift: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  salary: string;
  salaryNumMin: number;
  salaryNumMax: number;
  experienceRequired: string;
  qualifications: string;
  openings: number;
  postedDate: string;
  isUrgentlyHiring: boolean;
  easilyApply: boolean;
  benefits: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  attachmentName?: string;
  attachmentSize?: string;
  verified: boolean;
}

export interface OrgPostItem {
  id: string;
  orgId: string;
  authorName: string;
  authorLogo: string;
  content: string;
  image?: string;
  attachmentName?: string;
  attachmentSize?: string;
  tags: string[];
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  comments: {
    id: string;
    userName: string;
    userRole: string;
    userAvatar: string;
    comment: string;
    createdAt: string;
  }[];
  shares: number;
  isFeaturedCarousel?: boolean;
}

export interface OrgReviewItem {
  id: string;
  orgId: string;
  userName: string;
  userRole: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  verifiedReviewer: boolean;
}

// ─── 100+ REALISTIC ORGANIZATIONS ACROSS ALL INDIAN STATES ───────────────────
export const ALL_ORGANIZATIONS: OrganizationItem[] = [
  // ── National Research Institutes ──
  {
    id: "isro-hq",
    name: "ISRO - Indian Space Research Organisation HQ",
    type: "Research Institute",
    affiliation: "Department of Space, Govt. of India",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560094",
    address: "Antariksh Bhavan, New BEL Road",
    email: "stem-outreach@isro.gov.in",
    phone: "+91 80 2217 2296",
    website: "https://www.isro.gov.in",
    verified: true,
    rating: 5.0,
    reviews: 1450,
    stemLabsCount: 24,
    studentStrength: 1200,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Indian_Space_Research_Organisation_Logo.svg/1200px-Indian_Space_Research_Organisation_Logo.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1517976487507-5b3b4a45a67c?w=800&auto=format&fit=crop",
    description: "India's premier space research agency leading national planetary exploration, satellite technology, and educational space mentorship programs.",
    openJobsCount: 4,
    established: 1969,
    facilities: ["Clean Rooms", "Satellite Propulsion Lab", "Planetary Simulation Chamber", "Astronomy Dome"]
  },
  {
    id: "drdo-hq",
    name: "DRDO - Defence Research & Development Organisation",
    type: "Research Institute",
    affiliation: "Ministry of Defence, Govt. of India",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110011",
    address: "DRDO Bhawan, Rajaji Marg",
    email: "recruitment@drdo.gov.in",
    phone: "+91 11 2301 5560",
    website: "https://www.drdo.gov.in",
    verified: true,
    rating: 4.9,
    reviews: 980,
    stemLabsCount: 32,
    studentStrength: 800,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/DRDO_Logo.png/600px-DRDO_Logo.png",
    bannerImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
    description: "National defense technology agency fostering cutting-edge robotics, advanced materials, ballistics, and embedded electronics development.",
    openJobsCount: 5,
    established: 1958,
    facilities: ["Advanced Robotics Facility", "Material Science Characterization", "Autonomous Drone Lab"]
  },
  {
    id: "iisc-bangalore",
    name: "IISc - Indian Institute of Science",
    type: "University",
    affiliation: "Institute of National Importance / Autonomous",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560012",
    address: "CV Raman Road, Yeshwantpur",
    email: "academics@iisc.ac.in",
    phone: "+91 80 2293 2001",
    website: "https://iisc.ac.in",
    verified: true,
    rating: 5.0,
    reviews: 2100,
    stemLabsCount: 48,
    studentStrength: 4500,
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Indian_Institute_of_Science_2019_logo.svg/1200px-Indian_Institute_of_Science_2019_logo.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop",
    description: "India's highest-ranked university for scientific research, advanced physical sciences, nanotechnology, and interdisciplinary engineering.",
    openJobsCount: 6,
    established: 1909,
    facilities: ["Cryogenic Physics Lab", "Supercomputing Center", "NMR Spectroscopy", "Cleanrooms"]
  },
  {
    id: "csir-ncl",
    name: "CSIR-NCL National Chemical Laboratory",
    type: "Research Institute",
    affiliation: "Council of Scientific and Industrial Research",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411008",
    address: "Dr. Homi Bhabha Road, Pashan",
    email: "hr@ncl.res.in",
    phone: "+91 20 2590 2000",
    website: "https://www.ncl-india.org",
    verified: true,
    rating: 4.9,
    reviews: 670,
    stemLabsCount: 28,
    studentStrength: 650,
    logo: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop",
    description: "Global center of excellence in chemical sciences, green polymers, organic synthesis, catalysis, and industrial chemical engineering.",
    openJobsCount: 3,
    established: 1950,
    facilities: ["Advanced Mass Spectrometry", "Polymer Characterization", "Catalysis Reactor"]
  },
  {
    id: "barc-mumbai",
    name: "BARC - Bhabha Atomic Research Centre",
    type: "Research Institute",
    affiliation: "Department of Atomic Energy, Govt. of India",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400085",
    address: "Trombay, Mumbai",
    email: "info@barc.gov.in",
    phone: "+91 22 2550 5050",
    website: "https://www.barc.gov.in",
    verified: true,
    rating: 5.0,
    reviews: 1120,
    stemLabsCount: 35,
    studentStrength: 900,
    logo: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop",
    description: "India's premier nuclear research facility engaged in nuclear physics, radio-isotopes in healthcare, and advanced spectroscopy.",
    openJobsCount: 4,
    established: 1954,
    facilities: ["Research Reactor", "Radio-isotope Lab", "Laser Fusion System", "Supercomputer"]
  },
  {
    id: "iit-bombay",
    name: "IIT Bombay - Indian Institute of Technology",
    type: "University",
    affiliation: "Institute of National Importance",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400076",
    address: "Main Gate Rd, IIT Area, Powai",
    email: "admissions@iitb.ac.in",
    phone: "+91 22 2572 2545",
    website: "https://www.iitb.ac.in",
    verified: true,
    rating: 5.0,
    reviews: 3200,
    stemLabsCount: 52,
    studentStrength: 11000,
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/1200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop",
    description: "World-renowned technical university fostering innovation, MakerSpaces, hardware incubators, and cutting-edge STEM research.",
    openJobsCount: 7,
    established: 1958,
    facilities: ["Tinkerers' Lab", "Nanotechnology Fab", "Robotics Testbed", "Wind Tunnel"]
  },
  {
    id: "iit-delhi",
    name: "IIT Delhi - Indian Institute of Technology",
    type: "University",
    affiliation: "Institute of National Importance",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110016",
    address: "Hauz Khas, New Delhi",
    email: "faculty-recruitment@iitd.ac.in",
    phone: "+91 11 2659 7135",
    website: "https://home.iitd.ac.in",
    verified: true,
    rating: 5.0,
    reviews: 2890,
    stemLabsCount: 46,
    studentStrength: 9500,
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
    description: "Pioneering technology and research institution driving technological breakthroughs in AI, bio-engineering, and sustainable energy.",
    openJobsCount: 5,
    established: 1961,
    facilities: ["AI Supercluster", "Micro-electronics Fabrication", "Biomedical Instrumentation"]
  },
  {
    id: "aiims-delhi",
    name: "AIIMS New Delhi - All India Institute of Medical Sciences",
    type: "University",
    affiliation: "Ministry of Health & Family Welfare",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110029",
    address: "Sri Aurobindo Marg, Ansari Nagar",
    email: "director@aiims.edu",
    phone: "+91 11 2658 8500",
    website: "https://www.aiims.edu",
    verified: true,
    rating: 5.0,
    reviews: 4100,
    stemLabsCount: 40,
    studentStrength: 3200,
    logo: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop",
    description: "Apex medical education and research institute in India leading genomics, clinical trials, and molecular biology practicals.",
    openJobsCount: 6,
    established: 1956,
    facilities: ["Molecular Diagnostics Lab", "Electron Microscopy", "Stem Cell Bank"]
  },
  {
    id: "iit-bbsr",
    name: "IIT Bhubaneswar - Indian Institute of Technology",
    type: "University",
    affiliation: "Institute of National Importance",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "752050",
    address: "Argul, Jatni, Khordha",
    email: "registrar@iitbbs.ac.in",
    phone: "+91 674 713 4567",
    website: "https://www.iitbbs.ac.in",
    verified: true,
    rating: 4.9,
    reviews: 1420,
    stemLabsCount: 30,
    studentStrength: 3800,
    logo: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop",
    description: "Premier engineering and research institute in Eastern India with specialized research in coastal engineering, climate science, and IoT.",
    openJobsCount: 4,
    established: 2008,
    facilities: ["IoT Innovation Lab", "Advanced Material Testing", "Fluid Dynamics Flume"]
  },

  // ── Premier Schools & Atal Tinkering Labs (CBSE / ICSE / IB) ──
  {
    id: "dps-rkp",
    name: "Delhi Public School (DPS) R.K. Puram",
    type: "School",
    affiliation: "CBSE Affiliated",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110022",
    address: "Sector 12, R.K. Puram",
    email: "principal@dpsrkp.net",
    phone: "+91 11 4911 5555",
    website: "https://dpsrkp.net",
    verified: true,
    rating: 4.9,
    reviews: 1850,
    stemLabsCount: 8,
    studentStrength: 8500,
    logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
    description: "One of India's leading CBSE institutions renowned for outstanding science olympiad records, robotics teams, and modern chemistry/physics labs.",
    openJobsCount: 3,
    established: 1972,
    facilities: ["Atal Tinkering Lab", "Physics Lab", "Chemistry Lab", "Biology Lab", "Robotics Club"]
  },
  {
    id: "kvs-iit-powai",
    name: "Kendriya Vidyalaya IIT Powai",
    type: "School",
    affiliation: "CBSE / KVS Central Govt.",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400076",
    address: "IIT Campus, Powai",
    email: "kviitpowai@gmail.com",
    phone: "+91 22 2572 0386",
    website: "https://iitpowai.kvs.ac.in",
    verified: true,
    rating: 4.8,
    reviews: 920,
    stemLabsCount: 6,
    studentStrength: 2400,
    logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop",
    description: "Exemplary model school fostering deep scientific temperament with state-of-the-art Atal Tinkering Lab sponsored by NITI Aayog.",
    openJobsCount: 2,
    established: 1964,
    facilities: ["NITI Aayog Atal Tinkering Lab", "Composite Science Lab", "Computer Science Lab"]
  },
  {
    id: "dav-bbsr-cspur",
    name: "DAV Public School Chandrasekharpur",
    type: "School",
    affiliation: "CBSE / DAVCMC New Delhi",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751021",
    address: "Sailashree Vihar, Chandrasekharpur",
    email: "davcspur@gmail.com",
    phone: "+91 674 274 0651",
    website: "https://davcsp.org",
    verified: true,
    rating: 4.9,
    reviews: 1320,
    stemLabsCount: 7,
    studentStrength: 4200,
    logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
    description: "Leading CBSE institution producing top national rankers in JEE, NEET, and Kishore Vaigyanik Protsahan Yojana (KVPY) science competitions.",
    openJobsCount: 4,
    established: 1989,
    facilities: ["Innovation Hub", "3D Printing & Robotics Lab", "Class A Chemistry Lab", "Bio-Tech Lab"]
  },
  {
    id: "sai-international",
    name: "SAI International School",
    type: "School",
    affiliation: "CBSE / Cambridge International",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751024",
    address: "Plot 5A, Chandrasekharpur, Infocity Road",
    email: "info@saiinternational.edu.in",
    phone: "+91 674 710 0100",
    website: "https://saiinternational.edu.in",
    verified: true,
    rating: 4.9,
    reviews: 1650,
    stemLabsCount: 10,
    studentStrength: 5200,
    logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
    description: "Ranked #1 Co-ed Day-cum-Boarding School in India with world-class science labs, robotics training centers, and experiential STEM learning.",
    openJobsCount: 5,
    established: 2008,
    facilities: ["STEM Exploratorium", "Robotics Research Cell", "Optics Lab", "Bio-Genetics Lab"]
  },
  {
    id: "apeejay",
    name: "Apeejay School International",
    type: "School",
    affiliation: "IB World School / Cambridge",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110017",
    address: "Panchsheel Park, South Delhi",
    email: "admissions@asi.apeejay.edu",
    phone: "+91 11 4054 2900",
    website: "https://international.apeejay.edu",
    verified: true,
    rating: 4.9,
    reviews: 1140,
    stemLabsCount: 8,
    studentStrength: 1800,
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop",
    description: "Delhi's leading IB Continuum World School with experiential science ateliers, PYP/MYP inquiry labs, and robotics arenas.",
    openJobsCount: 3,
    established: 2019,
    facilities: ["IB MYP Science Atelier", "Design Technology Workshop", "Optics & Sensor Studio", "Robotics Arena"]
  },
  {
    id: "mothers",
    name: "The Mother's International School",
    type: "School",
    affiliation: "CBSE / Sri Aurobindo Ashram",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110016",
    address: "Sri Aurobindo Marg, Kalu Sarai",
    email: "admin@themis.in",
    phone: "+91 11 2696 4140",
    website: "https://themis.in",
    verified: true,
    rating: 5.0,
    reviews: 2100,
    stemLabsCount: 9,
    studentStrength: 3200,
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop",
    description: "Top-ranked institution fostering holistic value-based scientific education, environmental laboratories, and national science olympiad winners.",
    openJobsCount: 4,
    established: 1956,
    facilities: ["Advanced Physical Sciences Lab", "Green Chemistry Suite", "Herbal Botanical Garden", "Atal Tinkering Lab"]
  },
  {
    id: "amrita",
    name: "Amrita Vidyalayam Pushp Vihar",
    type: "School",
    affiliation: "CBSE / Mata Amritanandamayi Math",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110017",
    address: "Sector 7, Pushp Vihar, Saket",
    email: "delhi@amritavidyalayam.edu.in",
    phone: "+91 11 2956 2200",
    website: "https://delhi.amritavidyalayam.edu.in",
    verified: true,
    rating: 4.8,
    reviews: 870,
    stemLabsCount: 6,
    studentStrength: 2100,
    logo: "https://www.jigyasu.co.in/assets/images/logo4.png",
    bannerImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop",
    description: "Centrally located school renowned for Atal Tinkering Labs, student robotics innovations, and value-integrated experiential STEM education.",
    openJobsCount: 3,
    established: 2003,
    facilities: ["NITI Aayog ATL Lab", "Computerised Physics Lab", "Chemistry Wet Lab", "Robotics Club"]
  },
  {
    id: "indus",
    name: "Indus International School",
    type: "School",
    affiliation: "IB World School / Cambridge",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "562125",
    address: "Billapura Cross, Sarjapur",
    email: "admissions@indusschool.com",
    phone: "+91 80 2289 5900",
    website: "https://www.indusschool.com",
    verified: true,
    rating: 5.0,
    reviews: 1780,
    stemLabsCount: 12,
    studentStrength: 2600,
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop",
    description: "Ranked #1 International Day-cum-Boarding school featuring AI robot teachers, 3D maker labs, and state-of-the-art physics practical suites.",
    openJobsCount: 5,
    established: 2003,
    facilities: ["EAGLE AI Teaching Lab", "Collaborative MakerSpace", "Optics & Photonics Lab", "Biotech Research Incubator"]
  }
];

// Expand to 100 organizations programmatically
const ALL_CITIES = [
  { city: "Bhubaneswar", state: "Odisha", pin: "751024" },
  { city: "Cuttack", state: "Odisha", pin: "753001" },
  { city: "Rourkela", state: "Odisha", pin: "769008" },
  { city: "New Delhi", state: "Delhi", pin: "110001" },
  { city: "South Delhi", state: "Delhi", pin: "110049" },
  { city: "Noida", state: "Uttar Pradesh", pin: "201301" },
  { city: "Lucknow", state: "Uttar Pradesh", pin: "226001" },
  { city: "Mumbai", state: "Maharashtra", pin: "400001" },
  { city: "Pune", state: "Maharashtra", pin: "411001" },
  { city: "Bengaluru", state: "Karnataka", pin: "560001" },
  { city: "Hyderabad", state: "Telangana", pin: "500001" },
  { city: "Chennai", state: "Tamil Nadu", pin: "600001" },
  { city: "Kolkata", state: "West Bengal", pin: "700001" },
  { city: "Jaipur", state: "Rajasthan", pin: "302001" },
  { city: "Ahmedabad", state: "Gujarat", pin: "380001" },
  { city: "Dehradun", state: "Uttarakhand", pin: "248001" },
  { city: "Patna", state: "Bihar", pin: "800001" },
  { city: "Bhopal", state: "Madhya Pradesh", pin: "462001" },
  { city: "Kochi", state: "Kerala", pin: "682001" },
  { city: "Guwahati", state: "Assam", pin: "781001" }
];

const ORG_NAMES = [
  "Army Public School", "DAV International School", "Kendriya Vidyalaya Sangathan",
  "Ryan International School", "St. Joseph's Higher Secondary", "Bal Bharati Public School",
  "Birla High School", "Amity International School", "Greenwood High International",
  "National Institute of Technology", "Atal Tinkering Research Hub", "State Institute of Science & Technology"
];

for (let i = 14; i <= 100; i++) {
  const c = ALL_CITIES[i % ALL_CITIES.length];
  const namePrefix = ORG_NAMES[i % ORG_NAMES.length];
  const type: OrganizationItem["type"] = i % 4 === 0 ? "Atal Tinkering Lab" : i % 5 === 0 ? "University" : "School";
  const pinNum = parseInt(c.pin) + (i % 20);

  ALL_ORGANIZATIONS.push({
    id: `org-campus-${i}`,
    name: `${namePrefix} (Campus ${i})`,
    type,
    affiliation: type === "School" ? "CBSE / State Board" : type === "Atal Tinkering Lab" ? "NITI Aayog AIM Affiliated" : "UGC / AICTE Approved",
    city: c.city,
    state: c.state,
    pincode: pinNum.toString(),
    address: `Sector ${i % 30 + 1}, Institutional Area, ${c.city}`,
    email: `contact.campus${i}@${namePrefix.toLowerCase().replace(/[^a-z0-9]/g, "")}.edu.in`,
    phone: `+91 ${c.city === "Delhi" ? "11" : "80"} 298${1000 + i}`,
    website: `https://${namePrefix.toLowerCase().replace(/[^a-z0-9]/g, "")}-campus${i}.edu.in`,
    verified: true,
    rating: Number((4.5 + (i % 5) * 0.1).toFixed(1)),
    reviews: 120 + i * 8,
    stemLabsCount: 3 + (i % 8),
    studentStrength: 800 + i * 35,
    logo: `https://images.unsplash.com/photo-${1580582932707 + (i % 10)}?w=200&auto=format&fit=crop`,
    bannerImage: `https://images.unsplash.com/photo-${1509062522246 + (i % 10)}?w=800&auto=format&fit=crop`,
    description: `A premier ${type.toLowerCase()} in ${c.city}, ${c.state} committed to experiential learning, student science projects, and NEP-2020 hands-on education.`,
    openJobsCount: (i % 4) + 1,
    established: 1980 + (i % 40),
    facilities: ["Physics Lab", "Chemistry Lab", "Composite STEM Lab", "Robotics Lab"]
  });
}

// ─── ENRICH ALL ORGANIZATIONS WITH UNIAPPLY HYBRID PROPERTIES ────────────────
ALL_ORGANIZATIONS.forEach((org, idx) => {
  const isSchool = org.type === "School";
  const isUniversity = org.type === "University" || org.type === "College";
  const isResearch = org.type === "Research Institute";
  
  if (!org.board) {
    if (org.affiliation?.toLowerCase().includes("ib") || org.name.toLowerCase().includes("international")) org.board = "IB";
    else if (org.affiliation?.toLowerCase().includes("icse") || org.name.toLowerCase().includes("convent")) org.board = "ICSE";
    else if (isUniversity || isResearch) org.board = "UGC/AICTE";
    else org.board = "CBSE";
  }

  if (!org.classesOffered) {
    if (org.name.toLowerCase().includes("petite") || org.name.toLowerCase().includes("pre-school")) org.classesOffered = "Pre-Nursery - UKG";
    else if (isUniversity) org.classesOffered = "Undergraduate - Ph.D.";
    else if (isResearch) org.classesOffered = "Ph.D. & Fellowships";
    else if (org.type === "Atal Tinkering Lab") org.classesOffered = "Class 6 - Class 12 (STEM)";
    else org.classesOffered = "Nursery - Class 12";
  }

  if (org.monthlyFeesNum === undefined) {
    if (org.board === "IB") {
      org.monthlyFeesNum = 33900;
      org.monthlyFees = "₹33.9K";
    } else if (org.name.toLowerCase().includes("heritage") || org.name.toLowerCase().includes("apeejay") || org.name.toLowerCase().includes("goenka")) {
      org.monthlyFeesNum = 29000;
      org.monthlyFees = "₹29.0K";
    } else if (org.name.toLowerCase().includes("sapphire") || org.name.toLowerCase().includes("dps") || isSchool) {
      org.monthlyFeesNum = 17000 + ((idx * 1300) % 15000);
      org.monthlyFees = `₹${(org.monthlyFeesNum / 1000).toFixed(1)}K`;
    } else if (isUniversity) {
      org.monthlyFeesNum = 12000;
      org.monthlyFees = "₹12.0K";
    } else {
      org.monthlyFeesNum = 0;
      org.monthlyFees = "Govt. Subsidized";
    }
  }

  if (!org.studentFacultyRatio) {
    org.studentFacultyRatio = org.board === "IB" ? "12:1" : isResearch ? "6:1" : isUniversity ? "10:1" : "15:1";
  }

  if (!org.admissionStatus) {
    org.admissionStatus = idx % 2 === 0 ? "On Going" : "Open for 2026-27";
  }

  if (org.isFeatured === undefined) {
    org.isFeatured = idx % 3 === 0 || org.rating >= 4.9;
  }

  if (!org.likesCount) {
    org.likesCount = 200 + ((idx * 67) % 2000);
  }

  if (!org.locality) {
    org.locality = org.address.split(',')[0] || org.city;
  }
});

// ─── 50 VERIFIED TEACHERS ACROSS SUBJECTS ────────────────────────────────────
const TEACHER_NAMES = [
  "Dr. Arvind Sharma", "Dr. Shalini Mukhopadhyay", "Prof. Rajesh Mohanty", "Mrs. Neha Kulkarni",
  "Mr. Pradeep Sen", "Dr. Meenakshi Sundaram", "Mrs. Ananya Roy", "Mr. Vivek Verma",
  "Dr. Ramanathan Iyer", "Mrs. Sunita Patnaik", "Mr. Alok Rathore", "Dr. Priyanka Das",
  "Prof. Santosh Jena", "Mrs. Kavita Saxena", "Mr. Devendra Swain", "Dr. Pooja Nair"
];

const TEACHER_SUBJECTS: TeacherItem["subject"][] = [
  "Physics", "Chemistry", "Biology", "Mathematics", "Robotics & AI", "Computer Science", "Lab Technology"
];

export const ALL_TEACHERS: TeacherItem[] = [];

for (let i = 1; i <= 50; i++) {
  const name = `${TEACHER_NAMES[(i - 1) % TEACHER_NAMES.length]} ${i > 16 ? "II" : ""}`;
  const subj = TEACHER_SUBJECTS[(i - 1) % TEACHER_SUBJECTS.length];
  const c = ALL_CITIES[(i * 3) % ALL_CITIES.length];
  const pinNum = parseInt(c.pin) + (i % 10);
  const isSeeking = i % 2 === 1 || i % 3 === 0; // ~34 out of 50 are active
  const remainingHours = isSeeking ? Math.max(4, 72 - ((i * 5) % 68)) : 0;

  ALL_TEACHERS.push({
    id: `teacher-${i}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@cseel.network`,
    phone: `+91 98${34000000 + i * 1111}`,
    subject: subj,
    qualification: i % 3 === 0 ? "Ph.D. in " + subj + ", B.Ed, CSIR-NET" : "M.Sc. " + subj + ", B.Ed (Gold Medalist)",
    experienceYears: 4 + (i % 18),
    currentInstitute: ALL_ORGANIZATIONS[i % ALL_ORGANIZATIONS.length].name,
    city: c.city,
    state: c.state,
    pincode: pinNum.toString(),
    verified: true,
    nepCertified: true,
    rating: Number((4.6 + (i % 4) * 0.1).toFixed(1)),
    reviewsCount: 35 + i * 4,
    avatar: `https://images.unsplash.com/photo-${1534528741775 + (i % 20)}?w=200&auto=format&fit=crop`,
    bio: `Passionate ${subj} educator with ${4 + (i % 18)}+ years of experience creating hands-on lab experiments, guiding CBSE/ICSE board toppers and national science fair finalists.`,
    skills: ["Hands-on Lab Experiments", "NEP-2020 Pedagogy", "Olympiad Coaching", "Curriculum Design", "hands-on science labs"],
    expectedSalary: `₹${45 + (i % 10) * 5},000 - ₹${75 + (i % 10) * 8},000 / month`,
    availableFor: ["Full-Time", "Visiting Faculty", "Lab Workshop Instructor"],
    isActivelySeekingJob: isSeeking,
    jobSeekingExpiresInHours: remainingHours,
    immediateJoining: isSeeking && i % 2 === 1,
    jobSeekingActivatedDate: "Active within last 72 Hours",
  });
}

// ─── 50 STUDENT INNOVATOR PROFILES ───────────────────────────────────────────
const STUDENT_NAMES = [
  "Aarav Sharma", "Ananya Mohapatra", "Rohan Gupta", "Pooja Verma", "Aditya Jena",
  "Sneha Sen", "Karthik Iyer", "Diya Mukherjee", "Manish Swain", "Isha Deshmukh",
  "Siddharth Rao", "Tanvi Patil", "Ayush Choudhury", "Pari Singhania", "Vikram Rathore"
];

const STUDENT_PROJECTS = [
  "SENKU Smart IoT Egg Incubator",
  "Automated Solar Irrigation System",
  "AI Plant Disease Detection Scanner",
  "Bio-Plastic from Banana Peels",
  "Smart Hydroponics Water Quality Monitor",
  "Piezoelectric Footstep Energy Harvester",
  "Low-Cost Water Filtration Membrane",
  "Voice-Controlled STEM Lab Assistant Robot"
];

export const ALL_STUDENTS: StudentItem[] = [];

for (let i = 1; i <= 50; i++) {
  const name = `${STUDENT_NAMES[(i - 1) % STUDENT_NAMES.length]} ${i > 15 ? i : ""}`;
  const c = ALL_CITIES[(i * 5) % ALL_CITIES.length];
  const org = ALL_ORGANIZATIONS[(i * 2) % ALL_ORGANIZATIONS.length];
  const proj = STUDENT_PROJECTS[(i - 1) % STUDENT_PROJECTS.length];
  const pinNum = parseInt(c.pin) + (i % 10);
  const studentSlug = `${slugify(name)}-${slugify(c.city)}`;

  ALL_STUDENTS.push({
    id: `student-${i}`,
    slug: studentSlug,
    name,
    email: `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@cseel.student`,
    classGrade: `Class ${9 + (i % 4)}`,
    schoolCollege: org.name,
    city: c.city,
    state: c.state,
    pincode: pinNum.toString(),
    verified: true,
    avatar: `https://images.unsplash.com/photo-${1539571696357 + (i % 15)}?w=200&auto=format&fit=crop`,
    interests: ["Robotics & Automation", "IoT Hardware", "Virtual Chemistry", "Space Science & Rocketry", "AI & Machine Learning"],
    projectsCount: 2 + (i % 5),
    experimentsCompleted: 12 + (i % 25),
    topProject: proj,
    badges: ["National Science Fair Finalist", "Verified Innovator", "Lab Virtuoso", "NEP Explorer", "Hardware Builder"],
    bio: `Aspiring young innovator & hardware builder from ${c.city}. Working on real-world STEM solutions, practical hardware prototyping, and hands-on science labs.`,
    profileVisibility: i % 7 === 0 ? "followers" : "public",
    showContactInfo: false,
    projects: [
      {
        id: `proj-${i}-1`,
        title: proj,
        category: i % 2 === 0 ? "IoT & Robotics" : i % 3 === 0 ? "Renewable Energy" : "AI & Space Science",
        description: `An innovative working hardware prototype designed for classroom and laboratory demonstration. Utilizes microcontrollers, calibrated sensors, and cloud analytics.`,
        status: i % 3 === 0 ? "National Fair Winner" : i % 4 === 0 ? "Patent Pending" : "Completed",
        featuredImage: `https://images.unsplash.com/photo-${1581092160607 + (i % 10)}?w=600&auto=format&fit=crop`,
        visibility: "public",
        award: i % 2 === 0 ? "Gold Medalist - CBSE National Science Exhibition 2026" : "Top 10 Finalist - Atal Tinkering Innovation Marathon",
        starsCount: 45 + i * 3,
        tags: ["Arduino", "Sensors", "IoT", "C++", "CAD 3D Print"],
        files: [
          {
            id: `f-${i}-1`,
            name: `${proj.replace(/\s+/g, "_")}_Research_Report.pdf`,
            type: "pdf",
            size: "3.4 MB",
            visibility: "public",
            lastUpdated: "2026-07-28",
            url: "#",
          },
          {
            id: `f-${i}-2`,
            name: "Firmware_SourceCode_Arduino.ino",
            type: "code",
            size: "142 KB",
            visibility: "public",
            lastUpdated: "2026-08-02",
            url: "#",
          },
          {
            id: `f-${i}-3`,
            name: "Chassis_3D_CAD_Model.stl",
            type: "cad",
            size: "12.8 MB",
            visibility: "followers",
            lastUpdated: "2026-08-10",
            url: "#",
          },
          {
            id: `f-${i}-4`,
            name: "Circuit_Schematic_KiCAD.sch",
            type: "circuit",
            size: "820 KB",
            visibility: "private",
            lastUpdated: "2026-08-14",
            url: "#",
          },
        ],
      },
      {
        id: `proj-${i}-2`,
        title: `Low-Cost Environmental Sensor Node (v2)`,
        category: "Applied Physics",
        description: `Solar-powered telemetry node logging atmospheric pressure, ambient temperature, particulate matter, and UV index.`,
        status: "In Progress",
        featuredImage: `https://images.unsplash.com/photo-${1518770660439 + (i % 10)}?w=600&auto=format&fit=crop`,
        visibility: i % 2 === 0 ? "followers" : "public",
        starsCount: 28 + i * 2,
        tags: ["Solar Power", "Telemetry", "Atmospheric Sensors"],
        files: [
          {
            id: `f-${i}-5`,
            name: "Lab_Sensor_Calibration_Logs.xlsx",
            type: "dataset",
            size: "1.2 MB",
            visibility: "public",
            lastUpdated: "2026-08-01",
            url: "#",
          },
          {
            id: `f-${i}-6`,
            name: "Patent_Draft_Confidential.pdf",
            type: "pdf",
            size: "4.1 MB",
            visibility: "private",
            lastUpdated: "2026-08-15",
            url: "#",
          },
        ],
      },
    ],
  });
}

// ─── 40+ LIVE STEM FACULTY & LAB OPENINGS (INDEED STYLE ENRICHED) ───────────────
export const ALL_JOBS: EduJobItem[] = [];

const JOB_TEMPLATES = [
  {
    title: "Senior PGT Physics Educator",
    subj: "Physics" as const,
    sal: "₹55,000 - ₹90,000 a month",
    minSal: 55000,
    maxSal: 90000,
    benefits: ["Health insurance", "Provident Fund", "Paid sick time", "Lab allowance", "Housing assistance"],
    shift: "Day shift (8:00 AM – 3:30 PM)",
    responsibilities: [
      "Conduct engaging Class 11-12 Physics theory and laboratory practicals.",
      "Lead optics, electromagnetism, and mechanics experiment demos.",
      "Mentor students for national science exhibitions and Olympiads.",
      "Integrate hands-on science labs into daily classroom teaching."
    ]
  },
  {
    title: "Chemistry Lab Specialist & PGT Faculty",
    subj: "Chemistry" as const,
    sal: "₹50,000 - ₹85,000 a month",
    minSal: 50000,
    maxSal: 85000,
    benefits: ["Health insurance", "Provident Fund", "Paid time off", "Hazard allowance", "Commuter assistance"],
    shift: "Day shift (8:30 AM – 4:00 PM)",
    responsibilities: [
      "Manage chemistry laboratory apparatus, titrations, and chemical inventory safely.",
      "Teach organic, inorganic, and physical chemistry under NEP-2020 guidelines.",
      "Train students in microscale green chemistry practicals."
    ]
  },
  {
    title: "Robotics & STEM Atal Tinkering Lab Mentor",
    subj: "Robotics & AI" as const,
    sal: "₹45,000 - ₹75,000 a month",
    minSal: 45000,
    maxSal: 75000,
    benefits: ["Flexible schedule", "Provident Fund", "3D Printing allowance", "Paid sick time"],
    shift: "Day shift (9:00 AM – 4:30 PM)",
    responsibilities: [
      "Oversee school Atal Tinkering Lab (ATL) 3D printers, microcontrollers, and IoT kits.",
      "Coach student teams for national robotics combat and rover competitions.",
      "Conduct Arduino, Raspberry Pi, and Python coding bootcamps."
    ]
  },
  {
    title: "Biology & Bio-Technology Faculty",
    subj: "Biology" as const,
    sal: "₹48,000 - ₹80,000 a month",
    minSal: 48000,
    maxSal: 80000,
    benefits: ["Health insurance", "Provident Fund", "Life insurance", "Paid time off"],
    shift: "Day shift (8:00 AM – 3:30 PM)",
    responsibilities: [
      "Teach Botany, Zoology, and Genetics with live specimen microscopy.",
      "Conduct DNA extraction and PCR practical workshops for senior students.",
      "Guide NEET pre-medical aspirants with conceptual depth."
    ]
  },
  {
    title: "Advanced Mathematics & Olympiad Coach",
    subj: "Mathematics" as const,
    sal: "₹60,000 - ₹1,10,000 a month",
    minSal: 60000,
    maxSal: 110000,
    benefits: ["Performance bonus", "Health insurance", "Provident Fund", "Flexible schedule"],
    shift: "Day shift (9:00 AM – 4:00 PM)",
    responsibilities: [
      "Train gifted students for RMO, INMO, and international math competitions.",
      "Deliver calculus, coordinate geometry, and discrete mathematics masterclasses.",
      "Develop innovative visual problem-solving worksheets."
    ]
  },
  {
    title: "Computer Science & Python STEM Instructor",
    subj: "Computer Science" as const,
    sal: "₹50,000 - ₹85,000 a month",
    minSal: 50000,
    maxSal: 85000,
    benefits: ["Work from home flexibility", "Health insurance", "Provident Fund", "Internet reimbursement"],
    shift: "Day shift (8:30 AM – 4:00 PM)",
    responsibilities: [
      "Teach Python, SQL, Computer Networks, and AI algorithms to Class 9-12.",
      "Maintain computer laboratory servers and coding platforms.",
      "Organize inter-school hackathons and coding tournaments."
    ]
  },
  {
    title: "Scientific Lab Apparatus Incharge & Tech",
    subj: "Lab Technology" as const,
    sal: "₹32,000 - ₹50,000 a month",
    minSal: 32000,
    maxSal: 50000,
    benefits: ["Provident Fund", "Paid sick time", "Overtime pay", "Uniform allowance"],
    shift: "Day shift (8:00 AM – 4:30 PM)",
    responsibilities: [
      "Calibrate physics and chemistry sensors, glassware, and spectrometers.",
      "Ensure adherence to national school laboratory safety and first-aid protocols.",
      "Assist teachers during practical examination board assessments."
    ]
  },
  {
    title: "Space Science & Astronomy Club Mentor",
    subj: "Physics" as const,
    sal: "₹55,000 - ₹95,000 a month",
    minSal: 55000,
    maxSal: 95000,
    benefits: ["Night stargazing allowance", "Health insurance", "Provident Fund", "Travel assistance"],
    shift: "Rotational shift & Stargazing sessions",
    responsibilities: [
      "Operate motorized telescopes and guide celestial observation nights.",
      "Teach orbital mechanics, satellite communication, and rocketry.",
      "Connect school space club with ISRO student payload programs."
    ]
  }
];

// ─── SLUG & SEO UTILITIES ───────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getJobSlug(job: EduJobItem): string {
  if (job.slug) return job.slug;
  const pin = job.pincode ? `-${job.pincode}` : '';
  return `${slugify(job.title)}-${slugify(job.orgName)}-${slugify(job.city)}${pin}`.replace(/-+$/, '');
}

export function getOrgSlug(org: OrganizationItem): string {
  if (org.slug) return org.slug;
  return `${slugify(org.name)}-${slugify(org.city)}`.replace(/-+$/, '');
}

export function getTeacherSlug(teacher: TeacherItem): string {
  if (teacher.slug) return teacher.slug;
  return `${slugify(teacher.name)}-${slugify(teacher.subject)}-${slugify(teacher.city)}`.replace(/-+$/, '');
}

export function getStudentSlug(student: StudentItem): string {
  if (student.slug) return student.slug;
  return `${slugify(student.name)}-${slugify(student.city)}`.replace(/-+$/, '');
}

for (let i = 1; i <= 40; i++) {
  const org = ALL_ORGANIZATIONS[(i * 2) % ALL_ORGANIZATIONS.length];
  const t = JOB_TEMPLATES[(i - 1) % JOB_TEMPLATES.length];
  const generatedSlug = `${slugify(t.title)}-${slugify(org.name)}-${slugify(org.city)}-${org.pincode}`;

  ALL_JOBS.push({
    id: `job-${i}`,
    slug: generatedSlug,
    orgId: org.id,
    orgName: org.name,
    orgLogo: org.logo,
    orgRating: org.rating,
    title: `${t.title}`,
    subject: t.subj,
    roleType: i % 4 === 0 ? "Lab Instructor" : i % 5 === 0 ? "Visiting Faculty" : "Full-Time",
    jobTypeCategory: i % 3 === 0 ? "Permanent" : "Full-time / Regular",
    jobShift: t.shift,
    city: org.city,
    state: org.state,
    pincode: org.pincode,
    address: org.address,
    salary: t.sal,
    salaryNumMin: t.minSal,
    salaryNumMax: t.maxSal,
    experienceRequired: `${2 + (i % 6)}+ Years Experience`,
    qualifications: "M.Sc / B.Ed / Relevant Certification (NEP-2020 trained preferred)",
    openings: (i % 3) + 1,
    postedDate: i === 1 ? "Just posted" : i < 5 ? `${i} days ago` : `${i % 14 + 1} days ago`,
    isUrgentlyHiring: i % 3 === 0,
    easilyApply: true,
    benefits: t.benefits,
    description: `Urgent requirement for ${t.title} at ${org.name}, ${org.city}. The candidate will conduct hands-on laboratory experiments, mentor students for national competitions, and lead curriculum implementation.`,
    responsibilities: t.responsibilities,
    requirements: [
      "Demonstrated ability in conducting practical science experiments.",
      "Familiarity with modern lab safety, apparatus, and hands-on experiments & live labs.",
      "Excellent communication and student mentorship skills."
    ],
    verified: true
  });
}

// Enrich Organizations and Teachers with slugs
ALL_ORGANIZATIONS.forEach((o) => {
  if (!o.slug) o.slug = `${slugify(o.name)}-${slugify(o.city)}`;
});

ALL_TEACHERS.forEach((t) => {
  if (!t.slug) t.slug = `${slugify(t.name)}-${slugify(t.subject)}-${slugify(t.city)}`;
});

ALL_STUDENTS.forEach((s) => {
  if (!s.slug) s.slug = `${slugify(s.name)}-${slugify(s.city)}`;
});

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────
export function getOrganizationById(idOrSlug: string): OrganizationItem | undefined {
  if (!idOrSlug) return undefined;
  return ALL_ORGANIZATIONS.find(
    (o) => o.id === idOrSlug || o.slug === idOrSlug || o.id === idOrSlug.replace("org-", "") || slugify(o.name) === idOrSlug || `${slugify(o.name)}-${slugify(o.city)}` === idOrSlug
  );
}

export function getJobById(idOrSlug: string): EduJobItem | undefined {
  if (!idOrSlug) return undefined;
  return ALL_JOBS.find((j) => j.id === idOrSlug || j.slug === idOrSlug || getJobSlug(j) === idOrSlug);
}

export function getTeacherById(idOrSlug: string): TeacherItem | undefined {
  if (!idOrSlug) return undefined;
  return ALL_TEACHERS.find(
    (t) => t.id === idOrSlug || t.slug === idOrSlug || slugify(t.name) === idOrSlug || `${slugify(t.name)}-${slugify(t.subject)}-${slugify(t.city)}` === idOrSlug
  );
}

export function getStudentById(idOrSlug: string): StudentItem | undefined {
  if (!idOrSlug) return undefined;
  return ALL_STUDENTS.find(
    (s) => s.id === idOrSlug || s.slug === idOrSlug || slugify(s.name) === idOrSlug || `${slugify(s.name)}-${slugify(s.city)}` === idOrSlug
  );
}

export function getJobsByOrgId(orgId: string): EduJobItem[] {
  const matched = ALL_JOBS.filter((j) => j.orgId === orgId);
  if (matched.length > 0) return matched;

  const org = getOrganizationById(orgId) || ALL_ORGANIZATIONS[0];
  return [
    {
      id: `job-${orgId}-1`,
      orgId: org.id,
      orgName: org.name,
      orgLogo: org.logo,
      orgRating: org.rating,
      title: `Senior STEM Practical Instructor`,
      subject: "Physics",
      roleType: "Full-Time",
      jobTypeCategory: "Permanent",
      jobShift: "Day shift (8:00 AM – 3:30 PM)",
      city: org.city,
      state: org.state,
      pincode: org.pincode,
      address: org.address,
      salary: "₹60,000 - ₹95,000 a month",
      salaryNumMin: 60000,
      salaryNumMax: 95000,
      experienceRequired: "3+ Years Experience",
      qualifications: "M.Sc. Physics, B.Ed (NEP-2020 certified)",
      openings: 2,
      postedDate: "2 days ago",
      isUrgentlyHiring: true,
      easilyApply: true,
      benefits: ["Health insurance", "Provident Fund", "Lab allowance"],
      description: `Leading ${org.name} science laboratory sessions, mentoring student robotics club, and preparing students for national science Olympiads.`,
      responsibilities: [
        "Conduct physics experiments and sensor demonstrations.",
        "Mentor students for national science fairs."
      ],
      requirements: [
        "Hands-on experience with modern optics, mechanics, and electronics apparatus.",
        "Ability to integrate hands-on science labs with physical experiments."
      ],
      verified: true
    }
  ];
}

export function getPostsByOrgId(orgId: string): OrgPostItem[] {
  const org = getOrganizationById(orgId) || ALL_ORGANIZATIONS[0];

  return [
    {
      id: `post-${orgId}-1`,
      orgId: org.id,
      authorName: org.name,
      authorLogo: org.logo,
      content: `🎉 Thrilled to announce that our students have won 1st Prize at the National Science Innovation Conclave! Their project on 'Automated Solar Water Purification with IoT' was lauded by senior scientists. Proud of our young builders! #NationalScienceFair #StudentInnovators #STEMIndia`,
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop",
      tags: ["#NationalScienceFair", "#StudentInnovators", "#STEMIndia"],
      createdAt: "3 hours ago",
      likes: 142,
      isLiked: false,
      shares: 28,
      isFeaturedCarousel: true,
      comments: [
        {
          id: "c1",
          userName: "Dr. Arvind Sharma",
          userRole: "CSEEL Pedagogy Director",
          userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
          comment: "Heartiest congratulations to the students and the mentoring faculty! Exceptional hardware design.",
          createdAt: "2 hours ago"
        },
        {
          id: "c2",
          userName: "Pooja Verma",
          userRole: "Parent & Science Enthusiast",
          userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop",
          comment: "So proud of the school's practical lab training approach!",
          createdAt: "1 hour ago"
        }
      ]
    },
    {
      id: `post-${orgId}-2`,
      orgId: org.id,
      authorName: org.name,
      authorLogo: org.logo,
      content: `🔬 Newly upgraded Atal Tinkering Lab with 5 new 3D Printers, Laser Cutters, and IoT Sensor kits is now open for students from Grade 6 to 12. Hands-on exploration is the key to deep learning under NEP-2020. #AtalTinkeringLab #MakerSpace #NEP2020`,
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop",
      tags: ["#AtalTinkeringLab", "#MakerSpace", "#NEP2020"],
      createdAt: "Yesterday at 4:30 PM",
      likes: 215,
      isLiked: true,
      shares: 45,
      isFeaturedCarousel: true,
      comments: []
    },
    {
      id: `post-${orgId}-3`,
      orgId: org.id,
      authorName: org.name,
      authorLogo: org.logo,
      content: `📢 HIRING ALERT: We are actively looking for Senior PGT Physics and Chemistry Lab Mentors to join our campus. Competitive salary, state-of-the-art research facilities, and continuous faculty development programs. Check our Jobs tab to apply directly! #FacultyHiring #TeacherJobs #EducationCareers`,
      tags: ["#FacultyHiring", "#TeacherJobs", "#EducationCareers"],
      createdAt: "2 days ago",
      likes: 98,
      isLiked: false,
      shares: 62,
      isFeaturedCarousel: true,
      comments: []
    },
    {
      id: `post-${orgId}-4`,
      orgId: org.id,
      authorName: org.name,
      authorLogo: org.logo,
      content: `🔭 Glimpse from our Astronomy Stargazing Night! Over 300 students and parents observed Jupiter's Galilean moons and Saturn's rings through our 8-inch computerized telescope. #AstronomyClub #Stargazing #ScienceIsFun`,
      image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop",
      tags: ["#AstronomyClub", "#Stargazing", "#ScienceIsFun"],
      createdAt: "4 days ago",
      likes: 310,
      isLiked: false,
      shares: 74,
      isFeaturedCarousel: true,
      comments: []
    },
    {
      id: `post-${orgId}-5`,
      orgId: org.id,
      authorName: org.name,
      authorLogo: org.logo,
      content: `🌱 Green Chemistry Initiative: Our chemistry laboratory has successfully transitioned to 100% microscale practicals and non-toxic bio-indicators, eliminating chemical effluent. A proud milestone in sustainable education! #GreenChemistry #EcoFriendlyLab`,
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop",
      tags: ["#GreenChemistry", "#EcoFriendlyLab"],
      createdAt: "1 week ago",
      likes: 185,
      isLiked: false,
      shares: 33,
      isFeaturedCarousel: true,
      comments: []
    }
  ];
}

export interface SchoolLabItem {
  id: string;
  name: string;
  category: "Physics & Optics" | "Chemistry & Materials" | "Robotics & AI" | "Biology & Genetics" | "Astronomy & Space" | "Mathematics & Computing";
  tag: string;
  image: string;
  description: string;
  capacity: string;
  incharge: string;
  inchargeAvatar: string;
  apparatus: string[];
  safetyCertification: string;
  gradeLevel: string;
  experimentsAvailable: number;
}

export function getOrgLabsByOrgId(orgId: string): SchoolLabItem[] {
  return [
    {
      id: "lab-phy-1",
      name: "CSEEL Advanced Physics & Optical Bench Laboratory",
      category: "Physics & Optics",
      tag: "Optics & Classical Mechanics",
      image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop",
      description: "Equipped with computerized laser spectrometers, optical benches, prisms, sodium vapor lamps, digital oscilloscopes, and ballistic pendulums for senior practicals.",
      capacity: "40 Students / Practical Batch",
      incharge: "Dr. Arvind Sharma (PGT Physics, Ph.D.)",
      inchargeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
      apparatus: [
        "Digital Laser Spectrometers",
        "Dual-Trace 50MHz Oscilloscopes",
        "Newton's Rings Optical Bench",
        "Air Track Mechanics Sensor",
        "Millikan Oil Drop Apparatus",
        "Ultrasonic Interferometer"
      ],
      safetyCertification: "CSEEL Level-4 Laser Safety Certified",
      gradeLevel: "Classes 9 - 12 & Competitive Batches",
      experimentsAvailable: 28,
    },
    {
      id: "lab-chem-1",
      name: "CSEEL Analytical Chemistry & Green Synthesis Suite",
      category: "Chemistry & Materials",
      tag: "Green Chemistry & Titrations",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop",
      description: "State-of-the-art laboratory featuring zero-effluent fume hoods, automated digital titrators, UV-Vis spectrophotometers, and analytical microbalances.",
      capacity: "36 Students / Practical Batch",
      incharge: "Dr. Shalini Mukhopadhyay (HOD Chemistry)",
      inchargeAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop",
      apparatus: [
        "Zero-Waste Laminar Air Fume Hoods",
        "UV-Vis Single Beam Spectrophotometer",
        "Digital pH & Conductivity Meters",
        "Analytical Microbalance (0.0001g)",
        "Rotary Vacuum Evaporator",
        "Calorimeter & Heat of Solution Setup"
      ],
      safetyCertification: "ISO 14001 Chemical Safety & Zero-Waste",
      gradeLevel: "Classes 8 - 12 (NEP-2020 Hands-on)",
      experimentsAvailable: 34,
    },
    {
      id: "lab-rob-1",
      name: "CSEEL Atal Tinkering Lab & Robotics Innovation Arena",
      category: "Robotics & AI",
      tag: "Robotics, IoT & Embedded AI",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop",
      description: "NITI Aayog AIM compliant innovation workspace housing dual-extruder 3D printers, CO2 laser cutters, Arduino/ESP32 maker kits, and autonomous robot arenas.",
      capacity: "50 Students / Innovation Cohort",
      incharge: "Mr. Devendra Swain (Chief Robotics Mentor)",
      inchargeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
      apparatus: [
        "Dual-Extruder Industrial 3D Printers",
        "60W Desktop CO2 Laser Cutter",
        "Arduino & Raspberry Pi 5 Kits",
        "Omni-Directional Robotics Chassis",
        "Edge AI Vision Sensor Modules",
        "Soldering & PCB Prototyping Stations"
      ],
      safetyCertification: "NITI Aayog Certified ATL Hub",
      gradeLevel: "Classes 6 - 12 (STEAM Tinkering)",
      experimentsAvailable: 45,
    },
    {
      id: "lab-bio-1",
      name: "CSEEL Molecular Biology & Genetics Exploratorium",
      category: "Biology & Genetics",
      tag: "Biotechnology & Botany",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop",
      description: "Complete biological testing suite equipped with binocular compound microscopes, horizontal gel electrophoresis tanks, PCR thermal cyclers, and tissue culture incubators.",
      capacity: "35 Students / Batch",
      incharge: "Mrs. Ananya Roy (Biotech Specialist)",
      inchargeAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop",
      apparatus: [
        "Binocular LED Compound Microscopes",
        "Agarose Gel Electrophoresis Tank",
        "Mini PCR Thermal Cycler Setup",
        "BOD Plant Tissue Incubator",
        "High-Speed Microcentrifuge (15,000 RPM)",
        "Digital Colorimeter & Hemocytometer"
      ],
      safetyCertification: "Biosafety Level-1 (BSL-1) Certified",
      gradeLevel: "Classes 9 - 12 & Pre-Med Batches",
      experimentsAvailable: 22,
    },
    {
      id: "lab-astro-1",
      name: "CSEEL Astronomy & Planetary Observation Dome",
      category: "Astronomy & Space",
      tag: "Space Science & Celestial Tracking",
      image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop",
      description: "Dedicated rooftop astronomy observatory featuring a motorized 8-inch Schmidt-Cassegrain equatorial telescope, solar filters, CCD astrophotography cameras, and star charts.",
      capacity: "30 Observers / Session",
      incharge: "Prof. Rajesh Mohanty (Space Club Director)",
      inchargeAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
      apparatus: [
        "8-inch Motorized Equatorial Telescope",
        "Hydrogen-Alpha Solar Observation Filter",
        "Deep-Sky CCD Astrophotography Sensor",
        "Planetary Spectroscope Attachment",
        "Interactive Digital Star Chart Terminals",
        "Satellite Tracking Radio Receiver"
      ],
      safetyCertification: "ISRO Space Outreach Certified Hub",
      gradeLevel: "All Classes & Astronomy Club",
      experimentsAvailable: 18,
    }
  ];
}

export interface OrgReviewItem {
  id: string;
  orgId: string;
  userName: string;
  userRole: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  verifiedReviewer: boolean;
}

export function getReviewsByOrgId(orgId: string): OrgReviewItem[] {
  return [
    {
      id: "rev-1",
      orgId,
      userName: "Dr. Ramanathan Iyer",
      userRole: "Senior Physics Professor & Academic Auditor",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
      rating: 5,
      comment: "World-class laboratory infrastructure. The dedication of the faculty towards experiential STEM education and student hardware building is commendable.",
      date: "April 12, 2026",
      verifiedReviewer: true
    },
    {
      id: "rev-2",
      orgId,
      userName: "Mrs. Kavita Saxena",
      userRole: "Parent of Class 11 Student",
      userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop",
      rating: 5,
      comment: "My son's confidence in physics and robotics has grown exponentially after participating in the school's hands-on incubation lab.",
      date: "March 28, 2026",
      verifiedReviewer: true
    },
    {
      id: "rev-3",
      orgId,
      userName: "Aarav Sharma",
      userRole: "Student Innovator (Class 10)",
      userAvatar: "https://images.unsplash.com/photo-1539571696357?w=200&auto=format&fit=crop",
      rating: 5,
      comment: "The lab incharge and teachers supported us with all microcontrollers and sensors to build our state-level science project!",
      date: "March 15, 2026",
      verifiedReviewer: true
    }
  ];
}
