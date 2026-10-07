import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface CustomPageItem {
  slug: string; // e.g. "robotics-innovation-hub" or "/page/robotics-hub"
  title: string;
  subtitle?: string;
  status: 'working' | 'published' | 'draft';
  customMessage?: string;
  author?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PAGES_FILE = path.join(DATA_DIR, 'custom_pages.json');

const DEFAULT_PAGES: CustomPageItem[] = [
  {
    slug: 'robotics-innovation-hub',
    title: 'Robotics & AI Innovation Hub',
    subtitle: 'Hands-on maker workstations, microcontrollers and student robotic prototypes.',
    status: 'working',
    customMessage: 'We are currently working on this experiential science page. Detailed apparatus checklists and project blueprints will be live soon.',
    category: 'Turnkey Labs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    slug: 'astronomy-sky-observatory',
    title: 'Astronomy & Celestial Space Lab',
    subtitle: 'High-power telescopes, celestial mechanics and astrophysics models for schools.',
    status: 'working',
    customMessage: 'Our curriculum team is developing standard operating procedures and observation manuals for this module.',
    category: 'Science Labs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

let inMemoryPages: CustomPageItem[] | null = null;

function loadPages(): CustomPageItem[] {
  if (inMemoryPages) return inMemoryPages;
  try {
    if (fs.existsSync(PAGES_FILE)) {
      const raw = fs.readFileSync(PAGES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        inMemoryPages = parsed;
        return inMemoryPages;
      }
    }
  } catch (e) {
    console.error('Error reading custom_pages.json:', e);
  }
  inMemoryPages = [...DEFAULT_PAGES];
  savePages(inMemoryPages);
  return inMemoryPages;
}

function savePages(pages: CustomPageItem[]) {
  inMemoryPages = pages;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving custom_pages.json:', e);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const all = loadPages();

    if (slug) {
      const clean = slug.replace(/^\/+|\/+$/g, '').replace(/^(page|p)\//, '');
      const found = all.find(p => p.slug.replace(/^\/+|\/+$/g, '').replace(/^(page|p)\//, '') === clean);
      return NextResponse.json({ success: true, page: found || null });
    }

    return NextResponse.json({ success: true, pages: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.title) {
      return NextResponse.json({ success: false, error: 'Page title is required' }, { status: 400 });
    }

    const all = loadPages();
    const rawSlug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const cleanSlug = rawSlug.replace(/^\/+|\/+$/g, '');

    const existingIdx = all.findIndex(p => p.slug.replace(/^\/+|\/+$/g, '') === cleanSlug);

    const now = new Date().toISOString();
    const newPage: CustomPageItem = {
      slug: cleanSlug,
      title: body.title,
      subtitle: body.subtitle || '',
      status: body.status || 'working',
      customMessage: body.customMessage || 'We are currently working on this page. Check back soon!',
      category: body.category || 'General',
      author: body.author || 'Admin',
      createdAt: existingIdx >= 0 ? all[existingIdx].createdAt : now,
      updatedAt: now,
    };

    if (existingIdx >= 0) {
      all[existingIdx] = newPage;
    } else {
      all.unshift(newPage);
    }

    savePages(all);
    return NextResponse.json({ success: true, page: newPage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const clean = slug.replace(/^\/+|\/+$/g, '');
    let all = loadPages();
    all = all.filter(p => p.slug.replace(/^\/+|\/+$/g, '') !== clean);
    savePages(all);

    return NextResponse.json({ success: true, pages: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
