'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { FacultyJobItem } from '@/data/facultyJobsData';
import { decodeSlimFeed } from '@/lib/jobs/feedDecoder';
import { haversineKm, hasMovedBeyondThreshold } from '@/lib/jobs/haversine';
import { FeedCache, GpsCache } from '@/lib/jobs/indexedDBCache';

export interface JobFilterOptions {
  q?: string;
  designations?: string[];
  subjects?: string[];
  boards?: string[];
  cities?: string[];
  states?: string[];
  jobTypes?: string[];
  portals?: string[];
  minSalary?: number;
  urgentOnly?: boolean;
  forLadyOnly?: boolean;
  sortBy?: 'newest' | 'salary' | 'deadline' | 'experience' | 'rating' | 'near_me';
  radiusKm?: number;
}

export interface UseJobSearchReturn {
  // Data
  jobs: FacultyJobItem[];          // Sliced current page
  allFilteredJobs: FacultyJobItem[]; // All matching query
  totalMatching: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  isInitialChunkLoaded: boolean;
  isFullFeedLoaded: boolean;

  // Actions
  setCurrentPage: (page: number) => void;
  setFilters: React.Dispatch<React.SetStateAction<JobFilterOptions>>;
  updateSearchText: (text: string) => void;
  requestGpsNearMe: () => Promise<boolean>;
  resetFilters: () => void;
  filters: JobFilterOptions;
  userCoords: { lat: number; lng: number } | null;
  gpsError: string | null;
}

const DEFAULT_PAGE_SIZE = 25;

