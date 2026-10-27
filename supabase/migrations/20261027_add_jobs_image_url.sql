-- Migration: Add image_url to public.jobs table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS image_url TEXT;
