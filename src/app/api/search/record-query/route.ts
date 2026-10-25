import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sanitizeSearchQuery } from '@/lib/searchSanitizer';

interface SearchQueryLog {
  id: string;
  query: string;
  category: string;
  filters: Record<string, any>;
  resultsCount: number;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const LOG_FILE = path.join(DATA_DIR, 'search_query_logs.json');

// Default initial high-value search queries for STEM intelligence
const DEFAULT_TRENDING = [
  { query: "PGT Physics Delhi", count: 142 },
  { query: "TGT Chemistry CBSE", count: 118 },
  { query: "ATL Robotics Mentor Gurugram", count: 96 },
  { query: "PRT Primary Science", count: 85 },
  { query: "Composite Lab In-Charge Mumbai", count: 74 },
  { query: "Biology Faculty Class 12", count: 68 },
  { query: "Mathematics Modeler Bengaluru", count: 62 },
  { query: "Computer Science AI Teacher", count: 57 },
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, JSON.stringify(DEFAULT_TRENDING, null, 2), 'utf-8');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, category = 'faculty_jobs', filters = {}, resultsCount = 0 } = body;

    // Strict sanitization, length checking, and abusive language blocking
    const { isValid, cleanQuery, reason } = sanitizeSearchQuery(query);
    if (!isValid) {
      return NextResponse.json({ success: false, message: reason || 'Invalid search query' }, { status: 400 });
    }

    ensureDataFile();

    let logs: any[] = [];
    try {
      const fileData = fs.readFileSync(LOG_FILE, 'utf-8');
      logs = JSON.parse(fileData);
    } catch {
      logs = [];
    }

    const newEntry: SearchQueryLog = {
      id: `sq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      query: cleanQuery,
      category: typeof category === 'string' ? category.slice(0, 30) : 'faculty_jobs',
      filters: typeof filters === 'object' && filters !== null ? filters : {},
      resultsCount: typeof resultsCount === 'number' ? resultsCount : 0,
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for')?.slice(0, 45) || 'local',
      userAgent: req.headers.get('user-agent')?.slice(0, 150) || 'browser',
    };

    logs.unshift(newEntry);
    // Keep last 1,000 queries for search engine intelligence
    if (logs.length > 1000) {
      logs = logs.slice(0, 1000);
    }

    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Search query recorded in search intelligence vault',
      loggedId: newEntry.id
    });
  } catch (error: any) {
    console.error('Error logging search query:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  ensureDataFile();
  try {
    const fileData = fs.readFileSync(LOG_FILE, 'utf-8');
    const logs = JSON.parse(fileData);

    // Compute frequency map with sanitization check
    const counts: Record<string, number> = {};
    for (const item of logs) {
      const rawQ = typeof item === 'string' ? item : item.query;
      const { isValid, cleanQuery } = sanitizeSearchQuery(rawQ);
      if (isValid && cleanQuery) {
        counts[cleanQuery] = (counts[cleanQuery] || 0) + 1;
      }
    }

    const trending = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([query, count]) => ({ query, count }));

    return NextResponse.json({
      success: true,
      trending: trending.length > 0 ? trending : DEFAULT_TRENDING
    });
  } catch {
    return NextResponse.json({ success: true, trending: DEFAULT_TRENDING });
  }
}
