/**
 * Google-Grade Multi-Field Keyword Matching & Relevance Ranking Engine
 * 
 * Features:
 *  - Format-aware parsing: Job Title / Designation / Subject, District / City, State
 *  - Multi-token matching with Maximum Word Match prioritization
 *    (e.g., if query is "pgt physics delhi", jobs containing all 3 keywords are strictly isolated)
 *  - Field-weighted relevance scoring:
 *      * Title / Subject / Designation: 50 pts
 *      * City / District / State / Address: 40 pts
 *      * Organisation: 20 pts
 *      * Description / Board / Other: 10 pts
 *      * Verbatim whole-phrase bonus: +100 pts
 *  - Educational abbreviations & synonyms:
 *      math/maths -> mathematics, phy/physic/phisycs -> physics,
 *      chem/chemistry, bio/biology, eng/english, cs/comp -> computer,
 *      sst -> social, gurgaon -> gurugram, bangalore -> bengaluru, bombay -> mumbai
 *  - Typo tolerance via Levenshtein distance
 */

function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export const COMMON_EDU_SYNONYMS: Record<string, string> = {
  math: 'mathematics',
  maths: 'mathematics',
  phy: 'physics',
  physic: 'physics',
  phisycs: 'physics',
  chem: 'chemistry',
  chemisty: 'chemistry',
  bio: 'biology',
  eng: 'english',
  cs: 'computer',
  comp: 'computer',
  sst: 'social',
  soc: 'social',
  geo: 'geography',
  sci: 'science',
  wfh: 'home',
  remote: 'home',
  btech: 'engineering',
  lady: 'female',
  women: 'lady',
  gurgaon: 'gurugram',
  bangalore: 'bengaluru',
  bombay: 'mumbai',
  calcutta: 'kolkata',
  delhi: 'delhi',
  ncr: 'delhi ncr',
};

const STOP_WORDS = new Set([
  'in', 'at', 'for', 'of', 'and', 'the', 'a', 'an', 'to', 'with', 'from', 'by', 'on'
]);

export interface JobSearchableFields {
  jobPostName?: string | null;
  organisationName?: string | null;
  subject?: string | null;
  designation?: string | null;
  board?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  shortDescription?: string | null;
  minExperience?: string | number | null;
  salary?: string | null;
  forLady?: boolean | null;
  openingDate?: string | null;
  [key: string]: any;
}

/**
 * Tokenizes a query into meaningful keyword tokens.
 */
export function extractQueryTokens(query: string): string[] {
  if (!query) return [];
  const raw = query
    .toLowerCase()
    .trim()
    .split(/[\s,+/|;:-]+/)
    .filter(Boolean);

  const filtered = raw.filter((t) => !STOP_WORDS.has(t) && t.length > 1);
  return filtered.length > 0 ? filtered : raw;
}

/**
 * Checks if a specific text segment contains a token (via exact match, synonym, or typo tolerance).
 */
function fieldMatchesToken(fieldLower: string, token: string, syn?: string): boolean {
  if (!fieldLower) return false;
  if (fieldLower.includes(token)) return true;
  if (syn && fieldLower.includes(syn)) return true;

  // Typo tolerance for words with length >= 4
  if (token.length >= 4) {
    const maxDist = token.length >= 6 ? 2 : 1;
    const words = fieldLower.split(/[\s,.\-;/()|]+/).filter((w) => w.length > 1);
    return words.some((w) => {
      if (Math.abs(w.length - token.length) > maxDist) return false;
      return levenshteinDistance(token, w) <= maxDist;
    });
  }

  return false;
}

/**
 * Calculates match count and field-weighted relevance score for a job item.
 */
