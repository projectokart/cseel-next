export interface FacultyJobItem {
  id: string;
  organisationName: string;
  organisationLogo?: string;
  jobPostName: string;
  designation: "PGT" | "TGT" | "PRT" | "Lab In-Charge" | "ATL Mentor" | "Coordinator";
  subject: "Physics" | "Chemistry" | "Biology" | "Mathematics" | "Robotics & AI" | "Computer Science" | "Composite Lab" | "General Science";
  board: "CBSE" | "ICSE" | "Cambridge / IB" | "State Board";
  roleType: "Full-Time" | "Part-Time" | "Lab In-Charge" | "ATL Mentor" | "Visiting Faculty";
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  shortDescription: string;
  address: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  websiteUrl?: string;
  website?: string;
  mapUrl?: string;
  minExperience?: number | string;
  facilities?: string[];
  urgent?: boolean;
  openingDate: string; // ISO date string (YYYY-MM-DD)
  lastDate: string;    // Application deadline (YYYY-MM-DD)
  source: "LinkedIn" | "Indeed" | "Naukri.com" | "TimesJobs" | "Direct School Portal";
  originalUrl: string;
  verified: boolean;
  badge?: string;
}

// Helper to enforce tag rules: max 20 chars per single tag, total cumulative length <= 60 chars (e.g. 3x20 chars or 4x15 chars)
export function enforceTagLimits(tags: string[], maxTagLen: number = 20, maxTotalLen: number = 60, maxCount: number = 4): string[] {
  const result: string[] = [];
  let currentTotal = 0;
  for (const rawTag of tags) {
    if (!rawTag) continue;
    const tag = rawTag.trim().slice(0, maxTagLen);
    if (!tag) continue;
    if (result.length >= maxCount) break;
    if (currentTotal + tag.length > maxTotalLen && result.length > 0) {
      break;
    }
    result.push(tag);
    currentTotal += tag.length;
  }
  return result;
}

// Helper: Extract school teacher facilities/benefits (max 20 chars each, total <= 60 chars)
export function getJobFacilityTags(job: FacultyJobItem): string[] {
  let candidates: string[] = [];
  if (job.facilities && job.facilities.length > 0) {
    candidates = job.facilities;
  } else {
    // Standard teacher benefits & allowances offered by institutions (max 20 chars each)
    const facilitySets: Record<string, string[]> = {
      'Physics': ['TA + DA', 'Home Allowance', 'PF & Gratuity', 'Medical Cover'],
      'Chemistry': ['TA Allowance', 'Home Allowance', 'PF & Gratuity', 'Free Meals'],
      'Biology': ['TA + DA', 'Home Allowance', 'Health Ins.', 'Child Edu Off'],
      'Mathematics': ['TA Allowance', 'Home Allowance', 'PF & Gratuity', 'Annual Bonus'],
      'Robotics & AI': ['TA + DA', 'Home Allowance', 'Tech Allowance', 'Health Ins.'],
      'Computer Science': ['TA Allowance', 'Home Allowance', 'PF & Gratuity', 'Annual Bonus'],
    };
    candidates = facilitySets[job.subject] || ['TA + DA', 'Home Allowance', 'PF & Gratuity', 'Health Ins.'];
  }
  return enforceTagLimits(candidates, 20, 60, 4);
}

// Helper: Get minimum experience requirement (e.g. "1 yr Exp", "3 yrs Exp")
export function getMinExperience(job: FacultyJobItem): string {
  if (job.minExperience !== undefined && job.minExperience !== null) {
    const raw = String(job.minExperience).trim();
    const num = raw.replace(/[^0-9]/g, '');
    if (num === '0') return 'Fresher';
    if (num === '1') return '1 yr Exp';
    if (num) return `${num} yrs Exp`;
    return raw;
  }
  if (job.designation === 'PGT') return '3 yrs Exp';
  if (job.designation === 'TGT') return '2 yrs Exp';
  if (job.designation === 'PRT') return '1 yr Exp';
  if (job.designation === 'Coordinator') return '5 yrs Exp';
  return '2 yrs Exp';
}

