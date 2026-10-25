/**
 * Job Card Formatting Utilities
 * Standardizes per-month salary formatting, clean non-redundant addresses,
 * portal source badges, and Google Maps search queries.
 */

/**
 * Clean & Structured Address Formatter
 * Natural Indian ordering: [Local Area / Sector], [District / City], [State]
 * Strips duplicate occurrences of District and State so nothing is repeated.
 * Handles Delhi NCR cleanly (never "Delhi, Delhi").
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

  // 1. Extract pure local address by checking parentheses or removing known district/state
  let local = '';
  const parenMatches = rawAddress.match(/\(([^)]+)\)/g);
  if (parenMatches && parenMatches.length > 0) {
    const candidates = parenMatches
      .map((p) => p.replace(/[()]/g, '').replace(/all areas/gi, '').trim())
      .filter(
        (p) =>
          p.length > 0 &&
          p.toLowerCase() !== district.toLowerCase() &&
          p.toLowerCase() !== state.toLowerCase()
      );
    if (candidates.length > 0) {
      local = candidates[candidates.length - 1];
    }
  }

  if (!local && rawAddress) {
    // Remove state, district, and generic 'India' keywords from raw address
    let cleaned = rawAddress;
    if (state && state.toLowerCase() !== 'india') {
      cleaned = cleaned.replace(new RegExp(`\\b${escapeRegExp(state)}\\b`, 'gi'), '');
    }
    if (district && district.toLowerCase() !== 'india') {
      cleaned = cleaned.replace(new RegExp(`\\b${escapeRegExp(district)}\\b`, 'gi'), '');
    }

    // Filter out mismatched foreign Indian metro names from local address to prevent cross-city contamination
    const targetCityNorm = (district || job.city || '').toLowerCase().trim();
    const targetStateNorm = (state || '').toLowerCase().trim();
    const MAJOR_METROS = [
      'delhi', 'new delhi', 'noida', 'gurugram', 'gurgaon', 'ghaziabad', 'faridabad',
      'mumbai', 'navi mumbai', 'thane', 'pune', 'bengaluru', 'bangalore', 'chennai',
      'hyderabad', 'kolkata', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'chandigarh',
      'indore', 'bhopal', 'patna', 'nagpur', 'surat', 'vadodara', 'visakhapatnam',
      'kochi', 'thiruvananthapuram', 'coimbatore', 'ludhiana', 'agra', 'nashik', 'rajkot',
      'varanasi', 'meerut', 'amritsar', 'dehradun'
    ];

    for (const metro of MAJOR_METROS) {
      if (
        metro !== targetCityNorm &&
        metro !== targetStateNorm &&
        !targetCityNorm.includes(metro) &&
        !targetStateNorm.includes(metro)
      ) {
        cleaned = cleaned.replace(new RegExp(`\\b${escapeRegExp(metro)}\\b`, 'gi'), '');
      }
    }

    cleaned = cleaned
      .replace(/\b(all areas|all india|india)\b/gi, '')
      .replace(/^[,\s\-()+/]+|[,\s\-()+/]+$/g, '')
      .replace(/[,\s]+/g, ' ')
      .trim();

    if (cleaned && cleaned.toLowerCase() !== district.toLowerCase() && cleaned.toLowerCase() !== state.toLowerCase()) {
      local = cleaned;
    }
  }

  // 2. Assemble in clean natural order: Local Area, District, State
  const parts: string[] = [];
  if (local) {
    parts.push(local);
  }

  if (district && district.toLowerCase() !== 'all india' && district.toLowerCase() !== 'india') {
    if (!parts.some((p) => p.toLowerCase() === district.toLowerCase())) {
      parts.push(district);
    }
  }

  // Special Delhi case: avoid "Delhi, Delhi"
  if (
    district.toLowerCase() === 'delhi' &&
    (!state || state.toLowerCase() === 'delhi' || state.toLowerCase() === 'india')
  ) {
    return local ? `${local}, Delhi NCR` : 'Delhi NCR';
  }

  if (state && state.toLowerCase() !== 'all india' && state.toLowerCase() !== 'india') {
    if (!parts.some((p) => p.toLowerCase() === state.toLowerCase())) {
      parts.push(state);
    }
  }

  if (parts.length > 0) {
    return parts.join(', ');
  }

  return district || state || 'India';
}


/**
 * Extract Pure Local Address
 * Strips District, City, State, and Country from the full address so ONLY the Local Address
 * (Locality / Colony / Sector / Area / Street / Campus branch) remains.
 * If full address only had District and State, scans shortDescription for branch/campus mentions.
 * Falls back to "School Campus" if no specific local colony is available, never repeating District & State.
 */
