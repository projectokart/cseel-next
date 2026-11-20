import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CLOUDFLARE_ZONE_ID = '017c97b91954d0da917a27ee73502cef';

function toSlug(text: string): string {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const record = body.record || body.old_record || body;
    const eventType = body.type || 'MANUAL';

    const udiseCode = record.udise_code || record.udiseCode || record.id;
    const schoolName = record.school_name || record.name || '';
    const state = record.state_name || record.state || '';
    const district = record.district_name || record.district || '';

    const urlsToPurge: string[] = [];

    if (state && district && (schoolName || udiseCode)) {
      const stateSlug = toSlug(state);
      const distSlug = toSlug(district);
      const nameSlug = toSlug(schoolName);

      if (udiseCode && nameSlug) {
        urlsToPurge.push(`https://cseel.org/edu-network/school/${stateSlug}/${distSlug}/${udiseCode}/${nameSlug}`);
        urlsToPurge.push(`https://www.cseel.org/edu-network/school/${stateSlug}/${distSlug}/${udiseCode}/${nameSlug}`);
        urlsToPurge.push(`https://cseel.org/school/${stateSlug}/${distSlug}/${udiseCode}/${nameSlug}`);
      }
      if (udiseCode) {
        urlsToPurge.push(`https://cseel.org/edu-network/school/${stateSlug}/${distSlug}/${udiseCode}`);
        urlsToPurge.push(`https://www.cseel.org/edu-network/school/${stateSlug}/${distSlug}/${udiseCode}`);
      }
    }

    // Always revalidate the school directory listing path in Next.js
    revalidatePath('/edu-network/all-india');
    if (urlsToPurge.length > 0) {
      revalidatePath('/edu-network/school/[state]/[district]/[...slug]', 'page');
    }

    // If specific URLs exist, trigger Cloudflare Instant Edge Purge
    let cfPurgeResult = null;
    if (urlsToPurge.length > 0 && CLOUDFLARE_API_TOKEN) {
      const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files: urlsToPurge }),
        }
      );
      cfPurgeResult = await cfRes.json().catch(() => ({}));
    }

    return NextResponse.json({
      success: true,
      event: eventType,
      purgedUrls: urlsToPurge,
      cloudflare: cfPurgeResult,
      message: 'Cache successfully invalidated across Next.js ISR and Cloudflare CDN Edge.',
    });
  } catch (error: any) {
    console.error('Cache purge webhook error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
