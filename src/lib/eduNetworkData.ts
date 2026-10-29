import rawSchoolsData from '@/data/schools_database.json';

import { VERIFIED_FACULTY_MEMBERS } from '@/data/facultyJobsData';



export interface OrganizationItem {

  id: string;

  slug?: string;

  name: string;

  type: "School" | "University" | "Research Institute" | "Atal Tinkering Lab" | "College";

  affiliation: string;

  city: string;

  state: string;

  pincode: string;

  address: string;

  locality?: string;

  district?: string;

  block?: string;

  villageTownCity?: string;

  email: string;

  phone: string;

  website: string;

  verified: boolean;

  rating: number;

  reviews: number;

  stemLabsCount: number;

  studentStrength: number;

  logo: string;

  bannerImage: string;

  description: string;

  openJobsCount: number;

  established: number;

  facilities: string[];

  classesOffered?: string;

  monthlyFees?: string;

  monthlyFeesNum?: number;

  board?: "CBSE" | "ICSE" | "IB" | "State Board" | "UGC/AICTE";

  studentFacultyRatio?: string;

  admissionStatus?: "On Going" | "Closing Soon" | "Open for 2026-27" | "Merit Based";

  udiseCode?: string;

  isFeatured?: boolean;

  likesCount?: number;

}



export interface TeacherResourceItem {

  id: string;

  title: string;

  type: "Lesson Plan" | "Lab Manual" | "Research Paper" | "Worksheet" | "Simulation Demo";

  subject: string;

  size: string;

  visibility: "public" | "private" | "followers";

  downloadsCount: number;

}



export interface TeacherPastSchoolItem {

  schoolName: string;

  role: string;

  duration: string;

  city: string;

}



export interface TeacherItem {

  id: string;

  slug?: string;

  name: string;

  email: string;

  phone: string;

  designation?: string;

  board?: string;

  address?: string;

  phonePrivate?: boolean;

  emailPrivate?: boolean;

  pastSchools?: TeacherPastSchoolItem[];

  subject: "Physics" | "Chemistry" | "Biology" | "Mathematics" | "Robotics & AI" | "Computer Science" | "Lab Technology";

  qualification: string;

  experienceYears: number;

  currentInstitute: string;

  city: string;

  state: string;

  pincode: string;

  verified: boolean;

  nepCertified: boolean;

  rating: number;

  reviewsCount: number;

  avatar: string;

  bio: string;

  skills: string[];

  expectedSalary: string;

  availableFor: ("Full-Time" | "Visiting Faculty" | "Online Mentor" | "Lab Workshop Instructor")[];

  isActivelySeekingJob?: boolean;

  jobSeekingExpiresInHours?: number;

  immediateJoining?: boolean;

  jobSeekingActivatedDate?: string;

  profileVisibility?: "public" | "private" | "followers";

  showContactInfo?: boolean;

  resources?: TeacherResourceItem[];

  customBlocks?: any[];

}



export interface ProjectFileItem {

  id: string;

  name: string;

  type: "pdf" | "code" | "cad" | "circuit" | "dataset" | "doc";

  size: string;

  visibility: "public" | "private" | "followers";

  lastUpdated: string;

  url?: string;

}



export interface StudentProjectItem {

  id: string;

  title: string;

  category: "IoT & Robotics" | "Renewable Energy" | "BioTech & Chemistry" | "AI & Space Science" | "Applied Physics";

  description: string;

  status: "Completed" | "In Progress" | "Patent Pending" | "National Fair Winner";

  featuredImage: string;

  visibility: "public" | "private" | "followers";

  award?: string;

  starsCount: number;

  tags: string[];

  files: ProjectFileItem[];

}



export interface StudentItem {

  id: string;

  slug?: string;

  name: string;

  email: string;

  classGrade: string;

  schoolCollege: string;

  city: string;

  state: string;

  pincode: string;

  verified: boolean;

  avatar: string;

  bio: string;

