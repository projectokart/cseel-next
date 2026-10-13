import fs from 'fs';
import path from 'path';
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

const PLACEHOLDER_SVG = '/images/default-school-placeholder.png';

// Strict deduplication helper across UDISE code and normalized school name
export function deduplicateSchools(list: SchoolRecord[]): SchoolRecord[] {
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const result: SchoolRecord[] = [];

  for (const s of list) {
    const rawId = (s.udise_code || s.school_id || s.id || '').trim().toUpperCase();
    const cleanId = rawId.replace(/[^A-Z0-9]/g, '');

    if (cleanId) {
      if (seenIds.has(cleanId)) continue;
      seenIds.add(cleanId);
      result.push(s);
    } else {
      const cleanName = (s.school_name || s.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const districtKey = (s.district_name || s.city || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const nameKey = cleanName ? `${cleanName}__${districtKey}` : '';
      if (nameKey && seenNames.has(nameKey)) continue;
      if (nameKey) seenNames.add(nameKey);
      result.push(s);
    }
  }

  return result;
}

function getLocallyRegisteredSchools(): SchoolRecord[] {
  try {
    const tokensFile = path.join(process.cwd(), 'src', 'data', 'school_ai_sync_tokens.json');
    if (!fs.existsSync(tokensFile)) return [];
    const raw = fs.readFileSync(tokensFile, 'utf8');
    const store = JSON.parse(raw);
    const tokens = store?.tokens || {};
    const localSchools: SchoolRecord[] = [];

    for (const [key, item] of Object.entries<any>(tokens)) {
      const p = item.profileData || {};
      const ident = p.schoolIdentity || {};
      const schoolName = ident.schoolName || p.schoolName || item.schoolName;
      // Preserve original alphanumeric UDISE code (e.g. 070507ND105)
      const udiseCode = (item.schoolId || p.udiseCode || key).trim().toUpperCase();

      if (
        udiseCode.length >= 6 &&
        schoolName &&
        schoolName !== 'DELHI PUBLIC SCHOOL' &&
        schoolName !== 'School Profile'
      ) {
        const contact = p.contact?.campusLocation || {};
        const name = schoolName;
        const district = contact.district || p.district || '';
        const state = contact.state || p.state || '';
        const address = contact.streetAddress || p.address || (district ? `${district}, ${state}` : '');
        const pincode = String(contact.pincode || p.pincode || '');
        const board = ident.board || p.board || '';
        const totalStudents = Number(p.totalStudents || 0);
        const totalTeachers = Number(p.totalTeachers || 0);
        const classroomsCount = Number(p.classroomsCount || 0);

        localSchools.push({
          id: udiseCode,
          school_id: udiseCode,
          school_name: name,
          name: name,
          udise_code: udiseCode,
          udiseCode: udiseCode,
          status: 'Admissions Open',
          year_desc: '2026-27',
          established_year: ident.establishedYear || p.establishedYear || '',
          state_name: state,
          state: state,
          district_name: district,
          city: district,
          block_name: contact.block || '',
          village_ward: contact.village || p.village || '',
          locality: contact.village || p.locality || '',
          pincode,
          address,
          latitude: Number(p.latitude || contact.lat || 0),
          longitude: Number(p.longitude || contact.lng || 0),
          lat: Number(p.latitude || contact.lat || 0),
          lng: Number(p.longitude || contact.lng || 0),
          rural_urban: p.ruralUrban || 'Urban',
          school_category: p.schoolCategory || p.category_desc || '',
          type: p.schoolCategory || p.category_desc || '',
          management_type: p.managementType || p.management || 'Government',
          management_desc_state: p.management || 'Government',
          management: p.management || 'Government',
          class_from: String(p.classFrom || 1),
          class_to: String(p.classTo || 12),
          classes: p.classes || (p.classFrom && p.classTo ? `${p.classFrom}th to ${p.classTo}th` : ''),
          school_type: p.genderType || 'Co-educational',
          gender: p.genderType || 'Co-ed',
          board_secondary_10th: board,
          board_higher_secondary_12th: board,
          board: board,
          medium_of_instruction_1: p.medium || 'English',
          medium: p.medium || 'English',
          annual_fee: p.annualFee || 0,
          annual_fee_formatted: p.annualFee ? `₹${p.annualFee}/yr` : 'Government / Free',
          residential_school: p.isResidential ? 'Residential' : 'Day School',
          total_students: totalStudents,
          total_teachers: totalTeachers,
          total_classrooms: classroomsCount,
          working_smart_boards: p.smartBoards || 0,
          tinkering_lab_atl: p.hasAtl ? 'Yes' : 'No',
          ict_lab: p.hasIct ? 'Yes' : 'No',
          integrated_science_lab: p.hasScienceLab ? 'Yes' : 'No',
          library: 'Yes',
          playground_available: 'Yes',
          rating: p.rating || 0,
          reviews_count: p.reviewsCount || 0,
          image: p.image || PLACEHOLDER_SVG,
          image_url: p.image || PLACEHOLDER_SVG,
        } as any);
      }
    }
    return localSchools;
  } catch {
    return [];
  }
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
    searchQuery: seoQuery.searchQuery,
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
    const limit = Math.min(seoQuery.limit || 25, 25);
    const offset = (page - 1) * limit;

    // Helper to construct query
    const buildQuery = (strict: boolean, relaxLocation: boolean) => {
      let q = schoolSearchSupabase
        .from('udise_private_schools')
        .select('*', { count: 'exact' });

      // Free text search query across school name, locality, block, district, state, address, and UDISE code
      if (seoQuery.searchQuery) {
        const rawSq = seoQuery.searchQuery.trim();
        const lowerSq = rawSq.toLowerCase();
        let sq = rawSq;
        if (lowerSq === 'delhi ncr' || lowerSq === 'new delhi' || lowerSq === 'ncr') {
          sq = 'Delhi';
        } else if (lowerSq === 'east delhi') {
          sq = 'East';
        }
        q = q.or(`school_name.ilike.%${sq}%,village_ward.ilike.%${sq}%,village_name.ilike.%${sq}%,block_name.ilike.%${sq}%,district_name.ilike.%${sq}%,state_name.ilike.%${sq}%,address.ilike.%${sq}%,udise_code.ilike.%${sq}%`);
      }

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
      } else if (seoQuery.sortBy === 'name' || seoQuery.sortBy === 'name_asc') {
        q = q.order('school_name', { ascending: true });
      } else if (seoQuery.sortBy === 'name_desc') {
        q = q.order('school_name', { ascending: false });
      } else if (seoQuery.sortBy === 'popularity_asc') {
        q = q.order('rating', { ascending: true, nullsFirst: false }).order('total_students', { ascending: true, nullsFirst: false });
      } else if (seoQuery.sortBy === 'popularity_desc') {
        q = q.order('rating', { ascending: false, nullsFirst: false }).order('total_students', { ascending: false, nullsFirst: false });
      } else if (seoQuery.sortBy === 'students_asc') {
        q = q.order('total_students', { ascending: true, nullsFirst: false });
      } else {
        q = q.order('total_students', { ascending: false, nullsFirst: false });
      }

      return q;
    };

    // Locally registered schools (instant & verified from sync tokens)
    const allLocalSchools = getLocallyRegisteredSchools();
    const matchingLocals = allLocalSchools.filter((ls) => {
      if (seoQuery.state && !ls.state_name?.toLowerCase().includes(seoQuery.state.toLowerCase())) return false;
      if (seoQuery.district && !ls.district_name?.toLowerCase().includes(seoQuery.district.toLowerCase())) return false;
      if (seoQuery.board && !ls.board?.toLowerCase().includes(seoQuery.board.toLowerCase())) return false;
      return true;
    });

    const runWithTimeout = async <T>(promise: Promise<T>, timeoutMs = 1000): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Supabase query timeout')), timeoutMs))
      ]);
    };

    // 1. Primary strict query with timeout guard
    let dbQuery = buildQuery(true, false).range(offset, offset + limit - 1);
    let { data: rows, count, error }: any = await runWithTimeout(dbQuery as any);

    if (error) {
      console.error('Supabase Schools query error:', error);
      throw error;
    }

    let isFallback = false;
    let fallbackNotice: string | undefined = undefined;

    // 2. Smart Fallback if 0 results found (Progressive Relaxation)
    // Only relax if the filter matched 0 total schools across the entire DB (not when page > totalPages)
    if ((count === 0 || count === null) && (!rows || rows.length === 0)) {
      isFallback = true;
      // Step 2a: Relax niche filters within the same district/state
      let fallbackQuery = buildQuery(false, false).range(0, limit - 1);
      let fbRes: any = await runWithTimeout(fallbackQuery as any).catch(() => ({ data: [], count: 0 }));
      
      // Step 2b: If still 0, relax to state level or top popular nationwide
      if (!fbRes.data || fbRes.data.length === 0) {
        let broaderQuery = buildQuery(false, true).range(0, limit - 1);
        let broaderRes: any = await runWithTimeout(broaderQuery as any).catch(() => ({ data: [], count: 0 }));
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

    // When DB has no records, fallback to local schools if any exist
    if (schools.length === 0 && matchingLocals.length > 0) {
      const pagedLocals = matchingLocals.slice(offset, offset + limit);
      schools = deduplicateSchools(pagedLocals);
      totalCount = matchingLocals.length;
      fallbackNotice = '';
      isFallback = false;
    } else {
      schools = deduplicateSchools(schools);
      if (schools.length > limit) {
        schools = schools.slice(0, limit);
      }
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
    const allLocalSchools = getLocallyRegisteredSchools();
    const matchingLocals = allLocalSchools.filter((ls) => {
      if (seoQuery.state && !ls.state_name?.toLowerCase().includes(seoQuery.state.toLowerCase())) return false;
      if (seoQuery.district && !ls.district_name?.toLowerCase().includes(seoQuery.district.toLowerCase())) return false;
      if (seoQuery.board && !ls.board?.toLowerCase().includes(seoQuery.board.toLowerCase())) return false;
      return true;
    });

    const sumStudents = matchingLocals.reduce((sum, s) => sum + (s.total_students || 0), 0);
    const sumTeachers = matchingLocals.reduce((sum, s) => sum + (s.total_teachers || 0), 0);

    return {
      query: seoQuery,
      totalCount: matchingLocals.length,
      schools: matchingLocals,
      stats: {
        totalSchools: matchingLocals.length,
        totalStudents: sumStudents,
        totalTeachers: sumTeachers,
        avgRatio: sumTeachers > 0 ? `${Math.round(sumStudents / sumTeachers)}:1` : '20:1',
        privateCount: matchingLocals.length,
        govtCount: 0,
        atlCount: matchingLocals.length,
        ictCount: matchingLocals.length
      },
      subLocations: [],
      faqs: [],
      currentPage: 1,
      totalPages: 1,
      limit: 25,
      isFallback: false
    };
  }
}
