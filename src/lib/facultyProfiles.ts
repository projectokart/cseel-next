import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import { createClient } from '@supabase/supabase-js';

export interface VideoItem {
  id?: string;
  title: string;
  url: string;
  driveUrl?: string;
  category?: string;
  duration?: string;
  filename?: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface ImageItem {
  title: string;
  subtitle?: string;
  url: string;
  category?: string;
}

export interface QualificationItem {
  degree: string;
  institute: string;
  board: string;
  year: string;
  percentage: string;
  division: string;
}

export interface CertificationItem {
  name: string;
  score: string;
  regNo: string;
  year: string;
}

export interface ExperienceItem {
  role: string;
  institution: string;
  tenure: string;
  details: string;
}

export interface ResumeSectionData {
  objective?: string;
  qualifications?: QualificationItem[];
  certifications?: CertificationItem[];
  experienceList?: ExperienceItem[];
  skills?: string[];
  labHighlights?: string[];
}

export interface PrivacySettings {
  showPhone: boolean;
  showAltPhone: boolean;
  showEmail: boolean;
  showAddress: boolean;
}

export interface FacultyAddressDetails {
  state: string; // Compulsory
  district: string; // Compulsory
  pincode: string; // Compulsory (6 digits)
  blockOrCluster?: string; // Optional
  localAddress: string; // Compulsory (Village, Town, Colony, Street in district)
  googleMapLocation: string; // Compulsory (Google Maps Link or Lat,Lng)
  latitude?: number;
  longitude?: number;
  liveLatitude?: number;
  liveLongitude?: number;
  distanceKm?: number; // Distance between live device location and declared location
  isLocationVerified: boolean; // Verified if distance <= 2.0 km or verified via device GPS
  verificationStatus?: 'verified_within_2km' | 'outside_2km' | 'gps_detected' | 'unverified';
  verifiedAt?: string;
  source?: 'browser_gps' | 'pasted_maps_url' | 'manual_coordinates';
}

export interface FacultyProfile {
  id: string;
  facultyCode?: string; // Sequential alphanumeric faculty code e.g. AA001, AA002, AB9050
  userId?: string;
  name: string;
  slug: string;
  altSlug?: string;
  subject: string;
  category?: string;
  title: string;
  experience?: string;
  phone: string;
  altPhone?: string;
  email: string;
  location?: string;
  address?: string;
  addressDetails?: FacultyAddressDetails;
  isLocationVerified?: boolean;
  isVerified: boolean;
  status: 'pending_verification' | 'verified' | 'rejected';
  accessKey: string; // 20-character random alphanumeric anti-scraping key
  photoUrl: string;
  videoLink: string;
  privacy?: PrivacySettings;
  videos: VideoItem[];
  galleryImages: ImageItem[];
  resumeData?: ResumeSectionData;
  sections?: any[];
  updatedAt: string;
  createdAt?: string;
}

/**
 * Calculate the great-circle distance between two points on the Earth's surface in kilometers using the Haversine formula.
 */
export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100; // 2 decimal places
}

/**
 * Parse Google Maps URLs or raw coordinates string to extract latitude & longitude.
 */
