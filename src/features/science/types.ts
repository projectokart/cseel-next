export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SafetyLevel = 'Safe for Home' | 'Adult Supervision' | 'Lab Environment Required';

export interface ScienceExperiment {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  subject: 'physics' | 'chemistry' | 'biology';
  category: string;
  gradeLevel: string; // e.g. 'Class 9th', 'Class 10th'
  difficulty: DifficultyLevel;
  duration: string; // e.g. '30 Mins'
  safetyLevel: SafetyLevel;
  description: string;
  scientificPrinciple: string;
  realWorldApplication: string;
  tags: string[];
  image?: string;
  thumbnail_url?: string;
  colorTheme: string;
  formula?: string;
  badge?: string;
  materials?: any[];
  steps?: any[];
  procedure?: any[];
  precautions?: string[];
  outcome?: string;
  obsCols?: string[];
  obsRows?: string[][];
  interp?: [string, string][];
  graph?: {
    title: string;
    xLabel: string;
    yLabel: string;
    points: [string, number][];
  };
}

export interface ScienceSubjectMetadata {
  slug: 'physics' | 'chemistry' | 'biology';
  name: string;
  tagline: string;
  accentColor: string;
  badgeColor: string;
  iconName: string;
  labType: string;
  description: string;
  popularConcepts: string[];
  activitiesCount: number;
}

export type ScienceSortOption =
  | 'popularity'
  | 'az'
  | 'za'
  | 'duration_asc'
  | 'duration_desc'
  | 'diff_asc';

export interface ScienceFilterState {
  searchQuery: string;
  selectedSubject: 'all' | 'physics' | 'chemistry' | 'biology';
  selectedClass: string;
  selectedDifficulty: string;
  selectedDuration: string;
  selectedSafety: string;
  selectedSort: ScienceSortOption;
}
