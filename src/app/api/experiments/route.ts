import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_EXPERIMENTS } from '@/data/experimentsSeed';
import { ExperimentItem } from '@/types/experiment';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'experiments_custom.json');

// In-memory cache for performance
let memoryStore: ExperimentItem[] | null = null;

export function loadAllExperiments(): ExperimentItem[] {
  if (memoryStore && memoryStore.length > 0) return memoryStore;

  const map = new Map<string, ExperimentItem>();

  // 1. Load seed experiments
  INITIAL_EXPERIMENTS.forEach((exp) => map.set(exp.id, exp));

  // 2. Load custom experiments JSON
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        parsed.forEach((exp: ExperimentItem) => map.set(exp.id, exp));
      }
    }
  } catch (err) {
    console.warn('Could not read experiments_custom.json:', err);
  }

  memoryStore = Array.from(map.values());
  return memoryStore;
}

export function saveAllExperiments(experiments: ExperimentItem[]): void {
  memoryStore = experiments;
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(experiments, null, 2), 'utf-8');
  } catch (err) {
    // In serverless read-only environment, memoryStore holds the state
  }
}

/**
 * GET /api/experiments
 * Query params:
 *   - subject: 'physics' | 'chemistry' | 'biology' | 'mathematics' | 'all'
 *   - q: search keyword
 *   - grade: 'Middle (6-8)' | 'Secondary (9-10)' etc.
 *   - difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
 *   - page: number (default 1)
 *   - limit: number (default 20, max 100)
 *   - summary: 'true' (returns compact cards without heavy section bodies)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const query = searchParams.get('q') || searchParams.get('search');
    const grade = searchParams.get('grade') || searchParams.get('gradeLevel');
    const difficulty = searchParams.get('difficulty');
    const summary = searchParams.get('summary') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    let items = loadAllExperiments();

    // 1. Filter by subject
    if (subject && subject !== 'all') {
      const sub = subject.toLowerCase().trim();
      items = items.filter((item) => item.subjectSlug.toLowerCase() === sub);
    }

    // 2. Filter by search query
    if (query) {
      const q = query.toLowerCase().trim();
      items = items.filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(q);
        const subMatch = item.subtitle?.toLowerCase().includes(q);
        const catMatch = item.category?.toLowerCase().includes(q);
        const tagMatch = item.tags?.some((t) => t.toLowerCase().includes(q));
        const slugMatch = item.slug?.toLowerCase().includes(q);
        return titleMatch || subMatch || catMatch || tagMatch || slugMatch;
      });
    }

    // 3. Filter by grade level
    if (grade && grade !== 'all') {
      items = items.filter((item) => item.gradeLevel.toLowerCase() === grade.toLowerCase());
    }

    // 4. Filter by difficulty
    if (difficulty && difficulty !== 'all') {
      items = items.filter((item) => item.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Sort by updatedAt descending
    items.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    // If summary requested, strip heavy sections to save bandwidth
    const responseData = summary
      ? paginatedItems.map((item) => ({
          id: item.id,
          slug: item.slug || item.id,
          title: item.title,
          subtitle: item.subtitle,
          subjectSlug: item.subjectSlug,
          subjectName: item.subjectName,
          category: item.category,
          gradeLevel: item.gradeLevel,
          difficulty: item.difficulty,
          duration: item.duration,
          safetyLevel: item.safetyLevel,
          status: item.status,
          heroImage: item.heroImage,
          tags: item.tags,
          updatedAt: item.updatedAt,
          sectionsCount: item.sections?.length || 0,
        }))
      : paginatedItems;

    return NextResponse.json({
      success: true,
      data: responseData,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch experiments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/experiments
 * Body: ExperimentItem or ExperimentItem[]
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      const current = loadAllExperiments();
      const updated = [...body, ...current];
      saveAllExperiments(updated);
      return NextResponse.json({
        success: true,
        count: body.length,
        message: 'Bulk experiments created successfully',
      });
    }

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Experiment title is required' },
        { status: 400 }
      );
    }

    const current = loadAllExperiments();
    const id = body.id || `exp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newExperiment: ExperimentItem = {
      ...body,
      id,
      slug:
        body.slug ||
        body.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/[\s_-]+/g, '-'),
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

    saveAllExperiments(updated);

    return NextResponse.json(
      {
        success: true,
        data: newExperiment,
        message: 'Experiment saved successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save experiment' },
      { status: 500 }
    );
  }
}
