import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface PrivateLookupsPayload {
  states: { state_id: number; state_name: string; total_schools: number }[];
  districts_by_state: Record<string, { district_id: number; district_name: string; state_id: number; state_name: string; total_schools: number }[]>;
  blocks_by_district: Record<string, { block_id: number; block_name: string; district_id: number; district_name: string; total_schools: number }[]>;
  clusters_by_block: Record<string, { cluster_id: string; cluster_name: string; block_id: string }[]>;
  boards: { board_id: string; board_name: string; code: string }[];
  managements: { management_id: string; management_desc: string }[];
  residential_types: { id: string; name: string }[];
}

let cachedLookups: PrivateLookupsPayload | null = null;

function getLookups(): PrivateLookupsPayload {
  if (cachedLookups) return cachedLookups;
  const filePath = path.join(process.cwd(), 'src', 'data', 'privateSchoolLookups.json');
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedLookups = JSON.parse(raw);
    return cachedLookups!;
  }
  return {
    states: [],
    districts_by_state: {},
    blocks_by_district: {},
    clusters_by_block: {},
    boards: [],
    managements: [],
    residential_types: [],
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateParam = searchParams.get('state_id') || searchParams.get('state') || searchParams.get('state_name');
    const districtParam = searchParams.get('district_id') || searchParams.get('district') || searchParams.get('district_name');
    const blockParam = searchParams.get('block_id') || searchParams.get('block') || searchParams.get('block_name');

    const data = getLookups();

    // 1. Clusters Request (by block)
    if (blockParam) {
      let resolvedBlockId = blockParam.trim();
      let clusters = data.clusters_by_block[resolvedBlockId] || [];
      if (!clusters.length) {
        const cleanBlock = blockParam.trim().toUpperCase();
        for (const blkList of Object.values(data.blocks_by_district)) {
          const match = blkList.find(
            (b) => b.block_name.toUpperCase() === cleanBlock || String(b.block_id) === resolvedBlockId
          );
          if (match && data.clusters_by_block[String(match.block_id)]) {
            clusters = data.clusters_by_block[String(match.block_id)];
            resolvedBlockId = String(match.block_id);
            break;
          }
        }
      }
      if (!clusters.length) {
        // Search across block values
        for (const [bKey, cList] of Object.entries(data.clusters_by_block)) {
          if (bKey.toLowerCase() === blockParam.toLowerCase().trim() || bKey === blockParam) {
            clusters = cList;
            break;
          }
        }
      }
      const sortedClusters = [...clusters].sort((a, b) =>
        (a.cluster_name || '').localeCompare(b.cluster_name || '', undefined, { sensitivity: 'base' })
      );
      return NextResponse.json({
        success: true,
        clusters: sortedClusters.map((c, i) => ({
          cluster_id: c.cluster_id || String(i + 1),
          cluster_name: c.cluster_name,
          block_id: resolvedBlockId,
          total_schools: (c as any).total_schools || 0,
        })),
      });
    }

    // 2. Blocks Request (by district)
    if (districtParam) {
      const cleanDist = districtParam.trim().toUpperCase();
      let blocks = data.blocks_by_district[cleanDist] || data.blocks_by_district[districtParam.trim()] || [];
      if (!blocks.length) {
        for (const [dKey, bList] of Object.entries(data.blocks_by_district)) {
          if (dKey.toLowerCase() === cleanDist.toLowerCase() || dKey === districtParam) {
            blocks = bList;
            break;
          }
        }
      }
      const sortedBlocks = [...blocks].sort((a, b) =>
        (a.block_name || '').localeCompare(b.block_name || '', undefined, { sensitivity: 'base' })
      );
      return NextResponse.json({
        success: true,
        blocks: sortedBlocks.map((b) => ({
          block_id: b.block_id,
          block_name: b.block_name,
          district_id: b.district_id,
          district_name: b.district_name,
          total_schools: b.total_schools,
        })),
      });
    }

    // 3. Districts Request (by state)
    let districts: any[] = [];
    if (stateParam) {
      const cleanState = stateParam.trim().toUpperCase();
      districts = data.districts_by_state[cleanState] || data.districts_by_state[stateParam.trim()] || [];
      if (!districts.length) {
        for (const [sKey, dList] of Object.entries(data.districts_by_state)) {
          if (sKey.toLowerCase() === cleanState.toLowerCase() || sKey === stateParam) {
            districts = dList;
            break;
          }
        }
      }
    }
    const sortedDistricts = [...districts].sort((a, b) =>
      (a.district_name || '').localeCompare(b.district_name || '', undefined, { sensitivity: 'base' })
    );

    const sortedStates = [...data.states].sort((a, b) =>
      (a.state_name || '').localeCompare(b.state_name || '', undefined, { sensitivity: 'base' })
    );

    const sortedBoards = [...data.boards].sort((a, b) =>
      (a.board_name || '').localeCompare(b.board_name || '', undefined, { sensitivity: 'base' })
    );

    const sortedManagements = [...data.managements].sort((a, b) =>
      (a.management_desc || '').localeCompare(b.management_desc || '', undefined, { sensitivity: 'base' })
    );

    return NextResponse.json({
      success: true,
      states: sortedStates,
      districts: sortedDistricts,
      boards: sortedBoards,
      managements: sortedManagements,
      residential_types: data.residential_types,
      categories: [
        { category_id: 1, category_desc: 'Primary (Class 1-5)' },
        { category_id: 2, category_desc: 'Upper Primary (Class 1-8)' },
        { category_id: 3, category_desc: 'Higher Secondary (Class 1-12)' },
        { category_id: 6, category_desc: 'Secondary (Class 1-10)' },
        { category_id: 10, category_desc: 'Senior Secondary (Class 9-12)' },
        { category_id: 11, category_desc: 'Junior College (Class 11-12)' },
      ],
      mediums: [
        { medium_id: 1, medium_name: 'English' },
        { medium_id: 2, medium_name: 'Hindi' },
        { medium_id: 3, medium_name: 'Regional / State Language' },
      ],
    });
  } catch (error: any) {
    console.error('API /api/schools/lookups error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
