'use client';

import { useState, useEffect } from 'react';
import { smartCache } from './smartCache';

interface UseSmartSWROptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  initialData?: T;
  ttlMs?: number;
  enabled?: boolean;
}

export function useSmartSWR<T>({
  key,
  fetcher,
  initialData,
  ttlMs = 1000 * 60 * 15,
  enabled = true,
}: UseSmartSWROptions<T>) {
  // 1. Instant synchronous cache retrieval (0ms render)
  const [data, setData] = useState<T>(() => {
    return smartCache.getInstant<T>(key, initialData as T);
  });

  const [isValidating, setIsValidating] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    // Listen to real-time broadcasts or mutations across components/tabs
    const unsubscribe = smartCache.subscribe<T>(key, (fresh) => {
      setData(fresh);
    });

    // Background Stale-While-Revalidate fetch
    setIsValidating(true);
    smartCache
      .fetchSWR<T>({
        key,
        fetcher,
        ttlMs,
        onUpdate: (fresh) => {
          setData(fresh);
        },
      })
      .then((res) => {
        if (res !== undefined && res !== null) {
          setData(res);
        }
      })
      .finally(() => {
        setIsValidating(false);
      });

    return () => {
      unsubscribe();
    };
  }, [key, enabled, ttlMs]);

  const mutate = (newData: T) => {
    setData(newData);
    smartCache.mutate<T>(key, newData);
  };

  return {
    data,
    isValidating,
    mutate,
  };
}
