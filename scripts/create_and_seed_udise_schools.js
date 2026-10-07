// scripts/create_and_seed_udise_schools.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'process.env.SUPABASE_KEY';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'process.env.SUPABASE_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const createTableSql = `-- Supabase Migration: Create public.udise_schools table
CREATE TABLE IF NOT EXISTS public.udise_schools (
  id TEXT PRIMARY KEY,
  school_id TEXT UNIQUE NOT NULL,
  school_name TEXT NOT NULL,
  udise_code TEXT NOT NULL,
  status TEXT DEFAULT 'Verified',
  year_desc TEXT DEFAULT '2026-27',
  established_year TEXT,
  state_name TEXT,
  district_name TEXT,
  block_name TEXT,
  village_ward TEXT,
  pincode TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  school_category TEXT,
  management_type TEXT,
  management_desc_state TEXT,
  class_from TEXT,
  class_to TEXT,
  school_type TEXT,
  rural_urban TEXT,
  pm_shri BOOLEAN DEFAULT FALSE,
  headmaster_principal_name TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  board_secondary_10th TEXT,
  board_higher_secondary_12th TEXT,
  medium_of_instruction_1 TEXT,
  residential_school TEXT,
  total_students INTEGER DEFAULT 0,
  total_boys INTEGER DEFAULT 0,
  total_girls INTEGER DEFAULT 0,
  total_teachers INTEGER DEFAULT 0,
  student_teacher_ratio TEXT DEFAULT '15:1',
  annual_fee NUMERIC DEFAULT 0,
  annual_fee_formatted TEXT,
  tinkering_lab_atl TEXT DEFAULT '2-No',
  ict_lab TEXT DEFAULT '2-No',
  integrated_science_lab TEXT DEFAULT '2-No',
  library TEXT DEFAULT '1-Yes',
  playground TEXT DEFAULT '1-Yes',
  drinking_water TEXT DEFAULT '1-Yes',
  electricity TEXT DEFAULT '1-Yes',
  solar_panel TEXT DEFAULT '2-No',
  ramps_accessible TEXT DEFAULT '1-Yes',
  gallery_images JSONB DEFAULT '[]'::jsonb,
  profile_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_udise_schools_school_id ON public.udise_schools (school_id);
CREATE INDEX IF NOT EXISTS idx_udise_schools_udise_code ON public.udise_schools (udise_code);
CREATE INDEX IF NOT EXISTS idx_udise_schools_pincode ON public.udise_schools (pincode);
CREATE INDEX IF NOT EXISTS idx_udise_schools_district ON public.udise_schools (district_name);
CREATE INDEX IF NOT EXISTS idx_udise_schools_state ON public.udise_schools (state_name);

ALTER TABLE public.udise_schools ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'udise_schools' AND policyname = 'Public read access for udise_schools'
  ) THEN
    CREATE POLICY "Public read access for udise_schools" ON public.udise_schools FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'udise_schools' AND policyname = 'Public insert/update access for udise_schools'
  ) THEN
    CREATE POLICY "Public insert/update access for udise_schools" ON public.udise_schools FOR ALL USING (true);
  END IF;