export function extractPureLocalAddress(job: {
  address?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  shortDescription?: string | null;
  organisationName?: string | null;
}): string {
  const state = (job.state || '').trim();
  const district = (job.district || job.city || '').trim();
  const city = (job.city || '').trim();
  const rawAddress = (job.address || '').trim();
  const desc = (job.shortDescription || '').trim();

  const DISQUALIFIED = [
    'committed to', 'the address mentioned', 'walk-in', 'apply now', 'looking for',
    'experienced', 'qualification', 'salary', 'benefits', 'reputed', 'hiring',
    'immediate', 'urgent', 'required', 'interview', 'criteria', 'candidates',
    'in person', 'hybrid', 'remote', 'full time', 'part time', 'preference',
    'deliver', 'education', 'school', 'institution', 'organisation'
  ];

  const cleanCandidate = (str: string): string => {
    if (!str) return '';
    let s = str.replace(/[*#_~]/g, '').trim();
    // Remove 6-digit Indian pincode
    s = s.replace(/\b\d{6}\b/g, '');
    // Remove Country & generic keywords
    s = s.replace(/\b(india|all india|all areas|pan india)\b/gi, '');
    // Remove State
    if (state && state.toLowerCase() !== 'india') {
      s = s.replace(new RegExp(`\\b${escapeRegExp(state)}\\b`, 'gi'), '');
    }
    // Remove District
    if (district && district.toLowerCase() !== 'india') {
      s = s.replace(new RegExp(`\\b${escapeRegExp(district)}\\b`, 'gi'), '');
    }
    // Remove City
    if (city && city.toLowerCase() !== district.toLowerCase() && city.toLowerCase() !== 'india') {
      s = s.replace(new RegExp(`\\b${escapeRegExp(city)}\\b`, 'gi'), '');
    }

    // Clean leading/trailing punctuation & preserve inner commas cleanly
    s = s.replace(/^[\s,;\-()+/:|]+|[\s,;\-()+/:|]+$/g, '').trim();
    s = s.replace(/\s*,\s*/g, ', ');
    s = s.replace(/\s+/g, ' ').trim();

    // Check disqualified phrases
    const lower = s.toLowerCase();
    for (const dq of DISQUALIFIED) {
      if (lower.includes(dq)) return '';
    }

    // Must not be empty and must not match district/city/state
    if (!s || s.length < 2) return '';
    if (
      s.toLowerCase() === district.toLowerCase() ||
      s.toLowerCase() === city.toLowerCase() ||
      s.toLowerCase() === state.toLowerCase()
    ) {
      return '';
    }

    if (s.length > 55) {
      const parts = s.split(',');
      if (parts[0] && parts[0].trim().length >= 3 && parts[0].trim().length <= 50) {
        return parts[0].trim();
      }
      return s.slice(0, 50).trim();
    }

    return s;
  };

  // 1. Check parentheses in raw address (Naukri/Indeed format, e.g. "Coimbatore(Saibaba Colony", "New (Rohini")
  const parenMatches = rawAddress.match(/\(([^)]+)\)/g);
  if (parenMatches) {
    for (const p of parenMatches) {
      const cleaned = cleanCandidate(p.replace(/[()]/g, ''));
      if (cleaned) return cleaned;
    }
  }

  if (rawAddress.includes('(') && !rawAddress.includes(')')) {
    const afterParen = rawAddress.split('(').pop() || '';
    const cleaned = cleanCandidate(afterParen);
    if (cleaned) return cleaned;
  }

  // 2. Strip district, city, state directly from rawAddress
  if (rawAddress) {
    const cleaned = cleanCandidate(rawAddress);
    if (cleaned) return cleaned;
  }

  // 3. Check shortDescription for branch or campus mentions (e.g. Everwin's "branches in *Perambur*, *Kolathur*...")
  if (desc) {
    const branchMatch = desc.match(/(?:branches?|campus(?:es)?|centre|center)\s+(?:in|at)\s+([^\n\r:;.]+)/i);
    if (branchMatch && branchMatch[1]) {
      const cleaned = cleanCandidate(branchMatch[1]);
      if (cleaned) return cleaned;
    }

    const locMatch = desc.match(/(?:located\s+at|situated\s+at)\s+([^\n\r:;.]+)/i);
    if (locMatch && locMatch[1]) {
      const cleaned = cleanCandidate(locMatch[1]);
      if (cleaned) return cleaned;
    }
  }

  // 4. Fallback if no specific colony/sector/street is given:
  // Return "School Campus" so we never repeat District & State
  return 'School Campus';
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Format any salary (LPA, PA, Yearly, or Monthly) strictly as a Per-Month Range.
 * Examples:
 *  - "3.5 - 5 LPA" -> "₹29,167 - ₹41,667 / month"
 *  - "6 LPA" -> "₹50,000 / month"
 *  - "₹3,00,000 - ₹5,00,000 per year" -> "₹25,000 - ₹41,667 / month"
 *  - "₹25,000 - ₹35,000 per month" -> "₹25,000 - ₹35,000 / month"
 *  - "40k - 50k / mo" -> "₹40,000 - ₹50,000 / month"
 */
export function formatCleanSalary(raw?: string | null, isDetail = false): string {
  if (
    !raw ||
    raw.trim() === '' ||
    raw.trim() === '---' ||
    raw.trim().toLowerCase() === 'n/a' ||
    raw.toLowerCase().includes('not disclosed')
  ) {
    return isDetail ? 'Not Disclosed (As per School Norms)' : 'Not Disclosed';
  }

  let s = raw.trim();

  // If accidentally passed a long text paragraph, extract salary/pay segment first
  if (s.length > 70) {
    const payMatch = s.match(/(?:pay|salary|ctc|stipend|remuneration)\s*[:\-–]?\s*([^\n\r]{3,60})/i);
    if (payMatch) {
      s = payMatch[1].trim();
    } else {
      // Look for any ₹ pattern
      const rMatch = s.match(/₹\s*[\d\.,]+\s*(?:[-–—to]+\s*₹?\s*[\d\.,]+)?(?:\s*(?:k|lpa|lacs?|lakhs?|per\s*(?:month|year)|p\.?a\.?|\/\s*(?:mo|month|yr)))?/i);
      if (rMatch) {
        s = rMatch[0].trim();
      } else {
        return isDetail ? 'Not Disclosed (As per School Norms)' : 'Not Disclosed';
      }
    }
  }

  // 1. Pattern: Range in LPA / Lacs PA (e.g. ₹3.5 - 5 LPA, 4-6 Lacs PA, 2.5 - 3.5 Lakhs)
  const lpaRange = s.match(/₹?\s*([\d\.]+)\s*(?:lpa|lakhs?|lacs?)?\s*[-–—to]+\s*₹?\s*([\d\.]+)\s*(?:lpa|lakhs?|lacs?)\s*(?:pa|p\.a\.|per\s*annum)?/i);
  if (lpaRange) {
    const v1 = parseFloat(lpaRange[1]);
    const v2 = parseFloat(lpaRange[2]);
    if (!isNaN(v1) && !isNaN(v2) && v1 < 100 && v2 < 100) {
      const m1 = Math.round((v1 * 100000) / 12);
      const m2 = Math.round((v2 * 100000) / 12);
      if (m1 === m2) {
        return `₹${m1.toLocaleString('en-IN')} / month`;
      }
      return `₹${m1.toLocaleString('en-IN')} - ₹${m2.toLocaleString('en-IN')} / month`;
    }
  }

  // 2. Pattern: Single LPA (e.g. 6 LPA, ₹5.5 Lakhs PA)
  const singleLpa = s.match(/₹?\s*([\d\.]+)\s*(?:lpa|lakhs?|lacs?)\s*(?:pa|p\.a\.|per\s*annum)?/i);
  if (singleLpa) {
    const v = parseFloat(singleLpa[1]);
    if (!isNaN(v) && v < 100) {
      const m = Math.round((v * 100000) / 12);
      return `₹${m.toLocaleString('en-IN')} / month`;
    }
  }

  // 3. Pattern: Full Annual INR range (e.g. ₹3,00,000 - ₹5,00,000 per year / PA)
  const annualRange = s.match(/₹?\s*([\d,]+(?:\.\d+)?)\s*[-–—to]+\s*₹?\s*([\d,]+(?:\.\d+)?)\s*(?:per\s*year|p\.?a\.?|per\s*annum|\/\s*yr)/i);
  if (annualRange) {
    const v1 = parseFloat(annualRange[1].replace(/,/g, ''));
    const v2 = parseFloat(annualRange[2].replace(/,/g, ''));
    if (!isNaN(v1) && !isNaN(v2)) {
      const m1 = Math.round(v1 / 12);
      const m2 = Math.round(v2 / 12);
      if (m1 === m2) {
        return `₹${m1.toLocaleString('en-IN')} / month`;
      }
      return `₹${m1.toLocaleString('en-IN')} - ₹${m2.toLocaleString('en-IN')} / month`;
    }
  }

  // 4. Pattern: Monthly "k" shorthand (e.g. 40k - 50k / mo, ₹30k/mo)
  const kMonthly = s.match(/₹?\s*(\d+)\s*k?\s*[-–—to]*\s*₹?\s*(\d*)\s*k\s*(?:\/\s*mo|\/\s*month|per\s*month)?/i);
  if (kMonthly) {
    let v1 = parseInt(kMonthly[1], 10);
    let v2 = kMonthly[2] ? parseInt(kMonthly[2], 10) : null;
    if (v1 < 1000) v1 *= 1000;
    if (v2 && v2 < 1000) v2 *= 1000;
    if (v2 && v1 !== v2) {
      return `₹${v1.toLocaleString('en-IN')} - ₹${v2.toLocaleString('en-IN')} / month`;
    }
    return `₹${v1.toLocaleString('en-IN')} / month`;
  }

  // 5. Pattern: Standard Monthly numeric range (e.g. ₹20,000.00 - ₹35,000.00 per month)
  const numMonthly = s.match(/₹?\s*([\d,]+(?:\.\d+)?)\s*[-–—to]+\s*₹?\s*([\d,]+(?:\.\d+)?)\s*(?:per\s*month|\/\s*mo|\/\s*month|pm|p\.m\.)/i);
  if (numMonthly) {
    const v1 = Math.round(parseFloat(numMonthly[1].replace(/,/g, '')));
    const v2 = Math.round(parseFloat(numMonthly[2].replace(/,/g, '')));
    if (v1 === v2) {
      return `₹${v1.toLocaleString('en-IN')} / month`;
    }
    return `₹${v1.toLocaleString('en-IN')} - ₹${v2.toLocaleString('en-IN')} / month`;
  }

  // 6. Pattern: Single numeric monthly (e.g. ₹35,000 per month)
  const singleMonthly = s.match(/₹?\s*([\d,]+(?:\.\d+)?)\s*(?:per\s*month|\/\s*mo|\/\s*month|pm|p\.m\.)/i);
  if (singleMonthly) {
    const v = Math.round(parseFloat(singleMonthly[1].replace(/,/g, '')));
    return `₹${v.toLocaleString('en-IN')} / month`;
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
