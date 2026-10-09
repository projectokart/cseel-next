import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  parseSchoolJsonToState,
  BLANK_AI_SCHOOL_SCHEMA,
} from '@/components/schools/template/SchoolJsonSchemaHelper';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'school_ai_sync_tokens.json');
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const UDISE_BASE_URL = 'https://kys.udiseplus.gov.in/web-app/api';
const UDISE_HEADERS = {
  'x-app-signature': '9f2c7a4b8e1d6c3f5a9b0e2d4f6a7c8b',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
};

export const ADMIN_MASTER_MAGIC_TOKEN = 'csl_admin_master_magic_key';

interface SyncTokenRecord {
  token: string;
  schoolId: string;
  schoolName: string;
  createdAt: number;
  expiresAt: number;
  isPermanent?: boolean;
  lastUpdatedAt?: number;
  lastUpdatedSource?: string;
  profileData?: any;
}

interface SyncStore {
  tokens: Record<string, SyncTokenRecord>;
}

function readSyncStore(): SyncStore {
  let store: SyncStore = { tokens: {} };
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      store = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading school_ai_sync_tokens.json:', err);
  }

  if (!store.tokens) store.tokens = {};

  // Ensure Common Master Admin Magic Link is ALWAYS valid and permanent
  if (!store.tokens[ADMIN_MASTER_MAGIC_TOKEN]) {
    store.tokens[ADMIN_MASTER_MAGIC_TOKEN] = {
      token: ADMIN_MASTER_MAGIC_TOKEN,
      schoolId: 'all_schools',
      schoolName: 'CSEEL Admin Master Universal Portal',
      createdAt: 1791522000000,
      expiresAt: 0,
      isPermanent: true,
      lastUpdatedAt: Date.now(),
      lastUpdatedSource: 'System Master Key',
    };
  } else {
    store.tokens[ADMIN_MASTER_MAGIC_TOKEN].isPermanent = true;
    store.tokens[ADMIN_MASTER_MAGIC_TOKEN].expiresAt = 0;
  }

  return store;
}

function writeSyncStore(store: SyncStore) {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing school_ai_sync_tokens.json:', err);
  }
}

// Enable CORS for external AI agents, ChatGPT Actions, and webhook callers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Normalizes strings by lowercasing and stripping non-alphanumeric characters.
 */
function normalizeString(val: string | null | undefined): string {
  if (!val) return '';
  return String(val).toLowerCase().replace(/[^a-z0-9]/g, '');
}

export interface OfficialUdiseData {
  udiseCode: string;
  schoolName: string;
  district: string;
  state: string;
  pincode: string;
  block: string;
  village: string;
  address: string;
  board?: string;
  classFrom?: number | string;
  classTo?: number | string;
}

/**
 * Verifies the school data against official government UDISE+ database.
 * Matches: School Name, District, State, and Pincode.
 */
