import { CseelEvent, EventsFilterState, EventType } from '../types';
import { slugify } from '@/lib/utils';

export const INITIAL_EVENTS: CseelEvent[] = [
  {
    id: 'ev-1',
    slug: 'national-stem-principals-symposium-delhi',
    title: 'National STEM Principals & Academic Leaders Symposium',
    type: 'National Symposium',
    date: '2026-10-18',
    time: '09:30 AM - 05:00 PM IST',
    venue: 'Vigyan Bhawan / Hybrid',
    city: 'New Delhi',
    keynoteSpeakers: ['Dr. K. Sivan (Former ISRO Chairman)', 'Prof. Yashpal Pedagogy Panel'],
    registeredCount: 420,
    capacity: 500,
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    agendaSummary: 'Annual gathering of 500+ CBSE school principals to deliberate on institutional experiential learning models, AI-assisted lab grading, and NEP-2020 integration.',
    status: 'upcoming',
    isRegistrationOpen: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ev-2',
    slug: 'chandrayaan-beyond-planetary-science-bengaluru',
    title: 'Chandrayaan & Beyond: Space Science & Robotics Hackathon',
    type: 'Science Hackathon',
    date: '2026-11-08',
    time: '10:00 AM - 06:00 PM IST',
    venue: 'IISc Science Innovation Center',
    city: 'Bengaluru',
    keynoteSpeakers: ['Senior Flight Dynamics Engineers, ISRO'],
    registeredCount: 310,
    capacity: 350,
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
    agendaSummary: 'National student rover design hackathon where 70 school teams demonstrate autonomous lunar terrain navigation using Arduino & ultrasonic telemetry.',
    status: 'upcoming',
    isRegistrationOpen: true,
    created_at: new Date().toISOString(),
  },
];

class EventsRepository {
  private events: CseelEvent[] = [...INITIAL_EVENTS];

  public async getAll(filter?: Partial<EventsFilterState>): Promise<{ items: CseelEvent[]; total: number; types: string[] }> {
    let result = [...this.events];

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

    if (filter?.sortBy) {
      switch (filter.sortBy) {
        case 'registered':
          result.sort((a, b) => b.registeredCount - a.registeredCount);
          break;
        case 'date':
          result.sort((a, b) => a.date.localeCompare(b.date));
          break;
        default:
          result.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
          break;
      }
    }

    const types = Array.from(new Set(this.events.map((e) => e.type)));
    return { items: result, total: result.length, types };
  }

  public async getById(id: string): Promise<CseelEvent | null> {
    const found = this.events.find((e) => e.id === id || e.slug === id);
    return found ? { ...found } : null;
  }

  public async create(data: Omit<CseelEvent, 'id' | 'slug' | 'created_at' | 'updated_at'>): Promise<CseelEvent> {
    const id = `ev-${Date.now()}`;
    const slug = slugify(data.title) + `-${Date.now().toString().slice(-4)}`;

    const newEvent: CseelEvent = {
      ...data,
      id,
      slug,
      registeredCount: data.registeredCount || 0,
      isRegistrationOpen: data.isRegistrationOpen !== false,
      status: data.status || 'upcoming',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.events.unshift(newEvent);
    return newEvent;
  }

  public async update(id: string, updates: Partial<CseelEvent>): Promise<CseelEvent | null> {
    const index = this.events.findIndex((e) => e.id === id || e.slug === id);
    if (index === -1) return null;
    const updated = { ...this.events[index], ...updates, updated_at: new Date().toISOString() };
    this.events[index] = updated;
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    const index = this.events.findIndex((e) => e.id === id || e.slug === id);
    if (index === -1) return false;
    this.events.splice(index, 1);
    return true;
  }

  public async bulkInsert(items: Partial<CseelEvent>[]): Promise<CseelEvent[]> {
    const created: CseelEvent[] = [];
    for (const item of items) {
      if (!item.title || !item.date) continue;
      const ev = await this.create({
        title: item.title,
        type: item.type || 'National Symposium',
        date: item.date,
        time: item.time || '10:00 AM - 05:00 PM',
        venue: item.venue || 'Main Auditorium',
        city: item.city || 'New Delhi',
        keynoteSpeakers: item.keynoteSpeakers || ['Keynote Speaker'],
        registeredCount: 0,
        capacity: Number(item.capacity) || 300,
        bannerImage: item.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
        agendaSummary: item.agendaSummary || 'National STEM Symposium.',
        status: 'upcoming',
        isRegistrationOpen: true,
      });
      created.push(ev);
    }
    return created;
  }
}

export const eventsRepository = new EventsRepository();
