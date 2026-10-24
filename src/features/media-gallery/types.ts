export type MediaType = 'photo' | 'video' | 'virtual_tour_360' | 'press_release';

export type GalleryCategory =
  | 'Composite Science Lab'
  | 'Atal Tinkering Lab (ATL)'
  | 'Experiential Math Studio'
  | 'Creative STEAM Studio'
  | 'Student Hackathons';

export interface MediaItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: MediaType;
  category: GalleryCategory;
  mediaUrl: string;
  thumbnailUrl: string;
  schoolName?: string;
  location?: string;
  date: string;
  tags: string[];
}

export interface GalleryFilterState {
  searchQuery: string;
  selectedType: string;
  selectedCategory: string;
}
