import {
  SchoolTemplateState,
  FlipbookSlideItem,
  FacilityCardItem,
  AdmissionCardItem,
  GalleryMediaItem,
  FeeTableState,
} from './SchoolTemplateContext';
import { FACILITY_CATEGORIES } from '../FacilityData';

/**
 * Strict character length limiter to prevent layout distortion/overflow.
 */
export function limitLength(val: any, maxChars: number): string {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  return str.length > maxChars ? str.substring(0, maxChars) : str;
}

/**
 * All 62+ Predefined School Facilities with verified icons and categories.
 * Selection is strictly restricted to these items.
 */
export const ALL_PREDEFINED_FACILITIES = FACILITY_CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => ({
    name: item.name,
    category: cat.category,
    icon: item.icon,
  }))
);

const PREDEFINED_FACILITY_MAP = new Map<string, { name: string; category: string; icon: string }>();
ALL_PREDEFINED_FACILITIES.forEach((item) => {
  PREDEFINED_FACILITY_MAP.set(item.name.toLowerCase().trim(), item);
});

/**
 * Clean, structured Master Schema matching the EXACT 6 TABS of the School Profile:
 * 1. tab_1_home (Home Tab: Hero Attraction Metrics, Identity, PhotoBook, About, Principal)
 * 2. tab_2_academics (Academics Tab: Class range, curriculum features, streams)
 * 3. tab_3_facilities (Facilities Tab: 62 Predefined facilities selection with verified icons)
 * 4. tab_4_gallery (Campus Gallery Tab: Photo & video showcase)
 * 5. tab_5_admissions_fees (Admissions & Fees Tab: Fee table & admission guidelines)
 * 6. tab_6_contact (Contact Us Tab: Address, phone, email, website)
 */
