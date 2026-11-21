import { Pool } from 'pg';

const NEON_DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  'postgresql://neondb_owner:npg_DMyAQhtSi91K@ep-hidden-salad-bdhex1vt-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require';

let pool: Pool | null = null;

export function getNeonPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

export interface QuerySchoolsParams {
  page?: number;
  limit?: number;
  state?: string | null;
  district?: string | null;
  block?: string | null;
  cluster?: string | null;
  board?: string | null;
  management?: string | null;
  category?: string | null;
  medium?: string | null;
  search?: string | null;
  sort?: string | null;
  userLat?: number | null;
  userLng?: number | null;
  radiusKm?: number;
}

export async function fetchSchoolsFromNeon(params: QuerySchoolsParams) {
  const p = getNeonPool();
  const page = Math.max(1, Math.min(10, params.page || 1));
  const limit = params.limit || 25;
  const offset = (page - 1) * limit;

  const whereClauses: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (params.state) {
    whereClauses.push(`UPPER(state_name) = UPPER($${idx++})`);
    values.push(params.state.trim());
  }

  if (params.district) {
    whereClauses.push(`UPPER(district_name) = UPPER($${idx++})`);
    values.push(params.district.trim());
  }

  if (params.block) {
    whereClauses.push(`UPPER(block_name) = UPPER($${idx++})`);
    values.push(params.block.trim());
  }

  if (params.cluster) {
    whereClauses.push(`cluster_name = $${idx++}`);
    values.push(params.cluster.trim());
  }

  if (params.board && params.board.toLowerCase() !== 'all') {
    const b = params.board.toLowerCase();
    if (b.includes('cbse')) {
      whereClauses.push(`(board_10th ILIKE '%cbse%' OR board_12th ILIKE '%cbse%')`);
    } else if (b.includes('icse')) {
      whereClauses.push(`(board_10th ILIKE '%icse%' OR board_12th ILIKE '%icse%')`);
    } else if (b.includes('state')) {
      whereClauses.push(`(board_10th ILIKE '%state%' OR board_12th ILIKE '%state%')`);
    } else {
      whereClauses.push(`(board_10th ILIKE $${idx} OR board_12th ILIKE $${idx})`);
      values.push(`%${params.board}%`);
      idx++;
    }
  }

  if (params.management && params.management.toLowerCase() !== 'all') {
    if (params.management.toLowerCase().includes('unrecog')) {
      whereClauses.push(`management_desc ILIKE '%Unrecognized%'`);
    } else {
      whereClauses.push(`(management_desc ILIKE '%Private%' OR management_desc ILIKE '%Unaided%')`);
    }
  }

  if (params.category && params.category.toLowerCase() !== 'all') {
    whereClauses.push(`school_category ILIKE $${idx++}`);
    values.push(`%${params.category}%`);
  }

  if (params.medium && params.medium.toLowerCase() !== 'all') {
    whereClauses.push(`primary_medium ILIKE $${idx++}`);
    values.push(`%${params.medium}%`);
  }

  if (params.search) {
    const cleanSearch = params.search.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
    if (cleanSearch) {
      if (/^\d+$/.test(cleanSearch)) {
        whereClauses.push(`(udise_code = $${idx} OR pincode = $${idx})`);
        values.push(cleanSearch);
        idx++;
      } else {
        whereClauses.push(`(school_name ILIKE $${idx} OR district_name ILIKE $${idx} OR state_name ILIKE $${idx})`);
        values.push(`%${cleanSearch}%`);
        idx++;
      }
    }
  }

  let orderBy = 'udise_code ASC';
  if (params.sort === 'name_asc') orderBy = 'school_name ASC NULLS LAST';
  else if (params.sort === 'name_desc') orderBy = 'school_name DESC NULLS LAST';
  else if (params.sort === 'students_desc') orderBy = 'total_students DESC NULLS LAST';
  else if (params.sort === 'students_asc') orderBy = 'total_students ASC NULLS LAST';
  else if (params.sort === 'established_desc') orderBy = 'established_year DESC NULLS LAST';

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT udise_code, school_name, state_name, district_name, block_name, cluster_name,
           village_name, management_desc, school_category, primary_medium, school_type_desc,
           board_10th, board_12th, website, total_students, established_year, address, pincode,
           latitude, longitude, is_verified, rating
    FROM udise_private_schools
    ${whereSql}
    ORDER BY ${orderBy}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countSql = `
    SELECT count(*) as total
    FROM udise_private_schools
    ${whereSql}
  `;

  const [dataRes, countRes] = await Promise.all([
    p.query(sql, values),
    p.query(countSql, values)
  ]);

  const totalCount = parseInt(countRes.rows[0]?.total || '0', 10);
  return {
    schools: dataRes.rows,
    totalCount,
    currentPage: page,
    totalPages: Math.max(1, Math.min(10, Math.ceil(totalCount / limit)))
  };
}