export function scoreJobMatch(job: JobSearchableFields, tokens: string[], rawQueryLower: string): {
  matchCount: number;
  score: number;
} {
  if (tokens.length === 0) return { matchCount: 0, score: 0 };

  // Group fields by priority
  const titleField = [
    job.jobPostName || '',
    job.subject || '',
    job.designation || '',
    job.forLady ? 'lady female woman women' : ''
  ].join(' ').toLowerCase();

  const locField = [
    job.city || '',
    job.district || '',
    job.state || '',
    job.address || ''
  ].join(' ').toLowerCase();

  const orgField = (job.organisationName || '').toLowerCase();

  const descField = [
    job.shortDescription || '',
    job.board || '',
    job.minExperience || '',
    job.salary || ''
  ].join(' ').toLowerCase();

  let matchCount = 0;
  let score = 0;

  for (const token of tokens) {
    const syn = COMMON_EDU_SYNONYMS[token];
    let tokenMatched = false;

    // 1. Highest Priority: Job Title / Designation / Subject
    if (fieldMatchesToken(titleField, token, syn)) {
      score += 50;
      tokenMatched = true;
    }
    // 2. High Priority: Location (City / District / State)
    else if (fieldMatchesToken(locField, token, syn)) {
      score += 40;
      tokenMatched = true;
    }
    // 3. Medium Priority: Organisation / School Name
    else if (fieldMatchesToken(orgField, token, syn)) {
      score += 20;
      tokenMatched = true;
    }
    // 4. Base Priority: Short Description / Requirements
    else if (fieldMatchesToken(descField, token, syn)) {
      score += 10;
      tokenMatched = true;
    }

    if (tokenMatched) {
      matchCount += 1;
    }
  }

  // Verbatim phrase bonus
  if (rawQueryLower && rawQueryLower.length >= 4) {
    if (titleField.includes(rawQueryLower)) score += 100;
    else if (locField.includes(rawQueryLower)) score += 80;
    else if (orgField.includes(rawQueryLower)) score += 40;
  }

  return { matchCount, score };
}

/**
 * Filters a list of jobs so that ONLY the jobs matching the MAXIMUM number of query keywords
 * are returned, and ranks them by relevance score.
 * 
 * Example:
 *  Query "pgt physics delhi" (3 keywords):
 *  - If rows exist with all 3 keywords (matchCount = 3), ONLY those rows are returned!
 *  - Rows with only 2 or 1 keywords are strictly excluded.
 */
export function filterAndRankJobsBySearch<T extends JobSearchableFields>(jobs: T[], query: string): T[] {
  if (!query || !query.trim()) return jobs;

  const rawQueryLower = query.toLowerCase().trim();
  const tokens = extractQueryTokens(query);
  if (tokens.length === 0) return jobs;

  interface ScoredItem {
    item: T;
    matchCount: number;
    score: number;
    dateMs: number;
  }

  const scoredList: ScoredItem[] = [];
  let maxMatchCount = 0;

  for (const job of jobs) {
    const { matchCount, score } = scoreJobMatch(job, tokens, rawQueryLower);
    if (matchCount > 0) {
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
      }
      const dateMs = job.openingDate ? new Date(job.openingDate).getTime() : 0;
      scoredList.push({ item: job, matchCount, score, dateMs });
    }
  }

  if (maxMatchCount === 0) {
    return [];
  }

  // Keep ONLY items matching the maximum number of query keywords
  const bestMatches = scoredList.filter((s) => s.matchCount === maxMatchCount);

  // Sort by relevance score descending, then by recency descending
  bestMatches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.dateMs - a.dateMs;
  });

  return bestMatches.map((s) => s.item);
}

/**
 * Legacy boolean matcher for compatibility.
 * Returns true if the job matches all tokens, or if tokens match the job.
 */
export function matchesJobFuzzy(job: JobSearchableFields, query: string): boolean {
  if (!query || !query.trim()) return true;
  const tokens = extractQueryTokens(query);
  if (tokens.length === 0) return true;
  const { matchCount } = scoreJobMatch(job, tokens, query.toLowerCase().trim());
  return matchCount === tokens.length;
}

/**
 * Builds unified multi-field searchable string for a job.
 */
export function getJobSearchableText(job: JobSearchableFields): string {
  const parts = [
    job.jobPostName || '',
    job.organisationName || '',
    job.subject || '',
    job.designation || '',
    job.board || '',
    job.address || '',
    job.city || '',
    job.district || '',
    job.state || '',
    job.shortDescription || '',
    job.minExperience || '',
    job.salary || '',
    job.forLady ? 'lady female woman women' : '',
  ];

  return parts.filter(Boolean).join(' ').toLowerCase();
}