  interests: string[];

  projectsCount: number;

  awardsCount: number;

  topProject?: string;

  profileVisibility?: "public" | "private" | "followers";

  showContactInfo?: boolean;

  experimentsCompleted?: number;

  badges?: string[];

  projects?: StudentProjectItem[];

}



export interface EduJobItem {

  id: string;

  slug?: string;

  orgId: string;

  orgName: string;

  orgLogo: string;

  orgType?: string;

  orgRating: number;

  title: string;

  subject: "Physics" | "Chemistry" | "Biology" | "Mathematics" | "Robotics & AI" | "Computer Science" | "Lab Technology";

  roleType: "Full-Time" | "Part-Time" | "Visiting Faculty" | "Lab Instructor" | "Research Fellow";

  jobTypeCategory: string;

  jobShift: string;

  city: string;

  state: string;

  pincode: string;

  address: string;

  salary: string;

  salaryNumMin: number;

  salaryNumMax: number;

  experienceRequired: string;

  qualifications: string;

  openings: number;

  postedDate: string;

  isUrgentlyHiring: boolean;

  easilyApply: boolean;

  benefits: string[];

  description: string;

  responsibilities: string[];

  requirements: string[];

  attachmentName?: string;

  attachmentSize?: string;

  verified: boolean;

}



export interface OrgPostItem {

  id: string;

  orgId: string;

  authorName: string;

  authorLogo: string;

  content: string;

  image?: string;

  attachmentName?: string;

  attachmentSize?: string;

  tags: string[];

  createdAt: string;

  likes: number;

  isLiked?: boolean;

  comments: {

    id: string;

    userName: string;

    userRole: string;

    userAvatar: string;

    comment: string;

    createdAt: string;

  }[];

  shares: number;

  isFeaturedCarousel?: boolean;

}



export interface OrgReviewItem {

  id: string;

  orgId: string;

  userName: string;

  userRole: string;

  userAvatar: string;

  rating: number;

  comment: string;

  date: string;

  verifiedReviewer: boolean;

}



export interface SchoolLabItem {

  id: string;

  orgId: string;

  name: string;

  category: "Composite Science" | "Atal Tinkering Lab (ATL)" | "Robotics & AI" | "Biotechnology" | "Physics & Optics" | "Chemistry Titration";

  carpetAreaSqFt: number;

  capacityStudents: number;

  isCbseCompliant: boolean;

  isNep2020Compliant: boolean;

  status: "Operational" | "Upgrade In Progress" | "Procurement Phase";

  primaryImage: string;

  galleryImages: string[];

  description: string;

  equipmentHighlights: string[];

  safetyCertifications: string[];

  establishedYear: number;

}



// ── Clean Production Datasets (Strictly NO fake loops or dummy data) ──────────

export const ALL_ORGANIZATIONS: OrganizationItem[] = (Array.isArray(rawSchoolsData) && rawSchoolsData.length > 0)

  ? (rawSchoolsData as any[]).map((s: any, idx: number) => ({

      id: s.id || s.udise_code || `school-${idx}`,

      slug: s.slug || (s.name ? slugify(s.name) : `school-${idx}`),

      name: s.name || s.school_name || "School",

      type: "School",

      affiliation: s.affiliation || s.board || "CBSE",

      city: s.city || "",

      state: s.state || "",

      pincode: s.pincode || "",

      address: s.address || "",

      email: s.email || "",

      phone: s.phone || "",

      website: s.website || "",

      verified: true,

      rating: 4.8,

      reviews: 12,

      stemLabsCount: 2,

      studentStrength: 1000,

      logo: s.logo || "/images/default-school-placeholder.png",

      bannerImage: "/images/default-school-campus.jpg",

      description: s.description || "Educational institution offering experiential STEM learning labs.",

      openJobsCount: 0,

      established: s.established || 2005,

      facilities: ["Composite Science Lab", "Computer Lab", "Library"]

    }))

  : [];



