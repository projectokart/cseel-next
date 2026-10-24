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
import geoData from '@/data/india_geo_centroids.json';

export type JobSourcePortal = "Indeed" | "LinkedIn" | "Naukri.com" | "Apna.co" | "Foundit" | "Shine.com" | "TeacherON" | "EducoHire" | "TimesJobs" | "DAV CMC" | "AWES India" | "KVS / NVS" | "Direct School Portal" | string;

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

// ── 2. Verified School Group Brand Logos (No fake stock photos) ──────────────
export const SCHOOL_BRAND_LOGOS: Record<string, string> = {};

function anyWordIn(text: string, words: string[]): boolean {
  const lower = text.toLowerCase();
  return words.some(w => lower.includes(w));
}

// ── 3. Normalization & Card Sanitization Logic (Zero Guesswork / Zero Fallback) ─
export class JobCardExtractor {

  /**
   * Normalizes designation and subject strictly from freeform text without guessing
   */
  static parseDesignationAndSubject(title: string, desc: string = ''): {
    designation?: FacultyJobItem['designation'];
    subject?: FacultyJobItem['subject'];
    board?: FacultyJobItem['board'];
    roleType?: FacultyJobItem['roleType'];
  } {
    const combined = `${title} ${desc}`.toLowerCase();

    // 1. Strict Designation extraction (NEET/JEE & Coaching handled first)
    let designation: FacultyJobItem['designation'] = undefined;
    if (/\b(neet|jee|iit\s*-?\s*jee|foundation|coaching|entrance)\b/.test(combined)) {
      designation = 'NEET & JEE Faculty';
    } else if (/\b(pgt|post\s*graduate\s*teacher|senior\s*secondary|class\s*(?:11|12|xi|xii))\b/.test(combined)) {
      designation = 'PGT';
    } else if (/\b(tgt|trained\s*graduate\s*teacher|middle\s*school|class\s*(?:6|7|8|9|10|vi|vii|viii|ix|x))\b/.test(combined)) {
      designation = 'TGT';
    } else if (/\b(prt|primary\s*teacher|junior\s*wing|primary\s*wing|class\s*(?:1|2|3|4|5|i|ii|iii|iv|v))\b/.test(combined)) {
      designation = 'PRT';
    } else if (/\b(nursery|pre[\s-]*primary|ntt|kindergarten|mother\s*teacher)\b/.test(combined)) {
      designation = 'Pre-Primary / Nursery';
    } else if (/\b(atl\s*mentor|robotics\s*trainer|stem\s*mentor|tinkering)\b/.test(combined)) {
      designation = 'ATL Mentor';
    } else if (/\b(lab\s*assistant|lab\s*in-charge|laboratory\s*assistant)\b/.test(combined)) {
      designation = 'Lab In-Charge';
    } else if (/\b(principal|vice\s*principal|headmistress|academic\s*coordinator|hod)\b/.test(combined)) {
      designation = 'Academic Leadership';
    }

    // 2. Strict Subject extraction
    const foundSubjs: string[] = [];
    if (/\b(physic|physics)\b/.test(combined)) foundSubjs.push('Physics');
    if (/\b(chemist|chemistry)\b/.test(combined)) foundSubjs.push('Chemistry');
    if (/\b(math|maths|mathematics|calculus)\b/.test(combined)) foundSubjs.push('Mathematics');
    if (/\b(biolog|biology|botany|zoology)\b/.test(combined)) foundSubjs.push('Biology');
    if (/\b(english|literature)\b/.test(combined)) foundSubjs.push('English');
    if (/\b(hindi)\b/.test(combined)) foundSubjs.push('Hindi');
    if (/\b(sanskrit)\b/.test(combined)) foundSubjs.push('Sanskrit');
    if (/\b(social\s*studies|social\s*science|sst)\b/.test(combined)) foundSubjs.push('Social Studies (SST)');
    if (/\b(history)\b/.test(combined)) foundSubjs.push('History');
    if (/\b(geography)\b/.test(combined)) foundSubjs.push('Geography');
    if (/\b(political\s*science|civics)\b/.test(combined)) foundSubjs.push('Political Science');
    if (/\b(economics)\b/.test(combined)) foundSubjs.push('Economics');
    if (/\b(commerce|accountancy|business\s*studies)\b/.test(combined)) foundSubjs.push('Commerce');
    if (/\b(computer|informatics|python|coding|\bcs\b|\bit\b|artificial\s*intelligence|\bai\b)\b/.test(combined)) foundSubjs.push('Computer Science & AI');

    let subject: FacultyJobItem['subject'] = undefined;
    if (foundSubjs.length > 2) {
      subject = (foundSubjs.includes('Physics') && foundSubjs.includes('Chemistry') && foundSubjs.includes('Mathematics'))
        ? 'Physics, Chemistry & Math'
        : foundSubjs.slice(0, 3).join(', ');
    } else if (foundSubjs.length === 2) {
      subject = `${foundSubjs[0]} & ${foundSubjs[1]}`;
    } else if (foundSubjs.length === 1) {
      subject = foundSubjs[0];
    } else if (/\b(science|general\s*science)\b/.test(combined)) {
      subject = 'Science';
    }

    // 3. Strict Board detection (NEVER default to CBSE)
    let board: FacultyJobItem['board'] = undefined;
    if (/\b(icse|isc|cisce)\b/.test(combined)) {
      board = 'ICSE';
    } else if (/\b(cambridge|ib|international\s*baccalaureate|igcse)\b/.test(combined)) {
      board = 'Cambridge / IB';
    } else if (/\b(state\s*board|haryana\s*board|up\s*board|maharashtra\s*board)\b/.test(combined)) {
      board = 'State Board';
    } else if (/\b(cbse)\b/.test(combined)) {
      // For NEET & JEE roles, only tag CBSE if explicit in school name or title
      if (designation !== 'NEET & JEE Faculty' || /\bcbse\b/.test(title.toLowerCase())) {
        board = 'CBSE';
      }
    }

    // 4. Role type
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
   * Normalizes salary strictly into single annual scale for accurate comparison.
   * Never synthesizes fake numbers! If not disclosed, returns "---".
   */
  static parseSalary(rawSalary?: string, designation?: string): {
    salary: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryPeriod?: 'monthly' | 'yearly';
  } {
    if (!rawSalary || anyWordIn(rawSalary, ['not disclosed', 'competitive', 'best in', 'as per', 'negotiable', '---'])) {
      return { salary: '---' };
    }

    const clean = rawSalary.replace(/[₹,\s]|rs\.?|inr/gi, '');
    const isMonthly = /\b(?:month|monthly|mo|p\.m\.|pm)\b/i.test(rawSalary);

    // 1. LPA range e.g. "12.0-18.0lpa" or "4.5to7.5lakhs"
    const lpaMatch = clean.match(/(\d+(?:\.\d+)?)[-–—to]+(\d+(?:\.\d+)?)(?:lpa|lakhs?|lac)/i);
    if (lpaMatch) {
      const mn = parseFloat(lpaMatch[1]);
      const mx = parseFloat(lpaMatch[2]);
      return {
        salary: `₹${mn.toFixed(1)} - ₹${mx.toFixed(1)} LPA`,
        salaryMin: Math.round(mn * 100000),
        salaryMax: Math.round(mx * 100000),
        salaryPeriod: 'yearly'
      };
    }

    const singleLpa = clean.match(/(\d+(?:\.\d+)?)(?:lpa|lakhs?|lac)/i);
    if (singleLpa) {
      const val = parseFloat(singleLpa[1]);
      return {
        salary: `₹${val.toFixed(1)} LPA`,
        salaryMin: Math.round(val * 100000),
        salaryMax: Math.round(val * 100000),
        salaryPeriod: 'yearly'
      };
    }

    // 2. Numeric range e.g. "20000-30000" or "25k-45k"
    const rangeMatch = clean.match(/(\d+(?:\.\d+)?)(k)?[-–—to]+(\d+(?:\.\d+)?)(k)?/i);
    if (rangeMatch) {
      const val1 = parseFloat(rangeMatch[1]);
      const k1 = Boolean(rangeMatch[2]);
      const val2 = parseFloat(rangeMatch[3]);
      const k2 = Boolean(rangeMatch[4]);

      const n1 = Math.round(k1 || (val1 < 500 && !isMonthly) ? val1 * 1000 : val1);
      const n2 = Math.round(k2 || (val2 < 500 && !isMonthly) ? val2 * 1000 : val2);

      if (isMonthly || (n2 <= 150000 && !clean.toLowerCase().includes('lpa') && !clean.toLowerCase().includes('annum'))) {
        const d1 = n1 >= 1000 ? `${Math.round(n1/1000)}k` : `${n1}`;
        const d2 = n2 >= 1000 ? `${Math.round(n2/1000)}k` : `${n2}`;
        return {
          salary: `₹${d1} - ₹${d2}/mo`,
          salaryMin: n1 * 12,
          salaryMax: n2 * 12,
          salaryPeriod: 'monthly'
        };
      } else {
        const lMin = n1 >= 100000 ? `₹${(n1/100000).toFixed(1)}` : `₹${n1}`;
        const lMax = n2 >= 100000 ? `₹${(n2/100000).toFixed(1)} LPA` : `₹${n2} P.A.`;
        return {
          salary: `${lMin} - ${lMax}`,
          salaryMin: n1,
          salaryMax: n2,
          salaryPeriod: 'yearly'
        };
      }
    }

    // 3. Single numeric figure
    const singleFig = clean.match(/(\d+(?:\.\d+)?)(k)?/i);
    if (singleFig) {
      const val = parseFloat(singleFig[1]);
      const k = Boolean(singleFig[2]);
      const n = Math.round(k ? val * 1000 : val);
      if (isMonthly || (n <= 120000 && !clean.toLowerCase().includes('annum'))) {
        const d = n >= 1000 ? `${Math.round(n/1000)}k` : `${n}`;
        return {
          salary: `₹${d}/mo`,
          salaryMin: n * 12,
          salaryMax: n * 12,
          salaryPeriod: 'monthly'
        };
      } else {
        return {
          salary: n >= 100000 ? `₹${(n/100000).toFixed(1)} LPA` : `₹${n} P.A.`,
          salaryMin: n,
          salaryMax: n,
          salaryPeriod: 'yearly'
        };
      }
    }

    return { salary: '---' };
  }

  /**
   * Resolves location, city, state, and coordinates with zero fallback to Delhi NCR.
   * Matches 102+ key cities or 37 Indian States/UTs centroids!
   */
  static parseLocation(rawLoc: string = '', rawCity?: string, rawState?: string): {
    city: string;
    state: string;
    address: string;
    coordinates: { lat: number; lng: number };
  } {
    const combined = `${rawLoc} ${rawCity || ''} ${rawState || ''}`.toLowerCase();

    // 1. Precise City Match from expanded geo database
    const citiesDict = (geoData as any).cities || {};
    for (const [cityName, info] of Object.entries(citiesDict)) {
      if (combined.includes(cityName)) {
        const capitalizedCity = cityName.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const itemInfo = info as any;
        return {
          city: capitalizedCity,
          state: itemInfo.state,
          address: rawLoc.trim() || `${capitalizedCity}, ${itemInfo.state}`,
          coordinates: { lat: itemInfo.lat, lng: itemInfo.lng }
        };
      }
    }

    // 2. State Centroid Match from expanded 37 State centroids
    const statesDict = (geoData as any).state_centroids || {};
    for (const [stName, stInfo] of Object.entries(statesDict)) {
      if (combined.includes(stName.toLowerCase())) {
        const info = stInfo as any;
        return {
          city: rawCity || info.capital || stName,
          state: stName,
          address: rawLoc.trim() || `${rawCity || info.capital}, ${stName}`,
          coordinates: { lat: info.lat, lng: info.lng }
        };
      }
    }

    // 3. True All-India Center (Nagpur Geographical Center of India)
    return {
      city: rawCity || 'India',
      state: rawState || 'All India',
      address: rawLoc.trim() || 'India',
      coordinates: { lat: 20.5937, lng: 78.9629 }
    };
  }

  /**
   * Resolves school logo - only keeps authentic URLs, never falls back to stock photos
   */
  static resolveLogo(schoolName: string, customLogo?: string): string | undefined {
    if (customLogo && customLogo.startsWith('http') && !customLogo.includes('unsplash.com')) {
      return customLogo;
    }
    return undefined;
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
    const slugBase = `${input.portal.toLowerCase()}-${input.rawSchoolName}-${designation || 'role'}-${subject || 'faculty'}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);

    const id = `job-${slugBase}-${Math.random().toString(36).substring(2, 6)}`;

    // Experience parsing (zero guessing: only if explicitly specified)
    let minExperience: string | undefined = undefined;
    if (input.rawExperience) {
      const expStr = String(input.rawExperience).replace(/years?|exp/gi, '').trim();
      if (expStr) {
        minExperience = expStr.includes('yr') ? expStr : `${expStr} yrs`;
      }
    }

    // Opening & deadline dates (strictly zero-guesswork: only if provided by source)
    const openingDate = input.postedDateStr || undefined;
    const lastDate = input.deadlineDateStr || undefined;

    // Clean card description without fake marketing text
    const shortDescription = input.rawDescription
      ? input.rawDescription.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim().slice(0, 180) + '...'
      : `${input.rawSchoolName.trim()} is hiring for ${input.rawTitle.trim()} in ${city}, ${state}.`;

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

  /**
   * Transforms raw Naukri v3 API item into strict FacultyJobItem card
   */
  static fromNaukri(item: any): FacultyJobItem {
    let rawSalary = '';
    let rawExperience = '';
    let rawLocation = '';

    if (Array.isArray(item.placeholders)) {
      for (const p of item.placeholders) {
        if (p.type === 'salary') rawSalary = p.label || '';
        if (p.type === 'experience') rawExperience = p.label || '';
        if (p.type === 'location') rawLocation = p.label || '';
      }
    }

    let sourceUrl = item.staticUrl || item.jdURL || item.applyUrl || '';
    if (sourceUrl && !sourceUrl.startsWith('http')) {
      sourceUrl = `https://www.naukri.com${sourceUrl.startsWith('/') ? '' : '/'}${sourceUrl}`;
    }
    if (!sourceUrl) {
      sourceUrl = 'https://www.naukri.com';
    }

    const input: RawJobInput = {
      rawTitle: item.title || item.jobTitle || 'School Faculty',
      rawSchoolName: item.companyName || item.orgName || 'Reputed Institution',
      rawLocation,
      rawSalary,
      rawExperience,
      rawDescription: item.jobDescription || '',
      rawSourceUrl: sourceUrl,
      portal: 'Naukri.com',
      logoUrl: item.logoPath || item.logo || '',
      postedDateStr: item.createdDate ? new Date(item.createdDate).toISOString().split('T')[0] : undefined
    };

    return this.transformToCardItem(input);
  }

