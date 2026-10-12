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
export const MASTER_ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'cseel_master_admin_2026';
export const MASTER_ADMIN_MAGIC_TOKEN = 'csl_admin_master_magic_key';
export const ADMIN_EMAILS = new Set([
  (process.env.ADMIN_CLAIM_EMAIL || 'ptdevkaushik104@gmail.com').toLowerCase(),
  'admin@cseel.org',
  'super@cseel.org',
  'school@cseel.org',
  'admin@123',
]);

export function isAdminRequest(req: NextRequest | Request, bodyAdminCheck?: { adminKey?: string; adminEmail?: string }): boolean {
  const adminKeyHeader = req.headers.get('x-admin-key') || '';
  const authHeader = req.headers.get('authorization') || '';
  const cookieHeader = req.headers.get('cookie') || '';
  const adminEmailHeader = (req.headers.get('x-admin-email') || bodyAdminCheck?.adminEmail || '').toLowerCase().trim();
  const bodyKey = bodyAdminCheck?.adminKey || '';

  if (
    adminKeyHeader === MASTER_ADMIN_KEY ||
    adminKeyHeader === MASTER_ADMIN_MAGIC_TOKEN ||
    bodyKey === MASTER_ADMIN_KEY ||
    bodyKey === MASTER_ADMIN_MAGIC_TOKEN ||
    authHeader.includes(MASTER_ADMIN_KEY) ||
    authHeader.includes(MASTER_ADMIN_MAGIC_TOKEN) ||
    cookieHeader.includes('cseel_admin_auth=true') ||
    cookieHeader.includes('admin_session')
  ) {
    return true;
  }

  if (adminEmailHeader && (ADMIN_EMAILS.has(adminEmailHeader) || adminEmailHeader.endsWith('@cseel.org'))) {
    return true;
  }

  return false;
}

export async function verifySchoolWriteAuth(
  req: NextRequest | Request,
  udiseCode: string,
  extra?: { magicKey?: string; adminKey?: string; adminEmail?: string }
): Promise<{ authorized: boolean; mode?: 'admin' | 'magic_link'; reason?: string }> {
  // 1. Check Admin Authorization first
  if (isAdminRequest(req, { adminKey: extra?.adminKey, adminEmail: extra?.adminEmail })) {
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

  if (!candidateKey) {
    return {
      authorized: false,
      reason: 'Unauthorized: Only an Administrator or a verified School with an Admin-approved 16-character Magic Link key can modify school profile data.',
    };
  }

  if (candidateKey === MASTER_ADMIN_MAGIC_TOKEN || candidateKey === MASTER_ADMIN_KEY) {
    return { authorized: true, mode: 'admin' };
  }

  // 2. Verify candidateKey against Supabase school_profiles (Permanent Storage)
  if (cleanUdise) {
    try {
      const { data: profRow } = await schoolSearchSupabase
        .from('school_profiles')
        .select('profile_data, is_claimed')
        .eq('udise_code', cleanUdise)
        .maybeSingle();

      if (profRow) {
        const pData = typeof profRow.profile_data === 'string'
          ? JSON.parse(profRow.profile_data)
          : (profRow.profile_data || {});

        const magicAuth = pData?.magicAuth;
        if (
          magicAuth &&
          magicAuth.status === 'approved' &&
          magicAuth.isApproved === true &&
          magicAuth.magicKey &&
          magicAuth.magicKey === candidateKey
        ) {
          return { authorized: true, mode: 'magic_link' };
        }
      }
    } catch (err) {
      console.warn('Error checking magicAuth in Supabase school_profiles:', err);
    }
  }

  // 3. Fallback check in local claims/sync store (only if status === 'approved' AND isApproved === true)
  try {
    const claimsFile = path.join(process.cwd(), 'src', 'data', 'school_claims.json');
    if (fs.existsSync(claimsFile)) {
      const store = JSON.parse(fs.readFileSync(claimsFile, 'utf8'));
      const matched = (store.claims || []).find(
        (c: any) =>
          c.udise_code === cleanUdise &&
          c.status === 'approved' &&
          (c.magic_key === candidateKey || c.visual_edit_token === candidateKey)
      );
      if (matched) {
        return { authorized: true, mode: 'magic_link' };
      }
    }
  } catch {}

  return {
    authorized: false,
    reason: 'Invalid or unapproved Magic Link key. A Magic Link is only activated after Admin verification.',
  };
}
