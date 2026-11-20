import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface SummaryMetrics {
  total_schools: number;
  cbse_count: number;
  icse_count: number;
  ib_count: number;
  state_board_count: number;
  madarsa_board_count: number;
  sanskrit_board_count: number;
  other_boards_count: number;
  recognized_count: number;
  unrecognized_count: number;
  residential_count: number;
  non_residential_count: number;
}

interface SummaryData {
  all: SummaryMetrics;
  state: Record<string, SummaryMetrics>;
  district: Record<string, SummaryMetrics>;
  block: Record<string, SummaryMetrics>;
  cluster: Record<string, SummaryMetrics>;
}

let cachedSummary: SummaryData | null = null;

function getSummaryData(): SummaryData | null {
  if (cachedSummary) return cachedSummary;
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'hierarchySummary.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      cachedSummary = JSON.parse(raw);
      return cachedSummary;
    }
  } catch (err) {
    console.error('Failed to load hierarchySummary.json:', err);
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = (searchParams.get('state') || searchParams.get('state_name') || '').trim().toUpperCase();
    const district = (searchParams.get('district') || searchParams.get('district_name') || '').trim().toUpperCase();
    const block = (searchParams.get('block') || searchParams.get('block_name') || '').trim().toUpperCase();
    const cluster = (searchParams.get('cluster') || searchParams.get('cluster_name') || '').trim().toUpperCase();

    const data = getSummaryData();
    if (!data) {
      return NextResponse.json({ success: false, error: 'Summary data not available' }, { status: 500 });
    }

    let level = 'all';
    let summary = data.all;

    if (cluster && block && district && state) {
      level = 'cluster';
      const key = `${state}||${district}||${block}||${cluster}`;
      summary = data.cluster[key] || data.all;
    } else if (block && district && state) {
      level = 'block';
      const key = `${state}||${district}||${block}`;
      summary = data.block[key] || data.all;
    } else if (district && state) {
      level = 'district';
      const key = `${state}||${district}`;
      summary = data.district[key] || data.all;
    } else if (state) {
      level = 'state';
      summary = data.state[state] || data.all;
    }

    return NextResponse.json({
      success: true,
      level,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
