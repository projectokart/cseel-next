import { OutreachEvent, EventsFilterState } from '../types';
import { slugify } from '@/lib/utils';
import { departmentDb } from '@/lib/database/departmentDbAdapter';

export const INITIAL_EVENTS: OutreachEvent[] = [
  {
    id: 'evt-1',
    slug: 'national-stem-principals-symposium-delhi',
    title: 'National STEM Principals & Laboratory Leaders Symposium 2026',
    type: 'National Symposium',
    date: '2026-09-26',
    time: '09:30 AM - 05:00 PM IST',
    venue: 'India Habitat Centre, Lodhi Road',
    city: 'New Delhi',
    keynoteSpeakers: ['Dr. V. K. Saraswat (NITI Aayog)', 'Prof. H. C. Verma', 'Dr. Vikram Sharma (CSEEL)'],
    registeredCount: 210,
    capacity: 350,
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    agendaSummary: 'Keynote addresses on NEP 2020 laboratory infrastructure mandating experiential learning, composite lab safety standards, and CSR funding for rural school ATL labs.',
    status: 'upcoming',
    isRegistrationOpen: true,
  },
  {
    id: 'evt-2',
    slug: 'all-india-student-innovation-hackathon',
    title: 'All-India Inter-School STEM Innovation Fair & CAD Hackathon',
    type: 'Innovation Fair & Hackathon',
    date: '2026-10-18',
    time: '10:00 AM - 06:30 PM IST',
    venue: 'IISc Convention Complex',
    city: 'Bengaluru',
    keynoteSpeakers: ['ISRO Senior Scientist Team', 'ATL State Mission Directorate'],
    registeredCount: 480,
    capacity: 600,
    bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    agendaSummary: 'Live project demos across 4 tracks: Smart Agriculture & Sensors, Clean Energy, Biomedical Assistive Devices, and Space Tech.',
    status: 'upcoming',
    isRegistrationOpen: true,
  },
];

class EventsRepository {
  private events: OutreachEvent[] = [...INITIAL_EVENTS];

  public async getAll(filter?: Partial<EventsFilterState>): Promise<{ items: OutreachEvent[]; total: number; types: string[] }> {
    const { data } = await departmentDb.query<OutreachEvent>('events', 'symposia', this.events);
    let result = [...data];

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.keynoteSpeakers.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filter?.selectedTypes && filter.selectedTypes.length > 0) {
      result = result.filter((e) => filter.selectedTypes!.includes(e.type));
    }

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((e) => e.status === filter.status);
    }

    const types = Array.from(new Set(this.events.map((e) => e.type)));

    return { items: result, total: result.length, types };
  }

  public async getById(id: string): Promise<OutreachEvent | null> {
    const { data } = await departmentDb.query<OutreachEvent>('events', 'symposia', this.events, {
      match: { id },
    });
    const found = data.find((e) => e.id === id || e.slug === id);
    return found ? { ...found } : null;
  }

  public async create(eventData: Omit<OutreachEvent, 'id' | 'slug' | 'registeredCount'>): Promise<OutreachEvent> {
    const id = `evt-${Date.now()}`;
    const slug = slugify(eventData.title);

    const newEvent: OutreachEvent = {
      ...eventData,
      id,
      slug,
      registeredCount: 0,
      isRegistrationOpen: eventData.isRegistrationOpen ?? true,
    };

    await departmentDb.insert('events', 'symposia', newEvent);
    this.events.unshift(newEvent);
    return newEvent;
  }

  public async update(id: string, updates: Partial<OutreachEvent>): Promise<OutreachEvent | null> {
    await departmentDb.update('events', 'symposia', id, updates);

    const index = this.events.findIndex((e) => e.id === id || e.slug === id);
    if (index === -1) return null;
    const updated = { ...this.events[index], ...updates };
    this.events[index] = updated;
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    await departmentDb.delete('events', 'symposia', id);

    const index = this.events.findIndex((e) => e.id === id || e.slug === id);
    if (index === -1) return false;
    this.events.splice(index, 1);
    return true;
  }

  public async bulkInsert(items: Partial<OutreachEvent>[]): Promise<OutreachEvent[]> {
    const created: OutreachEvent[] = [];
    for (const item of items) {
      if (item.title) {
        const c = await this.create({
          title: item.title,
          type: item.type || 'National Symposium',
          date: item.date || new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10),
          time: item.time || '10:00 AM - 05:00 PM',
          venue: item.venue || 'Virtual Auditorium',
          city: item.city || 'Online',
          keynoteSpeakers: item.keynoteSpeakers || ['CSEEL Advisory Board'],
          capacity: item.capacity || 300,
          bannerImage: item.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
          agendaSummary: item.agendaSummary || item.title,
          status: item.status || 'upcoming',
          isRegistrationOpen: item.isRegistrationOpen ?? true,
        });
        created.push(c);
      }
    }
    return created;
  }
}

export const eventsRepository = new EventsRepository();
