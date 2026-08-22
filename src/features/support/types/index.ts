/**
 * Support & Helpdesk Types
 */

export type TicketPriority = 'Critical / Emergency' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
export type TicketCategory = 'Lab Equipment & Delivery' | 'Curriculum & Pedagogy' | 'Platform & Student Login' | 'ATL Lab Setup' | 'Billing & Institutional PO';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  requesterName: string;
  requesterEmail: string;
  schoolOrOrgName?: string;
  assignedAgent?: string;
  description: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SupportFilterState {
  searchQuery: string;
  selectedCategories: TicketCategory[];
  selectedPriorities: TicketPriority[];
  status: 'all' | 'open' | 'in_progress' | 'resolved';
  sortBy: 'newest' | 'priority';
}