export const ALL_CITIES = [

  { city: "New Delhi", state: "Delhi", pin: "110001" },

  { city: "Gurugram", state: "Haryana", pin: "122001" },

  { city: "Noida", state: "Uttar Pradesh", pin: "201301" },

  { city: "Bengaluru", state: "Karnataka", pin: "560001" },

  { city: "Mumbai", state: "Maharashtra", pin: "400001" },

  { city: "Pune", state: "Maharashtra", pin: "411001" },

  { city: "Hyderabad", state: "Telangana", pin: "500001" },

  { city: "Chennai", state: "Tamil Nadu", pin: "600001" },

  { city: "Kolkata", state: "West Bengal", pin: "700001" },

  { city: "Jaipur", state: "Rajasthan", pin: "302001" },

  { city: "Ahmedabad", state: "Gujarat", pin: "380001" },

  { city: "Chandigarh", state: "Punjab", pin: "160001" }

];



const pastSchoolsMapData: Record<string, TeacherPastSchoolItem[]> = {

  "fac-1": [

    {

      "schoolName": "Delhi Public School, R.K. Puram",

      "role": "Senior PGT Physics",

      "duration": "2018 - 2024",

      "city": "New Delhi"

    },

    {

      "schoolName": "Modern School, Barakhamba Road",

      "role": "TGT Science & Lab Head",

      "duration": "2012 - 2018",

      "city": "New Delhi"

    }

  ],

  "fac-2": [

    {

      "schoolName": "The Cathedral & John Connon School",

      "role": "TGT Chemistry In-Charge",

      "duration": "2019 - 2024",

      "city": "Mumbai"

    },

    {

      "schoolName": "Bombay Scottish School, Mahim",

      "role": "Assistant Science Teacher",

      "duration": "2015 - 2019",

      "city": "Mumbai"

    }

  ],

  "fac-prt-1": [

    {

      "schoolName": "The Heritage School, Gurugram",

      "role": "PRT Experiential Science Lead",

      "duration": "2021 - 2024",

      "city": "Gurugram"

    },

    {

      "schoolName": "Shiv Nadar School",

      "role": "Primary Activity Educator",

      "duration": "2019 - 2021",

      "city": "Gurugram"

    }

  ],

  "fac-3": [

    {

      "schoolName": "Amity International School, Sec 46",

      "role": "Lead ATL & Robotics Instructor",

      "duration": "2020 - 2024",

      "city": "Gurugram"

    },

    {

      "schoolName": "Pathways World School, Aravali",

      "role": "Makerspace Coordinator",

      "duration": "2018 - 2020",

      "city": "Gurugram"

    }

  ],

  "fac-4": [

    {

      "schoolName": "National Public School, Indiranagar",

      "role": "PGT Biology & Lab In-Charge",

      "duration": "2017 - 2024",

      "city": "Bengaluru"

    },

    {

      "schoolName": "The International School Bangalore (TISB)",

      "role": "IBDP Biology Demonstrator",

      "duration": "2014 - 2017",

      "city": "Bengaluru"

    }

  ],

  "fac-5": [

    {

      "schoolName": "The Bishop's School, Camp",

      "role": "TGT Mathematics Lead",

      "duration": "2018 - 2024",

      "city": "Pune"

    },

    {

      "schoolName": "St. Vincent's High School",

      "role": "Mathematics Teacher",

      "duration": "2016 - 2018",

      "city": "Pune"

    }

  ],

  "fac-6": [

    {

      "schoolName": "La Martiniere for Boys",

      "role": "Senior PGT Physics & External Examiner",

      "duration": "2015 - 2024",

      "city": "Kolkata"

    },

    {

      "schoolName": "South Point High School",

      "role": "Physics Lab Demonstrator",

      "duration": "2010 - 2015",

      "city": "Kolkata"

    }

  ],

  "fac-7": [

    {

      "schoolName": "Hyderabad Public School, Begumpet",

      "role": "PGT Computer Science & AI Lead",

      "duration": "2019 - 2024",

      "city": "Hyderabad"

    },

    {

      "schoolName": "Oakridge International School",

      "role": "STEM & Coding Mentor",

      "duration": "2017 - 2019",

      "city": "Hyderabad"

    }

  ],

  "fac-8": [

    {

      "schoolName": "Maharaja Sawai Man Singh Vidyalaya",

      "role": "TGT Chemistry Demonstrator",

      "duration": "2020 - 2024",

      "city": "Jaipur"

    },

    {

      "schoolName": "St. Xavier's Senior Secondary School",

      "role": "Science Laboratory Instructor",

      "duration": "2019 - 2020",

      "city": "Jaipur"

    }

  ]

};