export function parseGoogleMapsLocation(input: string): { latitude: number; longitude: number } | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // 1. Raw Coordinates e.g. "28.1432, 77.3241" or "28.1432,77.3241"
  const rawCoordsMatch = trimmed.match(/^([-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)),\s*([-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?))$/);
  if (rawCoordsMatch) {
    return {
      latitude: parseFloat(rawCoordsMatch[1]),
      longitude: parseFloat(rawCoordsMatch[5]),
    };
  }

  // 2. URL containing @lat,lng e.g. /@28.1432,77.3241,17z
  const atMatch = trimmed.match(/@([-+]?\d{1,2}\.\d+),([-+]?\d{1,3}\.\d+)/);
  if (atMatch) {
    return {
      latitude: parseFloat(atMatch[1]),
      longitude: parseFloat(atMatch[2]),
    };
  }

  // 3. URL query parameter q=lat,lng or ll=lat,lng or destination=lat,lng
  const queryMatch = trimmed.match(/[?&](?:q|ll|destination|saddr|daddr)=([-+]?\d{1,2}\.\d+),([-+]?\d{1,3}\.\d+)/i);
  if (queryMatch) {
    return {
      latitude: parseFloat(queryMatch[1]),
      longitude: parseFloat(queryMatch[2]),
    };
  }

  // 4. Fallback search for any "lat,lng" float pair in the string
  const generalPairMatch = trimmed.match(/([-+]?\d{1,2}\.\d{4,}),\s*([-+]?\d{1,3}\.\d{4,})/);
  if (generalPairMatch) {
    return {
      latitude: parseFloat(generalPairMatch[1]),
      longitude: parseFloat(generalPairMatch[2]),
    };
  }

  return null;
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'faculty_resumes.json');
const TMP_DATA_FILE = process.platform === 'win32'
  ? path.join(os.tmpdir(), 'faculty_resumes.json')
  : '/tmp/faculty_resumes.json';

declare global {
  // eslint-disable-next-line no-var
  var __facultyProfilesMemoryCache: FacultyProfile[] | undefined;
}

/**
 * Generate sequential alphanumeric faculty code starting at AA001.
 * Sequence: AA001 -> AA002 ... -> AA999 -> AB001 ... -> ZZ999.
 */
export function generateNextFacultyCode(existingProfiles: FacultyProfile[]): string {
  let highestIndex = 0;
  const regex = /^([A-Z]{2})(\d{3,4})$/i;

  for (const p of existingProfiles) {
    if (!p.facultyCode) continue;
    const match = p.facultyCode.trim().match(regex);
    if (match) {
      const letters = match[1].toUpperCase();
      const num = parseInt(match[2], 10);
      const l1 = letters.charCodeAt(0) - 65;
      const l2 = letters.charCodeAt(1) - 65;
      const idx = (l1 * 26 + l2) * 999 + num;
      if (idx > highestIndex) {
        highestIndex = idx;
      }
    }
  }

  const nextIndex = highestIndex + 1;
  const letterBlock = Math.floor((nextIndex - 1) / 999);
  const l1Code = Math.min(25, Math.floor(letterBlock / 26));
  const l2Code = letterBlock % 26;
  const numPart = ((nextIndex - 1) % 999) + 1;

  const letter1 = String.fromCharCode(65 + l1Code);
  const letter2 = String.fromCharCode(65 + l2Code);
  const numStr = numPart.toString().padStart(3, '0');

  return `${letter1}${letter2}${numStr}`;
}

/**
 * Generate a cryptographically random 20-character alphanumeric access key.
 * Used in public URLs to prevent bots and scrapers from indexing faculty profiles.
 */
export function generateAccessKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  const randomBytes = crypto.randomBytes(20);
  for (let i = 0; i < 20; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}

/**
 * Server-side Supabase client using Service Role or Anon Key
 */
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Read local faculty profiles from memory cache, /tmp, or bundled JSON fallback
 */
