import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * GET /api/faculty/check?email=...&phone=...
 * Check if a faculty profile already exists for this email or phone
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.trim();
    const phone = searchParams.get('phone')?.replace(/[^0-9]/g, '');

    if (!email && !phone) {
      return NextResponse.json({ exists: false });
    }

    const filters: string[] = [];
    if (email) filters.push(`email.eq.${encodeURIComponent(email)}`);
    if (phone) filters.push(`phone.eq.${phone}`);

    const query = filters.length === 1 ? filters[0] : `or=(${filters.join(',')})`;
    const url = `${SUPABASE_URL}/rest/v1/teachers?${query}&select=id,slug,name,email,phone,subject,qualification,city,state,verified,avatar_url`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return NextResponse.json({ exists: false });
    }

    const rows = await res.json();
    if (Array.isArray(rows) && rows.length > 0) {
      const p = rows[0];
      return NextResponse.json({
        exists: true,
        profile: {
          id: p.id,
          slug: p.slug,
          name: p.name,
          email: p.email,
          phone: p.phone,
          subject: p.subject,
          qualification: p.qualification,
          city: p.city,
          state: p.state,
          verified: Boolean(p.verified),
          avatar: p.avatar_url,
        },
      });
    }

    return NextResponse.json({ exists: false });
  } catch (err: any) {
    console.error('[API /api/faculty/check] Error:', err);
    return NextResponse.json({ exists: false });
  }
}