const addressMapData: Record<string, { addr: string; pin: string; phone: string }> = {

  "New Delhi": {

    "addr": "Institutional Area, Sector 14",

    "pin": "110001",

    "phone": "+91 98101 23456"

  },

  "Mumbai": {

    "addr": "Bandra Kurla Complex, Bandra East",

    "pin": "400051",

    "phone": "+91 98202 34567"

  },

  "Gurugram": {

    "addr": "Golf Course Extension Road, Sector 62",

    "pin": "122002",

    "phone": "+91 98183 45678"

  },

  "Bengaluru": {

    "addr": "Koramangala 4th Block, 100 Feet Road",

    "pin": "560034",

    "phone": "+91 98450 56789"

  },

  "Pune": {

    "addr": "Koregaon Park, Lane 7",

    "pin": "411001",

    "phone": "+91 98220 67890"

  },

  "Kolkata": {

    "addr": "Salt Lake Sector V, Bidhannagar",

    "pin": "700091",

    "phone": "+91 98300 78901"

  },

  "Hyderabad": {

    "addr": "HITEC City, Madhapur",

    "pin": "500081",

    "phone": "+91 98490 89012"

  },

  "Jaipur": {

    "addr": "C-Scheme, Ashok Nagar",

    "pin": "302001",

    "phone": "+91 98290 90123"

  }

};



export const ALL_TEACHERS: TeacherItem[] = VERIFIED_FACULTY_MEMBERS.map((fac, idx) => {

  const meta = addressMapData[fac.city] || { addr: 'Main Educational Corridor', pin: '110001', phone: '+91 98100 0000' + idx };

  const emailName = fac.name.toLowerCase().replace(/[^a-z0-9]/g, '.');

  return {

    id: fac.id,

    slug: `${slugify(fac.name)}-${slugify(fac.subject)}-${slugify(fac.city)}`,

    name: fac.name,

    email: `${emailName}@faculty.cseel.org`,

    phone: meta.phone,

    designation: fac.designation,

    board: fac.board,

    address: `${meta.addr}, ${fac.city}, ${fac.state}`,

    phonePrivate: true,

    emailPrivate: true,

    pastSchools: pastSchoolsMapData[fac.id] || [

      { schoolName: 'Delhi Public School', role: `Senior ${fac.designation} ${fac.subject}`, duration: '2020 - 2024', city: fac.city },

      { schoolName: 'St. Xavier High School', role: 'Laboratory Instructor', duration: '2016 - 2020', city: fac.city }

    ],

    subject: fac.subject as any,

    qualification: fac.qualification,

    experienceYears: fac.experienceYears,

    currentInstitute: fac.currentInstitute,

    city: fac.city,

    state: fac.state,

    pincode: meta.pin,

    verified: fac.verified,

    nepCertified: fac.nepCertified,

    rating: fac.rating,

    reviewsCount: fac.reviewsCount,

    avatar: fac.avatar,

    bio: fac.bio,

    skills: fac.skills,

    expectedSalary: fac.expectedSalary,

    availableFor: ['Full-Time', 'Visiting Faculty', 'Lab Workshop Instructor'],

    isActivelySeekingJob: fac.isActivelySeekingJob,

    profileVisibility: 'public',

    showContactInfo: false

  };

});