export function getLocalFacultyProfiles(): FacultyProfile[] {
  // 1. If in-memory cache is present and non-empty, use it directly
  if (globalThis.__facultyProfilesMemoryCache && globalThis.__facultyProfilesMemoryCache.length > 0) {
    return globalThis.__facultyProfilesMemoryCache;
  }

  // 2. Read base seed list from bundled DATA_FILE
  let baseList: any[] = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      baseList = JSON.parse(raw);
    } catch (e) {
      console.error('Error reading DATA_FILE:', e);
    }
  }

  // 3. Read dynamic profiles from TMP_DATA_FILE
  let tmpList: any[] = [];
  if (fs.existsSync(TMP_DATA_FILE)) {
    try {
      const rawTmp = fs.readFileSync(TMP_DATA_FILE, 'utf-8');
      tmpList = JSON.parse(rawTmp);
    } catch (e) {
      console.error('Error reading TMP_DATA_FILE:', e);
    }
  }

  // 4. Merge TMP profiles over base profiles
  const mergedMap = new Map<string, any>();
  baseList.forEach(item => {
    const key = item.slug || item.id;
    if (key) mergedMap.set(key, item);
  });
  tmpList.forEach(item => {
    const key = item.slug || item.id;
    if (key) mergedMap.set(key, item);
  });

  const list = Array.from(mergedMap.values());
  const processed = list.map((item: any) => {
    // Ensure accessKey exists
    if (!item.accessKey || item.accessKey.length !== 20) {
      if (item.slug === 'DevSharma' || item.id === 'dev-sharma') {
        item.accessKey = 'DevSharmaPhysics2026'; // Canonical 20-char key for Devender
      } else {
        item.accessKey = generateAccessKey();
      }
    }
    // Ensure sequential facultyCode exists
    if (!item.facultyCode) {
      if (item.slug === 'DevSharma' || item.id === 'dev-sharma') {
        item.facultyCode = 'AA001';
      } else {
        item.facultyCode = generateNextFacultyCode(list);
      }
    }
    if (!item.status) {
      item.status = item.isVerified ? 'verified' : 'pending_verification';
    }
    if (!item.addressDetails && (item.slug === 'DevSharma' || item.id === 'dev-sharma')) {
      item.addressDetails = {
        state: 'Haryana',
        district: 'Palwal',
        pincode: '121102',
        blockOrCluster: 'Palwal',
        localAddress: 'Prakash Vihar Colony',
        googleMapLocation: 'https://maps.google.com/?q=28.1432,77.3241',
        latitude: 28.1432,
        longitude: 77.3241,
        liveLatitude: 28.1432,
        liveLongitude: 77.3241,
        distanceKm: 0.0,
        isLocationVerified: true,
        verificationStatus: 'verified_within_2km',
        source: 'browser_gps'
      };
      item.isLocationVerified = true;
    }
    return item;
  });

  globalThis.__facultyProfilesMemoryCache = processed;
  return processed;
}

/**
 * Save faculty profiles to memory cache, /tmp, and local JSON store
 */
export function saveLocalFacultyProfiles(profiles: FacultyProfile[]): void {
  // Always update in-memory cache immediately
  globalThis.__facultyProfilesMemoryCache = profiles;

  // Save to TMP_DATA_FILE (always writable on serverless and local)
  try {
    const tmpDir = path.dirname(TMP_DATA_FILE);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(profiles, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not write to TMP_DATA_FILE:', e);
  }

  // Save to bundled DATA_FILE if writable (local dev)
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(profiles, null, 2), 'utf-8');
  } catch (e) {
    // Expected in Vercel serverless read-only filesystem
  }
}

/**
 * Fetch all faculty profiles with Supabase syncing
 */
