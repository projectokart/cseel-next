/**
 * EduNetwork Types
 */

export interface PartnerSchool {
  id: string;
  name: string;
  code: string;
  type: 'K-12' | 'Higher Ed' | 'ATL School' | 'Vocational' | 'Senior Secondary K-12' | 'Day School K-12' | 'Senior Secondary' | string;
  board: 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge' | string;
  city: string;
  state: string;
  pincode: string;
  studentCount: number;
  facultyCount: number;
  principalName: string;
  email: string;
  phone: string;
  labsEquipped: string[];
  status: 'verified' | 'pending' | 'pending_review' | 'suspended' | string;
  accreditationLevel: 'Tier 1 Lead' | 'Tier 2 Certified' | 'Associate Partner';
  joinedDate: string;
  created_at?: string;
  updated_at?: string;
}

export interface NetworkFilterState {
  searchQuery: string;
  selectedStates: string[];
  selectedBoards: string[];
  status: 'all' | 'verified' | 'pending';
  sortBy: 'name' | 'students' | 'newest';
}
