import verifiedRegistryRaw from './verified_makerspace_images.json';
import catalog325MapRaw from './makerspace_325_catalog.json';

const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh/projectokart/cseel-next@main/public';

interface VerifiedProduct {
  itemName: string;
  verified: boolean;
  publicUrl: string;
  sourceTitle?: string;
  confidence?: number;
}

const verifiedRegistry: Record<string, VerifiedProduct> = verifiedRegistryRaw as Record<string, VerifiedProduct>;
const catalog325Map: Record<string, string> = catalog325MapRaw as Record<string, string>;

/**
 * Converts a local /images/... path to a jsDelivr CDN URL.
 * External URLs (http/https) are returned as-is.
 */
function toCdnUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${JSDELIVR_BASE}${url}`;
}

/**
 * Returns true if an item has an authentic, verified photo from the internet
 */
export function isItemVerified(itemName: string, sectionId?: string, sno?: string): boolean {
  return getItemImage(sectionId || '', itemName, sno) !== null;
}

/**
 * STRICT RULE: Only return an authentic, verified physical product image URL via CDN.
 * NEVER return generic category default fallbacks or fake substitute photos.
 * If no verified photo exists for the item yet, returns null.
 */
export function getItemImage(sectionId: string, itemName: string, sno?: string): string | null {
  // 1. Direct item key from 325-item catalog map
  if (sno && sectionId) {
    const itemKey = `${sectionId}-${sno}`;
    const mapped = catalog325Map[itemKey];
    if (mapped && !mapped.startsWith('/images/makerspace/items/')) {
      return toCdnUrl(mapped);
    }
  }

  // 2. Direct exact slug in verified registry (must be verified and not a fallback)
  if (itemName) {
    const clean = itemName.toLowerCase().trim();
    const slug = clean.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const reg = verifiedRegistry[slug];
    if (reg?.verified && reg.publicUrl && !reg.publicUrl.startsWith('/images/makerspace/items/')) {
      return toCdnUrl(reg.publicUrl);
    }
  }

  // NO category default fallbacks, NO generic guesses!
  return null;
}
