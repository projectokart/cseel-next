/**
 * feedDecoder.ts
 * Decodes abbreviated slim JSON fields back to full FacultyJobItem format.
 * Used on the client side after loading jobs-feed.json.
 */
import { FacultyJobItem, isJobForLady } from '@/data/facultyJobsData';

// ── Reverse-lookup tables ─────────────────────────────────────────────────────────────

const BOARD_DECODE: Record<string, string> = {
  C: 'CBSE',
  I: 'ICSE',
  IB: 'Cambridge / IB',
  'IB/C': 'Cambridge / IB',
  CAMB: 'Cambridge / IB',
  S: 'State Board',
  INT: 'International',
};

const DESIGNATION_DECODE: Record<string, string> = {
  'Principal / Leadersh': 'Principal / Leadership',
};

const SOURCE_DECODE: Record<string, string> = {
  LI: 'LinkedIn',
  IN: 'Indeed',
  NK: 'Naukri.com',
  DP: 'Direct School Portal',
  AP: 'Apna.co',
  TO: 'TeacherON',
  TJ: 'TimesJobs',
  SH: 'Shine.com',
  EH: 'EducoHire',
  FO: 'Foundit',
  KV: 'KVS / NVS',
  DV: 'DAV CMC',
  AW: 'AWES India',
};

const ROLE_DECODE: Record<string, string> = {
  F: 'Full-Time',
  P: 'Part-Time',
  V: 'Visiting Faculty',
  L: 'Lab In-Charge',
  A: 'ATL Mentor',
  C: 'Contractual',
};

// ── Single job decoder ──────────────────────────────────────────────────────────────

export function decodeSlimJob(s: Record<string, any>): FacultyJobItem {
  const id = s.id || '';
  const coords = Array.isArray(s.co)
    ? { lat: s.co[0], lng: s.co[1] }
    : { lat: 28.6139, lng: 77.209 }; // Default: Delhi

  const openingDate = s.od || '';
  const dateMs = openingDate ? (Date.parse(openingDate) || 0) : 0;
  const imgUrl = (s.im && typeof s.im === 'string' && s.im.trim() !== '') ? s.im.trim() : null;

  const rawDesig = s.g || null;
  const designation = (rawDesig && DESIGNATION_DECODE[rawDesig]) ? DESIGNATION_DECODE[rawDesig] : rawDesig;
  const board = BOARD_DECODE[s.b] || s.b || null;

  const titleText = s.t || '';
  const descText = s.d || '';
  const orgText = s.n || '';

  const isUrgent = Boolean(
    s.urg ||
    /\b(urgent|urgently|immediate|walk-?in)\b/i.test(`${titleText} ${descText}`)
  );

  const isLady = Boolean(
    s.f ||
    isJobForLady({
      jobPostName: titleText,
      shortDescription: descText,
      organisationName: orgText,
    })
  );

  return {
    id,
    slug: id,
    organisationName: s.n || 'Educational Institution',
    organisationLogo: imgUrl,
    image_url:        imgUrl,
    jobPostName:      s.t || 'Teaching Position',
    designation:      designation,
    subject:          s.s || null,
    board:            board,
    roleType:         ROLE_DECODE[s.r]  || s.r  || 'Full-Time',
    salary:           s['$'] || 'Not Disclosed',
    salaryMin:        typeof s['$n'] === 'number' ? s['$n'] : null,
    salaryMax:        typeof s['$x'] === 'number' ? s['$x'] : null,
    shortDescription: descText,
    address:          `${s.c || ''}, ${s.dt || s.st || 'India'}`,
    city:             s.c  || 'India',
    state:            s.st || 'India',
    district:         s.dt || s.c || '',
    coordinates:      coords,
    minExperience:    s.x  || null,
    openingDate,
    lastDate:         '',
    source:           SOURCE_DECODE[s.src] || s.src || 'Direct School Portal',
    originalUrl:      s.u  || 'https://www.cseel.org/edu-network/teachers',
    applyUrl:         s.u  || undefined,
    verified:         Boolean(s.v),
    urgent:           isUrgent,
    badge:            isUrgent ? '🔥 Urgent Hiring' : (s.v ? `${SOURCE_DECODE[s.src] || s.src || 'Direct'} Verified` : ''),
    forLady:          isLady,
    distanceKm:       undefined,
    _dateMs:          dateMs,
  };
}

// ── Batch decoder ───────────────────────────────────────────────────────────────────

export function decodeSlimFeed(slimJobs: Record<string, any>[]): FacultyJobItem[] {
  return slimJobs.map(decodeSlimJob);
}

// ── Apply link details (url + description) from jobs-links.json ─────────────────────

export function applyLinksToJobs(
  jobs: FacultyJobItem[],
  links: Record<string, { u?: string; d?: string }>
): FacultyJobItem[] {
  return jobs.map((j) => {
    const link = links[j.id];
    if (!link) return j;
    return {
      ...j,
      originalUrl: link.u || j.originalUrl,
      applyUrl:    link.u || j.applyUrl,
      shortDescription: link.d || j.shortDescription,
    };
  });
}

// ── Apply coordinates from jobs-coords.json ─────────────────────────────────────────

export function applyCoordsToJobs(
  jobs: FacultyJobItem[],
  coords: Record<string, [number, number]>
): FacultyJobItem[] {
  return jobs.map((j) => {
    const co = coords[j.id];
    if (!co || !Array.isArray(co) || co.length < 2) return j;
    return { ...j, coordinates: { lat: co[0], lng: co[1] } };
  });
}
