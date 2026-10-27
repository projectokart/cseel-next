import facetsJson from './job_filter_facets.json';
import { FacultyJobItem, isJobForLady } from './facultyJobsData';
import { matchesJobFuzzy, filterAndRankJobsBySearch } from '@/lib/fuzzySearch';

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
}

/**
 * Calculates multi-dimensional faceted search counts across all dimensions.
 * For each dimension (e.g. subjects), evaluates against jobs matching all OTHER active filters.
 * Ensures instant, accurate drill-down feedback when any filter is toggled.
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
  const {
    selectedDesignations,
    selectedSubjects,
    selectedBoards,
    selectedCities,
    selectedStates,
    selectedJobTypes = [],
    selectedPortals = [],
    minSalaryFilter,
    urgentOnly,
    forLadyOnly = false,
    searchQuery = '',
    searchLocation = '',
  } = filters;

  const q = searchQuery.toLowerCase().trim();
  const qLoc = searchLocation.toLowerCase().trim();

  // Helper to test if a job passes global non-faceted filters (text search, location text, salary, urgency, job type, portal)
  const passesSearchAndMeta = (j: FacultyJobItem): boolean => {
    if (urgentOnly && !j.urgent) return false;
    if (forLadyOnly && !isJobForLady(j)) return false;

    if (minSalaryFilter > 0) {
      const salVal = j.salaryMax || j.salaryMin || 0;
      if (salVal < minSalaryFilter) return false;
    }

    if (qLoc) {
      const matchLoc = `${j.city} ${j.state} ${j.address || ''}`.toLowerCase();
      if (!matchLoc.includes(qLoc)) return false;
    }

    if (selectedPortals.length > 0 && !selectedPortals.includes(j.source)) {
      return false;
    }

    if (selectedJobTypes.length > 0) {
      const rType = (j.roleType || '').toLowerCase();
      const title = (j.jobPostName || '').toLowerCase();
      const matches = selectedJobTypes.some((jt) => {
        if (jt === 'Remote') return rType.includes('remote') || title.includes('remote') || title.includes('online');
        if (jt === 'On-site') return !rType.includes('remote') && !title.includes('online');
        return rType.includes(jt.toLowerCase()) || title.includes(jt.toLowerCase());
      });
      if (!matches) return false;
    }

    return true;
  };

  // Pre-filter candidate jobs that pass meta criteria
  let baseCandidates = allJobs.filter(passesSearchAndMeta);
  if (q) {
    baseCandidates = filterAndRankJobsBySearch(baseCandidates, q);
  }

  const subCounts: Record<string, number> = {};
  const desCounts: Record<string, number> = {};
  const boardCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  const stateCounts: Record<string, number> = {};
  const portalCounts: Record<string, number> = {};
  let forLadyCount = 0;

  for (const job of baseCandidates) {
    const matchDes = selectedDesignations.length === 0 || selectedDesignations.includes(job.designation || 'Teacher');
    const matchSub = selectedSubjects.length === 0 || selectedSubjects.includes(job.subject || 'General');
    const matchBoard = selectedBoards.length === 0 || selectedBoards.includes(job.board || '');
    const matchCity = selectedCities.length === 0 || selectedCities.some((c) => (job.city || '').toLowerCase().includes(c.toLowerCase()));
    const matchState = selectedStates.length === 0 || selectedStates.some((s) => (job.state || '').toLowerCase().includes(s.toLowerCase()));

    // 1. Subject facet count: matches des, board, city, state
    if (matchDes && matchBoard && matchCity && matchState) {
      const s = job.subject || 'General';
      subCounts[s] = (subCounts[s] || 0) + 1;
    }

    // 2. Designation facet count: matches sub, board, city, state
    if (matchSub && matchBoard && matchCity && matchState) {
      const d = job.designation || 'Teacher';
      desCounts[d] = (desCounts[d] || 0) + 1;
    }

    // 3. Board facet count: matches sub, des, city, state
    if (matchSub && matchDes && matchCity && matchState) {
      if (job.board) {
        boardCounts[job.board] = (boardCounts[job.board] || 0) + 1;
      }
    }

    // 4. City facet count: matches sub, des, board, state
    if (matchSub && matchDes && matchBoard && matchState) {
      if (job.city && job.city !== 'India') {
        cityCounts[job.city] = (cityCounts[job.city] || 0) + 1;
      }
    }

    // 5. State facet count: matches sub, des, board, city
    if (matchSub && matchDes && matchBoard && matchCity) {
      if (job.state && job.state !== 'India' && job.state !== 'All India') {
        stateCounts[job.state] = (stateCounts[job.state] || 0) + 1;
      }
    }

    // 6. Portal facet count: matches sub, des, board, city, state
    if (matchSub && matchDes && matchBoard && matchCity && matchState) {
      if (job.source) {
        portalCounts[job.source] = (portalCounts[job.source] || 0) + 1;
      }
    }

    // 7. For Lady facet count: matches sub, des, board, city, state
    if (isJobForLady(job) && matchSub && matchDes && matchBoard && matchCity && matchState) {
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
