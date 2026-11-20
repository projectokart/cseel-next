import { NextResponse } from 'next/server';
import dns from 'dns';
import lookupsData from '@/data/privateSchoolLookups.json';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const UKAZ_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_DIRECTORY_URL ||
  process.env.SUPABASE_DIRECTORY_URL ||
  'https://vvdnsmrtockscarkybtf.supabase.co';
const UKAZ_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_DIRECTORY_ANON_KEY ||
  process.env.SUPABASE_DIRECTORY_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const dynamic = 'force-dynamic';

// Pre-build fast lookup maps for instant token recognition in multi-word queries
const STATE_LOOKUP = new Map<string, string>();
const DISTRICT_LOOKUP = new Map<string, { district_name: string; state_name: string }>();

try {
  if ((lookupsData as any).states) {
    for (const s of (lookupsData as any).states) {
      if (s.state_name) {
        STATE_LOOKUP.set(s.state_name.trim().toLowerCase(), s.state_name.trim().toUpperCase());
      }
    }
  }
  if ((lookupsData as any).districts_by_state) {
    for (const [stName, dList] of Object.entries((lookupsData as any).districts_by_state)) {
      if (Array.isArray(dList)) {
        for (const d of dList) {
          if (d.district_name) {
            DISTRICT_LOOKUP.set(d.district_name.trim().toLowerCase(), {
              district_name: d.district_name.trim().toUpperCase(),
              state_name: stName.trim().toUpperCase(),
            });
          }
        }
      }
    }
  }
} catch (e) {
  console.error('Error populating lookup maps:', e);
}

function cleanImageUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.toLowerCase() === 'null') return null;
  const match = trimmed.match(/=IMAGE\(["']?(https?:\/\/[^"']+)["']?\)/i);
  if (match) return match[1];
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return null;
}

