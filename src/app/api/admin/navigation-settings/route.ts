import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_NAV_3STAGE_DATA, NavStage1Category } from '@/lib/navigationData';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const NAV_FILE = path.join(DATA_DIR, 'navigation_cms.json');

let inMemoryNav: NavStage1Category[] | null = null;

function loadNavData(): NavStage1Category[] {
  if (inMemoryNav && inMemoryNav.length > 0) {
    return inMemoryNav;
  }

  try {
    if (fs.existsSync(NAV_FILE)) {
      const raw = fs.readFileSync(NAV_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryNav = parsed;
        return inMemoryNav;
      }
    }
  } catch (e) {
    console.error('Error reading navigation_cms.json:', e);
  }

  inMemoryNav = JSON.parse(JSON.stringify(DEFAULT_NAV_3STAGE_DATA));
  saveNavData(inMemoryNav!);
  return inMemoryNav!;
}

function saveNavData(data: NavStage1Category[]) {
  inMemoryNav = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(NAV_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving navigation_cms.json:', e);
  }
}

export async function GET() {
  try {
    const data = loadNavData();
    return NextResponse.json({
      success: true,
      settings: data,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body && Array.isArray(body.settings)) {
      saveNavData(body.settings);
      return NextResponse.json({ success: true, settings: body.settings });
    }
    return NextResponse.json({ success: false, error: 'Invalid settings payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Reset to factory defaults
export async function DELETE() {
  try {
    const fresh = JSON.parse(JSON.stringify(DEFAULT_NAV_3STAGE_DATA));
    saveNavData(fresh);
    return NextResponse.json({ success: true, settings: fresh });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
