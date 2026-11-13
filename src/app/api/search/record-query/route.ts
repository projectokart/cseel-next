import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sanitizeSearchQuery } from '@/lib/searchSanitizer';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';

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

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, category = 'faculty_jobs', filters = {}, resultsCount = 0 } = body;

    // Strict sanitization, length checking, and abusive language blocking
    const { isValid, cleanQuery, reason } = sanitizeSearchQuery(query);
    if (!isValid || !cleanQuery) {
      return NextResponse.json({ success: false, message: reason || 'Invalid search query' }, { status: 400 });
    }

    // 1. Sync to Supabase job_search_queries table (Primary Database)
    try {
      const { error: rpcErr } = await schoolSearchSupabase.rpc('record_job_search_query', {
        search_term: cleanQuery,
      });

      if (rpcErr) {
        // Fallback to direct upsert if RPC function has an issue
        const { data: existing } = await schoolSearchSupabase
          .from('job_search_queries')
          .select('id, search_count')
          .ilike('query', cleanQuery)
          .limit(1)
          .maybeSingle();

        if (existing) {
          await schoolSearchSupabase
            .from('job_search_queries')
            .update({
              search_count: (existing.search_count || 1) + 1,
              last_searched_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
        } else {
          await schoolSearchSupabase
            .from('job_search_queries')
            .insert({
              query: cleanQuery,
              search_count: 1,
              last_searched_at: new Date().toISOString(),
            });
        }
      }
    } catch (dbErr) {
      console.warn('[record-query API] Supabase query record notice:', dbErr);
    }

    // 2. Also keep a local JSON log backup
    try {
      ensureDataFile();
      let logs: any[] = [];
      try {
        if (fs.existsSync(LOG_FILE)) {
          logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
        }
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
      if (logs.length > 500) logs = logs.slice(0, 500);
      fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Search query recorded in search database',
      query: cleanQuery,
    });
  } catch (error: any) {
    console.error('Error logging search query:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filterQuery = searchParams.get('q')?.trim() || '';

    // 1. Fetch live search queries from Supabase
    let supaQueries: { query: string; count: number }[] = [];
    try {
      let supaReq = schoolSearchSupabase
        .from('job_search_queries')
        .select('query, search_count, last_searched_at')
        .order('search_count', { ascending: false })
        .order('last_searched_at', { ascending: false })
        .limit(15);

      if (filterQuery) {
        supaReq = supaReq.ilike('query', `%${filterQuery}%`);
      }

      const { data, error } = await supaReq;
      if (!error && Array.isArray(data) && data.length > 0) {
        supaQueries = data.map((d: any) => ({
          query: d.query,
          count: d.search_count || 1,
        }));
      }
    } catch (e) {
      console.warn('[record-query GET] Supabase fetch notice:', e);
    }

    // 2. If Supabase returned queries, return them! (Clean, 100% fresh, NO hardcoded mock strings)
    if (supaQueries.length > 0) {
      return NextResponse.json({
        success: true,
        suggestions: supaQueries,
        trending: supaQueries, // backwards-compatible property
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      });
    }

    // 3. Fallback to local logs if database had no entries yet
    try {
      if (fs.existsSync(LOG_FILE)) {
        const fileData = fs.readFileSync(LOG_FILE, 'utf-8');
        const logs = JSON.parse(fileData);
        const counts: Record<string, number> = {};
        for (const item of logs) {
          const rawQ = typeof item === 'string' ? item : item.query;
          const { isValid, cleanQuery } = sanitizeSearchQuery(rawQ);
          if (isValid && cleanQuery) {
            if (!filterQuery || cleanQuery.toLowerCase().includes(filterQuery.toLowerCase())) {
              counts[cleanQuery] = (counts[cleanQuery] || 0) + 1;
            }
          }
        }
        const localList = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([query, count]) => ({ query, count }));

        if (localList.length > 0) {
          return NextResponse.json({
            success: true,
            suggestions: localList,
            trending: localList,
          });
        }
      }
    } catch {}

    // 4. If zero queries have ever been made, return empty list (NO fake hardcoded strings!)
    return NextResponse.json({
      success: true,
      suggestions: [],
      trending: [],
    });
  } catch {
    return NextResponse.json({ success: true, suggestions: [], trending: [] });
  }
}