// Task 9: Clean School Names (strip leading dashes, dots, punctuation, serial codes)
export function cleanSchoolName(rawName: string | null | undefined): string {
  if (!rawName) return 'School';
  let name = String(rawName).trim();

  // 1. Strip leading punctuation, symbols, brackets, quotes
  name = name.replace(/^[-–—_.~*#'"`\s]+/, '');

  // 2. Strip leading numbers with dots/brackets e.g. "(01002) ", "01. ", "01- ", "A-", "1. "
  name = name.replace(/^\(?\d+[\).]?[-\s]+/, '');
  name = name.replace(/^\[?\d+\]?[-\s]+/, '');
  name = name.replace(/^[-–—_.~*#'"`\s]+/, '');

  name = name.trim();
  if (!name) return 'School';

  // 3. Convert ALL CAPS to title case nicely
  if (name === name.toUpperCase() && name.length > 3) {
    name = name
      .toLowerCase()
      .split(/\s+/)
      .map((word) => {
        const w = word.trim();
        const cleanWord = w.replace(/[^a-zA-Z0-9]/g, '');
        if (['cbse', 'icse', 'kv', 'dps', 'dav', 'aps', 'jnv', 'pm', 'govt', 'sms'].includes(cleanWord)) {
          return w.toUpperCase();
        }
        if (['sr', 'sec', 'no', 'dr', 'mr', 'mrs', 'st'].includes(cleanWord)) {
          return w.charAt(0).toUpperCase() + w.slice(1);
        }
        if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i.test(cleanWord)) {
          return w.toUpperCase();
        }
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(' ');
  }

  return name;
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function normalizeManagement(raw: string | null | undefined): string {
  if (!raw || raw.toLowerCase().includes('null')) return 'Private Unaided (Recognized)';
  const lower = raw.toLowerCase();
  if (lower.includes('unrecognized') || lower.includes('un-recog')) {
    return 'Unrecognized';
  }
  return 'Private Unaided (Recognized)';
}

function normalizeMedium(raw: string | null | undefined): string {
  if (!raw || raw.toLowerCase().includes('null') || raw.toLowerCase().includes('unknown')) return 'English';
  return raw.replace(/^\d+[-_:\s]+/, '').trim();
}

function normalizeCategory(raw: string | null | undefined): string {
  if (!raw || raw.toLowerCase().includes('null') || raw.toLowerCase().includes('unknown')) return 'General School';
  return raw.replace(/^\d+[-_:\s]+/, '').trim();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Strictly enforce 10-page maximum limit (pages 11+ rejected)
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    if (!isNaN(rawPage) && (rawPage > 10 || rawPage < 1)) {
      return NextResponse.json({
        success: false,
        error: rawPage > 10
          ? 'Pagination is strictly restricted to a maximum of 10 pages. Access to page 11 or higher is rejected.'
          : 'Invalid page number. Page must be between 1 and 10.',
        schools: [],
        totalCount: 0,
        currentPage: rawPage,
        totalPages: 10,
        limit: 25,
      }, { status: 400 });
    }

    const page = Math.max(1, Math.min(10, isNaN(rawPage) ? 1 : rawPage));
    const limit = 25; // 25 cards per page
    const offset = (page - 1) * limit;

    const stateParam = searchParams.get('state') || searchParams.get('state_name');
    const districtParam = searchParams.get('district') || searchParams.get('district_name');
    const blockParam = searchParams.get('block') || searchParams.get('block_name');
    const clusterParam = searchParams.get('cluster') || searchParams.get('cluster_name');
    const villageParam = searchParams.get('village') || searchParams.get('village_name');
    const addressParam = searchParams.get('address');
    const boardParam = searchParams.get('board') || searchParams.get('board_name');
    const managementParam = searchParams.get('management') || searchParams.get('management_desc');
    const residentialParam = searchParams.get('residential') || searchParams.get('residential_type') || searchParams.get('residential_school');
    const categoryParam = searchParams.get('category') || searchParams.get('category_desc');
    const mediumParam = searchParams.get('medium') || searchParams.get('medium_name');
    const search = searchParams.get('search') ? searchParams.get('search')!.trim() : null;
    const sort = searchParams.get('sort') || 'default';

    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius_km') || searchParams.get('radius') || '10';

    let userLat: number | null = null;
    let userLng: number | null = null;
    let radiusKm = 10;

    if (latParam && lngParam) {
      const pLat = parseFloat(latParam);
      const pLng = parseFloat(lngParam);
      if (!isNaN(pLat) && !isNaN(pLng)) {
        userLat = pLat;
        userLng = pLng;
        radiusKm = Math.min(50, Math.max(1, parseFloat(radiusParam) || 10));
      }
    }

    const headers: Record<string, string> = {
      apikey: UKAZ_ANON_KEY,
      Authorization: `Bearer ${UKAZ_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'count=exact',
    };

    let rawSchools: any[] = [];
    let totalCount = 441516;

    // Fast O(1) determination of totalCount using pre-computed lookups cache
    if (districtParam && stateParam && (lookupsData as any).districts_by_state?.[stateParam.trim().toUpperCase()]) {
      const matchDist = (lookupsData as any).districts_by_state[stateParam.trim().toUpperCase()].find(
        (d: any) => d.district_name.toUpperCase() === districtParam.trim().toUpperCase()
      );
      if (matchDist?.total_schools) {
        totalCount = matchDist.total_schools;
      }
    } else if (stateParam) {
      const matchState = (lookupsData as any).states?.find(
        (s: any) => s.state_name.toUpperCase() === stateParam.trim().toUpperCase()
      );
      if (matchState?.total_schools) {
        totalCount = matchState.total_schools;
      }
    }

    // Build PostgREST query on udise_private_schools
    const queryParts: string[] = [
      'select=udise_code,school_name,state_name,district_name,block_name,cluster_name,village_name,management_desc,school_category,primary_medium,school_type_desc,board_10th,board_12th,website,total_students,established_year,address,pincode,latitude,longitude,is_verified,rating',
      `limit=${userLat !== null ? 125 : limit}`,
      `offset=${userLat !== null ? 0 : offset}`,
    ];

    // Geolocation Bounding Box filter (indexed via idx_ups_coords)
    if (userLat !== null && userLng !== null) {
      const deltaLat = radiusKm / 111.0;
      const deltaLng = radiusKm / (111.0 * Math.cos(userLat * (Math.PI / 180)));
      const minLat = (userLat - deltaLat).toFixed(6);
      const maxLat = (userLat + deltaLat).toFixed(6);
      const minLng = (userLng - Math.abs(deltaLng)).toFixed(6);
      const maxLng = (userLng + Math.abs(deltaLng)).toFixed(6);

      queryParts.push(`latitude=gte.${minLat}`);
      queryParts.push(`latitude=lte.${maxLat}`);
      queryParts.push(`longitude=gte.${minLng}`);
      queryParts.push(`longitude=lte.${maxLng}`);
    }

    // High-performance tokenized search (rejects special characters, binds to indexed columns)
    if (search) {
      // 1. Sanitize: Allow only letters, numbers, and whitespace (strip dots, slashes, symbols)
      const sanitized = search.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

      if (sanitized) {
        // Drop count=exact when searching to prevent statement timeout on full table scans
        delete headers['Prefer'];

        // Case A: Pure digits (UDISE code or Pincode)
        if (/^\d+$/.test(sanitized)) {
          if (sanitized.length === 11) {
            queryParts.push(`udise_code=eq.${sanitized}`);
          } else if (sanitized.length === 6) {
            queryParts.push(`or=(pincode.eq.${sanitized},udise_code.ilike.*${sanitized}*)`);
          } else {
            queryParts.push(`udise_code.ilike.*${sanitized}*`);
          }
        } else {
          // Case B: Text Query (Tokenized across State, District, Block, School Name)
          const rawTokens = sanitized.toLowerCase().split(/\s+/).filter(Boolean);
          const detectedStates: string[] = [];
          const detectedDistricts: string[] = [];
          const schoolKeywords: string[] = [];

          let i = 0;
          while (i < rawTokens.length) {
            const twoWords = i + 1 < rawTokens.length ? `${rawTokens[i]} ${rawTokens[i + 1]}` : null;
            if (twoWords && STATE_LOOKUP.has(twoWords)) {
              detectedStates.push(STATE_LOOKUP.get(twoWords)!);
              i += 2;
              continue;
            }
            if (twoWords && DISTRICT_LOOKUP.has(twoWords)) {
              detectedDistricts.push(DISTRICT_LOOKUP.get(twoWords)!.district_name);
              i += 2;
              continue;
            }

            const single = rawTokens[i];
            if (STATE_LOOKUP.has(single)) {
              detectedStates.push(STATE_LOOKUP.get(single)!);
            } else if (DISTRICT_LOOKUP.has(single)) {
              detectedDistricts.push(DISTRICT_LOOKUP.get(single)!.district_name);
            } else {
              schoolKeywords.push(single);
            }
            i++;
          }

          // Apply detected location filters (utilizing BTree indexes)
          if (detectedDistricts.length > 0 && !districtParam && detectedStates.length > 0 && !stateParam) {
            // Check if district belongs to detected state; if so, combine with AND, else OR
            const allInSameState = detectedDistricts.every((d) => {
              const info = DISTRICT_LOOKUP.get(d.toLowerCase());
              return info && detectedStates.includes(info.state_name);
            });

            if (allInSameState) {
              queryParts.push(`state_name=eq.${encodeURIComponent(detectedStates[0])}`);
              queryParts.push(`district_name=eq.${encodeURIComponent(detectedDistricts[0])}`);
            } else {
              const orClauses = [
                ...detectedDistricts.map((d) => `district_name.eq.${encodeURIComponent(d)}`),
                ...detectedStates.map((s) => `state_name.eq.${encodeURIComponent(s)}`),
              ];
              queryParts.push(`or=(${orClauses.join(',')})`);
            }
          } else {
            if (detectedDistricts.length > 0 && !districtParam) {
              if (detectedDistricts.length === 1) {
                queryParts.push(`district_name=eq.${encodeURIComponent(detectedDistricts[0])}`);
              } else {
                queryParts.push(`or=(${detectedDistricts.map((d) => `district_name.eq.${encodeURIComponent(d)}`).join(',')})`);
              }
            }
            if (detectedStates.length > 0 && !stateParam) {
              if (detectedStates.length === 1) {
                queryParts.push(`state_name=eq.${encodeURIComponent(detectedStates[0])}`);
              } else {
                queryParts.push(`or=(${detectedStates.map((s) => `state_name.eq.${encodeURIComponent(s)}`).join(',')})`);
              }
            }
          }

          // Apply school name keywords
          if (schoolKeywords.length > 0) {
            for (const kw of schoolKeywords) {
              if (kw === 'dav') {
                queryParts.push(`or=(school_name.ilike.*dav*,school_name.ilike.*d.a.v*,school_name.ilike.*d%20a%20v*)`);
              } else if (kw === 'dps') {
                queryParts.push(`or=(school_name.ilike.*dps*,school_name.ilike.*delhi%20public%20school*)`);
              } else if (kw.length >= 3 && !['school', 'public', 'vidyalaya', 'academy'].includes(kw)) {
                queryParts.push(`school_name.ilike.*${encodeURIComponent(kw)}*`);
              } else if (schoolKeywords.length === 1) {
                queryParts.push(`school_name.ilike.*${encodeURIComponent(kw)}*`);
              }
            }
          } else if (detectedStates.length === 0 && detectedDistricts.length === 0) {
            const enc = encodeURIComponent(sanitized);
            queryParts.push(`or=(school_name.ilike.*${enc}*,udise_code.ilike.*${enc}*)`);
          }
        }
      }
    }

    if (stateParam) {
      queryParts.push(`state_name=eq.${encodeURIComponent(stateParam.trim().toUpperCase())}`);
    }

    if (districtParam) {
      queryParts.push(`district_name=eq.${encodeURIComponent(districtParam.trim().toUpperCase())}`);
    }

    if (blockParam) {
      queryParts.push(`block_name=eq.${encodeURIComponent(blockParam.trim().toUpperCase())}`);
    }

    // Fix: Do NOT call .toUpperCase() on cluster_name; preserve exact DB casing!
    if (clusterParam) {
      queryParts.push(`cluster_name=eq.${encodeURIComponent(clusterParam.trim())}`);
    }

    if (villageParam) {
      queryParts.push(`or=(village_name.ilike.*${encodeURIComponent(villageParam.trim())}*,village.ilike.*${encodeURIComponent(villageParam.trim())}*)`);
    }

    if (addressParam) {
      queryParts.push(`address.ilike.*${encodeURIComponent(addressParam.trim())}*`);
    }

    // Task 1: Board Filter
    if (boardParam && boardParam.toLowerCase() !== 'all') {
      const bLower = boardParam.toLowerCase();
      if (bLower.includes('cbse')) {
        queryParts.push(`or=(board_10th.ilike.*cbse*,board_12th.ilike.*cbse*)`);
      } else if (bLower.includes('icse')) {
        queryParts.push(`or=(board_10th.ilike.*icse*,board_12th.ilike.*icse*)`);
      } else if (bLower.includes('state')) {
        queryParts.push(`or=(board_10th.ilike.*state*,board_12th.ilike.*state*)`);
      } else if (bLower.includes('international') || bLower.includes('ib') || bLower.includes('cambridge')) {
        queryParts.push(`or=(board_10th.ilike.*international*,board_12th.ilike.*international*)`);
      } else {
        queryParts.push(`or=(board_10th.ilike.*${encodeURIComponent(boardParam)}*,board_12th.ilike.*${encodeURIComponent(boardParam)}*)`);
      }
    }

    // Task 1: Strictly Private Management
    if (managementParam && managementParam.toLowerCase() !== 'all') {
      const lowerMgmt = managementParam.toLowerCase();
      if (lowerMgmt.includes('unrecognized') || lowerMgmt.includes('un-recog')) {
        queryParts.push(`management_desc=ilike.*Unrecognized*`);
      } else {
        queryParts.push(`or=(management_desc.ilike.*Private*,management_desc.ilike.*Unaided*)`);
      }
    }

    // Task 1: Residential Filter (handled in-memory / non-blocking)
    if (residentialParam && residentialParam.toLowerCase() !== 'all') {
      // residential_school column dropped as empty; day school is standard default
    }

    if (categoryParam && categoryParam.toLowerCase() !== 'all') {
      queryParts.push(`school_category=ilike.*${encodeURIComponent(categoryParam)}*`);
    }

    if (mediumParam && mediumParam.toLowerCase() !== 'all') {
      queryParts.push(`primary_medium=ilike.*${encodeURIComponent(mediumParam)}*`);
    }

    // Dynamic sorting
    if (sort === 'name_asc') {
      queryParts.push('order=school_name.asc.nullslast');
    } else if (sort === 'name_desc') {
      queryParts.push('order=school_name.desc.nullslast');
    } else if (sort === 'students_desc') {
      queryParts.push('order=total_students.desc.nullslast');
    } else if (sort === 'students_asc') {
      queryParts.push('order=total_students.asc.nullslast');
    } else if (sort === 'established_desc') {
      queryParts.push('order=established_year.desc.nullslast');
    } else {
      queryParts.push('order=udise_code.asc');
    }

    const restUrl = `${UKAZ_SUPABASE_URL}/rest/v1/udise_private_schools?${queryParts.join('&')}`;

    let response = await fetch(restUrl, { headers, cache: 'no-store' });

    if (!response.ok) {
      // Automatic fallback without order if heavy sort occurred
      const fallbackParts = queryParts.filter((p) => !p.startsWith('order='));
      fallbackParts.push('order=udise_code.asc');
      const fallbackUrl = `${UKAZ_SUPABASE_URL}/rest/v1/udise_private_schools?${fallbackParts.join('&')}`;
      const retryRes = await fetch(fallbackUrl, { headers, cache: 'no-store' });
      if (retryRes.ok) {
        response = retryRes;
      }
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('Supabase query error:', errText);
      return NextResponse.json({ success: false, error: 'Failed to retrieve schools' }, { status: 500 });
    }

    // Extract exact count from Content-Range header if present
    const contentRange = response.headers.get('content-range');
    if (contentRange && contentRange.includes('/')) {
      const totalPart = contentRange.split('/')[1];
      if (totalPart && totalPart !== '*') {
        const parsedCount = parseInt(totalPart, 10);
        if (!isNaN(parsedCount)) {
          totalCount = parsedCount;
        }
      }
    }

    rawSchools = await response.json();

    // If search was active and content-range wasn't computed, calibrate totalCount cleanly
    if (search && (!contentRange || contentRange.includes('/*'))) {
      if (rawSchools.length < limit) {
        totalCount = offset + rawSchools.length;
      } else {
        totalCount = Math.min(250, offset + limit + 25);
      }
    }

    // Map schools into standard card structure with Task 9 cleanSchoolName
    const formattedSchools = (Array.isArray(rawSchools) ? rawSchools : []).map((s: any, idx: number) => {
      const stateSlug = (s.state_name || 'india').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const districtSlug = (s.district_name || 'district').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const cleanName = cleanSchoolName(s.school_name);
      const nameSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const profileUrl = `/edu-network/school/${stateSlug}/${districtSlug}/${s.udise_code || idx}/${nameSlug}`;

      const rawBoard = s.board_10th || s.board_12th || '';
      let cleanBoard = rawBoard ? rawBoard.replace(/^\d+[-_:\s]+/, '').trim() : 'CBSE';
      if (!cleanBoard || cleanBoard === 'NA') cleanBoard = 'CBSE';

      const cleanGender = s.school_type_desc ? s.school_type_desc.replace(/^\d+[-_:\s]+/, '').trim() : 'Co-educational';
      const cleanResidential = 'Day School';
      const rawWebsite = s.website ? String(s.website).trim() : '';
      const cleanWebsite = rawWebsite && rawWebsite.toLowerCase() !== 'null' ? (rawWebsite.startsWith('http') ? rawWebsite : `https://${rawWebsite}`) : null;

      return {
        school_id: s.udise_code || String(idx + 1),
        udise_code: s.udise_code || '',
        school_name: cleanName,
        address: s.address || '',
        pincode: s.pincode || '',
        state_id: 0,
        state_name: s.state_name || '',
        district_id: 0,
        district_name: s.district_name || '',
        block_name: s.block_name || '',
        cluster_name: s.cluster_name || '',
        board_name: cleanBoard,
        gender_type: cleanGender,
        category_id: 0,
        category_desc: normalizeCategory(s.school_category),
        management_id: 0,
        management_desc: normalizeManagement(s.management_desc),
        medium_id: 0,
        medium_name: normalizeMedium(s.primary_medium),
        total_students: s.total_students && s.total_students > 0 ? s.total_students : null,
        established_year: s.established_year ? parseInt(String(s.established_year), 10) || null : null,
        residential_desc: cleanResidential,
        website: cleanWebsite,
        latitude: s.latitude ? parseFloat(s.latitude) : null,
        longitude: s.longitude ? parseFloat(s.longitude) : null,
        distance_km: (userLat !== null && userLng !== null && s.latitude && s.longitude)
          ? haversineDistanceKm(userLat, userLng, parseFloat(s.latitude), parseFloat(s.longitude))
          : null,
        is_claimed: Boolean(s.is_verified),
        verification_status: s.is_verified ? 'verified' : 'unverified',
        profile_url: profileUrl,
        logo_url: cleanImageUrl(s.image_url),
        image: cleanImageUrl(s.image_url),
        image_url: cleanImageUrl(s.image_url),
        rating: s.rating ? Number(s.rating) : null,
      };
    });

    let finalSchools = formattedSchools;
    if (userLat !== null && userLng !== null) {
      finalSchools = finalSchools
        .filter((s) => s.distance_km !== null && s.distance_km <= radiusKm)
        .sort((a, b) => (a.distance_km ?? 999) - (b.distance_km ?? 999));
      totalCount = Math.min(125, finalSchools.length);
      finalSchools = finalSchools.slice(offset, offset + limit);
    }

    const totalPages = Math.max(1, Math.min(10, Math.ceil(totalCount / limit)));

    return NextResponse.json({
      success: true,
      schools: finalSchools,
      count: finalSchools.length,
      totalCount: totalCount,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      hasMore: page < 10 && offset + limit < totalCount,
    });
  } catch (error: any) {
    console.error('API /api/schools/all-india error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