export async function getAllFacultyProfiles(): Promise<FacultyProfile[]> {
  const localList = getLocalFacultyProfiles();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('faculty_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        // Map database records to FacultyProfile format
        const dbProfiles: FacultyProfile[] = data.map((row: any) => {
          const profileData = row.profile_data || {};
          const rawVideos = (Array.isArray(profileData.videos) && profileData.videos.length > 0)
            ? profileData.videos
            : (profileData.sections?.find((s: any) => s.id === 'sec-videos' || s.type === 'demo_videos')?.data?.items || []);

          const rawGallery = (Array.isArray(profileData.galleryImages) && profileData.galleryImages.length > 0)
            ? profileData.galleryImages
            : (profileData.sections?.find((s: any) => s.id === 'sec-gallery' || s.type === 'photo_gallery')?.data?.items || []);

          return {
            id: row.id,
            facultyCode: row.faculty_code || profileData.facultyCode || (row.slug === 'DevSharma' ? 'AA001' : undefined),
            userId: row.user_id,
            name: row.name,
            slug: row.slug,
            subject: row.subject || 'Physics',
            category: `best-Teacherfaculty/${(row.subject || 'physics').toLowerCase()}`,
            title: profileData.title || `${row.subject} Faculty`,
            experience: profileData.experience || '',
            phone: profileData.phone || '',
            altPhone: profileData.altPhone || '',
            email: profileData.email || '',
            location: profileData.location || profileData.address || '',
            address: profileData.address || '',
            addressDetails: profileData.addressDetails || undefined,
            isLocationVerified: profileData.isLocationVerified ?? false,
            isVerified: row.is_verified || row.status === 'verified',
            status: row.status || (row.is_verified ? 'verified' : 'pending_verification'),
            accessKey: row.access_key,
            photoUrl: profileData.photoUrl || '/images/dev-sharma.jpg',
            videoLink: profileData.videoLink || '',
            privacy: profileData.privacy || { showPhone: true, showAltPhone: true, showEmail: true, showAddress: true },
            videos: rawVideos,
            galleryImages: rawGallery,
            resumeData: profileData.resumeData || {},
            sections: profileData.sections || (profileData.resumeData?.sections) || null,
            updatedAt: row.updated_at || new Date().toISOString(),
            createdAt: row.created_at || new Date().toISOString(),
          };
        });

        // Merge local and db records, keeping local DevSharma if not in DB
        const mergedMap = new Map<string, FacultyProfile>();
        localList.forEach(p => mergedMap.set(p.slug, p));
        dbProfiles.forEach(p => {
          const existing = mergedMap.get(p.slug);
          if (existing && !p.facultyCode && existing.facultyCode) {
            p.facultyCode = existing.facultyCode;
          }
          mergedMap.set(p.slug, p);
        });

        const merged = Array.from(mergedMap.values());
        // Ensure all have a facultyCode
        merged.forEach((item, i) => {
          if (!item.facultyCode) {
            item.facultyCode = generateNextFacultyCode(merged.slice(0, i));
          }
        });

        saveLocalFacultyProfiles(merged);
        return merged;
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local JSON store:', err);
    }
  }

  return localList;
}

/**
 * Find a faculty profile by 20-character access key
 */
export async function getFacultyByAccessKey(accessKey: string): Promise<FacultyProfile | null> {
  const profiles = await getAllFacultyProfiles();
  return profiles.find(p => p.accessKey === accessKey) || null;
}

/**
 * Find a faculty profile by slug
 */
export async function getFacultyBySlug(slug: string): Promise<FacultyProfile | null> {
  const profiles = await getAllFacultyProfiles();
  return profiles.find(p => p.slug.toLowerCase() === slug.toLowerCase() || p.altSlug?.toLowerCase() === slug.toLowerCase()) || null;
}

/**
 * Find a faculty profile by sequential faculty code (e.g. AA001, AB9050)
 */
export async function getFacultyByCode(code: string): Promise<FacultyProfile | null> {
  if (!code) return null;
  const clean = code.trim().toLowerCase();
  const profiles = await getAllFacultyProfiles();
  return profiles.find(p => p.facultyCode?.toLowerCase() === clean) || null;
}

/**
 * Upsert a faculty profile to Supabase and local JSON
 */
