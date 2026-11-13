import { revalidatePath } from 'next/cache';

const DEFAULT_CLOUDFLARE_ZONE_ID = '017c97b91954d0da917a27ee73502cef';
const DEFAULT_SITE_ORIGIN = 'https://cseel.org';

export interface CloudflarePurgeOptions {
  /** Purge the entire Cloudflare zone cache instead of specific URLs. */
  purgeEverything?: boolean;
  /** Specific full URLs or relative paths (resolved against NEXT_PUBLIC_SITE_URL / cseel.org). */
  urls?: string[];
  /** Warm these URLs after purging so Cloudflare downloads fresh HTML into edge cache. */
  warmUrls?: string[];
}

export interface CloudflarePurgeResult {
  success: boolean;
  purgedEverything: boolean;
  purgedUrls: string[];
  warmedUrls: Array<{ url: string; status: number | null; cfCache: string | null }>;
  error?: string;
}

function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_ORIGIN;
  return raw.replace(/\/+$/, '');
}

function resolveAbsoluteUrls(inputs: string[], origin: string): string[] {
  const seen = new Set<string>();
  for (const item of inputs) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      seen.add(trimmed);
    } else {
      const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
      seen.add(`${origin}${normalized}`);
      // Also include www alias for zone purges where www and apex can be requested separately
      if (origin === 'https://cseel.org') {
        seen.add(`https://www.cseel.org${normalized}`);
      }
    }
  }
  return Array.from(seen);
}

async function postCloudflarePurge(
  zoneId: string,
  apiToken: string,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success) {
    return {
      ok: false,
      error: data?.errors?.[0]?.message || `Cloudflare API HTTP ${res.status}`,
    };
  }
  return { ok: true };
}

/**
 * Purges Cloudflare edge cache for cseel.org (full zone or targeted URLs)
 * and optionally warms updated pages so visitors receive fresh HTML immediately.
 */
export async function purgeCloudflareCache(
  options: CloudflarePurgeOptions = {}
): Promise<CloudflarePurgeResult> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID || DEFAULT_CLOUDFLARE_ZONE_ID;
  const origin = getSiteOrigin();
  const purgeEverything = Boolean(options.purgeEverything);
  const purgedUrls = purgeEverything
    ? []
    : resolveAbsoluteUrls(options.urls || [], origin);

  if (!apiToken) {
    return {
      success: false,
      purgedEverything: purgeEverything,
      purgedUrls,
      warmedUrls: [],
      error: 'Missing CLOUDFLARE_API_TOKEN environment variable',
    };
  }

  if (!purgeEverything && purgedUrls.length === 0) {
    return {
      success: false,
      purgedEverything: false,
      purgedUrls: [],
      warmedUrls: [],
      error: 'Either purgeEverything or non-empty urls must be provided',
    };
  }

  // Cloudflare API accepts up to 30 URLs per files purge request
  try {
    if (purgeEverything) {
      const res = await postCloudflarePurge(zoneId, apiToken, { purge_everything: true });
      if (!res.ok) {
        return {
          success: false,
          purgedEverything: true,
          purgedUrls: [],
          warmedUrls: [],
          error: res.error,
        };
      }
    } else {
      for (let i = 0; i < purgedUrls.length; i += 30) {
        const batch = purgedUrls.slice(i, i + 30);
        const res = await postCloudflarePurge(zoneId, apiToken, { files: batch });
        if (!res.ok) {
          return {
            success: false,
            purgedEverything: false,
            purgedUrls,
            warmedUrls: [],
            error: res.error,
          };
        }
      }
    }

    const warmTargets = resolveAbsoluteUrls(options.warmUrls || [], origin);
    const warmedUrls: Array<{ url: string; status: number | null; cfCache: string | null }> = [];
    if (warmTargets.length > 0) {
      const results = await Promise.all(
        warmTargets.map(async (targetUrl) => {
          try {
            const warmRes = await fetch(targetUrl, {
              method: 'GET',
              headers: { 'User-Agent': 'CSEEL-Cache-Warmer/1.0' },
              cache: 'no-store',
            });
            return {
              url: targetUrl,
              status: warmRes.status,
              cfCache: warmRes.headers.get('cf-cache-status'),
            };
          } catch {
            return { url: targetUrl, status: null, cfCache: null };
          }
        })
      );
      warmedUrls.push(...results);
    }

    return {
      success: true,
      purgedEverything: purgeEverything,
      purgedUrls,
      warmedUrls,
    };
  } catch (err: any) {
    return {
      success: false,
      purgedEverything: purgeEverything,
      purgedUrls,
      warmedUrls: [],
      error: err?.message || 'Cloudflare cache purge failed',
    };
  }
}

/**
 * Revalidates Next.js ISR paths and purges corresponding Cloudflare edge cache entries.
 */
export async function revalidateAndPurgePaths(paths: string[]): Promise<CloudflarePurgeResult> {
  const uniquePaths = Array.from(new Set(paths.map((p) => p.trim()).filter(Boolean)));
  for (const path of uniquePaths) {
    try {
      revalidatePath(path);
    } catch {
      // Ignore Next.js path revalidation failures outside request lifecycle
    }
  }
  return purgeCloudflareCache({
    urls: uniquePaths,
    warmUrls: uniquePaths.slice(0, 6),
  });
}
