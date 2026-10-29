import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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
          const matchKey = candidateKey && (c.magic_key === candidateKey || c.visual_edit_token === candidateKey);
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

  // 3. Verify against Supabase school_profiles (Permanent Storage)
  if (cleanUdise) {
    try {
      const { data: profRow } = await schoolSearchSupabase
        .from('school_profiles')
        .select('profile_data, is_claimed, claimed_by')
        .eq('udise_code', cleanUdise)
        .maybeSingle();

      if (profRow) {
        const pData =
          typeof profRow.profile_data === 'string'
            ? JSON.parse(profRow.profile_data)
            : profRow.profile_data || {};

        // A. Magic Key Check
        const magicAuth = pData?.magicAuth;
        if (
          candidateKey &&
          magicAuth &&
          magicAuth.status === 'approved' &&
          magicAuth.isApproved === true &&
          magicAuth.magicKey &&
          magicAuth.magicKey === candidateKey
        ) {
          return { authorized: true, mode: 'magic_link' };
        }

        // B. User Identity / Email Check for Claimed School
        if (profRow.is_claimed) {
          if (queryUserEmail && profRow.claimed_by && profRow.claimed_by.toLowerCase() === queryUserEmail) {
            return { authorized: true, mode: 'owner' };
          }
          if (magicAuth && queryUserEmail && magicAuth.claimantEmail && magicAuth.claimantEmail.toLowerCase() === queryUserEmail) {
            return { authorized: true, mode: 'owner' };
          }
        }

        // C. Check approved claimRequests in profile_data
        if (Array.isArray(pData.claimRequests)) {
          const approvedReq = pData.claimRequests.find(
            (cr: any) =>
              cr.status === 'approved' &&
              ((queryUserId && cr.user_id && String(cr.user_id) === String(queryUserId)) ||
                (queryUserEmail && cr.claimant_email && cr.claimant_email.toLowerCase() === queryUserEmail))
          );
          if (approvedReq) {
            return { authorized: true, mode: 'owner' };
          }
        }
      }
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
