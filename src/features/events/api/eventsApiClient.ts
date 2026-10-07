import { CseelEvent, EventsFilterState } from '../types';
import { EVENTS_MODULE_CONFIG } from '../config/moduleConfig';

class EventsApiClient {
  private baseUrl = EVENTS_MODULE_CONFIG.apiBaseUrl;

  public async fetchEvents(filter?: Partial<EventsFilterState>): Promise<{ items: CseelEvent[]; total: number; types: string[] }> {
    const params = new URLSearchParams();
    if (filter?.searchQuery) params.set('q', filter.searchQuery);
    if (filter?.selectedTypes && filter.selectedTypes.length > 0) {
      params.set('types', filter.selectedTypes.join(','));
    }
    if (filter?.status) params.set('status', filter.status);
    if (filter?.sortBy) params.set('sortBy', filter.sortBy);

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch events');
    const json = await res.json();
    return { items: json.data || [], total: json.total || 0, types: json.types || [] };
  }

  public async getEventById(id: string): Promise<CseelEvent> {
    const res = await fetch(`${this.baseUrl}/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Event not found');
    const json = await res.json();
    return json.data;
  }

  public async createEvent(ev: Partial<CseelEvent>): Promise<CseelEvent> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ev),
    });
    if (!res.ok) throw new Error('Failed to create event');
    const json = await res.json();
    return json.data;
  }

  public async updateEvent(id: string, updates: Partial<CseelEvent>): Promise<CseelEvent> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update event');
    const json = await res.json();
    return json.data;
  }

  public async deleteEvent(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete event');
    return true;
  }

  public async importEvents(items: any[]): Promise<number> {
    const res = await fetch(`${this.baseUrl}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error('Failed to import events');
    const json = await res.json();
    return json.importedCount || 0;
  }

  public getExportUrl(): string {
    return `${this.baseUrl}/export`;
  }
}

export const eventsApi = new EventsApiClient();
