import { SupportTicket, SupportFilterState } from '../types';
import { departmentDb } from '@/lib/database/departmentDbAdapter';

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 't-1',
    ticketNumber: 'TKT-8901',
    subject: 'Borosilicate glassware calibration report request for CBSE inspection',
    category: 'Lab Equipment & Delivery',
    priority: 'High',
    status: 'in_progress',
    requesterName: 'Dr. Anita Sharma',
    requesterEmail: 'anita.chem@dpsrkp.edu.in',
    schoolOrOrgName: 'Delhi Public School R.K. Puram',
    assignedAgent: 'Support Desk Lead',
    description: 'We need ISO 3819 calibration certificates for the recent bulk shipment of 500ml volumetric flasks for upcoming CBSE lab affiliation review.',
    createdAt: '2026-08-20T11:30:00Z',
  },
  {
    id: 't-2',
    ticketNumber: 'TKT-8902',
    subject: 'Robotics Kit firmware upload error on ESP32 boards in ATL Lab',
    category: 'ATL Lab Setup',
    priority: 'Medium',
    status: 'open',
    requesterName: 'Prof. Ramesh Gupta',
    requesterEmail: 'rgupta@davsec15.edu.in',
    schoolOrOrgName: 'DAV Model School Sector 15',
    assignedAgent: 'Hardware Support',
    description: 'Students getting COM port baud rate timeout while uploading ultrasonic obstacle avoiding code on MacOS lab computers.',
    createdAt: '2026-08-21T09:15:00Z',
  },
];

class SupportRepository {
  private tickets: SupportTicket[] = [...INITIAL_TICKETS];

  public async getAll(filter?: Partial<SupportFilterState>): Promise<{ items: SupportTicket[]; total: number }> {
    const { data } = await departmentDb.query<SupportTicket>('support', 'tickets', this.tickets);
    let result = [...data];

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.ticketNumber.toLowerCase().includes(q) ||
          t.requesterName.toLowerCase().includes(q) ||
          (t.schoolOrOrgName && t.schoolOrOrgName.toLowerCase().includes(q))
      );
    }

    if (filter?.selectedCategories && filter.selectedCategories.length > 0) {
      result = result.filter((t) => filter.selectedCategories!.includes(t.category));
    }

    if (filter?.selectedPriorities && filter.selectedPriorities.length > 0) {
      result = result.filter((t) => filter.selectedPriorities!.includes(t.priority));
    }

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((t) => t.status === filter.status);
    }

    result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { items: result, total: result.length };
  }

  public async getById(id: string): Promise<SupportTicket | null> {
    const { data } = await departmentDb.query<SupportTicket>('support', 'tickets', this.tickets, {
      match: { id },
    });
    const found = data.find((t) => t.id === id || t.ticketNumber === id);
    return found ? { ...found } : null;
  }

  public async create(data: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>): Promise<SupportTicket> {
    const id = `t-${Date.now()}`;
    const ticketNumber = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: SupportTicket = {
      ...data,
      id,
      ticketNumber,
      status: data.status || 'open',
      createdAt: new Date().toISOString(),
    };

    await departmentDb.insert('support', 'tickets', newTicket);
    this.tickets.unshift(newTicket);
    return newTicket;
  }

  public async update(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | null> {
    await departmentDb.update('support', 'tickets', id, updates);

    const index = this.tickets.findIndex((t) => t.id === id || t.ticketNumber === id);
    if (index === -1) return null;
    const updated = { ...this.tickets[index], ...updates, updatedAt: new Date().toISOString() };
    this.tickets[index] = updated;
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    await departmentDb.delete('support', 'tickets', id);

    const index = this.tickets.findIndex((t) => t.id === id || t.ticketNumber === id);
    if (index === -1) return false;
    this.tickets.splice(index, 1);
    return true;
  }
}

export const supportRepository = new SupportRepository();
