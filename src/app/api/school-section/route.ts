export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import {
  SECTION_METADATA,
  resolveSectionId,
  readSyncStore,
  findSchoolTokenRecord,
  fetchBaseSchoolRow,
  extractSectionsFromData,
  applySectionMutation,
} from '@/lib/schools/schoolSectionsManager';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-sync-token, x-api-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

/**
 * GET /api/school-section
 * Query by ?udiseCode=...&section=... OR get API Docs
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const udiseCode = (searchParams.get('udiseCode') || searchParams.get('code') || '').trim();
    const rawSection = (searchParams.get('section') || searchParams.get('sectionId') || '').trim();

    // If no UDISE provided, return API Documentation & Section Directory
    if (!udiseCode) {
      return NextResponse.json(
        {
          success: true,
          title: 'CSEEL School Profile Section CRUD API',
          description: 'Universal REST API to Read (GET), Write (POST/PUT), Update (PATCH), and Delete/Reset (DELETE) every section of any school profile.',
          supportedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          routes: {
            singleSection: '/api/school-section/:udiseCode/:sectionId',
            allSections: '/api/school-section/:udiseCode',
            queryParamUsage: '/api/school-section?udiseCode=:udiseCode&section=:sectionId',
          },
          totalSections: Object.keys(SECTION_METADATA).length,
          availableSections: Object.entries(SECTION_METADATA).map(([key, meta]) => ({
            id: key,
            name: meta.name,
            description: meta.description,
            aliases: meta.aliases,
            endpoints: {
              read: `GET /api/school-section/:udiseCode/${key}`,
              write: `POST /api/school-section/:udiseCode/${key}`,
              update: `PATCH /api/school-section/:udiseCode/${key}`,
              delete: `DELETE /api/school-section/:udiseCode/${key}`,
            },
          })),
          examplePayloads: {
            updatePrincipal: {
              method: 'PATCH',
              url: '/api/school-section/070507ND105/principal',
              body: {
                principal_message: 'Empowering curious minds to lead tomorrow.',
                principal_designation: 'Head of Institution',
              },
            },
            writeHeroStats: {
              method: 'PATCH',
              url: '/api/school-section/070507ND105/hero',
              body: {
                boarding_status: 'Day School',
                tagline: 'Leading Primary Institution in Central Delhi',
              },
            },
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    const baseRow = await fetchBaseSchoolRow(udiseCode);
    const store = readSyncStore();
    const tokenMatch = findSchoolTokenRecord(udiseCode, store);

    if (!baseRow && !tokenMatch) {
      return NextResponse.json(
        {
          success: false,
          error: 'SCHOOL_NOT_FOUND',
          message: `School with UDISE code "${udiseCode}" was not found.`,
        },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const sections = extractSectionsFromData(baseRow, tokenMatch?.record?.profileData || null);

    // If specific section requested
    if (rawSection) {
      const sectionId = resolveSectionId(rawSection);
      if (!sectionId) {
        return NextResponse.json(
          {
            success: false,
            error: 'INVALID_SECTION_ID',
            message: `Unknown section "${rawSection}". Available: ${Object.keys(SECTION_METADATA).join(', ')}`,
          },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      return NextResponse.json(
        {
          success: true,
          udiseCode,
          schoolName: baseRow?.school_name || tokenMatch?.record?.schoolName || '',
          section: {
            id: sectionId,
            name: SECTION_METADATA[sectionId]?.name,
            data: sections[sectionId] || {},
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    // Return all sections
    return NextResponse.json(
      {
        success: true,
        udiseCode,
        schoolName: baseRow?.school_name || tokenMatch?.record?.schoolName || '',
        totalSections: Object.keys(SECTION_METADATA).length,
        sections,
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
 * POST or PUT /api/school-section
 * Body: { udiseCode, section, data }
 */
export async function POST(req: NextRequest) {
  return handleBodyMutation(req, 'replace');
}

export async function PUT(req: NextRequest) {
  return handleBodyMutation(req, 'replace');
}

/**
 * PATCH /api/school-section
 * Body: { udiseCode, section, data }
 */
export async function PATCH(req: NextRequest) {
  return handleBodyMutation(req, 'patch');
}

/**
 * DELETE /api/school-section
 * Body: { udiseCode, section }
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const udiseCode = (body.udiseCode || body.code || searchParams.get('udiseCode') || '').trim();
    const rawSection = (body.section || body.sectionId || searchParams.get('section') || '').trim();

    if (!udiseCode) {
      return NextResponse.json(
        { success: false, error: 'MISSING_UDISE_CODE', message: 'udiseCode parameter is required.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const sectionId = resolveSectionId(rawSection);
    if (!sectionId) {
      return NextResponse.json(
        { success: false, error: 'INVALID_SECTION_ID', message: `Unknown section "${rawSection}".` },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const result = await applySectionMutation({
      cleanUdise: udiseCode,
      sectionId,
      data: {},
      mode: 'delete',
    });

    return NextResponse.json(
      {
        success: true,
        action: 'delete',
        udiseCode,
        section: {
          id: sectionId,
          name: SECTION_METADATA[sectionId]?.name,
          data: result.updatedSectionData,
        },
        message: result.message,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'DELETE_ERROR', message: err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

async function handleBodyMutation(req: NextRequest, mode: 'replace' | 'patch') {
  try {
    const body = await req.json().catch(() => ({}));
    const udiseCode = (body.udiseCode || body.code || '').trim();
    const rawSection = (body.section || body.sectionId || '').trim();
    const data = body.data !== undefined ? body.data : body;

    if (!udiseCode) {
      return NextResponse.json(
        { success: false, error: 'MISSING_UDISE_CODE', message: 'udiseCode is required in request body.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const sectionId = resolveSectionId(rawSection);
    if (!sectionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_SECTION_ID',
          message: `Unknown section "${rawSection}". Available: ${Object.keys(SECTION_METADATA).join(', ')}`,
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const result = await applySectionMutation({
      cleanUdise: udiseCode,
      sectionId,
      data,
      mode,
    });

    return NextResponse.json(
      {
        success: true,
        action: mode,
        udiseCode,
        section: {
          id: sectionId,
          name: SECTION_METADATA[sectionId]?.name,
          data: result.updatedSectionData,
        },
        message: result.message,
        supabaseSynced: result.supabaseSynced,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `${mode.toUpperCase()}_ERROR`, message: err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
