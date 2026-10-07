-- ==============================================================================
-- CSEEL.ORG — SUPABASE STORAGE BUCKETS SETUP FOR ALL DEPARTMENTS
-- Run this script in your Supabase SQL Editor to create file storage buckets!
-- ==============================================================================

-- 1. Create Dedicated Department Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('materials-media', 'materials-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']),
  ('careers-resumes', 'careers-resumes', true, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('events-banners', 'events-banners', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('training-materials', 'training-materials', true, 104857600, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/zip']),
  ('network-docs', 'network-docs', true, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('support-attachments', 'support-attachments', true, 20971520, ARRAY['image/jpeg', 'image/png', 'application/pdf', 'text/plain'])
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies: Allow Public Read Access
CREATE POLICY "Public Read Materials Media" ON storage.objects FOR SELECT USING (bucket_id = 'materials-media');
CREATE POLICY "Public Read Careers Resumes" ON storage.objects FOR SELECT USING (bucket_id = 'careers-resumes');
CREATE POLICY "Public Read Events Banners" ON storage.objects FOR SELECT USING (bucket_id = 'events-banners');
CREATE POLICY "Public Read Training Materials" ON storage.objects FOR SELECT USING (bucket_id = 'training-materials');
CREATE POLICY "Public Read Network Docs" ON storage.objects FOR SELECT USING (bucket_id = 'network-docs');
CREATE POLICY "Public Read Support Attachments" ON storage.objects FOR SELECT USING (bucket_id = 'support-attachments');

-- 3. Storage Policies: Allow Authenticated & Anon Uploads (for web forms & admin portal)
CREATE POLICY "Allow Uploads to Materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'materials-media');
CREATE POLICY "Allow Uploads to Careers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'careers-resumes');
CREATE POLICY "Allow Uploads to Events" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'events-banners');
CREATE POLICY "Allow Uploads to Training" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'training-materials');
CREATE POLICY "Allow Uploads to Network" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'network-docs');
CREATE POLICY "Allow Uploads to Support" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'support-attachments');
