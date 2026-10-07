import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYXprenRoYXZ4cGhpYmRic3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMzc4ODUsImV4cCI6MjA4NzcxMzg4NX0.h4zZ4yWfVndY3m94cM569x07R2mU_R0t8qN63x03Z28';

export interface UdiseMasterRecord {
  id: string;
  udise_code: string;
  school_name: string;
  district: string;
  state: string;
  block: string;
  board: string;
  category: string;
  management: string;
  is_onboarded: boolean;
  partner_school_id?: string;
  created_at?: string;
}

export interface UdiseQueryParams {
  searchQuery?: string;
  state?: string;
  district?: string;
  board?: string;
  block?: string;
  page?: number;
  pageSize?: number;
}

class UdiseMasterService {
  private supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async fetchRecords(params: UdiseQueryParams): Promise<{ items: UdiseMasterRecord[]; total: number; page: number }> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 25;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.supabase
      .from('udise_master_directory')
      .select('*', { count: 'exact' });

    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.trim();
      query = query.or(`school_name.ilike.%${q}%,udise_code.ilike.%${q}%,district.ilike.%${q}%,state.ilike.%${q}%,block.ilike.%${q}%`);
    }

    if (params.state && params.state !== 'All') {
      query = query.ilike('state', `%${params.state}%`);
    }

    if (params.district && params.district !== 'All') {
      query = query.ilike('district', `%${params.district}%`);
    }

    if (params.board && params.board !== 'All') {
      query = query.ilike('board', `%${params.board}%`);
    }

    const { data, count, error } = await query
      .order('school_name', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('Error fetching UDISE records:', error);
      return { items: [], total: 0, page };
    }

    return {
      items: (data as UdiseMasterRecord[]) || [],
      total: count || 0,
      page
    };
  }

  async createRecord(record: Partial<UdiseMasterRecord>): Promise<UdiseMasterRecord | null> {
    const { data, error } = await this.supabase
      .from('udise_master_directory')
      .insert([record])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateRecord(id: string, updates: Partial<UdiseMasterRecord>): Promise<UdiseMasterRecord | null> {
    const { data, error } = await this.supabase
      .from('udise_master_directory')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteRecord(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('udise_master_directory')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async bulkUpsert(records: Partial<UdiseMasterRecord>[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    const BATCH = 200;

    for (let i = 0; i < records.length; i += BATCH) {
      const chunk = records.slice(i, i + BATCH);
      const { error } = await this.supabase
        .from('udise_master_directory')
        .upsert(chunk, { onConflict: 'udise_code' });

      if (error) {
        console.error('Batch error:', error);
        failed += chunk.length;
      } else {
        success += chunk.length;
      }
    }

    return { success, failed };
  }

  async onboardSchool(record: UdiseMasterRecord): Promise<boolean> {
    // 1. Mark onboarded in UDISE master directory
    await this.supabase
      .from('udise_master_directory')
      .update({ is_onboarded: true })
      .eq('id', record.id);

    // 2. Insert or upsert into schools table
    const schoolPayload = {
      name: record.school_name,
      udise_code: record.udise_code,
      board: record.board || 'CBSE',
      state: record.state,
      district: record.district,
      city: record.district,
      locality: record.block,
      classes_offered: record.category || 'Pre-Primary to 12th',
      stem_labs_count: 4,
      verified: true
    };

    await this.supabase
      .from('schools')
      .upsert([schoolPayload], { onConflict: 'udise_code' });

    return true;
  }
}

export const udiseMasterService = new UdiseMasterService();
