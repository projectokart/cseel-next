import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import fs from 'fs';
import path from 'path';

// ── 1. Rate Limiting Store (In-Memory per IP + Route Category) ──
interface RateBucket {
  count: number;
  resetAt: number;
}

const RATE_BUCKETS = new Map<string, RateBucket>();

// Clean up expired buckets periodically
function cleanupBuckets() {
  if (RATE_BUCKETS.size < 2000) return;
  const now = Date.now();
  for (const [k, v] of RATE_BUCKETS.entries()) {
    if (now > v.resetAt) RATE_BUCKETS.delete(k);
  }
}

export function getClientIp(req: NextRequest | Request): string {
  const headers = req.headers;
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

// ── CSRF Origin Validation ──
// Checks that POST/PUT/PATCH/DELETE requests come from allowed origins.
// Allows: same-origin, configured NEXT_PUBLIC_APP_URL, localhost (dev).
// Returns a 403 NextResponse if the origin is disallowed, or null if OK.
export function checkCsrfOrigin(req: NextRequest | Request): NextResponse | null {
  const method = req.method?.toUpperCase();
  // Only apply to state-mutating methods
  if (!method || !['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return null;

  const origin = req.headers.get('origin') || '';
  const referer = req.headers.get('referer') || '';

  // Build the list of allowed origins from env
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || '').replace(/\/$/, '');
  const allowed = new Set<string>([
    'http://localhost:3000',
    'http://localhost:3001',
    'https://www.cseel.org',
    'https://cseel.org',
    'https://schoolsearch.cseel.org',
  ]);
  if (appUrl) allowed.add(appUrl);

  // If no origin header present, check referer (server-to-server requests and form submissions)
  const checkValue = origin || (referer ? new URL(referer).origin : '');

  // Allow requests with no origin (e.g. server-side calls, curl with admin key)
  if (!checkValue) return null;

  if (!allowed.has(checkValue)) {
    console.warn(`[CSRF] Blocked request from disallowed origin: ${checkValue} ${req.url}`);
    return NextResponse.json(
      { success: false, error: 'Forbidden: Cross-site request blocked.' },
      { status: 403 }
    );
  }
  return null;
}

// Known malicious/bulk scraping bot signatures
const SCRAPER_BOT_SIGNATURES = [
  'scrapy',
  'httrack',
  'harvest',
  'collector',
  'webcopier',
  'Teleport',
  'sqlmap',
  'nikto',
  'nmap',
  'masscan',
  'zgrab',
  'MJ12bot',
  'AhrefsBot',
  'SemrushBot',
  'DotBot',
  'BLEXBot',
  'PetalBot',
  'Bytespider',
];

export interface SecurityCheckOptions {
  bucketName: string;
  maxRequestsPerMinute?: number;
  blockScraperBots?: boolean;
}

export function checkRateLimitAndBots(
  req: NextRequest | Request,
  options: SecurityCheckOptions
): NextResponse | null {
  cleanupBuckets();

  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  if (options.blockScraperBots !== false) {
    for (const sig of SCRAPER_BOT_SIGNATURES) {
      if (ua.includes(sig.toLowerCase())) {
        return NextResponse.json(
          {
            success: false,
            error: 'FORBIDDEN_BOT_ACCESS',
            message: 'Automated data scraping and bulk harvesting bots are strictly prohibited.',
          },
          { status: 403 }
        );
      }
    }
  }

  const ip = getClientIp(req);
  const maxReqs = options.maxRequestsPerMinute || 60;
  const windowMs = 60 * 1000;
  const key = `${options.bucketName}:${ip}`;
  const now = Date.now();

  const existing = RATE_BUCKETS.get(key);
  if (!existing || now > existing.resetAt) {
    RATE_BUCKETS.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  existing.count += 1;
  if (existing.count > maxReqs) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return NextResponse.json(
      {
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: `Too many requests from this IP. Please retry after ${retryAfterSec} seconds.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': String(maxReqs),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  return null;
}

// ── 2. Deep Input Sanitizer (XSS & Injection Prevention) ──
export function sanitizePayloadDeep<T>(input: T): T {
  if (input === null || input === undefined) return input;
  if (typeof input === 'string') {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .trim() as unknown as T;
  }
  if (Array.isArray(input)) {
    return input.map((item) => sanitizePayloadDeep(item)) as unknown as T;
  }
  if (typeof input === 'object') {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(input as Record<string, any>)) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      out[k] = sanitizePayloadDeep(v);
    }
    return out as T;
  }
  return input;
}

// ── 3. Cryptographic 16-Character Mixed Magic Key Generator ──
// Strictly 16 characters containing Uppercase + Lowercase + Digits + Special Characters
export function generate16CharMixedMagicKey(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const special = '!@#$%^&*_-+=';
  const allChars = upper + lower + digits + special;

  // Guarantee at least 3 of each category + 4 from allChars = 16 chars
  const pick = (charset: string) => charset[crypto.randomInt(0, charset.length)];

  const rawChars: string[] = [
    pick(upper),
    pick(upper),
    pick(upper),
    pick(lower),
    pick(lower),
    pick(lower),
    pick(digits),
    pick(digits),
    pick(digits),
    pick(special),
    pick(special),
    pick(special),
    pick(allChars),
    pick(allChars),
    pick(allChars),
    pick(allChars),
  ];

  // Cryptographic Fisher-Yates shuffle
  for (let i = rawChars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    const temp = rawChars[i];
    rawChars[i] = rawChars[j];
    rawChars[j] = temp;
  }

  return rawChars.join('');
}

// Validate format of a 16-char mixed magic key
export function isValid16CharMagicKeyFormat(key: string | null | undefined): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (trimmed.length !== 16) return false;
  const hasUpper = /[A-Z]/.test(trimmed);
  const hasLower = /[a-z]/.test(trimmed);
  const hasDigit = /[0-9]/.test(trimmed);
  const hasSpecial = /[!@#$%^&*_\-+=~]/.test(trimmed);
  return hasUpper && hasLower && hasDigit && hasSpecial;
}

// ── 4. Admin & Magic Link Authorization Verification ──
export const MASTER_ADMIN_KEY = process.env.ADMIN_SECRET_KEY || '';
export const ADMIN_EMAILS = new Set([
  (process.env.ADMIN_CLAIM_EMAIL || '').toLowerCase(),
  'admin@cseel.org',
  'super@cseel.org',
  'school@cseel.org',
].filter(Boolean));

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = String(email).trim().toLowerCase();
  return (
    ADMIN_EMAILS.has(clean) ||
    clean.endsWith('@cseel.org')
  );
}

export function isAdminRequest(req: NextRequest | Request, bodyAdminCheck?: { adminKey?: string; adminEmail?: string }): boolean {
  if (!MASTER_ADMIN_KEY) {
    return false;
  }

  const adminKeyHeader = req.headers.get('x-admin-key') || '';
  const authHeader = req.headers.get('authorization') || '';
  const bodyKey = bodyAdminCheck?.adminKey || '';

  if (
    (adminKeyHeader && adminKeyHeader === MASTER_ADMIN_KEY) ||
    (bodyKey && bodyKey === MASTER_ADMIN_KEY) ||
    (authHeader.startsWith('Bearer ') && authHeader.substring(7).trim() === MASTER_ADMIN_KEY)
  ) {
    return true;
  }

  return false;
}

export async function verifySchoolWriteAuth(
  req: NextRequest | Request,
  udiseCode: string,
  extra?: {
    magicKey?: string;
    adminKey?: string;
    adminEmail?: string;
    userId?: string;
    userEmail?: string;
  }
): Promise<{ authorized: boolean; mode?: 'admin' | 'magic_link' | 'owner'; reason?: string }> {
  // 1. Check Admin Authorization first (requires valid MASTER_ADMIN_KEY)
  if (isAdminRequest(req, { adminKey: extra?.adminKey })) {
    return { authorized: true, mode: 'admin' };
  }

  const cleanUdise = String(udiseCode || '').replace(/\D/g, '').trim();
  const candidateKey = (
    extra?.magicKey ||
    req.headers.get('x-magic-key') ||
    req.headers.get('x-sync-token') ||
    new URL(req.url).searchParams.get('magicKey') ||
    new URL(req.url).searchParams.get('token') ||
    ''
  ).trim();

  // Admin Code: Only the MASTER_ADMIN_KEY (from env) grants admin access — no hardcoded bypasses
  if (MASTER_ADMIN_KEY && candidateKey === MASTER_ADMIN_KEY) {
    return { authorized: true, mode: 'admin' };
  }

  const queryUserId = (extra?.userId || req.headers.get('x-user-id') || '').trim();
  const queryUserEmail = (extra?.userEmail || '').trim().toLowerCase();

  // 2. Check Owner Authorization via local school_claims.json (Fast & Authoritative)
  if (cleanUdise) {
    try {
      const claimsFile = path.join(process.cwd(), 'src', 'data', 'school_claims.json');
      if (fs.existsSync(claimsFile)) {
        const store = JSON.parse(fs.readFileSync(claimsFile, 'utf8'));
        const matchedClaim = (store.claims || []).find((c: any) => {
          if (c.udise_code !== cleanUdise || c.status !== 'approved') return false;
          const matchKey = candidateKey && (
            c.magic_key === candidateKey ||
            c.visual_edit_token === candidateKey ||
            (c.magic_key && (c.magic_key.startsWith('$2a$') || c.magic_key.startsWith('$2b$')) && bcrypt.compareSync(candidateKey, c.magic_key))
          );
          const matchUser = queryUserId && c.user_id && String(c.user_id) === String(queryUserId);
          const matchEmail = queryUserEmail && c.claimant_email && c.claimant_email.toLowerCase() === queryUserEmail;
          return matchKey || matchUser || matchEmail;
        });

        if (matchedClaim) {
          return {
            authorized: true,
            mode: candidateKey ? 'magic_link' : 'owner',
          };
        }
      }
    } catch (err) {
      console.warn('Error reading school_claims.json in verifySchoolWriteAuth:', err);
    }
  }

  // 3. Verify against Supabase school_claims and school_profiles (Permanent Storage)
  if (cleanUdise) {
    try {
      // Check Supabase school_claims table first with bcrypt hash
      if (candidateKey) {
        const { data: claimRow } = await schoolSearchSupabase
          .from('school_claims')
          .select('id, udise_code, status, magic_key')
          .eq('udise_code', cleanUdise)
          .eq('status', 'approved')
          .maybeSingle();

        if (claimRow) {
          let isValid = false;
          if (claimRow.magic_key) {
            if (claimRow.magic_key.startsWith('$2a$') || claimRow.magic_key.startsWith('$2b$')) {
              isValid = bcrypt.compareSync(candidateKey, claimRow.magic_key);
            } else {
              isValid = claimRow.magic_key === candidateKey;
            }
          }
          if (isValid) {
            return { authorized: true, mode: 'magic_link' };
          }
        }
      }

      // Check school_profiles — NOTE: 'profile_data' column was removed in the 16-col schema migration.
      // This block is intentionally disabled. Auth relies on school_claims table (above) only.
      // If needed in future, re-enable after schema supports it.
      /*
      const { data: profRow } = await schoolSearchSupabase
        .from('school_profiles')
        .select('profile_data')
        .eq('udise_code', cleanUdise)
        .maybeSingle();

      if (profRow) {
        // ... (disabled — column does not exist)
      }
      */
    } catch (err) {
      console.warn('Error checking magicAuth in Supabase school_profiles:', err);
    }
  }

  if (!candidateKey && !queryUserId && !queryUserEmail) {
    return {
      authorized: false,
      reason: 'Unauthorized: Only an Administrator or a verified School Owner can modify school profile data.',
    };
  }

  return {
    authorized: false,
    reason: 'Access Denied: You are not authorized to edit this school profile. Only verified institutional owners or administrators have edit access.',
  };
}
