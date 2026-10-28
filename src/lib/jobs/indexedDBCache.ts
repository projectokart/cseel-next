/**
 * indexedDBCache.ts
 * Upgraded IndexedDB cache for CSEEL job feed.
 *
 * Stores:
 *   - 'feed_payload'   → full slim job array + version
 *   - 'links_payload'  → id→{url,desc} map
 *   - 'coords_payload' → id→[lat,lng] map
 *   - 'gps_last'       → last GPS fix
 */

const DB_NAME    = 'cseel_jobs_db';
const DB_VERSION = 2;
const STORE      = 'jobs_v2';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB)
      return reject(new Error('IndexedDB unavailable'));

    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx  = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror   = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function idbSet(key: string, value: unknown): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx  = db.transaction(STORE, 'readwrite');
      const req = tx.objectStore(STORE).put(value, key);
      req.onsuccess = () => resolve();
      req.onerror   = () => resolve();
    });
  } catch {
    // silent — localStorage or memory will serve as fallback
  }
}

// ── Feed payload ────────────────────────────────────────────────────────────

export interface FeedPayload {
  version:   string;
  savedAt:   number;
  jobs:      Record<string, any>[]; // slim encoded
}

export const FeedCache = {
  async get(): Promise<FeedPayload | null> {
    return idbGet<FeedPayload>('feed_payload');
  },
  async save(jobs: Record<string, any>[], version: string): Promise<void> {
    const payload: FeedPayload = { version, savedAt: Date.now(), jobs };
    await idbSet('feed_payload', payload);
  },
};

// ── Links payload ───────────────────────────────────────────────────────────

export interface LinksMap { [id: string]: { u?: string; d?: string } }

export const LinksCache = {
  async get(): Promise<LinksMap | null> {
    return idbGet<LinksMap>('links_payload');
  },
  async save(links: LinksMap): Promise<void> {
    await idbSet('links_payload', links);
  },
};

// ── Coords payload ──────────────────────────────────────────────────────────

export interface CoordsMap { [id: string]: [number, number] }

export const CoordsCache = {
  async get(): Promise<CoordsMap | null> {
    return idbGet<CoordsMap>('coords_payload');
  },
  async save(coords: CoordsMap): Promise<void> {
    await idbSet('coords_payload', coords);
  },
};

// ── GPS last fix ────────────────────────────────────────────────────────────

export interface GpsFix { lat: number; lng: number; savedAt: number }

export const GpsCache = {
  async get(): Promise<GpsFix | null> {
    return idbGet<GpsFix>('gps_last');
  },
  async save(lat: number, lng: number): Promise<void> {
    await idbSet('gps_last', { lat, lng, savedAt: Date.now() });
  },
};

// ── Version check ───────────────────────────────────────────────────────────

export async function getCachedVersion(): Promise<string | null> {
  const payload = await FeedCache.get();
  return payload?.version ?? null;
}
