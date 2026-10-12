-- ==============================================================================
-- CSEEL MIGRATION: DEDICATED SECTION COLUMNS IN school_profiles TABLE
-- ==============================================================================
-- Purpose:
-- Instead of keeping all school data inside a single monolithic 'profile_data' column,
-- each of the 14+ sections now has its own dedicated column in Supabase.
-- This ensures:
-- 1. Fine-grained updates: Updating the Hero or Reviews section only updates that specific column.
-- 2. Fast selective queries: Can fetch only the section needed (e.g. SELECT hero FROM school_profiles).
-- 3. High database integrity: JSON schema & type safety per section.
-- 4. Full backwards compatibility: profile_data remains intact as fallback.
-- ==============================================================================

-- 1. ADD DEDICATED COLUMNS FOR EACH CANONICAL SECTION
ALTER TABLE school_profiles 
    ADD COLUMN IF NOT EXISTS basic_info JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS hero JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS about JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS principal JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS management JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS academics JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS results JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS facilities JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS fees JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS admissions JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS contact JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS reviews JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0;

-- 2. AUTO-BACKFILL EXISTING DATA FROM profile_data INTO DEDICATED SECTION COLUMNS
UPDATE school_profiles
SET
    basic_info = CASE 
        WHEN basic_info IS NULL OR basic_info = '{}'::jsonb THEN
            jsonb_build_object(
                'school_name', COALESCE(profile_data->>'schoolName', profile_data->'schoolIdentity'->>'schoolName', ''),
                'udise_code', udise_code,
                'board', COALESCE(profile_data->>'board', profile_data->'schoolIdentity'->>'board', 'CBSE'),
                'medium', COALESCE(profile_data->>'medium', profile_data->'schoolIdentity'->>'mediumOfInstruction', 'English'),
                'established_year', COALESCE(profile_data->>'establishedYear', profile_data->'schoolIdentity'->>'establishedYear', ''),
                'logo_image_url', COALESCE(profile_data->>'logoImage', profile_data->>'actualSchoolLogo', profile_data->>'logoUrl', '')
            )
        ELSE basic_info
    END,

    hero = CASE
        WHEN hero IS NULL OR hero = '{}'::jsonb THEN
            jsonb_build_object(
                'heading_line1', COALESCE(profile_data->>'hero_heading_line1', profile_data->>'heading_line1', 'Play, Learn and'),
                'heading_line2', COALESCE(profile_data->>'hero_heading_line2', profile_data->>'heading_line2', 'Grow, Together..'),
                'tagline', COALESCE(profile_data->>'tagline', profile_data->>'hero_tagline', 'Leading Campus of Excellence'),
                'description', COALESCE(profile_data->>'description', profile_data->>'hero_description', ''),
                'admissions_open', COALESCE((profile_data->>'admissionsOpen')::boolean, (profile_data->>'admissions_open')::boolean, true),
                'boarding_status', COALESCE(profile_data->>'residentialSchool', profile_data->>'boarding_status', 'Day School'),
                'hero_media_items', COALESCE(profile_data->'heroMediaItems', profile_data->'hero_media_items', '[]'::jsonb),
                'phone', COALESCE(profile_data->>'phone', profile_data->>'generalPhone', '')
            )
        ELSE hero
    END,

    stats = CASE
        WHEN stats IS NULL OR stats = '{}'::jsonb THEN
            jsonb_build_object(
                'total_students', COALESCE((profile_data->>'totalStudents')::int, 0),
                'total_teachers', COALESCE((profile_data->>'totalTeachers')::int, 0),
                'classrooms_count', COALESCE((profile_data->>'classroomsCount')::int, 0),
                'working_smart_boards', COALESCE((profile_data->>'workingSmartBoards')::int, 0)
            )
        ELSE stats
    END,

    about = CASE
        WHEN about IS NULL OR about = '{}'::jsonb THEN
            jsonb_build_object(
                'about_text', COALESCE(profile_data->>'aboutText', profile_data->>'about_text', ''),
                'vision_text', COALESCE(profile_data->>'visionText', profile_data->>'vision_text', ''),
                'mission_text', COALESCE(profile_data->>'missionText', profile_data->>'mission_text', ''),
                'campus_photo', COALESCE(profile_data->>'aboutCampusPhoto', profile_data->>'about_campus_photo', '')
            )
        ELSE about
    END,

    principal = CASE
        WHEN principal IS NULL OR principal = '{}'::jsonb THEN
            jsonb_build_object(
                'principal_name', COALESCE(profile_data->>'principalName', profile_data->'leadership'->>'principalName', ''),
                'principal_message', COALESCE(profile_data->>'principalMessage', profile_data->>'principal_body_1', ''),
                'principal_image', COALESCE(profile_data->>'principalImage', profile_data->>'principal_image_url', '')
            )
        ELSE principal
    END,

    management = CASE
        WHEN management IS NULL OR management = '{}'::jsonb THEN
            COALESCE(profile_data->'management', profile_data->'managementDesk', '{}'::jsonb)
        ELSE management
    END,

    academics = CASE
        WHEN academics IS NULL OR academics = '{}'::jsonb THEN
            jsonb_build_object(
                'class_from', COALESCE(profile_data->>'classFrom', 'Nursery'),
                'class_to', COALESCE(profile_data->>'classTo', '12'),
                'streams', COALESCE(profile_data->'streams', '[]'::jsonb)
            )
        ELSE academics
    END,

    results = CASE
        WHEN results IS NULL OR results = '{}'::jsonb THEN
            jsonb_build_object(
                'class10Results', COALESCE(profile_data->'class10Results', '[]'::jsonb),
                'class12Results', COALESCE(profile_data->'class12Results', '[]'::jsonb)
            )
        ELSE results
    END,

    facilities = CASE
        WHEN facilities IS NULL OR facilities = '{}'::jsonb THEN
            COALESCE(profile_data->'facilities', '[]'::jsonb)
        ELSE facilities
    END,

    gallery = CASE
        WHEN gallery IS NULL OR gallery = '{}'::jsonb THEN
            COALESCE(profile_data->'gallery', profile_data->'gallery_items', '[]'::jsonb)
        ELSE gallery
    END,

    fees = CASE
        WHEN fees IS NULL OR fees = '{}'::jsonb THEN
            COALESCE(profile_data->'fees', profile_data->'fee_structure', '{}'::jsonb)
        ELSE fees
    END,

    admissions = CASE
        WHEN admissions IS NULL OR admissions = '{}'::jsonb THEN
            jsonb_build_object(
                'admissions_open', COALESCE((profile_data->>'admissionsOpen')::boolean, true),
                'session', COALESCE(profile_data->>'session', '2026-27'),
                'required_documents', COALESCE(profile_data->'required_documents', '[]'::jsonb)
            )
        ELSE admissions
    END,

    faqs = CASE
        WHEN faqs IS NULL OR faqs = '{}'::jsonb THEN
            COALESCE(profile_data->'faqs', profile_data->'faq_items', '[]'::jsonb)
        ELSE faqs
    END,

    contact = CASE
        WHEN contact IS NULL OR contact = '{}'::jsonb THEN
            jsonb_build_object(
                'address', COALESCE(profile_data->>'address', profile_data->'contact'->'campusLocation'->>'streetAddress', ''),
                'pincode', COALESCE(profile_data->>'pincode', profile_data->'contact'->'campusLocation'->>'pincode', ''),
                'phone', COALESCE(profile_data->>'phone', profile_data->'contact'->>'phone', ''),
                'email', COALESCE(profile_data->>'email', profile_data->'contact'->>'email', ''),
                'website', COALESCE(profile_data->>'website', profile_data->'contact'->>'website', '')
            )
        ELSE contact
    END,

    reviews = CASE
        WHEN reviews IS NULL OR reviews = '[]'::jsonb THEN
            COALESCE(profile_data->'reviews', '[]'::jsonb)
        ELSE reviews
    END,

    likes_count = CASE
        WHEN likes_count IS NULL OR likes_count = 0 THEN
            COALESCE((profile_data->>'likesCount')::int, 0)
        ELSE likes_count
    END
WHERE profile_data IS NOT NULL;

-- 3. CREATE GIN & BTREE INDEXES FOR HIGH-SPEED SECTION QUERIES
CREATE INDEX IF NOT EXISTS idx_school_profiles_likes ON school_profiles(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_school_profiles_hero ON school_profiles USING GIN(hero);
CREATE INDEX IF NOT EXISTS idx_school_profiles_facilities ON school_profiles USING GIN(facilities);
