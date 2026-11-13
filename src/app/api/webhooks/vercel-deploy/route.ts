import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { purgeCloudflareCache } from '@/lib/cache/cloudflarePurge';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const WARM_ENTRY_PATHS = [
  '/',
  '/schools',
  '/edu-network/teachers',
  '/school/karnataka/bengaluru-urban/bengaluru/29331008313/sri-vidyaranya-international-school',
];

function safeTimingEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyVercelSignature(rawBody: string, signatureHeader: string | null): boolean {
  const webhookSecret = process.env.VERCEL_WEBHOOK_SECRET;
  if (!webhookSecret || !signatureHeader) return false;
  const expected = crypto
    .createHmac('sha1', webhookSecret)
    .update(rawBody, 'utf8')
    .digest('hex');
  return safeTimingEqual(expected, signatureHeader.trim());
}

function verifyManualSecret(req: NextRequest): boolean {
  const secret = process.env.CSEEL_SECURITY_SECRET;
  if (!secret) return false;
  const auth = req.headers.get('authorization');
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const headerSecret = req.headers.get('x-purge-secret')?.trim() || '';
  const candidate = bearer || headerSecret;
  if (!candidate) return false;
  return safeTimingEqual(candidate, secret);
}

/**
 * Receives Vercel deployment webhooks (deployment.promoted / deployment.succeeded)
 * or authenticated purge triggers, purges Cloudflare edge cache automatically,
 * and warms key production routes with the newly deployed HTML.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const vercelSig = req.headers.get('x-vercel-signature');
  const isVercelVerified = verifyVercelSignature(rawBody, vercelSig);
  const isManualVerified = verifyManualSecret(req);

  if (!isVercelVerified && !isManualVerified) {
    return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED_WEBHOOK' },
      { status: 401 }
    );
  }

  let body: Record<string, any> = {};
  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    body = {};
  }

  const eventType = String(body.type || 'manual.purge');
  const payload = body.payload || {};
  const target = payload?.target || body.target;

  // Ignore non-production preview deployments so preview builds don't thrash live cache
  if (isVercelVerified && target && target !== 'production') {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: `Ignored non-production target (${target})`,
      eventType,
    });
  }

  // Only purge on deployment completion/promotion events when triggered by Vercel
  const allowedVercelEvents = new Set(['deployment.promoted', 'deployment.succeeded']);
  if (isVercelVerified && !allowedVercelEvents.has(eventType)) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: `Ignored event type (${eventType})`,
      eventType,
    });
  }

  const customWarmPaths = Array.isArray(body.warmUrls) ? body.warmUrls : WARM_ENTRY_PATHS;
  const result = await purgeCloudflareCache({
    purgeEverything: true,
    warmUrls: customWarmPaths,
  });

  if (!result.success) {
    return NextResponse.json(
      { success: false, eventType, ...result },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    eventType,
    deploymentId: payload?.deployment?.id || null,
    ...result,
  });
}
