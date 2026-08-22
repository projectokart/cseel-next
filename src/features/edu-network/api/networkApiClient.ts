import { PartnerSchool, NetworkFilterState } from '../types';
import { NETWORK_MODULE_CONFIG } from '../config/moduleConfig';

class NetworkApiClient {
  private baseUrl = NETWORK_MODULE_CONFIG.apiBaseUrl;

  public async fetchSchools(filter?: Partial<NetworkFilterState>): Promise<{ items: PartnerSchool[]; total: number; states: string[]; boards: string[] }> {
    const params = new URLSearchParams();
    if (filter?.searchQuery) params.set('q', filter.searchQuery);
    if (filter?.selectedStates && filter.selectedStates.length > 0) {
      params.set('states', filter.selectedStates.join(','));
    }
    if (filter?.selectedBoards && filter.selectedBoards.length > 0) {
      params.set('boards', filter.selectedBoards.join(','));
    }
    if (filter?.status) params.set('status', filter.status);
    if (filter?.sortBy) params.set('sortBy', filter.sortBy);

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch partner schools');
    const json = await res.json();
    return {
      items: json.data || [],
      total: json.total || 0,
      states: json.states || [],
      boards: json.boards || [],
    };
  }

  public async getSchoolById(id: string): Promise<PartnerSchool> {
    const res = await fetch(`${this.baseUrl}/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('School not found');
    const json = await res.json();
    return json.data;
  }

  public async createSchool(school: Partial<PartnerSchool>): Promise<PartnerSchool> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(school),
    });
    if (!res.ok) throw new Error('Failed to register school');
    const json = await res.json();
    return json.data;
  }

  public async updateSchool(id: string, updates: Partial<PartnerSchool>): Promise<PartnerSchool> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update school');
    const json = await res.json();
    return json.data;
  }

  public async deleteSchool(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete school');
    return true;
  }

  public async importSchools(items: any[]): Promise<number> {
    const res = await fetch(`${this.baseUrl}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error('Failed to import schools');
    const json = await res.json();
    return json.importedCount || 0;
  }

  public getExportUrl(): string {
    return `${this.baseUrl}/export`;
  }
}

export const networkApi = new NetworkApiClient();
