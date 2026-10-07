-- ==============================================================================
-- Supabase SQL Migration: Clean School Database Columns
-- Project: okvnyunvyodrwofzjnoa (Table: public.udise_private_schools)
-- Purpose: Remove numeric codes, prefixes, hyphens, and normalize all columns.
-- ==============================================================================

-- 1. Clean rural_urban column
UPDATE public.udise_private_schools
SET rural_urban = CASE 
  WHEN rural_urban IN ('1', '1-Rural', 'Rural') THEN 'Rural'
  WHEN rural_urban IN ('2', '2-Urban', 'Urban') THEN 'Urban'
  WHEN rural_urban = '9' THEN 'Urban'
  ELSE TRIM(REGEXP_REPLACE(rural_urban, '^\d+[-_:\s]+', ''))
END
WHERE rural_urban IS NOT NULL AND rural_urban != '';

-- 2. Clean gender_type / school_type column
UPDATE public.udise_private_schools
SET gender_type = CASE 
  WHEN gender_type ILIKE '%co-ed%' OR gender_type ILIKE '%coeducational%' OR gender_type = '3-Co-educational' THEN 'Co-educational'
  WHEN gender_type ILIKE '%boys%' OR gender_type = '1-Boys' THEN 'Boys'
  WHEN gender_type ILIKE '%girls%' OR gender_type = '2-Girls' THEN 'Girls'
  ELSE TRIM(REGEXP_REPLACE(gender_type, '^\d+[-_:\s]+', ''))
END
WHERE gender_type IS NOT NULL AND gender_type != '';

-- 3. Clean board_10th column
UPDATE public.udise_private_schools
SET board_10th = CASE 
  WHEN board_10th = '1-CBSE' THEN 'CBSE'
  WHEN board_10th = '2-State Board' THEN 'State Board'
  WHEN board_10th = '3-ICSE' THEN 'ICSE'
  WHEN board_10th = '4-International Board' THEN 'International Board'
  WHEN board_10th = '5-Others' THEN 'Others'
  WHEN board_10th = '7-Madarsa Board' THEN 'Madarsa Board'
  WHEN board_10th = '8-Sanskrit Board' THEN 'Sanskrit Board'
  ELSE TRIM(REGEXP_REPLACE(board_10th, '^\d+[-_:\s]+', ''))
END
WHERE board_10th IS NOT NULL AND board_10th != '';

-- 4. Clean board_12th column
UPDATE public.udise_private_schools
SET board_12th = CASE 
  WHEN board_12th = '1-CBSE' THEN 'CBSE'
  WHEN board_12th = '2-State Board' THEN 'State Board'
  WHEN board_12th = '3-ICSE' THEN 'ICSE'
  WHEN board_12th = '4-International Board' THEN 'International Board'
  WHEN board_12th = '5-Others' THEN 'Others'
  WHEN board_12th = '7-Madarsa Board' THEN 'Madarsa Board'
  WHEN board_12th = '8-Sanskrit Board' THEN 'Sanskrit Board'
  ELSE TRIM(REGEXP_REPLACE(board_12th, '^\d+[-_:\s]+', ''))
END
WHERE board_12th IS NOT NULL AND board_12th != '';

-- 5. Clean primary_medium column
UPDATE public.udise_private_schools
SET primary_medium = CASE 
  WHEN primary_medium = '19-English' THEN 'English'
  WHEN primary_medium = '4-Hindi' THEN 'Hindi'
  WHEN primary_medium = '5-Kannada' THEN 'Kannada'
  WHEN primary_medium = '18-Urdu' THEN 'Urdu'
  WHEN primary_medium = '10-Marathi' THEN 'Marathi'
  WHEN primary_medium = '8-Malayalam' THEN 'Malayalam'
  WHEN primary_medium = '16-Tamil' THEN 'Tamil'
  WHEN primary_medium = '17-Telugu' THEN 'Telugu'
  WHEN primary_medium = '13-Punjabi' THEN 'Punjabi'
  WHEN primary_medium = '14-Sanskrit' THEN 'Sanskrit'
  WHEN primary_medium = '12-Oriya' THEN 'Oriya'
  WHEN primary_medium = '3-Gujarati' THEN 'Gujarati'
  WHEN primary_medium = '1-Assamese' THEN 'Assamese'
  WHEN primary_medium = '2-Bengali' THEN 'Bengali'
  ELSE TRIM(REGEXP_REPLACE(primary_medium, '^\d+[-_:\s]+', ''))
END
WHERE primary_medium IS NOT NULL AND primary_medium != '';

