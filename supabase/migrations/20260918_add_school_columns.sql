-- Supabase SQL Migration: Add new columns to udise_private_schools table
-- Project: okvnyunvyodrwofzjnoa (Table: udise_private_schools)

ALTER TABLE IF EXISTS public.udise_private_schools 
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS affiliation_number TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ro_water TEXT DEFAULT 'Yes',
ADD COLUMN IF NOT EXISTS residential_school TEXT DEFAULT 'Day School',
ADD COLUMN IF NOT EXISTS library TEXT DEFAULT 'Yes',
ADD COLUMN IF NOT EXISTS integrated_science_lab TEXT DEFAULT 'Yes';

-- Add high-speed indexes for searching and filtering
CREATE INDEX IF NOT EXISTS idx_udise_private_schools_residential ON public.udise_private_schools (residential_school);
CREATE INDEX IF NOT EXISTS idx_udise_private_schools_library ON public.udise_private_schools (library);
CREATE INDEX IF NOT EXISTS idx_udise_private_schools_science_lab ON public.udise_private_schools (integrated_science_lab);
CREATE INDEX IF NOT EXISTS idx_udise_private_schools_ro_water ON public.udise_private_schools (ro_water);
