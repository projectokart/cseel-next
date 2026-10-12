import { NextResponse } from 'next/server';
import { parseSchoolsSeoQuery } from '@/lib/schoolsSeoParser';
import { fetchSchoolsForDirectory } from '@/integrations/supabase/schoolsDirectoryDb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchParamsObj: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      searchParamsObj[key] = val;
    });

    const parsedQuery = parseSchoolsSeoQuery([], searchParamsObj);
    const result = await fetchSchoolsForDirectory(parsedQuery);

    return NextResponse.json({
      success: true,
      schools: result.schools,
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      limit: result.limit,
      hasMore: result.currentPage < result.totalPages,
      stats: result.stats
    });
  } catch (error: any) {
    console.error('API /api/schools-directory error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
