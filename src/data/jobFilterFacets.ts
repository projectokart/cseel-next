import facetsJson from './job_filter_facets.json';
import { FacultyJobItem, isJobForLady } from './facultyJobsData';
import { matchesJobFuzzy } from '@/lib/fuzzySearch';
import { getAnnualSalaryNumber } from '@/lib/salaryUtils';
import { haversineKm } from '@/lib/jobs/haversine';

export interface FacetOption {
  id: string;
  label: string;
  count: number;
}

export interface JobFilterFacetsData {
  lastUpdated: string;
  totalVacancies: number;
  forLadyCount?: number;
  subjects: FacetOption[];
  designations: FacetOption[];
  boards: FacetOption[];
  cities: FacetOption[];
  states: FacetOption[];
  portals: FacetOption[];
  salarySlabs: FacetOption[];
  counts: {
    subjects: Record<string, number>;
    designations: Record<string, number>;
    boards: Record<string, number>;
    cities: Record<string, number>;
    states: Record<string, number>;
    portals: Record<string, number>;
  };
}

export const DEFAULT_JOB_FACETS: JobFilterFacetsData = facetsJson as JobFilterFacetsData;

export interface FilterCriteria {
  selectedDesignations: string[];
  selectedSubjects: string[];
  selectedBoards: string[];
  selectedCities: string[];
  selectedStates: string[];
  selectedJobTypes?: string[];
  selectedPortals?: string[];
  minSalaryFilter: number;
  urgentOnly: boolean;
  forLadyOnly?: boolean;
  searchQuery?: string;
  searchLocation?: string;
  distanceRadiusFilter?: number;
  userCoords?: { lat: number; lng: number } | null;
}

/**
 * Single Source of Truth for matching a job against active filter criteria.
 * Supports optional `ignoreDimension` to accurately calculate drill-down facet counts.
 */
