-- ============================================================================
-- CSEEL PLATFORM: SUPABASE PRODUCTION SEED DATA
-- ============================================================================
-- Execute in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Insert Verified Partner Schools & Research Institutions
INSERT INTO public.organisations (
    name, slug, org_type, board, udise_code, affiliation, monthly_fees, monthly_fees_num,
    classes_offered, student_faculty_ratio, admission_status, rating, reviews_count,
    verified, is_featured, logo_url, banner_url, city, state, district, block,
    village_town_city, locality, pincode, address, website, established_year,
    student_strength, stem_labs_count, description
) VALUES 
(
    'K.R. Mangalam Global School',
    'kr-mangalam-global-school-delhi',
    'School',
    'IB',
    '07090300124',
    'International Baccalaureate (IB PYP, MYP & DP)',
    '₹29,000 / mo',
    29000,
    'Pre-K - 12th',
    '8:1',
    'Open for 2026-27',
    4.9,
    142,
    true,
    true,
    'https://images.uniapply.com/uploads/college/image/logo/2186/KRMGS_L_220920_174918.jpg',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
    'Delhi NCR',
    'Delhi',
    'South Delhi',
    'Hauz Khas Block',
    'New Delhi',
    'Greater Kailash I',
    '110048',
    'Block N, Greater Kailash I, New Delhi, Delhi 110048',
    'https://krmangalamgk.com',
    2018,
    2400,
    12,
    'Ranked among South Delhi''s top international institutions. Features comprehensive NEP-2020 STEM experiential laboratories, robotics pods, and holistic student inquiry.'
),
(
    'Delhi Public School, R.K. Puram',
    'dps-rk-puram-delhi',
    'School',
    'CBSE',
    '07080200145',
    'CBSE Affiliated Senior Secondary School',
    '₹14,500 / mo',
    14500,
    'Pre-K - 12th',
    '14:1',
    'Closing Soon',
    4.8,
    320,
    true,
    true,
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=100&h=100&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
    'Delhi NCR',
    'Delhi',
    'South West Delhi',
    'R.K. Puram Block',
    'New Delhi',
    'Sector 12, R.K. Puram',
    '110022',
    'Sector 12, R.K. Puram, New Delhi, Delhi 110022',
    'https://dpsrkp.net',
    1972,
    3200,
    10,
    'Iconic flagship CBSE campus renowned for national Olympiad ranks, medical/engineering entrance excellence, and state-of-the-art physics & chemistry laboratories.'
)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    monthly_fees = EXCLUDED.monthly_fees,
    monthly_fees_num = EXCLUDED.monthly_fees_num,
    rating = EXCLUDED.rating,
    reviews_count = EXCLUDED.reviews_count;
