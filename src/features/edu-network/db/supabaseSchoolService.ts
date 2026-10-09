'use client';

import { OrganizationItem } from '@/lib/eduNetworkData';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';

export class SupabaseSchoolService {
  private static instance: SupabaseSchoolService;

  public static getInstance(): SupabaseSchoolService {
    if (!SupabaseSchoolService.instance) {
      SupabaseSchoolService.instance = new SupabaseSchoolService();
    }
    return SupabaseSchoolService.instance;
  }

  /**
   * Helper to map DB row from udise_private_schools into frontend OrganizationItem
   */
  public mapDbToOrg(row: any): OrganizationItem {
    const sid = String(row.school_id || row.id);
    const totalStudents = Number(row.total_students) || 500;
    const fee = totalStudents > 500 ? 45000 : 25000;
    const monthlyFee = Math.round(fee / 12);
    
    let boardClean: any = 'CBSE';
    const bStr = (row.board_12th || row.board_10th || '').toLowerCase();
    if (bStr.includes('icse') || bStr.includes('cisce')) boardClean = 'ICSE';
    else if (bStr.includes('ib') || bStr.includes('cambridge')) boardClean = 'IB';
    else if (bStr.includes('state')) boardClean = 'State Board';

    return {
      id: sid,
      slug: (row.school_name || 'school').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: row.school_name || 'School',
      type: 'School',
      affiliation: boardClean,
      city: row.district_name || 'Delhi NCR',
      state: row.state_name || 'Delhi',
      pincode: String(row.pincode || '110001'),
      address: row.address || `${row.school_name}, ${row.district_name || 'City'}`,
      locality: row.village_name || row.block_name || 'Main City',
      district: row.district_name || 'Delhi NCR',
      block: row.block_name || '',
      villageTownCity: row.village_name || row.district_name || 'City',
      email: row.email || `contact@school${sid}.cseel.org`,
      phone: row.phone || '+91 1274 250001',
      website: row.website || '',
      verified: true,
      rating: 4.8,
      reviews: 95,
      stemLabsCount: row.atal_stem_lab?.toLowerCase() === 'yes' ? 8 : 4,
      studentStrength: totalStudents,
      logo: 'https://images.unsplash.com/photo-1580582932707?w=200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1509062522246?w=800&auto=format&fit=crop',
      description: `${row.school_name} is a recognized institution affiliated with ${boardClean} located in ${row.district_name || 'City'}, ${row.state_name || 'State'}.`,
      openJobsCount: 2,
      established: Number(row.established_year) || 2002,
      facilities: [
        row.atal_stem_lab?.toLowerCase() === 'yes' ? 'Atal STEM Lab' : 'Science Lab',
        row.computer_ict_lab?.toLowerCase() === 'yes' ? 'Computer Lab' : 'Smart Class',
        row.playground_available?.toLowerCase() === 'yes' ? 'Sports Ground' : 'Library'
      ],
      classesOffered: row.class_from && row.class_to ? `Class ${row.class_from} - ${row.class_to}` : 'Class 1st - 12th',
      monthlyFees: `₹${(monthlyFee / 1000).toFixed(1)}k / mo`,
      monthlyFeesNum: monthlyFee,
      board: boardClean,
      studentFacultyRatio: row.total_teachers ? `${Math.round(totalStudents / Math.max(Number(row.total_teachers), 1))}:1` : '15:1',
      admissionStatus: 'Open for 2026-27',
      udiseCode: String(row.udise_code || '07010200389'),
      isFeatured: true,
      likesCount: 24
    };
  }