export const BLANK_AI_SCHOOL_SCHEMA = {
  $schema_version: '3.0',
  schema_info: {
    description: 'CSEEL Interactive School Profile Master Blueprint (Organized Section-by-Section)',
    instructions: 'Har section school profile ke exact section se match karta hai. Sabhi 13 sections me school details fill karein.',
  },

  // ========================================================
  // SECTION 1: BASIC INSTITUTIONAL IDENTITY
  // ========================================================
  section_1_basic_info: {
    section_name: 'Basic Institutional Identity',
    school_name: 'DELHI PUBLIC SCHOOL', // Max 65 chars (Government UDISE verified)
    udise_code: '06170505907', // Exactly 11 digits (Primary Key)
    board: 'CBSE (Central Board of Secondary Education)', // Max 50 chars
    medium: 'English & Hindi Medium', // Max 35 chars
    established_year: '2013', // Max 10 chars
    campus_area: '14 Acres', // Max 20 chars
    school_type: 'Private Unaided (Recognized)', // Max 35 chars
    management: 'Delhi Public School Society', // Max 45 chars
    school_category: 'Senior Secondary (Class 1 to 12th)', // Max 45 chars
    gender_type: 'Co-Educational', // 'Co-Educational' | 'Boys' | 'Girls'
    branding: {
      logo_image_url: '/images/schools/hero-school-1.png',
      hero_banner_image: '/images/schools/hero-school-1.png',
    },
  },

  // ========================================================
  // SECTION 2: HERO FLOATING PRESTIGE ATTRACTION METRICS
  // ========================================================
  section_2_hero_prestige_metrics: {
    section_name: 'Hero Floating Attraction Metrics',
    metric_1_board_results: {
      value: '100%', // Max 10 chars (e.g. '100%')
      label: 'Board Pass Rate', // Max 25 chars
    },
    metric_2_student_teacher_ratio: {
      value: '1:15', // Max 10 chars (e.g. '1:15')
      label: 'Student-Teacher Ratio', // Max 25 chars
    },
    metric_3_labs_studios: {
      value: '25+', // Max 10 chars (e.g. '25+')
      label: 'Hi-Tech Labs & Studios', // Max 25 chars
    },
    metric_4_awards: {
      value: '40+', // Max 10 chars (e.g. '40+')
      label: 'Awards & Honors', // Max 25 chars
    },
    metric_5_parent_trust: {
      value: '99%', // Max 10 chars (e.g. '99%')
      label: 'Parent Trust Rating', // Max 25 chars
    },
  },

  // ========================================================
  // SECTION 3: 3D PHOTOBOOK CAROUSEL SHOWCASE SLIDES
  // ========================================================
  section_3_photobook_slides: {
    section_name: '3D PhotoBook Carousel Showcase',
    slides: [
      {
        slide_id: 'slide-1',
        title: 'Modern Academic Quadrangle', // Max 35 chars
        desc: 'Eco-friendly smart campus with state-of-the-art interactive digital infrastructure.', // Max 90 chars
        media_type: 'image', // 'image' | 'video'
        image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
        video_url: '',
        button_text: 'Explore Campus', // Max 18 chars
        action_tab: 'home',
      },
      {
        slide_id: 'slide-2',
        title: 'Atal Tinkering & Robotics Lab',
        desc: 'Hands-on experiential learning in AI, IoT sensors, robotics, and applied science.',
        media_type: 'image',
        image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
        video_url: '',
        button_text: 'View Facilities',
        action_tab: 'facilities',
      },
      {
        slide_id: 'slide-3',
        title: 'Athletics Ground & Sports Complex',
        desc: 'Olympic-standard turf, cricket academy, basketball arena, and yoga pavilion.',
        media_type: 'image',
        image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80',
        video_url: '',
        button_text: 'Admissions Open',
        action_tab: 'admissions',
      },
    ],
  },

  // ========================================================
  // SECTION 4: PHYSICAL CAMPUS STATISTICS & SCALE
  // ========================================================
  section_4_statistics: {
    section_name: 'Physical Campus Statistics',
    total_students: 1450, // Total student strength
    total_teachers: 85, // Total faculty members
    classrooms_count: 55,
    working_smart_boards: 45,
    is_residential: false,
    has_hostel: false,
  },

  // ========================================================
  // SECTION 5: ABOUT SCHOOL, VISION & MISSION STATEMENTS
  // ========================================================
  section_5_about_and_vision: {
    section_name: 'About School, Vision & Mission',
    about_text: 'Delhi Public School Rewari is a premier CBSE-affiliated institution dedicated to academic brilliance, moral integrity, and experiential STEAM learning across a sprawling 14-acre green campus.', // Max 320 chars
    vision_text: 'Empowering independent thinkers and innovative leaders who champion human empathy, scientific temperament, and ethical responsibility in a dynamic global community.', // Max 180 chars
    mission_text: 'Fostering rigorous academic exploration through NEP 2020 experiential pedagogies, hands-on maker practicals, and inclusive athletic development.', // Max 180 chars
  },

  // ========================================================
  // SECTION 6: PRINCIPAL DESK & LEADERSHIP MESSAGE
  // ========================================================
  section_6_principal_desk: {
    section_name: "Principal's Desk & Leadership Message",
    principal_name: 'Dr. Sunita Sharma', // Max 40 chars
    principal_designation: 'Principal / Head of Institution', // Max 40 chars
    principal_message: 'At DPS Rewari, every student is encouraged to discover their innate curiosity and transform knowledge into meaningful real-world leadership.', // Max 250 chars
    principal_image_url: '/images/teachers/verified-teacher-avatar-placeholder.webp',
  },

  // ========================================================
  // SECTION 7: ACADEMICS, CURRICULUM & STREAMS
  // ========================================================
  section_7_academics: {
    section_name: 'Curriculum, Streams & Special Programs',
    class_range: {
      class_from: 'Class 1st', // Max 20 chars
      class_to: 'Class 12th', // Max 20 chars
    },
    curriculum_features: [
      'CBSE Affiliated Curriculum with NEP 2020 Experiential STEM Pedagogy', // Max 70 chars
      'Advanced Science, Commerce, and Humanities Streams for Senior Secondary',
      'Dedicated Olympiad, NTSE, and JEE/NEET/CUET Foundation Masterclasses',
      'Interactive Smart Boards & 3D Virtual Lab Modules in all Classrooms',
      'Continuous Remedial Mentoring with 1:15 Student-Teacher Ratio',
    ],
    streams_offered: [
      'Science (Physics, Chemistry, Mathematics, Biology, Computer Science)',
      'Commerce (Accountancy, Business Studies, Economics, Applied Mathematics)',
      'Humanities / Arts (History, Political Science, Psychology, Sociology)',
    ],
  },

  // ========================================================
  // SECTION 8: FACILITIES & INFRASTRUCTURE (From 62 Predefined List)
  // ========================================================
  section_8_facilities: {
    section_name: 'Facilities & Infrastructure',
    selected_facility_names: [
      'Smart Classes',
      'Library',
      'Physics Lab',
      'Chemistry Lab',
      'Biology Lab',
      'Robotics Lab',
      'Computer Lab',
      'Playground / Outdoor Sports',
      'CCTV Surveillance',
      'Medical Room / Clinic',
      'Art & Craft Studio',
      'Music Room',
      'Wi-Fi Campus',
    ],
  },

  // ========================================================
  // SECTION 9: CAMPUS PHOTO & VIDEO GALLERY
  // ========================================================
  section_9_campus_gallery: {
    section_name: 'Campus Photo & Video Gallery',
    gallery_items: [
      {
        id: 'gal-1',
        title: 'Central Academic Campus', // Max 35 chars
        category: 'Campus', // 'Campus' | 'Labs' | 'Sports' | 'Events'
        type: 'image',
        url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'gal-2',
        title: 'Robotics & STEM Tinkering Lab',
        category: 'Labs',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'gal-3',
        title: 'Annual Athletic Meet',
        category: 'Sports',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },

  // ========================================================
  // SECTION 10: TRANSPARENT FEE STRUCTURE
  // ========================================================
  section_10_fee_structure: {
    section_name: 'Transparent Fee Structure Table',
    fee_table: {
      columns: ['Class Level', 'Quarterly Tuition', 'Annual Fee', 'Lab & Dev Fee', 'Total Annual (Est.)'],
      rows: [
        ['Primary (Class 1 to 5)', '₹12,500', '₹5,000', '₹3,500', '₹58,500'],
        ['Middle (Class 6 to 8)', '₹15,000', '₹6,000', '₹4,000', '₹70,000'],
        ['Secondary (Class 9 & 10)', '₹18,000', '₹7,500', '₹5,000', '₹84,500'],
        ['Senior Secondary (11 & 12)', '₹21,000', '₹9,000', '₹6,500', '₹99,500'],
      ],
    },
  },

  // ========================================================
  // SECTION 11: ADMISSIONS GUIDELINES & PROCESS
  // ========================================================
  section_11_admissions_guidelines: {
    section_name: 'Admissions Guidelines & Criteria',
    session: '2026-27',
    admission_status: 'Admissions Open',
    admissions_cards: [
      {
        id: 'adm-1',
        title: 'Primary Wing Fresh Admissions', // Max 35 chars
        criteria: 'Age 6+ as of March 31st per NEP 2020. Informal interaction with child and parents.', // Max 110 chars
        badge: 'Session 2026-27 Open', // Max 22 chars
        icon: 'Baby',
        points: ['Birth Certificate verification', 'Immunization record', 'Aadhaar Card of student & parents'],
      },
      {
        id: 'adm-2',
        title: 'Middle & Senior Lateral Admissions',
        criteria: 'Aptitude assessment in English, Mathematics and Science followed by counseling.',
        badge: 'Merit Scholarships',
        icon: 'GraduationCap',
        points: ['Previous academic transcripts', 'Transfer Certificate (TC)', 'Character Certificate'],
      },
    ],
  },

  // ========================================================
  // SECTION 12: FREQUENTLY ASKED QUESTIONS (FAQS)
  // ========================================================
  section_12_faqs: {
    section_name: 'Frequently Asked Questions (FAQs)',
    faq_items: [
      {
        id: 'faq-1',
        question: 'What is the admission procedure for the school?', // Max 120 chars
        answer: 'Parents can fill the online application or visit the campus admission desk. Shortlisted applicants undergo a friendly interaction followed by document submission.', // Max 350 chars
        category: 'Admissions',
      },
      {
        id: 'faq-2',
        question: 'Does the school provide transport facilities?',
        answer: 'Yes, modern GPS-tracked, CCTV-monitored buses with female attendants ply across all major city routes.',
        category: 'Facilities',
      },
      {
        id: 'faq-3',
        question: 'Can fees be paid in quarterly installments?',
        answer: 'Yes, tuition and activity fees can be paid in four convenient quarterly installments through net banking, debit/credit cards, or at the school counter.',
        category: 'Fees',
      },
      {
        id: 'faq-4',
        question: 'What sports coaching facilities are available on campus?',
        answer: 'The school features dedicated football, basketball, cricket nets, lawn tennis, badminton, and yoga sessions coached by certified NIS trainers.',
        category: 'Sports',
      },
    ],
  },

  // ========================================================
  // SECTION 13: OFFICIAL CONTACT CHANNELS & LOCATION
  // ========================================================
  section_13_contact_details: {
    section_name: 'Official Contact Channels & Location',
    address: 'DELHI PUBLIC SCHOOL REWARI VILL JAUNAWAS PO DUNGERWAS TEH REWARI DISTT REWARI STATE HARYANA', // Max 120 chars (UDISE Locked)
    village_or_locality: 'Jonawas', // Max 40 chars
    block_name: 'Rewari', // Max 40 chars
    district: 'REWARI', // Max 40 chars
    state: 'HARYANA', // Max 40 chars
    pincode: '123401', // Max 10 chars
    rural_urban: 'Rural',
    phone: '+91 1274 250100', // Max 25 chars
    email: 'info@dpsrewari.edu.in', // Max 50 chars
    website: 'https://www.dpsrewari.edu.in', // Max 70 chars
    visiting_hours: 'Monday to Saturday: 8:30 AM - 2:30 PM',
    // 4 Dedicated Inquiry Channels
    general_inquiry_phone: '+91 1274 250100',
    general_inquiry_email: 'info@dpsrewari.edu.in',
    admissions_inquiry_phone: '+91 1274 250101',
    admissions_inquiry_email: 'admissions@dpsrewari.edu.in',
    principal_office_phone: '+91 1274 250102',
    principal_office_email: 'principal@dpsrewari.edu.in',
    careers_inquiry_phone: '+91 1274 250103',
    careers_inquiry_email: 'careers@dpsrewari.edu.in',
  },
};

/**
 * Categorized listing of all 62 Predefined Facilities to embed in AI prompts.
 */
function getPredefinedFacilitiesPromptList(): string {
  return FACILITY_CATEGORIES.map((cat) => {
    const itemNames = cat.items.map((i) => `"${i.name}"`).join(', ');
    return `• ${cat.category} (${cat.items.length} options): [${itemNames}]`;
  }).join('\n');
}

/**
 * Standard Prompt template to give to ChatGPT / Claude / Gemini / DeepSeek
 */
export function generateAiPromptForSchool(schoolNameOrDetails: string = ''): string {
  const schemaString = JSON.stringify(BLANK_AI_SCHOOL_SCHEMA, null, 2);
  const facilitiesListText = getPredefinedFacilitiesPromptList();

  return `You are a Senior School Admissions & Institutional Profile Specialist for CSEEL (India's premier experiential school directory).

TASK:
Compile a complete, highly realistic, and visually attractive School Profile JSON for the specified school.
The JSON structure maps DIRECTLY to the 6 tabs of the school profile:
1. tab_1_home: Hero Attraction Metrics for Parents (Board Results, Student-Teacher Ratio, Labs, Awards, Parent Trust), School Identity, 3D Photo Book (3 to 8 slides), Physical Statistics, About Us, Principal's Desk, Vision & Mission.
2. tab_2_academics: Class range, Curriculum features, Offered Streams.
3. tab_3_facilities: Selected facilities picked ONLY from the 62 Predefined Facilities list below.
4. tab_4_gallery: Campus photo & video media showcase items.
5. tab_5_admissions_fees: Fee structure table (rows & columns) and admission criteria guidelines.
6. tab_6_contact: Official Address, Location, Phone, Email & Website.

SCHOOL TO COMPILE:
${schoolNameOrDetails.trim() ? schoolNameOrDetails : '[PASTE SCHOOL NAME, LOCATION, WEBSITE, OR BROCHURE TEXT HERE]'}

STRICT RULES & CONSTRAINTS (MANDATORY TO AVOID BREAKING LAYOUTS):
1. Return ONLY raw, valid JSON wrapped in a \`\`\`json code block. Do NOT include any introductory or concluding conversational prose.
2. PRESERVE ALL Tab IDs and Field IDs exactly as given in the schema.
3. ⚠️ STRICT CHARACTER LENGTH LIMITS (NEVER EXCEED, otherwise UI structure breaks):
   - School Name: Max 60 characters
   - About Text: Max 300 characters
   - Vision & Mission: Max 180 characters each
   - Principal Name: Max 40 characters
   - Principal Message: Max 250 characters
   - PhotoBook Slide Title: Max 35 characters
   - PhotoBook Slide Desc: Max 90 characters
   - PhotoBook Button: Max 18 characters
   - Hero Prestige Values: Max 10 characters (e.g. "100%", "1:15", "25+", "50+", "99%")
   - Hero Prestige Labels: Max 25 characters (e.g. "Board Pass Rate", "Student-Teacher Ratio")
   - Facility / Admission titles: Max 35 characters
4. 🏢 62 PREDEFINED FACILITIES SELECTION (CRITICAL):
   For "tab_3_facilities.selected_facility_names", you MUST pick 12 to 25 items ONLY from these exact predefined facility names:
${facilitiesListText}
   Do NOT invent new facility names. The system will automatically attach the verified official icons!
5. 📊 HERO PRESTIGE vs PHYSICAL STATS:
   - "hero_prestige_metrics": Must highlight 5 key parent/student attraction metrics (Board Results, Student-Teacher Ratio, Hi-Tech Labs & Studios, Awards, Parent Trust).
   - "statistics": Contains physical scale facts (Established Year, Campus Area, Total Students, Total Teachers).
   Do NOT duplicate values between these two sections!

--- EXACT JSON BLUEPRINT TO FILL ---
${schemaString}
`;
}

export interface ImportSummary {
  schoolName: string;
  board: string;
  district: string;
  state: string;
  slidesCount: number;
  facilitiesCount: number;
  galleryCount: number;
  feeRowsCount: number;
}

/**
 * Parses user-provided JSON (either tab-based schema, old section schema, or raw export)
 * and safely transforms it into a validated SchoolTemplateState with strict length truncation.
 */
export function parseSchoolJsonToState(
  rawInput: any,
  currentState: SchoolTemplateState
): { success: boolean; state?: SchoolTemplateState; summary?: ImportSummary; error?: string } {
  try {
    let parsed: any = rawInput;
    if (typeof rawInput === 'string') {
      let cleaned = rawInput.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      parsed = JSON.parse(cleaned);
    }

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON: Expected an object at the root level.' };
    }

    const nextState: SchoolTemplateState = {
      ...currentState,
      contentOverrides: { ...(currentState.contentOverrides || {}) },
    };

    // ==========================================
    // TAB 1: HOME
    // ==========================================
    const tabHome = parsed.tab_1_home || parsed.tab_home || parsed.home || parsed;
    const basicInfo = tabHome?.school_basic_info || parsed.section_1_basic_info || parsed.basic_info || tabHome;

    if (basicInfo && typeof basicInfo === 'object') {
      if (basicInfo.school_name !== undefined) nextState.schoolName = limitLength(basicInfo.school_name, 70);
      else if (parsed.schoolName !== undefined) nextState.schoolName = limitLength(parsed.schoolName, 70);

      if (basicInfo.udise_code !== undefined) nextState.udiseCode = limitLength(basicInfo.udise_code, 15);
      else if (parsed.udiseCode !== undefined) nextState.udiseCode = limitLength(parsed.udiseCode, 15);

      if (basicInfo.board !== undefined) nextState.board = limitLength(basicInfo.board, 50);
      else if (parsed.board !== undefined) nextState.board = limitLength(parsed.board, 50);

      if (basicInfo.medium !== undefined) nextState.medium = limitLength(basicInfo.medium, 40);
      else if (parsed.medium !== undefined) nextState.medium = limitLength(parsed.medium, 40);

      if (basicInfo.principal_name !== undefined) nextState.principalName = limitLength(basicInfo.principal_name, 45);
      else if (parsed.principalName !== undefined) nextState.principalName = limitLength(parsed.principalName, 45);

      if (basicInfo.established_year !== undefined) nextState.establishedYear = limitLength(basicInfo.established_year, 12);
      else if (parsed.establishedYear !== undefined) nextState.establishedYear = limitLength(parsed.establishedYear, 12);

      if (basicInfo.campus_area !== undefined) nextState.campusArea = limitLength(basicInfo.campus_area, 25);
      else if (parsed.campusArea !== undefined) nextState.campusArea = limitLength(parsed.campusArea, 25);

      if (basicInfo.school_type !== undefined) nextState.schoolType = limitLength(basicInfo.school_type, 35);
      else if (parsed.schoolType !== undefined) nextState.schoolType = limitLength(parsed.schoolType, 35);

      if (basicInfo.management !== undefined) nextState.management = limitLength(basicInfo.management, 50);
      else if (parsed.management !== undefined) nextState.management = limitLength(parsed.management, 50);

      if (basicInfo.school_category !== undefined) nextState.schoolCategory = limitLength(basicInfo.school_category, 50);
      else if (parsed.schoolCategory !== undefined) nextState.schoolCategory = limitLength(parsed.schoolCategory, 50);

      if (basicInfo.gender_type !== undefined) nextState.genderType = limitLength(basicInfo.gender_type, 25);
      else if (parsed.genderType !== undefined) nextState.genderType = limitLength(parsed.genderType, 25);
    }

    // Hero Prestige Metrics (Attraction metrics for parents & students)
    const heroMetrics =
      tabHome?.hero_prestige_metrics ||
      tabHome?.prestige_metrics ||
      parsed.section_2_hero_prestige_metrics ||
      parsed.section_2_hero_metrics ||
      parsed.sections?.section_2_hero_prestige_metrics ||
      parsed.sections?.section_2_hero_metrics;
    if (heroMetrics && typeof heroMetrics === 'object') {
      const m1 = heroMetrics.metric_1_board_results || heroMetrics.metric_1;
      if (m1) {
        if (m1.value) nextState.contentOverrides!['hero_stat_val_1'] = limitLength(m1.value, 12);
        if (m1.label) nextState.contentOverrides!['hero_stat_lbl_1'] = limitLength(m1.label, 28);
      }
      const m2 = heroMetrics.metric_2_student_teacher_ratio || heroMetrics.metric_2;
      if (m2) {
        if (m2.value) nextState.contentOverrides!['hero_stat_val_2'] = limitLength(m2.value, 12);
        if (m2.label) nextState.contentOverrides!['hero_stat_lbl_2'] = limitLength(m2.label, 28);
      }
      const m3 = heroMetrics.metric_3_labs_studios || heroMetrics.metric_3;
      if (m3) {
        if (m3.value) nextState.contentOverrides!['hero_stat_val_3'] = limitLength(m3.value, 12);
        if (m3.label) nextState.contentOverrides!['hero_stat_lbl_3'] = limitLength(m3.label, 28);
      }
      const m4 = heroMetrics.metric_4_awards || heroMetrics.metric_4;
      if (m4) {
        if (m4.value) nextState.contentOverrides!['hero_stat_val_4'] = limitLength(m4.value, 12);
        if (m4.label) nextState.contentOverrides!['hero_stat_lbl_4'] = limitLength(m4.label, 28);
      }
      const m5 = heroMetrics.metric_5_parent_trust || heroMetrics.metric_5;
      if (m5) {
        if (m5.value) nextState.contentOverrides!['hero_stat_val_5'] = limitLength(m5.value, 12);
        if (m5.label) nextState.contentOverrides!['hero_stat_lbl_5'] = limitLength(m5.label, 28);
      }
    }

    // Branding
    const branding =
      tabHome?.branding ||
      parsed.section_1_basic_info?.branding ||
      parsed.sections?.section_1_basic_info?.branding ||
      parsed.section_4_about_vision?.branding ||
      parsed.branding ||
      tabHome;
    if (branding && typeof branding === 'object') {
      if (branding.logo_image_url !== undefined) nextState.logoImage = String(branding.logo_image_url || '').trim();
      else if (parsed.logoImage !== undefined) nextState.logoImage = String(parsed.logoImage || '').trim();

      if (branding.hero_banner_image !== undefined) nextState.heroImage = String(branding.hero_banner_image || '').trim();
      else if (parsed.heroImage !== undefined) nextState.heroImage = String(parsed.heroImage || '').trim();
    }

    // Physical Statistics (Section 4)
    const stats =
      tabHome?.statistics ||
      parsed.section_4_statistics ||
      parsed.sections?.section_4_statistics ||
      parsed.section_3_statistics ||
      parsed.key_statistics ||
      tabHome;
    if (stats && typeof stats === 'object') {
      if (stats.total_students !== undefined) nextState.totalStudents = Number(stats.total_students) || 0;
      else if (parsed.totalStudents !== undefined) nextState.totalStudents = Number(parsed.totalStudents) || 0;

      if (stats.total_boys !== undefined) nextState.totalBoys = Number(stats.total_boys) || 0;
      else if (parsed.totalBoys !== undefined) nextState.totalBoys = Number(parsed.totalBoys) || 0;

      if (stats.total_girls !== undefined) nextState.totalGirls = Number(stats.total_girls) || 0;
      else if (parsed.totalGirls !== undefined) nextState.totalGirls = Number(parsed.totalGirls) || 0;

      if (stats.total_teachers !== undefined) nextState.totalTeachers = Number(stats.total_teachers) || 0;
      else if (parsed.totalTeachers !== undefined) nextState.totalTeachers = Number(parsed.totalTeachers) || 0;

      if (stats.classrooms_count !== undefined) nextState.classroomsCount = Number(stats.classrooms_count) || 0;
      else if (parsed.classroomsCount !== undefined) nextState.classroomsCount = Number(parsed.classroomsCount) || 0;

      if (stats.working_smart_boards !== undefined) nextState.workingSmartBoards = Number(stats.working_smart_boards) || 0;
      else if (parsed.workingSmartBoards !== undefined) nextState.workingSmartBoards = Number(parsed.workingSmartBoards) || 0;

      if (stats.is_residential !== undefined) nextState.isResidential = Boolean(stats.is_residential);
      if (stats.has_hostel !== undefined) nextState.hasHostel = Boolean(stats.has_hostel);
    }

    // About, Vision & Mission (Section 5)
    const aboutObj =
      tabHome?.about_and_principles ||
      parsed.section_5_about_and_vision ||
      parsed.sections?.section_5_about_and_vision ||
      parsed.section_4_about_vision ||
      tabHome;
    if (aboutObj && typeof aboutObj === 'object') {
      if (aboutObj.about_text !== undefined) nextState.aboutText = limitLength(aboutObj.about_text, 350);
      else if (parsed.aboutText !== undefined) nextState.aboutText = limitLength(parsed.aboutText, 350);

      if (aboutObj.vision_text !== undefined) nextState.visionText = limitLength(aboutObj.vision_text, 200);
      else if (parsed.visionText !== undefined) nextState.visionText = limitLength(parsed.visionText, 200);

      if (aboutObj.mission_text !== undefined) nextState.missionText = limitLength(aboutObj.mission_text, 200);
      else if (parsed.missionText !== undefined) nextState.missionText = limitLength(parsed.missionText, 200);
    }

    // Principal's Desk (Section 6)
    const principalObj =
      tabHome?.principal_desk ||
      parsed.section_6_principal_desk ||
      parsed.sections?.section_6_principal_desk ||
      parsed.section_4_about_vision?.principal_desk ||
      tabHome;
    if (principalObj && typeof principalObj === 'object') {
      if (principalObj.principal_name) nextState.principalName = limitLength(principalObj.principal_name, 45);
      if (principalObj.principal_message) {
        nextState.contentOverrides!['principal_message'] = limitLength(principalObj.principal_message, 280);
      }
    }

    // 3D Photo Book Slides (Section 3)
    const slidesList =
      tabHome?.photobook_3d_slides ||
      tabHome?.slides ||
      parsed.section_3_photobook_slides?.slides ||
      parsed.sections?.section_3_photobook_slides?.slides ||
      parsed.section_3_photobook_slides ||
      parsed.section_5_photobook_slides?.slides ||
      parsed.flipbookSlides;
    if (Array.isArray(slidesList) && slidesList.length > 0) {
      nextState.flipbookSlides = slidesList.slice(0, 10).map((s: any, idx: number) => ({
        id: s.id || s.slide_id || `fb-${idx}`,
        title: limitLength(s.title || `Campus Highlight #${idx + 1}`, 40),
        desc: limitLength(s.desc || '', 100),
        mediaType: s.media_type === 'video' || s.mediaType === 'video' ? 'video' : 'image',
        image: String(s.image_url || s.image || '').trim(),
        videoUrl: String(s.video_url || s.videoUrl || '').trim(),
        buttonText: limitLength(s.button_text || s.buttonText || 'Explore Campus', 20),
        actionTab: String(s.action_tab || s.actionTab || 'facilities').trim(),
      }));
    }

    // ==========================================
    // SECTION 7 / TAB 2: ACADEMICS
    // ==========================================
    const tabAcademics =
      parsed.tab_2_academics ||
      parsed.tab_academics ||
      parsed.section_7_academics ||
      parsed.sections?.section_7_academics ||
      parsed.academics;
    if (tabAcademics && typeof tabAcademics === 'object') {
      const cr = tabAcademics.class_range || basicInfo;
      if (cr && typeof cr === 'object') {
        if (cr.class_from !== undefined) nextState.classFrom = limitLength(cr.class_from, 20);
        else if (cr.classFrom !== undefined) nextState.classFrom = limitLength(cr.classFrom, 20);

        if (cr.class_to !== undefined) nextState.classTo = limitLength(cr.class_to, 20);
        else if (cr.classTo !== undefined) nextState.classTo = limitLength(cr.classTo, 20);
      }

      const featList = tabAcademics.curriculum_features || tabAcademics.academic_features || parsed.includedAcademicFeatures;
      if (Array.isArray(featList) && featList.length > 0) {
        nextState.includedAcademicFeatures = featList.map((f: any) => limitLength(f, 80));
      }
    }

    // ==========================================
    // SECTION 8 / TAB 3: FACILITIES
    // ==========================================
    const tabFacilities =
      parsed.tab_3_facilities ||
      parsed.tab_facilities ||
      parsed.section_8_facilities ||
      parsed.sections?.section_8_facilities ||
      parsed.facilities ||
      parsed.section_6_facilities;
    const rawFacList =
      tabFacilities?.selected_facility_names ||
      tabFacilities?.facilities_list ||
      tabFacilities?.facilities ||
      parsed.facilities;

    if (Array.isArray(rawFacList) && rawFacList.length > 0) {
      const normalizedFacilities: FacilityCardItem[] = [];

      rawFacList.forEach((f: any, idx: number) => {
        const rawName = typeof f === 'string' ? f : f?.name || f?.title || '';
        const cleanName = rawName.toLowerCase().trim();
        const matched = PREDEFINED_FACILITY_MAP.get(cleanName);

        if (matched) {
          // Exactly matched predefined facility
          normalizedFacilities.push({
            id: typeof f === 'object' && f.id ? f.id : `fac-${idx}`,
            title: matched.name,
            desc: typeof f === 'object' && f.desc ? limitLength(f.desc, 95) : '',
            badge: typeof f === 'object' && f.badge ? limitLength(f.badge, 25) : matched.category,
            icon: matched.icon, // Verified predefined icon URL
            points: typeof f === 'object' && Array.isArray(f.points)
              ? f.points.slice(0, 3).map((p: any) => limitLength(p, 35))
              : [],
          });
        } else if (typeof f === 'object' && f.title) {
          // Fallback if not verbatim matched
          normalizedFacilities.push({
            id: f.id || `fac-${idx}`,
            title: limitLength(f.title, 40),
            desc: limitLength(f.desc || '', 95),
            badge: f.badge ? limitLength(f.badge, 25) : undefined,
            icon: f.icon || 'https://img.icons8.com/?size=128&id=12197&format=png',
            points: Array.isArray(f.points) ? f.points.slice(0, 3).map((p: any) => limitLength(p, 35)) : [],
          });
        }
      });

      if (normalizedFacilities.length > 0) {
        nextState.facilities = normalizedFacilities;
      }
    }

    // ==========================================
    // SECTION 9 / TAB 4: CAMPUS GALLERY
    // ==========================================
    const tabGallery =
      parsed.tab_4_gallery ||
      parsed.tab_gallery ||
      parsed.section_9_campus_gallery ||
      parsed.sections?.section_9_campus_gallery ||
      parsed.gallery ||
      parsed.section_11_gallery;
    const galList = tabGallery?.gallery_items || tabGallery?.media || parsed.galleryItems;
    if (Array.isArray(galList) && galList.length > 0) {
      nextState.galleryItems = galList.map((g: any, idx: number) => ({
        id: g.id || `gal-${idx}`,
        title: limitLength(g.title || `Campus Photo #${idx + 1}`, 40),
        category: limitLength(g.category || 'Campus', 20),
        type: g.type === 'video' ? 'video' : 'image',
        url: String(g.url || '').trim(),
      }));
    }

    // ==========================================
    // SECTION 10, 11, 12 / TAB 5: ADMISSIONS & FEES
    // ==========================================
    const tabAdmissions =
      parsed.tab_5_admissions_fees ||
      parsed.tab_admissions ||
      parsed.admissions ||
      parsed.section_8_admissions;

    const feeObj =
      tabAdmissions?.fee_structure_table ||
      parsed.section_10_fee_structure?.fee_table ||
      parsed.sections?.section_10_fee_structure?.fee_table ||
      parsed.section_10_fee_structure?.fee_structure_table ||
      parsed.section_10_fee_structure ||
      tabAdmissions?.fee_structure ||
      parsed.section_7_academics?.fee_structure ||
      parsed.feeTableData;
    if (feeObj && Array.isArray(feeObj.columns) && Array.isArray(feeObj.rows)) {
      nextState.feeTableData = {
        columns: feeObj.columns.map((c: any) => limitLength(c, 30)),
        rows: feeObj.rows.map((row: any) =>
          Array.isArray(row) ? row.map((cell: any) => limitLength(cell, 25)) : []
        ),
      };
    }

    const admList =
      tabAdmissions?.admissions_guidelines ||
      tabAdmissions?.admissions_cards ||
      parsed.section_11_admissions_guidelines?.admissions_cards ||
      parsed.sections?.section_11_admissions_guidelines?.admissions_cards ||
      parsed.section_11_admissions_guidelines?.admissions ||
      parsed.section_11_admissions?.admissions_cards ||
      parsed.section_11_admissions ||
      tabAdmissions?.admissions ||
      parsed.admissions;
    if (Array.isArray(admList) && admList.length > 0) {
      nextState.admissions = admList.map((a: any, idx: number) => ({
        id: a.id || `adm-${idx}`,
        title: limitLength(a.title || `Admission Track #${idx + 1}`, 40),
        criteria: limitLength(a.criteria || '', 120),
        badge: a.badge ? limitLength(a.badge, 25) : undefined,
        icon: String(a.icon || 'GraduationCap').trim(),
        points: Array.isArray(a.points) ? a.points.slice(0, 3).map((p: any) => limitLength(p, 35)) : [],
      }));
    }

    const faqList =
      tabAdmissions?.faq_items ||
      tabAdmissions?.faqs ||
      parsed.section_12_faqs?.faq_items ||
      parsed.sections?.section_12_faqs?.faq_items ||
      parsed.section_12_faqs ||
      parsed.faqs ||
      parsed.faq_items;
    if (Array.isArray(faqList) && faqList.length > 0) {
      nextState.faqs = faqList.map((f: any, idx: number) => ({
        id: f.id || `faq-${idx + 1}`,
        q: limitLength(f.q || f.question || `Frequently Asked Question #${idx + 1}`, 120),
        a: limitLength(f.a || f.answer || '', 350),
        category: limitLength(f.category || 'Admissions', 25),
      }));
    }

    // ==========================================
    // SECTION 13 / TAB 6: CONTACT US
    // ==========================================
    const tabContact =
      parsed.tab_6_contact ||
      parsed.tab_contact ||
      parsed.section_13_contact_details ||
      parsed.sections?.section_13_contact_details ||
      parsed.section_13_contact ||
      parsed.contact ||
      parsed.section_2_location_contact ||
      parsed;
    if (tabContact && typeof tabContact === 'object') {
      if (tabContact.address !== undefined) nextState.address = limitLength(tabContact.address, 120);
      else if (parsed.address !== undefined) nextState.address = limitLength(parsed.address, 120);

      if (tabContact.village_or_locality !== undefined) nextState.village = limitLength(tabContact.village_or_locality, 40);
      else if (tabContact.village !== undefined) nextState.village = limitLength(tabContact.village, 40);
      else if (parsed.village !== undefined) nextState.village = limitLength(parsed.village, 40);

      if (tabContact.block_name !== undefined) nextState.blockName = limitLength(tabContact.block_name, 40);
      else if (tabContact.blockName !== undefined) nextState.blockName = limitLength(tabContact.blockName, 40);
      else if (parsed.blockName !== undefined) nextState.blockName = limitLength(parsed.blockName, 40);

      if (tabContact.district !== undefined) nextState.district = limitLength(tabContact.district, 40);
      else if (parsed.district !== undefined) nextState.district = limitLength(parsed.district, 40);

      if (tabContact.state !== undefined) nextState.state = limitLength(tabContact.state, 40);
      else if (parsed.state !== undefined) nextState.state = limitLength(parsed.state, 40);

      if (tabContact.pincode !== undefined) nextState.pincode = limitLength(tabContact.pincode, 10);
      else if (parsed.pincode !== undefined) nextState.pincode = limitLength(parsed.pincode, 10);

      if (tabContact.rural_urban !== undefined) nextState.ruralUrban = limitLength(tabContact.rural_urban, 15);
      else if (parsed.ruralUrban !== undefined) nextState.ruralUrban = limitLength(parsed.ruralUrban, 15);

      if (tabContact.phone !== undefined) nextState.phone = limitLength(tabContact.phone, 30);
      else if (parsed.phone !== undefined) nextState.phone = limitLength(parsed.phone, 30);

      if (tabContact.email !== undefined) nextState.email = limitLength(tabContact.email, 50);
      else if (parsed.email !== undefined) nextState.email = limitLength(parsed.email, 50);

      if (tabContact.website !== undefined) nextState.website = limitLength(tabContact.website, 70);
      else if (parsed.website !== undefined) nextState.website = limitLength(parsed.website, 70);

      // 4 Dedicated Inquiry Channels
      const gPhone = tabContact.general_inquiry_phone ?? tabContact.generalPhone ?? parsed.generalPhone;
      if (gPhone !== undefined) nextState.generalPhone = limitLength(gPhone, 30);
      const gEmail = tabContact.general_inquiry_email ?? tabContact.generalEmail ?? parsed.generalEmail;
      if (gEmail !== undefined) nextState.generalEmail = limitLength(gEmail, 50);

      const aPhone = tabContact.admissions_inquiry_phone ?? tabContact.admissionsPhone ?? parsed.admissionsPhone;
      if (aPhone !== undefined) nextState.admissionsPhone = limitLength(aPhone, 30);
      const aEmail = tabContact.admissions_inquiry_email ?? tabContact.admissionsEmail ?? parsed.admissionsEmail;
      if (aEmail !== undefined) nextState.admissionsEmail = limitLength(aEmail, 50);

      const pPhone = tabContact.principal_office_phone ?? tabContact.principalPhone ?? parsed.principalPhone;
      if (pPhone !== undefined) nextState.principalPhone = limitLength(pPhone, 30);
      const pEmail = tabContact.principal_office_email ?? tabContact.principalEmail ?? parsed.principalEmail;
      if (pEmail !== undefined) nextState.principalEmail = limitLength(pEmail, 50);

      const cPhone = tabContact.careers_inquiry_phone ?? tabContact.careersPhone ?? parsed.careersPhone;
      if (cPhone !== undefined) nextState.careersPhone = limitLength(cPhone, 30);
      const cEmail = tabContact.careers_inquiry_email ?? tabContact.careersEmail ?? parsed.careersEmail;
      if (cEmail !== undefined) nextState.careersEmail = limitLength(cEmail, 50);
    }

    const summary: ImportSummary = {
      schoolName: nextState.schoolName || 'Unnamed School',
      board: nextState.board || 'Not Specified',
      district: nextState.district || 'Not Specified',
      state: nextState.state || 'Not Specified',
      slidesCount: nextState.flipbookSlides?.length || 0,
      facilitiesCount: nextState.facilities?.length || 0,
      galleryCount: nextState.galleryItems?.length || 0,
      feeRowsCount: nextState.feeTableData?.rows?.length || 0,
    };

    return { success: true, state: nextState, summary };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to parse JSON file' };
  }
}

/**
 * Converts current state to clean structured export JSON matching the exact School Profile tabs.
 */
export function convertStateToStructuredJson(data: SchoolTemplateState): any {
  return {
    $schema_version: '2.5',
    export_metadata: {
      generated_at: new Date().toISOString(),
      school_name: data.schoolName,
      udise_code: data.udiseCode,
      platform: 'CSEEL Interactive School Directory',
    },
    tab_1_home: {
      tab_id: 'home',
      tab_title: 'Home',
      hero_prestige_metrics: {
        metric_1_board_results: {
          value: data.contentOverrides?.['hero_stat_val_1'] || '100%',
          label: data.contentOverrides?.['hero_stat_lbl_1'] || 'Board Pass Rate',
        },
        metric_2_student_teacher_ratio: {
          value: data.contentOverrides?.['hero_stat_val_2'] || '1:15',
          label: data.contentOverrides?.['hero_stat_lbl_2'] || 'Student-Teacher Ratio',
        },
        metric_3_labs_studios: {
          value: data.contentOverrides?.['hero_stat_val_3'] || '25+',
          label: data.contentOverrides?.['hero_stat_lbl_3'] || 'Hi-Tech Labs & Studios',
        },
        metric_4_awards: {
          value: data.contentOverrides?.['hero_stat_val_4'] || '50+',
          label: data.contentOverrides?.['hero_stat_lbl_4'] || 'Awards & Honors',
        },
        metric_5_parent_trust: {
          value: data.contentOverrides?.['hero_stat_val_5'] || '99%',
          label: data.contentOverrides?.['hero_stat_lbl_5'] || 'Parent Trust Rating',
        },
      },
      school_basic_info: {
        school_name: data.schoolName,
        udise_code: data.udiseCode,
        board: data.board,
        medium: data.medium,
        established_year: data.establishedYear,
        campus_area: data.campusArea,
        school_type: data.schoolType,
        management: data.management,
        school_category: data.schoolCategory,
        gender_type: data.genderType,
      },
      branding: {
        logo_image_url: data.logoImage,
        hero_banner_image: data.heroImage,
      },
      statistics: {
        total_students: data.totalStudents,
        total_boys: data.totalBoys,
        total_girls: data.totalGirls,
        total_teachers: data.totalTeachers,
        classrooms_count: data.classroomsCount,
        working_smart_boards: data.workingSmartBoards,
        is_residential: data.isResidential,
        has_hostel: data.hasHostel,
      },
      about_and_principles: {
        about_text: data.aboutText,
        vision_text: data.visionText,
        mission_text: data.missionText,
      },
      principal_desk: {
        principal_name: data.principalName,
        principal_designation: 'Principal / Head of Institution',
      },
      photobook_3d_slides: (data.flipbookSlides || []).map((s) => ({
        slide_id: s.id,
        title: s.title,
        desc: s.desc,
        media_type: s.mediaType || 'image',
        image_url: s.image,
        video_url: s.videoUrl || '',
        button_text: s.buttonText || '',
        action_tab: s.actionTab || '',
      })),
    },
    tab_2_academics: {
      tab_id: 'academics',
      tab_title: 'Academics',
      class_range: {
        class_from: data.classFrom,
        class_to: data.classTo,
      },
      curriculum_features: data.includedAcademicFeatures,
    },
    tab_3_facilities: {
      tab_id: 'facilities',
      tab_title: 'Facilities',
      selected_facility_names: (data.facilities || []).map((f) => f.title),
    },
    tab_4_gallery: {
      tab_id: 'gallery',
      tab_title: 'Campus Gallery',
      gallery_items: data.galleryItems,
    },
    tab_5_admissions_fees: {
      tab_id: 'admissions',
      tab_title: 'Admissions & Fees',
      fee_structure_table: data.feeTableData,
      admissions_guidelines: data.admissions,
      faq_items: (data.faqs || []).map((f) => ({
        id: f.id,
        question: f.q,
        answer: f.a,
        category: f.category || 'Admissions',
      })),
    },
    tab_6_contact: {
      tab_id: 'contact',
      tab_title: 'Contact Us',
      address: data.address,
      village_or_locality: data.village,
      block_name: data.blockName,
      district: data.district,
      state: data.state,
      pincode: data.pincode,
      rural_urban: data.ruralUrban,
      phone: data.phone,
      email: data.email,
      website: data.website,
    },
  };
}
