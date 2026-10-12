import { NextRequest, NextResponse } from 'next/server';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import {
  SECTION_METADATA,
  resolveSectionId,
  readSyncStore,
  findSchoolTokenRecord,
  fetchBaseSchoolRow,
  extractSectionsFromData,
  applySectionMutation,
  ensureSchoolInDbAndStore,
} from '@/lib/schools/schoolSectionsManager';
import {
  checkRateLimitAndBots,
  sanitizePayloadDeep,
  verifySchoolWriteAuth,
} from '@/lib/security/apiSecurityGuard';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-sync-token, x-api-key, x-admin-key, x-magic-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

interface RouteContext {
  params: Promise<{
    udiseCode: string;
    sectionId: string;
  }>;
}

/**
 * GET /api/school-section/[udiseCode]/[sectionId]
 * Read a single section of a school
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_section_read',
    maxRequestsPerMinute: 90,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  try {
    const { udiseCode: rawUdise, sectionId: rawSection } = await context.params;
    const cleanUdise = (rawUdise || '').trim();
    const sectionId = resolveSectionId(rawSection);

    if (!sectionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_SECTION_ID',
          message: `Unknown section "${rawSection}". Available sections: ${Object.keys(SECTION_METADATA).join(', ')}`,
          availableSections: Object.keys(SECTION_METADATA),
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    let baseRow = await fetchBaseSchoolRow(cleanUdise);
    let store = readSyncStore();
    let tokenMatch = findSchoolTokenRecord(cleanUdise, store);

    if (!baseRow && !tokenMatch) {
      if (cleanUdise.length >= 8) {
        baseRow = await ensureSchoolInDbAndStore(cleanUdise);
        store = readSyncStore();
        tokenMatch = findSchoolTokenRecord(cleanUdise, store);
      }
    }

    if (!baseRow && !tokenMatch) {
      return NextResponse.json(
        {
          success: false,
          error: 'SCHOOL_NOT_FOUND',
          message: `No school found for UDISE code "${cleanUdise}".`,
        },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // 1. Check dedicated section column AND profile_data in Supabase school_profiles
    let dedicatedColumnData: any = null;
    let supabaseProfileData: Record<string, any> = {};
    try {
      const { data: colRow } = await schoolSearchSupabase
        .from('school_profiles')
        .select(`${sectionId}, profile_data`)
        .eq('udise_code', cleanUdise)
        .maybeSingle();

      if (colRow) {
        if ((colRow as any)[sectionId] && Object.keys((colRow as any)[sectionId]).length > 0) {
          dedicatedColumnData = (colRow as any)[sectionId];
        }
        if ((colRow as any).profile_data) {
          supabaseProfileData =
            typeof (colRow as any).profile_data === 'string'
              ? JSON.parse((colRow as any).profile_data)
              : (colRow as any).profile_data;
        }
      }
    } catch {}

    const mergedProfileData = {
      ...(tokenMatch?.record?.profileData || {}),
      ...supabaseProfileData,
    };

    const sections = extractSectionsFromData(baseRow, mergedProfileData);
    const sectionData = dedicatedColumnData
      ? { ...sections[sectionId], ...dedicatedColumnData }
      : sections[sectionId];
    const meta = SECTION_METADATA[sectionId];

    const schoolNameResolved = baseRow?.school_name || tokenMatch?.record?.schoolName || sectionData?.school_name || '';
    const fullAddressResolved = baseRow?.address || tokenMatch?.record?.profileData?.address || '';
    const pincodeResolved = baseRow?.pincode || tokenMatch?.record?.profileData?.pincode || '';
    const districtResolved = baseRow?.district_name || tokenMatch?.record?.profileData?.district || '';
    const stateResolved = baseRow?.state_name || tokenMatch?.record?.profileData?.state || '';
    const localityResolved = baseRow?.village_name || baseRow?.village || baseRow?.block_name || '';
    const latResolved = String(baseRow?.latitude || baseRow?.lat || '');
    const lngResolved = String(baseRow?.longitude || baseRow?.lng || '');

    const schoolIdentityContext = {
      udise_code: cleanUdise,
      school_name: schoolNameResolved,
      full_local_address: fullAddressResolved,
      locality: localityResolved,
      district: districtResolved,
      state: stateResolved,
      pincode: pincodeResolved,
      latitude: latResolved,
      longitude: lngResolved,
    };

    const aiSystemPrompt = {
      role: 'Elite Institutional Data Research & Verification Specialist',
      strict_authenticity_rule:
        "CRITICAL: All 'dummy_example_do_not_copy' values are formatting placeholders ONLY. NEVER copy, guess, or fabricate any data.",
      allowed_trusted_sources: [
        '1. UDISE+ Know Your School Government Portal (kys.udiseplus.gov.in)',
        '2. CBSE SARAS (saras.cbse.gov.in) / CISCE / State Directorate of Education Official Records',
        '3. Official School Website & Mandatory Public Disclosure (MPD) PDF',
        `4. Verified Google Maps Listing (at ${fullAddressResolved || schoolNameResolved}, ${pincodeResolved}) & Official School Social Media (Facebook, Instagram, YouTube)`,
      ],
      missing_data_policy:
        'If a field cannot be verified with 100% certainty from the above official sources, leave "value" as "" (empty string). Never invent codes, zones, or URLs.',
      how_to_update:
        'Update ONLY the "value" key inside each field below and return the complete JSON via POST or PATCH.',
    };

    if (sectionId === 'basic_info') {
      return NextResponse.json(
        {
          udise_code: cleanUdise,
          school_name: schoolNameResolved,
          school_identity_context: schoolIdentityContext,
          section_id: 'basic_info',
          section_title: meta.name,
          ai_system_prompt: aiSystemPrompt,
          fields: {
            school_name: {
              value: sectionData?.school_name || schoolNameResolved || '',
              type: 'text',
              max_length: 80,
              required: true,
              where_it_shows: 'Top Header Title, Hero Main Heading & Browser SEO Title',
              ai_guide: 'Enter the exact official registered name of the school as recorded in UDISE+ or Board records.',
              dummy_example_do_not_copy: 'Sample International School',
            },
            board: {
              value: sectionData?.board || '',
              type: 'text',
              max_length: 50,
              required: true,
              allowed_options: ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'NIOS'],
              where_it_shows: 'Hero Top Badge & Quick Profile Table',
              ai_guide:
                "Verify from UDISE+ or CBSE SARAS. Note: In UDISE+, Primary/Upper Primary schools (Class 1-8) often show 'NA' for Class 10/12 Board because board exams start in Class 10; for such recognized schools, specify their governing state authority (e.g., 'State Board' or 'DoE Delhi') or 'CBSE' only if officially affiliated.",
              dummy_example_do_not_copy: 'CBSE',
            },
            medium: {
              value: sectionData?.medium || '',
              type: 'text',
              max_length: 40,
              where_it_shows: 'Quick Info Strip & Academic Overview',
              ai_guide: 'Primary language(s) of classroom instruction verified from UDISE+.',
              dummy_example_do_not_copy: 'English & Hindi',
            },
            established_year: {
              value: sectionData?.established_year || '',
              type: 'text',
              max_length: 10,
              where_it_shows: 'Hero Subtitle & Quick Profile Table',
              ai_guide: '4-digit establishment year verified from UDISE+ or official school records. Leave "" if not verifiable.',
              dummy_example_do_not_copy: '1995',
            },
            campus_area: {
              value: sectionData?.campus_area || '',
              type: 'text',
              max_length: 50,
              where_it_shows: 'Quick Institutional Info Card',
              ai_guide:
                'Exact campus land area in Acres or Sq. Meters from CBSE SARAS / Mandatory Public Disclosure. If not publicly disclosed in official records, leave empty ("").',
              dummy_example_do_not_copy: '2.5 Acres (or 10117 Sq. Metres)',
            },
            school_type: {
              value: sectionData?.school_type || '',
              type: 'text',
              max_length: 50,
              where_it_shows: 'Important Information Table & Hero Stats',
              ai_guide:
                "Official management ownership category from UDISE+ (e.g., 'Private Unaided (Recognized)', 'Government', 'Govt. Aided').",
              dummy_example_do_not_copy: 'Private Unaided (Recognized)',
            },
            school_category: {
              value: sectionData?.school_category || '',
              type: 'text',
              max_length: 60,
              where_it_shows: 'Important Information Table & Academic Card',
              ai_guide:
                "Official UDISE+ school category with lowest and highest class (e.g. 'Primary with Upper Primary (Class 1 to 8)').",
              dummy_example_do_not_copy: 'Senior Secondary (Class 1 to 12)',
            },
            gender_type: {
              value: sectionData?.gender_type || 'Co-Educational',
              type: 'select',
              allowed_values: ['Co-Educational', 'Boys', 'Girls'],
              where_it_shows: 'Hero Badge & Quick Profile Table',
              ai_guide: 'Select strictly one of the allowed_values based on UDISE+ gender classification.',
            },
            affiliation_number: {
              value: sectionData?.affiliation_number || '',
              type: 'text',
              max_length: 30,
              where_it_shows: 'Top Verification Strip & Important Info Section',
              ai_guide:
                "Enter ONLY the official CBSE/ICSE Affiliation Number or official DoE School ID (7-digit numeric ID). Do NOT enter administrative Zone numbers (like 'Zone-03') or UDISE code here. If the school is a Class 1-8 school without a board affiliation number or it is not publicly verifiable, strictly leave as \"\".",
              dummy_example_do_not_copy: '2730000',
            },
            logo_image_url: {
              value: sectionData?.logo_image_url || sectionData?.branding?.logo_image_url || '',
              type: 'image_url',
              max_length: 500,
              where_it_shows: 'Top Navigation Bar & Hero School Crest',
              ai_guide:
                'Direct publicly accessible image URL (https://...) of the official school logo from the school website or official Facebook/Instagram page. Leave "" if no official logo is found.',
            },
            hero_banner_image: {
              value: sectionData?.hero_banner_image || sectionData?.branding?.hero_banner_image || '',
              type: 'image_url',
              max_length: 500,
              where_it_shows: 'Full-width Hero Background Banner & Directory Card Thumbnail',
              ai_guide:
                'Direct publicly accessible image URL (https://...) of the real school building/campus from the official website, verified Google Maps listing, or official social media. Never use stock photos. Leave "" if no real photo is found.',
            },
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    if (sectionId === 'hero') {
      return NextResponse.json(
        {
          udise_code: cleanUdise,
          school_name: schoolNameResolved,
          school_identity_context: schoolIdentityContext,
          section_id: 'hero',
          section_title: meta.name,
          ai_system_prompt: aiSystemPrompt,
          fields: {
            heading_line1: {
              value: sectionData?.heading_line1 || 'Play, Learn and',
              type: 'text',
              max_length: 45,
              required: true,
              where_it_shows: 'Hero Left Main Heading Line 1 (Dark Slate Text)',
              ai_guide:
                "First line of the school's hero headline or official motto (3 to 5 words). If the school has an official motto/vision phrase on its website, adapt the first half here; otherwise craft a dignified academic headline first line.",
              dummy_example_do_not_copy: 'Play, Learn and',
            },
            heading_line2: {
              value: sectionData?.heading_line2 || 'Grow, Together..',
              type: 'text',
              max_length: 45,
              required: true,
              where_it_shows: 'Hero Left Main Heading Line 2 (Highlighted Brand Blue #005689)',
              ai_guide:
                "Second highlighted line of the school's hero headline or official motto (3 to 5 words) that completes heading_line1.",
              dummy_example_do_not_copy: 'Grow, Together..',
            },
            tagline: {
              value: sectionData?.tagline || '',
              type: 'text',
              max_length: 90,
              where_it_shows: 'Hero Eyebrow Motto / Institutional Tagline',
              ai_guide:
                "Official school motto or crest slogan verified from the school website/emblem (e.g., 'Global Perspective, Indian Values' or 'Knowledge is Light'). Leave \"\" if not verifiable.",
              dummy_example_do_not_copy: 'Excellence in Education & Holistic Development',
            },
            description: {
              value: sectionData?.description || '',
              type: 'textarea',
              max_length: 350,
              required: true,
              where_it_shows: 'Hero Left Introductory Paragraph below Main Heading',
              ai_guide:
                'Write a factual, authentic 2-sentence introduction (150 to 320 chars) specifically for this school mentioning its official name, locality/area, board affiliation, establishment heritage, and academic focus. Never copy dummy text.',
              dummy_example_do_not_copy:
                'Empowering young minds through experiential inquiry, modern STEM laboratories, foundational values, and holistic character building.',
            },
            boarding_status: {
              value: sectionData?.boarding_status || 'Day School',
              type: 'select',
              allowed_values: ['Day School', 'Residential School', 'Day Boarding'],
              where_it_shows: 'Hero Top Pill Badge (Blue Pill)',
              ai_guide:
                "Select strictly from allowed_values based on UDISE+ residential classification ('Day School', 'Residential School', or 'Day Boarding').",
            },
            admissions_open: {
              value: sectionData?.admissions_open ?? true,
              type: 'boolean',
              where_it_shows: 'Hero Admission Status & Enroll Action Trigger',
              ai_guide: 'Boolean true if the school is operational and accepting admission inquiries.',
            },
            helpline_phone: {
              value: sectionData?.helpline_phone || '',
              type: 'text',
              max_length: 20,
              where_it_shows: 'Hero Top Right Quick Call Helpline Link',
              ai_guide:
                'Verified official landline or reception mobile phone number of the school from CBSE SARAS, official website, or verified Google Maps listing (e.g., "011-22750041"). Leave "" if not 100% verified.',
              dummy_example_do_not_copy: '011-23456789',
            },
            cta_enroll_text: {
              value: sectionData?.cta_enroll_text || 'Enroll Now',
              type: 'text',
              max_length: 25,
              where_it_shows: 'Hero Primary Filled Action Pill Button',
              ai_guide: 'Short call-to-action button label (e.g., "Enroll Now" or "Apply for Admission").',
              dummy_example_do_not_copy: 'Enroll Now',
            },
            cta_video_text: {
              value: sectionData?.cta_video_text || 'Watch Video',
              type: 'text',
              max_length: 25,
              where_it_shows: 'Hero Secondary Outlined Action Pill Button',
              ai_guide: 'Short secondary button label (e.g., "Watch Video" or "Campus Tour").',
              dummy_example_do_not_copy: 'Watch Video',
            },
            hero_media_items: {
              value: Array.isArray(sectionData?.hero_media_items) ? sectionData.hero_media_items : [],
              type: 'media_array',
              max_items: 5,
              allowed_media_types: ['image', 'video', 'gif'],
              where_it_shows: 'Hero Right Iconic Circular Media Frame Carousel (Max 5 Items)',
              ai_guide:
                'Array of up to 5 verified real campus photos or official YouTube tour videos from the school website/portal. Each item must have: {"id": "media-1", "type": "image"|"video", "url": "https://...", "title": "..."}. Never use stock/default URLs.',
              dummy_example_do_not_copy: [
                {
                  id: 'media-1',
                  type: 'image',
                  url: 'https://example.com/real-campus-building.jpg',
                  title: 'School Main Building',
                },
              ],
            },
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    const ALL_SECTION_SCHEMAS: Record<string, Record<string, any>> = {
      stats: {
        total_students: {
          value: Number(sectionData?.total_students) || 0,
          type: 'number',
          where_it_shows: 'Quick Stats Bar & Physical Campus Statistics Card',
          ai_guide: 'Total student enrollment count verified from UDISE+ or Mandatory Public Disclosure. Keep 0 if not publicly disclosed.',
          dummy_example_do_not_copy: 1200,
        },
        total_boys: {
          value: Number(sectionData?.total_boys) || 0,
          type: 'number',
          where_it_shows: 'Student Gender Breakdown Bar',
          ai_guide: 'Total male students enrolled from UDISE+. Keep 0 if not publicly disclosed.',
          dummy_example_do_not_copy: 650,
        },
        total_girls: {
          value: Number(sectionData?.total_girls) || 0,
          type: 'number',
          where_it_shows: 'Student Gender Breakdown Bar',
          ai_guide: 'Total female students enrolled from UDISE+. Keep 0 if not publicly disclosed.',
          dummy_example_do_not_copy: 550,
        },
        total_teachers: {
          value: Number(sectionData?.total_teachers) || 0,
          type: 'number',
          where_it_shows: 'Quick Stats Bar & Faculty Strength Card',
          ai_guide: 'Total teaching faculty count verified from UDISE+ or CBSE SARAS / MPD. Keep 0 if not publicly disclosed.',
          dummy_example_do_not_copy: 55,
        },
        male_teachers: {
          value: Number(sectionData?.male_teachers) || 0,
          type: 'number',
          where_it_shows: 'Faculty Breakdown Card',
          ai_guide: 'Male teaching staff count from UDISE+. Keep 0 if not publicly disclosed.',
          dummy_example_do_not_copy: 15,
        },
        female_teachers: {
          value: Number(sectionData?.female_teachers) || 0,
          type: 'number',
          where_it_shows: 'Faculty Breakdown Card',
          ai_guide: 'Female teaching staff count from UDISE+. Keep 0 if not publicly disclosed.',
          dummy_example_do_not_copy: 40,
        },
        classrooms_count: {
          value: Number(sectionData?.classrooms_count) || 0,
          type: 'number',
          where_it_shows: 'Quick Stats Bar & Campus Infrastructure Card',
          ai_guide: 'Total instructional classrooms count from UDISE+ or CBSE SARAS / MPD. Keep 0 if not verifiable.',
          dummy_example_do_not_copy: 40,
        },
        working_smart_boards: {
          value: Number(sectionData?.working_smart_boards) || 0,
          type: 'number',
          where_it_shows: 'Digital Infrastructure Stat Card',
          ai_guide: 'Number of digital/smart classrooms from UDISE+ or MPD. Keep 0 if not verifiable.',
          dummy_example_do_not_copy: 25,
        },
        student_teacher_ratio: {
          value: sectionData?.student_teacher_ratio || '',
          type: 'text',
          max_length: 15,
          where_it_shows: 'Quick Stats Strip & Academic Quality Card',
          ai_guide: 'Student-Teacher Ratio (e.g., "1:22") calculated from total_students / total_teachers or CBSE norms.',
          dummy_example_do_not_copy: '1:25',
        },
        campus_area: {
          value: sectionData?.campus_area || '',
          type: 'text',
          max_length: 50,
          where_it_shows: 'Campus Infrastructure Overview Card',
          ai_guide: 'Exact campus land area in Acres / Sq. Metres from CBSE SARAS or MPD. Leave "" if not publicly disclosed.',
          dummy_example_do_not_copy: '2 Acres (8093 Sq. Metres)',
        },
        board: {
          value: sectionData?.board || '',
          type: 'text',
          max_length: 50,
          where_it_shows: 'Indicator Pill 1 (Affiliated Board)',
          ai_guide: 'Official board affiliation (e.g., "CBSE" or "State Board (DoE Delhi)").',
          dummy_example_do_not_copy: 'CBSE',
        },
        school_nature: {
          value: sectionData?.school_nature || 'Day School',
          type: 'select',
          allowed_values: ['Day School', 'Residential School', 'Day Boarding'],
          where_it_shows: 'Indicator Pill 2 (School Format)',
          ai_guide: 'Select from allowed_values based on UDISE+ residential status.',
        },
        management_type: {
          value: sectionData?.management_type || 'Private Unaided (Recognized)',
          type: 'text',
          max_length: 50,
          where_it_shows: 'Indicator Pill 3 (Management Type)',
          ai_guide: 'Official UDISE+ management category (e.g. "Private Unaided (Recognized)").',
          dummy_example_do_not_copy: 'Private Unaided (Recognized)',
        },
        medium: {
          value: sectionData?.medium || 'English',
          type: 'text',
          max_length: 40,
          where_it_shows: 'Indicator Pill 4 (Medium of Instruction)',
          ai_guide: 'Primary language of classroom instruction.',
          dummy_example_do_not_copy: 'English',
        },
        gender_type: {
          value: sectionData?.gender_type || 'Co-Educational',
          type: 'select',
          allowed_values: ['Co-Educational', 'Boys', 'Girls'],
          where_it_shows: 'Indicator Pill 5 (Student Gender Type)',
          ai_guide: 'Select strictly from allowed_values.',
        },
      },

      about: {
        about_eyebrow: {
          value: sectionData?.about_eyebrow || 'ABOUT OUR INSTITUTION',
          type: 'text',
          max_length: 35,
          where_it_shows: 'About Section Top Eyebrow Badge',
          ai_guide: 'Short uppercase eyebrow badge text.',
          dummy_example_do_not_copy: 'ABOUT OUR INSTITUTION',
        },
        about_heading_l1: {
          value: sectionData?.about_heading_l1 || 'A Legacy of',
          type: 'text',
          max_length: 35,
          where_it_shows: 'About Section Main Heading Line 1',
          ai_guide: 'First line of the About section heading (3-4 words).',
          dummy_example_do_not_copy: 'More Than Just',
        },
        about_heading_l2: {
          value: sectionData?.about_heading_l2 || 'Academic Excellence',
          type: 'text',
          max_length: 35,
          where_it_shows: 'About Section Main Heading Line 2 (Highlighted)',
          ai_guide: 'Second line of the About section heading (3-4 words).',
          dummy_example_do_not_copy: 'An Education..',
        },
        about_text: {
          value: sectionData?.about_text || '',
          type: 'textarea',
          max_length: 1200,
          required: true,
          where_it_shows: 'About Tab Main Institutional Narrative',
          ai_guide: 'Comprehensive, factual 3-to-4 sentence institutional overview (300 to 900 chars) describing this specific school, its establishment year, exact locality in Delhi, board affiliation, grade levels, and educational philosophy.',
          dummy_example_do_not_copy: 'Sample School is committed to fostering academic brilliance and moral integrity.',
        },
        vision_text: {
          value: sectionData?.vision_text || '',
          type: 'textarea',
          max_length: 400,
          required: true,
          where_it_shows: 'Institutional Vision Card in About Section',
          ai_guide: 'Official school vision statement from the school website (or a faithful institutional vision statement aligned with the school motto, max 350 chars).',
          dummy_example_do_not_copy: 'To nurture independent and visionary leaders through holistic learning.',
        },
        mission_text: {
          value: sectionData?.mission_text || '',
          type: 'textarea',
          max_length: 400,
          required: true,
          where_it_shows: 'Institutional Mission Card in About Section',
          ai_guide: 'Official school mission statement from the school website (or a faithful institutional mission statement aligned with the school pedagogy, max 350 chars).',
          dummy_example_do_not_copy: 'To deliver rigorous academic education and cultivate critical thinking.',
        },
        about_badge_text: {
          value: sectionData?.about_badge_text || 'Recognized Institution',
          type: 'text',
          max_length: 30,
          where_it_shows: 'Floating Badge on About Campus Photo',
          ai_guide: 'Short 2-3 word badge text (e.g., "Since 1988 • CBSE" or "DoE Recognized").',
          dummy_example_do_not_copy: 'Excellence in Action',
        },
        about_campus_photo: {
          value: sectionData?.about_campus_photo && !sectionData.about_campus_photo.includes('/images/categories/') ? sectionData.about_campus_photo : '',
          type: 'image_url',
          max_length: 500,
          where_it_shows: 'About Section Arched Campus Architecture Frame',
          ai_guide: 'Verified live image URL (https://...) of the real school campus/building. Leave "" if no real photo exists.',
        },
        heritage_years: {
          value: sectionData?.heritage_years || '',
          type: 'text',
          max_length: 30,
          where_it_shows: 'Heritage Legacy Counter Badge',
          ai_guide: 'Calculated years of legacy from established_year to 2026 (e.g., "38+ Years of Legacy").',
          dummy_example_do_not_copy: '25+ Years Legacy',
        },
      },

      principal: {
        principal_name: {
          value: sectionData?.principal_name && sectionData.principal_name !== 'Principal / Headmaster' ? sectionData.principal_name : '',
          type: 'text',
          max_length: 60,
          where_it_shows: "Principal's Desk Profile Card & Quick Info Table",
          ai_guide: 'Exact full name of the current Principal / Head of School verified from CBSE SARAS, MPD PDF, or official school website (e.g., "Mr. Sanjay Sharma"). Leave "" if not 100% verifiable.',
          dummy_example_do_not_copy: 'Dr. Rajesh Kumar',
        },
        principal_designation: {
          value: sectionData?.principal_designation || 'Principal & Head of School',
          type: 'text',
          max_length: 50,
          where_it_shows: "Principal's Desk Subtitle Badge",
          ai_guide: 'Official designation (e.g., "Principal" or "Head of School").',
          dummy_example_do_not_copy: 'Principal & Head of School',
        },
        principal_quote: {
          value: sectionData?.principal_quote || '',
          type: 'textarea',
          max_length: 250,
          where_it_shows: "Principal's Highlighted Pull-Quote Block",
          ai_guide: "Inspirational academic leadership quote from the Principal's desk on the school website (max 240 chars).",
          dummy_example_do_not_copy: 'Education is the kindling of a flame, not the filling of a vessel.',
        },
        principal_body_1: {
          value: sectionData?.principal_body_1 || '',
          type: 'textarea',
          max_length: 600,
          where_it_shows: "Principal's Message Paragraph 1",
          ai_guide: "First paragraph of the Principal's message tailored to this school's academic ethos and student growth.",
          dummy_example_do_not_copy: 'Welcome to our school community.',
        },
        principal_body_2: {
          value: sectionData?.principal_body_2 || '',
          type: 'textarea',
          max_length: 600,
          where_it_shows: "Principal's Message Paragraph 2",
          ai_guide: "Second paragraph of the Principal's message focusing on parent-school partnership and future readiness.",
          dummy_example_do_not_copy: 'Together we shape compassionate leaders.',
        },
        principal_image_url: {
          value: sectionData?.principal_image_url && !sectionData.principal_image_url.includes('placeholder') ? sectionData.principal_image_url : '',
          type: 'image_url',
          max_length: 500,
          where_it_shows: "Principal's Circular Portrait Frame",
          ai_guide: "Direct verified URL (https://...) of the Principal's official photograph from the school website. Strictly leave \"\" if not found on the official website.",
        },
        principal_phone: {
          value: sectionData?.principal_phone || '',
          type: 'text',
          max_length: 20,
          where_it_shows: "Principal's Desk Contact Strip",
          ai_guide: 'Official school office phone number. Leave "" if not verified.',
        },
        principal_email: {
          value: sectionData?.principal_email || '',
          type: 'text',
          max_length: 60,
          where_it_shows: "Principal's Desk Contact Strip",
          ai_guide: 'Official school email address verified from CBSE SARAS or school website. Leave "" if not verified.',
        },
      },

      management: {
        management_society: {
          value: sectionData?.management_society || '',
          type: 'text',
          max_length: 90,
          where_it_shows: 'Governing Body & Trust Card Title',
          ai_guide: 'Exact registered Society or Trust name operating the school from CBSE SARAS / MPD / Official Website (e.g., "Shanti Devi Progressive Education Society" or "Shahdara Angels Educational Society"). If not publicly known, use "Private Unaided Recognized Management Committee".',
          dummy_example_do_not_copy: 'Sample Educational Trust',
        },
        management_name: {
          value: sectionData?.management_name || '',
          type: 'text',
          max_length: 70,
          where_it_shows: 'Chairperson / Manager Name in Management Section',
          ai_guide: 'Verified name of the Chairman, President, or Manager from the school website or MPD. Leave "" if not verifiable.',
          dummy_example_do_not_copy: 'Shri R.K. Gupta',
        },
        management_designation: {
          value: sectionData?.management_designation || 'Governing Body & Managing Committee',
          type: 'text',
          max_length: 60,
          where_it_shows: 'Management Designation Subtitle',
          ai_guide: 'Official title (e.g., "Chairman" or "Managing Committee").',
        },
        management_quote: {
          value: sectionData?.management_quote || '',
          type: 'textarea',
          max_length: 250,
          where_it_shows: 'Management Vision Pull-Quote',
          ai_guide: 'Governing vision quote of the trust/management (max 240 chars).',
        },
        management_message_p1: {
          value: sectionData?.management_message_p1 || '',
          type: 'textarea',
          max_length: 600,
          where_it_shows: 'Management Message Paragraph 1',
          ai_guide: 'First paragraph describing the society/management commitment to infrastructure, safety, and quality education at this school.',
        },
        management_message_p2: {
          value: sectionData?.management_message_p2 || '',
          type: 'textarea',
          max_length: 600,
          where_it_shows: 'Management Message Paragraph 2',
          ai_guide: 'Second paragraph describing long-term educational values and community service.',
        },
        management_logo: {
          value: sectionData?.management_logo || '',
          type: 'image_url',
          max_length: 500,
          where_it_shows: 'Management Seal / Crest Image',
          ai_guide: 'Verified official school/society crest URL (https://...) or "".',
        },
      },

      academics: {
        class_from: {
          value: sectionData?.class_from || '1',
          type: 'text',
          max_length: 15,
          where_it_shows: 'Academic Overview Card & Quick Profile Strip',
          ai_guide: 'Lowest class offered verified from UDISE+ (e.g., "Nursery" or "1").',
          dummy_example_do_not_copy: '1',
        },
        class_to: {
          value: sectionData?.class_to || '12',
          type: 'text',
          max_length: 15,
          where_it_shows: 'Academic Overview Card & Quick Profile Strip',
          ai_guide: 'Highest class offered verified from UDISE+ (e.g., "8", "10", or "12").',
          dummy_example_do_not_copy: '12',
        },
        curriculum_features: {
          value: Array.isArray(sectionData?.curriculum_features) ? sectionData.curriculum_features : [],
          type: 'string_array',
          max_items: 8,
          where_it_shows: 'Academics Tab Pedagogical Highlights Grid',
          ai_guide: 'Array of 4 to 6 specific curriculum and pedagogical highlights (max 95 chars each) appropriate for this school board and class range.',
          dummy_example_do_not_copy: ['CBSE Aligned Curriculum with NEP 2020 Experiential Pedagogy'],
        },
        stream_categories: {
          value: Array.isArray(sectionData?.stream_categories) ? sectionData.stream_categories : [],
          type: 'object_array',
          max_items: 6,
          where_it_shows: 'Senior Secondary Streams / Academic Stages Section',
          ai_guide: 'For Senior Secondary (Class 1-12) schools, list offered streams [{"name": "Science (Medical & Non-Medical)", "subjects": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English Core"]}, {"name": "Commerce", "subjects": [...]}, {"name": "Humanities", "subjects": [...]}]. For Class 1-8 schools, list Foundational, Preparatory, and Middle Stage subject groups.',
        },
      },

      results: {
        class10Results: {
          value: Array.isArray(sectionData?.class10Results) ? sectionData.class10Results : [],
          type: 'object_array',
          max_items: 5,
          where_it_shows: 'Academics Tab -> Class 10 Board Examination Results Table',
          ai_guide: 'ONLY populate if official Class 10 CBSE board result data is 100% verified from Mandatory Public Disclosure (MPD) or CBSE SARAS. For Class 1-8 schools or if exact numbers are not publicly disclosed, strictly return [] (empty array). NEVER fabricate student counts or percentages.',
          dummy_example_do_not_copy: [],
        },
        class12Results: {
          value: Array.isArray(sectionData?.class12Results) ? sectionData.class12Results : [],
          type: 'object_array',
          max_items: 5,
          where_it_shows: 'Academics Tab -> Class 12 Board Examination Results Table',
          ai_guide: 'ONLY populate if official Class 12 CBSE board result data is 100% verified from Mandatory Public Disclosure (MPD) or CBSE SARAS. For Class 1-8 schools or if exact numbers are not publicly disclosed, strictly return [] (empty array). NEVER fabricate student counts or percentages.',
          dummy_example_do_not_copy: [],
        },
      },

      facilities: {
        facilities_eyebrow: {
          value: sectionData?.facilities_eyebrow || 'OUR CAMPUS INFRASTRUCTURE',
          type: 'text',
          max_length: 35,
          where_it_shows: 'Facilities Tab Top Eyebrow Badge',
          ai_guide: 'Uppercase eyebrow text for Facilities section.',
        },
        facilities_heading: {
          value: sectionData?.facilities_heading || 'Campus Facilities & Learning Infrastructure',
          type: 'text',
          max_length: 50,
          where_it_shows: 'Facilities Tab Main Heading',
          ai_guide: 'Main heading for Facilities section.',
        },
        selected_facility_names: {
          value: Array.isArray(sectionData?.selected_facility_names) ? sectionData.selected_facility_names : [],
          type: 'string_array',
          max_items: 62,
          where_it_shows: 'Facilities & Infrastructure Interactive Category Cards',
          ai_guide: 'Array of verified facility names available at this school based on UDISE+ infrastructure report and school website (e.g., ["Smart Classes", "Library", "Computer Lab", "Physics Lab", "Chemistry Lab", "Biology Lab", "Mathematics Lab", "Atal Tinkering Lab (ATL)", "Playground / Outdoor Sports", "Indoor Sports Room", "Music & Dance Room", "Art & Craft Studio", "Medical Room / Infirmary", "CCTV Surveillance", "RO Drinking Water", "Fire Safety System", "Ramps for CWSN", "Separate Washrooms for Boys & Girls"]). Note: Do NOT include Physics/Chemistry/Biology Senior Labs for Class 1-8 Primary/Middle schools.',
        },
      },

      gallery: {
        gallery_items: {
          value: Array.isArray(sectionData?.gallery_items)
            ? sectionData.gallery_items.filter((x: any) => x?.url && !x.url.includes('/images/categories/'))
            : [],
          type: 'media_array',
          max_items: 30,
          where_it_shows: 'Campus Photo & Video Gallery Tab Grid',
          ai_guide: 'Array of real HTTP-200 verified school photos/videos [{"id": "gal-1", "title": "...", "category": "Campus"|"Labs"|"Sports"|"Events"|"Classrooms", "type": "image"|"video", "url": "https://..."}]. Never include stock or placeholder URLs. Return [] if no verified photos exist.',
        },
        campus_video_url: {
          value: sectionData?.campus_video_url || '',
          type: 'url',
          max_length: 500,
          where_it_shows: 'Gallery Tab Virtual Campus Walkthrough Video Player',
          ai_guide: 'Official YouTube video URL of the school if verified, otherwise "".',
        },
      },

      fees: {
        annual_fee: {
          value: sectionData?.annual_fee || '',
          type: 'text',
          max_length: 30,
          where_it_shows: 'Quick Profile Fee Card & Directory Card Fee Tag',
          ai_guide: 'Verified approximate annual tuition fee range from DoE Delhi fee order / school website / UniApply (e.g., "₹45,000 - ₹72,000 / Year" or "₹18,000 - ₹30,000 / Year"). Leave "" if not verifiable.',
          dummy_example_do_not_copy: '₹30,000 - ₹50,000',
        },
        fee_table: {
          value: sectionData?.fee_table || { columns: ['Class Level', 'Monthly Tuition Fee', 'Annual Charges', 'Estimated Annual Total'], rows: [] },
          type: 'table_object',
          where_it_shows: 'Fee Structure Tab -> Main Grade-Wise Tuition Fee Table',
          ai_guide: 'Object with {"columns": ["Class Level", "Monthly Tuition Fee", "Annual Charges", "Estimated Annual Total"], "rows": [[...]]} matching the school class range and verified DoE / website fee structure.',
        },
        extra_charges_table: {
          value: sectionData?.extra_charges_table || { columns: ['Charge Head', 'Frequency', 'Amount', 'Remarks'], rows: [] },
          type: 'table_object',
          where_it_shows: 'Fee Structure Tab -> Admission & Registration Charges Table',
          ai_guide: 'Object with {"columns": ["Charge Head", "Frequency", "Amount", "Remarks"], "rows": [["Registration Fee", "One-Time (At Admission)", "₹25 (As per DoE Norms)", "Non-refundableregistration fee"], ...]}',
        },
        fee_terms_list: {
          value: Array.isArray(sectionData?.fee_terms_list) ? sectionData.fee_terms_list : [],
          type: 'object_array',
          where_it_shows: 'Fee Structure Tab -> Regulatory Guidelines & Concessions Cards',
          ai_guide: 'Array of 4 fee policy items [{"id": "term-1", "category": "Due Date", "title": "...", "description": "..."}].',
        },
        admission_phone: {
          value: sectionData?.admission_phone || '',
          type: 'text',
          max_length: 20,
          where_it_shows: 'Fee Inquiry Help Box Phone',
          ai_guide: 'Verified school office phone or "".',
        },
        admission_email: {
          value: sectionData?.admission_email || '',
          type: 'text',
          max_length: 60,
          where_it_shows: 'Fee Inquiry Help Box Email',
          ai_guide: 'Verified school email address or "".',
        },
        official_fee_page_url: {
          value: sectionData?.official_fee_page_url || '',
          type: 'url',
          max_length: 300,
          where_it_shows: 'Fee Structure Tab -> Official School Fee Structure Page / PDF Button',
          ai_guide:
            'Direct verified URL (https://...) to the official Fee Structure page or Fee PDF on the school website. Leave "" if the school has no official website or fee page.',
          dummy_example_do_not_copy: 'https://www.sampleschool.edu.in/fee-structure',
        },
      },

      admissions: {
        session: {
          value: sectionData?.session || '2026-27',
          type: 'text',
          max_length: 15,
          where_it_shows: 'Admissions Tab Active Session Badge',
          ai_guide: 'Current academic session ("2026-27").',
        },
        admissions_open: {
          value: sectionData?.admissions_open ?? true,
          type: 'boolean',
          where_it_shows: 'Admissions Status Badge',
          ai_guide: 'Boolean true if school is accepting admissions.',
        },
        admission_phone: {
          value: sectionData?.admission_phone || '',
          type: 'text',
          max_length: 20,
          where_it_shows: 'Admissions Helpdesk Phone',
          ai_guide: 'Verified school phone number or "".',
        },
        admission_email: {
          value: sectionData?.admission_email || '',
          type: 'text',
          max_length: 60,
          where_it_shows: 'Admissions Helpdesk Email',
          ai_guide: 'Verified school email address or "".',
        },
        official_admissions_page_url: {
          value: sectionData?.official_admissions_page_url || '',
          type: 'url',
          max_length: 300,
          where_it_shows: 'Admissions Tab -> Visit Official School Admissions Page Button',
          ai_guide:
            'Direct verified URL (https://...) to the official Admissions / Registration / Procedure page on the school website. Leave "" if the school has no official website.',
          dummy_example_do_not_copy: 'https://www.sampleschool.edu.in/admissions',
        },
        admissions_cards: {
          value: Array.isArray(sectionData?.admissions_cards) ? sectionData.admissions_cards : [],
          type: 'object_array',
          max_items: 4,
          where_it_shows: 'Admissions Tab Stage-Wise Eligibility & Document Cards',
          ai_guide: 'Array of stage-wise admission cards [{"id": "adm-1", "title": "Entry Level / Primary Admissions", "criteria": "As per DoE Delhi & NEP 2020 age norms (Minimum 3+ for Nursery, 6+ for Class 1 as of 31st March).", "badge": "Session 2026-27", "icon": "Baby", "points": ["Birth Certificate issued by MCD", "Proof of Residence in Delhi", "Aadhaar Card of Child & Parents", "Passport Size Photographs"]}]. Tailor to the school class_from and class_to.',
        },
      },

      faqs: {
        faq_items: {
          value: Array.isArray(sectionData?.faq_items) ? sectionData.faq_items : [],
          type: 'object_array',
          max_items: 10,
          where_it_shows: 'Frequently Asked Questions Accordion Section',
          ai_guide: 'Array of 5 factual Q&A items specifically about this school (covering its exact address, board affiliation, classes offered, medium of instruction, and admission process): [{"id": "faq-1", "question": "...", "answer": "...", "category": "General"|"Admissions"|"Academics"|"Facilities"}].',
        },
      },

      contact: {
        address: {
          value: sectionData?.address || fullAddressResolved || '',
          type: 'text',
          max_length: 250,
          where_it_shows: 'Contact Tab Address Card & Footer',
          ai_guide: 'Complete verified street address of the school.',
        },
        pincode: {
          value: sectionData?.pincode || pincodeResolved || '',
          type: 'text',
          max_length: 10,
          where_it_shows: 'Contact Tab Address Card',
          ai_guide: '6-digit PIN code.',
        },
        phone: {
          value: sectionData?.phone || '',
          type: 'text',
          max_length: 25,
          where_it_shows: 'Contact Tab Primary Phone & Call CTA',
          ai_guide: 'Verified official reception phone number of the school. Leave "" if not verified.',
        },
        email: {
          value: sectionData?.email || '',
          type: 'text',
          max_length: 60,
          where_it_shows: 'Contact Tab Primary Official Email',
          ai_guide: 'Verified official email address of the school from CBSE SARAS / official website. Leave "" if not verified.',
        },
        website: {
          value: sectionData?.website || '',
          type: 'url',
          max_length: 120,
          where_it_shows: 'Contact Tab Official Website Link',
          ai_guide: 'Verified working official website URL (https://...) of the school. Leave "" if the school has no active standalone website.',
        },
        social_links: {
          value: sectionData?.social_links || { facebook: '', instagram: '', youtube: '' },
          type: 'object',
          where_it_shows: 'Contact Tab & Footer Social Icons',
          ai_guide: 'Object {"facebook": "", "instagram": "", "youtube": ""} with verified official social media URLs or "".',
        },
        desks: {
          value: sectionData?.desks || {
            general_enquiry: { phone: '', email: '' },
            admissions_office: { phone: '', email: '' },
            principal_office: { phone: '', email: '' },
            careers_desk: { phone: '', email: '' },
          },
          type: 'object',
          where_it_shows: 'Contact Tab 4-Department Directory Cards',
          ai_guide: 'Departmental contact numbers and emails using verified school phone/email (or "" where not available).',
        },
      },

      careers: {
        heading: {
          value: sectionData?.heading || 'Join Our Esteemed Teaching & Academic Faculty',
          type: 'text',
          max_length: 80,
          where_it_shows: 'Careers Tab Hero Banner Heading',
          ai_guide: 'Professional faculty recruitment heading for this school.',
        },
        subheading: {
          value: sectionData?.subheading || '',
          type: 'textarea',
          max_length: 250,
          where_it_shows: 'Careers Tab Hero Subtitle',
          ai_guide: '1-2 sentence faculty recruitment invitation mentioning the school name and location.',
        },
        official_careers_page_url: {
          value: sectionData?.official_careers_page_url || '',
          type: 'url',
          max_length: 300,
          where_it_shows: 'Careers Tab -> Visit Official School Careers Page Button',
          ai_guide:
            'Direct verified URL (https://...) to the official Careers / Vacancy / Recruitment page on the school website. Leave "" if the school has no official website or careers page.',
          dummy_example_do_not_copy: 'https://www.sampleschool.edu.in/careers',
        },
        contact_email: {
          value: sectionData?.contact_email && sectionData.contact_email !== 'careers@school.edu.in' ? sectionData.contact_email : '',
          type: 'text',
          max_length: 60,
          where_it_shows: 'Careers Tab HR / Resume Submission Email',
          ai_guide: 'Verified official school email for sending resumes, or "" if not verified.',
        },
        contact_phone: {
          value: sectionData?.contact_phone || '',
          type: 'text',
          max_length: 25,
          where_it_shows: 'Careers Tab HR Phone',
          ai_guide: 'Verified official school phone number, or "" if not verified.',
        },
        openings: {
          value: Array.isArray(sectionData?.openings) ? sectionData.openings : [],
          type: 'object_array',
          max_items: 10,
          where_it_shows: 'Careers Tab Active Job Openings Cards (Shows Published Date & Vacancy Age from Official Website)',
          ai_guide:
            'STRICT RULE: ONLY include a vacancy if it is currently published on the school official website AND is NEW/ACTIVE (published within the last 45 days, is_new: true). If the school website has no career vacancy or only old/expired notices, MUST return [] (empty array). When a verified new vacancy exists on the school website, each item MUST include: { id, title, department, type, experience, qualification, description, published_date (exact date published on school website, e.g. "05 Oct 2026"), vacancy_age (how old the vacancy is, e.g. "6 days old"), vacancy_age_days (number of days old, e.g. 6), is_new: true, official_vacancy_url (direct school website recruitment URL) }.',
        },
      },
    };

    if (ALL_SECTION_SCHEMAS[sectionId]) {
      return NextResponse.json(
        {
          udise_code: cleanUdise,
          school_name: schoolNameResolved,
          school_identity_context: schoolIdentityContext,
          section_id: sectionId,
          section_title: meta.name,
          ai_system_prompt: aiSystemPrompt,
          fields: ALL_SECTION_SCHEMAS[sectionId],
        },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        udiseCode: cleanUdise,
        schoolName: schoolNameResolved,
        school_identity_context: schoolIdentityContext,
        ai_system_prompt: aiSystemPrompt,
        section: {
          id: sectionId,
          name: meta.name,
          description: meta.description,
          field_rules: meta.field_rules || {},
          data: sectionData,
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * POST or PUT /api/school-section/[udiseCode]/[sectionId]
 * Write / Create / Replace section data
 */