export async function upsertFacultyProfile(profile: FacultyProfile): Promise<FacultyProfile> {
  // Ensure accessKey exists and is 20 chars
  if (!profile.accessKey || profile.accessKey.length !== 20) {
    profile.accessKey = generateAccessKey();
  }
  if (!profile.status) {
    profile.status = profile.isVerified ? 'verified' : 'pending_verification';
  }
  if (!profile.privacy) {
    profile.privacy = { showPhone: true, showAltPhone: true, showEmail: true, showAddress: true };
  }
  profile.updatedAt = new Date().toISOString();

  // Keep sections array in sync with videos & gallery
  if (Array.isArray(profile.sections)) {
    const vIdx = profile.sections.findIndex((s: any) => s.id === 'sec-videos' || s.type === 'demo_videos');
    if (vIdx >= 0) {
      profile.sections[vIdx].data = { ...profile.sections[vIdx].data, items: profile.videos || [] };
    }
    const gIdx = profile.sections.findIndex((s: any) => s.id === 'sec-gallery' || s.type === 'photo_gallery');
    if (gIdx >= 0) {
      profile.sections[gIdx].data = { ...profile.sections[gIdx].data, items: profile.galleryImages || [] };
    }
  }

  // 1. Update local JSON
  const currentList = getLocalFacultyProfiles();
  const existingIdx = currentList.findIndex(p => p.id === profile.id || p.slug === profile.slug);
  
  if (!profile.facultyCode) {
    if (existingIdx >= 0 && currentList[existingIdx].facultyCode) {
      profile.facultyCode = currentList[existingIdx].facultyCode;
    } else if (profile.slug === 'DevSharma' || profile.id === 'dev-sharma') {
      profile.facultyCode = 'AA001';
    } else {
      profile.facultyCode = generateNextFacultyCode(currentList);
    }
  }

  if (existingIdx >= 0) {
    currentList[existingIdx] = { ...currentList[existingIdx], ...profile };
  } else {
    currentList.push(profile);
  }
  saveLocalFacultyProfiles(currentList);

  // 2. Sync to Supabase if configured
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const payload: any = {
        name: profile.name,
        slug: profile.slug,
        subject: profile.subject,
        access_key: profile.accessKey,
        faculty_code: profile.facultyCode,
        status: profile.status,
        is_verified: profile.isVerified,
        user_id: (profile.userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(profile.userId)) ? profile.userId : null,
        profile_data: {
          facultyCode: profile.facultyCode,
          title: profile.title,
          experience: profile.experience,
          phone: profile.phone,
          altPhone: profile.altPhone,
          email: profile.email,
          location: profile.location,
          address: profile.address,
          addressDetails: profile.addressDetails,
          isLocationVerified: profile.isLocationVerified,
          photoUrl: profile.photoUrl,
          videoLink: profile.videoLink,
          privacy: profile.privacy,
          videos: profile.videos || [],
          galleryImages: profile.galleryImages || [],
          resumeData: profile.resumeData || {},
          sections: profile.sections || (profile as any).resumeData?.sections || null,
        },
        updated_at: new Date().toISOString(),
      };

      // Check if row already exists in Supabase by slug to avoid access_key conflict
      const { data: existingRow } = await supabase
        .from('faculty_profiles')
        .select('id, access_key, faculty_code')
        .eq('slug', profile.slug)
        .maybeSingle();

      if (existingRow) {
        if (existingRow.access_key) {
          payload.access_key = existingRow.access_key;
          profile.accessKey = existingRow.access_key;
        }
        if (existingRow.faculty_code && !payload.faculty_code) {
          payload.faculty_code = existingRow.faculty_code;
          profile.facultyCode = existingRow.faculty_code;
        }
      }

      const { data, error } = await supabase.from('faculty_profiles').upsert(payload, { onConflict: 'slug' }).select();
      if (error) {
        console.error('Supabase upsert error:', error);
      }
    } catch (e) {
      console.warn('Could not sync to Supabase table faculty_profiles:', e);
    }
  }

  return profile;
}

/**
 * Delete a faculty profile from local cache and Supabase
 */
export async function deleteFacultyProfile(slugOrId: string): Promise<boolean> {
  const currentList = getLocalFacultyProfiles();
  const filtered = currentList.filter(p => p.id !== slugOrId && p.slug !== slugOrId);
  saveLocalFacultyProfiles(filtered);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
      if (isUuid) {
        await supabase.from('faculty_profiles').delete().or(`slug.eq.${slugOrId},id.eq.${slugOrId}`);
      } else {
        await supabase.from('faculty_profiles').delete().eq('slug', slugOrId);
      }
    } catch (e) {
      console.warn('Could not delete from Supabase table faculty_profiles:', e);
    }
  }

  return true;
}