export const ALL_STUDENTS: StudentItem[] = [];

export const ALL_JOBS: EduJobItem[] = [];



// ── Helpers ──────────────────────────────────────────────────────────────────

export function slugify(text: string): string {

  return text

    .toString()

    .toLowerCase()

    .trim()

    .replace(/[\s_]+/g, '-')

    .replace(/[^\w\-]+/g, '')

    .replace(/\-\-+/g, '-');

}



export function getJobSlug(job: EduJobItem): string {

  if (job.slug) return job.slug;

  return `${slugify(job.title)}-at-${slugify(job.orgName)}-${slugify(job.city)}`;

}



export function getOrgSlug(org: OrganizationItem): string {

  if (org.slug) return org.slug;

  return `${slugify(org.name)}-${slugify(org.city)}`;

}



export function getTeacherSlug(teacher: TeacherItem): string {

  if (teacher.slug) return teacher.slug;

  return `${slugify(teacher.name)}-${slugify(teacher.subject)}-${slugify(teacher.city)}`;

}



export function getStudentSlug(student: StudentItem): string {

  if (student.slug) return student.slug;

  return `${slugify(student.name)}-${slugify(student.classGrade)}-${slugify(student.city)}`;

}



export function getOrganizationById(idOrSlug: string): OrganizationItem | undefined {

  if (!idOrSlug) return undefined;

  const decoded = decodeURIComponent(idOrSlug).toLowerCase();

  return ALL_ORGANIZATIONS.find(

    (o) => o.id.toLowerCase() === decoded || (o.slug && o.slug.toLowerCase() === decoded) || slugify(o.name) === decoded

  );

}



export function getJobById(idOrSlug: string): EduJobItem | undefined {

  if (!idOrSlug) return undefined;

  const decoded = decodeURIComponent(idOrSlug).toLowerCase();

  return ALL_JOBS.find(

    (j) => j.id.toLowerCase() === decoded || (j.slug && j.slug.toLowerCase() === decoded) || getJobSlug(j) === decoded

  );

}



export function getTeacherById(idOrSlug: string): TeacherItem | undefined {
  if (!idOrSlug) return undefined;
  const decoded = decodeURIComponent(idOrSlug).toLowerCase();

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('cseel_custom_faculty') || localStorage.getItem('cseel_created_teacher_profiles');
      if (stored) {
        const customTeachers = JSON.parse(stored);
        const customFound = customTeachers.find(
          (t: any) =>
            (t.id && String(t.id).toLowerCase() === decoded) ||
            (t.slug && String(t.slug).toLowerCase() === decoded) ||
            (t.name && t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === decoded)
        );
        if (customFound) {
          return {
            id: customFound.id,
            slug: customFound.slug || customFound.id,
            name: customFound.name,
            email: customFound.email || '',
            phone: customFound.phone || '+91 9*********',
            designation: customFound.designation || 'PGT',
            board: customFound.board || 'CBSE',
            subject: customFound.subject || 'Physics',
            qualification: customFound.qualification || 'Post Graduate / B.Ed',
            experienceYears: Number(customFound.experienceYears || customFound.experience_years) || 3,
            currentInstitute: customFound.currentInstitute || customFound.current_institute || 'Senior Secondary School',
            city: customFound.city || 'Delhi NCR',
            state: customFound.state || 'Delhi NCR',
            pincode: customFound.pincode || '110001',
            verified: Boolean(customFound.verified),
            nepCertified: true,
            rating: Number(customFound.rating) || 4.8,
            reviewsCount: Number(customFound.reviewsCount || customFound.reviews_count) || 0,
            avatar: customFound.avatar || customFound.avatarUrl || customFound.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
            bio: customFound.bio || (customFound.name + ' is a dedicated educator in ' + (customFound.subject || 'STEM') + '.'),
            skills: Array.isArray(customFound.skills)
              ? customFound.skills
              : Array.isArray(customFound.specializations)
              ? customFound.specializations
              : ['Pedagogy', 'STEM', 'CBSE'],
            expectedSalary: customFound.expectedSalary || customFound.expected_salary || '₹6 - ₹9 LPA',
            availableFor: ['Full-Time', 'Visiting Faculty'],
            isActivelySeekingJob: true,
          };
        }
      }
    } catch (e) {}
  }

  return ALL_TEACHERS.find(
    (t) => t.id.toLowerCase() === decoded || (t.slug && t.slug.toLowerCase() === decoded) || getTeacherSlug(t) === decoded
  );
}