END
$$;
`;

function extractSchoolsData() {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'schoolFinderData.ts');
  const content = fs.readFileSync(filePath, 'utf8');

  const startMarker = 'export const SCHOOLS_DATA: SchoolRecord[] = [';
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) {
    throw new Error('Could not find start marker for SCHOOLS_DATA');
  }

  const arrayStart = content.indexOf('[', startIdx);
  const arrayEnd = content.lastIndexOf('];');
  const arrayString = content.substring(arrayStart, arrayEnd + 1);

  try {
    const fn = new Function(`return ${arrayString}`);
    return fn();
  } catch (err) {
    console.error('Error evaluating arrayString:', err);
    return [];
  }
}

async function main() {
  console.log('1. Reading school records from schoolFinderData.ts...');
  const schools = extractSchoolsData();
  console.log(`Found ${schools.length} school records.`);

  if (schools.length === 0) {
    console.error('No schools found. Aborting.');
    return;
  }

  // 2. Transform into Supabase udise_schools rows
  const rows = schools.map((s) => {
    const sid = s.school_id || s.id;
    return {
      id: s.id || `sch-${sid}`,
      school_id: String(sid),
      school_name: s.school_name || s.name,
      udise_code: String(s.udise_code || s.udiseCode || '06070000000'),
      status: s.status || 'Verified',
      year_desc: s.year_desc || '2026-27',
      established_year: String(s.established_year || '1995'),
      state_name: s.state_name || s.state || 'Haryana',
      district_name: s.district_name || s.city || 'Rewari',
      block_name: s.block_name || s.city || 'Rewari',
      village_ward: s.village_ward || s.locality || 'Main Ward',
      pincode: String(s.pincode || '123401'),
      address: s.address || `${s.school_name}, ${s.district_name || s.city}`,
      latitude: Number(s.latitude || s.lat || 28.1833),
      longitude: Number(s.longitude || s.lng || 76.6167),
      school_category: s.school_category || s.type || 'Higher Secondary with Grades 1 to 12',
      management_type: s.management_type || (s.management_desc_state === 'Government' ? 'Department of Education' : 'Private Unaided'),
      management_desc_state: s.management_desc_state || s.management || 'Government',
      class_from: String(s.class_from || '1st'),
      class_to: String(s.class_to || '12th'),
      school_type: s.school_type || s.gender || '3-Co-educational',
      rural_urban: s.rural_urban || '1-Rural',
      pm_shri: Boolean(s.pm_shri),
      headmaster_principal_name: s.headmaster_principal_name || s.principalName || 'Principal In-Charge',
      phone: s.phone || '+91 1274 250001',
      email: s.email || `contact@school${sid}.cseel.org`,
      website: s.website || `https://schoolsearch.cseel.org/org/org-school-${sid}`,
      board_secondary_10th: s.board_secondary_10th || s.board || 'CBSE',
      board_higher_secondary_12th: s.board_higher_secondary_12th || s.board || 'CBSE',
      medium_of_instruction_1: s.medium_of_instruction_1 || s.medium || '19-English',
      residential_school: s.residential_school || '3-Non Residential',
      total_students: Number(s.total_students || 650),
      total_boys: Number(s.total_boys || Math.round((s.total_students || 650) * 0.52)),
      total_girls: Number(s.total_girls || Math.round((s.total_students || 650) * 0.48)),
      total_teachers: Number(s.total_teachers || 28),
      student_teacher_ratio: s.student_teacher_ratio || '15:1',
      annual_fee: Number(s.annual_fee || 0),
      annual_fee_formatted: s.annual_fee_formatted || (s.annual_fee === 0 ? 'Free (Govt)' : `₹${(s.annual_fee/1000).toFixed(0)}k/yr`),
      tinkering_lab_atl: typeof s.tinkering_lab_atl === 'boolean' ? (s.tinkering_lab_atl ? '1-Yes' : '2-No') : (s.tinkering_lab_atl || '2-No'),
      ict_lab: typeof s.ict_lab === 'boolean' ? (s.ict_lab ? '1-Yes' : '2-No') : (s.ict_lab || '1-Yes'),
      integrated_science_lab: typeof s.integrated_science_lab === 'boolean' ? (s.integrated_science_lab ? '1-Yes' : '2-No') : (s.integrated_science_lab || '1-Yes'),
      library: typeof s.library === 'boolean' ? (s.library ? '1-Yes' : '2-No') : (s.library || '1-Yes'),
      playground: typeof s.playground === 'boolean' ? (s.playground ? '1-Yes' : '2-No') : (s.playground || '1-Yes'),
      drinking_water: '1-Yes',
      electricity: '1-Yes',
      solar_panel: typeof s.solar_panel === 'boolean' ? (s.solar_panel ? '1-Yes' : '2-No') : (s.solar_panel || '2-No'),
      ramps_accessible: typeof s.ramps_accessible === 'boolean' ? (s.ramps_accessible ? '1-Yes' : '2-No') : (s.ramps_accessible || '1-Yes'),
      gallery_images: [
        s.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      ],
      profile_url: `https://schoolsearch.cseel.org/?school_id=${sid}`,
    };
  });

  // 3. Write migration and seed SQL file to disk
  const migrationDir = path.join(__dirname, '..', 'supabase', 'migrations');
  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir, { recursive: true });
  }

  const sqlFilePath = path.join(migrationDir, '20260916_udise_schools.sql');
  
  let seedSql = createTableSql + '\n\n-- SEED DATA FOR UDISE_SCHOOLS\n';
  for (const r of rows) {
    const esc = (val) => (val === null || val === undefined ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`);
    const num = (val) => (val === null || val === undefined ? '0' : Number(val));
    const bool = (val) => (val ? 'TRUE' : 'FALSE');
    const jsonb = (val) => `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;

    seedSql += `INSERT INTO public.udise_schools (
  id, school_id, school_name, udise_code, status, year_desc, established_year, state_name, district_name, block_name,
  village_ward, pincode, address, latitude, longitude, school_category, management_type, management_desc_state,
  class_from, class_to, school_type, rural_urban, pm_shri, headmaster_principal_name, phone, email, website,
  board_secondary_10th, board_higher_secondary_12th, medium_of_instruction_1, residential_school,
  total_students, total_boys, total_girls, total_teachers, student_teacher_ratio, annual_fee, annual_fee_formatted,
  tinkering_lab_atl, ict_lab, integrated_science_lab, library, playground, drinking_water, electricity, solar_panel, ramps_accessible,
  gallery_images, profile_url
) VALUES (
  ${esc(r.id)}, ${esc(r.school_id)}, ${esc(r.school_name)}, ${esc(r.udise_code)}, ${esc(r.status)}, ${esc(r.year_desc)}, ${esc(r.established_year)}, ${esc(r.state_name)}, ${esc(r.district_name)}, ${esc(r.block_name)},
  ${esc(r.village_ward)}, ${esc(r.pincode)}, ${esc(r.address)}, ${num(r.latitude)}, ${num(r.longitude)}, ${esc(r.school_category)}, ${esc(r.management_type)}, ${esc(r.management_desc_state)},
  ${esc(r.class_from)}, ${esc(r.class_to)}, ${esc(r.school_type)}, ${esc(r.rural_urban)}, ${bool(r.pm_shri)}, ${esc(r.headmaster_principal_name)}, ${esc(r.phone)}, ${esc(r.email)}, ${esc(r.website)},
  ${esc(r.board_secondary_10th)}, ${esc(r.board_higher_secondary_12th)}, ${esc(r.medium_of_instruction_1)}, ${esc(r.residential_school)},
  ${num(r.total_students)}, ${num(r.total_boys)}, ${num(r.total_girls)}, ${num(r.total_teachers)}, ${esc(r.student_teacher_ratio)}, ${num(r.annual_fee)}, ${esc(r.annual_fee_formatted)},
  ${esc(r.tinkering_lab_atl)}, ${esc(r.ict_lab)}, ${esc(r.integrated_science_lab)}, ${esc(r.library)}, ${esc(r.playground)}, ${esc(r.drinking_water)}, ${esc(r.electricity)}, ${esc(r.solar_panel)}, ${esc(r.ramps_accessible)},
  ${jsonb(r.gallery_images)}, ${esc(r.profile_url)}
) ON CONFLICT (school_id) DO UPDATE SET
  school_name = EXCLUDED.school_name,
  udise_code = EXCLUDED.udise_code,
  status = EXCLUDED.status,
  address = EXCLUDED.address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  total_students = EXCLUDED.total_students,
  total_teachers = EXCLUDED.total_teachers,
  annual_fee = EXCLUDED.annual_fee,
  gallery_images = EXCLUDED.gallery_images,
  profile_url = EXCLUDED.profile_url,
  updated_at = NOW();\n\n`;
  }

  fs.writeFileSync(sqlFilePath, seedSql, 'utf8');
  console.log(`✅ Written complete SQL schema and seeds to: ${sqlFilePath}`);

  // 4. Try upserting via Supabase client
  try {
    console.log('Attempting to upsert rows via Supabase Client...');
    const { data, error } = await supabase.from('udise_schools').upsert(rows, { onConflict: 'school_id' });
    if (error) {
      console.log('ℹ️ Note on Supabase client upsert:', error.message);
      console.log('➡️ If table does not exist in schema cache yet, run the SQL script "supabase/migrations/20260916_udise_schools.sql" in Supabase SQL editor.');
    } else {
      console.log(`🎉 Successfully synced ${rows.length} schools to Supabase public.udise_schools table!`);
    }
  } catch (err) {
    console.log('Upsert attempt completed with message:', err.message);
  }
}

main().catch(console.error);
