/**
 * Events & Outreach Types
 */

export type EventType = 'National Symposium' | 'Webinar' | 'Science Hackathon' | 'Exhibition' | 'Panel Discussion' | string;

export type OutreachEvent = CseelEvent;

export interface CseelEvent {
  id: string;
  slug: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  venue: string;
  city: string;
  keynoteSpeakers: string[];
  registeredCount: number;
  capacity: number;
  bannerImage: string;
  agendaSummary: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'archived';
  isRegistrationOpen: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EventsFilterState {
  searchQuery: string;
  selectedTypes: EventType[];
  status: 'all' | 'upcoming' | 'completed';
  sortBy: 'date' | 'registered' | 'newest';
}