-- 6. Clean secondary_medium column
UPDATE public.udise_private_schools
SET secondary_medium = CASE 
  WHEN secondary_medium = '19-English' THEN 'English'
  WHEN secondary_medium = '4-Hindi' THEN 'Hindi'
  WHEN secondary_medium = '5-Kannada' THEN 'Kannada'
  WHEN secondary_medium = '18-Urdu' THEN 'Urdu'
  WHEN secondary_medium = '10-Marathi' THEN 'Marathi'
  WHEN secondary_medium = '8-Malayalam' THEN 'Malayalam'
  WHEN secondary_medium = '16-Tamil' THEN 'Tamil'
  WHEN secondary_medium = '17-Telugu' THEN 'Telugu'
  WHEN secondary_medium = '13-Punjabi' THEN 'Punjabi'
  WHEN secondary_medium = '14-Sanskrit' THEN 'Sanskrit'
  WHEN secondary_medium = '12-Oriya' THEN 'Oriya'
  WHEN secondary_medium = '3-Gujarati' THEN 'Gujarati'
  WHEN secondary_medium = '1-Assamese' THEN 'Assamese'
  WHEN secondary_medium = '2-Bengali' THEN 'Bengali'
  ELSE TRIM(REGEXP_REPLACE(secondary_medium, '^\d+[-_:\s]+', ''))
END
WHERE secondary_medium IS NOT NULL AND secondary_medium != '';

-- 7. Clean management_desc column
UPDATE public.udise_private_schools
SET management_desc = CASE 
  WHEN management_desc IN ('51-Private Unaided (Recognized)', '5-Private Unaided (Recognized)', 'Private Unaided (Recognized)') THEN 'Private Unaided (Recognized)'
  WHEN management_desc IN ('4-Government Aided', 'Government Aided') THEN 'Government Aided'
  WHEN management_desc IN ('1-Department of Education', 'Department of Education') THEN 'Department of Education'
  WHEN management_desc IN ('2-Tribal Welfare Department', 'Tribal Welfare Department') THEN 'Tribal Welfare Department'
  WHEN management_desc IN ('3-Local body', 'Local Body') THEN 'Local Body'
  WHEN management_desc ILIKE '%madrasa%' OR management_desc ILIKE '%madarsa%' THEN 'Madrasa Private Unaided (Recognized)'
  ELSE TRIM(REGEXP_REPLACE(management_desc, '^\d+[-_:\s]+', ''))
END
WHERE management_desc IS NOT NULL AND management_desc != '';

-- 8. Clean school_category column & expand standard abbreviations
UPDATE public.udise_private_schools
SET school_category = CASE 
  WHEN school_category IN ('6-Pr. Up Pr. and Secondary Only', 'Pr. Up Pr. and Secondary Only') THEN 'Primary, Upper Primary and Secondary Only'
  WHEN school_category IN ('3-Pr. with Up.Pr. Sec. and H.Sec.', 'Pr. with Up.Pr. Sec. and H.Sec.') THEN 'Primary with Upper Primary, Secondary and Higher Secondary'
  WHEN school_category = 'Up. Pr. Secondary and Higher Sec' THEN 'Upper Primary, Secondary and Higher Secondary'
  WHEN school_category = 'Upper Pr. and Secondary' THEN 'Upper Primary and Secondary'
  WHEN school_category = 'Higher Secondary only/Jr. College' THEN 'Higher Secondary only / Junior College'
  WHEN school_category = 'Primary with Upper Primary' THEN 'Primary with Upper Primary'
  WHEN school_category = 'Secondary with Higher Secondary' THEN 'Secondary with Higher Secondary'
  WHEN school_category = 'Secondary Only' THEN 'Secondary Only'
  WHEN school_category = 'Upper Primary only' THEN 'Upper Primary Only'
  WHEN school_category = 'Primary' THEN 'Primary Only'
  WHEN school_category = 'Pre-Primary Only' THEN 'Pre-Primary Only'
  ELSE TRIM(REGEXP_REPLACE(school_category, '^\d+[-_:\s]+', ''))
END
WHERE school_category IS NOT NULL AND school_category != '';

-- 9. Clean numeric formatting artifacts (.0) in pincode, phone, established_year
UPDATE public.udise_private_schools
SET pincode = REGEXP_REPLACE(pincode, '\.0$', '')
WHERE pincode LIKE '%.0';

UPDATE public.udise_private_schools
SET phone = REGEXP_REPLACE(phone, '\.0$', '')
WHERE phone LIKE '%.0';

UPDATE public.udise_private_schools
SET established_year = REGEXP_REPLACE(established_year, '\.0$', '')
WHERE established_year LIKE '%.0';