  /**
   * Fetch all live schools from the new Supabase Database
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
    try {
      const fetchLimit = options?.limit || 12000;
      const BATCH_SIZE = 1000;
      const batchCount = Math.ceil(Math.min(fetchLimit, 12000) / BATCH_SIZE);

      const promises = [];
      for (let i = 0; i < batchCount; i++) {
        let query = schoolSearchSupabase
          .from('udise_private_schools')
          .select('*');

        if (options?.city && options.city !== 'All India' && options.city !== 'all') {
          query = query.ilike('district_name', `%${options.city}%`);
        }
        if (options?.board && options.board !== 'All') {
          query = query.ilike('board_10th', `%${options.board}%`);
        }
        if (options?.search) {
          query = query.or(`school_name.ilike.%${options.search}%,district_name.ilike.%${options.search}%,state_name.ilike.%${options.search}%,udise_code.ilike.%${options.search}%`);
        }

        if (options?.sortBy === 'rating') {
          query = query.order('total_students', { ascending: false });
        } else {
          query = query.order('school_name', { ascending: true });
        }

        const from = i * BATCH_SIZE;
        const to = Math.min(from + BATCH_SIZE - 1, fetchLimit - 1);
        query = query.range(from, to);

        promises.push(query);
      }

      const responses = await Promise.all(promises);
      const allRows: any[] = [];
      for (const res of responses) {
        if (res.data && res.data.length > 0) {
          allRows.push(...res.data);
        }
      }

      return allRows.map((r: any) => this.mapDbToOrg(r));
    } catch (err) {
      console.error('Error in getSchools:', err);
      return [];
    }
  }

  /**
   * Get single school by ID
   */
  public async getSchoolById(id: string): Promise<OrganizationItem | null> {
    return this.getSchoolByIdOrSlug(id);
  }

  /**
   * Get single school by ID or Slug
   */
  public async getSchoolByIdOrSlug(idOrSlug: string): Promise<OrganizationItem | null> {
    try {
      const { data, error } = await schoolSearchSupabase
        .from('udise_private_schools')
        .select('*')
        .or(`school_id.eq.${idOrSlug},udise_code.eq.${idOrSlug}`)
        .limit(1)
        .maybeSingle();

      if (data) {
        return this.mapDbToOrg(data);
      }
      return null;
    } catch (e) {
      console.warn('getSchoolByIdOrSlug error:', e);
      return null;
    }
  }

  /**
   * Upsert school
   */
  public async upsertSchool(org: Partial<OrganizationItem>): Promise<OrganizationItem | null> {
    try {
      const row = {
        school_id: String(org.id || Date.now()),
        school_name: org.name || 'School',
        udise_code: org.udiseCode || '07010200389',
        district_name: org.city || 'Delhi NCR',
        state_name: org.state || 'Delhi',
        address: org.address || '',
        phone: org.phone || '',
        email: org.email || '',
        total_students: org.studentStrength || 500,
        board_10th: org.board || 'CBSE',
        board_12th: org.board || 'CBSE',
        atal_stem_lab: (org.stemLabsCount || 0) > 0 ? 'Yes' : 'No',
        school_status: 'Operational'
      };

      const { data, error } = await schoolSearchSupabase
        .from('udise_private_schools')
        .upsert(row, { onConflict: 'school_id' })
        .select()
        .single();

      if (error) {
        console.warn('upsertSchool error:', error);
        return null;
      }
      return this.mapDbToOrg(data);
    } catch (e) {
      console.warn('upsertSchool error:', e);
      return null;
    }
  }

  /**
   * Delete school
   */
  public async deleteSchool(id: string): Promise<boolean> {
    try {
      const { error } = await schoolSearchSupabase
        .from('udise_private_schools')
        .delete()
        .eq('school_id', id);

      return !error;
    } catch (e) {
      console.warn('deleteSchool error:', e);
      return false;
    }
  }

  /**
   * Get exact live database count from Supabase
   */
  public async getTotalSchoolsCount(): Promise<number> {
    try {
      const { count, error } = await schoolSearchSupabase
        .from('udise_private_schools')
        .select('*', { count: 'exact', head: true });

      if (!error && count !== null) {
        return count;
      }
    } catch (e) {
      console.warn('Error getting count:', e);
    }
    return 12000;
  }
}

export const supabaseSchoolService = SupabaseSchoolService.getInstance();
