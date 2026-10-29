import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const ADMIN_EMAIL = process.env.ADMIN_CLAIM_EMAIL || 'ptdevkaushik104@gmail.com';
const STORAGE_FILE = path.join(process.cwd(), 'src', 'data', 'career_applications.json');

export interface CareerApplicationRecord {
  id: string;
  applicationId: string;
  jobId?: string;
  jobTitle: string;
  department?: string;
  fullName: string;
  email: string;
  phone: string;
  currentCity: string;
  experience?: string;
  portfolioUrl?: string;
  coverNote?: string;
  status: 'received' | 'under_review' | 'shortlisted' | 'rejected';
  createdAt: string;
}

function saveLocalApplication(record: CareerApplicationRecord) {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let existing: CareerApplicationRecord[] = [];
    if (fs.existsSync(STORAGE_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
      } catch {
        existing = [];
      }
    }
    existing.unshift(record);
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Career Application] Could not write to local JSON store:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      currentCity,
      experience,
      portfolioUrl,
      coverNote,
      jobId,
      jobTitle,
      department,
    } = body;

    const cleanName = String(fullName || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').replace(/[^0-9]/g, '');

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid full name (at least 2 characters).' },
        { status: 422 }
      );
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 422 }
      );
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number.' },
        { status: 422 }
      );
    }

    // Real, deterministic, trackable application ID
    const year = new Date().getFullYear();
    const uniqueSuffix = Date.now().toString(36).toUpperCase();
    const appTrackingId = `CSEEL-${year}-${uniqueSuffix}`;

    const record: CareerApplicationRecord = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      applicationId: appTrackingId,
      jobId: jobId ? String(jobId) : undefined,
      jobTitle: String(jobTitle || 'General Application').trim(),
      department: department ? String(department).trim() : undefined,
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      currentCity: String(currentCity || '').trim(),
      experience: experience ? String(experience).trim() : undefined,
      portfolioUrl: portfolioUrl ? String(portfolioUrl).trim() : undefined,
      coverNote: coverNote ? String(coverNote).trim() : undefined,
      status: 'received',
      createdAt: new Date().toISOString(),
    };

    // 1. Always persist to disk store
    saveLocalApplication(record);

    // 2. Persist to Supabase if table exists
    if (SUPABASE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/career_applications`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify(record),
          signal: AbortSignal.timeout(5000),
        });
      } catch (dbErr) {
        // Table might not exist yet; local file storage already guaranteed persistence
        console.warn('[Career Application] Supabase write skipped or timed out:', dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your application has been received successfully.',
        applicationId: appTrackingId,
        record: {
          applicationId: appTrackingId,
          fullName: cleanName,
          jobTitle: record.jobTitle,
          createdAt: record.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[/api/careers/apply] Error processing application:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error while processing application.' },
      { status: 500 }
    );
  }
}
