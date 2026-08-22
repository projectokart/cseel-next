import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type DepartmentSchemaName = 'materials' | 'careers' | 'network' | 'training' | 'events' | 'support';

/**
 * Universal Pluggable Department Database Adapter
 * 
 * Architecture:
 * - Current: Connects to Supabase PostgreSQL Schema Folders (materials, careers, network, training, events, support)
 * - Future: Can route any individual department to an independent external Database URL (PostgreSQL / MongoDB / DynamoDB)
 * - Resilience: Graceful fallback to memory/cache if table/schema is pending creation
 */
export class DepartmentDbAdapter {
  private static instance: DepartmentDbAdapter;
  private supabase: SupabaseClient | null = null;
  private customConnections: Map<string, string> = new Map();

  private constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYXpreHRoYXZ4cGhpYmRic3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTk4MzgsImV4cCI6MjA4OTM5NTgzOH0.Oi47bXRcJ5dAAblFqYUnFvbUx61DS8ABBikC6cIjGlo';

    if (supabaseUrl && supabaseKey) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false },
        });
      } catch (err) {
        console.warn('Supabase initialization warning:', err);
      }
    }

    // Register external database URLs for future migration
    if (process.env.MATERIALS_DATABASE_URL) this.customConnections.set('materials', process.env.MATERIALS_DATABASE_URL);
    if (process.env.HR_DB_URL) this.customConnections.set('careers', process.env.HR_DB_URL);
    if (process.env.NETWORK_DB_URL) this.customConnections.set('network', process.env.NETWORK_DB_URL);
    if (process.env.TRAINING_DB_URL) this.customConnections.set('training', process.env.TRAINING_DB_URL);
    if (process.env.EVENTS_DB_URL) this.customConnections.set('events', process.env.EVENTS_DB_URL);
    if (process.env.TICKETS_DB_URL) this.customConnections.set('support', process.env.TICKETS_DB_URL);
  }

  public static getInstance(): DepartmentDbAdapter {
    if (!DepartmentDbAdapter.instance) {
      DepartmentDbAdapter.instance = new DepartmentDbAdapter();
    }
    return DepartmentDbAdapter.instance;
  }

  /**
   * Check if department is routed to an external database
   */
  public hasCustomDb(department: DepartmentSchemaName): boolean {
    return this.customConnections.has(department);
  }

  /**
   * Get Supabase Client scoped to a Department Schema Folder
   */
  public getDepartmentSchema(department: DepartmentSchemaName) {
    if (!this.supabase) return null;
    return this.supabase.schema(department);
  }

  /**
   * Universal Query: SELECT
   */
  public async query<T>(
    department: DepartmentSchemaName,
    tableName: string,
    fallbackData: T[],
    options?: { match?: Record<string, any>; limit?: number; order?: { column: string; ascending?: boolean } }
  ): Promise<{ data: T[]; isFromDb: boolean }> {
    try {
      const schema = this.getDepartmentSchema(department);
      if (!schema) return { data: fallbackData, isFromDb: false };

      let q = schema.from(tableName).select('*');

      if (options?.match) {
        Object.entries(options.match).forEach(([k, v]) => {
          if (v !== undefined) q = q.eq(k, v);
        });
      }

      if (options?.order) {
        q = q.order(options.order.column, { ascending: options.order.ascending ?? false });
      }

      if (options?.limit) {
        q = q.limit(options.limit);
      }

      const { data, error } = await q;

      if (error || !data || data.length === 0) {
        return { data: fallbackData, isFromDb: false };
      }

      return { data: data as unknown as T[], isFromDb: true };
    } catch {
      return { data: fallbackData, isFromDb: false };
    }
  }

  /**
   * Universal Insert / Upsert
   */
  public async insert<T extends Record<string, any>>(
    department: DepartmentSchemaName,
    tableName: string,
    record: T
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const schema = this.getDepartmentSchema(department);
      if (!schema) return { success: false, error: 'Database schema unavailable' };

      const { data, error } = await schema.from(tableName).insert(record as any).select().single();
      if (error) return { success: false, error: error.message };

      return { success: true, data: data as T };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Universal Update
   */
  public async update<T extends Record<string, any>>(
    department: DepartmentSchemaName,
    tableName: string,
    id: string,
    updates: Partial<T>
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const schema = this.getDepartmentSchema(department);
      if (!schema) return { success: false, error: 'Database schema unavailable' };

      const { data, error } = await schema.from(tableName).update(updates as any).eq('id', id).select().single();
      if (error) return { success: false, error: error.message };

      return { success: true, data: data as T };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Universal Delete
   */
  public async delete(
    department: DepartmentSchemaName,
    tableName: string,
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const schema = this.getDepartmentSchema(department);
      if (!schema) return { success: false, error: 'Database schema unavailable' };

      const { error } = await schema.from(tableName).delete().eq('id', id);
      if (error) return { success: false, error: error.message };

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

export const departmentDb = DepartmentDbAdapter.getInstance();