async function verifyUdiseWithGovt(
  udiseCode: string,
  inputName?: string,
  inputDistrict?: string,
  inputState?: string,
  inputPincode?: string
): Promise<{ valid: boolean; reason?: string; official?: OfficialUdiseData }> {
  const cleanCode = udiseCode.trim().replace(/\D/g, '');
  if (cleanCode.length !== 11) {
    return {
      valid: false,
      reason: `UDISE code must be exactly 11 digits (provided: "${udiseCode}" with ${cleanCode.length} digits).`,
    };
  }

  try {
    const res = await fetch(`${UDISE_BASE_URL}/school/by-year?udiseSchCode=${cleanCode}&action=1`, {
      headers: UDISE_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return {
        valid: false,
        reason: `Official government UDISE portal returned HTTP error ${res.status} for code "${cleanCode}".`,
      };
    }

    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data[0] : json?.data;

    if (!data || !data.schoolName) {
      return {
        valid: false,
        reason: `❌ STRICT RULE: School cannot be added! Government UDISE+ database par code "${cleanCode}" ka koi record nahi mila. Sirf official government-verified schools hi add ho sakte hain.`,
      };
    }

    const official: OfficialUdiseData = {
      udiseCode: cleanCode,
      schoolName: String(data.schoolName || '').trim(),
      district: String(data.districtName || '').trim(),
      state: String(data.stateName || '').trim(),
      pincode: String(data.pincode || '').trim(),
      block: String(data.blockName || '').trim(),
      village: String(data.villageName || '').trim(),
      address: String(data.address || '').trim(),
      classFrom: data.classFrm,
      classTo: data.classTo,
    };

    const mismatches: string[] = [];

    // Check State
    if (inputState && inputState.trim()) {
      const normInput = normalizeString(inputState);
      const normOfficial = normalizeString(official.state);
      if (!normOfficial.includes(normInput) && !normInput.includes(normOfficial)) {
        mismatches.push(`State mismatch: You entered "${inputState}", but official government record is "${official.state}".`);
      }
    }

    // Check District
    if (inputDistrict && inputDistrict.trim()) {
      const normInput = normalizeString(inputDistrict);
      const normOfficial = normalizeString(official.district);
      if (!normOfficial.includes(normInput) && !normInput.includes(normOfficial)) {
        mismatches.push(`District mismatch: You entered "${inputDistrict}", but official government record is "${official.district}".`);
      }
    }

    // Check School Name (fuzzy match: substring or major keyword overlap)
    if (inputName && inputName.trim()) {
      const normInput = normalizeString(inputName);
      const normOfficial = normalizeString(official.schoolName);

      const ignoredWords = new Set(['school', 'the', 'and', 'public', 'senior', 'secondary', 'academy', 'international', 'vidyalaya']);
      const inputKeywords = inputName
        .toLowerCase()
        .split(/\s+/)
        .map((w) => w.replace(/[^a-z0-9]/g, ''))
        .filter((w) => w.length > 2 && !ignoredWords.has(w));

      const hasKeywordMatch = inputKeywords.length === 0 || inputKeywords.some((w) => normOfficial.includes(w));
      const hasSubstringMatch = normOfficial.includes(normInput) || normInput.includes(normOfficial);

      if (!hasSubstringMatch && !hasKeywordMatch) {
        mismatches.push(`School Name mismatch: You entered "${inputName}", but official government record is "${official.schoolName}".`);
      }
    }

    // Check Pincode
    if (inputPincode && inputPincode.trim() && official.pincode) {
      const normInputPin = inputPincode.trim().replace(/\D/g, '');
      const normOfficialPin = official.pincode.replace(/\D/g, '');
      if (normInputPin && normOfficialPin && normInputPin !== normOfficialPin) {
        mismatches.push(`Pincode mismatch: You entered "${inputPincode}", but official government record is "${official.pincode}".`);
      }
    }

    if (mismatches.length > 0) {
      return {
        valid: false,
        reason: mismatches.join(' | '),
        official,
      };
    }

    return {
      valid: true,
      official,
    };
  } catch (err: any) {
    return {
      valid: false,
      reason: `Could not reach official government UDISE verification server: ${err.message}`,
    };
  }
}

/**
 * Extracts UDISE code from various possible locations in request payload or query
 */
function extractUdiseCode(body: any, searchParams: URLSearchParams): string {
  const fromQuery = searchParams.get('udise') || searchParams.get('udiseCode') || searchParams.get('udise_code');
  if (fromQuery) return fromQuery.trim();

  if (!body || typeof body !== 'object') return '';

  const direct = body.udise_code || body.udiseCode || body.udise || body.school_id || body.id;
  if (direct && String(direct).replace(/\D/g, '').length === 11) {
    return String(direct).trim();
  }

  const basic = body.tab_1_home?.school_basic_info || body.school_basic_info;
  if (basic) {
    const fromBasic = basic.udise_code || basic.udiseCode || basic.udise;
    if (fromBasic) return String(fromBasic).trim();
  }

  return direct ? String(direct).trim() : '';
}

/**
 * GET:
 * 1. AI agents / API callers receive current data, status, and schema blueprint.
 * 2. Lookup existing school by UDISE code (?action=lookup&udise=...)
 * 3. Browser visitors receive a developer-friendly interactive dashboard.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const action = (searchParams.get('action') || 'read').toLowerCase();
  const udiseQuery = searchParams.get('udise') || searchParams.get('udiseCode');

  // Handle new token generation request from frontend
  if (action === 'generate') {
    const schoolId = searchParams.get('schoolId') || `custom-${Date.now()}`;
    const schoolName = searchParams.get('schoolName') || 'School Profile';

    const newToken = `csl_ai_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
    const now = Date.now();
    const expiresAt = now + ONE_WEEK_MS;

    const store = readSyncStore();
    store.tokens[newToken] = {
      token: newToken,
      schoolId,
      schoolName,
      createdAt: now,
      expiresAt,
    };
    writeSyncStore(store);

    return NextResponse.json(
      {
        success: true,
        token: newToken,
        expiresAt: new Date(expiresAt).toISOString(),
        expiresInDays: 7,
      },
      { headers: CORS_HEADERS }
    );
  }

  // Handle Lookup / Check if UDISE already exists in DB
  if (action === 'lookup' && udiseQuery) {
    const cleanCode = udiseQuery.trim().replace(/\D/g, '');
    const { data: dbSchool } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('*')
      .eq('udise_code', cleanCode)
      .maybeSingle();

    const govtVerification = await verifyUdiseWithGovt(cleanCode);

    return NextResponse.json(
      {
        success: true,
        udiseCode: cleanCode,
        isRegisteredInDb: Boolean(dbSchool),
        dbRecord: dbSchool || null,
        officialGovtRecord: govtVerification.official || null,
        govtVerified: govtVerification.valid,
        message: dbSchool
          ? `School with UDISE ${cleanCode} is already present in database ("${dbSchool.school_name}"). You can update this record.`
          : `School with UDISE ${cleanCode} is not yet registered in database. You can create a new record.`,
      },
      { headers: CORS_HEADERS }
    );
  }

  if (!token) {
    return NextResponse.json(
      { error: 'Missing sync token. Use ?token=<your_sync_token>' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const store = readSyncStore();
  const record = store.tokens[token];

  if (!record) {
    return NextResponse.json(
      { error: 'Invalid sync token or token does not exist.' },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  // Check expiration (Admin Master Key or isPermanent never expires)
  const isPermanent = Boolean(record.isPermanent || record.expiresAt === 0 || token === ADMIN_MASTER_MAGIC_TOKEN);
  const now = Date.now();
  const isExpired = !isPermanent && now > record.expiresAt;
  const remainingMs = isPermanent ? Infinity : record.expiresAt - now;
  const remainingDays = isPermanent ? 'Permanent (Never Expires)' : `${Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)))} days left`;

  if (isExpired) {
    return NextResponse.json(
      {
        error: 'This AI Sync link has expired (7-day validity ended). Please generate a new link from the School Dashboard.',
        status: 'expired',
        expiredAt: new Date(record.expiresAt).toISOString(),
      },
      { status: 410, headers: CORS_HEADERS }
    );
  }

  const format = searchParams.get('format');
  const userAgent = (req.headers.get('user-agent') || '').toLowerCase();
  const acceptHeader = req.headers.get('accept') || '';

  // Return raw JSON schema blueprint if requested via format=json, or if caller is AI crawler / curl / python
  const wantsRawJson =
    format === 'json' ||
    !acceptHeader.includes('text/html') ||
    userAgent.includes('chatgpt-user') ||
    userAgent.includes('python') ||
    userAgent.includes('curl');

  if (!wantsRawJson) {
    const origin = req.nextUrl.origin;
    const fullSyncUrl = `${origin}/api/school-ai-sync?token=${token}`;
    const expiresFormatted = isPermanent ? 'Permanent / Never Expires' : new Date(record.expiresAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const prettyBlueprint = JSON.stringify(BLANK_AI_SCHOOL_SCHEMA, null, 2);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSEEL AI Profile Sync Endpoint | ${record.schoolName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
  <div class="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-bold">⚡</div>
        <div>
          <h1 class="text-lg font-black text-white">CSEEL AI Profile Live Sync & CRUD Endpoint</h1>
          <p class="text-xs text-slate-400">Target School: <strong class="text-indigo-400">${record.schoolName}</strong></p>
        </div>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-bold ${isPermanent ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : (isExpired ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30')}">
        ${isPermanent ? '● Master Admin Link (Always Valid)' : (isExpired ? 'Expired' : `● Active (${remainingDays})`)}
      </span>
    </div>

    <div class="space-y-3 text-xs text-slate-300">
      <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
        <span class="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">Your Dedicated Webhook URL:</span>
        <code class="block font-mono text-[11px] text-amber-300 break-all select-all">${fullSyncUrl}</code>
      </div>
      <div class="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl space-y-1 text-[11px] text-blue-200">
        <strong class="text-blue-300">🛡️ Backend UDISE Verification & Duplicate Protection Active:</strong>
        <p>1. Every school is identified by unique 11-digit UDISE number. No duplicate entries allowed!</p>
        <p>2. Backend verifies School Name, District, State & Pincode against official government records.</p>
        <p>3. If school already exists, system informs user and allows action="update".</p>
      </div>
    </div>

    ${record.profileData ? `
    <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1.5 text-xs">
      <div class="flex items-center justify-between">
        <span class="font-bold text-emerald-400">✓ Last Synced by AI:</span>
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">${record.lastUpdatedSource || 'AI Assistant'}</span>
      </div>
      <p class="text-slate-300 text-xs">School: <strong class="text-white">${record.schoolName}</strong></p>
      <span class="text-slate-400 block text-[11px]">Synced: ${new Date(record.lastUpdatedAt || 0).toLocaleString()}</span>
    </div>` : `
    <div class="p-3 bg-slate-800/50 rounded-xl text-xs text-slate-400 text-center">
      Waiting for first AI data push. Send an HTTP POST request to populate data.
    </div>`}

    <!-- Full JSON Blueprint for AI Crawlers and Humans -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Complete Master Schema Blueprint (All 6 Tabs):</h3>
        <a href="${fullSyncUrl}&format=json" target="_blank" class="text-xs font-bold text-indigo-400 hover:underline">View Raw JSON Schema →</a>
      </div>
      <pre id="json-schema-blueprint" class="p-3.5 max-h-60 overflow-y-auto bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 select-all">${prettyBlueprint}</pre>
    </div>

    <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
      <span>${isPermanent ? '⚡ Master Admin Key: Valid indefinitely for all schools' : 'Auto-expires weekly for security'}</span>
      <a href="/schools" class="text-indigo-400 hover:underline font-bold">Open Schools Directory →</a>
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        ...CORS_HEADERS,
      },
    });
  }

  // Return standard JSON response for programmatic GET
  return NextResponse.json(
    {
      status: 'active',
      schoolId: record.schoolId,
      schoolName: record.schoolName,
      createdAt: new Date(record.createdAt).toISOString(),
      expiresAt: new Date(record.expiresAt).toISOString(),
      remainingDays,
      lastUpdatedAt: record.lastUpdatedAt ? new Date(record.lastUpdatedAt).toISOString() : null,
      lastUpdatedSource: record.lastUpdatedSource || null,
      hasData: Boolean(record.profileData),
      profileData: record.profileData || null,
      schemaBlueprint: BLANK_AI_SCHOOL_SCHEMA,
      crud_endpoints: {
        create: 'POST /api/school-ai-sync?token=<token> (with action="create")',
        update: 'POST /api/school-ai-sync?token=<token> (with action="update") or PUT',
        delete: 'POST /api/school-ai-sync?token=<token> (with action="delete") or DELETE',
        read: 'GET /api/school-ai-sync?token=<token> or ?action=lookup&udise=<11-digit-code>',
      },
    },
    { headers: CORS_HEADERS }
  );
}

/**
 * Handles CRUD operations with:
 * 1. 11-digit UDISE code identification (Unique ID: No duplicates allowed)
 * 2. Official Government UDISE+ database verification (School Name, District, State, Pincode matching)
 * 3. Existence check in Supabase database (`udise_private_schools`):
 *    - If already present: prompts that record exists and offers update
 *    - If new: creates after verification
 * 4. Supports action="create" | "update" | "delete" | "read"
 */
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: 'Missing sync token. Use ?token=<your_sync_token>' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const store = readSyncStore();
  const record = store.tokens[token];

  if (!record) {
    return NextResponse.json(
      { error: 'Invalid sync token or token does not exist.' },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  // Check expiration (Admin Master Key or isPermanent never expires)
  const isPermanent = Boolean(record.isPermanent || record.expiresAt === 0 || token === ADMIN_MASTER_MAGIC_TOKEN);
  const now = Date.now();
  if (!isPermanent && now > record.expiresAt) {
    return NextResponse.json(
      {
        error: 'This AI Sync link has expired (7-day validity limit). Please generate a fresh link from the School Dashboard.',
        status: 'expired',
        expiredAt: new Date(record.expiresAt).toISOString(),
      },
      { status: 410, headers: CORS_HEADERS }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Malformed JSON payload. Please ensure Content-Type is application/json.' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // Determine CRUD action: create | update | delete
  const actionFromQuery = searchParams.get('action');
  const actionFromBody = body.action || body.operation;
  const action = String(actionFromQuery || actionFromBody || 'create').toLowerCase();

  // Extract UDISE code
  const rawUdise = extractUdiseCode(body, searchParams);
  const cleanUdise = rawUdise.replace(/\D/g, '');

  if (!cleanUdise || cleanUdise.length !== 11) {
    return NextResponse.json(
      {
        success: false,
        error: 'INVALID_UDISE_CODE',
        message: `❌ Ek unique 11-digit official UDISE Code zaroori hai. Provided: "${rawUdise}" (${cleanUdise.length} digits). Ek ID se ek hi school register ho sakta hai.`,
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // Check if school already exists in database
  const { data: existingSchool } = await schoolSearchSupabase
    .from('udise_private_schools')
    .select('*')
    .eq('udise_code', cleanUdise)
    .maybeSingle();

  // =========================================================================
  // 1. READ / LOOKUP OPERATION
  // =========================================================================
  if (action === 'read' || action === 'lookup') {
    if (!existingSchool) {
      return NextResponse.json(
        {
          success: false,
          status: 'not_found',
          error: 'RECORD_NOT_FOUND',
          message: `School with UDISE code "${cleanUdise}" does not exist in the database.`,
        },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        action: 'read',
        school: existingSchool,
        profileData: record.profileData || null,
      },
      { headers: CORS_HEADERS }
    );
  }

  // =========================================================================
  // 2. DELETE OPERATION
  // =========================================================================
  if (action === 'delete') {
    if (!existingSchool) {
      return NextResponse.json(
        {
          success: false,
          status: 'not_found',
          error: 'RECORD_NOT_FOUND',
          message: `Cannot delete: School with UDISE code "${cleanUdise}" does not exist in the database.`,
        },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const { error: delErr } = await schoolSearchSupabase
      .from('udise_private_schools')
      .delete()
      .eq('udise_code', cleanUdise);

    if (delErr) {
      return NextResponse.json(
        { success: false, error: 'DELETE_FAILED', message: delErr.message },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Clean record profileData in token store if matches
    if (record.schoolId === cleanUdise) {
      delete record.profileData;
      record.lastUpdatedAt = now;
      record.lastUpdatedSource = 'AI Delete Operation';
      store.tokens[token] = record;
      writeSyncStore(store);
    }

    return NextResponse.json(
      {
        success: true,
        action: 'delete',
        message: `🗑️ School "${existingSchool.school_name}" (UDISE: ${cleanUdise}) has been successfully removed from database.`,
        deletedUdiseCode: cleanUdise,
      },
      { headers: CORS_HEADERS }
    );
  }

  // Parse incoming data using standard parser
  const parsed = parseSchoolJsonToState(body, {
    udiseCode: cleanUdise,
    schoolName: body.tab_1_home?.school_basic_info?.school_name || body.school_name || record.schoolName,
  } as any);

  if (!parsed.success || !parsed.state) {
    return NextResponse.json(
      { error: `Data validation failed: ${parsed.error || 'Invalid structure'}` },
      { status: 422, headers: CORS_HEADERS }
    );
  }

  // Input details to verify against government UDISE records
  const inputName = parsed.state.schoolName;
  const inputDistrict = parsed.state.district;
  const inputState = parsed.state.state;
  const inputPincode = parsed.state.pincode;

  // =========================================================================
  // 2. CREATE OPERATION (Default / New Entry)
  // =========================================================================
  if (action === 'create') {
    // 2a. Duplicate Check: Ek ID ki ek se jyada entry nahi ho sakti!
    if (existingSchool) {
      return NextResponse.json(
        {
          success: false,
          status: 'already_exists',
          error: 'ALREADY_EXISTS',
          message: `⚠️ School with UDISE code "${cleanUdise}" ("${existingSchool.school_name}") is ALREADY PRESENT in the database! Ek ID ki ek se jyada entry nahi ho sakti. Agar aap is school ko update karna chahte hain, to action: "update" bhejein.`,
          existingSchool: {
            school_id: existingSchool.school_id,
            school_name: existingSchool.school_name,
            udise_code: existingSchool.udise_code,
            district: existingSchool.district_name,
            state: existingSchool.state_name,
            pincode: existingSchool.pincode,
          },
          help: 'To update this existing record, pass "action": "update" in JSON payload or use HTTP PUT.',
        },
        { status: 409, headers: CORS_HEADERS }
      );
    }

    // 2b. Government UDISE+ Official Record Verification
    const verification = await verifyUdiseWithGovt(cleanUdise, inputName, inputDistrict, inputState, inputPincode);

    if (!verification.valid) {
      return NextResponse.json(
        {
          success: false,
          status: 'verification_failed',
          error: 'UDISE_VERIFICATION_MISMATCH',
          message: `❌ Government UDISE Verification Failed! Official record se data match nahi hua: ${verification.reason}`,
          officialRecord: verification.official || null,
          help: 'Please ensure your school name, district, state, and pincode match official UDISE+ records.',
        },
        { status: 422, headers: CORS_HEADERS }
      );
    }

    // Official data is verified! Proceed to insert
    const official = verification.official!;
    // STRICT RULE: School Name & Address are PERMANENTLY LOCKED to official government UDISE records!
    const finalSchoolName = official.schoolName; // STRICTLY LOCKED (Cannot be changed)
    const finalAddress = official.address || parsed.state.address || null; // STRICTLY LOCKED
    const finalDistrict = official.district;     // STRICTLY LOCKED
    const finalState = official.state;           // STRICTLY LOCKED
    const finalPincode = official.pincode || parsed.state.pincode || null; // STRICTLY LOCKED

    const insertPayload = {
      school_id: cleanUdise,
      udise_code: cleanUdise,
      school_name: finalSchoolName,
      district_name: finalDistrict,
      state_name: finalState,
      block_name: official.block || parsed.state.blockName || null,
      village_name: official.village || parsed.state.village || null,
      pincode: finalPincode,
      address: finalAddress,
      phone: parsed.state.phone || null,
      email: parsed.state.email || null,
      website: parsed.state.website || null,
      principal_name: parsed.state.principalName || null,
      board_10th: parsed.state.board || 'CBSE',
      board_12th: parsed.state.board || 'CBSE',
      primary_medium: parsed.state.medium || 'English',
      school_status: 'Operational',
      total_students: Number(parsed.state.totalStudents) || 500,
      total_teachers: Number(parsed.state.totalTeachers) || 30,
      total_classrooms: Number(parsed.state.classroomsCount) || 20,
      working_smart_boards: 10,
      atal_stem_lab: 'Yes',
      computer_ict_lab: 'Yes',
      integrated_science_lab: 'Yes',
      library: 'Yes',
      playground_available: 'Yes',
      image_url: parsed.state.heroImage || '/images/schools/hero-school-1.png',
    };

    const { error: insErr } = await schoolSearchSupabase
      .from('udise_private_schools')
      .insert(insertPayload);

    if (insErr) {
      return NextResponse.json(
        { success: false, error: 'DATABASE_INSERT_ERROR', message: insErr.message },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Save in token sync store
    const userAgent = req.headers.get('user-agent') || 'AI Agent';
    let source = 'AI Assistant';
    if (userAgent.includes('ChatGPT') || userAgent.includes('OpenAI')) source = 'ChatGPT';
    else if (userAgent.includes('Google-Gemini') || userAgent.includes('Gemini')) source = 'Gemini';
    else if (userAgent.includes('python')) source = 'Python Script / AI Agent';
    else if (userAgent.includes('curl')) source = 'cURL';

    parsed.state.schoolName = finalSchoolName;
    parsed.state.district = finalDistrict;
    parsed.state.state = finalState;
    parsed.state.udiseCode = cleanUdise;

    record.profileData = parsed.state;
    record.schoolName = finalSchoolName;
    record.schoolId = cleanUdise;
    record.lastUpdatedAt = now;
    record.lastUpdatedSource = source;
    store.tokens[token] = record;
    writeSyncStore(store);

    return NextResponse.json(
      {
        success: true,
        action: 'create',
        status: 'created',
        message: `🎉 School "${finalSchoolName}" verified against official government UDISE+ database and successfully added!`,
        school: {
          school_id: cleanUdise,
          udise_code: cleanUdise,
          school_name: finalSchoolName,
          district: finalDistrict,
          state: finalState,
          pincode: finalPincode,
          verifiedWithGovt: true,
        },
        summary: parsed.summary,
        updatedAt: new Date(now).toISOString(),
      },
      { status: 201, headers: CORS_HEADERS }
    );
  }

  // =========================================================================
  // 3. UPDATE OPERATION
  // =========================================================================
  if (action === 'update') {
    if (!existingSchool) {
      return NextResponse.json(
        {
          success: false,
          status: 'not_found',
          error: 'RECORD_NOT_FOUND',
          message: `Cannot update: No school found in database with UDISE code "${cleanUdise}". Pehle school add karne ke liye action="create" bhejein.`,
        },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // STRICT RULE: User cannot change School Name, Address, or location! They are permanently locked to UDISE!
    const updatePayload = {
      school_name: existingSchool.school_name, // STRICTLY LOCKED (Cannot be modified)
      district_name: existingSchool.district_name, // STRICTLY LOCKED
      state_name: existingSchool.state_name,       // STRICTLY LOCKED
      block_name: existingSchool.block_name,       // STRICTLY LOCKED
      village_name: existingSchool.village_name,   // STRICTLY LOCKED
      pincode: existingSchool.pincode,             // STRICTLY LOCKED
      address: existingSchool.address,             // STRICTLY LOCKED (Cannot be modified)
      phone: parsed.state.phone || existingSchool.phone,
      email: parsed.state.email || existingSchool.email,
      website: parsed.state.website || existingSchool.website,
      principal_name: parsed.state.principalName || existingSchool.principal_name,
      board_10th: parsed.state.board || existingSchool.board_10th || 'CBSE',
      board_12th: parsed.state.board || existingSchool.board_12th || 'CBSE',
      primary_medium: parsed.state.medium || existingSchool.primary_medium || 'English',
      total_students: Number(parsed.state.totalStudents) || existingSchool.total_students,
      total_teachers: Number(parsed.state.totalTeachers) || existingSchool.total_teachers,
      total_classrooms: Number(parsed.state.classroomsCount) || existingSchool.total_classrooms,
      image_url: parsed.state.heroImage || existingSchool.image_url,
    };

    const { error: updErr } = await schoolSearchSupabase
      .from('udise_private_schools')
      .update(updatePayload)
      .eq('udise_code', cleanUdise);

    if (updErr) {
      return NextResponse.json(
        { success: false, error: 'DATABASE_UPDATE_ERROR', message: updErr.message },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const userAgent = req.headers.get('user-agent') || 'AI Agent';
    let source = 'AI Assistant';
    if (userAgent.includes('ChatGPT') || userAgent.includes('OpenAI')) source = 'ChatGPT';
    else if (userAgent.includes('Google-Gemini') || userAgent.includes('Gemini')) source = 'Gemini';

    // STRICT RULE: Lock schoolName and address on parsed.state as well
    parsed.state.schoolName = updatePayload.school_name;
    parsed.state.address = updatePayload.address;
    parsed.state.district = updatePayload.district_name;
    parsed.state.state = updatePayload.state_name;
    parsed.state.pincode = updatePayload.pincode;

    record.profileData = parsed.state;
    record.schoolName = updatePayload.school_name;
    record.lastUpdatedAt = now;
    record.lastUpdatedSource = source;
    store.tokens[token] = record;
    writeSyncStore(store);

    return NextResponse.json(
      {
        success: true,
        action: 'update',
        status: 'updated',
        message: `🎉 School profile for "${updatePayload.school_name}" (UDISE: ${cleanUdise}) successfully updated in database!`,
        school: {
          school_id: cleanUdise,
          udise_code: cleanUdise,
          school_name: updatePayload.school_name,
          district: updatePayload.district_name,
          state: updatePayload.state_name,
        },
        summary: parsed.summary,
        updatedAt: new Date(now).toISOString(),
      },
      { headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(
    { error: `Unknown action: "${action}". Supported actions: "create", "update", "delete", "read"` },
    { status: 400, headers: CORS_HEADERS }
  );
}

/**
 * Direct PUT for RESTful update
 */
export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  url.searchParams.set('action', 'update');
  const modReq = new NextRequest(url.toString(), {
    method: 'POST',
    headers: req.headers,
    body: await req.blob(),
  });
  return POST(modReq);
}

/**
 * Direct DELETE for RESTful deletion
 */
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  url.searchParams.set('action', 'delete');
  const modReq = new NextRequest(url.toString(), {
    method: 'POST',
    headers: req.headers,
    body: await req.blob().catch(() => null),
  });
  return POST(modReq);
}
