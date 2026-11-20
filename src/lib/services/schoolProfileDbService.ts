import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vvdnsmrtockscarkybtf.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseServer = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

export interface VerifiedSchoolProfileResult {
  school: any;
  claimedProfile: any;
  facilities: any[];
}

export async function fetchSchoolFromSupabaseDirect(
  digitsOnly: string,
  rawCleanSlug?: string
): Promise<any | null> {
  try {
    let query = supabaseServer
      .from('udise_private_schools')
      .select('*');

    if (digitsOnly && digitsOnly.length >= 6) {
      const candidates = [
        digitsOnly,
        digitsOnly.padStart(11, '0'),
        digitsOnly.replace(/^0+/, '')
      ];
      query = query.in('udise_code', candidates);
    } else if (rawCleanSlug) {
      const normalized = rawCleanSlug.replace(/[-_]/g, ' ').trim();
      query = query.ilike('school_name', `%${normalized}%`);
    } else {
      return null;
    }

    const { data: schools, error } = await query.limit(1);

    if (error || !schools || schools.length === 0) {
      return null;
    }

    const s = schools[0];
    const udise = String(s.udise_code);

    // Fetch claimed_profile directly from vvdnsmrtockscarkybtf
    const { data: claims } = await supabaseServer
      .from('claimed_profile')
      .select('*')
      .eq('udise_code', udise)
      .limit(1);

    const cp = claims && claims.length > 0 ? claims[0] : null;

    // Fetch facilities if claimed_profile specifies facility_ids
    let facilityItems: any[] = [];
    if (cp && Array.isArray(cp.facility_ids) && cp.facility_ids.length > 0) {
      const { data: facs } = await supabaseServer
        .from('tbl_facilities')
        .select('*')
        .in('facility_id', cp.facility_ids);
      if (facs) facilityItems = facs;
    }

    // Map into canonical school record format with ZERO hardcoded fallback
    const stateName = s.state_name || s.tbl_states?.state_name || null;
    const districtName = s.district_name || s.tbl_districts?.district_name || null;
    const blockName = s.block_name || s.tbl_blocks?.block_name || null;
    const clusterName = s.cluster_name || null;
    const villageName = s.village_name || s.village || null;
    const categoryDesc = s.school_category || s.tbl_categories?.category_desc || null;
    const managementDesc = s.management_desc || s.tbl_management?.management_desc || null;
    const mediumName = s.primary_medium || s.tbl_mediums?.medium_name || null;

    const isClaimed = Boolean(cp && cp.is_claimed);
    const isPublished = cp?.is_published !== false && s.is_published !== false;

    return {
      id: udise,
      school_id: udise,
      udise_code: udise,
      school_name: cp?.school_name || s.school_name,
      state_name: stateName,
      district_name: districtName,
      block_name: blockName,
      cluster_name: clusterName,
      village_name: villageName,
      pincode: s.pincode ? String(s.pincode) : null,
      address: s.address || (villageName ? `${villageName}, ${districtName || ''}` : null),
      latitude: s.latitude ? Number(s.latitude) : null,
      longitude: s.longitude ? Number(s.longitude) : null,
      headmaster_principal_name: cp?.principal_name || s.headmaster_name || null,
      principal_name: cp?.principal_name || s.headmaster_name || null,
      principal_designation: cp?.principal_designation || null,
      principal_quote: cp?.principal_quote || null,
      principal_image_url: cp?.principal_image_url || null,
      phone: cp?.contact_phone || s.phone || null,
      email: cp?.contact_email || s.email || null,
      website: cp?.website || s.website || null,
      school_category: categoryDesc,
      management_type: managementDesc,
      management_desc: managementDesc,
      class_from: s.class_from ? String(s.class_from) : null,
      class_to: s.class_to ? String(s.class_to) : null,
      primary_medium: mediumName,
      residential_desc: s.residential_desc || s.residential_school || null,
      total_students: s.total_students ? Number(s.total_students) : null,
      total_teachers: s.total_teachers ? Number(s.total_teachers) : null,
      total_classrooms: s.total_classrooms || s.classrooms_total ? Number(s.total_classrooms || s.classrooms_total) : null,
      working_smart_boards: s.working_smart_boards || s.digital_boards_working ? Number(s.working_smart_boards || s.digital_boards_working) : null,
      tinkering_lab_atl: s.tinkering_lab === true || s.tinkering_lab === 'Yes' || s.tinkering_lab_atl === true || s.tinkering_lab_atl === 'Yes' ? 'Yes' : 'No',
      atal_stem_lab: s.tinkering_lab === true || s.tinkering_lab === 'Yes' || s.tinkering_lab_atl === true || s.tinkering_lab_atl === 'Yes' ? 'Yes' : 'No',
      integrated_science_lab: s.integrated_science_lab === true || s.integrated_science_lab === 'Yes' || s.integrated_lab === true || s.integrated_lab === 'Yes' ? 'Yes' : 'No',
      computer_ict_lab: s.ict_lab === true || s.ict_lab === 'Yes' ? 'Yes' : 'No',
      library: s.library === true || s.library === 'Yes' ? 'Yes' : (typeof s.library === 'string' ? s.library : null),
      playground: s.playground === true || s.playground === 'Yes' ? 'Yes' : 'No',
      established_year: s.established_year ? String(s.established_year) : null,

      // Claimed profile overrides (strictly null if not configured)
      is_claimed: isClaimed,
      verification_status: cp?.verification_status || (isClaimed ? 'verified' : 'unverified'),
      is_published: isPublished,
      about_school: cp?.about_school || cp?.about_text || null,
      about_text: cp?.about_text || cp?.about_school || null,
      hero_headline: cp?.hero_headline || null,
      hero_tagline: cp?.hero_tagline || null,
      logo_image_url: cp?.logo_image_url || null,
      banner_image_url: cp?.banner_image_url || null,
      campus_image_url: cp?.campus_image_url || null,
      gallery_media: cp?.gallery_media || null,
      video_tour_url: cp?.video_tour_url || null,
      custom_stats: cp?.custom_stats || null,
      faqs: cp?.faqs || null,
      fee_table: cp?.fee_table || null,
      admission_rules: cp?.admission_rules || null,
      facilities: facilityItems.length > 0 ? facilityItems : null,
      rating: null,
      reviews: null,
    };
  } catch (err) {
    console.error('Error fetching school from Supabase direct:', err);
    return null;
  }
}
