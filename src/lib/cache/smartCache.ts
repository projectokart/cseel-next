/**
 * CSEEL Ultra-Fast Smart Cache & Stale-While-Revalidate (SWR) Engine
 * 
 * Features:
 * - 0ms Instant Client Render from in-memory / LocalStorage cache.
 * - Non-blocking background revalidation (Stale-While-Revalidate).
 * - Section-level selective updates: When backend data changes, updates only the affected section.
 * - BroadcastChannel / CustomEvent synchronization across tabs and components.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
  version?: number;
}

class SmartCacheEngine {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private inFlightRequests = new Map<string, Promise<any>>();
  private listeners = new Map<string, Set<(data: any) => void>>();
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          this.broadcastChannel = new BroadcastChannel('cseel_smart_cache_sync');
          this.broadcastChannel.onmessage = (event) => {
            const { key, data } = event.data || {};
            if (key && data) {
              this.setMemory(key, data);
              this.notifyListeners(key, data);
            }
          };
        }
      } catch {}
    }
  }

  private getStorageKey(key: string): string {
    return `cseel_cache_v2_${key}`;
  }

  private setMemory<T>(key: string, data: T, etag?: string) {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      etag,
    });
  }

  private notifyListeners(key: string, data: any) {
    const subs = this.listeners.get(key);
    if (subs) {
      subs.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error('[SmartCache] Listener error:', e);
        }
      });
    }
  }

  /**
   * Synchronously get cached data (from RAM or LocalStorage)
   */
  public getInstant<T>(key: string, defaultValue: T): T {
    // 1. Check RAM cache first (<0.1ms)
    const inMem = this.memoryCache.get(key);
    if (inMem && inMem.data !== undefined) {
      return inMem.data;
    }

    // 2. Check LocalStorage (<1ms)
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(this.getStorageKey(key));
        if (raw) {
          const parsed: CacheEntry<T> = JSON.parse(raw);
          if (parsed && parsed.data !== undefined) {
            this.memoryCache.set(key, parsed);
            return parsed.data;
          }
        }
      } catch {}
    }

    return defaultValue;
  }

  /**
   * Fetch with Stale-While-Revalidate (SWR)
   * Calls onUpdate callback if backend data differs from cached data.
   */
  public async fetchSWR<T>({
    key,
    fetcher,
    ttlMs = 1000 * 60 * 15, // 15 minutes default stale window
    onUpdate,
  }: {
    key: string;
    fetcher: () => Promise<T>;
    ttlMs?: number;
    onUpdate?: (freshData: T) => void;
  }): Promise<T> {
    const cached = this.memoryCache.get(key);
    const now = Date.now();

    // If cache is fresh and within TTL, return memory data immediately
    if (cached && now - cached.timestamp < ttlMs) {
      return cached.data;
    }

    // Deduplicate in-flight requests for the same key
    if (this.inFlightRequests.has(key)) {
      return this.inFlightRequests.get(key);
    }

    const fetchPromise = (async () => {
      try {
        const freshData = await fetcher();

        if (freshData !== undefined && freshData !== null) {
          const serializedFresh = JSON.stringify(freshData);
          const serializedOld = cached ? JSON.stringify(cached.data) : null;

          // Save to memory
          this.setMemory(key, freshData);

          // Save to localStorage
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(
                this.getStorageKey(key),
                JSON.stringify({
                  data: freshData,
                  timestamp: Date.now(),
                })
              );
            } catch {}
          }

          // If backend data changed from stale cached data, notify subscribers
          if (serializedFresh !== serializedOld) {
            if (onUpdate) onUpdate(freshData);
            this.notifyListeners(key, freshData);

            // Broadcast to other open tabs
            if (this.broadcastChannel) {
              this.broadcastChannel.postMessage({ key, data: freshData });
            }
          }

          return freshData;
        }

        return cached ? cached.data : freshData;
      } catch (err) {
        console.warn(`[SmartCache] Background fetch failed for ${key}, using cached fallback:`, err);
        return cached ? cached.data : (null as any);
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, fetchPromise);
    return fetchPromise;
  }

  /**
   * Subscribe to cache updates for a specific key
   */
  public subscribe<T>(key: string, callback: (data: T) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    return () => {
      const subs = this.listeners.get(key);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) this.listeners.delete(key);
      }
    };
  }

  /**
   * Mutate cache and broadcast update to all listening components
   */
  public mutate<T>(key: string, newData: T) {
    this.setMemory(key, newData);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          this.getStorageKey(key),
          JSON.stringify({
            data: newData,
            timestamp: Date.now(),
          })
        );
      } catch {}
    }
    this.notifyListeners(key, newData);
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ key, data: newData });
    }
  }

  /**
   * Invalidate a single key or all keys
   */
  public invalidate(keyPrefix?: string) {
    if (!keyPrefix) {
      this.memoryCache.clear();
      return;
    }
    for (const k of this.memoryCache.keys()) {
      if (k.startsWith(keyPrefix)) {
        this.memoryCache.delete(k);
      }
    }
  }
}

export const smartCache = new SmartCacheEngine();
