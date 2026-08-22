-- ==============================================================================
-- CSEEL.ORG — MASTER ALL-IN-ONE DATABASE & SEED DATA SCRIPT
-- ==============================================================================
-- Run this in your Supabase SQL Editor to create all schemas, tables, 
-- and seed 100% of website data and admin login credentials into PostgreSQL!
-- ==============================================================================

-- 1. SCHEMAS (DEPARTMENT FOLDERS)
CREATE SCHEMA IF NOT EXISTS materials;
CREATE SCHEMA IF NOT EXISTS careers;
CREATE SCHEMA IF NOT EXISTS network;
CREATE SCHEMA IF NOT EXISTS training;
CREATE SCHEMA IF NOT EXISTS events;
CREATE SCHEMA IF NOT EXISTS support;

GRANT USAGE ON SCHEMA public, materials, careers, network, training, events, support TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public, materials, careers, network, training, events, support TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public, materials, careers, network, training, events, support TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public, materials, careers, network, training, events, support
  GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- ==============================================================================
-- 2. PUBLIC TABLES (ADMIN USERS, BLOGS, EXPERIMENTS, PROFILES)
-- ==============================================================================

-- Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL DEFAULT 'Dev@12345',
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  avatar TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content_html TEXT,
  author TEXT NOT NULL,
  author_role TEXT,
  published_date DATE NOT NULL,
  cover_image TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  views_count INTEGER DEFAULT 120,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Science Experiments & Simulations Table
CREATE TABLE IF NOT EXISTS public.science_experiments (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  subject TEXT NOT NULL, -- Physics, Chemistry, Biology, Robotics
  apparatus JSONB DEFAULT '[]'::jsonb,
  procedure_steps JSONB DEFAULT '[]'::jsonb,
  safety_guidelines TEXT,
  simulation_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. DEPARTMENT TABLES
-- ==============================================================================

-- Materials & Hardware Store
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
  gallery JSONB DEFAULT '[]'::jsonb,
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

-- Careers & HR
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
  posted_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS careers.applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  job_title TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  current_organization TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'applied',
  applied_date TIMESTAMPTZ DEFAULT NOW()
);

-- Educational Network (Schools)
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
  joined_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teacher Training & Pedagogy
CREATE TABLE IF NOT EXISTS training.programs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  format TEXT NOT NULL,
  level TEXT NOT NULL,
  duration_hours INTEGER DEFAULT 20,
  batch_size INTEGER DEFAULT 30,
  enrolled_count INTEGER DEFAULT 0,
  lead_trainer TEXT NOT NULL,
  trainer_role TEXT NOT NULL,
  certification_offered TEXT NOT NULL,
  start_date DATE NOT NULL,
  fee_inr NUMERIC DEFAULT 0,
  curriculum_summary TEXT NOT NULL,
  learning_outcomes JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conclaves, Seminars & Outreach Events
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
  capacity INTEGER DEFAULT 200,
  banner_image TEXT NOT NULL,
  agenda_summary TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming',
  is_registration_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technical Support & Helpdesk
CREATE TABLE IF NOT EXISTS support.tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  organization TEXT,
  description TEXT NOT NULL,
  resolution_notes TEXT,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. INSERT ALL SEED DATA (ADMINS, PRODUCTS, JOBS, SCHOOLS, EVENTS, TRAINING)
-- ==============================================================================

-- 4.1 Seed Admin Users
INSERT INTO public.admin_users (id, name, email, password, role, department)
VALUES
  ('adm-1', 'Super Administrator', 'super@123', 'Dev@12345', 'super_admin', 'Executive Board'),
  ('adm-2', 'HR & Careers Lead', 'hr@123', 'Dev@12345', 'hr_admin', 'Human Resources'),
  ('adm-3', 'School Network Admin', 'school@123', 'Dev@12345', 'school_admin', 'Institutional Relations'),
  ('adm-4', 'Faculty Recruitment Specialist', 'recruitment@123', 'Dev@12345', 'recruitment_admin', 'Faculty Operations'),
  ('adm-5', 'Science & Simulations Lead', 'science@123', 'Dev@12345', 'science_admin', 'Virtual Labs & Physics Lab'),
  ('adm-6', 'Projectokart Manager', 'projectokart@123', 'Dev@12345', 'projectokart_admin', 'Projectokart Hardware Labs'),
  ('adm-7', 'Materials & Store Lead', 'material@123', 'Dev@12345', 'inventory_admin', 'Inventory & Procurement'),
  ('adm-8', 'Events & Outreach Lead', 'events@123', 'Dev@12345', 'events_admin', 'Conclaves & Seminars'),
  ('adm-9', 'R&D Innovation Lead', 'rnd@123', 'Dev@12345', 'rnd_admin', 'R&D Innovation Labs'),
  ('adm-10', 'Media & Web Content Lead', 'content@123', 'Dev@12345', 'content_admin', 'Media & Web Content')
ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password, email = EXCLUDED.email;