export function matchesJobFilter(
  job: FacultyJobItem,
  filters: FilterCriteria,
  ignoreDimension?: 'designation' | 'subject' | 'board' | 'city' | 'state' | 'jobType' | 'portal' | 'salary' | 'urgent' | 'forLady'
): boolean {
  const {
    selectedDesignations = [],
    selectedSubjects = [],
    selectedBoards = [],
    selectedCities = [],
    selectedStates = [],
    selectedJobTypes = [],
    selectedPortals = [],
    minSalaryFilter = 0,
    urgentOnly = false,
    forLadyOnly = false,
    searchQuery = '',
    searchLocation = '',
    distanceRadiusFilter = 0,
    userCoords = null,
  } = filters;

  // 1. Text Search Query
  if (searchQuery && searchQuery.trim()) {
    if (!matchesJobFuzzy(job, searchQuery.trim())) return false;
  }

  // 2. Designation filter
  if (ignoreDimension !== 'designation' && selectedDesignations.length > 0) {
    const d = job.designation || 'Teacher';
    if (!selectedDesignations.includes(d)) return false;
  }

  // 3. Subject filter
  if (ignoreDimension !== 'subject' && selectedSubjects.length > 0) {
    const s = job.subject || 'General Teaching';
    if (!selectedSubjects.includes(s)) return false;
  }

  // 4. Board filter
  if (ignoreDimension !== 'board' && selectedBoards.length > 0) {
    const b = job.board || 'CBSE';
    if (!selectedBoards.includes(b)) return false;
  }

  // 5. City filter (matches city, district, or address)
  if (ignoreDimension !== 'city' && selectedCities.length > 0) {
    const jCity = (job.city || '').toLowerCase();
    const jDist = (job.district || '').toLowerCase();
    const jAddr = (job.address || '').toLowerCase();
    const matchesCity = selectedCities.some((c) => {
      const cl = c.toLowerCase();
      return jCity.includes(cl) || jDist.includes(cl) || jAddr.includes(cl);
    });
    if (!matchesCity) return false;
  }

  // 6. State filter
  if (ignoreDimension !== 'state' && selectedStates.length > 0) {
    const jState = (job.state || '').toLowerCase();
    const matchesState = selectedStates.some((s) => jState.includes(s.toLowerCase()));
    if (!matchesState) return false;
  }

  // 7. Job Type / Work Mode filter
  if (ignoreDimension !== 'jobType' && selectedJobTypes.length > 0) {
    const roleType = (job.roleType || '').toLowerCase();
    const title = (job.jobPostName || '').toLowerCase();
    const desc = (job.shortDescription || '').toLowerCase();
    const fullText = `${roleType} ${title} ${desc}`;

    const matchesJobType = selectedJobTypes.some((jt) => {
      if (jt === 'Remote') {
        return fullText.includes('remote') || fullText.includes('online') || fullText.includes('work from home');
      }
      if (jt === 'On-site') {
        return !fullText.includes('remote') && !fullText.includes('work from home');
      }
      if (jt === 'Part-Time') {
        return fullText.includes('part-time') || fullText.includes('part time') || fullText.includes('visiting');
      }
      if (jt === 'Full-Time') {
        return fullText.includes('full-time') || fullText.includes('full time') || roleType === 'full-time' || !roleType;
      }
      return roleType.includes(jt.toLowerCase());
    });
    if (!matchesJobType) return false;
  }

  // 8. Portal Source filter
  if (ignoreDimension !== 'portal' && selectedPortals.length > 0) {
    const src = (job.source || '').toLowerCase();
    const matchesPortal = selectedPortals.some((p) => {
      const pl = p.toLowerCase();
      if (pl.includes('naukri')) return src.includes('naukri');
      if (pl.includes('indeed')) return src.includes('indeed');
      if (pl.includes('linkedin')) return src.includes('linkedin');
      if (pl.includes('portal') || pl.includes('school') || pl.includes('direct')) {
        return src.includes('direct') || src.includes('school') || src.includes('portal');
      }
      return src.includes(pl);
    });
    if (!matchesPortal) return false;
  }

  // 9. Minimum Annual Salary filter
  if (ignoreDimension !== 'salary' && minSalaryFilter > 0) {
    const annualMax = getAnnualSalaryNumber(job.salary, job.salaryMax).max;
    if (annualMax < minSalaryFilter) return false;
  }

  // 10. Urgent Hiring filter
  if (ignoreDimension !== 'urgent' && urgentOnly) {
    if (!job.urgent && !job.badge?.includes('Urgent')) return false;
  }

  // 11. For Lady Only filter
  if (ignoreDimension !== 'forLady' && forLadyOnly) {
    if (!job.forLady && !isJobForLady(job)) return false;
  }

  // 12. Search Location input text
  if (searchLocation && searchLocation.trim()) {
    const qLoc = searchLocation.toLowerCase().trim();
    const matchLoc = `${job.city || ''} ${job.state || ''} ${job.district || ''} ${job.address || ''}`.toLowerCase();
    if (!matchLoc.includes(qLoc)) return false;
  }

  // 13. GPS Distance Radius
  if (distanceRadiusFilter > 0 && userCoords) {
    if (job.coordinates?.lat && job.coordinates?.lng) {
      const d = haversineKm(userCoords.lat, userCoords.lng, job.coordinates.lat, job.coordinates.lng);
      if (d > distanceRadiusFilter) return false;
    }
  }

  return true;
}

/**
 * Calculates multi-dimensional faceted search counts across all dimensions.
 * For each dimension (e.g. subjects), evaluates against jobs matching all OTHER active filters.
 * Ensures instant, 100% mathematically consistent drill-down feedback when any filter is toggled.
 */
