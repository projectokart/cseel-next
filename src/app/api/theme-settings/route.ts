import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GlobalThemeConfig } from '@/features/theme-system/types';
import { DEFAULT_CSEEL_THEME } from '@/features/theme-system/defaultTheme';

const DATA_DIR = path.join(process.cwd(), 'src', 'features', 'theme-system', 'data');
const THEME_FILE = path.join(DATA_DIR, 'theme_config.json');

let cachedTheme: GlobalThemeConfig = { ...DEFAULT_CSEEL_THEME };
let isLoaded = false;

function loadThemeConfig(): GlobalThemeConfig {
  if (isLoaded) return cachedTheme;
  try {
    if (fs.existsSync(THEME_FILE)) {
      const raw = fs.readFileSync(THEME_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        cachedTheme = { ...DEFAULT_CSEEL_THEME, ...parsed };
        isLoaded = true;
        return cachedTheme;
      }
    }
  } catch (err) {
    console.error('Error loading theme config:', err);
  }
  isLoaded = true;
  return cachedTheme;
}

function saveThemeConfig(theme: GlobalThemeConfig): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(THEME_FILE, JSON.stringify(theme, null, 2), 'utf-8');
    cachedTheme = theme;
    isLoaded = true;
    return true;
  } catch (err) {
    console.error('Error saving theme config:', err);
    return false;
  }
}

export async function GET() {
  const currentTheme = loadThemeConfig();
  return NextResponse.json({ success: true, data: currentTheme });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const current = loadThemeConfig();
    const updated: GlobalThemeConfig = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const saved = saveThemeConfig(updated);
    if (!saved) {
      return NextResponse.json({ success: false, error: 'Failed to write theme config' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
