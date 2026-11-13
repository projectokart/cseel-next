import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { purgeCloudflareCache, revalidateAndPurgePaths } from '@/lib/cache/cloudflarePurge';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || '/edu-network/organisation/school';
  const purgeAllParam = request.nextUrl.searchParams.get('all') === 'true';
  const secretParam =
    request.headers.get('x-purge-secret') || request.nextUrl.searchParams.get('secret') || '';

  try {
    const targetPaths = [
      path,
      '/edu-network/organisation/school',
      '/edu-network/schools',
      '/edu-network/school',
      '/',
    ];

    let cloudflareResult;
    if (
      purgeAllParam &&
      process.env.CSEEL_SECURITY_SECRET &&
      secretParam === process.env.CSEEL_SECURITY_SECRET
    ) {
      targetPaths.forEach((p) => revalidatePath(p));
      cloudflareResult = await purgeCloudflareCache({
        purgeEverything: true,
        warmUrls: ['/', '/schools', path],
      });
    } else {
      cloudflareResult = await revalidateAndPurgePaths(targetPaths);
    }

    return NextResponse.json({
      revalidated: true,
      path,
      purged: targetPaths,
      cloudflare: cloudflareResult,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
  }
}