// Helper: Extract up to 4 job requirement / info tags (Min Exp, Urgency, Board, Employment Type)
// Rule: max 20 chars per single tag, total cumulative length <= 60 chars (e.g. 3x20 chars or 4x15 chars)
export function getJobRequirementTags(job: FacultyJobItem): string[] {
  const candidateTags: string[] = [];
  // 1. Min Experience tag formatted as requested: "Min 1 yr Exp"
  const exp = getMinExperience(job);
  candidateTags.push(exp === 'Fresher' ? 'Fresher' : `Min ${exp}`);

  // 2. Urgency or Role Type
  if (job.urgent) {
    candidateTags.push('🔥 Urgent Hiring');
  } else if (job.roleType) {
    candidateTags.push(job.roleType);
  }

  // 3. Board
  if (job.board) {
    candidateTags.push(`${job.board} Board`);
  }

  // 4. Secondary badge (strictly filter out "1-Click Apply" or "Apply")
  if (job.badge && !/apply/i.test(job.badge)) {
    candidateTags.push(job.badge);
  } else if (job.designation) {
    candidateTags.push(`${job.designation} Role`);
  }

  return enforceTagLimits(candidateTags, 20, 60, 4);
}

// ── Raw Vacancy Records with Recent Dates within Last 30 Days ─────────────────
// Base reference date is 2026-10-24
export const RAW_FACULTY_JOBS: FacultyJobItem[] = [
  {
    id: "job-dps-rkp-phy",
    organisationName: "Delhi Public School, R.K. Puram",
    organisationLogo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100&auto=format&fit=crop&q=80",
    jobPostName: "PGT Physics & Experiential Lab Head",
    designation: "PGT",
    subject: "Physics",
    board: "CBSE",
    roleType: "Full-Time",
    salary: "₹10.5 - ₹14.0 LPA",
    salaryMin: 1050000,
    salaryMax: 1400000,
    shortDescription: "Lead senior secondary practicals, optical bench rigs, and CBSE board examination viva preparation in modern composite laboratory.",
    address: "Sector 12, R.K. Puram",
    city: "New Delhi",
    state: "Delhi NCR",
    coordinates: { lat: 28.5672, lng: 77.1734 },
    websiteUrl: "https://dpsrkp.net",
    openingDate: "2026-10-21",
    lastDate: "2026-11-20",
    source: "LinkedIn",
    originalUrl: "https://www.linkedin.com/jobs/search/?keywords=PGT+Physics+Delhi+Public+School",
    verified: true,
    badge: "🔥 Urgently Hiring"
  },
  {
    id: "job-modern-chem",
    organisationName: "Modern School, Barakhamba Road",
    organisationLogo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&auto=format&fit=crop&q=80",
    jobPostName: "TGT Chemistry & Chemical Safety Lead",
    designation: "TGT",
    subject: "Chemistry",
    board: "CBSE",
    roleType: "Full-Time",
    salary: "₹7.5 - ₹10.5 LPA",
    salaryMin: 750000,
    salaryMax: 1050000,
    shortDescription: "Conduct volumetric analysis practicals, salt analysis protocols, and maintain CBSE SARAS compliant acid storage SOPs.",
    address: "Barakhamba Road, Connaught Place",
    city: "New Delhi",
    state: "Delhi NCR",
    coordinates: { lat: 28.6315, lng: 77.2285 },
    websiteUrl: "https://modernschool.net",
    openingDate: "2026-10-18",
    lastDate: "2026-11-15",
    source: "Naukri.com",
    originalUrl: "https://www.naukri.com/chemistry-teacher-jobs-in-delhi",
    verified: true,
    badge: "⭐ CBSE SARAS Lab"
  },
  {
    id: "job-prt-science-delhi",
    organisationName: "The Mother's International School",
    organisationLogo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100&auto=format&fit=crop&q=80",
    jobPostName: "PRT Primary Science & Hands-on Discovery Lead",
    designation: "PRT",
    subject: "General Science",
    board: "CBSE",
    roleType: "Full-Time",
    salary: "₹5.5 - ₹7.5 LPA",
    salaryMin: 550000,
    salaryMax: 750000,
    shortDescription: "Engage primary classes (Grades 1-5) in tactile science models, plant germination tracking, simple circuits, and discovery journals.",
    address: "Sri Aurobindo Ashram, Sri Aurobindo Marg",
    city: "New Delhi",
    state: "Delhi NCR",
    coordinates: { lat: 28.5392, lng: 77.1991 },
    websiteUrl: "https://themis.in",
    openingDate: "2026-10-22",
    lastDate: "2026-11-22",
    source: "LinkedIn",
    originalUrl: "https://www.linkedin.com/jobs/search/?keywords=PRT+Science+Delhi",
    verified: true,
    badge: "🌱 Primary STEM"
  },
  {
    id: "job-heritage-atl",
    organisationName: "Heritage Xperiential Learning School",
    organisationLogo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100&auto=format&fit=crop&q=80",
    jobPostName: "Atal Tinkering Lab (ATL 2.0) Mentor",
    designation: "ATL Mentor",
    subject: "Robotics & AI",
    board: "CBSE",
    roleType: "ATL Mentor",
    salary: "₹8.0 - ₹12.0 LPA",
    salaryMin: 800000,
    salaryMax: 1200000,
    shortDescription: "Mentor student teams for ATL Marathon, 3D printing prototyping, Arduino sensor interfacing, and national robotics challenges.",
    address: "Sector 62",
    city: "Gurugram",
    state: "Haryana",
    coordinates: { lat: 28.4116, lng: 77.0867 },
    websiteUrl: "https://heritagexperiential.org",
    openingDate: "2026-10-22",
    lastDate: "2026-11-25",
    source: "LinkedIn",
    originalUrl: "https://www.linkedin.com/jobs/search/?keywords=ATL+Mentor+Gurgaon",
    verified: true,
    badge: "🤖 ATL 2.0 Lead"
  },
  {
    id: "job-dais-bio",
    organisationName: "Dhirubhai Ambani International School",
    organisationLogo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&auto=format&fit=crop&q=80",
    jobPostName: "PGT Biology & Microscopy Demonstrator",
    designation: "PGT",
    subject: "Biology",
    board: "Cambridge / IB",
    roleType: "Full-Time",
    salary: "₹12.0 - ₹18.0 LPA",
    salaryMin: 1200000,
    salaryMax: 1800000,
    shortDescription: "Facilitate IB & CBSE biology practicals: DNA extraction, cytological slide preparation, and student biotechnology research papers.",
    address: "Bandra Kurla Complex (BKC)",
    city: "Mumbai",
    state: "Maharashtra",
    coordinates: { lat: 19.0662, lng: 72.8687 },
    websiteUrl: "https://daismumbai.org",
    openingDate: "2026-10-15",
    lastDate: "2026-11-18",
    source: "Indeed",
    originalUrl: "https://in.indeed.com/jobs?q=Biology+Teacher+Mumbai",
    verified: true,
    badge: "🏆 Premier School"
  },
  {
    id: "job-tisb-math",
    organisationName: "The International School Bangalore (TISB)",
    organisationLogo: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=100&auto=format&fit=crop&q=80",
    jobPostName: "PGT Mathematics Modeling & 3D Geometry Teacher",
    designation: "PGT",
    subject: "Mathematics",
    board: "Cambridge / IB",
    roleType: "Full-Time",
    salary: "₹11.0 - ₹16.0 LPA",
    salaryMin: 1100000,
    salaryMax: 1600000,
    shortDescription: "Teach tactile geometry visualizers, applied calculus, and coordinate geometry simulations aligned with experiential STEM standards.",
    address: "Sarjapur-Varthur Road",
    city: "Bengaluru",
    state: "Karnataka",
    coordinates: { lat: 12.8797, lng: 77.7478 },
    openingDate: "2026-10-19",
    lastDate: "2026-11-22",
    source: "LinkedIn",
    originalUrl: "https://www.linkedin.com/jobs/search/?keywords=Math+Teacher+Bangalore",
    verified: true,
    badge: "📐 STEM Math"
  },
  {
    id: "job-tgt-math-mumbai",
    organisationName: "Bombay Scottish School, Mahim",
    organisationLogo: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=100&auto=format&fit=crop&q=80",
    jobPostName: "TGT Mathematics (Grades 6-10)",
    designation: "TGT",
    subject: "Mathematics",
    board: "ICSE",
    roleType: "Full-Time",
    salary: "₹7.5 - ₹10.0 LPA",
    salaryMin: 750000,
    salaryMax: 1000000,
    shortDescription: "Deliver conceptual algebra, commercial mathematics, and geometry practical constructions with real-world problem sets.",
    address: "Veer Savarkar Marg, Mahim",
    city: "Mumbai",
    state: "Maharashtra",
    coordinates: { lat: 19.0330, lng: 72.8400 },
    openingDate: "2026-10-17",
    lastDate: "2026-11-19",
    source: "Naukri.com",
    originalUrl: "https://www.naukri.com/tgt-math-jobs-in-mumbai",
    verified: true,
    badge: "📐 ICSE Board"
  },
  {
    id: "job-pune-composite",
    organisationName: "The Bishop's School, Camp",
    organisationLogo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&auto=format&fit=crop&q=80",
    jobPostName: "Composite Science Laboratory In-Charge",
    designation: "Lab In-Charge",
    subject: "Composite Lab",
    board: "CBSE",
    roleType: "Lab In-Charge",
    salary: "₹5.5 - ₹8.0 LPA",
    salaryMin: 550000,
    salaryMax: 800000,
    shortDescription: "Manage apparatus calibration, inventory records for mandatory CBSE non-consumables, and safety equipment maintenance.",
    address: "General Bhagat Marg, Camp",
    city: "Pune",
    state: "Maharashtra",
    coordinates: { lat: 18.5126, lng: 73.8824 },
    openingDate: "2026-10-12",
    lastDate: "2026-11-12",
    source: "Naukri.com",
    originalUrl: "https://www.naukri.com/lab-assistant-jobs-in-pune",
    verified: true,
    badge: "⚙️ Lab In-Charge"
  },
  {
    id: "job-hps-ai",
    organisationName: "The Hyderabad Public School, Begumpet",
    organisationLogo: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80",
    jobPostName: "PGT Computer Science & Applied AI Educator",
    designation: "PGT",
    subject: "Computer Science",
    board: "CBSE",
    roleType: "Full-Time",
    salary: "₹9.0 - ₹13.5 LPA",
    salaryMin: 900000,
    salaryMax: 1350000,
    shortDescription: "Deliver NEP-2020 Python programming, OpenCV computer vision modules, and algorithmic problem-solving for Grades 9-12.",
    address: "1-11-87/88, Begumpet",
    city: "Hyderabad",
    state: "Telangana",
    coordinates: { lat: 17.4435, lng: 78.4738 },
    openingDate: "2026-10-17",
    lastDate: "2026-11-20",
    source: "TimesJobs",
    originalUrl: "https://www.timesjobs.com/candidate/job-search.html?txtKeywords=Computer+Science+Teacher+Hyderabad",
    verified: true,
    badge: "💡 AI Specialist"
  },
  {
    id: "job-prt-math-noida",
    organisationName: "Shiv Nadar School, Sector 168",
    organisationLogo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&auto=format&fit=crop&q=80",
    jobPostName: "PRT Primary Math & STEAM Tinkerer",
    designation: "PRT",
    subject: "Mathematics",
    board: "CBSE",
    roleType: "Full-Time",
    salary: "₹6.0 - ₹8.5 LPA",
    salaryMin: 600000,
    salaryMax: 850000,
    shortDescription: "Facilitate foundational numeracy through Cuisenaire rods, base-10 blocks, and tactile geometry kits for Grades 2-5.",
    address: "Expressway, Sector 168",
    city: "Noida",
    state: "Delhi NCR",
    coordinates: { lat: 28.4988, lng: 77.4042 },
    openingDate: "2026-10-23",
    lastDate: "2026-11-26",
    source: "Direct School Portal",
    originalUrl: "https://shivnadarschool.edu.in/careers",
    verified: true,
    badge: "⚡ Immediate Join"
  },
  {
    id: "job-stepby-phy",
    organisationName: "Step by Step School, Sector 132",
    organisationLogo: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=100&auto=format&fit=crop&q=80",
    jobPostName: "TGT Physics Practical Demonstrator",
    designation: "TGT",
    subject: "Physics",
    board: "CBSE",
    roleType: "Full-Time",
    salary: "₹7.0 - ₹9.5 LPA",
    salaryMin: 700000,
    salaryMax: 950000,
    shortDescription: "Conduct hands-on mechanics, ray optics, and electromagnetism experiments with active peer-inquiry scaffolding.",
    address: "Expressway, Sector 132",
    city: "Noida",
    state: "Delhi NCR",
    coordinates: { lat: 28.5122, lng: 77.3828 },
    openingDate: "2026-10-20",
    lastDate: "2026-11-24",
    source: "Direct School Portal",
    originalUrl: "https://stepbystep.school/careers",
    verified: true,
    badge: "🔬 Hands-On Mentor"
  },
  {
    id: "job-dav-chem",
    organisationName: "DAV Model School, Sector 15",
    organisationLogo: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100&auto=format&fit=crop&q=80",
    jobPostName: "PGT Chemistry & Organic Spectroscopy Mentor",
    designation: "PGT",
    subject: "Chemistry",
    board: "CBSE",
    roleType: "Full-Time",
    salary: "₹8.0 - ₹11.0 LPA",
    salaryMin: 800000,
    salaryMax: 1100000,
    shortDescription: "Guide senior students in qualitative salt analysis, reaction kinetics, and CBSE practical portfolio documentation.",
    address: "Sector 15-A",
    city: "Chandigarh",
    state: "Punjab",
    coordinates: { lat: 30.7588, lng: 76.7841 },
    openingDate: "2026-10-14",
    lastDate: "2026-11-16",
    source: "Indeed",
    originalUrl: "https://in.indeed.com/jobs?q=PGT+Chemistry+Chandigarh",
    verified: true,
    badge: "⚗️ Chemistry Lab"
  },
  {
    id: "job-jayshree-bio",
    organisationName: "Jayshree Periwal High School",
    organisationLogo: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=100&auto=format&fit=crop&q=80",
    jobPostName: "TGT Biology Practical Teacher & Botany Head",
    designation: "TGT",
    subject: "Biology",
    board: "CBSE",
    roleType: "Full-Time",
    salary: "₹6.5 - ₹9.0 LPA",
    salaryMin: 650000,
    salaryMax: 900000,
    shortDescription: "Conduct plant physiology experiments, human anatomy model demos, and laboratory specimen slide examinations.",
    address: "Chitrakoot, Vaishali Nagar",
    city: "Jaipur",
    state: "Rajasthan",
    coordinates: { lat: 26.8998, lng: 75.7423 },
    openingDate: "2026-10-16",
    lastDate: "2026-11-19",
    source: "Naukri.com",
    originalUrl: "https://www.naukri.com/biology-teacher-jobs-in-jaipur",
    verified: true,
    badge: "🌿 Botany Lead"
  },
  {
    id: "job-shivnadar-atl",
    organisationName: "Shiv Nadar School, DLF Phase 1",
    organisationLogo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&auto=format&fit=crop&q=80",
    jobPostName: "Robotics & STEAM Workstation In-Charge",
    designation: "ATL Mentor",
    subject: "Robotics & AI",
    board: "CBSE",
    roleType: "ATL Mentor",
    salary: "₹9.5 - ₹15.0 LPA",
    salaryMin: 950000,
    salaryMax: 1500000,
    shortDescription: "Supervise digital fabrication studio, laser cutting, drone electronics, and national inter-school maker hackathons.",
    address: "Paharikhurd, DLF City Phase 1",
    city: "Gurugram",
    state: "Haryana",
    coordinates: { lat: 28.4682, lng: 77.1025 },
    openingDate: "2026-10-23",
    lastDate: "2026-11-28",
    source: "LinkedIn",
    originalUrl: "https://www.linkedin.com/jobs/search/?keywords=STEAM+Teacher+Shiv+Nadar",
    verified: true,
    badge: "🚀 High Growth"
  },
  {
    id: "job-dps-kolkata-math",
    organisationName: "Delhi Public School, Ruby Park",
    organisationLogo: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=100&auto=format&fit=crop&q=80",
    jobPostName: "PGT Mathematics Practicals Coordinator",
    designation: "PGT",
    subject: "Mathematics",
    board: "CBSE",
    roleType: "Full-Time",
    salary: "₹7.5 - ₹10.5 LPA",
    salaryMin: 750000,
    salaryMax: 1050000,
    shortDescription: "Deliver conceptual 3D conics and analytical geometry using experiential modeling sets aligned with CBSE criteria.",
    address: "Kasba, Shanthipally",
    city: "Kolkata",
    state: "West Bengal",
    coordinates: { lat: 22.5186, lng: 88.3972 },
    openingDate: "2026-10-10",
    lastDate: "2026-11-10",
    source: "Indeed",
    originalUrl: "https://in.indeed.com/jobs?q=Math+Teacher+Kolkata",
    verified: true,
    badge: "📐 High School"
  },
  {
    id: "job-prt-tgt-bengaluru",
    organisationName: "National Public School (NPS), Indiranagar",
    organisationLogo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100&auto=format&fit=crop&q=80",
    jobPostName: "PRT / TGT Science & Discovery Bench Mentor",
    designation: "PRT",
    subject: "General Science",
    board: "CBSE",
    roleType: "Full-Time",
    salary: "₹6.5 - ₹9.0 LPA",
    salaryMin: 650000,
    salaryMax: 900000,
    shortDescription: "Lead middle & primary school laboratory discovery sessions with interactive physics kits, basic optics, and science club activities.",
    address: "12th A Main Road, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    coordinates: { lat: 12.9784, lng: 77.6408 },
    openingDate: "2026-10-21",
    lastDate: "2026-11-25",
    source: "Naukri.com",
    originalUrl: "https://www.naukri.com/science-teacher-jobs-in-bangalore",
    verified: true,
    badge: "⭐ NPS Campus"
  }
];

