-- ============================================================================
-- CSEEL PLATFORM: COMPREHENSIVE PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- ============================================================================
-- Execute this complete script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('super_admin', 'hr_admin', 'school_admin', 'job_admin', 'science_admin', 'project_admin', 'inventory_admin', 'event_admin', 'rnd_admin', 'content_admin', 'teacher', 'student', 'organisation', 'user');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    institution TEXT,
    role TEXT DEFAULT 'user',
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. USER ROLES (RBAC Management)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, role)
);

-- 5. ORGANISATIONS / SCHOOLS
CREATE TABLE IF NOT EXISTS public.organisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    org_type TEXT DEFAULT 'School',
    affiliation TEXT,
    address TEXT,
    district TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT,
    country TEXT DEFAULT 'India',
    phone TEXT,
    email TEXT,
    website TEXT,
    established_year INTEGER,
    stem_labs_count INTEGER DEFAULT 1,
    verified BOOLEAN DEFAULT true,
    rating NUMERIC(2,1) DEFAULT 4.5,
    reviews_count INTEGER DEFAULT 0,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TEACHERS / FACULTY
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    subject TEXT NOT NULL,
    qualification TEXT NOT NULL,
    experience_years INTEGER DEFAULT 0,
    current_institute TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT,
    expected_salary TEXT,
    rating NUMERIC(2,1) DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT true,
    avatar_url TEXT,
    bio TEXT,
    specializations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. STUDENTS
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    grade TEXT NOT NULL,
    school TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    projects_count INTEGER DEFAULT 0,
    badges TEXT[] DEFAULT '{}',
    avatar_url TEXT,
    bio TEXT,
    interests TEXT[] DEFAULT '{}',
    rank INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CLASSES
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organisations(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    class_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CLASS ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(class_id, student_id)
);

-- 10. EXPERIMENTS
CREATE TABLE IF NOT EXISTS public.experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Intermediate',
    duration TEXT DEFAULT '45 mins',
    description TEXT,
    aim TEXT,
    theory TEXT,
    procedure TEXT[] DEFAULT '{}',
    precautions TEXT[] DEFAULT '{}',
    applications TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    video_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    instructions TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    file_url TEXT,
    grade TEXT,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    graded_at TIMESTAMP WITH TIME ZONE
);

-- 13. PROJECTS (Projectokart & Student Innovations)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Intermediate',
    description TEXT,
    components JSONB DEFAULT '[]'::jsonb,
    code_snippet TEXT,
    schematics_url TEXT,
    thumbnail_url TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. MATERIALS & INVENTORY
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    sku TEXT UNIQUE,
    description TEXT,
    unit_price NUMERIC(10,2) DEFAULT 0.00,
    stock_quantity INTEGER DEFAULT 100,
    min_order_qty INTEGER DEFAULT 1,
    image_url TEXT,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. SEMINARS, WORKSHOPS & CONCLAVES
CREATE TABLE IF NOT EXISTS public.seminars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'Seminar',
    speaker_name TEXT,
    speaker_designation TEXT,
    date DATE,
    time TEXT,
    mode TEXT DEFAULT 'Offline',
    venue TEXT,
    city TEXT,
    banner_url TEXT,
    registration_url TEXT,
    seats_available INTEGER DEFAULT 50,
    total_seats INTEGER DEFAULT 100,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. JOBS & RECRUITMENT
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES public.organisations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    institute_name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    salary_range TEXT,
    experience_required TEXT,
    job_type TEXT DEFAULT 'Full-time',
    description TEXT,
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    deadline DATE,
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. BLOG POSTS & CMS
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. CONTACT MESSAGES & INQUIRIES
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 19. DEMO REQUESTS
CREATE TABLE IF NOT EXISTS public.demo_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    institution_name TEXT NOT NULL,
    institution_type TEXT DEFAULT 'School',
    city TEXT NOT NULL,
    preferred_date DATE,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 20. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT DEFAULT 'General',
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority ticket_priority DEFAULT 'medium',
    status ticket_status DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 21. ENTERPRISE ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_name TEXT NOT NULL,
    admin_role TEXT NOT NULL,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seminars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Read policies for public directories
CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public organisations viewable" ON public.organisations FOR SELECT USING (true);
CREATE POLICY "Public teachers viewable" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Public students viewable" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public experiments viewable" ON public.experiments FOR SELECT USING (true);
CREATE POLICY "Public projects viewable" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public materials viewable" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Public seminars viewable" ON public.seminars FOR SELECT USING (true);
CREATE POLICY "Public jobs viewable" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Public blogs viewable" ON public.blog_posts FOR SELECT USING (true);

-- Authenticated User Policies
CREATE POLICY "Classes viewable by auth users" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Assignments viewable by auth users" ON public.assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Submissions viewable by student or teacher" ON public.submissions FOR ALL TO authenticated USING (auth.uid() = student_id OR true);
CREATE POLICY "Audit logs insertable by admins" ON public.admin_audit_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Audit logs viewable by admins" ON public.admin_audit_logs FOR SELECT TO authenticated USING (true);

-- Public Submissions (Contact, Demo, Tickets)
CREATE POLICY "Contact messages insertable by all" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Demo requests insertable by all" ON public.demo_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Support tickets insertable by all" ON public.support_tickets FOR INSERT WITH CHECK (true);

-- ============================================================================
-- AUTHENTICATION TRIGGER: Automatic Profile Creation on Signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, email, avatar_url, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'display_name', new.email),
        new.email,
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(new.raw_user_meta_data->>'role', 'user')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- HELPER FUNCTION: Role Checking in RLS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
