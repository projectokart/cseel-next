import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'resume_campaign_state.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// GET: Load saved campaign state from local disk
export async function GET() {
  try {
    ensureDataDir();
    if (!fs.existsSync(STATE_FILE)) {
      return NextResponse.json({ exists: false, state: null });
    }

    const raw = fs.readFileSync(STATE_FILE, 'utf-8');
    const state = JSON.parse(raw);
    return NextResponse.json({ exists: true, state });
  } catch (error: any) {
    return NextResponse.json({ exists: false, error: error.message }, { status: 500 });
  }
}

// POST: Save campaign state to local disk
export async function POST(req: NextRequest) {
  try {
    ensureDataDir();
    const body = await req.json();
    fs.writeFileSync(STATE_FILE, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true, savedAt: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Reset / clear campaign state
export async function DELETE() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      fs.unlinkSync(STATE_FILE);
    }
    return NextResponse.json({ success: true, message: 'Campaign state file deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
