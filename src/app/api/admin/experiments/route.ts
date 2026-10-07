import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_EXPERIMENTS } from '@/data/experimentsSeed';
import { ExperimentItem } from '@/types/experiment';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'experiments_custom.json');

// In-memory fallback
let memoryStore: ExperimentItem[] | null = null;

function loadExperiments(): ExperimentItem[] {
  if (memoryStore) return memoryStore;

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryStore = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read experiments_custom.json, falling back to seed', err);
  }

  memoryStore = [...INITIAL_EXPERIMENTS];
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {}

  return memoryStore;
}

function saveExperiments(experiments: ExperimentItem[]): void {
  memoryStore = experiments;
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(experiments, null, 2), 'utf-8');
  } catch (err) {
    // In serverless read-only environment, memoryStore holds state
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const query = searchParams.get('q');

    let items = loadExperiments();

    if (subject && subject !== 'all') {
      items = items.filter((item) => item.subjectSlug.toLowerCase() === subject.toLowerCase());
    }

    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      data: items,
      total: items.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch experiments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if bulk add
    if (Array.isArray(body)) {
      const current = loadExperiments();
      const updated = [...body, ...current];
      saveExperiments(updated);
      return NextResponse.json({
        success: true,
        data: updated,
        count: body.length,
        message: 'Bulk experiments added successfully',
      });
    }

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Experiment title is required' },
        { status: 400 }
      );
    }

    const current = loadExperiments();
    const id = body.id || `exp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newExperiment: ExperimentItem = {
      ...body,
      id,
      createdAt: body.createdAt || now,
      updatedAt: now,
      sections: body.sections || [],
    };

    const existingIndex = current.findIndex((item) => item.id === id);
    let updated: ExperimentItem[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = newExperiment;
    } else {
      updated = [newExperiment, ...current];
    }

    saveExperiments(updated);

    return NextResponse.json({
      success: true,
      data: newExperiment,
      message: 'Experiment saved successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save experiment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
