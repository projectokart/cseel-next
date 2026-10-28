import { FacultyJobItem } from '@/data/facultyJobsData';

const DB_NAME = 'cseel_portal_db';
const DB_VERSION = 1;
const STORE_NAME = 'jobs_cache_store';

interface CachedDataPayload {
  version: string;
  count: number;
  savedAt: number;
  lastGps?: { lat: number; lng: number };
  jobs: FacultyJobItem[];
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export class JobsCacheStorage {
  /**
   * Retrieves all cached vacancies and the cached version string from IndexedDB
   */
  static async getCache(): Promise<CachedDataPayload | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get('vacancies_payload');

        req.onsuccess = () => {
          const val = req.result as CachedDataPayload | undefined;
          if (val && Array.isArray(val.jobs) && val.jobs.length > 0) {
            resolve(val);
          } else {
            resolve(null);
          }
        };

        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  /**
   * Saves the full jobs dataset and its version string into IndexedDB
   */
  static async saveCache(jobs: FacultyJobItem[], version: string, count: number): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const payload: CachedDataPayload = {
          version,
          count: count || jobs.length,
          savedAt: Date.now(),
          jobs,
        };
        const req = store.put(payload, 'vacancies_payload');
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('[JobsCacheStorage] Failed to save cache:', err);
    }
  }

  /**
   * Updates only the distance values and last GPS coordinates in the cache
   */
  static async updateDistances(jobs: FacultyJobItem[], gps: { lat: number; lng: number }): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get('vacancies_payload');

        getReq.onsuccess = () => {
          const payload = getReq.result as CachedDataPayload | undefined;
          if (payload) {
            payload.jobs = jobs;
            payload.lastGps = gps;
            store.put(payload, 'vacancies_payload');
          }
          resolve();
        };

        getReq.onerror = () => resolve();
      });
    } catch {
      // silent fallback
    }
  }
}
