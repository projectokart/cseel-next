import { TrainingProgram, TrainingFilterState } from '../types';
import { TRAINING_MODULE_CONFIG } from '../config/moduleConfig';

class TrainingApiClient {
  private baseUrl = TRAINING_MODULE_CONFIG.apiBaseUrl;

  public async fetchPrograms(filter?: Partial<TrainingFilterState>): Promise<{ items: TrainingProgram[]; total: number; categories: string[] }> {
    const params = new URLSearchParams();
    if (filter?.searchQuery) params.set('q', filter.searchQuery);
    if (filter?.selectedCategories && filter.selectedCategories.length > 0) {
      params.set('categories', filter.selectedCategories.join(','));
    }
    if (filter?.selectedFormats && filter.selectedFormats.length > 0) {
      params.set('formats', filter.selectedFormats.join(','));
    }
    if (filter?.status) params.set('status', filter.status);
    if (filter?.sortBy) params.set('sortBy', filter.sortBy);

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch training programs');
    const json = await res.json();
    return { items: json.data || [], total: json.total || 0, categories: json.categories || [] };
  }

  public async getProgramById(id: string): Promise<TrainingProgram> {
    const res = await fetch(`${this.baseUrl}/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Program not found');
    const json = await res.json();
    return json.data;
  }

  public async createProgram(prog: Partial<TrainingProgram>): Promise<TrainingProgram> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prog),
    });
    if (!res.ok) throw new Error('Failed to create training program');
    const json = await res.json();
    return json.data;
  }

  public async updateProgram(id: string, updates: Partial<TrainingProgram>): Promise<TrainingProgram> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update training program');
    const json = await res.json();
    return json.data;
  }

  public async deleteProgram(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete training program');
    return true;
  }

  public async importPrograms(items: any[]): Promise<number> {
    const res = await fetch(`${this.baseUrl}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error('Failed to import programs');
    const json = await res.json();
    return json.importedCount || 0;
  }

  public getExportUrl(): string {
    return `${this.baseUrl}/export`;
  }
}

export const trainingApi = new TrainingApiClient();