-- 4.2 Seed Lab Materials Products
INSERT INTO materials.products (id, slug, sku, name, category, price, original_price, discount_percentage, stock, image_url, description, specification)
VALUES
  ('mat-1', 'borosilicate-glass-beaker-set-5pcs', 'GLS-BEAK-SET5', 'Borosilicate Glass Beaker Set (5 Pcs: 50ml, 100ml, 250ml, 500ml, 1000ml)', 'GLS', 799, 1199, 33, 120, 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', 'Lab-grade 3.3 borosilicate glass beakers with heavy-duty rim and spout.', 'Class A ISO 3819 certified thermal resistance up to 500°C.'),
  ('mat-2', 'compound-binocular-student-microscope-1000x', 'INS-MICR-1000X', 'Compound Binocular Student Microscope (1000x Magnification with LED Illumination)', 'INS', 5499, 7999, 31, 45, 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800', 'High-precision optical microscope for CBSE/ICSE practical biology classes.', 'Achromatic lenses 4x, 10x, 40x, 100x oil immersion with mechanical stage.'),
  ('mat-3', 'nep-2020-stem-electronics-iot-inventor-kit', 'KIT-IOT-NEP100', 'NEP-2020 STEM Electronics & IoT Inventor Kit (50+ Sensors & Microcontroller)', 'KIT', 2499, 3499, 28, 80, 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800', 'Complete hardware kit for middle and high school robotics and IoT workshops.', 'Includes ESP32, Arduino Uno compatible board, OLED display, ultrasonic sensors.'),
  ('mat-4', 'analytical-chemical-reagents-pack-physics-chemistry', 'CHM-REAG-PK10', 'Analytical Chemistry Standard Reagent Set (10 Essential Reagents)', 'CHM', 1899, 2499, 24, 60, 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b6?w=800', 'Standard analytical laboratory reagents for titration and qualitative analysis.', 'AR Grade certified with tamper-proof HDPE airtight packaging.')
ON CONFLICT (id) DO NOTHING;

-- 4.3 Seed Careers Job Vacancies
INSERT INTO careers.vacancies (id, slug, title, department, location, type, experience, salary, skills, description_html, deadline, posted_date)
VALUES
  ('job-1', 'senior-stem-curriculum-developer-physics', 'Senior STEM Curriculum Developer (Physics & Robotics)', 'Academic Pedagogy', 'New Delhi / Hybrid', 'Full-Time', '3–6 Years', '₹9,00,000 – ₹14,00,000 /yr', '["Curriculum Design", "NEP 2020", "Arduino", "Python", "Physics Lab"]'::jsonb, '<p>We are looking for an experienced Curriculum Developer to design hands-on science experiments for CBSE schools.</p>', '2026-09-30', '2026-08-01'),
  ('job-2', 'lead-virtual-simulation-engineer-threejs-webgl', 'Lead Virtual Simulation Engineer (Three.js & WebGL)', 'Digital Engineering', 'Bengaluru / Remote', 'Full-Time', '4–8 Years', '₹16,00,000 – ₹24,00,000 /yr', '["Three.js", "WebGL", "TypeScript", "React", "GLSL Shaders"]'::jsonb, '<p>Lead development of interactive 3D physics apparatus and real-time virtual chemistry reactions.</p>', '2026-10-15', '2026-08-10'),
  ('job-3', 'institutional-school-partnerships-manager', 'Institutional School Partnerships Manager (North India)', 'School Network', 'New Delhi (Frequent Travel)', 'Full-Time', '2–5 Years', '₹8,00,000 – ₹12,00,000 /yr', '["B2B Institutional Sales", "School Onboarding", "ATL Labs", "Key Account Management"]'::jsonb, '<p>Manage relationships with 200+ partner schools, conduct demo workshops, and onboard CBSE/ICSE institutions.</p>', '2026-09-20', '2026-08-05')
ON CONFLICT (id) DO NOTHING;

-- 4.4 Seed Partner Schools
INSERT INTO network.schools (id, name, code, type, board, city, state, pincode, student_count, faculty_count, principal_name, email, phone, labs_equipped, status, accreditation_level, joined_date)
VALUES
  ('sch-1', 'Delhi Public School, R.K. Puram', 'DPS-DEL-01', 'Senior Secondary K-12', 'CBSE', 'New Delhi', 'Delhi NCR', '110022', 2800, 140, 'Dr. Rama Sharma', 'principal@dpsrkp.net', '+91 11 2617 7372', '["Physics Lab", "Chemistry Lab", "Biology Lab", "ATL Robotics Lab"]'::jsonb, 'verified', 'Tier 1 Lead', '2023-04-12'),
  ('sch-2', 'National Public School, Indiranagar', 'NPS-BLR-02', 'Senior Secondary K-12', 'CBSE', 'Bengaluru', 'Karnataka', '560038', 2100, 110, 'Dr. Shanthi Menon', 'principal@npsblr.edu.in', '+91 80 2528 0611', '["Physics Practical Lab", "IoT & Embedded Systems Lab", "Chemistry Wet Lab"]'::jsonb, 'verified', 'Tier 1 Lead', '2023-07-18'),
  ('sch-3', 'The Heritage School, Sector 62', 'HER-GGN-03', 'Day School K-12', 'ICSE', 'Gurugram', 'Haryana', '122011', 1950, 95, 'Mrs. Neena Kaul', 'info@heritagegurgaon.com', '+91 124 2855 000', '["Makerspace & FabLab", "Virtual Simulation Center"]'::jsonb, 'verified', 'Tier 2 Certified', '2023-11-05')
ON CONFLICT (id) DO NOTHING;

-- 4.5 Seed Training Programs
INSERT INTO training.programs (id, slug, title, category, format, level, duration_hours, batch_size, enrolled_count, lead_trainer, trainer_role, certification_offered, start_date, fee_inr, curriculum_summary, learning_outcomes)
VALUES
  ('tr-1', 'hands-on-stem-nep-2020-physics-masterclass', 'Hands-on STEM & NEP-2020 Experiential Physics Masterclass', 'Physics', 'Hands-on Bootcamp', 'Master Educator', 32, 40, 34, 'Dr. Arvind Gupta & CSEEL Science Core', 'National Pedagogy Lead', 'Certified Master STEM Educator (NEP-2020 Compliant)', '2026-09-15', 2499, 'Master the design of low-cost, high-impact physical experiments for Class 9–12 CBSE mechanics, optics, and thermodynamics.', '["Design 30+ hands-on physics setups", "Integrated assessment rubrics", "Classroom demonstration mastery"]'::jsonb),
  ('tr-2', 'robotics-iot-sensor-interfacing-bootcamp-teachers', 'Robotics, IoT & Sensor Interfacing Bootcamp for STEM Teachers', 'Robotics & IoT', 'Hybrid Certification', 'Intermediate', 24, 35, 29, 'Er. Rajesh Subramanian', 'Chief Hardware Architect', 'ATL Tinkering Lead Instructor Certificate', '2026-10-05', 3499, 'Hands-on coding with ESP32, Arduino C++, ultrasonic distance mapping, and environmental air-quality monitoring stations.', '["Build complete IoT weather station", "Automated obstacle avoidance bots", "Curriculum integration strategies"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 4.6 Seed Outreach Events
INSERT INTO events.symposia (id, slug, title, type, date, time, venue, city, keynote_speakers, registered_count, capacity, banner_image, agenda_summary)
VALUES
  ('evt-1', 'national-stem-principals-symposium-delhi-2026', 'National STEM Principals Symposium: Implementing Experiential Learning Under NEP 2020', 'National Symposium', '2026-10-18', '09:30 AM - 05:00 PM IST', 'Vigyan Bhawan, Maulana Azad Road', 'New Delhi', '["Prof. K. Kasturirangan (Former ISRO Chief)", "Dr. S. K. Bose (Director NCERT)", "Prof. Anita Karwal"]'::jsonb, 340, 500, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200', 'A national conclave for 500+ school leaders on setting up experiential laboratories and AI-driven physics simulations.')
ON CONFLICT (id) DO NOTHING;

-- 4.7 Seed Support Tickets
INSERT INTO support.tickets (id, ticket_number, subject, category, priority, status, user_name, user_email, organization, description)
VALUES
  ('tkt-1', 'TCK-2026-8910', 'Sensor calibration guide request for ATL Kit #204', 'Hardware Support', 'high', 'open', 'Sunita Rao (Physics HOD)', 'sunita.rao@dpsdelhi.edu.in', 'Delhi Public School', 'The ultrasonic sensor in Kit #204 needs re-calibration parameters for 5V input. Need official firmware hex file.')
ON CONFLICT (id) DO NOTHING;

-- 4.8 Seed Blog Articles
INSERT INTO public.blog_posts (id, slug, title, summary, author, author_role, published_date, cover_image, tags)
VALUES
  ('blg-1', 'hands-on-science-nep-2020-transforming-indian-classrooms', 'How Hands-On Experiential Science Under NEP 2020 is Transforming Indian Classrooms', 'Explore how real-world physics setups and digital simulations are replacing rote learning across CBSE & ICSE schools.', 'Dr. Vikram Sharma', 'Founder & Academic Director', '2026-08-15', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200', '["NEP 2020", "Experiential Learning", "STEM Education"]'::jsonb),
  ('blg-2', 'low-cost-stem-lab-setup-guide-schools-india', 'Low-Cost STEM & ATL Lab Setup Guide for Tier 2 and Tier 3 Schools in India', 'A comprehensive blueprint for establishing high-performance robotics, chemistry, and mechanics labs under budget.', 'Pooja Kashyap', 'Head of School Relations', '2026-08-10', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200', '["Lab Setup", "School Infrastructure", "Makerspace"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
