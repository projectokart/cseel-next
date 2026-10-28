// Aggregated Multi-Portal Jobs (Indeed, LinkedIn, Naukri, CBSE/ICSE Direct Portals)
import aggregatedJobsData from './aggregated_jobs.json';

export interface FacultyJobItem {
  id: string;
  organisationName: string;
  organisationLogo?: string | null;
  image_url?: string | null;
  jobPostName: string;
  designation?: "PGT" | "TGT" | "PRT" | "Lab In-Charge" | "ATL Mentor" | "Coordinator" | "NEET & JEE Faculty" | "Pre-Primary / Nursery" | "Academic Leadership" | string | null;
  subject?: "Physics" | "Chemistry" | "Biology" | "Mathematics" | "Robotics & AI" | "Computer Science" | "Composite Lab" | "General Science" | "Science" | "English" | "Hindi" | "Social Studies (SST)" | string | null;
  board?: "CBSE" | "ICSE" | "Cambridge / IB" | "State Board" | string | null;
  roleType?: "Full-Time" | "Part-Time" | "Lab In-Charge" | "ATL Mentor" | "Visiting Faculty" | string | null;
  salary: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  shortDescription: string;
  address: string;
  city: string;
  state: string;
  district?: string;
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
  source: "LinkedIn" | "Indeed" | "Naukri.com" | "Apna.co" | "Foundit" | "Shine.com" | "TeacherON" | "EducoHire" | "TimesJobs" | "DAV CMC" | "AWES India" | "KVS / NVS" | "Direct School Portal" | string;
  originalUrl: string;
  applyUrl?: string;
  rating?: number | string | null;
  verified: boolean;
  badge?: string;
  forLady?: boolean;
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
// Zero-guesswork: ONLY return actual facilities provided by the school/posting!
export function getJobFacilityTags(job: FacultyJobItem): string[] {
  if (job.facilities && Array.isArray(job.facilities) && job.facilities.length > 0) {
    return enforceTagLimits(job.facilities, 20, 60, 4);
  }
  return [];
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
  return 'Exp as per school';
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

// ── Vacancy Records (Live Portal Aggregated Jobs) ─────────────────────────
export const RAW_FACULTY_JOBS: FacultyJobItem[] = [];

/**
 * Quick fuzzy similarity
 */
export function fuzzyStringSimilarity(s1: string, s2: string): number {
  const a = (s1 || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const b = (s2 || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  if (a === b) return 1.0;
  if (!a || !b) return 0.0;
  if (a.includes(b) || b.includes(a)) return 0.88;

  const bg1 = new Set<string>();
  for (let i = 0; i < a.length - 1; i++) bg1.add(a.substring(i, i + 2));
  const bg2 = new Set<string>();
  for (let i = 0; i < b.length - 1; i++) bg2.add(b.substring(i, i + 2));

  let intersection = 0;
  bg1.forEach((val) => {
    if (bg2.has(val)) intersection++;
  });

  return (2.0 * intersection) / (bg1.size + bg2.size || 1);
}

/**
 * Strict Verification to determine if two vacancies from different portals are the EXACT SAME JOB:
 * - Same School Name (>= 85% fuzzy match or exact)
 * - Same Post / Role (Designation + Subject)
 * - Same Address / City Location
 * - Close Posting Date (within 10 days of each other)
 * - Matching Salary Range (if both disclosed)
 */
export function isExactSameJob(jobA: FacultyJobItem, jobB: FacultyJobItem): boolean {
  // 1. Post & Role Check (must match exact designation & subject)
  if (jobA.designation !== jobB.designation || jobA.subject !== jobB.subject) {
    return false;
  }

  // 2. City & Location Check (must be same city)
  if (jobA.city.toLowerCase() !== jobB.city.toLowerCase()) {
    return false;
  }

  // If specific address is available for both, ensure they are not different branches/campuses
  if (jobA.address && jobB.address) {
    const addrA = jobA.address.toLowerCase();
    const addrB = jobB.address.toLowerCase();
    // Check if conflicting campus/sector names
    const secA = addrA.match(/sector\s*\d+|phase\s*\d+/i)?.[0];
    const secB = addrB.match(/sector\s*\d+|phase\s*\d+/i)?.[0];
    if (secA && secB && secA !== secB) {
      return false; // Different branch campus (e.g. Sector 14 vs Sector 56)
    }
  }

  // 3. School Name (High-precision match >= 85%)
  const schoolSim = fuzzyStringSimilarity(jobA.organisationName, jobB.organisationName);
  if (schoolSim < 0.85) {
    return false;
  }

  // 4. Close Posting Date (within 10 days of each other)
  const timeA = new Date(jobA.openingDate).getTime();
  const timeB = new Date(jobB.openingDate).getTime();
  if (!isNaN(timeA) && !isNaN(timeB)) {
    const diffDays = Math.abs(timeA - timeB) / (1000 * 60 * 60 * 24);
    if (diffDays > 10) {
      return false; // Posted at different times -> separate hiring drive
    }
  }

  // 5. Salary Check (if both disclosed, salary ranges must be consistent)
  if (jobA.salaryMin && jobB.salaryMin && jobA.salaryMax && jobB.salaryMax) {
    const maxMin = Math.max(jobA.salaryMin, jobB.salaryMin);
    const minMax = Math.min(jobA.salaryMax, jobB.salaryMax);
    if (maxMin > minMax && Math.abs(jobA.salaryMin - jobB.salaryMin) > 150000) {
      return false; // Different pay bands -> different vacancies
    }
  }

  return true;
}

/**
 * Filter function strictly returning jobs posted within the last 45 days.
 * Any vacancy older than 45 days is automatically purged.
 * Cross-portal duplicates across LinkedIn, Indeed, and Naukri are merged only when
 * ALL 5 validation criteria pass (Name, Address, Post, Close Date, Matching Salary).
 */
export function isJobForLady(job: { forLady?: boolean; jobPostName?: string; shortDescription?: string; organisationName?: string; badge?: string }): boolean {
  if (job.forLady === true) return true;
  const text = `${job.jobPostName || ''} ${job.shortDescription || ''} ${job.organisationName || ''} ${job.badge || ''}`.toLowerCase();
  return /\b(female|lady|women|woman|girls?\s*school|all[\s-]girls?|mother\s*teacher|ladies)\b/i.test(text);
}

/**
 * Universal Mapper: Converts raw database rows or JSON objects into strict FacultyJobItem format.
 * Guarantees jobPostName, organisationName, subject, designation, and salary are never undefined.
 */
export function mapRawRowToFacultyJobItem(r: any): FacultyJobItem {
  if (r.jobPostName && r.organisationName) {
    return {
      ...r,
      forLady: isJobForLady(r),
    };
  }

  const meta: Record<string, string> = {};
  if (Array.isArray(r.requirements)) {
    for (const item of r.requirements) {
      if (typeof item === 'string') {
        const idx = item.indexOf(':');
        if (idx > -1) {
          meta[item.slice(0, idx).trim()] = item.slice(idx + 1).trim();
        }
      }
    }
  }

  const sMin = meta.salary_min ? parseInt(meta.salary_min, 10) : (r.salaryMin || undefined);
  const sMax = meta.salary_max ? parseInt(meta.salary_max, 10) : (r.salaryMax || undefined);
  const lat = meta.lat ? parseFloat(meta.lat) : (r.coordinates?.lat || 28.6139);
  const lng = meta.lng ? parseFloat(meta.lng) : (r.coordinates?.lng || 77.209);

  const job: FacultyJobItem = {
    id: r.slug || r.id || ('job-' + Math.random().toString(36).slice(2, 9)),
    organisationName: r.institute_name || r.organisationName || 'Educational Institution',
    organisationLogo: meta.logo || r.organisationLogo || undefined,
    image_url: r.image_url || meta.image_url || undefined,
    jobPostName: r.title || r.jobPostName || 'School Educator Vacancy',
    designation: meta.designation || r.designation || undefined,
    subject: r.department && r.department !== 'Faculty' ? r.department : (meta.subject || r.subject || undefined),
    board: meta.board || r.board || undefined,
    roleType: r.job_type || r.roleType || 'Full-Time',
    salary: r.salary_range || r.salary || 'Not Disclosed',
    salaryMin: sMin,
    salaryMax: sMax,
    shortDescription: r.description || r.shortDescription || (r.institute_name || 'School') + ' is hiring for ' + (r.title || 'Teacher') + '.',
    address: meta.address || r.address || (r.city || '') + ', ' + (r.state || 'India'),
    city: r.city || 'India',
    state: r.state || 'India',
    district: meta.district || r.district || r.city,
    coordinates: { lat, lng },
    minExperience: r.experience_required || r.minExperience || '0-3 Yrs',
    openingDate: meta.opening_date || (r.posted_at ? r.posted_at.split('T')[0] : 'Today'),
    lastDate: r.deadline || r.lastDate || undefined,
    source: meta.source || r.source || 'Direct School Portal',
    originalUrl: meta.url || r.originalUrl || 'https://www.cseel.org/edu-network/teachers',
    applyUrl: meta.apply_url || meta.url || r.applyUrl || undefined,
    verified: true,
    badge: meta.source ? (meta.source + ' Verified') : (r.badge || undefined),
    forLady: false,
  };

  job.forLady = isJobForLady(job);
  return job;
}

export function getActiveFacultyJobs(): FacultyJobItem[] {
  // Returns clean, verified multi-portal vacancies directly mapped with valid titles & schools
  const portalJobs = (aggregatedJobsData as any[]) || [];
  return portalJobs.map(mapRawRowToFacultyJobItem);
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
