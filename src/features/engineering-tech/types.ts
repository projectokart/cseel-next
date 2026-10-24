export type TechDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface TechExperiment {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  category: string; // 'Robotics' | 'IoT & Microcontrollers' | 'Mechanical & Structural' | 'AI & Sensors' | 'Green Tech'
  gradeLevel: string; // e.g. 'Class 6th', 'Class 8th', 'Class 10th'
  difficulty: TechDifficulty;
  duration: string;
  description: string;
  engineeringPrinciple: string;
  realWorldApplication: string;
  tags: string[];
  thumbnail_url?: string;
  hardwareKit?: string[];
  safetyLevel?: string;
}

export type TechSortOption =
  | 'popularity'
  | 'az'
  | 'za'
  | 'duration_asc'
  | 'diff_asc';

export interface TechFilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedClass: string;
  selectedDifficulty: string;
  selectedSort: TechSortOption;
}
