/**
 * haversine.ts
 * Pure Haversine distance calculation — zero dependencies, tree-shakeable.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates great-circle distance between two GPS coordinates.
 * Returns distance in kilometers, rounded to 1 decimal place.
 */
export function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 10) / 10;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Returns true if the user has moved more than thresholdKm
 * since the last GPS fix.
 */
export function hasMovedBeyondThreshold(
  prev: { lat: number; lng: number } | null,
  next: { lat: number; lng: number },
  thresholdKm = 0.2, // 200 meters
): boolean {
  if (!prev) return true;
  return haversineKm(prev.lat, prev.lng, next.lat, next.lng) >= thresholdKm;
}
