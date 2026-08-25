'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ALL_ORGANIZATIONS, OrganizationItem } from '@/lib/eduNetworkData';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYXpreHRoYXZ4cGhpYmRic3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTk4MzgsImV4cCI6MjA4OTM5NTgzOH0.Oi47bXRcJ5dAAblFqYUnFvbUx61DS8ABBikC6cIjGlo';

export class SupabaseSchoolService {
  private static instance: SupabaseSchoolService;
  private client: SupabaseClient | null = null;

  private constructor() {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: false },
        });
      } catch (e) {
        console.warn('Supabase initialization failed:', e);
      }
    }
  }

  public static getInstance(): SupabaseSchoolService {
    if (!SupabaseSchoolService.instance) {
      SupabaseSchoolService.instance = new SupabaseSchoolService();
    }
    return SupabaseSchoolService.instance;
  }

  /**
   * Helper to map DB row into frontend OrganizationItem
   */
  public mapDbToOrg(row: any): OrganizationItem {
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      shortName: row.short_name,
      type: row.org_type || 'School',
      affiliation: row.affiliation,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      address: row.address,
      locality: row.locality,
      district: row.district || row.city,
      block: row.block || '',
      villageTownCity: row.village_town_city || row.city,
      email: row.email,
      phone: row.phone,
      website: row.website,
      verified: row.verified ?? true,
      rating: Number(row.rating) || 4.9,
      reviews: Number(row.reviews_count) || 142,
      stemLabsCount: Number(row.stem_labs_count) || 12,
      studentStrength: Number(row.student_strength) || 2400,
      logo: row.logo_url || 'https://images.uniapply.com/uploads/college/image/logo/2186/KRMGS_L_220920_174918.jpg',
      bannerImage: row.banner_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
      description: row.description || '',
      openJobsCount: 1,
      established: Number(row.established_year) || 1998,
      facilities: row.facilities_chips || ['Smart Classrooms', 'Robotics Lab', 'Transport'],
      classesOffered: row.classes_offered || 'Pre-K - 12th',
      monthlyFees: row.monthly_fees || '₹12,500 / mo',
      monthlyFeesNum: Number(row.monthly_fees_num) || 12500,
      board: row.board || 'CBSE',
      studentFacultyRatio: row.student_faculty_ratio || '13:1',
      admissionStatus: row.admission_status || 'Open for 2026-27',
      udiseCode: row.udise_code || '07010200389',
      isFeatured: row.is_featured ?? false,
      
      // Detail Page Nested Entities
      ...row,
      galleryPhotos: row.gallery_photos || [],
      videosList: row.videos_list || [],
      contactChannels: row.contact_channels || [],
      selectedLabs: row.selected_labs || [],
      requiredDocs: row.required_docs || [],
      feeBreakdown: row.fee_breakdown || {},
      facilitiesMatrix: row.facilities_matrix || {},
    };
  }

  /**
   * Helper to map frontend object into DB row
   */
  public mapOrgToDb(org: any): Record<string, any> {
    const slug = org.slug || (org.name || 'school').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
      id: org.id,
      slug: slug,
      name: org.name,
      short_name: org.shortName || org.short_name || '',
      org_type: org.type || org.org_type || 'School',
      board: org.board || 'CBSE',
      udise_code: org.udiseCode || org.udise_code || '',
      affiliation: org.affiliation || '',
      monthly_fees: org.monthlyFees || org.monthly_fees || '₹12,500 / mo',
      monthly_fees_num: org.monthlyFeesNum || org.monthly_fees_num || 12500,
      classes_offered: org.classesOffered || org.classes_offered || 'Pre-K - 12th',
      student_faculty_ratio: org.studentFacultyRatio || org.student_faculty_ratio || '13:1',
      admission_status: org.admissionStatus || org.admission_status || 'Open for 2026-27',
      rating: org.rating || 4.9,
      reviews_count: org.reviews || org.reviews_count || 142,
      verified: org.verified ?? true,
      is_featured: org.isFeatured ?? org.is_featured ?? false,
      logo_url: org.logo || org.logo_url || '',
      banner_url: org.bannerImage || org.banner_url || '',
      
      locality: org.locality || '',
      city: org.city || 'Delhi NCR',
      state: org.state || 'Delhi',
      pincode: org.pincode || '110001',
      address: org.address || 'Campus Address',
      website: org.website || '',
      google_maps_embed_url: org.googleMapsEmbedUrl || org.google_maps_embed_url || '',
      transport_routes: org.transportRoutes || org.transport_routes || '',
      
      description: org.description || '',
      established_year: org.established || org.established_year || 1998,
      student_strength: org.studentStrength || org.student_strength || 2400,
      campus_acreage: org.campusAcreage || org.campus_acreage || '12 Acres Urban Campus',
      instruction_language: org.instructionLanguage || org.instruction_language || 'English',
      academic_session: org.academicSession || org.academic_session || 'April to March',
      total_faculty_count: org.totalFacultyCount || org.total_faculty_count || 125,
      principal_name: org.principalName || org.principal_name || 'Dr. Sunita Kapoor',
      principal_designation: org.principalDesignation || org.principal_designation || 'Principal (Ph.D, M.Ed)',
      principal_photo: org.principalPhoto || org.principal_photo || '',
      principal_message: org.principalMessage || org.principal_message || '',
      
      admission_form_start_date: org.admissionFormStartDate || org.admission_form_start_date || '01 Nov 2025',
      admission_form_end_date: org.admissionFormEndDate || org.admission_form_end_date || '31 Jan 2026',
      entrance_test_date: org.entranceTestDate || org.entrance_test_date || '15 Feb 2026',
      merit_list_date: org.meritListDate || org.merit_list_date || '28 Feb 2026',
      session_start_date: org.sessionStartDate || org.session_start_date || '01 Apr 2026',
      min_age_nursery: org.minAgeNursery || org.min_age_nursery || '3+ Years',
      min_age_class1: org.minAgeClass1 || org.min_age_class1 || '6+ Years',
      required_docs: org.requiredDocs || org.required_docs || [],
      
      fee_breakdown: org.feeBreakdown || org.fee_breakdown || {
        admissionFee: org.admissionFee || 45000,
        registrationFee: org.registrationFee || 1000,
        tuitionQuarterly: org.tuitionQuarterly || 37500,
        securityDeposit: org.securityDeposit || 15000,
        annualLogisticsFee: org.annualLogisticsFee || 18000,
        developmentFund: org.developmentFund || 12000,
      },
      
      stem_labs_count: org.stemLabsCount || org.stem_labs_count || 12,
      selected_labs: org.selectedLabs || org.selected_labs || [],
      
      facilities_matrix: org.facilitiesMatrix || org.facilities_matrix || {
        classroom: org.classroomFacilities || [],
        boarding: org.boardingFacilities || [],
        infrastructure: org.infrastructureFacilities || [],
        safety: org.safetyFacilities || [],
        sports: org.sportsFacilities || [],
        disabled: org.disabledFacilities || [],
      },
      facilities_chips: org.facilities || org.facilities_chips || [],
      
      pass_rate: org.passRate || org.pass_rate || '100%',
      top_score: org.topScore || org.top_score || '99.4%',
      batch_average: org.batchAverage || org.batch_average || '89.2%',
      academic_results: org.academicResults || org.academic_results || {
        topper12Name: org.topper12Name,
        topper12Score: org.topper12Score,
        topper12Stream: org.topper12Stream,
        topper12Photo: org.topper12Photo,
        topper10Name: org.topper10Name,
        topper10Score: org.topper10Score,
        topper10Stream: org.topper10Stream,
        topper10Photo: org.topper10Photo,
        banner12th_2026: org.banner12th_2026,
        banner10th_2026: org.banner10th_2026,
      },
      
      gallery_photos: org.galleryPhotos || org.gallery_photos || [],
      videos_list: org.videosList || org.videos_list || [],
      contact_channels: org.contactChannels || org.contact_channels || [],
      
      status: org.status || 'verified',
    };
  }

  /**
   * Fetch all schools with filters
   */
  public async getSchools(options?: {
    search?: string;
    city?: string;
    board?: string;
    admissionStatus?: string;
    maxFee?: number;
    sortBy?: string;
    limit?: number;
  }): Promise<OrganizationItem[]> {
    if (!this.client) return ALL_ORGANIZATIONS;

    try {
      let query = this.client.from('schools').select('*');

      if (options?.city && options.city !== 'All India') {
        query = query.ilike('city', `%${options.city}%`);
      }
      if (options?.board && options.board !== 'All') {
        query = query.eq('board', options.board);
      }
      if (options?.admissionStatus && options.admissionStatus !== 'All') {
        query = query.eq('admission_status', options.admissionStatus);
      }
      if (options?.maxFee) {
        query = query.lte('monthly_fees_num', options.maxFee);
      }
      if (options?.search) {
        query = query.or(`name.ilike.%${options.search}%,city.ilike.%${options.search}%,locality.ilike.%${options.search}%,udise_code.ilike.%${options.search}%`);
      }

      if (options?.sortBy === 'rating') {
        query = query.order('rating', { ascending: false });
      } else if (options?.sortBy === 'feeAsc') {
        query = query.order('monthly_fees_num', { ascending: true });
      } else if (options?.sortBy === 'feeDesc') {
        query = query.order('monthly_fees_num', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return ALL_ORGANIZATIONS;
      }

      return data.map((r: any) => this.mapDbToOrg(r));
    } catch {
      return ALL_ORGANIZATIONS;
    }
  }

  /**
   * Get single school by ID or Slug
   */
  public async getSchoolByIdOrSlug(idOrSlug: string): Promise<OrganizationItem | null> {
    if (!this.client) {
      return ALL_ORGANIZATIONS.find(o => o.id === idOrSlug || o.slug === idOrSlug) || null;
    }

    try {
      const { data, error } = await this.client
        .from('schools')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .single();

      if (error || !data) {
        return ALL_ORGANIZATIONS.find(o => o.id === idOrSlug || o.slug === idOrSlug) || null;
      }

      return this.mapDbToOrg(data);
    } catch {
      return ALL_ORGANIZATIONS.find(o => o.id === idOrSlug || o.slug === idOrSlug) || null;
    }
  }

  /**
   * Create or update school
   */
  public async upsertSchool(school: any): Promise<OrganizationItem> {
    const dbPayload = this.mapOrgToDb(school);

    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('schools')
          .upsert(dbPayload, { onConflict: 'id' })
          .select()
          .single();

        if (!error && data) {
          return this.mapDbToOrg(data);
        }
      } catch (err) {
        console.warn('Error upserting school to Supabase:', err);
      }
    }

    // Update memory cache
    const existingIdx = ALL_ORGANIZATIONS.findIndex(o => o.id === school.id);
    const orgItem = this.mapDbToOrg(dbPayload);
    if (existingIdx >= 0) {
      ALL_ORGANIZATIONS[existingIdx] = orgItem;
    } else {
      ALL_ORGANIZATIONS.unshift(orgItem);
    }
    return orgItem;
  }

  /**
   * Delete school
   */
  public async deleteSchool(id: string): Promise<boolean> {
    if (this.client) {
      try {
        await this.client.from('schools').delete().eq('id', id);
      } catch {}
    }
    const idx = ALL_ORGANIZATIONS.findIndex(o => o.id === id);
    if (idx >= 0) ALL_ORGANIZATIONS.splice(idx, 1);
    return true;
  }
}

export const supabaseSchoolService = SupabaseSchoolService.getInstance();
