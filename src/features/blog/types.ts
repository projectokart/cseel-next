export type BlogCategory =
  | 'Pedagogy & NEP 2020'
  | 'Science & Experiments'
  | 'Atal Tinkering Labs (ATL)'
  | 'Mathematics in Practice'
  | 'EdTech & Future Skills'
  | 'School Leadership';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  category: BlogCategory;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  publishedAt: string; // ISO date or formatted
  readTimeMinutes: number;
  coverImage: string;
  tags: string[];
  isFeatured?: boolean;
}

export type BlogSortOption = 'newest' | 'oldest' | 'popular' | 'read_time';

export interface BlogFilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedTag: string;
  selectedSort: BlogSortOption;
}
