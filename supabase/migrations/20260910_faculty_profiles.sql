-- ==============================================================================
-- CSEEL.org — Faculty Profiles & Verification Schema
-- ==============================================================================
-- Stores user-submitted faculty profiles with JSON structured data,
-- anti-scraping 20-character alphanumeric access key, and verification status.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.faculty_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_code VARCHAR(20),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL DEFAULT 'Physics',
  access_key VARCHAR(20) NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending_verification', -- 'pending_verification' | 'verified' | 'rejected'
  is_verified BOOLEAN DEFAULT false,
  profile_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_faculty_profiles_access_key ON public.faculty_profiles (access_key);
CREATE INDEX IF NOT EXISTS idx_faculty_profiles_code ON public.faculty_profiles (faculty_code);
CREATE INDEX IF NOT EXISTS idx_faculty_profiles_slug ON public.faculty_profiles (slug);
CREATE INDEX IF NOT EXISTS idx_faculty_profiles_status ON public.faculty_profiles (status);
CREATE INDEX IF NOT EXISTS idx_faculty_profiles_user_id ON public.faculty_profiles (user_id);

-- Enable Row Level Security
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon, authenticated, and service_role
CREATE POLICY "Full access to faculty_profiles" ON public.faculty_profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Grants
GRANT ALL ON public.faculty_profiles TO anon, authenticated, service_role;