export function calculateDynamicFacets(
  allJobs: FacultyJobItem[],
  filters: FilterCriteria
): {
  subjects: Record<string, number>;
  designations: Record<string, number>;
  boards: Record<string, number>;
  cities: Record<string, number>;
  states: Record<string, number>;
  portals: Record<string, number>;
  forLady: number;
} {
  const subCounts: Record<string, number> = {};
  const desCounts: Record<string, number> = {};
  const boardCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  const stateCounts: Record<string, number> = {};
  const portalCounts: Record<string, number> = {};
  let forLadyCount = 0;

  for (const job of allJobs) {
    // 1. Designation counts (evaluates against all OTHER active filters)
    if (matchesJobFilter(job, filters, 'designation')) {
      const d = job.designation || 'Teacher';
      desCounts[d] = (desCounts[d] || 0) + 1;
    }

    // 2. Subject counts (evaluates against all OTHER active filters)
    if (matchesJobFilter(job, filters, 'subject')) {
      const s = job.subject || 'General Teaching';
      subCounts[s] = (subCounts[s] || 0) + 1;
    }

    // 3. Board counts (evaluates against all OTHER active filters)
    if (matchesJobFilter(job, filters, 'board')) {
      if (job.board) {
        boardCounts[job.board] = (boardCounts[job.board] || 0) + 1;
      }
    }

    // 4. City counts (evaluates against all OTHER active filters)
    if (matchesJobFilter(job, filters, 'city')) {
      if (job.city && job.city !== 'India') {
        cityCounts[job.city] = (cityCounts[job.city] || 0) + 1;
      }
    }

    // 5. State counts (evaluates against all OTHER active filters)
    if (matchesJobFilter(job, filters, 'state')) {
      if (job.state && job.state !== 'India' && job.state !== 'All India') {
        stateCounts[job.state] = (stateCounts[job.state] || 0) + 1;
      }
    }

    // 6. Portal counts (evaluates against all OTHER active filters)
    if (matchesJobFilter(job, filters, 'portal')) {
      if (job.source) {
        portalCounts[job.source] = (portalCounts[job.source] || 0) + 1;
      }
    }

    // 7. For Lady count (evaluates against all OTHER active filters)
    if (matchesJobFilter(job, filters, 'forLady') && (job.forLady || isJobForLady(job))) {
      forLadyCount++;
    }
  }

  return {
    subjects: subCounts,
    designations: desCounts,
    boards: boardCounts,
    cities: cityCounts,
    states: stateCounts,
    portals: portalCounts,
    forLady: forLadyCount,
  };
}

/**
 * Automatically extracts fresh available facet options and baseline counts from any job list.
 * Keeps filter sheet options 100% synchronized with the live JSON feed.
 */
export function buildFacetsFromJobs(jobs: FacultyJobItem[]): JobFilterFacetsData {
  const subjectsMap: Record<string, number> = {};
  const designationsMap: Record<string, number> = {};
  const boardsMap: Record<string, number> = {};
  const citiesMap: Record<string, number> = {};
  const statesMap: Record<string, number> = {};
  const portalsMap: Record<string, number> = {};
  let ladyCount = 0;

  for (const j of jobs) {
    const s = j.subject || 'General Teaching';
    subjectsMap[s] = (subjectsMap[s] || 0) + 1;

    const d = j.designation || 'Teacher';
    designationsMap[d] = (designationsMap[d] || 0) + 1;

    const b = j.board || 'CBSE';
    boardsMap[b] = (boardsMap[b] || 0) + 1;

    if (j.city && j.city !== 'India') {
      citiesMap[j.city] = (citiesMap[j.city] || 0) + 1;
    }
    if (j.state && j.state !== 'India' && j.state !== 'All India') {
      statesMap[j.state] = (statesMap[j.state] || 0) + 1;
    }
    if (j.source) {
      portalsMap[j.source] = (portalsMap[j.source] || 0) + 1;
    }
    if (j.forLady || isJobForLady(j)) {
      ladyCount++;
    }
  }

  return {
    lastUpdated: new Date().toISOString(),
    totalVacancies: jobs.length,
    forLadyCount: ladyCount,
    subjects: Object.entries(subjectsMap).sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ id, label: id, count })),
    designations: Object.entries(designationsMap).sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ id, label: id, count })),
    boards: Object.entries(boardsMap).sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ id, label: id, count })),
    cities: Object.entries(citiesMap).sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ id, label: id, count })),
    states: Object.entries(statesMap).sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ id, label: id, count })),
    portals: Object.entries(portalsMap).sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ id, label: id, count })),
    salarySlabs: DEFAULT_JOB_FACETS.salarySlabs,
    counts: {
      subjects: subjectsMap,
      designations: designationsMap,
      boards: boardsMap,
      cities: citiesMap,
      states: statesMap,
      portals: portalsMap,
    },
  };
}
