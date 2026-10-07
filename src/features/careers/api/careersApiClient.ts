import { JobOpening, JobFilterState } from '../types';
import { CAREERS_MODULE_CONFIG } from '../config/moduleConfig';

class CareersApiClient {
  private baseUrl = CAREERS_MODULE_CONFIG.apiBaseUrl;

  public async fetchJobs(filter?: Partial<JobFilterState>): Promise<{ items: JobOpening[]; total: number; departments: string[] }> {
    const params = new URLSearchParams();
    if (filter?.searchQuery) params.set('q', filter.searchQuery);
    if (filter?.selectedDepartments && filter.selectedDepartments.length > 0) {
      params.set('departments', filter.selectedDepartments.join(','));
    }
    if (filter?.selectedTypes && filter.selectedTypes.length > 0) {
      params.set('types', filter.selectedTypes.join(','));
    }
    if (filter?.status) params.set('status', filter.status);
    if (filter?.sortBy) params.set('sortBy', filter.sortBy);

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    const json = await res.json();
    return { items: json.data || [], total: json.total || 0, departments: json.departments || [] };
  }

  public async getJobById(id: string): Promise<JobOpening> {
    const res = await fetch(`${this.baseUrl}/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Job not found');
    const json = await res.json();
    return json.data;
  }

  public async createJob(job: Partial<JobOpening>): Promise<JobOpening> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    if (!res.ok) throw new Error('Failed to create job');
    const json = await res.json();
    return json.data;
  }

  public async updateJob(id: string, updates: Partial<JobOpening>): Promise<JobOpening> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update job');
    const json = await res.json();
    return json.data;
  }

  public async deleteJob(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete job');
    return true;
  }

  public async importJobs(items: any[]): Promise<number> {
    const res = await fetch(`${this.baseUrl}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error('Failed to import jobs');
    const json = await res.json();
    return json.importedCount || 0;
  }

  public getExportUrl(): string {
    return `${this.baseUrl}/export`;
  }
}

export const careersApi = new CareersApiClient();
