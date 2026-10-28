import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/services/mailerService';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface StoredOtp {
  otp: string;
  token: string;
  expiresAt: number;
  redirect?: string;
  failedAttempts: number;
}

interface RateLimitTracker {
  timestamps: number[];
  lastSent: number;
}

// In-memory OTP storage
const otpStore = new Map<string, StoredOtp>();

// Rate limit trackers
const emailRateLimits = new Map<string, RateLimitTracker>();
const ipRateLimits = new Map<string, number[]>();

// Configuration Limits
const COOLDOWN_SECONDS = 60; // 60s cooldown between dispatches
const MAX_PER_HOUR_EMAIL = 5; // Max 5 OTPs per email per 60 minutes
const MAX_PER_HOUR_IP = 15; // Max 15 OTP requests per IP per 60 minutes
const MAX_FAILED_ATTEMPTS = 5; // Max 5 incorrect guesses before invalidation

// Helper to extract client IP
function getClientIp(req: NextRequest): string {
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  const xForwarded = req.headers.get('x-forwarded-for');
  if (xForwarded) return xForwarded.split(',')[0].trim();
  return 'unknown';
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  // Cleanup expired OTPs
  for (const [email, item] of otpStore.entries()) {
    if (now > item.expiresAt) otpStore.delete(email);
  }

  // Cleanup rate limits
  for (const [email, tracker] of emailRateLimits.entries()) {
    tracker.timestamps = tracker.timestamps.filter(t => t > oneHourAgo);
    if (tracker.timestamps.length === 0 && now - tracker.lastSent > oneHourAgo) {
      emailRateLimits.delete(email);
    }
  }

  for (const [ip, timestamps] of ipRateLimits.entries()) {
    const fresh = timestamps.filter(t => t > oneHourAgo);
    if (fresh.length === 0) ipRateLimits.delete(ip);
    else ipRateLimits.set(ip, fresh);
  }
}, 5 * 60 * 1000); // every 5 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'send';
    const email = (body.email || '').trim().toLowerCase();
    const clientIp = getClientIp(req);
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────────────────────
    // 1. ACTION: SEND OTP (WITH MULTI-LAYER RATE LIMITING)
    // ─────────────────────────────────────────────────────────────
    if (action === 'send') {
      // Rule 1: Check IP rate limit (max 15/hour)
      const ipTimestamps = (ipRateLimits.get(clientIp) || []).filter(t => t > oneHourAgo);
      if (ipTimestamps.length >= MAX_PER_HOUR_IP) {
        return NextResponse.json(
          {
            success: false,
            error: 'Too many requests from your network. Please wait 1 hour or continue with Google / Password.',
          },
          { status: 429 }
        );
      }

      // Rule 2: Check Email rate limit (max 5/hour & 60s cooldown)
      const emailTracker = emailRateLimits.get(email) || { timestamps: [], lastSent: 0 };
      const freshEmailTimestamps = emailTracker.timestamps.filter(t => t > oneHourAgo);

      // Check 60s cooldown
      const elapsedSinceLast = now - emailTracker.lastSent;
      if (elapsedSinceLast < COOLDOWN_SECONDS * 1000) {
        const secondsRemaining = Math.ceil((COOLDOWN_SECONDS * 1000 - elapsedSinceLast) / 1000);
        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${secondsRemaining}s before requesting another verification code.`,
          },
          { status: 429 }
        );
      }

      // Check max per hour for email
      if (freshEmailTimestamps.length >= MAX_PER_HOUR_EMAIL) {
        return NextResponse.json(
          {
            success: false,
            error: 'Hourly verification limit reached for this email (max 5). Please try again after 1 hour or sign in with your password.',
          },
          { status: 429 }
        );
      }

      // Generate secure 6-digit OTP and unique magic link token
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const token = crypto.randomBytes(24).toString('hex');
      const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry
      const redirect = body.redirect || '';

      otpStore.set(email, {
        otp,
        token,
        expiresAt,
        redirect,
        failedAttempts: 0,
      });

      // Update rate limit trackers
      freshEmailTimestamps.push(now);
      emailRateLimits.set(email, {
        timestamps: freshEmailTimestamps,
        lastSent: now,
      });

      ipTimestamps.push(now);
      ipRateLimits.set(clientIp, ipTimestamps);

      // Build 1-click magic link
      const origin = req.nextUrl.origin || 'https://www.cseel.org';
      const magicLink = `${origin}/login?email=${encodeURIComponent(email)}&otp=${otp}&token=${token}&redirect=${encodeURIComponent(redirect)}`;

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CSEEL Verification Code</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
          <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background: #003c6e; padding: 28px 24px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: -0.02em;">CSEEL EduNetwork Security</h1>
              <p style="color: #93c5fd; font-size: 13px; margin: 6px 0 0 0;">Authentication & Verification Service</p>
            </div>
            
            <div style="padding: 32px 28px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0;">Your Verification Code</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                Use the 6-digit One-Time Password (OTP) below to authenticate to your CSEEL account. This code is confidential and valid for <strong>10 minutes</strong>.
              </p>
              
              <div style="background: #f0f7fb; border: 2px dashed #006fcc; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 28px;">
                <span style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #003c6e; font-family: monospace;">${otp}</span>
              </div>

              <div style="text-align: center; margin-bottom: 24px;">
                <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Or log in with 1-click using this secure magic link:</p>
                <a href="${magicLink}" style="display: inline-block; background: #004A75; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 2px 4px rgba(0, 74, 117, 0.2);">
                  Sign In with Magic Link
                </a>
              </div>

              <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 24px 0 0 0; border-top: 1px solid #f1f5f9; pt-4;">
                If you did not request this code, no action is needed. Your account remains secure.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailResult = await sendEmail({
        to: email,
        subject: `Your CSEEL Login OTP: ${otp}`,
        html,
      });

      if (!mailResult.success) {
        console.error('[API email-otp] Failed to send email:', mailResult.error);
        return NextResponse.json(
          { success: false, error: 'Could not send verification email. Please check your address or try again.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `OTP sent successfully to ${email}.`,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. ACTION: VERIFY OTP (WITH BRUTE-FORCE PROTECTION)
    // ─────────────────────────────────────────────────────────────
    if (action === 'verify') {
      const inputOtp = (body.otp || '').trim();
      const inputToken = (body.token || '').trim();

      const stored = otpStore.get(email);
      if (!stored) {
        return NextResponse.json(
          { success: false, error: 'No active OTP request found for this email. Please request a new code.' },
          { status: 400 }
        );
      }

      if (now > stored.expiresAt) {
        otpStore.delete(email);
        return NextResponse.json(
          { success: false, error: 'The verification code has expired (10 minutes limit). Please request a new code.' },
          { status: 400 }
        );
      }

      // Check max failed attempts (Brute-force protection)
      if (stored.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        otpStore.delete(email);
        return NextResponse.json(
          {
            success: false,
            error: 'Too many incorrect attempts. This code has been invalidated for security. Please request a new code.',
          },
          { status: 400 }
        );
      }

      const isOtpMatch = inputOtp && inputOtp === stored.otp;
      const isTokenMatch = inputToken && inputToken === stored.token;

      if (!isOtpMatch && !isTokenMatch) {
        stored.failedAttempts += 1;
        const attemptsLeft = MAX_FAILED_ATTEMPTS - stored.failedAttempts;
        return NextResponse.json(
          {
            success: false,
            error: `Invalid verification code. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining.`,
          },
          { status: 400 }
        );
      }

      // Consumed: delete single-use OTP
      otpStore.delete(email);

      // Create or lookup user in Firebase Auth via IdentityToolkit
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBiaOs0DLw7ZuuGEj31Udev8bvGu4tIhW4';
      let firebaseUid = '';

      try {
        const securePassword = `Cseel_Otp_${crypto.createHash('sha256').update(email + apiKey).digest('hex').slice(0, 16)}!`;
        const signupRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: securePassword, returnSecureToken: true }),
        });

        const signupData = await signupRes.json();
        if (signupRes.ok && signupData.localId) {
          firebaseUid = signupData.localId;
        } else if (signupData.error?.message?.includes('EMAIL_EXISTS')) {
          const signinRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: securePassword, returnSecureToken: true }),
          });
          const signinData = await signinRes.json();
          if (signinData.localId) {
            firebaseUid = signinData.localId;
          }
        }
      } catch (fbErr) {
        console.warn('[API email-otp] Firebase user sync warning:', fbErr);
      }

      return NextResponse.json({
        success: true,
        email,
        uid: firebaseUid || `otp_${Date.now()}`,
        redirect: stored.redirect || '/schools',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('[API email-otp] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