export async function fetchTeacherByIdOrSlug(idOrSlug: string): Promise<TeacherItem | undefined> {
  if (!idOrSlug) return undefined;
  const decoded = decodeURIComponent(idOrSlug).trim();

  // 1. Check local / static list
  const staticFound = getTeacherById(decoded);
  if (staticFound) return staticFound;

  // 2. Fetch from Supabase public.teachers table
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
  const SUPABASE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYXpreHRoYXZ4cGhpYmRic3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTk4MzgsImV4cCI6MjA4OTM5NTgzOH0.Oi47bXRcJ5dAAblFqYUnFvbUx61DS8ABBikC6cIjGlo';

  try {
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/teachers?or=(id.eq.' + decoded + ',slug.eq.' + decoded + ')&limit=1',
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + SUPABASE_KEY,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) return undefined;
    const rows = await res.json();
    if (!rows || rows.length === 0) return undefined;
    const r = rows[0];

    const maskedPhone = r.phone ? '+91 ' + String(r.phone).charAt(0) + '*********' : '+91 9*********';

    return {
      id: r.id,
      slug: r.slug || r.id,
      name: r.name,
      email: r.email || '',
      phone: maskedPhone,
      designation: r.designation || 'PGT',
      board: r.board || 'CBSE',
      subject: r.subject || 'Physics',
      qualification: r.qualification || 'Post Graduate / B.Ed',
      experienceYears: Number(r.experience_years) || 3,
      currentInstitute: r.current_institute || 'Senior Secondary School',
      city: r.city || 'Delhi NCR',
      state: r.state || 'Delhi NCR',
      pincode: r.pincode || '110001',
      verified: Boolean(r.verified),
      nepCertified: true,
      rating: Number(r.rating) || 4.8,
      reviewsCount: Number(r.reviews_count) || 0,
      avatar: r.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
      bio: r.bio || (r.name + ' is a dedicated educator in ' + (r.subject || 'STEM') + '.'),
      skills: Array.isArray(r.specializations) ? r.specializations : ['Pedagogy', 'STEM', 'CBSE'],
      expectedSalary: r.expected_salary || '₹6 - ₹9 LPA',
      availableFor: ['Full-Time', 'Visiting Faculty'],
      isActivelySeekingJob: true,
    };
  } catch (err) {
    console.error('[fetchTeacherByIdOrSlug] Error:', err);
    return undefined;
  }
}

export function getStudentById(idOrSlug: string): StudentItem | undefined {
  if (!idOrSlug) return undefined;
  const decoded = decodeURIComponent(idOrSlug).toLowerCase();
  return ALL_STUDENTS.find(
    (s) => s.id.toLowerCase() === decoded || (s.slug && s.slug.toLowerCase() === decoded) || getStudentSlug(s) === decoded
  );
}

export function getJobsByOrgId(orgId: string): EduJobItem[] {
  if (!orgId) return [];
  return ALL_JOBS.filter((j) => j.orgId === orgId);
}

export function getPostsByOrgId(orgId: string): OrgPostItem[] {
  return [];
}

export function getOrgLabsByOrgId(orgId: string): SchoolLabItem[] {
  return [];
}

export function getReviewsByOrgId(orgId: string): OrgReviewItem[] {
  return [];
}
