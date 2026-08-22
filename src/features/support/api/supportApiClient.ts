import { SupportTicket, SupportFilterState } from '../types';
import { SUPPORT_MODULE_CONFIG } from '../config/moduleConfig';

class SupportApiClient {
  private baseUrl = SUPPORT_MODULE_CONFIG.apiBaseUrl;

  public async fetchTickets(filter?: Partial<SupportFilterState>): Promise<{ items: SupportTicket[]; total: number }> {
    const params = new URLSearchParams();
    if (filter?.searchQuery) params.set('q', filter.searchQuery);
    if (filter?.status) params.set('status', filter.status);

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch support tickets');
    const json = await res.json();
    return { items: json.data || [], total: json.total || 0 };
  }

  public async createTicket(ticket: Partial<SupportTicket>): Promise<SupportTicket> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });
    if (!res.ok) throw new Error('Failed to open ticket');
    const json = await res.json();
    return json.data;
  }

  public async updateTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update ticket');
    const json = await res.json();
    return json.data;
  }

  public async deleteTicket(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete ticket');
    return true;
  }

  public getExportUrl(): string {
    return `${this.baseUrl}/export`;
  }
}

export const supportApi = new SupportApiClient();
