import uniqueLocations from '@/data/unique_locations.json';

export interface LocationItem {
  city: string;
  district: string;
  state: string;
  totalSchools: number;
  popularLocalities: string[];
}

export interface StateItem {
  state: string;
  totalSchools: number;
  cities: { city: string; totalSchools: number }[];
}

export interface SearchSuggestion {
  id: string;
  type: 'city' | 'state' | 'school' | 'board' | 'locality';
  title: string;
  subtitle: string;
  count?: number;
  state?: string;
  city?: string;
  district?: string;
  board?: string;
  schoolId?: string;
}

const LOCATION_ALIASES: Record<string, string> = {
  gurgaon: 'Gurugram',
  gurugram: 'Gurugram',
  bangalore: 'Bengaluru',
  banglore: 'Bengaluru',
  bengaluru: 'Bengaluru',
  delhi: 'Delhi',
  dehli: 'Delhi',
  dilli: 'Delhi',
  calcutta: 'Kolkata',
  kolkata: 'Kolkata',
  madras: 'Chennai',
  chennai: 'Chennai',
  baroda: 'Vadodara',
  vadodara: 'Vadodara',
  vizag: 'Visakhapatnam',
  visakhapatnam: 'Visakhapatnam',
  bombay: 'Maharashtra',
  mumbai: 'Maharashtra',
  faridaabad: 'Faridabad',
  faridabad: 'Faridabad',
  sonipatt: 'Sonipat',
  sonipat: 'Sonipat',
  ncr: 'Delhi NCR',
  up: 'Uttar Pradesh',
  mp: 'Madhya Pradesh',
  uk: 'Uttarakhand',
  tn: 'Tamil Nadu',
  ka: 'Karnataka',
  ts: 'Telangana',
  mh: 'Maharashtra',
  rj: 'Rajasthan',
  hr: 'Haryana',
  pb: 'Punjab',
  wb: 'West Bengal',
  gj: 'Gujarat'
};

export function levenshteinDistance(s1: string, s2: string): number {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export function getFuzzyScore(query: string, target: string): number {
  if (!query || !target) return 0;
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  if (t === q) return 100;
  if (t.startsWith(q)) return 95;
  if (t.includes(q)) return 85;

  // Check alias
  const alias = LOCATION_ALIASES[q];
  if (alias && t.includes(alias.toLowerCase())) {
    return 90;
  }

  // Token fuzzy distance
  const qTokens = q.split(/[\s,.-]+/);
  const tTokens = t.split(/[\s,.-]+/);

  for (const qt of qTokens) {
    if (qt.length < 3) continue;
    for (const tt of tTokens) {
      if (tt.length < 3) continue;
      const maxLen = Math.max(qt.length, tt.length);
      const dist = levenshteinDistance(qt, tt);
      const sim = (maxLen - dist) / maxLen;
      if (sim >= 0.65) {
        return Math.round(sim * 80);
      }
    }
  }

  return 0;
}

export function getSearchSuggestions(
  query: string,
  schools: any[] = []
): SearchSuggestion[] {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();
  const suggestions: SearchSuggestion[] = [];

  // 1. Check Cities & Districts
  uniqueLocations.cities.forEach((c) => {
    const score = Math.max(
      getFuzzyScore(q, c.city),
      getFuzzyScore(q, c.district),
      getFuzzyScore(q, `${c.city}, ${c.state}`)
    );
    if (score >= 50) {
      suggestions.push({
        id: `city-${c.city}`,
        type: 'city',
        title: `${c.city} (District / City)`,
        subtitle: `${c.state} • ${c.totalSchools.toLocaleString()} Schools`,
        count: c.totalSchools,
        city: c.city,
        district: c.district,
        state: c.state
      });
    }
  });

  // 2. Check States
  uniqueLocations.states.forEach((s) => {
    const score = getFuzzyScore(q, s.state);
    if (score >= 50) {
      suggestions.push({
        id: `state-${s.state}`,
        type: 'state',
        title: `${s.state} (State)`,
        subtitle: `${s.cities.length} Major Cities • ${s.totalSchools.toLocaleString()} Schools`,
        count: s.totalSchools,
        state: s.state
      });
    }
  });

  // 3. Check Boards
  const boardsList = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge / IGCSE'];
  boardsList.forEach((b) => {
    if (b.toLowerCase().includes(q) || q.includes(b.toLowerCase())) {
      suggestions.push({
        id: `board-${b}`,
        type: 'board',
        title: `${b} Affiliation`,
        subtitle: 'Filter by school board authority',
        board: b
      });
    }
  });

  // 4. Check Schools (limit to top 6 relevant matches)
  const matchedSchools: { school: any; score: number }[] = [];
  for (const s of schools) {
    const score = Math.max(
      getFuzzyScore(q, s.name),
      getFuzzyScore(q, s.shortName || ''),
      getFuzzyScore(q, s.locality || ''),
      getFuzzyScore(q, s.udiseCode || '')
    );
    if (score >= 60) {
      matchedSchools.push({ school: s, score });
    }
    if (matchedSchools.length >= 25) break;
  }

  matchedSchools
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .forEach(({ school }) => {
      suggestions.push({
        id: `school-${school.id}`,
        type: 'school',
        title: school.name,
        subtitle: `${school.locality ? school.locality + ', ' : ''}${school.city}, ${school.state} • ${school.board || 'CBSE'}`,
        city: school.city,
        state: school.state,
        board: school.board,
        schoolId: school.id
      });
    });

  return suggestions.slice(0, 10);
}

export function matchesClassLevel(classesOffered: string = '', level: string): boolean {
  if (!level || level === 'All') return true;
  const str = classesOffered.toLowerCase();

  switch (level) {
    case 'Pre-Primary':
      return /play|nursery|lkg|ukg|kg|pre-school|pre-primary|pre-nursery|kindergarten/.test(str);
    case 'Primary':
      return /class 1|class 2|class 3|class 4|class 5|1st|2nd|3rd|4th|5th|primary|nursery - class 12|nursery - class 5|nursery - class 8/.test(str);
    case 'Middle':
      return /class 6|class 7|class 8|6th|7th|8th|middle|nursery - class 12|nursery - class 8|class 1 - 8/.test(str);
    case 'Secondary':
      return /class 9|class 10|9th|10th|secondary|matric|nursery - class 12|class 1 - 10|class 6 - 10/.test(str);
    case 'Senior Secondary':
      return /class 11|class 12|11th|12th|senior secondary|higher secondary|10\+2|high school|nursery - class 12|class 6 - 12|class 9 - 12/.test(str);
    case 'K-12':
      return /nursery - class 12|play group - class 12|lkg - class 12|pre-nursery - class 12|k-12|complete/.test(str);
    default:
      return true;
  }
}
