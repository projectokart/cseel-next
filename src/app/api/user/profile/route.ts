import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export interface UserProfileRecord {
  email: string;
  displayName: string;
  role: 'teacher' | 'student' | 'organisation';
  phone?: string;
  state?: string;
  district?: string;
  pincode?: string;
  avatarUrl?: string;
  updatedAt: string;
  createdAt: string;
}

const PROFILES_FILE = path.join(process.cwd(), 'data', 'user_profiles.json');

function readProfiles(): Record<string, UserProfileRecord> {
  try {
    if (!fs.existsSync(PROFILES_FILE)) {
      const dir = path.dirname(PROFILES_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(PROFILES_FILE, '{}', 'utf-8');
      return {};
    }
    const raw = fs.readFileSync(PROFILES_FILE, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch (err) {
    console.error('[UserProfile API] Error reading profiles file:', err);
    return {};
  }
}

function writeProfiles(profiles: Record<string, UserProfileRecord>) {
  try {
    const dir = path.dirname(PROFILES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf-8');
  } catch (err) {
    console.error('[UserProfile API] Error writing profiles file:', err);
  }
}

// 1. GET: Fetch user profile by email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = (searchParams.get('email') || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email is required.' }, { status: 400 });
    }

    const profiles = readProfiles();
    const profile = profiles[email] || null;

    return NextResponse.json({
      success: true,
      profile,
      hasCompletedProfile: Boolean(profile && profile.displayName && profile.displayName.trim().length > 1 && profile.state),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// 2. POST: Upsert user profile by email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const displayName = (body.displayName || body.fullName || '').trim();
    const role = body.role || 'teacher';
    const state = (body.state || '').trim();
    const district = (body.district || '').trim();
    const pincode = (body.pincode || '').trim();
    const phone = (body.phone || '').trim();
    const avatarUrl = body.avatarUrl || undefined;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email is required.' }, { status: 400 });
    }

    if (!displayName) {
      return NextResponse.json({ success: false, error: 'Full name is required.' }, { status: 400 });
    }

    const profiles = readProfiles();
    const existing = profiles[email];
    const now = new Date().toISOString();

    const updatedProfile: UserProfileRecord = {
      email,
      displayName,
      role: role === 'student' ? 'student' : role === 'organisation' ? 'organisation' : 'teacher',
      state: state || existing?.state || '',
      district: district || existing?.district || '',
      pincode: pincode || existing?.pincode || '',
      phone: phone || existing?.phone || '',
      avatarUrl: avatarUrl || existing?.avatarUrl,
      updatedAt: now,
      createdAt: existing?.createdAt || now,
    };

    profiles[email] = updatedProfile;
    writeProfiles(profiles);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: 'Profile saved permanently.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
