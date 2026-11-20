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

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

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

export function getLocallyRegisteredSchools(): SchoolRecord[] {
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
        const board = ident.board || p.board || 'CBSE';
        const totalStudents = Number(p.totalStudents || 0) || 850;
        const totalTeachers = Number(p.totalTeachers || 0) || 45;
        const classroomsCount = Number(p.classroomsCount || 0) || 30;

        localSchools.push({
          id: udiseCode,
          school_id: udiseCode,
          school_name: name,
          name: name,
          udise_code: udiseCode,
          udiseCode: udiseCode,
          status: 'Admissions Open',
          year_desc: '2026-27',
          established_year: ident.establishedYear || p.establishedYear || '1995',
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
          school_category: p.schoolCategory || p.category_desc || 'Senior Secondary',
          type: p.schoolCategory || p.category_desc || 'Senior Secondary',
          management_type: p.managementType || p.management || 'Private',
          management_desc_state: p.management || 'Private',
          management: p.management || 'Private',
          class_from: String(p.classFrom || 1),
          class_to: String(p.classTo || 12),
          classes: p.classes || (p.classFrom && p.classTo ? `${p.classFrom}th to ${p.classTo}th` : '1st to 12th'),
          school_type: p.genderType || 'Co-educational',
          gender: p.genderType || 'Co-ed',
          board_secondary_10th: board,
          board_higher_secondary_12th: board,
          board: board,
          medium_of_instruction_1: p.medium || 'English',
          medium: p.medium || 'English',
          annual_fee: p.annualFee || 45000,
          annual_fee_formatted: p.annualFee ? `₹${p.annualFee}/yr` : '₹45k/yr',
          residential_school: p.isResidential ? 'Residential' : 'Day School',
          total_students: totalStudents,
          total_teachers: totalTeachers,
          total_classrooms: classroomsCount,
          working_smart_boards: p.smartBoards || 12,
          tinkering_lab_atl: p.hasAtl ? 'Yes' : 'No',
          ict_lab: p.hasIct ? 'Yes' : 'No',
          integrated_science_lab: p.hasScienceLab ? 'Yes' : 'No',
          library: 'Yes',
          playground_available: 'Yes',
          rating: p.rating || 4.6,
          reviews_count: p.reviewsCount || 15,
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

let CACHED_ALL_SCHOOLS: SchoolRecord[] | null = null;

export function getAllSchoolsFromDatabase(): SchoolRecord[] {
  if (CACHED_ALL_SCHOOLS && CACHED_ALL_SCHOOLS.length > 0) {
    return CACHED_ALL_SCHOOLS;
  }

  try {
    const dbPath = path.join(process.cwd(), 'src', 'data', 'schools_database.json');
    if (!fs.existsSync(dbPath)) {
      return getLocallyRegisteredSchools();
    }
    const rawData = fs.readFileSync(dbPath, 'utf8');
    const cleanRawData = rawData.replace(/^\uFEFF/, '');
    const rawSchools: any[] = JSON.parse(cleanRawData);

    // Get locally claimed schools
    const localClaimed = getLocallyRegisteredSchools();
    const claimedUdiseMap = new Map<string, SchoolRecord>();
    for (const ls of localClaimed) {
      if (ls.udise_code) claimedUdiseMap.set(ls.udise_code.toUpperCase(), ls);
    }

    const records: SchoolRecord[] = [];

    for (let i = 0; i < rawSchools.length; i++) {
      const s = rawSchools[i];
      const udise = (s.udise_code || s.affiliation_number || `school-${i}`).trim().toUpperCase();

      if (claimedUdiseMap.has(udise)) {
        records.push(claimedUdiseMap.get(udise)!);
        claimedUdiseMap.delete(udise);
        continue;
      }

      const name = (s.school_name || s.name || 'CBSE School').trim();
      const state = (s.state_name || '').trim();
      const district = (s.district_name || '').trim();
      const address = s.address || (district ? `${district}, ${state}` : state);
      const pincode = String(s.pincode || '');

      let img = s.image_url || s.image || '';
      if (img.startsWith('=IMAGE("') && img.endsWith('")')) {
        img = img.slice(8, -2);
      } else if (img.startsWith('=IMAGE(') && img.endsWith(')')) {
        img = img.slice(7, -1).replace(/^["']|["']$/g, '');
      }
      if (!img || img.includes('default-campus') || img.includes('unsplash.com')) {
        img = PLACEHOLDER_SVG;
      }

      const seed = Math.abs(hashCode(udise || name));
      const mgmt = s.management_desc || 'Private';
      const isGovt = /kendriya|navodaya|government|govt|pm shri/i.test(mgmt) || /kendriya|navodaya|pm shri/i.test(name);
      const totalStudents = Number(s.total_students) || (550 + (seed % 1450));
      const totalTeachers = Number(s.total_teachers) || Math.max(Math.round(totalStudents / 25), 18);
      const classrooms = Math.round(totalStudents / 35);
      const fee = isGovt ? 0 : 35000 + ((seed % 14) * 5000);
      const feeFormatted = isGovt ? 'Government / Free' : `₹${Math.round(fee / 1000)}k/yr`;

      records.push({
        id: udise,
        school_id: udise,
        school_name: name,
        raw_school_name: name,
        name: name,
        udise_code: udise,
        udiseCode: udise,
        status: s.admissions_open !== false ? 'Admissions Open' : 'Verified',
        year_desc: '2026-27',
        established_year: s.established_year || (1988 + (seed % 34)),
        state_name: state,
        state: state,
        district_name: district,
        city: district,
        block_name: s.block_name || district,
        village_ward: s.village_ward || s.locality || address,
        locality: s.locality || district,
        pincode,
        address,
        latitude: Number(s.latitude || 0),
        longitude: Number(s.longitude || 0),
        lat: Number(s.latitude || 0),
        lng: Number(s.longitude || 0),
        rural_urban: 'Urban',
        school_category: s.school_category || 'Senior Secondary Level',
        type: s.school_category || 'Senior Secondary',
        management_type: isGovt ? 'Government' : 'Private',
        management_desc_state: mgmt,
        management: isGovt ? 'Government' : 'Private',
        class_from: '1',
        class_to: '12',
        classes: '1st to 12th',
        school_type: (s.gender_type || 'Co-educational') as any,
        gender: (s.gender_type || 'Co-ed') as any,
        board_secondary_10th: s.board_10th || 'CBSE',
        board_higher_secondary_12th: s.board_12th || 'CBSE',
        board: s.board_10th || s.board_12th || 'CBSE',
        medium_of_instruction_1: s.primary_medium || 'English',
        medium: s.primary_medium || 'English',
        annual_fee: fee,
        annual_fee_formatted: feeFormatted,
        residential_school: (seed % 10 === 0) ? 'Residential' : 'Day School',
        headmaster_principal_name: s.principal_name || '',
        principalName: s.principal_name || '',
        phone: s.phone || '',
        email: s.email || '',
        website: s.website || '',
        total_students: totalStudents,
        total_teachers: totalTeachers,
        total_classrooms: classrooms,
        working_smart_boards: 8 + (seed % 20),
        tinkering_lab_atl: (seed % 4 === 0) ? 'Yes' : 'No',
        ict_lab: (seed % 2 === 0) ? 'Yes' : 'No',
        integrated_science_lab: 'Yes',
        library: 'Yes',
        playground_available: 'Yes',
        rating: Number(s.rating || (4.2 + ((seed % 8) * 0.1))),
        reviews_count: 5 + (seed % 40),
        image: img,
        image_url: img,
      } as any);
    }

    for (const [_, claimed] of claimedUdiseMap) {
      records.unshift(claimed);
    }

    CACHED_ALL_SCHOOLS = records;
    return records;
  } catch (err) {
    console.error('Error loading schools database:', err);
    return getLocallyRegisteredSchools();
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
const CACHE_TTL_MS = 10000; // 10 seconds cache

function querySchoolsInMemory(
  allSchools: SchoolRecord[],
  seoQuery: SchoolSeoQuery,
  page: number,
  limit: number
): SchoolsDirectoryResult {
  let filtered = allSchools;

  // 1. Text Search
  if (seoQuery.searchQuery) {
    let sq = seoQuery.searchQuery.trim().toLowerCase();
    if (sq === 'delhi ncr' || sq === 'new delhi' || sq === 'ncr') {
      sq = 'delhi';
    }
    filtered = filtered.filter((s) => {
      return (
        (s.school_name && s.school_name.toLowerCase().includes(sq)) ||
        (s.name && s.name.toLowerCase().includes(sq)) ||
        (s.district_name && s.district_name.toLowerCase().includes(sq)) ||
        (s.state_name && s.state_name.toLowerCase().includes(sq)) ||
        (s.address && s.address.toLowerCase().includes(sq)) ||
        (s.pincode && s.pincode.includes(sq)) ||
        (s.udise_code && s.udise_code.toLowerCase().includes(sq)) ||
        (s.headmaster_principal_name && s.headmaster_principal_name.toLowerCase().includes(sq))
      );
    });
  }

  // 2. State Filter
  if (seoQuery.state) {
    const st = seoQuery.state.toLowerCase();
    filtered = filtered.filter((s) => s.state_name && s.state_name.toLowerCase().includes(st));
  }

  // 3. District Filter
  if (seoQuery.district) {
    const dist = seoQuery.district.toLowerCase();
    filtered = filtered.filter((s) => s.district_name && s.district_name.toLowerCase().includes(dist));
  }

  // 4. Block Filter
  if (seoQuery.block) {
    const blk = seoQuery.block.toLowerCase();
    filtered = filtered.filter((s) => s.block_name && s.block_name.toLowerCase().includes(blk));
  }

  // 5. Pincode Filter
  if (seoQuery.pincode) {
    filtered = filtered.filter((s) => s.pincode && s.pincode.startsWith(seoQuery.pincode!));
  }

  // 6. Board Filter
  if (seoQuery.board) {
    const bd = seoQuery.board.toLowerCase();
    filtered = filtered.filter((s) => (s.board && s.board.toLowerCase().includes(bd)) || (s.board_secondary_10th && s.board_secondary_10th.toLowerCase().includes(bd)));
  }

  // 7. Management Filter
  if (seoQuery.management) {
    const mgmt = seoQuery.management.toLowerCase();
    filtered = filtered.filter((s) => (s.management && s.management.toLowerCase().includes(mgmt)) || (s.management_desc_state && s.management_desc_state.toLowerCase().includes(mgmt)));
  }

  // 8. Gender Filter
  if (seoQuery.gender) {
    const g = seoQuery.gender.toLowerCase();
    filtered = filtered.filter((s) => (s.school_type && s.school_type.toLowerCase().includes(g)) || (s.gender && s.gender.toLowerCase().includes(g)));
  }

  // 9. Residential Filter
  if (seoQuery.residential) {
    const res = seoQuery.residential.toLowerCase();
    if (res === 'boarding') {
      filtered = filtered.filter((s) => s.residential_school && s.residential_school.toLowerCase().includes('residential'));
    } else if (res === 'day') {
      filtered = filtered.filter((s) => s.residential_school && s.residential_school.toLowerCase().includes('day'));
    }
  }

  // 10. Medium Filter
  if (seoQuery.medium) {
    const med = seoQuery.medium.toLowerCase();
    filtered = filtered.filter((s) => (s.medium && s.medium.toLowerCase().includes(med)) || (s.medium_of_instruction_1 && s.medium_of_instruction_1.toLowerCase().includes(med)));
  }

  // 11. Facility Filter
  if (seoQuery.facility) {
    const fac = seoQuery.facility.toLowerCase();
    if (fac.includes('atal') || fac.includes('atl')) {
      filtered = filtered.filter((s) => s.tinkering_lab_atl === 'Yes' || s.tinkering_lab_atl === true);
    } else if (fac.includes('computer') || fac.includes('ict')) {
      filtered = filtered.filter((s) => s.ict_lab === 'Yes' || s.ict_lab === true);
    } else if (fac.includes('smart')) {
      filtered = filtered.filter((s) => Number(s.digital_boards_working || (s as any).working_smart_boards || 0) > 0);
    }
  }

  // 12. Sorting
  if (seoQuery.sortBy === 'teachers') {
    filtered.sort((a, b) => (b.total_teachers || 0) - (a.total_teachers || 0));
  } else if (seoQuery.sortBy === 'name' || seoQuery.sortBy === 'name_asc') {
    filtered.sort((a, b) => (a.school_name || '').localeCompare(b.school_name || ''));
  } else if (seoQuery.sortBy === 'name_desc') {
    filtered.sort((a, b) => (b.school_name || '').localeCompare(a.school_name || ''));
  } else if (seoQuery.sortBy === 'popularity_asc' || seoQuery.sortBy === 'students_asc') {
    filtered.sort((a, b) => (a.total_students || 0) - (b.total_students || 0));
  } else if (seoQuery.sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // Default: Sort by total students descending
    filtered.sort((a, b) => (b.total_students || 0) - (a.total_students || 0));
  }

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const offset = (page - 1) * limit;
  const schools = deduplicateSchools(filtered.slice(offset, offset + limit));

  // Compute Stats
  let sumStudents = 0;
  let sumTeachers = 0;
  let atlCount = 0;
  let ictCount = 0;
  let govtCount = 0;
  let privateCount = 0;

  for (const s of filtered) {
    sumStudents += s.total_students || 0;
    sumTeachers += s.total_teachers || 0;
    if (s.tinkering_lab_atl === 'Yes' || s.tinkering_lab_atl === true) atlCount++;
    if (s.ict_lab === 'Yes' || s.ict_lab === true) ictCount++;
    if (s.management === 'Government' || s.management_type === 'Government') govtCount++;
    else privateCount++;
  }

  const avgRatioNum = sumTeachers > 0 ? Math.round(sumStudents / sumTeachers) : 22;

  const stats: SchoolsDirectoryStats = {
    totalSchools: totalCount,
    totalStudents: sumStudents,
    totalTeachers: sumTeachers,
    avgRatio: `${avgRatioNum}:1`,
    privateCount,
    govtCount,
    atlCount,
    ictCount,
  };

  // SubLocations breakdown
  const subLocations: { name: string; slug: string; count: number; type: string }[] = [];

  if (!seoQuery.state) {
    // State counts across entire database
    const stateMap = new Map<string, number>();
    for (const s of allSchools) {
      if (s.state_name) {
        stateMap.set(s.state_name, (stateMap.get(s.state_name) || 0) + 1);
      }
    }
    const sortedStates = Array.from(stateMap.entries()).sort((a, b) => b[1] - a[1]);
    for (const [stName, cnt] of sortedStates.slice(0, 36)) {
      subLocations.push({
        name: stName,
        slug: stName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        count: cnt,
        type: 'state',
      });
    }
  } else if (seoQuery.state && !seoQuery.district) {
    // District counts within this state
    const districtMap = new Map<string, number>();
    for (const s of filtered) {
      if (s.district_name) {
        districtMap.set(s.district_name, (districtMap.get(s.district_name) || 0) + 1);
      }
    }
    const sortedDistricts = Array.from(districtMap.entries()).sort((a, b) => b[1] - a[1]);
    for (const [distName, cnt] of sortedDistricts.slice(0, 24)) {
      subLocations.push({
        name: distName,
        slug: `${seoQuery.state.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${distName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        count: cnt,
        type: 'district',
      });
    }
  }

  // Realized FAQs
  const faqs = (seoQuery.faqs || []).map((faq) => ({
    question: faq.question,
    answer: faq.answerTemplate
      .replace('{totalCount}', totalCount.toLocaleString())
      .replace('{avgRatio}', stats.avgRatio),
  }));

  return {
    query: seoQuery,
    totalCount,
    schools,
    stats,
    subLocations,
    faqs,
    currentPage: page,
    totalPages,
    limit,
    isFallback: false,
  };
}

export async function fetchVerifiedClaimedSchools(seoQuery?: SchoolSeoQuery): Promise<SchoolRecord[]> {
  try {
    const runWithTimeout = async <T>(promise: Promise<T>, timeoutMs = 3500): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Claims timeout')), timeoutMs)),
      ]);
    };

    // 1. Fetch approved claims from Supabase
    const { data: claims }: any = await runWithTimeout(
      schoolSearchSupabase.from('school_claims').select('*').eq('status', 'approved') as any
    );

    const approvedClaims: any[] = claims && claims.length > 0 ? claims : [];
    const claimUdises = approvedClaims.map((c: any) => String(c.udise_code || '').trim()).filter(Boolean);

    // 2. Fetch UDISE details for approved claims
    const udiseMap = new Map<string, any>();
    if (claimUdises.length > 0) {
      try {
        const { data: udiseRows }: any = await runWithTimeout(
          schoolSearchSupabase.from('udise_private_schools').select('*').in('udise_code', claimUdises) as any
        );
        (udiseRows || []).forEach((r: any) => udiseMap.set(String(r.udise_code).trim(), r));
      } catch {}
    }

    // 3. Tokens fallback / enrichment
    let tokens: Record<string, any> = {};
    try {
      const tokensFile = path.join(process.cwd(), 'src', 'data', 'school_ai_sync_tokens.json');
      if (fs.existsSync(tokensFile)) {
        tokens = JSON.parse(fs.readFileSync(tokensFile, 'utf8'))?.tokens || {};
      }
    } catch {}

    const records: SchoolRecord[] = [];

    // Map approved claims
    for (const claim of approvedClaims) {
      const udise = String(claim.udise_code || '').trim();
      const tokenData = tokens[`sync_${udise}`] || {};
      const p = tokenData.profileData || {};
      const uRow = udiseMap.get(udise) || {};

      const schoolName = claim.school_name || p.schoolName || uRow.school_name || 'Verified School';
      const state = uRow.state_name || p.state || claim.state || 'Delhi';
      const district = uRow.district_name || p.district || claim.district || 'West Delhi';
      const block = uRow.block_name || p.blockName || 'Janakpuri';
      const address = uRow.address || p.address || `${district}, ${state}`;
      const pincode = String(uRow.pincode || p.pincode || '110058');
      const lat = Number(uRow.latitude || p.latitude || p.lat || 28.6219);
      const lng = Number(uRow.longitude || p.longitude || p.lng || 77.0878);
      const board = uRow.board_10th || p.board || 'CBSE';
      const rating = Number(uRow.rating || p.rating || 4.9);
      const totalStudents = Number(uRow.total_students || p.totalStudents || 1200);
      const totalTeachers = Number(uRow.total_teachers || p.totalTeachers || 65);

      records.push({
        id: udise,
        school_id: udise,
        school_name: schoolName,
        raw_school_name: schoolName,
        name: schoolName,
        udise_code: udise,
        udiseCode: udise,
        status: 'Admissions Open',
        year_desc: '2026-27',
        established_year: uRow.established_year || p.establishedYear || '2005',
        state_name: state,
        state: state,
        district_name: district,
        city: district,
        block_name: block,
        village_ward: uRow.village_name || p.village || '',
        locality: uRow.cluster_name || p.locality || district,
        pincode,
        address,
        latitude: lat,
        longitude: lng,
        lat,
        lng,
        rural_urban: 'Urban',
        school_category: uRow.school_category || p.schoolCategory || 'Senior Secondary',
        type: uRow.school_category || p.schoolCategory || 'Senior Secondary',
        management_type: 'Private Unaided',
        management_desc_state: 'Private Unaided (Recognized)',
        gender: 'Co-ed',
        board_secondary_10th: board,
        board_higher_secondary_12th: board,
        board: board,
        medium_of_instruction_1: 'English',
        medium: 'English',
        annual_fee: 45000,
        annual_fee_formatted: '₹45k/yr',
        residential_school: 'Day School',
        headmaster_principal_name: claim.claimant_name || p.principalName || 'Principal',
        principalName: claim.claimant_name || p.principalName || 'Principal',
        phone: claim.whatsapp_number || p.phone || '+91 98765 43210',
        email: claim.claimant_email || p.email || 'contact@cseel.org',
        website: uRow.website || p.website || 'https://www.cseel.org',
        total_students: totalStudents,
        total_teachers: totalTeachers,
        total_classrooms: 35,
        working_smart_boards: 24,
        tinkering_lab_atl: 'Yes',
        ict_lab: 'Yes',
        integrated_science_lab: 'Yes',
        library: 'Yes',
        playground_available: 'Yes',
        rating,
        reviews_count: 15,
        image: '/images/default-school-placeholder.png',
        image_url: '/images/default-school-placeholder.png',
        is_verified: true,
        isClaimed: true,
      } as any);
    }

    if (records.length > 0) return deduplicateSchools(records);
  } catch (err) {
    console.warn('Failed to load claims from Supabase, falling back to local tokens:', err);
  }

  // Fallback to locally registered schools (sync tokens)
  return getLocallyRegisteredSchools();
}

export async function fetchSchoolsForDirectory(seoQuery: SchoolSeoQuery): Promise<SchoolsDirectoryResult> {
  const cacheKey = JSON.stringify({
    rawSlug: seoQuery.rawSlug,
    state: seoQuery.state,
    district: seoQuery.district,
    searchQuery: seoQuery.searchQuery,
    sortBy: seoQuery.sortBy,
    page: seoQuery.page,
    limit: seoQuery.limit,
  });

  const cached = SCHOOLS_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const page = Math.max(seoQuery.page || 1, 1);
  const limit = Math.min(seoQuery.limit || 50, 100);

  // Authoritative Verified Schools Directory (ONLY Confirmed & Claimed Schools)
  const verifiedSchools = await fetchVerifiedClaimedSchools(seoQuery);

  // In-memory query across verified schools
  const memoryResult = querySchoolsInMemory(verifiedSchools, seoQuery, page, limit);

  SCHOOLS_CACHE.set(cacheKey, { data: memoryResult, timestamp: Date.now() });
  return memoryResult;
}
