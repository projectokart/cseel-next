import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cloudflare Secret Key (default is official Cloudflare managed testing secret key)
const TURNSTILE_SECRET_KEY =
  process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';

// Strict IP rate limiter: max 5 submissions per IP per 30 minutes
const ipRateLimits = new Map<string, { count: number; resetTime: number }>();

function checkIpRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 30 * 60 * 1000; // 30 minutes
  const maxRequests = 5;

  const entry = ipRateLimits.get(ip);
  if (!entry || now > entry.resetTime) {
    ipRateLimits.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

// Bot user-agent signatures
const BOT_UA_PATTERNS = [
  /python-requests/i,
  /aiohttp/i,
  /curl\//i,
  /wget\//i,
  /postmanruntime/i,
  /insomnia/i,
  /headlesschrome/i,
  /phantomjs/i,
  /puppeteer/i,
  /playwright/i,
  /selenium/i,
  /bot\b/i,
  /crawler/i,
  /spider/i,
  /httpclient/i,
  /scrappy/i,
  /urllib/i,
];

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get('user-agent') || '';
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    const clientIp = cfConnectingIp || (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || '127.0.0.1';

    // ── DEFENSE LAYER 1: STRICT IP RATE LIMITING (5 SUBMISSIONS / 30 MIN) ──
    const rateLimit = checkIpRateLimit(clientIp);
    if (!rateLimit.allowed) {
      console.warn(`[Security Armor] Rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded: Only 5 submissions permitted per 30 minutes from this IP.',
          code: 'RATE_LIMIT_EXCEEDED',
        },
        { status: 429 }
      );
    }

    // ── DEFENSE LAYER 2: BOT & HEADLESS SCRAPER INTERCEPTION ──
    const isBotUa = BOT_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
    if (!userAgent || isBotUa) {
      console.warn(`[Security Armor] Automated bot detected and intercepted: UA="${userAgent}" IP=${clientIp}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Automated script or bot access detected and blocked by Cloudflare defense armor.',
          code: 'AUTOMATED_BOT_DETECTED',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      phone,
      designation,
      subject,
      board,
      qualification,
      experienceYears,
      state,
      city,
      district,
      pastSchools,
      skills,
      expectedSalary,
      bio,
      avatarUrl,
      // Security defense tokens
      turnstileToken,
      website_company_trap, // Honeypot field
      clientTimestamp,
    } = body;

    // ── DEFENSE LAYER 3: INVISIBLE HONEYPOT TRAP ──
    if (website_company_trap && String(website_company_trap).trim() !== '') {
      console.warn(`[Security Armor] Honeypot triggered by bot from IP: ${clientIp}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Automated submission rejected.',
          code: 'HONEYPOT_BLOCKED',
        },
        { status: 400 }
      );
    }

    // ── DEFENSE LAYER 4: UNNATURAL SPEED TRAP (< 1200ms) ──
    if (clientTimestamp) {
      const elapsed = Date.now() - Number(clientTimestamp);
      if (elapsed < 1200) {
        return NextResponse.json(
          {
            success: false,
            error: 'Submission blocked: Human interaction timing threshold not met.',
            code: 'RAPID_SUBMISSION_REJECTED',
          },
          { status: 400 }
        );
      }
    }

    // ── DEFENSE LAYER 5: CLOUDFLARE TURNSTILE TOKEN VERIFICATION ──
    if (!turnstileToken || typeof turnstileToken !== 'string' || turnstileToken.trim().length < 15) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cloudflare verification missing or invalid. Please solve the human verification check.',
          code: 'TURNSTILE_TOKEN_MISSING',
        },
        { status: 403 }
      );
    }

    // Detect obviously fake tokens sent by bots
    if (/fake|dummy|test_token|bypass|mock/i.test(turnstileToken)) {
      console.warn(`[Security Armor] Bot attempted fake token injection: "${turnstileToken}" from IP: ${clientIp}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Cloudflare Turnstile verification rejected: Fraudulent token detected.',
          code: 'FRAUDULENT_TOKEN_BLOCKED',
        },
        { status: 403 }
      );
    }

    // ── Cloudflare Turnstile: ALWAYS verify via real CF siteverify API ──
    // No bypass allowed — every token must be validated server-side
    try {
      const verifyParams = new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip: clientIp,
      });

      const cfResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: verifyParams,
      });

      const cfResult = await cfResponse.json();

      if (!cfResult.success) {
        console.warn(`[Security Armor] Cloudflare Turnstile verification rejected:`, cfResult);
        return NextResponse.json(
          {
            success: false,
            error: 'Cloudflare security verification failed. Please refresh and try again.',
            code: 'TURNSTILE_VERIFICATION_FAILED',
            details: cfResult['error-codes'] || [],
          },
          { status: 403 }
        );
      }
    } catch (cfErr: any) {
      console.error('[Security Armor] Error communicating with Cloudflare siteverify:', cfErr);
      return NextResponse.json(
        { success: false, error: 'Verification service unavailable. Please try again.', code: 'CF_SERVICE_ERROR' },
        { status: 503 }
      );
    }

    // ── DEFENSE LAYER 6: DATA VALIDATION & PHONE REGEX ──
    const cleanName = String(name || '').trim();
    if (!cleanName || cleanName.length < 2 || cleanName.length > 60) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid educator name (2-60 characters).', code: 'INVALID_NAME' },
        { status: 422 }
      );
    }

    const cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
    const phoneValid = /^[6-9]\d{9}$/.test(cleanPhone);
    if (!phoneValid) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number.', code: 'INVALID_PHONE' },
        { status: 422 }
      );
    }

    // ── DEFENSE LAYER 7: ONE PROFILE PER USER (CHECK DUPLICATE EMAIL OR PHONE) ──
    const isEdit = Boolean(body.isEdit);
    const editingProfileId = body.profileId ? String(body.profileId) : null;
    const cleanEmail = String(email || '').trim().toLowerCase();
    const duplicateFilters: string[] = [];
    if (cleanEmail) duplicateFilters.push(`email.eq.${encodeURIComponent(cleanEmail)}`);
    if (cleanPhone) duplicateFilters.push(`phone.eq.${cleanPhone}`);

    let matchedExistingId: string | null = editingProfileId;

    if (duplicateFilters.length > 0) {
      try {
        const dupQuery = duplicateFilters.length === 1 ? duplicateFilters[0] : `or=(${duplicateFilters.join(',')})`;
        const dupCheckRes = await fetch(`${SUPABASE_URL}/rest/v1/teachers?${dupQuery}&select=id,name,email,phone,verified`, {
          headers: {
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
          signal: AbortSignal.timeout(5000),
        });
        if (dupCheckRes.ok) {
          const dupRows = await dupCheckRes.json();
          if (Array.isArray(dupRows) && dupRows.length > 0) {
            const conflict = dupRows.find((r: any) => {
              if (isEdit && editingProfileId && String(r.id) === editingProfileId) return false;
              if (isEdit && cleanEmail && r.email?.toLowerCase() === cleanEmail) return false;
              return true;
            });

            if (conflict) {
              return NextResponse.json(
                {
                  success: false,
                  error: 'A faculty profile is already registered with this mobile number or email. Each educator is allowed strictly 1 profile.',
                  code: 'DUPLICATE_PROFILE_NOT_ALLOWED',
                },
                { status: 409 }
              );
            }

            if (!matchedExistingId && dupRows[0]?.id) {
              matchedExistingId = String(dupRows[0].id);
            }
          }
        }
      } catch (dupErr) {
        console.warn('[Duplicate Check Error]:', dupErr);
      }
    }

    // XSS / Injection Check
    const combinedContent = `${cleanName} ${bio || ''} ${skills || ''} ${qualification || ''}`;
    if (/<script|javascript:|onerror=|onload=|<iframe|<object/i.test(combinedContent)) {
      return NextResponse.json(
        { success: false, error: 'Executable scripts and HTML tags are forbidden.', code: 'XSS_ATTACK_DETECTED' },
        { status: 400 }
      );
    }

    // ── DATABASE PERSISTENCE: ACTUAL INSERTION INTO SUPABASE (PENDING ADMIN VERIFICATION) ──
    const teacherSlug = `teacher-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const maskedPhone = `+91 ${cleanPhone.charAt(0)}*********`;
    const skillsList = skills ? String(skills).split(',').map((s) => s.trim()).filter(Boolean) : ['Pedagogy', 'STEM'];

    const dbPayload = {
      name: cleanName,
      slug: teacherSlug,
      phone: cleanPhone,
      email: String(email || '').trim(),
      subject: `${subject || 'STEM'} (${designation || 'Faculty'})`,
      qualification: String(qualification || 'Post Graduate / B.Ed').trim(),
      experience_years: Number(experienceYears) || 3,
      current_institute: String(pastSchools || 'Senior Secondary School').trim(),
      city: city || district || 'Delhi NCR',
      state: state || 'Delhi NCR',
      expected_salary: expectedSalary || '₹6 - ₹9 LPA',
      verified: false, // Held in Pending Admin Verification state
      bio: String(bio || `${designation || 'Teacher'} in ${subject || 'STEM'}`).trim(),
      specializations: skillsList,
      avatar_url: avatarUrl || undefined,
    };

    let insertedRecord: any = null;

    try {
      const endpoint = isEdit && matchedExistingId
        ? `${SUPABASE_URL}/rest/v1/teachers?id=eq.${encodeURIComponent(matchedExistingId)}`
        : `${SUPABASE_URL}/rest/v1/teachers`;
      const method = isEdit && matchedExistingId ? 'PATCH' : 'POST';

      const supabaseRes = await fetch(endpoint, {
        method,
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(dbPayload),
        signal: AbortSignal.timeout(8000),
      });

      if (supabaseRes.ok) {
        const rows = await supabaseRes.json();
        if (Array.isArray(rows) && rows.length > 0) {
          insertedRecord = rows[0];
        }
      } else {
        const errText = await supabaseRes.text();
        console.warn('[Supabase Write Warning]:', supabaseRes.status, errText);
      }
    } catch (dbErr) {
      console.warn('[Supabase Write Network Error]:', dbErr);
    }

    // ── STRICT DB CONFIRMATION CHECK: No fake success allowed ──
    if (!insertedRecord) {
      console.error('[Faculty Register] Supabase write failed — no record returned. Returning real error to client.');
      return NextResponse.json(
        {
          success: false,
          error: 'We could not save your profile due to a server error. Please try again in a few moments.',
          code: 'DB_WRITE_FAILED',
        },
        { status: 503 }
      );
    }

    // Return success ONLY when Supabase confirmed the insertion
    return NextResponse.json(
      {
        success: true,
        message: isEdit
          ? 'Profile updated successfully! Submitted for re-verification.'
          : 'Thank you! Successfully submitted for verification.',
        adminVerificationPending: true,
        educator: {
          id: insertedRecord.id || matchedExistingId || teacherSlug,
          slug: insertedRecord.slug || teacherSlug,
          name: cleanName,
          phone: maskedPhone,
          designation: designation || 'PGT',
          subject: subject || 'Physics',
          board: board || 'CBSE',
          qualification: qualification || 'Post Graduate / B.Ed',
          experienceYears: Number(experienceYears) || 3,
          currentInstitute: pastSchools || 'Senior Secondary School',
          city: city || district || 'Delhi NCR',
          state: state || 'Delhi NCR',
          verified: false,
          avatar: avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
          bio: bio || `${cleanName} is an educator in ${subject || 'Physics'}.`,
          skills: skillsList,
          expectedSalary: expectedSalary || '₹6 - ₹9 LPA',
          rating: 0,
          reviewsCount: 0,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[/api/faculty/register] Server error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
