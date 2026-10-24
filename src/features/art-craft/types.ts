export type ArtDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ArtExperiment {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  category: string; // 'Color Physics' | 'Photochemistry' | 'Paper Engineering & Origami' | 'Design Thinking' | 'Natural Pigments'
  gradeLevel: string; // e.g. 'Class 6th', 'Class 8th', 'Class 10th'
  difficulty: ArtDifficulty;
  duration: string;
  description: string;
  steamIntegration: string;
  realWorldApplication: string;
  tags: string[];
  thumbnail_url?: string;
  craftMaterials?: string[];
  safetyLevel?: string;
}

export type ArtSortOption =
  | 'popularity'
  | 'az'
  | 'za'
  | 'duration_asc'
  | 'diff_asc';

export interface ArtFilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedClass: string;
  selectedDifficulty: string;
  selectedSort: ArtSortOption;
}
