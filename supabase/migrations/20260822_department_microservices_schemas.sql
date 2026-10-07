-- ==============================================================================
-- CSEEL.org — Enterprise Department & Microservices Schemas (Folders) for Supabase
-- ==============================================================================
-- This SQL script creates 6 dedicated schemas (folders) in Supabase PostgreSQL,
-- one for each department, ensuring 100% data isolation (Database-per-service).
-- ==============================================================================

-- 1. CREATE DEPARTMENT SCHEMAS (DATABASE FOLDERS)
CREATE SCHEMA IF NOT EXISTS materials;
CREATE SCHEMA IF NOT EXISTS careers;
CREATE SCHEMA IF NOT EXISTS network;
CREATE SCHEMA IF NOT EXISTS training;
CREATE SCHEMA IF NOT EXISTS events;
CREATE SCHEMA IF NOT EXISTS support;

-- Grant permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA materials, careers, network, training, events, support TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA materials, careers, network, training, events, support TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA materials, careers, network, training, events, support TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA materials, careers, network, training, events, support
  GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- ==============================================================================
-- 2. FOLDER 1: MATERIALS & STEM KITS (materials.*)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS materials.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  scientific_name TEXT,
  common_names JSONB DEFAULT '[]'::jsonb,
  category TEXT NOT NULL,
  category_label TEXT,
  brand TEXT DEFAULT 'CSEEL Scientific',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount_percentage INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 50,
  current_stock INTEGER DEFAULT 50,
  min_order_qty INTEGER DEFAULT 1,
  image_url TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb, -- Up to 5 product images
  tag TEXT,
  description TEXT,
  specification TEXT,
  includes JSONB DEFAULT '[]'::jsonb,
  safety TEXT,
  warning TEXT,
  handling TEXT,
  storage TEXT,
  warranty TEXT DEFAULT '1 Year Standard Warranty',
  delivery_days INTEGER DEFAULT 3,
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS materials.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  tax NUMERIC NOT NULL,
  shipping_fee NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  shipping_address JSONB NOT NULL,
  status TEXT DEFAULT 'placed',
  payment_method TEXT DEFAULT 'UPI',
  payment_status TEXT DEFAULT 'paid',
  estimated_delivery TEXT DEFAULT '3-4 Business Days',
  tracking_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. FOLDER 2: CAREERS & HR (careers.*)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS careers.vacancies (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  experience TEXT NOT NULL,
  salary TEXT NOT NULL,
  skills JSONB DEFAULT '[]'::jsonb,
  description_html TEXT NOT NULL,
  deadline DATE NOT NULL,
  applicants_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  posted_date TEXT DEFAULT 'Recently',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS careers.applications (
  id TEXT PRIMARY KEY,
  job_id TEXT REFERENCES careers.vacancies(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  current_org TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'applied',
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. FOLDER 3: EDUNETWORK & SCHOOLS (network.*)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS network.schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  board TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  student_count INTEGER DEFAULT 500,
  faculty_count INTEGER DEFAULT 30,
  principal_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  labs_equipped JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'verified',
  accreditation_level TEXT DEFAULT 'Tier 1 Lead',
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. FOLDER 4: TRAINING & PROGRAMS (training.*)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS training.programs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  format TEXT NOT NULL,
  level TEXT NOT NULL,
  duration_hours INTEGER DEFAULT 16,
  batch_size INTEGER DEFAULT 40,
  enrolled_count INTEGER DEFAULT 0,
  lead_trainer TEXT NOT NULL,
  trainer_role TEXT,
  certification_offered TEXT NOT NULL,
  start_date DATE NOT NULL,
  fee_inr NUMERIC DEFAULT 1999,
  curriculum_summary TEXT,
  learning_outcomes JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. FOLDER 5: EVENTS & OUTREACH (events.*)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS events.symposia (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  keynote_speakers JSONB DEFAULT '[]'::jsonb,
  registered_count INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 300,
  banner_image TEXT NOT NULL,
  agenda_summary TEXT,
  status TEXT DEFAULT 'upcoming',
  is_registration_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. FOLDER 6: SUPPORT & HELPDESK (support.*)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS support.tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  school_or_org_name TEXT,
  assigned_agent TEXT,
  description TEXT NOT NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE materials.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers.vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE network.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE training.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events.symposia ENABLE ROW LEVEL SECURITY;
ALTER TABLE support.tickets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active items
CREATE POLICY "Public Read Materials" ON materials.products FOR SELECT USING (true);
CREATE POLICY "Admin All Materials" ON materials.products FOR ALL USING (true);

CREATE POLICY "Public Read Vacancies" ON careers.vacancies FOR SELECT USING (true);
CREATE POLICY "Admin All Vacancies" ON careers.vacancies FOR ALL USING (true);

CREATE POLICY "Public Read Schools" ON network.schools FOR SELECT USING (true);
CREATE POLICY "Admin All Schools" ON network.schools FOR ALL USING (true);

CREATE POLICY "Public Read Training" ON training.programs FOR SELECT USING (true);
CREATE POLICY "Admin All Training" ON training.programs FOR ALL USING (true);

CREATE POLICY "Public Read Events" ON events.symposia FOR SELECT USING (true);
CREATE POLICY "Admin All Events" ON events.symposia FOR ALL USING (true);

CREATE POLICY "Public Read Support" ON support.tickets FOR SELECT USING (true);
CREATE POLICY "Admin All Support" ON support.tickets FOR ALL USING (true);
