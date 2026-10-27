import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYXpreHRoYXZ4cGhpYmRic3BkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgxOTgzOCwiZXhwIjoyMDg5Mzk1ODM4fQ.Od_IWU3qrttP28AdPajuJfxitTqQIXVo9dXSzFS-Kms';

/**
 * GET /api/admin/faculty
 * Fetch all registered faculty for Admin Verification queue
 */
export async function GET(req: NextRequest) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/teachers?order=id.desc&select=*`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`[API /api/admin/faculty GET] Supabase returned status ${res.status}`);
      return NextResponse.json({ success: true, faculty: [] });
    }

    const rows = await res.json();
    const faculty = Array.isArray(rows)
      ? rows.map((r: any) => ({
          id: r.id || r.slug,
          slug: r.slug,
          name: r.name,
          phone: r.phone,
          email: r.email,
          subject: r.subject,
          qualification: r.qualification,
          experience: `${r.experience_years || 3} Years`,
          experienceYears: r.experience_years || 3,
          currentInstitute: r.current_institute,
          city: r.city,
          state: r.state,
          verified: Boolean(r.verified),
          status: r.verified ? 'Verified' : 'Pending Review',
          expectedSalary: r.expected_salary,
          avatar: r.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
          bio: r.bio,
          skills: Array.isArray(r.specializations) ? r.specializations.join(', ') : (r.specializations || ''),
          createdAt: r.created_at || new Date().toISOString(),
        }))
      : [];

    return NextResponse.json({
      success: true,
      faculty,
      totalCount: faculty.length,
      pendingCount: faculty.filter((f) => !f.verified).length,
      verifiedCount: faculty.filter((f) => f.verified).length,
    });
  } catch (err: any) {
    console.error('[API /api/admin/faculty GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/faculty
 * Admin updates faculty verification status (Verify or Revoke)
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, slug, verified } = body;

    if (!id && !slug) {
      return NextResponse.json({ success: false, error: 'Teacher ID or slug is required' }, { status: 400 });
    }

    const isVerified = Boolean(verified);

    // Update in Supabase
    let filterQuery = id ? `id=eq.${id}` : `slug=eq.${slug}`;
    const updateUrl = `${SUPABASE_URL}/rest/v1/teachers?${filterQuery}`;

    const res = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        verified: isVerified,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[API /api/admin/faculty PATCH] Error updating Supabase:', res.status, errText);
    }

    return NextResponse.json({
      success: true,
      id,
      slug,
      verified: isVerified,
      message: isVerified ? 'Faculty successfully verified! Badge granted.' : 'Faculty verification revoked.',
    });
  } catch (err: any) {
    console.error('[API /api/admin/faculty PATCH] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/faculty
 * Admin deletes spam/invalid faculty submission
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ success: false, error: 'Teacher ID or slug is required' }, { status: 400 });
    }

    const filterQuery = id ? `id=eq.${id}` : `slug=eq.${slug}`;
    const deleteUrl = `${SUPABASE_URL}/rest/v1/teachers?${filterQuery}`;

    const res = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('[API /api/admin/faculty DELETE] Supabase error:', res.status, errText);
    }

    return NextResponse.json({
      success: true,
      message: 'Faculty profile removed successfully.',
    });
  } catch (err: any) {
    console.error('[API /api/admin/faculty DELETE] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
