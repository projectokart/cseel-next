/**
 * Job Card Formatting Utilities
 * Standardizes address formatting, portal source badges, and display names.
 */

export function formatStructuredAddress(job: {
  state?: string | null;
  district?: string | null;
  city?: string | null;
  address?: string | null;
}): string {
  const state = (job.state || '').trim();
  const district = (job.district || job.city || '').trim();
  const rawAddress = (job.address || '').trim();

  let local = '';
  // 1. Check parentheses e.g. "Lucknow(Gomti Nagar)", "New Delhi(Okhla)"
  const parenMatches = rawAddress.match(/\(([^)]+)\)/g);
  if (parenMatches && parenMatches.length > 0) {
    const candidates = parenMatches
      .map((p) => p.replace(/[()]/g, '').replace(/all areas/gi, '').trim())
      .filter((p) => p.length > 0 && p.toLowerCase() !== district.toLowerCase() && p.toLowerCase() !== state.toLowerCase());
    if (candidates.length > 0) {
      local = candidates[candidates.length - 1];
    }
  }

  // 2. If no local from parentheses, check comma separated
  if (!local && rawAddress) {
    const parts = rawAddress
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const nonDistrict = parts.filter(
      (p) =>
        p.toLowerCase() !== district.toLowerCase() &&
        p.toLowerCase() !== state.toLowerCase() &&
        p.toLowerCase() !== 'india' &&
        !p.toLowerCase().includes('all area')
    );
    if (nonDistrict.length > 0) {
      local = nonDistrict.join(', ');
    }
  }

  // 3. Assemble: State + District + Local Address in District
  const result: string[] = [];
  if (state && state.toLowerCase() !== 'all india' && state.toLowerCase() !== 'india') {
    result.push(state);
  }
  if (district && district.toLowerCase() !== 'all india' && district.toLowerCase() !== 'india') {
    if (!result.some((r) => r.toLowerCase() === district.toLowerCase())) {
      result.push(district);
    }
  }
  if (local) {
    let cleanLocal = local;
    if (state) {
      cleanLocal = cleanLocal.replace(new RegExp(`\\b${state}\\b`, 'gi'), '');
    }
    if (district) {
      cleanLocal = cleanLocal.replace(new RegExp(`\\b${district}\\b`, 'gi'), '');
    }
    cleanLocal = cleanLocal.replace(/^[,\s]+|[,\s]+$/g, '').trim();

    if (cleanLocal && !result.some((r) => r.toLowerCase() === cleanLocal.toLowerCase())) {
      result.push(cleanLocal);
    }
  }

  if (result.length > 0) {
    return result.join(', ');
  }
  return rawAddress || district || state || 'India';
}

export function formatCleanSalary(raw?: string | null, isDetail = false): string {
  if (!raw || raw.trim() === '' || raw.trim() === '---' || raw.trim().toLowerCase() === 'n/a' || raw.toLowerCase().includes('not disclosed')) {
    return isDetail ? 'Not Disclosed (As per School Norms)' : 'Not Disclosed';
  }

  const s = raw.trim();

  // Pattern: ₹50k - ₹50k/mo or 40k-40k/mo
  const monthlyMatch = s.match(/₹?\s*(\d+)\s*k?\s*[-–—to]+\s*₹?\s*(\d+)\s*k\s*\/\s*mo/i);
  if (monthlyMatch) {
    const v1 = monthlyMatch[1];
    const v2 = monthlyMatch[2];
    if (v1 === v2) {
      return `₹${v1},000 / month`;
    }
    return `₹${v1}k - ₹${v2}k / month`;
  }

  // Pattern: ₹4 - ₹4 LPA or ₹2.5 - ₹3.5 Lacs PA
  const lpaMatch = s.match(/₹?\s*([\d\.]+)\s*[-–—to]+\s*₹?\s*([\d\.]+)\s*(?:lpa|lakhs?|lacs?)\s*(?:pa)?/i);
  if (lpaMatch) {
    const v1 = lpaMatch[1];
    const v2 = lpaMatch[2];
    if (v1 === v2) {
      return `₹${v1} Lakhs PA`;
    }
    return `₹${v1} - ₹${v2} Lakhs PA`;
  }

  return s;
}

export function getSourceDisplayName(source?: string | null): string {
  if (!source) return 'Verified';
  const s = source.toLowerCase();
  if (s.includes('naukri')) return 'Naukri';
  if (s.includes('indeed')) return 'Indeed';
  if (s.includes('linkedin')) return 'LinkedIn';
  if (s.includes('portal') || s.includes('school') || s.includes('direct')) return 'Direct Portal';
  return source;
}

export function getSourceBadgeColor(source?: string | null): string {
  if (!source) return 'bg-slate-50 text-slate-700 border-slate-200';
  const s = source.toLowerCase();
  if (s.includes('naukri')) return 'bg-sky-50 text-[#006FCC] border-sky-200';
  if (s.includes('indeed')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (s.includes('linkedin')) return 'bg-blue-50 text-[#0A66C2] border-blue-200';
  return 'bg-emerald-50 text-emerald-800 border-emerald-200';
}

export function getGoogleMapsSearchUrl(job: {
  organisationName?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  coordinates?: { lat: number; lng: number } | null;
}): string {
  const org = (job.organisationName || '').trim();
  const structured = formatStructuredAddress(job);
  const parts = [org, structured].filter(Boolean);
  const query = parts.join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
