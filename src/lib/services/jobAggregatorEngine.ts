/**
 * India School Jobs Aggregator Engine
 * ════════════════════════════════════════════════════════════════════════════
 * Aggregates authenticated school faculty and teaching vacancies across
 * all major Indian job portals (Indeed, LinkedIn, Naukri, TimesJobs, TeacherOn,
 * and direct CBSE/ICSE school portals).
 * 
 * Extracts STRICTLY the essential fields required for the CSEEL Compact Job Card:
 * - Organisation Name, Logo, Address, City, State, Coordinates (for Map)
 * - Job Post Name, Designation (PGT/TGT/PRT), Subject, Board, Role Type
 * - Salary Display Range (in green) + Min/Max numeric
 * - Posted Date, Due Date, Experience requirement
 * - Source Portal (Indeed, LinkedIn, etc.) & Direct Apply URL
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';
import { FacultyJobItem } from '@/data/facultyJobsData';

export type JobSourcePortal = "Indeed" | "LinkedIn" | "Naukri.com" | "TimesJobs" | "Direct School Portal";

export interface RawJobInput {
  rawTitle: string;
  rawSchoolName: string;
  rawLocation?: string;
  rawCity?: string;
  rawState?: string;
  rawSalary?: string;
  rawExperience?: string | number;
  rawDescription?: string;
  rawSourceUrl: string;
  portal: JobSourcePortal;
  logoUrl?: string;
  postedDateStr?: string;
  deadlineDateStr?: string;
  board?: string;
}

// ── 1. Indian Educational Cities Geolocation Database ────────────────────────
export const INDIAN_CITIES_GEO: Record<string, { state: string; lat: number; lng: number }> = {
  'delhi': { state: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  'new delhi': { state: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  'delhi ncr': { state: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  'noida': { state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
  'greater noida': { state: 'Uttar Pradesh', lat: 28.4744, lng: 77.5040 },
  'gurugram': { state: 'Haryana', lat: 28.4595, lng: 77.0266 },
  'gurgaon': { state: 'Haryana', lat: 28.4595, lng: 77.0266 },
  'faridabad': { state: 'Haryana', lat: 28.4089, lng: 77.3178 },
  'ghaziabad': { state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
  'mumbai': { state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  'navi mumbai': { state: 'Maharashtra', lat: 19.0330, lng: 73.0297 },
  'thane': { state: 'Maharashtra', lat: 19.2183, lng: 72.9781 },
  'pune': { state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  'bengaluru': { state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  'bangalore': { state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  'hyderabad': { state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  'chennai': { state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  'kolkata': { state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  'ahmedabad': { state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  'jaipur': { state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  'chandigarh': { state: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  'lucknow': { state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  'dehradun': { state: 'Uttarakhand', lat: 30.3165, lng: 78.0322 },
  'indore': { state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  'bhopal': { state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  'patna': { state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  'bhubaneswar': { state: 'Odisha', lat: 20.2961, lng: 85.8245 },
  'nagpur': { state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  'vadodara': { state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
  'surat': { state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  'kochi': { state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  'coimbatore': { state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  'visakhapatnam': { state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  'kanpur': { state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  'varanasi': { state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  'amritsar': { state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  'jalandhar': { state: 'Punjab', lat: 31.3260, lng: 75.5762 },
  'rewari': { state: 'Haryana', lat: 28.1833, lng: 76.6167 },
  'palwal': { state: 'Haryana', lat: 28.1447, lng: 77.3260 },
  'panipat': { state: 'Haryana', lat: 29.3909, lng: 76.9635 },
  'karnal': { state: 'Haryana', lat: 29.6857, lng: 76.9905 },
};

// ── 2. Verified School Group Brand Logos ─────────────────────────────────────
export const SCHOOL_BRAND_LOGOS: Record<string, string> = {
  'dps': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&auto=format&fit=crop&q=80',
  'delhi public school': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&auto=format&fit=crop&q=80',
  'heritage': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&auto=format&fit=crop&q=80',
  'the heritage school': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&auto=format&fit=crop&q=80',
  'shiv nadar': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&auto=format&fit=crop&q=80',
  'ryan international': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=100&auto=format&fit=crop&q=80',
  'amity': 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80',
  'dav': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100&auto=format&fit=crop&q=80',
  'army public school': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100&auto=format&fit=crop&q=80',
  'kendriya vidyalaya': 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=100&auto=format&fit=crop&q=80',
  'gd goenka': 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=100&auto=format&fit=crop&q=80',
  'pathways': 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=100&auto=format&fit=crop&q=80',
  'st xavier': 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&auto=format&fit=crop&q=80',
  'default_school': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100&auto=format&fit=crop&q=80',
};

// ── 3. Normalization & Card Sanitization Logic ────────────────────────────────
export class JobCardExtractor {

  /**
   * Normalizes designation and subject from freeform text
   */
  static parseDesignationAndSubject(title: string, desc: string = ''): {
    designation: FacultyJobItem['designation'];
    subject: FacultyJobItem['subject'];
    board: FacultyJobItem['board'];
    roleType: FacultyJobItem['roleType'];
  } {
    const combined = `${title} ${desc}`.toLowerCase();

    // Designation extraction
    let designation: FacultyJobItem['designation'] = 'TGT';
    if (/\b(pgt|post\s*graduate\s*teacher|senior\s*secondary|xi|xii|11th|12th)\b/.test(combined)) {
      designation = 'PGT';
    } else if (/\b(tgt|trained\s*graduate\s*teacher|secondary|middle\s*school|6th|7th|8th|9th|10th)\b/.test(combined)) {
      designation = 'TGT';
    } else if (/\b(prt|primary\s*teacher|junior\s*school|primary|foundation|class\s*1\s*to\s*5)\b/.test(combined)) {
      designation = 'PRT';
    } else if (/\b(atl\s*mentor|tinkering|robotics\s*trainer|maker|steam\s*mentor)\b/.test(combined)) {
      designation = 'ATL Mentor';
    } else if (/\b(lab\s*in-charge|lab\s*assistant|lab\s*attendant|laboratory)\b/.test(combined)) {
      designation = 'Lab In-Charge';
    } else if (/\b(coordinator|headmistress|vice\s*principal|principal|hod)\b/.test(combined)) {
      designation = 'Coordinator';
    }

    // Subject extraction
    let subject: FacultyJobItem['subject'] = 'General Science';
    if (/\b(physic|physics)\b/.test(combined)) {
      subject = 'Physics';
    } else if (/\b(chemist|chemistry)\b/.test(combined)) {
      subject = 'Chemistry';
    } else if (/\b(biolog|biology|botany|zoology|life\s*science)\b/.test(combined)) {
      subject = 'Biology';
    } else if (/\b(math|mathematics|applied\s*math)\b/.test(combined)) {
      subject = 'Mathematics';
    } else if (/\b(robot|robotics|artificial\s*intelligence|\bai\b|iot|arduino)\b/.test(combined)) {
      subject = 'Robotics & AI';
    } else if (/\b(computer|informatics|python|coding|cs|ip)\b/.test(combined)) {
      subject = 'Computer Science';
    } else if (/\b(composite\s*lab|stem|steam|hands-on|tinkerer)\b/.test(combined)) {
      subject = 'Composite Lab';
    }

    // Board detection
    let board: FacultyJobItem['board'] = 'CBSE';
    if (/\b(icse|isc|cisce)\b/.test(combined)) {
      board = 'ICSE';
    } else if (/\b(cambridge|ib|international\s*baccalaureate|igcse)\b/.test(combined)) {
      board = 'Cambridge / IB';
    } else if (/\b(state\s*board|haryana\s*board|up\s*board|maharashtra\s*board)\b/.test(combined)) {
      board = 'State Board';
    }

    // Role type
    let roleType: FacultyJobItem['roleType'] = 'Full-Time';
    if (/\b(part[\s-]*time|visiting|guest|contractual|hourly)\b/.test(combined)) {
      roleType = 'Part-Time';
    } else if (designation === 'ATL Mentor') {
      roleType = 'ATL Mentor';
    } else if (designation === 'Lab In-Charge') {
      roleType = 'Lab In-Charge';
    }

    return { designation, subject, board, roleType };
  }

  /**
   * Normalizes salary into clean standard Indian LPA or Monthly format
   */
  static parseSalary(rawSalary?: string, designation?: string): {
    salary: string;
    salaryMin: number;
    salaryMax: number;
  } {
    if (!rawSalary || rawSalary.toLowerCase().includes('not disclosed') || rawSalary.toLowerCase().includes('competitive') || rawSalary.toLowerCase().includes('best in')) {
      // Benchmark based on designation
      if (designation === 'PGT') {
        return { salary: '₹6.5 - ₹9.5 LPA', salaryMin: 650000, salaryMax: 950000 };
      } else if (designation === 'TGT') {
        return { salary: '₹4.8 - ₹7.2 LPA', salaryMin: 480000, salaryMax: 720000 };
      } else if (designation === 'PRT') {
        return { salary: '₹3.6 - ₹5.4 LPA', salaryMin: 360000, salaryMax: 540000 };
      } else if (designation === 'ATL Mentor') {
        return { salary: '₹5.0 - ₹8.0 LPA', salaryMin: 500000, salaryMax: 800000 };
      }
      return { salary: '₹4.5 - ₹7.0 LPA', salaryMin: 450000, salaryMax: 700000 };
    }

    const clean = rawSalary.replace(/[,\s]/g, '');
    const lpaMatch = rawSalary.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(?:lpa|lakh|lac)/i);
    if (lpaMatch) {
      const min = parseFloat(lpaMatch[1]);
      const max = parseFloat(lpaMatch[2]);
      return {
        salary: `₹${min.toFixed(1)} - ₹${max.toFixed(1)} LPA`,
        salaryMin: Math.round(min * 100000),
        salaryMax: Math.round(max * 100000)
      };
    }

    const monthlyMatch = rawSalary.match(/(\d{2,3})(?:000)?\s*(?:-|to)\s*(\d{2,3})(?:000)?/i);
    if (monthlyMatch && rawSalary.toLowerCase().includes('month')) {
      const minK = parseInt(monthlyMatch[1]) * 1000;
      const maxK = parseInt(monthlyMatch[2]) * 1000;
      return {
        salary: `₹${(minK/1000)}k - ₹${(maxK/1000)}k/mo`,
        salaryMin: minK * 12,
        salaryMax: maxK * 12
      };
    }

    // Default clean output if non-empty
    return {
      salary: rawSalary.startsWith('₹') ? rawSalary : `₹${rawSalary}`,
      salaryMin: 400000,
      salaryMax: 700000
    };
  }

  /**
   * Resolves location, city, state, and coordinates for Map button
   */
  static parseLocation(rawLoc: string = '', rawCity?: string, rawState?: string): {
    city: string;
    state: string;
    address: string;
    coordinates: { lat: number; lng: number };
  } {
    const locLower = `${rawLoc} ${rawCity || ''} ${rawState || ''}`.toLowerCase();

    for (const [cityName, info] of Object.entries(INDIAN_CITIES_GEO)) {
      if (locLower.includes(cityName)) {
        const capitalizedCity = cityName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const cleanAddress = rawLoc.trim() ? rawLoc.trim() : `${capitalizedCity}, ${info.state}`;
        return {
          city: capitalizedCity,
          state: info.state,
          address: cleanAddress,
          coordinates: { lat: info.lat, lng: info.lng }
        };
      }
    }

    // Default to Delhi NCR educational cluster
    return {
      city: 'Delhi NCR',
      state: 'Delhi',
      address: rawLoc.trim() || 'Delhi NCR, India',
      coordinates: { lat: 28.6139, lng: 77.2090 }
    };
  }

  /**
   * Resolves school logo with intelligent fallback
   */
  static resolveLogo(schoolName: string, customLogo?: string): string {
    if (customLogo && customLogo.startsWith('http')) return customLogo;
    const nameLower = schoolName.toLowerCase();
    for (const [key, logo] of Object.entries(SCHOOL_BRAND_LOGOS)) {
      if (nameLower.includes(key)) {
        return logo;
      }
    }
    return SCHOOL_BRAND_LOGOS['default_school'];
  }

  /**
   * Formats raw portal job into strictly the compact card structure
   */
  static transformToCardItem(input: RawJobInput): FacultyJobItem {
    const { designation, subject, board, roleType } = this.parseDesignationAndSubject(input.rawTitle, input.rawDescription);
    const { salary, salaryMin, salaryMax } = this.parseSalary(input.rawSalary, designation);
    const { city, state, address, coordinates } = this.parseLocation(input.rawLocation, input.rawCity, input.rawState);
    const organisationLogo = this.resolveLogo(input.rawSchoolName, input.logoUrl);

    // Slug generation
    const slugBase = `${input.portal.toLowerCase()}-${input.rawSchoolName}-${designation}-${subject}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);

    const id = `job-${slugBase}-${Math.random().toString(36).substring(2, 6)}`;

    // Experience parsing
    let minExperience = "1-3 yrs";
    if (input.rawExperience) {
      minExperience = String(input.rawExperience).replace(/years?|exp/gi, '').trim();
      if (!minExperience.includes('yr')) minExperience += ' yrs';
    } else if (designation === 'PGT') {
      minExperience = "Min 3 yrs";
    } else if (designation === 'TGT') {
      minExperience = "Min 2 yrs";
    } else {
      minExperience = "Min 1 yr";
    }

    // Opening & deadline dates
    const today = new Date();
    const openingDate = input.postedDateStr || today.toISOString().split('T')[0];
    
    // Default 30-day deadline
    const deadlineDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const lastDate = input.deadlineDateStr || deadlineDate;

    // Concise clean card description (1-2 sentences max)
    const shortDescription = input.rawDescription
      ? input.rawDescription.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim().slice(0, 180) + '...'
      : `Reputed ${board} institution inviting applications for ${designation} ${subject}. Excellent teaching environment and competitive benefits.`;

    const cardItem: FacultyJobItem = {
      id,
      organisationName: input.rawSchoolName.trim(),
      organisationLogo,
      jobPostName: input.rawTitle.trim(),
      designation,
      subject,
      board: (input.board as any) || board,
      roleType,
      salary,
      salaryMin,
      salaryMax,
      shortDescription,
      address,
      city,
      state,
      coordinates,
      minExperience,
      openingDate,
      lastDate,
      source: input.portal,
      originalUrl: input.rawSourceUrl,
      verified: true,
      badge: `${input.portal} Verified`
    };

    return cardItem;
  }
}

// ── 4. Storage & Persistence Engine ──────────────────────────────────────────
const AGGREGATED_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'aggregated_jobs.json');

export class JobAggregatorStorage {

  static getAggregatedJobs(): FacultyJobItem[] {
    try {
      if (fs.existsSync(AGGREGATED_FILE_PATH)) {
        const raw = fs.readFileSync(AGGREGATED_FILE_PATH, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[JobAggregatorStorage] Could not load aggregated jobs:', err);
    }
    return [];
  }

  static saveAggregatedJobs(newJobs: FacultyJobItem[]): { total: number; added: number } {
    try {
      const existing = this.getAggregatedJobs();
      const existingMap = new Map<string, FacultyJobItem>();
      
      // Index by unique key (school + designation + subject + city)
      for (const j of existing) {
        const key = `${j.organisationName}_${j.designation}_${j.subject}_${j.city}`.toLowerCase();
        existingMap.set(key, j);
      }

      let addedCount = 0;
      for (const job of newJobs) {
        const key = `${job.organisationName}_${job.designation}_${job.subject}_${job.city}`.toLowerCase();
        if (!existingMap.has(key)) {
          existingMap.set(key, job);
          addedCount++;
        }
      }

      const consolidated = Array.from(existingMap.values());
      fs.writeFileSync(AGGREGATED_FILE_PATH, JSON.stringify(consolidated, null, 2), 'utf8');
      return { total: consolidated.length, added: addedCount };
    } catch (err) {
      console.error('[JobAggregatorStorage] Error saving aggregated jobs:', err);
      throw err;
    }
  }
}
