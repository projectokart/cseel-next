/**
 * Pure TypeScript Salary Utility (Client & Server Safe - Zero Node.js 'fs' Dependencies)
 * Calculates unified annual salary (in INR) for 100% accurate sorting and filtering.
 *
 * Rules:
 * - If salary is monthly (/mo, per month, pm), multiplies by 12.
 * - If salary is yearly (LPA, lakhs, pa), converts to full INR scale (e.g. 15 LPA -> 1,500,000).
 * - If salary is not disclosed, missing, or '---', returns 0.
 */
export function getAnnualSalaryNumber(
  salaryStr?: string | null,
  fallbackMax?: number | null
): { min: number; max: number } {
  if (!salaryStr || salaryStr === '---' || salaryStr.toLowerCase().includes('not disclosed')) {
    return { min: 0, max: 0 };
  }

  const raw = salaryStr.toLowerCase();
  const isMonthly = /(?:\/mo|\/month|per\s*month|pm|p\.m\.)/.test(raw);
  const clean = raw.replace(/[₹,\s]|rs\.?|inr/gi, '');

  // 1. LPA / Lakhs pattern: e.g. "₹12.0 - ₹18.0 LPA", "10.5 to 15 Lakhs", "8 LPA"
  const lpaRange = clean.match(/(\d+(?:\.\d+)?)[-–—to]+(\d+(?:\.\d+)?)(?:lpa|lakh|lac)/);
  if (lpaRange) {
    const minLakh = parseFloat(lpaRange[1]);
    const maxLakh = parseFloat(lpaRange[2]);
    return {
      min: Math.round(minLakh * 100000),
      max: Math.round(maxLakh * 100000),
    };
  }

  const singleLpa = clean.match(/(\d+(?:\.\d+)?)(?:lpa|lakh|lac)/);
  if (singleLpa) {
    const val = Math.round(parseFloat(singleLpa[1]) * 100000);
    return { min: val, max: val };
  }

  // 2. Numeric range e.g. "32500-38000", "20k-30k"
  const rangeMatch = clean.match(/(\d+(?:\.\d+)?)(k)?[-–—to]+(\d+(?:\.\d+)?)(k)?/);
  if (rangeMatch) {
    let v1 = parseFloat(rangeMatch[1]);
    if (rangeMatch[2]) v1 *= 1000;
    else if (v1 < 500 && isMonthly) v1 *= 1000;

    let v2 = parseFloat(rangeMatch[3]);
    if (rangeMatch[4]) v2 *= 1000;
    else if (v2 < 500 && isMonthly) v2 *= 1000;

    if (isMonthly || v2 <= 150000) {
      return {
        min: Math.round(v1 * 12),
        max: Math.round(v2 * 12),
      };
    } else {
      return {
        min: Math.round(v1),
        max: Math.round(v2),
      };
    }
  }

  // 3. Single numeric figure e.g. "15000" or "40k/mo"
  const singleMatch = clean.match(/(\d+(?:\.\d+)?)(k)?/);
  if (singleMatch) {
    let v = parseFloat(singleMatch[1]);
    if (singleMatch[2]) v *= 1000;
    else if (v < 500 && isMonthly) v *= 1000;

    if (isMonthly || (v > 1000 && v <= 150000)) {
      return {
        min: Math.round(v * 12),
        max: Math.round(v * 12),
      };
    }
    return { min: Math.round(v), max: Math.round(v) };
  }

  if (fallbackMax && fallbackMax > 0) {
    return { min: fallbackMax, max: fallbackMax };
  }

  return { min: 0, max: 0 };
}
