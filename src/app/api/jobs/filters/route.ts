import { NextResponse } from 'next/server';
import facetsData from '@/data/job_filter_facets.json';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour revalidation

export async function GET() {
  return NextResponse.json(facetsData, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Content-Type': 'application/json',
    },
  });
}