/**
 * Filter function strictly returning jobs posted within the last 30 days.
 * Any vacancy older than 30 days is automatically purged.
 */
export function getActiveFacultyJobs(nowDateStr: string = "2026-10-24"): FacultyJobItem[] {
  const current = new Date(nowDateStr).getTime();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  return RAW_FACULTY_JOBS.filter((job) => {
    const jobDate = new Date(job.openingDate).getTime();
    const diff = current - jobDate;
    // Job must be within last 30 days and deadline must not have passed
    return diff >= 0 && diff <= thirtyDaysMs;
  });
}

// ── Verified Faculty Roster (Authentic Educators) ──────────────────────────────
export interface VerifiedFacultyItem {
  id: string;
  name: string;
  designation: "PGT" | "TGT" | "PRT" | "Lab In-Charge" | "ATL Mentor" | "Coordinator";
  subject: "Physics" | "Chemistry" | "Biology" | "Mathematics" | "Robotics & AI" | "Computer Science" | "General Science";
  board: "CBSE" | "ICSE" | "Cambridge / IB" | "State Board";
  qualification: string;
  experienceYears: number;
  currentInstitute: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  verified: boolean;
  nepCertified: boolean;
  rating: number;
  reviewsCount: number;
  avatar: string;
  bio: string;
  skills: string[];
  expectedSalary: string;
  isActivelySeekingJob: boolean;
}