export async function POST(req: NextRequest, context: RouteContext) {
  return handleWriteOrReplace(req, context);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return handleWriteOrReplace(req, context);
}

async function handleWriteOrReplace(req: NextRequest, context: RouteContext) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_section_write',
    maxRequestsPerMinute: 40,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  try {
    const { udiseCode: rawUdise, sectionId: rawSection } = await context.params;
    const cleanUdise = (rawUdise || '').trim();
    const sectionId = resolveSectionId(rawSection);

    if (!sectionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_SECTION_ID',
          message: `Unknown section "${rawSection}". Available sections: ${Object.keys(SECTION_METADATA).join(', ')}`,
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const rawBody = await req.json().catch(() => ({}));
    const body = sanitizePayloadDeep(rawBody);

    const authResult = await verifySchoolWriteAuth(req, cleanUdise, {
      magicKey: body.magicKey || body.token || body.syncToken,
      adminKey: body.adminKey,
      adminEmail: body.adminEmail,
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED_WRITE',
          message: authResult.reason,
        },
        { status: 403, headers: CORS_HEADERS }
      );
    }

    const data = body.data !== undefined ? body.data : body;

    const result = await applySectionMutation({
      cleanUdise,
      sectionId,
      data,
      mode: 'replace',
    });

    return NextResponse.json(
      {
        success: true,
        action: 'write',
        udiseCode: cleanUdise,
        authMode: authResult.mode,
        section: {
          id: sectionId,
          name: SECTION_METADATA[sectionId]?.name,
          data: result.updatedSectionData,
        },
        message: result.message,
        supabaseSynced: result.supabaseSynced,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'WRITE_ERROR', message: err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * PATCH /api/school-section/[udiseCode]/[sectionId]
 * Partially update specific fields in a section without overwriting other fields
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_section_write',
    maxRequestsPerMinute: 40,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  try {
    const { udiseCode: rawUdise, sectionId: rawSection } = await context.params;
    const cleanUdise = (rawUdise || '').trim();
    const sectionId = resolveSectionId(rawSection);

    if (!sectionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_SECTION_ID',
          message: `Unknown section "${rawSection}". Available sections: ${Object.keys(SECTION_METADATA).join(', ')}`,
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const rawBody = await req.json().catch(() => ({}));
    const body = sanitizePayloadDeep(rawBody);

    const authResult = await verifySchoolWriteAuth(req, cleanUdise, {
      magicKey: body.magicKey || body.token || body.syncToken,
      adminKey: body.adminKey,
      adminEmail: body.adminEmail,
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED_WRITE',
          message: authResult.reason,
        },
        { status: 403, headers: CORS_HEADERS }
      );
    }

    const patchData = body.data !== undefined ? body.data : body;

    const result = await applySectionMutation({
      cleanUdise,
      sectionId,
      data: patchData,
      mode: 'patch',
    });

    return NextResponse.json(
      {
        success: true,
        action: 'update',
        udiseCode: cleanUdise,
        authMode: authResult.mode,
        section: {
          id: sectionId,
          name: SECTION_METADATA[sectionId]?.name,
          data: result.updatedSectionData,
        },
        message: result.message,
        supabaseSynced: result.supabaseSynced,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'UPDATE_ERROR', message: err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * DELETE /api/school-section/[udiseCode]/[sectionId]
 * Delete / Reset this section back to official baseline values
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
  const securityBlock = checkRateLimitAndBots(req, {
    bucketName: 'school_section_write',
    maxRequestsPerMinute: 20,
    blockScraperBots: true,
  });
  if (securityBlock) return securityBlock;

  try {
    const { udiseCode: rawUdise, sectionId: rawSection } = await context.params;
    const cleanUdise = (rawUdise || '').trim();
    const sectionId = resolveSectionId(rawSection);

    if (!sectionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_SECTION_ID',
          message: `Unknown section "${rawSection}". Available sections: ${Object.keys(SECTION_METADATA).join(', ')}`,
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const authResult = await verifySchoolWriteAuth(req, cleanUdise);
    if (!authResult.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED_DELETE',
          message: authResult.reason,
        },
        { status: 403, headers: CORS_HEADERS }
      );
    }

    const result = await applySectionMutation({
      cleanUdise,
      sectionId,
      data: {},
      mode: 'delete',
    });

    return NextResponse.json(
      {
        success: true,
        action: 'delete',
        udiseCode: cleanUdise,
        section: {
          id: sectionId,
          name: SECTION_METADATA[sectionId]?.name,
          data: result.updatedSectionData,
        },
        message: result.message,
        supabaseSynced: result.supabaseSynced,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'DELETE_ERROR', message: err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
