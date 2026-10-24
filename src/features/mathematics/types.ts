export type MathDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface MathExperiment {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  category: string;
  gradeLevel: string; // e.g. 'Class 9th', 'Class 10th'
  difficulty: MathDifficulty;
  duration: string;
  description: string;
  mathematicalConcept: string;
  realWorldApplication: string;
  tags: string[];
  thumbnail_url?: string;
  formula?: string;
  graph?: {
    title: string;
    xLabel: string;
    yLabel: string;
    points: [string, number][];
  };
  interp?: [string, string][];
}

export type MathSortOption =
  | 'popularity'
  | 'az'
  | 'za'
  | 'duration_asc'
  | 'diff_asc';

export interface MathFilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedClass: string;
  selectedDifficulty: string;
  selectedSort: MathSortOption;
}