export function useJobSearch(initialJobs?: FacultyJobItem[]): UseJobSearchReturn {
  // Master in-memory RAM array
  const [masterJobs, setMasterJobs] = useState<FacultyJobItem[]>(() => initialJobs || []);
  const [isInitialChunkLoaded, setIsInitialChunkLoaded] = useState<boolean>(false);
  const [isFullFeedLoaded, setIsFullFeedLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  // Filters State
  const [filters, setFilters] = useState<JobFilterOptions>({
    q: '',
    designations: [],
    subjects: [],
    boards: [],
    cities: [],
    states: [],
    jobTypes: [],
    portals: [],
    minSalary: 0,
    urgentOnly: false,
    forLadyOnly: false,
    sortBy: 'newest',
    radiusKm: 0,
  });

  // Debounced search query (250ms)
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const updateSearchText = useCallback((text: string) => {
    setFilters((prev) => ({ ...prev, q: text }));
    if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    searchDebounceTimer.current = setTimeout(() => {
      setDebouncedQuery(text.trim().toLowerCase());
      setCurrentPage(1); // Pipeline Rule: Reset to page 1 on query change
    }, 250);
  }, []);

  // Reset page when any filter criteria changes
  const prevFiltersRef = useRef(filters);
  useEffect(() => {
    const prev = prevFiltersRef.current;
    if (
      prev.designations !== filters.designations ||
      prev.subjects !== filters.subjects ||
      prev.boards !== filters.boards ||
      prev.cities !== filters.cities ||
      prev.states !== filters.states ||
      prev.jobTypes !== filters.jobTypes ||
      prev.portals !== filters.portals ||
      prev.minSalary !== filters.minSalary ||
      prev.urgentOnly !== filters.urgentOnly ||
      prev.forLadyOnly !== filters.forLadyOnly ||
      prev.sortBy !== filters.sortBy ||
      prev.radiusKm !== filters.radiusKm
    ) {
      setCurrentPage(1);
      prevFiltersRef.current = filters;
    }
  }, [filters]);

  // GPS & "Near Me" states
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const lastCalculatedGpsRef = useRef<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // 1. Dual-phase Ultra-slow (10 KB/s) loading strategy:
  // Step A: Load from IndexedDB (0ms)
  // Step B: If cache empty, load lightweight chunk (/jobs/jobs-top50.json ~10KB) for <1s paint
  // Step C: Background silent download of full feed (/jobs/jobs-feed.json) -> Save to IndexedDB -> Update RAM state
  useEffect(() => {
    let isCancelled = false;

    const initializeData = async () => {
      try {
        // 1. Check IndexedDB Persistent Cache
        const cachedPayload = await FeedCache.get();
        if (!isCancelled && cachedPayload && Array.isArray(cachedPayload.jobs) && cachedPayload.jobs.length > 0) {
          const decoded = decodeSlimFeed(cachedPayload.jobs);
          setMasterJobs(decoded);
          setIsInitialChunkLoaded(true);
          setIsFullFeedLoaded(true);
          setIsLoading(false);

          // Restore last known GPS if present
          const cachedGps = await GpsCache.get();
          if (cachedGps) {
            setUserCoords({ lat: cachedGps.lat, lng: cachedGps.lng });
            lastCalculatedGpsRef.current = { lat: cachedGps.lat, lng: cachedGps.lng };
          }
        } else {
          // 2. Cold Start: Fetch lightweight Initial Chunk (/jobs/jobs-top50.json)
          try {
            const top50Res = await fetch('/jobs/jobs-top50.json');
            if (top50Res.ok && !isCancelled) {
              const top50Slim = await top50Res.json();
              if (Array.isArray(top50Slim) && top50Slim.length > 0) {
                const decodedTop50 = decodeSlimFeed(top50Slim);
                setMasterJobs(decodedTop50);
                setIsInitialChunkLoaded(true);
                setIsLoading(false);
              }
            }
          } catch (e) {
            console.warn('[useJobSearch] top-50 chunk load fallback:', e);
          }
        }

        // 3. Background Silent Sync: Fetch latest manifest & full dataset
        const fetchFullFeedInBackground = async () => {
          try {
            // Check version manifest
            const manifestRes = await fetch('/jobs/latest.json', { cache: 'no-cache' });
            let serverVersion = '';
            if (manifestRes.ok) {
              const manifest = await manifestRes.json();
              serverVersion = manifest.version || '';
            }

            // Only fetch if version changed or not loaded
            const cachedPayload = await FeedCache.get();
            if (!cachedPayload || (serverVersion && cachedPayload.version !== serverVersion)) {
              const feedRes = await fetch('/jobs/jobs-feed.json');
              if (feedRes.ok && !isCancelled) {
                const fullSlim = await feedRes.json();
                if (Array.isArray(fullSlim) && fullSlim.length > 0) {
                  const decodedFull = decodeSlimFeed(fullSlim);

                  // If user already has GPS coords, compute distances for the incoming jobs
                  if (lastCalculatedGpsRef.current) {
                    const { lat, lng } = lastCalculatedGpsRef.current;
                    for (let i = 0; i < decodedFull.length; i++) {
                      const j = decodedFull[i];
                      if (j.coordinates && typeof j.coordinates.lat === 'number') {
                        j.distanceKm = haversineKm(lat, lng, j.coordinates.lat, j.coordinates.lng);
                      }
                    }
                  }

                  setMasterJobs(decodedFull);
                  setIsFullFeedLoaded(true);
                  setIsInitialChunkLoaded(true);
                  setIsLoading(false);

                  // Persist to IndexedDB
                  await FeedCache.save(fullSlim, serverVersion || `v_${fullSlim.length}`);
                }
              }
            }
          } catch (err) {
            console.warn('[useJobSearch] Background silent sync notice:', err);
          }
        };

        // Schedule background sync during browser idle time or short delay
        if (typeof window !== 'undefined') {
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => fetchFullFeedInBackground(), { timeout: 4000 });
          } else {
            setTimeout(fetchFullFeedInBackground, 1000);
          }
        }
      } catch (err) {
        console.error('[useJobSearch] Init error:', err);
        setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      isCancelled = true;
      if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    };
  }, []);

  // 4. "Job Near Me" & 200-Meter GPS Threshold Logic
  const requestGpsNearMe = useCallback(async (): Promise<boolean> => {
    setGpsError(null);
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocation is not supported by your device or browser.');
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserCoords(newCoords);

          // 200-Meter Rule Check:
          const hasMoved = hasMovedBeyondThreshold(lastCalculatedGpsRef.current, newCoords, 0.2);

          if (!hasMoved && lastCalculatedGpsRef.current) {
            // Less than 200 meters -> reuse previously calculated distances
            setFilters((prev) => ({ ...prev, sortBy: 'near_me' }));
            resolve(true);
            return;
          }

          // Moved >= 200m or first execution: calculate Haversine across masterJobs once
          lastCalculatedGpsRef.current = newCoords;
          await GpsCache.save(newCoords.lat, newCoords.lng);

          setMasterJobs((prev) => {
            // Immutable clone with persistent property injection
            return prev.map((job) => {
              if (job.coordinates && typeof job.coordinates.lat === 'number' && typeof job.coordinates.lng === 'number') {
                const dist = haversineKm(newCoords.lat, newCoords.lng, job.coordinates.lat, job.coordinates.lng);
                return { ...job, distanceKm: dist };
              }
              return job;
            });
          });

          setFilters((prev) => ({ ...prev, sortBy: 'near_me' }));
          resolve(true);
        },
        (err) => {
          if (err.code === 1) {
            setGpsError('Location permission denied. Please allow location access or select your city manually.');
          } else {
            setGpsError('Unable to detect location. Please check device GPS or choose city manually.');
          }
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }, []);

  // 5. Frontend Processing Pipeline Order:
  // masterJobs
  //   -> 1. Text Search (title, company, subject, designation, location)
  //   -> 2. Apply Selected Filters (designation, subject, board, city, state, role, salary, portal)
  //   -> 3. Distance Radius Check (if radiusKm > 0)
  //   -> 4. Sort Matching Jobs (Date, Salary, or Proximity Distance)
  //   -> 5. Total Results & Total Pages
  //   -> 6. Slice Current Page (0 to 25/50 items)
  //   -> 7. Render DOM Cards Only
  const allFilteredJobs = useMemo(() => {
    let result = masterJobs;

    // 1. Text Search
    const q = debouncedQuery;
    if (q) {
      result = result.filter((j) => {
        const text = `${j.jobPostName} ${j.organisationName} ${j.subject || ''} ${j.designation || ''} ${j.city || ''} ${j.state || ''} ${j.district || ''}`.toLowerCase();
        return text.includes(q);
      });
    }

    // 2. Selected Filters
    const {
      designations = [],
      subjects = [],
      boards = [],
      cities = [],
      states = [],
      jobTypes = [],
      portals = [],
      minSalary = 0,
      urgentOnly = false,
      forLadyOnly = false,
      radiusKm = 0,
    } = filters;

    if (designations.length > 0) {
      result = result.filter((j) => j.designation && designations.includes(j.designation));
    }
    if (subjects.length > 0) {
      result = result.filter((j) => j.subject && subjects.includes(j.subject));
    }
    if (boards.length > 0) {
      result = result.filter((j) => j.board && boards.includes(j.board));
    }
    if (cities.length > 0) {
      result = result.filter((j) => j.city && cities.includes(j.city));
    }
    if (states.length > 0) {
      result = result.filter((j) => j.state && states.includes(j.state));
    }
    if (jobTypes.length > 0) {
      result = result.filter((j) => j.roleType && jobTypes.includes(j.roleType));
    }
    if (portals.length > 0) {
      result = result.filter((j) => j.source && portals.includes(j.source));
    }
    if (minSalary > 0) {
      result = result.filter((j) => j.salaryMin && j.salaryMin >= minSalary);
    }
    if (urgentOnly) {
      result = result.filter((j) => j.urgent);
    }
    if (forLadyOnly) {
      result = result.filter((j) => j.forLady);
    }

    // 3. Distance Radius Check
    if (radiusKm > 0 && userCoords) {
      result = result.filter((j) => typeof j.distanceKm === 'number' && j.distanceKm <= radiusKm);
    }

    // 4. Sort Matching Jobs (Immutable copy)
    const sorted = [...result];
    const sortBy = filters.sortBy || 'newest';

    if (sortBy === 'near_me') {
      sorted.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    } else if (sortBy === 'salary') {
      sorted.sort((a, b) => (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0));
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => (b._dateMs || 0) - (a._dateMs || 0));
    }

    return sorted;
  }, [masterJobs, debouncedQuery, filters, userCoords]);

  // 5. Total Results & Total Pages
  const totalMatching = allFilteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalMatching / pageSize));

  // Ensure currentPage doesn't exceed totalPages
  const activePage = Math.min(currentPage, totalPages);

  // 6. Slice Current Page Only
  const pagedJobs = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return allFilteredJobs.slice(start, start + pageSize);
  }, [allFilteredJobs, activePage, pageSize]);

  const resetFilters = useCallback(() => {
    setFilters({
      q: '',
      designations: [],
      subjects: [],
      boards: [],
      cities: [],
      states: [],
      jobTypes: [],
      portals: [],
      minSalary: 0,
      urgentOnly: false,
      forLadyOnly: false,
      sortBy: 'newest',
      radiusKm: 0,
    });
    setDebouncedQuery('');
    setCurrentPage(1);
  }, []);

  return {
    jobs: pagedJobs,
    allFilteredJobs,
    totalMatching,
    totalPages,
    currentPage: activePage,
    pageSize,
    isLoading,
    isInitialChunkLoaded,
    isFullFeedLoaded,
    setCurrentPage,
    setFilters,
    updateSearchText,
    requestGpsNearMe,
    resetFilters,
    filters,
    userCoords,
    gpsError,
  };
}
