/**
 * Google Maps Geocoding API Service
 * ════════════════════════════════════════════════════════════════════════════
 * Resolves exact coordinates (lat, lng) for schools and job vacancies using
 * the official Google Maps Geocoding API.
 * 
 * Features:
 * - High-precision real-world coordinates directly from Google Maps
 * - Persistent disk caching (src/data/school_geo_cache.json) to eliminate
 *   duplicate API calls and optimize Google Cloud quota/billing
 * - Safe fallback to city/state centroid if API key is pending
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';
import geoData from '@/data/india_geo_centroids.json';

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  '';

const CACHE_FILE = path.join(process.cwd(), 'src', 'data', 'school_geo_cache.json');
let memoryCache: Record<string, { lat: number; lng: number; formattedAddress?: string; address?: string; timestamp: string }> = {};

// Load persistent disk cache
try {
  if (fs.existsSync(CACHE_FILE)) {
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    memoryCache = JSON.parse(raw);
  }
} catch {
  memoryCache = {};
}

function normalizeKey(str?: string | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface GeocodeInput {
  schoolName?: string;
  address?: string;
  district?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  address: string;
  source: 'google_maps' | 'google_cache' | 'city_centroid' | 'state_centroid' | 'default';
  city: string;
  district: string;
  state: string;
}

export class GoogleGeocodingService {
  /**
   * Geocodes school and vacancy address using Google Maps Geocoding API
   */
  static async geocodeSchool(input: GeocodeInput): Promise<GeocodeResult> {
    const school = (input.schoolName || '').trim();
    const address = (input.address || '').trim();
    const city = (input.city || '').trim();
    const district = (input.district || city).trim();
    const state = (input.state || '').trim();
    const pincode = (input.pincode || '').trim();

    const cacheKey = `${normalizeKey(school)}__${normalizeKey(district || city)}__${normalizeKey(state)}__${pincode}`;

    // 1. Check persistent cache
    if (memoryCache[cacheKey]) {
      const hit = memoryCache[cacheKey];
      return {
        lat: hit.lat,
        lng: hit.lng,
        formattedAddress: hit.formattedAddress || address || `${school}, ${city}, ${state}`,
        address: hit.formattedAddress || address || `${school}, ${city}, ${state}`,
        source: 'google_cache',
        city: city || district || 'India',
        district: district || city || 'India',
        state: state || 'India',
      };
    }

    // 2. Query Google Maps Geocoding API if key is available
    if (GOOGLE_MAPS_API_KEY) {
      try {
        const queryParts = [school, address, district, city, state, pincode, 'India'].filter(Boolean);
        const query = queryParts.join(', ');
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&components=country:IN&key=${GOOGLE_MAPS_API_KEY}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
            const loc = data.results[0].geometry.location;
            const formatted = data.results[0].formatted_address;
            const lat = Math.round(loc.lat * 100000) / 100000;
            const lng = Math.round(loc.lng * 100000) / 100000;

            // Save to persistent cache
            memoryCache[cacheKey] = {
              lat,
              lng,
              formattedAddress: formatted,
              address: formatted,
              timestamp: new Date().toISOString(),
            };
            this.persistCache();

            return {
              lat,
              lng,
              formattedAddress: formatted,
              address: formatted,
              source: 'google_maps',
              city: city || district,
              district: district || city,
              state: state || 'India',
            };
          }
        }
      } catch (err) {
        console.warn('[GoogleGeocodingService] Google API request error:', err);
      }
    }

    // 3. Fallback: Fast City / District Centroid from standard geo list
    const citiesDict = (geoData as any).cities || {};
    const searchCombined = `${normalizeKey(city)} ${normalizeKey(district)} ${normalizeKey(address)}`.toLowerCase();
    for (const [cName, info] of Object.entries(citiesDict)) {
      if (searchCombined.includes(cName.toLowerCase())) {
        const item = info as any;
        return {
          lat: item.lat,
          lng: item.lng,
          formattedAddress: address || `${cName}, ${item.state}`,
          address: address || `${cName}, ${item.state}`,
          source: 'city_centroid',
          city: city || cName,
          district: district || cName,
          state: state || item.state,
        };
      }
    }

    // 4. Fallback: State Centroid
    const statesDict = (geoData as any).state_centroids || {};
    const normState = normalizeKey(state);
    for (const [stName, stInfo] of Object.entries(statesDict)) {
      if (normState === stName.toLowerCase() || searchCombined.includes(stName.toLowerCase())) {
        const info = stInfo as any;
        return {
          lat: info.lat,
          lng: info.lng,
          formattedAddress: address || `${info.capital || stName}, ${stName}`,
          address: address || `${info.capital || stName}, ${stName}`,
          source: 'state_centroid',
          city: city || info.capital || stName,
          district: district || info.capital || stName,
          state: stName,
        };
      }
    }

    // 5. Default Center of India
    return {
      lat: 20.5937,
      lng: 78.9629,
      formattedAddress: address || school || 'India',
      address: address || school || 'India',
      source: 'default',
      city: city || 'India',
      district: district || 'India',
      state: state || 'All India',
    };
  }

  /**
   * Synchronously resolve from cache or fallback (for synchronous card pipelines)
   */
  static resolveSync(input: GeocodeInput): GeocodeResult {
    const school = (input.schoolName || '').trim();
    const address = (input.address || '').trim();
    const city = (input.city || '').trim();
    const district = (input.district || city).trim();
    const state = (input.state || '').trim();
    const pincode = (input.pincode || '').trim();

    const cacheKey = `${normalizeKey(school)}__${normalizeKey(district || city)}__${normalizeKey(state)}__${pincode}`;

    if (memoryCache[cacheKey]) {
      const hit = memoryCache[cacheKey];
      return {
        lat: hit.lat,
        lng: hit.lng,
        formattedAddress: hit.formattedAddress || address || `${school}, ${city}, ${state}`,
        address: hit.formattedAddress || address || `${school}, ${city}, ${state}`,
        source: 'google_cache',
        city: city || district || 'India',
        district: district || city || 'India',
        state: state || 'India',
      };
    }

    // Centroid match
    const citiesDict = (geoData as any).cities || {};
    const searchCombined = `${normalizeKey(city)} ${normalizeKey(district)} ${normalizeKey(address)}`.toLowerCase();
    for (const [cName, info] of Object.entries(citiesDict)) {
      if (searchCombined.includes(cName.toLowerCase())) {
        const item = info as any;
        return {
          lat: item.lat,
          lng: item.lng,
          formattedAddress: address || `${cName}, ${item.state}`,
          address: address || `${cName}, ${item.state}`,
          source: 'city_centroid',
          city: city || cName,
          district: district || cName,
          state: state || item.state,
        };
      }
    }

    const statesDict = (geoData as any).state_centroids || {};
    const normState = normalizeKey(state);
    for (const [stName, stInfo] of Object.entries(statesDict)) {
      if (normState === stName.toLowerCase() || searchCombined.includes(stName.toLowerCase())) {
        const info = stInfo as any;
        return {
          lat: info.lat,
          lng: info.lng,
          formattedAddress: address || `${info.capital || stName}, ${stName}`,
          address: address || `${info.capital || stName}, ${stName}`,
          source: 'state_centroid',
          city: city || info.capital || stName,
          district: district || info.capital || stName,
          state: stName,
        };
      }
    }

    return {
      lat: 20.5937,
      lng: 78.9629,
      formattedAddress: address || school || 'India',
      address: address || school || 'India',
      source: 'default',
      city: city || 'India',
      district: district || 'India',
      state: state || 'All India',
    };
  }

  private static persistCache() {
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(memoryCache, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[GoogleGeocodingService] Failed to persist cache:', e);
    }
  }
}
