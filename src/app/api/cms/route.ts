import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UniversalPageData, CmsVersion } from '@/features/universal-cms/types';
import { INITIAL_CMS_PAGES } from '@/features/universal-cms/seed';

const MAX_VERSIONS = 10;
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DB_FILE = path.join(DATA_DIR, 'universal_cms_database.json');
const VERSIONS_FILE = path.join(DATA_DIR, 'universal_cms_versions.json');

// In-memory cache
let inMemoryPages: Record<string, UniversalPageData> = {};
let inMemoryVersions: Record<string, CmsVersion[]> = {};

function loadDatabase(): Record<string, UniversalPageData> {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        inMemoryPages = { ...INITIAL_CMS_PAGES, ...parsed };
        return inMemoryPages;
      }
    }
  } catch (e) {
    console.error('Error reading CMS database file:', e);
  }

  if (Object.keys(inMemoryPages).length === 0) {
    inMemoryPages = { ...INITIAL_CMS_PAGES };
    saveDatabase(inMemoryPages);
  }
  return inMemoryPages;
}

function saveDatabase(pages: Record<string, UniversalPageData>) {
  inMemoryPages = pages;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(pages, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing CMS database file:', e);
  }
}

function loadVersions(): Record<string, CmsVersion[]> {
  try {
    if (fs.existsSync(VERSIONS_FILE)) {
      const raw = fs.readFileSync(VERSIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        inMemoryVersions = parsed;
        return inMemoryVersions;
      }
    }
  } catch (e) {
    console.error('Error reading CMS versions file:', e);
  }

  return inMemoryVersions;
}

function saveVersions(versions: Record<string, CmsVersion[]>) {
  inMemoryVersions = versions;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(VERSIONS_FILE, JSON.stringify(versions, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing CMS versions file:', e);
  }
}

// GET /api/cms?page=<pageKey>
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get('page') || searchParams.get('path');

    const db = loadDatabase();
    const allVersions = loadVersions();

    if (!pageKey || pageKey === 'all') {
      return NextResponse.json({
        success: true,
        data: db,
        count: Object.keys(db).length,
      });
    }

    // Clean pageKey (allow `/domain/science` -> `domain:science`)
    const normalizedKey = pageKey.startsWith('/')
      ? pageKey.slice(1).replace(/\//g, ':')
      : pageKey;

    let pageData = db[normalizedKey] || db[pageKey];

    // Fallback search
    if (!pageData) {
      const matchingKey = Object.keys(db).find(
        (k) => k.toLowerCase() === normalizedKey.toLowerCase() || k.endsWith(normalizedKey)
      );
      if (matchingKey) pageData = db[matchingKey];
    }

    const versions = allVersions[normalizedKey] || allVersions[pageKey] || [];

    if (!pageData) {
      // Auto-initialize a default blank/seed page so every page can be immediately edited
      const newPage: UniversalPageData = {
        pageKey: normalizedKey,
        title: normalizedKey.replace(/[:_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        eyebrow: 'CSEEL Experiential Learning',
        subtitle: 'Dynamic content driven by CSEEL Live CMS',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Auto Init',
      };
      db[normalizedKey] = newPage;
      saveDatabase(db);

      return NextResponse.json({
        success: true,
        data: newPage,
        versions: [],
        isNew: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: pageData,
      versions: versions.slice(-MAX_VERSIONS),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch CMS page' },
      { status: 500 }
    );
  }
}

// PUT /api/cms
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageKey, ...changes } = body;

    if (!pageKey) {
      return NextResponse.json(
        { success: false, error: 'pageKey is required' },
        { status: 400 }
      );
    }

    const db = loadDatabase();
    const existing = db[pageKey] || { pageKey };

    const updated: UniversalPageData = {
      ...existing,
      ...changes,
      pageKey,
      updatedAt: new Date().toISOString(),
    };

    db[pageKey] = updated;
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Page ${pageKey} updated successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update CMS page' },
      { status: 500 }
    );
  }
}

// POST /api/cms
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, pageKey, data, summary, author, versionId } = body;

    const db = loadDatabase();
    const allVersions = loadVersions();

    // 1. Save new Version Snapshot (strictly max 10 stored)
    if (action === 'save_version' && pageKey && data) {
      const pageVersions = allVersions[pageKey] || [];
      const lastVersionNum = pageVersions.length > 0
        ? Math.max(...pageVersions.map((v) => v.versionNumber))
        : 0;
      const nextVersionNum = lastVersionNum + 1;

      const newVersion: CmsVersion = {
        id: `ver-${Date.now()}`,
        versionNumber: nextVersionNum,
        timestamp: new Date().toISOString(),
        author: author || 'Super Admin',
        summary: summary || `Page version ${nextVersionNum} published`,
        pageKey,
        data,
      };

      // Cap at MAX_VERSIONS (10)
      const updatedVersions = [...pageVersions, newVersion].slice(-MAX_VERSIONS);
      allVersions[pageKey] = updatedVersions;
      saveVersions(allVersions);

      // Save page data to db
      db[pageKey] = {
        ...data,
        pageKey,
        updatedAt: new Date().toISOString(),
        updatedBy: author || 'Super Admin',
      };
      saveDatabase(db);

      return NextResponse.json({
        success: true,
        data: db[pageKey],
        versions: updatedVersions,
        message: `Version #${nextVersionNum} saved in database (Max 10 history preserved)`,
      });
    }

    // 2. Rollback to a previous version
    if (action === 'rollback' && pageKey && versionId) {
      const pageVersions = allVersions[pageKey] || [];
      const targetVersion = pageVersions.find((v) => v.id === versionId);

      if (!targetVersion) {
        return NextResponse.json(
          { success: false, error: 'Target version not found in history' },
          { status: 404 }
        );
      }

      const restoredData = targetVersion.data;
      db[pageKey] = {
        ...restoredData,
        pageKey,
        updatedAt: new Date().toISOString(),
        updatedBy: author || 'Super Admin (Rollback)',
      };
      saveDatabase(db);

      // Add a rollback audit version record
      const lastVersionNum = pageVersions.length > 0
        ? Math.max(...pageVersions.map((v) => v.versionNumber))
        : 0;
      const nextVersionNum = lastVersionNum + 1;

      const rollbackRecord: CmsVersion = {
        id: `ver-${Date.now()}`,
        versionNumber: nextVersionNum,
        timestamp: new Date().toISOString(),
        author: author || 'Super Admin',
        summary: `Rolled back to Version #${targetVersion.versionNumber}`,
        pageKey,
        data: restoredData,
      };

      const updatedVersions = [...pageVersions, rollbackRecord].slice(-MAX_VERSIONS);
      allVersions[pageKey] = updatedVersions;
      saveVersions(allVersions);

      return NextResponse.json({
        success: true,
        data: db[pageKey],
        versions: updatedVersions,
        message: `Reversed / Rolled back to Version #${targetVersion.versionNumber}`,
      });
    }

    // 3. Get versions
    if (action === 'get_versions' && pageKey) {
      return NextResponse.json({
        success: true,
        versions: (allVersions[pageKey] || []).slice(-MAX_VERSIONS),
      });
    }

    return NextResponse.json(
      { success: false, error: `Invalid action '${action}'` },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process CMS request' },
      { status: 500 }
    );
  }
}