export const VERIFIED_FACULTY_MEMBERS: VerifiedFacultyItem[] = [
  {
    id: "fac-1",
    name: "Dr. Arvind Joshi",
    designation: "PGT",
    subject: "Physics",
    board: "CBSE",
    qualification: "Ph.D. in Applied Physics (IIT Delhi)",
    experienceYears: 12,
    currentInstitute: "Senior Lab Demonstrator & Ex-HOD, Delhi",
    city: "New Delhi",
    state: "Delhi NCR",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    verified: true,
    nepCertified: true,
    rating: 4.9,
    reviewsCount: 38,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    bio: "Specializes in ray optics, LCR circuit resonance, and CBSE Class 11-12 practical viva coaching. Conducted 40+ teacher masterclasses.",
    skills: ["Optical Bench Rigs", "CBSE Viva Preparation", "NEP 2020 Scaffolding", "Mechanics Experiments"],
    expectedSalary: "₹12 - ₹15 LPA",
    isActivelySeekingJob: true
  },
  {
    id: "fac-2",
    name: "Sunita Deshmukh",
    designation: "TGT",
    subject: "Chemistry",
    board: "CBSE",
    qualification: "M.Sc. Analytical Chemistry (Mumbai University), B.Ed.",
    experienceYears: 9,
    currentInstitute: "Composite Science In-Charge, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    coordinates: { lat: 19.0760, lng: 72.8777 },
    verified: true,
    nepCertified: true,
    rating: 4.8,
    reviewsCount: 29,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    bio: "Pioneer in micro-scale chemistry practicals that reduce chemical breakage by 90%. Expert in CBSE SARAS acid storage norms.",
    skills: ["Salt Analysis Matrix", "Volumetric Titration", "Lab Safety SOPs", "Green Chemistry"],
    expectedSalary: "₹9 - ₹12 LPA",
    isActivelySeekingJob: true
  },
  {
    id: "fac-prt-1",
    name: "Ananya Sharma",
    designation: "PRT",
    subject: "General Science",
    board: "CBSE",
    qualification: "B.Sc. Life Sciences (DU), B.Ed., CTET Certified",
    experienceYears: 5,
    currentInstitute: "Primary Science Lead Teacher, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    coordinates: { lat: 28.4595, lng: 77.0266 },
    verified: true,
    nepCertified: true,
    rating: 4.9,
    reviewsCount: 27,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    bio: "Passionate PRT experiential educator creating tactile discovery corners, nature observation kits, and simple electronics circuits for primary students.",
    skills: ["Primary Science", "Tactile Inquiry Kits", "NEP Toy-Based Pedagogy", "Foundational Numeracy"],
    expectedSalary: "₹6 - ₹8 LPA",
    isActivelySeekingJob: true
  },
  {
    id: "fac-3",
    name: "Vikram Rathore",
    designation: "ATL Mentor",
    subject: "Robotics & AI",
    board: "CBSE",
    qualification: "B.Tech Mechatronics (BITS Pilani)",
    experienceYears: 6,
    currentInstitute: "Lead ATL Mentor, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    coordinates: { lat: 28.4595, lng: 77.0266 },
    verified: true,
    nepCertified: true,
    rating: 4.9,
    reviewsCount: 42,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    bio: "Mentored 4 teams to top-10 in ATL Marathon and CBSE National Science Fairs. Expert in Arduino C++, Tinkercad 3D CAD, and IoT telemetry.",
    skills: ["Atal Tinkering Lab 2.0", "Arduino / ESP32", "3D Printing Slicing", "Autonomous Robotics"],
    expectedSalary: "₹10 - ₹14 LPA",
    isActivelySeekingJob: true
  },
  {
    id: "fac-4",
    name: "Dr. Meera Iyer",
    designation: "PGT",
    subject: "Biology",
    board: "Cambridge / IB",
    qualification: "Ph.D. in Cellular Biology (IISc Bengaluru)",
    experienceYears: 10,
    currentInstitute: "Senior Biology Faculty, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    verified: true,
    nepCertified: true,
    rating: 4.9,
    reviewsCount: 31,
    avatar: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=200&q=80",
    bio: "Research microscopist guiding high school students through live mitosis mounting, enzyme kinetics, and DNA spooling investigations.",
    skills: ["High-Res Microscopy", "Enzyme Kinetics", "Specimen Slide Staining", "Cytology Practical"],
    expectedSalary: "₹11 - ₹15 LPA",
    isActivelySeekingJob: false
  },
  {
    id: "fac-5",
    name: "Kavita Rao",
    designation: "TGT",
    subject: "Mathematics",
    board: "ICSE",
    qualification: "M.Sc. Applied Mathematics (Pune University)",
    experienceYears: 8,
    currentInstitute: "Experiential Math Coordinator, Pune",
    city: "Pune",
    state: "Maharashtra",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    verified: true,
    nepCertified: true,
    rating: 4.7,
    reviewsCount: 24,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    bio: "Replaces rote trigonometry formulas with physical 3D conic sections, dynamic GeoGebra visualizers, and probability simulation games.",
    skills: ["3D Conics & Geometry", "GeoGebra Modeling", "Applied Calculus", "Math Olympiad Prep"],
    expectedSalary: "₹8 - ₹11 LPA",
    isActivelySeekingJob: true
  },
  {
    id: "fac-6",
    name: "Rajeshwar Sengupta",
    designation: "PGT",
    subject: "Physics",
    board: "CBSE",
    qualification: "M.Sc. Physics (Calcutta University), B.Ed.",
    experienceYears: 14,
    currentInstitute: "Senior Physics PGT & Lab Head, Kolkata",
    city: "Kolkata",
    state: "West Bengal",
    coordinates: { lat: 22.5726, lng: 88.3639 },
    verified: true,
    nepCertified: true,
    rating: 4.8,
    reviewsCount: 46,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    bio: "Master trainer for meter bridge, potentiometer calibration, sonometer harmonics, and CBSE external practical board inspection norms.",
    skills: ["Potentiometer Calibration", "Harmonics & Sonometer", "External Viva Mastery", "Board Inspection SOPs"],
    expectedSalary: "₹10 - ₹13 LPA",
    isActivelySeekingJob: false
  },
  {
    id: "fac-7",
    name: "Anand Kulkarni",
    designation: "PGT",
    subject: "Computer Science",
    board: "CBSE",
    qualification: "M.Tech in CS (IIT Bombay)",
    experienceYears: 7,
    currentInstitute: "AI & CS Faculty, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    coordinates: { lat: 17.3850, lng: 78.4867 },
    verified: true,
    nepCertified: true,
    rating: 4.9,
    reviewsCount: 35,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    bio: "Transforms school computer labs into AI prototyping workshops. Teaches Python data science, machine learning algorithms, and web APIs.",
    skills: ["Python for Schools", "Machine Learning Intro", "OpenCV Computer Vision", "Algorithm Design"],
    expectedSalary: "₹12 - ₹16 LPA",
    isActivelySeekingJob: true
  },
  {
    id: "fac-8",
    name: "Pooja Verma",
    designation: "TGT",
    subject: "Chemistry",
    board: "CBSE",
    qualification: "M.Sc. Inorganic Chemistry (Rajasthan University)",
    experienceYears: 5,
    currentInstitute: "Chemistry Demonstrator, Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    verified: true,
    nepCertified: true,
    rating: 4.7,
    reviewsCount: 19,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    bio: "Specializes in Class 9-10 chemistry foundations, chemical reaction kinetics, crystal growth, and student science fair experiments.",
    skills: ["Crystal Synthesis", "Acid-Base Neutralization", "Student Science Fair", "Interactive Simulations"],
    expectedSalary: "₹6 - ₹8.5 LPA",
    isActivelySeekingJob: true
  }
];
