-- Supabase Migration: Create public.udise_schools table
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


-- SEED DATA FOR UDISE_SCHOOLS
INSERT INTO public.udise_schools (
  id, school_id, school_name, udise_code, status, year_desc, established_year, state_name, district_name, block_name,
  village_ward, pincode, address, latitude, longitude, school_category, management_type, management_desc_state,
  class_from, class_to, school_type, rural_urban, pm_shri, headmaster_principal_name, phone, email, website,
  board_secondary_10th, board_higher_secondary_12th, medium_of_instruction_1, residential_school,
  total_students, total_boys, total_girls, total_teachers, student_teacher_ratio, annual_fee, annual_fee_formatted,
  tinkering_lab_atl, ict_lab, integrated_science_lab, library, playground, drinking_water, electricity, solar_panel, ramps_accessible,
  gallery_images, profile_url
) VALUES (
  'rewari-1', '1001', 'Government Senior Secondary School, Rewari', '06070123456', 'Verified', '2026-27', '1968', 'HARYANA', 'REWARI', 'REWARI',
  'Model Town Ward 4', '123401', 'Near Old Bus Stand, Model Town Road, Rewari, Haryana', 28.1885, 76.6215, '6-Pr. Up Pr. and Secondary with Sr. Sec', 'Department of Education', 'Government',
  'Class 6', 'Class 12', '3-Co-educational', '2-Urban', TRUE, 'Dr. Ramesh Chandra', '01274-225102', 'gsss.rewari@haryana.gov.in', 'https://schoolsearch.cseel.org/org/org-school-1001',
  'HBSE', 'HBSE', '04-Hindi', '3-Non Residential',
  840, 450, 390, 48, '18:1', 0, 'Free (Govt)',
  '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes',
  '["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'https://schoolsearch.cseel.org/?school_id=1001'
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
  updated_at = NOW();

INSERT INTO public.udise_schools (
  id, school_id, school_name, udise_code, status, year_desc, established_year, state_name, district_name, block_name,
  village_ward, pincode, address, latitude, longitude, school_category, management_type, management_desc_state,
  class_from, class_to, school_type, rural_urban, pm_shri, headmaster_principal_name, phone, email, website,
  board_secondary_10th, board_higher_secondary_12th, medium_of_instruction_1, residential_school,
  total_students, total_boys, total_girls, total_teachers, student_teacher_ratio, annual_fee, annual_fee_formatted,
  tinkering_lab_atl, ict_lab, integrated_science_lab, library, playground, drinking_water, electricity, solar_panel, ramps_accessible,
  gallery_images, profile_url
) VALUES (
  'rewari-2', '1002', 'ABC Public School, Rewari', '06070189421', 'Admissions Open', '2026-27', '2004', 'HARYANA', 'REWARI', 'REWARI',
  'HUDA Sector 3 Ward 12', '123401', 'Circular Road, Near HUDA Sector 3, Rewari, Haryana', 28.176, 76.627, '3-Pr. Up Pr. and Secondary', 'Private Unaided (Recognized)', 'Private',
  'Nursery', 'Class 10', '3-Co-educational', '2-Urban', FALSE, 'Mrs. Sunita Yadav', '01274-256890', 'info@abcpublicrewari.edu.in', 'https://schoolsearch.cseel.org/org/org-school-1002',
  'CBSE', 'CBSE', '19-English', '3-Non Residential',
  620, 330, 290, 42, '15:1', 35000, '₹35k/yr',
  '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '2-No', '1-Yes',
  '["https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'https://schoolsearch.cseel.org/?school_id=1002'
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
  updated_at = NOW();

INSERT INTO public.udise_schools (
  id, school_id, school_name, udise_code, status, year_desc, established_year, state_name, district_name, block_name,
  village_ward, pincode, address, latitude, longitude, school_category, management_type, management_desc_state,
  class_from, class_to, school_type, rural_urban, pm_shri, headmaster_principal_name, phone, email, website,
  board_secondary_10th, board_higher_secondary_12th, medium_of_instruction_1, residential_school,
  total_students, total_boys, total_girls, total_teachers, student_teacher_ratio, annual_fee, annual_fee_formatted,
  tinkering_lab_atl, ict_lab, integrated_science_lab, library, playground, drinking_water, electricity, solar_panel, ramps_accessible,
  gallery_images, profile_url
) VALUES (
  'rewari-3', '1003', 'XYZ Senior Secondary School, Rewari', '06070145892', 'Verified', '2026-27', '1982', 'HARYANA', 'REWARI', 'REWARI',
  'Jhajjhar Road Ward 8', '123401', 'Jhajjhar Road, Rewari, Haryana', 28.199, 76.602, '6-Pr. Up Pr. and Secondary with Sr. Sec', 'Department of Education', 'Government',
  'Class 1', 'Class 12', '3-Co-educational', '1-Rural', FALSE, 'Shri Vikram Singh', '01274-224890', 'xyz.school@rewari.gov.in', 'https://schoolsearch.cseel.org/org/org-school-1003',
  'HBSE', 'HBSE', '04-Hindi', '3-Non Residential',
  950, 520, 430, 50, '19:1', 0, 'Free (Govt)',
  '2-No', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '2-No', '1-Yes',
  '["https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'https://schoolsearch.cseel.org/?school_id=1003'
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
  updated_at = NOW();

INSERT INTO public.udise_schools (
  id, school_id, school_name, udise_code, status, year_desc, established_year, state_name, district_name, block_name,
  village_ward, pincode, address, latitude, longitude, school_category, management_type, management_desc_state,
  class_from, class_to, school_type, rural_urban, pm_shri, headmaster_principal_name, phone, email, website,
  board_secondary_10th, board_higher_secondary_12th, medium_of_instruction_1, residential_school,
  total_students, total_boys, total_girls, total_teachers, student_teacher_ratio, annual_fee, annual_fee_formatted,
  tinkering_lab_atl, ict_lab, integrated_science_lab, library, playground, drinking_water, electricity, solar_panel, ramps_accessible,
  gallery_images, profile_url
) VALUES (
  'rewari-4', '1004', 'DAV Public School, Rewari', '06070198765', 'Admissions Open', '2026-27', '1995', 'HARYANA', 'REWARI', 'REWARI',
  'HUDA Urban Estate Ward 9', '123401', 'Sector 4, HUDA Urban Estate, Rewari, Haryana', 28.181, 76.634, '6-Pr. Up Pr. and Secondary with Sr. Sec', 'Private Unaided (Recognized)', 'Private',
  'Nursery', 'Class 12', '3-Co-educational', '2-Urban', FALSE, 'Dr. Vivek Sharma', '01274-251234', 'davrewari@gmail.com', 'https://schoolsearch.cseel.org/org/org-school-1004',
  'CBSE', 'CBSE', '19-English', '3-Non Residential',
  1450, 790, 660, 78, '18:1', 55000, '₹55k/yr',
  '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes',
  '["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'https://schoolsearch.cseel.org/?school_id=1004'
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
  updated_at = NOW();

INSERT INTO public.udise_schools (
  id, school_id, school_name, udise_code, status, year_desc, established_year, state_name, district_name, block_name,
  village_ward, pincode, address, latitude, longitude, school_category, management_type, management_desc_state,
  class_from, class_to, school_type, rural_urban, pm_shri, headmaster_principal_name, phone, email, website,
  board_secondary_10th, board_higher_secondary_12th, medium_of_instruction_1, residential_school,
  total_students, total_boys, total_girls, total_teachers, student_teacher_ratio, annual_fee, annual_fee_formatted,
  tinkering_lab_atl, ict_lab, integrated_science_lab, library, playground, drinking_water, electricity, solar_panel, ramps_accessible,
  gallery_images, profile_url
) VALUES (
  'rewari-5', '1005', 'Kendriya Vidyalaya, Rewari', '06070156789', 'Verified', '2026-27', '1987', 'HARYANA', 'REWARI', 'REWARI',
  'Railway Colony Ward 2', '123401', 'Near Railway Colony, Rewari, Haryana', 28.192, 76.618, '6-Pr. Up Pr. and Secondary with Sr. Sec', 'Kendriya Vidyalaya', 'Government',
  'Class 1', 'Class 12', '3-Co-educational', '2-Urban', TRUE, 'Mrs. Geeta Kumari', '01274-222456', 'kvrewari@kvsedu.gov.in', 'https://schoolsearch.cseel.org/org/org-school-1005',
  'CBSE', 'CBSE', '19-English', '3-Non Residential',
  1120, 600, 520, 56, '20:1', 2400, '₹2.4k/yr',
  '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes',
  '["https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'https://schoolsearch.cseel.org/?school_id=1005'
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
  updated_at = NOW();

INSERT INTO public.udise_schools (
  id, school_id, school_name, udise_code, status, year_desc, established_year, state_name, district_name, block_name,
  village_ward, pincode, address, latitude, longitude, school_category, management_type, management_desc_state,
  class_from, class_to, school_type, rural_urban, pm_shri, headmaster_principal_name, phone, email, website,
  board_secondary_10th, board_higher_secondary_12th, medium_of_instruction_1, residential_school,
  total_students, total_boys, total_girls, total_teachers, student_teacher_ratio, annual_fee, annual_fee_formatted,
  tinkering_lab_atl, ict_lab, integrated_science_lab, library, playground, drinking_water, electricity, solar_panel, ramps_accessible,
  gallery_images, profile_url
) VALUES (
  'delhi-1', '2001', 'Delhi Public School, R.K. Puram', '07080112345', 'Verified', '2026-27', '1972', 'DELHI', 'SOUTH WEST DELHI', 'R.K. PURAM',
  'Sector 12 Ward 3', '110022', 'Sector 12, R.K. Puram, New Delhi', 28.567, 77.175, '6-Pr. Up Pr. and Secondary with Sr. Sec', 'Private Unaided (Recognized)', 'Private',
  'Class 6', 'Class 12', '3-Co-educational', '2-Urban', FALSE, 'Ms. Padma Srinivasan', '011-49115555', 'principal@dpsrkp.net', 'https://schoolsearch.cseel.org/org/org-school-2001',
  'CBSE', 'CBSE', '19-English', '3-Non Residential',
  3200, 1750, 1450, 210, '15:1', 140000, '₹1.4L/yr',
  '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes',
  '["https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'https://schoolsearch.cseel.org/?school_id=2001'
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
  updated_at = NOW();

INSERT INTO public.udise_schools (
  id, school_id, school_name, udise_code, status, year_desc, established_year, state_name, district_name, block_name,
  village_ward, pincode, address, latitude, longitude, school_category, management_type, management_desc_state,
  class_from, class_to, school_type, rural_urban, pm_shri, headmaster_principal_name, phone, email, website,
  board_secondary_10th, board_higher_secondary_12th, medium_of_instruction_1, residential_school,
  total_students, total_boys, total_girls, total_teachers, student_teacher_ratio, annual_fee, annual_fee_formatted,
  tinkering_lab_atl, ict_lab, integrated_science_lab, library, playground, drinking_water, electricity, solar_panel, ramps_accessible,
  gallery_images, profile_url
) VALUES (
  'delhi-2', '2002', 'Dr. B.R. Ambedkar School of Specialised Excellence, Kalkaji', '07090123987', 'Verified', '2026-27', '2021', 'DELHI', 'SOUTH DELHI', 'KALKAJI',
  'Kalkaji Ward 18', '110019', 'Kalkaji DDA Flats, New Delhi', 28.5385, 77.258, '5-Secondary with Sr. Sec', 'Department of Education Delhi', 'Government',
  'Class 9', 'Class 12', '3-Co-educational', '2-Urban', TRUE, 'Dr. Anita Roy', '011-26219800', 'sose.kalkaji@delhi.gov.in', 'https://schoolsearch.cseel.org/org/org-school-2002',
  'DBSE (IB Partner)', 'DBSE (IB Partner)', '19-English', '3-Non Residential',
  580, 310, 270, 45, '13:1', 0, 'Free (Govt)',
  '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes',
  '["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'https://schoolsearch.cseel.org/?school_id=2002'
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
  updated_at = NOW();

INSERT INTO public.udise_schools (
  id, school_id, school_name, udise_code, status, year_desc, established_year, state_name, district_name, block_name,
  village_ward, pincode, address, latitude, longitude, school_category, management_type, management_desc_state,
  class_from, class_to, school_type, rural_urban, pm_shri, headmaster_principal_name, phone, email, website,
  board_secondary_10th, board_higher_secondary_12th, medium_of_instruction_1, residential_school,
  total_students, total_boys, total_girls, total_teachers, student_teacher_ratio, annual_fee, annual_fee_formatted,
  tinkering_lab_atl, ict_lab, integrated_science_lab, library, playground, drinking_water, electricity, solar_panel, ramps_accessible,
  gallery_images, profile_url
) VALUES (
  'gurugram-1', '3001', 'The Heritage School, Sector 62 Gurugram', '06180187654', 'Admissions Open', '2026-27', '2003', 'HARYANA', 'GURUGRAM', 'GURUGRAM',
  'Sector 62 Ward 21', '122011', 'Golf Course Extension Road, Sector 62, Gurugram, Haryana', 28.411, 77.089, '6-Pr. Up Pr. and Secondary with Sr. Sec', 'Private Unaided (Recognized)', 'Private',
  'Nursery', 'Class 12', '3-Co-educational', '2-Urban', FALSE, 'Ms. Neena Kaul', '0124-2855124', 'contact@heritagegurugram.edu.in', 'https://schoolsearch.cseel.org/org/org-school-3001',
  'CBSE', 'CBSE', '19-English', '3-Non Residential',
  2100, 1100, 1000, 155, '14:1', 220000, '₹2.2L/yr',
  '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes', '1-Yes',
  '["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'https://schoolsearch.cseel.org/?school_id=3001'
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
  updated_at = NOW();

