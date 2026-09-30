/**
 * Geocoding, Google Map Short Link Resolver, Haversine Distance Calculator & Verification Utilities
 */

export function buildFormattedAddress(
  localAddress?: string,
  district?: string,
  state?: string,
  pincode?: string
): string {
  const parts: string[] = [];
  if (localAddress && localAddress.trim()) parts.push(localAddress.trim());
  if (district && district.trim()) parts.push(district.trim());
  if (state && state.trim()) {
    if (pincode && pincode.trim()) {
      parts.push(`${state.trim()} - ${pincode.trim()}`);
    } else {
      parts.push(state.trim());
    }
  } else if (pincode && pincode.trim()) {
    parts.push(pincode.trim());
  }
  return parts.join(', ');
}

export function parseCoordinatesFromText(text: string): { latitude: number; longitude: number } | null {
  if (!text) return null;
  const t = text.trim();

  // 1. @lat,lng
  const atMatch = t.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lon = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 2. !3dlat!4dlng
  const protoMatch = t.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (protoMatch) {
    const lat = parseFloat(protoMatch[1]);
    const lon = parseFloat(protoMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 3. ?q=lat,lng or &q=lat,lng
  const qMatch = t.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lon = parseFloat(qMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 4. ll=lat,lng
  const llMatch = t.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) {
    const lat = parseFloat(llMatch[1]);
    const lon = parseFloat(llMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 5. raw coordinates e.g. "28.1487, 77.3320" or "28.1487 77.3320"
  const rawMatch = t.match(/^(-?\d+\.\d+)[\s,]+(-?\d+\.\d+)$/);
  if (rawMatch) {
    const lat = parseFloat(rawMatch[1]);
    const lon = parseFloat(rawMatch[2]);
    if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      return { latitude: lat, longitude: lon };
    }
  }

  return null;
}

export function parseGoogleMapsLocation(input: string): { latitude: number; longitude: number } | null {
  return parseCoordinatesFromText(input);
}

export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 100) / 100; // 2 decimals
}

export interface ResolveLocationParams {
  url?: string;
  address?: string;
  localAddress?: string;
  district?: string;
  state?: string;
  pincode?: string;
  latitude?: number | string;
  longitude?: number | string;
}

export interface ResolveLocationResult {
  success: boolean;
  latitude?: number;
  longitude?: number;
  googleMapUrl?: string;
  resolvedAddress?: string;
  source?: string;
  error?: string;
}

export async function resolveLocationViaApi(params: ResolveLocationParams): Promise<ResolveLocationResult> {
  // First, if direct coordinates or direct non-short URL can be parsed client-side
  if (params.latitude && params.longitude && !isNaN(Number(params.latitude)) && !isNaN(Number(params.longitude))) {
    const lat = Number(params.latitude);
    const lon = Number(params.longitude);
    return {
      success: true,
      latitude: lat,
      longitude: lon,
      googleMapUrl: `https://maps.google.com/?q=${lat.toFixed(6)},${lon.toFixed(6)}`,
      source: 'coordinates'
    };
  }

  if (params.url && !params.url.includes('maps.app') && !params.url.includes('goo.gl')) {
    const direct = parseCoordinatesFromText(params.url);
    if (direct) {
      return {
        success: true,
        latitude: direct.latitude,
        longitude: direct.longitude,
        googleMapUrl: `https://maps.google.com/?q=${direct.latitude.toFixed(6)},${direct.longitude.toFixed(6)}`,
        source: 'url_direct'
      };
    }
  }

  // Call API for short link resolution (e.g. maps.app.goo.gl) or Address Geocoding
  try {
    const res = await fetch('/api/resolve-map-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to connect to location resolution service'
    };
  }
}
