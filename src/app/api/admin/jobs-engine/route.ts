import { NextRequest, NextResponse } from 'next/server';
import { JobCardExtractor, JobAggregatorStorage, RawJobInput } from '@/lib/services/jobAggregatorEngine';
import { FacultyJobItem } from '@/data/facultyJobsData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'list';
    const city = searchParams.get('city') || '';
    const subject = searchParams.get('subject') || '';
    const source = searchParams.get('source') || '';

    const allJobs = JobAggregatorStorage.getAggregatedJobs();

    let filtered = allJobs;
    if (city) {
      filtered = filtered.filter(j => j.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (subject) {
      filtered = filtered.filter(j => j.subject.toLowerCase().includes(subject.toLowerCase()));
    }
    if (source) {
      filtered = filtered.filter(j => j.source.toLowerCase() === source.toLowerCase());
    }

    // Portal source breakdown stats
    const sourceStats: Record<string, number> = {};
    for (const j of allJobs) {
      sourceStats[j.source] = (sourceStats[j.source] || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      totalCount: allJobs.length,
      filteredCount: filtered.length,
      sourceBreakdown: sourceStats,
      jobs: filtered
    });
  } catch (error: any) {
    console.error('[API jobs-engine GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'sync';

    if (action === 'ingest_raw') {
      const rawList: RawJobInput[] = body.rawJobs || [];
      if (!Array.isArray(rawList) || rawList.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No rawJobs array provided' },
          { status: 400 }
        );
      }

      // Convert each raw job strictly to the compact card format
      const cardItems: FacultyJobItem[] = rawList.map(item =>
        JobCardExtractor.transformToCardItem(item)
      );

      // Save & deduplicate
      const result = JobAggregatorStorage.saveAggregatedJobs(cardItems);

      return NextResponse.json({
        success: true,
        message: `Successfully processed ${rawList.length} raw jobs`,
        added: result.added,
        totalInStore: result.total,
        sample: cardItems.slice(0, 3)
      });
    }

    if (action === 'save_batch') {
      const jobs: FacultyJobItem[] = body.jobs || [];
      const result = JobAggregatorStorage.saveAggregatedJobs(jobs);
      return NextResponse.json({
        success: true,
        added: result.added,
        total: result.total
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[API jobs-engine POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
