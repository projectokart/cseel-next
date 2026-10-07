import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_EXPERIMENTS } from '@/data/experimentsSeed';
import { ExperimentItem } from '@/types/experiment';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'experiments_custom.json');

function loadExperiments(): ExperimentItem[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {}
  return [...INITIAL_EXPERIMENTS];
}

function saveExperiments(experiments: ExperimentItem[]): void {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(experiments, null, 2), 'utf-8');
  } catch (err) {}
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const query = decodeURIComponent(id).toLowerCase().trim();
    const items = loadExperiments();
    const found = items.find((item) => {
      const iId = item.id.toLowerCase();
      const iSlug = (
        item.slug ||
        item.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/[\s_-]+/g, '-')
      );
      return (
        iId === query ||
        iSlug === query ||
        query.startsWith(iSlug) ||
        iSlug.startsWith(query)
      );
    });

    if (!found) {
      return NextResponse.json(
        { success: false, error: 'Experiment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: found });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching experiment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const items = loadExperiments();
    const updated = items.filter((item) => item.id !== id);

    saveExperiments(updated);

    return NextResponse.json({
      success: true,
      message: 'Experiment deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error deleting experiment' },
      { status: 500 }
    );
  }
}
