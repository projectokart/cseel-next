/**
 * Training & Programs Types
 */

export type TrainingFormat = 'Hands-on Bootcamp' | 'Online Masterclass' | 'Hybrid Certification' | 'ATL Lab Workshop' | string;
export type TrainingLevel = 'Foundational' | 'Intermediate' | 'Master Educator' | string;

export interface TrainingProgram {
  id: string;
  slug: string;
  title: string;
  category: 'Physics' | 'Chemistry' | 'Robotics & IoT' | 'NEP Pedagogy' | 'AI in Classroom' | string;
  format: TrainingFormat;
  level: TrainingLevel;
  durationHours: number;
  batchSize: number;
  enrolledCount: number;
  leadTrainer: string;
  trainerRole: string;
  certificationOffered: string;
  startDate: string;
  feeInr: number;
  curriculumSummary: string;
  learningOutcomes: string[];
  status: 'active' | 'upcoming' | 'completed' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface TrainingFilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedFormats: TrainingFormat[];
  status: 'all' | 'active' | 'upcoming';
  sortBy: 'startDate' | 'enrolled' | 'newest';
}
