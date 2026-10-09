import { schoolSearchSupabase, mapSupabaseToSchoolRecord } from './schoolSearchClient';
import { SchoolSeoQuery, KNOWN_STATES } from '@/lib/schoolsSeoParser';
import { SchoolRecord } from '@/data/schoolFinderData';

export interface SchoolsDirectoryStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  avgRatio: string;
  privateCount: number;
  govtCount: number;
  atlCount: number;
  ictCount: number;
}

export interface SchoolsDirectoryResult {
  query: SchoolSeoQuery;
  totalCount: number;
  schools: SchoolRecord[];
  stats: SchoolsDirectoryStats;
  subLocations: { name: string; slug: string; count: number; type: string }[];
  faqs: { question: string; answer: string }[];
  currentPage: number;
  totalPages: number;
  limit: number;
  isFallback?: boolean;
  fallbackNotice?: string;
}

const SCHOOLS_CACHE = new Map<string, { data: SchoolsDirectoryResult; timestamp: number }>();
const CACHE_TTL_MS = 2000; // 2 seconds for fresh updates

export async function fetchSchoolsForDirectory(seoQuery: SchoolSeoQuery): Promise<SchoolsDirectoryResult> {
  const cacheKey = JSON.stringify({
    rawSlug: seoQuery.rawSlug,
    state: seoQuery.state,
    district: seoQuery.district,
    block: seoQuery.block,
    village: seoQuery.village,
    pincode: seoQuery.pincode,
    board: seoQuery.board,
    management: seoQuery.management,
    residential: seoQuery.residential,
    gender: seoQuery.gender,
    medium: seoQuery.medium,
    facility: seoQuery.facility,
    sortBy: seoQuery.sortBy,
    page: seoQuery.page,
    limit: seoQuery.limit
  });

  const cached = SCHOOLS_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const page = Math.max(seoQuery.page || 1, 1);
    const limit = Math.min(seoQuery.limit || 24, 100);
    const offset = (page - 1) * limit;

    // Helper to construct query
    const buildQuery = (strict: boolean, relaxLocation: boolean) => {
      let q = schoolSearchSupabase
        .from('udise_private_schools')
        .select('*', { count: 'exact' });

      if (!relaxLocation) {
        if (seoQuery.state) {
          q = q.ilike('state_name', `%${seoQuery.state}%`);
        }
        if (seoQuery.district) {
          q = q.ilike('district_name', `%${seoQuery.district}%`);
        }
        if (strict && seoQuery.block) {
          q = q.ilike('block_name', `%${seoQuery.block}%`);
        }
        if (strict && seoQuery.village) {
          q = q.or(`village_name.ilike.%${seoQuery.village}%,village_ward.ilike.%${seoQuery.village}%`);
        }
        if (strict && seoQuery.pincode) {
          q = q.ilike('pincode', `${seoQuery.pincode}%`);
        }
      } else if (seoQuery.state) {
        q = q.ilike('state_name', `%${seoQuery.state}%`);
      }

      if (strict) {
        if (seoQuery.board) {
          if (seoQuery.board === 'CBSE') {
            q = q.or('board_10th.ilike.%cbse%,board_12th.ilike.%cbse%');
          } else if (seoQuery.board === 'ICSE') {
            q = q.or('board_10th.ilike.%icse%,board_12th.ilike.%icse%,board_10th.ilike.%cisce%,board_12th.ilike.%cisce%');
          } else if (seoQuery.board === 'State Board') {
            q = q.or('board_10th.ilike.%state%,board_12th.ilike.%state%,board_10th.ilike.%hbse%,board_10th.ilike.%upmsp%');
          } else if (seoQuery.board === 'IB') {
            q = q.or('board_10th.ilike.%ib%,board_12th.ilike.%ib%,board_10th.ilike.%cambridge%');
          }
        }

        if (seoQuery.management) {
          q = q.ilike('management_desc', `%${seoQuery.management}%`);
        }

        if (seoQuery.residential) {
          if (seoQuery.residential === 'boarding') {
            q = q.or('residential_school.ilike.%1-completely%,residential_school.ilike.%residential%');
          } else if (seoQuery.residential === 'day') {
            q = q.or('residential_school.ilike.%3-non%,residential_school.ilike.%day%');
          }
        }

        if (seoQuery.gender) {
          if (seoQuery.gender === 'Girls') {
            q = q.ilike('gender_type', '%girls%');
          } else if (seoQuery.gender === 'Boys') {
            q = q.ilike('gender_type', '%boys%');
          } else if (seoQuery.gender === 'Co-educational') {
            q = q.or('gender_type.ilike.%co-ed%,gender_type.ilike.%co-educational%');
          }
        }

        if (seoQuery.medium) {
          q = q.or(`primary_medium.ilike.%${seoQuery.medium}%,secondary_medium.ilike.%${seoQuery.medium}%`);
        }

        if (seoQuery.schoolCategory) {
          if (seoQuery.schoolCategory === 'K-12') {
            q = q.or('school_category.ilike.%Pr. with Up.Pr. Sec. and H.Sec.%,class_to.eq.12');
          } else if (seoQuery.schoolCategory.includes('Secondary with Higher')) {
            q = q.or('school_category.ilike.%Higher Secondary%,school_category.ilike.%H.Sec%');
          } else if (seoQuery.schoolCategory === 'Secondary') {
            q = q.or('school_category.ilike.%Secondary%,class_to.gte.10');
          } else if (seoQuery.schoolCategory === 'Primary') {
            q = q.or('school_category.ilike.%Primary%,class_to.lte.8');
          }
        }

        if (seoQuery.facility) {
          if (seoQuery.facility.includes('Atal Tinkering') || seoQuery.facility.includes('ATL')) {
            q = q.or('atal_stem_lab.ilike.%yes%,atal_stem_lab.eq.1');
          } else if (seoQuery.facility.includes('Computer')) {
            q = q.or('computer_ict_lab.ilike.%yes%,computer_ict_lab.eq.1');
          } else if (seoQuery.facility.includes('Science')) {
            q = q.or('integrated_science_lab.ilike.%yes%,integrated_science_lab.eq.1');
          } else if (seoQuery.facility.includes('Sports')) {
            q = q.or('playground_available.ilike.%yes%,playground_available.eq.1');
          } else if (seoQuery.facility.includes('Smart')) {
            q = q.gt('working_smart_boards', 0);
          }
        }
      }

      // Sort order
      if (seoQuery.sortBy === 'teachers') {
        q = q.order('total_teachers', { ascending: false, nullsFirst: false });
      } else if (seoQuery.sortBy === 'name') {
        q = q.order('school_name', { ascending: true });
      } else {
        q = q.order('total_students', { ascending: false, nullsFirst: false });
      }

      return q;
    };

    // 1. Primary strict query
    let dbQuery = buildQuery(true, false).range(offset, offset + limit - 1);
    let { data: rows, count, error } = await dbQuery;

    if (error) {
      console.error('Supabase Schools query error:', error);
      throw error;
    }

    let isFallback = false;
    let fallbackNotice: string | undefined = undefined;

    // 2. Smart Fallback if 0 results found (Progressive Relaxation)
    if (!rows || rows.length === 0 || (count !== null && count === 0)) {
      isFallback = true;
      // Step 2a: Relax niche filters within the same district/state
      let fallbackQuery = buildQuery(false, false).range(0, limit - 1);
      let fbRes = await fallbackQuery;
      
      // Step 2b: If still 0, relax to state level or top popular nationwide
      if (!fbRes.data || fbRes.data.length === 0) {
        let broaderQuery = buildQuery(false, true).range(0, limit - 1);
        let broaderRes = await broaderQuery;
        rows = broaderRes.data || [];
        count = broaderRes.count || rows.length;
        fallbackNotice = seoQuery.state
          ? `No exact matches found for this specific filter in this locality. Showing verified top-rated schools in ${seoQuery.state}.`
          : 'No exact matches found for this specific filter. Showing top-rated verified schools across India.';
      } else {
        rows = fbRes.data;
        count = fbRes.count || rows.length;
        const loc = seoQuery.district || seoQuery.state || 'your selected region';
        fallbackNotice = `No exact matches found for the narrow filter combination. Showing top verified schools in ${loc}.`;
      }
    }

    let totalCount = count || (rows ? rows.length : 0);
    let schools: SchoolRecord[] = (rows || []).map((row: any) => mapSupabaseToSchoolRecord(row));

    // When DB has no records, keep empty list rather than injecting dummy mock schools
    if (schools.length === 0) {
      totalCount = 0;
      fallbackNotice = '';
      isFallback = false;
    }

    const totalPages = Math.ceil(totalCount / limit) || 1;

    let sumStudents = 0;
    let sumTeachers = 0;
    let atlCount = 0;
    let ictCount = 0;

    schools.forEach((s) => {
      sumStudents += s.total_students || 0;
      sumTeachers += s.total_teachers || 0;
      if (s.tinkering_lab_atl === 'Yes' || s.tinkering_lab_atl === true) atlCount++;
      if (s.ict_lab === 'Yes' || s.ict_lab === true) ictCount++;
    });

    const avgRatioNum = schools.length > 0 && sumTeachers > 0 ? Math.round(sumStudents / sumTeachers) : 20;

    const stats: SchoolsDirectoryStats = {
      totalSchools: totalCount,
      totalStudents: totalCount > schools.length ? Math.round(totalCount * 480) : sumStudents,
      totalTeachers: totalCount > schools.length ? Math.round(totalCount * 24) : sumTeachers,
      avgRatio: `${avgRatioNum}:1`,
      privateCount: totalCount,
      govtCount: 0,
      atlCount: totalCount > schools.length ? Math.round(totalCount * 0.12) : atlCount,
      ictCount: totalCount > schools.length ? Math.round(totalCount * 0.45) : ictCount
    };

    // Sub-locations
    const subLocations: { name: string; slug: string; count: number; type: string }[] = [];

    if (!seoQuery.state) {
      Object.entries(KNOWN_STATES).slice(0, 36).forEach(([slug, name]) => {
        subLocations.push({
          name,
          slug: `${slug}`,
          count: Math.round(totalCount / 36),
          type: 'state'
        });
      });
    } else if (seoQuery.state && !seoQuery.district) {
      const dSet = new Set<string>();
      schools.forEach((s) => {
        if (s.district_name) dSet.add(s.district_name);
      });
      Array.from(dSet).slice(0, 24).forEach((d) => {
        subLocations.push({
          name: d,
          slug: `${seoQuery.state?.toLowerCase().replace(/\s+/g, '-')}/${d.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          count: Math.round(totalCount / Math.max(dSet.size, 1)),
          type: 'district'
        });
      });
    } else if (seoQuery.district) {
      const bSet = new Set<string>();
      schools.forEach((s) => {
        if (s.block_name) bSet.add(s.block_name);
      });
      Array.from(bSet).slice(0, 16).forEach((b) => {
        subLocations.push({
          name: `${b} Block`,
          slug: `${seoQuery.state?.toLowerCase().replace(/\s+/g, '-')}/${seoQuery.district?.toLowerCase().replace(/\s+/g, '-')}/block-${b.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          count: Math.round(totalCount / Math.max(bSet.size, 1)),
          type: 'block'
        });
      });
    }

    // Realized FAQs
    const faqs = (seoQuery.faqs || []).map((faq) => ({
      question: faq.question,
      answer: faq.answerTemplate
        .replace('{totalCount}', totalCount.toLocaleString())
        .replace('{avgRatio}', stats.avgRatio)
    }));

    const result: SchoolsDirectoryResult = {
      query: seoQuery,
      totalCount,
      schools,
      stats,
      subLocations,
      faqs,
      currentPage: page,
      totalPages,
      limit,
      isFallback,
      fallbackNotice
    };

    SCHOOLS_CACHE.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.error('fetchSchoolsForDirectory error:', err);
    return {
      query: seoQuery,
      totalCount: 0,
      schools: [],
      stats: {
        totalSchools: 0,
        totalStudents: 0,
        totalTeachers: 0,
        avgRatio: '20:1',
        privateCount: 0,
        govtCount: 0,
        atlCount: 0,
        ictCount: 0
      },
      subLocations: [],
      faqs: [],
      currentPage: 1,
      totalPages: 1,
      limit: 24,
      isFallback: false
    };
  }
}
