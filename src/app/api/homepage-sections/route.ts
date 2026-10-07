import { NextResponse } from 'next/server';
import { INITIAL_HOMEPAGE_SECTIONS } from '@/features/homepage-cms/data/homepageSeed';
import { HomepageSectionConfig, HomepageVersion } from '@/features/homepage-cms/types';
import fs from 'fs';
import path from 'path';

const MAX_VERSIONS = 10;
const DATA_DIR = path.join(process.cwd(), 'src', 'features', 'homepage-cms', 'data');
const STATE_FILE = path.join(DATA_DIR, 'homepage_cms_state.json');
const VERSIONS_FILE = path.join(DATA_DIR, 'homepage_cms_versions.json');

// In-memory fallbacks
let inMemorySections: HomepageSectionConfig[] = [];
let inMemoryVersions: HomepageVersion[] = [];

function loadState(): HomepageSectionConfig[] {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemorySections = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading homepage state file:', e);
  }
  if (inMemorySections.length === 0) {
    inMemorySections = [...INITIAL_HOMEPAGE_SECTIONS];
  }
  return inMemorySections;
}

function saveState(sections: HomepageSectionConfig[]) {
  inMemorySections = sections;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STATE_FILE, JSON.stringify(sections, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing homepage state file:', e);
  }
}

function loadVersions(): HomepageVersion[] {
  try {
    if (fs.existsSync(VERSIONS_FILE)) {
      const raw = fs.readFileSync(VERSIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryVersions = parsed.slice(-MAX_VERSIONS);
        return inMemoryVersions;
      }
    }
  } catch (e) {
    console.error('Error reading homepage versions file:', e);
  }

  if (inMemoryVersions.length === 0) {
    const initialVersion: HomepageVersion = {
      id: 'ver-initial',
      versionNumber: 1,
      timestamp: new Date().toISOString(),
      author: 'System Default',
      summary: 'Baseline Initial Setup',
      sections: [...INITIAL_HOMEPAGE_SECTIONS],
    };
    inMemoryVersions = [initialVersion];
    saveVersions(inMemoryVersions);
  }
  return inMemoryVersions;
}

function saveVersions(versions: HomepageVersion[]) {
  // Strictly enforce max 10 versions
  const trimmed = versions.slice(-MAX_VERSIONS);
  inMemoryVersions = trimmed;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(VERSIONS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing homepage versions file:', e);
  }
}

export async function GET() {
  const sections = loadState();
  const versions = loadVersions();
  return NextResponse.json({
    success: true,
    data: sections,
    versions: versions,
    count: sections.length,
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...changes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Section ID is required' },
        { status: 400 }
      );
    }

    const sections = loadState();
    const index = sections.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      );
    }

    sections[index] = {
      ...sections[index],
      ...changes,
      updated_at: new Date().toISOString(),
    };

    saveState(sections);

    return NextResponse.json({
      success: true,
      message: `Section ${id} updated successfully`,
      data: sections[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update section' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;

    // 1. Reset to initial default seed
    if (action === 'reset') {
      const resetSections = [...INITIAL_HOMEPAGE_SECTIONS];
      saveState(resetSections);

      const resetVersion: HomepageVersion = {
        id: `ver-${Date.now()}`,
        versionNumber: 1,
        timestamp: new Date().toISOString(),
        author: body.author || 'Super Admin',
        summary: 'Reset to default seed configuration',
        sections: resetSections,
      };
      saveVersions([resetVersion]);

      return NextResponse.json({
        success: true,
        message: 'All homepage sections reset to default initial state',
        data: resetSections,
        versions: [resetVersion],
      });
    }

    // 2. Save new version (with max 10 snapshot retention)
    if (action === 'save_version' && Array.isArray(body.sections)) {
      const sectionsToSave: HomepageSectionConfig[] = body.sections;
      saveState(sectionsToSave);

      const currentVersions = loadVersions();
      const lastVersionNum = currentVersions.length > 0 
        ? Math.max(...currentVersions.map((v) => v.versionNumber)) 
        : 0;
      const nextVersionNum = lastVersionNum + 1;

      const newVersion: HomepageVersion = {
        id: `ver-${Date.now()}`,
        versionNumber: nextVersionNum,
        timestamp: new Date().toISOString(),
        author: body.author || 'Admin',
        summary: body.summary || `Version ${nextVersionNum} published`,
        sections: sectionsToSave,
      };

      const updatedVersions = [...currentVersions, newVersion].slice(-MAX_VERSIONS);
      saveVersions(updatedVersions);

      return NextResponse.json({
        success: true,
        message: `Version ${nextVersionNum} saved successfully (Max 10 history preserved)`,
        data: sectionsToSave,
        versions: updatedVersions,
        activeVersion: newVersion,
      });
    }

    // 3. Rollback / Reverse to a previous version
    if (action === 'rollback' && body.versionId) {
      const currentVersions = loadVersions();
      const targetVersion = currentVersions.find((v) => v.id === body.versionId);

      if (!targetVersion) {
        return NextResponse.json(
          { success: false, error: 'Target version not found in history' },
          { status: 404 }
        );
      }

      // Restore sections from target version
      const restoredSections = targetVersion.sections;
      saveState(restoredSections);

      // Create a rollback version entry
      const lastVersionNum = currentVersions.length > 0 
        ? Math.max(...currentVersions.map((v) => v.versionNumber)) 
        : 0;
      const nextVersionNum = lastVersionNum + 1;

      const rollbackRecord: HomepageVersion = {
        id: `ver-${Date.now()}`,
        versionNumber: nextVersionNum,
        timestamp: new Date().toISOString(),
        author: body.author || 'Admin',
        summary: `Reversed / Rolled back to Version #${targetVersion.versionNumber} ("${targetVersion.summary}")`,
        sections: restoredSections,
      };

      const updatedVersions = [...currentVersions, rollbackRecord].slice(-MAX_VERSIONS);
      saveVersions(updatedVersions);

      return NextResponse.json({
        success: true,
        message: `Reversed to Version #${targetVersion.versionNumber}`,
        data: restoredSections,
        versions: updatedVersions,
        activeVersion: rollbackRecord,
      });
    }

    // 4. Bulk update without version creation
    if (action === 'bulk_update' && Array.isArray(body.sections)) {
      saveState(body.sections);
      return NextResponse.json({
        success: true,
        message: 'Bulk homepage sections updated',
        data: body.sections,
        versions: loadVersions(),
      });
    }

    // 5. Get versions only
    if (action === 'get_versions') {
      return NextResponse.json({
        success: true,
        versions: loadVersions(),
      });
    }

    return NextResponse.json({
      success: true,
      data: loadState(),
      versions: loadVersions(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
