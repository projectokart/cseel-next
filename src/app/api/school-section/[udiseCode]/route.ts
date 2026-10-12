import { NextRequest, NextResponse } from 'next/server';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import {
  SECTION_METADATA,
  resolveSectionId,
  readSyncStore,
  findSchoolTokenRecord,
  fetchBaseSchoolRow,
  extractSectionsFromData,
  applySectionMutation,
  ensureSchoolInDbAndStore,
} from '@/lib/schools/schoolSectionsManager';
import {
  checkRateLimitAndBots,
  sanitizePayloadDeep,
  verifySchoolWriteAuth,
} from '@/lib/security/apiSecurityGuard';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-sync-token, x-api-key, x-admin-key, x-magic-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

interface RouteContext {
  params: Promise<{
    udiseCode: string;
  }>;
}

/**
 * GET /api/school-section/[udiseCode]
 * Read ALL sections of a school (merged with Supabase school_profiles)
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_section_read',
    maxRequestsPerMinute: 90,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  try {
    const { udiseCode: rawUdise } = await context.params;
    const cleanUdise = (rawUdise || '').trim();

    let baseRow = await fetchBaseSchoolRow(cleanUdise);
    let store = readSyncStore();
    let tokenMatch = findSchoolTokenRecord(cleanUdise, store);

    if (!baseRow && !tokenMatch) {
      if (cleanUdise.length >= 8) {
        baseRow = await ensureSchoolInDbAndStore(cleanUdise);
        store = readSyncStore();
        tokenMatch = findSchoolTokenRecord(cleanUdise, store);
      }
    }

    if (!baseRow && !tokenMatch) {
      return NextResponse.json(
        {
          success: false,
          error: 'SCHOOL_NOT_FOUND',
          message: `No school found for UDISE code "${cleanUdise}".`,
        },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Fetch Supabase school_profiles row to ensure latest DB state is returned
    let supabaseProfRow: any = null;
    try {
      const { data: profData } = await schoolSearchSupabase
        .from('school_profiles')
        .select('*')
        .eq('udise_code', cleanUdise)
        .maybeSingle();
      supabaseProfRow = profData;
    } catch {}

    const supabaseProfileData =
      typeof supabaseProfRow?.profile_data === 'string'
        ? JSON.parse(supabaseProfRow.profile_data)
        : supabaseProfRow?.profile_data || {};

    const mergedProfileData = {
      ...(tokenMatch?.record?.profileData || {}),
      ...supabaseProfileData,
    };

    const sections = extractSectionsFromData(baseRow, mergedProfileData);

    const formattedSections: Record<string, any> = {};
    for (const [sKey, meta] of Object.entries(SECTION_METADATA)) {
      const dedicatedCol = supabaseProfRow?.[sKey];
      const mergedSectionData =
        dedicatedCol && typeof dedicatedCol === 'object' && !Array.isArray(dedicatedCol)
          ? { ...(sections[sKey] || {}), ...dedicatedCol }
          : sections[sKey] || {};

      formattedSections[sKey] = {
        id: sKey,
        name: meta.name,
        description: meta.description,
        field_rules: meta.field_rules || {},
        data: mergedSectionData,
      };
    }

    return NextResponse.json(
      {
        success: true,
        udiseCode: cleanUdise,
        schoolName:
          mergedProfileData?.schoolName ||
          baseRow?.school_name ||
          tokenMatch?.record?.schoolName ||
          '',
        totalSections: Object.keys(SECTION_METADATA).length,
        sectionsList: Object.keys(SECTION_METADATA).map((k) => ({
          id: k,
          name: SECTION_METADATA[k].name,
          endpoint: `/api/school-section/${cleanUdise}/${k}`,
        })),
        sections: formattedSections,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * POST or PUT /api/school-section/[udiseCode]
 * Bulk write multiple sections at once (Admin or verified 16-char Magic Link required)
 */
export async function POST(req: NextRequest, context: RouteContext) {
  return handleBulkMutation(req, context, 'replace');
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return handleBulkMutation(req, context, 'replace');
}

/**
 * PATCH /api/school-section/[udiseCode]
 * Bulk update multiple sections (Admin or verified 16-char Magic Link required)
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
  return handleBulkMutation(req, context, 'patch');
}

async function handleBulkMutation(
  req: NextRequest,
  context: RouteContext,
  mode: 'replace' | 'patch'
) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_section_write',
    maxRequestsPerMinute: 40,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  try {
    const { udiseCode: rawUdise } = await context.params;
    const cleanUdise = (rawUdise || '').trim();

    const rawBody = await req.json().catch(() => ({}));
    const body = sanitizePayloadDeep(rawBody);

    const authResult = await verifySchoolWriteAuth(req, cleanUdise, {
      magicKey: body.magicKey || body.token || body.syncToken,
      adminKey: body.adminKey,
      adminEmail: body.adminEmail,
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED_WRITE',
          message: authResult.reason,
        },
        { status: 403, headers: CORS_HEADERS }
      );
    }

    const sectionsPayload = body.sections || body;

    if (!sectionsPayload || typeof sectionsPayload !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PAYLOAD',
          message: 'Expected a JSON object with section keys (e.g. { basic_info: {...}, stats: {...} }).',
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const updatedSections: Record<string, any> = {};
    const errors: Record<string, string> = {};
    const skipMetaKeys = new Set(['magicKey', 'token', 'syncToken', 'adminKey', 'adminEmail']);

    for (const [key, sectionData] of Object.entries(sectionsPayload)) {
      if (skipMetaKeys.has(key)) continue;
      const sectionId = resolveSectionId(key);
      if (!sectionId) {
        errors[key] = `Unknown section key "${key}".`;
        continue;
      }

      try {
        const res = await applySectionMutation({
          cleanUdise,
          sectionId,
          data: sectionData,
          mode,
        });
        updatedSections[sectionId] = res.updatedSectionData;
      } catch (subErr: any) {
        errors[sectionId] = subErr.message;
      }
    }

    return NextResponse.json(
      {
        success: Object.keys(errors).length === 0,
        action: mode,
        udiseCode: cleanUdise,
        authMode: authResult.mode,
        updatedSectionsCount: Object.keys(updatedSections).length,
        updatedSections,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'BULK_MUTATION_ERROR', message: err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * DELETE /api/school-section/[udiseCode]
 * Reset all sections for this school back to baseline UDISE values (Admin or Magic Link required)
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_section_write',
    maxRequestsPerMinute: 20,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  try {
    const { udiseCode: rawUdise } = await context.params;
    const cleanUdise = (rawUdise || '').trim();

    const authResult = await verifySchoolWriteAuth(req, cleanUdise);
    if (!authResult.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED_DELETE',
          message: authResult.reason,
        },
        { status: 403, headers: CORS_HEADERS }
      );
    }

    const results: Record<string, boolean> = {};
    for (const sectionId of Object.keys(SECTION_METADATA)) {
      try {
        await applySectionMutation({
          cleanUdise,
          sectionId,
          data: {},
          mode: 'delete',
        });
        results[sectionId] = true;
      } catch {
        results[sectionId] = false;
      }
    }

    return NextResponse.json(
      {
        success: true,
        action: 'reset_all',
        udiseCode: cleanUdise,
        message: `All sections for school (UDISE: ${cleanUdise}) have been reset to verified baseline values.`,
        resetSections: results,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'RESET_ERROR', message: err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