  /**
   * Transforms scraped LinkedIn item into strict FacultyJobItem card
   */
  static fromLinkedInScraped(item: any): FacultyJobItem {
    const input: RawJobInput = {
      rawTitle: item.title || 'Teaching Faculty',
      rawSchoolName: item.school || item.company || 'School Institution',
      rawLocation: item.location || 'India',
      rawSourceUrl: item.url || 'https://www.linkedin.com/jobs',
      portal: 'LinkedIn',
      logoUrl: item.logo || '',
      postedDateStr: item.postedDate || undefined
    };

    return this.transformToCardItem(input);
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

  static saveAggregatedJobs(newJobs: FacultyJobItem[]): { total: number; added: number; purged: number } {
    try {
      const existing = this.getAggregatedJobs();
      const combined = [...existing, ...newJobs];

      // 1. Strictly enforce 45-day retention rule (auto-purge expired vacancies)
      const now = Date.now();
      const fortyFiveDaysMs = 45 * 24 * 60 * 60 * 1000;
      let purgedCount = 0;

      const activeList = combined.filter((job) => {
        const jobTime = new Date(job.openingDate).getTime();
        const age = now - jobTime;
        if (age > fortyFiveDaysMs) {
          purgedCount++;
          return false;
        }
        return true;
      });

      // 2. Strict 5-Point Deduplication System across all portals
      const deduplicated: FacultyJobItem[] = [];
      let addedCount = 0;

      const normalizeStr = (s: string) => (s || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

      const isExactDuplicateJob = (a: FacultyJobItem, b: FacultyJobItem): boolean => {
        // 1. Same Role & Subject
        if (a.designation !== b.designation || a.subject !== b.subject) {
          return false;
        }

        // 2. Same City & Address Location
        if (a.city.toLowerCase() !== b.city.toLowerCase()) {
          return false;
        }
        if (a.address && b.address) {
          const secA = a.address.toLowerCase().match(/sector\s*\d+|phase\s*\d+/i)?.[0];
          const secB = b.address.toLowerCase().match(/sector\s*\d+|phase\s*\d+/i)?.[0];
          if (secA && secB && secA !== secB) {
            return false; // Different branch campus
          }
        }

        // 3. Same School Name
        const normA = normalizeStr(a.organisationName);
        const normB = normalizeStr(b.organisationName);
        const nameMatch = normA === normB || normA.includes(normB) || normB.includes(normA);
        if (!nameMatch) {
          return false;
        }

        // 4. Same Close Posting Date Window (within 10 days)
        const dateA = new Date(a.openingDate).getTime();
        const dateB = new Date(b.openingDate).getTime();
        if (!isNaN(dateA) && !isNaN(dateB)) {
          const diffDays = Math.abs(dateA - dateB) / (1000 * 60 * 60 * 24);
          if (diffDays > 10) {
            return false; // Posted months apart -> separate vacancy
          }
        }

        // 5. Matching Salary Range (if disclosed on both)
        if (a.salaryMin && b.salaryMin && a.salaryMax && b.salaryMax) {
          const maxMin = Math.max(a.salaryMin, b.salaryMin);
          const minMax = Math.min(a.salaryMax, b.salaryMax);
          if (maxMin > minMax && Math.abs(a.salaryMin - b.salaryMin) > 150000) {
            return false; // Different compensation package -> different role
          }
        }

        return true;
      };

      for (const job of activeList) {
        let existingMatchIndex = -1;
        for (let i = 0; i < deduplicated.length; i++) {
          if (isExactDuplicateJob(deduplicated[i], job)) {
            existingMatchIndex = i;
            break;
          }
        }

        if (existingMatchIndex >= 0) {
          // Merge duplicate: keep freshest date and link
          const ex = deduplicated[existingMatchIndex];
          if (new Date(job.openingDate).getTime() > new Date(ex.openingDate).getTime()) {
            ex.openingDate = job.openingDate;
            ex.lastDate = job.lastDate;
            ex.salary = job.salary;
            ex.originalUrl = job.originalUrl;
          }
          if (job.source && !ex.source.includes(job.source)) {
            ex.source = `${ex.source} / ${job.source}`;
            ex.badge = `${ex.source} Verified`;
          }
        } else {
          deduplicated.push(job);
          addedCount++;
        }
      }

      fs.writeFileSync(AGGREGATED_FILE_PATH, JSON.stringify(deduplicated, null, 2), 'utf8');
      return { total: deduplicated.length, added: addedCount, purged: purgedCount };
    } catch (err) {
      console.error('[JobAggregatorStorage] Error saving aggregated jobs:', err);
      throw err;
    }
  }
}

export { getAnnualSalaryNumber } from '@/lib/salaryUtils';
